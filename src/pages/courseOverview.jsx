import { DEFAULT_COURSE_IMAGE } from '../utils/images';
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import Loader from "../components/loader";
import EnrollCourse from "../components/EnrollCourse";

export default function ProductOverview() {
  const params = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState("loading");
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    axios
      .get(`${backendUrl}/courses/${params.courseId}`)
      .then((response) => {
        setCourse(response.data);
        setStatus("success");
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error("Course not found");
        setStatus("error");
      });
  }, [params.courseId]);

  // Animation Variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const fadeLeftVariant = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const scaleUpVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {status === "loading" && (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {status === "error" && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="w-full h-[60vh] flex flex-col items-center justify-center p-4 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800">Oops! Course Not Found</h1>
          <p className="text-gray-500 mt-2">Please try again.</p>
        </Motion.div>
      )}

      {status === "success" && course && (
        <Motion.main
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          className="pt-6 sm:pt-10 lg:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          
          <div className="lg:col-span-8 space-y-8 sm:space-y-12">
            {/* Header Section */}
            <Motion.section variants={fadeUpVariant} className="space-y-4">
              <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                <span className="hover:text-accent cursor-pointer" onClick={() => navigate("/")}>Course Catalog</span>
                <span>/</span>
                <span className="hover:text-accent cursor-pointer">{course.category || "General"}</span>
                <span>/</span>
                <span className="text-gray-900 truncate max-w-[160px] sm:max-w-[280px] inline-block align-bottom font-medium">{course.title}</span>
              </nav>
              
              <h1 className="text-2xl min-[480px]:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900">
                {course.title}
              </h1>
              
              <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-normal">
                {course.description || "Learn from the best and master your skills with our professional curriculum."}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                  <span className="font-bold text-orange-600">⭐ 4.9</span>
                  <span className="text-xs text-orange-500 ml-1">(1.2k ratings)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                   <span>👨‍🏫 By {course.instructor || "Expert Instructor"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <span>👥 100+ students enrolled</span>
                </div>
              </div>
            </Motion.section>

            {/* Thumbnail Section */}
            <Motion.section variants={scaleUpVariant} className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-gray-100 border border-gray-100">
              <img 
                src={course.thumbnail || DEFAULT_COURSE_IMAGE}
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            </Motion.section>
          </div>

          {/* Sidebar Section */}
          <Motion.aside variants={fadeLeftVariant} className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100">
                <div className="space-y-6">
                  {isEnrolled ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                        <span>✓</span> Enrolled
                      </span>
                      <p className="text-xs text-gray-500 font-medium">
                        You have full access to this course.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-4xl font-black text-gray-900">LKR. {course.price}</span>
                      {course.labelledPrice && (
                        <>
                          <span className="text-gray-400 line-through text-base sm:text-lg">LKR. {course.labelledPrice}</span>
                          <span className="text-orange-600 font-bold text-xs sm:text-sm bg-orange-50 px-2 py-1 rounded-lg ml-auto">
                            {Math.round(((course.labelledPrice - course.price) / course.labelledPrice) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <EnrollCourse courseId={course.courseId} onEnrollmentChange={setIsEnrolled} />

                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <p className="font-bold text-xs uppercase tracking-widest text-gray-400">This course includes:</p>
                    <ul className="space-y-3">
                      {[
                        "Lifetime access to content", 
                        "Professional resources", 
                        "Access on mobile and desktop"
                      ].map(item => (
                        <li key={item} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-600">
                          <span className="text-accent text-base sm:text-lg leading-none">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Motion.aside>
          
        </Motion.main>
      )}
    </div>
  );
}
