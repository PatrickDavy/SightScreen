import { createSimulatedEngines } from '@/capabilities/simulatedEngine';
import type { DeliveryObservation } from '@/capabilities/types';
import { createMemoryRepos } from '@/data/repos/memoryRepos';

import { Analytics, AnalyticsEvent, setAnalytics, track } from './analytics';
import { endSession, processSession, startSession } from './persistSession';

function spy() {
  const events: { event: AnalyticsEvent; properties?: Record<string, unknown> }[] = [];
  const analytics: Analytics = {
    track: (event, properties) => events.push({ event, properties }),
  };
  setAnalytics(analytics);
  return events;
}

afterEach(() => {
  // Back to the no-op, so one test's sink cannot capture another's events.
  setAnalytics({ track: () => {} });
});

const observation = (index: number, over: Partial<DeliveryObservation> = {}): DeliveryObservation => ({
  index,
  atMs: index * 3800,
  speedKmh: 112,
  speedBandKmh: 2.3,
  engineConfidence: 'ok',
  frameCount: 26,
  events: null,
  clipPath: null,
  metrics: [{ key: 'knee', value: 148, bandValue: 5 }],
  ...over,
});

describe('analytics', () => {
  it('does nothing until a sink is set', () => {
    setAnalytics({ track: () => {} });
    expect(() => track('session_captured')).not.toThrow();
  });

  it('forwards events to whatever sink is installed', () => {
    const events = spy();
    track('paywall_shown', { trigger: 'fourth_session' });
    expect(events).toEqual([
      { event: 'paywall_shown', properties: { trigger: 'fourth_session' } },
    ]);
  });

  it('flags each low-confidence delivery, which is how credibility is judged', async () => {
    const events = spy();
    const repos = createMemoryRepos();
    const { inference } = createSimulatedEngines({ processingStepMs: 0 });

    const { session } = startSession({
      repos,
      bowlerId: 'b1',
      sessionType: 'net',
      // Overriding a placement check makes every delivery low-confidence.
      overrodeChecks: true,
      captureFps: 240,
      simulated: true,
    });
    endSession({
      repos,
      sessionId: session.id,
      bowlerId: 'b1',
      clipPath: null,
      observations: [observation(1), observation(2)],
      thermalEvents: [],
      captureFps: 240,
    });
    await processSession({ repos, sessionId: session.id, inference });

    const flagged = events.filter((e) => e.event === 'low_confidence_flagged');
    expect(flagged).toHaveLength(2);
    expect(flagged[0]?.properties).toMatchObject({ overridden: true });
  });

  it('does not flag a sound delivery', async () => {
    const events = spy();
    const repos = createMemoryRepos();
    const { inference } = createSimulatedEngines({ processingStepMs: 0 });

    const { session } = startSession({
      repos,
      bowlerId: 'b1',
      sessionType: 'net',
      overrodeChecks: false,
      captureFps: 240,
      simulated: true,
    });
    endSession({
      repos,
      sessionId: session.id,
      bowlerId: 'b1',
      clipPath: null,
      observations: [observation(1)],
      thermalEvents: [],
      captureFps: 240,
    });
    await processSession({ repos, sessionId: session.id, inference });

    expect(events.filter((e) => e.event === 'low_confidence_flagged')).toHaveLength(0);
  });
});
