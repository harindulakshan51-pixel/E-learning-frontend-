import { useNavigate } from 'react-router-dom';
import { HERO_IMAGE } from '../utils/images';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative -mt-[88px] pt-[88px] min-h-screen flex items-center overflow-hidden bg-[#f4f7fa]">
      {/* Background Image and Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Hero Background"
          className="w-full h-full object-cover object-[center_30%] lg:object-center"
        />
        {/* Adjusted gradient to show more of the image (reduced width from 65% to 50%) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent w-full md:w-[60%] lg:w-[50%]"></div>
      </div>

      {/* Changed to w-full with padding instead of max-w-7xl mx-auto to move text more to the left */}
      <div className="w-full px-8 md:px-16 lg:px-24 xl:px-32 relative z-10">
        <div className="max-w-2xl py-20">
          
          {/* Subheading */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-0.5 bg-orange-400"></div>
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-gray-800">
              SHAPE YOUR FUTURE
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.1] mb-6 text-gray-900 tracking-tight">
            Better Learning.<br />
            <span className="text-[#0a1961]">Brighter Future.</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-[480px] font-medium">
            Expert guidance. Smart strategies. Personal attention.
            Your success is our mission.
          </p>

          {/* Buttons (Removed Watch Video button) */}
          <div className="flex flex-wrap gap-4 items-center mb-12">
            <button
              onClick={() => navigate('/categories')}
              className="bg-[#0a1961] text-white px-8 py-3.5 rounded-lg font-bold text-base hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
            >
              Explore Courses
            </button>
          </div>

          {/* Avatars */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/1777213154040-Blockchain%20Development%20with%20Solidity.jpg" alt="Student" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/1777212737123-Python%20for%20Data%20Science.jpg" alt="Student" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/1777212938072-Machine%20Learning%20with%20TensorFlow.jpg" alt="Student" />
            </div>
            <span className="text-sm font-semibold text-gray-600">
              Join 5000+ Successful Students
            </span>
          </div>
        </div>
      </div>

      {/* Floating Card (Right Side) - Changed content */}
      <div className="hidden lg:flex absolute right-12 xl:right-24 top-[45%] -translate-y-1/2 z-20 bg-white rounded-2xl p-6 shadow-2xl flex-col items-center w-[160px]">
        <div className="text-[#0a1961] text-4xl font-black mb-1">100+</div>
        <div className="text-[10px] font-bold text-gray-500 text-center uppercase tracking-widest mb-3 leading-tight">
          Premium<br />Lessons
        </div>
        <div className="w-8 h-8 text-yellow-500">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12,3L1,9L4,10.63V17.5C4,18.88 7.58,20 12,20C16.42,20 20,18.88 20,17.5V10.63L23,9L12,3M12,5.28L18.44,8.83L12,12.37L5.56,8.83L12,5.28M4,12.27L10,15.56V17.5C10,18 10.9,18.5 12,18.5C13.1,18.5 14,18 14,17.5V15.56L20,12.27V17.5C20,18.33 16.42,19.5 12,19.5C7.58,19.5 4,18.33 4,17.5V12.27Z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
