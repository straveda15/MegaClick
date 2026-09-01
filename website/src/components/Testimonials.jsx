import React, { useState } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  { name: "Rajesh Sharma", service: "Private Limited Company Registration", location: "Nashik, Maharashtra", review: "MegaClick provided exceptional support during our company registration process. Their team handled every document professionally and ensured a hassle-free experience." },
  { name: "Priya Enterprises", service: "GST Registration", location: "Pune, Maharashtra", review: "The entire process was smooth and transparent. We received regular updates and expert guidance throughout the business registration journey." },
  { name: "Amit Patil", service: "Trademark Registration", location: "Mumbai, Maharashtra", review: "Excellent service with outstanding customer support. Every query was answered promptly and the team completed our work on time." },
  { name: "Sneha Kulkarni", service: "MSME Registration", location: "Nagpur, Maharashtra", review: "MegaClick made the documentation process incredibly simple. Their professional approach exceeded our expectations." },
];

const Testimonials = () => {
  const [isPaused, setIsPaused] = useState(false);
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="w-full bg-white py-8 sm:py-12 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 font-['Inter',sans-serif]">
      <style>{`
        @keyframes continuous-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-continuous-scroll {
          animation: continuous-scroll 42s linear infinite;
        }
      `}</style>

      <div className="w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">
        <div className="mb-6 sm:mb-8 lg:mb-10 w-full text-left">
          <p className="text-xs sm:text-sm min-[3840px]:text-2xl font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3 sm:mb-4 text-left">
            CLIENT OUTCOMES
          </p>

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="text-3xl sm:text-4xl min-[1920px]:text-5xl min-[3840px]:text-7xl font-bold leading-[1.18] text-black text-left mb-3 sm:mb-4"
          >
            What Our Clients <span className="text-[#0B4EA2]">Say About MegaClick</span>
          </h2>
        </div>

        <div className="relative overflow-hidden w-full py-4">
          <div
            className="flex w-max animate-continuous-scroll select-none"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {extendedTestimonials.map((item, index) => (
              <div key={index} className="pr-4 sm:pr-5 lg:pr-6 min-[3840px]:pr-10 flex-shrink-0">
                <article
                  className="relative w-[290px] sm:w-[330px] md:w-[360px] min-[1920px]:w-[420px] min-[3840px]:w-[600px] bg-white rounded-2xl min-[3840px]:rounded-3xl border border-slate-200 p-5 sm:p-6 min-[3840px]:p-10 shadow-sm hover:shadow-md transition-all duration-300"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <div className="flex items-start justify-between mb-4 sm:mb-5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill="currentColor" className="text-green-500 min-[3840px]:w-8 min-[3840px]:h-8" />
                      ))}
                    </div>
                    <Quote size={20} className="text-slate-300 min-[3840px]:w-10 min-[3840px]:h-10" />
                  </div>

                  <p className="text-xs sm:text-sm md:text-[14.5px] min-[1920px]:text-base min-[3840px]:text-2xl text-justify text-slate-600 leading-relaxed min-h-[96px] sm:min-h-[105px] min-[3840px]:min-h-[160px]">
                    {item.review}
                  </p>

                  <div className="my-3.5 sm:my-4 h-px bg-slate-100" />

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <h3 className="text-xs sm:text-sm md:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-[#0B4EA2] truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs min-[1920px]:text-sm min-[3840px]:text-xl font-semibold text-[#0B4EA2]/70 truncate">
                        {item.service}
                      </p>
                      <p className="text-[10px] sm:text-[11px] min-[1920px]:text-xs min-[3840px]:text-lg text-slate-400">
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