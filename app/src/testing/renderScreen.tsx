/**
 * Render harness: the provider stack a screen needs, with fakes underneath.
 * Screens read the repositories synchronously during render, so a test can seed
 * a memory repo up front and assert on what the screen draws.
 */
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';

import { createFakeCapabilities, type FakeOptions } from '@/capabilities/index.fake';
import { CapabilityProvider } from '@/capabilities/context';
import type { Capabilities } from '@/capabilities/types';
import { createMemoryRepos } from '@/data/repos/memoryRepos';
import type { Repos } from '@/data/repos/types';
import { ReposProvider } from '@/app/ReposProvider';
import { navigationTheme } from '@/navigation/navigationTheme';
import { useAppStore } from '@/store/useAppStore';

/** A 390×844 handset with a notch — the prototype's viewport. */
const METRICS: Metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

export interface RenderOptions {
  repos?: Repos;
  capabilities?: Capabilities;
  /** Shorthand for tweaking the fakes without building a whole set. */
  fakes?: FakeOptions;
  /** Wrap in a NavigationContainer. Off for screens that take no navigation. */
  navigation?: boolean;
}

/** zustand stores are module singletons, so state leaks between tests. */
export function resetAppStore() {
  useAppStore.setState({ dataVersion: 0, toasts: [], entitlement: null });
}

/**
 * The previous render, so it can be torn down before the next one.
 *
 * This matters more than it looks. A tree left mounted with an unflushed update
 * — a text input that was typed into, say — stops the *next* root committing at
 * all, and the following test then fails on an empty tree with no hint as to
 * why. Unmounting explicitly here is more reliable than depending on the
 * library's automatic teardown, which does not appear to run under this preset.
 */
let previous: { unmount: () => void } | null = null;

afterEach(() => {
  previous?.unmount();
  previous = null;
});

export async function renderScreen(ui: React.ReactElement, options: RenderOptions = {}) {
  resetAppStore();

  const repos = options.repos ?? createMemoryRepos();
  const capabilities = options.capabilities ?? createFakeCapabilities(options.fakes);
  const withNavigation = options.navigation ?? true;

  const body = (
    <SafeAreaProvider initialMetrics={METRICS}>
      <ReposProvider repos={repos}>
        <CapabilityProvider value={capabilities}>
          {withNavigation ? (
            <NavigationContainer theme={navigationTheme}>{ui}</NavigationContainer>
          ) : (
            ui
          )}
        </CapabilityProvider>
      </ReposProvider>
    </SafeAreaProvider>
  );

  const result = await render(body);
  previous = result;
  return { ...result, repos, capabilities };
}
