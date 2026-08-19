import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, IndianRupee, Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateServiceQuotation, type SalesLead, type LeadService } from '@/hooks/useLeads';

interface QuotationDialogProps {
  lead: SalesLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuotationDialog({ lead, open, onOpenChange }: QuotationDialogProps) {
  const [quotations, setQuotations] = useState<Record<string, string>>({});
  /** Tracks which services have been *confirmed* in this session OR were already set */
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const updateQuotation = useUpdateServiceQuotation();

  // Initialize state when lead changes or dialog opens
  useEffect(() => {
    if (open && lead) {
      const initial: Record<string, string> = {};
      const initialConfirmed: Record<string, boolean> = {};
      lead.services?.forEach((s) => {
        initial[s._id] = s.quotation !== undefined ? String(s.quotation) : '';
        if (s.quotationConfirmed === true) {
          initialConfirmed[s._id] = true;
        }
      });
      setQuotations(initial);
      setConfirmed(initialConfirmed);
      setEditing({});
    }
  }, [open, lead]);

  const handleUpdate = (service: LeadService) => {
    if (!lead) return;

    const val = quotations[service._id];
    if (!val || isNaN(Number(val))) {
      toast.error('Please enter a valid amount');
      return;
    }

    updateQuotation.mutate(
      { leadId: lead._id, serviceId: service._id, quotation: Number(val) },
      {
        onSuccess: () => {
          toast.success(`Quotation for ${service.title} confirmed.`);
          setConfirmed((prev) => ({ ...prev, [service._id]: true }));
          setEditing((prev) => ({ ...prev, [service._id]: false }));
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Failed to update quotation');
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Quotations for {lead?.customer?.name || 'Lead'}</DialogTitle>
          <DialogDescription>
            Set the final agreed quotation amount for each service requested by this client.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {(!lead?.services || lead.services.length === 0) ? (
            <p className="text-sm text-muted-foreground text-center py-4">No services found for this lead.</p>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
              {lead.services.map((service) => {
                const isConfirmed = confirmed[service._id] && !editing[service._id];

                return (
                  <div key={service._id} className="p-4 bg-card flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="block font-medium text-foreground truncate">{service.title}</span>
                      <span className="block text-xs text-muted-foreground">{service.category}</span>
                    </div>

                    {isConfirmed ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
                          <CheckCircle2 className="w-4 h-4" />
                          {Number(quotations[service._id]).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} — Confirmed
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative w-36">
                          <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={quotations[service._id] || ''}
                            onChange={(e) => setQuotations({ ...quotations, [service._id]: e.target.value })}
                            className="pl-8"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(service)}
                          disabled={updateQuotation.isPending}
                        >
                          {updateQuotation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
