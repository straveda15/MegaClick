import { useMemo, useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { ChevronLeft, ChevronRight, Loader2, Wallet } from 'lucide-react';

const PAGE_SIZE = 15;

export default function AccountsPage() {
  const { data: leads, isLoading } = useLeads();
  const [page, setPage] = useState(1);

  const accounts = useMemo(() => {
    if (!leads) return [];
    
    return leads.map(l => {
      const totalQuotation = (l.services || []).reduce((sum, s) => sum + (s.quotation || 0), 0);
      return {
        _id: l._id,
        name: l.customer?.name || l.customer?.phone || 'Unnamed',
        company: l.customer?.company || '',
        phone: l.customer?.phone || '',
        email: l.customer?.email || '',
        services: l.services || [],
        totalQuotation
      };
    });
  }, [leads]);

  const totalPages = Math.max(1, Math.ceil(accounts.length / PAGE_SIZE));
  const pagedAccounts = accounts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-8 w-full space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-card border-dashed">
          <Wallet className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No accounts found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-[400px]">
            Once leads have been added, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Contact Info</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Services & Quotations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pagedAccounts.map(account => (
                  <tr key={account._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <span className="block font-medium text-foreground">{account.name}</span>
                      <span className="block text-xs text-muted-foreground">{account.company || 'Individual'}</span>
                    </td>
                    <td className="px-4 py-3 align-top text-xs">
                      <span className="block text-foreground">{account.phone}</span>
                      <span className="block text-muted-foreground">{account.email || 'No email provided'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {account.services.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No services</span>
                      ) : (
                        <div className="space-y-1">
                          {account.services.map((service, i) => (
                            <div key={i} className="flex justify-between text-xs max-w-[250px]">
                              <span className="text-muted-foreground">{service.title}</span>
                              <span className="font-medium text-foreground">
                                {service.quotation !== undefined && service.quotation !== null 
                                  ? service.quotation.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) 
                                  : 'Not set'}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between text-xs max-w-[250px] pt-1.5 mt-1.5 border-t border-dashed border-border font-semibold">
                            <span className="text-foreground">Total</span>
                            <span className="text-foreground">{account.totalQuotation.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing {accounts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, accounts.length)} of {accounts.length} accounts
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
      )}
    </div>
  );
}
