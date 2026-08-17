/**
 * Instrumentation.
 *
 * Exactly the events the business case's Gate 2 questions need, and few others.
 * No analytics provider is wired up yet and none is in scope, so this is a typed
 * no-op: the call sites exist and are named correctly, and turning it on later
 * is a change to this one file.
 *
 * The minimisation rule applies here as everywhere else: no video, no pose data,
 * and for under-18 accounts no identifier leaves the device at all.
 */

export type AnalyticsEvent =
  /** Does the aha land? onboarding_complete → first_capture_started →
   *  first_insight_viewed, target >60% within 7 days. */
  | 'onboarding_complete'
  | 'first_capture_started'
  | 'first_insight_viewed'
  /** Does the loop close? The single most important funnel in the product. */
  | 'insight_viewed'
  | 'drill_started'
  | 'retest_completed'
  /** Where does capture fail? One per S21–S26 transition, with a reason. */
  | 'capture_state_changed'
  /** Is the speed metric credible? Rate of low-confidence flags. */
  | 'low_confidence_flagged'
  /** Week-4 retention, cohorted by signup week. Gate 2 passes at 40%. */
  | 'session_captured'
  /** Does the paywall sit right? Conversion by trigger type. */
  | 'paywall_shown';

export type AnalyticsProperties = Record<string, string | number | boolean | null>;

export interface Analytics {
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void;
}

const noop: Analytics = {
  track() {
    // TODO(instrumentation): forward to a provider once one is chosen. Until
    // then this stays a no-op rather than a console log, so it cannot become
    // noise that hides a real warning.
  },
};

let current: Analytics = noop;

/** Swap the sink — a provider in production, a spy in a test. */
export function setAnalytics(analytics: Analytics): void {
  current = analytics;
}

export function track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
  current.track(event, properties);
}
