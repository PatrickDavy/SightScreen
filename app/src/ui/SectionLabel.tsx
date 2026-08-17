/**
 * The small tracked eyebrow label — the one place uppercase is allowed.
 * The copy lint enforces that: `textTransform: 'uppercase'` outside this
 * component (and the capture screens' distance-legible labels) is a failure.
 */
import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { capsLabel } from '@/theme/typography';

export function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[capsLabel, style]}>{children}</Text>;
}
