/**
 * Composition root: load fonts, run the boot sequence, then hand off to the
 * navigator. Nothing renders until both are done — the splash screen stays up,
 * which is why there is no loading spinner here.
 */
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createCapabilities } from '@/capabilities';
import { CapabilityProvider } from '@/capabilities/context';
import { createRepos } from '@/data/repos';
import { RootNavigator } from '@/navigation/RootNavigator';
import { navigationTheme } from '@/navigation/navigationTheme';
import { useAppStore } from '@/store/useAppStore';
import { fontMap } from '@/theme/fonts';

import { BootResult, runBoot } from './boot';
import { ReposProvider } from './ReposProvider';
import { ToastHost } from './ToastHost';

// Must happen before the component mounts, or the splash hides itself first.
void SplashScreen.preventAutoHideAsync();

export function AppRoot() {
  const [fontsLoaded, fontError] = useFonts(fontMap);
  const [boot, setBoot] = useState<BootResult | null>(null);
  const setEntitlement = useAppStore((s) => s.setEntitlement);

  const capabilities = useMemo(() => createCapabilities(), []);

  useEffect(() => {
    // The repositories are synchronous, so this needs no async plumbing.
    const result = runBoot({ repos: createRepos() });
    setEntitlement(result.entitlement);
    setBoot(result);
  }, [setEntitlement]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && boot) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError, boot]);

  // A silent fallback to the system face is a bug, not a degradation: every
  // measured number in this app is set in mono, and the display face is what
  // makes the recording counter legible at twenty metres.
  if (fontError) throw fontError;
  if (!fontsLoaded || !boot) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReposProvider repos={boot.repos}>
          <CapabilityProvider value={capabilities}>
            <NavigationContainer theme={navigationTheme}>
              <RootNavigator initialRoute={boot.initialRoute} initialTab={boot.initialTab} />
            </NavigationContainer>
            <ToastHost />
            <StatusBar style="dark" />
          </CapabilityProvider>
        </ReposProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
