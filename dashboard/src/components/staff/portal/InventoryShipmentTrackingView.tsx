import { useState, useCallback } from "react";
import { format } from "date-fns";
import {
  ArrowLeft, RefreshCw, ExternalLink, Copy, Check,
  Package, Tag, Calendar, Truck, MapPin, CheckCircle2,
  AlertCircle, XCircle, RotateCcw, PackageOpen,
  Loader2, Search, Clock, UserCheck, Building2,
  Printer, ChevronRight, Phone, FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import OperationsInventoryPage from "@/pages/OperationsInventoryPage";
import {
  useShipments,
  useShipmentByOrder,
  useSyncTracking,
  type Shipment,
  type TimelineEvent,
} from "@/hooks/useShipments";
import { useOrderById } from "@/hooks/useOrders";

// ─── Extended type ────────────────────────────────────────────────────────────
type OrderRef = NonNullable<Shipment["orderId"]> & {
  shippingAddress?: {
    firstName: string; lastName: string; phone: string;
    addressLine1: string; addressLine2?: string;
    city: string; state: string; postalCode: string; country: string;
  };
  items?: Array<{
    productId?: string; productName: string;
    priceAtPurchase: number; quantity: number;
    variant?: { name: string; value: string };
  }>;
  pricing?: { subtotal?: number; discountAmount?: number; finalAmount: number };
  payment?: { paymentMethod?: string };
};

// Shown wherever a shipment outlived the order it points at.
const MISSING_ORDER_LABEL = "Order unavailable";

interface FullShipment extends Omit<Shipment, "orderId"> {
  orderId: OrderRef | null;
  courierName?: string;
  labelUrl?: string;
  providerOrderId?: string;
  pickupScheduledAt?: string;
  weight?: number;
  dimensions?: { length: number; breadth: number; height: number };
  serviceType?: string;
}

// ─── 9-step lifecycle matching backend dispatch flow ──────────────────────────
type LifecycleStep = {
  label: string;
  statuses: string[];
  keywords: string[];
  Icon: React.ElementType;
};

const LIFECYCLE: LifecycleStep[] = [
  { label: "Shipment Created",       statuses: ["CREATED"],               keywords: ["created", "shipment created"],                                Icon: Package      },
  { label: "Courier Assigned",       statuses: ["COURIER_ASSIGNED"],      keywords: ["courier assigned", "assigned"],                               Icon: UserCheck    },
  { label: "AWB Generated",          statuses: [],                        keywords: ["awb", "awb generated", "waybill"],                            Icon: Tag          },
  { label: "Pickup Scheduled",       statuses: ["PICKUP_SCHEDULED"],      keywords: ["pickup scheduled"],                                           Icon: Calendar     },
  { label: "Pickup Completed",       statuses: ["PICKED_UP"],             keywords: ["picked up", "pickup complete", "collected"],                  Icon: PackageOpen  },
  { label: "In Transit",             statuses: ["SHIPPED", "IN_TRANSIT"], keywords: ["in transit", "transit", "shipped"],                           Icon: Truck        },
  { label: "Reached Destination Hub",statuses: [],                        keywords: ["hub", "destination hub", "reached hub", "transit hub"],       Icon: Building2    },
  { label: "Out For Delivery",       statuses: ["OUT_FOR_DELIVERY"],      keywords: ["out for delivery", "out_for_delivery"],                       Icon: MapPin       },
  { label: "Delivered",              statuses: ["DELIVERED"],             keywords: ["delivered", "delivery complete"],                             Icon: CheckCircle2 },
];

const TERMINAL_ERROR = new Set([
  "FAILED","CANCELLED","RTO_INITIATED","RTO_DELIVERED",
  "RETURN_CREATED","RETURN_PICKED_UP","RETURN_DELIVERED",
]);

// ─── Stepper state ─────────────────────────────────────────────────────────────
interface StepperState { completedUpTo: number; isFailed: boolean; }

function checkHubReached(timeline: TimelineEvent[]): boolean {
  const kws = ["hub", "destination hub", "reached hub", "transit hub"];
  return timeline.some(e =>
    kws.some(kw =>
      e.status.toLowerCase().includes(kw) ||
      (e.description && e.description.toLowerCase().includes(kw))
    )
  );
}

function findLastCompletedStepFromTimeline(timeline: TimelineEvent[]): number {
  for (let i = LIFECYCLE.length - 1; i >= 0; i--) {
    const step = LIFECYCLE[i];
    const found = timeline.some(e =>
      step.statuses.some(s => e.status.toUpperCase() === s) ||
      step.keywords.some(kw =>
        e.status.toLowerCase().includes(kw) ||
        (e.description && e.description.toLowerCase().includes(kw))
      )
    );
    if (found) return i;
  }
  return -1;
}

function getStepperState(status: string, timeline: TimelineEvent[]): StepperState {
  if (TERMINAL_ERROR.has(status))
    return { completedUpTo: findLastCompletedStepFromTimeline(timeline), isFailed: true };

  const hub = checkHubReached(timeline);
  const map: Record<string, number> = {
    CREATED: 0, COURIER_ASSIGNED: 2,
    PICKUP_SCHEDULED: 3, PICKED_UP: 4,
    SHIPPED: hub ? 6 : 5, IN_TRANSIT: hub ? 6 : 5,
    OUT_FOR_DELIVERY: 7, DELIVERED: 8,
  };
  return { completedUpTo: map[status] ?? 0, isFailed: false };
}

// ─── Failure stage ────────────────────────────────────────────────────────────
type FailureStage = "shipment_creation" | "courier_assignment" | "pickup_scheduling" | "delivery";
interface FailureConfig { title: string; action: string; showTrackingFields: boolean; }

const FAILURE_CONFIGS: Record<FailureStage, FailureConfig> = {
  shipment_creation: { title: "Shipment Creation Failed",   action: "Retry",               showTrackingFields: false },
  courier_assignment:{ title: "Courier Assignment Failed",  action: "Retry Assign Courier", showTrackingFields: false },
  pickup_scheduling: { title: "Pickup Scheduling Failed",   action: "Retry Pickup",         showTrackingFields: true  },
  delivery:          { title: "Delivery Failed",            action: "Sync Tracking",        showTrackingFields: true  },
};

function detectFailureStage(s: FullShipment): FailureStage | null {
  if (s.status !== "FAILED") return null;
  if (!s.awbNumber) return s.timeline.length === 0 ? "shipment_creation" : "courier_assignment";
  const hadPickup = s.timeline.some(e =>
    e.status.toUpperCase() === "PICKED_UP" || e.status.toLowerCase().includes("picked up")
  );
  return hadPickup ? "delivery" : "pickup_scheduling";
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  CREATED:           { label: "Created",           badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"  },
  COURIER_ASSIGNED:  { label: "Courier Assigned",  badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"          },
  PICKUP_SCHEDULED:  { label: "Pickup Scheduled",  badgeClass: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"  },
  PICKED_UP:         { label: "Picked Up",         badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"      },
  SHIPPED:           { label: "Shipped",           badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"      },
  IN_TRANSIT:        { label: "In Transit",        badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"      },
  OUT_FOR_DELIVERY:  { label: "Out for Delivery",  badgeClass: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"             },
  DELIVERED:         { label: "Delivered",         badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"      },
  FAILED:            { label: "Failed",            badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"              },
  CANCELLED:         { label: "Cancelled",         badgeClass: "bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"          },
  RTO_INITIATED:     { label: "RTO Initiated",     badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"  },
  RTO_DELIVERED:     { label: "RTO Delivered",     badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"          },
  RETURN_CREATED:    { label: "Return Created",    badgeClass: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"  },
  RETURN_PICKED_UP:  { label: "Return Picked Up",  badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"      },
  RETURN_DELIVERED:  { label: "Return Delivered",  badgeClass: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"          },
};

type BannerCfg = {
  bgClass: string; borderClass: string;
  textClass: string; subtextClass: string; iconClass: string;
  Icon: React.ElementType; message: string;
};
const STATUS_BANNER: Record<string, BannerCfg> = {
  CREATED:           { bgClass: "bg-blue-50 dark:bg-blue-950/25",    borderClass: "border-blue-200 dark:border-blue-800",    textClass: "text-blue-900 dark:text-blue-200",    subtextClass: "text-blue-700/80 dark:text-blue-400",   iconClass: "text-blue-500",   Icon: Package,       message: "Shipment created — assigning courier and generating AWB."           },
  COURIER_ASSIGNED:  { bgClass: "bg-indigo-50 dark:bg-indigo-950/25",borderClass: "border-indigo-200 dark:border-indigo-800",textClass: "text-indigo-900 dark:text-indigo-200", subtextClass: "text-indigo-700/80 dark:text-indigo-400",iconClass: "text-indigo-500", Icon: UserCheck,    message: "Courier assigned and AWB generated. Pickup will be scheduled soon." },
  PICKUP_SCHEDULED:  { bgClass: "bg-purple-50 dark:bg-purple-950/25",borderClass: "border-purple-200 dark:border-purple-800",textClass: "text-purple-900 dark:text-purple-200", subtextClass: "text-purple-700/80 dark:text-purple-400",iconClass: "text-purple-500", Icon: Calendar,    message: "Pickup scheduled. Courier will collect the package soon."           },
  PICKED_UP:         { bgClass: "bg-violet-50 dark:bg-violet-950/25",borderClass: "border-violet-200 dark:border-violet-800",textClass: "text-violet-900 dark:text-violet-200", subtextClass: "text-violet-700/80 dark:text-violet-400",iconClass: "text-violet-500", Icon: PackageOpen, message: "Package picked up and heading to the sorting facility."              },
  SHIPPED:           { bgClass: "bg-sky-50 dark:bg-sky-950/25",      borderClass: "border-sky-200 dark:border-sky-800",      textClass: "text-sky-900 dark:text-sky-200",       subtextClass: "text-sky-700/80 dark:text-sky-400",     iconClass: "text-sky-500",   Icon: Truck,       message: "Package is in transit through the courier network."                 },
  IN_TRANSIT:        { bgClass: "bg-sky-50 dark:bg-sky-950/25",      borderClass: "border-sky-200 dark:border-sky-800",      textClass: "text-sky-900 dark:text-sky-200",       subtextClass: "text-sky-700/80 dark:text-sky-400",     iconClass: "text-sky-500",   Icon: Truck,       message: "Package is in transit through the courier network."                 },
  OUT_FOR_DELIVERY:  { bgClass: "bg-amber-50 dark:bg-amber-950/25",  borderClass: "border-amber-200 dark:border-amber-800",  textClass: "text-amber-900 dark:text-amber-200",   subtextClass: "text-amber-700/80 dark:text-amber-400", iconClass: "text-amber-500", Icon: MapPin,      message: "Package is out for delivery and will arrive today."                 },
  DELIVERED:         { bgClass: "bg-green-50 dark:bg-green-950/25",  borderClass: "border-green-200 dark:border-green-800",  textClass: "text-green-900 dark:text-green-200",   subtextClass: "text-green-700/80 dark:text-green-400", iconClass: "text-green-500", Icon: CheckCircle2, message: "Shipment delivered successfully."                                  },
  CANCELLED:         { bgClass: "bg-gray-50 dark:bg-gray-900/25",    borderClass: "border-gray-200 dark:border-gray-700",    textClass: "text-gray-700 dark:text-gray-300",     subtextClass: "text-gray-500 dark:text-gray-400",      iconClass: "text-gray-400",  Icon: XCircle,     message: "This shipment has been cancelled."                                  },
  RTO_INITIATED:     { bgClass: "bg-yellow-50 dark:bg-yellow-950/25",borderClass: "border-yellow-200 dark:border-yellow-800",textClass: "text-yellow-900 dark:text-yellow-200", subtextClass: "text-yellow-700/80 dark:text-yellow-400",iconClass: "text-yellow-500",Icon: RotateCcw,  message: "Return to origin initiated. Package is being returned to warehouse." },
  RTO_DELIVERED:     { bgClass: "bg-rose-50 dark:bg-rose-950/25",    borderClass: "border-rose-200 dark:border-rose-800",    textClass: "text-rose-900 dark:text-rose-200",     subtextClass: "text-rose-700/80 dark:text-rose-400",   iconClass: "text-rose-500",  Icon: RotateCcw,  message: "Package has been returned to the origin warehouse."                 },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(s: string | null | undefined): string {
  if (!s) return "—";
  try { return format(new Date(s), "d MMM yyyy"); } catch { return "—"; }
}
function fmtDateShort(s: string | null | undefined): string {
  if (!s) return "—";
  try { return format(new Date(s), "d MMM"); } catch { return "—"; }
}
function fmtTime(s: string | null | undefined): string {
  if (!s) return "";
  try { return format(new Date(s), "hh:mm a"); } catch { return ""; }
}
function fmtDateTime(s: string | null | undefined): string {
  if (!s) return "—";
  try { return format(new Date(s), "d MMM, hh:mm a"); } catch { return "—"; }
}
function fmtCurrency(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}
function titleCase(s: string): string {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
function toShipmentId(id: string): string {
  return `SHP-${id.slice(-8).toUpperCase()}`;
}
function getEddDisplay(estimatedDelivery: string | null | undefined): string | null {
  if (!estimatedDelivery) return null;
  try {
    const edd = new Date(estimatedDelivery);
    const now = new Date();
    const diff = Math.floor((edd.getTime() - now.getTime()) / 86400000);
    if (diff < 0) return fmtDateShort(estimatedDelivery);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return fmtDateShort(estimatedDelivery);
  } catch { return null; }
}

function findStepEvent(timeline: TimelineEvent[], step: LifecycleStep): TimelineEvent | null {
  const asc = [...timeline].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const byStatus = asc.find(e => step.statuses.some(s => e.status.toUpperCase() === s));
  if (byStatus) return byStatus;
  return asc.find(e =>
    step.keywords.some(kw =>
      e.status.toLowerCase().includes(kw) ||
      (e.description && e.description.toLowerCase().includes(kw))
    )
  ) ?? null;
}

function useCopyText() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);
  return { copied, copy };
}

// ─── Inline copy button ───────────────────────────────────────────────────────
function CopyBtn({ value, label }: { value: string; label: string }) {
  const { copied, copy } = useCopyText();
  return (
    <button
      onClick={() => copy(value, label)}
      className="p-1 rounded-md hover:bg-muted transition-colors flex-shrink-0"
      title={`Copy ${label}`}
    >
      {copied === value
        ? <Check className="w-3 h-3 text-green-500" />
        : <Copy className="w-3 h-3 text-muted-foreground" />
      }
    </button>
  );
}

// ─── Provider badge ───────────────────────────────────────────────────────────
function ProviderBadge({ provider }: { provider: string }) {
  const lower = provider.toLowerCase();
  const [label, cls] =
    lower.includes("shiprocket")
      ? ["Shiprocket", "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"]
      : lower.includes("shipmozo")
      ? ["Shipmozo",   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"]
      : [titleCase(provider), "bg-muted text-muted-foreground"];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

// ─── Mini 6-step progress stepper for list cards ──────────────────────────────
const MINI_STEPS = [
  { label: "Created",     statuses: ["CREATED"],                      Icon: Package      },
  { label: "Courier",     statuses: ["COURIER_ASSIGNED"],             Icon: UserCheck    },
  { label: "Pickup",      statuses: ["PICKUP_SCHEDULED", "PICKED_UP"],Icon: PackageOpen  },
  { label: "Transit",     statuses: ["SHIPPED", "IN_TRANSIT"],        Icon: Truck        },
  { label: "Out for Del.",statuses: ["OUT_FOR_DELIVERY"],             Icon: MapPin       },
  { label: "Delivered",   statuses: ["DELIVERED"],                    Icon: CheckCircle2 },
];

function getMiniStepperState(status: string): { completedUpTo: number; isFailed: boolean } {
  if (TERMINAL_ERROR.has(status)) {
    const map: Record<string, number> = {
      FAILED: 0, CANCELLED: 0, RTO_INITIATED: 5,
      RTO_DELIVERED: 5, RETURN_CREATED: 5, RETURN_PICKED_UP: 5, RETURN_DELIVERED: 5,
    };
    return { completedUpTo: map[status] ?? 0, isFailed: true };
  }
  const map: Record<string, number> = {
    CREATED: 0, COURIER_ASSIGNED: 1,
    PICKUP_SCHEDULED: 1, PICKED_UP: 2,
    SHIPPED: 3, IN_TRANSIT: 3,
    OUT_FOR_DELIVERY: 4, DELIVERED: 5,
  };
  return { completedUpTo: map[status] ?? 0, isFailed: false };
}

function MiniProgressStepper({ status }: { status: string }) {
  const { completedUpTo, isFailed } = getMiniStepperState(status);

  return (
    <div className="flex items-start">
      {MINI_STEPS.map((step, i) => {
        const isCompleted  = i <= completedUpTo && !isFailed;
        const isCurrent    = !isFailed && i === completedUpTo + 1;
        const isFailedHere = isFailed && i === completedUpTo + 1;
        const isLast       = i === MINI_STEPS.length - 1;
        const StepIcon     = step.Icon;

        return (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {/* connectors */}
            {i > 0 && (
              <div className={`absolute top-[10px] left-0 right-1/2 h-px ${
                i <= completedUpTo && !isFailed ? "bg-green-400" : "bg-border"
              }`} />
            )}
            {!isLast && (
              <div className={`absolute top-[10px] left-1/2 right-0 h-px ${
                i < completedUpTo && !isFailed ? "bg-green-400" : "bg-border"
              }`} />
            )}

            {/* circle */}
            <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 transition-all ${
              isCompleted
                ? "bg-green-500 border-green-500 text-white"
                : isCurrent
                ? "bg-blue-500 border-blue-500 text-white"
                : isFailedHere
                ? "bg-red-500 border-red-500 text-white"
                : "bg-card border-border text-muted-foreground"
            }`}>
              {isCompleted
                ? <Check className="w-2.5 h-2.5" />
                : isFailedHere
                ? <XCircle className="w-2.5 h-2.5" />
                : <StepIcon className="w-2.5 h-2.5" />
              }
            </div>

            {/* label */}
            <p className={`mt-1 text-[9px] font-semibold text-center leading-tight ${
              isCompleted   ? "text-green-600 dark:text-green-400"
              : isCurrent   ? "text-blue-600 dark:text-blue-400"
              : isFailedHere? "text-red-600 dark:text-red-400"
              : "text-muted-foreground/60"
            }`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function ShipmentStatusBadge({ status, size = "md" }: { status: string; size?: "sm" | "md" | "lg" }) {
  const cfg = STATUS_CONFIG[status] ?? { label: titleCase(status), badgeClass: "bg-gray-100 text-gray-700" };
  const sz = size === "sm" ? "px-2 py-0.5 text-[10px]"
           : size === "lg" ? "px-3 py-1 text-sm"
           : "px-2.5 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-center rounded-full font-bold uppercase tracking-wide ${sz} ${cfg.badgeClass}`}>
      {cfg.label}
    </span>
  );
}

// ─── Shipment Header Card ─────────────────────────────────────────────────────
function ShipmentHeaderCard({
  shipment,
  showTrackingFields,
}: {
  shipment: FullShipment;
  showTrackingFields: boolean;
}) {
  const courierReady = Boolean(shipment.awbNumber);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Top section — title + status */}
      <div className="px-6 py-4 bg-muted/40 border-b border-border">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                {shipment.orderId?.orderNumber ?? MISSING_ORDER_LABEL}
              </h2>
              <span className="text-sm text-muted-foreground font-mono">{toShipmentId(shipment._id)}</span>
              <ShipmentStatusBadge status={shipment.status} size="lg" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="capitalize font-medium">{titleCase(shipment.provider)}</span>
              {courierReady && shipment.courierName
                ? <> · <span className="font-medium">{shipment.courierName}</span></>
                : <> · <span className="italic">Assigning courier…</span></>
              }
            </p>
          </div>
          {shipment.currentLocation && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-none mb-0.5">Current Location</p>
                <p className="text-sm font-semibold text-foreground">{shipment.currentLocation}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section — field grid */}
      <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-5">
        {/* AWB */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">AWB Number</p>
          {showTrackingFields && shipment.awbNumber ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-foreground">{shipment.awbNumber}</span>
              <CopyBtn value={shipment.awbNumber} label="AWB" />
            </div>
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">—</span>
          )}
        </div>

        {/* Tracking */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Tracking No.</p>
          {showTrackingFields && shipment.trackingId ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-foreground">{shipment.trackingId}</span>
              <CopyBtn value={shipment.trackingId} label="Tracking number" />
            </div>
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">—</span>
          )}
        </div>

        {/* Courier */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Courier</p>
          {courierReady && shipment.courierName
            ? <span className="text-sm font-bold text-foreground">{shipment.courierName}</span>
            : <span className="text-sm italic text-muted-foreground">Assigning…</span>
          }
        </div>

        {/* Dispatch */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Dispatch Date</p>
          <span className="text-sm font-bold text-foreground">{fmtDate(shipment.createdAt)}</span>
        </div>

        {/* Expected */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Expected Delivery</p>
          <span className="text-sm font-bold text-foreground">{fmtDate(shipment.estimatedDelivery)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Progress Stepper ─────────────────────────────────────────────────────────
function ShipmentProgressStepper({ status, timeline }: { status: string; timeline: TimelineEvent[] }) {
  const { completedUpTo, isFailed } = getStepperState(status, timeline);

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div className="flex items-start min-w-[900px]">
        {LIFECYCLE.map((step, i) => {
          const isCompleted  = i <= completedUpTo;
          const isCurrent    = !isFailed && i === completedUpTo + 1 && i < LIFECYCLE.length;
          const isFailedHere = isFailed  && i === completedUpTo + 1 && i < LIFECYCLE.length;
          const isLast       = i === LIFECYCLE.length - 1;
          const StepIcon     = step.Icon;
          const event        = findStepEvent(timeline, step);

          return (
            <div key={step.label} className="flex-1 flex flex-col items-center relative">
              {/* Left connector line */}
              {i > 0 && (
                <div className={`absolute top-[22px] left-0 right-1/2 h-0.5 transition-colors ${
                  i <= completedUpTo ? "bg-green-400" : "bg-border"
                }`} />
              )}
              {/* Right connector line */}
              {!isLast && (
                <div className={`absolute top-[22px] left-1/2 right-0 h-0.5 transition-colors ${
                  i < completedUpTo ? "bg-green-400" : "bg-border"
                }`} />
              )}

              {/* Step circle */}
              <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                isCompleted
                  ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-200 dark:shadow-green-900/30"
                  : isCurrent
                  ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                  : isFailedHere
                  ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-200 dark:shadow-red-900/30"
                  : "bg-card border-border text-muted-foreground"
              }`}>
                {isCompleted
                  ? <Check className="w-5 h-5" />
                  : isFailedHere
                  ? <XCircle className="w-5 h-5" />
                  : <StepIcon className="w-4.5 h-4.5" />
                }
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-blue-300 opacity-20" />
                )}
              </div>

              {/* Labels */}
              <div className="mt-3 px-0.5 text-center space-y-0.5 w-full">
                <p className={`text-[10px] font-bold leading-snug ${
                  isCompleted   ? "text-green-700 dark:text-green-400"
                  : isCurrent   ? "text-blue-700 dark:text-blue-400"
                  : isFailedHere? "text-red-700 dark:text-red-400"
                  : "text-muted-foreground"
                }`}>
                  {step.label}
                </p>
                {event ? (
                  <>
                    <p className="text-[9px] text-muted-foreground font-medium">{fmtDateShort(event.timestamp)}</p>
                    <p className="text-[9px] text-muted-foreground">{fmtTime(event.timestamp)}</p>
                    {event.location && (
                      <p className="text-[9px] text-muted-foreground truncate max-w-[80px] mx-auto">{event.location}</p>
                    )}
                  </>
                ) : (
                  <p className="text-[9px] text-muted-foreground/50">—</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Status Banner ────────────────────────────────────────────────────────────
function ShipmentStatusBanner({ status, estimatedDelivery }: {
  status: string;
  estimatedDelivery?: string | null;
}) {
  const cfg = STATUS_BANNER[status];
  if (!cfg) return null;
  const BannerIcon = cfg.Icon;
  const edd = getEddDisplay(estimatedDelivery);

  return (
    <div className={`rounded-2xl border px-5 py-4 ${cfg.bgClass} ${cfg.borderClass}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.borderClass} bg-white/60 dark:bg-white/5`}>
            <BannerIcon className={`w-5 h-5 ${cfg.iconClass}`} />
          </div>
          <div>
            <p className={`text-sm font-bold ${cfg.textClass}`}>
              {STATUS_CONFIG[status]?.label ?? titleCase(status)}
            </p>
            <p className={`text-xs mt-0.5 ${cfg.subtextClass}`}>{cfg.message}</p>
          </div>
        </div>
        {edd && estimatedDelivery && (
          <div className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl border ${cfg.borderClass} bg-white/60 dark:bg-white/5`}>
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Est. Delivery</span>
            <span className={`text-base font-extrabold mt-0.5 ${cfg.textClass}`}>{edd}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Failure Banner ───────────────────────────────────────────────────────────
function FailureBanner({ stage, onRetry, isPending }: {
  stage: FailureStage; onRetry: () => void; isPending: boolean;
}) {
  const cfg = FAILURE_CONFIGS[stage];
  return (
    <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/25 px-5 py-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl border border-red-200 dark:border-red-800 bg-white/60 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-900 dark:text-red-200">{cfg.title}</p>
            <p className="text-xs text-red-700/80 dark:text-red-400 mt-0.5">
              {stage === "courier_assignment" || stage === "shipment_creation"
                ? "AWB, tracking number, and shipping label are not yet available."
                : "Sync tracking to get the latest status from the provider."}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isPending}
          className="border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 flex-shrink-0"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {cfg.action}
        </Button>
      </div>
    </div>
  );
}

// ─── Tracking Events Card ─────────────────────────────────────────────────────
function TrackingEventsCard({ timeline }: { timeline: TimelineEvent[] }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...timeline].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const visible = expanded ? sorted : sorted.slice(0, 6);
  const hasMore = sorted.length > 6;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">Tracking Events</p>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted font-medium">
            {sorted.length} event{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="px-5 py-4">
        {sorted.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2 text-center">
            <Clock className="w-8 h-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No tracking events yet</p>
            <p className="text-xs text-muted-foreground/70">Sync tracking to fetch latest updates</p>
          </div>
        ) : (
          <div className="space-y-0">
            {visible.map((event, i) => {
              const isFirst = i === 0;
              const isLast  = i === visible.length - 1;
              return (
                <div key={`${event.timestamp}-${i}`} className="flex gap-4">
                  {/* Timeline axis */}
                  <div className="flex flex-col items-center flex-shrink-0 w-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ring-2 ring-background ${
                      isFirst ? "bg-blue-500 ring-blue-100 dark:ring-blue-900/50" : "bg-border"
                    }`} />
                    {!isLast && <div className="w-px flex-1 bg-border mt-1 min-h-[28px]" />}
                  </div>

                  {/* Event content */}
                  <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-4"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground leading-snug">
                          {titleCase(event.status)}
                        </p>
                        {event.description && event.description !== event.status && (
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{event.description}</p>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-[10px] text-muted-foreground">{event.location}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground flex-shrink-0 whitespace-nowrap mt-0.5">
                        {fmtDateTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline py-1"
              >
                {expanded ? "Show less" : `View all ${sorted.length} events`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shipment Details Card ────────────────────────────────────────────────────
function ShipmentDetailsCard({
  shipment,
  showTrackingFields,
}: {
  shipment: FullShipment;
  showTrackingFields: boolean;
}) {
  const { copied, copy } = useCopyText();

  function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/60 last:border-0">
        <span className="text-xs text-muted-foreground flex-shrink-0 min-w-[100px]">{label}</span>
        <span className="text-xs font-semibold text-foreground text-right flex items-center gap-1">{children}</span>
      </div>
    );
  }

  const rawPaymentMethod = shipment.orderId?.payment?.paymentMethod;
  const isPartialCOD = rawPaymentMethod === "partial_cod";
  // titleCase("partial_cod") renders "Partial_cod" — special-case it.
  const paymentMethod = isPartialCOD
    ? "Partial COD"
    : (rawPaymentMethod ? titleCase(rawPaymentMethod) : "Prepaid");

  // Snapshotted on the shipment at dispatch time; fall back to the order for
  // shipments created before those fields existed.
  const orderTotal = shipment.orderTotal ?? shipment.orderId?.pricing?.finalAmount;
  const prepaidAmount = shipment.prepaidAmount ?? shipment.orderId?.pricing?.prepaidAmount ?? 0;
  const codCollectible = shipment.codAmount ?? shipment.orderId?.pricing?.codDueAmount;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <p className="text-sm font-bold text-foreground">Shipment Details</p>
      </div>
      <div className="px-5 py-1">
        <Row label="Provider">{titleCase(shipment.provider)}</Row>
        <Row label="Courier">
          {shipment.courierName
            ? <span>{shipment.courierName}</span>
            : <span className="italic text-muted-foreground">Assigning…</span>
          }
        </Row>
        <Row label="Service Type">{shipment.serviceType ?? "—"}</Row>
        <Row label="Package Weight">
          {shipment.weight != null ? `${shipment.weight} kg` : "—"}
        </Row>
        <Row label="Dimensions">
          {shipment.dimensions
            ? `${shipment.dimensions.length}×${shipment.dimensions.breadth}×${shipment.dimensions.height} cm`
            : "—"
          }
        </Row>
        <Row label="Payment Mode">{paymentMethod}</Row>

        {/* Partial COD: show the split so it's obvious why the courier collects
            less than the order total. */}
        {isPartialCOD && (
          <>
            <Row label="Order Total">
              {orderTotal != null ? fmtCurrency(orderTotal) : "—"}
            </Row>
            <Row label="Paid Online">
              {prepaidAmount != null ? fmtCurrency(prepaidAmount) : "—"}
            </Row>
            <Row label="Collect on Delivery">
              {codCollectible != null ? fmtCurrency(codCollectible) : "—"}
            </Row>
          </>
        )}

        <Row label="Freight Charge">
          {shipment.charges?.freight != null ? fmtCurrency(shipment.charges.freight) : "—"}
        </Row>
        {/* NB: charges.cod is the courier's COD handling FEE, not the amount
            collected from the customer — it was previously labelled "COD Amount",
            which read as the collectible. */}
        <Row label="COD Fee">
          {shipment.charges?.cod != null ? fmtCurrency(shipment.charges.cod) : "—"}
        </Row>
        <Row label="Handling Charge">
          {shipment.charges?.handling != null ? fmtCurrency(shipment.charges.handling) : "—"}
        </Row>
        <Row label="Total Charges">
          <span className="font-bold text-foreground">
            {shipment.charges?.total != null ? fmtCurrency(shipment.charges.total) : "—"}
          </span>
        </Row>
        {showTrackingFields && shipment.awbNumber && (
          <Row label="AWB Number">
            {shipment.awbNumber}
            <button onClick={() => copy(shipment.awbNumber!, "AWB")} className="p-0.5 rounded hover:bg-muted">
              {copied === shipment.awbNumber ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
            </button>
          </Row>
        )}
        {showTrackingFields && shipment.trackingId && (
          <Row label="Tracking No.">
            {shipment.trackingId}
            <button onClick={() => copy(shipment.trackingId!, "Tracking number")} className="p-0.5 rounded hover:bg-muted">
              {copied === shipment.trackingId ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
            </button>
          </Row>
        )}
        {showTrackingFields && shipment.trackingUrl && (
          <Row label="Tracking URL">
            <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer"
               className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              Open <ExternalLink className="w-3 h-3" />
            </a>
          </Row>
        )}
      </div>

      {showTrackingFields && shipment.labelUrl && (
        <div className="px-5 pb-4">
          <a
            href={shipment.labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-sm font-semibold transition-colors"
          >
            <FileText className="w-4 h-4" /> Download Shipping Label
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Delivery Address Card ────────────────────────────────────────────────────
function DeliveryAddressCard({ address }: {
  address: OrderRef["shippingAddress"];
}) {
  if (!address) return null;
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-bold text-foreground">Delivery Address</p>
        </div>
      </div>
      <div className="px-5 py-4 space-y-2.5">
        <p className="text-sm font-bold text-foreground">{address.firstName} {address.lastName}</p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
          <p className="text-sm">{address.phone}</p>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground pt-1 border-t border-border/60">
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>{address.city}, {address.state} {address.postalCode}</p>
          <p>{address.country}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Order Summary Card ───────────────────────────────────────────────────────
function OrderSummaryCard({ shipment }: { shipment: FullShipment }) {
  const items   = shipment.orderId?.items;
  const pricing = shipment.orderId?.pricing;
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">Order Summary</p>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted font-medium">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            {/* Product avatar */}
            <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
              <span className="text-base font-extrabold text-muted-foreground">
                {item.productName[0]?.toUpperCase() ?? "P"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-snug">{item.productName}</p>
              {item.variant && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.variant.name}: {item.variant.value}</p>
              )}
              <p className="text-xs text-muted-foreground">Qty: {item.quantity} · {fmtCurrency(item.priceAtPurchase)} each</p>
            </div>
            <p className="text-sm font-bold text-foreground flex-shrink-0">
              {fmtCurrency(item.priceAtPurchase * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {pricing && (
        <div className="px-5 pb-4 pt-2 border-t border-border space-y-2">
          {pricing.subtotal != null && (
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Subtotal</span>
              <span className="text-xs font-medium text-foreground">{fmtCurrency(pricing.subtotal)}</span>
            </div>
          )}
          {pricing.discountAmount != null && pricing.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Discount</span>
              <span className="text-xs font-medium text-green-600">−{fmtCurrency(pricing.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="text-sm font-bold text-foreground">{fmtCurrency(pricing.finalAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-[120px] w-full rounded-2xl" />
      <Skeleton className="h-[160px] w-full rounded-2xl" />
      <Skeleton className="h-[72px] w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-[320px] w-full rounded-2xl" />
        <Skeleton className="h-[320px] w-full rounded-2xl" />
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[200px] w-full rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Shipment Detail View ─────────────────────────────────────────────────────
function ShipmentDetailView({ orderId, onBack }: { orderId: string; onBack: () => void }) {
  const { data: shipmentRaw, isLoading, isError, error, refetch } = useShipmentByOrder(orderId);
  const shipment = shipmentRaw as FullShipment | undefined;
  const { data: order } = useOrderById(orderId);
  const syncMutation = useSyncTracking();

  function handleSync() {
    if (!shipment?.trackingId) { toast.error("No tracking ID — use the dispatch page to trigger tracking."); return; }
    syncMutation.mutate(shipment.trackingId, {
      onSuccess: () => { toast.success("Tracking synced"); refetch(); },
      onError:   (e: Error) => toast.error(e.message || "Sync failed"),
    });
  }

  // ── Loading ──
  if (isLoading) return (
    <div className="space-y-5">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>
      <DetailSkeleton />
    </div>
  );

  // ── Error ──
  if (isError || !shipment) return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Shipment Tracking
      </button>
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center border-2 border-dashed border-muted rounded-3xl">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <p className="text-base font-bold text-foreground">Failed to load shipment</p>
          <p className="text-sm text-muted-foreground mt-1">{(error as Error)?.message}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    </div>
  );

  // Merge order data from useOrderById fallback. The populated order can be
  // null (deleted order), in which case the separately fetched order carries the
  // page on its own.
  const orderRef = shipment.orderId;
  const merged: FullShipment = {
    ...shipment,
    orderId: {
      ...(orderRef ?? {} as OrderRef),
      _id:             orderRef?._id             ?? orderId,
      orderNumber:     orderRef?.orderNumber     ?? order?.orderNumber ?? MISSING_ORDER_LABEL,
      shippingAddress: orderRef?.shippingAddress ?? order?.shippingAddress as OrderRef["shippingAddress"],
      items:           orderRef?.items           ?? order?.items           as OrderRef["items"],
      pricing:         orderRef?.pricing         ?? order?.pricing         as OrderRef["pricing"],
      payment:         orderRef?.payment         ?? { paymentMethod: order?.payment?.paymentMethod },
    },
  };

  const failureStage  = detectFailureStage(merged);
  const showTracking  = failureStage == null || FAILURE_CONFIGS[failureStage].showTrackingFields;

  return (
    <div className="space-y-5">

      {/* ── Breadcrumb + Action bar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <nav className="flex items-center gap-1.5 text-sm">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground font-semibold transition-colors"
          >
            Shipment Tracking
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-bold text-foreground">{merged.orderId?.orderNumber}</span>
        </nav>

        <div className="flex items-center gap-2 flex-wrap">
          {showTracking && merged.labelUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={merged.labelUrl} target="_blank" rel="noopener noreferrer">
                <Printer className="w-4 h-4" /> Print Label
              </a>
            </Button>
          )}
          {showTracking && merged.trackingUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={merged.trackingUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" /> Open Tracking
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncMutation.isPending}
          >
            {syncMutation.isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <RefreshCw className="w-4 h-4" />
            }
            Sync Tracking
          </Button>
        </div>
      </div>

      {/* ── Header Card ── */}
      <ShipmentHeaderCard shipment={merged} showTrackingFields={showTracking} />

      {/* ── Progress Card ── */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <p className="text-sm font-bold text-foreground">Shipment Progress</p>
        </div>
        <div className="px-6 py-6">
          <ShipmentProgressStepper status={merged.status} timeline={merged.timeline} />
        </div>
      </div>

      {/* ── Status / Failure Banner ── */}
      {failureStage
        ? <FailureBanner stage={failureStage} onRetry={handleSync} isPending={syncMutation.isPending} />
        : <ShipmentStatusBanner status={merged.status} estimatedDelivery={merged.estimatedDelivery} />
      }

      {/* ── 2 × 2 Information Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TrackingEventsCard timeline={merged.timeline} />
        <ShipmentDetailsCard shipment={merged} showTrackingFields={showTracking} />
        <DeliveryAddressCard address={merged.orderId?.shippingAddress} />
        <OrderSummaryCard shipment={merged} />
      </div>
    </div>
  );
}

// ─── Shipment List Card ───────────────────────────────────────────────────────
function ShipmentListCard({ shipment, onView }: { shipment: FullShipment; onView: () => void }) {
  const courierName = shipment.courierName ?? null;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-border/70 transition-all">
      {/* ── Header ── */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-border/60">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <span className={`text-sm font-bold ${shipment.orderId ? "text-foreground" : "text-muted-foreground italic"}`}>
            {shipment.orderId?.orderNumber ?? MISSING_ORDER_LABEL}
          </span>
          <ShipmentStatusBadge status={shipment.status} size="sm" />
          <ProviderBadge provider={shipment.provider} />
        </div>
        {shipment.userId?.name && (
          <span className="text-xs text-muted-foreground font-medium flex-shrink-0 pt-0.5">
            {shipment.userId.name}
          </span>
        )}
      </div>

      {/* ── Info grid ── */}
      <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 border-b border-border/60">
        {/* Courier */}
        <div>
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Courier</p>
          {courierName
            ? <p className="text-xs font-semibold text-foreground truncate">{courierName}</p>
            : <p className="text-xs italic text-muted-foreground/70">Assigning…</p>
          }
        </div>

        {/* AWB */}
        <div>
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">AWB</p>
          {shipment.awbNumber
            ? <p className="text-xs font-semibold text-foreground font-mono truncate">{shipment.awbNumber}</p>
            : <p className="text-xs text-muted-foreground/50">—</p>
          }
        </div>

        {/* Tracking */}
        <div>
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Tracking</p>
          {shipment.trackingId
            ? <p className="text-xs font-semibold text-foreground font-mono truncate">{shipment.trackingId}</p>
            : <p className="text-xs text-muted-foreground/50">Pending</p>
          }
        </div>

        {/* Dispatch */}
        <div>
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Dispatched</p>
          <p className="text-xs font-semibold text-foreground">{fmtDate(shipment.createdAt)}</p>
        </div>

        {/* EDD */}
        <div>
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Est. Delivery</p>
          {shipment.estimatedDelivery
            ? <p className="text-xs font-semibold text-foreground">{getEddDisplay(shipment.estimatedDelivery) ?? fmtDate(shipment.estimatedDelivery)}</p>
            : <p className="text-xs text-muted-foreground/50">—</p>
          }
        </div>
      </div>

      {/* ── Mini stepper ── */}
      <div className="px-5 py-3 border-b border-border/60">
        <MiniProgressStepper status={shipment.status} />
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          disabled={!shipment.orderId}
          className="gap-1 text-xs font-semibold"
        >
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Shipment List ────────────────────────────────────────────────────────────
const STATUS_FILTER_OPTIONS = [
  { key: "all",              label: "All"            },
  { key: "CREATED",          label: "Created"        },
  { key: "COURIER_ASSIGNED", label: "Courier Assigned" },
  { key: "IN_TRANSIT",       label: "In Transit"     },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery"},
  { key: "DELIVERED",        label: "Delivered"      },
  { key: "FAILED",           label: "Failed"         },
];

function ShipmentList({ onSelect }: { onSelect: (orderId: string) => void }) {
  const [query, setQuery]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: shipments = [], isLoading, isError, error, refetch } = useShipments();

  const filtered = shipments
    .filter(s =>
      statusFilter === "all" ||
      s.status === statusFilter ||
      (statusFilter === "IN_TRANSIT" && ["SHIPPED","IN_TRANSIT"].includes(s.status))
    )
    .filter(s => {
      const q = query.toLowerCase().trim();
      return !q || (
        s.orderId?.orderNumber?.toLowerCase().includes(q) ||
        s.awbNumber?.toLowerCase().includes(q) ||
        s.trackingId?.toLowerCase().includes(q) ||
        s.provider?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by order number, AWB, tracking ID, or provider…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-colors"
        />
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTER_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setStatusFilter(opt.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              statusFilter === opt.key
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center border-2 border-dashed border-muted rounded-3xl">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <div>
            <p className="text-sm font-bold">Failed to load shipments</p>
            <p className="text-xs text-muted-foreground mt-1">{(error as Error)?.message}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center border-2 border-dashed border-muted rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold">
              {shipments.length === 0 ? "No shipments yet" : "No matching shipments"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {shipments.length === 0
                ? "Shipments will appear here once orders are dispatched."
                : "Try adjusting your search or status filter."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <p className="text-xs text-muted-foreground font-medium px-0.5">
            {filtered.length} shipment{filtered.length !== 1 ? "s" : ""}
          </p>
          {(filtered as FullShipment[]).map(shipment => (
            <ShipmentListCard
              key={shipment._id}
              shipment={shipment}
              onView={() => shipment.orderId && onSelect(shipment.orderId._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function InventoryShipmentTrackingView({
  initialSection = "inventory",
  showTabs = true,
}: {
  initialSection?: "inventory" | "shipment";
  showTabs?: boolean;
}) {
  const [section, setSection]           = useState<"inventory" | "shipment">(initialSection);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* Tab switcher — hidden when the caller only wants one section */}
      {showTabs && (
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl w-full sm:w-fit">
          <button
            onClick={() => setSection("inventory")}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              section === "inventory" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setSection("shipment")}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              section === "shipment" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Shipment Tracking
          </button>
        </div>
      )}

      {section === "inventory" && <OperationsInventoryPage />}

      {section === "shipment" && (
        selectedOrderId
          ? <ShipmentDetailView orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
          : <ShipmentList onSelect={id => setSelectedOrderId(id)} />
      )}
    </div>
  );
}
