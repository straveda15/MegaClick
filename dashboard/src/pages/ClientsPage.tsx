import { useState } from 'react';
import { Search, Download, ChevronUp, ChevronDown, ChevronsUpDown, Plus } from 'lucide-react';
import { MOCK_CLIENTS, type Client } from '@/data/mockClients';
import { STATUS_LABELS } from '@/components/dashboard/StatusPill';
import type { StatusKey } from '@/components/dashboard/StatusPill';
import { toast } from 'sonner';

// ── Status badge styles ──────────────────────────────────────────────────────
const STATUS_STYLES: Record<StatusKey, { bg: string; text: string }> = {
  documents_pending:      { bg: 'bg-amber-100',  text: 'text-amber-700' },
  documents_received:     { bg: 'bg-blue-100',   text: 'text-blue-700'  },
  in_progress:            { bg: 'bg-blue-100',   text: 'text-blue-700'  },
  application_submitted:  { bg: 'bg-sky-100',    text: 'text-sky-700'   },
  government_verification:{ bg: 'bg-purple-100', text: 'text-purple-700'},
  approval_received:      { bg: 'bg-green-100',  text: 'text-green-700' },
  completed:              { bg: 'bg-emerald-100',text: 'text-emerald-700'},
  pending:                { bg: 'bg-gray-100',   text: 'text-gray-600'  },
  waiting_review:         { bg: 'bg-amber-100',  text: 'text-amber-700' },
  rejected:               { bg: 'bg-red-100',    text: 'text-red-700'   },
};

type SortKey = keyof Client | null;
type SortDir = 'asc' | 'desc';

const ClientsPage = () => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // ── Sort handler ─────────────────────────────────────────────────────────
  const handleSort = (key: keyof Client) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // ── Filter + sort ─────────────────────────────────────────────────────────
  const filtered = MOCK_CLIENTS.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  // ── Sort icon helper ──────────────────────────────────────────────────────
  const SortIcon = ({ colKey }: { colKey: keyof Client }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/50 ml-1 shrink-0" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-primary ml-1 shrink-0" />
      : <ChevronDown className="w-3 h-3 text-primary ml-1 shrink-0" />;
  };

  const thClass =
    'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap cursor-pointer select-none';

  return (
    <div className="space-y-5">
      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients by name, business, phone…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Export */}
        <button
          onClick={() => toast.info('Export is coming soon.')}
          className="flex items-center gap-1.5 h-9 px-4 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {/* New Client (mobile) */}
        <button
          onClick={() => toast.info('Add Client is coming soon.')}
          className="sm:hidden ml-auto flex items-center gap-1.5 h-9 px-4 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Client
        </button>
      </div>

      {/* ── Table card ─────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className={thClass} onClick={() => handleSort('id')}>
                  <span className="flex items-center">Client ID <SortIcon colKey="id" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('name')}>
                  <span className="flex items-center">Client <SortIcon colKey="name" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('company')}>
                  <span className="flex items-center">Business <SortIcon colKey="company" /></span>
                </th>
                <th className={thClass}>Contact</th>
                <th className={thClass} onClick={() => handleSort('city')}>
                  <span className="flex items-center">City <SortIcon colKey="city" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('assigned')}>
                  <span className="flex items-center">Assigned <SortIcon colKey="assigned" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('serviceTag')}>
                  <span className="flex items-center">Current Service <SortIcon colKey="serviceTag" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('status')}>
                  <span className="flex items-center">Status <SortIcon colKey="status" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('pendingDocs')}>
                  <span className="flex items-center">Pending Docs <SortIcon colKey="pendingDocs" /></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-muted-foreground text-sm">
                    No clients found matching "{query}".
                  </td>
                </tr>
              ) : (
                sorted.map((client) => {
                  const st = STATUS_STYLES[client.status];
                  const pendingStr =
                    client.pendingDocs === 'All received'
                      ? 'All received'
                      : `${client.pendingDocs} pending`;
                  const pendingColor =
                    client.pendingDocs === 'All received'
                      ? 'text-green-600'
                      : 'text-orange-500';

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Client ID */}
                      <td className="px-4 py-3 text-muted-foreground text-xs font-medium whitespace-nowrap">
                        {client.id}
                      </td>

                      {/* Client name + avatar */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {client.initials}
                          </div>
                          <span className="font-semibold text-foreground">{client.name}</span>
                        </div>
                      </td>

                      {/* Business */}
                      <td className="px-4 py-3 text-blue-600 font-medium whitespace-nowrap">
                        {client.company}
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-foreground text-xs leading-tight">{client.phone}</div>
                        <div className="text-muted-foreground text-[11px]">{client.email}</div>
                      </td>

                      {/* City */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground">
                        {client.city}
                      </td>

                      {/* Assigned */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground">
                        {client.assigned}
                      </td>

                      {/* Current Service */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground">
                        {client.serviceTag}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}
                        >
                          {STATUS_LABELS[client.status]}
                        </span>
                      </td>

                      {/* Pending Docs */}
                      <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${pendingColor}`}>
                        {pendingStr}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {sorted.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing {sorted.length} of {MOCK_CLIENTS.length} clients
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
