/**
 * The delivery timeline for S31, marked at the three moments that matter in a
 * bowling action: back-foot contact, front-foot contact and release. Static for
 * now — it becomes scrubbable when there is real footage behind it.
 */
import React from 'react';
import { Text, View } from 'react-native';

import { DeliveryEvents } from '@/domain/types';
import { color, font, radius, sp, text } from '@/theme/tokens';

const MARKS: { key: keyof DeliveryEvents; label: string }[] = [
  { key: 'bfc', label: 'BFC' },
  { key: 'ffc', label: 'FFC' },
  { key: 'release', label: 'REL' },
];

export function EventScrubber({ events }: { events: DeliveryEvents | null }) {
  if (!events) return null;

  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  return (
    <View style={{ gap: sp[2], paddingTop: sp[2] }}>
      <View
        style={{
          height: 4,
          backgroundColor: color.bandTrack,
          borderRadius: radius.r1 / 2,
          justifyContent: 'center',
        }}
      >
        {MARKS.map((mark) => (
          <View
            key={mark.key}
            style={{
              position: 'absolute',
              left: `${clamp(events[mark.key]) * 100}%`,
              width: 2,
              height: 12,
              marginTop: -4,
              backgroundColor: color.ink,
            }}
          />
        ))}
        {/* The playhead sits at release — the frame every metric is read at. */}
        <View
          style={{
            position: 'absolute',
            left: `${clamp(events.release) * 100}%`,
            width: 3,
            height: 16,
            marginTop: -6,
            marginLeft: -1,
            backgroundColor: color.cherry,
          }}
        />
      </View>

      <View style={{ flexDirection: 'row' }}>
        {MARKS.map((mark) => (
          <Text
            key={mark.key}
            style={{
              position: 'absolute',
              left: `${clamp(events[mark.key]) * 100}%`,
              marginLeft: -12,
              fontFamily: font.mono,
              fontSize: text.xxs - 1,
              letterSpacing: 0.6,
              color: color.ink3,
            }}
          >
            {mark.label}
          </Text>
        ))}
        {/* Reserves the row's height, since the labels are absolutely placed. */}
        <Text style={{ fontFamily: font.mono, fontSize: text.xxs - 1, opacity: 0 }}>REL</Text>
      </View>
    </View>
  );
}
