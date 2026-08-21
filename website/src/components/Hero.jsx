import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  CreditCard,
  Award,
  ReceiptText,
} from "lucide-react";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero4 from "../assets/hero4.png";
import hero3 from "../assets/hero3.webp";

const services = [
  {
    id: 1,
    title: "MSME / UDYAM Registration",
    desc: "Apply for MSME and Udyam certificate online with fast document verification, expert support, and complete registration guidance.",
    image: hero4,
    imgClass: "max-h-[75%] max-w-[72%]",
    fallbackIcon: <FileCheck className="w-8 h-8 text-[#0B4EA2]" />,
    gradient: "from-sky-100/70 via-blue-50/40 to-white",
    borderColor: "border-sky-100",
  },
  {
    id: 2,
    title: "Voter ID, PAN & TAN Services",
    desc: "Quick assistance for new PAN, TAN, and Voter ID cards, corrections, biometric updates, and timely government processing.",
    image: hero2,
    imgClass: "max-h-full max-w-[85%]",
    fallbackIcon: <CreditCard className="w-8 h-8 text-amber-500" />,
    gradient: "from-amber-100/60 via-orange-50/30 to-white",
    borderColor: "border-amber-100",
  },
  {
    id: 3,
    title: "Trademark Registration",
    desc: "Secure your brand name, logo, and identity with end-to-end online trademark search, filing, and legal brand protection.",
    image: hero1,
    imgClass: "max-h-full max-w-[95%] scale-110",
    fallbackIcon: <Award className="w-8 h-8 text-emerald-600" />,
    gradient: "from-emerald-100/60 via-green-50/30 to-white",
    borderColor: "border-emerald-100",
  },
  {
    id: 4,
    title: "GST Registration & Filing Services",
    desc: "Online GST registration, monthly return filings, input tax credit reconciliation, and comprehensive business tax compliance.",
    image: hero3,
    imgClass: "max-h-full max-w-[85%]",
    fallbackIcon: <ReceiptText className="w-8 h-8 text-purple-600" />,
    gradient: "from-purple-100/60 via-indigo-50/30 to-white",
    borderColor: "border-purple-100",
  },
];

const Hero = () => {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  useEffect(() => {
    const fontId = "google-fonts-hedvig-inter";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const scrollToHowItWorks = () => {
    const target =
      document.getElementById("how-it-works") ||
      document.getElementById("services") ||
      document.getElementById("contact");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else if (navigate) {
      navigate("/services");
      window.scrollTo(0, 0);
    }
  };

  // Contact Us Button Handler - Now strictly redirects to the /contact page
  const handleContactRedirect = () => {
    if (navigate) {
      navigate("/contact");
      window.scrollTo(0, 0); // Ensures the new page starts at the very top
    } else {
      window.location.href = "/contact";
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white font-['Inter',sans-serif]"
    >
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-5
          sm:px-8
          lg:px-16
          xl:px-24
          py-6
          sm:py-10
          lg:py-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            sm:gap-10
            lg:gap-12
            xl:gap-16
            items-center
          "
        >
          {/* =====================================================
              LEFT CONTENT (PERFECT STARTING ALIGNMENT)
          ====================================================== */}
          <div
            className="
              space-y-4
              sm:space-y-6
              md:space-y-7
              w-full
              flex
              flex-col
              items-start
              text-left
            "
          >
            {/* TRUSTED BUSINESS SOLUTIONS BADGE */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                text-[#0B4EA2]
                text-xs
                sm:text-sm
                font-semibold
                tracking-wide
                text-left
              "
            >
              <CheckCircle2 size={18} className="text-[#0B4EA2] flex-shrink-0" />
              <span>Trusted Business Solutions</span>
            </div>

            {/* HEADING (Hedvig Letters Serif) */}
            <h1
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="
                text-3xl
                sm:text-3xl
                md:text-4xl
                lg:text-4xl
                xl:text-5xl
                font-bold
                leading-[1.18]
                text-black
                text-left
              "
            >
              Grow Your Business
              <br />
              <span className="text-[#0B4EA2]">
                With Smart Solutions
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                text-sm
                sm:text-base
                md:text-lg
                text-slate-700
                leading-relaxed
                sm:leading-7
                max-w-xl
                text-justify
                sm:text-left
                [text-align-last:left]
                [text-wrap:pretty]
              "
            >
              Complete business solutions to simplify your registrations, tax
              compliance, and financial growth with trusted expert guidance.
            </p>

            {/* STATS */}
            <div
              className="
                flex
                gap-5
                sm:gap-8
                md:gap-10
                flex-wrap
                justify-start
                w-full
              "
            >
              <div className="text-left">
                <h3
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  15000+
                </h3>
                <p className="text-black text-xs sm:text-sm whitespace-nowrap">
                  Happy Clients
                </p>
              </div>

              <div className="text-left">
                <h3
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  25+
                </h3>
                <p className="text-black text-xs sm:text-sm whitespace-nowrap">
                  Services
                </p>
              </div>

              <div className="text-left">
                <h3
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  10+
                </h3>
                <p className="text-black text-xs sm:text-sm whitespace-nowrap">
                  Years Experience
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div
              className="
                flex
                flex-row
                gap-3
                sm:gap-4
                pt-2
                w-full
                sm:w-auto
                justify-start
                items-center
              "
            >
              <button
                onClick={scrollToHowItWorks}
                className="
                  group
                  flex-1
                  sm:flex-initial
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-green-600
                  hover:bg-green-700
                  active:bg-green-800
                  text-white
                  px-5
                  sm:px-8
                  py-3
                  sm:py-3.5
                  rounded-full
                  font-medium
                  text-sm
                  sm:text-base
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-200
                  transform
                  hover:-translate-y-0.5
                  active:translate-y-0
                  cursor-pointer
                  text-center
                  whitespace-nowrap
                "
              >
                <span>Get Started</span>
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={handleContactRedirect}
                className="
                  flex-1
                  sm:flex-initial
                  inline-flex
                  items-center
                  justify-center
                  bg-[#0B4EA2]
                  hover:bg-blue-700
                  active:bg-blue-800
                  text-white
                  px-5
                  sm:px-8
                  py-3
                  sm:py-3.5
                  rounded-full
                  font-medium
                  text-sm
                  sm:text-base
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-200
                  transform
                  hover:-translate-y-0.5
                  active:translate-y-0
                  cursor-pointer
                  text-center
                  whitespace-nowrap
                "
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* =====================================================
              RIGHT 4 CARDS GRID
          ====================================================== */}
          <div className="w-full flex justify-center items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 w-full max-w-[620px]">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`
                    group
                    relative
                    bg-gradient-to-b ${service.gradient}
                    border ${service.borderColor}
                    rounded-2xl
                    sm:rounded-3xl
                    p-4.5
                    sm:p-5
                    md:p-5.5
                    flex
                    flex-col
                    justify-between
                    shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]
                    hover:shadow-[0_10px_28px_-4px_rgba(11,78,162,0.14)]
                    hover:-translate-y-1.5
                    transition-all
                    duration-300
                    overflow-hidden
                    min-h-[210px]
                    sm:min-h-[225px]
                  `}
                >
                  {/* Card Image Container */}
                  <div className="h-14 sm:h-16 w-full flex items-center justify-center mb-3">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className={`${service.imgClass || "max-h-full max-w-[85%]"} object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300`}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.parentElement?.querySelector(".fallback-box");
                          if (fallback) fallback.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div className="fallback-box hidden items-center justify-center p-2.5 rounded-2xl bg-white/90 shadow-sm border border-slate-100">
                      {service.fallbackIcon}
                    </div>
                  </div>

                  {/* Card Text Content */}
                  <div className="flex flex-col flex-grow text-left">
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="
                        text-[15px]
                        sm:text-[16.5px]
                        font-bold
                        text-slate-900
                        mb-1.5
                        leading-snug
                        text-left
                      "
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="
                        text-[11.5px]
                        sm:text-[12px]
                        text-slate-600
                        leading-[1.55]
                        line-clamp-3
                        text-left
                        [text-wrap:pretty]
                      "
                    >
                      {service.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BACKGROUND BLUR ACCENTS
      ====================================================== */}
      <div
        className="
          absolute
          -top-32
          -left-32
          w-72
          h-72
          rounded-full
          bg-blue-100/50
          blur-3xl
          -z-10
        "
      />
      <div
        className="
          absolute
          -bottom-40
          -right-40
          w-96
          h-96
          rounded-full
          bg-green-100/40
          blur-3xl
          -z-10
        "
      />
    </section>
  );
};

export default Hero;