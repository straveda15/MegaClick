import { useState } from "react";
import {
  Archive,
  Search,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Package,
  Settings2,
} from "lucide-react";
import { useOperationsInventory, useUpdateInventoryThreshold } from "@/hooks/useOperations";

const statusBadgeClass: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700",
  low_stock: "bg-amber-100 text-amber-700",
  out_of_stock: "bg-red-100 text-red-700",
};

const statusLabel: Record<string, string> = {
  available: "Available",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

const OperationsInventoryPage = () => {
  const [search, setSearch] = useState("");
  const [showThresholdPanel, setShowThresholdPanel] = useState(false);
  const { data: inventory = [], isLoading, refetch, isFetching } =
    useOperationsInventory();
  const updateThreshold = useUpdateInventoryThreshold();

  // Derive current threshold from DB (reorderLevel on first item); default 10
  const currentThreshold = inventory[0]?.reorderLevel ?? 10;
  const [thresholdInput, setThresholdInput] = useState<string>("");
  const [thresholdError, setThresholdError] = useState<string | null>(null);

  // Sync input when inventory first loads
  const [inputSynced, setInputSynced] = useState(false);
  if (!inputSynced && inventory.length > 0) {
    setThresholdInput(String(currentThreshold));
    setInputSynced(true);
  }

  const getEffectiveStatus = (item: any): string => {
    if (item.available <= 0) return "out_of_stock";
    if (item.available <= (item.reorderLevel ?? 10)) return "low_stock";
    return item.status || "available";
  };

  const filtered = inventory.filter((item) => {
    const q = search.toLowerCase();
    return [item.productName, item.slug, item.sku]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLowerCase().includes(q));
  });

  const lowStockCount = inventory.filter((item) => getEffectiveStatus(item) === "low_stock").length;
  const availableCount = inventory.filter((item) => getEffectiveStatus(item) === "available").length;
  const outOfStockCount = inventory.filter((item) => getEffectiveStatus(item) === "out_of_stock").length;

  const handleApplyThreshold = () => {
    const val = parseInt(thresholdInput, 10);
    if (isNaN(val)) {
      setThresholdError("Invalid number");
      return;
    }
    if (val < 0) {
      setThresholdError("Must be positive");
      return;
    }

    setThresholdError(null);
    updateThreshold.mutate(
      { threshold: val },
      {
        onSuccess: () => {
          setShowThresholdPanel(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground animate-pulse">
        Loading operations inventory...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h1 className="page-title">Operations Inventory</h1>
          <p className="page-subtitle">
            Live finished-goods stock used by checkout and product cards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowThresholdPanel((v) => !v);
              setThresholdError(null);
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Threshold: {currentThreshold}
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {showThresholdPanel && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs font-bold text-amber-800 mb-1">Out-of-stock Threshold</p>
            <p className="text-[11px] text-amber-700">Items with stock below this number will be marked as out of stock on the website.</p>
          </div>
          <div className="flex flex-col ml-auto">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={thresholdInput}
                onChange={(e) => {
                  setThresholdInput(e.target.value);
                  if (thresholdError) setThresholdError(null);
                }}
                className={`w-24 h-8 px-3 rounded-md border bg-white text-sm font-mono focus:outline-none focus:ring-1 ${
                  thresholdError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-amber-300 focus:ring-amber-400"
                }`}
              />
              <button
                onClick={handleApplyThreshold}
                disabled={updateThreshold.isPending}
                className="h-8 px-4 rounded-md bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {updateThreshold.isPending ? "Saving…" : "Apply"}
              </button>
            </div>
            {thresholdError && (
              <p className="text-[10px] text-red-600 mt-1 font-medium">{thresholdError}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="kpi-card bg-card border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold">{inventory.length}</div>
            <div className="text-xs text-muted-foreground">Tracked SKUs</div>
          </div>
        </div>
        <div className="kpi-card bg-card border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold">{lowStockCount}</div>
            <div className="text-xs text-muted-foreground">Low stock alerts</div>
          </div>
        </div>
        <div className="kpi-card bg-card border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold">{availableCount}</div>
            <div className="text-xs text-muted-foreground">Ready to sell</div>
          </div>
        </div>
        <div className="kpi-card bg-card border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold">{outOfStockCount}</div>
            <div className="text-xs text-muted-foreground">Out of stock</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product or SKU..."
            className="w-full h-9 pl-9 pr-4 rounded-md border border-border bg-muted/50 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="kpi-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {[
                "Product",
                "SKU",
                "Available",
                "Reserved",
                "Reorder At",
                "Last Updated",
                "Status",
              ].map((heading) => (
                <th
                  key={heading}
                  className="table-header text-left pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <Package className="w-8 h-8 mx-auto opacity-20 mb-2" />
                  No products matching your search
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item._id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-4 pr-4">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.slug || item.productId}
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-mono text-xs">{item.sku}</td>
                  <td className="py-4 pr-4 font-semibold">{item.available}</td>
                  <td className="py-4 pr-4">{item.reserved}</td>
                  <td className="py-4 pr-4">{item.reorderLevel}</td>
                  <td className="py-4 pr-4 text-xs text-muted-foreground">
                    {new Date(item.lastUpdated).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        statusBadgeClass[getEffectiveStatus(item)] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {statusLabel[getEffectiveStatus(item)] || getEffectiveStatus(item)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperationsInventoryPage;
