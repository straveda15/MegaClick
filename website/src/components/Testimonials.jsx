import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";

// Fallback testimonials supplied for the services section.
export const defaultTestimonials = [
  {
    name: "Sneha Kulkarni",
    service: "Marriage Registration",
    services: ["Marriage Registration"],
    location: "Maharashtra",
    review: "We were unsure which documents to prepare for our marriage registration. The clear instructions made each step easier to understand.",
    rating: 3,
  },
  {
    name: "Priya Enterprises",
    service: "Leave & Licence Agreement",
    services: ["Leave & Licence Agreement"],
    location: "Pune, Maharashtra",
    review: "I needed a rental agreement for my new flat. The important clauses and paperwork were explained clearly, so I knew what to check before signing.",
    rating: 3,
  },
  {
    name: "Santosh",
    service: "GST Registration",
    services: ["GST Registration"],
    location: "Pune, Maharashtra",
    review: "I was confused about the GST requirements for my new business. Now I have a much clearer idea of the documents and registration process.",
    rating: 3,
  },
  {
    name: "Rajesh Sharma",
    service: "Income Tax Services",
    services: ["Income Tax Services"],
    location: "Nashik, Maharashtra",
    review: "I had several doubts about filing my income tax return. The explanations were straightforward, and I felt more confident about preparing my documents.",
    rating: 3,
  },
  {
    name: "Adv. Ajinath",
    service: "Partnership Deed",
    services: ["Partnership Deed"],
    location: "Ahmednagar, Maharashtra",
    review: "Before launching our business together, we wanted clarity on the partnership deed. We now have a better understanding of the documentation and formalities involved.",
    rating: 3,
  },
  {
    name: "N.B. Kadu",
    service: "Trademark Registration",
    services: ["Trademark Registration"],
    location: "Maharashtra",
    review: "Protecting our brand name was important to us. We gained a better understanding of trademark registration and the steps involved in applying.",
    rating: 3,
  },
  {
    name: "Amit Patil",
    service: "Rent Agreement",
    services: ["Rent Agreement"],
    location: "Pune, Maharashtra",
    review: "I needed a rent agreement for my new flat. The process and paperwork were explained in simple words.",
    rating: 3,
  },
  {
    name: "New Business Owner",
    service: "Company Registration",
    services: ["Company Registration"],
    location: "Mumbai, Maharashtra",
    review: "We were planning to launch a new company and needed clarity on formalities. The team helped us understand the registration steps.",
    rating: 3,
  },
  {
    name: "Small Business Owner",
    service: "MSME / UDYAM Registration",
    services: ["MSME / UDYAM Registration"],
    location: "Maharashtra",
    review: "As a small business, we wanted to learn about UDYAM registration. The team explained the basic requirements and where to begin.",
    rating: 3,
  },
  {
    name: "Working Professional",
    service: "Passport Services",
    services: ["Passport Services"],
    location: "Maharashtra",
    review: "The team made my passport application process simple and helped me understand each step. Their guidance made the entire process easier and less stressful.",
    rating: 3,
  },
];
const Testimonials = () => {
  const [testimonialsList, setTestimonialsList] = useState(defaultTestimonials);
  const [visibleCards, setVisibleCards] = useState(3);
  const carouselRef = useRef(null);

  useEffect(() => {
    const updateVisibleCards = () => {
      setVisibleCards(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // ðŸ”„ Fetch dynamic data from Backend API (with /v1)
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/website-control/testimonials");
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          // Deduplicate by _id or name to prevent identical cards side-by-side
          const uniqueItems = Array.from(
            new Map(
              resData.data.map((item) => {
                const normalizedName = String(item.name || "").trim().toLowerCase();
                return [normalizedName || item._id, item];
              })
            ).values()
          );
          setTestimonialsList(uniqueItems);
        }
      } catch (error) {
        console.error("Backend fetch failed, using fallback:", error);
      }
    };
    fetchTestimonials();
  }, []);

  const cardsInView = Math.min(visibleCards, testimonialsList.length);
  const repeatCount = 12;
  // Render repeated sets so the carousel can continue seamlessly, even with
  // a single testimonial.
  const extendedTestimonials = Array.from({ length: repeatCount }, () => testimonialsList).flat();

  const getLoopWidth = useCallback(() => {
    const track = carouselRef.current?.firstElementChild;
    const firstCard = track?.children[0];
    const nextSetFirstCard = track?.children[testimonialsList.length];
    if (!firstCard || !nextSetFirstCard) return 0;

    // Measure the actual distance between repeated sets so fractional card
    // widths and responsive layout changes do not accumulate a loop offset.
    return nextSetFirstCard.offsetLeft - firstCard.offsetLeft;
  }, [testimonialsList.length]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || testimonialsList.length === 0) return;

    const frame = window.requestAnimationFrame(() => {
      const loopWidth = getLoopWidth();
      if (loopWidth > 0) {
        // Start in the middle copies, leaving room to loop in either direction.
        carousel.scrollLeft = loopWidth * 5;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [getLoopWidth, testimonialsList.length, visibleCards]);

  const moveCarousel = useCallback((direction) => {
    const carousel = carouselRef.current;
    if (!carousel || testimonialsList.length === 0) return;

    const track = carousel.firstElementChild;
    const firstCard = track?.children[0];
    const secondCard = track?.children[1];
    const loopWidth = getLoopWidth();
    if (!firstCard || !secondCard || loopWidth <= 0) return;

    const cardStep = secondCard.offsetLeft - firstCard.offsetLeft;
    const safeStart = loopWidth * 3;
    const safeEnd = loopWidth * (repeatCount - 3);
    if (direction < 0 && carousel.scrollLeft <= safeStart + cardStep / 2) {
      carousel.scrollLeft += loopWidth * (repeatCount - 6);
    } else if (direction > 0 && carousel.scrollLeft >= safeEnd - cardStep / 2) {
      carousel.scrollLeft -= loopWidth * (repeatCount - 6);
    }
    carousel.scrollBy({ left: cardStep * direction, behavior: "smooth" });
  }, [getLoopWidth, testimonialsList.length]);

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white font-['Inter',sans-serif] overflow-hidden">
      {/* DIRECT CSS RULES FOR 1440px, 1920px & 3840px RESPONSIVENESS */}
      <style>{`
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
        <div className="flex w-full items-center gap-2 py-2 sm:gap-3">
          <button type="button" onClick={() => moveCarousel(-1)} aria-label="Previous testimonial" className="relative z-20 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0B4EA2] bg-white text-[#0B4EA2] shadow-sm transition hover:bg-[#0B4EA2] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B4EA2] sm:h-10 sm:w-10">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <div
            ref={carouselRef}
            tabIndex={0}
            role="region"
            aria-label="Client testimonials. Use the arrow buttons to browse."
            className="min-w-0 flex-1 overflow-x-hidden overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B4EA2]"
          >
          {/* CAROUSEL TRACK */}
          <div
            className="flex items-stretch"
            style={{ width: `${(extendedTestimonials.length / cardsInView) * 100}%` }}
          >
            {extendedTestimonials.map((item, index) => {
              const starsCount = item.rating || 5;
              const serviceList =
                Array.isArray(item.services) && item.services.length > 0
                  ? item.services
                  : item.service
                  ? item.service.split(/[,â€¢|]/).map((s) => s.trim()).filter(Boolean)
                  : [];

              return (
                <div
                  key={`${item._id || item.name || "t"}-${index}`}
                  className="shrink-0 snap-start px-1.5 sm:px-2 lg:px-2.5 min-[1920px]:px-3 min-[3840px]:px-4 flex"
                  style={{ width: `${100 / extendedTestimonials.length}%` }}
                >
                  <article
                    className="
                      testimonials-card
                      relative
                      w-full
                      min-h-[280px]
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
                          {serviceList.slice(0, 1).map((svc, sIdx) => (
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
          <button type="button" onClick={() => moveCarousel(1)} aria-label="Next testimonial" className="relative z-20 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0B4EA2] bg-white text-[#0B4EA2] shadow-sm transition hover:bg-[#0B4EA2] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B4EA2] sm:h-10 sm:w-10">
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
