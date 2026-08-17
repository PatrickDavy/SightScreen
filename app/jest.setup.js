/* eslint-disable no-undef */
// Shared jest setup. Native-module-touching code resolves to web/fake
// implementations via the capabilities layer, so no native mocks are needed here.

// An unexpected console.warn/error fails the test. This is what makes the
// handover's "no bare measured number" invariant enforceable at runtime:
// Metric warns in __DEV__ when a measured value renders without a band, so any
// screen that prints a naked number fails its own render test.
//
// A test that deliberately provokes a warning should spy on the method
// (jest.spyOn(console, 'warn').mockImplementation(() => {})), which replaces it
// for the duration and so never reaches this guard.
const ESCALATED = ['warn', 'error'];

// React's "not wrapped in act(...)" notice is a harness artifact, not a product
// defect: RN's Animated drives WorkloadMeter/Switch/Radio from a real timer that
// can land after its own test has finished, which would otherwise fail whichever
// unrelated test happens to be running. Deliberately narrow — nothing else is
// tolerated.
const IGNORED = [/not wrapped in act\(/];

const original = {};
let leaked = [];

beforeEach(() => {
  leaked = [];
  for (const method of ESCALATED) {
    original[method] = console[method];
    console[method] = (...args) => {
      const text = args.map(String).join(' ');
      if (!IGNORED.some((re) => re.test(text))) leaked.push(`console.${method}: ${text}`);
      original[method](...args);
    };
  }
});

afterEach(() => {
  for (const method of ESCALATED) {
    if (original[method]) console[method] = original[method];
  }
  if (leaked.length > 0) {
    const seen = leaked.join('\n');
    leaked = [];
    throw new Error(
      `Unexpected console output during this test:\n${seen}\n\n` +
        'Fix the cause, or spy on the method if the warning is the thing under test.',
    );
  }
});
