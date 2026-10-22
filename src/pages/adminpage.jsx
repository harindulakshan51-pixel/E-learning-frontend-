import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { IoCalendarClear } from "react-icons/io5";
import { BiSolidVideos } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { FiMenu, FiX } from "react-icons/fi";
import { LOGO_IMAGE } from '../utils/images';

import AdminCoursePage from "./admin/adminCoursePage";
import AdminAddCoursePage from './admin/adminAddCoursePage';
import AdminUpdateCoursePage from './admin/adminUpdateCoursePage';
import AdminAccessCodes from './admin/adminAccessCodes';
import AdminEnrollments from './admin/adminEnrollments';
import AdminUsersPage from './admin/adminUsersPage';
import AdminVideosPage from "./admin/adminVideosPage";
import AdminTeachersPage from "./admin/adminTeachersPage";

export default function Admin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileMenuOpen(false);
  }

  const navLinkClass = ({ isActive }) =>
    `h-[48px] w-full md:w-[96%] mx-auto flex items-center gap-4 px-5 rounded-xl transition-all duration-300 text-sm font-medium ${
      isActive
        ? "bg-accent text-white shadow-md shadow-accent/40"
        : "text-slate-400 hover:bg-slate-800 hover:text-white md:hover:translate-x-1"
    }`;

  const navLinks = [
    { to: "/admin/", label: "Access Codes", icon: <MdDashboard size={20} />, end: true },
    { to: "/admin/enrollments", label: "Enrollments", icon: <FaUsers size={20} /> },
    { to: "/admin/courses", label: "Courses", icon: <IoCalendarClear size={20} /> },
    { to: "/admin/videos", label: "Videos", icon: <BiSolidVideos size={20} /> },
    { to: "/admin/users", label: "Users", icon: <FaUsers size={20} /> },
    { to: "/admin/teachers", label: "Teachers", icon: <GiTeacher size={20} /> },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* ── Mobile Top Header ── */}
      <div className="md:hidden bg-[#0B1120] text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <Link className="flex items-center gap-2.5" to="/">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-md">
            <img src={LOGO_IMAGE} alt="" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">learnbridge <span className="text-xs text-accent-300 font-normal">Admin</span></span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          aria-label={mobileMenuOpen ? "Close admin menu" : "Open admin menu"}
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1120] px-4 py-4 border-b border-slate-800 space-y-1.5 z-40">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Admin Navigation</p>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              end={link.end}
              className={navLinkClass}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
          <div className="pt-2 mt-2 border-t border-slate-800">
            <Link to="/" className="flex items-center gap-2 px-5 py-2.5 text-xs text-slate-400 hover:text-white transition">
              ← Back to Main Website
            </Link>
          </div>
        </div>
      )}

      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-[260px] bg-[#0B1120] flex-col z-50 shadow-2xl border-r border-slate-800/50">
        <Link
          className="w-full h-[70px] flex items-center gap-3 px-8 border-b border-slate-800/80 shrink-0 group"
          to="/"
        >
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-md shadow-accent/40 group-hover:scale-105 transition-transform">
            <img src={LOGO_IMAGE} alt="" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-white font-bold text-xl tracking-wide"><span>learnbridge</span></span>
        </Link>

        <div className="py-6 flex flex-col flex-1 overflow-hidden">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-6">Main Menu</p>
          <nav className="flex flex-col gap-2 flex-1 overflow-y-auto px-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                end={link.end}
                className={navLinkClass}
                to={link.to}
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="md:ml-[260px] flex-1 min-w-0 md:h-screen overflow-y-auto bg-slate-50/50">
        <Routes>
          <Route path="/" element={<AdminAccessCodes />} />
          <Route path="/enrollments" element={<AdminEnrollments />} />
          <Route path="/courses" element={<AdminCoursePage />} />
          <Route path="/update-course" element={<AdminUpdateCoursePage />} />
          <Route path="/videos" element={<AdminVideosPage />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/teachers" element={<AdminTeachersPage />} />
          <Route path="/add-course" element={<AdminAddCoursePage />} />
        </Routes>
      </div>
    </div>
  );
}
