import { useEffect, useState } from 'react';
import { api, errorMessage } from '../../utils/api';
export default function AdminEnrollments() {
  const [rows, setRows] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ search: '', courseId: '', status: '', from: '', to: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => { api.get('/courses').then(r => setCourses(r.data)).catch(e => setMessage(errorMessage(e))); }, []);
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => api.get('/enrollments/all', { params: filters }).then(r => { if (active) { setRows(r.data); setMessage(''); } }).catch(e => { if (active) setMessage(errorMessage(e)); }), 200);
    return () => { active = false; clearTimeout(timer); };
  }, [filters, revision]);
  async function change(row, action) {
    setBusy(true);
    try {
      if (action === 'approve') await api.post('/enrollments/' + row._id + '/approve');
      else await api.delete('/enrollments/' + row._id);
      setSelected(null); setRevision(v => v + 1);
    } catch (e) { setMessage(errorMessage(e)); } finally { setBusy(false); }
  }
  const field = (name, value) => setFilters({ ...filters, [name]: value });
  return <main className="p-5 md:p-10">
    <h1 className="text-3xl font-extrabold text-slate-900">Enrollments</h1><p className="text-slate-500 mt-2 mb-8">Explore students and courses, review legacy access, and manage enrollments.</p>
    <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
      <label className="text-sm">Student or course<input value={filters.search} onChange={e => field('search', e.target.value)} placeholder="Name, email or Course ID" className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-white" /></label>
      <label className="text-sm">Course<select value={filters.courseId} onChange={e => field('courseId', e.target.value)} className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-white"><option value="">All courses</option>{courses.map(c => <option key={c.courseId} value={c.courseId}>{c.title} · {c.courseId}</option>)}</select></label>
      <label className="text-sm">Status<select value={filters.status} onChange={e => field('status', e.target.value)} className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-white"><option value="">All statuses</option>{['active', 'revoked', 'pending_review'].map(s => <option key={s}>{s}</option>)}</select></label>
      <label className="text-sm">Enrolled from<input type="date" value={filters.from} onChange={e => field('from', e.target.value)} className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-white" /></label>
      <label className="text-sm">Enrolled through<input type="date" value={filters.to} onChange={e => field('to', e.target.value)} className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-white" /></label>
    </div>
    {message && <p role="alert" className="p-4 bg-red-50 rounded-xl mb-5">{message}</p>}
    {!rows ? <p role="status">Loading enrollments…</p> : <div className="rounded-2xl border border-slate-200 overflow-x-auto bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{['Student', 'Course', 'Enrolled', 'Status', 'Progress', 'Actions'].map(h => <th key={h} className="p-4">{h}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row._id} className="border-t border-slate-100"><td className="p-4"><button className="text-blue-700 font-bold" onClick={() => setSelected(row)}>{row.student ? row.student.firstName + ' ' + row.student.lastName : row.userId}</button><small className="block text-slate-500">{row.userId}</small></td><td className="p-4"><button className="text-blue-700 text-left" onClick={() => setFilters({ search: '', status: '', from: '', to: '', courseId: row.courseId })}>{row.course?.title || row.courseId}</button><small className="block text-slate-400">{row.courseId}</small></td><td className="p-4">{new Date(row.enrolledDate).toLocaleDateString()}<small className="block text-slate-400">{row.method}</small></td><td className="p-4">{row.status}</td><td className="p-4">{row.progress}%<progress className="block w-20" max="100" value={row.progress} /></td><td className="p-4"><button onClick={() => setSelected(row)} className="font-bold text-blue-600">View details</button></td></tr>)}</tbody></table>{rows.length === 0 && <p className="p-12 text-center text-slate-500">No enrollments match these filters.</p>}</div>}
    {selected && <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Enrollment details"><section className="bg-white rounded-2xl p-8 max-w-xl w-full max-h-[90vh] overflow-auto"><h2 className="text-2xl font-bold mb-5">Enrollment details</h2><dl className="space-y-3">{Object.entries({ Student: selected.student ? selected.student.firstName + ' ' + selected.student.lastName : 'Legacy student', Email: selected.userId, Course: selected.course?.title || selected.courseId, 'Course ID': selected.courseId, Status: selected.status, Method: selected.method, Progress: selected.progress + '% (reported lesson completion)', 'Last lesson': selected.lastVideoId || 'Not started', 'Last activity': selected.lastActivity ? new Date(selected.lastActivity).toLocaleString() : 'No activity yet', 'Account status': selected.student?.isBlocked ? 'Blocked' : 'Active' }).map(([label, value]) => <div key={label}><dt className="text-xs uppercase text-slate-400">{label}</dt><dd className="break-words">{value}</dd></div>)}</dl>
      {selected.status === 'pending_review' && <p className="text-sm bg-amber-50 p-3 my-4">Verify payment or other legitimate entitlement before approving this legacy record.</p>}
      <div className="flex flex-wrap gap-3 mt-6">{selected.status === 'pending_review' && <button disabled={busy} className="bg-blue-600 text-white rounded-lg p-3" onClick={() => change(selected, 'approve')}>Confirm verified access</button>}{selected.status !== 'revoked' && <button disabled={busy} className="bg-red-50 text-red-700 rounded-lg p-3" onClick={() => change(selected, 'revoke')}>Revoke enrollment</button>}<button onClick={() => setSelected(null)} className="border border-slate-200 rounded-lg p-3">Close</button></div></section></div>}
  </main>;
}
