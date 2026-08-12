import React, { useState } from "react";
import Select from "react-select";

import {
  ShieldCheck,
  Users,
  Headset,
  User,
  Phone,
  Mail,
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

// =====================================================
// SERVICE OPTIONS
// =====================================================

const serviceOptions = [
  {
    value: "Company Registration",
    label: "Company Registration",
  },
  {
    value: "Private Limited Company",
    label: "Private Limited Company",
  },
  {
    value: "LLP Registration",
    label: "LLP Registration",
  },
  {
    value: "OPC Registration",
    label: "OPC Registration",
  },
  {
    value: "GST Registration",
    label: "GST Registration",
  },
  {
    value: "Trademark Registration",
    label: "Trademark Registration",
  },
  {
    value: "MSME Registration",
    label: "MSME Registration",
  },
  {
    value: "ISO Certification",
    label: "ISO Certification",
  },
  {
    value: "FSSAI Registration",
    label: "FSSAI Registration",
  },
  {
    value: "Import Export Code (IEC)",
    label: "Import Export Code (IEC)",
  },
  {
    value: "Income Tax Return",
    label: "Income Tax Return",
  },
  {
    value: "GST Return Filing",
    label: "GST Return Filing",
  },
];

// =====================================================
// BENEFITS
// =====================================================

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Business Solutions",
    text: "Reliable legal, financial and compliance services under one roof.",
  },
  {
    icon: Users,
    title: "15,000+ Happy Clients",
    text: "Trusted by startups, professionals and businesses across India.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    text: "Our experts are always ready to guide you at every step.",
  },
];

// =====================================================
// CONTACT SECTION
// =====================================================

const ContactSection = () => {
  const [selectedService, setSelectedService] = useState(null);

  // =====================================================
  // FORM SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedService) {
      alert("Please select a service.");
      return;
    }

    alert("Form Submitted Successfully!");
  };

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-blue-100
        py-8
        sm:py-8
        md:py-10
        lg:py-12
        xl:py-14
      "
    >
      {/* =====================================================
          BACKGROUND GLOW - TOP LEFT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-24
          -top-24
          h-48
          w-48
          sm:h-64
          sm:w-64
          lg:h-80
          lg:w-80
          rounded-full
          bg-blue-300/30
          blur-3xl
        "
      />

      {/* =====================================================
          BACKGROUND GLOW - BOTTOM RIGHT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -right-24
          h-52
          w-52
          sm:h-72
          sm:w-72
          lg:h-96
          lg:w-96
          rounded-full
          bg-green-300/30
          blur-3xl
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

     {/* ================= CONTAINER ================= */}

<div
  className="
    relative
    z-10
    w-full
    max-w-[1450px]
    mx-auto
    px-4
    sm:px-6
    md:px-8
    lg:px-10
    xl:px-10
    2xl:px-20
  "
>
  <div
    className="
      grid
      grid-cols-1
      lg:grid-cols-2
      gap-8
      md:gap-8
      lg:gap-10
      xl:gap-10
      items-start
      w-full
    "
  >
          {/* =====================================================
              LEFT SIDE - FORM
          ====================================================== */}

          <div
            className="
              relative
              min-w-0
              w-full
              overflow-hidden
              rounded-2xl
              bg-white/95
              p-5
              shadow-[0_15px_50px_rgba(0,0,0,0.08)]
              backdrop-blur-xl
              sm:rounded-[26px]
              sm:p-7
              md:p-8
              lg:rounded-[30px]
              lg:p-9
              xl:rounded-[34px]
              xl:p-10
            "
          >
            {/* =================================================
                CARD DECORATION
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-32
                w-32
                rounded-full
                bg-blue-100
                blur-3xl
                sm:h-40
                sm:w-40
              "
            />

            {/* =================================================
                BADGE
            ================================================== */}

            <span
              className="
                relative
                inline-flex
                max-w-full
                items-center
                gap-2
                rounded-full
                bg-green-100
                px-3.5
                py-2
                text-xs
                font-bold
                text-green-700
                sm:px-5
                sm:text-sm
              "
            >
              <Sparkles
                size={15}
                className="flex-shrink-0"
              />

              <span className="truncate">
                Free Expert Consultation
              </span>
            </span>

            {/* =================================================
                HEADING
            ================================================== */}

              <h2
            className="
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              leading-tight
              text-black
            "
          >
           Request Your Free{" "}

            <br className="hidden sm:block" />

            <span
              className="
                bg-gradient-to-r
                from-blue-600
                to-green-500
                bg-clip-text
                text-transparent
              "
            >
             Consultation
            </span>
          </h2>
            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-gray-700
                sm:mt-4
                sm:text-base
                sm:leading-7
              "
            >
              Tell us about your business requirements and our
              experts will contact you with the best legal,
              financial and compliance solutions.
            </p>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="
                mt-6
                space-y-4
                sm:mt-7
                sm:space-y-5
                lg:mt-8
              "
            >
              {/* =================================================
                  NAME + PHONE
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  sm:gap-5
                "
              >
                {/* NAME */}

                <div className="relative min-w-0">
                  <User
                    size={18}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      z-10
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name *"
                    className="
                      h-14
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      pl-11
                      pr-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#0B4EA2]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                      sm:pl-12
                      sm:text-base
                    "
                  />
                </div>

                {/* PHONE */}

                <div className="relative min-w-0">
                  <Phone
                    size={18}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      z-10
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Phone Number *"
                    className="
                      h-14
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      pl-11
                      pr-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#0B4EA2]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                      sm:pl-12
                      sm:text-base
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  EMAIL + SERVICE
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  sm:gap-5
                "
              >
                {/* EMAIL */}

                <div className="relative min-w-0">
                  <Mail
                    size={18}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      z-10
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (Optional)"
                    className="
                      h-14
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      pl-11
                      pr-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#0B4EA2]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                      sm:pl-12
                      sm:text-base
                    "
                  />
                </div>

                {/* SERVICE */}

                <div className="relative min-w-0">
                  <Briefcase
                    size={18}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      z-20
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <Select
                    options={serviceOptions}
                    value={selectedService}
                    onChange={setSelectedService}
                    isSearchable
                    placeholder="Search & Select Service *"
                    className="w-full text-sm"
                    classNamePrefix="service-select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        width: "100%",
                        minHeight: "56px",
                        height: "56px",
                        borderRadius: "12px",
                        paddingLeft: "32px",
                        borderColor: state.isFocused
                          ? "#0B4EA2"
                          : "#e5e7eb",
                        boxShadow: state.isFocused
                          ? "0 0 0 4px rgba(59,130,246,.15)"
                          : "none",
                        backgroundColor: "#f9fafb",
                        "&:hover": {
                          borderColor: "#0B4EA2",
                        },
                      }),

                      valueContainer: (base) => ({
                        ...base,
                        minWidth: 0,
                        paddingLeft: "4px",
                        paddingRight: "8px",
                      }),

                      singleValue: (base) => ({
                        ...base,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }),

                      placeholder: (base) => ({
                        ...base,
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }),

                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),

                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#0B4EA2"
                          : state.isFocused
                          ? "#EAF3FF"
                          : "#fff",
                        color: state.isSelected
                          ? "#fff"
                          : "#111827",
                        cursor: "pointer",
                      }),
                    }}
                  />

                  {!selectedService && (
                    <input
                      required
                      tabIndex={-1}
                      value=""
                      onChange={() => {}}
                      autoComplete="off"
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        h-0
                        w-0
                        opacity-0
                      "
                    />
                  )}
                </div>
              </div>

              {/* =================================================
                  MESSAGE
              ================================================== */}

              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us about your requirements *"
                className="
                  min-h-[130px]
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-4
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#0B4EA2]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                  sm:text-base
                "
              />

              {/* =================================================
                  SUBMIT BUTTON
              ================================================== */}

              <button
                type="submit"
                className="
                  group
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#0B4EA2]
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-green-600
                  hover:shadow-xl
                  sm:text-base
                "
              >
                <span className="flex items-center justify-center gap-2">
                  Send Message

                  <ArrowRight
                    size={18}
                    className="
                      transition
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </span>
              </button>

              {/* =================================================
                  TRUST POINTS
              ================================================== */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-4
                  gap-y-2
                  pt-1
                  sm:gap-x-5
                  sm:pt-2
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-gray-700
                    sm:text-sm
                  "
                >
                  <CheckCircle2
                    size={15}
                    className="flex-shrink-0 text-green-600"
                  />

                  100% Secure
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-gray-700
                    sm:text-sm
                  "
                >
                  <CheckCircle2
                    size={15}
                    className="flex-shrink-0 text-green-600"
                  />

                  Expert Guidance
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-gray-700
                    sm:text-sm
                  "
                >
                  <CheckCircle2
                    size={15}
                    className="flex-shrink-0 text-green-600"
                  />

                  Quick Response
                </div>
              </div>

              {/* =================================================
                  SOCIAL
              ================================================== */}

              <div
                className="
                  mt-5
                  border-t
                  border-gray-200
                  pt-5
                  sm:mt-7
                  sm:pt-6
                "
              >
                <h3
                  className="
                    text-lg
                    font-bold
                    text-gray-900
                    sm:text-xl
                  "
                >
                  Connect With Us
                </h3>

                <p
                  className="
                    mt-1.5
                    text-sm
                    leading-6
                    text-gray-600
                    sm:text-base
                  "
                >
                  Follow us for updates, business tips and latest
                  services.
                </p>

                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    gap-3
                    sm:mt-5
                    sm:gap-4
                  "
                >
                  {/* FACEBOOK */}

                  <a
                    href="#"
                    aria-label="Facebook"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-100
                      text-[#0B4EA2]
                      transition
                      hover:bg-[#0B4EA2]
                      hover:text-white
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <FaFacebookF size={18} />
                  </a>

                  {/* LINKEDIN */}

                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-100
                      text-[#0B4EA2]
                      transition
                      hover:bg-[#0B4EA2]
                      hover:text-white
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <FaLinkedinIn size={18} />
                  </a>

                  {/* WHATSAPP */}

                  <a
                    href="https://wa.me/919921611911"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-green-100
                      text-green-600
                      transition
                      hover:bg-green-600
                      hover:text-white
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <FaWhatsapp size={20} />
                  </a>

                  {/* INSTAGRAM */}

                  <a
                    href="#"
                    aria-label="Instagram"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-pink-100
                      text-pink-600
                      transition
                      hover:bg-pink-600
                      hover:text-white
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <FaInstagram size={20} />
                  </a>
                </div>
              </div>
            </form>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <div
            className="
              relative
              min-w-0
              w-full
              self-stretch
              lg:pt-2
              xl:pt-4
            "
          >
            {/* =================================================
                BACKGROUND GLOWS
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-48
                w-48
                rounded-full
                bg-blue-200/40
                blur-3xl
                sm:h-60
                sm:w-60
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-10
                -left-10
                h-44
                w-44
                rounded-full
                bg-green-200/40
                blur-3xl
                sm:h-52
                sm:w-52
              "
            />

            {/* =================================================
                RIGHT CONTENT
            ================================================== */}

            <div className="relative z-10 w-full min-w-0">
              {/* =================================================
                  BADGE
              ================================================== */}

              <span
                className="
                  inline-flex
                  max-w-full
                  items-center
                  gap-2
                  rounded-full
                  bg-[#0B4EA2]
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  shadow-lg
                  sm:px-5
                  sm:text-sm
                "
              >
                <Sparkles
                  size={15}
                  className="flex-shrink-0"
                />

                Why Choose MegaClick
              </span>

              {/* =================================================
                  HEADING
              ================================================== */}

               <h2
            className="
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              leading-tight
              text-black
            "
          >
            Let's Build Your{" "}

            <br className="hidden sm:block" />

            <span
              className="
                bg-gradient-to-r
                from-blue-600
                to-green-500
                bg-clip-text
                text-transparent
              "
            >
              Business Together
            </span>
          </h2>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-gray-700
                  sm:mt-4
                  sm:text-base
                  sm:leading-7
                  lg:text-lg
                  lg:leading-8
                "
              >
                MegaClick simplifies business registration,
                taxation, legal compliance and financial services
                with expert guidance and end-to-end support.
              </p>

              {/* =================================================
                  BENEFITS
              ================================================== */}

              <div
                className="
                  mt-6
                  space-y-4
                  sm:mt-8
                  sm:space-y-5
                  lg:mt-9
                "
              >
                {benefits.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="
                        group
                        w-full
                        min-w-0
                        rounded-2xl
                        bg-white/95
                        p-4
                        shadow-[0_10px_35px_rgba(0,0,0,0.07)]
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-2xl
                        sm:rounded-3xl
                        sm:p-5
                        lg:p-6
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-start
                          gap-3
                          sm:gap-5
                        "
                      >
                        {/* ICON */}

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            flex-shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-100
                            transition
                            duration-300
                            group-hover:bg-[#0B4EA2]
                            sm:h-14
                            sm:w-14
                            sm:rounded-2xl
                          "
                        >
                          <Icon
                            size={22}
                            className="
                              text-[#0B4EA2]
                              transition
                              group-hover:text-white
                            "
                          />
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">
                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-2
                            "
                          >
                            <h3
                              className="
                                min-w-0
                                text-base
                                font-bold
                                leading-6
                                text-gray-900
                                sm:text-lg
                                sm:leading-7
                                lg:text-xl
                              "
                            >
                              {item.title}
                            </h3>

                            <ArrowUpRight
                              size={18}
                              className="
                                mt-1
                                flex-shrink-0
                                text-gray-300
                                transition
                                group-hover:rotate-45
                                group-hover:text-[#0B4EA2]
                              "
                            />
                          </div>

                          <p
                            className="
                              mt-1.5
                              text-sm
                              leading-6
                              text-gray-600
                              sm:mt-2
                              sm:text-base
                              sm:leading-7
                            "
                          >
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* =================================================
                  STATS
              ================================================== */}

              <div
                className="
                  mt-6
                  grid
                  grid-cols-3
                  gap-2
                  sm:mt-8
                  sm:gap-4
                  lg:mt-9
                "
              >
                {/* 15K */}

                <div
                  className="
                    min-w-0
                    rounded-xl
                    bg-white
                    p-3
                    text-center
                    shadow-lg
                    sm:rounded-3xl
                    sm:p-5
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-extrabold
                      text-[#0B4EA2]
                      sm:text-3xl
                    "
                  >
                    15K+
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      leading-4
                      text-gray-600
                      sm:mt-2
                      sm:text-sm
                      sm:leading-5
                    "
                  >
                    Happy Clients
                  </p>
                </div>

                {/* 25+ */}

                <div
                  className="
                    min-w-0
                    rounded-xl
                    bg-white
                    p-3
                    text-center
                    shadow-lg
                    sm:rounded-3xl
                    sm:p-5
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-extrabold
                      text-green-600
                      sm:text-3xl
                    "
                  >
                    25+
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      leading-4
                      text-gray-600
                      sm:mt-2
                      sm:text-sm
                      sm:leading-5
                    "
                  >
                    Services
                  </p>
                </div>

                {/* 10+ */}

                <div
                  className="
                    min-w-0
                    rounded-xl
                    bg-white
                    p-3
                    text-center
                    shadow-lg
                    sm:rounded-3xl
                    sm:p-5
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-extrabold
                      text-[#0B4EA2]
                      sm:text-3xl
                    "
                  >
                    10+
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      leading-4
                      text-gray-600
                      sm:mt-2
                      sm:text-sm
                      sm:leading-5
                    "
                  >
                    Years
                  </p>
                </div>
              </div>

              {/* =================================================
                  TRUST LINE
              ================================================== */}

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-x-4
                  gap-y-2
                  sm:mt-7
                  sm:gap-x-5
                  lg:mt-8
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    font-medium
                    text-gray-700
                    sm:text-sm
                  "
                >
                  <CheckCircle2
                    size={16}
                    className="flex-shrink-0 text-green-600"
                  />

                  Trusted Professionals
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    font-medium
                    text-gray-700
                    sm:text-sm
                  "
                >
                  <CheckCircle2
                    size={16}
                    className="flex-shrink-0 text-green-600"
                  />

                  Fast Processing
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    font-medium
                    text-gray-700
                    sm:text-sm
                  "
                >
                  <CheckCircle2
                    size={16}
                    className="flex-shrink-0 text-green-600"
                  />

                  Transparent Pricing
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;