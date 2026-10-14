import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../utils/api';

export default function MyLearningPage() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/enrollments/my')
      .then(({ data }) => { if (active) setCourses(data); })
      .catch(e => { if (active) setError(errorMessage(e)); });
    return () => { active = false; };
  }, []);

  return (
    <main className="max-w-7xl mx-auto min-h-[70vh] p-4 sm:p-6 md:p-12">
      <h1 className="text-2xl min-[480px]:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 sm:mb-3">
        My Courses
      </h1>
      <p className="text-slate-500 text-sm sm:text-base mb-6 sm:mb-10">
        Pick up where you left off.
      </p>

      {error ? (
        <div role="alert" className="p-5 sm:p-6 rounded-2xl bg-red-50 text-slate-700 text-sm sm:text-base">
          {error} <Link className="text-accent underline font-semibold ml-1" to="/login">Sign in</Link>
        </div>
      ) : !courses ? (
        <div role="status" className="p-8 text-slate-500 text-sm">
          Loading your courses…
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-12 text-center max-w-xl mx-auto">
          <div className="w-14 h-14 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4 text-accent text-2xl">
            🎓
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-900">No courses yet</h2>
          <p className="mb-6 text-slate-500 text-sm leading-relaxed">
            Enter your instructor’s access code on a course overview to start learning.
          </p>
          <Link to="/categories" className="bg-accent text-white rounded-xl px-6 py-3 inline-block font-semibold text-sm hover:bg-accent/90 transition shadow-sm active:scale-95">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map(c => (
            <Link 
              key={c.courseId} 
              to={'/course/' + c.courseId} 
              className="group rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="aspect-video w-full bg-slate-100 overflow-hidden">
                <img src={c.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <p className="text-accent text-xs font-mono font-bold mb-2 uppercase tracking-wider">{c.courseId}</p>
                <h2 className="font-bold text-base sm:text-lg text-slate-900 mb-4 line-clamp-2 group-hover:text-accent transition-colors">{c.title}</h2>
                <div className="mt-auto pt-2">
                  <span className="block text-center rounded-xl bg-accent-50 text-accent p-2.5 sm:p-3 font-bold text-xs sm:text-sm group-hover:bg-accent group-hover:text-white transition-colors">
                    {c.enrollment?.lastVideoId ? 'Continue Learning' : 'Start Learning'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
