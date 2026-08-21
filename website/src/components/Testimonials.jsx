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

  // We duplicate the array 4 times to ensure it fills ultra-wide screens.
  // The CSS animation will translate exactly -50% to create a seamless infinite loop.
  const extendedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-14 lg:py-16">
      {/* MAIN CONTAINER */}
      <div className="max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20">
        
        {/* HEADER AREA */}
        <div className="mb-8 sm:mb-10 lg:mb-12 w-full text-left">
          {/* ====================== TOP TAGLINE ====================== */}
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3.5 sm:mb-4.5 text-left">
            CLIENT OUTCOMES
          </p>

          {/* MAIN HEADING */}
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              text-3xl
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
            <span className="text-[#0B4EA2]">{" "}Say About MegaClick</span>
          </h2>
        </div>

        {/* TESTIMONIAL SLIDER */}
        <div className="relative overflow-hidden w-full py-4">
          
          {/* Inline styles for perfect seamless marquee loop */}
          <style>{`
            @keyframes continuous-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-continuous-scroll {
              animation: continuous-scroll 40s linear infinite;
            }
          `}</style>

          <div
            className="flex w-max animate-continuous-scroll"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {extendedTestimonials.map((item, index) => (
              <div 
                key={index} 
                className="pr-5 sm:pr-6 flex-shrink-0"
              >
                <article
                  className="relative w-[300px] sm:w-[340px] md:w-[360px] bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onTouchStart={() => setIsPaused(true)}
                  onTouchEnd={() => setIsPaused(false)}
                  onTouchCancel={() => setIsPaused(false)}
                >
                  {/* TOP ROW: Stars (left) + Quote Icon (right) */}
                  <div className="flex items-start justify-between mb-5">
                    {/* RATING STARS — green */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          fill="currentColor"
                          className="text-green-500"
                        />
                      ))}
                    </div>

                    {/* QUOTE ICON — top right */}
                    <Quote size={22} className="text-slate-300" />
                  </div>

                  {/* REVIEW TEXT */}
                  <p className="text-sm sm:text-[15px] text-justify text-slate-600 leading-relaxed min-h-[110px]">
                    {item.review}
                  </p>

                  {/* DIVIDER */}
                  <div className="my-4 h-px bg-slate-100" />

                  {/* CLIENT DETAILS */}
                  <div className="flex items-center gap-3">
                    {/* TEXT INFO */}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      {/* NAME — blue bold */}
                      <h3 className="text-sm sm:text-base font-bold text-[#0B4EA2] truncate">
                        {item.name}
                      </h3>
                      {/* SERVICE — blue lighter */}
                      <p className="text-xs font-semibold text-[#0B4EA2]/70 truncate">
                        {item.service}
                      </p>
                      {/* LOCATION — slate muted */}
                      <p className="text-[11px] text-slate-400">
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