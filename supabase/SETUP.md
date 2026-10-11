# Online content editing

The dedicated bipolar_kids Supabase project is pspaahqoxijhheojweqq.
Schema, initial content, PIN login, and local connection values are configured.
GitHub Actions uses the same public values from repository Variables.

Enter the configured four-digit code to log in as administrator, or choose
ENTER AS VISITOR to sign out and browse without editing rights. The footer
supports admin login and sign-out. Project, event, member, and calendar edits
save directly to Supabase; source changes still require your manual GitHub push.

The administrator email is ddoazoo@gmail.com. Its Auth password is an internal
server credential, not the four-digit code. The admin-login Edge Function checks
a bcrypt PIN hash in private.admin_pin. Global attempts are limited to ten per
minute. Clients receive an ordinary Auth session subject to RLS, never the
service-role key. Change the PIN hash through the database owner SQL Editor.
Never expose the private schema through the Data API.

For a fresh project, run schema.sql then admin-pin.sql, generate seed.sql with
node scripts/create-content-seed.mjs and apply it, and deploy
supabase/functions/admin-login/index.ts. Disable gateway JWT verification only
for this function: it verifies the PIN itself before issuing a user session.
Set the two public Vite variables locally and in GitHub Actions Variables.
Never use a service-role key in frontend environment variables. Rotating the
server service-role signing secret also requires resetting the internal Auth
credential used by PIN login.

Verification: database tests covered visitor reads and rejected writes,
non-admin writes and self-promotion rejection, admin writes, and stale versions.
Real API tests covered incorrect-code rejection, PIN admin login, persistent
writes readable by visitors, and stale-save rejection. Test changes were removed.
A failed save keeps the editor open. Browser interaction testing remains to be
performed in the local preview. No GitHub push was performed during this setup.
