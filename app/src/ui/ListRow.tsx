/**
 * The recurring list item: a title, a mono detail line, an optional trailing
 * slot, and a chevron when it leads somewhere. Used by session lists, settings
 * and the drill set.
 */
import React from 'react';
import { Text, View } from 'react-native';

import { Card, Icon } from '@/components';
import { color, font, sp, text } from '@/theme/tokens';

import { MonoNote } from './MonoNote';

export interface ListRowProps {
  title: string;
  /** Mono detail beneath the title — dates, counts, provenance. */
  detail?: string;
  /** Plain sentence beneath the title, for settings-style rows. */
  subtitle?: string;
  /** Trailing content before the chevron — a Badge, a Metric, a control. */
  right?: React.ReactNode;
  icon?: React.ComponentProps<typeof Icon>['name'];
  onPress?: () => void;
  testID?: string;
}

export function ListRow({
  title,
  detail,
  subtitle,
  right,
  icon,
  onPress,
  testID,
}: ListRowProps) {
  return (
    <Card onPress={onPress} pad={sp[3]} testID={testID}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: sp[3] }}>
        {icon ? <Icon name={icon} size={18} color={color.ink2} /> : null}

        <View style={{ flex: 1, gap: 3 }}>
          <Text style={{ fontFamily: font.uiSemi, fontSize: text.sm, color: color.ink }}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={{ fontFamily: font.ui, fontSize: text.xs, color: color.ink2 }}>
              {subtitle}
            </Text>
          ) : null}
          {detail ? <MonoNote>{detail}</MonoNote> : null}
        </View>

        {right ?? null}
        {onPress ? <Icon name="chevron-right" size={16} color={color.ink3} /> : null}
      </View>
    </Card>
  );
}
