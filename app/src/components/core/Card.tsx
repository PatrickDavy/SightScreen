/**
 * Card — flat white container with hairline border and 8px radius; the default
 * surface on the chalk background. `raised` adds the only card shadow allowed.
 * Ink-inverse cards are NOT made with Card — that treatment belongs to CueCard.
 */
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { border, color, font, radius, shadow1, text } from '@/theme/tokens';

export interface CardProps {
  title?: React.ReactNode;
  action?: React.ReactNode;
  raised?: boolean;
  pad?: number;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Card({ title, action, raised, pad = 16, onPress, children, style, testID }: CardProps) {
  const base: ViewStyle = {
    backgroundColor: color.surfaceCard,
    borderWidth: border.hair,
    borderColor: color.line,
    borderRadius: radius.r2,
    padding: pad,
    ...(raised ? shadow1 : null),
  };
  const inner = (
    <>
      {title || action ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 12,
          }}
        >
          {typeof title === 'string' ? (
            <Text
              style={{
                fontFamily: font.uiSemi,
                fontSize: text.md,
                lineHeight: text.md * 1.3,
                color: color.ink,
                flexShrink: 1,
              }}
            >
              {title}
            </Text>
          ) : (
            (title ?? <View />)
          )}
          {action ?? null}
        </View>
      ) : null}
      {children}
    </>
  );
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => [base, pressed ? { backgroundColor: color.chalk } : null, style]}
      >
        {inner}
      </Pressable>
    );
  }
  return (
    <View style={[base, style]} testID={testID}>
      {inner}
    </View>
  );
}
