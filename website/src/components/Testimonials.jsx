import React, { useState, useRef, useEffect } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Sharma",
    service: "Income Tax Registration",
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
  const pauseTimerRef = useRef(null);

  // Repeat items for smooth continuous loop
  const extendedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // When card is clicked: pause for 2 seconds, then automatically resume
  const handleCardClick = () => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white font-['Inter',sans-serif] overflow-hidden">
      {/* DIRECT CSS RULES FOR 1440px, 1920px & 3840px RESPONSIVENESS (MATCHED TO SERVICES) */}
      <style>{`
        @keyframes continuous-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-continuous-scroll {
          animation: continuous-scroll 38s linear infinite;
        }

        /* Standard Desktop (1440px) */
        @media (min-width: 1440px) {
          .testimonials-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;  /* px-10 */
            padding-right: 2.5rem !important; /* px-10 */
          }
          .testimonials-tagline {
            font-size: 0.85rem !important;
            margin-bottom: 0.75rem !important;
          }
          .testimonials-title {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }
        }

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .testimonials-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;   /* px-16 */
            padding-right: 4rem !important;  /* px-16 */
          }
          .testimonials-tagline {
            font-size: 1rem !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 1rem !important;
          }
          .testimonials-title {
            font-size: 3.25rem !important;
            line-height: 1.18 !important;
          }
          .testimonials-card {
            width: 420px !important;
            padding: 1.75rem !important;
          }
          .testimonials-review {
            font-size: 1rem !important;
            line-height: 1.7 !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .testimonials-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;   /* px-24 */
            padding-right: 6rem !important;  /* px-24 */
          }
          .testimonials-tagline {
            font-size: 1.75rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.75rem !important;
          }
          .testimonials-title {
            font-size: 5.5rem !important;
            line-height: 1.15 !important;
            margin-bottom: 2rem !important;
          }
          .testimonials-card {
            width: 660px !important;
            padding: 2.75rem !important;
            border-radius: 2.5rem !important;
          }
          .testimonials-review {
            font-size: 1.65rem !important;
            line-height: 2.6rem !important;
          }
          .testimonials-name {
            font-size: 2rem !important;
          }
          .testimonials-service {
            font-size: 1.5rem !important;
          }
          .testimonials-location {
            font-size: 1.25rem !important;
          }
        }
      `}</style>

      {/* UNIFIED CONTAINER (MATCHED TO SERVICES SECTION) */}
      <div className="testimonials-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        
        {/* HEADER */}
        <div className="mb-8 sm:mb-10 lg:mb-12 w-full text-left">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="testimonials-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2.5 sm:mb-3 text-left"
          >
            CLIENT OUTCOMES
          </p>

            <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              team-title
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
              mb-2.5
              sm:mb-4
            "
          >
          What Our Clients {" "}
            <span className="text-[#0B4EA2]">
      Say About MegaClick
            </span>
          </h2>
        </div>

        {/* MARQUEE CAROUSEL */}
        <div className="relative overflow-hidden w-full py-2">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* SCROLLING TRACK */}
          <div
            className="flex w-max animate-continuous-scroll select-none items-stretch"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {extendedTestimonials.map((item, index) => (
              <div
                key={index}
                className="pr-4 sm:pr-5 lg:pr-6 min-[1920px]:pr-7 min-[3840px]:pr-10 shrink-0 flex"
              >
                <article
                  onClick={handleCardClick}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className="
                    testimonials-card
                    relative
                    w-[280px]
                    sm:w-[330px]
                    md:w-[360px]
                    min-[1920px]:w-[420px]
                    min-[3840px]:w-[660px]
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200/90
                    p-5
                    sm:p-6
                    flex
                    flex-col
                    justify-between
                    shadow-sm
                    hover:shadow-md
                    hover:border-blue-200
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >
                  {/* TOP: STARS & QUOTE */}
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={15}
                            className="fill-emerald-500 text-emerald-500 min-[3840px]:w-7 min-[3840px]:h-7"
                          />
                        ))}
                      </div>
                      <Quote
                        size={18}
                        className="text-slate-300 min-[3840px]:w-8 min-[3840px]:h-8"
                      />
                    </div>

                    {/* REVIEW TEXT */}
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="
                        testimonials-review
                        text-xs
                        sm:text-[13.5px]
                        text-slate-600
                        leading-relaxed
                        text-left
                        min-h-[76px]
                        sm:min-h-[85px]
                      "
                    >
                      "{item.review}"
                    </p>
                  </div>

                  {/* BOTTOM: DIVIDER & CLIENT DETAILS */}
                  <div>
                    <div className="my-3.5 sm:my-4 h-px bg-slate-100" />

                    <div className="flex flex-col text-left">
                      <h3
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        className="testimonials-name text-xs sm:text-sm font-bold text-[#0B4EA2] leading-snug truncate"
                      >
                        {item.name}
                      </h3>
                      <p
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        className="testimonials-service text-[11px] sm:text-xs font-semibold text-[#0B4EA2]/80 mt-0.5 truncate"
                      >
                        {item.service}
                      </p>
                      <p
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        className="testimonials-location text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate"
                      >
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