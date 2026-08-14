import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
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