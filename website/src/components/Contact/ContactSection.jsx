import React, { useState } from "react";
import Select from "react-select";
import {
  ShieldCheck,
  Users,
  Headset,
  User,
  Phone,
  Mail,
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

import serviceCategories from "../../data/servicesData";
import { submitContactForm } from "../../lib/api";

const serviceOptions = serviceCategories.map((category) => ({
  label: category.title,
  emoji: category.emoji,
  options: category.services.map((service) => ({
    value: service.slug,
    label: service.title,
    emoji: service.emoji,
    title: service.title,
    slug: service.slug,
    category: category.title,
    categorySlug: category.slug,
  })),
}));

const totalServiceCount = serviceOptions.reduce(
  (sum, group) => sum + group.options.length,
  0
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Matches on the service name AND its category, so typing "legal" surfaces
 * every legal service and "gst" finds GST wherever it sits.
 */
const filterServiceOption = (option, rawInput) => {
  const input = rawInput.trim().toLowerCase();
  if (!input) return true;
  const haystack = `${option.data.title} ${option.data.category}`.toLowerCase();
  return input.split(/\s+/).every((term) => haystack.includes(term));
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Business Solutions",
    text: "Reliable legal, financial and compliance services under one roof.",
  },
  {
    icon: Users,
    title: "15,000+ Happy Clients",
    text: "Trusted by startups, professionals and businesses across India.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    text: "Our experts are always ready to guide you at every step.",
  },
];

const ContactSection = () => {
  // A visitor can ask about several services at once — each becomes its own
  // piece of work on the dashboard, assigned to whoever handles that service.
  const [selectedServices, setSelectedServices] = useState([]);
  // Digits only — the "+91" country code is fixed and shown alongside the field.
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState(null);

  // =====================================================
  // FORM SUBMIT
  // =====================================================
  // Creates an unassigned lead on the dashboard's Leads board, carrying the
  // visitor's details and every service they picked.

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (name.length < 2) {
      setSubmitState({
        type: "error",
        message: "Please enter your full name.",
      });
      return;
    }

    if (phone.length !== 10) {
      setSubmitState({
        type: "error",
        message: "Enter a valid 10-digit phone number.",
      });
      return;
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      setSubmitState({
        type: "error",
        message: "Enter a valid email address, or leave it blank.",
      });
      return;
    }

    if (!message) {
      setSubmitState({
        type: "error",
        message: "Tell us a little about your requirements.",
      });
      return;
    }

    if (selectedServices.length === 0) {
      setSubmitState({
        type: "error",
        message: "Please select at least one service you're interested in.",
      });
      return;
    }

    setSubmitting(true);
    setSubmitState(null);

    try {
      const [primary] = selectedServices;

      await submitContactForm({
        name,
        phone: `+91${phone}`,
        email,
        message,
        services: selectedServices.map((option) => ({
          title: option.title,
          slug: option.slug,
          category: option.category,
          categorySlug: option.categorySlug,
        })),
        // The flat fields mirror the first pick, for anything still reading them.
        service: primary.title,
        serviceSlug: primary.slug,
        serviceCategory: primary.category,
      });

      setSubmitState({
        type: "success",
        message:
          "Thank you! Your request has been received — our team will contact you shortly.",
      });
      form.reset();
      setSelectedServices([]);
      setPhone("");
    } catch (err) {
      setSubmitState({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-blue-100 py-8 sm:py-12 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 font-['Inter',sans-serif]">
      {/* BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 sm:h-64 sm:w-64 min-[1920px]:h-80 min-[1920px]:w-80 min-[3840px]:h-[30rem] min-[3840px]:w-[30rem] rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-52 w-52 sm:h-72 sm:w-72 min-[1920px]:h-96 min-[1920px]:w-96 min-[3840px]:h-[35rem] min-[3840px]:w-[35rem] rounded-full bg-green-300/30 blur-3xl" />

      {/* UNIFIED CONTAINER */}
      <div className="relative z-10 w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-[1440px]:gap-10 min-[1920px]:gap-12 min-[3840px]:gap-20 items-start w-full">
          
          {/* =====================================================
              LEFT SIDE - FORM
          ====================================================== */}
          <div className="relative min-w-0 w-full overflow-hidden rounded-2xl sm:rounded-[26px] min-[1440px]:rounded-[30px] min-[1920px]:rounded-[36px] min-[3840px]:rounded-[50px] bg-white/95 p-5 sm:p-7 min-[1440px]:p-9 min-[1920px]:p-12 min-[3840px]:p-20 shadow-[0_15px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl border border-white/40">
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 min-[3840px]:h-60 min-[3840px]:w-60 rounded-full bg-blue-100 blur-3xl" />

            {/* BADGE */}
            <span className="relative inline-flex max-w-full items-center gap-2 rounded-full bg-green-100 px-3.5 sm:px-5 min-[3840px]:px-8 py-2 min-[3840px]:py-4 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-bold text-green-700">
              <Sparkles size={15} className="flex-shrink-0 min-[3840px]:w-6 min-[3840px]:h-6" />
              <span className="truncate">Free Expert Consultation</span>
            </span>

            {/* HEADING */}
            <h2 className="text-2xl sm:text-3xl min-[1440px]:text-4xl min-[1920px]:text-5xl min-[3840px]:text-7xl font-bold leading-tight text-black mt-3 sm:mt-4 min-[3840px]:mt-6">
              Request Your Free <br className="hidden sm:block" />
              <span className="text-[#0B4EA2]">Consultation</span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-3 sm:mt-4 min-[3840px]:mt-6 max-w-2xl text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-700 leading-relaxed">
              Tell us about your business requirements and our experts will
              contact you with the best legal, financial and compliance
              solutions.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-6 sm:mt-7 min-[1920px]:mt-8 min-[3840px]:mt-14 space-y-4 sm:space-y-5 min-[1920px]:space-y-6 min-[3840px]:space-y-10">
              
              {/* NAME + PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-[1920px]:gap-6 min-[3840px]:gap-10">
                {/* NAME */}
                <div className="relative min-w-0">
                  <User size={18} className="pointer-events-none absolute left-4 min-[3840px]:left-6 top-1/2 -translate-y-1/2 z-10 text-gray-400 min-[3840px]:w-8 min-[3840px]:h-8" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name *"
                    className="h-12 sm:h-14 min-[1920px]:h-16 min-[3840px]:h-24 w-full min-w-0 rounded-xl min-[3840px]:rounded-2xl border border-gray-200 min-[3840px]:border-2 bg-gray-50 pl-11 sm:pl-12 min-[3840px]:pl-16 pr-4 min-[3840px]:pr-8 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0B4EA2] focus:bg-white focus:ring-4 min-[3840px]:focus:ring-8 focus:ring-blue-100"
                  />
                </div>

                {/* PHONE */}
                <div className="relative min-w-0">
                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-0
                      top-0
                      z-10
                      flex
                      h-14
                      items-center
                      gap-1.5
                      border-r
                      border-gray-200
                      pl-4
                      pr-2
                      text-sm
                      font-medium
                      text-gray-500
                      sm:pl-4.5
                    "
                  >
                    <Phone size={18} className="text-gray-400" />
                    +91
                  </div>

                  <input
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    required
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    maxLength={10}
                    placeholder="Phone Number *"
                    className="
                      h-14
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      pl-24
                      pr-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#0B4EA2]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                      sm:pl-24
                      sm:text-base
                    "
                  />
                </div>
              </div>

              {/* EMAIL + SERVICE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-[1920px]:gap-6 min-[3840px]:gap-10">
                {/* EMAIL */}
                <div className="relative min-w-0">
                  <Mail size={18} className="pointer-events-none absolute left-4 min-[3840px]:left-6 top-1/2 -translate-y-1/2 z-10 text-gray-400 min-[3840px]:w-8 min-[3840px]:h-8" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (Optional)"
                    className="h-12 sm:h-14 min-[1920px]:h-16 min-[3840px]:h-24 w-full min-w-0 rounded-xl min-[3840px]:rounded-2xl border border-gray-200 min-[3840px]:border-2 bg-gray-50 pl-11 sm:pl-12 min-[3840px]:pl-16 pr-4 min-[3840px]:pr-8 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0B4EA2] focus:bg-white focus:ring-4 min-[3840px]:focus:ring-8 focus:ring-blue-100"
                  />
                </div>

                {/* SERVICE */}
                <div className="relative min-w-0">
                  <Briefcase size={18} className="pointer-events-none absolute left-4 min-[3840px]:left-6 top-1/2 -translate-y-1/2 z-20 text-gray-400 min-[3840px]:w-8 min-[3840px]:h-8" />
                  <Select
                    options={serviceOptions}
                    value={selectedServices}
                    onChange={(options) => {
                      setSelectedServices(options ? [...options] : []);
                      setSubmitState(null);
                    }}
                    isMulti
                    // The menu stays open between picks so choosing three
                    // services doesn't mean reopening it three times.
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isSearchable
                    filterOption={filterServiceOption}
                    maxMenuHeight={320}
                    placeholder={`Search ${totalServiceCount} services * — pick one or more`}
                    noOptionsMessage={() => "No service matches that search."}
                    className="w-full text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl"
                    classNamePrefix="service-select"
                    formatGroupLabel={(group) => (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] min-[3840px]:text-base font-bold uppercase tracking-wider text-[#0B4EA2]">
                          {group.emoji ? `${group.emoji} ` : ""}
                          {group.label}
                        </span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] min-[3840px]:text-sm font-semibold text-[#0B4EA2]">
                          {group.options.length}
                        </span>
                      </div>
                    )}
                    formatOptionLabel={(option, meta) => (
                      <span className="flex items-center gap-2">
                        {option.emoji && <span>{option.emoji}</span>}
                        <span className="min-w-0 truncate">{option.title}</span>
                        {meta.context === "menu" && (
                          <span className="ml-auto shrink-0 text-[10px] min-[3840px]:text-sm text-gray-400">
                            {option.category}
                          </span>
                        )}
                      </span>
                    )}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        width: "100%",
                        minHeight: "48px",
                        height: "100%",
                        borderRadius: "12px",
                        paddingLeft: "32px",
                        borderColor: state.isFocused ? "#0B4EA2" : "#e5e7eb",
                        boxShadow: state.isFocused
                          ? "0 0 0 4px rgba(59,130,246,.15)"
                          : "none",
                        backgroundColor: "#f9fafb",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        minWidth: 0,
                        paddingLeft: "4px",
                        paddingRight: "8px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        gap: "4px",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>
              </div>

              {/* MESSAGE */}
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us about your requirements *"
                className="min-h-[120px] min-[1920px]:min-h-[150px] min-[3840px]:min-h-[220px] w-full resize-none rounded-xl min-[3840px]:rounded-2xl border border-gray-200 min-[3840px]:border-2 bg-gray-50 p-4 min-[3840px]:p-8 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0B4EA2] focus:bg-white focus:ring-4 min-[3840px]:focus:ring-8 focus:ring-blue-100"
              />

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="group flex h-12 sm:h-14 min-[1920px]:h-16 min-[3840px]:h-24 w-full items-center justify-center rounded-xl min-[3840px]:rounded-2xl bg-[#0B4EA2] text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2 min-[3840px]:gap-4">
                  {submitting ? "Sending…" : "Send Message"}
                  {!submitting && (
                    <ArrowRight size={18} className="transition duration-300 group-hover:translate-x-1 min-[3840px]:w-7 min-[3840px]:h-7" />
                  )}
                </span>
              </button>

              {/* SUBMIT STATUS */}
              {submitState && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex items-start gap-2 rounded-xl p-3 text-sm min-[1920px]:text-base min-[3840px]:text-2xl ${
                    submitState.type === "success"
                      ? "border border-green-200 bg-green-50 text-green-800"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {submitState.type === "success" ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 min-[3840px]:w-6 min-[3840px]:h-6" />
                  ) : (
                    <span className="mt-0.5 shrink-0 font-bold">!</span>
                  )}
                  <span>{submitState.message}</span>
                </div>
              )}

              {/* TRUST POINTS */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 min-[3840px]:gap-x-8 gap-y-2 pt-1 min-[3840px]:pt-4">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-xl text-gray-700">
                  <CheckCircle2 size={15} className="flex-shrink-0 text-green-600 min-[3840px]:w-6 min-[3840px]:h-6" />
                  100% Secure
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-xl text-gray-700">
                  <CheckCircle2 size={15} className="flex-shrink-0 text-green-600 min-[3840px]:w-6 min-[3840px]:h-6" />
                  Expert Guidance
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-xl text-gray-700">
                  <CheckCircle2 size={15} className="flex-shrink-0 text-green-600 min-[3840px]:w-6 min-[3840px]:h-6" />
                  Quick Response
                </div>
              </div>

              {/* SOCIAL */}
              <div className="mt-5 sm:mt-7 min-[3840px]:mt-10 border-t border-gray-200 pt-5 sm:pt-6 min-[3840px]:pt-8">
                <h3 className="text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-3xl font-bold text-gray-900">
                  Connect With Us
                </h3>
                <p className="mt-1.5 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-600">
                  Follow us for updates, business tips and latest services.
                </p>

                <div className="mt-4 sm:mt-5 min-[3840px]:mt-6 flex flex-wrap gap-3 sm:gap-4 min-[3840px]:gap-6">
                  <a href="#" aria-label="Facebook" className="flex h-10 w-10 sm:h-12 sm:w-12 min-[3840px]:h-18 min-[3840px]:w-18 items-center justify-center rounded-full bg-blue-100 text-[#0B4EA2] transition hover:bg-[#0B4EA2] hover:text-white">
                    <FaFacebookF size={18} className="min-[3840px]:w-7 min-[3840px]:h-7" />
                  </a>
                  <a href="#" aria-label="LinkedIn" className="flex h-10 w-10 sm:h-12 sm:w-12 min-[3840px]:h-18 min-[3840px]:w-18 items-center justify-center rounded-full bg-blue-100 text-[#0B4EA2] transition hover:bg-[#0B4EA2] hover:text-white">
                    <FaLinkedinIn size={18} className="min-[3840px]:w-7 min-[3840px]:h-7" />
                  </a>
                  <a href="https://wa.me/919921611911" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 sm:h-12 sm:w-12 min-[3840px]:h-18 min-[3840px]:w-18 items-center justify-center rounded-full bg-green-100 text-green-600 transition hover:bg-green-600 hover:text-white">
                    <FaWhatsapp size={20} className="min-[3840px]:w-8 min-[3840px]:h-8" />
                  </a>
                  <a href="#" aria-label="Instagram" className="flex h-10 w-10 sm:h-12 sm:w-12 min-[3840px]:h-18 min-[3840px]:w-18 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition hover:bg-pink-600 hover:text-white">
                    <FaInstagram size={20} className="min-[3840px]:w-8 min-[3840px]:h-8" />
                  </a>
                </div>
              </div>

            </form>
          </div>

          {/* =====================================================
              RIGHT SIDE - BENEFITS & STATS
          ====================================================== */}
          <div className="relative min-w-0 w-full self-stretch lg:pt-2 xl:pt-4">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 sm:h-60 sm:w-60 min-[3840px]:h-96 min-[3840px]:w-96 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 sm:h-52 sm:w-52 min-[3840px]:h-80 min-[3840px]:w-80 rounded-full bg-green-200/40 blur-3xl" />

            <div className="relative z-10 w-full min-w-0">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#0B4EA2] px-4 sm:px-5 min-[3840px]:px-8 py-2 min-[3840px]:py-4 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold text-white shadow-lg">
                <Sparkles size={15} className="flex-shrink-0 min-[3840px]:w-6 min-[3840px]:h-6" />
                Why Choose MegaClick
              </span>

              <h2 className="text-2xl sm:text-3xl min-[1440px]:text-4xl min-[1920px]:text-5xl min-[3840px]:text-7xl font-bold leading-tight text-black mt-3 sm:mt-4 min-[3840px]:mt-6">
                Let's Build Your <br className="hidden sm:block" />
                <span className="text-[#0B4EA2]">Business Together</span>
              </h2>

              <p className="mt-3 sm:mt-4 min-[3840px]:mt-6 max-w-2xl text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-700 leading-relaxed">
                MegaClick simplifies business registration, taxation, legal
                compliance and financial services with expert guidance and
                end-to-end support.
              </p>

              {/* BENEFITS LIST */}
              <div className="mt-6 sm:mt-8 min-[1920px]:mt-9 min-[3840px]:mt-14 space-y-4 sm:space-y-5 min-[3840px]:space-y-8">
                {benefits.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="group w-full min-w-0 rounded-2xl sm:rounded-3xl min-[3840px]:rounded-[36px] bg-white/95 p-4 sm:p-5 min-[1440px]:p-6 min-[1920px]:p-7 min-[3840px]:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.07)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-white/60"
                    >
                      <div className="flex min-w-0 items-start gap-3 sm:gap-5 min-[3840px]:gap-8">
                        <div className="flex h-11 w-11 sm:h-14 sm:w-14 min-[1920px]:h-16 min-[1920px]:w-16 min-[3840px]:h-24 min-[3840px]:w-24 flex-shrink-0 items-center justify-center rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl bg-blue-100 transition duration-300 group-hover:bg-[#0B4EA2]">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 min-[1920px]:w-7 min-[1920px]:h-7 min-[3840px]:w-12 min-[3840px]:h-12 text-[#0B4EA2] transition group-hover:text-white" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="min-w-0 text-base sm:text-lg min-[1920px]:text-xl min-[3840px]:text-3xl font-bold text-gray-900 leading-snug">
                              {item.title}
                            </h3>
                            <ArrowUpRight size={18} className="mt-1 flex-shrink-0 text-gray-300 transition group-hover:rotate-45 group-hover:text-[#0B4EA2] min-[3840px]:w-7 min-[3840px]:h-7" />
                          </div>
                          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-600 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* STATS */}
              <div className="mt-6 sm:mt-8 min-[1920px]:mt-9 min-[3840px]:mt-14 grid grid-cols-3 gap-2 sm:gap-4 min-[3840px]:gap-8">
                <div className="min-w-0 rounded-xl sm:rounded-3xl min-[3840px]:rounded-[32px] bg-white p-3 sm:p-5 min-[3840px]:p-8 text-center shadow-lg">
                  <h3 className="text-xl sm:text-3xl min-[1920px]:text-4xl min-[3840px]:text-6xl font-extrabold text-[#0B4EA2]">
                    15K+
                  </h3>
                  <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl text-gray-600">
                    Happy Clients
                  </p>
                </div>

                <div className="min-w-0 rounded-xl sm:rounded-3xl min-[3840px]:rounded-[32px] bg-white p-3 sm:p-5 min-[3840px]:p-8 text-center shadow-lg">
                  <h3 className="text-xl sm:text-3xl min-[1920px]:text-4xl min-[3840px]:text-6xl font-extrabold text-green-600">
                    25+
                  </h3>
                  <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl text-gray-600">
                    Services
                  </p>
                </div>

                <div className="min-w-0 rounded-xl sm:rounded-3xl min-[3840px]:rounded-[32px] bg-white p-3 sm:p-5 min-[3840px]:p-8 text-center shadow-lg">
                  <h3 className="text-xl sm:text-3xl min-[1920px]:text-4xl min-[3840px]:text-6xl font-extrabold text-[#0B4EA2]">
                    10+
                  </h3>
                  <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl text-gray-600">
                    Years
                  </p>
                </div>
              </div>

              {/* TRUST LINE */}
              <div className="mt-5 sm:mt-7 min-[1920px]:mt-8 min-[3840px]:mt-12 flex flex-wrap gap-x-4 sm:gap-x-5 min-[3840px]:gap-x-8 gap-y-2">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-xl font-medium text-gray-700">
                  <CheckCircle2 size={16} className="flex-shrink-0 text-green-600 min-[3840px]:w-6 min-[3840px]:h-6" />
                  Trusted Professionals
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-xl font-medium text-gray-700">
                  <CheckCircle2 size={16} className="flex-shrink-0 text-green-600 min-[3840px]:w-6 min-[3840px]:h-6" />
                  Fast Processing
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-xl font-medium text-gray-700">
                  <CheckCircle2 size={16} className="flex-shrink-0 text-green-600 min-[3840px]:w-6 min-[3840px]:h-6" />
                  Transparent Pricing
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;