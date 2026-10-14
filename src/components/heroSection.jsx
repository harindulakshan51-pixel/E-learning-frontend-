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
      className="relative -mt-[72px] sm:-mt-[88px] pt-[72px] sm:pt-[88px] min-h-[calc(100vh-1rem)] sm:min-h-screen flex items-center overflow-hidden bg-[#f4f7fa]"
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
            className={`absolute inset-0 w-full h-full object-cover object-[right_center] sm:object-[center_30%] lg:object-center transition-opacity duration-1500 ease-in-out motion-reduce:transition-none ${
              index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          />
        ))}
        {/* Adjusted gradient to show more of the image on desktop while ensuring high contrast on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/92 to-white/60 sm:from-white sm:via-white/95 sm:to-transparent w-full md:w-[60%] lg:w-[50%] z-10 pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="w-full px-5 sm:px-8 md:px-16 lg:px-24 xl:px-32 relative z-20">
        <div className="max-w-2xl py-12 sm:py-16 md:py-20">
          
          {/* Subheading */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-5 sm:w-6 h-0.5 bg-orange-400"></div>
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] uppercase text-gray-800">
              SHAPE YOUR FUTURE
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl min-[380px]:text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.12] sm:leading-[1.1] mb-4 sm:mb-6 text-gray-900 tracking-tight">
            Better Learning<br />
            <span className="text-[#0a1961]">Brighter Future</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-[480px] font-medium">
            Expert guidance. Smart strategies. Personal attention.
            Your success is our mission.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 items-center mb-8 sm:mb-12">
            <button
              onClick={() => navigate('/categories')}
              className="w-full sm:w-auto text-center bg-brand text-white px-7 sm:px-8 py-3.5 rounded-xl font-bold text-base hover:bg-brand transition-all shadow-lg shadow-accent/20 cursor-pointer active:scale-95"
            >
              Explore Courses
            </button>
          </div>

          {/* Avatars */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
            <div className="flex -space-x-3 shrink-0">
              <img className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover" src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/1777212988712-Flutter%20App%20Development.jpg" alt="Student avatar 1" />
              <img className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover" src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/1777212737123-Python%20for%20Data%20Science.jpg" alt="Student avatar 2" />
              <img className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover" src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/1777212938072-Machine%20Learning%20with%20TensorFlow.jpg" alt="Student avatar 3" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              Join 100+ Successful Students
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2.5 sm:gap-3 p-1">
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
