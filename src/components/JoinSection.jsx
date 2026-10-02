import { COURSE_IMAGES } from '../utils/images';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiStar, FiBarChart2 } from 'react-icons/fi';

const courses = [
  { label: 'Web Development', image: COURSE_IMAGES.web, search: 'web development' },
  { label: 'Data Science', image: COURSE_IMAGES.python, search: 'data science' },
  { label: 'UI/UX Design', image: COURSE_IMAGES.design, search: 'ui ux' },
];
const stats = [
  { value: '10K+', label: 'Students', Icon: FiUsers },
  { value: '4.9/5', label: 'Rating', Icon: FiStar },
  { value: '95%', label: 'Hire Rate', Icon: FiBarChart2 },
];

export default function JoinSection() {
  const navigate = useNavigate();

  return (
    <section className="home-community" aria-labelledby="community-heading">
      <div className="home-community__banner">
        <div className="home-community__decoration" aria-hidden="true" />
        <div className="home-community__copy">
          <div className="home-community__eyebrow">
            <span aria-hidden="true">✦</span> Community
          </div>
          <h2 id="community-heading">
            Join a community of <br className="hidden md:block" /> digital craftsmen.
          </h2>
          <p>From Silicon Valley to London, our students are defining the future of the digital economy.</p>
          <button onClick={() => navigate('/categories')} className="home-community__cta">
            Explore Courses <FiArrowRight aria-hidden="true" />
          </button>
          <div className="home-community__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="home-community__stat">
                <span className="home-community__stat-icon"><stat.Icon aria-hidden="true" /></span>
                <div><strong>{stat.value}</strong><span>{stat.label}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="home-community__art" aria-label="Explore course categories">
          {courses.map((course) => (
            <button
              type="button"
              key={course.search}
              onClick={() => navigate(`/categories?search=${encodeURIComponent(course.search)}`)}
              className="home-community__course"
              aria-label={`Explore ${course.label} courses`}
            >
              <img src={course.image} alt="" />
              <span>{course.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
