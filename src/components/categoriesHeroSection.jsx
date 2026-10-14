import { COURSE_IMAGES } from '../utils/images';
import './categoriesHeroSection.css';

const courses = [
    { label: 'Web Development', image: COURSE_IMAGES.web },
    { label: 'Data Science', image: COURSE_IMAGES.python },
    { label: 'UI/UX Design', image: COURSE_IMAGES.design },
];

export default function CategoriesHeroSection({ query }) {
    return (
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 mt-1">
            <section className="catalog-hero" aria-labelledby="catalog-hero-title">
                <div className="catalog-hero__decoration" aria-hidden="true" />
                <div className="catalog-hero__copy">
                    <div className="catalog-hero__eyebrow">
                        <span aria-hidden="true">✦</span> Expert-Led Courses
                    </div>
                    <h1 id="catalog-hero-title">Course Catalog</h1>
                    <p>
                        Master the world's most in-demand skills with{' '}
                        <span className="font-semibold">industry-leading</span>{' '}
                        mentors and real-world projects.
                    </p>
                    <div className="catalog-hero__line" aria-hidden="true" />
                    {query && (
                        <div className="catalog-hero__query">
                            Results for: "{query}"
                        </div>
                    )}
                </div>
                <div className="catalog-hero__art">
                    {courses.map(course => (
                        <div key={course.label} className="catalog-hero__course">
                            <img src={course.image} alt={course.label} />
                            <span>{course.label}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
