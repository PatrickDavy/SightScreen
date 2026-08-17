/**
 * Empty states are entry points, not apologies. Each one says what the first
 * session will produce and offers exactly one action — never "no data yet".
 */
import React from 'react';
import { Text, View } from 'react-native';

import { Button, Card } from '@/components';
import { color, font, leading, sp, text } from '@/theme/tokens';

export interface EmptyStateProps {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ComponentProps<typeof Button>['icon'];
}

export function EmptyState({ title, body, actionLabel, onAction, actionIcon }: EmptyStateProps) {
  return (
    <Card pad={sp[5]}>
      <View style={{ gap: sp[3] }}>
        <Text
          style={{
            fontFamily: font.displaySemi,
            fontSize: text.xl,
            lineHeight: text.xl * leading.tight,
            color: color.ink,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: font.ui,
            fontSize: text.sm,
            lineHeight: text.sm * leading.body,
            color: color.ink2,
          }}
        >
          {body}
        </Text>
        {actionLabel && onAction ? (
          <Button full icon={actionIcon} onPress={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </View>
    </Card>
  );
}
