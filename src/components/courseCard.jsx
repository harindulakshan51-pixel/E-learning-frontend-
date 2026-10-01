import { DEFAULT_COURSE_IMAGE } from '../utils/images';
import { useNavigate, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion'; // <-- Added Framer Motion

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  if (!course) return null;

  // Individual Card Animation Variant
  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    // Motion div for Framer Motion, h-full to keep height equal inside grid
    <Motion.div variants={cardVariant} className="h-full">
      <div 
        // Added 'h-full' to the standard Tailwind classes to ensure all cards stretch evenly 
        className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer border border-gray-100 w-full h-full max-w-[380px]"
        onClick={() => navigate(`/overview/${course.courseId}`)}
      >
        {/* Course Image Section */}
        <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6 bg-gray-100 shrink-0">
          <img 
            src={course.thumbnail || DEFAULT_COURSE_IMAGE}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Badge */}
          <span className="absolute top-4 left-4 bg-accent text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
            {course.category || "Design Faculty"}
          </span>
        </div>

        {/* Course Details Section */}
        <div className="px-2 flex flex-col flex-grow">
          {/* Course Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          {/* Instructor Section */}
          <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center overflow-hidden">
                  <span className="text-xs font-bold text-accent">
                      {course.instructor?.charAt(0) || "I"}
                  </span>
              </div>
              <p className="text-gray-500 text-sm font-medium">{course.instructor}</p>
          </div>

          {/* Divider (mt-auto forces this and bottom part to the bottom) */}
          <div className="w-full h-[1px] bg-gray-100 mb-6 mt-auto"></div>

          {/* Pricing and Action Button */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tuition</span>
              <span className="text-2xl font-black text-gray-900">
                LKR.{course.price}
              </span>
            </div>
            
            <Link to={"/overview/"+ course.courseId} onClick={(e) => e.stopPropagation()} className="bg-accent text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-accent hover:shadow-lg transition-all active:scale-95">
              View Course
            </Link>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}
