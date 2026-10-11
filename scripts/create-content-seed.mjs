import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../src/app/App.tsx', import.meta.url), 'utf8');
const readArray = name => {
  const start = source.indexOf(`const ${name}:`);
  if (start < 0) throw new Error(`Missing ${name}`);
  const bodyStart = source.indexOf('= [', start) + 2;
  const end = source.indexOf('\n];', bodyStart) + 2;
  const expression = source.slice(bodyStart, end)
    .replace(/\s*customAvatar: \w+,/g, '')
    .replace(/\s*logoImage: \w+,/g, '');
  return vm.runInNewContext(expression, {}, { timeout: 1000 });
};
const datasets = {
  projects: readArray('PROJECTS'),
  members: readArray('INITIAL_MEMBERS').map(member => ({ ...member, avatarKey: member.codename })),
  events: readArray('INITIAL_EVENTS'),
  calendar: [],
};
const statements = Object.entries(datasets).map(([kind, items]) => {
  const json = JSON.stringify(items).replaceAll("'", "''");
  return `insert into public.site_content (kind, content, version) values ('${kind}', '${json}'::jsonb, 1) on conflict (kind) do nothing;`;
});
fs.writeFileSync(new URL('../supabase/seed.sql', import.meta.url), '-- Seed current content; preserve existing server edits.\n' + statements.join('\n') + '\n');
console.log('Created supabase/seed.sql');
