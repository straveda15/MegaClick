import React from "react";
import {
  Users,
  Lightbulb,
  FileCheck2,
  WalletCards,
  ShieldCheck,
  Handshake,
  CheckCircle,
} from "lucide-react";

const hexagonItems = [
  {
    title: (
      <>
        EXPERT
        <br />
        PROFESSIONAL
        <br />
        NETWORK
      </>
    ),
    icon: Users,
    color: "green",
    delay: "0s",
  },
  {
    title: (
      <>
        ONE-STOP
        <br />
        SOLUTION
      </>
    ),
    icon: Lightbulb,
    color: "blue",
    delay: "0.5s",
  },
  {
    title: (
      <>
        END-TO-END
        <br />
        PROFESSIONAL
        <br />
        SERVICE
      </>
    ),
    icon: FileCheck2,
    color: "green",
    delay: "1s",
  },
  {
    title: (
      <>
        TIME &amp; COST
        <br />
        EFFICIENCY
      </>
    ),
    icon: WalletCards,
    color: "blue",
    delay: "1.5s",
  },
  {
    title: (
      <>
        TRANSPARENCY &amp;
        <br />
        ACCOUNTABILITY
      </>
    ),
    icon: ShieldCheck,
    color: "green",
    delay: "2s",
  },
  {
    title: (
      <>
        BUILT FOR
        <br />
        EVERYONE
      </>
    ),
    icon: Handshake,
    color: "blue",
    delay: "2.5s",
  },
];

const WhyChoose = () => {
  return (
    <section className="w-full bg-blue-50 py-8 sm:py-12 lg:py-16 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
        
        {/* ================= MAIN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] xl:grid-cols-[0.8fr_1.2fr] items-center gap-10 sm:gap-12 lg:gap-8 xl:gap-14">
          
          {/* ================= LEFT SIDE ================= */}
          <div className="text-left max-w-xl mx-0 lg:mx-0 w-full">
            
            {/* ================= BADGE ================= */}
            <div className="flex justify-start w-full mb-3">
             
            </div>

            {/* ================= HEADING (Hedvig Letters Serif) ================= */}
            <h2
              className="text-3xl sm:text-4xl lg:text-[44px] font-normal text-slate-900 leading-tight"
              style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif', fontWeight: 400 }}
            >
              Your Trusted <br />
              <span className="text-[#0B4EA2]">Partner</span>
            </h2>

            {/* ================= DESCRIPTION (Inter) ================= */}
            <p className="mt-3.5 sm:mt-4 text-slate-600 font-normal text-sm sm:text-base leading-relaxed max-w-xl text-left">
              MegaClick brings together trusted professionals, complete
              business solutions and reliable support to simplify every
              step of your business journey.
            </p>

            {/* ================= STATS (Inter) ================= */}
            <div className="mt-8 sm:mt-10 flex justify-start gap-8 sm:gap-12 lg:gap-10">
              {/* CLIENTS */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0B4EA2]">
                  15K+
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
                  Happy Clients
                </p>
              </div>

              {/* SUCCESS RATE */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-green-600">
                  99%
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
                  Success Rate
                </p>
              </div>

              {/* SERVICES */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0B4EA2]">
                  25+
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
                  Services
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-[660px] grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 pt-2">
              {hexagonItems.map((item, index) => (
                <FeatureCard key={index} item={item} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

/* ================= FEATURE CARD COMPONENT ================= */
const FeatureCard = ({ item }) => {
  const Icon = item.icon;
  const isBlue = item.color === "blue";

  return (
    <div className="group relative h-full">
      <div className="relative h-full flex flex-col items-center text-center bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_rgba(11,78,162,0.08)] px-3 py-6 sm:px-5 sm:py-7 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_36px_rgba(11,78,162,0.14)]">
        
        {/* ICON */}
        <div
          className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6
            ${isBlue ? "bg-blue-100" : "bg-green-100"}
          `}
        >
          <Icon
            size={24}
            strokeWidth={2}
            className={isBlue ? "text-[#0B4EA2]" : "text-[#0A8F55]"}
          />
        </div>

        {/* TITLE (Inter) */}
        <h3 className="min-h-[3.5rem] sm:min-h-[4rem] flex items-center justify-center text-[11px] sm:text-xs lg:text-sm font-extrabold text-gray-900 uppercase leading-snug tracking-wide">
          {item.title}
        </h3>

        {/* ACCENT UNDERLINE */}
        <div
          className={`
            mt-3 sm:mt-4 h-1 w-8 rounded-full flex-shrink-0
            ${isBlue ? "bg-[#0B4EA2]" : "bg-[#0A8F55]"}
          `}
        />
      </div>
    </div>
  );
};

export default WhyChoose;