import { useEffect, useState } from 'react';
import { api, errorMessage } from '../../utils/api';
export default function AdminAccessCodes() {
  const [courses, setCourses] = useState([]);
  const [codes, setCodes] = useState(null);
  const [form, setForm] = useState({ courseId: '', assignedEmail: '', expiresAt: '' });
  const [issued, setIssued] = useState('');
  const [message, setMessage] = useState('');
  const [expiryError, setExpiryError] = useState('');
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState(null);
  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/access-codes')]).then(([c, a]) => { setCourses(c.data); setCodes(a.data); }).catch(e => setMessage(errorMessage(e)));
  }, []);
  async function issue(e) {
    e.preventDefault();
    const expiry = form.expiresAt ? new Date(form.expiresAt) : null;
    if (expiry && (!Number.isFinite(expiry.getTime()) || expiry.getTime() <= Date.now())) {
      setExpiryError('This time has already passed. Choose a future date and time, or select No expiry.');
      return;
    }
    setExpiryError(''); setBusy(true); setMessage(''); setIssued('');
    try {
      const { data } = await api.post('/access-codes', { ...form, expiresAt: expiry?.toISOString() });
      setIssued(data.code); setMessage(data.message);
      setCodes((await api.get('/access-codes')).data);
    } catch (error) { setMessage(errorMessage(error)); } finally { setBusy(false); }
  }
  async function revoke() {
    setBusy(true);
    try { const { data } = await api.post('/access-codes/' + target._id + '/revoke'); setMessage(data.message); setTarget(null); setCodes((await api.get('/access-codes')).data); }
    catch (e) { setMessage(errorMessage(e)); } finally { setBusy(false); }
  }
  return <main className="p-5 md:p-10 max-w-7xl mx-auto">
    <h1 className="text-3xl font-extrabold text-slate-900">Access Codes</h1><p className="text-slate-500 mt-2 mb-8">Issue one code per student after confirming payment outside Scholarly.</p>
    <form onSubmit={issue} className="bg-white rounded-2xl border border-slate-200 p-6 grid md:grid-cols-3 gap-5 shadow-sm">
      <label className="text-sm font-semibold">Course ID<select required value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} className="block w-full p-3 border border-slate-200 rounded-xl mt-2"><option value="">Select a course</option>{courses.filter(c => c.isAvailable).map(c => <option key={c.courseId} value={c.courseId}>{c.courseId} · {c.title}</option>)}</select></label>
      <label className="text-sm font-semibold">Assign to student email (recommended)<input type="email" value={form.assignedEmail} onChange={e => setForm({ ...form, assignedEmail: e.target.value })} className="block w-full p-3 border border-slate-200 rounded-xl mt-2" placeholder="Registered student email" /></label>
      <div>
        <label htmlFor="code-expiry" className="text-sm font-semibold">Code redemption deadline (optional)</label>
        <input id="code-expiry" type="datetime-local" value={form.expiresAt}
          onChange={e => { setForm({ ...form, expiresAt: e.target.value }); setExpiryError(''); }}
          aria-invalid={Boolean(expiryError)} aria-describedby={expiryError ? 'expiry-help expiry-error' : 'expiry-help'}
          className={`block w-full p-3 border rounded-xl mt-2 ${expiryError ? 'border-red-500' : 'border-slate-200'}`} />
        <div className="flex items-start justify-between gap-3 mt-2">
          <p id="expiry-help" className="text-xs text-slate-500">Leave blank for no expiry. Uses your local time. This is the deadline to redeem the code, not when the course ends.</p>
          <button type="button" onClick={() => { setForm({ ...form, expiresAt: '' }); setExpiryError(''); setMessage(''); }} className="text-xs font-semibold text-blue-600 whitespace-nowrap">No expiry</button>
        </div>
        {expiryError && <p id="expiry-error" role="alert" className="text-sm text-red-600 mt-2">{expiryError}</p>}
      </div>
      <button disabled={busy} className="bg-blue-600 text-white rounded-xl px-6 py-3 font-bold disabled:opacity-50">{busy ? 'Working…' : 'Generate Access Code'}</button>
      <p className="text-sm text-slate-500 md:col-span-2">Generate a code and give it to the student. They must sign in with the assigned email and enter it on the course overview to enroll. Codes are single-use. Revoking a redeemed code also removes its enrollment.</p>
    </form>
    {message && <p role="status" className="my-5 p-4 bg-blue-50 text-blue-900 rounded-xl">{message}</p>}
    {issued && <div className="my-5 border border-blue-200 bg-white p-6 rounded-xl"><p className="font-semibold mb-3">Copy now and send privately to your student</p><code className="break-all text-blue-700 text-lg">{issued}</code><div className="mt-4 flex gap-4"><button onClick={() => navigator.clipboard.writeText(issued).then(() => setMessage('Code copied')).catch(() => setMessage('Select and copy the code above.'))} className="text-blue-600 font-bold">Copy code</button><button onClick={() => setIssued('')} className="text-slate-500">Hide code</button></div></div>}
    {target && <div role="alertdialog" aria-label="Confirm code revocation" className="my-5 p-6 rounded-xl border border-red-200 bg-red-50"><p>Revoke code ending {target.hint} and the enrollment it granted?</p><button disabled={busy} onClick={revoke} className="bg-red-600 text-white px-4 py-2 rounded-lg mt-3 mr-3">Revoke access</button><button onClick={() => setTarget(null)}>Cancel</button></div>}
    <input aria-label="Search access codes" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search course, student, status or code ending…" className="my-6 p-3 rounded-xl border border-slate-200 w-full max-w-lg bg-white" />
    {!codes ? <p role="status">{message ? 'Codes could not be loaded.' : 'Loading access codes…'}</p> : <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500"><tr>{['Course ID', 'Code ending', 'Student', 'Status', 'Expiry', 'Actions'].map(t => <th className="p-4" key={t}>{t}</th>)}</tr></thead><tbody>{codes.filter(c => [c.courseId, c.assignedEmail, c.redeemedBy, c.status, c.hint].join(' ').toLowerCase().includes(search.toLowerCase())).map(c => <tr key={c._id} className="border-t border-slate-100"><td className="p-4 font-mono">{c.courseId}</td><td className="p-4 font-mono">…{c.hint}</td><td className="p-4">{c.redeemedBy || c.assignedEmail || 'Unassigned'}{c.redeemedAt && <small className="block text-slate-400">Redeemed {new Date(c.redeemedAt).toLocaleString()}</small>}</td><td className="p-4"><span className="bg-blue-50 text-blue-700 rounded-full px-3 py-1">{c.status}</span></td><td className="p-4">{c.expiresAt ? new Date(c.expiresAt).toLocaleString() : 'No expiry'}</td><td className="p-4">{c.status !== 'revoked' && <button onClick={() => setTarget(c)} className="text-red-600 font-semibold">Revoke</button>}</td></tr>)}</tbody></table>{codes.length === 0 && <p className="p-10 text-center text-slate-500">No access codes yet. Generate your first code above.</p>}</div>}
  </main>;
}
