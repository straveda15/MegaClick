import { useEffect, useMemo, useState } from 'react';
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown, Info, Loader2, RefreshCcw, Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ExportMenu from '@/components/ExportMenu';
import ImportSheetDialog from '@/components/ImportSheetDialog';
import AddLeadDialog from '@/components/leads/AddLeadDialog';
import LeadDetailsDialog from '@/components/leads/LeadDetailsDialog';
import type { SheetColumn } from '@/lib/sheet';
import { STAGE_LABELS, SERVICE_STAGES, type ServiceStage } from '@/data/services';
import { TEMPERATURE_LABELS } from '@/data/leadTemperature';
import { SOURCE_STYLES, sourceLabel } from '@/data/leadSource';
import {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  LEAD_TEMPERATURES,
  useImportLeads,
  useLeads,
  type LeadImportRow,
  type LeadPriority,
  type LeadService,
  type LeadStatus,
  type LeadTemperature,
  type SalesLead,
} from '@/hooks/useLeads';
import { useTeam } from '@/hooks/useTeam';

/* ── Display constants ──────────────────────────────────────────────────────── */

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New', CONTACTED: 'Contacted', FOLLOW_UP: 'Follow Up',
  CONVERTED: 'Converted', DROPPED: 'Dropped',
};

const PRIORITY_LABELS: Record<LeadPriority, string> = {
  LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent',
};

/**
 * The Services column is deliberately fixed rather than fluid: a client with
 * six services would otherwise stretch the row and push Follow Up and Source
 * out of view. Past this width the list simply clips with an ellipsis.
 */
const SERVICES_COL_WIDTH = 240;

/* ── Helpers ────────────────────────────────────────────────────────────────── */

const formatDateInput = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const formatDate = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : formatDateInput(d);
};

const makeInitials = (name: string) => {
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map((p) => p[0]).join('').toUpperCase();
  return initials || 'LD';
};

/* ── Row projection ─────────────────────────────────────────────────────────── */

interface LeadRow {
  id: string;
  leadId: string;
  client: string;
  clientInitials: string;
  phone: string;
  email: string;
  company: string;
  city: string;
  services: LeadService[];
  serviceNames: string;
  assignedCount: number;
  followUp: string;
  /** Unformatted, for date comparisons the display string cannot do. */
  followUpAtRaw?: string;
  followUpNote: string;
  deadline: string;
  temperature: LeadTemperature;
  priority: LeadPriority;
  status: LeadStatus;
  /** The raw channel; the board shows `sourceLabel(source)`. */
  source: string;
  /** Kept for the spreadsheet export, which still ships one stage per lead. */
  stage: ServiceStage;
}

/**
 * The lead's deadline is the soonest date any of its services is due; a lead
 * with nothing assigned yet falls back to the target date captured up front.
 * Not a column any more, but still exported to spreadsheets.
 */
const leadDeadline = (lead: SalesLead) => {
  const dates = (lead.services ?? [])
    .map((service) => service.dueAt)
    .filter(Boolean) as string[];

  const soonest = dates.sort((a, b) => Number(new Date(a)) - Number(new Date(b)))[0];
  return formatDate(soonest) || formatDate(lead.taskId?.dueAt);
};

const toRow = (lead: SalesLead): LeadRow => {
  // Bulk-imported leads can arrive with only a phone number — fall back to it
  // so the row stays identifiable.
  const client = lead.customer?.name?.trim() || lead.customer?.phone || 'Unnamed lead';
  const services = lead.services ?? [];

  return {
    id: lead._id,
    leadId: `LD-${lead._id.slice(-5).toUpperCase()}`,
    client,
    clientInitials: makeInitials(client),
    phone: lead.customer?.phone ?? '',
    email: lead.customer?.email ?? '',
    company: lead.customer?.company ?? '',
    city: lead.customer?.city ?? '',
    services,
    serviceNames: services.map((s) => s.title).join(', '),
    assignedCount: services.filter((s) => s.assignedTo?._id).length,
    followUp: formatDate(lead.followUpAt),
    followUpAtRaw: lead.followUpAt,
    followUpNote: lead.followUpNote ?? '',
    deadline: leadDeadline(lead),
    temperature: lead.temperature ?? 'WARM',
    priority: lead.priority ?? 'MEDIUM',
    status: lead.status,
    source: lead.source ?? '',
    stage: lead.serviceStage ?? 'documents_pending',
  };
};

/* ── Spreadsheet columns — shared by import and export ───────────────────────── */

const LEAD_COLUMNS = [
  { key: 'name',            header: 'Client',            required: true, aliases: ['client name', 'lead name', 'customer', 'customer name', 'name'], value: (r: LeadRow) => r.client },
  { key: 'phone',           header: 'Phone',             required: true, aliases: ['mobile', 'mobile no', 'contact', 'phone no'],                     value: (r: LeadRow) => r.phone },
  { key: 'productInterest', header: 'Services',          aliases: ['service', 'interested service', 'service name', 'interest', 'requirement'],       value: (r: LeadRow) => r.serviceNames },
  { key: 'email',           header: 'Email',             aliases: ['e-mail', 'email address'],                                                        value: (r: LeadRow) => r.email },
  { key: 'company',         header: 'Company',           aliases: ['organisation', 'organization', 'firm'],                                           value: (r: LeadRow) => r.company },
  { key: 'city',            header: 'City',              aliases: ['location'],                                                                       value: (r: LeadRow) => r.city },
  { key: 'serviceCategory', header: 'Category',          aliases: ['service category'],                                                               value: (r: LeadRow) => r.services[0]?.category ?? '' },
  { key: 'serviceStage',    header: 'Stage',             aliases: ['current stage'],                                                                  value: (r: LeadRow) => r.stage },
  { key: 'temperature',     header: 'Status',            aliases: ['lead status', 'temperature', 'hot warm cold'],                                     value: (r: LeadRow) => TEMPERATURE_LABELS[r.temperature] },
  { key: 'priority',        header: 'Priority',          aliases: ['urgency'],                                                                        value: (r: LeadRow) => PRIORITY_LABELS[r.priority] },
  { key: 'status',          header: 'Pipeline',          aliases: ['pipeline status'],                                                                value: (r: LeadRow) => STATUS_LABELS[r.status] },
  { key: 'followUpAt',      header: 'Follow Up',         aliases: ['follow up', 'followup', 'follow up date', 'next follow up'],                       value: (r: LeadRow) => r.followUp },
  { key: 'followUpNote',    header: 'Follow Up Note',    aliases: ['follow up note', 'followup note', 'remark', 'remarks'],                            value: (r: LeadRow) => r.followUpNote },
  // Export-only: the soonest service target date, which the board no longer
  // shows as its own column.
  { key: 'targetDate',      header: 'Deadline',          aliases: ['due date', 'target date'],                                                        value: (r: LeadRow) => r.deadline },
  { key: 'assignedToName',  header: 'Assigned To',       aliases: ['assignee', 'employee', 'owner'],                                                  value: (r: LeadRow) => r.services.map((s) => s.assignedTo?.name).filter(Boolean).join(', ') },
  { key: 'source',          header: 'Source',            aliases: ['lead source'],                                                                    value: (r: LeadRow) => sourceLabel(r.source) },
] as const satisfies ReadonlyArray<SheetColumn<LeadRow> & { key: string }>;

type LeadColumnKey = (typeof LEAD_COLUMNS)[number]['key'];

/** Accepts either the stored key or the label a client sees in the table. */
const parseStage = (value: string): ServiceStage | undefined => {
  const normalized = value.trim().toLowerCase().replace(/[^a-z]/g, '_');
  if ((SERVICE_STAGES as readonly string[]).includes(normalized)) return normalized as ServiceStage;
  return SERVICE_STAGES.find((s) => STAGE_LABELS[s].toLowerCase() === value.trim().toLowerCase());
};

const parseStatus = (value: string): LeadStatus | undefined => {
  const normalized = value.trim().toUpperCase().replace(/[^A-Z]/g, '_');
  if ((LEAD_STATUSES as readonly string[]).includes(normalized)) return normalized as LeadStatus;
  return LEAD_STATUSES.find((s) => STATUS_LABELS[s].toLowerCase() === value.trim().toLowerCase());
};

const parsePriority = (value: string): LeadPriority | undefined => {
  const normalized = value.trim().toUpperCase();
  return (LEAD_PRIORITIES as readonly string[]).includes(normalized) ? (normalized as LeadPriority) : undefined;
};

const parseTemperature = (value: string): LeadTemperature | undefined => {
  const normalized = value.trim().toUpperCase();
  return (LEAD_TEMPERATURES as readonly string[]).includes(normalized)
    ? (normalized as LeadTemperature)
    : undefined;
};

/** A sheet cell can list several services — split it back into an array. */
const parseServices = (value?: string) =>
  String(value ?? '')
    .split(/[,;|]/)
    .map((title) => title.trim())
    .filter(Boolean)
    .map((title) => ({ title }));

/* ── Small controls ─────────────────────────────────────────────────────────── */

type SortKey = keyof LeadRow | null;
type SortDir = 'asc' | 'desc';

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/40 ml-1 shrink-0" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-primary ml-1 shrink-0" />
    : <ChevronDown className="w-3 h-3 text-primary ml-1 shrink-0" />;
}

function FilterSelect({ value, onChange, label, options }: {
  value: string; onChange: (v: string) => void; label: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 pl-3 pr-8 rounded-md border border-border bg-card text-sm text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer min-w-[120px]"
      >
        <option value="">{label}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

const LeadsPage = () => {
  const [query, setQuery] = useState('');
  const [temperatureFilter, setTemperatureFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importFallbackAssignee, setImportFallbackAssignee] = useState('');

  const [detailsLeadId, setDetailsLeadId] = useState<string | null>(null);

  const { data: leads = [], isLoading, isError, error, refetch } = useLeads();
  const { data: team = [], isLoading: teamLoading } = useTeam();
  const importLeads = useImportLeads();

  useEffect(() => {
    const openModal = () => setAddOpen(true);
    window.addEventListener('openAddLeadModal', openModal);
    return () => window.removeEventListener('openAddLeadModal', openModal);
  }, []);

  const activeEmployees = useMemo(() =>
    team.filter((e) => e.status !== 'inactive' && e.userId?._id && e.userId?.isActive !== false),
  [team]);

  const allRows = useMemo(() => leads.map(toRow), [leads]);

  // Counts are per SERVICE, since hot/warm/cold belongs to the request rather
  // than to the client — one person can be urgent about one thing and relaxed
  // about another.
  const kpis = useMemo(() => {
    const services = allRows.flatMap((r) => r.services);
    // "Due" is anything already past or landing before midnight tonight — the
    // calls someone has to make today.
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return {
      total: allRows.length,
      services: services.length,
      followUpsDue: allRows.filter(
        (r) => r.followUpAtRaw && new Date(r.followUpAtRaw) <= endOfToday
      ).length,
      hot: services.filter((s) => s.temperature === 'HOT').length,
      warm: services.filter((s) => (s.temperature ?? 'WARM') === 'WARM').length,
      cold: services.filter((s) => s.temperature === 'COLD').length,
      unassigned: services.filter((s) => !s.assignedTo?._id).length,
    };
  }, [allRows]);

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    let list = allRows.filter((r) => {
      const matchQ = !q
        || r.client.toLowerCase().includes(q)
        || r.serviceNames.toLowerCase().includes(q)
        || r.leadId.toLowerCase().includes(q)
        || r.company.toLowerCase().includes(q)
        || r.phone.includes(q);

      const matchAssigned =
        !assignedFilter
        || (assignedFilter === 'unassigned'
          ? r.assignedCount < r.services.length || r.services.length === 0
          : r.assignedCount === r.services.length && r.services.length > 0);

      // A lead matches a temperature when any of its services carries it.
      const matchTemperature =
        !temperatureFilter
        || r.services.some((s) => (s.temperature ?? 'WARM') === temperatureFilter);

      return matchQ && matchAssigned && matchTemperature;
    });

    if (sortKey) {
      list = [...list].sort((a, b) => {
        const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [allRows, query, temperatureFilter, assignedFilter, sortKey, sortDir]);

  const handleSort = (key: keyof LeadRow) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };


  const handleImport = async (importRows: Array<Record<LeadColumnKey, string>>) => {
    const payload: LeadImportRow[] = importRows.map((row) => ({
      name: row.name ?? '',
      phone: row.phone ?? '',
      email: row.email,
      company: row.company,
      city: row.city,
      // One cell can list several services — they come in as separate entries.
      services: parseServices(row.productInterest),
      productInterest: row.productInterest,
      serviceCategory: row.serviceCategory,
      serviceStage: row.serviceStage ? parseStage(row.serviceStage) : undefined,
      source: row.source || 'excel',
      assignedToName: row.assignedToName,
      temperature: row.temperature ? parseTemperature(row.temperature) : undefined,
      priority: row.priority ? parsePriority(row.priority) : undefined,
      status: row.status ? parseStatus(row.status) : undefined,
      followUpAt: row.followUpAt,
      followUpNote: row.followUpNote,
    }));

    return importLeads.mutateAsync({
      rows: payload,
      fallbackAssignedTo: importFallbackAssignee || undefined,
    });
  };

  const thBase = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap select-none';
  const thSort = `${thBase} cursor-pointer hover:text-foreground transition-colors`;

  return (
    <div className="space-y-5">

      {/* ── KPI strip ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total Leads',       value: kpis.total,      tone: 'text-foreground'    },
          { label: 'Follow-ups Due',    value: kpis.followUpsDue, tone: 'text-rose-700'    },
          { label: 'Hot',               value: kpis.hot,        tone: 'text-red-700'       },
          { label: 'Warm',              value: kpis.warm,       tone: 'text-amber-700'     },
          { label: 'Cold',              value: kpis.cold,       tone: 'text-sky-700'       },
          { label: 'Services Requested',value: kpis.services,   tone: 'text-blue-700'      },
          { label: 'Unassigned',        value: kpis.unassigned, tone: 'text-orange-600'    },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-lg px-4 py-3 flex flex-col gap-1 hover:shadow-sm transition-shadow">
            <span className={`text-[10px] font-semibold leading-tight ${kpi.tone}`}>{kpi.label}</span>
            <span className="text-2xl font-bold text-foreground leading-none mt-1">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <FilterSelect
          value={temperatureFilter} onChange={setTemperatureFilter} label="All Status"
          options={LEAD_TEMPERATURES.map((t) => ({ value: t, label: TEMPERATURE_LABELS[t] }))}
        />
        <FilterSelect
          value={assignedFilter} onChange={setAssignedFilter} label="All Leads"
          options={[
            { value: 'unassigned', label: 'Has unassigned work' },
            { value: 'assigned', label: 'Fully assigned' },
          ]}
        />

        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <ExportMenu rows={rows} columns={[...LEAD_COLUMNS]} baseName="leads" />
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className={thSort} onClick={() => handleSort('leadId')}>
                  <span className="flex items-center">Lead ID <SortIcon col="leadId" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('client')}>
                  <span className="flex items-center">Client <SortIcon col="client" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                {/* Fixed width: a long list of services truncates rather than
                    pushing the rest of the row off screen. */}
                <th className={thBase} style={{ width: SERVICES_COL_WIDTH }}>Services</th>
                <th className={thSort} onClick={() => handleSort('followUp')}>
                  <span className="flex items-center">Follow Up <SortIcon col="followUp" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('source')}>
                  <span className="flex items-center">Source <SortIcon col="source" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={`${thBase} text-right`}>Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading leads…
                </td></tr>
              ) : isError ? (
                <tr><td colSpan={6} className="text-center py-16">
                  <p className="text-sm text-destructive mb-3">
                    {error instanceof Error ? error.message : 'Failed to load leads.'}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCcw className="w-4 h-4" />Retry
                  </Button>
                </td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                  {allRows.length === 0
                    ? 'No leads yet. Use “Add Lead” to capture one, or import a spreadsheet.'
                    : 'No leads match your filters.'}
                </td></tr>
              ) : (
                rows.map((row) => {
                  const source = sourceLabel(row.source);
                  const sourceStyle = SOURCE_STYLES[source];

                  return (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground text-xs font-medium whitespace-nowrap">
                        {row.leadId}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {row.clientInitials}
                          </div>
                          <div className="min-w-0">
                            <span className="block font-semibold text-foreground text-sm truncate">{row.client}</span>
                            {(row.company || row.phone) && (
                              <span className="block text-[11px] text-muted-foreground truncate">
                                {row.company || row.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Services as plain text, clipped to a fixed width. The
                          full list is in the tooltip and the details popup. */}
                      <td className="px-4 py-3" style={{ width: SERVICES_COL_WIDTH, maxWidth: SERVICES_COL_WIDTH }}>
                        {row.services.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <div style={{ maxWidth: SERVICES_COL_WIDTH }}>
                            <span
                              title={row.serviceNames}
                              className="block text-sm text-foreground truncate"
                            >
                              {row.serviceNames}
                            </span>
                            <span className="block text-[10px] text-muted-foreground mt-0.5">
                              {row.assignedCount} of {row.services.length} assigned
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm">
                        {row.followUp || '—'}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceStyle.bg} ${sourceStyle.text}`}>
                          {source}
                        </span>
                      </td>

                      {/* In-depth details, and per-service assignment inside */}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button
                          onClick={() => setDetailsLeadId(row.id)}
                          title="View full details"
                          aria-label={`View details for ${row.client}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {rows.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing {rows.length} of {allRows.length} leads
            </span>
          </div>
        )}
      </div>

      {/* ── Lead details ("i") — read-only; assigning happens on Clients ───── */}
      <LeadDetailsDialog
        leadId={detailsLeadId}
        open={Boolean(detailsLeadId)}
        onOpenChange={(open) => !open && setDetailsLeadId(null)}
      />

      {/* ── Import ──────────────────────────────────────────────────────────── */}
      <ImportSheetDialog<LeadColumnKey>
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import Leads"
        description="Upload a CSV or Excel file of leads. The phone number identifies the client — rows sharing a number update the same contact. List several services in one cell, separated by commas."
        columns={[...LEAD_COLUMNS]}
        templateBaseName="leads"
        onImport={handleImport}
        options={
          <div className="space-y-2">
            <Label>Fallback assignee</Label>
            <Select value={importFallbackAssignee} onValueChange={setImportFallbackAssignee}>
              <SelectTrigger>
                <SelectValue placeholder={teamLoading ? 'Loading employees…' : 'Leave unset to import unassigned'} />
              </SelectTrigger>
              <SelectContent>
                {activeEmployees.map((e) => {
                  const id = String(e.userId?._id);
                  const name = [e.userId?.name, e.userId?.lastName].filter(Boolean).join(' ') || 'Unnamed employee';
                  return <SelectItem key={id} value={id}>{name}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Used for rows whose “Assigned To” name doesn't match an active employee. Left unset,
              those leads come in unassigned and wait for you to assign them.
            </p>
          </div>
        }
      />

      {/* ── Add Lead ────────────────────────────────────────────── */}
      <AddLeadDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};

export default LeadsPage;
