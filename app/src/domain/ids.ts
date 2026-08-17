let counter = 0;

/** Sortable unique id — timestamp base36 plus a per-process counter. */
export function newId(prefix: string, now: number = Date.now()): string {
  counter = (counter + 1) % 46656; // 36^3
  return `${prefix}_${now.toString(36)}${counter.toString(36).padStart(3, '0')}`;
}
