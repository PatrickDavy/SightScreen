/** Jest runs against the fake capability implementations so no native modules
 *  load in the test environment. Repo tests use better-sqlite3. */
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    // Must precede the generic '@/' rule — mapper order is significant. The
    // preset resolves the ios platform, so a `.web.ts` split would not be
    // picked up here; this explicit entry is what keeps expo-audio and friends
    // out of the test environment.
    '^@/capabilities$': '<rootDir>/src/capabilities/index.fake.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    // Jest resolves the package's `react-native` export condition, which points
    // at an untransformed .mjs bundle. Metro is happy with it; jest is not, so
    // tests take the CJS build instead. App bundling is unaffected.
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|lucide-react-native|zustand))',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
