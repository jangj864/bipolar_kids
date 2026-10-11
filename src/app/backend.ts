import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const backend = url && key ? createClient(url, key) : null;

export async function loginWithPin(pin: string) {
  if (!backend) throw new Error('Administrator login is unavailable.');
  const { data, error } = await backend.functions.invoke('admin-login', { body: { pin } });
  if (error) {
    let message = 'Administrator login failed. Check the code and try again.';
    try { message = (await error.context.json()).error || message; } catch {}
    throw new Error(message);
  }
  const session = await backend.auth.setSession(data);
  if (session.error) throw session.error;
  const permission = await backend.from('site_admins').select('user_id').eq('user_id', session.data.user!.id).maybeSingle();
  if (permission.error || !permission.data) {
    await backend.auth.signOut();
    throw new Error('Administrator access is unavailable.');
  }
}
