/**
 * The four-tab bar with capture as a persistent centre action.
 *
 * Home · Improve · (● Bowl) · Load · You
 *
 * Load is a root destination on purpose: workload is structure, not a settings
 * toggle, and the parent-facing trust argument depends on it being visible
 * without being sought. A drawer was considered and rejected for that reason.
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Icon, type IconName } from '@/components';
import { HistoryScreen } from '@/screens/home/HistoryScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { DrillScreen } from '@/screens/improve/DrillScreen';
import { ImproveScreen } from '@/screens/improve/ImproveScreen';
import { LoadScreen } from '@/screens/load/LoadScreen';
import { RestScreen } from '@/screens/load/RestScreen';
import { DeliveryScreen } from '@/screens/review/DeliveryScreen';
import { ExplainerScreen } from '@/screens/review/ExplainerScreen';
import { InsightScreen } from '@/screens/review/InsightScreen';
import { ReviewScreen } from '@/screens/review/ReviewScreen';
import { PrivacyScreen } from '@/screens/you/PrivacyScreen';
import { SubscriptionScreen } from '@/screens/you/SubscriptionScreen';
import { YouScreen } from '@/screens/you/YouScreen';
import { color, font, sp } from '@/theme/tokens';

import { BowlButton } from './BowlButton';
import type {
  HomeStackParamList,
  ImproveStackParamList,
  LoadStackParamList,
  TabParamList,
  YouStackParamList,
} from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ImproveStack = createNativeStackNavigator<ImproveStackParamList>();
const LoadStack = createNativeStackNavigator<LoadStackParamList>();
const YouStack = createNativeStackNavigator<YouStackParamList>();

const stackOptions = { headerShown: false } as const;

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={stackOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="History" component={HistoryScreen} />
      <HomeStack.Screen name="Review" component={ReviewScreen} />
      <HomeStack.Screen name="Delivery" component={DeliveryScreen} />
      <HomeStack.Screen name="Explainer" component={ExplainerScreen} />
      <HomeStack.Screen name="Insight" component={InsightScreen} />
    </HomeStack.Navigator>
  );
}

function ImproveStackScreen() {
  return (
    <ImproveStack.Navigator screenOptions={stackOptions}>
      <ImproveStack.Screen name="Improve" component={ImproveScreen} />
      <ImproveStack.Screen name="Drill" component={DrillScreen} />
    </ImproveStack.Navigator>
  );
}

function LoadStackScreen() {
  return (
    <LoadStack.Navigator screenOptions={stackOptions}>
      <LoadStack.Screen name="Load" component={LoadScreen} />
      <LoadStack.Screen name="Rest" component={RestScreen} />
    </LoadStack.Navigator>
  );
}

function YouStackScreen() {
  return (
    <YouStack.Navigator screenOptions={stackOptions}>
      <YouStack.Screen name="You" component={YouScreen} />
      <YouStack.Screen name="Privacy" component={PrivacyScreen} />
      <YouStack.Screen name="Subscription" component={SubscriptionScreen} />
    </YouStack.Navigator>
  );
}

function tabIcon(name: IconName) {
  return ({ focused }: { focused: boolean }) => (
    <Icon
      name={name}
      size={20}
      strokeWidth={focused ? 2.25 : 2}
      color={focused ? color.ink : color.ink3}
    />
  );
}

export function TabNavigator({ initialTab }: { initialTab: 'HomeTab' | 'LoadTab' }) {
  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={{
        headerShown: false,
        // The prototype's "a tab change clears the stack"; pushing a detail
        // within a tab still preserves it, which is the default.
        popToTopOnBlur: true,
        tabBarActiveTintColor: color.ink,
        tabBarInactiveTintColor: color.ink3,
        tabBarStyle: {
          backgroundColor: color.surfaceCard,
          borderTopColor: color.line,
          borderTopWidth: 1,
          height: 64,
          paddingTop: sp[2],
        },
        tabBarLabelStyle: {
          fontFamily: font.uiSemi,
          fontSize: 10,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{ title: 'Home', tabBarIcon: tabIcon('house') }}
      />
      <Tab.Screen
        name="ImproveTab"
        component={ImproveStackScreen}
        options={{ title: 'Improve', tabBarIcon: tabIcon('target') }}
      />
      <Tab.Screen
        name="BowlTab"
        // Never rendered: the button navigates to the Capture modal instead.
        component={React.Fragment as unknown as React.ComponentType}
        options={{ tabBarButton: () => <BowlButton /> }}
        listeners={{ tabPress: (e) => e.preventDefault() }}
      />
      <Tab.Screen
        name="LoadTab"
        component={LoadStackScreen}
        options={{ title: 'Load', tabBarIcon: tabIcon('shield') }}
      />
      <Tab.Screen
        name="YouTab"
        component={YouStackScreen}
        options={{ title: 'You', tabBarIcon: tabIcon('user') }}
      />
    </Tab.Navigator>
  );
}
