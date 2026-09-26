import { ArrowUpRight, Clock } from "lucide-react";

const ContactInfo = () => {
  // -------------------------------------------------
  // EXACT GOOGLE MAPS LOCATION
  // -------------------------------------------------
  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=MegaClick%20Properties";

  return (
    <section className="relative w-full pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-12 min-[1920px]:pt-10 min-[1920px]:pb-14 min-[3840px]:pt-16 min-[3840px]:pb-20 bg-white overflow-hidden font-['Inter',sans-serif]">
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
        <div className="mb-4 sm:mb-5 lg:mb-6 w-full text-left">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="contact-info-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2.5 sm:mb-3 text-left"
          >
            CONTACT INFORMATION
          </p>

          <h2
            style={{ fontFamily: "'Poppins', serif" }}
            className="contact-info-title text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold leading-[1.18] text-black text-left mb-0"
          >
            Get In <span className="text-[#0B4EA2]">Touch With Us</span>
          </h2>
        </div>

        {/* ── OFFICE: map (left) + address details (right) ── */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-6 sm:gap-8 min-[1920px]:gap-10 min-[3840px]:gap-16 items-start">

            {/* MAP */}
            <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[300px] min-[1920px]:min-h-[360px] min-[3840px]:min-h-[560px] overflow-hidden rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl border border-gray-200 min-[3840px]:border-2">
              <iframe
                title="MegaClick Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.917570480964!2d73.75160959678958!3d20.01197400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb28d1dd624d%3A0xe806e01c2d79c79f!2sMegaClick%20Properties!5e0!3m2!1sen!2sin!4v1788432312836!5m2!1sen!2sin"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            {/* ADDRESS + ACTIONS */}
            <div className="flex flex-col gap-5 sm:gap-6 min-[3840px]:gap-10 text-left">
              {/* ADDRESS BOX */}
              <div className="rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl border border-gray-200 min-[3840px]:border-2 bg-gray-50 p-4 sm:p-5 min-[1920px]:p-6 min-[3840px]:p-10">
                <h4
                  style={{ fontFamily: "'Poppins', serif" }}
                  className="text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-4xl font-bold leading-none text-gray-900"
                >
                  MegaClick Office
                </h4>

                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="mt-2 sm:mt-2.5 min-[3840px]:mt-5 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-3xl leading-relaxed text-gray-600"
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

              {/* Open in Maps + Office hours */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-[3840px]:gap-6">
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

                <div className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl bg-green-50 border border-green-200 px-3.5 sm:px-4 min-[3840px]:px-6 py-2 sm:py-2.5 min-[3840px]:py-3">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
