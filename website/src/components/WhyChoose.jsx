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
        TIME & COST
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
        TRANSPARENCY &
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
    <section
      className="
        w-full
        bg-blue-50
        py-5
        sm:py-10
        lg:py-10
        overflow-hidden
      "
    >
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          pt-2
          sm:pt-3
          lg:pt-4
          pb-3
          sm:pb-6
          lg:pb-8
        "
      >
        {/* =====================================================
            MAIN LAYOUT
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[0.85fr_1.15fr]
            xl:grid-cols-[0.8fr_1.2fr]
            items-center
            gap-10
            sm:gap-12
            lg:gap-8
            xl:gap-14
          "
        >
          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <div
            className="
              text-left
              max-w-xl
              mx-0
              lg:mx-0
              w-full
            "
          >
            {/* ================= BADGE ================= */}

            <div
              className="
                flex
                justify-start
                w-full
              "
            >
              <span
                className="
                  relative
                  -top-5
                  sm:-top-6
                  lg:-top-8
                  inline-flex
                  items-center
                  gap-2
                  bg-[#0B4EA2]
                  text-white
                  px-4
                  py-2
                  rounded-full
                  text-[11px]
                  sm:text-xs
                  font-semibold
                  tracking-wide
                "
              >
                <CheckCircle
                  size={15}
                  className="text-green-300"
                />

                WHY CHOOSE US
              </span>
            </div>

            {/* ================= HEADING ================= */}

            <h2
              className="section-heading text-black"
            >
              Your Trusted
              <br />

              <span className="text-[#0B4EA2]">
                Partner
              </span>
            </h2>

            {/* ================= DESCRIPTION ================= */}

            <p
              className="section-text mt-3 sm:mt-4 text-gray-700 max-w-xl text-left"
            >
              MegaClick brings together trusted professionals, complete
              business solutions and reliable support to simplify every
              step of your business journey.
            </p>

            {/* =================================================
                STATS
            ================================================== */}

            <div
              className="
                mt-8
                sm:mt-10
                flex
                justify-start
                gap-8
                sm:gap-12
                lg:gap-10
              "
            >
              {/* CLIENTS */}

              <div>
                <h3
                  className="
                    text-3xl
                    sm:text-4xl
                    font-extrabold
                    text-[#0B4EA2]
                  "
                >
                  15K+
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    sm:text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  Happy Clients
                </p>
              </div>

              {/* SUCCESS RATE */}

              <div>
                <h3
                  className="
                    text-3xl
                    sm:text-4xl
                    font-extrabold
                    text-green-600
                  "
                >
                  99%
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    sm:text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  Success Rate
                </p>
              </div>

              {/* SERVICES */}

              <div>
                <h3
                  className="
                    text-3xl
                    sm:text-4xl
                    font-extrabold
                    text-[#0B4EA2]
                  "
                >
                  25+
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    sm:text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  Services
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <div
            className="
              w-full
              flex
              justify-center
              lg:justify-end
            "
          >
            <div
              className="
                w-full
                max-w-[660px]
                grid
                grid-cols-2
                sm:grid-cols-3
                gap-4
                sm:gap-5
                lg:gap-6
                pt-2
              "
            >
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

/* ============================================================
   FEATURE CARD COMPONENT
============================================================ */

const FeatureCard = ({ item }) => {
  const Icon = item.icon;

  const isBlue = item.color === "blue";

  return (
    <div className="group relative">
      {/* CARD */}

      <div
        className="
          relative
          h-full
          flex
          flex-col
          items-center
          text-center
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-[0_10px_30px_rgba(11,78,162,0.08)]
          px-3
          py-6
          sm:px-5
          sm:py-7
          transition-all
          duration-300
          group-hover:-translate-y-1
          group-hover:shadow-[0_16px_36px_rgba(11,78,162,0.14)]
        "
      >
        {/* ICON */}

        <div
          className={`
            w-12
            h-12
            sm:w-14
            sm:h-14
            rounded-full
            flex
            items-center
            justify-center
            mb-3
            sm:mb-4
            animate-float-medium
            transition-transform
            duration-300
            group-hover:scale-110
            group-hover:rotate-6
            ${isBlue ? "bg-blue-100" : "bg-green-100"}
          `}
          style={{ animationDelay: item.delay }}
        >
          <Icon
            size={24}
            strokeWidth={2}
            className={isBlue ? "text-[#0B4EA2]" : "text-[#0A8F55]"}
          />
        </div>

        {/* TITLE */}

        <h3
          className="
            text-[11px]
            sm:text-xs
            lg:text-sm
            font-extrabold
            text-gray-900
            uppercase
            leading-snug
            tracking-wide
          "
        >
          {item.title}
        </h3>

        {/* ACCENT UNDERLINE */}

        <div
          className={`
            mt-3
            sm:mt-4
            h-1
            w-8
            rounded-full
            ${isBlue ? "bg-[#0B4EA2]" : "bg-[#0A8F55]"}
          `}
        />
      </div>
    </div>
  );
};

export default WhyChoose;