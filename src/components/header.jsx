import { Link, useNavigate, useLocation } from "react-router-dom";
import UserData from "./userData";
import { useState, useEffect, useRef } from "react";
import { LOGO_IMAGE } from '../utils/images';
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";

// Header background opacity: 0 = transparent, 0.5 = 50%, 1 = solid white.
// Text, logo, and buttons remain fully visible.
const HEADER_BACKGROUND_OPACITY = 0.3;

export default function Header() {
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileMenuOpen(false);
  }

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleSearch = (value) => {
    if (value.trim() === "") {
      navigate("/categories");
    } else {
      navigate(`/categories?search=${encodeURIComponent(value)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleIconClick = () => {
    handleSearch(query);
  };

  return (
    <header className="relative z-50">
      <nav
        style={{ backgroundColor: `rgba(255, 255, 255, ${HEADER_BACKGROUND_OPACITY})` }}
        className="relative mt-2 mx-2 md:mx-4 backdrop-blur-md shadow-sm border border-gray-100 rounded-2xl flex justify-between items-center px-4 sm:px-8 h-16 sm:h-20"
      >
        {/* Brand & Desktop Links */}
        <div className="flex items-center gap-6 lg:gap-12 min-w-0">
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2 text-xl sm:text-3xl font-black text-accent tracking-tight">
              <img src={LOGO_IMAGE} alt="Scholarly logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0" />
              <span className="text-brand">learnbridge</span>
            </Link>
          </div>

          <div className="hidden md:flex gap-6 lg:gap-8 items-center">
            <Link to="/categories" className="text-slate-600 hover:text-accent font-bold text-base transition-all">
              Categories
            </Link>
            <Link to="/about" className="text-slate-600 hover:text-accent font-bold text-base transition-all">
              About
            </Link>
          </div>
        </div>

        {/* Desktop Right (Search Box, My Courses, User Data) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
          {/* Search Box */}
          <div className="hidden lg:flex items-center bg-gray-100/80 px-4 py-2.5 xl:py-3 rounded-full border border-gray-200/50 hover:bg-gray-100 transition-colors gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-accent transition-colors"
              onClick={handleIconClick}
              aria-label="Submit search"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              className="bg-transparent border-none outline-none text-base w-44 xl:w-56 text-gray-700 placeholder-gray-400"
              placeholder="Search for craft..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <Link to="/myLearning" className="text-accent font-bold text-sm whitespace-nowrap hover:opacity-80 transition-opacity">
            My Courses
          </Link>

          <div className="h-6 w-px bg-gray-200"></div>

          <div className="flex items-center">
            <UserData />
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2.5 rounded-xl text-slate-700 hover:text-accent hover:bg-white/80 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6 text-slate-800" />
            ) : (
              <FiMenu className="w-6 h-6 text-slate-800" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer / Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <Motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 mx-2 bg-white/98 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-2xl p-5 z-50 flex flex-col gap-4"
          >
            {/* Mobile Search */}
            <div className="flex items-center bg-gray-100/90 px-3.5 py-2.5 rounded-xl border border-gray-200 gap-2 focus-within:border-accent focus-within:bg-white transition-all">
              <FiSearch className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                className="bg-transparent border-none outline-none text-sm w-full text-gray-800 placeholder-gray-400"
                placeholder="Search for craft..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(query);
                    setMobileMenuOpen(false);
                  }
                }}
              />
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    handleSearch(query);
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs bg-accent text-white px-2.5 py-1 rounded-lg font-bold shrink-0"
                >
                  Go
                </button>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-slate-700 hover:text-accent hover:bg-slate-50 font-bold text-base transition-colors"
              >
                Categories
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-slate-700 hover:text-accent hover:bg-slate-50 font-bold text-base transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/myLearning"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-accent hover:bg-accent-50 font-bold text-base transition-colors flex items-center justify-between"
              >
                <span>My Courses</span>
                <span className="text-xs bg-accent-100 text-accent px-2.5 py-0.5 rounded-full font-bold">
                  Enrolled
                </span>
              </Link>
            </nav>

            <div className="h-px bg-gray-100 w-full"></div>

            {/* Mobile Auth / User Info */}
            <UserData mobile onAction={() => setMobileMenuOpen(false)} />
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
