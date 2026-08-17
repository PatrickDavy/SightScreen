/** Reusable text styles composed from tokens. Sentence case everywhere;
 *  uppercase reserved for small tracked eyebrow labels. */
import { TextStyle } from 'react-native';

import { color, font, leading, text, trackCaps } from './tokens';

/** Caps eyebrow label — 11px, 700, .07em tracking, uppercase, ink-2. */
export const capsLabel: TextStyle = {
  fontFamily: font.uiBold,
  fontSize: text.xxs,
  letterSpacing: trackCaps(text.xxs),
  textTransform: 'uppercase',
  color: color.ink2,
};

/** Body text — Barlow 400 15px, line-height 1.5. */
export const body: TextStyle = {
  fontFamily: font.ui,
  fontSize: text.md,
  lineHeight: text.md * leading.body,
  color: color.textBody,
};

/** Secondary body text. */
export const bodySecondary: TextStyle = {
  ...body,
  color: color.textSecondary,
};

/** Mono footnote — measurements, timestamps, provenance. */
export const monoNote: TextStyle = {
  fontFamily: font.mono,
  fontSize: text.xs,
  color: color.textMuted,
};

/** Display headline — Barlow Condensed, tight leading. */
export const display = (size: number): TextStyle => ({
  fontFamily: font.display,
  fontSize: size,
  lineHeight: size * leading.tight,
  color: color.ink,
});
