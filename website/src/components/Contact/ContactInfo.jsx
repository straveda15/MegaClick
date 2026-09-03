import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const ContactInfo = () => {
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

    const isMobile = /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      const mailtoUrl = `mailto:${emailAddress}`;
      window.location.href = mailtoUrl;
    } else {
      const gmailComposeUrl =
        `https://mail.google.com/mail/?view=cm&fs=1` +
        `&to=${encodeURIComponent(emailAddress)}`;

      window.open(gmailComposeUrl, "_blank");
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
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 min-[1920px]:gap-10 min-[3840px]:gap-16 items-stretch">

          {/* ── MAP CARD ── */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl sm:rounded-[28px] min-[3840px]:rounded-[44px] border border-gray-200 min-[3840px]:border-2 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">

            <div className="absolute top-0 left-0 h-1.5 min-[3840px]:h-3 w-full bg-gradient-to-r from-[#0B4EA2] to-green-500" />

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
                    style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
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

              <h4
                style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
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

             
              {/* ── HIGHLIGHTED OFFICE HOURS (NORMAL GREEN BG, NO DOT) ── */}
              <div className="mt-4 sm:mt-5 min-[3840px]:mt-8 inline-flex items-center gap-2 rounded-xl sm:rounded-2xl bg-green-50 border border-green-200 px-3.5 sm:px-4 min-[3840px]:px-6 py-2 min-[3840px]:py-3">
                <Clock className="w-4 h-4 min-[3840px]:w-6 min-[3840px]:h-6 text-green-700 shrink-0" />
                <span
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold text-green-800"
                >
                  Mon – Sat • 9:00 AM – 7:00 PM
                </span>
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
          <div className="flex flex-col justify-between gap-5 sm:gap-6 min-[1920px]:gap-8 min-[3840px]:gap-12 w-full">

            {/* ----- WhatsApp ----- */}
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-[28px] min-[3840px]:rounded-[44px] bg-white border border-gray-200 min-[3840px]:border-2 p-5 sm:p-6 min-[1920px]:p-8 min-[3840px]:p-12 shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full flex flex-col justify-between text-left">

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-5 min-[3840px]:gap-8 min-w-0">

                  <div className="w-12 h-12 sm:w-14 sm:h-14 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-24 min-[3840px]:h-24 flex-shrink-0 rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl bg-green-100 flex items-center justify-center group-hover:bg-[#25D366] transition-all duration-300">
                    <FaWhatsapp
                      className="w-6 h-6 sm:w-7 sm:h-7 min-[1920px]:w-8 min-[1920px]:h-8 min-[3840px]:w-12 min-[3840px]:h-12 text-[#25D366] group-hover:text-white transition"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="card-title text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-4xl font-bold text-gray-900"
                    >
                      WhatsApp Us
                    </h3>

                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="mt-1 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl text-gray-600"
                    >
                      +91 99216 11911
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  className="w-6 h-6 min-[3840px]:w-10 min-[3840px]:h-10 flex-shrink-0 text-gray-300 group-hover:text-[#25D366] group-hover:rotate-45 transition"
                />
              </div>

              <a
                href="https://wa.me/919921611911"
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="mt-5 sm:mt-6 min-[3840px]:mt-10 w-full py-3 sm:py-3.5 min-[1920px]:py-4 min-[3840px]:py-6 rounded-xl min-[3840px]:rounded-2xl bg-[#25D366] text-white text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1ebd5b] transition shadow-xs"
              >
                <FaWhatsapp className="w-5 h-5 min-[3840px]:w-8 min-[3840px]:h-8" />
                <span>WhatsApp Now</span>
              </a>
            </div>

            {/* ----- Call ----- */}
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-[28px] min-[3840px]:rounded-[44px] bg-white border border-gray-200 min-[3840px]:border-2 p-5 sm:p-6 min-[1920px]:p-8 min-[3840px]:p-12 shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full flex flex-col justify-between text-left">

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-5 min-[3840px]:gap-8 min-w-0">

                  <div className="w-12 h-12 sm:w-14 sm:h-14 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-24 min-[3840px]:h-24 flex-shrink-0 rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-all duration-300">
                    <Phone
                      className="w-6 h-6 sm:w-7 sm:h-7 min-[1920px]:w-8 min-[1920px]:h-8 min-[3840px]:w-12 min-[3840px]:h-12 text-green-600 group-hover:text-white transition"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="card-title text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-4xl font-bold text-gray-900"
                    >
                      Call Us
                    </h3>

                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="mt-1 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl text-gray-600"
                    >
                      +91 99216 11911
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  className="w-6 h-6 min-[3840px]:w-10 min-[3840px]:h-10 flex-shrink-0 text-gray-300 group-hover:text-green-600 group-hover:rotate-45 transition"
                />
              </div>

              <a
                href={`tel:${phoneNumber}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="mt-5 sm:mt-6 min-[3840px]:mt-10 w-full py-3 sm:py-3.5 min-[1920px]:py-4 min-[3840px]:py-6 rounded-xl min-[3840px]:rounded-2xl bg-green-600 text-white text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-xs"
              >
                <Phone className="w-5 h-5 min-[3840px]:w-8 min-[3840px]:h-8" />
                <span>Call Now</span>
              </a>
            </div>

            {/* ----- Email ----- */}
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-[28px] min-[3840px]:rounded-[44px] bg-white border border-gray-200 min-[3840px]:border-2 p-5 sm:p-6 min-[1920px]:p-8 min-[3840px]:p-12 shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full flex flex-col justify-between text-left">

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-5 min-[3840px]:gap-8 min-w-0">

                  <div className="w-12 h-12 sm:w-14 sm:h-14 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-24 min-[3840px]:h-24 flex-shrink-0 rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl bg-blue-100 flex items-center justify-center group-hover:bg-[#0B4EA2] transition duration-300">
                    <Mail
                      className="w-6 h-6 sm:w-7 sm:h-7 min-[1920px]:w-8 min-[1920px]:h-8 min-[3840px]:w-12 min-[3840px]:h-12 text-[#0B4EA2] group-hover:text-white transition"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="card-title text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-4xl font-bold text-gray-900"
                    >
                      Email Us
                    </h3>

                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="mt-1 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl text-gray-600 break-all"
                    >
                      {emailAddress}
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  className="w-6 h-6 min-[3840px]:w-10 min-[3840px]:h-10 flex-shrink-0 text-gray-300 group-hover:text-[#0B4EA2] group-hover:rotate-45 transition"
                />
              </div>

              <button
                type="button"
                onClick={handleEmailClick}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="mt-5 sm:mt-6 min-[3840px]:mt-10 w-full py-3 sm:py-3.5 min-[1920px]:py-4 min-[3840px]:py-6 rounded-xl min-[3840px]:rounded-2xl bg-[#0B4EA2] text-white text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-900 transition cursor-pointer shadow-xs"
              >
                <Mail className="w-5 h-5 min-[3840px]:w-8 min-[3840px]:h-8" />
                <span>Send Email</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;