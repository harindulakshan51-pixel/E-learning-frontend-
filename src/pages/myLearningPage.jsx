import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../utils/api';
export default function MyLearningPage() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api.get('/enrollments/my').then(({ data }) => { if (active) setCourses(data); }).catch(e => { if (active) setError(errorMessage(e)); });
    return () => { active = false; };
  }, []);
  return <main className="max-w-7xl mx-auto min-h-[70vh] p-6 md:p-12">
    <h1 className="text-4xl font-extrabold text-slate-900 mb-3">My Courses</h1>
    <p className="text-slate-500 mb-10">Pick up where you left off.</p>
    {error ? <div role="alert" className="p-6 rounded-2xl bg-red-50">{error} <Link className="text-blue-600 underline" to="/login">Sign in</Link></div> :
      !courses ? <p role="status">Loading your courses…</p> :
      courses.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center"><h2 className="text-xl font-bold mb-3">No courses yet</h2><p className="mb-6 text-slate-500">Enter your instructor’s access code on a course overview to start learning.</p><Link to="/categories" className="bg-blue-600 text-white rounded-xl px-6 py-3 inline-block">Browse Courses</Link></div> :
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">{courses.map(c => <Link key={c.courseId} to={'/course/' + c.courseId} className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white hover:shadow-lg transition">
        <img src={c.thumbnail} alt="" className="w-full aspect-video object-cover" />
        <div className="p-6"><p className="text-blue-600 text-xs font-mono mb-2">{c.courseId}</p><h2 className="font-bold text-lg mb-5">{c.title}</h2><span className="block text-center rounded-xl bg-blue-50 text-blue-700 p-3 font-bold">{c.enrollment?.lastVideoId ? 'Continue Learning' : 'Start Learning'}</span></div>
      </Link>)}</div>}
  </main>;
}
