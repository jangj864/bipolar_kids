import React, { createContext, useContext, useEffect, useState } from 'react';
import { backend, loginWithPin } from './backend';

const AdminContext = createContext(false);
export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!backend) return;
    let active = true;
    let generation = 0;
    async function check(userId?: string) {
      const current = ++generation;
      setIsAdmin(false);
      if (!userId) return;
      const { data, error } = await backend!.from('site_admins').select('user_id').eq('user_id', userId).maybeSingle();
      if (active && current === generation) setIsAdmin(!error && !!data);
    }
    backend.auth.getSession().then(({ data }) => check(data.session?.user.id));
    const { data } = backend.auth.onAuthStateChange((_event, session) => {
      // Run database reads outside the auth event callback.
      queueMicrotask(() => { if (active) void check(session?.user.id); });
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);
  async function login(event: React.FormEvent) {
    event.preventDefault();
    if (!backend || busy) return;
    setBusy(true); setMessage('');
    try {
      await loginWithPin(password);
      setPassword('');
      setIsAdmin(true); setOpen(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Login failed. Please try again.'); }
    finally { setBusy(false); }
  }
  return (
    <AdminContext.Provider value={isAdmin}>
      {children}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-8 pb-6 text-xs" style={{ color: '#00ff41' }}>
        {isAdmin ? (
          <button type="button" className="min-h-11" onClick={async () => {
            const result = await backend!.auth.signOut();
            if (result.error) { setMessage(result.error.message); return; }
            setIsAdmin(false);
          }}>[ ADMIN · SIGN OUT ]</button>
        ) : <button type="button" className="min-h-11" onClick={() => setOpen(value => !value)}>[ ADMIN LOGIN ]</button>}
        {open && !isAdmin && (
          backend ? <form onSubmit={login} className="max-w-md border border-green-500/30 p-4 space-y-3">
            <label className="block">ADMIN CODE<input required type="password" inputMode="numeric" maxLength={4} autoComplete="off" value={password} onChange={e => setPassword(e.target.value)} className="block w-full bg-black border p-2 text-base" /></label>
            <button disabled={busy} className="border px-4 py-3">{busy ? 'SIGNING IN…' : 'SIGN IN'}</button>
          </form> : <p>Administrator login will be available once the server is connected.</p>
        )}
        {message && <p role="alert" className="mt-2">{message}</p>}
      </div>
    </AdminContext.Provider>
  );
}
