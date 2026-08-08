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
  },
];

const WhyChoose = () => {
  return (
    <section className="w-full bg-blue-50 py-5 sm:py-10 lg:py-16 overflow-hidden">
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          lg:px-16
          xl:px-24
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
              text-center
              lg:text-left
              max-w-xl
              mx-auto
              lg:mx-0
            "
          >
            {/* Badge */}

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

            {/* =================================================
                MAIN HEADING
            ================================================== */}
{/* Heading */}

<h2
  className="
    text-3xl
    sm:text-4xl
    lg:text-5xl
    font-bold
    leading-tight
    text-black
  "
>
  Your Trusted
  <br className="hidden sm:block" />

  <span
    className="
      bg-gradient-to-r
      from-blue-600
      to-green-500
      bg-clip-text
      text-transparent
    "
  >
    Partner
  </span>
</h2>

{/* Description */}

<p
  className="
    mt-3
    sm:mt-4
    text-sm
    sm:text-base
    text-gray-700
    leading-6
    sm:leading-7
    max-w-4xl
  "
>
  MegaClick brings together trusted professionals, complete business
  solutions and reliable support to simplify every step of your business
  journey.
</p>
            {/* =================================================
                STATS
            ================================================== */}

            <div
              className="
                mt-8
                sm:mt-10
                flex
                justify-center
                lg:justify-start
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

              <div className="hidden sm:block">
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
              "
            >
              {/* =================================================
                  DESKTOP / TABLET
              ================================================== */}

              <div
                className="
                  hidden
                  sm:flex
                  flex-col
                  items-center
                  w-full
                "
              >
                {/* ================= TOP ROW ================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    md:gap-4
                    lg:gap-5
                    xl:gap-6
                  "
                >
                  <Hexagon item={hexagonItems[0]} />

                  <Hexagon item={hexagonItems[1]} />

                  <Hexagon item={hexagonItems[2]} />
                </div>

                {/* ================= BOTTOM ROW ================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    md:gap-4
                    lg:gap-5
                    xl:gap-6
                    mt-4
                    md:mt-5
                    lg:mt-6
                  "
                >
                  <Hexagon item={hexagonItems[3]} />

                  <Hexagon item={hexagonItems[4]} />

                  <Hexagon item={hexagonItems[5]} />
                </div>
              </div>

              {/* =================================================
                  MOBILE
              ================================================== */}

              <div
                className="
                  sm:hidden
                  w-full
                  flex
                  flex-col
                  items-center
                  gap-4
                "
              >
                {/* ROW 1 */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-4
                    w-full
                  "
                >
                  <Hexagon
                    item={hexagonItems[0]}
                    mobile
                  />

                  <Hexagon
                    item={hexagonItems[1]}
                    mobile
                  />
                </div>

                {/* ROW 2 */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-4
                    w-full
                  "
                >
                  <Hexagon
                    item={hexagonItems[2]}
                    mobile
                  />

                  <Hexagon
                    item={hexagonItems[3]}
                    mobile
                  />
                </div>

                {/* ROW 3 */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-4
                    w-full
                  "
                >
                  <Hexagon
                    item={hexagonItems[4]}
                    mobile
                  />

                  <Hexagon
                    item={hexagonItems[5]}
                    mobile
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   HEXAGON COMPONENT
============================================================ */

const Hexagon = ({ item, mobile = false }) => {
  const Icon = item.icon;

  const isBlue = item.color === "blue";

  return (
    <div
      className={`
        relative
        flex
        flex-col
        items-center
        justify-center
        text-center
        text-white
        overflow-hidden
        select-none
        transition-all
        duration-300
        hover:scale-[1.03]

        ${
          mobile
            ? `
              w-[125px]
              h-[143px]
            `
            : `
              w-[150px]
              h-[172px]
              md:w-[160px]
              md:h-[183px]
              lg:w-[170px]
              lg:h-[195px]
              xl:w-[180px]
              xl:h-[205px]
            `
        }

        ${
          isBlue
            ? `
              bg-[#145A92]
              hover:bg-[#0B4EA2]
            `
            : `
              bg-gradient-to-b
              from-[#B8ED72]
              to-[#63B900]
              hover:from-[#C3F47D]
              hover:to-[#58A900]
            `
        }
      `}
      style={{
        clipPath:
          "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
      }}
    >
      {/* =================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-center
          px-3
        "
      >
        {/* ICON */}

        <div
          className={`
            flex
            items-center
            justify-center
            mb-2

            ${
              mobile
                ? "w-9 h-9"
                : "w-11 h-11 md:w-12 md:h-12"
            }
          `}
        >
          <Icon
            className="text-white"
            strokeWidth={2.2}
            size={mobile ? 36 : 48}
          />
        </div>

        {/* TITLE */}

        <h3
          className={`
            font-extrabold
            text-white
            leading-[1.15]
            tracking-wide

            ${
              mobile
                ? "text-[10px]"
                : "text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px]"
            }
          `}
        >
          {item.title}
        </h3>
      </div>
    </div>
  );
};

export default WhyChoose;