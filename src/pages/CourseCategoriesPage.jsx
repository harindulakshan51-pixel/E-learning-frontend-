import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion as Motion } from "framer-motion"; // <-- Added Framer Motion
import Loader from "../components/loader";
import CourseCard from "../components/courseCard";
import CategoriesHeroSection from "../components/categoriesHeroSection";

export default function CourseCategoriesPage() {
    const [params] = useSearchParams();
    return <CategoryResults key={params.get("search") || ""} query={params.get("search") || ""} />;
}

function CategoryResults({ query }) {
    const [course, setCourse] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const [visibleCount, setVisibleCount] = useState(8);

    useEffect(() => {

        const url = query.trim() === "" 
            ? `${import.meta.env.VITE_BACKEND_URL}/courses`
            : `${import.meta.env.VITE_BACKEND_URL}/courses/search/${encodeURIComponent(query)}`;

        axios.get(url)
            .then((response) => {
                setCourse(response.data);
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                setLoaded(true);
            });
    }, [query]);

    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 8);
    };

    if (!loaded) {
        return (
            <div className="w-full min-h-[calc(100vh-100px)] flex justify-center items-center bg-gray-50">
                <Loader />
            </div>
        );
    }

    // Animation Variants
    const headerVariant = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const gridContainerVariant = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15 // Controls the delay between each card appearing
            }
        }
    };

    const buttonVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="w-full min-h-[calc(100vh-100px)] flex flex-col bg-[#f9fbfd] pt-10 pb-20">
            <CategoriesHeroSection query={query} />

            <div className="w-full flex justify-center p-4">
                <div className="w-full max-w-[1700px] mx-auto px-6 md:px-12 xl:px-16 py-8">
                    
                    {/* Header Section with Animation */}
                    <Motion.div
                        variants={headerVariant}
                        initial="hidden"
                        animate="visible"
                        className="mb-12 border-b border-[#e2e8f0] pb-10"
                    >
                        <h2 className="text-4xl md:text-[2.75rem] font-black text-[#0a1128] mb-5 tracking-tight leading-[1.15]">
                            {query ? (
                                <span>
                                    Search Results for <span className="text-accent">"{query}"</span>
                                </span>
                            ) : (
                                "Master In-Demand Industrial Skills"
                            )}
                        </h2>
                        <p className="text-[#64748b] text-[14px] md:text-[18px] max-w-3xl leading-relaxed font-medium">
                            {query 
                                ? `Discover ${course.length} specialized programs matching your search criteria.` 
                                : "Explore our comprehensive curriculum designed to bridge the gap between learning and industry mastery. Choose your path and start your journey today."}
                        </p>
                    </Motion.div>
                    {/* End of Header Section */}

                    {course.length === 0 ? (
                        <Motion.div
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="w-full flex justify-center items-center h-[300px]"
                        >
                            <p className="text-[#64748b] text-xl font-medium">No courses found.</p>
                        </Motion.div>
                    ) : (
                        <>
                            {/* Grid Section with Staggered Animation */}
                            <Motion.div
                                variants={gridContainerVariant}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                            >
                                {course.slice(0, visibleCount).map((item) => (
                                    <CourseCard
                                        key={item.courseId || item._id}
                                        course={item}
                                    />
                                ))}
                            </Motion.div>

                            {/* Load More Button Animation */}
                            {visibleCount < course.length && (
                                <Motion.div
                                    variants={buttonVariant}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.5 }}
                                    className="w-full flex justify-center mt-16"
                                >
                                    <button 
                                        onClick={loadMore}
                                        className="group inline-flex items-center gap-3 bg-white px-7 py-3.5 rounded-full shadow-sm border border-[#e2e8f0] hover:border-accent/30 transition-all duration-300 hover:shadow-md active:scale-95 cursor-pointer"
                                    >
                                        <span className="font-bold text-accent text-[15px]">
                                            Load More Courses
                                        </span>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="w-5 h-5 text-accent transition-transform group-hover:translate-y-1" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            strokeWidth={2.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </button>
                                </Motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
