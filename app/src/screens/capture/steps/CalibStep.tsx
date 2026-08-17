/**
 * S22 — two taps, the popping crease then the base of the stumps, resolved
 * against known pitch geometry (22 yd, 1.22 m crease) to scale the scene.
 * Remembered per venue, so a returning bowler skips this.
 */
import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';

import { Button, Input } from '@/components';
import { Tap } from '@/domain/calibration';
import { color, font, leading, radius, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';

const PREVIEW_HEIGHT = 300;

const CAPTIONS = [
  'TAP THE POPPING CREASE LINE',
  'NOW TAP THE BASE OF THE STUMPS',
  'PITCH GEOMETRY LOCKED · 22 YD · 1.22 M CREASE',
];

export interface CalibStepProps {
  taps: Tap[];
  onTap: (tap: Tap) => void;
  onReset: () => void;
  /** Enabled only once both points give a usable scale. */
  canContinue: boolean;
  onContinue: () => void;
  /** Fallback when the stumps cannot be seen at all. */
  onManualPitchLength: (metres: number) => void;
}

export function CalibStep({
  taps,
  onTap,
  onReset,
  canContinue,
  onContinue,
  onManualPitchLength,
}: CalibStepProps) {
  const [size, setSize] = useState({ width: 0, height: PREVIEW_HEIGHT });
  const [manual, setManual] = useState('');
  const [showManual, setShowManual] = useState(false);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const crease = taps[0];
  const stumps = taps[1];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: sp[4], paddingTop: sp[4], gap: sp[3] }}>
        <Pressable
          onLayout={onLayout}
          accessibilityRole="button"
          accessibilityLabel={CAPTIONS[Math.min(taps.length, 2)]}
          testID="calibration-target"
          onPress={(e) => {
            if (taps.length >= 2 || size.width === 0) return;
            const { locationX, locationY } = e.nativeEvent;
            onTap({
              x: Math.min(1, Math.max(0, locationX / size.width)),
              y: Math.min(1, Math.max(0, locationY / size.height)),
            });
          }}
          style={{
            height: PREVIEW_HEIGHT,
            backgroundColor: color.surfaceInverse,
            borderRadius: radius.r2,
            overflow: 'hidden',
            justifyContent: 'flex-end',
          }}
        >
          {crease ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: crease.y * PREVIEW_HEIGHT,
                height: 2,
                backgroundColor: color.cherry,
              }}
            />
          ) : null}

          {stumps ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: stumps.x * size.width - 5,
                top: stumps.y * PREVIEW_HEIGHT - 5,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: color.cherry,
                borderWidth: 2,
                borderColor: color.chalk,
              }}
            />
          ) : null}

          <Text
            style={{
              textAlign: 'center',
              marginBottom: sp[3],
              fontFamily: font.monoMedium,
              fontSize: 10,
              lineHeight: 10 * leading.body,
              letterSpacing: 0.9,
              color: 'rgba(242,240,233,.85)',
            }}
          >
            {CAPTIONS[Math.min(taps.length, 2)]}
          </Text>
        </Pressable>

        <Text
          style={{
            fontFamily: font.ui,
            fontSize: text.xs,
            lineHeight: text.xs * leading.body,
            color: color.ink2,
          }}
        >
          Known pitch geometry calibrates run-up and ball speed. Remembered for this venue — next
          time you skip this step.
        </Text>

        {taps.length > 0 && !canContinue ? (
          <Button variant="ghost" onPress={onReset}>
            Start the marks again
          </Button>
        ) : null}

        {showManual ? (
          <View style={{ gap: sp[2] }}>
            <Input
              label="Pitch length"
              suffix="m"
              inputMode="decimal"
              value={manual}
              onChangeText={setManual}
              hint="Use this when the stumps are out of frame."
            />
            <Button
              variant="secondary"
              disabled={!(Number(manual) > 0)}
              onPress={() => onManualPitchLength(Number(manual))}
            >
              Use this length
            </Button>
          </View>
        ) : (
          <Button variant="ghost" onPress={() => setShowManual(true)}>
            Can&apos;t see the stumps
          </Button>
        )}

        <MonoNote>
          Two taps are all it takes · the scale sets every speed this session
        </MonoNote>
      </View>

      <View style={{ paddingHorizontal: sp[4], paddingBottom: sp[6] }}>
        <Button size="lg" full disabled={!canContinue} onPress={onContinue}>
          Continue
        </Button>
      </View>
    </View>
  );
}
