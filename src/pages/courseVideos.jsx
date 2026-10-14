import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, errorMessage } from '../utils/api';
import YouTubePlayer from '../components/YouTubePlayer';

export default function CourseVideos() {
  const { courseId } = useParams();
  return <CourseWatch key={courseId} courseId={courseId} />;
}

function CourseWatch({ courseId }) {
  const [positions, setPositions] = useState({});
  const saves = useRef(Promise.resolve());
  const [data, setData] = useState(null);
  const [activeId, setActiveId] = useState('');
  const [error, setError] = useState('');
  const [progressError, setProgressError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get('/courses/' + encodeURIComponent(courseId)),
      api.get('/course-videos/course/' + encodeURIComponent(courseId)),
      api.get('/enrollments/check/' + encodeURIComponent(courseId))
    ])
      .then(([course, videos, enrollment]) => {
        if (!active) return;
        setData({ course: course.data, videos: videos.data, enrollment: enrollment.data.enrollment });
        setActiveId(videos.data.some(v => v.videoId === enrollment.data.enrollment?.lastVideoId) ? enrollment.data.enrollment.lastVideoId : videos.data[0]?.videoId || '');
      }).catch(e => { if (active) setError(errorMessage(e)); });
    return () => { active = false; };
  }, [courseId]);

  const video = data?.videos.find(v => v.videoId === activeId);

  function progress(videoId, position, completed) {
    setPositions(current => ({ ...current, [videoId]: position }));
    saves.current = saves.current.then(async () => {
      try {
        await api.put('/enrollments/progress/' + encodeURIComponent(courseId), { videoId, position, completed }, { timeout: 10000 });
        setProgressError('');
      } catch (e) {
        if ([401, 403, 404].includes(e.response?.status)) setError(errorMessage(e));
        else setProgressError('Progress could not be saved. Check your connection.');
      }
    });
  }

  return (
    <main className="min-h-[80vh] bg-gray-950 text-white">
      <div className="p-3.5 sm:p-4 bg-gray-900 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <Link to="/myLearning" className="text-accent-300 hover:underline font-semibold flex items-center gap-1">
          ← My Courses
        </Link>
        <span className="font-medium text-slate-300 truncate max-w-[200px] sm:max-w-md">
          {data?.course.title || courseId}
        </span>
      </div>

      {error ? (
        <div role="alert" className="p-8 sm:p-12 text-center">
          <p className="mb-4 text-red-400 text-sm sm:text-base">{error}</p>
          <div className="flex gap-4 justify-center text-sm">
            <Link to={'/overview/' + courseId} className="text-accent-300 underline">Open course overview</Link>
            <span className="text-slate-600">·</span>
            <Link to="/login" className="text-accent-300 underline">Sign in</Link>
          </div>
        </div>
      ) : !data ? (
        <p role="status" className="p-8 sm:p-12 text-center text-slate-400 text-sm">Loading course…</p>
      ) : (
        <div className="flex flex-col lg:flex-row">
          <section className="flex-1 min-w-0">
            {video ? (
              <>
                <YouTubePlayer 
                  key={video.videoId} 
                  video={video} 
                  resume={positions[video.videoId] ?? (data.enrollment?.lastVideoId === video.videoId ? data.enrollment.position : 0)} 
                  onProgress={(position, completed) => progress(video.videoId, position, completed)} 
                />
                <div className="p-4 sm:p-6">
                  <h1 className="text-lg sm:text-xl font-bold">{video.title}</h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">{video.duration}</p>
                  {progressError && <p role="status" className="text-amber-300 text-xs mt-3">{progressError}</p>}
                  
                  <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                    {['Previous', 'Next'].map((label, i) => {
                      const index = data.videos.findIndex(v => v.videoId === activeId) + (i ? 1 : -1);
                      return (
                        <button 
                          key={label} 
                          disabled={!data.videos[index]} 
                          onClick={() => setActiveId(data.videos[index].videoId)} 
                          className="bg-accent hover:bg-accent/90 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer active:scale-95"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <p className="p-8 sm:p-12 text-slate-400 text-center text-sm">No lessons have been added yet.</p>
            )}
          </section>

          <aside className="w-full lg:w-80 bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-800 shrink-0">
            <h2 className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-gray-800">
              COURSE CONTENT · {data.videos.length} LESSONS
            </h2>
            <div className="max-h-[300px] lg:max-h-[calc(100vh-140px)] overflow-y-auto divide-y divide-gray-800">
              {data.videos.map(v => (
                <button 
                  key={v.videoId} 
                  onClick={() => setActiveId(v.videoId)} 
                  className={'block w-full text-left p-3.5 sm:p-4 transition cursor-pointer ' + (v.videoId === activeId ? 'bg-accent/20 text-accent-300 font-semibold' : 'hover:bg-gray-800/60 text-slate-200')}
                >
                  <span className="block text-xs sm:text-sm leading-snug">{v.title}</span>
                  <small className="text-slate-400 text-[11px] mt-0.5 block">{v.duration}</small>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
