/** Native entry point — SQLite is the primary store (offline-first). */
import { openDatabaseSync } from 'expo-sqlite';

import { SqlAdapter, SqlValue } from '@/data/db/adapter';

import { createSqlRepos } from './sqlRepos';
import { Repos } from './types';

export type { Repos } from './types';

export function createRepos(): Repos {
  const db = openDatabaseSync('sightscreen.db');
  const adapter: SqlAdapter = {
    run(sql: string, params: SqlValue[] = []) {
      db.runSync(sql, params);
    },
    all<T>(sql: string, params: SqlValue[] = []): T[] {
      return db.getAllSync<T>(sql, params);
    },
    transaction(fn: () => void) {
      db.withTransactionSync(fn);
    },
  };
  return createSqlRepos(adapter);
}
