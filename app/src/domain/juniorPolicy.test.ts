/**
 * Junior policy, for the accounts that predate the 18+ gate.
 *
 * v1 refuses under-18 sign-ups, so nothing in the app can produce a junior
 * account any more. These accounts still exist on the phones of people who
 * onboarded before that landed, and this policy is what they run through. The
 * suite exists so the behaviour cannot rot while it is unreachable from the UI
 * — an unreachable path with no tests is a path that will be broken by the time
 * minors are readmitted.
 */
import { guidelineFor } from './guidelines';
import { isJunior, juniorPolicy } from './juniorPolicy';

const NOW_YEAR = 2026;

const adult = () => juniorPolicy(1996, 'none', NOW_YEAR);
const junior = (age: number, consent: 'none' | 'pending' | 'granted' = 'none') =>
  juniorPolicy(NOW_YEAR - age, consent, NOW_YEAR);

describe('an adult account', () => {
  it('lands on Home with pace first', () => {
    expect(adult().landingTab).toBe('home');
    expect(adult().homeOrder).toEqual(['pace', 'load']);
  });

  it('can share, export and receive personal-best notifications', () => {
    const p = adult();
    expect(p.sharingEnabled).toBe(true);
    expect(p.exportEnabled).toBe(true);
    expect(p.pbNotifications).toBe(true);
  });

  it('carries no age-band badge and never shows consent as pending', () => {
    expect(adult().accountBadge).toBeNull();
    expect(adult().consentPending).toBe(false);
  });
});

describe('a junior account created before the 18+ gate', () => {
  it('lands on the workload surface, not Home', () => {
    expect(junior(15).landingTab).toBe('load');
    expect(junior(15).homeOrder).toEqual(['load', 'pace']);
  });

  it('keeps sharing and export off while consent is absent', () => {
    expect(junior(15).sharingEnabled).toBe(false);
    expect(junior(15).exportEnabled).toBe(false);
  });

  it('never offers personal-best notifications, at any consent state', () => {
    // No mechanic that rewards bowling more, faster, or on consecutive days.
    for (const consent of ['none', 'pending', 'granted'] as const) {
      expect(junior(15, consent).pbNotifications).toBe(false);
    }
  });

  it('badges the age band', () => {
    expect(junior(15).accountBadge).toBe('U17 account');
    expect(junior(17).accountBadge).toBe('U19 account');
  });

  it('still honours a consent that was granted before the gate', () => {
    const p = junior(15, 'granted');
    expect(p.sharingEnabled).toBe(true);
    expect(p.exportEnabled).toBe(true);
    expect(p.consentPending).toBe(false);
  });
});

describe('the policy stays total', () => {
  it('returns a guideline and a policy for every plausible bowling age', () => {
    for (let age = 8; age <= 60; age += 1) {
      const yob = NOW_YEAR - age;
      const p = juniorPolicy(yob, 'none', NOW_YEAR);
      expect(p.isJunior).toBe(isJunior(yob, NOW_YEAR));
      expect(guidelineFor(yob, NOW_YEAR).label).toBeTruthy();
    }
  });
});
