/* ─────────────────────────────────────────────────────────────
   WHATSAPP CLICK-TO-CHAT — shared by every WhatsApp link on the site
   (floating button, footer icon, contact page).

   • Phone: full E.164 format, no '+', no spaces, no dashes
   • Works for both regular WhatsApp and WhatsApp Business numbers
   • Message: pre-filled to reduce visitor friction
──────────────────────────────────────────────────────────── */
export const WA_PHONE = "919921611911"; // India +91 99216 11911
export const WA_MESSAGE = "Hi, I'm interested in your services. Can you help me?";

/** Official click-to-chat link. Used as the plain `href` (SEO, right-click,
 *  open-in-new-tab) and as the fallback when the app cannot be opened. */
export const WA_WEB_URL = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
  WA_MESSAGE
)}`;

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
export const getWhatsAppUrl = () => {
  const encodedMsg = encodeURIComponent(WA_MESSAGE);
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

  return isMobile
    ? `whatsapp://send?phone=${WA_PHONE}&text=${encodedMsg}`
    : `https://wa.me/${WA_PHONE}?text=${encodedMsg}`;
};

/**
 * Click handler for any WhatsApp link:  <a href={WA_WEB_URL} onClick={openWhatsApp}>
 */
export const openWhatsApp = (e) => {
  e.preventDefault();

  const url = getWhatsAppUrl();
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
        window.open(WA_WEB_URL, "_blank", "noopener,noreferrer");
      }
    }, 1500);
  } else {
    // Desktop: open WhatsApp Web / Desktop app in a new tab.
    window.open(url, "_blank", "noopener,noreferrer");
  }
};
