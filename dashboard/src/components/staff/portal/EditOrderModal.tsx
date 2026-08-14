import { useState, useEffect, useMemo } from "react";
import {
  X, Loader2, AlertTriangle, Minus, Plus, Trash2, Save,
  Search, Package, ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useOrderById, useOrderEditStatus, useEditOrder } from "@/hooks/useOrders";
import { useAuth } from "@/context/AuthContext";
import { useProducts, type Product } from "@/hooks/useProducts";
import { useOperationsInventory } from "@/hooks/useOperations";

// ── Permission check (mirrors backend canUserEditOrder) ───────────────────────
function canUserEditOrder(user: any): boolean {
  if (!user) return false;
  if (user.role === "admin" || user.role === "dispatch_staff") return true;
  if (user.role === "employee") {
    const ops: string[] = user.operationalRoles ?? [];
    if (
      ops.includes("dispatch") ||
      ops.includes("ops_staff") ||
      user.currentOperationalRole === "ops_staff" ||
      user.currentOperationalRole === "dispatch"
    ) return true;
    if (user.departmentRole === "sales" || user.departmentRole === "dispatch") return true;
  }
  return false;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface EditItem {
  productId: string;
  productName: string;
  priceAtPurchase: number;
  quantity: number;
  variant?: { name: string; value: string } | null;
  weight?: number | null;
}

interface ShippingForm {
  firstName: string; lastName: string; phone: string;
  addressLine1: string; addressLine2: string;
  city: string; state: string; postalCode: string;
}

interface PricingForm {
  discountAmount: string;
  couponCode: string;
  deliveryCharge: string;
}

interface EditOrderModalProps {
  orderId: string;
  orderNumber: string;
  packagingStatus?: string;
  onClose: () => void;
}

// ── Status badge config ───────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending:     { label: "Pending", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  in_progress: { label: "Packing", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"   },
  packed:      { label: "Packed",  cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export function EditOrderModal({ orderId, orderNumber, packagingStatus, onClose }: EditOrderModalProps) {
  // [DEBUG] Log the orderId that was passed in from PackagingOrdersView
  console.log("[EditOrderModal] mounted — orderId prop:", orderId, "| orderNumber prop:", orderNumber);

  const { user } = useAuth();
  const { data: order, isLoading: orderLoading, error: orderError } = useOrderById(orderId);
  const { data: editStatus, isLoading: statusLoading } = useOrderEditStatus(orderId);

  // [DEBUG] Log every render so we can see when order arrives
  console.log("[EditOrderModal] render — user.role:", user?.role, "| orderLoading:", orderLoading, "| order:", order ?? "undefined", "| orderError:", (orderError as any)?.message ?? null);
  const { data: inventory } = useOperationsInventory();
  const { data: products = [] } = useProducts();
  const editMutation = useEditOrder();

  const [confirmed, setConfirmed] = useState(false);
  const [items, setItems] = useState<EditItem[]>([]);
  const [originalItems, setOriginalItems] = useState<EditItem[]>([]);
  const [address, setAddress] = useState<ShippingForm>({
    firstName: "", lastName: "", phone: "",
    addressLine1: "", addressLine2: "",
    city: "", state: "", postalCode: "",
  });
  const [notes, setNotes] = useState("");
  const [pricing, setPricing] = useState<PricingForm>({
    discountAmount: "0", couponCode: "", deliveryCharge: "0",
  });

  // Product selector state
  const [showSelector, setShowSelector] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectorQty, setSelectorQty] = useState(1);

  // Initialise form from fetched order
  useEffect(() => {
    console.log("[EditOrderModal useEffect] fired — order:", order ?? "undefined (WILL EXIT EARLY)");
    if (!order) {
      console.log("[EditOrderModal useEffect] order is falsy — returning early, form will NOT be populated");
      return;
    }
    console.log("[EditOrderModal useEffect] order._id:", order._id);
    console.log("[EditOrderModal useEffect] order.items:", JSON.stringify(order.items));
    console.log("[EditOrderModal useEffect] order.shippingAddress:", JSON.stringify(order.shippingAddress));
    console.log("[EditOrderModal useEffect] order.notes:", order.notes);
    console.log("[EditOrderModal useEffect] order.pricing:", JSON.stringify(order.pricing));
    const mapped: EditItem[] = order.items.map((i: any) => ({
      productId: i.productId,
      productName: i.productName,
      priceAtPurchase: i.priceAtPurchase ?? 0,
      quantity: i.quantity,
      variant: i.variant ?? null,
      weight: i.weight ?? null,
    }));
    console.log("[EditOrderModal useEffect] mapped items:", JSON.stringify(mapped));
    setItems(mapped);
    setOriginalItems(mapped);
    const addr = order.shippingAddress ?? {};
    console.log("[EditOrderModal useEffect] addr keys:", Object.keys(addr));
    setAddress({
      firstName:    addr.firstName    ?? "",
      lastName:     addr.lastName     ?? "",
      phone:        addr.phone        ?? "",
      addressLine1: addr.addressLine1 ?? "",
      addressLine2: addr.addressLine2 ?? "",
      city:         addr.city         ?? "",
      state:        addr.state        ?? "",
      postalCode:   addr.postalCode   ?? "",
    });
    setNotes(order.notes ?? "");
    const p = order.pricing ?? {};
    setPricing({
      discountAmount: String(p.discountAmount ?? 0),
      couponCode:     p.couponCode ?? "",
      deliveryCharge: String(p.deliveryCharge ?? 0),
    });
    console.log("[EditOrderModal useEffect] form population COMPLETE");
  }, [order]);

  // Lock background scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Stock map: productId → available ───────────────────────────────────────
  const stockMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!inventory) return map;
    for (const row of inventory) {
      map.set(row.productId, row.available);
    }
    return map;
  }, [inventory]);

  // ── Per-item stock validation ──────────────────────────────────────────────
  function getStockError(item: EditItem): string | null {
    const avail = stockMap.get(item.productId);
    if (avail === undefined) return null; // no stock data — let backend validate
    const orig = originalItems.find(o => o.productId === item.productId);
    const origQty = orig?.quantity ?? 0;
    const delta = item.quantity - origQty; // extra units we need
    if (delta > 0 && delta > avail) {
      return `Only ${avail} unit${avail !== 1 ? "s" : ""} available`;
    }
    return null;
  }

  const hasStockError = items.some(i => getStockError(i) !== null);

  // ── Inventory diff preview ─────────────────────────────────────────────────
  const inventoryDiff = useMemo(() => {
    const result: Array<{ productName: string; delta: number }> = [];
    for (const item of items) {
      const orig = originalItems.find(o => o.productId === item.productId);
      const delta = item.quantity - (orig?.quantity ?? 0);
      if (delta !== 0) result.push({ productName: item.productName, delta });
    }
    // Removed items
    for (const orig of originalItems) {
      if (!items.some(i => i.productId === orig.productId)) {
        result.push({ productName: orig.productName, delta: -orig.quantity });
      }
    }
    return result;
  }, [items, originalItems]);

  // ── Computed totals ───────────────────────────────────────────────────────
  const subtotal    = items.reduce((s, i) => s + i.priceAtPurchase * i.quantity, 0);
  const discount    = Math.max(0, parseFloat(pricing.discountAmount) || 0);
  const delivery    = Math.max(0, parseFloat(pricing.deliveryCharge) || 0);
  const finalAmount = Math.max(0, subtotal - discount + delivery);

  // ── Item helpers ──────────────────────────────────────────────────────────
  function changeQty(idx: number, delta: number) {
    setItems(prev => {
      const next = [...prev];
      const newQty = next[idx].quantity + delta;
      if (newQty < 1) return prev;
      next[idx] = { ...next[idx], quantity: newQty };
      return next;
    });
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  function addProduct() {
    if (!selectedProduct) return;
    const existingIdx = items.findIndex(i => i.productId === selectedProduct._id);
    if (existingIdx >= 0) {
      setItems(prev => {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], quantity: next[existingIdx].quantity + selectorQty };
        return next;
      });
    } else {
      setItems(prev => [...prev, {
        productId:       selectedProduct._id,
        productName:     selectedProduct.name,
        priceAtPurchase: selectedProduct.price,
        quantity:        selectorQty,
        variant:         null,
        weight:          null,
      }]);
    }
    setShowSelector(false);
    setSelectedProduct(null);
    setSelectorQty(1);
    setSearch("");
  }

  // ── Filtered product list ─────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const active = products.filter(p => p.isActive !== false);
    if (!search.trim()) return active;
    const q = search.toLowerCase();
    return active.filter(p =>
      p.name.toLowerCase().includes(q) || (p.sku ?? "").toLowerCase().includes(q)
    );
  }, [products, search]);

  // ── Save ─────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (items.length === 0) { toast.error("Order must have at least one item."); return; }
    if (hasStockError) { toast.error("Fix inventory issues before saving."); return; }
    try {
      await editMutation.mutateAsync({
        orderId,
        payload: {
          items: items.map(i => ({
            productId:       i.productId,
            productName:     i.productName,
            priceAtPurchase: i.priceAtPurchase,
            quantity:        i.quantity,
            ...(i.variant  ? { variant: i.variant }  : {}),
            ...(i.weight != null ? { weight: i.weight } : {}),
          })),
          shippingAddress: {
            firstName:    address.firstName,
            lastName:     address.lastName,
            phone:        address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || undefined,
            city:         address.city,
            state:        address.state,
            postalCode:   address.postalCode,
            country:      "India",
          },
          notes,
          pricing: {
            discountAmount: discount,
            couponCode:     pricing.couponCode.trim() || null,
            deliveryCharge: delivery,
          },
        },
      });
      toast.success("Order updated successfully.");
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  // ── Permission guard ──────────────────────────────────────────────────────
  if (!canUserEditOrder(user)) {
    return (
      <Backdrop onClose={onClose}>
        <Panel orderNumber={orderNumber} packagingStatus={packagingStatus} onClose={onClose}>
          <div className="p-8 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-sm font-semibold">You don't have permission to edit orders.</p>
          </div>
        </Panel>
      </Backdrop>
    );
  }

  const isLoading = orderLoading || statusLoading;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Backdrop onClose={onClose}>
        <Panel orderNumber={orderNumber} packagingStatus={packagingStatus} onClose={onClose}>
          <div className="p-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </Panel>
      </Backdrop>
    );
  }

  // ── Edit blocked ──────────────────────────────────────────────────────────
  if (editStatus && !editStatus.canEdit) {
    return (
      <Backdrop onClose={onClose}>
        <Panel orderNumber={orderNumber} packagingStatus={packagingStatus} onClose={onClose}>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-300">Order cannot be edited</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                  {editStatus.reason ?? "Shipment already booked. Order can no longer be edited."}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </div>
        </Panel>
      </Backdrop>
    );
  }

  // ── Warning confirmation ──────────────────────────────────────────────────
  if (editStatus?.warning && !confirmed) {
    return (
      <Backdrop onClose={onClose}>
        <Panel orderNumber={orderNumber} packagingStatus={packagingStatus} onClose={onClose}>
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Confirm Edit</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">{editStatus.warning}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setConfirmed(true)}>Proceed with Edit</Button>
            </div>
          </div>
        </Panel>
      </Backdrop>
    );
  }

  // ── Product Selector view (replaces main form) ────────────────────────────
  if (showSelector) {
    return (
      <Backdrop onClose={onClose}>
        <Panel orderNumber={orderNumber} packagingStatus={packagingStatus} onClose={onClose}>
          {/* Selector sub-header */}
          <div className="px-6 py-3.5 border-b border-border flex items-center gap-2.5 flex-shrink-0 bg-muted/30">
            <button
              onClick={() => { setShowSelector(false); setSelectedProduct(null); setSearch(""); setSelectorQty(1); }}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold">Add Product</span>
          </div>

          {/* Search */}
          <div className="px-6 pt-4 pb-3 border-b border-border flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or SKU…"
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          {/* Product list */}
          <div className="overflow-y-auto flex-1 min-h-0 px-5 py-4 space-y-1.5 scroll-smooth">
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">No products found.</p>
            ) : (
              filteredProducts.map(product => {
                const avail = stockMap.get(product._id);
                const alreadyInOrder = items.some(i => i.productId === product._id);
                const isSelected = selectedProduct?._id === product._id;
                return (
                  <div key={product._id}>
                    <button
                      onClick={() => { setSelectedProduct(isSelected ? null : product); setSelectorQty(1); }}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-border hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-border/50">
                        {product.img
                          ? <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                          : <Package className="w-4 h-4 m-auto mt-3 text-muted-foreground" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {product.sku && (
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {product.sku}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">₹{product.price.toLocaleString("en-IN")}</span>
                          {avail !== undefined && (
                            <span className={`text-xs font-medium ${avail > 5 ? "text-emerald-600" : avail > 0 ? "text-amber-600" : "text-red-500"}`}>
                              {avail} in stock
                            </span>
                          )}
                          {alreadyInOrder && (
                            <span className="text-[10px] text-primary font-medium">Already in order</span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Inline qty picker when product is selected */}
                    {isSelected && (
                      <div className="mx-2 mt-1 mb-2 p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectorQty(q => Math.max(1, q - 1))}
                            className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{selectorQty}</span>
                          <button
                            onClick={() => setSelectorQty(q => q + 1)}
                            className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <Button size="sm" onClick={addProduct} className="h-8 px-5 text-xs font-bold">
                          {alreadyInOrder ? `Add ${selectorQty} More` : "Add to Order"}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Panel>
      </Backdrop>
    );
  }

  // ── Main edit form ────────────────────────────────────────────────────────
  return (
    <Backdrop onClose={onClose}>
      <Panel orderNumber={orderNumber} packagingStatus={packagingStatus} onClose={onClose}>

        {/* Scrollable body — fills remaining space, stops above the fixed footer */}
        <div className="overflow-y-auto flex-1 min-h-0 px-6 pt-6 pb-28 space-y-8 scroll-smooth">

          {/* ── Customer Details ──────────────────────────────────────────── */}
          <Section title="Customer Details">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name">
                <input value={address.firstName} onChange={e => setAddress(a => ({ ...a, firstName: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Last Name">
                <input value={address.lastName} onChange={e => setAddress(a => ({ ...a, lastName: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Phone" className="col-span-2">
                <input type="tel" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Address Line 1" className="col-span-2">
                <input value={address.addressLine1} onChange={e => setAddress(a => ({ ...a, addressLine1: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Address Line 2 (optional)" className="col-span-2">
                <input value={address.addressLine2} onChange={e => setAddress(a => ({ ...a, addressLine2: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="City">
                <input value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="State">
                <input value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Pincode" className="col-span-2">
                <input value={address.postalCode} onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))} className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── Order Items ───────────────────────────────────────────────── */}
          <Section title="Order Items">
            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-4 text-center">No items — add at least one product below.</p>
              ) : (
                items.map((item, idx) => {
                  const avail = stockMap.get(item.productId);
                  const stockErr = getStockError(item);
                  return (
                    <div
                      key={`${item.productId}-${idx}`}
                      className={`border rounded-xl p-3.5 transition-colors ${
                        stockErr
                          ? "border-red-300 bg-red-50/40 dark:border-red-800/60 dark:bg-red-950/10"
                          : "border-border bg-muted/10 dark:bg-muted/5"
                      }`}
                    >
                      {/* Product name + stock + remove */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-snug">{item.productName}</p>
                          {item.variant?.value && (
                            <p className="text-xs text-muted-foreground mt-0.5">{item.variant.value}</p>
                          )}
                          {avail !== undefined ? (
                            <p className={`text-xs mt-1 font-medium ${avail > 5 ? "text-emerald-600" : avail > 0 ? "text-amber-600" : "text-red-500"}`}>
                              {avail} in stock
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground/60 mt-1">Stock: —</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(idx)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Qty stepper + line total */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => changeQty(idx, -1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => changeQty(idx, 1)}
                            className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs text-muted-foreground">× ₹{item.priceAtPurchase.toLocaleString("en-IN")}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground tabular-nums">
                          ₹{(item.priceAtPurchase * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Inline stock error */}
                      {stockErr && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {stockErr}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Product trigger */}
            <button
              onClick={() => setShowSelector(true)}
              className="w-full mt-2 h-10 border border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary dark:hover:border-primary/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </Section>

          {/* ── Inventory Changes preview ─────────────────────────────────── */}
          {inventoryDiff.length > 0 && (
            <Section title="Inventory Changes">
              <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                {inventoryDiff.map((d, i) => (
                  <div key={i} className={`flex items-center justify-between px-3.5 py-2.5 text-sm ${i > 0 ? "border-t border-border/50" : ""}`}>
                    <span className="font-medium text-foreground truncate pr-4">{d.productName}</span>
                    <span className={`text-xs font-bold flex-shrink-0 ${d.delta > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {d.delta > 0 ? `+${d.delta} Reserved` : `${d.delta} Released`}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Preview only — inventory updates on Save.
              </p>
            </Section>
          )}

          {/* ── Notes ────────────────────────────────────────────────────── */}
          <Section title="Notes (optional)">
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Packaging or delivery instructions…"
              className={`${inputCls} resize-none`}
            />
          </Section>

          {/* ── Pricing ──────────────────────────────────────────────────── */}
          <Section title="Pricing">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Discount (₹)">
                <input
                  type="number" min="0"
                  value={pricing.discountAmount}
                  onChange={e => setPricing(p => ({ ...p, discountAmount: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Coupon Code">
                <input
                  value={pricing.couponCode}
                  onChange={e => setPricing(p => ({ ...p, couponCode: e.target.value }))}
                  placeholder="Optional"
                  className={inputCls}
                />
              </Field>
              <Field label="Delivery Charge (₹)" className="col-span-2">
                <input
                  type="number" min="0"
                  value={pricing.deliveryCharge}
                  onChange={e => setPricing(p => ({ ...p, deliveryCharge: e.target.value }))}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Live total summary */}
            <div className="mt-3 rounded-xl bg-muted/20 border border-border p-3.5 space-y-1.5 text-sm">
              <TotalRow label="Subtotal" value={subtotal} />
              {discount > 0 && (
                <TotalRow label={`Discount${pricing.couponCode ? ` (${pricing.couponCode})` : ""}`} value={-discount} />
              )}
              {delivery > 0 && <TotalRow label="Delivery" value={delivery} />}
              <div className="border-t border-border pt-1.5 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{finalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Footer — fixed, never scrolls, always visible ──────────────── */}
        <div className="px-6 py-3.5 border-t border-border bg-background flex-shrink-0 flex items-center justify-between gap-3">
          {hasStockError ? (
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> Fix inventory issues first
            </p>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={editMutation.isPending} className="h-9 px-4">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={editMutation.isPending || items.length === 0 || hasStockError}
              className="h-9 px-4 gap-1.5"
            >
              {editMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </div>
        </div>
      </Panel>
    </Backdrop>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function Backdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      {children}
    </div>
  );
}

function Panel({
  orderNumber, packagingStatus, onClose, children,
}: {
  orderNumber: string;
  packagingStatus?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const badge = packagingStatus ? STATUS_BADGE[packagingStatus] : null;
  return (
    <div
      className="bg-background rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[83vh] border border-border overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      {/* Header — fixed, never scrolls */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3 bg-muted/30 flex-shrink-0">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Edit Order</p>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="font-bold text-foreground text-base leading-tight">{orderNumber}</h3>
            {badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
                {badge.label}
              </span>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
          {title}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </div>
  );
}

function Field({
  label, children, className = "",
}: {
  label: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-muted-foreground text-xs">
      <span>{label}</span>
      <span className={value < 0 ? "text-emerald-600" : ""}>
        {value < 0 ? "−" : ""}₹{Math.abs(value).toLocaleString("en-IN")}
      </span>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 dark:focus:border-blue-500 transition-colors placeholder:text-muted-foreground";
