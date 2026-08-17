/**
 * Temporary scaffolding so the navigation shell is walkable before the screens
 * exist. Every one of these is replaced by its real screen in a later phase.
 */
import React from 'react';
import { Text } from 'react-native';

import { color, font, leading, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';

export function Placeholder({ title, screenId }: { title: string; screenId: string }) {
  return (
    <Screen testID={`placeholder-${screenId}`}>
      <Text
        style={{
          fontFamily: font.display,
          fontSize: text.xxxl,
          lineHeight: text.xxxl * leading.tight,
          color: color.ink,
        }}
      >
        {title}
      </Text>
      <MonoNote>{screenId} · not built yet</MonoNote>
    </Screen>
  );
}
