/**
 * Junior and guardian mode — structural, not cosmetic; gated on account age at
 * the data layer, not in the view (handover §5).
 *
 * UNREACHABLE IN v1, DELIBERATELY. Onboarding refuses anyone under 18 (see
 * [[accountAge]]), so no new account can make `isJunior` true. Nothing here is
 * dead code and none of it should be deleted:
 *
 *   1. Accounts created before that gate landed still exist on their owners'
 *      phones and still run through this policy. The gate blocks new sign-ups;
 *      it does not evict anyone already here. Those accounts are why the tests
 *      below still assert junior behaviour.
 *   2. Under-18 quicks are the bowlers the workload ledger was built for. The
 *      handover names the age gate, guardian consent, the ledger and confidence
 *      flagging as the ethical floor, and warns that retrofitting them later
 *      means retrofitting onto real minors' data. Two of the four survive v1.
 *
 * To readmit minors, three things must exist, in this order: a service that can
 * actually deliver a consent request to a guardian and record the reply (the
 * old S03 screen claimed to do this and sent nothing — see the header of
 * OnboardingScreen); the guardian view, S72; and compliance with Play's
 * Families policy plus the UK AADC / GDPR Article 8 obligations the handover
 * lists. Restoring the onboarding step alone would recreate the original lie.
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
