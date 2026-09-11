import React from "react";
import { FaWhatsapp } from "react-icons/fa";

/* ─────────────────────────────────────────────────────────────
   WHATSAPP CONFIG
   • Phone: full E.164 format, no '+', no spaces, no dashes
   • Works for both regular WhatsApp and WhatsApp Business numbers
   • Message: pre-filled to reduce visitor friction
──────────────────────────────────────────────────────────── */
const WA_PHONE   = "919921611911"; // India +91 99216 11911
const WA_MESSAGE = "Hi, I'm interested in your services. Can you help me?";

/**
 * Builds the best WhatsApp URL for the current environment:
 *
 * Mobile (Android / iOS):
 *   → whatsapp://send?phone=…&text=…
 *   Opens the installed app directly — no landing page.
 *   Works for both WhatsApp and WhatsApp Business.
 *
 * Desktop / fallback:
 *   → https://wa.me/…?text=…
 *   Opens WhatsApp Web or the desktop app if installed.
 *   Official WhatsApp click-to-chat format — same link works
 *   for regular and Business numbers.
 *
 * If WhatsApp is not installed on mobile, the OS fails to
 * open the whatsapp:// URI and the browser does nothing —
 * so we immediately open the wa.me web fallback as a backup.
 */
const getWhatsAppUrl = () => {
  const encodedMsg = encodeURIComponent(WA_MESSAGE);
  const isMobile   =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );

  return isMobile
    ? `whatsapp://send?phone=${WA_PHONE}&text=${encodedMsg}`
    : `https://wa.me/${WA_PHONE}?text=${encodedMsg}`;
};

const WA_WEB_FALLBACK = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_MESSAGE)}`;

const handleClick = (e) => {
  e.preventDefault();

  const url      = getWhatsAppUrl();
  const isMobile = url.startsWith("whatsapp://");

  if (isMobile) {
    // Try to open the native app. If the URI scheme fails (app not
    // installed), fall back to wa.me after a short timeout so the
    // visitor still lands somewhere useful.
    window.location.href = url;

    setTimeout(() => {
      // Only redirect if the page is still visible (i.e. the app
      // did NOT open and take the user away).
      if (!document.hidden) {
        window.open(WA_WEB_FALLBACK, "_blank", "noopener,noreferrer");
      }
    }, 1500);
  } else {
    // Desktop: open WhatsApp Web / Desktop app in a new tab.
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

/* ─────────────────────────────────────────────────────────────
   COMPONENT  — UI is untouched, only the link behaviour changed
──────────────────────────────────────────────────────────── */
const WhatsAppButton = () => {
  return (
    <a
      href={WA_WEB_FALLBACK}   /* meaningful href for SEO / right-click */
      onClick={handleClick}
      aria-label="Chat with us on WhatsApp"
      className="
        fixed
        bottom-4
        right-4
        sm:bottom-5
        sm:right-5
        lg:bottom-6
        lg:right-8
        z-50
        flex
        items-center
        justify-center
      "
    >
      <div
        className="
          w-10
          h-10
          sm:w-12
          sm:h-12
          rounded-full
          bg-green-500
          flex
          items-center
          justify-center
          shadow-xl
          hover:bg-green-600
          hover:scale-110
          active:scale-95
          transition-all
          duration-300
        "
      >
        <FaWhatsapp
          className="
            text-white
            text-[28px]
            sm:text-[32px]
          "
        />
      </div>
    </a>
  );
};

export default WhatsAppButton;