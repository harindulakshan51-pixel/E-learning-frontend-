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
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const [remove, setRemove] = useState(null);

  useEffect(() => { api.get('/courses').then(r => setCourses(r.data)).catch(e => setMessage(errorMessage(e))); }, []);

  async function select(c) {
    setCourse(c); setVideos(null); setForm(null); setPreview(null); setMessage('');
    try { setVideos((await api.get('/course-videos/course/' + encodeURIComponent(c.courseId))).data); } catch (e) { setMessage(errorMessage(e)); }
  }

  async function save(e) {
    e.preventDefault(); 
    setBusy(true); 
    setMessage('');
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

  return <main className="flex flex-col xl:flex-row min-h-screen">
    <aside className="xl:w-72 bg-white border-r shrink-0 p-5"><h1 className="font-bold mb-2">Courses</h1><p className="text-xs text-slate-400 mb-5">Select a course to manage lessons</p>{!courses ? <p>Loading courses…</p> : courses.length === 0 ? <p>No courses yet.</p> : courses.map(c => <button key={c.courseId} onClick={() => select(c)} className={'w-full text-left p-3 rounded-xl mb-2 flex gap-3 ' + (course?.courseId === c.courseId ? 'bg-accent-50 text-accent' : 'hover:bg-slate-50')}><img src={c.thumbnail} alt="" className="w-10 h-10 object-cover rounded-lg" /><span className="min-w-0"><span className="block truncate text-sm font-semibold">{c.title}</span><small className="text-slate-400">{c.courseId}</small></span></button>)}</aside>
    <section className="p-5 md:p-10 flex-1 min-w-0"><div className="flex flex-wrap justify-between gap-4 mb-6"><div><h2 className="text-2xl font-extrabold">{course?.title || 'Course lessons'}</h2><p className="text-slate-400 text-sm mt-2">{course?.courseId || 'Choose a course to begin'}</p></div>{course && <button className="bg-accent text-white rounded-xl px-5 py-3 font-bold" onClick={() => { setForm({ ...blank }); setEditing(false); setPreview(null); }}>+ Add Lesson</button>}</div>
      <p className="bg-accent-50 text-accent rounded-xl p-4 text-sm mb-6">Enter an unlisted YouTube video URL or ID. <strong>Limitations:</strong> YouTube videos cannot be truly protected from downloading, copying, sharing, screen-recording, or access through developer tools. An unlisted YouTube link can still be shared. Custom controls do not provide DRM. YouTube manages quality and may display branding, links, or ads.</p>
      {message && <p role="status" className="mb-5 p-4 bg-white border border-slate-200 rounded-xl">{message}</p>}
      {form && <form onSubmit={save} className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 grid md:grid-cols-2 gap-5">
        {[
          ['videoId', 'Lesson ID'], 
          ['title', 'Lesson title'], 
          ['duration', 'Duration (e.g. 12:30)'], 
          ['order', 'Lesson order'], 
          ['youtubeVideoId', 'YouTube Video URL or ID']
        ].map(([key, label]) => 
          <label key={key} className={'text-sm font-semibold ' + (key === 'youtubeVideoId' ? 'md:col-span-2' : '')}>
            {label}
            <input required disabled={editing && key === 'videoId'} type={key === 'order' ? 'number' : 'text'} min={key === 'order' ? 1 : undefined} value={form[key]} onChange={e => {
              let val = key === 'order' ? Number(e.target.value) : e.target.value;
              setForm({ ...form, [key]: val });
            }} className="block w-full p-3 border border-slate-200 rounded-xl mt-2 disabled:bg-slate-100" />
          </label>
        )}
        <div className="flex gap-4 md:col-span-2 mt-2">
          <button disabled={busy} className="bg-accent text-white rounded-xl px-5 py-3">{busy ? 'Saving…' : 'Save Lesson'}</button>
          <button type="button" onClick={() => setForm(null)}>Cancel</button>
        </div>
      </form>}
      {remove && <div role="alertdialog" aria-label="Remove lesson" className="bg-red-50 rounded-xl p-5 mb-5">Remove “{remove.title}” from this course?<div className="mt-3 flex gap-4"><button disabled={busy} onClick={deleteLesson} className="text-red-700 font-bold">Remove lesson</button><button onClick={() => setRemove(null)}>Cancel</button></div></div>}
      {course && (!videos ? <p>Loading lessons…</p> : <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-slate-50"><tr>{['Lesson ID', 'Title', 'Duration', 'Order', 'Source', 'Actions'].map(t => <th key={t} className="p-4">{t}</th>)}</tr></thead><tbody>{videos.map(v => <tr key={v.videoId} className="border-t border-slate-100"><td className="p-4 font-mono">{v.videoId}</td><td className="p-4">{v.title}</td><td className="p-4">{v.duration}</td><td className="p-4">{v.order}</td><td className="p-4">{v.youtubeVideoId ? 'YouTube' : 'Migration required'}</td><td className="p-4"><div className="flex gap-3"><button className="text-accent" onClick={() => { setEditing(true); setForm({ videoId: v.videoId, title: v.title, duration: v.duration, order: v.order, youtubeVideoId: v.youtubeVideoId || '' }); }}>Edit</button><button className="text-accent" onClick={() => setPreview(v)}>Preview</button><button className="text-red-600" onClick={() => setRemove(v)}>Remove</button></div></td></tr>)}</tbody></table>{videos.length === 0 && <p className="p-10 text-center text-slate-400">No lessons yet. Add your first lesson.</p>}</div>)}
      {preview && <section className="mt-8"><div className="flex justify-between mb-3"><h3 className="font-bold">Preview · {preview.title}</h3><button onClick={() => setPreview(null)}>Close preview</button></div><YouTubePlayer key={preview.videoId} video={preview} /></section>}
    </section>
  </main>;
}
