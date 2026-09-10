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
   HELPER: EXTRACT SERVICES
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

/* =========================================================
   HELPER: NORMALIZE TEXT
========================================================= */

const normalizeText = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* =========================================================
   HELPER: CHECK SERVICE MATCH
========================================================= */

const isMatchingService = (testimonial, serviceObj, slug) => {
  if (!serviceObj && !slug) return false;

  const itemServices = extractServices(testimonial);

  const allTestimonialServices = [
    ...itemServices,
    ...(testimonial?.service ? [testimonial.service] : []),
  ];

  const candidateTargetStrings = [
    serviceObj?.title,
    serviceObj?.name,
    serviceObj?.heroTitle,
    slug ? slug.replace(/-/g, " ") : "",
  ].filter(Boolean);

  for (const rawTestimonialService of allTestimonialServices) {
    const normTestimonial = normalizeText(rawTestimonialService);

    if (!normTestimonial) continue;

    for (const target of candidateTargetStrings) {
      const normTarget = normalizeText(target);

      if (!normTarget) continue;

      /* 1. Exact match */
      if (normTestimonial === normTarget) {
        return true;
      }

      /* 2. Contains match */
      if (
        normTarget.includes(normTestimonial) ||
        normTestimonial.includes(normTarget)
      ) {
        return true;
      }

      /* 3. Meaningful word match */
      const targetWords = normTarget
        .split(" ")
        .filter((w) => w.length > 3);

      const testWords = normTestimonial
        .split(" ")
        .filter((w) => w.length > 3);

      const sharedWords = targetWords.filter((w) =>
        testWords.includes(w)
      );

      if (
        sharedWords.length >= 2 ||
        (sharedWords.length === 1 && targetWords.length === 1)
      ) {
        return true;
      }

      /* 4. Important service keywords */
      const specificKeywords = [
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

      if (
        sharedWords.some((word) =>
          specificKeywords.includes(word)
        )
      ) {
        return true;
      }
    }
  }

  return false;
};

/* =========================================================
   GET SERVICE-SPECIFIC DUMMY TESTIMONIALS
========================================================= */

const getSpecificDummyTestimonials = (serviceObj, slug) => {
  const targetKey = slug || serviceObj?.slug;

  if (
    targetKey &&
    SERVICE_TESTIMONIALS_CATALOG[targetKey]
  ) {
    return SERVICE_TESTIMONIALS_CATALOG[targetKey];
  }

  /* Look up by matching title if slug key isn't direct */
  for (const [key, list] of Object.entries(
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
        testimonials-card
        relative
        flex
        flex-col
        justify-between
        h-full
        rounded-3xl
        border
        border-slate-200/90
        bg-white
        p-5
        sm:p-6
        shadow-sm
        hover:shadow-md
        hover:border-blue-200
        transition-all
        duration-300
      "
    >
      {/* =====================================================
          TOP CONTENT
      ===================================================== */}

      <div>
        {/* STARS + QUOTE */}
        <div
          className="
            testimonials-stars-row
            flex
            items-center
            justify-between
            mb-3
            sm:mb-3.5
            min-[1440px]:mb-4
            min-[1920px]:mb-5
            min-[2560px]:mb-6
            min-[3840px]:mb-8
          "
        >
          {/* STARS */}
          <div
            className="
              testimonials-stars
              flex
              items-center
              gap-0.5
              min-[1440px]:gap-1
              min-[1920px]:gap-1.5
              min-[2560px]:gap-2
              min-[3840px]:gap-3
            "
          >
            {Array.from({
              length: testimonial.rating || 5,
            }).map((_, star) => (
              <Star
                key={star}
                className="
                  testimonials-star-icon
                  fill-emerald-500
                  text-emerald-500
                  w-[13px]
                  h-[13px]
                  sm:w-[15px]
                  sm:h-[15px]
                  min-[1440px]:w-[17px]
                  min-[1440px]:h-[17px]
                  min-[1920px]:w-[20px]
                  min-[1920px]:h-[20px]
                  min-[2560px]:w-[24px]
                  min-[2560px]:h-[24px]
                  min-[3840px]:w-[32px]
                  min-[3840px]:h-[32px]
                "
              />
            ))}
          </div>

          {/* QUOTE ICON */}
          <Quote
            className="
              testimonials-quote-icon
              text-slate-300
              w-[17px]
              h-[17px]
              sm:w-[18px]
              sm:h-[18px]
              min-[1440px]:w-[20px]
              min-[1440px]:h-[20px]
              min-[1920px]:w-[24px]
              min-[1920px]:h-[24px]
              min-[2560px]:w-[28px]
              min-[2560px]:h-[28px]
              min-[3840px]:w-[40px]
              min-[3840px]:h-[40px]
            "
          />
        </div>

        {/* =====================================================
            REVIEW TEXT

            IMPORTANT:
            Intentionally increased for large screens.
        ===================================================== */}

        <p
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="
            testimonials-review-text
            text-[13px]
            sm:text-[13.5px]
            md:text-[14px]
            lg:text-[15px]

            min-[1440px]:text-[16px]
            min-[1920px]:text-[20px]
            min-[2560px]:text-[24px]
            min-[3840px]:text-[32px]

            text-slate-600
            font-normal

            leading-[1.55]
            sm:leading-[1.6]
            min-[1440px]:leading-[1.65]
            min-[1920px]:leading-[1.7]
            min-[2560px]:leading-[1.8]
            min-[3840px]:leading-[1.9]

            text-left

            min-h-[76px]
            sm:min-h-[82px]
            md:min-h-[88px]
            lg:min-h-[92px]
            min-[1440px]:min-h-[100px]
            min-[1920px]:min-h-[125px]
            min-[2560px]:min-h-[155px]
            min-[3840px]:min-h-[240px]

            line-clamp-4
            overflow-hidden
          "
        >
          "{testimonial.review}"
        </p>
      </div>

      {/* =====================================================
          BOTTOM CLIENT DETAILS
      ===================================================== */}

      <div className="mt-auto">
        {/* DIVIDER */}
        <div
          className="
            testimonials-divider
            my-3
            sm:my-4
            min-[1440px]:my-5
            min-[1920px]:my-6
            min-[2560px]:my-7
            min-[3840px]:my-9
            h-px
            bg-slate-100
          "
        />

        <div className="flex flex-col text-left">
          {/* NAME */}
          <h3
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              testimonials-name
              text-[13px]
              sm:text-sm
              md:text-[15px]
              lg:text-[15px]

              min-[1440px]:text-[16px]
              min-[1920px]:text-[20px]
              min-[2560px]:text-[24px]
              min-[3840px]:text-[32px]

              font-bold
              text-black
              leading-snug
              truncate
            "
          >
            {testimonial.name}
          </h3>

          {/* SERVICES */}
          <div
            className="
              flex
              flex-col
              gap-0.5
              mt-0.5
              min-h-[18px]
              min-[1440px]:gap-1
              min-[1920px]:gap-1
              min-[2560px]:gap-1.5
              min-[3840px]:gap-2
            "
          >
            {serviceList.map((svc, sIdx) => (
              <span
                key={sIdx}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="
                  testimonials-service-tag
                  text-[11px]
                  sm:text-xs
                  md:text-[12px]
                  lg:text-[13px]

                  min-[1440px]:text-[14px]
                  min-[1920px]:text-[17px]
                  min-[2560px]:text-[21px]
                  min-[3840px]:text-[28px]

                  font-semibold
                  text-[#0B4EA2]
                  leading-tight
                  truncate
                "
              >
                {svc}
              </span>
            ))}
          </div>

          {/* LOCATION */}
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              testimonials-location
              text-[11px]
              sm:text-xs
              md:text-[12px]
              lg:text-[13px]

              min-[1440px]:text-[14px]
              min-[1920px]:text-[17px]
              min-[2560px]:text-[21px]
              min-[3840px]:text-[28px]

              font-medium
              text-black/90
              mt-1
              truncate
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

  const [allTestimonials, setAllTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /*
    Desktop = 3
    Tablet  = 2
    Mobile  = 1
  */
  const [visibleCards, setVisibleCards] = useState(3);

  /* =======================================================
      FETCH DYNAMIC TESTIMONIALS
  ======================================================= */

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/v1/website-control/testimonials`
          : "http://localhost:5000/api/v1/website-control/testimonials";

        let response;

        try {
          response = await fetch(apiUrl);
        } catch {
          response = await fetch(
            "/api/v1/website-control/testimonials"
          );
        }

        const resData = await response.json();

        if (
          resData.success &&
          Array.isArray(resData.data) &&
          resData.data.length > 0
        ) {
          const uniqueItems = Array.from(
            new Map(
              resData.data.map((item) => [
                item._id || item.name,
                item,
              ])
            ).values()
          );

          setAllTestimonials(uniqueItems);
        }
      } catch (error) {
        console.error(
          "Backend fetch failed, using fallback:",
          error
        );
      }
    };

    fetchTestimonials();
  }, []);

  /* =======================================================
      COMPUTE ACTIVE TESTIMONIALS
  ======================================================= */

  const activeTestimonials = useMemo(() => {
    /* Dynamic backend testimonials matching current service */
    const matchedBackend = allTestimonials.filter((item) =>
      isMatchingService(item, propService, slug)
    );

    /* Dedicated dummy testimonials */
    const specificDummy = getSpecificDummyTestimonials(
      propService,
      slug
    );

    /*
      If backend testimonials exist,
      prioritize them and append dummy testimonials.
    */
    if (matchedBackend.length > 0) {
      const combined = [...matchedBackend];

      for (const dummy of specificDummy) {
        if (
          !combined.some(
            (c) =>
              c.name?.toLowerCase() ===
              dummy.name?.toLowerCase()
          )
        ) {
          combined.push(dummy);
        }
      }

      return combined;
    }

    /*
      If no backend testimonials,
      use service-specific dummy testimonials.
    */
    if (specificDummy.length > 0) {
      return specificDummy;
    }

    return [];
  }, [allTestimonials, propService, slug]);

  /* =======================================================
      RESET CAROUSEL WHEN SERVICE CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentIndex(0);
  }, [propService, slug, activeTestimonials.length]);

  /* =======================================================
      RESPONSIVE VISIBLE CARDS
  ======================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =======================================================
      CAROUSEL CALCULATIONS

      IMPORTANT:
      Desktop:
        1 2 3
        ↓ >
        4 5 6
        ↓ >
        7 8 9

      NOT:
        1 2 3
        ↓ >
          2 3 4
        ↓ >
            3 4 5
  ======================================================= */

  const totalCards = activeTestimonials.length;

  /*
    Last valid group starts at a multiple of visibleCards.

    Example with 6 cards:
      maxIndex = 3

    Example with 9 cards:
      maxIndex = 6
  */
  const maxIndex =
    totalCards > visibleCards
      ? Math.floor((totalCards - 1) / visibleCards) * visibleCards
      : 0;

  /* =======================================================
      PREVIOUS
  ======================================================= */

  const goPrev = () => {
    setCurrentIndex((prev) =>
      Math.max(0, prev - visibleCards)
    );
  };

  /* =======================================================
      NEXT

      Moves by COMPLETE GROUP.
  ======================================================= */

  const goNext = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + visibleCards;

      if (nextIndex >= totalCards) {
        return Math.min(nextIndex, maxIndex);
      }

      return nextIndex;
    });
  };

  /* =======================================================
      CAROUSEL WIDTH

      Every card has equal width.
  ======================================================= */

  const trackWidthPercent =
    totalCards > 0
      ? (totalCards / visibleCards) * 100
      : 100;

  const singleCardShiftPercent =
    totalCards > 0
      ? 100 / totalCards
      : 0;

  /* =======================================================
      RENDER
  ======================================================= */

  return (
    <section
      className="
        w-full
        bg-white
        overflow-hidden
        py-8
        sm:py-12
        lg:py-16
        min-[1440px]:py-18
        min-[1920px]:py-20
        min-[2560px]:py-22
        min-[3840px]:py-28
      "
    >
      {/* =====================================================
          GOOGLE FONTS + RESPONSIVE OVERRIDES
          Approach mirrors the Services component:
          use a <style> block with !important media queries
          so all breakpoints are in one place and easy to tune.
      ===================================================== */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        /* ── 1440px ──────────────────────────────────────── */
        @media (min-width: 1440px) {
          .testimonials-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .testimonials-header {
            margin-bottom: 2.75rem !important;
          }

          .testimonials-card {
            padding: 1.5rem !important;
            border-radius: 1.5rem !important;
          }

          .testimonials-card-height {
            height: 320px !important;
          }

          .testimonials-star-icon {
            width: 17px !important;
            height: 17px !important;
          }

          .testimonials-quote-icon {
            width: 20px !important;
            height: 20px !important;
          }

          .testimonials-review-text {
            font-size: 16px !important;
            line-height: 1.65 !important;
            min-height: 100px !important;
          }

          .testimonials-name {
            font-size: 16px !important;
          }

          .testimonials-service-tag {
            font-size: 14px !important;
          }

          .testimonials-location {
            font-size: 14px !important;
          }

          .testimonials-nav-btn {
            width: 2.75rem !important;
            height: 2.75rem !important;
          }
          .testimonials-nav-btn svg {
            width: 22px !important;
            height: 22px !important;
          }
        }

        /* ── 1920px ──────────────────────────────────────── */
        @media (min-width: 1920px) {
          .testimonials-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .testimonials-header {
            margin-bottom: 3.5rem !important;
          }

          .testimonials-card {
            padding: 2rem !important;
            border-radius: 1.75rem !important;
          }

          .testimonials-card-height {
            height: 390px !important;
          }

          .testimonials-star-icon {
            width: 20px !important;
            height: 20px !important;
          }

          .testimonials-quote-icon {
            width: 24px !important;
            height: 24px !important;
          }

          .testimonials-review-text {
            font-size: 20px !important;
            line-height: 1.7 !important;
            min-height: 125px !important;
          }

          .testimonials-name {
            font-size: 20px !important;
          }

          .testimonials-service-tag {
            font-size: 17px !important;
          }

          .testimonials-location {
            font-size: 17px !important;
          }

          .testimonials-nav-btn {
            width: 3rem !important;
            height: 3rem !important;
          }
          .testimonials-nav-btn svg {
            width: 24px !important;
            height: 24px !important;
          }
        }

        /* ── 2560px ──────────────────────────────────────── */
        @media (min-width: 2560px) {
          .testimonials-container {
            max-width: 2300px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }

          .testimonials-header {
            margin-bottom: 4rem !important;
          }

          .testimonials-card {
            padding: 2.25rem !important;
            border-radius: 2rem !important;
          }

          .testimonials-card-height {
            height: 480px !important;
          }

          .testimonials-star-icon {
            width: 24px !important;
            height: 24px !important;
          }

          .testimonials-quote-icon {
            width: 30px !important;
            height: 30px !important;
          }

          .testimonials-review-text {
            font-size: 24px !important;
            line-height: 1.8 !important;
            min-height: 155px !important;
          }

          .testimonials-name {
            font-size: 24px !important;
          }

          .testimonials-service-tag {
            font-size: 21px !important;
          }

          .testimonials-location {
            font-size: 21px !important;
          }

          .testimonials-nav-btn {
            width: 3.5rem !important;
            height: 3.5rem !important;
          }
          .testimonials-nav-btn svg {
            width: 28px !important;
            height: 28px !important;
          }
        }

        /* ── 3840px ──────────────────────────────────────── */
        @media (min-width: 3840px) {
          .testimonials-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .testimonials-header {
            margin-bottom: 5rem !important;
          }

          .testimonials-tagline {
            font-size: 1.5rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.5rem !important;
          }

          .testimonials-title {
            font-size: 5rem !important;
            line-height: 1.15 !important;
          }

          .testimonials-desc {
            font-size: 1.75rem !important;
            line-height: 1.8 !important;
            margin-top: 1.5rem !important;
          }

          /* Card shell */
          .testimonials-card {
            padding: 3rem !important;
            border-radius: 2.5rem !important;
          }

          /* Card height — tall enough for 32px text × 4 lines */
          .testimonials-card-height {
            height: 640px !important;
          }

          /* Stars row */
          .testimonials-stars-row {
            margin-bottom: 2rem !important;
          }
          .testimonials-stars {
            gap: 0.75rem !important;
          }
          .testimonials-star-icon {
            width: 32px !important;
            height: 32px !important;
          }

          /* Quote icon */
          .testimonials-quote-icon {
            width: 44px !important;
            height: 44px !important;
          }

          /* Review text */
          .testimonials-review-text {
            font-size: 32px !important;
            line-height: 1.9 !important;
            min-height: 240px !important;
          }

          /* Divider */
          .testimonials-divider {
            margin-top: 2.25rem !important;
            margin-bottom: 2.25rem !important;
          }

          /* Name */
          .testimonials-name {
            font-size: 32px !important;
          }

          /* Service tag */
          .testimonials-service-tag {
            font-size: 28px !important;
          }

          /* Location */
          .testimonials-location {
            font-size: 28px !important;
            margin-top: 0.5rem !important;
          }

          /* Nav buttons */
          .testimonials-nav-btn {
            width: 4rem !important;
            height: 4rem !important;
          }
          .testimonials-nav-btn svg {
            width: 32px !important;
            height: 32px !important;
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
          mx-auto
          max-w-[1380px]
          px-4
          sm:px-6
          lg:px-8
          min-[1440px]:px-10
          min-[1920px]:px-16
          min-[2560px]:px-20
          min-[3840px]:px-24
        "
      >
        {/* ===================================================
            HEADING
        =================================================== */}

        <div
          className="
            testimonials-header
            mb-8
            sm:mb-10
            min-[1440px]:mb-11
            min-[1920px]:mb-14
            min-[2560px]:mb-16
            min-[3840px]:mb-20
            text-left
          "
        >
          {/* TAGLINE */}
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              testimonials-tagline
              text-xs
              sm:text-sm
              min-[1440px]:text-[14px]
              min-[1920px]:text-[16px]
              min-[2560px]:text-[19px]
              min-[3840px]:text-[24px]
              font-semibold
              tracking-[0.25em]
              min-[1920px]:tracking-[0.3em]
              min-[3840px]:tracking-[0.35em]
              uppercase
              text-[#0B4EA2]
              mb-2
              min-[1440px]:mb-3
              min-[1920px]:mb-4
              min-[2560px]:mb-5
              min-[3840px]:mb-6
              text-left
            "
          >
            CLIENT OUTCOMES
          </p>

          {/* TITLE */}
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              testimonials-title
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-4xl
              min-[1440px]:text-[40px]
              min-[1920px]:text-[52px]
              min-[2560px]:text-[62px]
              min-[3840px]:text-[80px]
              font-bold
              leading-[1.18]
              text-black
              text-left
              mb-2.5
              sm:mb-3
              min-[1440px]:mb-4
              min-[1920px]:mb-5
              min-[2560px]:mb-6
              min-[3840px]:mb-7
            "
          >
            What Our Clients{" "}
            <span className="text-[#0B4EA2]">
              Say About Our Services
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              testimonials-desc
              text-sm
              sm:text-base
              min-[1440px]:text-[16px]
              min-[1920px]:text-[18px]
              min-[2560px]:text-[21px]
              min-[3840px]:text-[26px]
              text-gray-500
              font-normal
              leading-relaxed
              min-[1440px]:leading-[1.65]
              min-[1920px]:leading-[1.8]
              min-[2560px]:leading-[1.8]
              min-[3840px]:leading-[1.8]
              max-w-xl
              min-[1920px]:max-w-3xl
              min-[3840px]:max-w-5xl
              text-left
            "
          >
            Real feedback from businesses trusting
            MegaClick for their growth.
          </p>
        </div>

        {/* ===================================================
            TESTIMONIAL CAROUSEL
        =================================================== */}

        <div
          className="
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
              width: `${trackWidthPercent}%`,
              transform: `translateX(-${
                currentIndex * singleCardShiftPercent
              }%)`,
            }}
          >
            {activeTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial._id || testimonial.name}-${index}`}
                style={{ width: `${100 / totalCards}%` }}
                className="
                  px-1.5
                  sm:px-2.5
                  lg:px-3
                  min-[1440px]:px-3.5
                  min-[1920px]:px-4
                  min-[2560px]:px-5
                  min-[3840px]:px-6
                  shrink-0
                "
              >
                {/* =================================================
                    CARD HEIGHT WRAPPER

                    Heights at each breakpoint:
                      mobile  → 270px
                      sm      → 280px
                      md      → 285px
                      lg      → 290px
                      1440px  → 320px
                      1920px  → 390px
                      2560px  → 480px
                      3840px  → 640px  ← taller for 32px text
                ================================================= */}
                <div
                  className="
                    testimonials-card-height
                    w-full
                    h-[270px]
                    sm:h-[280px]
                    md:h-[285px]
                    lg:h-[290px]
                    min-[1440px]:h-[320px]
                    min-[1920px]:h-[390px]
                    min-[2560px]:h-[480px]
                    min-[3840px]:h-[640px]
                  "
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================
            NAVIGATION BUTTONS
        =================================================== */}

        <div
          className="
            mt-6
            sm:mt-8
            min-[1440px]:mt-9
            min-[1920px]:mt-10
            min-[2560px]:mt-12
            min-[3840px]:mt-14
            flex
            justify-center
            items-center
            gap-3
            sm:gap-4
            min-[1920px]:gap-5
            min-[2560px]:gap-6
            min-[3840px]:gap-8
          "
        >
          {/* =================================================
              PREVIOUS BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous testimonial"
            className="
              testimonials-nav-btn
              flex
              items-center
              justify-center
              w-10
              h-10
              sm:w-11
              sm:h-11
              min-[1440px]:w-11
              min-[1440px]:h-11
              min-[1920px]:w-12
              min-[1920px]:h-12
              min-[2560px]:w-14
              min-[2560px]:h-14
              min-[3840px]:w-16
              min-[3840px]:h-16
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
              className="
                w-[19px]
                h-[19px]
                sm:w-[21px]
                sm:h-[21px]
                min-[1440px]:w-[22px]
                min-[1440px]:h-[22px]
                min-[1920px]:w-[24px]
                min-[1920px]:h-[24px]
                min-[2560px]:w-[28px]
                min-[2560px]:h-[28px]
                min-[3840px]:w-[32px]
                min-[3840px]:h-[32px]
              "
            />
          </button>

          {/* =================================================
              NEXT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={goNext}
            disabled={
              currentIndex >= maxIndex ||
              totalCards <= visibleCards
            }
            aria-label="Next testimonial"
            className="
              testimonials-nav-btn
              flex
              items-center
              justify-center
              w-10
              h-10
              sm:w-11
              sm:h-11
              min-[1440px]:w-11
              min-[1440px]:h-11
              min-[1920px]:w-12
              min-[1920px]:h-12
              min-[2560px]:w-14
              min-[2560px]:h-14
              min-[3840px]:w-16
              min-[3840px]:h-16
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
              className="
                w-[19px]
                h-[19px]
                sm:w-[21px]
                sm:h-[21px]
                min-[1440px]:w-[22px]
                min-[1440px]:h-[22px]
                min-[1920px]:w-[24px]
                min-[1920px]:h-[24px]
                min-[2560px]:w-[28px]
                min-[2560px]:h-[28px]
                min-[3840px]:w-[32px]
                min-[3840px]:h-[32px]
              "
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;