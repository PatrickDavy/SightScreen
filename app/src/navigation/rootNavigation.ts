/**
 * Reaching the root stack from a screen nested inside a tab.
 *
 * Capture and onboarding live on the root stack, so a screen inside a tab has
 * to address it to open them. React Navigation only types `getParent`'s id when
 * every navigator between the caller and the root declares one, which would
 * mean threading an id through the tab navigator and all four of its stacks for
 * no runtime benefit. One cast, in one place, is the smaller cost — and it also
 * keeps screens from importing RootNavigator, which imports them back.
 */
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';

export const ROOT_NAVIGATOR_ID = 'RootStack' as const;

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

interface HasParent {
  getParent: (id?: string) => unknown;
}

/** The root stack navigator, or undefined when there isn't one above. */
export function rootNavigationFrom(navigation: unknown): RootNavigation | undefined {
  return (navigation as HasParent).getParent(ROOT_NAVIGATOR_ID) as RootNavigation | undefined;
}
