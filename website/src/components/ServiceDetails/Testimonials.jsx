import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SERVICE_TESTIMONIALS_CATALOG } from "../../data/serviceTestimonialsData";

// Helper to normalize services list from item
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

// Clean string for accurate multi-service matching
const normalizeText = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Check if a testimonial matches the current service page
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

      // 1. Exact string match
      if (normTestimonial === normTarget) return true;

      // 2. Contains match (e.g. "Marriage Registration" in "Marriage Registration, Trademark")
      if (
        normTarget.includes(normTestimonial) ||
        normTestimonial.includes(normTarget)
      ) {
        return true;
      }

      // 3. Meaningful word match (handles slight naming variations)
      const targetWords = normTarget.split(" ").filter((w) => w.length > 3);
      const testWords = normTestimonial.split(" ").filter((w) => w.length > 3);
      const sharedWords = targetWords.filter((w) => testWords.includes(w));

      if (sharedWords.length >= 2 || (sharedWords.length === 1 && targetWords.length === 1)) {
        return true;
      }

      const specificKeywords = [
        "marriage", "trademark", "patent", "copyright", "gazette", "mortgage",
        "tenant", "licence", "license", "deed", "fssai", "passport", "liquor",
        "udyam", "msme", "gst", "itr", "audit", "dsc", "llp", "rera", "incorporation",
        "liaisoning", "tender", "light", "mutation"
      ];
      if (sharedWords.some((w) => specificKeywords.includes(w))) {
        return true;
      }
    }
  }

  return false;
};

// Retrieve specific dummy testimonials tailored to the current service
const getSpecificDummyTestimonials = (serviceObj, slug) => {
  const targetKey = slug || serviceObj?.slug;
  if (targetKey && SERVICE_TESTIMONIALS_CATALOG[targetKey]) {
    return SERVICE_TESTIMONIALS_CATALOG[targetKey];
  }

  // Look up by matching title if slug key wasn't direct
  for (const [key, list] of Object.entries(SERVICE_TESTIMONIALS_CATALOG)) {
    if (list.length > 0 && isMatchingService(list[0], serviceObj, slug)) {
      return list;
    }
  }

  return [];
};

/* =========================================
    EXACT SCREENSHOT CARD DESIGN WITH STABLE ALIGNMENT
========================================== */
const TestimonialCard = ({ testimonial }) => {
  const serviceList = extractServices(testimonial);

  return (
    <article
      className="
        relative flex flex-col justify-between
        rounded-3xl border border-slate-200/90
        bg-white
        p-6
        shadow-sm hover:shadow-md hover:border-blue-200
        h-full
        transition-all duration-300
      "
    >
      {/* TOP: STARS & QUOTE */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          {/* 5 Green Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: testimonial.rating || 5 }).map((_, star) => (
              <Star
                key={star}
                size={15}
                className="fill-emerald-500 text-emerald-500"
              />
            ))}
          </div>
          {/* Light Quote Icon */}
          <Quote size={18} className="text-slate-300" />
        </div>

        {/* REVIEW TEXT - Consistent height for multi-line reviews */}
        <p
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="
            text-xs sm:text-[13.5px]
            text-slate-600
            leading-relaxed
            text-left
            min-h-[76px]
            sm:min-h-[82px]
          "
        >
          "{testimonial.review}"
        </p>
      </div>

      {/* BOTTOM: DIVIDER & CLIENT DETAILS - Anchored to bottom for clean alignment */}
      <div className="mt-auto">
        <div className="my-3.5 sm:my-4 h-px bg-slate-100" />

        <div className="flex flex-col text-left">
          <h3
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="text-xs sm:text-sm font-bold text-black leading-snug truncate"
          >
            {testimonial.name}
          </h3>
          {/* Services: Blue, stacked vertically one by one (ek ke niche ek) */}
          <div className="flex flex-col gap-0.5 mt-0.5 min-h-[18px]">
            {serviceList.map((svc, sIdx) => (
              <span
                key={sIdx}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="text-[11px] sm:text-xs font-semibold text-[#0B4EA2] leading-tight truncate"
              >
                {svc}
              </span>
            ))}
          </div>
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="text-[11px] sm:text-xs font-medium text-black/90 mt-1 truncate"
          >
            {testimonial.location}
          </p>
        </div>
      </div>
    </article>
  );
};

const Testimonials = ({ service: propService }) => {
  const { slug } = useParams();
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // 🔄 Fetch dynamic testimonials from Backend API (with /v1)
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
          response = await fetch("/api/v1/website-control/testimonials");
        }

        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          const uniqueItems = Array.from(
            new Map(resData.data.map((item) => [item._id || item.name, item])).values()
          );
          setAllTestimonials(uniqueItems);
        }
      } catch (error) {
        console.error("Backend fetch failed, using fallback:", error);
      }
    };

    fetchTestimonials();
  }, []);

  // Compute matched testimonials strictly for this service
  const activeTestimonials = useMemo(() => {
    // 1. Dynamic approved testimonials from backend that match THIS specific service
    const matchedBackend = allTestimonials.filter((item) =>
      isMatchingService(item, propService, slug)
    );

    // 2. Dedicated dummy testimonials tailored specifically for this service (5-6 reviews)
    const specificDummy = getSpecificDummyTestimonials(propService, slug);

    // If dynamic backend testimonials exist for this service:
    if (matchedBackend.length > 0) {
      // Prioritize live approved testimonials from dashboard!
      // Append specificDummy reviews (preventing duplicates) so the carousel always has 5-6+ cards
      // and the < > navigation buttons are always enabled and functional!
      const combined = [...matchedBackend];
      for (const dummy of specificDummy) {
        if (!combined.some((c) => c.name.toLowerCase() === dummy.name.toLowerCase())) {
          combined.push(dummy);
        }
      }
      return combined;
    }

    // If no dynamic testimonials exist yet in backend for this service,
    // show ALL 5 to 6 dedicated, tailored dummy reviews for this service!
    if (specificDummy.length > 0) {
      return specificDummy;
    }

    return [];
  }, [allTestimonials, propService, slug]);

  // Reset index whenever the service or testimonials list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [propService, slug, activeTestimonials.length]);

  /* =========================================
      RESPONSIVE CARDS
      Desktop: 3
      Tablet: 2
      Mobile: 1
  ========================================== */
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

  const totalCards = activeTestimonials.length;
  const maxIndex = Math.max(0, totalCards - visibleCards);

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - visibleCards));
  };

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + visibleCards));
  };

  const trackWidthPercent = totalCards > 0 ? (totalCards / visibleCards) * 100 : 100;
  const singleCardShiftPercent = totalCards > 0 ? 100 / totalCards : 0;

  return (
    <section className="w-full bg-white overflow-hidden py-10 sm:py-14 lg:py-16">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        {/* =========================================
            HEADING (Left-aligned)
        ========================================== */}
        <div className="mb-8 sm:mb-10 text-left">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2 text-left"
          >
            CLIENT OUTCOMES
          </p>

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              text-2xl sm:text-3xl md:text-3xl lg:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
              mb-2.5 sm:mb-3
            "
          >
            What Our Clients{" "}
            <span className="text-[#0B4EA2]">Say About Our Services</span>
          </h2>

          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              text-sm sm:text-base
              text-gray-500
              font-normal
              leading-relaxed
              max-w-xl
              text-left
            "
          >
            Real feedback from businesses trusting MegaClick for their growth.
          </p>
        </div>

        {/* =========================================
            TESTIMONIAL CAROUSEL (Exact 1-Card Shift)
        ========================================== */}
        <div className="relative overflow-hidden w-full py-2">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${trackWidthPercent}%`,
              transform: `translateX(-${currentIndex * singleCardShiftPercent}%)`,
            }}
          >
            {activeTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial._id || testimonial.name}-${index}`}
                style={{
                  width: `${100 / totalCards}%`,
                }}
                className="px-2.5 shrink-0"
              >
                {/* UNIFORM CARD HEIGHT WITH GENEROUS SPACING FOR ALIGNMENT */}
                <div className="w-full h-[270px] sm:h-[280px]">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            NAVIGATION BUTTONS (< >)
        ========================================== */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous testimonial"
            className="
              flex items-center justify-center
              w-11 h-11
              rounded-full
              border-2 border-[#0B4EA2]
              text-[#0B4EA2] bg-white
              hover:bg-[#0B4EA2] hover:text-white
              transition-all duration-200
              cursor-pointer
              shadow-sm
              disabled:opacity-30 disabled:cursor-not-allowed
              disabled:hover:bg-white disabled:hover:text-[#0B4EA2]
            "
          >
            <ChevronLeft size={21} />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next testimonial"
            className="
              flex items-center justify-center
              w-11 h-11
              rounded-full
              border-2 border-[#0B4EA2]
              text-[#0B4EA2] bg-white
              hover:bg-[#0B4EA2] hover:text-white
              transition-all duration-200
              cursor-pointer
              shadow-sm
              disabled:opacity-30 disabled:cursor-not-allowed
              disabled:hover:bg-white disabled:hover:text-[#0B4EA2]
            "
          >
            <ChevronRight size={21} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;