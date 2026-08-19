import { useState, useMemo, useEffect } from 'react';
import { useServiceCatalog } from '@/hooks/useServiceCatalog';
import { useServiceFees } from '@/hooks/useServiceFees';
import { Loader2, Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetFeeModal } from '@/components/fees/SetFeeModal';

export default function FeesPage() {
  const { data: catalog, isLoading: catalogLoading } = useServiceCatalog();
  const { data: fees, isLoading: feesLoading } = useServiceFees();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = () => handleCreate();
    window.addEventListener('openSetFeeModal', handleOpen);
    return () => window.removeEventListener('openSetFeeModal', handleOpen);
  }, []);

  const isLoading = catalogLoading || feesLoading;

  // Derive a list of services that currently have fees configured
  const configuredServices = useMemo(() => {
    if (!catalog || !fees) return [];
    
    return fees.map(feeItem => {
      const catalogEntry = catalog.services.find(s => s.slug === feeItem.serviceSlug);
      return {
        slug: feeItem.serviceSlug,
        title: catalogEntry?.title || feeItem.serviceSlug,
        category: catalogEntry?.category || "Unknown Category",
        fees: feeItem.fees || [],
        updatedAt: feeItem.updatedAt
      };
    }).filter(s => s.fees.length > 0);
  }, [catalog, fees]);

  const handleEdit = (slug: string) => {
    setEditingSlug(slug);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingSlug(null);
    setModalOpen(true);
  };

  return (
    <div className="p-8 w-full space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : configuredServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-card border-dashed">
          <Settings2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No fees configured</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-[400px]">
            You haven't set up any fees for your services yet. Click the button below to configure your first service fee.
          </p>
          <Button onClick={handleCreate} variant="outline">
            Set Service Fee
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Service</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Fees Breakdown</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground w-[100px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {configuredServices.map(service => {
                  const total = service.fees.reduce((sum, f) => sum + f.amount, 0);
                  
                  return (
                    <tr key={service.slug} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 align-top">
                        <span className="block font-medium text-foreground">{service.title}</span>
                        <span className="block text-xs text-muted-foreground">{service.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {service.fees.map((fee, i) => (
                            <div key={i} className="flex justify-between text-xs max-w-[250px]">
                              <span className="text-muted-foreground">{fee.name}</span>
                              <span className="font-medium text-foreground">{fee.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-xs max-w-[250px] pt-1.5 mt-1.5 border-t border-dashed border-border font-semibold">
                            <span className="text-foreground">Total</span>
                            <span className="text-foreground">{total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right align-top">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleEdit(service.slug)}
                        >
                          Edit Fees
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* The Set Fee Modal */}
      <SetFeeModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        initialServiceSlug={editingSlug} 
      />
    </div>
  );
}
