import { DEFAULT_COURSE_IMAGE } from '../utils/images';
import { useState } from "react";
import { getCart, addToCart } from "../utils/cart";
import { BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom"; 
import { motion as Motion } from "framer-motion";

export default function CartPage() {
    const [cart, setCart] = useState(getCart());

    const handleRemoveItem = (item) => {
        addToCart(item, -item.quantity);
        setCart(getCart());
    };

    // Animation Variants
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const fadeLeftVariant = {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="pt-6 sm:pt-12 md:pt-20 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <Motion.div
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-6 sm:mb-10"
                >
                    <h1 className="text-2xl min-[480px]:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Ready to Learn?
                    </h1>
                    <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                        {cart.length > 0 ? `${cart.length} Course${cart.length > 1 ? 's' : ''} in Cart` : "Your cart is waiting to be filled with knowledge."}
                    </p>
                </Motion.div>

                {cart.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                        
                        {/* Left Column: Course Items */}
                        <Motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-8 space-y-4 sm:space-y-6"
                        >
                            {cart.map((item) => (
                                <Motion.div
                                    variants={fadeUpVariant}
                                    key={item.courseId} 
                                    className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all hover:shadow-md"
                                >
                                    {/* Course Thumbnail */}
                                    <div className="w-full sm:w-48 aspect-video shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                        <img 
                                            src={item.thumbnail || DEFAULT_COURSE_IMAGE}
                                            alt={item.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>

                                    {/* Course Details */}
                                    <div className="flex flex-col flex-1 text-left justify-center min-w-0">
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">{item.title}</h2>
                                        <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">
                                            By {item.instructor || "Expert Instructor"}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-accent-50 text-accent px-2.5 py-1 rounded-md">
                                                Digital Course
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price & Remove Action */}
                                    <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-4 sm:border-l sm:border-gray-100 sm:pl-6 w-full sm:w-auto pt-3 sm:pt-0 border-t border-gray-100 sm:border-t-0 shrink-0">
                                        <p className="text-xl sm:text-2xl font-black text-gray-900">
                                            LKR. {item.price.toFixed(2)}
                                        </p>
                                        <button 
                                            onClick={() => handleRemoveItem(item)}
                                            className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1.5 sm:gap-2 transition-colors active:scale-95 cursor-pointer"
                                        >
                                            <BsTrash className="text-base sm:text-lg" />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </Motion.div>
                            ))}
                        </Motion.div>

                        {/* Right Column: Order Summary */}
                        <Motion.div
                            variants={fadeLeftVariant}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-4"
                        >
                            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 lg:sticky lg:top-28">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Total</h2>
                                
                                <div className="space-y-5 sm:space-y-6">
                                    <div className="flex justify-between items-end">
                                        <h2 className="text-2xl sm:text-4xl font-black text-accent">
                                            LKR. {cart.reduce((acc, cv) => acc + (cv.price * cv.quantity), 0).toFixed(2)}
                                        </h2>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <Link 
                                            to="/checkout"
                                            state={{ cart }}
                                            className="w-full flex justify-center py-3.5 sm:py-4 bg-accent text-white font-extrabold rounded-2xl text-base sm:text-lg hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/30 text-center"
                                        >
                                            Checkout
                                        </Link>
                                    </div>

                                    {/* Trust Badges */}
                                    <ul className="space-y-2.5 sm:space-y-3 pt-4 border-t border-gray-100">
                                        {[
                                            "Full Lifetime Access", 
                                            "Access on mobile and desktop", 
                                            "Certificate of completion",
                                        ].map(badge => (
                                            <li key={badge} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600 font-medium">
                                                <span className="text-accent font-bold">✓</span> {badge}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Motion.div>

                    </div>
                ) : (
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center border border-gray-100 max-w-lg mx-auto shadow-sm">
                        <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4 text-accent text-2xl">
                            🛒
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 text-sm mb-6">Explore our courses and start learning today!</p>
                        <Link 
                            to="/categories" 
                            className="bg-accent text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent/90 transition shadow-sm active:scale-95 inline-block"
                        >
                            Browse Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
