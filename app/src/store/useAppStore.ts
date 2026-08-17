/**
 * Deliberately small.
 *
 * The repositories are fully synchronous, so a screen can read the truth during
 * render — there is nothing to cache and no loading state to model. A store is
 * only needed for two things: telling React that a write happened (SQLite has
 * no observer), and holding state that outlives the screen which created it.
 *
 * Notably absent: the bowler (read it from the repo; mirroring the record whose
 * yob drives the entire junior policy would create a second source of truth for
 * the most safety-critical row in the app), the unit (a field on the bowler),
 * the capture session type (a navigation param, so it cannot go stale), and the
 * live capture session (a reducer inside CaptureScreen — it ticks once per
 * delivery, and a global store would re-render every subscriber on the one
 * screen that must not drop frames).
 */
import { create } from 'zustand';

import { EntitlementState } from '@/domain/paywall';
import { ToastTone } from '@/components';

export interface ToastItem {
  id: string;
  tone: ToastTone;
  text: string;
}

interface AppStore {
  /** Bumped after every write so reads re-run. See ReposProvider's `mutate`. */
  dataVersion: number;
  bumpData(): void;

  toasts: ToastItem[];
  showToast(text: string, tone?: ToastTone): void;
  dismissToast(id: string): void;

  /** Write-through mirror of repos.settings['entitlement']. */
  entitlement: EntitlementState | null;
  setEntitlement(entitlement: EntitlementState): void;
}

let toastSeq = 0;

export const useAppStore = create<AppStore>((set) => ({
  dataVersion: 0,
  bumpData: () => set((s) => ({ dataVersion: s.dataVersion + 1 })),

  toasts: [],
  showToast: (text, tone = 'neutral') => {
    toastSeq += 1;
    const id = `toast_${toastSeq}`;
    set((s) => ({ toasts: [...s.toasts, { id, tone, text }] }));
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  entitlement: null,
  setEntitlement: (entitlement) => set({ entitlement }),
}));
