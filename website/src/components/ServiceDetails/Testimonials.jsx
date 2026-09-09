import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SERVICE_TESTIMONIALS_CATALOG } from "../../data/serviceTestimonialsData";

/* =========================================================
   HELPERS
========================================================= */

const extractServices = (item) => {
  if (Array.isArray(item?.services) && item.services.length > 0) {
    return item.services;
  }

  if (item?.service) {
    return item.service
      .split(/[,•|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeText = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isMatchingService = (testimonial, serviceObj, slug) => {
  if (!serviceObj && !slug) return false;

  const itemSvc = extractServices(testimonial);

  const allSvc = [
    ...itemSvc,
    ...(testimonial?.service ? [testimonial.service] : []),
  ];

  const targets = [
    serviceObj?.title,
    serviceObj?.name,
    serviceObj?.heroTitle,
    slug ? slug.replace(/-/g, " ") : "",
  ].filter(Boolean);

  const keywords = [
    "marriage",
    "trademark",
    "patent",
    "copyright",
    "gazette",
    "mortgage",
    "tenant",
    "licence",
    "license",
    "deed",
    "fssai",
    "passport",
    "liquor",
    "udyam",
    "msme",
    "gst",
    "itr",
    "audit",
    "dsc",
    "llp",
    "rera",
    "incorporation",
    "liaisoning",
    "tender",
    "light",
    "mutation",
  ];

  for (const rawSvc of allSvc) {
    const ns = normalizeText(rawSvc);

    if (!ns) continue;

    for (const t of targets) {
      const nt = normalizeText(t);

      if (!nt) continue;

      if (ns === nt) return true;

      if (nt.includes(ns) || ns.includes(nt)) {
        return true;
      }

      const tw = nt
        .split(" ")
        .filter((w) => w.length > 3);

      const sw = ns
        .split(" ")
        .filter((w) => w.length > 3);

      const shared = tw.filter((w) => sw.includes(w));

      if (
        shared.length >= 2 ||
        (shared.length === 1 && tw.length === 1)
      ) {
        return true;
      }

      if (shared.some((w) => keywords.includes(w))) {
        return true;
      }
    }
  }

  return false;
};

const getSpecificDummy = (serviceObj, slug) => {
  const key = slug || serviceObj?.slug;

  if (
    key &&
    SERVICE_TESTIMONIALS_CATALOG[key]
  ) {
    return SERVICE_TESTIMONIALS_CATALOG[key];
  }

  for (const [, list] of Object.entries(
    SERVICE_TESTIMONIALS_CATALOG
  )) {
    if (
      list.length > 0 &&
      isMatchingService(list[0], serviceObj, slug)
    ) {
      return list;
    }
  }

  return [];
};

/* =========================================================
   TESTIMONIAL CARD
========================================================= */

const TestimonialCard = ({ testimonial }) => {
  const serviceList = extractServices(testimonial);

  return (
    <article
      className="
        testimonial-card
        flex
        flex-col
        justify-between
        rounded-3xl
        border
        border-slate-200/90
        bg-white
        p-5
        sm:p-6
        lg:p-6
        w-full
        h-full
        shadow-sm
        hover:shadow-md
        hover:border-blue-200
        transition-all
        duration-300
      "
    >
      {/* =====================================================
          REVIEW CONTENT
      ===================================================== */}

      <div className="flex-1 min-h-0">
        {/* Rating + Quote */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-3
            min-[1440px]:mb-4
            min-[1920px]:mb-5
            min-[3840px]:mb-7
          "
        >
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({
              length: testimonial.rating || 5,
            }).map((_, i) => (
              <Star
                key={i}
                className="
                  fill-emerald-500
                  text-emerald-500
                  w-[13px]
                  h-[13px]
                  sm:w-[14px]
                  sm:h-[14px]
                  min-[1440px]:w-[15px]
                  min-[1440px]:h-[15px]
                  min-[1920px]:w-[17px]
                  min-[1920px]:h-[17px]
                  min-[3840px]:w-[23px]
                  min-[3840px]:h-[23px]
                "
              />
            ))}
          </div>

          {/* Quote Icon */}
          <Quote
            className="
              text-slate-300
              flex-shrink-0
              w-4
              h-4
              min-[1440px]:w-[18px]
              min-[1440px]:h-[18px]
              min-[1920px]:w-5
              min-[1920px]:h-5
              min-[3840px]:w-7
              min-[3840px]:h-7
            "
          />
        </div>

        {/* Review */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
          className="
            testimonial-review
            text-[12.5px]
            sm:text-[13px]
            lg:text-[13.5px]
            text-slate-600
            leading-relaxed
            text-left
            line-clamp-4

            min-[1440px]:text-[14px]
            min-[1440px]:leading-[1.65]

            min-[1920px]:text-[15.5px]
            min-[1920px]:leading-[1.7]

            min-[3840px]:text-[22px]
            min-[3840px]:leading-[1.8]
          "
        >
          &ldquo;{testimonial.review}&rdquo;
        </p>
      </div>

      {/* =====================================================
          CLIENT DETAILS
      ===================================================== */}

      <div
        className="
          mt-auto
          pt-3
          sm:pt-4
          min-[1440px]:pt-5
          min-[1920px]:pt-6
          min-[3840px]:pt-8
        "
      >
        {/* Divider */}
        <div
          className="
            mb-3
            min-[1440px]:mb-4
            min-[1920px]:mb-5
            min-[3840px]:mb-6
            h-px
            bg-slate-100
          "
        />

        <div className="flex flex-col text-left">
          {/* Name */}
          <h3
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
            className="
              text-xs
              sm:text-sm
              font-bold
              text-black
              leading-snug
              truncate

              min-[1440px]:text-[14px]
              min-[1920px]:text-[16px]
              min-[3840px]:text-[23px]
            "
          >
            {testimonial.name}
          </h3>

          {/* Services */}
          <div
            className="
              flex
              flex-col
              gap-0.5
              mt-0.5
              min-[1440px]:gap-1
              min-[1920px]:mt-1
              min-[3840px]:gap-2
            "
          >
            {serviceList.map((svc, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
                className="
                  text-[11px]
                  sm:text-[12px]
                  font-semibold
                  text-[#0B4EA2]
                  leading-tight
                  truncate

                  min-[1440px]:text-[13px]
                  min-[1920px]:text-[14px]
                  min-[3840px]:text-[20px]
                "
              >
                {svc}
              </span>
            ))}
          </div>

          {/* Location */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
            className="
              text-[11px]
              sm:text-[12px]
              font-medium
              text-black/70
              mt-1
              truncate

              min-[1440px]:text-[13px]
              min-[1920px]:text-[14px]
              min-[3840px]:text-[19px]
            "
          >
            {testimonial.location}
          </p>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   MAIN TESTIMONIALS COMPONENT
========================================================= */

const Testimonials = ({ service: propService }) => {
  const { slug } = useParams();

  const [allTestimonials, setAllTestimonials] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [visibleCards, setVisibleCards] =
    useState(3);

  /* =======================================================
     FETCH TESTIMONIALS
  ======================================================= */

  useEffect(() => {
    const fetchT = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/v1/website-control/testimonials`
          : "http://localhost:5000/api/v1/website-control/testimonials";

        let res;

        try {
          res = await fetch(apiUrl);
        } catch {
          res = await fetch(
            "/api/v1/website-control/testimonials"
          );
        }

        const data = await res.json();

        if (
          data.success &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setAllTestimonials(
            Array.from(
              new Map(
                data.data.map((d) => [
                  d._id || d.name,
                  d,
                ])
              ).values()
            )
          );
        }
      } catch (e) {
        console.error(
          "Testimonials fetch failed:",
          e
        );
      }
    };

    fetchT();
  }, []);

  /* =======================================================
     ACTIVE TESTIMONIALS
  ======================================================= */

  const activeTestimonials = useMemo(() => {
    const matched = allTestimonials.filter((t) =>
      isMatchingService(
        t,
        propService,
        slug
      )
    );

    const dummy = getSpecificDummy(
      propService,
      slug
    );

    if (matched.length > 0) {
      const combined = [...matched];

      for (const d of dummy) {
        if (
          !combined.some(
            (c) =>
              c.name.toLowerCase() ===
              d.name.toLowerCase()
          )
        ) {
          combined.push(d);
        }
      }

      return combined;
    }

    return dummy.length > 0 ? dummy : [];
  }, [
    allTestimonials,
    propService,
    slug,
  ]);

  /* =======================================================
     RESET CAROUSEL
  ======================================================= */

  useEffect(() => {
    setCurrentIndex(0);
  }, [
    propService,
    slug,
    activeTestimonials.length,
  ]);

  /* =======================================================
     RESPONSIVE CARD COUNT
  ======================================================= */

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        setVisibleCards(3);
      } else if (width >= 640) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    update();

    window.addEventListener(
      "resize",
      update
    );

    return () =>
      window.removeEventListener(
        "resize",
        update
      );
  }, []);

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  const total = activeTestimonials.length;

  if (total === 0) {
    return null;
  }

  /* =======================================================
     CAROUSEL MATH
  ======================================================= */

  const visible = Math.min(
    visibleCards,
    total
  );

  const maxIndex = Math.max(
    0,
    total - visible
  );

  const cardPct = 100 / total;

  const trackPct =
    (total / visible) * 100;

  const shiftPct = cardPct;

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goPrev = () => {
    setCurrentIndex((p) =>
      Math.max(0, p - 1)
    );
  };

  const goNext = () => {
    setCurrentIndex((p) =>
      Math.min(maxIndex, p + 1)
    );
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <section
      className="
        testimonials-section
        w-full
        bg-white
        overflow-hidden

        py-8
        sm:py-12
        lg:py-16

        min-[1440px]:py-[4.5rem]
        min-[1920px]:py-20
        min-[3840px]:py-28
      "
    >
      {/* =====================================================
          FONTS
      ===================================================== */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        /* =====================================================
           STANDARD DESKTOP - 1440px
        ===================================================== */

        @media (min-width: 1440px) {
          .testimonials-container {
            max-width: 1400px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .testimonials-header {
            margin-bottom: 2.75rem !important;
          }

          .testimonials-label {
            font-size: 0.9rem !important;
            letter-spacing: 0.27em !important;
            margin-bottom: 0.8rem !important;
          }

          .testimonials-heading {
            font-size: 2.65rem !important;
            line-height: 1.2 !important;
          }

          .testimonials-intro {
            font-size: 1rem !important;
            line-height: 1.65 !important;
            max-width: 48rem !important;
          }

          .testimonials-carousel {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }

          .testimonial-item {
            padding-left: 0.7rem !important;
            padding-right: 0.7rem !important;
          }

          .testimonial-card-wrapper {
            min-height: 295px !important;
            height: 295px !important;
          }

          .testimonials-navigation {
            margin-top: 2rem !important;
            gap: 1rem !important;
          }

          .testimonial-nav-button {
            width: 46px !important;
            height: 46px !important;
          }
        }


        /* =====================================================
           LARGE DESKTOP - 1920px
        ===================================================== */

        @media (min-width: 1920px) {
          .testimonials-container {
            max-width: 1750px !important;
            padding-left: 3rem !important;
            padding-right: 3rem !important;
          }

          .testimonials-header {
            margin-bottom: 3.5rem !important;
          }

          .testimonials-label {
            font-size: 1rem !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 1rem !important;
          }

          .testimonials-heading {
            font-size: 3.35rem !important;
            line-height: 1.18 !important;
          }

          .testimonials-intro {
            font-size: 1.15rem !important;
            line-height: 1.75 !important;
            max-width: 58rem !important;
          }

          .testimonials-carousel {
            padding-top: 0.75rem !important;
            padding-bottom: 0.75rem !important;
          }

          .testimonial-item {
            padding-left: 0.9rem !important;
            padding-right: 0.9rem !important;
          }

          .testimonial-card-wrapper {
            min-height: 330px !important;
            height: 330px !important;
          }

          .testimonial-card {
            padding: 1.75rem !important;
            border-radius: 1.75rem !important;
          }

          .testimonials-navigation {
            margin-top: 2.5rem !important;
            gap: 1.25rem !important;
          }

          .testimonial-nav-button {
            width: 50px !important;
            height: 50px !important;
          }
        }


        /* =====================================================
           4K / ULTRA-WIDE - 3840px
        ===================================================== */

        @media (min-width: 3840px) {
          .testimonials-container {
            max-width: 3000px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .testimonials-header {
            margin-bottom: 5rem !important;
          }

          .testimonials-label {
            font-size: 1.5rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.5rem !important;
          }

          .testimonials-heading {
            font-size: 5rem !important;
            line-height: 1.15 !important;
          }

          .testimonials-intro {
            font-size: 1.75rem !important;
            line-height: 1.8 !important;
            max-width: 85rem !important;
          }

          .testimonials-carousel {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }

          .testimonial-item {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }

          .testimonial-card-wrapper {
            min-height: 460px !important;
            height: 460px !important;
          }

          .testimonial-card {
            padding: 2.75rem !important;
            border-radius: 2.25rem !important;
          }

          .testimonials-navigation {
            margin-top: 4rem !important;
            gap: 1.5rem !important;
          }

          .testimonial-nav-button {
            width: 64px !important;
            height: 64px !important;
            border-width: 2px !important;
          }

          .testimonial-nav-button svg {
            width: 28px !important;
            height: 28px !important;
          }
        }
      `}</style>

      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div
        className="
          testimonials-container
          w-full
          max-w-[1380px]
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          min-[1440px]:px-10
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            testimonials-header
            mb-8
            sm:mb-10
            lg:mb-12
            text-left
            w-full
          "
        >
          {/* Label */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
            className="
              testimonials-label
              text-xs
              sm:text-sm
              font-semibold
              tracking-[0.25em]
              uppercase
              text-[#0B4EA2]
              mb-2
            "
          >
            CLIENT OUTCOMES
          </p>

          {/* Heading */}
          <h2
            style={{
              fontFamily:
                "'Hedvig Letters Serif', serif",
            }}
            className="
              testimonials-heading
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-4xl
              font-bold
              leading-[1.18]
              text-black
              mb-2.5
              sm:mb-3
            "
          >
            What Our Clients{" "}
            <span className="text-[#0B4EA2]">
              Say About Our Services
            </span>
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
            className="
              testimonials-intro
              text-sm
              sm:text-base
              text-gray-500
              font-normal
              leading-relaxed
              max-w-xl
            "
          >
            Real feedback from businesses
            trusting MegaClick for their growth.
          </p>
        </div>

        {/* ===================================================
            CAROUSEL
        =================================================== */}

        <div
          className="
            testimonials-carousel
            relative
            overflow-hidden
            w-full
            py-2
          "
        >
          <div
            className="
              flex
              flex-nowrap
              transition-transform
              duration-500
              ease-in-out
            "
            style={{
              width: `${trackPct}%`,
              transform: `translateX(-${
                currentIndex * shiftPct
              }%)`,
            }}
          >
            {activeTestimonials.map((t, i) => (
              <div
                key={`${t._id || t.name}-${i}`}
                style={{
                  width: `${cardPct}%`,
                }}
                className="
                  testimonial-item
                  px-2.5
                  sm:px-3
                  shrink-0
                  box-border
                "
              >
                <div
                  className="
                    testimonial-card-wrapper
                    w-full
                    min-h-[240px]
                    sm:min-h-[260px]
                    lg:min-h-[275px]
                    flex
                  "
                >
                  <TestimonialCard
                    testimonial={t}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <div
          className="
            testimonials-navigation
            mt-7
            sm:mt-8
            flex
            justify-center
            items-center
            gap-3
            sm:gap-4
          "
        >
          {/* Previous */}
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous testimonial"
            className="
              testimonial-nav-button
              flex
              items-center
              justify-center
              w-10
              h-10
              sm:w-11
              sm:h-11
              rounded-full
              border-2
              border-[#0B4EA2]
              text-[#0B4EA2]
              bg-white
              hover:bg-[#0B4EA2]
              hover:text-white
              transition-all
              duration-200
              cursor-pointer
              shadow-sm
              disabled:opacity-30
              disabled:cursor-not-allowed
              disabled:hover:bg-white
              disabled:hover:text-[#0B4EA2]
            "
          >
            <ChevronLeft
              size={20}
            />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={goNext}
            disabled={
              currentIndex >= maxIndex
            }
            aria-label="Next testimonial"
            className="
              testimonial-nav-button
              flex
              items-center
              justify-center
              w-10
              h-10
              sm:w-11
              sm:h-11
              rounded-full
              border-2
              border-[#0B4EA2]
              text-[#0B4EA2]
              bg-white
              hover:bg-[#0B4EA2]
              hover:text-white
              transition-all
              duration-200
              cursor-pointer
              shadow-sm
              disabled:opacity-30
              disabled:cursor-not-allowed
              disabled:hover:bg-white
              disabled:hover:text-[#0B4EA2]
            "
          >
            <ChevronRight
              size={20}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;