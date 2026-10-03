import { useState } from "react";
import Select from "react-select";
import { FaFacebook, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import {
  User,
  Phone,
  Mail,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Lightbulb,
  ShieldCheck,
  Target,
  Headphones,
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

const filterServiceOption = (option, rawInput) => {
  const input = rawInput.trim().toLowerCase();

  if (!input) return true;

  const haystack = `${option.data.title} ${option.data.category}`.toLowerCase();

  return input.split(/\s+/).every((term) => haystack.includes(term));
};

/* =========================================================
   CONTACT HIGHLIGHTS
========================================================= */

const CONTACT_HIGHLIGHTS = [
  {
    icon: Clock,
    title: "Quick Response",
    desc: "Our team gets back to you within one business day.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    desc: "Talk to experienced CAs, advocates and consultants.",
  },
  {
    icon: Lightbulb,
    title: "Free Consultation",
    desc: "Share your requirement and get clear next steps at no cost.",
  },
  {
    icon: ShieldCheck,
    title: "Confidential & Secure",
    desc: "Your details stay private and are used only to assist you.",
  },
  {
    icon: Target,
    title: "Tailored Solutions",
    desc: "Advice matched to your business, not a one-size-fits-all plan.",
  },
  {
    icon: Headphones,
    title: "Support at Every Step",
    desc: "From the first call to the final filing, we stay with you.",
  },
];

const CONTACT_EMAIL = "megaclickofficial@gmail.com";

/* =========================================================
   SOCIAL LOGOS
========================================================= */

const InstagramLogo = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="ig-grad" cx="0.3" cy="1.05" r="1.25">
        <stop offset="0" stopColor="#FFD600" />
        <stop offset="0.3" stopColor="#FF7A00" />
        <stop offset="0.55" stopColor="#FF0069" />
        <stop offset="0.8" stopColor="#D300C5" />
        <stop offset="1" stopColor="#7638FA" />
      </radialGradient>
    </defs>

    <rect
      width="48"
      height="48"
      rx="13"
      fill="url(#ig-grad)"
    />

    <rect
      x="11.5"
      y="11.5"
      width="25"
      height="25"
      rx="7.5"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
    />

    <circle
      cx="24"
      cy="24"
      r="6"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
    />

    <circle
      cx="31.4"
      cy="16.6"
      r="1.9"
      fill="#fff"
    />
  </svg>
);

const WhatsAppLogo = ({ className }) => (
  <span
    className={`${className} flex items-center justify-center rounded-[28%] bg-[#25D366]`}
  >
    <FaWhatsapp className="h-[64%] w-[64%] text-white" />
  </span>
);

const FacebookLogo = ({ className }) => (
  <FaFacebook
    className={`${className} text-[#1877F2]`}
  />
);

const EmailLogo = ({ className }) => (
  <span
    className={`${className} flex items-center justify-center rounded-[28%] bg-[#EA4335]`}
  >
    <FaEnvelope className="h-[50%] w-[50%] text-white" />
  </span>
);

const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  CONTACT_EMAIL
)}`;

const SOCIAL_ROWS = [
  {
    ...SOCIAL_PROFILES.instagram,
    Logo: InstagramLogo,
  },
  {
    ...SOCIAL_PROFILES.facebook,
    Logo: FacebookLogo,
  },
  {
    ...SOCIAL_PROFILES.whatsapp,
    onClick: openWhatsApp,
    Logo: WhatsAppLogo,
  },
  {
    label: "Email Us",
    url: GMAIL_COMPOSE_URL,
    handle: CONTACT_EMAIL,
    Logo: EmailLogo,
  },
];

const socialAddress = (item) =>
  item.handle ||
  item.url
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "");

/* =========================================================
   CONTACT SECTION
========================================================= */

const ContactSection = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState(null);

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

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
        message:
          "Please select at least one service you're interested in.",
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
      setSubmitState({
        type: "error",
        message: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-blue-100
        py-8
        sm:py-12
        lg:py-14
        xl:py-16
        2xl:py-20
        min-[3840px]:py-28
        font-['Inter',sans-serif]
      "
    >
      {/* =====================================================
          RESPONSIVE CSS
      ====================================================== */}

      <style>{`

        /* ===================================================
           BASE
        =================================================== */

        .contact-field {
          box-sizing: border-box;
        }

        .service-select__control {
          min-height: 44px !important;
        }

        /* ===================================================
           TABLET
        =================================================== */

        @media (min-width: 640px) {

          .service-select__control {
            min-height: 48px !important;
          }

        }

        /* ===================================================
           STANDARD DESKTOP - 1440px
        =================================================== */

        @media (min-width: 1440px) {

          .contact-container {
            max-width: 1380px !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
          }

          .contact-main-grid {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(460px, 540px) !important;

            column-gap: 56px !important;
          }

          .contact-form-card {
            width: 100% !important;
            max-width: 540px !important;
          }

          .contact-title {
            font-size: 44px !important;
            line-height: 1.15 !important;
          }

          .contact-tagline {
            font-size: 13px !important;
            margin-bottom: 12px !important;
          }

          .contact-desc {
            font-size: 15px !important;
            line-height: 1.65 !important;
          }

          .benefit-title {
            font-size: 17px !important;
          }

          .benefit-desc {
            font-size: 14px !important;
          }

        }

        /* ===================================================
           LARGE DESKTOP - 1920px
        =================================================== */

        @media (min-width: 1920px) {

          .contact-container {
            max-width: 1800px !important;
            padding-left: 64px !important;
            padding-right: 64px !important;
          }

          .contact-main-grid {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(600px, 720px) !important;

            column-gap: 80px !important;
          }

          .contact-form-card {
            width: 100% !important;
            max-width: 720px !important;
          }

          .contact-tagline {
            font-size: 16px !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 16px !important;
          }

          .contact-title {
            font-size: 56px !important;
            line-height: 1.15 !important;
          }

          .contact-desc {
            font-size: 18px !important;
            line-height: 1.8 !important;
          }

          .benefit-title {
            font-size: 21px !important;
          }

          .benefit-desc {
            font-size: 16px !important;
            line-height: 1.7 !important;
          }

          .contact-field {
            height: 52px !important;
          }

          .service-select__control {
            min-height: 52px !important;
          }

          .contact-textarea {
            min-height: 125px !important;
          }

        }

        /* ===================================================
           4K - 3840px
        =================================================== */

        @media (min-width: 3840px) {

          .contact-container {
            max-width: 3200px !important;
            padding-left: 80px !important;
            padding-right: 80px !important;
          }

          /*
            IMPORTANT:
            Keep the right form as a controlled-width card.
            Do NOT let it stretch across the entire right half.
          */

          .contact-main-grid {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(900px, 1120px) !important;

            column-gap: 120px !important;
            align-items: start !important;
          }

          .contact-form-card {
            width: 100% !important;
            max-width: 1120px !important;
            justify-self: end !important;
            align-self: start !important;
          }

          .contact-tagline {
            font-size: 22px !important;
            letter-spacing: 0.34em !important;
            margin-bottom: 28px !important;
          }

          .contact-title {
            font-size: 76px !important;
            line-height: 1.12 !important;
          }

          .contact-desc {
            font-size: 26px !important;
            line-height: 1.75 !important;
            margin-top: 24px !important;
          }

          .benefit-title {
            font-size: 30px !important;
          }

          .benefit-desc {
            font-size: 23px !important;
            line-height: 1.65 !important;
          }

          .contact-form-card {
            border-radius: 38px !important;
            padding: 48px !important;
          }

          .contact-form-title {
            font-size: 38px !important;
            margin-bottom: 32px !important;
          }

          .contact-field {
            height: 76px !important;
            font-size: 22px !important;
          }

          .service-select__control {
            min-height: 76px !important;
            height: 76px !important;
          }

          .contact-textarea {
            min-height: 180px !important;
            font-size: 22px !important;
            padding: 24px !important;
          }

          .contact-submit {
            height: 76px !important;
            font-size: 22px !important;
          }

          .contact-benefit-icon {
            width: 82px !important;
            height: 82px !important;
          }

          .contact-benefit-icon svg {
            width: 38px !important;
            height: 38px !important;
          }

          .contact-social-icon {
            width: 62px !important;
            height: 62px !important;
          }

          .contact-social-text {
            font-size: 20px !important;
          }

        }

        /* ===================================================
           SMALL LAPTOP / TABLET
        =================================================== */

        @media (max-width: 1023px) {

          .contact-main-grid {
            grid-template-columns: 1fr !important;
          }

          .contact-form-card {
            grid-column: auto !important;
            grid-row: auto !important;
            justify-self: stretch !important;
            max-width: none !important;
            width: 100% !important;
          }

        }

        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 639px) {

          .contact-title {
            font-size: 30px !important;
            line-height: 1.15 !important;
          }

          .contact-tagline {
            font-size: 11px !important;
            letter-spacing: 0.2em !important;
          }

          .contact-form-card {
            padding: 20px !important;
            border-radius: 20px !important;
          }

          .contact-form-title {
            font-size: 22px !important;
          }

          .contact-field {
            min-height: 46px !important;
          }

          .service-select__control {
            min-height: 46px !important;
          }

          .contact-textarea {
            min-height: 110px !important;
          }

        }

      `}</style>

      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-24
          -top-24
          h-48
          w-48
          sm:h-64
          sm:w-64
          lg:h-80
          lg:w-80
          min-[3840px]:h-[30rem]
          min-[3840px]:w-[30rem]
          rounded-full
          bg-blue-300/30
          blur-3xl
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          contact-container
          relative
          z-10
          mx-auto
          w-full
          max-w-[1380px]
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* ===================================================
            MAIN GRID

            DESKTOP:
            LEFT  = heading + highlights
            RIGHT = FORM CARD

            MOBILE:
            SINGLE COLUMN
        =================================================== */}

        <div
          className="
            contact-main-grid
            grid
            grid-cols-1
            gap-y-8
            lg:grid-cols-[minmax(0,1fr)_540px]
            lg:gap-x-12
            lg:items-start
            w-full
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="min-w-0 w-full">

            {/* TAGLINE */}

            <div className="relative w-full">

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
                className="
                  contact-tagline
                  mb-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#0B4EA2]
                  sm:text-sm
                "
              >
                FREE EXPERT CONSULTATION
              </p>

            </div>

            {/* HEADING */}

            <div className="relative w-full">

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-48
                  w-48
                  rounded-full
                  bg-blue-200/40
                  blur-3xl
                  sm:h-60
                  sm:w-60
                  min-[3840px]:h-96
                  min-[3840px]:w-96
                "
              />

              <div className="relative z-10">

                <h2
                  style={{
                    fontFamily: "'Poppins', serif",
                  }}
                  className="
                    contact-title
                    mb-2
                    text-left
                    text-[1.65rem]
                    font-bold
                    leading-[1.18]
                    text-black
                    sm:text-[2rem]
                    md:text-[2.2rem]
                    lg:text-[2.6rem]
                  "
                >
                  Request Your Free{" "}
                  <span className="text-[#0B4EA2]">
                    Consultation
                  </span>
                </h2>

              </div>

            </div>

            {/* =================================================
                HIGHLIGHTS
            ================================================== */}

            <div
              className="
                relative
                z-10
                mt-6
                min-w-0
                w-full
                lg:mt-8
                min-[1920px]:mt-10
                min-[3840px]:mt-14
              "
            >

              <ul
                className="
                  grid
                  grid-cols-1
                  gap-x-8
                  sm:grid-cols-2
                  min-[1920px]:gap-x-12
                  min-[3840px]:gap-x-20
                "
              >

                {CONTACT_HIGHLIGHTS.map((item, i) => {

                  const Icon = item.icon;

                  return (
                    <li
                      key={item.title}
                      className={`
                        flex
                        items-start
                        gap-3
                        border-blue-200/70
                        py-4
                        min-[1920px]:gap-4
                        min-[1920px]:py-5
                        min-[3840px]:gap-6
                        min-[3840px]:py-8
                        ${
                          i < CONTACT_HIGHLIGHTS.length - 2
                            ? "sm:border-b"
                            : ""
                        }
                        ${
                          i < CONTACT_HIGHLIGHTS.length - 1
                            ? "max-sm:border-b"
                            : ""
                        }
                      `}
                    >

                      {/* ICON */}

                      <span
                        className="
                          contact-benefit-icon
                          flex
                          h-[3.25rem]
                          w-[3.25rem]
                          shrink-0
                          items-center
                          justify-center
                          rounded-[0.9rem]
                          bg-blue-200/70
                          text-[#0B4EA2]
                          min-[1920px]:h-16
                          min-[1920px]:w-16
                          min-[1920px]:rounded-[1.1rem]
                        "
                      >
                        <Icon
                          className="
                            h-[1.4rem]
                            w-[1.4rem]
                            min-[1920px]:h-7
                            min-[1920px]:w-7
                          "
                        />
                      </span>

                      {/* TEXT */}

                      <span className="min-w-0">

                        <span
                          style={{
                            fontFamily: "'Poppins', serif",
                          }}
                          className="
                            benefit-title
                            block
                            text-base
                            font-semibold
                            leading-[1.3]
                            text-[#0f1f3d]
                            min-[1440px]:text-[1.05rem]
                            min-[1920px]:text-[1.3rem]
                          "
                        >
                          {item.title}
                        </span>

                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                          }}
                          className="
                            benefit-desc
                            mt-[0.4rem]
                            block
                            text-[0.85rem]
                            leading-[1.6]
                            text-[#566379]
                            min-[1440px]:text-[0.9rem]
                            min-[1920px]:text-[1.05rem]
                          "
                        >
                          {item.desc}
                        </span>

                      </span>

                    </li>
                  );

                })}

              </ul>

              {/* =================================================
                  SOCIAL LINKS
              ================================================== */}

              <ul
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-x-4
                  gap-y-4
                  sm:flex
                  sm:flex-wrap
                  sm:items-center
                  sm:gap-y-3
                  min-[1920px]:mt-6
                  min-[3840px]:mt-10
                "
              >

                {SOCIAL_ROWS.map((item, idx) => {

                  const { Logo } = item;
                  const address = socialAddress(item);

                  return (
                    <li
                      key={item.label}
                      className="flex items-center"
                    >

                      {idx > 0 && (
                        <span
                          aria-hidden="true"
                          className="
                            hidden
                            select-none
                            text-lg
                            font-light
                            leading-none
                            text-slate-400
                            sm:inline
                            sm:mx-5
                            min-[1920px]:mx-7
                            min-[3840px]:mx-12
                          "
                        >
                          |
                        </span>
                      )}

                      <a
                        href={item.url}
                        onClick={item.onClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={address}
                        aria-label={`${item.label}: ${address}`}
                        className="
                          group
                          flex
                          items-center
                          gap-2
                          min-[3840px]:gap-4
                        "
                      >

                        <Logo
                          className="
                            contact-social-icon
                            h-9
                            w-9
                            shrink-0
                            transition-transform
                            duration-300
                            group-hover:scale-105
                            min-[1920px]:h-10
                            min-[1920px]:w-10
                          "
                        />

                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                          }}
                          className="
                            contact-social-text
                            text-xs
                            font-semibold
                            text-slate-700
                            transition-colors
                            duration-300
                            group-hover:text-[#0B4EA2]
                            min-[1920px]:text-sm
                          "
                        >
                          {item.label}
                        </span>

                      </a>

                    </li>
                  );

                })}

              </ul>

            </div>

          </div>

          {/* =================================================
              RIGHT FORM CARD
          ================================================== */}

          <div
            className="
              contact-form-card
              relative
              min-w-0
              w-full
              justify-self-stretch
              rounded-2xl
              border
              border-white/50
              bg-white/95
              p-4
              shadow-[0_15px_50px_rgba(0,0,0,0.08)]
              backdrop-blur-sm
              sm:rounded-[26px]
              sm:p-6
              lg:max-w-[540px]
              lg:justify-self-end
              lg:p-7
              min-[1920px]:rounded-[36px]
              min-[1920px]:p-9
            "
          >

            {/* FORM TITLE */}

            <h3
              style={{
                fontFamily: "'Poppins', serif",
              }}
              className="
                contact-form-title
                mb-4
                text-left
                text-xl
                font-bold
                text-black
                sm:mb-5
                sm:text-2xl
                min-[1920px]:mb-6
                min-[1920px]:text-3xl
              "
            >
              Message Us
            </h3>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="
                space-y-3
                sm:space-y-3.5
                min-[1920px]:space-y-5
              "
            >

              {/* =================================================
                  NAME + PHONE
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                  sm:gap-3.5
                  min-[1920px]:gap-5
                "
              >

                {/* NAME */}

                <div className="relative min-w-0">

                  <User
                    size={18}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      z-10
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name *"
                    className="
                      contact-field
                      h-11
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      pl-11
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
                      sm:h-12
                      sm:pl-12
                      sm:text-base
                    "
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
                      h-11
                      items-center
                      gap-1.5
                      border-r
                      border-gray-200
                      pl-4
                      pr-2
                      text-sm
                      font-medium
                      text-gray-500
                      sm:h-12
                      sm:text-base
                    "
                  >
                    <Phone
                      size={18}
                      className="text-gray-400"
                    />
                    +91
                  </div>

                  <input
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    required
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    maxLength={10}
                    placeholder="Phone Number *"
                    className="
                      contact-field
                      h-11
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
                      sm:h-12
                      sm:text-base
                    "
                  />

                </div>

              </div>

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div className="relative min-w-0">

                <Mail
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    z-10
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address (Optional)"
                  className="
                    contact-field
                    h-11
                    w-full
                    min-w-0
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    pl-11
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
                    sm:h-12
                    sm:pl-12
                    sm:text-base
                  "
                />

              </div>

              {/* =================================================
                  SERVICE DROPDOWN
              ================================================== */}

              <div className="relative min-w-0">

                <Briefcase
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    z-20
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <Select
                  options={serviceOptions}
                  value={selectedServices}
                  onChange={(options) => {
                    setSelectedServices(
                      options ? [...options] : []
                    );
                    setSubmitState(null);
                  }}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isSearchable
                  filterOption={filterServiceOption}
                  maxMenuHeight={320}
                  menuPortalTarget={
                    typeof document !== "undefined"
                      ? document.body
                      : null
                  }
                  menuPosition="fixed"
                  menuPlacement="auto"
                  menuShouldScrollIntoView={false}
                  placeholder="Search services *"
                  noOptionsMessage={() =>
                    "No service found."
                  }
                  className="
                    w-full
                    text-sm
                    sm:text-base
                  "
                  classNamePrefix="service-select"
                  formatGroupLabel={(group) => (
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        px-1
                        py-1
                      "
                    >

                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#0B4EA2]
                        "
                      >
                        {group.label}
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-blue-50
                          px-2
                          py-0.5
                          text-[10px]
                          font-semibold
                          text-[#0B4EA2]
                        "
                      >
                        {group.options.length}
                      </span>

                    </div>
                  )}
                  formatOptionLabel={(option, meta) => (
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        py-1
                        text-left
                      "
                    >

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-lg
                          border
                          border-gray-200
                          bg-gray-50
                          p-0.5
                        "
                      >
                        {option.image ? (
                          <img
                            src={option.image}
                            alt={option.title}
                            className="
                              h-full
                              w-full
                              rounded-md
                              object-contain
                            "
                            loading="lazy"
                          />
                        ) : (
                          <Briefcase
                            size={16}
                            className="text-[#0B4EA2]"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">

                        <p
                          className="
                            truncate
                            text-xs
                            font-medium
                            text-gray-900
                            sm:text-sm
                          "
                        >
                          {option.title}
                        </p>

                        {meta.context === "menu" && (
                          <p
                            className="
                              truncate
                              text-[10px]
                              text-gray-500
                              sm:text-xs
                            "
                          >
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
                      borderColor: state.isFocused
                        ? "#0B4EA2"
                        : "#e5e7eb",
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

                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),

                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow:
                        "0 15px 35px rgba(0,0,0,0.12)",
                    }),

                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? "#eff6ff"
                        : "white",
                      color: "#111827",
                      cursor: "pointer",
                      padding: "8px 12px",
                    }),
                  }}
                />

              </div>

              {/* =================================================
                  MESSAGE
              ================================================== */}

              <textarea
                name="message"
                rows={3}
                required
                placeholder="Tell us about your requirements *"
                className="
                  contact-textarea
                  min-h-[88px]
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3.5
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#0B4EA2]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                  sm:p-4
                  sm:text-base
                "
              />

              {/* =================================================
                  SUBMIT BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
                className="
                  contact-submit
                  group
                  flex
                  h-11
                  w-full
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#0B4EA2]
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-green-600
                  hover:shadow-xl
                  disabled:pointer-events-none
                  disabled:opacity-60
                  sm:h-12
                  sm:text-base
                "
              >

                <span
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  {submitting
                    ? "Sending…"
                    : "Send Message"}

                  {!submitting && (
                    <ArrowRight
                      size={18}
                      className="
                        transition
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  )}

                </span>

              </button>

              {/* =================================================
                  SUBMIT STATUS
              ================================================== */}

              {submitState && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`
                    flex
                    items-start
                    gap-2
                    rounded-xl
                    p-3
                    text-sm
                    ${
                      submitState.type === "success"
                        ? "border border-green-200 bg-green-50 text-green-800"
                        : "border border-red-200 bg-red-50 text-red-700"
                    }
                  `}
                >

                  {submitState.type === "success" ? (
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                  ) : (
                    <span className="mt-0.5 shrink-0 font-bold">
                      !
                    </span>
                  )}

                  <span>
                    {submitState.message}
                  </span>

                </div>
              )}

            </form>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ContactSection;