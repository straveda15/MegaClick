import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const ContactInfo = () => {
  const officeCardRef = useRef(null);
  const cardsViewportRef = useRef(null);
  const cardsTrackRef = useRef(null);
  const [cardsCarouselStyle, setCardsCarouselStyle] = useState({});

  // Align only the right-side auto-scroll viewport to the
  // natural height of the existing "Visit Our Office" card.
  useEffect(() => {
  const updateRightCarousel = () => {
    const office = officeCardRef.current;
    const track = cardsTrackRef.current;

    if (!office || !track) return;

    if (window.innerWidth < 1024) {
      setCardsCarouselStyle({});
      return;
    }

    const officeHeight = office.getBoundingClientRect().height;

    const firstCard = track.children[0];
    const secondCard = track.children[1];

    if (!firstCard || !secondCard) return;

    const firstTop = firstCard.getBoundingClientRect().top;
    const secondTop = secondCard.getBoundingClientRect().top;

    const step = secondTop - firstTop;

    setCardsCarouselStyle({
      height: `${officeHeight}px`,
      "--contact-step": `${step}px`,
    });
  };

  updateRightCarousel();

  const resizeObserver = new ResizeObserver(updateRightCarousel);

  if (officeCardRef.current) {
    resizeObserver.observe(officeCardRef.current);
  }

  if (cardsTrackRef.current) {
    resizeObserver.observe(cardsTrackRef.current);
  }

  window.addEventListener("resize", updateRightCarousel);

  return () => {
    resizeObserver.disconnect();
    window.removeEventListener("resize", updateRightCarousel);
  };
}, []);

  // -------------------------------------------------
  // CONTACT DETAILS
  // -------------------------------------------------
  const phoneNumber = "+919921611911";
  const emailAddress = "megaclickofficial@gmail.com";

  // -------------------------------------------------
  // EMAIL HANDLER
  // -------------------------------------------------
  const handleEmailClick = (e) => {
    e.preventDefault();

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;

    if (isMobile) {
      // Direct Gmail compose link on mobile opens Gmail app/web directly without Outlook interception
      window.open(gmailUrl, "_blank");
    } else {
      window.open(gmailUrl, "_blank");
    }
  };

  // -------------------------------------------------
  // EXACT GOOGLE MAPS LOCATION
  // -------------------------------------------------
  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=MegaClick%20Properties";

  return (
    <section className="relative w-full py-8 sm:py-12 lg:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white overflow-hidden font-['Inter',sans-serif]">
      {/* DIRECT CSS RULES FOR 1440px, 1920px & 3840px RESPONSIVENESS */}
      <style>{`
        /* Reference-style contact cards + continuous vertical scroll */
        .contact-cards-viewport {
          overflow: hidden;
        }

        .contact-cards-track {
          display: flex;
          flex-direction: column;
          will-change: transform;
          animation: contactCardsVerticalScroll 12s linear infinite;
        }

        .contact-cards-track:hover {
          animation-play-state: paused;
        }

        @keyframes contactCardsVerticalScroll {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(calc(-3 * var(--contact-step)));
          }
        }

        @media (max-width: 1023px) {
          .contact-cards-track {
            animation: none;
          }

          .contact-cards-viewport {
            height: auto !important;
            overflow: visible;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-cards-track {
            animation: none;
          }
        }

        /* Standard Desktop (1440px) */
        @media (min-width: 1440px) {
          .contact-info-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }
          .contact-info-tagline {
            font-size: 0.85rem !important;
            margin-bottom: 0.75rem !important;
          }
          .contact-info-title {
            font-size: 2.4rem !important;
            line-height: 1.18 !important;
          }
          .contact-info-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
          }
          .card-title {
            font-size: 1.25rem !important;
          }
          .card-desc {
            font-size: 0.875rem !important;
            line-height: 1.6 !important;
          }
        }

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .contact-info-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }
          .contact-info-tagline {
            font-size: 1rem !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 1rem !important;
          }
          .contact-info-title {
            font-size: 3rem !important;
            line-height: 1.18 !important;
          }
          .contact-info-desc {
            font-size: 1.15rem !important;
            line-height: 1.8 !important;
          }
          .card-title {
            font-size: 1.55rem !important;
          }
          .card-desc {
            font-size: 1rem !important;
            line-height: 1.7 !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .contact-info-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .contact-info-tagline {
            font-size: 1.75rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.75rem !important;
          }
          .contact-info-title {
            font-size: 5rem !important;
            line-height: 1.15 !important;
          }
          .contact-info-desc {
            font-size: 2rem !important;
            line-height: 3.25rem !important;
            margin-top: 1.5rem !important;
          }
          .card-title {
            font-size: 2.5rem !important;
          }
          .card-desc {
            font-size: 1.65rem !important;
            line-height: 2.6rem !important;
          }
        }
          .contact-cards-duplicate {
  display: flex;
}

@media (max-width: 1023px) {
  .contact-cards-track {
    animation: none;
  }

  .contact-cards-viewport {
    height: auto !important;
    overflow: visible;
  }

  .contact-cards-duplicate {
    display: none;
  }
}
      `}</style>

      {/* ── GLOBAL CONTAINER ── */}
      <div className="contact-info-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">

        {/* ── SECTION HEADER ── */}
        <div className="mb-8 sm:mb-10 lg:mb-12 w-full text-left">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="contact-info-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2.5 sm:mb-3 text-left"
          >
            CONTACT INFORMATION
          </p>

          {/* ONE-LINE HEADING – Hedvig Letters Serif */}
          <h2
            style={{ fontFamily: "'Poppins', serif" }}
            className="contact-info-title text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold leading-[1.18] text-black text-left mb-2.5 sm:mb-4"
          >
            Get In <span className="text-[#0B4EA2]">Touch With Us</span>
          </h2>

          {/* SPREAD 100% FULL WIDTH PARAGRAPH */}
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="contact-info-desc mt-3 sm:mt-4 text-slate-600 font-normal text-xs sm:text-sm lg:text-base leading-relaxed text-left w-full"
          >
            Have questions or need assistance? Reach out to our experts. We’re always ready to help you with legal, business, and financial solutions.
          </p>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 min-[1920px]:gap-10 min-[3840px]:gap-16 items-start">

          {/* ── MAP CARD ── */}
          <div
            ref={officeCardRef}
            className="lg:col-span-2 relative overflow-hidden rounded-2xl sm:rounded-[28px] min-[3840px]:rounded-[44px] border border-gray-200 min-[3840px]:border-2 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
          >

            {/* Header */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6 min-[1440px]:p-8 min-[1920px]:p-10 min-[3840px]:p-16">
              <div className="flex items-center gap-3 sm:gap-5 min-[3840px]:gap-8 min-w-0">

                <div className="w-12 h-12 sm:w-14 sm:h-14 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-24 min-[3840px]:h-24 flex-shrink-0 rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl bg-blue-100 flex items-center justify-center">
                  <MapPin
                    className="w-6 h-6 sm:w-7 sm:h-7 min-[1920px]:w-8 min-[1920px]:h-8 min-[3840px]:w-12 min-[3840px]:h-12 text-[#0B4EA2]"
                  />
                </div>

                <div className="min-w-0 text-left">
                  <h3
                    style={{ fontFamily: "'Poppins', serif" }}
                    className="card-title text-lg sm:text-xl min-[1440px]:text-2xl min-[1920px]:text-3xl min-[3840px]:text-5xl font-bold text-gray-900"
                  >
                    Visit Our Office
                  </h3>

                  <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="card-desc text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl text-gray-500 mt-1"
                  >
                    We’d love to meet you in person.
                  </p>
                </div>
              </div>

              <ArrowUpRight
                className="w-6 h-6 min-[1920px]:w-7 min-[1920px]:h-7 min-[3840px]:w-10 min-[3840px]:h-10 text-gray-300 flex-shrink-0"
              />
            </div>

            {/* Map iframe */}
            <div className="px-4 sm:px-6 min-[1440px]:px-8 min-[1920px]:px-10 min-[3840px]:px-16">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl border border-gray-200 min-[3840px]:border-2">
                <iframe
                  title="MegaClick Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.917570480964!2d73.75160959678958!3d20.01197400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb28d1dd624d%3A0xe806e01c2d79c79f!2sMegaClick%20Properties!5e0!3m2!1sen!2sin!4v1788432312836!5m2!1sen!2sin"
                  width="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-[220px] sm:h-[280px] min-[1440px]:h-[320px] min-[1920px]:h-[380px] min-[3840px]:h-[560px] border-0"
                />
              </div>
            </div>

            {/* Address & Actions */}
            <div className="p-5 sm:p-6 min-[1440px]:p-8 min-[1920px]:p-10 min-[3840px]:p-16 text-left">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-end">

                {/* ADDRESS */}
                <div>
                  <h4
                    style={{ fontFamily: "'Poppins', serif" }}
                    className="text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-4xl font-bold text-gray-900"
                  >
                    MegaClick Office
                  </h4>

                  <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="mt-2.5 sm:mt-3 min-[3840px]:mt-6 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl leading-relaxed text-gray-600"
                  >
                    4th Floor, Tristar Complex,
                    <br />
                    Above Canara Bank, Beside Reliance Digital,
                    <br />
                    Jehan Circle, Gangapur Road,
                    <br />
                    Nashik – 422005
                  </p>
                </div>

                {/* OFFICE HOURS – RIGHT SIDE */}
                <div className="flex sm:justify-end sm:items-center">
                  <div className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl bg-green-50 border border-green-200 px-3.5 sm:px-4 min-[3840px]:px-6 py-2 min-[3840px]:py-3">
                    <Clock className="w-4 h-4 min-[3840px]:w-6 min-[3840px]:h-6 text-green-700 shrink-0" />

                    <span
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold text-green-800 whitespace-nowrap"
                    >
                      Mon – Sat • 9:00 AM – 7:00 PM
                    </span>
                  </div>
                </div>

              </div>

              {/* Open in Maps Button */}
              <div className="mt-4 sm:mt-5 min-[3840px]:mt-8">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B4EA2] px-5 sm:px-6 min-[3840px]:px-10 py-2.5 sm:py-3 min-[3840px]:py-5 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold text-white hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span>Open in Maps</span>
                  <ArrowUpRight className="w-4 h-4 min-[3840px]:w-6 min-[3840px]:h-6" />
                </a>
              </div>

            </div>
          </div>

          {/* ── RIGHT-SIDE CARDS ── */}
          <div
            ref={cardsViewportRef}
            style={cardsCarouselStyle}
            className="contact-cards-viewport w-full"
          >
            <div
              ref={cardsTrackRef}
              className="
                contact-cards-track
                gap-5 sm:gap-6 min-[1920px]:gap-8 min-[3840px]:gap-12
                w-full
              "
            >

              {/* ----- WhatsApp ----- */}
              <div
                className="
                  group
                  relative
                  w-full
                  min-h-[170px]
                  sm:min-h-[180px]
                  min-[1920px]:min-h-[200px]
                  min-[3840px]:min-h-[290px]
                  overflow-hidden
                  rounded-[28px]
                  min-[3840px]:rounded-[44px]
                  border border-gray-200
                  bg-white
                  p-4 sm:p-5
                  min-[1920px]:p-6
                  min-[3840px]:p-8
                  shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                  transition-all duration-500
                  hover:-translate-y-1
                  hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]
                  text-left
                  flex flex-col
                  justify-between
                  shrink-0
                "
              >
                <span
                  className="
                    inline-flex w-fit
                    rounded-full
                    bg-green-50
                    px-3 py-1
                    text-[11px] sm:text-xs
                    min-[1920px]:text-sm
                    min-[3840px]:text-xl
                    font-medium
                    text-green-600
                  "
                >
                  WhatsApp
                </span>

                <div className="mt-4 sm:mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0 pr-3">
                    <h3
                      style={{ fontFamily: "'Poppins', serif" }}
                      className="
                        text-xl sm:text-2xl
                        min-[1920px]:text-3xl
                        min-[3840px]:text-5xl
                        font-bold
                        leading-tight
                        text-gray-900
                      "
                    >
                      WhatsApp Us
                    </h3>

                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="
                        mt-2
                        text-sm sm:text-base
                        min-[1920px]:text-lg
                        min-[3840px]:text-2xl
                        text-gray-500
                      "
                    >
                      +91 99216 11911
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-12 w-12
                      sm:h-14 sm:w-14
                      min-[1920px]:h-16 min-[1920px]:w-16
                      min-[3840px]:h-24 min-[3840px]:w-24
                      shrink-0
                      items-center justify-center
                      rounded-full
                      bg-green-50
                    "
                  >
                    <FaWhatsapp
                      className="
                        h-6 w-6
                        sm:h-7 sm:w-7
                        min-[1920px]:h-8 min-[1920px]:w-8
                        min-[3840px]:h-12 min-[3840px]:w-12
                        text-[#25D366]
                      "
                    />
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4 sm:pt-5">
                  <a
                    href="https://wa.me/919921611911"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="
                      flex items-center justify-between
                      text-sm sm:text-base
                      min-[1920px]:text-lg
                      min-[3840px]:text-2xl
                      font-semibold
                      text-green-600
                      transition-colors
                      group-hover:text-green-700
                    "
                  >
                    <span>WhatsApp Now</span>
                    <ArrowUpRight
                      className="
                        h-5 w-5
                        sm:h-6 sm:w-6
                        min-[1920px]:h-7 min-[1920px]:w-7
                        min-[3840px]:h-10 min-[3840px]:w-10
                        transition-transform duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    />
                  </a>
                </div>
              </div>

              {/* ----- Call ----- */}
              <div
                className="
                  group
                  relative
                  w-full
                  min-h-[210px]
                  sm:min-h-[225px]
                  min-[1920px]:min-h-[250px]
                  min-[3840px]:min-h-[360px]
                  overflow-hidden
                  rounded-[28px]
                  min-[3840px]:rounded-[44px]
                  border border-gray-200
                  bg-white
                  p-5 sm:p-6
                  min-[1920px]:p-7
                  min-[3840px]:p-10
                  shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                  transition-all duration-500
                  hover:-translate-y-1
                  hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]
                  text-left
                  flex flex-col
                  justify-between
                  shrink-0
                "
              >
                <span
                  className="
                    inline-flex w-fit
                    rounded-full
                    bg-green-50
                    px-3 py-1
                    text-[11px] sm:text-xs
                    min-[1920px]:text-sm
                    min-[3840px]:text-xl
                    font-medium
                    text-green-600
                  "
                >
                  Phone
                </span>

                <div className="mt-4 sm:mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0 pr-3">
                    <h3
                      style={{ fontFamily: "'Poppins', serif" }}
                      className="
                        text-xl sm:text-2xl
                        min-[1920px]:text-3xl
                        min-[3840px]:text-5xl
                        font-bold
                        leading-tight
                        text-gray-900
                      "
                    >
                      Call Us
                    </h3>

                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="
                        mt-2
                        text-sm sm:text-base
                        min-[1920px]:text-lg
                        min-[3840px]:text-2xl
                        text-gray-500
                      "
                    >
                      +91 99216 11911
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-12 w-12
                      sm:h-14 sm:w-14
                      min-[1920px]:h-16 min-[1920px]:w-16
                      min-[3840px]:h-24 min-[3840px]:w-24
                      shrink-0
                      items-center justify-center
                      rounded-full
                      bg-green-50
                    "
                  >
                    <Phone
                      className="
                        h-6 w-6
                        sm:h-7 sm:w-7
                        min-[1920px]:h-8 min-[1920px]:w-8
                        min-[3840px]:h-12 min-[3840px]:w-12
                        text-green-600
                      "
                    />
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4 sm:pt-5">
                  <a
                    href={`tel:${phoneNumber}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="
                      flex items-center justify-between
                      text-sm sm:text-base
                      min-[1920px]:text-lg
                      min-[3840px]:text-2xl
                      font-semibold
                      text-green-600
                      transition-colors
                      group-hover:text-green-700
                    "
                  >
                    <span>Call Now</span>
                    <ArrowUpRight
                      className="
                        h-5 w-5
                        sm:h-6 sm:w-6
                        min-[1920px]:h-7 min-[1920px]:w-7
                        min-[3840px]:h-10 min-[3840px]:w-10
                        transition-transform duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    />
                  </a>
                </div>
              </div>

              {/* ----- Email ----- */}
              <div
                className="
                  group
                  relative
                  w-full
                  min-h-[210px]
                  sm:min-h-[225px]
                  min-[1920px]:min-h-[250px]
                  min-[3840px]:min-h-[360px]
                  overflow-hidden
                  rounded-[28px]
                  min-[3840px]:rounded-[44px]
                  border border-gray-200
                  bg-white
                  p-5 sm:p-6
                  min-[1920px]:p-7
                  min-[3840px]:p-10
                  shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                  transition-all duration-500
                  hover:-translate-y-1
                  hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]
                  text-left
                  flex flex-col
                  justify-between
                  shrink-0
                "
              >
                <span
                  className="
                    inline-flex w-fit
                    rounded-full
                    bg-blue-50
                    px-3 py-1
                    text-[11px] sm:text-xs
                    min-[1920px]:text-sm
                    min-[3840px]:text-xl
                    font-medium
                    text-[#0B4EA2]
                  "
                >
                  Email
                </span>

                <div className="mt-4 sm:mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0 pr-3">
                    <h3
                      style={{ fontFamily: "'Poppins', serif" }}
                      className="
                        text-xl sm:text-2xl
                        min-[1920px]:text-3xl
                        min-[3840px]:text-5xl
                        font-bold
                        leading-tight
                        text-gray-900
                      "
                    >
                      Email Us
                    </h3>

                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="
                        mt-2
                        text-sm sm:text-base
                        min-[1920px]:text-lg
                        min-[3840px]:text-2xl
                        text-gray-500
                        break-all
                      "
                    >
                      {emailAddress}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-12 w-12
                      sm:h-14 sm:w-14
                      min-[1920px]:h-16 min-[1920px]:w-16
                      min-[3840px]:h-24 min-[3840px]:w-24
                      shrink-0
                      items-center justify-center
                      rounded-full
                      bg-blue-50
                    "
                  >
                    <Mail
                      className="
                        h-6 w-6
                        sm:h-7 sm:w-7
                        min-[1920px]:h-8 min-[1920px]:w-8
                        min-[3840px]:h-12 min-[3840px]:w-12
                        text-[#0B4EA2]
                      "
                    />
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4 sm:pt-5">
                  <button
                    type="button"
                    onClick={handleEmailClick}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="
                      flex w-full items-center justify-between
                      text-sm sm:text-base
                      min-[1920px]:text-lg
                      min-[3840px]:text-2xl
                      font-semibold
                      text-[#0B4EA2]
                      transition-colors
                      group-hover:text-blue-800
                      cursor-pointer
                    "
                  >
                    <span>Send Email</span>
                    <ArrowUpRight
                      className="
                        h-5 w-5
                        sm:h-6 sm:w-6
                        min-[1920px]:h-7 min-[1920px]:w-7
                        min-[3840px]:h-10 min-[3840px]:w-10
                        transition-transform duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    />
                  </button>
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              {/* Duplicate set for seamless loop */}
<div className="contact-cards-duplicate flex flex-col gap-5 sm:gap-6 min-[1920px]:gap-8 min-[3840px]:gap-12 w-full">
                {/* ----- WhatsApp ----- */}
                <div
                  aria-hidden="true"
                  className="
                    group relative w-full min-h-[210px] sm:min-h-[225px]
                    min-[1920px]:min-h-[250px] min-[3840px]:min-h-[360px]
                    overflow-hidden rounded-[28px] min-[3840px]:rounded-[44px]
                    border border-gray-200 bg-white p-5 sm:p-6
                    min-[1920px]:p-7 min-[3840px]:p-10
                    shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                    text-left flex flex-col justify-between shrink-0
                  "
                >
                  <span className="inline-flex w-fit rounded-full bg-green-50 px-3 py-1 text-[11px] sm:text-xs min-[1920px]:text-sm min-[3840px]:text-xl font-medium text-green-600">
                    WhatsApp
                  </span>
                  <div className="mt-4 sm:mt-5 flex items-start justify-between gap-4">
                    <div className="min-w-0 pr-3">
                      <h3 style={{ fontFamily: "'Poppins', serif" }} className="text-xl sm:text-2xl min-[1920px]:text-3xl min-[3840px]:text-5xl font-bold leading-tight text-gray-900">
                        WhatsApp Us
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif" }} className="mt-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-500">
                        +91 99216 11911
                      </p>
                    </div>
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 min-[1920px]:h-16 min-[1920px]:w-16 min-[3840px]:h-24 min-[3840px]:w-24 shrink-0 items-center justify-center rounded-full bg-green-50">
                      <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7 min-[1920px]:h-8 min-[1920px]:w-8 min-[3840px]:h-12 min-[3840px]:w-12 text-[#25D366]" />
                    </div>
                  </div>
                  <div className="mt-5 border-t border-gray-100 pt-4 sm:pt-5 flex items-center justify-between text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-semibold text-green-600">
                    <span>WhatsApp Now</span>
                    <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 min-[1920px]:h-7 min-[1920px]:w-7 min-[3840px]:h-10 min-[3840px]:w-10" />
                  </div>
                </div>

                {/* ----- Call ----- */}
                <div
                  aria-hidden="true"
                  className="
                    group relative w-full min-h-[210px] sm:min-h-[225px]
                    min-[1920px]:min-h-[250px] min-[3840px]:min-h-[360px]
                    overflow-hidden rounded-[28px] min-[3840px]:rounded-[44px]
                    border border-gray-200 bg-white p-5 sm:p-6
                    min-[1920px]:p-7 min-[3840px]:p-10
                    shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                    text-left flex flex-col justify-between shrink-0
                  "
                >
                  <span className="inline-flex w-fit rounded-full bg-green-50 px-3 py-1 text-[11px] sm:text-xs min-[1920px]:text-sm min-[3840px]:text-xl font-medium text-green-600">
                    Phone
                  </span>
                  <div className="mt-4 sm:mt-5 flex items-start justify-between gap-4">
                    <div className="min-w-0 pr-3">
                      <h3 style={{ fontFamily: "'Poppins', serif" }} className="text-xl sm:text-2xl min-[1920px]:text-3xl min-[3840px]:text-5xl font-bold leading-tight text-gray-900">
                        Call Us
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif" }} className="mt-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-500">
                        +91 99216 11911
                      </p>
                    </div>
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 min-[1920px]:h-16 min-[1920px]:w-16 min-[3840px]:h-24 min-[3840px]:w-24 shrink-0 items-center justify-center rounded-full bg-green-50">
                      <Phone className="h-6 w-6 sm:h-7 sm:w-7 min-[1920px]:h-8 min-[1920px]:w-8 min-[3840px]:h-12 min-[3840px]:w-12 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-5 border-t border-gray-100 pt-4 sm:pt-5 flex items-center justify-between text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-semibold text-green-600">
                    <span>Call Now</span>
                    <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 min-[1920px]:h-7 min-[1920px]:w-7 min-[3840px]:h-10 min-[3840px]:w-10" />
                  </div>
                </div>

                {/* ----- Email ----- */}
                <div
                  aria-hidden="true"
                  className="
                    group relative w-full min-h-[210px] sm:min-h-[225px]
                    min-[1920px]:min-h-[250px] min-[3840px]:min-h-[360px]
                    overflow-hidden rounded-[28px] min-[3840px]:rounded-[44px]
                    border border-gray-200 bg-white p-5 sm:p-6
                    min-[1920px]:p-7 min-[3840px]:p-10
                    shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                    text-left flex flex-col justify-between shrink-0
                  "
                >
                  <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-[11px] sm:text-xs min-[1920px]:text-sm min-[3840px]:text-xl font-medium text-[#0B4EA2]">
                    Email
                  </span>
                  <div className="mt-4 sm:mt-5 flex items-start justify-between gap-4">
                    <div className="min-w-0 pr-3">
                      <h3 style={{ fontFamily: "'Poppins', serif" }} className="text-xl sm:text-2xl min-[1920px]:text-3xl min-[3840px]:text-5xl font-bold leading-tight text-gray-900">
                        Email Us
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif" }} className="mt-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-500 break-all">
                        {emailAddress}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 min-[1920px]:h-16 min-[1920px]:w-16 min-[3840px]:h-24 min-[3840px]:w-24 shrink-0 items-center justify-center rounded-full bg-blue-50">
                      <Mail className="h-6 w-6 sm:h-7 sm:w-7 min-[1920px]:h-8 min-[1920px]:w-8 min-[3840px]:h-12 min-[3840px]:w-12 text-[#0B4EA2]" />
                    </div>
                  </div>
                  <div className="mt-5 border-t border-gray-100 pt-4 sm:pt-5 flex items-center justify-between text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-semibold text-[#0B4EA2]">
                    <span>Send Email</span>
                    <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 min-[1920px]:h-7 min-[1920px]:w-7 min-[3840px]:h-10 min-[3840px]:w-10" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;