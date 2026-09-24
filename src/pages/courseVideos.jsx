import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, errorMessage } from '../utils/api';
import YouTubePlayer from '../components/YouTubePlayer';
export default function CourseVideos() {
  const { courseId } = useParams();
  return <CourseWatch key={courseId} courseId={courseId} />;
}
function CourseWatch({ courseId }) {
  const [data, setData] = useState(null);
  const [activeId, setActiveId] = useState('');
  const [error, setError] = useState('');
  const [progressError, setProgressError] = useState('');
  useEffect(() => {
    let active = true;
    Promise.all([api.get('/courses/' + encodeURIComponent(courseId)), api.get('/course-videos/course/' + encodeURIComponent(courseId)), api.get('/enrollments/check/' + encodeURIComponent(courseId))])
      .then(([course, videos, enrollment]) => {
        if (!active) return;
        setData({ course: course.data, videos: videos.data, enrollment: enrollment.data.enrollment });
        setActiveId(videos.data.some(v => v.videoId === enrollment.data.enrollment?.lastVideoId) ? enrollment.data.enrollment.lastVideoId : videos.data[0]?.videoId || '');
      }).catch(e => { if (active) setError(errorMessage(e)); });
    return () => { active = false; };
  }, [courseId]);
  const video = data?.videos.find(v => v.videoId === activeId);
  async function progress(position, completed) {
    try { await api.put('/enrollments/progress/' + encodeURIComponent(courseId), { videoId: activeId, position, completed }); setProgressError(''); }
    catch (e) { if ([401, 403].includes(e.response?.status)) setError(errorMessage(e)); else setProgressError('Progress could not be saved. Check your connection.'); }
  }
  return <main className="min-h-[80vh] bg-gray-950 text-white">
    <div className="p-4 bg-gray-900 border-b border-gray-800 flex gap-5"><Link to="/myLearning" className="text-blue-300">← My Courses</Link><span>{data?.course.title || courseId}</span></div>
    {error ? <div role="alert" className="p-12 text-center"><p className="mb-5">{error}</p><Link to={'/overview/' + courseId} className="text-blue-400 underline">Open course overview</Link> · <Link to="/login" className="text-blue-400 underline">Sign in</Link></div> :
      !data ? <p role="status" className="p-12">Loading course…</p> :
      <div className="flex flex-col lg:flex-row">
        <section className="flex-1 min-w-0">{video ? <>
          <YouTubePlayer key={video.videoId} video={video} resume={data.enrollment?.lastVideoId === video.videoId ? data.enrollment.position : 0} onProgress={progress} />
          <div className="p-6"><h1 className="text-xl font-bold">{video.title}</h1><p className="text-slate-400 mt-2">{video.duration}</p>{progressError && <p role="status" className="text-amber-300 mt-3">{progressError}</p>}
          <div className="flex gap-3 mt-6">{['Previous', 'Next'].map((label, i) => { const index = data.videos.findIndex(v => v.videoId === activeId) + (i ? 1 : -1); return <button key={label} disabled={!data.videos[index]} onClick={() => setActiveId(data.videos[index].videoId)} className="bg-blue-600 rounded-lg px-4 py-2 disabled:opacity-30">{label}</button>; })}</div></div>
        </> : <p className="p-12 text-slate-400">No lessons have been added yet.</p>}</section>
        <aside className="lg:w-80 bg-gray-900 border-l border-gray-800"><h2 className="p-5 font-bold">COURSE CONTENT · {data.videos.length}</h2>{data.videos.map(v => <button key={v.videoId} onClick={() => setActiveId(v.videoId)} className={'block w-full text-left p-5 border-t border-gray-800 ' + (v.videoId === activeId ? 'bg-blue-950 text-blue-300' : 'hover:bg-gray-800')}><span className="block font-semibold">{v.title}</span><small className="text-slate-400">{v.duration}</small></button>)}</aside>
      </div>}
  </main>;
}
