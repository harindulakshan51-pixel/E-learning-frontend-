import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion as Motion } from "framer-motion"; // <-- Added Framer Motion
import Loader from "../components/loader";
import CourseCard from "../components/courseCard";
import HeroSection from "../components/heroSection";
import JoinSection from "../components/JoinSection";
import "./homepage-design.css";

export default function CoursePage() {
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/courses")
                .then((response) => {
                    setProducts(response.data);
                    setLoaded(true);
                })
                .catch((error) => {
                    console.error("Error fetching courses:", error);
                    setLoaded(true);
                });
        }
    }, [loaded]);

    if (!loaded) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center bg-[#f9f9f9]">
                <Loader />
            </div>
        );
    }

    // Animation Variants
    const fadeLeftVariant = {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const fadeRightVariant = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const gridContainerVariant = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2 // Stagger effect for cards
            }
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-[#f9f9f9]">
            
            {/* Hero Section */}
            <Motion.div
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.8 }}
                className="flex-shrink-0"
            >
                <HeroSection />
            </Motion.div>

            {/* Curriculum Section */}
            <section className="home-curriculum">
                
                {/* Abstract Decoration */}
                <div className="home-curriculum__decoration" aria-hidden="true">
                    <div className="absolute -top-24 -left-24 w-96 h-96 border-[40px] border-accent/10 rounded-full"></div>
                    <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="home-content">
                    
                    {/* Header Part with Scrolling Animation */}
                    <div className="home-curriculum__header">
                        <Motion.div
                            variants={fadeLeftVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            className="home-curriculum__intro"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-1 w-10 bg-accent rounded-full"></div>
                                <span className="text-accent font-black uppercase tracking-[0.2em] text-[10px]">
                                    THE CURRICULUM
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-[2.75rem] font-black text-[#0a1128] mb-5 tracking-tight leading-[1.15]">
                                Curated Mastery Programs
                            </h2>
                            <p className="text-[#64748b] text-lg md:text-lg leading-relaxed font-medium">
                                Precision-engineered paths designed to bridge the gap between amateur and 
                                industry authority. Each program is a focused journey toward absolute 
                                technical mastery.
                            </p>
                        </Motion.div>

                        {/* Explore Catalog Button Animation */}
                        <Motion.div
                            variants={fadeRightVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <Link 
                                to="/categories" 
                                className="home-catalog-link group"
                            >
                                <span className="font-bold text-accent text-[15px]">
                                    Explore Full Catalog
                                </span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="w-5 h-5 text-accent transition-transform group-hover:translate-x-1" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor" 
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </Motion.div>
                    </div>

                    {/* Courses Grid with Staggered Scroll Animation */}
                    <Motion.div
                        variants={gridContainerVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="home-course-grid"
                    >
                        {products.slice(0, 4).map((item) => (
                            <CourseCard
                                key={item.courseId || item._id}
                                course={item} variant="home"
                            />
                        ))}
                    </Motion.div>
                </div>
            </section>

            {/* Join Section */}
            <Motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
                className="w-full"
            >
                <JoinSection />
            </Motion.div>
            
        </div>
    );
}
