import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown,
  Info, Loader2, RefreshCcw, Search, UserPlus, Receipt,
} from 'lucide-react';
import { generateInvoicePdf, invoiceNumber } from '@/lib/invoicePdf';
import { buildParticulars } from '@/lib/invoiceParticulars';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ExportMenu from '@/components/ExportMenu';
import DateRangeFilter, { isWithinRange, type DateRange } from '@/components/DateRangeFilter';
import ClientDetailsDialog from '@/components/clients/ClientDetailsDialog';
import AssignServiceDialog from '@/components/leads/AssignServiceDialog';
import AddClientDialog from '@/components/leads/AddClientDialog';
import { STAGE_LABELS, STAGE_STYLES } from '@/data/services';
import { TEMPERATURE_LABELS, TEMPERATURE_STYLES } from '@/data/leadTemperature';
import { TASK_STATUS_LABELS, TASK_STATUS_STYLES } from '@/data/clientStatus';
import { useClients, type Client, type ClientService } from '@/hooks/useClients';
import { useLead, type LeadService } from '@/hooks/useLeads';
import type { SheetColumn } from '@/lib/sheet';

/* ── Helpers ────────────────────────────────────────────────────────────────── */

const makeInitials = (name: string) => {
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map((p) => p[0]).join('').toUpperCase();
  return initials || 'CL';
};

const formatDate = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * Rebuilds the lead's own service subdocument from the clients rollup, so the
 * assign dialog gets everything it needs — including the checklist already
 * ticked off, which a reassign must not silently discard. The ids line up
 * because both boards read the same record.
 */
const toLeadService = (service: ClientService): LeadService => ({
  _id: service._id,
  title: service.title,
  slug: service.slug,
  category: service.category,
  stage: service.stage,
  temperature: service.temperature,
  startAt: service.startAt ?? undefined,
  dueAt: service.dueAt ?? undefined,
  assignedAt: service.assignedAt ?? undefined,
  notes: service.notes,
  assignedTo: service.assignedTo
    ? { _id: service.assignedTo._id, name: service.assignedTo.name, email: service.assignedTo.email }
    : null,
  taskId: service.taskId
    ? {
        _id: service.taskId,
        title: service.title,
        status: service.taskStatus,
        dueAt: service.dueAt ?? undefined,
        serviceRequest: {
          stage: service.stage,
          steps: service.steps.map((step) => ({
            _id: step._id,
            title: step.title,
            description: step.description,
            order: step.order,
            done: step.done,
            completedAt: step.completedAt ?? undefined,
          })),
        },
      }
    : null,
});

/* ── Spreadsheet columns ────────────────────────────────────────────────────── */

const CLIENT_COLUMNS = [
  { key: 'clientId',  header: 'Client ID',     value: (c: Client) => c.clientId },
  { key: 'name',      header: 'Client',        value: (c: Client) => c.name },
  { key: 'company',   header: 'Business',      value: (c: Client) => c.company },
  { key: 'phone',     header: 'Phone',         value: (c: Client) => c.phone },
  { key: 'email',     header: 'Email',         value: (c: Client) => c.email },
  { key: 'city',      header: 'City',          value: (c: Client) => c.city },
  { key: 'services',  header: 'Services',      value: (c: Client) => c.services.map((s) => s.title).join(', ') },
  { key: 'assigned',  header: 'Handled By',    value: (c: Client) => c.assignedTo.join(', ') },
  { key: 'progress',  header: 'Progress',      value: (c: Client) => `${c.progress}%` },
  { key: 'deadline',  header: 'Next Deadline', value: (c: Client) => formatDate(c.nextDeadline) },
] as const satisfies ReadonlyArray<SheetColumn<Client> & { key: string }>;

/* ── Small components ───────────────────────────────────────────────────────── */

/**
 * Whether a client is actually finished with us: the work has to be done AND
 * paid for. Work finished with money still outstanding is the case worth
 * flagging — it looks complete everywhere else on the board.
 */
function completionState(services: ClientService[], advance: number) {
  const withWork = services.filter((service) => service.steps.length > 0 || service.taskId);
  if (withWork.length === 0) return null;

  const workDone = withWork.every(
    (service) => service.taskStatus === 'completed' || service.stage === 'completed'
  );
  if (!workDone) return null;

  const quoted = services.reduce((sum, service) => sum + (service.quotation ?? 0), 0);
  const received = services.reduce((sum, service) => sum + service.paid, 0) + advance;

  return received >= quoted ? 'completed' : 'payment_pending';
}

function CompletionBadge({ state }: { state: 'completed' | 'payment_pending' }) {
  return state === 'completed' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
      <CheckCircle2 className="w-3 h-3" />
      Completed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
      Payment Pending
    </span>
  );
}

/**
 * Where a service's checklist has got to: the last step actually ticked off,
 * marked completed. It moves down the list on its own as the employee works —
 * a service with nothing ticked reads as not started, and one with everything
 * ticked names its final step.
 */
function StepStatus({ service }: { service: ClientService }) {
  const ordered = [...service.steps].sort((a, b) => a.order - b.order);
  const lastDone = [...ordered].reverse().find((step) => step.done);
  const next = ordered.find((step) => !step.done);

  if (ordered.length === 0) {
    return <span className="text-xs text-muted-foreground">No checklist</span>;
  }

  if (!lastDone) {
    return (
      <div className="min-w-0">
        <span className="block text-xs text-muted-foreground">Not started</span>
        {next && (
          <span className="block text-[10px] text-muted-foreground truncate" title={next.title}>
            Next: {next.title}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <span className="flex items-center gap-1.5 text-xs text-foreground min-w-0">
        <span className="truncate" title={lastDone.title}>{lastDone.title}</span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          Completed
        </span>
      </span>
      <span className="block text-[10px] text-muted-foreground truncate" title={next?.title}>
        {next ? `Next: ${next.title}` : `All ${ordered.length} steps done`}
      </span>
    </div>
  );
}

/** The per-service controls: assign/reassign and the invoice. */
function ServiceActions({ service, onAssign, onInvoice, invoicing, compact = false }: {
  service: ClientService;
  onAssign: () => void;
  onInvoice: () => void;
  invoicing: boolean;
  compact?: boolean;
}) {
  const assigned = Boolean(service.assignedTo);

  return (
    <div className="flex items-center gap-1.5 justify-end">
      <Button
        size="sm"
        variant={assigned ? 'outline' : 'default'}
        onClick={onAssign}
        className={compact ? 'h-7 px-2 text-[11px]' : ''}
      >
        {assigned
          ? <><CheckCircle2 className="w-3.5 h-3.5" />Reassign</>
          : <><UserPlus className="w-3.5 h-3.5" />Assign</>}
      </Button>
      <button
        type="button"
        onClick={onInvoice}
        disabled={invoicing}
        title={`Generate invoice for "${service.title}"`}
        aria-label={`Generate invoice for ${service.title}`}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
      >
        {invoicing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
      </button>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

type SortKey = 'clientId' | 'name' | 'company' | 'city' | 'progress' | 'totalServices' | null;
type SortDir = 'asc' | 'desc';

const ClientsPage = () => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [detailsClient, setDetailsClient] = useState<Client | null>(null);
  const [invoicing, setInvoicing] = useState<string | null>(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  useEffect(() => {
    const openModal = () => setAddClientOpen(true);
    window.addEventListener('openAddClientModal', openModal);
    return () => window.removeEventListener('openAddClientModal', openModal);
  }, []);

  // Assigning needs the full lead record — the same record this row came from.
  const [assignTarget, setAssignTarget] = useState<{ leadId: string; service: LeadService } | null>(null);
  const { data: assignLead } = useLead(assignTarget?.leadId);

  const { data: clients = [], isLoading, isError, error, refetch } = useClients();

  const kpis = useMemo(() => {
    const services = clients.flatMap((c) => c.services);
    const assigned = services.filter((s) => s.assignedTo);

    return {
      clients: clients.length,
      services: services.length,
      unassigned: services.length - assigned.length,
      inProgress: assigned.filter((s) => s.taskStatus === 'in_progress').length,
      completed: services.filter((s) => s.taskStatus === 'completed' || s.stage === 'completed').length,
    };
  }, [clients]);

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    let list = clients.filter((c) => {
      const matchQ =
        !q
        || c.name.toLowerCase().includes(q)
        || c.company.toLowerCase().includes(q)
        || c.phone.includes(q)
        || c.city.toLowerCase().includes(q)
        || c.clientId.toLowerCase().includes(q)
        || c.services.some((s) => s.title.toLowerCase().includes(q));

      // Onboarded inside the dates picked on the calendar.
      return matchQ && isWithinRange(c.createdAt, dateRange);
    });

    if (sortKey) {
      list = [...list].sort((a, b) => {
        const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [clients, query, dateRange, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pagedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [query, dateRange, sortKey, sortDir]);

  const handleSort = (key: NonNullable<SortKey>) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleRow = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const openAssign = (client: Client, service: ClientService) =>
    setAssignTarget({ leadId: client.leadId, service: toLeadService(service) });

  const handleInvoice = async (client: Client, service: ClientService) => {
    setInvoicing(service._id);
    try {
      // The Particulars are the fields agreed when the lead was confirmed.
      const particulars = buildParticulars(service);

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const invoiceDate = `${pad(now.getDate())}-${months[now.getMonth()]}-${String(now.getFullYear()).slice(2)}`;
      // Financial-year form, e.g. "26-27/025" — see lib/invoicePdf.
      const reference = invoiceNumber(client.clientId, now);

      const addr = [client.address, client.city].filter(Boolean).join(', ');

      await generateInvoicePdf({
        invoiceNumber: reference,
        invoiceDate,
        consigneeName: client.company || client.name,
        consigneeAddress: addr,
        consigneeState: client.state || 'Maharashtra',
        consigneeCode: '27',
        buyerName: client.company || client.name,
        buyerAddress: addr,
        buyerState: client.state || 'Maharashtra',
        buyerCode: '27',
        particulars,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not generate invoice.');
    } finally {
      setInvoicing(null);
    }
  };

  const SortIcon = ({ colKey }: { colKey: NonNullable<SortKey> }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/50 ml-1 shrink-0" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-primary ml-1 shrink-0" />
      : <ChevronDown className="w-3 h-3 text-primary ml-1 shrink-0" />;
  };

  const thBase =
    'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap select-none';
  const thSort = `${thBase} cursor-pointer hover:text-foreground transition-colors`;

  return (
    <div className="space-y-5">
      {/* ── KPIs ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Clients',        value: kpis.clients,              tone: 'text-foreground'  },
          { label: 'Services',       value: kpis.services,             tone: 'text-blue-700'    },
          { label: 'Unassigned',     value: kpis.unassigned,           tone: 'text-orange-600'  },
          { label: 'In Progress',    value: kpis.inProgress,           tone: 'text-sky-700'     },
          { label: 'Completed',      value: kpis.completed,            tone: 'text-emerald-700' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-lg px-4 py-3 hover:shadow-sm transition-shadow">
            <span className={`block text-[10px] font-semibold leading-tight ${kpi.tone}`}>{kpi.label}</span>
            <span className="block text-2xl font-bold text-foreground leading-none mt-1">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients by name, business, phone, service…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Narrows the board to the clients onboarded between two dates. */}
        <DateRangeFilter value={dateRange} onChange={setDateRange} label="Filter by onboarding date" />

        <div className="ml-auto">
          <ExportMenu rows={rows} columns={[...CLIENT_COLUMNS]} baseName="clients" />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className={thBase} style={{ width: 40 }} />
                <th className={thSort} onClick={() => handleSort('clientId')}>
                  <span className="flex items-center">Client ID <SortIcon colKey="clientId" /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('name')}>
                  <span className="flex items-center">Client <SortIcon colKey="name" /></span>
                </th>
                <th className={thBase} style={{ minWidth: 190 }}>Service</th>
                <th className={thBase} style={{ minWidth: 190 }}>Status</th>
                <th className={thBase}>Assigned To</th>
                <th className={`${thBase} text-right`} style={{ minWidth: 190 }}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading clients…
                </td></tr>
              ) : isError ? (
                <tr><td colSpan={7} className="text-center py-16">
                  <p className="text-sm text-destructive mb-3">
                    {error instanceof Error ? error.message : 'Failed to load clients.'}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCcw className="w-4 h-4" />Retry
                  </Button>
                </td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">
                  {clients.length === 0
                    ? 'No clients yet. Capture a lead and it will appear here, ready to assign.'
                    : `No clients found matching "${query}".`}
                </td></tr>
              ) : (
                pagedRows.map((client) => {
                  const multi = client.services.length > 1;
                  const isOpen = expanded.has(client._id);
                  // With one service everything fits on the row; with several,
                  // the row summarises and the dropdown carries the detail.
                  const single = client.services.length === 1 ? client.services[0] : null;
                  const state = completionState(client.services, client.advancePayment?.amount ?? 0);

                  return [
                    <tr key={client._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-2 py-3 text-center">
                        {multi && (
                          <button
                            type="button"
                            onClick={() => toggleRow(client._id)}
                            title={isOpen ? 'Hide services' : `Show all ${client.services.length} services`}
                            aria-expanded={isOpen}
                            aria-label={`${isOpen ? 'Hide' : 'Show'} services for ${client.name}`}
                            className="inline-flex items-center justify-center w-6 h-6 rounded border border-border bg-card text-muted-foreground hover:bg-muted transition-colors"
                          >
                            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground text-xs font-medium whitespace-nowrap">
                        {client.clientId}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {makeInitials(client.name)}
                          </div>
                          <div className="min-w-0">
                            <span className="block font-semibold text-foreground truncate">{client.name}</span>
                            {client.company && (
                              <span className="block text-[11px] text-blue-600 truncate">{client.company}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {single ? (
                        <>
                          <td className="px-4 py-3" style={{ minWidth: 190, maxWidth: 220 }}>
                            <div style={{ maxWidth: 220 }}>
                              <span title={single.title} className="block text-sm text-foreground truncate">
                                {single.title}
                              </span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium mt-0.5 ${
                                TASK_STATUS_STYLES[single.taskStatus]?.bg} ${TASK_STATUS_STYLES[single.taskStatus]?.text}`}>
                                {TASK_STATUS_LABELS[single.taskStatus] ?? single.taskStatus}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3" style={{ minWidth: 190, maxWidth: 230 }}>
                            <StepStatus service={single} />
                          </td>
                          <td className="px-4 py-3 text-foreground text-xs">
                            <div className="flex flex-col gap-1 items-start">
                              <span>
                                {single.assignedTo?.name ?? <span className="text-muted-foreground">Unassigned</span>}
                              </span>
                              {state && <CompletionBadge state={state} />}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 justify-end">
                              <ServiceActions
                                service={single}
                                onAssign={() => openAssign(client, single)}
                                onInvoice={() => handleInvoice(client, single)}
                                invoicing={invoicing === single._id}
                              />
                              <button
                                onClick={() => setDetailsClient(client)}
                                title="View in-depth details"
                                aria-label={`View details for ${client.name}`}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shrink-0"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3" style={{ minWidth: 190 }}>
                            {client.services.length === 0 ? (
                              <span className="text-muted-foreground text-xs">No services yet</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => toggleRow(client._id)}
                                className="text-sm text-foreground hover:text-blue-700 transition-colors text-left"
                              >
                                <span className="font-medium">{client.services.length} services</span>
                                <span className="block text-[10px] text-muted-foreground">
                                  {client.assignedServices} assigned · {client.unassignedServices} pending
                                </span>
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground" style={{ minWidth: 190 }}>
                            {client.completedServices > 0
                              ? `${client.completedServices} of ${client.services.length} completed`
                              : 'Expand to see each step'}
                          </td>
                          {/* Who is doing what is per service — it belongs in the
                              dropdown, not smeared across one line out here. */}
                          <td className="px-4 py-3 text-foreground text-xs max-w-[160px]">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="text-muted-foreground">
                                {client.assignedServices} of {client.services.length} assigned
                              </span>
                              {state && <CompletionBadge state={state} />}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => setDetailsClient(client)}
                                title="View in-depth details"
                                aria-label={`View details for ${client.name}`}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>,

                    /* ── Expanded: one line per service ──────────────────── */
                    multi && isOpen ? (
                      <tr key={`${client._id}-services`} className="bg-muted/20">
                        <td />
                        <td colSpan={6} className="px-4 py-3">
                          <div className="space-y-2">
                            {client.services.map((service) => {
                              const stageStyle = STAGE_STYLES[service.stage] ?? STAGE_STYLES.documents_pending;
                              const statusStyle = TASK_STATUS_STYLES[service.taskStatus] ?? TASK_STATUS_STYLES.pending;
                              const tempStyle = TEMPERATURE_STYLES[service.temperature];

                              return (
                                <div
                                  key={service._id}
                                  className="rounded-lg border border-border bg-card px-3.5 py-3 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto] gap-3 items-center"
                                >
                                  <div className="min-w-0">
                                    <span className="block text-sm font-semibold text-foreground truncate" title={service.title}>
                                      {service.title}
                                    </span>
                                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${tempStyle.bg} ${tempStyle.text}`}>
                                        {TEMPERATURE_LABELS[service.temperature]}
                                      </span>
                                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${stageStyle.bg} ${stageStyle.text}`}>
                                        {STAGE_LABELS[service.stage] ?? service.stage}
                                      </span>
                                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                        {TASK_STATUS_LABELS[service.taskStatus] ?? service.taskStatus}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="min-w-0">
                                    <StepStatus service={service} />
                                    <span className="block text-[10px] text-muted-foreground mt-1">
                                      {service.stepsTotal > 0
                                        ? `${service.stepsDone}/${service.stepsTotal} steps`
                                        : 'No checklist'}
                                      {service.dueAt ? ` · due ${formatDate(service.dueAt)}` : ''}
                                    </span>
                                  </div>

                                  <div className="min-w-0">
                                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                                      Assigned to
                                    </span>
                                    <span className="block text-xs text-foreground truncate">
                                      {service.assignedTo?.name ?? 'Unassigned'}
                                    </span>
                                  </div>

                                  <ServiceActions
                                    service={service}
                                    onAssign={() => openAssign(client, service)}
                                    onInvoice={() => handleInvoice(client, service)}
                                    invoicing={invoicing === service._id}
                                    compact
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ) : null,
                  ];
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Showing {rows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, rows.length)} of {rows.length} clients
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-7 w-7 flex items-center justify-center rounded border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-muted-foreground px-2">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-7 w-7 flex items-center justify-center rounded border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── In-depth details ("i") ─────────────────────────────────────────── */}
      <ClientDetailsDialog
        client={detailsClient}
        open={Boolean(detailsClient)}
        onOpenChange={(open) => !open && setDetailsClient(null)}
      />

      <AddClientDialog open={addClientOpen} onOpenChange={setAddClientOpen} />

      {/* ── Assign a service to an employee ────────────────────────────────── */}
      <AssignServiceDialog
        lead={assignLead ?? null}
        service={assignTarget?.service ?? null}
        open={Boolean(assignTarget)}
        onOpenChange={(open) => !open && setAssignTarget(null)}
      />
    </div>
  );
};

export default ClientsPage;
