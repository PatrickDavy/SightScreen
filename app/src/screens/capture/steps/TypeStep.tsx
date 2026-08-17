/** S20 — what kind of spell. Decides the workload weighting. */
import React from 'react';
import { Text, View } from 'react-native';

import { Button, Card, Icon } from '@/components';
import { SessionType } from '@/domain/types';
import { border, color, font, leading, sp, text } from '@/theme/tokens';

import { SESSION_TYPE_OPTIONS } from '../sessionTypes';

export interface TypeStepProps {
  selected: SessionType;
  onSelect: (type: SessionType) => void;
  onContinue: () => void;
}

export function TypeStep({ selected, onSelect, onContinue }: TypeStepProps) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, gap: sp[3], paddingHorizontal: sp[4], paddingTop: sp[4] }}>
        {SESSION_TYPE_OPTIONS.map((option) => {
          const isSelected = option.value === selected;
          return (
            <Card
              key={option.value}
              pad={14}
              onPress={() => onSelect(option.value)}
              testID={`session-type-${option.value}`}
              style={{
                borderWidth: isSelected ? border.strong : border.hair,
                borderColor: isSelected ? color.ink : color.line,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: sp[3],
                }}
              >
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={{ fontFamily: font.uiSemi, fontSize: text.md, color: color.ink }}>
                    {option.label}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.ui,
                      fontSize: text.xs,
                      lineHeight: text.xs * leading.body,
                      color: color.ink2,
                    }}
                  >
                    {option.description}
                  </Text>
                </View>
                {isSelected ? <Icon name="check" size={18} color={color.ink} /> : null}
              </View>
            </Card>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: sp[4], paddingBottom: sp[6] }}>
        <Button size="lg" full onPress={onContinue}>
          Continue
        </Button>
      </View>
    </View>
  );
}
