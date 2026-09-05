import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Star,
  X,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GenericPage from "@/components/GenericPage";

export interface ITestimonial {
  _id?: string;
  name: string;
  service: string;
  location: string;
  review: string;
  rating: number;
  status: "APPROVED" | "PENDING" | "REJECTED";
  isFeatured?: boolean;
}

const API_BASE_URL = "http://localhost:5000/api/v1/website-control/testimonials";

const initialFormState: ITestimonial = {
  name: "",
  service: "",
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
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (item: ITestimonial) => {
    setFormData(item);
    setEditingId(item._id || null);
    setErrorMsg("");
    setIsModalOpen(true);
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
    setSubmitting(true);
    setErrorMsg("");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

      const payload = {
        ...formData,
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
          {filteredList.map((item) => (
            <div
              key={item._id}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              {/* Left Testimonial Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-foreground">{item.name}</h3>
                  <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} size={15} className="fill-blue-500 text-blue-500" />
                  ))}
                </div>

                {/* Service Headline */}
                <h4 className="text-xs font-bold text-foreground">
                  "{item.service}"
                </h4>

                {/* Review Text */}
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  "{item.review}"
                </p>

                {/* Location Info */}
                <div className="text-[11px] text-muted-foreground/80 font-medium">
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
          ))}
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

              {/* 2. Service */}
              <div>
                <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                  <label>2. Service Name *</label>
                  <span className="text-muted-foreground font-normal">{formData.service.length}/80</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="e.g. Income Tax Registration"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
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
