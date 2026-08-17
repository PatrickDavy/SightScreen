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

// React's act() notices are harness artifacts, not product defects, and all
// three would otherwise fail tests for reasons a reader cannot act on:
//   - "not wrapped in act": RN's Animated drives WorkloadMeter/Switch/Radio from
//     a real timer that can land after its own test finished, failing whichever
//     unrelated test happens to be running at the time.
//   - "overlapping act": the testing library keeps an act scope open across an
//     async render, so any nested act trips it.
//   - "not configured to support act": genuinely asynchronous work — processing
//     a session reports progress from a promise chain — updates state outside
//     any act scope, which is the behaviour under test, not a bug.
// Deliberately narrow. Nothing else is tolerated, and console.warn — where
// Metric's bare-number invariant lives — is untouched.
const IGNORED = [
  /not wrapped in act\(/,
  /overlapping act\(\) calls/,
  /not configured to support act\(/,
];

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
