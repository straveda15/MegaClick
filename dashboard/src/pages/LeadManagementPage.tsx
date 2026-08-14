import { useState, useMemo } from 'react';
import {
  Search, Download, ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  MOCK_LEADS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_STYLES,
  PRIORITY_STYLES,
  type Lead,
  type LeadStatus,
  type LeadPriority,
} from '@/data/mockLeads';

type SortKey = keyof Lead | null;
type SortDir  = 'asc' | 'desc';

const ALL_STATUSES: LeadStatus[] = [
  'new_lead', 'contacted', 'follow_up', 'documents_requested',
  'documents_received', 'quotation_shared', 'interested',
  'converted', 'not_interested', 'lost',
];
const ALL_PRIORITIES: LeadPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
const ALL_SOURCES = Array.from(new Set(MOCK_LEADS.map((l) => l.source))).sort();
const ALL_EMPLOYEES = Array.from(new Set(MOCK_LEADS.map((l) => l.assignedTo))).sort();

/* ── tiny select component ─────────────────────────────────────────────────── */
function FilterSelect({
  value, onChange, label, options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 pl-3 pr-8 rounded-md border border-border bg-card text-sm text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer min-w-[120px]"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
    </div>
  );
}

/* ── sort icon ──────────────────────────────────────────────────────────────── */
function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/40 ml-1 shrink-0" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-primary ml-1 shrink-0" />
    : <ChevronDown className="w-3 h-3 text-primary ml-1 shrink-0" />;
}

const LeadManagementPage = () => {
  const [query,    setQuery]    = useState('');
  const [status,   setStatus]   = useState('');
  const [employee, setEmployee] = useState('');
  const [source,   setSource]   = useState('');
  const [priority, setPriority] = useState('');
  const [sortKey,  setSortKey]  = useState<SortKey>(null);
  const [sortDir,  setSortDir]  = useState<SortDir>('asc');

  const handleSort = (key: keyof Lead) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const rows = useMemo(() => {
    let list = MOCK_LEADS.filter((l) => {
      const q = query.toLowerCase();
      const matchQ = !q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.phone.includes(q);
      const matchS = !status   || l.status     === status;
      const matchE = !employee || l.assignedTo === employee;
      const matchSrc = !source   || l.source   === source;
      const matchP = !priority || l.priority  === priority;
      return matchQ && matchS && matchE && matchSrc && matchP;
    });
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [query, status, employee, source, priority, sortKey, sortDir]);

  const thBase = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap select-none';
  const thSort = `${thBase} cursor-pointer hover:text-foreground transition-colors`;

  return (
    <div className="space-y-5">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, company, mobile…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Filters */}
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="All Status"
          options={ALL_STATUSES.map((s) => LEAD_STATUS_LABELS[s])}
        />
        <FilterSelect
          value={employee}
          onChange={setEmployee}
          label="All Employee"
          options={ALL_EMPLOYEES}
        />
        <FilterSelect
          value={source}
          onChange={setSource}
          label="All Source"
          options={ALL_SOURCES}
        />
        <FilterSelect
          value={priority}
          onChange={setPriority}
          label="All Priority"
          options={ALL_PRIORITIES}
        />

        {/* Export */}
        <button
          onClick={() => toast.info('Export is coming soon.')}
          className="flex items-center gap-1.5 h-9 px-4 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors ml-auto"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {/* New Lead (mobile) */}
        <button
          onClick={() => toast.info('Add Lead is coming soon.')}
          className="sm:hidden flex items-center gap-1.5 h-9 px-4 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Lead
        </button>
      </div>

      {/* ── Count ───────────────────────────────────────────────────────────── */}
      <p className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-semibold text-foreground">{rows.length}</span>{' '}
        of{' '}
        <span className="font-semibold text-foreground">{MOCK_LEADS.length}</span>{' '}
        leads
      </p>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className={thSort} onClick={() => handleSort('id')}>
                  <span className="flex items-center">Lead ID <SortIcon col="id" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('name')}>
                  <span className="flex items-center">Lead <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('company')}>
                  <span className="flex items-center">Company <SortIcon col="company" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thBase}>Contact</th>
                <th className={thSort} onClick={() => handleSort('city')}>
                  <span className="flex items-center">City <SortIcon col="city" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('service')}>
                  <span className="flex items-center">Interested Service <SortIcon col="service" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('source')}>
                  <span className="flex items-center">Source <SortIcon col="source" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('assignedTo')}>
                  <span className="flex items-center">Assigned <SortIcon col="assignedTo" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('priority')}>
                  <span className="flex items-center">Priority <SortIcon col="priority" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('status')}>
                  <span className="flex items-center">Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('followUp')}>
                  <span className="flex items-center">Follow-up <SortIcon col="followUp" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thBase}></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-16 text-muted-foreground text-sm">
                    No leads match your filters.
                  </td>
                </tr>
              ) : (
                rows.map((lead) => {
                  const ss = LEAD_STATUS_STYLES[lead.status];
                  const ps = PRIORITY_STYLES[lead.priority];
                  return (
                    <tr key={lead.id} className="hover:bg-muted/30 transition-colors">

                      {/* Lead ID */}
                      <td className="px-4 py-3 text-muted-foreground text-xs font-medium whitespace-nowrap">
                        <div>{lead.id.split('-')[0]}-</div>
                        <div>{lead.id.split('-')[1]}</div>
                      </td>

                      {/* Lead name + avatar */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {lead.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground leading-tight">{lead.name.split(' ')[0]}</div>
                            <div className="text-muted-foreground text-[11px]">{lead.name.split(' ').slice(1).join(' ')}</div>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3 text-foreground whitespace-nowrap text-xs leading-snug">
                        {lead.company.split(' ').map((w, i) => (
                          <span key={i} className="block">{w}</span>
                        ))}
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-foreground text-xs">
                          <span className="text-muted-foreground">📞</span> {lead.phone}
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 text-[11px] mt-0.5">
                          <span className="text-muted-foreground">✉</span> {lead.email}
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm">
                        {lead.city}
                      </td>

                      {/* Service */}
                      <td className="px-4 py-3 text-foreground text-xs leading-snug max-w-[130px]">
                        {lead.service}
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm">
                        {lead.source}
                      </td>

                      {/* Assigned */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-xs leading-snug">
                        {lead.assignedTo.split(' ').map((w, i) => (
                          <span key={i} className="block">{w}</span>
                        ))}
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ps.bg} ${ps.text}`}>
                          {lead.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ss.bg} ${ss.text}`}>
                          {LEAD_STATUS_LABELS[lead.status]}
                        </span>
                      </td>

                      {/* Follow-up */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-xs">
                        {lead.followUp}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => toast.info('Actions coming soon.')}
                          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {rows.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing {rows.length} of {MOCK_LEADS.length} leads
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadManagementPage;
