import { useEffect, useMemo, useState } from 'react';
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Info, Loader2, RefreshCcw, Upload, CheckCircle2, AlertTriangle,
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
import DateRangeFilter, { isWithinRange, type DateRange } from '@/components/DateRangeFilter';
import AddLeadDialog from '@/components/leads/AddLeadDialog';
import LeadDetailsDialog from '@/components/leads/LeadDetailsDialog';
import ConfirmQuotationDialog from '@/components/leads/ConfirmQuotationDialog';
import type { SheetColumn } from '@/lib/sheet';
import { STAGE_LABELS, SERVICE_STAGES, type ServiceStage } from '@/data/services';
import { TEMPERATURE_LABELS } from '@/data/leadTemperature';
import { SOURCE_STYLES, sourceLabel } from '@/data/leadSource';
import { INDIAN_STATES, citiesForState } from '@/data/indiaLocations';
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
import { useServiceCatalog, type CatalogService } from '@/hooks/useServiceCatalog';

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
  /** False when `client` is only the phone-number fallback — no real name was captured. */
  hasName: boolean;
  clientInitials: string;
  phone: string;
  email: string;
  company: string;
  city: string;
  state: string;
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
  /** When the lead was captured — what the calendar filter narrows on. */
  createdAt: string;
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
    hasName: Boolean(lead.customer?.name?.trim()),
    clientInitials: makeInitials(client),
    phone: lead.customer?.phone ?? '',
    email: lead.customer?.email ?? '',
    company: lead.customer?.company ?? '',
    city: lead.customer?.city ?? '',
    state: lead.customer?.state ?? '',
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
    createdAt: lead.createdAt,
    stage: lead.serviceStage ?? 'documents_pending',
  };
};

/* ── Spreadsheet columns — shared by import and export ───────────────────────── */

const LEAD_COLUMNS = [
  { key: 'name',            header: 'Client',            required: true, aliases: ['client name', 'lead name', 'customer', 'customer name', 'name'], value: (r: LeadRow) => r.client },
  { key: 'phone',           header: 'Phone',             required: true, aliases: ['mobile', 'mobile no', 'contact', 'phone no'],                     value: (r: LeadRow) => r.phone },
  { key: 'email',           header: 'Email',             aliases: ['e-mail', 'email address'],                                                        value: (r: LeadRow) => r.email },
  { key: 'company',         header: 'Company',           aliases: ['organisation', 'organization', 'firm'],                                           value: (r: LeadRow) => r.company },
  { key: 'state',           header: 'State',             aliases: ['state name', 'province'],                                                         value: (r: LeadRow) => r.state },
  { key: 'city',            header: 'City',              aliases: ['location'],                                                                       value: (r: LeadRow) => r.city },
  { key: 'productInterest', header: 'Services',          aliases: ['service', 'interested service', 'service name', 'interest', 'requirement'],       value: (r: LeadRow) => r.serviceNames },
  { key: 'quotation',       header: 'Quotation',         aliases: ['quote', 'amount', 'price', 'quoted amount'],                                       value: (r: LeadRow) => r.services[0]?.quotation ?? '' },
  { key: 'startAt',         header: 'Start Date',        aliases: ['when to start', 'start date', 'commencement date'],                                value: (r: LeadRow) => formatDate(r.services[0]?.startAt) },
  { key: 'targetDate',      header: 'Target Date',       aliases: ['due date', 'target date', 'deadline'],                                             value: (r: LeadRow) => r.deadline },
  { key: 'serviceCategory', header: 'Category',          aliases: ['service category'],                                                               value: (r: LeadRow) => r.services[0]?.category ?? '' },
  { key: 'serviceStage',    header: 'Stage',             aliases: ['current stage'],                                                                  value: (r: LeadRow) => r.stage },
  { key: 'temperature',     header: 'Status',            aliases: ['lead status', 'temperature', 'hot warm cold'],                                     value: (r: LeadRow) => TEMPERATURE_LABELS[r.temperature] },
  { key: 'priority',        header: 'Priority',          aliases: ['urgency'],                                                                        value: (r: LeadRow) => PRIORITY_LABELS[r.priority] },
  { key: 'status',          header: 'Pipeline',          aliases: ['pipeline status'],                                                                value: (r: LeadRow) => STATUS_LABELS[r.status] },
  { key: 'followUpAt',      header: 'Follow Up',         aliases: ['follow up', 'followup', 'follow up date', 'next follow up'],                       value: (r: LeadRow) => r.followUp },
  { key: 'followUpNote',    header: 'Follow Up Note',    aliases: ['follow up note', 'followup note', 'remark', 'remarks'],                            value: (r: LeadRow) => r.followUpNote },
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

/**
 * Tolerates stray currency symbols/commas ("₹45,000") without throwing, but
 * rejects anything negative or non-numeric outright — a "-500" comes back
 * empty rather than silently becoming a positive 500, and words-only cells
 * ("TBD", "N/A") already fall out since nothing numeric survives the strip.
 */
const parseQuotation = (value?: string): number | undefined => {
  const raw = String(value ?? '').trim();
  if (!raw) return undefined;

  const isNegative = /^-|^\(.*\)$/.test(raw.replace(/[₹$,\s]/g, ''));
  const cleaned = raw.replace(/[^0-9.]/g, '');
  if (!cleaned) return undefined;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && !isNegative ? parsed : undefined;
};

/** A name is letters (plus normal spacing/punctuation) — never a number, code
 *  or other garbage cell value. */
const NAME_TEXT_PATTERN = /^[a-zA-Z][a-zA-Z\s.'-]*$/;
const parseImportName = (value?: string): string | undefined => {
  const trimmed = String(value ?? '').trim();
  return trimmed && NAME_TEXT_PATTERN.test(trimmed) ? trimmed : undefined;
};

const EMAIL_TEXT_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const parseImportEmail = (value?: string): string | undefined => {
  const trimmed = String(value ?? '').trim();
  return trimmed && EMAIL_TEXT_PATTERN.test(trimmed) ? trimmed : undefined;
};

/**
 * Confirms a real 10-digit number, with or without a "+91"/"91" country code
 * — either is fine — and normalizes to the same "+91XXXXXXXXXX" shape the Add
 * Lead form saves, so the same person imported once and added manually later
 * doesn't end up as two different customers. Anything else (too few/many
 * digits, letters mixed in) comes back empty rather than a mangled number.
 */
const parseImportPhone = (value?: string): string | undefined => {
  let digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  return /^\d{10}$/.test(digits) ? `+91${digits}` : undefined;
};

/** Only a real state from the fixed list counts — anything else (typos,
 *  places outside India, garbage) is left for the user to fill in by hand. */
const parseImportState = (value?: string): string | undefined => {
  const trimmed = String(value ?? '').trim().toLowerCase();
  if (!trimmed) return undefined;
  return INDIAN_STATES.find((s) => s.toLowerCase() === trimmed);
};

/**
 * When the resolved state has a known city list, the cell has to match one of
 * them — same rule the dropdown on Add Lead enforces. States without a list
 * fall back to a structural check (looks like a place name, not a number or
 * symbols) since there's nothing to validate against.
 */
const parseImportCity = (value: string | undefined, state: string | undefined): string | undefined => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return undefined;

  const knownCities = citiesForState(state);
  if (knownCities.length > 0) {
    return knownCities.find((c) => c.toLowerCase() === trimmed.toLowerCase());
  }
  return NAME_TEXT_PATTERN.test(trimmed) ? trimmed : undefined;
};

/** Excel's own date epoch — day 0 is 1899-12-30 (its leap-year bug baked in). */
const EXCEL_EPOCH_MS = Date.UTC(1899, 11, 30);

const toIsoDate = (y: number, m: number, d: number): string | undefined => {
  const date = new Date(Date.UTC(y, m - 1, d));
  const valid = !Number.isNaN(date.getTime())
    && date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  if (!valid) return undefined;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}-${pad(m)}-${pad(d)}`;
};

/**
 * Accepts pretty much whatever date format a spreadsheet throws at it — ISO,
 * DD/MM/YYYY, DD-MM-YYYY, "1 Jan 2026", even Excel's own serial day numbers —
 * and normalizes to YYYY-MM-DD. Day-first is assumed for an ambiguous
 * slash/dash date, matching how this business's own sheets are filled in.
 * Anything that still doesn't resolve to a real calendar date comes back
 * undefined so the field is simply left blank.
 */
const parseFlexibleDate = (value?: string): string | undefined => {
  const raw = String(value ?? '').trim();
  if (!raw) return undefined;

  // A bare number is a date cell Excel handed back as its serial day-count.
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const serial = Number(raw);
    if (serial < 20000 || serial > 80000) return undefined; // sane range: ~1954–2119
    const date = new Date(EXCEL_EPOCH_MS + serial * 86400000);
    return Number.isNaN(date.getTime())
      ? undefined
      : toIsoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  }

  const dmy = raw.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (dmy) {
    const [, d, m, yRaw] = dmy;
    const y = yRaw.length === 2 ? 2000 + Number(yRaw) : Number(yRaw);
    return toIsoDate(y, Number(m), Number(d));
  }

  const ymd = raw.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/);
  if (ymd) {
    const [, y, m, d] = ymd;
    return toIsoDate(Number(y), Number(m), Number(d));
  }

  // "1 Jan 2026", "January 1, 2026", ISO timestamps, etc. — hand to the
  // native parser rather than reinventing every format it already knows.
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime())
    ? undefined
    : toIsoDate(parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate());
};

/**
 * A sheet cell can list several services — split it back into names. The
 * quotation/start/target date columns apply to the lead as a whole, so every
 * resolved service carries the same values.
 *
 * Anything typed in the sheet that doesn't match a real catalog service by
 * name is dropped rather than saved as-is — an importer fat-fingering
 * "Trademark Registeration" (or listing a service that doesn't exist) should
 * not silently create a made-up service on the lead. `allMatched` is false
 * whenever at least one typed name failed to resolve, so the caller can flag
 * that row as needing attention instead of pretending nothing was lost.
 */
const resolveImportServices = (
  value: string | undefined,
  catalogByTitle: Map<string, CatalogService>,
  extra?: { quotation?: number; startAt?: string; dueAt?: string }
) => {
  const names = String(value ?? '').split(/[,;|]/).map((title) => title.trim()).filter(Boolean);

  const services = names
    .map((name) => catalogByTitle.get(name.toLowerCase()))
    .filter((s): s is CatalogService => Boolean(s))
    .map((s) => ({
      title: s.title,
      slug: s.slug,
      category: s.category,
      categorySlug: s.categorySlug,
      ...(extra?.quotation !== undefined ? { quotation: extra.quotation } : {}),
      ...(extra?.startAt ? { startAt: extra.startAt } : {}),
      ...(extra?.dueAt ? { dueAt: extra.dueAt } : {}),
    }));

  return { services, allMatched: names.length === services.length };
};

/**
 * The identity/contact fields a well-formed lead should carry regardless of
 * where it's at in the pipeline — deliberately excludes quotation/dates,
 * which are normal to be unset before the Confirm step and already have
 * their own indicator (the Confirm button/badge).
 */
const COMPLETENESS_CHECKS: Array<{ label: string; test: (row: LeadRow) => boolean }> = [
  { label: 'client name', test: (r) => !r.hasName },
  { label: 'email', test: (r) => !r.email },
  { label: 'state', test: (r) => !r.state },
  { label: 'services', test: (r) => r.services.length === 0 },
];

const missingFieldsFor = (row: LeadRow) =>
  COMPLETENESS_CHECKS.filter((check) => check.test(row)).map((check) => check.label);

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importFallbackAssignee, setImportFallbackAssignee] = useState('');

  const [detailsLeadId, setDetailsLeadId] = useState<string | null>(null);
  const [confirmLeadId, setConfirmLeadId] = useState<string | null>(null);
  /** Set when the Add Lead dialog was opened from a row's incomplete-data
   *  alert rather than the toolbar — pre-fills the dialog for editing instead
   *  of starting a blank capture. */
  const [editLead, setEditLead] = useState<SalesLead | null>(null);

  const { data: leads = [], isLoading, isError, error, refetch } = useLeads();
  const confirmLead = useMemo(() => leads.find((l) => l._id === confirmLeadId) ?? null, [leads, confirmLeadId]);
  const { data: team = [], isLoading: teamLoading } = useTeam();
  const { data: catalog } = useServiceCatalog();
  const importLeads = useImportLeads();

  const catalogByTitle = useMemo(() => {
    const map = new Map<string, CatalogService>();
    for (const service of catalog?.services ?? []) map.set(service.title.trim().toLowerCase(), service);
    return map;
  }, [catalog]);

  useEffect(() => {
    const openModal = () => { setEditLead(null); setAddOpen(true); };
    window.addEventListener('openAddLeadModal', openModal);
    return () => window.removeEventListener('openAddLeadModal', openModal);
  }, []);

  const activeEmployees = useMemo(() =>
    team.filter((e) => e.status !== 'inactive' && e.userId?._id && e.userId?.isActive !== false),
  [team]);

  const allRows = useMemo(() => leads.map(toRow), [leads]);

  // Recomputed live from the current lead data (not a one-time import
  // snapshot), so the alert stays accurate for leads edited or created any
  // other way too.
  const incompleteCount = useMemo(
    () => allRows.filter((r) => missingFieldsFor(r).length > 0).length,
    [allRows]
  );

  const openIncompleteLead = (row: LeadRow) => {
    const lead = leads.find((l) => l._id === row.id);
    if (!lead) return;
    setEditLead(lead);
    setAddOpen(true);
  };

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

      // Captured inside the dates picked on the calendar.
      const matchDate = isWithinRange(r.createdAt, dateRange);

      return matchQ && matchAssigned && matchTemperature && matchDate;
    });

    if (sortKey) {
      list = [...list].sort((a, b) => {
        const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [allRows, query, temperatureFilter, assignedFilter, dateRange, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pagedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [query, temperatureFilter, assignedFilter, dateRange, sortKey, sortDir]);

  const handleSort = (key: keyof LeadRow) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };


  const handleImport = async (importRows: Array<Record<LeadColumnKey, string>>) => {
    // Every field below is validated/normalized before anything is sent —
    // wrong-shaped data (a numeric name, a bad email, a state that isn't
    // real, dates in whatever format, a negative quotation…) is left blank
    // rather than saved as typed. Only the phone number blocks the row
    // entirely, since it's the customer's identity key.
    const validated = importRows.map((row) => {
      const state = parseImportState(row.state);
      const startAt = parseFlexibleDate(row.startAt);
      const dueAt = parseFlexibleDate(row.targetDate);
      // A start date on or after the target date is backwards — drop it
      // rather than save a service that's already "late" on day one.
      const orderedStartAt = startAt && dueAt && startAt >= dueAt ? undefined : startAt;

      return {
        name: parseImportName(row.name),
        phone: parseImportPhone(row.phone),
        email: parseImportEmail(row.email),
        city: parseImportCity(row.city, state),
        state,
        quotation: parseQuotation(row.quotation),
        startAt: orderedStartAt,
        dueAt,
      };
    });

    // One cell can list several services — resolve each name against the real
    // service catalog before anything is sent. A name that doesn't match
    // anything real is dropped rather than saved as a made-up service.
    const resolved = importRows.map((row, i) =>
      resolveImportServices(row.productInterest, catalogByTitle, {
        quotation: validated[i].quotation,
        startAt: validated[i].startAt,
        dueAt: validated[i].dueAt,
      })
    );

    const payload: LeadImportRow[] = importRows.map((row, i) => {
      const { services } = resolved[i];
      const v = validated[i];
      return {
        name: v.name ?? '',
        phone: v.phone ?? '',
        email: v.email,
        company: row.company,
        city: v.city,
        state: v.state,
        services,
        productInterest: services[0]?.title,
        serviceCategory: services[0]?.category ?? row.serviceCategory,
        serviceStage: row.serviceStage ? parseStage(row.serviceStage) : undefined,
        source: row.source || 'excel',
        assignedToName: row.assignedToName,
        temperature: row.temperature ? parseTemperature(row.temperature) : undefined,
        priority: row.priority ? parsePriority(row.priority) : undefined,
        status: row.status ? parseStatus(row.status) : undefined,
        followUpAt: row.followUpAt,
        followUpNote: row.followUpNote,
      };
    });

    const result = await importLeads.mutateAsync({
      rows: payload,
      fallbackAssignedTo: importFallbackAssignee || undefined,
    });

    // The backend reports every phone-less row as "missing" — give the ones
    // that actually had a phone typed in, just not a valid one, a truer reason.
    const skipped = (result.skipped ?? []).map((s) => {
      const row = importRows[s.row - 2];
      const hadRawPhone = Boolean(String(row?.phone ?? '').trim());
      return hadRawPhone && !validated[s.row - 2]?.phone
        ? { ...s, reason: 'Invalid phone number — needs 10 digits (a +91 country code is fine).' }
        : s;
    });

    // Nothing else here blocks the import — only a missing/invalid phone does
    // that, and those rows are already in `skipped`. This just tells the user
    // which of the leads that DID come in are worth a follow-up to complete.
    const skippedRows = new Set(skipped.map((s) => s.row));
    const incomplete = importRows
      .map((row, i) => {
        const rowNumber = i + 2; // header is row 1
        if (skippedRows.has(rowNumber)) return null;

        const v = validated[i];
        const missing: string[] = [];
        if (!v.name) missing.push('client name');
        if (!v.email) missing.push('email');
        if (!v.state) missing.push('state');
        if (resolved[i].services.length === 0) missing.push('services');
        if (v.quotation === undefined) missing.push('quotation');
        if (!v.startAt) missing.push('start date');
        if (!v.dueAt) missing.push('target date');

        // A cell that named one real service and one bogus one still needs a
        // look, even though "services" itself came through non-empty.
        if (!resolved[i].allMatched && resolved[i].services.length > 0) {
          missing.push("a listed service name didn't match the catalog");
        }

        return missing.length > 0 ? { row: rowNumber, missing } : null;
      })
      .filter((entry): entry is { row: number; missing: string[] } => entry !== null);

    return { ...result, skipped, incomplete };
  };

  const thBase = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap select-none';
  const thSort = `${thBase} cursor-pointer hover:text-foreground transition-colors`;

  return (
    <div className="space-y-5">

      {/* ── Incomplete-data notice ──────────────────────────────────────────── */}
      {incompleteCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            {incompleteCount === 1
              ? '1 lead has incomplete data.'
              : 'Many leads have incomplete data.'}{' '}
            <span className="text-amber-700">
              Look for the blinking alert icon on a row and click it to fill in what's missing.
            </span>
          </p>
        </div>
      )}

      {/* ── KPI strip ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Leads',       value: kpis.total,      tone: 'text-foreground'    },
          { label: 'Follow-ups Due',    value: kpis.followUpsDue, tone: 'text-rose-700'    },
          { label: 'Hot',               value: kpis.hot,        tone: 'text-red-700'       },
          { label: 'Warm',              value: kpis.warm,       tone: 'text-amber-700'     },
          { label: 'Cold',              value: kpis.cold,       tone: 'text-sky-700'       },
          { label: 'Services Requested',value: kpis.services,   tone: 'text-blue-700'      },
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
        {/* Narrows the board to the leads captured between two dates. */}
        <DateRangeFilter value={dateRange} onChange={setDateRange} label="Filter by capture date" />

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
                <th className="px-2 py-3 w-8" />
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
                <th className={thBase}>Quotation</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-16 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading leads…
                </td></tr>
              ) : isError ? (
                <tr><td colSpan={8} className="text-center py-16">
                  <p className="text-sm text-destructive mb-3">
                    {error instanceof Error ? error.message : 'Failed to load leads.'}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCcw className="w-4 h-4" />Retry
                  </Button>
                </td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-muted-foreground text-sm">
                  {allRows.length === 0
                    ? 'No leads yet. Use “Add Lead” to capture one, or import a spreadsheet.'
                    : 'No leads match your filters.'}
                </td></tr>
              ) : (
                pagedRows.map((row) => {
                  const source = sourceLabel(row.source);
                  const sourceStyle = SOURCE_STYLES[source];
                  const isConfirmed = row.services.length > 0 && row.services.every(s => s.quotationConfirmed === true);
                  const missing = missingFieldsFor(row);

                  return (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-2 py-3">
                        {/* A confirmed lead is a client now — nothing here is
                            fixable from this page, so don't offer a dead-end click. */}
                        {missing.length > 0 && !isConfirmed && (
                          <button
                            type="button"
                            onClick={() => openIncompleteLead(row)}
                            title={`Incomplete: missing ${missing.join(', ')}. Click to fill in.`}
                            aria-label={`${row.client} has incomplete data — click to fill it in`}
                            className="flex items-center justify-center w-6 h-6 rounded-full text-amber-600 hover:bg-amber-100 transition-colors"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </td>
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

                      <td className="px-4 py-3 whitespace-nowrap">
                        {isConfirmed ? (
                          // Locked, not a button — this lead is a client now;
                          // re-editing a confirmed quotation happens on the
                          // Clients board, not by reopening it from here.
                          <span
                            title="Quotation confirmed — this lead is now a client. View or adjust it from the Clients board."
                            className="inline-flex items-center h-7 px-2.5 rounded-md text-xs font-medium border border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Confirmed
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setConfirmLeadId(row.id)}
                            disabled={row.services.length === 0}
                            title={row.services.length === 0
                              ? 'Add a service to this lead before confirming'
                              : 'Confirm the quotation for each service'}
                            className="h-7 text-xs font-medium"
                          >
                            Confirm
                          </Button>
                        )}
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

        <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Showing {rows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, rows.length)} of {rows.length} leads
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

      {/* ── Lead details ("i") — read-only; assigning happens on Clients ───── */}
      <LeadDetailsDialog
        leadId={detailsLeadId}
        open={Boolean(detailsLeadId)}
        onOpenChange={(open) => !open && setDetailsLeadId(null)}
      />

      {/* ── Confirm: per-service fields, prices and the shared advance ─────── */}
      <ConfirmQuotationDialog
        lead={confirmLead}
        open={Boolean(confirmLead)}
        onOpenChange={(open) => !open && setConfirmLeadId(null)}
      />

      {/* ── Import ──────────────────────────────────────────────────────────── */}
      <ImportSheetDialog<LeadColumnKey>
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import Leads"
        description="Upload a CSV or Excel file of leads. Only the phone number is required (a valid 10-digit number, with or without a +91 country code) — it identifies the client, and rows sharing a number update the same contact. Every other column is validated on the way in; anything that doesn't look right (a garbled name, email, state, date or quotation) is simply left blank rather than saved as-is, and can be filled in later. List several services in one cell, separated by commas."
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

      {/* ── Add Lead — also doubles as the "fix incomplete data" editor when
          opened from a row's alert icon, via `editLead`. ─────────────────── */}
      <AddLeadDialog
        open={addOpen}
        onOpenChange={(open) => { setAddOpen(open); if (!open) setEditLead(null); }}
        lead={editLead}
      />
    </div>
  );
};

export default LeadsPage;
