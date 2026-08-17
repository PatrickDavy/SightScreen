/**
 * Junior and guardian mode — structural, not cosmetic; gated on account age at
 * the data layer, not in the view (handover §5).
 */
import { ConsentState } from './types';

export interface JuniorPolicy {
  isJunior: boolean;
  /** Under-18 accounts land on the workload surface, not Home. */
  landingTab: 'home' | 'load';
  /** Home card order: workload status first for juniors, pace first for adults. */
  homeOrder: ['load', 'pace'] | ['pace', 'load'];
  /** Sharing/export are off for juniors until the guardian turns them on. */
  sharingEnabled: boolean;
  exportEnabled: boolean;
  /** No personal-best push mechanics for juniors, ever. */
  pbNotifications: boolean;
  consentPending: boolean;
  /** Age-band badge label shown on Home ("U17 account"), or null for adults. */
  accountBadge: string | null;
}

export function isJunior(yob: number, nowYear: number): boolean {
  return nowYear - yob < 18;
}

export function juniorPolicy(
  yob: number,
  consentState: ConsentState,
  nowYear: number,
): JuniorPolicy {
  const junior = isJunior(yob, nowYear);
  const consented = consentState === 'granted';
  const age = nowYear - yob;
  return {
    isJunior: junior,
    landingTab: junior ? 'load' : 'home',
    homeOrder: junior ? ['load', 'pace'] : ['pace', 'load'],
    sharingEnabled: !junior || consented,
    exportEnabled: !junior || consented,
    pbNotifications: !junior,
    consentPending: junior && consentState === 'pending',
    accountBadge: junior ? (age < 17 ? 'U17 account' : 'U19 account') : null,
  };
}
