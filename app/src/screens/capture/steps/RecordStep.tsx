/**
 * S24 recording — the distance-legible screen, and the crux of the product.
 *
 * It is read from twenty metres away, in sunlight, by someone at the top of
 * their run-up. So the colour *is* the interface, the delivery counter is as
 * large as the screen allows, and there is nothing else on it: no controls, no
 * metrics, no live skeleton. Anything more cannot be read at that distance and
 * invites a wasted walk back.
 *
 * Ending is a tap anywhere.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, useWindowDimensions } from 'react-native';

import { color, dur, ease, font, leading } from '@/theme/tokens';
import { useReducedMotion } from '@/ui/useReducedMotion';

import { CaptureProblem } from '../captureMachine';

/** 190/390 in the prototype. Scales with the screen and is never capped: an
 *  indoor-comfortable size is unreadable from the mark. */
const COUNTER_RATIO = 190 / 390;
const EYEBROW_SIZE = 13;

export interface RecordStepProps {
  count: number;
  problem: CaptureProblem | null;
  onEnd: () => void;
}

export function RecordStep({ count, problem, onEnd }: RecordStepProps) {
  const { width } = useWindowDimensions();
  const counterSize = Math.round(width * COUNTER_RATIO);
  const reducedMotion = useReducedMotion();

  // Turf while healthy, amber on a problem. Animated so the change reads as a
  // change from the corner of an eye, without carrying information by motion
  // alone — the word and the sound say it too.
  const tone = useRef(new Animated.Value(problem ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(tone, {
      toValue: problem ? 1 : 0,
      // Snap rather than fade when motion is reduced. Nothing is lost: the
      // state is also a word on the screen and a sound in the air.
      duration: reducedMotion ? 0 : dur.d2,
      easing: ease.swift,
      useNativeDriver: false,
    }).start();
  }, [problem, tone, reducedMotion]);

  const background = tone.interpolate({
    inputRange: [0, 1],
    outputRange: [color.turf, color.amber],
  });

  return (
    <Animated.View style={{ flex: 1, backgroundColor: background }}>
      <Pressable
        onPress={onEnd}
        accessibilityRole="button"
        accessibilityLabel={
          problem
            ? `${problem.spoken}. ${count} deliveries so far. Tap anywhere to end.`
            : `Recording. ${count} deliveries. Tap anywhere to end.`
        }
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
      >
        {problem ? (
          <>
            <Text
              style={{
                fontFamily: font.display,
                fontSize: 44,
                lineHeight: 44 * leading.tight,
                color: '#FFFFFF',
                textAlign: 'center',
                maxWidth: 300,
                textTransform: 'uppercase',
              }}
            >
              {problem.spoken}
            </Text>
            <Text
              style={{
                fontFamily: font.monoMedium,
                fontSize: 12,
                lineHeight: 12 * 1.7,
                color: 'rgba(255,255,255,.85)',
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              SAID ALOUD TOO — A SILENT FAILURE{'\n'}COSTS YOU THE SPELL. RESUMES ITSELF.
            </Text>
          </>
        ) : (
          <>
            <Eyebrow>RECORDING</Eyebrow>
            <Text
              style={{
                fontFamily: font.display,
                fontSize: counterSize,
                lineHeight: counterSize * leading.tight,
                color: '#FFFFFF',
                fontVariant: ['tabular-nums'],
              }}
            >
              {count}
            </Text>
            <Eyebrow>DELIVERIES</Eyebrow>
            <Text
              style={{
                fontFamily: font.monoMedium,
                fontSize: 10.5,
                letterSpacing: 1.05,
                color: 'rgba(255,255,255,.65)',
                marginTop: 26,
              }}
            >
              TAP ANYWHERE TO END
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: font.monoSemi,
        fontSize: EYEBROW_SIZE,
        letterSpacing: EYEBROW_SIZE * 0.14,
        color: 'rgba(255,255,255,.85)',
      }}
    >
      {children}
    </Text>
  );
}
