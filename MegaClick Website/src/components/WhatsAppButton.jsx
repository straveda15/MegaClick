import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-12 z-50"
    >
      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center-safe justify-center shadow-xl hover:scale-110 transition">
        <FaWhatsapp className="text-white text-4xl" />
      </div>
    </a>
  );
};

export default WhatsAppButton;