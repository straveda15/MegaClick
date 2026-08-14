import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE = `${API_BASE}/api/v1/product-costs`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ExtraCost {
  label: string;
  amount: number;
  grams: number;
  unit?: string;
  // "herb" → rendered in the Herbs section; undefined/"extra" → generic extra cost.
  kind?: "herb" | "extra";
}

export interface ProductCostConfig {
  _id?: string;
  productId?: string;
  isCustom?: boolean;
  customName?: string;
  powderCostPerGram: number;
  powderGrams: number;
  packagingCost: number;
  packagingGrams: number;
  sideLabelCost: number;
  sideLabelGrams: number;
  upperLabelCost: number;
  upperLabelGrams: number;
  spoonCost: number;
  spoonGrams: number;
  shippingCharges: number;
  shippingGrams: number;
  jarCost: number;
  jarGrams: number;
  plasticSleevesCost: number;
  plasticSleevesGrams: number;
  courierBagCost: number;
  courierBagGrams: number;
  tapeCost: number;
  tapeGrams: number;
  bubbleSheetCost: number;
  bubbleSheetGrams: number;
  extraCosts: ExtraCost[];
  finalCost: number | null;
  powderUnit?: string;
  jarUnit?: string;
  packagingUnit?: string;
  sideLabelUnit?: string;
  upperLabelUnit?: string;
  spoonUnit?: string;
  shippingUnit?: string;
  plasticSleevesUnit?: string;
  courierBagUnit?: string;
  tapeUnit?: string;
  bubbleSheetUnit?: string;
}

export interface ProductCostEntry {
  product: {
    _id: string;
    name: string;
    price: number;
    orig?: number;
    slug: string;
  };
  cost: ProductCostConfig | null;
  computedTotal: number;
  effectiveCost: number;
}

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useProductCosts() {
  return useQuery<ProductCostEntry[]>({
    queryKey: ["product-costs"],
    queryFn: async () => {
      const res = await fetch(BASE, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch product costs");
      return data.data ?? [];
    },
  });
}

export function useUpsertProductCost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, payload }: { productId: string; payload: Partial<ProductCostConfig> }) => {
      const res = await fetch(`${BASE}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save cost config");
      return data.data as ProductCostEntry;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-costs"] }),
  });
}

// ── Helper: compute total from a cost config ───────────────────────────────

export function computeTotal(cost: Partial<ProductCostConfig>): number {
  const getVal = (price: number | undefined, qty: number | undefined, unit?: string) => {
    const p = price || 0;
    const q = qty || 0;
    // Weight/volume components: `price` is the TOTAL paid for `qty` of that unit
    // (e.g. ₹7000 for 500 g), so the component contributes that price as-is.
    if (unit === "g" || unit === "kg" || unit === "ltr") {
      return p;
    }
    // Unit-count components: `price` is per unit, `qty` is the count.
    // qty 0 → treat as a single flat charge.
    return q === 0 ? p : p * q;
  };

  const powder = getVal(cost.powderCostPerGram, cost.powderGrams, cost.powderUnit);
  const fixed =
    getVal(cost.packagingCost,      cost.packagingGrams,      cost.packagingUnit) +
    getVal(cost.sideLabelCost,      cost.sideLabelGrams,      cost.sideLabelUnit) +
    getVal(cost.upperLabelCost,     cost.upperLabelGrams,     cost.upperLabelUnit) +
    getVal(cost.spoonCost,          cost.spoonGrams,          cost.spoonUnit) +
    getVal(cost.shippingCharges,    cost.shippingGrams,       cost.shippingUnit) +
    getVal(cost.jarCost,            cost.jarGrams,            cost.jarUnit) +
    getVal(cost.plasticSleevesCost, cost.plasticSleevesGrams, cost.plasticSleevesUnit) +
    getVal(cost.courierBagCost,     cost.courierBagGrams,     cost.courierBagUnit) +
    getVal(cost.tapeCost,           cost.tapeGrams,           cost.tapeUnit) +
    getVal(cost.bubbleSheetCost,    cost.bubbleSheetGrams,    cost.bubbleSheetUnit);
    
  const extras = (cost.extraCosts || []).reduce((s, e) => {
      // Weight/volume → amount is the total for that quantity; units → per-unit × count.
      if (e.unit === "g" || e.unit === "kg" || e.unit === "ltr") {
        return s + (e.amount || 0);
      }
      const q = e.grams || 0;
      return s + (e.amount || 0) * (q || 1);
  }, 0);
  
  return parseFloat((powder + fixed + extras).toFixed(2));
}
