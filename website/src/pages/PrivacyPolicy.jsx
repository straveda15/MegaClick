import React, { useEffect, useState } from "react";

const sections = [
  {
    id: "01",
    title: "Introduction & Acceptance",
    content: [
      `MegaClick (“MegaClick”, “we”, “us”, or “our”) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, share, and protect information when you visit our website, use our services, or communicate with us.`,
      `By accessing or using our website or services, you acknowledge that you have read and understood this Privacy Policy.`,
    ],
  },
  {
    id: "02",
    title: "Who We Are & Our Role",
    content: [
      `MegaClick provides legal, financial, banking, real estate, compliance, registration, and related professional services.`,
      `We may act as a facilitator or intermediary between customers, government departments, banks, and independent professionals.`,
    ],
  },
  {
    id: "03",
    title: "Information We Collect",
    content: [
      `Depending on the services you request, we may collect the following information:`,
    ],
    bullets: [
      "Name, address, date of birth, mobile number and email address.",
      "PAN, Aadhaar, Voter ID, Passport and Driving Licence details.",
      "Business, GST, PAN, TAN, UDYAM and IEC details.",
      "Banking and financial information.",
      "Property and legal documents.",
      "Government portal credentials where required for the requested service.",
      "Emails, WhatsApp communications, feedback and other communications.",
      "Payment transaction ID, amount, status and billing information.",
    ],
  },
  {
    id: "04",
    title: "Payment Information",
    content: [
      `Online payments may be processed through third-party payment gateways, banks, or other payment service providers.`,
      `We do not store full card numbers, CVV, UPI PINs, or net-banking passwords. We may retain limited transaction information such as transaction ID, amount, payment status, and billing details for service, accounting, and legal purposes.`,
    ],
    highlight:
      "Full card numbers, CVV, UPI PINs, and net-banking passwords are not stored by MegaClick.",
  },
  {
    id: "05",
    title: "Aadhaar & Other Government ID Documents",
    content: [
      `Aadhaar information will be requested only where it is necessary for the requested service. Where feasible, masked Aadhaar may be used.`,
      `Aadhaar information will not be publicly displayed or published and will not be used for marketing purposes.`,
    ],
  },
  {
    id: "06",
    title: "How We Use Your Information",
    content: [
      `We may use your information for the following purposes:`,
    ],
    bullets: [
      "To provide and manage requested services.",
      "To communicate with government departments and banks.",
      "To coordinate with professional service providers.",
      "To process orders, invoices and payments.",
      "To send service status updates and reminders.",
      "To improve our website and services.",
      "To prevent fraud and misuse.",
      "To comply with legal and regulatory requirements.",
    ],
  },
  {
    id: "07",
    title: "Cookies",
    content: [
      `Our website may use cookies and analytics technologies to improve functionality, understand website usage, and enhance user experience.`,
    ],
    highlight: "Google Analytics usage: Please confirm.",
  },
  {
    id: "08",
    title: "How We Share Your Information",
    content: [
      `Depending on the service requested and applicable requirements, information may be shared with:`,
    ],
    bullets: [
      "Government authorities and departments.",
      "Advocates, CAs, CSs, notaries and consultants.",
      "Banks, NBFCs and insurance providers.",
      "Real-estate parties and related service providers.",
      "Hosting, payment gateway, CRM, WhatsApp and email service providers.",
      "Authorities where disclosure is required by law or regulation.",
    ],
  },
  {
    id: "09",
    title: "Data Retention",
    content: [
      `We retain personal information for as long as reasonably necessary to provide the requested services and to meet applicable legal, regulatory, accounting, or dispute-resolution requirements.`,
    ],
    highlight: "Specific retention period: Please confirm.",
  },
  {
    id: "10",
    title: "Security",
    content: [
      `We take reasonable measures to protect personal information against unauthorized access, misuse, alteration, disclosure, or destruction.`,
    ],
    bullets: [
      "Access controls.",
      "Password protection.",
      "HTTPS for website communications.",
      "Secured storage.",
      "Restricted or encrypted document storage where feasible.",
    ],
    additional:
      "Where government portal credentials are provided for a service, users are encouraged to change such credentials after the service has been completed.",
  },
  {
    id: "11",
    title: "Marketing & Communication Consent",
    content: [
      `Where consent has been provided, we may communicate with you through phone, SMS, WhatsApp, or email regarding offers, updates, and other communications.`,
      `You may withdraw your consent for marketing communications at any time. Transactional and service-related communications may continue where necessary.`,
    ],
  },
  {
    id: "12",
    title: "Transfer of Data Outside India",
    content: [
      `Some third-party cloud, hosting, email, analytics, or other service providers may process or store information on servers located outside India.`,
    ],
  },
  {
    id: "13",
    title: "Your Rights",
    content: [
      `Subject to applicable law, you may have the following rights:`,
    ],
    bullets: [
      "Request access to your personal information.",
      "Request correction or updating of inaccurate information.",
      "Request deletion or erasure of information where applicable.",
      "Withdraw consent where processing is based on consent.",
      "Nominate a person where permitted by applicable law.",
      "Raise a grievance regarding the processing of your information.",
    ],
  },
  {
    id: "14",
    title: "Children",
    content: [
      `Our website and services are intended for individuals who are 18 years of age or older.`,
      `Where services require documents or information relating to a minor, the request should be made by the minor's parent or legal guardian.`,
    ],
  },
  {
    id: "15",
    title: "Links to Other Websites",
    content: [
      `Our website may contain links to government portals, payment pages, and other third-party websites. MegaClick is not responsible for the privacy practices or content of such third-party websites.`,
    ],
  },
  {
    id: "16",
    title: "Grievance Officer & Contact",
    content: [
      `For privacy-related questions, requests, or grievances, you may contact MegaClick using the contact details provided on our website.`,
    ],
  },
  {
    id: "17",
    title: "Changes to this Policy",
    content: [
      `We may update this Privacy Policy from time to time. Where material changes are made, we may provide notice through our website or other appropriate communication channels.`,
    ],
  },
];

const privacyHighlights = [
  {
    id: "01",
    label: "PRIVACY HIGHLIGHTS",
    title: "What We Protect",
    icon: "shield",
    items: [
      {
        title: "Personal Information",
        description:
          "Names, contact details and identity information are handled responsibly.",
      },
      {
        title: "Government Documents",
        description:
          "PAN, Aadhaar, Voter ID and other requested documents are protected.",
      },
      {
        title: "Service Communications",
        description:
          "Emails, WhatsApp messages and service-related communication are managed securely.",
      },
    ],
  },
  {
    id: "02",
    label: "DATA USAGE",
    title: "How We Use Information",
    icon: "info",
    items: [
      {
        title: "Service Delivery",
        description:
          "Information is used to provide and manage the services you request.",
      },
      {
        title: "Payments & Invoices",
        description:
          "Transaction and billing details may be used for accounting and service purposes.",
      },
      {
        title: "Updates & Reminders",
        description:
          "Service status updates, reminders and necessary communications may be sent.",
      },
    ],
  },
  {
    id: "03",
    label: "DATA SECURITY",
    title: "How We Keep Data Safe",
    icon: "lock",
    items: [
      {
        title: "Access Controls",
        description:
          "Access to personal information is limited to authorized use where required.",
      },
      {
        title: "Secure Communication",
        description:
          "HTTPS and reasonable security measures help protect website communications.",
      },
      {
        title: "Restricted Storage",
        description:
          "Documents are stored securely with restricted or encrypted storage where feasible.",
      },
    ],
  },
  {
    id: "04",
    label: "YOUR RIGHTS",
    title: "Your Privacy Rights",
    icon: "check",
    items: [
      {
        title: "Access & Correction",
        description:
          "You may request access to or correction of inaccurate personal information.",
      },
      {
        title: "Deletion & Consent",
        description:
          "You may request deletion where applicable or withdraw consent where permitted.",
      },
      {
        title: "Raise a Grievance",
        description:
          "You may contact MegaClick regarding concerns about processing your information.",
      },
    ],
  },
];

const PrivacyHighlights = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const active = privacyHighlights[activeIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % privacyHighlights.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const Icon = ({ type }) => {
    const common = {
      width: 30,
      height: 30,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#145DB5",
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    };

    if (type === "lock") {
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path d="M12 14v3" />
        </svg>
      );
    }

    if (type === "info") {
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v6" />
          <path d="M12 7h.01" />
        </svg>
      );
    }

    if (type === "check") {
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12 2.3 2.3 4.8-5" />
        </svg>
      );
    }

    return (
      <svg {...common}>
        <path d="M12 3 19 6.5V11c0 4.8-3 8.2-7 10-4-1.8-7-5.2-7-10V6.5L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  };

  return (
    <div className="privacy-highlight-wrapper w-full">
      <div className="privacy-highlight-card">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="highlight-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#E2EEFF]">
              <Icon type={active.icon} />
            </div>

            <span className="highlight-label text-xs font-bold uppercase tracking-[0.18em] text-[#145DB5]">
              {active.label}
            </span>
          </div>

          <span className="highlight-number shrink-0 text-sm font-semibold text-[#91A7C2]">
            {active.id} / 04
          </span>
        </div>

        <h2 className="mt-6 text-[22px] font-bold text-[#111827] sm:text-[25px]">
          {active.title}
        </h2>

        <div className="mt-6 space-y-5">
          {active.items.map((item) => (
            <div
              key={item.title}
              className="highlight-item border-l-[3px] border-[#BBD2EF] pl-4"
            >
              <p className="highlight-item-title text-[14px] font-semibold text-[#172033] sm:text-[15px]">
                {item.title}
              </p>

              <p className="highlight-item-description mt-1 text-[12px] leading-5 text-[#657991] sm:text-[13px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {privacyHighlights.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.title}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-7 bg-[#145DB5]"
                : "w-2.5 bg-[#C9D8E8] hover:bg-[#AFC4DA]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const PrivacyPolicy = () => {
  const [openSection, setOpenSection] = useState("01");

  const toggleSection = (id) => {
    setOpenSection((current) => (current === id ? null : id));
  };

  return (
    <main className="privacy-page w-full overflow-hidden bg-white text-[#172033]">

      {/* =========================================================
          RESPONSIVE CSS
      ========================================================= */}

      <style>{`
        .privacy-page {
          --privacy-blue: #145DB5;
          --privacy-green: #00A86B;
        }

        * {
          box-sizing: border-box;
        }

        /* =====================================================
           HERO - BASE / MOBILE
        ===================================================== */

        .privacy-hero-container {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;
        }

        .privacy-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          gap: 36px;
          min-height: 400px;
          padding-top: 55px;
          padding-bottom: 55px;
        }

        .privacy-hero-left {
  width: 100%;
  max-width: 680px;
}

/* Align main Privacy Policy heading with the card heading */
@media (min-width: 1024px) {
  .privacy-hero-left {
    transform: translateY(-70px);
  }
}

@media (min-width: 1536px) {
  .privacy-hero-left {
    transform: translateY(-32px);
  }
}

@media (min-width: 2560px) {
  .privacy-hero-left {
    transform: translateY(-35px);
  }
}
        .privacy-hero-title {
          font-family: Poppins, sans-serif;
          font-size: clamp(40px, 5vw, 58px);
          line-height: 1.06;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .privacy-hero-description {
          max-width: 650px;
          margin-top: 20px;
          font-family: Inter, sans-serif;
          font-size: clamp(14px, 1.2vw, 17px);
          line-height: 1.8;
          color: #53657A;
        }

        .privacy-hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 26px;
        }

        .privacy-highlight-wrapper {
          width: 100%;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .privacy-highlight-card {
          width: 100%;
          min-height: 0;
          padding: 28px;
          border: 1px solid #D7E6F7;
          border-radius: 28px;
          background: linear-gradient(
            135deg,
            #F4F9FF 0%,
            #F8FBFF 50%,
            #EEF6FF 100%
          );
          box-shadow: 0 16px 45px rgba(20, 93, 181, 0.08);
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (min-width: 768px) {
          .privacy-hero-container {
            padding-left: 40px;
            padding-right: 40px;
          }

          .privacy-hero-grid {
            min-height: 460px;
            padding-top: 70px;
            padding-bottom: 70px;
          }

          .privacy-highlight-wrapper {
            max-width: 600px;
          }
        }

        /* =====================================================
           1024+
        ===================================================== */

        @media (min-width: 1024px) {
          .privacy-hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(440px, 0.85fr);
            gap: 70px;
            min-height: 500px;
          }

          .privacy-hero-left {
            max-width: 700px;
          }

          .privacy-highlight-wrapper {
            max-width: 560px;
            margin-left: auto;
          }

          .privacy-highlight-card {
            padding: 34px;
          }
        }

        /* =====================================================
           1440px
        ===================================================== */

        @media (min-width: 1440px) {
          .privacy-hero-container {
            max-width: 1380px;
            padding-left: 40px;
            padding-right: 40px;
          }

          .privacy-hero-grid {
            min-height: 540px;
            grid-template-columns: minmax(0, 1.05fr) minmax(520px, 0.85fr);
            gap: 80px;
            padding-top: 75px;
            padding-bottom: 75px;
          }

          .privacy-hero-title {
            font-size: 60px;
          }

          .privacy-hero-description {
            max-width: 650px;
            font-size: 17px;
          }

          .privacy-highlight-wrapper {
            max-width: 580px;
          }

          .privacy-highlight-card {
            padding: 38px;
          }
        }

        /* =====================================================
           1920px
        ===================================================== */

        @media (min-width: 1920px) {
          .privacy-hero-container {
            max-width: 1800px;
            padding-left: 60px;
            padding-right: 60px;
          }

          .privacy-hero-grid {
            min-height: 620px;
            grid-template-columns: minmax(0, 1.05fr) minmax(650px, 0.9fr);
            gap: 110px;
            padding-top: 90px;
            padding-bottom: 90px;
          }

          .privacy-hero-left {
            max-width: 820px;
          }

          .privacy-hero-eyebrow {
            font-size: 17px !important;
            letter-spacing: 0.24em !important;
            margin-bottom: 22px !important;
          }

          .privacy-hero-title {
            font-size: 76px;
          }

          .privacy-hero-description {
            max-width: 760px;
            margin-top: 26px;
            font-size: 20px;
            line-height: 1.8;
          }

          .privacy-hero-actions {
            margin-top: 34px;
            gap: 16px;
          }

          .privacy-hero-button {
            padding: 17px 30px !important;
            font-size: 17px !important;
          }

          .privacy-date {
            padding: 17px 25px !important;
            font-size: 16px !important;
          }

          .privacy-highlight-wrapper {
            max-width: 680px;
          }

          .privacy-highlight-card {
            min-height: 480px;
            padding: 45px;
            border-radius: 34px;
          }

          .privacy-highlight-card h2 {
            font-size: 32px;
          }

          .privacy-highlight-card .highlight-label {
            font-size: 16px;
          }

          .privacy-highlight-card .highlight-item-title {
            font-size: 18px;
          }

          .privacy-highlight-card .highlight-item-description {
            font-size: 15px;
            line-height: 1.7;
          }
        }

        /* =====================================================
           2560px
        ===================================================== */

        @media (min-width: 2560px) {
          .privacy-hero-container {
            max-width: 2300px;
            padding-left: 80px;
            padding-right: 80px;
          }

          .privacy-hero-grid {
            min-height: 700px;
            grid-template-columns: minmax(0, 1.05fr) minmax(760px, 0.9fr);
            gap: 130px;
            padding-top: 105px;
            padding-bottom: 105px;
          }

          .privacy-hero-left {
            max-width: 980px;
          }

          .privacy-hero-title {
            font-size: 90px;
          }

          .privacy-hero-description {
            max-width: 900px;
            font-size: 23px;
            line-height: 1.8;
          }

          .privacy-hero-actions {
            margin-top: 38px;
            gap: 20px;
          }

          .privacy-hero-button {
            padding: 20px 36px !important;
            font-size: 20px !important;
          }

          .privacy-date {
            padding: 20px 30px !important;
            font-size: 18px !important;
          }

          .privacy-highlight-wrapper {
            max-width: 800px;
          }

          .privacy-highlight-card {
            min-height: 580px;
            padding: 55px;
            border-radius: 38px;
          }

          .privacy-highlight-card h2 {
            font-size: 38px;
          }

          .privacy-highlight-card .highlight-item-title {
            font-size: 21px;
          }

          .privacy-highlight-card .highlight-item-description {
            font-size: 18px;
            line-height: 1.7;
          }
        }

        /* =====================================================
           4K - 3840px
           IMPORTANT: balanced hero, not oversized
        ===================================================== */

        @media (min-width: 3840px) {
          .privacy-hero-container {
            max-width: 3500px;
            padding-left: 120px;
            padding-right: 120px;
          }

          .privacy-hero-grid {
            min-height: 780px;
            grid-template-columns: minmax(0, 1fr) minmax(900px, 0.82fr);
            gap: 170px;
            padding-top: 110px;
            padding-bottom: 110px;
          }

          .privacy-hero-left {
            max-width: 1200px;
          }

          .privacy-hero-eyebrow {
            font-size: 24px !important;
            letter-spacing: 0.28em !important;
            margin-bottom: 28px !important;
          }

          .privacy-hero-title {
            font-size: 112px;
            line-height: 1.04;
          }

          .privacy-hero-description {
            max-width: 1100px;
            margin-top: 34px;
            font-size: 29px;
            line-height: 1.75;
          }

          .privacy-hero-actions {
            margin-top: 42px;
            gap: 22px;
          }

          .privacy-hero-button {
            padding: 23px 44px !important;
            font-size: 23px !important;
          }

          .privacy-date {
            padding: 23px 34px !important;
            font-size: 21px !important;
          }

          .privacy-highlight-wrapper {
            max-width: 900px;
          }

          .privacy-highlight-card {
            min-height: 620px;
            padding: 65px;
            border-radius: 42px;
          }

          .privacy-highlight-card .highlight-icon {
            width: 72px;
            height: 72px;
          }

          .privacy-highlight-card .highlight-label {
            font-size: 20px;
          }

          .privacy-highlight-card .highlight-number {
            font-size: 20px;
          }

          .privacy-highlight-card h2 {
            margin-top: 32px;
            font-size: 45px;
          }

          .privacy-highlight-card .highlight-item {
            padding-left: 25px;
            border-left-width: 4px;
          }

          .privacy-highlight-card .highlight-item-title {
            font-size: 23px;
          }

          .privacy-highlight-card .highlight-item-description {
            font-size: 19px;
            line-height: 1.75;
          }
        }

        /* =====================================================
           ACCORDION
        ===================================================== */

        .privacy-accordion-section {
          width: 100%;
          background: #F3F8FD;
          padding: 60px 20px;
        }

        .privacy-accordion-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }

        .privacy-accordion-card {
          overflow: hidden;
          border: 1px solid #DCE5EE;
          border-radius: 22px;
          background: white;
          box-shadow: 0 10px 40px rgba(22, 55, 90, 0.07);
        }

        .privacy-contact-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        @media (min-width: 1440px) {
          .privacy-accordion-section {
            padding: 90px 40px;
          }

          .privacy-accordion-container {
            max-width: 1250px;
          }

          .privacy-accordion-title {
            font-size: 32px !important;
          }
        }

        @media (min-width: 1920px) {
          .privacy-accordion-section {
            padding: 110px 60px;
          }

          .privacy-accordion-container {
            max-width: 1650px;
          }

          .privacy-accordion-title {
            font-size: 42px !important;
          }

          .privacy-accordion-subtitle {
            font-size: 18px !important;
          }

          .privacy-accordion-card {
            border-radius: 30px;
          }

          .privacy-section-title {
            font-size: 22px !important;
          }

          .privacy-paragraph,
          .privacy-bullet {
            font-size: 18px !important;
            line-height: 1.9 !important;
          }
        }

        @media (min-width: 2560px) {
          .privacy-accordion-section {
            padding: 130px 80px;
          }

          .privacy-accordion-container {
            max-width: 2050px;
          }

          .privacy-accordion-title {
            font-size: 48px !important;
          }

          .privacy-accordion-card button {
            padding-top: 38px !important;
            padding-bottom: 38px !important;
          }

          .privacy-section-title {
            font-size: 25px !important;
          }

          .privacy-paragraph,
          .privacy-bullet {
            font-size: 20px !important;
            line-height: 1.95 !important;
          }
        }

        @media (min-width: 3840px) {
          .privacy-accordion-section {
            padding: 150px 120px;
          }

          .privacy-accordion-container {
            max-width: 2900px;
          }

          .privacy-accordion-title {
            font-size: 58px !important;
          }

          .privacy-accordion-subtitle {
            font-size: 24px !important;
          }

          .privacy-accordion-card {
            border-radius: 38px;
            border-width: 2px;
          }

          .privacy-accordion-card button {
            min-height: 110px;
            padding: 38px 55px !important;
          }

          .privacy-number {
            font-size: 19px !important;
          }

          .privacy-section-title {
            font-size: 29px !important;
          }

          .privacy-arrow {
            width: 48px !important;
            height: 48px !important;
          }

          .privacy-arrow svg {
            width: 24px;
            height: 24px;
          }

          .privacy-body {
            padding-left: 135px !important;
            padding-right: 90px !important;
            padding-bottom: 55px !important;
          }

          .privacy-paragraph,
          .privacy-bullet {
            font-size: 22px !important;
            line-height: 2 !important;
          }

          .privacy-contact-grid {
            gap: 22px;
          }

          .privacy-contact-box {
            padding: 30px !important;
            border-radius: 18px;
          }

          .privacy-contact-box-title {
            font-size: 17px !important;
          }

          .privacy-contact-box-value {
            font-size: 20px !important;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767px) {
          .privacy-hero-container {
            padding-left: 20px;
            padding-right: 20px;
          }

          .privacy-hero-grid {
            grid-template-columns: 1fr;
            min-height: auto;
            gap: 42px;
            padding-top: 45px;
            padding-bottom: 55px;
          }

          .privacy-hero-title {
            font-size: 42px;
          }

          .privacy-hero-description {
            font-size: 14px;
            line-height: 1.75;
          }

          .privacy-hero-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .privacy-hero-button,
          .privacy-date {
            width: fit-content;
          }

          .privacy-highlight-wrapper {
            max-width: 100%;
          }

          .privacy-highlight-card {
            padding: 24px;
            border-radius: 22px;
          }

          .privacy-contact-grid {
            grid-template-columns: 1fr;
          }

          .privacy-accordion-section {
            padding: 50px 16px;
          }

          .privacy-accordion-card button {
            padding: 20px 18px;
          }

          .privacy-body {
            padding-left: 52px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>

      {/* =========================================================
          HERO SECTION
      ========================================================= */}

      <section className="w-full bg-white">
        <div className="privacy-hero-container">

          <div className="privacy-hero-grid">

            {/* LEFT CONTENT */}

            <div className="privacy-hero-left">

              <div className="privacy-hero-eyebrow mb-5 flex items-center gap-3">
                

                <span
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-[#145DB5] sm:text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  MegaClick Enterprises
                </span>
              </div>

              <h1
                className="privacy-hero-title text-[#111827]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Privacy{" "}
                <span className="text-[#145DB5]">
                  Policy
                </span>
              </h1>

              <p
                className="privacy-hero-description"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Your privacy matters to us. This policy explains how
                MegaClick collects, uses, stores, shares, and protects
                your information when you use our website and services.
              </p>

              <div className="privacy-hero-actions">

                <a
                  href="/contact"
                  className="
                    privacy-hero-button
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-[#00A86B]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#00945E]
                  "
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Contact Us
                  <span className="text-lg">
                    →
                  </span>
                </a>

                <div
                  className="
                    privacy-date
                    rounded-full
                    border
                    border-[#DCE5EE]
                    bg-white
                    px-5
                    py-3
                    text-sm
                    text-[#66778A]
                  "
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Effective Date: October 1, 2026
                </div>

              </div>
            </div>

            {/* RIGHT HIGHLIGHT CARD */}

            <div className="flex w-full items-center justify-center lg:justify-end">
              <PrivacyHighlights />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          PRIVACY POLICY ACCORDION
      ========================================================= */}

      <section className="privacy-accordion-section">

        <div className="privacy-accordion-container">

          {/* HEADER */}

          <div className="privacy-accordion-header mb-2 text-center">

            <h2
              className="
                privacy-accordion-title
                text-2xl
                font-bold
                text-[#111827]
                sm:text-3xl
              "
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Privacy Policy
            </h2>

            <p
              className="
                privacy-accordion-subtitle
                mt-2
                text-sm
                text-[#66778A]
              "
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Last updated: October 1, 2026
            </p>

          </div>

          {/* ACCORDION */}

          <div className="privacy-accordion-card mt-8">

            {sections.map((section, index) => {

              const isOpen =
                openSection === section.id;

              return (
                <div
                  key={section.id}
                  className={
                    index !== sections.length - 1
                      ? "border-b border-[#E4EAF0]"
                      : ""
                  }
                >

                  {/* HEADER */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(section.id)
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-5
                      px-6
                      py-5
                      text-left
                      transition-colors
                      duration-200
                      hover:bg-[#F8FBFE]
                      sm:px-7
                    "
                  >

                    <div className="flex min-w-0 items-center gap-4">

                      <span
                        className={`
                          privacy-number
                          shrink-0
                          text-xs
                          font-bold
                          ${
                            isOpen
                              ? "text-[#00A86B]"
                              : "text-[#A2AFBC]"
                          }
                        `}
                        style={{
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {section.id}
                      </span>

                      <span
                        className={`
                          privacy-section-title
                          text-base
                          font-semibold
                          sm:text-[17px]
                          ${
                            isOpen
                              ? "text-[#145DB5]"
                              : "text-[#172033]"
                          }
                        `}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {section.title}
                      </span>

                    </div>

                    <span
                      className={`
                        privacy-arrow
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          isOpen
                            ? "rotate-180 bg-[#EAF8F3] text-[#00A86B]"
                            : "bg-[#F3F6F9] text-[#66778A]"
                        }
                      `}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>

                  </button>

                  {/* CONTENT */}

                  <div
                    className={`
                      grid
                      transition-[grid-template-rows]
                      duration-300
                      ${
                        isOpen
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]"
                      }
                    `}
                  >

                    <div className="overflow-hidden">

                      <div
                        className="
                          privacy-body
                          px-6
                          pb-6
                          pl-[52px]
                          pr-6
                          sm:px-7
                          sm:pb-7
                          sm:pl-[72px]
                        "
                      >

                        {/* PARAGRAPHS */}

                        {section.content?.map(
                          (paragraph, paragraphIndex) => (
                            <p
                              key={paragraphIndex}
                              className="
                                privacy-paragraph
                                mb-4
                                text-[14px]
                                leading-7
                                text-[#53657A]
                                last:mb-0
                                sm:text-[15px]
                                sm:leading-7
                              "
                              style={{
                                fontFamily:
                                  "Inter, sans-serif",
                              }}
                            >
                              {paragraph}
                            </p>
                          )
                        )}

                        {/* BULLETS */}

                        {section.bullets && (
                          <ul className="privacy-bullet-list mt-5 space-y-3">

                            {section.bullets.map(
                              (bullet, bulletIndex) => (
                                <li
                                  key={bulletIndex}
                                  className="
                                    privacy-bullet
                                    flex
                                    items-start
                                    gap-3
                                    text-[14px]
                                    leading-7
                                    text-[#53657A]
                                    sm:text-[15px]
                                  "
                                  style={{
                                    fontFamily:
                                      "Inter, sans-serif",
                                  }}
                                >
                                  <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#00A86B]" />

                                  <span>
                                    {bullet}
                                  </span>
                                </li>
                              )
                            )}

                          </ul>
                        )}

                        {/* ADDITIONAL */}

                        {section.additional && (
                          <p
                            className="
                              privacy-paragraph
                              mt-5
                              text-[14px]
                              leading-7
                              text-[#53657A]
                              sm:text-[15px]
                            "
                            style={{
                              fontFamily:
                                "Inter, sans-serif",
                            }}
                          >
                            {section.additional}
                          </p>
                        )}

                        {/* HIGHLIGHT */}

                        {section.highlight && (
                          <div
                            className="
                              privacy-highlight
                              mt-5
                              rounded-xl
                              border-l-4
                              border-[#00A86B]
                              bg-[#F1FAF6]
                              px-5
                              py-4
                            "
                          >
                            <p
                              className="
                                text-[13px]
                                leading-6
                                text-[#315B4B]
                                sm:text-sm
                              "
                              style={{
                                fontFamily:
                                  "Inter, sans-serif",
                              }}
                            >
                              {section.highlight}
                            </p>
                          </div>
                        )}

                        {/* CONTACT DETAILS */}

                        {section.id === "16" && (
                          <div className="privacy-contact-grid mt-6">

                            <ContactBox
                              title="Grievance Officer"
                              value="[NAME]"
                            />

                            <ContactBox
                              title="Designation"
                              value="[DESIGNATION]"
                            />

                            <ContactBox
                              title="Working Hours"
                              value="[WORKING HOURS]"
                            />

                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        </div>
      </section>

    </main>
  );
};

/* ===============================================================
   CONTACT BOX
=============================================================== */

const ContactBox = ({ title, value }) => {
  return (
    <div
      className="
        privacy-contact-box
        rounded-xl
        border
        border-[#DCE6EF]
        bg-[#F8FBFE]
        p-5
      "
    >
      <p
        className="
          privacy-contact-box-title
          text-xs
          font-bold
          uppercase
          tracking-[0.12em]
          text-[#145DB5]
        "
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {title}
      </p>

      <p
        className="
          privacy-contact-box-value
          mt-2
          text-sm
          font-medium
          text-[#172033]
        "
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {value}
      </p>
    </div>
  );
};

export default PrivacyPolicy;