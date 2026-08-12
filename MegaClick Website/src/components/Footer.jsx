import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import logo from "../assets/LOGO.png";

const Footer = () => {
  const navigate = useNavigate();

  // =================================================
  // EMAIL COMPOSE
  // Desktop → Gmail Web Compose
  // Mobile  → Default Email App
  // Only recipient is pre-filled
  // =================================================

  const openGmailCompose = () => {
    const email = "megaclickofficial@gmail.com";

    const isMobile = /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // Mobile → Default Email App
      window.location.href = `mailto:${email}`;
    } else {
      // Desktop → Gmail Web Compose
      const gmailComposeUrl =
        `https://mail.google.com/mail/?view=cm&fs=1` +
        `&to=${encodeURIComponent(email)}`;

      window.open(gmailComposeUrl, "_blank");
    }
  };

  // =================================================
  // SCROLL TO TOP
  // =================================================

  const scrollToTop = () => {
    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 300);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =================================================
  // SERVICES
  // =================================================

  const services = [
    "Business Registration",
    "Tax & Compliance Services",
    "Financial & Legal Solutions",
  ];

  // =================================================
  // QUICK LINKS
  // =================================================

  const quickLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About Us",
      path: "/about",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Associate With Us",
      path: "/associate-with-us",
    },
    {
      name: "Contact Us",
      path: "/contact",
    },
  ];

  // =================================================
  // SOCIAL LINKS
  // =================================================

  const socialLinks = [
    {
      icon: FaFacebookF,
      link: "#",
      label: "Facebook",
    },
    {
      icon: FaInstagram,
      link: "#",
      label: "Instagram",
    },
    {
      icon: FaLinkedinIn,
      link: "#",
      label: "LinkedIn",
    },
  ];

  // =================================================
  // HANDLE NAVIGATION
  // =================================================

  const handleNavigation = (path) => {
    navigate(path);

    if (path === "/") {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <footer className="bg-[#083A7A] text-white relative overflow-hidden">

      {/* =================================================
          TOP GREEN LINE
      ================================================= */}

      <div className="h-1 bg-green-400" />

      {/* =================================================
          MAIN FOOTER
      ================================================= */}

      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          pt-2
          sm:pt-3
          lg:pt-4
          pb-6
          sm:pb-8
          lg:pb-10
        "
      >
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-10
            sm:gap-12
            lg:gap-14
            xl:gap-16
          "
        >

          {/* =================================================
              COMPANY
          ================================================= */}

          <div className="sm:col-span-2 lg:col-span-1">

            {/* Logo + Name */}

            <div className="flex items-center gap-3 mb-5 sm:mb-6">

              <img
                src={logo}
                alt="MegaClick"
                className="
                  w-11
                  h-11
                  sm:w-12
                  sm:h-12
                  -ml-1
                  rounded-full
                  object-contain
                  p-1
                  border
                  border-blue-300
                  bg-white
                  shadow-lg
                  shadow-blue-200/50
                  transition-all
                  duration-300
                  hover:scale-105
                  active:scale-95
                "
              />

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  tracking-wide
                "
              >
                <span className="text-white">
                  Mega
                </span>

                <span className="text-green-400">
                  Click
                </span>
              </h2>

            </div>

            {/* Description */}

            <p
              className="
                text-blue-100
                text-sm
                leading-6
                sm:leading-7
                max-w-sm
              "
            >
              MegaClick provides reliable business registration,
              financial and legal solutions to help businesses
              grow faster.
            </p>

            {/* =================================================
                SOCIAL ICONS
            ================================================= */}

            <div className="flex gap-3 mt-5 sm:mt-6">

              {socialLinks.map((social, index) => {
                const Icon = social.icon;

                return (
                  <a
                    key={index}
                    href={social.link}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      w-9
                      h-9
                      sm:w-10
                      sm:h-10
                      rounded-full
                      bg-white/10
                      flex
                      items-center
                      justify-center
                      cursor-pointer
                      transition-all
                      duration-300
                      hover:bg-green-500
                      hover:-translate-y-1
                      hover:shadow-lg
                      active:bg-green-500
                      active:-translate-y-1
                      active:shadow-lg
                      active:scale-95
                    "
                  >
                    <Icon size={16} />
                  </a>
                );
              })}

            </div>
          </div>

          {/* =================================================
              EXPLORE
          ================================================= */}

          <div>

            <h3
              className="
                text-lg
                sm:text-xl
                font-bold
                mb-5
                sm:mb-7
              "
            >
              Explore
            </h3>

            <ul className="space-y-3 sm:space-y-4">

              {quickLinks.map((item, index) => (
                <li key={index}>

                  <button
                    type="button"
                    onClick={() =>
                      handleNavigation(item.path)
                    }
                    className="
                      group
                      relative
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-blue-100
                      cursor-pointer
                      transition-all
                      duration-300
                      text-left
                      hover:text-white
                      hover:translate-x-1
                      active:text-green-300
                      active:translate-x-1
                      active:scale-[0.98]
                    "
                  >

                    <span
                      className="
                        w-1
                        h-1
                        rounded-full
                        bg-green-400
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        group-hover:w-1.5
                        group-hover:h-1.5
                        group-active:opacity-100
                        group-active:w-1.5
                        group-active:h-1.5
                      "
                    />

                    {item.name}

                  </button>

                </li>
              ))}

            </ul>
          </div>

          {/* =================================================
              OUR SERVICES
          ================================================= */}

          <div>

            <h3
              className="
                text-lg
                sm:text-xl
                font-bold
                mb-5
                sm:mb-7
              "
            >
              Our Services
            </h3>

            <ul className="space-y-3 sm:space-y-4">

              {services.map((service, index) => (
                <li
                  key={index}
                  className="
                    group
                    relative
                    flex
                    items-center
                    gap-2
                    text-sm
                    leading-6
                    text-blue-100
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:text-white
                    hover:translate-x-1
                    active:text-green-300
                    active:translate-x-1
                    active:scale-[0.98]
                  "
                >

                  <span
                    className="
                      w-1
                      h-1
                      rounded-full
                      bg-green-400
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:opacity-100
                      group-hover:w-1.5
                      group-hover:h-1.5
                      group-active:opacity-100
                      group-active:w-1.5
                      group-active:h-1.5
                    "
                  />

                  {service}

                </li>
              ))}

            </ul>
          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div>

            <h3
              className="
                text-lg
                sm:text-xl
                font-bold
                mb-5
                sm:mb-7
              "
            >
              Contact Us
            </h3>

            <div className="space-y-4 sm:space-y-5">

              {/* =================================================
                  PHONE
              ================================================= */}

              <a
                href="tel:+919921611911"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  w-fit
                  transition-all
                  duration-300
                  hover:translate-x-1
                  active:translate-x-1
                  active:scale-[0.98]
                "
              >

                <Phone
                  size={19}
                  className="
                    text-green-400
                    flex-shrink-0
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    group-active:scale-110
                  "
                />

                <span
                  className="
                    text-sm
                    text-blue-100
                    transition-colors
                    duration-300
                    group-hover:text-white
                    group-active:text-green-300
                  "
                >
                  +91 9921611911
                </span>

              </a>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <button
                type="button"
                onClick={openGmailCompose}
                aria-label="Send email to MegaClick"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  w-fit
                  max-w-full
                  transition-all
                  duration-300
                  hover:translate-x-1
                  active:translate-x-1
                  active:scale-[0.98]
                  text-left
                  bg-transparent
                  border-0
                  p-0
                  cursor-pointer
                "
              >

                <Mail
                  size={19}
                  className="
                    text-green-400
                    flex-shrink-0
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    group-active:scale-110
                  "
                />

                <span
                  className="
                    text-sm
                    text-blue-100
                    transition-colors
                    duration-300
                    break-all
                    group-hover:text-white
                    group-active:text-green-300
                  "
                >
                  megaclickofficial@gmail.com
                </span>

              </button>

              {/* =================================================
                  ADDRESS
              ================================================= */}

              <a
                href="https://www.google.com/maps/search/?api=1&query=4th+Floor+Tristar+Complex+Jehan+Circle+Gangapur+Road+Nashik+Maharashtra+422005"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex
                  items-start
                  gap-3
                  max-w-sm
                  transition-all
                  duration-300
                  hover:translate-x-1
                  active:translate-x-1
                  active:scale-[0.98]
                "
              >

                <MapPin
                  size={22}
                  className="
                    text-green-400
                    mt-0.5
                    flex-shrink-0
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    group-active:scale-110
                  "
                />

                <span
                  className="
                    text-sm
                    leading-6
                    text-blue-100
                    transition-colors
                    duration-300
                    group-hover:text-white
                    group-active:text-green-300
                  "
                >
                  4th Floor, Tristar Complex,
                  <br />
                  Jehan Circle, Gangapur Rd,
                  <br />
                  Above Canara Bank,
                  <br />
                  D&apos;souza Colony,
                  <br />
                  Nashik, Maharashtra 422005
                </span>

              </a>

            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          BOTTOM FOOTER
      ================================================= */}

      <div className="border-t border-white/10">

        <div
          className="
            max-w-[1500px]
            mx-auto
            px-5
            sm:px-8
            lg:px-16
            xl:px-24
            py-4
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
            text-center
            sm:text-left
          "
        >

          {/* Copyright */}

          <p
            className="
              text-xs
              sm:text-sm
              text-blue-100
            "
          >
            © 2026{" "}

            <span className="text-white font-semibold">
              Mega
            </span>

            <span className="text-green-400 font-semibold">
              Click
            </span>

            . All Rights Reserved.
          </p>

          {/* =================================================
              BACK TO TOP
          ================================================= */}

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="
              group
              flex
              items-center
              gap-2
              bg-white/10
              hover:bg-green-500
              active:bg-green-500
              border
              border-white/10
              px-3
              py-1.5
              rounded-full
              text-xs
              sm:text-sm
              font-medium
              text-white
              transition-all
              duration-300
              hover:-translate-y-1
              active:-translate-y-1
              active:scale-95
            "
          >

            <span
              className="
                w-6
                h-6
                rounded-full
                bg-white/20
                flex
                items-center
                justify-center
                transition-all
                duration-300
                group-hover:bg-white
                group-active:bg-white
              "
            >

              <span
                className="
                  text-sm
                  transition-colors
                  duration-300
                  group-hover:text-green-600
                  group-active:text-green-600
                "
              >
                ↑
              </span>

            </span>

            Back to Top

          </button>

        </div>
      </div>
    </footer>
  );
};

export default Footer;