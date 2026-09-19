import { FaWhatsapp } from "react-icons/fa";
import { WA_WEB_URL, openWhatsApp } from "../lib/whatsapp";

/* ─────────────────────────────────────────────────────────────
   FLOATING WHATSAPP BUTTON
   Redirect logic (app on phone, WhatsApp Web on desktop, pre-filled
   message) lives in ../lib/whatsapp so every WhatsApp link behaves the same.
──────────────────────────────────────────────────────────── */
const WhatsAppButton = () => {
  return (
    <a
      href={WA_WEB_URL}   /* meaningful href for SEO / right-click */
      onClick={openWhatsApp}
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
