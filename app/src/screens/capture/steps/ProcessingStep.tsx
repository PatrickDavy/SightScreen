/**
 * S26 — on-device inference, counted by delivery. Honest about time, thermals
 * and provenance: it says what it is doing, that it warms the phone up, and
 * whether the numbers came from a model at all.
 */
import React from 'react';
import { Text, View } from 'react-native';

import { color, font, leading, sp, text } from '@/theme/tokens';
import { ProgressBar } from '@/ui/ProgressBar';

export interface ProcessingStepProps {
  done: number;
  total: number;
  simulated: boolean;
}

export function ProcessingStep({ done, total, simulated }: ProcessingStepProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.surfaceInverse,
        alignItems: 'center',
        justifyContent: 'center',
        gap: sp[4],
        padding: sp[6],
      }}
    >
      <Text
        style={{
          fontFamily: font.displaySemi,
          fontSize: text.xxl,
          lineHeight: text.xxl * leading.tight,
          color: color.chalk,
        }}
      >
        Processing
      </Text>

      <Text
        style={{ fontFamily: font.monoMedium, fontSize: text.sm, color: 'rgba(242,240,233,.8)' }}
      >
        Delivery {Math.min(Math.max(done, 1), Math.max(total, 1))} of {total}
      </Text>

      <ProgressBar
        value={total > 0 ? done / total : 0}
        accessibilityLabel={`Processing delivery ${done} of ${total}`}
      />

      <Text
        style={{
          textAlign: 'center',
          fontFamily: font.mono,
          fontSize: 11,
          lineHeight: 11 * 1.7,
          color: 'rgba(242,240,233,.6)',
        }}
      >
        ON-DEVICE · WORKS IN AEROPLANE MODE{'\n'}
        THIS WARMS THE PHONE UP — IT&apos;S NORMAL{'\n'}
        YOU CAN LEAVE; WE&apos;LL NOTIFY WHEN DONE
      </Text>

      {simulated ? (
        <Text
          style={{
            textAlign: 'center',
            fontFamily: font.mono,
            fontSize: 11,
            lineHeight: 11 * 1.7,
            color: color.amberSoft,
          }}
        >
          SIMULATED ANALYSIS · NO POSE MODEL IN{'\n'}THIS BUILD, SO THESE ARE NOT MEASUREMENTS
        </Text>
      ) : null}
    </View>
  );
}
