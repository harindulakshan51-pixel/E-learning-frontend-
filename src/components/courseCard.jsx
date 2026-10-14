import { DEFAULT_COURSE_IMAGE } from '../utils/images';
import { useNavigate, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

export default function CourseCard({ course, variant }) {
  const navigate = useNavigate();

  if (!course) return null;

  // Individual Card Animation Variant
  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <Motion.div variants={cardVariant} className={variant === "home" ? "home-course-card h-full" : "h-full w-full"}>
      <div 
        className="group bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col cursor-pointer border border-gray-100 w-full h-full max-w-[380px] mx-auto sm:mx-0"
        onClick={() => navigate(`/overview/${course.courseId}`)}
      >
        {/* Course Image Section */}
        <div className="relative h-48 sm:h-64 w-full rounded-2xl overflow-hidden mb-4 sm:mb-6 bg-gray-100 shrink-0">
          <img 
            src={course.thumbnail || DEFAULT_COURSE_IMAGE}
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Badge */}
          <span className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-accent text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
            {course.category || "Design Faculty"}
          </span>
        </div>

        {/* Course Details Section */}
        <div className="px-1 sm:px-2 flex flex-col flex-grow">
          {/* Course Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-accent transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          {/* Instructor Section */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent-100 flex items-center justify-center overflow-hidden shrink-0">
                  <span className="text-xs font-bold text-accent">
                      {course.instructor?.charAt(0) || "I"}
                  </span>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm font-medium truncate">{course.instructor}</p>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-100 mb-4 sm:mb-6 mt-auto"></div>

          {/* Pricing and Action Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tuition</span>
              <span className="text-xl sm:text-2xl font-black text-gray-900 truncate">
                LKR.{course.price}
              </span>
            </div>
            
            <Link 
              to={"/overview/"+ course.courseId} 
              onClick={(e) => e.stopPropagation()} 
              className="bg-accent text-white rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 font-bold text-xs sm:text-sm hover:bg-accent hover:shadow-lg transition-all active:scale-95 shrink-0"
            >
              View Course
            </Link>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}
