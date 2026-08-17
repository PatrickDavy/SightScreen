/**
 * The mono footnote that carries provenance: how a number was measured, which
 * guideline it is judged against, what was excluded. Every claim the product
 * makes should be traceable to one of these.
 */
import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { leading, text } from '@/theme/tokens';
import { monoNote } from '@/theme/typography';

export function MonoNote({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[monoNote, { lineHeight: text.xs * leading.body }, style]}>{children}</Text>;
}
