import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_IMAGE } from '../utils/images';

const CAROUSEL_IMAGES = [
  HERO_IMAGE,
  'https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/hero_image2.png',
  'https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/hero_image3.png'
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Preload images
  useEffect(() => {
    CAROUSEL_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return; // Do not autoplay if reduced motion is preferred

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section 
      className="relative -mt-[88px] pt-[88px] min-h-screen flex items-center overflow-hidden bg-[#f4f7fa]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel and Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-[#f4f7fa]">
        {CAROUSEL_IMAGES.map((img, index) => (
          <img
            key={img}
            src={img}
            alt={`Hero Background ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-[center_30%] lg:object-center transition-opacity duration-1500 ease-in-out motion-reduce:transition-none ${
              index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          />
        ))}
        {/* Adjusted gradient to show more of the image (reduced width from 65% to 50%) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent w-full md:w-[60%] lg:w-[50%] z-10 pointer-events-none"></div>
      </div>

      {/* Changed to w-full with padding instead of max-w-7xl mx-auto to move text more to the left */}
      <div className="w-full px-8 md:px-16 lg:px-24 xl:px-32 relative z-20">
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
              className="bg-brand text-white px-8 py-3.5 rounded-lg font-bold text-base hover:bg-brand transition-colors shadow-lg shadow-accent/20 cursor-pointer"
            >
              Explore Courses
            </button>
          </div>

          {/* Avatars */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/1777212988712-Flutter%20App%20Development.jpg" alt="Student" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/1777212737123-Python%20for%20Data%20Science.jpg" alt="Student" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/1777212938072-Machine%20Learning%20with%20TensorFlow.jpg" alt="Student" />
            </div>
            <span className="text-sm font-semibold text-gray-600">
              Join 5000+ Successful Students
            </span>
          </div>
        </div>
      </div>

      {/* Floating Card (Right Side) */}
      {/* <div className="hidden lg:flex absolute right-12 xl:right-24 top-[45%] -translate-y-1/2 z-20 bg-white rounded-2xl p-6 shadow-2xl flex-col items-center w-[160px]">
        <div className="text-[#0a1961] text-4xl font-black mb-1">100+</div>
        <div className="text-[10px] font-bold text-gray-500 text-center uppercase tracking-widest mb-3 leading-tight">
          Premium<br />Lessons
        </div>
        <div className="w-8 h-8 text-yellow-500">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12,3L1,9L4,10.63V17.5C4,18.88 7.58,20 12,20C16.42,20 20,18.88 20,17.5V10.63L23,9L12,3M12,5.28L18.44,8.83L12,12.37L5.56,8.83L12,5.28M4,12.27L10,15.56V17.5C10,18 10.9,18.5 12,18.5C13.1,18.5 14,18 14,17.5V15.56L20,12.27V17.5C20,18.33 16.42,19.5 12,19.5C7.58,19.5 4,18.33 4,17.5V12.27Z" />
          </svg>
        </div>
      </div> */}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {CAROUSEL_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
              index === currentIndex ? 'w-8 bg-accent' : 'w-2.5 bg-gray-400/60 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
