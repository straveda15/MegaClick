
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

const serviceOptions = [
  { value: "Company Registration", label: "Company Registration" },
  { value: "Private Limited Company", label: "Private Limited Company" },
  { value: "LLP Registration", label: "LLP Registration" },
  { value: "OPC Registration", label: "OPC Registration" },
  { value: "GST Registration", label: "GST Registration" },
  { value: "Trademark Registration", label: "Trademark Registration" },
  { value: "MSME Registration", label: "MSME Registration" },
  { value: "ISO Certification", label: "ISO Certification" },
  { value: "FSSAI Registration", label: "FSSAI Registration" },
  { value: "Import Export Code (IEC)", label: "Import Export Code (IEC)" },
  { value: "Income Tax Return", label: "Income Tax Return" },
  { value: "GST Return Filing", label: "GST Return Filing" },
];

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

const ContactSection = () => {
  const [selectedService, setSelectedService] = useState(null);

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
        overflow-hidden
        bg-blue-100
        py-8
        sm:py-10
        lg:py-14
      "
    >
      {/* ================= BACKGROUND GLOW ================= */}

      <div
        className="
          absolute
          -top-20
          -left-20
          w-60
          h-60
          sm:w-72
          sm:h-72
          rounded-full
          bg-blue-300/30
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -bottom-20
          -right-20
          w-64
          h-64
          sm:w-80
          sm:h-80
          rounded-full
          bg-green-300/30
          blur-3xl
          pointer-events-none
        "
      />

      {/* ================= CONTAINER ================= */}

      <div
        className="
          relative
          z-10
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          lg:px-16
          xl:px-24
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            lg:gap-12
            items-start
          "
        >
          {/* =====================================================
              LEFT FORM CARD
          ====================================================== */}

          <div
            className="
              relative
              w-full
              min-w-0
              bg-white/95
              backdrop-blur-xl
              rounded-2xl
              sm:rounded-[28px]
              lg:rounded-[35px]
              shadow-[0_20px_60px_rgba(0,0,0,0.10)]
              p-5
              sm:p-7
              lg:p-10
            "
          >
            {/* Floating Circle */}

            <div
              className="
                absolute
                -top-10
                -right-10
                w-32
                h-32
                sm:w-40
                sm:h-40
                rounded-full
                bg-blue-100
                blur-3xl
                pointer-events-none
              "
            />

            {/* Badge */}

            <span
              className="
                relative
                inline-flex
                items-center
                gap-2
                px-4
                sm:px-5
                py-2
                rounded-full
                bg-green-100
                text-green-700
                font-bold
                text-xs
                sm:text-sm
              "
            >
              <Sparkles size={15} />

              Free Expert Consultation
            </span>

            {/* Heading */}

            <h2
              className="
                mt-5
                sm:mt-6
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-extrabold
                leading-tight
                bg-gradient-to-r
                from-[#0B4EA2]
                via-blue-600
                to-green-600
                bg-clip-text
                text-transparent
              "
            >
              Request Your Free Consultation
            </h2>

            <p
              className="
                mt-3
                sm:mt-4
                text-sm
                sm:text-base
                text-gray-700
                leading-6
                sm:leading-7
              "
            >
              Tell us about your business requirements and our experts will
              contact you with the best legal, financial and compliance
              solutions.
            </p>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="
                mt-6
                sm:mt-8
                space-y-4
                sm:space-y-5
              "
            >
              {/* NAME + PHONE */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                  sm:gap-5
                "
              >
                {/* Name */}

                <div className="relative min-w-0">
                  <User
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      z-10
                    "
                  />

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name *"
                    className="
                      w-full
                      h-13
                      sm:h-14
                      rounded-xl
                      bg-gray-50
                      border
                      border-gray-200
                      pl-11
                      sm:pl-12
                      pr-4
                      text-sm
                      sm:text-base
                      outline-none
                      focus:bg-white
                      focus:border-[#0B4EA2]
                      focus:ring-4
                      focus:ring-blue-100
                      transition
                    "
                  />
                </div>

                {/* Phone */}

                <div className="relative min-w-0">
                  <Phone
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      z-10
                    "
                  />

                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Phone Number *"
                    className="
                      w-full
                      h-13
                      sm:h-14
                      rounded-xl
                      bg-gray-50
                      border
                      border-gray-200
                      pl-11
                      sm:pl-12
                      pr-4
                      text-sm
                      sm:text-base
                      outline-none
                      focus:bg-white
                      focus:border-[#0B4EA2]
                      focus:ring-4
                      focus:ring-blue-100
                      transition
                    "
                  />
                </div>
              </div>

              {/* EMAIL + SERVICE */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                  sm:gap-5
                "
              >
                {/* Email */}

                <div className="relative min-w-0">
                  <Mail
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      z-10
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (Optional)"
                    className="
                      w-full
                      h-13
                      sm:h-14
                      rounded-xl
                      bg-gray-50
                      border
                      border-gray-200
                      pl-11
                      sm:pl-12
                      pr-4
                      text-sm
                      sm:text-base
                      outline-none
                      focus:bg-white
                      focus:border-[#0B4EA2]
                      focus:ring-4
                      focus:ring-blue-100
                      transition
                    "
                  />
                </div>

                {/* Service */}

                <div className="relative min-w-0">
                  <Briefcase
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      z-20
                      text-gray-400
                    "
                  />

                  <Select
                    options={serviceOptions}
                    value={selectedService}
                    onChange={setSelectedService}
                    isSearchable
                    placeholder="Search & Select Service *"
                    className="text-sm"
                    classNamePrefix="service-select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
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
                        "&:hover": {
                          borderColor: "#0B4EA2",
                        },
                      }),

                      valueContainer: (base) => ({
                        ...base,
                        paddingLeft: "4px",
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
                        color: state.isSelected ? "#fff" : "#111827",
                        cursor: "pointer",
                      }),
                    }}
                  />

                  {!selectedService && (
                    <input
                      required
                      value=""
                      onChange={() => {}}
                      tabIndex={-1}
                      autoComplete="off"
                      className="
                        absolute
                        opacity-0
                        pointer-events-none
                        w-0
                        h-0
                      "
                    />
                  )}
                </div>
              </div>

              {/* MESSAGE */}

              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us about your requirements *"
                className="
                  w-full
                  min-h-[130px]
                  rounded-xl
                  bg-gray-50
                  border
                  border-gray-200
                  p-4
                  text-sm
                  sm:text-base
                  resize-none
                  outline-none
                  focus:bg-white
                  focus:border-[#0B4EA2]
                  focus:ring-4
                  focus:ring-blue-100
                  transition
                "
              />

              {/* SUBMIT */}

              <button
                type="submit"
                className="
                  group
                  w-full
                  h-13
                  sm:h-14
                  rounded-xl
                  bg-[#0B4EA2]
                  hover:bg-green-600
                  text-white
                  font-semibold
                  text-sm
                  sm:text-base
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <span
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  Send Message

                  <ArrowRight
                    size={18}
                    className="
                      group-hover:translate-x-1
                      transition
                    "
                  />
                </span>
              </button>

              {/* TRUST POINTS */}

              <div
                className="
                  flex
                  flex-wrap
                  justify-center
                  gap-x-4
                  gap-y-2
                  pt-2
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    sm:text-sm
                    text-gray-700
                  "
                >
                  <CheckCircle2
                    size={15}
                    className="text-green-600"
                  />
                  100% Secure
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    sm:text-sm
                    text-gray-700
                  "
                >
                  <CheckCircle2
                    size={15}
                    className="text-green-600"
                  />
                  Expert Guidance
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    sm:text-sm
                    text-gray-700
                  "
                >
                  <CheckCircle2
                    size={15}
                    className="text-green-600"
                  />
                  Quick Response
                </div>
              </div>

              {/* SOCIAL */}

              <div
                className="
                  mt-6
                  sm:mt-8
                  pt-5
                  sm:pt-6
                  border-t
                  border-gray-200
                "
              >
                <h3
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-gray-900
                  "
                >
                  Connect With Us
                </h3>

                <p
                  className="
                    mt-1.5
                    text-sm
                    sm:text-base
                    text-gray-600
                  "
                >
                  Follow us for updates, business tips and latest services.
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-3
                    sm:gap-4
                    mt-4
                    sm:mt-5
                  "
                >
                  <a
                    href="#"
                    className="
                      w-10
                      h-10
                      sm:w-12
                      sm:h-12
                      rounded-full
                      bg-blue-100
                      flex
                      items-center
                      justify-center
                      text-[#0B4EA2]
                      hover:bg-[#0B4EA2]
                      hover:text-white
                      transition
                    "
                  >
                    <FaFacebookF size={18} />
                  </a>

                  <a
                    href="#"
                    className="
                      w-10
                      h-10
                      sm:w-12
                      sm:h-12
                      rounded-full
                      bg-blue-100
                      flex
                      items-center
                      justify-center
                      text-[#0B4EA2]
                      hover:bg-[#0B4EA2]
                      hover:text-white
                      transition
                    "
                  >
                    <FaLinkedinIn size={18} />
                  </a>

                  <a
                    href="#"
                    className="
                      w-10
                      h-10
                      sm:w-12
                      sm:h-12
                      rounded-full
                      bg-green-100
                      flex
                      items-center
                      justify-center
                      text-green-600
                      hover:bg-green-600
                      hover:text-white
                      transition
                    "
                  >
                    <FaWhatsapp size={20} />
                  </a>

                  <a
                    href="#"
                    className="
                      w-10
                      h-10
                      sm:w-12
                      sm:h-12
                      rounded-full
                      bg-pink-100
                      flex
                      items-center
                      justify-center
                      text-pink-600
                      hover:bg-pink-600
                      hover:text-white
                      transition
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
              w-full
              min-w-0
              flex
              flex-col
              justify-center
            "
          >
            {/* Floating Glow */}

            <div
              className="
                absolute
                -top-10
                -right-10
                w-48
                h-48
                sm:w-60
                sm:h-60
                bg-blue-200/40
                rounded-full
                blur-3xl
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                -bottom-10
                -left-10
                w-44
                h-44
                sm:w-52
                sm:h-52
                bg-green-200/40
                rounded-full
                blur-3xl
                pointer-events-none
              "
            />

            <div className="relative z-10">
              {/* Badge */}

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  sm:px-5
                  py-2
                  rounded-full
                  bg-[#0B4EA2]
                  text-white
                  text-xs
                  sm:text-sm
                  font-semibold
                  shadow-lg
                "
              >
                <Sparkles size={15} />

                Why Choose MegaClick
              </span>

              {/* Heading */}

              <h2
                className="
                  mt-5
                  sm:mt-6
                  text-2xl
                  sm:text-3xl
                  lg:text-4xl
                  font-extrabold
                  leading-tight
                  bg-gradient-to-r
                  from-[#0B4EA2]
                  via-blue-600
                  to-green-600
                  bg-clip-text
                  text-transparent
                "
              >
                Let's Build Your
                <br />
                Business Together
              </h2>

              <p
                className="
                  mt-4
                  sm:mt-5
                  text-sm
                  sm:text-lg
                  text-gray-700
                  leading-6
                  sm:leading-8
                  max-w-xl
                "
              >
                MegaClick simplifies business registration, taxation, legal
                compliance and financial services with expert guidance and
                end-to-end support.
              </p>

              {/* BENEFITS */}

              <div
                className="
                  mt-7
                  sm:mt-10
                  space-y-4
                  sm:space-y-5
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
                        bg-white/95
                        backdrop-blur-xl
                        rounded-2xl
                        sm:rounded-3xl
                        p-4
                        sm:p-6
                        shadow-lg
                        hover:shadow-2xl
                        hover:-translate-y-1
                        transition-all
                        duration-300
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          gap-3
                          sm:gap-5
                        "
                      >
                        <div
                          className="
                            w-11
                            h-11
                            sm:w-14
                            sm:h-14
                            flex-shrink-0
                            rounded-xl
                            sm:rounded-2xl
                            bg-blue-100
                            flex
                            items-center
                            justify-center
                            group-hover:bg-[#0B4EA2]
                            transition
                          "
                        >
                          <Icon
                            size={22}
                            className="
                              text-[#0B4EA2]
                              group-hover:text-white
                              transition
                            "
                          />
                        </div>

                        <div className="flex-1 min-w-0">
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
                                text-base
                                sm:text-xl
                                font-bold
                                text-gray-900
                              "
                            >
                              {item.title}
                            </h3>

                            <ArrowUpRight
                              size={18}
                              className="
                                flex-shrink-0
                                mt-1
                                text-gray-300
                                group-hover:text-[#0B4EA2]
                                group-hover:rotate-45
                                transition
                              "
                            />
                          </div>

                          <p
                            className="
                              mt-1.5
                              sm:mt-2
                              text-sm
                              sm:text-base
                              text-gray-600
                              leading-6
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

              {/* STATS */}

              <div
                className="
                  grid
                  grid-cols-3
                  gap-2
                  sm:gap-4
                  mt-7
                  sm:mt-10
                "
              >
                <div
                  className="
                    bg-white
                    rounded-xl
                    sm:rounded-3xl
                    shadow-lg
                    p-3
                    sm:p-5
                    text-center
                  "
                >
                  <h3
                    className="
                      text-xl
                      sm:text-3xl
                      font-extrabold
                      text-[#0B4EA2]
                    "
                  >
                    15K+
                  </h3>

                  <p
                    className="
                      text-[10px]
                      sm:text-sm
                      text-gray-600
                      mt-1
                      sm:mt-2
                    "
                  >
                    Happy Clients
                  </p>
                </div>

                <div
                  className="
                    bg-white
                    rounded-xl
                    sm:rounded-3xl
                    shadow-lg
                    p-3
                    sm:p-5
                    text-center
                  "
                >
                  <h3
                    className="
                      text-xl
                      sm:text-3xl
                      font-extrabold
                      text-green-600
                    "
                  >
                    25+
                  </h3>

                  <p
                    className="
                      text-[10px]
                      sm:text-sm
                      text-gray-600
                      mt-1
                      sm:mt-2
                    "
                  >
                    Services
                  </p>
                </div>

                <div
                  className="
                    bg-white
                    rounded-xl
                    sm:rounded-3xl
                    shadow-lg
                    p-3
                    sm:p-5
                    text-center
                  "
                >
                  <h3
                    className="
                      text-xl
                      sm:text-3xl
                      font-extrabold
                      text-[#0B4EA2]
                    "
                  >
                    10+
                  </h3>

                  <p
                    className="
                      text-[10px]
                      sm:text-sm
                      text-gray-600
                      mt-1
                      sm:mt-2
                    "
                  >
                    Years
                  </p>
                </div>
              </div>

              {/* TRUST LINE */}

              <div
                className="
                  flex
                  flex-wrap
                  gap-x-4
                  gap-y-2
                  mt-6
                  sm:mt-8
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    sm:text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  <CheckCircle2
                    size={16}
                    className="text-green-600"
                  />
                  Trusted Professionals
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    sm:text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  <CheckCircle2
                    size={16}
                    className="text-green-600"
                  />
                  Fast Processing
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    sm:text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  <CheckCircle2
                    size={16}
                    className="text-green-600"
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
