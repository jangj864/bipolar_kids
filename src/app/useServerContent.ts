import { useEffect, useRef, useState, type SetStateAction } from 'react';
import { backend } from './backend';
import { useAdmin } from './Admin';

export type ContentSetter<T> = (action: SetStateAction<T[]>) => Promise<boolean>;

export function useServerContent<T>(kind: string, initial: T[], restore: (items: T[]) => T[] = items => items) {
  const [items, setItems] = useState(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const current = useRef(initial);
  const version = useRef<number | null>(null);
  const saving = useRef(false);
  const restoreRef = useRef(restore);
  restoreRef.current = restore;
  const admin = useAdmin();
  useEffect(() => {
    if (!backend) return;
    let active = true;
    async function load() {
      const result = await backend!.from('site_content').select('content,version').eq('kind', kind).maybeSingle();
      if (!active) return;
      if (result.error) { setError('Could not load server content. Refresh to retry.'); return; }
      if (result.data) {
        if (!Array.isArray(result.data.content)) { setError('Invalid server content.'); return; }
        const next = restoreRef.current(result.data.content);
        version.current = result.data.version;
        current.current = next;
        setItems(next);
      }
      setLoaded(true);
    }
    void load();
    return () => { active = false; };
  }, [kind]);
  const update: ContentSetter<T> = async action => {
    if (!backend || !admin || !loaded || saving.current) { setError("Editing requires administrator access and a connection to the server."); return false; }
    const next = typeof action === 'function' ? action(current.current) : action;
    saving.current = true; setBusy(true); setError('');
      try {
        // React avatar components are restored locally by a stable avatarKey.
        const content = JSON.parse(JSON.stringify(next));
        const nextVersion = (version.current ?? 0) + 1;
        const result = version.current === null
          ? await backend.from('site_content').insert({ kind, content, version: nextVersion }).select('version').single()
          : await backend.from('site_content').update({ content, version: nextVersion }).eq('kind', kind).eq('version', version.current).select('version').single();
        if (result.error) throw result.error;
        version.current = result.data.version;
        current.current = next;
        setItems(next);
        return true;
      } catch {
        setError('Changes were not saved. Check your connection and admin access. If another admin edited this section, refresh before retrying.');
        return false;
      } finally { saving.current = false; setBusy(false); }
  };
  return { items, update, error, busy, editable: admin && loaded && !busy };
}
