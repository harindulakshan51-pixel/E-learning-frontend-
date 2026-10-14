import { DEFAULT_COURSE_IMAGE } from '../../utils/images';
import axios from "axios";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import CourseDeleteButton from "../../components/courseDeleteButton";

export default function AdminCoursePage() {
  const [course, setProducts] = useState([]);
  const [loaded, setloaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/courses")
        .then((response) => {
          console.log(response.data);
          setProducts(response.data);
          setloaded(true);
        });
    }
  }, [loaded]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-12 flex flex-col font-sans">
      
      {/* ── Page Header ── */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Course Management</h1>
          <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-sm font-medium">Create, update, and manage your educational content.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar (UI Only) */}
          <div className="relative group hidden sm:block">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2.5 w-full md:w-64 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>

          {/* Add Course Button */}
          <Link
            to="/admin/add-course"
            className="flex items-center gap-2 bg-accent text-white px-4 sm:px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-accent/30 hover:bg-accent hover:shadow-accent/40 transition-all duration-300 hover:-translate-y-0.5 text-sm"
          >
            <BiPlus size={20} />
            Add Course
          </Link>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="w-full bg-white rounded-2xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden">
        {loaded ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              
              {/* Table Head */}
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Thumbnail</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Course ID</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Title</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Labelled Price</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Instructor</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Duration</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {course.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="py-24 text-center">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                            <span className="text-2xl">📚</span>
                          </div>
                          <p className="text-slate-800 font-semibold">No courses found</p>
                          <p className="text-slate-500 text-sm">Click 'Add Course' to create your first course.</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  course.map((item) => (
                    <tr
                      key={item.courseId}
                      className="hover:bg-slate-50/50 transition-colors duration-200 group"
                    >
                      {/* Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="w-[50px] h-[50px] rounded-lg overflow-hidden border border-slate-200 shadow-sm group-hover:shadow transition-all">
                          <img
                            src={item.thumbnail || DEFAULT_COURSE_IMAGE}
                            className="w-full h-full object-cover"
                            alt="thumbnail"
                          />
                        </div>
                      </td>

                      {/* Course ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold bg-slate-100/80 text-slate-600 px-2.5 py-1.5 rounded-md border border-slate-200/60">
                          {item.courseId}
                        </span>
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4 font-semibold text-slate-800 text-sm">
                        {item.title}
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        <div className="max-w-[200px] truncate" title={item.description}>
                          {item.description}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        LKR. {item.price}
                      </td>

                      {/* Labelled Price */}
                      <td className="px-6 py-4 text-slate-400 line-through text-sm">
                        LKR. {item.labelledPrice}
                      </td>

                      {/* Instructor */}
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {item.instructor}
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
                          {item.duration}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        <span className="bg-accent-50 text-accent px-2.5 py-1 rounded-md text-xs font-medium">
                          {item.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              navigate("/admin/update-course", {
                                state: item,
                              });
                            }}
                            className="p-2 text-slate-400 hover:text-accent hover:bg-accent-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Course"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <CourseDeleteButton
                            courseId={item.courseId}
                            onSuccess={() => setloaded(false)}
                          />
                        </div>
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
