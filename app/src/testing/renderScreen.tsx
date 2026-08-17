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
  return { ...result, repos, capabilities };
}
