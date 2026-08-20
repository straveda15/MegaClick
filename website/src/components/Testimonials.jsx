import React, { useState } from "react";
import { Quote, Star, UserCircle2 } from "lucide-react";

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
            className="text-2xl sm:text-3xl lg:text-[40px] font-normal text-[#0f172a] leading-tight"
            style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif', fontWeight: 400 }}
          >
            What Our Clients <span className="text-[#0B4EA2]">Say About MegaClick</span>
          </h2>
        </div>

        {/* TESTIMONIAL SLIDER */}
        <div className="relative overflow-hidden w-full">
          <div
            className="testimonials-track flex gap-5 sm:gap-6 w-max animate-testimonials py-4"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map(
              (item, index) => (
                <article
                  key={index}
                  className="relative w-[300px] sm:w-[340px] md:w-[360px] flex-shrink-0 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
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
                  <p className="text-sm sm:text-[15px] text-justify  text-slate-600 leading-relaxed min-h-[110px]">
                    {item.review}
                  </p>

                  {/* DIVIDER */}
                  <div className="my-4 h-px bg-slate-100" />

                  {/* CLIENT DETAILS — Icon + Name/Service/Location */}
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
              )
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;