import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const ContactInfo = () => {
  // =================================================
  // CONTACT DETAILS
  // =================================================
  const phoneNumber = "+919921611911";
  const emailAddress = "megaclickofficial@gmail.com";
  const subject = "Business Service Inquiry";
  const body =
    "Hello MegaClick,\n\nI would like to know more about your business services.";

  // =================================================
  // EMAIL HANDLER
  // =================================================
  const handleEmailClick = (e) => {
    e.preventDefault();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      const mailtoUrl =
        `mailto:${emailAddress}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    } else {
      const gmailComposeUrl =
        `https://mail.google.com/mail/?view=cm&fs=1` +
        `&to=${encodeURIComponent(emailAddress)}` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
      window.open(gmailComposeUrl, "_blank");
    }
  };

  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=4th+Floor+Tristar+Complex+Jehan+Circle+Gangapur+Road+Nashik+Maharashtra+422005";

  return (
    <section className="py-8 sm:py-12 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white overflow-hidden font-['Inter',sans-serif]">
      {/* UNIFIED CONTAINER */}
      <div className="w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">
        
        {/* =================================================
            HEADING
        ================================================= */}
        <div className="mb-8 sm:mb-10 min-[1920px]:mb-14 min-[3840px]:mb-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0B4EA2] px-4 sm:px-5 min-[3840px]:px-8 py-2 min-[3840px]:py-4 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold text-white">
            <MapPin size={15} className="text-green-300 min-[3840px]:w-6 min-[3840px]:h-6" />
            CONTACT INFORMATION
          </span>

          <h3 className="mt-3 text-3xl sm:text-4xl min-[1440px]:text-5xl min-[1920px]:text-6xl min-[3840px]:text-8xl font-bold leading-tight text-black">
            Get In <span className="text-[#0B4EA2]">Touch With Us</span>
          </h3>

          <p className="mt-4 sm:mt-5 min-[3840px]:mt-8 max-w-3xl min-[3840px]:max-w-6xl text-sm sm:text-base min-[1920px]:text-xl min-[3840px]:text-3xl leading-relaxed text-gray-600">
            Have questions or need assistance? Reach out to our experts. We're
            always ready to help you with legal, business, and financial
            solutions.
          </p>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 min-[1920px]:gap-10 min-[3840px]:gap-16 items-stretch">
          
          {/* =================================================
              MAP CARD
          ================================================= */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl sm:rounded-[28px] min-[3840px]:rounded-[44px] border border-gray-200 min-[3840px]:border-2 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
            <div className="absolute top-0 left-0 h-1.5 min-[3840px]:h-3 w-full bg-gradient-to-r from-[#0B4EA2] to-green-500" />

            {/* Header */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6 min-[1440px]:p-8 min-[1920px]:p-10 min-[3840px]:p-16">
              <div className="flex items-center gap-3 sm:gap-5 min-[3840px]:gap-8 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-24 min-[3840px]:h-24 flex-shrink-0 rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 min-[1920px]:w-8 min-[1920px]:h-8 min-[3840px]:w-12 min-[3840px]:h-12 text-[#0B4EA2]" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl min-[1440px]:text-2xl min-[1920px]:text-3xl min-[3840px]:text-5xl font-bold text-gray-900">
                    Visit Our Office
                  </h3>
                  <p className="text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-500 mt-1">
                    We'd love to meet you.
                  </p>
                </div>
              </div>

              <ArrowUpRight className="w-6 h-6 min-[1920px]:w-7 min-[1920px]:h-7 min-[3840px]:w-10 min-[3840px]:h-10 text-gray-300 flex-shrink-0" />
            </div>

            {/* Map Frame */}
            <div className="px-4 sm:px-6 min-[1440px]:px-8 min-[1920px]:px-10 min-[3840px]:px-16">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl border border-gray-200 min-[3840px]:border-2">
                <iframe
                  title="MegaClick Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.917570480964!2d73.7563732!3d20.011974!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb28d1dd624d%3A0xe806e01c2d79c79f!2sMegaClick%20Properties!5e0!3m2!1sen!2sin!4v1785864099343!5m2!1sen!2sin"
                  width="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-[220px] sm:h-[280px] min-[1440px]:h-[320px] min-[1920px]:h-[380px] min-[3840px]:h-[560px] border-0"
                />
              </div>
            </div>

            {/* Address */}
            <div className="p-5 sm:p-6 min-[1440px]:p-8 min-[1920px]:p-10 min-[3840px]:p-16">
              <h4 className="text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-4xl font-bold text-gray-900">
                MegaClick Office
              </h4>

              <p className="mt-3 sm:mt-4 min-[3840px]:mt-6 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl leading-relaxed text-gray-600">
                4th Floor, Tristar Complex,
                <br />
                Above Canara Bank, Beside Reliance Digital,
                <br />
                Jehan Circle, Gangapur Road,
                <br />
                Nashik - 422005
              </p>

              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 mt-4 sm:mt-6 min-[3840px]:mt-8 rounded-full bg-blue-100 px-4 sm:px-5 min-[3840px]:px-8 py-2 min-[3840px]:py-4 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold text-[#0B4EA2] hover:bg-[#0B4EA2] hover:text-white transition-all duration-300"
              >
                <MapPin className="w-4 h-4 min-[3840px]:w-6 min-[3840px]:h-6" />
                Mon - Sat • 9:00 AM - 7:00 PM
              </a>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE CARDS
          ================================================= */}
          <div className="flex flex-col justify-between gap-5 sm:gap-6 min-[1920px]:gap-8 min-[3840px]:gap-12 w-full">
            
            {/* WHATSAPP CARD */}
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-[28px] min-[3840px]:rounded-[44px] bg-white border border-gray-200 min-[3840px]:border-2 p-5 sm:p-6 min-[1920px]:p-8 min-[3840px]:p-12 shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full flex flex-col justify-between">
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-5 min-[3840px]:gap-8 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-24 min-[3840px]:h-24 flex-shrink-0 rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl bg-green-100 flex items-center justify-center group-hover:bg-[#25D366] transition-all duration-300">
                    <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 min-[1920px]:w-8 min-[1920px]:h-8 min-[3840px]:w-12 min-[3840px]:h-12 text-[#25D366] group-hover:text-white transition" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-4xl font-bold text-gray-900">
                      WhatsApp Us
                    </h3>
                    <p className="mt-1 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-600">
                      +91 99216 11911
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-6 h-6 min-[3840px]:w-10 min-[3840px]:h-10 flex-shrink-0 text-gray-300 group-hover:text-[#25D366] group-hover:rotate-45 transition" />
              </div>

              <a
                href={`https://wa.me/919921611911`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 sm:mt-6 min-[3840px]:mt-10 w-full py-3 sm:py-3.5 min-[1920px]:py-4 min-[3840px]:py-6 rounded-xl min-[3840px]:rounded-2xl bg-[#25D366] text-white text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1ebd5b] transition"
              >
                <FaWhatsapp className="w-5 h-5 min-[3840px]:w-8 min-[3840px]:h-8" />
                WhatsApp Now
              </a>
            </div>

            {/* CALL CARD */}
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-[28px] min-[3840px]:rounded-[44px] bg-white border border-gray-200 min-[3840px]:border-2 p-5 sm:p-6 min-[1920px]:p-8 min-[3840px]:p-12 shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full flex flex-col justify-between">
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-5 min-[3840px]:gap-8 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-24 min-[3840px]:h-24 flex-shrink-0 rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-all duration-300">
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 min-[1920px]:w-8 min-[1920px]:h-8 min-[3840px]:w-12 min-[3840px]:h-12 text-green-600 group-hover:text-white transition" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-4xl font-bold text-gray-900">
                      Call Us
                    </h3>
                    <p className="mt-1 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-600">
                      +91 99216 11911
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-6 h-6 min-[3840px]:w-10 min-[3840px]:h-10 flex-shrink-0 text-gray-300 group-hover:text-green-600 group-hover:rotate-45 transition" />
              </div>

              <a
                href={`tel:${phoneNumber}`}
                className="mt-5 sm:mt-6 min-[3840px]:mt-10 w-full py-3 sm:py-3.5 min-[1920px]:py-4 min-[3840px]:py-6 rounded-xl min-[3840px]:rounded-2xl bg-green-600 text-white text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
              >
                <Phone className="w-5 h-5 min-[3840px]:w-8 min-[3840px]:h-8" />
                Call Now
              </a>
            </div>

            {/* EMAIL CARD */}
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-[28px] min-[3840px]:rounded-[44px] bg-white border border-gray-200 min-[3840px]:border-2 p-5 sm:p-6 min-[1920px]:p-8 min-[3840px]:p-12 shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full flex flex-col justify-between">
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-5 min-[3840px]:gap-8 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-24 min-[3840px]:h-24 flex-shrink-0 rounded-xl sm:rounded-2xl min-[3840px]:rounded-3xl bg-blue-100 flex items-center justify-center group-hover:bg-[#0B4EA2] transition">
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7 min-[1920px]:w-8 min-[1920px]:h-8 min-[3840px]:w-12 min-[3840px]:h-12 text-[#0B4EA2] group-hover:text-white transition" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl min-[1920px]:text-2xl min-[3840px]:text-4xl font-bold text-gray-900">
                      Email Us
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl text-gray-600 break-all">
                      {emailAddress}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-6 h-6 min-[3840px]:w-10 min-[3840px]:h-10 flex-shrink-0 text-gray-300 group-hover:text-[#0B4EA2] group-hover:rotate-45 transition" />
              </div>

              <button
                type="button"
                onClick={handleEmailClick}
                className="mt-5 sm:mt-6 min-[3840px]:mt-10 w-full py-3 sm:py-3.5 min-[1920px]:py-4 min-[3840px]:py-6 rounded-xl min-[3840px]:rounded-2xl bg-[#0B4EA2] text-white text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-900 transition cursor-pointer"
              >
                <Mail className="w-5 h-5 min-[3840px]:w-8 min-[3840px]:h-8" />
                Send Email
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;