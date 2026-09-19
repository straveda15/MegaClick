import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ClipboardCheck,
  FileText,
  Route,
  UserRound,
} from "lucide-react";

import serviceIntroPoints from "../../data/serviceIntroPoints";

/* ─────────────────────────────────────────────────────────────
   SERVICE INTRO  (top of every service page)

   LEFT   service name · Contact Us + "Trusted by …" · 5 short points
   RIGHT  4-card carousel: Overview · How it works · Checklist · Highlights

   Everything is built from the service's own data, so it works for every
   service. Each part can be overridden by adding a field to the service:

     points     [string]  the 5 points on the left
                          (default: data/serviceIntroPoints.js, else `benefits`)
     cards      [{ label, title, description?, image?, items? }]  the 4 cards
     trustedBy  number    the "Trusted by N+ users" count
──────────────────────────────────────────────────────────── */

const DEFAULT_TRUSTED_BY = 300;
const POINT_COUNT = 5;
const CARD_COUNT = 4;
const ROTATE_MS = 6000;
const DOC_LIMIT = 5;

const CARD_ICONS = [FileText, Route, ClipboardCheck, Award];

const cleanList = (list) =>
  Array.isArray(list)
    ? list.map((item) => String(item).trim()).filter(Boolean)
    : [];

/** The points shown on the left. */
const buildPoints = (service) => {
  const points =
    cleanList(service.points).length > 0
      ? cleanList(service.points)
      : cleanList(serviceIntroPoints[service.slug]).length > 0
        ? cleanList(serviceIntroPoints[service.slug])
        : cleanList(service.benefits);

  return points.slice(0, POINT_COUNT);
};

/** The carousel cards. `kind` decides how a card's items are drawn. */
const buildCards = (service) => {
  if (Array.isArray(service.cards) && service.cards.length) {
    return service.cards.slice(0, CARD_COUNT).map((card, index) => ({
      icon: CARD_ICONS[index % CARD_ICONS.length],
      kind: card.items?.some((item) => item.title) ? "highlights" : "list",
      ...card,
    }));
  }

  const steps = (service.process || []).map((step) => ({
    title: step.title,
    text: step.description,
  }));
  const documents = cleanList(service.documents)
    .slice(0, DOC_LIMIT)
    .map((text) => ({ text }));
  const highlights = (service.highlights || []).slice(0, 3).map((item) => ({
    title: item.title,
    text: item.description,
  }));

  return [
    {
      kind: "overview",
      icon: CARD_ICONS[0],
      label: "Overview",
      title: "Service Details",
      description: service.description,
      image: service.image,
    },
    steps.length > 0 && {
      kind: "steps",
      icon: CARD_ICONS[1],
      label: "How it works",
      title: `${steps.length} simple steps`,
      items: steps,
    },
    documents.length > 0 && {
      kind: "list",
      icon: CARD_ICONS[2],
      label: "Checklist",
      title: "What you'll need to share",
      items: documents,
    },
    highlights.length > 0 && {
      kind: "highlights",
      icon: CARD_ICONS[3],
      label: "Highlights",
      title: "What you get",
      items: highlights,
    },
  ]
    .filter(Boolean)
    .slice(0, CARD_COUNT);
};

/* ─────────────────────────────────────────────────────────────
   CARD BODY
──────────────────────────────────────────────────────────── */
const CardBody = ({ card }) => {
  const { kind, items = [] } = card;

  if (kind === "steps") {
    // With 4+ steps the descriptions would make the card taller than the
    // content next to it, so only the titles are shown (full steps are below).
    const showText = items.length <= 3;

    return (
      <ol className="mt-5 space-y-4">
        {items.map((item, index) => (
          <li key={item.title} className="relative pl-11">
            <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#0B4EA2] text-sm font-semibold text-white">
              {index + 1}
            </span>
            {index < items.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-4 top-9 -bottom-4 w-px -translate-x-1/2 bg-blue-200"
              />
            )}
            <p className="service-intro-card-item text-[15px] sm:text-base font-semibold leading-snug text-slate-900">
              {item.title}
            </p>
            {showText && item.text && (
              <p className="service-intro-card-sub mt-0.5 text-[13px] sm:text-sm leading-snug text-slate-500">
                {item.text}
              </p>
            )}
          </li>
        ))}
      </ol>
    );
  }

  if (kind === "highlights") {
    return (
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.title} className="border-l-[3px] border-[#0B4EA2]/25 pl-4">
            <p className="service-intro-card-item text-[15px] sm:text-base font-semibold leading-snug text-slate-900">
              {item.title}
            </p>
            {item.text && (
              <p className="service-intro-card-sub mt-0.5 text-[13px] sm:text-sm leading-snug text-slate-500">
                {item.text}
              </p>
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (kind === "list") {
    return (
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.text} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#0B4EA2]"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="service-intro-card-item text-[15px] sm:text-base leading-snug text-slate-700">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return null;
};

/* ─────────────────────────────────────────────────────────────
   CAROUSEL
──────────────────────────────────────────────────────────── */
const ServiceCardCarousel = ({ cards }) => {
  const [active, setActive] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (cards.length < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const timer = setInterval(() => {
      if (!pausedRef.current) {
        setActive((prev) => (prev + 1) % cards.length);
      }
    }, ROTATE_MS);

    return () => clearInterval(timer);
  }, [cards.length, restartKey]);

  const select = (index) => {
    setActive(index);
    setRestartKey((key) => key + 1); // restart the auto-rotate timer
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="About this service"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
      className="relative h-full w-full"
    >
      {/* All cards share one grid cell, so the stage is as tall as the tallest card */}
      <div className="grid h-full">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isActive = index === active;

          return (
            <div
              key={`${card.label}-${index}`}
              aria-hidden={!isActive}
              className={`
                service-intro-card
                col-start-1 row-start-1
                flex flex-col
                min-h-[320px] sm:min-h-[340px] lg:min-h-0 lg:h-full
                rounded-3xl
                border border-blue-100
                bg-gradient-to-b from-blue-50/80 to-white
                p-5 sm:p-6
                text-left
                shadow-[0_2px_12px_-2px_rgba(11,78,162,0.08)]
                transition-opacity duration-700 ease-in-out
                ${
                  isActive
                    ? "opacity-100 z-10 pointer-events-auto"
                    : "opacity-0 z-0 pointer-events-none"
                }
              `}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="service-intro-card-chip flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#0B4EA2]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="service-intro-card-label text-xs font-semibold uppercase tracking-[0.18em] text-[#0B4EA2]"
                  >
                    {card.label}
                  </span>
                </div>

                <span className="service-intro-card-label text-xs font-medium tabular-nums text-slate-400">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(cards.length).padStart(2, "0")}
                </span>
              </div>

              {/* TITLE */}
              <h3
                style={{ fontFamily: "'Poppins', sans-serif" }}
                className="service-intro-card-title mt-4 text-lg sm:text-xl lg:text-[1.4rem] font-bold leading-snug text-slate-900"
              >
                {card.title}
              </h3>

              {card.description && (
                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="service-intro-card-desc mt-2 text-[15px] sm:text-base leading-relaxed text-slate-600"
                >
                  {card.description}
                </p>
              )}

              <CardBody card={card} />

              {card.image && (
                <div className="relative flex min-h-[84px] flex-1 items-center justify-center pt-3">
                  <span
                    aria-hidden="true"
                    className="absolute h-32 w-32 rounded-full bg-blue-100/70 blur-2xl"
                  />
                  <img
                    src={card.image}
                    alt=""
                    loading="lazy"
                    className="service-intro-card-media relative h-full max-h-32 w-auto max-w-[75%] object-contain mix-blend-multiply"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* INDICATORS */}
      {cards.length > 1 && (
        <div
          role="tablist"
          aria-label="Choose a card"
          className="mt-4 flex items-center justify-center gap-2 lg:absolute lg:left-0 lg:right-0 lg:top-full lg:mt-3"
        >
          {cards.map((card, index) => (
            <button
              key={`${card.label}-dot-${index}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show ${card.label}`}
              onClick={() => select(index)}
              className={`
                h-2 rounded-full cursor-pointer transition-all duration-300
                ${
                  index === active
                    ? "w-6 bg-[#0B4EA2]"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION
──────────────────────────────────────────────────────────── */
const ServiceIntro = ({ service }) => {
  const navigate = useNavigate();

  if (!service) return null;

  const cards = buildCards(service);
  const points = buildPoints(service);
  const trustedBy = service.trustedBy || DEFAULT_TRUSTED_BY;

  return (
    <section className="w-full bg-white pt-3 pb-10 sm:pb-12 lg:pb-14 font-['Inter',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .service-intro-container {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .service-intro-check {
          width: 1.35rem;
          height: 1.35rem;
        }

        @media (min-width: 640px) {
          .service-intro-container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (min-width: 1440px) {
          .service-intro-container {
            padding-left: 2.5rem;
            padding-right: 2.5rem;
          }
          .service-intro-title {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }
          .service-intro-text {
            font-size: 1.05rem !important;
          }
        }

        @media (min-width: 1920px) {
          .service-intro-container {
            max-width: 1800px;
            padding-left: 4rem;
            padding-right: 4rem;
          }
          .service-intro-title {
            font-size: 3.25rem !important;
            line-height: 1.18 !important;
          }
          .service-intro-text {
            font-size: 1.2rem !important;
          }
          .service-intro-check {
            width: 1.6rem;
            height: 1.6rem;
          }
          .service-intro-card { padding: 2rem !important; }
          .service-intro-card-title { font-size: 1.7rem !important; }
          .service-intro-card-desc { font-size: 1.1rem !important; }
          .service-intro-card-item { font-size: 1.1rem !important; }
          .service-intro-card-sub { font-size: 1rem !important; }
          .service-intro-card-label { font-size: 0.85rem !important; }
          .service-intro-card-media { max-height: 9rem !important; }
        }

        @media (min-width: 3840px) {
          .service-intro-container {
            max-width: 3200px;
            padding-left: 6rem;
            padding-right: 6rem;
          }
          .service-intro-title {
            font-size: 5rem !important;
            line-height: 1.15 !important;
          }
          .service-intro-text {
            font-size: 1.9rem !important;
          }
          .service-intro-check {
            width: 2.6rem;
            height: 2.6rem;
          }
          .service-intro-card { padding: 4rem !important; border-radius: 3rem !important; }
          .service-intro-card-title { font-size: 3.4rem !important; }
          .service-intro-card-desc { font-size: 1.9rem !important; }
          .service-intro-card-item { font-size: 1.9rem !important; }
          .service-intro-card-sub { font-size: 1.6rem !important; }
          .service-intro-card-label { font-size: 1.4rem !important; }
          .service-intro-card-chip { width: 4.5rem !important; height: 4.5rem !important; }
          .service-intro-card-media { max-height: 18rem !important; }
        }
      `}</style>

      <div className="service-intro-container">
        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="
            group
            inline-flex items-center justify-center
            -ml-1 mb-3 p-1
            text-slate-600
            hover:text-[#0B4EA2]
            transition-colors duration-200
            cursor-pointer
          "
        >
          <ArrowLeft
            size={24}
            strokeWidth={2.4}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-8 lg:gap-14 min-[1920px]:gap-20 items-start lg:items-stretch">
          {/* ───────────── LEFT ───────────── */}
          <div className="min-w-0 text-left lg:flex lg:flex-col">
            {/* SERVICE NAME */}
            <h1
              style={{ fontFamily: "'Poppins', serif" }}
              className="
                service-intro-title
                text-2xl sm:text-3xl lg:text-4xl
                font-bold
                leading-[1.2]
                text-black
              "
            >
              {service.title || "Service Details"}
            </h1>

            {/* CONTACT US  +  TRUST */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="button"
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo(0, 0);
                }}
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  bg-[#0B4EA2]
                  px-6 py-3
                  text-sm sm:text-base font-semibold
                  text-white
                  shadow-md
                  transition-all duration-300
                  hover:bg-[#093e82] hover:shadow-lg
                  cursor-pointer
                "
              >
                Contact Us
                <ArrowRight size={18} strokeWidth={2.2} />
              </button>

              <div className="flex items-center gap-3">
                <span className="flex -space-x-2" aria-hidden="true">
                  {[
                    "bg-blue-100 text-[#0B4EA2]",
                    "bg-emerald-100 text-emerald-700",
                    "bg-sky-200 text-[#083A7A]",
                  ].map((tone) => (
                    <span
                      key={tone}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white ${tone}`}
                    >
                      <UserRound size={15} strokeWidth={2} />
                    </span>
                  ))}
                </span>

                <span
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="text-sm sm:text-base text-slate-600"
                >
                  Trusted by{" "}
                  <strong className="font-semibold text-slate-900">
                    {trustedBy}+
                  </strong>{" "}
                  users
                </span>
              </div>
            </div>

            {/* 5 SHORT POINTS */}
            {points.length > 0 && (
              <ul className="mt-7 sm:mt-8 flex flex-col gap-3.5 sm:gap-4 lg:flex-1 lg:justify-between">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-3 sm:gap-4">
                    <span
                      aria-hidden="true"
                      className="
                        service-intro-check
                        flex shrink-0 items-center justify-center
                        rounded-full bg-blue-100 text-[#0B4EA2]
                      "
                    >
                      <Check className="h-[60%] w-[60%]" strokeWidth={3} />
                    </span>

                    <span
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="
                        service-intro-text
                        min-w-0
                        text-[15px] sm:text-base
                        leading-snug
                        text-slate-700
                      "
                    >
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ───────────── RIGHT ───────────── */}
          <div className="min-w-0">
            <ServiceCardCarousel key={service.slug} cards={cards} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceIntro;
