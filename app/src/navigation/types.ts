/**
 * Route shapes.
 *
 * Capture and onboarding sit on the root stack rather than inside a tab:
 * capture is a mode, not a place, and a full-screen modal above the tabs means
 * the tab bar is never rendered during a session rather than being hidden.
 */
import type { NavigatorScreenParams } from '@react-navigation/native';

import type { SessionType } from '@/domain/types';

export type HomeStackParamList = {
  Home: undefined;
  History: undefined;
  Review: { sessionId: string };
  Delivery: { sessionId: string; index: number };
  Explainer: { determinantKey: string };
  Insight: { sessionId: string };
};

export type ImproveStackParamList = {
  Improve: undefined;
  Drill: { drillId: string };
};

export type LoadStackParamList = {
  Load: undefined;
  Rest: undefined;
};

export type YouStackParamList = {
  You: undefined;
  Privacy: undefined;
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  ImproveTab: NavigatorScreenParams<ImproveStackParamList> | undefined;
  /** Renders nothing: the centre button dispatches to the Capture modal. */
  BowlTab: undefined;
  LoadTab: NavigatorScreenParams<LoadStackParamList> | undefined;
  YouTab: NavigatorScreenParams<YouStackParamList> | undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Onboarding: undefined;
  Capture: { type?: SessionType; resumeSessionId?: string } | undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
