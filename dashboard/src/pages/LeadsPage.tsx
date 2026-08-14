import { useEffect, useMemo, useState } from 'react';
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown, Loader2, RefreshCcw, Upload, UserPlus, CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import ServiceCatalogPicker from '@/components/ServiceCatalogPicker';
import type { SheetColumn } from '@/lib/sheet';
import {
  STAGE_LABELS,
  STAGE_STYLES,
  PRIORITY_STYLES,
  SERVICE_STAGES,
  stageProgress,
  type ServiceStage,
} from '@/data/services';
import {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  useAssignLeadAsTask,
  useCreateLead,
  useImportLeads,
  useLeads,
  type LeadImportRow,
  type LeadPriority,
  type LeadStatus,
  type SalesLead,
} from '@/hooks/useLeads';
import type { CatalogService } from '@/hooks/useServiceCatalog';
import { useTeam } from '@/hooks/useTeam';

/* ── Display constants ──────────────────────────────────────────────────────── */

const KPI_STAGES: ServiceStage[] = [...SERVICE_STAGES];

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New', CONTACTED: 'Contacted', FOLLOW_UP: 'Follow Up',
  CONVERTED: 'Converted', DROPPED: 'Dropped',
};

const STATUS_STYLES: Record<LeadStatus, { bg: string; text: string }> = {
  NEW:       { bg: 'bg-blue-100',    text: 'text-blue-700'    },
  CONTACTED: { bg: 'bg-sky-100',     text: 'text-sky-700'     },
  FOLLOW_UP: { bg: 'bg-amber-100',   text: 'text-amber-700'   },
  CONVERTED: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  DROPPED:   { bg: 'bg-red-100',     text: 'text-red-700'     },
};

const PRIORITY_LABELS: Record<LeadPriority, string> = {
  LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent',
};

const LEAD_TO_SERVICE_PRIORITY: Record<LeadPriority, keyof typeof PRIORITY_STYLES> = {
  LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent',
};

/* ── Helpers ────────────────────────────────────────────────────────────────── */

const formatDateInput = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const todayDateInput = () => formatDateInput(new Date());

const defaultDeadline = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return formatDateInput(d);
};

const formatDate = (iso?: string) => {
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
  service: string;
  category: string;
  assignedTo: string;
  isAssigned: boolean;
  stage: ServiceStage;
  progress: number;
  deadline: string;
  priority: LeadPriority;
  status: LeadStatus;
  source: string;
}

const toRow = (lead: SalesLead): LeadRow => {
  // Bulk-imported leads can arrive with only a phone number — fall back to it
  // so the row stays identifiable.
  const client = lead.customer?.name?.trim() || lead.customer?.phone || 'Unnamed lead';
  const stage = lead.serviceStage ?? 'documents_pending';
  const assignedName = [lead.assignedTo?.name, lead.assignedTo?.lastName].filter(Boolean).join(' ');

  return {
    id: lead._id,
    leadId: `LD-${lead._id.slice(-5).toUpperCase()}`,
    client,
    clientInitials: makeInitials(client),
    phone: lead.customer?.phone ?? '',
    email: lead.customer?.email ?? '',
    company: lead.customer?.company ?? '',
    city: lead.customer?.city ?? '',
    service: lead.productInterest ?? '',
    category: lead.serviceCategory ?? '',
    assignedTo: assignedName || 'Unassigned',
    isAssigned: Boolean(lead.assignedTo?._id),
    stage,
    progress: stageProgress(stage),
    // Once assigned, the task's own deadline is the one that matters.
    deadline: formatDate(lead.taskId?.dueAt) || formatDate(lead.followUpAt),
    priority: lead.priority ?? 'MEDIUM',
    status: lead.status,
    source: lead.source ?? '',
  };
};

/* ── Spreadsheet columns — shared by import and export ───────────────────────── */

const LEAD_COLUMNS = [
  { key: 'name',            header: 'Client',            required: true, aliases: ['client name', 'lead name', 'customer', 'customer name', 'name'], value: (r: LeadRow) => r.client },
  { key: 'phone',           header: 'Phone',             required: true, aliases: ['mobile', 'mobile no', 'contact', 'phone no'],                     value: (r: LeadRow) => r.phone },
  { key: 'productInterest', header: 'Service',           aliases: ['interested service', 'service name', 'interest', 'requirement'],                  value: (r: LeadRow) => r.service },
  { key: 'email',           header: 'Email',             aliases: ['e-mail', 'email address'],                                                        value: (r: LeadRow) => r.email },
  { key: 'company',         header: 'Company',           aliases: ['organisation', 'organization', 'firm'],                                           value: (r: LeadRow) => r.company },
  { key: 'city',            header: 'City',              aliases: ['location'],                                                                       value: (r: LeadRow) => r.city },
  { key: 'serviceCategory', header: 'Category',          aliases: ['service category'],                                                               value: (r: LeadRow) => r.category },
  { key: 'assignedToName',  header: 'Assigned To',       aliases: ['assignee', 'employee', 'owner'],                                                  value: (r: LeadRow) => (r.isAssigned ? r.assignedTo : '') },
  { key: 'serviceStage',    header: 'Stage',             aliases: ['current stage'],                                                                  value: (r: LeadRow) => r.stage },
  { key: 'priority',        header: 'Priority',          aliases: ['urgency'],                                                                        value: (r: LeadRow) => PRIORITY_LABELS[r.priority] },
  { key: 'status',          header: 'Status',            aliases: ['lead status'],                                                                    value: (r: LeadRow) => STATUS_LABELS[r.status] },
  { key: 'followUpAt',      header: 'Deadline',          aliases: ['follow up', 'followup', 'due date', 'target date'],                                value: (r: LeadRow) => r.deadline },
  { key: 'source',          header: 'Source',            aliases: ['lead source'],                                                                    value: (r: LeadRow) => r.source },
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

function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100 ? 'bg-emerald-500' :
    value >= 70   ? 'bg-blue-600'    :
    value >= 40   ? 'bg-blue-500'    :
                    'bg-blue-400';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[90px]">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right shrink-0">{value}%</span>
    </div>
  );
}

/* ── Forms ──────────────────────────────────────────────────────────────────── */

interface AddLeadForm {
  client: string;
  phone: string;
  email: string;
  company: string;
  city: string;
  state: string;
  priority: LeadPriority;
  followUpAt: string;
  notes: string;
}

const EMPTY_LEAD_FORM: AddLeadForm = {
  client: '', phone: '', email: '', company: '', city: '', state: '',
  priority: 'MEDIUM', followUpAt: '', notes: '',
};

interface AssignForm {
  assignedToId: string;
  deadline: string;
  priority: string;
  notes: string;
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

const LeadsPage = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importFallbackAssignee, setImportFallbackAssignee] = useState('');
  const [selectedService, setSelectedService] = useState<CatalogService | null>(null);
  const [form, setForm] = useState<AddLeadForm>(EMPTY_LEAD_FORM);

  const [assignTarget, setAssignTarget] = useState<LeadRow | null>(null);
  const [assignForm, setAssignForm] = useState<AssignForm>({
    assignedToId: '', deadline: defaultDeadline(), priority: 'medium', notes: '',
  });

  const { data: leads = [], isLoading, isError, error, refetch } = useLeads();
  const { data: team = [], isLoading: teamLoading } = useTeam();
  const createLead = useCreateLead();
  const importLeads = useImportLeads();
  const assignLead = useAssignLeadAsTask();

  useEffect(() => {
    const openModal = () => setAddOpen(true);
    window.addEventListener('openAddLeadModal', openModal);
    return () => window.removeEventListener('openAddLeadModal', openModal);
  }, []);

  const activeEmployees = useMemo(() =>
    team.filter((e) => e.status !== 'inactive' && e.userId?._id && e.userId?.isActive !== false),
  [team]);

  const allRows = useMemo(() => leads.map(toRow), [leads]);

  const stageCounts = useMemo(() =>
    KPI_STAGES.reduce((acc, stage) => {
      acc[stage] = allRows.filter((r) => r.stage === stage).length;
      return acc;
    }, {} as Record<ServiceStage, number>),
  [allRows]);

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    let list = allRows.filter((r) => {
      const matchQ = !q
        || r.client.toLowerCase().includes(q)
        || r.service.toLowerCase().includes(q)
        || r.leadId.toLowerCase().includes(q)
        || r.company.toLowerCase().includes(q)
        || r.assignedTo.toLowerCase().includes(q)
        || r.phone.includes(q);
      return matchQ
        && (!statusFilter || r.status === statusFilter)
        && (!stageFilter || r.stage === stageFilter)
        && (!assignedFilter
          || (assignedFilter === 'unassigned' ? !r.isAssigned : r.assignedTo === assignedFilter));
    });

    if (sortKey) {
      list = [...list].sort((a, b) => {
        const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [allRows, query, statusFilter, stageFilter, assignedFilter, sortKey, sortDir]);

  const assigneeOptions = useMemo(() => [
    { value: 'unassigned', label: 'Unassigned only' },
    ...Array.from(new Set(allRows.filter((r) => r.isAssigned).map((r) => r.assignedTo)))
      .sort().map((v) => ({ value: v, label: v })),
  ], [allRows]);

  const handleSort = (key: keyof LeadRow) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const updateForm = <K extends keyof AddLeadForm>(field: K, value: AddLeadForm[K]) =>
    setForm((c) => ({ ...c, [field]: value }));

  const resetAddForm = () => {
    setForm(EMPTY_LEAD_FORM);
    setSelectedService(null);
  };

  const handleAddLead = () => {
    const client = form.client.trim();
    const phone = form.phone.trim();

    if (!client || !phone) {
      toast.error('Client name and phone number are required.');
      return;
    }

    createLead.mutate(
      {
        name: client,
        phone,
        email: form.email.trim() || undefined,
        company: form.company.trim() || undefined,
        city: form.city.trim() || undefined,
        state: form.state.trim() || undefined,
        productInterest: selectedService?.title,
        serviceSlug: selectedService?.slug,
        serviceCategory: selectedService?.category,
        serviceStage: 'documents_pending',
        priority: form.priority,
        status: 'NEW',
        source: 'manual',
        followUpAt: form.followUpAt || undefined,
      },
      {
        onSuccess: () => {
          setAddOpen(false);
          resetAddForm();
          toast.success(
            selectedService
              ? `Lead added — ${client} is interested in ${selectedService.title}.`
              : `Lead added for ${client}.`
          );
        },
        onError: (err: Error) => toast.error(err?.message || 'Failed to add lead.'),
      }
    );
  };

  const openAssign = (row: LeadRow) => {
    setAssignTarget(row);
    setAssignForm({
      assignedToId: '',
      deadline: row.deadline && row.deadline >= todayDateInput() ? row.deadline : defaultDeadline(),
      priority: row.priority.toLowerCase(),
      notes: '',
    });
  };

  const handleAssign = () => {
    if (!assignTarget || !assignForm.assignedToId) {
      toast.error('Select an employee to assign this to.');
      return;
    }
    if (!assignForm.deadline || assignForm.deadline < todayDateInput()) {
      toast.error('Deadline cannot be in the past.');
      return;
    }

    assignLead.mutate(
      {
        id: assignTarget.id,
        assignedTo: assignForm.assignedToId,
        dueAt: new Date(`${assignForm.deadline}T23:59:00`).toISOString(),
        priority: assignForm.priority,
        notes: assignForm.notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`${assignTarget.service || 'Lead'} assigned. Task created for ${assignTarget.client}.`);
          setAssignTarget(null);
        },
        onError: (err: Error) => toast.error(err?.message || 'Failed to assign lead.'),
      }
    );
  };

  const handleImport = async (importRows: Array<Record<LeadColumnKey, string>>) => {
    const payload: LeadImportRow[] = importRows.map((row) => ({
      name: row.name ?? '',
      phone: row.phone ?? '',
      email: row.email,
      company: row.company,
      city: row.city,
      productInterest: row.productInterest,
      serviceCategory: row.serviceCategory,
      serviceStage: row.serviceStage ? parseStage(row.serviceStage) : undefined,
      source: row.source || 'excel',
      assignedToName: row.assignedToName,
      priority: row.priority ? parsePriority(row.priority) : undefined,
      status: row.status ? parseStatus(row.status) : undefined,
      followUpAt: row.followUpAt,
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
        {KPI_STAGES.map((stage) => {
          const ss = STAGE_STYLES[stage];
          return (
            <div key={stage} className="bg-card border border-border rounded-lg px-4 py-3 flex flex-col gap-1 hover:shadow-sm transition-shadow">
              <span className={`text-[10px] font-semibold leading-tight ${ss.text}`}>{STAGE_LABELS[stage]}</span>
              <span className="text-2xl font-bold text-foreground leading-none mt-1">{stageCounts[stage]}</span>
            </div>
          );
        })}
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
          value={statusFilter} onChange={setStatusFilter} label="All Status"
          options={LEAD_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
        />
        <FilterSelect
          value={stageFilter} onChange={setStageFilter} label="All Stages"
          options={SERVICE_STAGES.map((s) => ({ value: s, label: STAGE_LABELS[s] }))}
        />
        <FilterSelect
          value={assignedFilter} onChange={setAssignedFilter} label="All Assignees"
          options={assigneeOptions}
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
                <th className={thSort} onClick={() => handleSort('service')}>
                  <span className="flex items-center">Service <SortIcon col="service" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('assignedTo')}>
                  <span className="flex items-center">Assigned <SortIcon col="assignedTo" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('stage')}>
                  <span className="flex items-center">Current Stage <SortIcon col="stage" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thBase} style={{ minWidth: 160 }}>Progress</th>
                <th className={thSort} onClick={() => handleSort('deadline')}>
                  <span className="flex items-center">Deadline <SortIcon col="deadline" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('priority')}>
                  <span className="flex items-center">Priority <SortIcon col="priority" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('status')}>
                  <span className="flex items-center">Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thBase}>Assign</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={10} className="text-center py-16 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading leads…
                </td></tr>
              ) : isError ? (
                <tr><td colSpan={10} className="text-center py-16">
                  <p className="text-sm text-destructive mb-3">
                    {error instanceof Error ? error.message : 'Failed to load leads.'}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCcw className="w-4 h-4" />Retry
                  </Button>
                </td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-16 text-muted-foreground text-sm">
                  {allRows.length === 0
                    ? 'No leads yet. Use “Add Lead” to capture one, or import a spreadsheet.'
                    : 'No leads match your filters.'}
                </td></tr>
              ) : (
                rows.map((row) => {
                  const stageStyle = STAGE_STYLES[row.stage];
                  const priorityStyle = PRIORITY_STYLES[LEAD_TO_SERVICE_PRIORITY[row.priority]];
                  const statusStyle = STATUS_STYLES[row.status];

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

                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm">
                        {row.service || <span className="text-muted-foreground">—</span>}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {row.isAssigned ? (
                          <span className="text-foreground">{row.assignedTo}</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageStyle.bg} ${stageStyle.text}`}>
                          {STAGE_LABELS[row.stage]}
                        </span>
                      </td>

                      <td className="px-4 py-3" style={{ minWidth: 160 }}>
                        <ProgressBar value={row.progress} />
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm">
                        {row.deadline || '—'}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                          {PRIORITY_LABELS[row.priority]}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          {STATUS_LABELS[row.status]}
                        </span>
                      </td>

                      {/* Assign to an employee as a task */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => openAssign(row)}
                          title={row.isAssigned ? `Reassign — currently with ${row.assignedTo}` : 'Assign to an employee'}
                          className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border text-xs font-medium transition-colors ${
                            row.isAssigned
                              ? 'border-border bg-card text-muted-foreground hover:bg-muted'
                              : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {row.isAssigned
                            ? <><CheckCircle2 className="w-3.5 h-3.5" />Reassign</>
                            : <><UserPlus className="w-3.5 h-3.5" />Assign</>}
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

      {/* ── Import ──────────────────────────────────────────────────────────── */}
      <ImportSheetDialog<LeadColumnKey>
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import Leads"
        description="Upload a CSV or Excel file of leads. The phone number identifies the client — rows sharing a number update the same contact."
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

      {/* ── Add Lead ────────────────────────────────────────────────────────── */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => { setAddOpen(open); if (!open) resetAddForm(); }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Add Lead</DialogTitle>
            <DialogDescription>
              Capture a client and the service they're interested in. Assign it to an employee later
              with the Assign button on the row.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)]">
            <div className="border-y md:border-r md:border-y-0 border-border p-4">
              <ServiceCatalogPicker
                selectedSlug={selectedService?.slug ?? ''}
                onSelect={setSelectedService}
                height="h-[420px]"
              />
            </div>

            <div className="p-4 space-y-3 max-h-[480px] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="lead-client">Client name *</Label>
                <Input id="lead-client" value={form.client} onChange={(e) => updateForm('client', e.target.value)} placeholder="Full name of the client" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lead-phone">Phone *</Label>
                  <Input id="lead-phone" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="+91…" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-email">Email</Label>
                  <Input id="lead-email" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="client@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-company">Company</Label>
                <Input id="lead-company" value={form.company} onChange={(e) => updateForm('company', e.target.value)} placeholder="Optional" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lead-city">City</Label>
                  <Input id="lead-city" value={form.city} onChange={(e) => updateForm('city', e.target.value)} placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-state">State</Label>
                  <Input id="lead-state" value={form.state} onChange={(e) => updateForm('state', e.target.value)} placeholder="Optional" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => updateForm('priority', v as LeadPriority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LEAD_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-followup">Target date</Label>
                  <Input id="lead-followup" type="date" value={form.followUpAt} onChange={(e) => updateForm('followUpAt', e.target.value)} />
                </div>
              </div>

              <div className="rounded-md border border-border bg-muted/30 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Interested Service
                </p>
                {selectedService ? (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-foreground">{selectedService.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedService.category}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No service selected yet — you can add one later.</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddLead}
              disabled={!form.client.trim() || !form.phone.trim() || createLead.isPending}
            >
              {createLead.isPending ? 'Adding…' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Assign lead as a task ───────────────────────────────────────────── */}
      <Dialog open={!!assignTarget} onOpenChange={(open) => !open && setAssignTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{assignTarget?.isAssigned ? 'Reassign Lead' : 'Assign Lead'}</DialogTitle>
            <DialogDescription>
              Creates a task for the employee, carrying {assignTarget?.client}'s full contact details
              and the service they want.
            </DialogDescription>
          </DialogHeader>

          {assignTarget && (
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-muted/30 px-3 py-3 space-y-1">
                <p className="text-sm font-semibold text-foreground">{assignTarget.service || 'No service selected'}</p>
                <p className="text-xs text-muted-foreground">
                  {assignTarget.client}
                  {assignTarget.phone && ` · ${assignTarget.phone}`}
                  {assignTarget.company && ` · ${assignTarget.company}`}
                </p>
                {assignTarget.isAssigned && (
                  <p className="text-[11px] text-amber-700 pt-1">
                    Currently with {assignTarget.assignedTo}. Reassigning creates a fresh task for the
                    new employee; the existing one is left as-is.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Assign to *</Label>
                <Select
                  value={assignForm.assignedToId}
                  onValueChange={(v) => setAssignForm((c) => ({ ...c, assignedToId: v }))}
                  disabled={teamLoading || activeEmployees.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={teamLoading ? 'Loading employees…' : 'Select employee'} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeEmployees.map((e) => {
                      const id = String(e.userId?._id);
                      const name = [e.userId?.name, e.userId?.lastName].filter(Boolean).join(' ') || 'Unnamed employee';
                      const meta = e.designation || e.department || 'Employee';
                      return <SelectItem key={id} value={id}>{name} - {meta}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
                {!teamLoading && activeEmployees.length === 0 && (
                  <p className="text-xs text-muted-foreground">No active employees available.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="assign-deadline">Deadline</Label>
                  <Input
                    id="assign-deadline"
                    type="date"
                    min={todayDateInput()}
                    value={assignForm.deadline}
                    onChange={(e) => setAssignForm((c) => ({ ...c, deadline: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={assignForm.priority}
                    onValueChange={(v) => setAssignForm((c) => ({ ...c, priority: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assign-notes">Notes for the assignee</Label>
                <textarea
                  id="assign-notes"
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm((c) => ({ ...c, notes: e.target.value }))}
                  placeholder="Documents collected, special instructions…"
                  className="w-full min-h-[64px] rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignTarget(null)} disabled={assignLead.isPending}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!assignForm.assignedToId || assignLead.isPending}>
              {assignLead.isPending ? 'Assigning…' : 'Assign as Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsPage;
