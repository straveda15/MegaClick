
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
          /* =========================================================
             LAPTOP — KEEPING YOUR EXISTING DESIGN UNCHANGED
             1024px - 1439px
          ========================================================= */
          @media (min-width: 1024px) and (max-width: 1439px) {
            .nav-container {
              max-width: 1380px !important;
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

          /* =========================================================
             STANDARD DESKTOP — KEEPING YOUR EXISTING DESIGN UNCHANGED
             1440px
          ========================================================= */
          @media (min-width: 1440px) and (max-width: 1919px) {
            .nav-container {
              max-width: 1400px !important;
              padding-left: 2rem !important;
              padding-right: 2rem !important;
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

      
/* =========================================================
   LARGE DESKTOP
   1920px - 2199px

   Slightly wider / more outside
========================================================= */
@media (min-width: 1920px) and (max-width: 2199px) {
  .nav-container {
    max-width: 1810px !important;
    padding-left: 3rem !important;
    padding-right: 3rem !important;
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

          /* =========================================================
             EXTRA LARGE DESKTOP
             2200px - 2559px
          ========================================================= */
          @media (min-width: 2200px) and (max-width: 2559px) {
            .nav-container {
              max-width: 2050px !important;
              padding-left: 4rem !important;
              padding-right: 4rem !important;
            }

            .nav-row {
              height: 6.5rem !important;
            }

            .nav-logo-img {
              width: 4.25rem !important;
              height: 4.25rem !important;
              border-width: 1.5px !important;
            }

            .nav-logo-title {
              font-size: 1.75rem !important;
            }

            .nav-logo-sub {
              font-size: 1rem !important;
            }

            .nav-links {
              gap: 3.75rem !important;
              font-size: 1.25rem !important;
            }

            .nav-btn {
              padding: 1rem 2.15rem !important;
              font-size: 1.2rem !important;
              border-radius: 9999px !important;
            }

            .nav-btn-icon {
              width: 1.4rem !important;
              height: 1.4rem !important;
            }
          }

          /* =========================================================
             2560px - 3199px
          ========================================================= */
          @media (min-width: 2560px) and (max-width: 3199px) {
            .nav-container {
              max-width: 2300px !important;
              padding-left: 5rem !important;
              padding-right: 5rem !important;
            }

            .nav-row {
              height: 7.25rem !important;
            }

            .nav-logo-img {
              width: 5rem !important;
              height: 5rem !important;
              border-width: 2px !important;
            }

            .nav-logo-title {
              font-size: 2.1rem !important;
            }

            .nav-logo-sub {
              font-size: 1.15rem !important;
            }

            .nav-links {
              gap: 4rem !important;
              font-size: 1.4rem !important;
            }

            .nav-btn {
              padding: 1.15rem 2.6rem !important;
              font-size: 1.4rem !important;
              border-radius: 9999px !important;
            }

            .nav-btn-icon {
              width: 1.65rem !important;
              height: 1.65rem !important;
            }
          }

          /* =========================================================
             3200px - 3839px
          ========================================================= */
          @media (min-width: 3200px) and (max-width: 3839px) {
            .nav-container {
              max-width: 2850px !important;
              padding-left: 6rem !important;
              padding-right: 6rem !important;
            }

            .nav-row {
              height: 8rem !important;
            }

            .nav-logo-img {
              width: 5.75rem !important;
              height: 5.75rem !important;
              border-width: 2px !important;
            }

            .nav-logo-title {
              font-size: 2.4rem !important;
            }

            .nav-logo-sub {
              font-size: 1.3rem !important;
            }

            .nav-links {
              gap: 4.25rem !important;
              font-size: 1.6rem !important;
            }

            .nav-btn {
              padding: 1.3rem 3rem !important;
              font-size: 1.6rem !important;
              border-radius: 9999px !important;
            }

            .nav-btn-icon {
              width: 1.9rem !important;
              height: 1.9rem !important;
            }
          }

          /* =========================================================
             4K ULTRA-WIDE
             3840px+
          ========================================================= */
          @media (min-width: 3840px) {
            .nav-container {
              max-width: 3380px !important;
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
              gap: 4.5rem !important;
              font-size: 1.85rem !important;
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

          /* =========================================================
             VERY WIDE 5K / 6K / LARGE MONITORS
          ========================================================= */
          @media (min-width: 4500px) {
            .nav-container {
              max-width: 3900px !important;
              padding-left: 10rem !important;
              padding-right: 10rem !important;
            }

            .nav-row {
              height: 10rem !important;
            }

            .nav-logo-img {
              width: 7.25rem !important;
              height: 7.25rem !important;
            }

            .nav-logo-title {
              font-size: 3rem !important;
            }

            .nav-logo-sub {
              font-size: 1.65rem !important;
            }

            .nav-links {
              gap: 5rem !important;
              font-size: 2rem !important;
            }

            .nav-btn {
              padding: 1.6rem 3.75rem !important;
              font-size: 2.1rem !important;
            }

            .nav-btn-icon {
              width: 2.4rem !important;
              height: 2.4rem !important;
            }
          }

          /* =========================================================
             SMALL MOBILE
          ========================================================= */
          @media (max-width: 374px) {
            .nav-container {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }

            .nav-row {
              height: 4rem !important;
            }

            .nav-logo-img {
              width: 2.35rem !important;
              height: 2.35rem !important;
            }

            .nav-logo-title {
              font-size: 0.95rem !important;
            }

            .nav-logo-sub {
              font-size: 0.58rem !important;
            }

            .nav-logo-gap {
              gap: 0.45rem !important;
            }
          }

          /* =========================================================
             STANDARD MOBILE
          ========================================================= */
          @media (min-width: 375px) and (max-width: 639px) {
            .nav-container {
              padding-left: 1.15rem !important;
              padding-right: 1.15rem !important;
            }

            .nav-row {
              height: 4.15rem !important;
            }

            .nav-logo-img {
              width: 2.5rem !important;
              height: 2.5rem !important;
            }

            .nav-logo-title {
              font-size: 1rem !important;
            }

            .nav-logo-sub {
              font-size: 0.62rem !important;
            }
          }

          /* =========================================================
             LARGE MOBILE / SMALL TABLET
          ========================================================= */
          @media (min-width: 640px) and (max-width: 767px) {
            .nav-container {
              padding-left: 1.5rem !important;
              padding-right: 1.5rem !important;
            }

            .nav-row {
              height: 4.5rem !important;
            }

            .nav-logo-img {
              width: 2.75rem !important;
              height: 2.75rem !important;
            }

            .nav-logo-title {
              font-size: 1.1rem !important;
            }

            .nav-logo-sub {
              font-size: 0.68rem !important;
            }
          }

          /* =========================================================
             TABLET
          ========================================================= */
          @media (min-width: 768px) and (max-width: 1023px) {
            .nav-container {
              padding-left: 2rem !important;
              padding-right: 2rem !important;
            }

            .nav-row {
              height: 5rem !important;
            }

            .nav-logo-img {
              width: 3rem !important;
              height: 3rem !important;
            }

            .nav-logo-title {
              font-size: 1.2rem !important;
            }

            .nav-logo-sub {
              font-size: 0.75rem !important;
            }

            .nav-row > button {
              padding: 0.4rem !important;
            }
          }

          /* =========================================================
             MOBILE MENU RESPONSIVENESS
          ========================================================= */
          @media (max-width: 1023px) {
            .mobile-nav-menu {
              width: 100%;
              max-height: calc(100vh - 4rem);
              overflow-y: auto;
              -webkit-overflow-scrolling: touch;
            }

            .mobile-nav-link {
              min-height: 42px;
              display: flex;
              align-items: center;
            }
          }

          @media (min-width: 640px) and (max-width: 1023px) {
            .mobile-nav-menu {
              padding-left: 0.5rem;
              padding-right: 0.5rem;
            }

            .mobile-nav-link {
              font-size: 0.95rem !important;
              padding-top: 0.65rem !important;
              padding-bottom: 0.65rem !important;
            }
          }
        `}</style>

        {/* MAIN CONTAINER */}
        <div className="nav-container w-full max-w-[1400px] mx-auto px-5 sm:px-7 lg:px-10">
          <div className="nav-row h-16 sm:h-20 flex items-center justify-between">

            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMenu}
              className="nav-logo-gap flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0"
            >
              <img
                src={logo}
                alt="MegaClick"
                className="nav-logo-img w-10 h-10 sm:w-11 sm:h-11 rounded-full object-contain p-1 border border-blue-200 shadow-xs transition-transform duration-300 hover:scale-105 shrink-0"
              />

              <div className="text-left min-w-0">
                <h1 className="nav-logo-title text-base sm:text-lg lg:text-xl font-bold leading-tight whitespace-nowrap">
                  <span className="text-[#0B4EA2]">Mega</span>
                  <span className="text-emerald-600">Click</span>
                </h1>

                <p className="nav-logo-sub text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide whitespace-nowrap">
                  Enterprises
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <nav className="nav-links hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium whitespace-nowrap shrink-0">

              {/* HOME */}
              <Link
                to="/"
                onClick={closeMenu}
                className={`relative pb-1 transition-colors duration-200 shrink-0 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
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
                className={`relative pb-1 transition-colors duration-200 shrink-0 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
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
                className={`relative pb-1 transition-colors duration-200 shrink-0 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
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
                className={`relative pb-1 transition-colors duration-200 shrink-0 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
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
                className={`relative pb-1 transition-colors duration-200 shrink-0 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#0B4EA2] after:transition-all ${
                  activePage === "/contact"
                    ? "after:w-full text-[#0B4EA2] font-semibold"
                    : "after:w-0 hover:after:w-full text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Contact Us
              </Link>
            </nav>

            {/* DESKTOP GET FREE CONSULTATION BUTTON */}
            <button
              type="button"
              onClick={handleConsultation}
              className="nav-btn hidden lg:inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 hover:shadow-md cursor-pointer shrink-0"
            >
              <span>Get Free Consultation</span>
              <ArrowRight
                size={15}
                className="nav-btn-icon shrink-0"
              />
            </button>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <button
              type="button"
              className="lg:hidden p-1 text-slate-800 focus:outline-none cursor-pointer shrink-0"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* MOBILE MENU ACCORDION */}
          {menuOpen && (
            <div className="mobile-nav-menu lg:hidden bg-white border-t border-slate-100 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

              {/* HOME */}
              <Link
                to="/"
                onClick={closeMenu}
                className={`mobile-nav-link block px-4 py-1.5 font-semibold text-sm ${
                  activePage === "/"
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Home
              </Link>

              {/* ABOUT */}
              <Link
                to="/about"
                onClick={closeMenu}
                className={`mobile-nav-link block px-4 py-1.5 font-semibold text-sm ${
                  activePage === "/about"
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                About Us
              </Link>

              {/* SERVICES */}
              <Link
                to="/services"
                onClick={closeMenu}
                className={`mobile-nav-link block px-4 py-1.5 font-semibold text-sm ${
                  activePage.startsWith("/services")
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Services
              </Link>

              {/* ASSOCIATE WITH US */}
              <Link
                to="/associate-with-us"
                onClick={closeMenu}
                className={`mobile-nav-link block px-4 py-1.5 font-semibold text-sm ${
                  activePage === "/associate-with-us"
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Associate With Us
              </Link>

              {/* CONTACT */}
              <Link
                to="/contact"
                onClick={closeMenu}
                className={`mobile-nav-link block px-4 py-1.5 font-semibold text-sm ${
                  activePage === "/contact"
                    ? "text-[#0B4EA2] bg-blue-50/70 rounded-lg"
                    : "text-slate-700 hover:text-[#0B4EA2]"
                }`}
              >
                Contact Us
              </Link>

              {/* MOBILE CONSULTATION BUTTON */}
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
