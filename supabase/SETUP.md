# Online administrator editing

Connection is pending. No Supabase project or administrator has been created by
this checkout. Unconfigured previews are read-only; the existing four-digit site
entry code is not an administrator credential.

1. Create a dedicated `bipolar-kids` project under the DDOAZOO organization.
   Review Supabase's displayed cost before submitting. Keep unicorn-vs-dragon separate.
2. Run `schema.sql` once in the new project's SQL Editor.
3. Create an administrator using Authentication > Users. Enter its password only
   in Supabase, never in source code or a chat. Disable public signups if only
   administrators need accounts.
4. Add that user's UUID to `public.site_admins` using the SQL example in `schema.sql`.
   Only the database owner can add administrators. Signed-in users cannot promote themselves.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`
   using the Project URL and public publishable key. Never use a service-role or
   secret key in Vite. Restart the development server after changing environment variables.
6. Seed the current site content with `node scripts/create-content-seed.mjs`,
   then run the generated `supabase/seed.sql` in the SQL Editor. Existing rows
   are preserved. This ensures first-time visitors see the same server data.
7. For GitHub Pages, add the same two public values to repository Settings >
   Secrets and variables > Actions > Variables. Commit and push when ready.

Verify before publishing: a visitor can read but cannot change content; an
authenticated user absent from site_admins cannot change content or add admins;
the selected administrator can save, reload, and see changes from a second browser.
Check add/edit/delete for projects, events, members, and calendar entries. Open
two admin browsers and confirm that a stale save fails rather than overwriting
another administrator's changes. A save failure must leave existing data intact.

Changes save per section with optimistic version checks. A read or write error
is displayed; no successful save is claimed until the server accepts the change.
New member drafts are not saved until confirmed. Built-in avatar components
are restored via stable avatar keys. Uploaded posters are saved with content as
data URLs; a separate storage bucket can be added for large image collections.
