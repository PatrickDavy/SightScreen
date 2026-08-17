/** Narrow synchronous SQL surface so the same repo code runs on device
 *  (expo-sqlite), in jest (better-sqlite3) and — via the memory repos — on web. */
export type SqlValue = string | number | null;

export interface SqlAdapter {
  run(sql: string, params?: SqlValue[]): void;
  all<T = Record<string, SqlValue>>(sql: string, params?: SqlValue[]): T[];
  transaction(fn: () => void): void;
}
