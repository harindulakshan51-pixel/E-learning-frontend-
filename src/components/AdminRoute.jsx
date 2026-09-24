import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../utils/api';
export default function AdminRoute({ children }) {
  const [state, setState] = useState('loading');
  useEffect(() => {
    let active = true;
    api.get('/users').then(({ data }) => { if (active) setState(data.isAdmin ? 'admin' : 'denied'); }).catch(() => { if (active) setState('denied'); });
    return () => { active = false; };
  }, []);
  if (state === 'loading') return <p className="p-12" role="status">Checking administrator access…</p>;
  return state === 'admin' ? children : <Navigate to="/login" replace />;
}
