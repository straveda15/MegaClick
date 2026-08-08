
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
  // SCROLL TO HOMEPAGE SECTION
  // =================================================
  const scrollToSection = (id) => {
    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        const section = document.getElementById(id);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    } else {
      const section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
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
      id: "home",
    },
    {
      name: "About Us",
      id: "about",
    },
    {
      name: "Services",
      id: "services",
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
          max-w-[1450px]
          mx-auto
          px-5
          sm:px-8
          lg:px-16
          xl:px-20
          py-10
          sm:py-12
          lg:py-14
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
                    onClick={() => {

                      // Routes
                      if (item.path) {
                        navigate(item.path);
                        return;
                      }

                      // Homepage sections
                      scrollToSection(item.id);

                    }}
                    className="
                      text-sm
                      text-blue-100
                      cursor-pointer
                      transition-all
                      duration-300
                      hover:text-white
                      hover:translate-x-1
                      text-left
                    "
                  >
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
                    text-sm
                    leading-6
                    text-blue-100
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:text-white
                    hover:translate-x-1
                  "
                >
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
                  "
                />

                <span
                  className="
                    text-sm
                    text-blue-100
                    group-hover:text-white
                    transition-colors
                    duration-300
                  "
                >
                  +91 9921611911
                </span>

              </a>

              {/* =================================================
                  EMAIL
              ================================================= */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=megaclickofficial@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  w-fit
                  max-w-full
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
                  "
                />

                <span
                  className="
                    text-sm
                    text-blue-100
                    group-hover:text-white
                    transition-colors
                    duration-300
                    break-all
                  "
                >
                  megaclickofficial@gmail.com
                </span>

              </a>

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
                  "
                />

                <span
                  className="
                    text-sm
                    leading-6
                    text-blue-100
                    group-hover:text-white
                    transition-colors
                    duration-300
                  "
                >
                  4th Floor, Tristar Complex,
                  <br />
                  Jehan Circle, Gangapur Rd,
                  <br />
                  Above Canara Bank,
                  <br />
                  D'souza Colony,
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

          {/* Back To Top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="
              group
              flex
              items-center
              gap-2
              bg-white/10
              hover:bg-green-500
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
                group-hover:bg-white
                transition
              "
            >
              <span
                className="
                  text-sm
                  group-hover:text-green-600
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