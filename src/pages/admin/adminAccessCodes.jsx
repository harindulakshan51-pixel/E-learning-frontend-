import { useEffect, useState } from 'react';
import { api, errorMessage } from '../../utils/api';
export default function AdminAccessCodes() {
  const [courses, setCourses] = useState([]);
  const [codes, setCodes] = useState(null);
  const [form, setForm] = useState({ courseId: '', assignedEmail: '', expiresAt: '' });
  const [issued, setIssued] = useState('');
  const [visibleKeys, setVisibleKeys] = useState({});
  const [loadingKeys, setLoadingKeys] = useState({});
  const [keyErrors, setKeyErrors] = useState({});
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
  async function toggleKey(id) {
    if (visibleKeys[id]) {
      setVisibleKeys(keys => { const next = { ...keys }; delete next[id]; return next; });
      return;
    }
    setLoadingKeys(keys => ({ ...keys, [id]: true }));
    setKeyErrors(errors => ({ ...errors, [id]: '' }));
    try {
      const { data } = await api.get('/access-codes/' + id + '/key');
      setVisibleKeys(keys => ({ ...keys, [id]: data.code }));
    } catch (error) {
      setKeyErrors(errors => ({ ...errors, [id]: errorMessage(error) }));
    } finally { setLoadingKeys(keys => ({ ...keys, [id]: false })); }
  }
  async function deleteCode() {
    setBusy(true);
    try {
      const { data } = await api.delete('/access-codes/' + target._id);
      setCodes(rows => rows.filter(row => row._id !== target._id));
      setVisibleKeys(keys => { const next = { ...keys }; delete next[target._id]; return next; });
      setIssued('');
      setMessage(data.message);
      setTarget(null);
    } catch (error) { setMessage(errorMessage(error)); } finally { setBusy(false); }
  }
  async function revoke() {
    setBusy(true);
    try { const { data } = await api.post('/access-codes/' + target._id + '/revoke'); setMessage(data.message); setTarget(null); setCodes((await api.get('/access-codes')).data); }
    catch (e) { setMessage(errorMessage(e)); } finally { setBusy(false); }
  }
  return <main className="p-5 md:p-10 max-w-7xl mx-auto">
    <h1 className="text-3xl font-extrabold text-slate-900">Access Codes</h1><p className="text-slate-500 mt-2 mb-8"><span>Issue one code per student after confirming payment outside <span className="text-brand">Scholarly</span>.</span></p>
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
          <button type="button" onClick={() => { setForm({ ...form, expiresAt: '' }); setExpiryError(''); setMessage(''); }} className="text-xs font-semibold text-accent whitespace-nowrap">No expiry</button>
        </div>
        {expiryError && <p id="expiry-error" role="alert" className="text-sm text-red-600 mt-2">{expiryError}</p>}
      </div>
      <button disabled={busy} className="bg-accent text-white rounded-xl px-6 py-3 font-bold disabled:opacity-50">{busy ? 'Working…' : 'Generate Access Code'}</button>
      <p className="text-sm text-slate-500 md:col-span-2">Generate a code and give it to the student. They must sign in with the assigned email and enter it on the course overview to enroll. Codes are single-use. Revoking a redeemed code also removes its enrollment.</p>
    </form>
    {message && <p role="status" className="my-5 p-4 bg-accent-50 text-accent rounded-xl">{message}</p>}
    {issued && <div className="my-5 border border-accent-200 bg-white p-6 rounded-xl"><p className="font-semibold mb-3">Copy now and send privately to your student</p><code className="break-all text-accent text-lg">{issued}</code><div className="mt-4 flex gap-4"><button onClick={() => navigator.clipboard.writeText(issued).then(() => setMessage('Code copied')).catch(() => setMessage('Select and copy the code above.'))} className="text-accent font-bold">Copy code</button><button onClick={() => setIssued('')} className="text-slate-500">Hide code</button></div></div>}
    {target && <div role="alertdialog" aria-label={target.status === 'revoked' ? 'Confirm code deletion' : 'Confirm code revocation'} className="my-5 p-6 rounded-xl border border-red-200 bg-red-50"><p>{target.status === 'revoked' ? `Permanently delete revoked code ending ${target.hint}?` : `Revoke code ending ${target.hint} and the enrollment it granted?`}</p><button disabled={busy} onClick={target.status === 'revoked' ? deleteCode : revoke} className="bg-red-600 text-white px-4 py-2 rounded-lg mt-3 mr-3 disabled:opacity-50">{busy ? 'Working…' : target.status === 'revoked' ? 'Delete code' : 'Revoke access'}</button><button disabled={busy} onClick={() => setTarget(null)}>Cancel</button></div>}
    <input aria-label="Search access codes" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search course, student, status or code ending…" className="my-6 p-3 rounded-xl border border-slate-200 w-full max-w-lg bg-white" />
    {!codes ? <p role="status">{message ? 'Codes could not be loaded.' : 'Loading access codes…'}</p> : <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500"><tr>{['Course ID', 'Access key', 'Student', 'Status', 'Expiry', 'Actions'].map(t => <th className="p-4" key={t}>{t}</th>)}</tr></thead><tbody>{codes.filter(c => [c.courseId, c.assignedEmail, c.redeemedBy, c.status, c.hint].join(' ').toLowerCase().includes(search.toLowerCase())).map(c => <tr key={c._id} className="border-t border-slate-100"><td className="p-4 font-mono">{c.courseId}</td><td className="p-4">
      <code id={`key-${c._id}`} className="block break-all">{visibleKeys[c._id] || `…${c.hint}`}</code>
      <div className="flex gap-3 mt-2">
        <button type="button" disabled={loadingKeys[c._id]} aria-expanded={Boolean(visibleKeys[c._id])} aria-controls={`key-${c._id}`} onClick={() => toggleKey(c._id)} className="text-accent font-semibold whitespace-nowrap disabled:opacity-50">{loadingKeys[c._id] ? 'Loading…' : visibleKeys[c._id] ? 'Hide key' : 'View key'}</button>
        {visibleKeys[c._id] && <button type="button" onClick={() => navigator.clipboard.writeText(visibleKeys[c._id]).then(() => setMessage('Key copied')).catch(() => setMessage('Select and copy the key in the table.'))} className="text-accent font-semibold whitespace-nowrap">Copy key</button>}
      </div>
      {keyErrors[c._id] && <p role="alert" className="mt-2 text-xs text-red-600 max-w-xs">{keyErrors[c._id]}</p>}
    </td><td className="p-4">{c.redeemedBy || c.assignedEmail || 'Unassigned'}{c.redeemedAt && <small className="block text-slate-400">Redeemed {new Date(c.redeemedAt).toLocaleString()}</small>}</td><td className="p-4"><span className="bg-accent-50 text-accent rounded-full px-3 py-1">{c.status}</span></td><td className="p-4">{c.expiresAt ? new Date(c.expiresAt).toLocaleString() : 'No expiry'}</td><td className="p-4"><button type="button" disabled={busy} onClick={() => setTarget(c)} className="text-red-600 font-semibold disabled:opacity-50">{c.status === 'revoked' ? 'Delete' : 'Revoke'}</button></td></tr>)}</tbody></table>{codes.length === 0 && <p className="p-10 text-center text-slate-500">No access codes yet. Generate your first code above.</p>}</div>}
  </main>;
}
