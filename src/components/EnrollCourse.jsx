import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, errorMessage } from '../utils/api';
export default function EnrollCourse({ courseId }) {
  const [state, setState] = useState('loading');
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    api.get('/enrollments/check/' + encodeURIComponent(courseId)).then(({ data }) => {
      if (active) setState(data.enrolled ? 'enrolled' : 'locked');
    }).catch(error => { if (active) setState(error.response?.status === 401 ? 'guest' : 'locked'); });
    return () => { active = false; };
  }, [courseId]);
  async function redeem(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      await api.post('/enrollments', { courseId, code });
      setCode(''); setState('enrolled'); setOpen(false);
      setMessage('Enrolled successfully. This course is now in My Courses.');
    } catch (error) { setMessage(errorMessage(error)); }
    finally { setBusy(false); }
  }
  return <div className="space-y-4">
    {state === 'loading' ? <p role="status">Checking course access…</p> :
      state === 'enrolled' ? <Link className="block text-center rounded-xl bg-accent text-white p-4 font-bold" to={'/course/' + courseId}>Continue Learning</Link> :
      <button className="w-full rounded-xl bg-accent text-white p-4 font-bold" onClick={() => state === 'guest' ? navigate('/login', { state: { returnTo: '/overview/' + courseId } }) : setOpen(!open)}>Enter Access Code</button>}
    {state !== 'enrolled' && <p className="text-sm text-slate-500">Lessons are locked. After arranging payment with your instructor, use the course code they provide.</p>}
    {open && <form onSubmit={redeem} className="space-y-3">
      <label className="block text-sm font-semibold" htmlFor="access-code">Course access code</label>
      <input id="access-code" required maxLength={100} autoComplete="off" value={code} onChange={e => setCode(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 font-mono" placeholder="CRS-…" />
      <button disabled={busy} className="w-full rounded-xl bg-accent text-white p-3 disabled:opacity-50">{busy ? 'Verifying…' : 'Unlock Course'}</button>
    </form>}
    {message && <p role="status" className="text-sm text-accent bg-accent-50 rounded-xl p-3">{message}</p>}
  </div>;
}
