import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Star,
  X,
  Loader2,
  Check,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GenericPage from "@/components/GenericPage";
import { API_BASE } from "@/hooks/api-config";

export interface ITestimonial {
  _id?: string;
  name: string;
  service: string;
  services?: string[];
  location: string;
  review: string;
  rating: number;
  status: "APPROVED" | "PENDING" | "REJECTED";
  isFeatured?: boolean;
}

// Preset catalog of service names (Text only — no icons/images)
const PRESET_SERVICES = [
  // Legal Services
  { title: "Marriage Registration", category: "Legal Services" },
  { title: "Partnership Deed (Notary & Registration of Firm)", category: "Legal Services" },
  { title: "Leave & Licence / Rent Agreement", category: "Legal Services" },
  { title: "Tenant Police Verification", category: "Legal Services" },
  { title: "Govt. Gazette – Name / DOB / Religion Change", category: "Legal Services" },
  { title: "Sale Deed / Will / Gift Deed", category: "Legal Services" },
  { title: "Mortgage Deed / Release Deed", category: "Legal Services" },
  { title: "Title Search Report", category: "Legal Services" },
  { title: "Trademark Registration", category: "Legal Services" },
  { title: "Patent / Copyright Registration", category: "Legal Services" },
  { title: "Digital 7/12 & Mutation Entries", category: "Legal Services" },
  { title: "Character Certificate by Police", category: "Legal Services" },

  // Business & Financial Services
  { title: "Income Tax Services", category: "Business / Financial Services" },
  { title: "Income Tax Registration", category: "Business / Financial Services" },
  { title: "GST Registration & Filing", category: "Business / Financial Services" },
  { title: "GST Registration", category: "Business / Financial Services" },
  { title: "Bank Loan / Financing Consultancy", category: "Business / Financial Services" },
  { title: "Company Registration & Annual Compliance", category: "Business / Financial Services" },
  { title: "LLP Registration & Related Compliance", category: "Business / Financial Services" },
  { title: "Accounting / Audit Services", category: "Business / Financial Services" },
  { title: "Project Report & Financing", category: "Business / Financial Services" },
  { title: "Trust Registration & Audit", category: "Business / Financial Services" },
  { title: "Liaisoning with Govt. Offices", category: "Business / Financial Services" },
  { title: "Tender Consultancy", category: "Business / Financial Services" },
  { title: "Import Export Code (IEC)", category: "Business / Financial Services" },
  { title: "Digital Signature Certificate (DSC)", category: "Business / Financial Services" },

  // Other Services
  { title: "Real Estate Services (Sell / Purchase / Rent / Lease)", category: "Other Services" },
  { title: "Name Transfer & Address Update in Light Bill", category: "Other Services" },
  { title: "Name Transfer in Property / Water Tax Bill / NMC Services", category: "Other Services" },
  { title: "MSME / UDYAM Registration", category: "Other Services" },
  { title: "MSME Registration", category: "Other Services" },
  { title: "Shop Act License", category: "Other Services" },
  { title: "FSSAI / Food License", category: "Other Services" },
  { title: "Passport Services", category: "Other Services" },
  { title: "All Types of Insurance", category: "Other Services" },
  { title: "Services for Start-Ups", category: "Other Services" },
  { title: "Digital Marketing", category: "Other Services" },
  { title: "Voter ID / PAN / TAN Services", category: "Other Services" },
  { title: "Liquor Consumption License", category: "Other Services" },
];

// Helper to normalize services list from item
const extractServices = (item: { service?: string; services?: string[] }): string[] => {
  if (Array.isArray(item.services) && item.services.length > 0) {
    return item.services;
  }
  if (item.service) {
    return item.service
      .split(/[,•|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

// Same pattern every other page uses — resolves to the right backend host per
// environment (VITE_API_URL) instead of only ever working on localhost.
const API_BASE_URL = `${API_BASE}/api/v1/website-control/testimonials`;

const initialFormState: ITestimonial = {
  name: "",
  service: "",
  services: [],
  location: "",
  review: "",
  rating: 5,
  status: "APPROVED",
  isFeatured: false,
};

const WebsiteTestimonialsPage: React.FC = () => {
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Approved" | "Pending" | "Rejected">("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ITestimonial>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Multi-select dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [customServiceName, setCustomServiceName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Lock the page behind the modal from scrolling while it's open.
  useEffect(() => {
    if (!isModalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isModalOpen]);

  // Fetch Testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}?all=true`);
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map((item: any) => ({
          ...item,
          services: extractServices(item),
          status: item.status || (item.isActive ? "APPROVED" : "PENDING"),
        }));
        setTestimonials(mapped);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Top 4 Metrics Calculations
  const metrics = useMemo(() => {
    const total = testimonials.length;
    const approved = testimonials.filter((t) => t.status === "APPROVED").length;
    const pending = testimonials.filter((t) => t.status === "PENDING").length;
    const featured = testimonials.filter((t) => t.isFeatured).length;
    return { total, approved, pending, featured };
  }, [testimonials]);

  // Filter List
  const filteredList = useMemo(() => {
    return testimonials.filter((item) => {
      const itemServices = extractServices(item).join(" ");
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        itemServices.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeFilter === "All") return matchesSearch;
      if (activeFilter === "Approved") return matchesSearch && item.status === "APPROVED";
      if (activeFilter === "Pending") return matchesSearch && item.status === "PENDING";
      if (activeFilter === "Rejected") return matchesSearch && item.status === "REJECTED";
      return matchesSearch;
    });
  }, [testimonials, searchQuery, activeFilter]);

  // Open Modal for Add
  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setErrorMsg("");
    setIsDropdownOpen(false);
    setServiceSearch("");
    setCustomServiceName("");
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (item: ITestimonial) => {
    const itemServices = extractServices(item);
    setFormData({
      ...item,
      services: itemServices,
      service: item.service || itemServices.join(", "),
    });
    setEditingId(item._id || null);
    setErrorMsg("");
    setIsDropdownOpen(false);
    setServiceSearch("");
    setCustomServiceName("");
    setIsModalOpen(true);
  };

  // Toggle a service in multi-select
  const handleToggleService = (serviceTitle: string) => {
    const currentServices = formData.services || [];
    const exists = currentServices.includes(serviceTitle);
    const updated = exists
      ? currentServices.filter((s) => s !== serviceTitle)
      : [...currentServices, serviceTitle];

    setFormData({
      ...formData,
      services: updated,
      service: updated.join(", "),
    });
  };

  // Remove a single service pill
  const handleRemoveService = (serviceTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = (formData.services || []).filter((s) => s !== serviceTitle);
    setFormData({
      ...formData,
      services: updated,
      service: updated.join(", "),
    });
  };

  // Add custom service typed by user
  const handleAddCustomService = () => {
    const trimmed = (customServiceName || serviceSearch).trim();
    if (!trimmed) return;
    const currentServices = formData.services || [];
    if (!currentServices.includes(trimmed)) {
      const updated = [...currentServices, trimmed];
      setFormData({
        ...formData,
        services: updated,
        service: updated.join(", "),
      });
    }
    setCustomServiceName("");
    setServiceSearch("");
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // Submit Add / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!formData.services || formData.services.length === 0) && !formData.service?.trim()) {
      setErrorMsg("Please select at least one service.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

      const servicesArray =
        formData.services && formData.services.length > 0
          ? formData.services
          : formData.service
          ? formData.service
              .split(/[,•|]/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

      const payload = {
        ...formData,
        services: servicesArray,
        service: servicesArray.join(", "),
        isActive: formData.status === "APPROVED",
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchTestimonials();
      } else {
        setErrorMsg(data.message || "Failed to save testimonial");
      }
    } catch (err) {
      setErrorMsg("Network error, please check backend connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GenericPage
      title="Testimonials"
      subtitle="Manage client reviews, ratings, and outcomes — changes reflect on the website in real-time."
    >
      <button
        type="button"
        onClick={() => navigate("/website-control")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors -mt-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Website Control
      </button>

      {/* ── 4 STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
            TOTAL REVIEWS
          </span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">
            {metrics.total}
          </div>
          <p className="text-xs text-muted-foreground mt-1">All statuses</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
            APPROVED
          </span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">
            {metrics.approved}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Live on website</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
            PENDING
          </span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">
            {metrics.pending}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
            FEATURED
          </span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">
            {metrics.featured}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Highlighted</p>
        </div>
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-card border border-border rounded-xl p-1 flex items-center shadow-sm">
            {(["All", "Approved", "Pending", "Rejected"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Testimonial
          </button>
        </div>
      </div>

      {/* ── TESTIMONIAL ROWS ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">No testimonials found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => {
            const itemServices = extractServices(item);
            return (
              <div
                key={item._id}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Left Testimonial Info */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-black dark:text-white">{item.name}</h3>
                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} size={15} className="fill-blue-500 text-blue-500" />
                    ))}
                  </div>

                  {/* Services: Blue, stacked vertically one by one (ek ke niche ek) */}
                  <div className="flex flex-col gap-0.5">
                    {itemServices.map((svc, sIdx) => (
                      <span key={sIdx} className="text-xs font-semibold text-blue-600 dark:text-blue-400 leading-tight">
                        {svc}
                      </span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    "{item.review}"
                  </p>

                  {/* Location Info (Proper black visibility) */}
                  <div className="text-xs text-black/90 dark:text-white/90 font-medium">
                    {item.location}
                  </div>
                </div>

                {/* Right Edit & Delete Buttons */}
                <div className="flex md:flex-col items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-24 shadow-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => item._id && handleDelete(item._id)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 transition-colors w-24 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: 5 INPUTS (Add / Edit) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {editingId ? "Edit Testimonial" : "Add New Testimonial"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter client outcome details for the homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Name */}
              <div>
                <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                  <label>1. Client Name *</label>
                  <span className="text-muted-foreground font-normal">{formData.name.length}/50</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={50}
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* 2. Services Multi-Select Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                  <label>2. Services * (Select Multiple)</label>
                  <span className="text-blue-600 font-semibold">
                    {(formData.services || []).length} selected
                  </span>
                </div>

                {/* Selected Service Badges Preview (text only) */}
                {(formData.services || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/50 rounded-xl">
                    {formData.services?.map((svc) => (
                      <span
                        key={svc}
                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 shadow-xs"
                      >
                        <span>{svc}</span>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveService(svc, e)}
                          className="text-blue-500 hover:text-red-500 rounded-full p-0.5 transition-colors"
                          title="Remove service"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Dropdown Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="w-full text-left text-xs p-3 rounded-xl border border-border bg-background flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                >
                  <span
                    className={
                      formData.services && formData.services.length > 0
                        ? "text-foreground font-medium truncate"
                        : "text-muted-foreground"
                    }
                  >
                    {formData.services && formData.services.length > 0
                      ? `${formData.services.length} service${formData.services.length > 1 ? "s" : ""} selected`
                      : "Select services (e.g. Marriage Registration, Partnership Deed)..."}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-card border border-border rounded-2xl shadow-xl p-3 max-h-72 overflow-hidden flex flex-col">
                    {/* Search inside dropdown */}
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search services (e.g. marriage, partnership)..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomService();
                          }
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Scrollable list of services */}
                    <div className="overflow-y-auto space-y-1 flex-1 pr-1">
                      {PRESET_SERVICES.filter((s) => {
                        const q = serviceSearch.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          s.title.toLowerCase().includes(q) ||
                          s.category.toLowerCase().includes(q)
                        );
                      }).map((svc) => {
                        const isSelected = (formData.services || []).includes(svc.title);
                        return (
                          <button
                            key={svc.title}
                            type="button"
                            onClick={() => handleToggleService(svc.title)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <span className="truncate font-medium">{svc.title}</span>
                              <span className="text-[10px] text-muted-foreground/70 ml-1 shrink-0">
                                ({svc.category})
                              </span>
                            </span>
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "border-border"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}

                      {/* Add Custom Service Button if user typed something */}
                      {serviceSearch.trim() && (
                        <div className="pt-2 border-t border-border mt-1">
                          <button
                            type="button"
                            onClick={handleAddCustomService}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add custom: "{serviceSearch.trim()}"
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer inside dropdown */}
                    <div className="pt-2 mt-2 border-t border-border flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, services: [], service: "" });
                        }}
                        className="text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        Clear selection
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Location */}
              <div>
                <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                  <label>3. Location / Company *</label>
                  <span className="text-muted-foreground font-normal">{formData.location.length}/60</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={60}
                  placeholder="e.g. Nashik, Maharashtra"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* 4. Review */}
              <div>
                <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                  <label>4. Review Quote *</label>
                  <span className="text-muted-foreground font-normal">{formData.review.length}/400</span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={400}
                  placeholder="Write client feedback here..."
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* 5. Rating & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    5. Rating *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full text-xs p-3 rounded-xl border border-blue-300 bg-blue-50/50 text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs p-3 rounded-xl border border-blue-300 bg-blue-50/50 text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  >
                    <option value="APPROVED">Approved (Live)</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingId ? "Update Testimonial" : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GenericPage>
  );
};

export default WebsiteTestimonialsPage;
