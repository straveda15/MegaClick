import React, { useState } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Sharma",
    service: "Private Limited Company Registration",
    location: "Nashik, Maharashtra",
    review:
      "MegaClick provided exceptional support during our company registration process. Their team handled every document professionally and ensured a hassle-free experience.",
  },
  {
    name: "Priya Enterprises",
    service: "GST Registration",
    location: "Pune, Maharashtra",
    review:
      "The entire process was smooth and transparent. We received regular updates and expert guidance throughout the business registration journey.",
  },
  {
    name: "Amit Patil",
    service: "Trademark Registration",
    location: "Mumbai, Maharashtra",
    review:
      "Excellent service with outstanding customer support. Every query was answered promptly and the team completed our work on time.",
  },
  {
    name: "Sneha Kulkarni",
    service: "MSME Registration",
    location: "Nagpur, Maharashtra",
    review:
      "MegaClick made the documentation process incredibly simple. Their professional approach exceeded our expectations.",
  },
];

const Testimonials = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate array for seamless infinite marquee loop
  const extendedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-14 lg:py-16 testimonials-section">
      {/* UNIFIED APP-CONTAINER + BALANCED RESPONSIVE SCALING */}
      <style>{`
        .app-container {
          width: 100%;
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        @media (min-width: 640px) {
          .app-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .app-container {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1280px) {
          .app-container {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        /* Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .app-container {
            max-width: 1440px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }
          .testi-tagline {
            font-size: 0.85rem !important;
            margin-bottom: 0.75rem !important;
          }
          .testi-title {
            font-size: 2.25rem !important;
            line-height: 1.2 !important;
          }
          .testi-card {
            width: 360px !important;
            padding: 1.5rem !important;
          }
          .testi-text {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
          }
        }

        /* Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .app-container {
            max-width: 1800px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .testimonials-section {
            padding-top: 4.5rem !important;
            padding-bottom: 4.5rem !important;
          }
          .testi-tagline {
            font-size: 0.9rem !important;
            margin-bottom: 1rem !important;
          }
          .testi-title {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
            margin-bottom: 1rem !important;
          }
          .testi-card {
            width: 420px !important;
            padding: 1.85rem !important;
            border-radius: 1.25rem !important;
          }
          .testi-text {
            font-size: 1.05rem !important;
            line-height: 1.75 !important;
            min-height: 120px !important;
          }
          .testi-name {
            font-size: 1.1rem !important;
          }
          .testi-service {
            font-size: 0.9rem !important;
          }
          .testi-loc {
            font-size: 0.8rem !important;
          }
        }

        /* QHD / 2K Ultra-Wide (2560px Desktop) */
        @media (min-width: 2560px) {
          .app-container {
            max-width: 2400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }
          .testimonials-section {
            padding-top: 5.5rem !important;
            padding-bottom: 5.5rem !important;
          }
          .testi-tagline {
            font-size: 1.05rem !important;
          }
          .testi-title {
            font-size: 3rem !important;
            line-height: 1.2 !important;
          }
          .testi-card {
            width: 500px !important;
            padding: 2.25rem !important;
            border-radius: 1.5rem !important;
          }
          .testi-text {
            font-size: 1.2rem !important;
            line-height: 1.8 !important;
            min-height: 140px !important;
          }
          .testi-name {
            font-size: 1.25rem !important;
          }
          .testi-service {
            font-size: 1rem !important;
          }
          .testi-loc {
            font-size: 0.9rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .app-container {
            max-width: 3400px !important;
            padding-left: 10rem !important;
            padding-right: 10rem !important;
          }
          .testimonials-section {
            padding-top: 6.5rem !important;
            padding-bottom: 6.5rem !important;
          }
          .testi-tagline {
            font-size: 1.25rem !important;
            margin-bottom: 1.5rem !important;
          }
          .testi-title {
            font-size: 3.75rem !important;
            line-height: 1.15 !important;
            margin-bottom: 1.5rem !important;
          }
          .testi-card {
            width: 620px !important;
            padding: 2.75rem !important;
            border-radius: 2rem !important;
          }
          .testi-text {
            font-size: 1.5rem !important;
            line-height: 1.8 !important;
            min-height: 170px !important;
          }
          .testi-name {
            font-size: 1.6rem !important;
          }
          .testi-service {
            font-size: 1.25rem !important;
          }
          .testi-loc {
            font-size: 1.1rem !important;
          }
        }

        /* Seamless Continuous Scroll Keyframes */
        @keyframes continuous-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-continuous-scroll {
          animation: continuous-scroll 42s linear infinite;
        }
      `}</style>

      {/* MAIN CONTAINER */}
      <div className="app-container">
        
        {/* HEADER AREA */}
        <div className="mb-6 sm:mb-8 lg:mb-10 w-full text-left">
          {/* TOP TAGLINE */}
          <p className="testi-tagline text-xs font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3 sm:mb-4 text-left">
            CLIENT OUTCOMES
          </p>

          {/* MAIN HEADING */}
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              testi-title
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-3xl
              xl:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
              mb-3
              sm:mb-4
            "
          >
            What Our Clients{" "}
            <span className="text-[#0B4EA2]">Say About MegaClick</span>
          </h2>
        </div>

        {/* TESTIMONIAL SLIDER */}
        <div className="relative overflow-hidden w-full py-4">
          <div
            className="flex w-max animate-continuous-scroll select-none"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {extendedTestimonials.map((item, index) => (
              <div 
                key={index} 
                className="pr-4 sm:pr-5 lg:pr-6 flex-shrink-0"
              >
                <article
                  className="testi-card relative w-[290px] sm:w-[330px] md:w-[360px] bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onTouchStart={() => setIsPaused(true)}
                  onTouchEnd={() => setIsPaused(false)}
                  onTouchCancel={() => setIsPaused(false)}
                >
                  {/* TOP ROW: Stars (left) + Quote Icon (right) */}
                  <div className="flex items-start justify-between mb-4 sm:mb-5">
                    {/* RATING STARS — green */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill="currentColor"
                          className="text-green-500"
                        />
                      ))}
                    </div>

                    {/* QUOTE ICON — top right */}
                    <Quote size={20} className="text-slate-300" />
                  </div>

                  {/* REVIEW TEXT */}
                  <p className="testi-text text-xs sm:text-sm md:text-[14.5px] text-justify text-slate-600 leading-relaxed min-h-[96px] sm:min-h-[105px]">
                    {item.review}
                  </p>

                  {/* DIVIDER */}
                  <div className="my-3.5 sm:my-4 h-px bg-slate-100" />

                  {/* CLIENT DETAILS */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      {/* NAME — blue bold */}
                      <h3 className="testi-name text-xs sm:text-sm md:text-base font-bold text-[#0B4EA2] truncate">
                        {item.name}
                      </h3>
                      {/* SERVICE — blue lighter */}
                      <p className="testi-service text-[11px] sm:text-xs font-semibold text-[#0B4EA2]/70 truncate">
                        {item.service}
                      </p>
                      {/* LOCATION — slate muted */}
                      <p className="testi-loc text-[10px] sm:text-[11px] text-slate-400">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;