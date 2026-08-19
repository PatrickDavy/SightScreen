/**
 * The minimum age for a Sightscreen account.
 *
 * v1 is 18 and over. That is a retreat, not a principle: the handover names the
 * age gate, guardian consent, the workload ledger and confidence flagging as
 * the ethical floor, and under-18 quicks in a net are the bowlers the workload
 * ledger was built to protect. Guardian consent has to be completed on the
 * guardian's own device, which needs a service that does not exist yet, so
 * rather than admit minors under a consent mechanism that cannot work, v1 does
 * not admit them at all. See [[juniorPolicy]], which stays in the tree intact
 * for when they can be readmitted.
 *
 * Age is derived from year of birth alone, because year of birth is all the
 * bowler is ever asked for — the age question stays "when were you born?",
 * never "are you over 18?", which teaches lying. That makes this the age the
 * bowler turns during the current calendar year, so someone who turns 18 in
 * December passes in January. `isJunior` and `guidelineFor` compute age the
 * same way, and consistency between them matters more than the edge: a gate
 * that disagreed with the guideline banding would be worse than a lenient one.
 * Tightening it means storing a full date of birth, which is more personal data
 * for a narrower benefit.
 */

/** Accounts are 18 and over in v1. */
export const MINIMUM_AGE = 18;

/** Age the bowler turns in `nowYear`. Matches `isJunior` and `guidelineFor`. */
export function ageAt(yob: number, nowYear: number): number {
  return nowYear - yob;
}

/** Old enough to hold an account. */
export function meetsMinimumAge(yob: number, nowYear: number): boolean {
  return ageAt(yob, nowYear) >= MINIMUM_AGE;
}
