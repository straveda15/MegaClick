import React, { useState, useEffect } from "react";
import { Quote, Star } from "lucide-react";

// Fallback seed data focused on services outcomes
  export const defaultTestimonials = [
  {
  name: "Rajesh Sharma",
  service: "Income Tax Registration",
  services: ["Income Tax Registration"],
  location: "Nashik, Maharashtra",
  review:
    "I had some questions about the documents required for my income tax work. The team explained what I needed to prepare and guided me through the process. Communication was clear, and I knew what to expect at each step.",
  rating: 5,
},
{
  name: "Priya Enterprises",
  service: "GST Registration",
  services: ["GST Registration"],
  location: "Pune, Maharashtra",
  review:
    "We approached MegaClick for GST registration because we weren't sure about the documentation and process. The team answered our questions and kept us updated along the way. It was helpful having the requirements explained clearly.",
  rating: 5,
},
{
  name: "Amit Patil",
  service: "Trademark Registration",
  services: ["Trademark Registration"],
  location: "Mumbai, Maharashtra",
  review:
    "I wanted to understand the trademark registration process before getting started. The team explained the steps and the information I needed to arrange. Whenever I had a question, I could get clarification and move forward with more confidence.",
  rating: 5,
},
{
  name: "Sneha Kulkarni",
  service: "Marriage Registration",
  services: [
    "Marriage Registration",
    "Partnership Deed (Notary & Registration of Firm)",
  ],
  location: "Nagpur, Maharashtra",
  review:
    "We needed guidance on the documents and steps involved in marriage registration. The team helped us understand the requirements and what we needed to prepare. Having the process explained clearly made things less confusing for us.",
  rating: 5,
},
];

const Testimonials = () => {
  const [testimonialsList, setTestimonialsList] = useState(defaultTestimonials);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // 🔄 Fetch dynamic data from Backend API (with /v1)
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/website-control/testimonials");
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          // Deduplicate by _id or name to prevent identical cards side-by-side
          const uniqueItems = Array.from(
            new Map(resData.data.map((item) => [item._id || item.name, item])).values()
          );
          setTestimonialsList(uniqueItems);
        }
      } catch (error) {
        console.error("Backend fetch failed, using fallback:", error);
      }
    };
    fetchTestimonials();
  }, []);

  // Repeat items for smooth continuous marquee loop
  const extendedTestimonials = [
    ...testimonialsList,
    ...testimonialsList,
    ...testimonialsList,
    ...testimonialsList,
  ];

  const shouldPause = isHovered || isFocused || isTouched;

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white font-['Inter',sans-serif] overflow-hidden">
      {/* DIRECT CSS RULES FOR 1440px, 1920px & 3840px RESPONSIVENESS */}
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
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
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
            padding-left: 4rem !important;
            padding-right: 4rem !important;
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
            padding-left: 6rem !important;
            padding-right: 6rem !important;
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

      {/* UNIFIED CONTAINER */}
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
            style={{ fontFamily: "'Poppins', serif" }}
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
            What Our Clients{" "}
            <span className="text-[#0B4EA2]">Say About Our Services</span>
          </h2>
        </div>

        {/* MARQUEE CAROUSEL */}
        <div className="relative w-full py-2">
          <div
            tabIndex={0}
            role="region"
            aria-label="Client testimonials. Hover, focus, or touch and hold to pause scrolling."
            className="relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B4EA2]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsTouched(true)}
            onTouchEnd={() => setIsTouched(false)}
            onTouchCancel={() => setIsTouched(false)}
            onFocusCapture={() => setIsFocused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsFocused(false);
              }
            }}
          >
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* SCROLLING TRACK */}
          <div
            className="flex w-max animate-continuous-scroll items-stretch"
            style={{ animationPlayState: shouldPause ? "paused" : "running" }}
          >
            {extendedTestimonials.map((item, index) => {
              const starsCount = item.rating || 5;
              const serviceList =
                Array.isArray(item.services) && item.services.length > 0
                  ? item.services
                  : item.service
                  ? item.service.split(/[,•|]/).map((s) => s.trim()).filter(Boolean)
                  : [];

              return (
                <div
                  key={`${item._id || item.name || "t"}-${index}`}
                  className="pr-4 sm:pr-5 lg:pr-6 min-[1920px]:pr-7 min-[3840px]:pr-10 shrink-0 flex"
                >
                  <article
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
                    "
                  >
                    {/* TOP: STARS & QUOTE */}
                    <div>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: starsCount }).map((_, i) => (
                            <Star
                              key={i}
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
                          text-slate-700
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
                        {/* Person Name: Black */}
                        <h3
                          style={{ fontFamily: "'Inter', sans-serif" }}
                          className="testimonials-name text-xs sm:text-sm font-bold text-black leading-snug truncate"
                        >
                          {item.name}
                        </h3>

                        {/* Services: Blue, stacked vertically one by one (ek ke niche ek) */}
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          {serviceList.map((svc, sIdx) => (
                            <span
                              key={sIdx}
                              style={{ fontFamily: "'Inter', sans-serif" }}
                              className="testimonials-service text-[11px] sm:text-xs font-semibold text-[#0B4EA2] leading-tight"
                            >
                              {svc}
                            </span>
                          ))}
                        </div>

                        {/* Location: Black with proper visibility */}
                        <p
                          style={{ fontFamily: "'Inter', sans-serif" }}
                          className="testimonials-location text-[11px] sm:text-xs font-medium text-black/90 mt-1 truncate"
                        >
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
