import { useEffect, useState } from "react";
import TopBar from "./TopBar";

import { Menu, X, ArrowRight } from "lucide-react";

import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

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

  // REDIRECT TO /contact AND SCROLL TO TOP
  const handleConsultation = () => {
    navigate("/contact");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {showTopBar && <TopBar />}

      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 font-['Inter',sans-serif] ${
          scrolled ? "shadow-md" : "shadow-xs"
        }`}
      >
        <style>{`
          /* 1. Laptop Screens (1024px to 1439px) */
          @media (min-width: 1024px) and (max-width: 1439px) {
            .nav-container {
              max-width: 1400px !important;
              padding-left: 2rem !important;
              padding-right: 2rem !important;
            }
            .nav-links {
              gap: 2rem !important;
              font-size: 0.9rem !important;
            }
            .nav-btn {
              padding: 0.6rem 1.35rem !important;
              font-size: 0.875rem !important;
            }
          }

          /* 2. Standard Desktop (1440px x 900px) */
          @media (min-width: 1440px) {
            .nav-container {
              max-width: 1420px !important;
              padding-left: 2.25rem !important;
              padding-right: 2.25rem !important;
            }
            .nav-row {
              height: 4.75rem !important;
            }
            .nav-logo-title {
              font-size: 1.25rem !important;
            }
            .nav-links {
              gap: 2.5rem !important;
              font-size: 0.95rem !important;
            }
            .nav-btn {
              padding: 0.65rem 1.45rem !important;
              font-size: 0.9rem !important;
            }
          }

          /* 3. Large Desktop (1920px x 1080px Full HD) - 1440px jaise perfectly balanced */
          @media (min-width: 1920px) {
            .nav-container {
              max-width: 1800px !important;
              padding-left: 3.5rem !important;  /* 👈 Balanced proportional padding */
              padding-right: 3.5rem !important;
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
              gap: 3.25rem !important;
              font-size: 1.1rem !important;
            }
            .nav-btn {
              padding: 0.85rem 1.75rem !important;
              font-size: 1.1rem !important;
              border-radius: 9999px !important;
            }
            .nav-btn-icon {
              width: 1.25rem !important;
              height: 1.25rem !important;
            }
          }

          /* 4. 4K Ultra-Wide Desktop (3840px x 2160px) - 1440px jaise perfectly balanced */
          @media (min-width: 3840px) {
            .nav-container {
              max-width: 3200px !important;
              padding-left: 5.5rem !important;  /* 👈 Balanced proportional padding */
              padding-right: 5.5rem !important;
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
              border-radius: 9999px !important;
            }
            .nav-btn-icon {
              width: 2.25rem !important;
              height: 2.25rem !important;
            }
          }
        `}</style>

        {/* MAIN CONTAINER */}
        <div className="nav-container w-full max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nav-row h-16 sm:h-20 flex items-center justify-between">
            
            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2.5 sm:gap-3 shrink-0"
            >
              <img
                src={logo}
                alt="MegaClick"
                className="nav-logo-img w-10 h-10 sm:w-11 sm:h-11 rounded-full object-contain p-1 border border-blue-200 shadow-xs transition-transform duration-300 hover:scale-105"
              />

              <div className="text-left">
                <h1 className="nav-logo-title text-base sm:text-lg lg:text-xl font-bold leading-tight">
                  <span className="text-[#0B4EA2]">Mega</span>
                  <span className="text-emerald-600">Click</span>
                </h1>

                <p className="nav-logo-sub text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide">
                  Enterprises
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <nav className="nav-links hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
              {/* HOME */}
              <Link
                to="/"
                onClick={closeMenu}
                className={`relative pb-1 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
                  activePage === "/"
                    ? "after:w-full text-[#0B4EA2] font-semibold"
                    : "after:w-0 hover:after:w-full text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Home
              </Link>

              {/* ABOUT */}
              <Link
                to="/about"
                onClick={closeMenu}
                className={`relative pb-1 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
                  activePage === "/about"
                    ? "after:w-full text-[#0B4EA2] font-semibold"
                    : "after:w-0 hover:after:w-full text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                About Us
              </Link>

              {/* SERVICES */}
              <Link
                to="/services"
                onClick={closeMenu}
                className={`relative pb-1 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
                  activePage.startsWith("/services")
                    ? "after:w-full text-[#0B4EA2] font-semibold"
                    : "after:w-0 hover:after:w-full text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Services
              </Link>

              {/* ASSOCIATE WITH US */}
              <NavLink
                to="/associate-with-us"
                onClick={closeMenu}
                className={`relative pb-1 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
                  activePage === "/associate-with-us"
                    ? "after:w-full text-[#0B4EA2] font-semibold"
                    : "after:w-0 hover:after:w-full text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Associate With Us
              </NavLink>

              {/* CONTACT */}
              <Link
                to="/contact"
                onClick={closeMenu}
                className={`relative pb-1 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
                  activePage === "/contact"
                    ? "after:w-full text-[#0B4EA2] font-semibold"
                    : "after:w-0 hover:after:w-full text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Contact Us
              </Link>
            </nav>

            {/* DESKTOP GET FREE CONSULTATION BUTTON (REDIRECTS TO /contact) */}
            <button
              type="button"
              onClick={handleConsultation}
              className="nav-btn hidden lg:inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 hover:shadow-md cursor-pointer shrink-0"
            >
              <span>Get Free Consultation</span>
              <ArrowRight size={15} className="nav-btn-icon" />
            </button>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <button
              type="button"
              className="lg:hidden p-1 text-slate-800 focus:outline-none cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* MOBILE MENU ACCORDION */}
          {menuOpen && (
            <div className="lg:hidden bg-white border-t border-slate-100 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                to="/"
                onClick={closeMenu}
                className={`block px-4 py-1.5 font-semibold text-sm ${
                  activePage === "/"
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Home
              </Link>

              <Link
                to="/about"
                onClick={closeMenu}
                className={`block px-4 py-1.5 font-semibold text-sm ${
                  activePage === "/about"
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                About Us
              </Link>

              <Link
                to="/services"
                onClick={closeMenu}
                className={`block px-4 py-1.5 font-semibold text-sm ${
                  activePage.startsWith("/services")
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Services
              </Link>

              <Link
                to="/associate-with-us"
                onClick={closeMenu}
                className={`block px-4 py-1.5 font-semibold text-sm ${
                  activePage === "/associate-with-us"
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Associate With Us
              </Link>

              <Link
                to="/contact"
                onClick={closeMenu}
                className={`block px-4 py-1.5 font-semibold text-sm ${
                  activePage === "/contact"
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Contact Us
              </Link>

              <div className="pt-2 px-4">
                <button
                  type="button"
                  onClick={handleConsultation}
                  className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 rounded-xl font-semibold text-sm shadow-sm cursor-pointer"
                >
                  <span>Get Free Consultation</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;