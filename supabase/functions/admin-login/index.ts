import { createClient } from 'npm:@supabase/supabase-js@2.117.3';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (body: unknown, status = 200) => Response.json(body, {
  status, headers: { ...cors, 'Cache-Control': 'no-store' },
});

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed.' }, 405);
  try {
    if (Number(req.headers.get('content-length') || 0) > 1024) return reply({ error: 'Request too large.' }, 413);
    const body = await req.json();
    const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const url = Deno.env.get('SUPABASE_URL');
    if (!secret || !url) return reply({ error: 'Login is unavailable.' }, 503);
    const options = { auth: { persistSession: false, autoRefreshToken: false } };
    const server = createClient(url, secret, options);
    const { data: permission, error } = await server.rpc('verify_admin_pin', {
      input_pin: typeof body.pin === 'string' ? body.pin.slice(0, 16) : '',
    });
    if (error) return reply({ error: 'Login is unavailable.' }, 503);
    if (permission.limited) return reply({ error: 'Too many attempts. Try again in one minute.' }, 429);
    if (!permission.valid) return reply({ error: 'Invalid administrator code.' }, 401);

    // A separate, strong Auth credential stays on the server. The browser receives
    // a normal user session subject to database RLS, never the service-role key.
    const signingKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', signingKey,
      new TextEncoder().encode(`bipolar-kids-admin:${permission.email}`));
    const password = Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, '0')).join('') + 'Aa!';
    const auth = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, options);
    let login = await auth.auth.signInWithPassword({ email: permission.email, password });
    if (login.error) {
      const created = await server.auth.admin.createUser({ email: permission.email, password, email_confirm: true });
      // Never reset an existing user's password to force a successful login.
      if (created.error) return reply({ error: 'Administrator account setup failed.' }, 503);
      login = await auth.auth.signInWithPassword({ email: permission.email, password });
    }
    if (login.error || !login.data.user || !login.data.session) return reply({ error: 'Login failed.' }, 503);
    const granted = await server.from('site_admins').upsert({ user_id: login.data.user.id });
    if (granted.error) return reply({ error: 'Administrator access could not be granted.' }, 503);
    return reply({ access_token: login.data.session.access_token, refresh_token: login.data.session.refresh_token });
  } catch { return reply({ error: 'Login request failed.' }, 400); }
});
