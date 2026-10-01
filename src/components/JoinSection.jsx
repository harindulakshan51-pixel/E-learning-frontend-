import { COURSE_IMAGES } from '../utils/images';
import { useNavigate } from 'react-router-dom';

export default function JoinSection() {
  const navigate = useNavigate();

  const courses = [
    {
      label: 'Web Development',
      image: COURSE_IMAGES.web,
      search: 'web development',
      rotate: '-rotate-12',
      position: 'top-4 -left-16 z-10',
      size: 'w-72 h-44', 
    },
    {
      label: 'Data Science',
      image: COURSE_IMAGES.python,
      search: 'data science',
      rotate: '-rotate-6',
      position: 'top-14 left-4 z-20',
      size: 'w-72 h-44', 
    },
    {
      label: 'UI/UX Design',
      image: COURSE_IMAGES.design,
      search: 'ui ux',
      rotate: 'rotate-12',
      position: 'top-24 left-24 z-30', 
      size: 'w-[300px] h-[190px]',
    },
  ];

  return (
    <div className="px-6 py-16 md:px-12 md:py-20 bg-[#f9fbfd] flex justify-center">
      <div className="w-full max-w-[1400px] bg-gradient-to-br from-accent to-accent rounded-[2.5rem] p-12 md:p-16 text-white flex flex-col lg:flex-row justify-between items-center gap-12 shadow-2xl relative overflow-hidden border border-accent/20">
        
        {/* Left Side Content */}
        <div className="w-full lg:w-1/2 text-left z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-300"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-100">Community</span>
          </div>

          <h2 className="text-4xl md:text-[2.75rem] font-black mb-6 leading-[1.1] tracking-tight">
            Join a community of <br className="hidden md:block" /> digital craftsmen.
          </h2>
          <p className="text-accent-100/90 text-lg md:text-lg mb-10 max-w-md leading-relaxed font-medium">
            From Silicon Valley to London, our students are defining the future of the digital economy.
          </p>

          <button
            onClick={() => navigate('/categories')}
            className="px-8 py-3.5 bg-white text-accent font-bold text-[15px] rounded-full shadow-lg hover:shadow-xl hover:bg-accent-50 transition-all duration-300 active:scale-95 mb-14 cursor-pointer"
          >
            Explore Courses
          </button>

          {/* Stats Section */}
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            {[
              { value: '10K+', label: 'Students' },
              { value: '4.9/5', label: 'Rating' },
              { value: '95%', label: 'Hire Rate' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col relative border-l border-white/10 pl-6 first:border-0 first:pl-0">
                <span className="text-[2rem] font-black leading-none mb-2 tracking-tight">{stat.value}</span>
                <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-accent-200/80">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Widened Stacked Cards */}
        <div className="relative w-full lg:w-1/2 h-[400px] flex items-center justify-center mt-10 lg:mt-0">
          <div className="relative w-[450px] h-full"> 
            {courses.map((course, i) => (
              <div
                key={i}
                onClick={() => navigate(`/categories?search=${encodeURIComponent(course.search)}`)}
                className={`absolute ${course.position} ${course.size} ${course.rotate} 
                rounded-[1.5rem] overflow-hidden border-4 border-accent/80 cursor-pointer 
                hover:scale-105 hover:z-50 hover:rotate-0 transition-all duration-500 
                shadow-2xl group`}
              >
                <img
                  src={course.image}
                  alt={course.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f25]/90 via-[#0a0f25]/40 to-transparent flex items-end p-5">
                  <span className="text-white text-base font-bold tracking-wide drop-shadow-md">{course.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}