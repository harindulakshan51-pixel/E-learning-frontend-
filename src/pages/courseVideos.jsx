import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  HiCheck, 
  HiPlay, 
  HiOutlineClock, 
  HiOutlineFolder, 
  HiOutlineCalendarDays, 
  HiChevronLeft, 
  HiChevronRight 
} from 'react-icons/hi2';
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
  const currentIndex = data?.videos.findIndex(v => v.videoId === activeId) ?? 0;
  const prevVideo = currentIndex > 0 ? data?.videos[currentIndex - 1] : null;
  const nextVideo = currentIndex >= 0 && currentIndex < (data?.videos.length || 0) - 1 ? data?.videos[currentIndex + 1] : null;
  const isVideoCompleted = Boolean(data?.enrollment?.completedVideos?.includes(activeId));

  function progress(videoId, position, completed) {
    setPositions(current => ({ ...current, [videoId]: position }));
    if (completed) {
      setData(prev => {
        if (!prev) return prev;
        const currentCompleted = prev.enrollment?.completedVideos || [];
        if (!currentCompleted.includes(videoId)) {
          return {
            ...prev,
            enrollment: {
              ...prev.enrollment,
              completedVideos: [...currentCompleted, videoId]
            }
          };
        }
        return prev;
      });
    }
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

  function toggleComplete() {
    if (!video) return;
    const newCompleted = !isVideoCompleted;
    setData(prev => {
      if (!prev) return prev;
      const currentCompleted = prev.enrollment?.completedVideos || [];
      const updated = newCompleted
        ? [...currentCompleted, video.videoId]
        : currentCompleted.filter(id => id !== video.videoId);
      return {
        ...prev,
        enrollment: {
          ...prev.enrollment,
          completedVideos: updated
        }
      };
    });
    const currentPos = positions[video.videoId] ?? (data?.enrollment?.lastVideoId === video.videoId ? data.enrollment.position : 0);
    progress(video.videoId, currentPos, newCompleted);
  }

  return (
    <main className="min-h-[85vh] bg-gray-950 text-white">
      {/* Top Header */}
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
        <div className="p-3 sm:p-5 lg:p-6 max-w-[1750px] mx-auto">
          {/* Two-column layout on desktop, stacked on mobile */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            
            {/* Left Sidebar: Course Playlist (~30% on desktop, below video on mobile) */}
            <aside className="order-2 lg:order-1 w-full lg:w-[32%] xl:w-[30%] shrink-0 lg:sticky lg:top-4">
              <div className="flex items-center justify-between px-1 pb-3">
                <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Course Content · {data.videos.length} {data.videos.length === 1 ? 'Lesson' : 'Lessons'}
                </h2>
              </div>

              {/* Scrollable playlist container */}
              <div className="space-y-3 max-h-[460px] sm:max-h-[520px] lg:max-h-[calc(100vh-140px)] overflow-y-auto pr-1 sm:pr-2 focus:outline-none">
                {data.videos.map((v, index) => {
                  const isCurrent = v.videoId === activeId;
                  const isDone = data.enrollment?.completedVideos?.includes(v.videoId);
                  return (
                    <button
                      key={v.videoId}
                      onClick={() => setActiveId(v.videoId)}
                      className={`group w-full text-left p-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-3 border ${
                        isCurrent
                          ? 'border-accent bg-accent/15 shadow-lg shadow-accent/10 ring-1 ring-accent/50'
                          : 'border-gray-800/80 bg-gray-900/60 hover:bg-gray-800/60 hover:border-gray-700/80 text-slate-200'
                      }`}
                    >
                      {/* Video Thumbnail */}
                      <div className="relative w-24 sm:w-28 md:w-32 aspect-video shrink-0 rounded-xl overflow-hidden bg-gray-800/90 border border-gray-700/50 flex items-center justify-center">
                        {v.youtubeVideoId ? (
                          <img
                            src={`https://img.youtube.com/vi/${v.youtubeVideoId}/mqdefault.jpg`}
                            alt={v.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-slate-500">
                            <HiPlay className="w-6 h-6" />
                          </div>
                        )}

                        {/* Center Play Overlay Icon */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition">
                          <div className="w-6 h-6 rounded-full bg-white/25 backdrop-blur-xs flex items-center justify-center text-white shadow">
                            <HiPlay className="w-3.5 h-3.5 ml-0.5" />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        {v.duration && (
                          <span className="absolute bottom-1 right-1 bg-black/85 text-[10px] text-white px-1.5 py-0.5 rounded font-mono font-medium leading-none">
                            {v.duration}
                          </span>
                        )}
                      </div>

                      {/* Lesson Details */}
                      <div className="flex-1 min-w-0 pr-1">
                        <p className={`text-xs sm:text-sm font-semibold line-clamp-2 leading-snug ${isCurrent ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                          {v.title}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-2">
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                              <HiCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                              COMPLETED
                            </span>
                          ) : isCurrent ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                              WATCHING
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400">
                              Lesson {index + 1}
                            </span>
                          )}

                          {data.course.createdAt && (
                            <span className="text-[11px] text-slate-500 shrink-0 hidden sm:inline">
                              {new Date(data.course.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right Main Area: Video Player & Details (~70% on desktop, top on mobile) */}
            <section className="order-1 lg:order-2 w-full lg:w-[68%] xl:w-[70%] min-w-0">
              {video ? (
                <>
                  {/* Rounded Full-width Video Player Container */}
                  <div className="w-full rounded-2xl overflow-hidden bg-black border border-gray-800 shadow-2xl [isolation:isolate]">
                    <YouTubePlayer 
                      key={video.videoId} 
                      video={video} 
                      resume={positions[video.videoId] ?? (data.enrollment?.lastVideoId === video.videoId ? data.enrollment.position : 0)} 
                      onProgress={(position, completed) => progress(video.videoId, position, completed)} 
                    />
                  </div>

                  {/* Video Metadata & Controls directly below player */}
                  <div className="pt-4 sm:pt-6">
                    {/* Status badges and action buttons bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Left: Tag / Status Badges */}
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#241a4a] text-[#9d8bf0]">
                          {video.title.match(/^(Day\s*\d+|Lesson\s*\d+)/i)?.[0] || `Lesson ${currentIndex + 1}`}
                        </span>

                        {isVideoCompleted ? (
                          <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wider bg-[#132c23] text-emerald-400 flex items-center gap-1">
                            <HiCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                            COMPLETED
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wider bg-[#2e1d13] text-[#f59e0b]">
                            WATCHING
                          </span>
                        )}
                      </div>

                      {/* Right: Action Buttons (Previous, Next, Mark as Complete) */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                        <button 
                          disabled={!prevVideo} 
                          onClick={() => prevVideo && setActiveId(prevVideo.videoId)} 
                          className="flex items-center gap-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-slate-300 hover:text-white rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer active:scale-95"
                          title="Previous Lesson"
                        >
                          <HiChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>

                        <button 
                          disabled={!nextVideo} 
                          onClick={() => nextVideo && setActiveId(nextVideo.videoId)} 
                          className="flex items-center gap-1 bg-accent hover:bg-accent/90 text-white rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer active:scale-95 shadow-sm shadow-accent/20"
                          title="Next Lesson"
                        >
                          <span>Next</span>
                          <HiChevronRight className="w-4 h-4" />
                        </button>

                        <button
                          onClick={toggleComplete}
                          className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer active:scale-95 ${
                            isVideoCompleted
                              ? 'bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/30'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                          }`}
                        >
                          <HiCheck className="w-4 h-4 stroke-[2.5]" />
                          <span>{isVideoCompleted ? 'Completed' : 'Mark as Complete'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Lesson Title */}
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mt-4 sm:mt-5">
                      {video.title}
                    </h1>

                    {/* Course Subtitle & Details */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-400 mt-2.5">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <HiOutlineFolder className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[260px] sm:max-w-md font-medium">{data.course.title}</span>
                      </span>

                      {video.duration && (
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <HiOutlineClock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{video.duration}</span>
                        </span>
                      )}

                      {data.course.createdAt && (
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <HiOutlineCalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{new Date(data.course.createdAt).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>

                    {progressError && (
                      <p role="status" className="text-amber-300 text-xs mt-3 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-xl">
                        {progressError}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 sm:p-12 text-slate-400 text-center text-sm bg-gray-900/40 rounded-2xl border border-gray-800">
                  <p>No lessons have been added yet.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </main>
  );
}
