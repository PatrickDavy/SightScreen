/**
 * The three kinds of spell, in the bowler's language. The type decides the
 * workload weighting, so this is not cosmetic: match balls cost more.
 */
import { SessionType } from '@/domain/types';

export interface SessionTypeOption {
  value: SessionType;
  label: string;
  description: string;
}

export const SESSION_TYPE_OPTIONS: SessionTypeOption[] = [
  {
    value: 'net',
    label: 'Net session',
    description: 'The default. Counts toward load at net weighting.',
  },
  {
    value: 'match',
    label: 'Match spell',
    description: 'Weighted heavier in your workload — match balls cost more.',
  },
  {
    value: 'drill',
    label: 'Drill check',
    description: 'Short, focused retest of your current drill. 6–12 balls.',
  },
];

export function sessionTypeLabel(type: SessionType): string {
  return SESSION_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? 'Net session';
}
