/** Web entry point — in-memory store with a localStorage snapshot so the demo
 *  keeps its data across reloads. Native builds never load this file. */
import { createMemoryRepos, emptyStore, MemoryStore } from './memoryRepos';
import { Repos } from './types';

export type { Repos } from './types';

const KEY = 'sightscreen-web-v1';

export function createRepos(): Repos {
  let store: MemoryStore = emptyStore();
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    if (raw) store = { ...emptyStore(), ...(JSON.parse(raw) as MemoryStore) };
  } catch {
    // Corrupt snapshot — start clean rather than crash.
  }
  let queued = false;
  const snapshot = () => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      try {
        globalThis.localStorage?.setItem(KEY, JSON.stringify(store));
      } catch {
        // Storage full or unavailable — the in-memory copy still works.
      }
    }, 200);
  };
  return createMemoryRepos(store, snapshot);
}
