import { useState } from "react";
import Select from "react-select";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import {
  User,
  Phone,
  Mail,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import serviceCategories from "../../data/servicesData";
import { submitContactForm } from "../../lib/api";
import { SOCIAL_PROFILES } from "../../data/socialLinks";
import { openWhatsApp } from "../../lib/whatsapp";

const serviceOptions = serviceCategories.map((category) => ({
  label: category.title,
  options: category.services.map((service) => ({
    value: service.slug,
    label: service.title,
    image: service.image,
    title: service.title,
    slug: service.slug,
    category: category.title,
    categorySlug: category.slug,
  })),
}));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Matches on the service name AND its category
 */
const filterServiceOption = (option, rawInput) => {
  const input = rawInput.trim().toLowerCase();
  if (!input) return true;
  const haystack = `${option.data.title} ${option.data.category}`.toLowerCase();
  return input.split(/\s+/).every((term) => haystack.includes(term));
};

// ---------------------------------------------
// SOCIAL LINKS (icon + address)
// ---------------------------------------------
const SOCIAL_ROWS = [
  {
    ...SOCIAL_PROFILES.instagram,
    icon: FaInstagram,
    iconColor: "text-[#E1306C]",
    tile: "bg-[#FCE7F3]",
  },
  {
    ...SOCIAL_PROFILES.whatsapp,
    onClick: openWhatsApp,
    icon: FaWhatsapp,
    iconColor: "text-[#16A34A]",
    tile: "bg-[#E2F9EA]",
  },
  {
    ...SOCIAL_PROFILES.facebook,
    icon: FaFacebookF,
    iconColor: "text-[#1877F2]",
    tile: "bg-[#E8F1FF]",
  },
];

// Text shown next to the icon: the handle, else the link without its protocol
const socialAddress = (item) =>
  item.handle || item.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const ContactSection = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState(null);

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
    <section className="relative w-full overflow-hidden bg-blue-100 py-8 sm:py-12 lg:py-16 lg:pt-12 min-[1920px]:py-20 min-[1920px]:pt-14 min-[3840px]:py-32 font-['Inter',sans-serif]">
      {/* DIRECT CSS RULES FOR 1440px, 1920px & 3840px RESPONSIVENESS */}
      <style>{`
        /* Standard Desktop (1440px) */
        @media (min-width: 1440px) {
          .contact-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }
          .contact-tagline {
            font-size: 0.85rem !important;
            margin-bottom: 0.75rem !important;
          }
          .contact-title {
            font-size: 2.4rem !important;
            line-height: 1.18 !important;
          }
          .contact-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
          }
          .benefit-title {
            font-size: 1.25rem !important;
          }
          .benefit-desc {
            font-size: 0.875rem !important;
            line-height: 1.6 !important;
          }
        }

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .contact-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }
          .contact-tagline {
            font-size: 1rem !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 1rem !important;
          }
          .contact-title {
            font-size: 3rem !important;
            line-height: 1.18 !important;
          }
          .contact-desc {
            font-size: 1.15rem !important;
            line-height: 1.8 !important;
          }
          .benefit-title {
            font-size: 1.55rem !important;
          }
          .benefit-desc {
            font-size: 1rem !important;
            line-height: 1.7 !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .contact-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .contact-tagline {
            font-size: 1.75rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.75rem !important;
          }
          .contact-title {
            font-size: 5rem !important;
            line-height: 1.15 !important;
          }
          .contact-desc {
            font-size: 2rem !important;
            line-height: 3.25rem !important;
            margin-top: 1.5rem !important;
          }
          .benefit-title {
            font-size: 2.5rem !important;
          }
          .benefit-desc {
            font-size: 1.65rem !important;
            line-height: 2.6rem !important;
          }
        }
      `}</style>

      {/* BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 sm:h-64 sm:w-64 min-[1920px]:h-80 min-[1920px]:w-80 min-[3840px]:h-[30rem] min-[3840px]:w-[30rem] rounded-full bg-blue-300/30 blur-3xl" />
      

      {/* UNIFIED CONTAINER */}
      <div className="contact-container relative z-10 w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_auto_1fr] gap-x-8 min-[1440px]:gap-x-10 min-[1920px]:gap-x-12 min-[3840px]:gap-x-20 gap-y-0 items-start w-full">
          
          {/* =====================================================
              TAGLINE (small heading above the title)
          ====================================================== */}
          <div className="relative min-w-0 w-full lg:col-start-1 lg:row-start-1">
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="contact-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2.5 sm:mb-3 text-left"
            >
              FREE EXPERT CONSULTATION
            </p>
          </div>

          {/* =====================================================
              HEADING + DESCRIPTION (left on desktop, first on mobile)
          ====================================================== */}
          <div className="relative min-w-0 w-full lg:col-start-1 lg:row-start-2">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 sm:h-60 sm:w-60 min-[3840px]:h-96 min-[3840px]:w-96 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative z-10 w-full min-w-0 text-left">
              {/* HEADING */}
              <h2
                style={{ fontFamily: "'Poppins', serif" }}
                className="contact-title text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold leading-[1.18] text-black text-left mb-2.5 sm:mb-4"
              >
                Request Your Free <span className="text-[#0B4EA2]">Consultation</span>
              </h2>
            </div>
          </div>

          {/* =====================================================
              DESCRIPTION (sits between the heading and the social links)
          ====================================================== */}
          <div className="relative min-w-0 w-full mb-8 lg:mb-0 lg:col-start-1 lg:row-start-3">
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="contact-desc mt-3 sm:mt-4 lg:mt-1 text-slate-600 font-normal text-xs sm:text-sm lg:text-base leading-relaxed text-left w-full"
            >
              Tell us about your business requirements and our experts will contact you with the best legal, financial and compliance solutions.
            </p>
          </div>

          {/* =====================================================
              FORM (right on desktop)
          ====================================================== */}
          <div className="relative min-w-0 w-full mb-8 lg:mb-0 lg:col-start-2 lg:row-start-1 lg:row-span-5 overflow-hidden rounded-2xl sm:rounded-[26px] min-[1440px]:rounded-[30px] min-[1920px]:rounded-[36px] min-[3840px]:rounded-[50px] bg-white/95 p-4 sm:p-6 min-[1440px]:p-7 min-[1920px]:p-9 min-[3840px]:p-16 lg:max-w-[520px] min-[1440px]:max-w-[560px] min-[1920px]:max-w-[680px] min-[3840px]:max-w-[1200px] lg:justify-self-end shadow-[0_15px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl border border-white/40">
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 min-[3840px]:h-60 min-[3840px]:w-60 rounded-full bg-blue-100 blur-3xl" />

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 min-[1920px]:space-y-5 min-[3840px]:space-y-8">
              
              {/* NAME + PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 min-[1920px]:gap-5 min-[3840px]:gap-8">
                {/* NAME */}
                <div className="relative min-w-0">
                  <User size={18} className="pointer-events-none absolute left-4 min-[3840px]:left-6 top-1/2 -translate-y-1/2 z-10 text-gray-400 min-[3840px]:w-8 min-[3840px]:h-8" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name *"
                    className="h-11 sm:h-12 min-[1920px]:h-14 min-[3840px]:h-20 w-full min-w-0 rounded-xl min-[3840px]:rounded-2xl border border-gray-200 min-[3840px]:border-2 bg-gray-50 pl-11 sm:pl-12 min-[3840px]:pl-16 pr-4 min-[3840px]:pr-8 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0B4EA2] focus:bg-white focus:ring-4 min-[3840px]:focus:ring-8 focus:ring-blue-100"
                  />
                </div>

                {/* PHONE */}
                <div className="relative min-w-0">
                  <div className="pointer-events-none absolute left-0 top-0 z-10 flex h-11 sm:h-12 min-[1920px]:h-14 min-[3840px]:h-20 items-center gap-1.5 border-r border-gray-200 pl-4 pr-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-medium text-gray-500">
                    <Phone size={18} className="text-gray-400 min-[3840px]:w-8 min-[3840px]:h-8" />
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
                    className="h-11 sm:h-12 min-[1920px]:h-14 min-[3840px]:h-20 w-full min-w-0 rounded-xl min-[3840px]:rounded-2xl border border-gray-200 min-[3840px]:border-2 bg-gray-50 pl-24 min-[3840px]:pl-36 pr-4 min-[3840px]:pr-8 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0B4EA2] focus:bg-white focus:ring-4 min-[3840px]:focus:ring-8 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* EMAIL + SERVICE (one full-width line each) */}
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5 min-[1920px]:gap-5 min-[3840px]:gap-8">
                {/* EMAIL */}
                <div className="relative min-w-0">
                  <Mail size={18} className="pointer-events-none absolute left-4 min-[3840px]:left-6 top-1/2 -translate-y-1/2 z-10 text-gray-400 min-[3840px]:w-8 min-[3840px]:h-8" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (Optional)"
                    className="h-11 sm:h-12 min-[1920px]:h-14 min-[3840px]:h-20 w-full min-w-0 rounded-xl min-[3840px]:rounded-2xl border border-gray-200 min-[3840px]:border-2 bg-gray-50 pl-11 sm:pl-12 min-[3840px]:pl-16 pr-4 min-[3840px]:pr-8 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0B4EA2] focus:bg-white focus:ring-4 min-[3840px]:focus:ring-8 focus:ring-blue-100"
                  />
                </div>

                {/* SERVICE DROPDOWN */}
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
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isSearchable
                    filterOption={filterServiceOption}
                    maxMenuHeight={320}
                    placeholder="Search services *"
                    noOptionsMessage={() => "No service found."}
                    className="w-full text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl"
                    classNamePrefix="service-select"
                    formatGroupLabel={(group) => (
                      <div className="flex items-center justify-between py-1 px-1">
                        <span className="text-xs min-[3840px]:text-base font-bold uppercase tracking-wider text-[#0B4EA2]">
                          {group.label}
                        </span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] min-[3840px]:text-sm font-semibold text-[#0B4EA2]">
                          {group.options.length}
                        </span>
                      </div>
                    )}
                    formatOptionLabel={(option, meta) => (
                      <div className="flex items-center gap-3 py-1 text-left">
                        {/* SERVICE IMAGE */}
                        <div className="flex h-9 w-9 min-[3840px]:h-14 min-[3840px]:w-14 shrink-0 items-center justify-center rounded-lg bg-gray-50 border border-gray-200 overflow-hidden p-0.5">
                          {option.image ? (
                            <img
                              src={option.image}
                              alt={option.title}
                              className="h-full w-full object-contain rounded-md"
                              loading="lazy"
                            />
                          ) : (
                            <Briefcase size={16} className="text-[#0B4EA2]" />
                          )}
                        </div>

                        {/* SERVICE TITLE & CATEGORY */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-xl">
                            {option.title}
                          </p>
                          {meta.context === "menu" && (
                            <p className="text-[10px] sm:text-xs min-[3840px]:text-sm text-gray-500 truncate">
                              {option.category}
                            </p>
                          )}
                        </div>
                      </div>
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
                        paddingTop: "2px",
                        paddingBottom: "2px",
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
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "#eff6ff" : "white",
                        color: "#111827",
                        cursor: "pointer",
                        padding: "8px 12px",
                      }),
                    }}
                  />
                </div>
              </div>

              {/* MESSAGE */}
              <textarea
                name="message"
                rows={3}
                required
                placeholder="Tell us about your requirements *"
                className="min-h-[88px] min-[1920px]:min-h-[120px] min-[3840px]:min-h-[190px] w-full resize-none rounded-xl min-[3840px]:rounded-2xl border border-gray-200 min-[3840px]:border-2 bg-gray-50 p-3.5 sm:p-4 min-[3840px]:p-7 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0B4EA2] focus:bg-white focus:ring-4 min-[3840px]:focus:ring-8 focus:ring-blue-100"
              />

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="group flex h-11 sm:h-12 min-[1920px]:h-14 min-[3840px]:h-20 w-full items-center justify-center rounded-xl min-[3840px]:rounded-2xl bg-[#0B4EA2] text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
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


            </form>
          </div>

          {/* =====================================================
              SOCIAL LINKS (left on desktop, last on mobile)
          ====================================================== */}
          <div className="relative z-10 min-w-0 w-full lg:col-start-1 lg:row-start-4 lg:mt-6 min-[1440px]:mt-8 min-[1920px]:mt-10 min-[3840px]:mt-16">
              {/* SOCIAL LINKS */}
              <div>
                <ul className="flex w-full flex-col gap-3 min-[3840px]:gap-6">
                  {SOCIAL_ROWS.map((item) => {
                    const Icon = item.icon;
                    const address = socialAddress(item);
                    const rowClass =
                      "group flex min-w-0 items-center gap-4 sm:gap-5 min-[1920px]:gap-6 min-[3840px]:gap-8";

                    const content = (
                      <>
                        <span
                          className={`flex h-11 w-11 sm:h-12 sm:w-12 min-[1920px]:h-14 min-[1920px]:w-14 min-[3840px]:h-20 min-[3840px]:w-20 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 ${item.tile}`}
                        >
                          <Icon
                            className={`h-5 w-5 min-[1920px]:h-6 min-[1920px]:w-6 min-[3840px]:h-9 min-[3840px]:w-9 ${item.iconColor}`}
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            className="block text-[11px] sm:text-xs min-[1920px]:text-sm min-[3840px]:text-xl font-semibold uppercase tracking-[0.18em] text-slate-500"
                          >
                            {item.label}
                          </span>
                          <span
                            style={{ fontFamily: "'Poppins', serif" }}
                            className={`mt-0.5 block truncate text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-3xl font-semibold transition-colors duration-300 ${
                              address
                                ? "text-gray-900 group-hover:text-[#0B4EA2]"
                                : "text-slate-400"
                            }`}
                          >
                            {address || "Coming soon"}
                          </span>
                        </span>
                      </>
                    );

                    return (
                      <li key={item.label}>
                        {item.url ? (
                          <a
                            href={item.url}
                            onClick={item.onClick}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${item.label}: ${address}`}
                            className={rowClass}
                          >
                            {content}
                          </a>
                        ) : (
                          <div className={rowClass}>{content}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;