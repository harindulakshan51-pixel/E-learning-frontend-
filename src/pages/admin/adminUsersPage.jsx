import { DEFAULT_PROFILE_IMAGE } from '../../utils/images';
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { FiSearch, FiCheck, FiX, FiShield, FiUser } from "react-icons/fi"; // Added Modern Icons
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/users/all", {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          setUsers(response.data);
          setLoaded(true);
        });
    }
  }, [loaded]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-12 flex flex-col font-sans">
      
      {/* ── Page Header ── */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-sm font-medium">Monitor and manage all system users in real-time.</p>
        </div>

        {/* Search Bar (UI Only) */}
        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2.5 w-full md:w-64 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="w-full bg-white rounded-2xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden">
        {loaded ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              
              {/* Table Head */}
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">User Profile</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email Address</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                            <FiUser className="text-slate-400" size={24} />
                          </div>
                          <p className="text-slate-800 font-semibold">No users found</p>
                          <p className="text-slate-500 text-sm">There are currently no registered users.</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/50 transition-colors duration-200 group"
                    >
                      {/* User Profile (Image + Name) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0">
                            <img
                              referrerPolicy="no-referrer"
                              src={user.image || DEFAULT_PROFILE_IMAGE}
                              alt="profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 text-sm block">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              ID: {user._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td className="px-6 py-4">
                        <span className="text-slate-600 text-sm font-medium">
                          {user.email}
                        </span>
                      </td>

                      {/* Role (Admin vs User) */}
                      <td className="px-6 py-4">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 bg-accent-50 text-accent border border-accent-100 px-3 py-1 rounded-full text-xs font-semibold">
                            <FiShield size={12} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                            <FiUser size={12} />
                            Student
                          </span>
                        )}
                      </td>

                      {/* Status (Blocked vs Active) */}
                      <td className="px-6 py-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-full text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions (Block/Unblock) */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={async () => {
                            try {
                              await axios.put(
                                import.meta.env.VITE_BACKEND_URL +
                                  "/users/block/" +
                                  user.email,
                                {},
                                {
                                  headers: {
                                    Authorization:
                                      "Bearer " +
                                      sessionStorage.getItem("token"),
                                  },
                                }
                              );
                              setLoaded(false); // Trigger refresh
                              toast.success(
                                user.isBlocked ? "User unblocked" : "User blocked"
                              );
                            } catch (e) {
                              console.error(e);
                              toast.error("Action failed");
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            user.isBlocked
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          }`}
                        >
                          {user.isBlocked ? (
                            <>
                              <FiCheck size={14} />
                              Unblock
                            </>
                          ) : (
                            <>
                              <FiX size={14} />
                              Block
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full h-80 flex items-center justify-center">
            <Loader />
          </div>
        )}
      </div>

    </div>
  );
}
