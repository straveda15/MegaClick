import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useServiceCatalog } from "@/hooks/useServiceCatalog";
import { useServiceFees, useSaveServiceFee, FeeItem } from "@/hooks/useServiceFees";

interface SetFeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialServiceSlug?: string | null;
}

const DEFAULT_FEES: FeeItem[] = [
  { name: "Stamp Duty", amount: 0 },
  { name: "Registration", amount: 0 },
  { name: "Doc Handling", amount: 0 },
  { name: "Legal Fee", amount: 0 },
];

export function SetFeeModal({ open, onOpenChange, initialServiceSlug }: SetFeeModalProps) {
  const { data: catalog, isLoading: catalogLoading } = useServiceCatalog();
  const { data: feesData } = useServiceFees();
  const { mutate: saveFee, isPending: saving } = useSaveServiceFee();

  const [selectedService, setSelectedService] = useState<string>("");
  const [fees, setFees] = useState<FeeItem[]>([]);

  // When modal opens or initial slug changes
  useEffect(() => {
    if (open) {
      if (initialServiceSlug) {
        setSelectedService(initialServiceSlug);
        loadFeesForService(initialServiceSlug);
      } else {
        setSelectedService("");
        setFees([...DEFAULT_FEES]);
      }
    }
  }, [open, initialServiceSlug, feesData]);

  const loadFeesForService = (slug: string) => {
    const existing = feesData?.find((f) => f.serviceSlug === slug);
    if (existing && existing.fees.length > 0) {
      setFees(existing.fees.map(f => ({ ...f })));
    } else {
      setFees([...DEFAULT_FEES]);
    }
  };

  const handleServiceSelect = (slug: string) => {
    setSelectedService(slug);
    loadFeesForService(slug);
  };

  const handleAddFee = () => {
    setFees([...fees, { name: "", amount: 0 }]);
  };

  const handleRemoveFee = (index: number) => {
    setFees(fees.filter((_, i) => i !== index));
  };

  const handleFeeChange = (index: number, field: keyof FeeItem, value: string) => {
    const newFees = [...fees];
    if (field === "amount") {
      newFees[index].amount = value === "" ? 0 : Number(value);
    } else {
      newFees[index].name = value;
    }
    setFees(newFees);
  };

  const handleSave = () => {
    if (!selectedService) return;
    saveFee(
      { serviceSlug: selectedService, fees },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Set Service Fee</DialogTitle>
          <DialogDescription>
            Select a service and configure its dynamic fees.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Service</label>
            {catalogLoading ? (
              <div className="h-10 flex items-center px-3 border rounded-md text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading services...
              </div>
            ) : (
              <Select value={selectedService} onValueChange={handleServiceSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                  {catalog?.services.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Fees Configuration</label>
            
            {fees.length === 0 && (
              <div className="text-sm text-muted-foreground py-4 text-center border rounded-lg bg-muted/30">
                No fees configured. Click the plus icon to add one.
              </div>
            )}

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {fees.map((fee, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Fee Name (e.g. Stamp Duty)"
                    value={fee.name}
                    onChange={(e) => handleFeeChange(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Amount"
                    value={fee.amount === 0 ? "" : fee.amount}
                    onChange={(e) => handleFeeChange(index, "amount", e.target.value)}
                    className="w-[120px]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => handleRemoveFee(index)}
                    title="Remove fee"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-2 border-dashed"
              onClick={handleAddFee}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Fee
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !selectedService}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Fees
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
