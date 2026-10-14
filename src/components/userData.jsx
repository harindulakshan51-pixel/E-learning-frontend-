import { DEFAULT_PROFILE_IMAGE } from '../utils/images';
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function UserData({ mobile = false, onAction }) {
  const [user, setUser] = useState(null);
  // state of dropdown open/close
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios.get(import.meta.env.VITE_BACKEND_URL + "/users/")
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  // Shared profile image from the configured storage project
  const defaultImage = DEFAULT_PROFILE_IMAGE;

  const handleLogout = async () => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/logout");
    } catch {
      // ignore
    }
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (mobile) {
    if (user) {
      return (
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-3 px-1 py-1">
            <img
              referrerPolicy="no-referrer"
              src={user.image || defaultImage}
              onError={(e) => { if (e.target.src !== defaultImage) e.target.src = defaultImage; }}
              className="w-10 h-10 rounded-full object-cover border-2 border-accent-100 shadow-sm"
              alt="User profile"
            />
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{user.firstName} {user.lastName || ''}</p>
              <p className="text-xs text-slate-400 truncate">{user.email || 'Student'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-center py-2.5 px-4 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <Link
          to="/login"
          onClick={onAction}
          className="w-full text-center py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:text-accent hover:border-accent font-bold text-sm transition-all"
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={onAction}
          className="w-full text-center py-2.5 px-4 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent transition-all shadow-sm active:scale-95"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div className="flex flex-row items-center relative">
          <img referrerPolicy="no-referrer"
            src={user.image || defaultImage} 
            onError={(e) => { if (e.target.src !== defaultImage) e.target.src = defaultImage; }} // Fallback if image link is broken
            className="w-[42px] h-[42px] rounded-full object-cover border-2 border-accent-100 shadow-sm cursor-pointer hover:border-accent-300 transition-colors" 
            alt="User profile"
            onClick={() => setIsOpen(!isOpen)} 
          />
          
          <div className="relative ml-2">
            {/* name and arrow */}
            <div 
              className="flex items-center text-slate-700 font-semibold cursor-pointer select-none hover:text-accent transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {user.firstName}
              <svg 
                className={`w-4 h-4 ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            {/* Dropdown Menu with Framer Motion */}
            <AnimatePresence>
              {isOpen && (
                <Motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-3 w-40 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50 origin-top-right"
                >
                  <button 
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                    onClick={async () => {
                      await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/logout");
                      sessionStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                  >
                    Logout
                  </button>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-5">
          <Link to="/login" className="text-slate-600 hover:text-accent font-bold text-base transition-all">
            Login
          </Link>
          <Link to="/register" className="bg-accent text-white px-3 sm:px-7 py-2.5 rounded-xl font-bold text-base hover:bg-accent transition-all duration-200 shadow-sm active:scale-95">
            Sign Up
          </Link>
        </div>
      )}
    </>
  );
}
