import { useEffect, useState } from 'react';
import { api, errorMessage } from '../../utils/api';
import YouTubePlayer from '../../components/YouTubePlayer';

const blank = { videoId: '', title: '', duration: '', order: 1, youtubeVideoId: '' };

export default function AdminVideosPage() {
  const [courses, setCourses] = useState(null);
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/courses').then(({ data }) => { if (active) setCourses(data); }).catch(e => { if (active) setMessage(errorMessage(e)); });
    return () => { active = false; };
  }, []);

  async function select(c) {
    setCourse(c); setForm(null); setPreview(null); setRemove(null); setVideos(null);
    try { setVideos((await api.get('/course-videos/course/' + encodeURIComponent(c.courseId))).data); }
    catch (e) { setMessage(errorMessage(e)); }
  }

  async function save(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const { videoId, ...fields } = form;
      
      if (editing) await api.put('/course-videos/' + encodeURIComponent(videoId), fields);
      else await api.post('/course-videos', { ...form, youtubeVideoId: fields.youtubeVideoId, courseId: course.courseId });
      
      setForm(null); 
      setVideos((await api.get('/course-videos/course/' + encodeURIComponent(course.courseId))).data); 
      setMessage('Lesson saved.');
    } catch (error) { setMessage(errorMessage(error)); } finally { setBusy(false); }
  }

  async function deleteLesson() {
    setBusy(true);
    try { await api.delete('/course-videos/' + encodeURIComponent(remove.videoId)); setRemove(null); setVideos((await api.get('/course-videos/course/' + encodeURIComponent(course.courseId))).data); setMessage('Lesson removed.'); }
    catch (e) { setMessage(errorMessage(e)); } finally { setBusy(false); }
  }

  return (
    <main className="flex flex-col xl:flex-row min-h-screen">
      <aside className="w-full xl:w-72 bg-white border-b xl:border-b-0 xl:border-r shrink-0 p-4 sm:p-5 max-h-64 xl:max-h-screen overflow-y-auto">
        <h1 className="font-bold mb-1 text-base sm:text-lg">Courses</h1>
        <p className="text-xs text-slate-400 mb-4">Select a course to manage lessons</p>
        {!courses ? <p className="text-sm text-slate-500">Loading courses…</p> : courses.length === 0 ? <p className="text-sm text-slate-500">No courses yet.</p> : courses.map(c => (
          <button key={c.courseId} onClick={() => select(c)} className={'w-full text-left p-2.5 sm:p-3 rounded-xl mb-2 flex gap-3 transition cursor-pointer ' + (course?.courseId === c.courseId ? 'bg-accent-50 text-accent font-semibold' : 'hover:bg-slate-50 text-slate-700')}>
            <img src={c.thumbnail} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{c.title}</span>
              <small className="text-slate-400 text-xs">{c.courseId}</small>
            </span>
          </button>
        ))}
      </aside>

      <section className="p-4 sm:p-6 md:p-10 flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{course?.title || 'Course lessons'}</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">{course?.courseId || 'Choose a course to begin'}</p>
          </div>
          {course && (
            <button className="bg-accent text-white rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-xs sm:text-sm cursor-pointer shadow-sm active:scale-95 transition" onClick={() => { setForm({ ...blank }); setEditing(false); setPreview(null); }}>
              + Add Lesson
            </button>
          )}
        </div>

        <p className="bg-accent-50 text-accent rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm mb-6 leading-relaxed">
          Enter an unlisted YouTube video URL or ID. <strong>Limitations:</strong> YouTube videos cannot be truly protected from downloading, copying, sharing, screen-recording, or access through developer tools.
        </p>

        {message && <p role="status" className="mb-5 p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm">{message}</p>}

        {form && (
          <form onSubmit={save} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 shadow-sm">
            {[
              ['videoId', 'Lesson ID'], 
              ['title', 'Lesson title'], 
              ['duration', 'Duration (e.g. 12:30)'], 
              ['order', 'Lesson order'], 
              ['youtubeVideoId', 'YouTube Video URL or ID']
            ].map(([key, label]) => 
              <label key={key} className={'text-xs sm:text-sm font-semibold text-slate-700 ' + (key === 'youtubeVideoId' ? 'md:col-span-2' : '')}>
                {label}
                <input required disabled={editing && key === 'videoId'} type={key === 'order' ? 'number' : 'text'} min={key === 'order' ? 1 : undefined} value={form[key]} onChange={e => {
                  let val = key === 'order' ? Number(e.target.value) : e.target.value;
                  setForm({ ...form, [key]: val });
                }} className="block w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl mt-1.5 disabled:bg-slate-100 text-sm focus:outline-none focus:border-accent" />
              </label>
            )}
            <div className="flex gap-3 md:col-span-2 mt-2">
              <button disabled={busy} className="bg-accent text-white rounded-xl px-5 py-2.5 sm:py-3 font-semibold text-sm cursor-pointer disabled:opacity-50">
                {busy ? 'Saving…' : 'Save Lesson'}
              </button>
              <button type="button" onClick={() => setForm(null)} className="px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        )}

        {remove && (
          <div role="alertdialog" aria-label="Remove lesson" className="bg-red-50 rounded-xl p-4 sm:p-5 mb-5 border border-red-100 text-sm">
            Remove “{remove.title}” from this course?
            <div className="mt-3 flex gap-4">
              <button disabled={busy} onClick={deleteLesson} className="text-red-700 font-bold hover:underline cursor-pointer">
                Remove lesson
              </button>
              <button onClick={() => setRemove(null)} className="text-slate-600 hover:text-slate-900 cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        )}

        {course && (!videos ? <p className="text-sm text-slate-500">Loading lessons…</p> : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-xs sm:text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600">
                <tr>{['Lesson ID', 'Title', 'Duration', 'Order', 'Source', 'Actions'].map(t => <th key={t} className="p-3.5 sm:p-4 font-bold">{t}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {videos.map(v => (
                  <tr key={v.videoId} className="hover:bg-slate-50/50 transition">
                    <td className="p-3.5 sm:p-4 font-mono text-slate-500">{v.videoId}</td>
                    <td className="p-3.5 sm:p-4 font-medium text-slate-900">{v.title}</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">{v.duration}</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">{v.order}</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">{v.youtubeVideoId ? 'YouTube' : 'Migration required'}</td>
                    <td className="p-3.5 sm:p-4">
                      <div className="flex gap-3">
                        <button className="text-accent font-semibold hover:underline cursor-pointer" onClick={() => { setEditing(true); setForm({ videoId: v.videoId, title: v.title, duration: v.duration, order: v.order, youtubeVideoId: v.youtubeVideoId || '' }); }}>Edit</button>
                        <button className="text-accent font-semibold hover:underline cursor-pointer" onClick={() => setPreview(v)}>Preview</button>
                        <button className="text-red-600 font-semibold hover:underline cursor-pointer" onClick={() => setRemove(v)}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {videos.length === 0 && <p className="p-8 sm:p-10 text-center text-slate-400 text-sm">No lessons yet. Add your first lesson.</p>}
          </div>
        ))}

        {preview && (
          <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Preview · {preview.title}</h3>
              <button onClick={() => setPreview(null)} className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 cursor-pointer">Close preview ✕</button>
            </div>
            <YouTubePlayer key={preview.videoId} video={preview} />
          </section>
        )}
      </section>
    </main>
  );
}
