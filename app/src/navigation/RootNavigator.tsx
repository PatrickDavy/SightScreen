/**
 * The root stack. Capture and onboarding are full-screen modals above the tabs,
 * so during a session the tab bar is not rendered at all rather than hidden —
 * capture is a mode, not a place.
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { CaptureScreen } from '@/screens/capture/CaptureScreen';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { PaywallScreen } from '@/screens/paywall/PaywallScreen';

import { ROOT_NAVIGATOR_ID } from './rootNavigation';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Root = createNativeStackNavigator<RootStackParamList, typeof ROOT_NAVIGATOR_ID>();

export interface RootNavigatorProps {
  initialRoute: 'Tabs' | 'Onboarding';
  initialTab: 'HomeTab' | 'LoadTab';
}

export function RootNavigator({ initialRoute, initialTab }: RootNavigatorProps) {
  return (
    <Root.Navigator
      id={ROOT_NAVIGATOR_ID}
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Root.Screen name="Tabs">{() => <TabNavigator initialTab={initialTab} />}</Root.Screen>

      <Root.Group
        screenOptions={{
          presentation: 'fullScreenModal',
          // Fades and small translates only — no bounce, spring or parallax.
          animation: 'fade',
        }}
      >
        <Root.Screen name="Onboarding" component={OnboardingScreen} />
        <Root.Screen name="Capture" component={CaptureScreen} />
        <Root.Screen name="Paywall" component={PaywallScreen} />
      </Root.Group>
    </Root.Navigator>
  );
}
