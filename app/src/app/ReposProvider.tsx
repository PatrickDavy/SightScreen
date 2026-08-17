/**
 * Repository injection.
 *
 * The repos are synchronous, so screens read them during render. `mutate` is
 * the one convention that makes that safe: it runs the write and then bumps
 * `dataVersion`, which is what re-runs those reads. Writing through the repo
 * directly will update the database and leave the screen stale.
 */
import React, { createContext, useContext, useMemo } from 'react';

import { Repos } from '@/data/repos/types';
import { useAppStore } from '@/store/useAppStore';

export interface ReposContextValue {
  repos: Repos;
  /** Run a write, then tell every reader to re-read. */
  mutate<T>(fn: (repos: Repos) => T): T;
}

const ReposContext = createContext<ReposContextValue | null>(null);

export function ReposProvider({ repos, children }: { repos: Repos; children: React.ReactNode }) {
  const bumpData = useAppStore((s) => s.bumpData);

  const value = useMemo<ReposContextValue>(
    () => ({
      repos,
      mutate(fn) {
        const result = fn(repos);
        bumpData();
        return result;
      },
    }),
    [repos, bumpData],
  );

  return <ReposContext.Provider value={value}>{children}</ReposContext.Provider>;
}

export function useRepos(): ReposContextValue {
  const value = useContext(ReposContext);
  if (!value) throw new Error('useRepos must be used inside a ReposProvider');
  return value;
}

/**
 * Read from the repos, re-running whenever a mutation lands.
 *
 * `const sessions = useRepoQuery(r => r.sessions.listSummaries());`
 */
export function useRepoQuery<T>(select: (repos: Repos) => T): T {
  const { repos } = useRepos();
  const dataVersion = useAppStore((s) => s.dataVersion);
  // select is intentionally not a dependency: callers pass an inline arrow, and
  // depending on its identity would re-run this on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => select(repos), [repos, dataVersion]);
}
