import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center overflow-hidden p-4 sm:p-8">
      
      {/* Background circles */}
      <div className="absolute w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] rounded-full border border-accent-100 -top-24 sm:-top-48 -left-20 sm:-left-36 animate-spin pointer-events-none" style={{animationDuration:'30s'}}></div>
      <div className="absolute w-[240px] h-[240px] sm:w-[400px] sm:h-[400px] rounded-full border border-accent-200 -bottom-16 sm:-bottom-28 -right-16 sm:-right-24 animate-spin pointer-events-none" style={{animationDuration:'20s', animationDirection:'reverse'}}></div>

      <div className="relative z-10 text-center max-w-lg w-full">
        
        {/* Tag */}
        <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest text-accent uppercase bg-accent-50 border border-accent-200 px-3.5 py-1.5 rounded-full mb-4 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Page Not Found
        </div>

        {/* 404 + Globe */}
        <div className="relative inline-block mb-3 sm:mb-4">
          <h1 className="text-7xl min-[380px]:text-8xl sm:text-9xl md:text-[12rem] font-extrabold text-slate-100 leading-none select-none tracking-tight" style={{fontFamily:'system-ui'}}>
            404
          </h1>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 sm:gap-2">
            <svg className="animate-bounce w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="36" r="30" fill="var(--color-accent-100)" stroke="var(--color-accent-300)" strokeWidth="1.5"/>
              <ellipse cx="36" cy="36" rx="14" ry="30" fill="none" stroke="var(--color-accent)" strokeWidth="1.2"/>
              <ellipse cx="36" cy="36" rx="30" ry="10" fill="none" stroke="var(--color-accent)" strokeWidth="1.2"/>
              <circle cx="36" cy="36" r="5" fill="var(--color-accent)" opacity="0.7"/>
              <circle cx="36" cy="36" r="2.5" fill="var(--color-accent)"/>
            </svg>
            <div className="w-10 sm:w-14 h-1.5 sm:h-2 bg-slate-200 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">
          Seems you've{' '}
          <span className="bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">
            lost the path.
          </span>
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-10">
          The learning path has taken an unexpected turn.<br className="hidden sm:inline" />
          The curriculum you're seeking isn't here.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent transition-all hover:-translate-y-0.5 shadow-lg shadow-accent-200 text-sm sm:text-base"
          >
            Back to Courses
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <Link
            to="/categories"
            className="px-6 sm:px-7 py-3 bg-white text-accent font-medium rounded-full border-2 border-accent-200 hover:bg-accent-50 transition-all hover:-translate-y-0.5 text-center text-sm sm:text-base"
          >
            Browse Catalog
          </Link>
        </div>

        {/* Dots */}
        <div className="flex gap-2 justify-center mt-6 sm:mt-8">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{animationDelay:'0s'}}></span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-300 animate-bounce" style={{animationDelay:'0.2s'}}></span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{animationDelay:'0.4s'}}></span>
        </div>
      </div>
    </div>
  );
}