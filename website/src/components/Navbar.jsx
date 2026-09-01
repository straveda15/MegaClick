import { useEffect, useState } from "react";
import TopBar from "./TopBar";

import {
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import logo from "../assets/LOGO.png";

function Navbar({ showTopBar = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const activePage = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }

    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {showTopBar && <TopBar />}

      <header
        className={`
          sticky
          top-0
          z-50
          bg-white
          transition-all
          duration-300
          ${scrolled ? "shadow-md" : "shadow-sm"}
        `}
      >
        {/* DIRECT DESKTOP MEDIA QUERIES FOR 1440px, 1920px, 2560px & 3840px (4K) */}
        <style>{`
          /* Standard Desktop (1440px x 900px) */
          @media (min-width: 1440px) {
            .nav-container {
              max-width: 1490px !important;
              padding-left: 4rem !important;
              padding-right: 4rem !important;
            }
          }

          /* Large Desktop (1920px x 1080px Full HD) */
          @media (min-width: 1920px) {
            .nav-container {
              max-width: 1800px !important;
              padding-left: 5rem !important;
              padding-right: 5rem !important;
            }
            .nav-row {
              height: 5.5rem !important;
            }
            .nav-logo-img {
              width: 3.5rem !important;
              height: 3.5rem !important;
            }
            .nav-logo-title {
              font-size: 1.45rem !important;
            }
            .nav-logo-sub {
              font-size: 0.85rem !important;
            }
            .nav-links {
              gap: 3rem !important;
              font-size: 1.1rem !important;
            }
            .nav-btn {
              padding: 0.85rem 1.75rem !important;
              font-size: 1.1rem !important;
            }
            .nav-btn-icon {
              width: 1.25rem !important;
              height: 1.25rem !important;
            }
          }

          /* QHD / 2K Ultra-Wide (2560px Desktop) */
          @media (min-width: 2560px) {
            .nav-container {
              max-width: 2300px !important;
              padding-left: 6rem !important;
              padding-right: 6rem !important;
            }
            .nav-row {
              height: 6.5rem !important;
            }
            .nav-logo-img {
              width: 4.5rem !important;
              height: 4.5rem !important;
            }
            .nav-logo-title {
              font-size: 1.85rem !important;
            }
            .nav-logo-sub {
              font-size: 1.05rem !important;
            }
            .nav-links {
              gap: 4rem !important;
              font-size: 1.35rem !important;
            }
            .nav-btn {
              padding: 1.1rem 2.25rem !important;
              font-size: 1.35rem !important;
              border-radius: 0.5rem !important;
            }
            .nav-btn-icon {
              width: 1.5rem !important;
              height: 1.5rem !important;
            }
          }

          /* 4K Ultra-Wide Desktop (3840px x 2160px) */
          @media (min-width: 3840px) {
            .nav-container {
              max-width: 3400px !important;
              padding-left: 8rem !important;
              padding-right: 8rem !important;
            }
            .nav-row {
              height: 9rem !important;
            }
            .nav-logo-img {
              width: 6.5rem !important;
              height: 6.5rem !important;
              border-width: 2px !important;
            }
            .nav-logo-title {
              font-size: 2.75rem !important;
            }
            .nav-logo-sub {
              font-size: 1.5rem !important;
            }
            .nav-links {
              gap: 6rem !important;
              font-size: 2rem !important;
            }
            .nav-btn {
              padding: 1.5rem 3.5rem !important;
              font-size: 2rem !important;
              border-radius: 0.75rem !important;
            }
            .nav-btn-icon {
              width: 2.25rem !important;
              height: 2.25rem !important;
            }
          }
        `}</style>

        <div
          className="
            nav-container
            max-w-[1500px]
            mx-auto
            px-5
            sm:px-8
            lg:px-16
            xl:px-24
          "
        >
          <div
            className="
              nav-row
              h-16
              flex
              items-center
              justify-between
            "
          >
            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
              "
            >
              <img
                src={logo}
                alt="MegaClick"
                className="
                  nav-logo-img
                  w-11
                  h-11
                  sm:w-12
                  sm:h-12
                  rounded-full
                  object-contain
                  p-1
                  border
                  border-blue-300
                  shadow-md
                  transition
                  hover:scale-105
                "
              />

              <div>
                <h1
                  className="
                    nav-logo-title
                    text-lg
                    sm:text-xl
                    font-bold
                  "
                >
                  <span className="text-[#0B4EA2]">Mega</span>
                  <span className="text-green-600">Click</span>
                </h1>

                <p
                  className="
                    nav-logo-sub
                    text-[11px]
                    sm:text-xs
                    text-gray-500
                  "
                >
                  Enterprises
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav
              className="
                nav-links
                hidden
                lg:flex
                items-center
                gap-8
                xl:gap-10
                text-sm
              "
            >
              {/* HOME */}
              <Link
                to="/"
                onClick={closeMenu}
                className={`
                  relative
                  font-medium
                  pb-1
                  transition
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-[2px]
                  after:bg-[#0B4EA2]
                  after:transition-all
                  ${
                    activePage === "/"
                      ? "after:w-full text-[#0B4EA2]"
                      : "after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"
                  }
                `}
              >
                Home
              </Link>

              {/* ABOUT */}
              <Link
                to="/about"
                onClick={closeMenu}
                className={`
                  relative
                  font-medium
                  pb-1
                  transition
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-[2px]
                  after:bg-[#0B4EA2]
                  after:transition-all
                  ${
                    activePage === "/about"
                      ? "after:w-full text-[#0B4EA2]"
                      : "after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"
                  }
                `}
              >
                About Us
              </Link>

              {/* SERVICES */}
              <Link
                to="/services"
                onClick={closeMenu}
                className={`
                  relative
                  font-medium
                  pb-1
                  transition
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-[2px]
                  after:bg-[#0B4EA2]
                  after:transition-all
                  ${
                    activePage.startsWith("/services")
                      ? "after:w-full text-[#0B4EA2]"
                      : "after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"
                  }
                `}
              >
                Services
              </Link>

              {/* ASSOCIATE */}
              <NavLink
                to="/associate-with-us"
                onClick={closeMenu}
                className={`
                  relative
                  font-medium
                  pb-1
                  transition
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-[2px]
                  after:bg-[#0B4EA2]
                  after:transition-all
                  ${
                    activePage === "/associate-with-us"
                      ? "after:w-full text-[#0B4EA2]"
                      : "after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"
                  }
                `}
              >
                Associate With Us
              </NavLink>

              {/* CONTACT */}
              <Link
                to="/contact"
                onClick={closeMenu}
                className={`
                  relative
                  font-medium
                  pb-1
                  transition
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-[2px]
                  after:bg-[#0B4EA2]
                  after:transition-all
                  ${
                    activePage === "/contact"
                      ? "after:w-full text-[#0B4EA2]"
                      : "after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"
                  }
                `}
              >
                Contact Us
              </Link>
            </nav>

            {/* DESKTOP BUTTON */}
            <button
              onClick={() => scrollToSection("contact")}
              className="
                nav-btn
                hidden
                lg:flex
                items-center
                gap-2
                bg-green-600
                hover:bg-green-700
                text-white
                px-5
                py-2.5
                rounded-md
                font-semibold
                text-sm
                transition
              "
            >
              <span>Get Free Consultation</span>
              <ArrowRight size={16} className="nav-btn-icon" />
            </button>

            {/* MOBILE BUTTON */}
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div
              className="
                lg:hidden
                bg-white
                border-t
                border-gray-100
                py-5
                space-y-4
              "
            >
              <Link
                to="/"
                onClick={closeMenu}
                className="
                  block
                  px-4
                  font-medium
                  text-gray-700
                  hover:text-[#0B4EA2]
                "
              >
                Home
              </Link>

              <Link
                to="/about"
                onClick={closeMenu}
                className="
                  block
                  px-4
                  font-medium
                  text-gray-700
                  hover:text-[#0B4EA2]
                "
              >
                About Us
              </Link>

              <Link
                to="/services"
                onClick={closeMenu}
                className="
                  block
                  px-4
                  font-medium
                  text-gray-700
                  hover:text-[#0B4EA2]
                "
              >
                Services
              </Link>

              <Link
                to="/associate-with-us"
                onClick={closeMenu}
                className="
                  block
                  px-4
                  font-medium
                  text-gray-700
                  hover:text-[#0B4EA2]
                "
              >
                Associate With Us
              </Link>

              <Link
                to="/contact"
                onClick={closeMenu}
                className="
                  block
                  px-4
                  font-medium
                  text-gray-700
                  hover:text-[#0B4EA2]
                "
              >
                Contact Us
              </Link>

              <button
                onClick={() => scrollToSection("contact")}
                className="
                  mx-4
                  w-[calc(100%-2rem)]
                  flex
                  justify-center
                  items-center
                  gap-2
                  bg-green-600
                  text-white
                  py-3
                  rounded-lg
                  font-semibold
                "
              >
                <span>Get Free Consultation</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;