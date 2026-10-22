import { DEFAULT_PROFILE_IMAGE } from '../utils/images';
import { useNavigate } from "react-router-dom";
import "./about-hero.css";

export default function AboutUsPage() {

  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/categories"); 
  };

  const stats = [
    { num: "10K+", label: "Students Worldwide" },
    { num: "4.9/5", label: "Average Rating" },
    { num: "95%", label: "Hire Rate" },
  ];

  const missions = [
    {
      title: "Curated Curriculum",
      desc: "Every program is hand-crafted by industry experts with decades of real-world experience.",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6 text-white" viewBox="0 0 24 24">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      title: "High-Fidelity Instruction",
      desc: "We hold our instructors to the highest standards — every lesson must elevate the craft.",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6 text-white" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      ),
    },
    {
      title: "Community First",
      desc: "From Silicon Valley to London, our learners define the digital economy together.",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6 text-white" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      title: "Career Outcomes",
      desc: "95% of our graduates secure roles in their target industry within 6 months.",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6 text-white" viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  const team = [
    {
      initials: "DP",
      name: "Daniel Perera",
      role: "MERN developer",
      tag: "DEVELOPMENT",
      bio: "specializes in building end-to-end web applications using JavaScript",
      students: 100,
      courses: 10,
      rating: 5,
      image: DEFAULT_PROFILE_IMAGE,
      avatarBg: "bg-accent-100",
      avatarColor: "text-accent",
      tagColor: "bg-accent",
    },
    {
      initials: "KF",
      name: "Kavindi Fernando",
      role: "UI/UX developer",
      tag: "DESIGN",
      bio: "creates intuitive, visually appealing digital interfaces by combining user research, wireframing...",
      students: 90,
      courses: 6,
      rating: 4.8,
      image: DEFAULT_PROFILE_IMAGE,
      avatarBg: "bg-accent-100",
      avatarColor: "text-accent",
      tagColor: "bg-accent",
    },
    {
      initials: "MS",
      name: "Michael Silva",
      role: "Python for Data Science",
      tag: "DEVELOPMENT",
      bio: "Learn Python programming and data analysis with real-world projects.",
      students: 200,
      courses: 20,
      rating: 5,
      image: DEFAULT_PROFILE_IMAGE,
      avatarBg: "bg-accent-100",
      avatarColor: "text-accent",
      tagColor: "bg-accent",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f9f9f9]">
      {/* Hero Banner */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 pt-4 sm:pt-8 w-full">
        <div className="about-hero">
          <div className="about-hero__decoration" aria-hidden="true" />
          <div className="about-hero__copy">
            <div className="about-hero__eyebrow">
              <span aria-hidden="true">✦</span>
              <span>About learnbridge</span>
            </div>
            <h1>
              Built by craftsmen<br />for digital masters.
            </h1>
            <p>
              Our faculty aren't just teachers — they are practitioners at the pinnacle of their craft, shaping the next generation of industry leaders.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((st) => (
            <div key={st.label} className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-4xl font-extrabold text-accent tracking-tight mb-1 sm:mb-2">{st.num}</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 py-8 sm:py-12 w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <div className="h-1.5 w-6 sm:w-8 bg-accent rounded-full"></div>
          <span className="text-accent font-bold uppercase tracking-[0.15em] text-xs">Our Mission</span>
        </div>
        <h2 className="text-2xl min-[480px]:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">Master In-Demand Industrial Skills</h2>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-3xl mb-8 sm:mb-12 leading-relaxed">
          <span className="text-brand font-semibold">learnbridge</span> was founded on a simple belief: the gap between learning and mastery shouldn't exist. We build precision-engineered paths that turn aspiration into expertise.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {missions.map((m) => (
            <div key={m.title} className="bg-white border border-slate-200 rounded-2xl sm:rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start shadow-sm hover:border-accent-200 transition-colors">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent flex items-center justify-center flex-shrink-0 shadow-inner">
                {m.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">{m.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="w-full bg-gradient-to-b from-transparent to-slate-100/50 py-10 sm:py-16 mt-4 sm:mt-8">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-1.5 w-6 sm:w-8 bg-accent rounded-full"></div>
            <span className="text-accent font-bold uppercase tracking-[0.15em] text-xs">Expert-Led Faculty</span>
          </div>
          <h2 className="text-2xl min-[480px]:text-3xl md:text-4xl font-bold text-slate-900 mb-8 sm:mb-12 tracking-tight">Meet Our Instructors</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {team.map((t) => (
              <div key={t.name} className="bg-white border border-slate-200 rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="relative h-48 sm:h-56 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-6xl font-black ${t.avatarBg} ${t.avatarColor} opacity-50`}>
                      {t.initials}
                    </div>
                  )}
                  <div className={`absolute top-3 sm:top-4 left-3 sm:left-4 ${t.tagColor} text-white text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full tracking-wider uppercase shadow-sm`}>
                    {t.tag}
                  </div>
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm text-amber-500 text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    ★ {t.rating}
                  </div>
                </div>
                
                <div className="p-5 sm:p-8 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">{t.name}</h3>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className={`w-6 h-6 rounded-full ${t.avatarBg} ${t.avatarColor} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                      {t.initials[0]}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-500">{t.role}</span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 line-clamp-3">
                    {t.bio}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-slate-100 mt-auto">
                    <div className="flex gap-4 sm:gap-6">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Students</div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900">{t.students}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Courses</div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900">{t.courses}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/categories')}
                      className="bg-accent hover:bg-accent text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer active:scale-95"
                    >
                      View Courses
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 py-10 sm:py-16 w-full">
        <div className="bg-gradient-to-r from-accent to-accent rounded-2xl sm:rounded-[32px] p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl text-center md:text-left">
          <div className="max-w-xl">
            <h2 className="text-2xl min-[480px]:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">Ready to master your craft?</h2>
            <p className="text-accent-100 text-sm sm:text-base md:text-lg">Join 10,000+ students worldwide who are building the skills that define the digital economy.</p>
          </div>
          <button 
            onClick={handleExploreClick} 
            className="w-full sm:w-auto cursor-pointer whitespace-nowrap bg-white text-accent hover:bg-slate-50 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            Explore Courses →
          </button>
        </div>
      </div>
    </div>
  );
}
