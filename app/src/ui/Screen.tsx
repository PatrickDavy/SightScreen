/**
 * The standard screen container: chalk ground, safe-area insets, and a
 * scrolling body. Capture screens do not use this — they are full-bleed colour
 * with nothing to scroll.
 */
import React from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, sp } from '@/theme/tokens';

export interface ScreenProps {
  children?: React.ReactNode;
  /** Horizontal padding. Screens breathe at 16–24. */
  pad?: number;
  /** Vertical gap between children. Dense data rows sit at 8–12. */
  gap?: number;
  /** Pinned to the bottom, outside the scroll area — primary actions live here. */
  footer?: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Screen({
  children,
  pad = sp[4],
  gap = sp[3],
  footer,
  scroll = true,
  style,
  testID,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const body = (
    <View style={[{ paddingHorizontal: pad, gap }, style]} testID={testID}>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: color.surfaceApp, paddingTop: insets.top }}>
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: sp[3], paddingBottom: sp[6] }}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingTop: sp[3] }}>{body}</View>
      )}

      {footer ? (
        <View
          style={{
            paddingHorizontal: pad,
            paddingTop: sp[3],
            paddingBottom: Math.max(insets.bottom, sp[4]),
            gap: sp[2],
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
