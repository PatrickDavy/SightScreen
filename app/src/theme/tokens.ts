/**
 * Sightscreen design tokens — transcribed exactly from tokens/*.css in the
 * design system. Exact values, not rounded ones: where a value is 1.5 or 11,
 * it is not 2 or 12 (handover §3).
 */
import { Easing } from 'react-native';

export const color = {
  // Base palette — named for the ground: chalk screen, ink scoreboard, leather ball, turf.
  chalk: '#F2F0E9',
  paper: '#FFFFFF',
  ink: '#1C1B17',
  inkDeep: '#0D0C0A',
  ink2: '#4C4A42',
  ink3: '#7D786C',
  line: '#DED9CC',
  lineStrong: '#C6C0AF',
  cherry: '#B02A19',
  cherryDeep: '#8C2013',
  cherryTint: '#F7E9E4',
  cherrySoft: '#E9836F',
  turf: '#2F6B3C',
  turfDeep: '#24522E',
  turfTint: '#E7EFE4',
  turfSoft: '#9CCB9F',
  amber: '#A56E00',
  amberDeep: '#7F5500',
  amberTint: '#F6EED9',
  amberSoft: '#E4B95C',

  // Semantic aliases.
  surfaceApp: '#F2F0E9',
  surfaceCard: '#FFFFFF',
  surfaceInverse: '#1C1B17',
  textBody: '#1C1B17',
  textSecondary: '#4C4A42',
  textMuted: '#7D786C',
  textInverse: '#F2F0E9',
  textInverseMuted: 'rgba(242,240,233,.72)',
  accent: '#B02A19',
  accentHover: '#8C2013',
  good: '#2F6B3C',
  goodBg: '#E7EFE4',
  watch: '#A56E00',
  watchBg: '#F6EED9',
  over: '#B02A19',
  overBg: '#F7E9E4',
  bandTrack: '#EAE6DA',
  bandFill: '#1C1B17',
  overlay: 'rgba(28,27,23,.55)',

  // Ad-hoc component-state colors used in the source JSX but not tokenised there.
  black: '#000000',
  dangerPressed: '#701A0F',
  ghostPressed: 'rgba(28,27,23,.08)',
  meterTick: 'rgba(28,27,23,.22)',
  knobShadow: 'rgba(28,27,23,.25)',
  inversePressed: 'rgba(242,240,233,.14)',
  focusGlow: 'rgba(28,27,23,.1)',
} as const;

export const font = {
  // Families registered in theme/fonts.ts (bundled static TTFs — never fetched).
  display: 'BarlowCondensed_700Bold',
  displaySemi: 'BarlowCondensed_600SemiBold',
  displayMedium: 'BarlowCondensed_500Medium',
  ui: 'Barlow_400Regular',
  uiMedium: 'Barlow_500Medium',
  uiSemi: 'Barlow_600SemiBold',
  uiBold: 'Barlow_700Bold',
  uiItalic: 'Barlow_400Regular_Italic',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoSemi: 'IBMPlexMono_600SemiBold',
} as const;

export const text = {
  xxs: 11,
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
  display: 48,
  hero: 72,
} as const;

/** letter-spacing for uppercase labels: .07em, converted per font size (RN uses px). */
export const trackCaps = (fontSize: number) => fontSize * 0.07;

export const leading = {
  tight: 1.05,
  snug: 1.25,
  body: 1.5,
} as const;

export const sp = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 48,
  9: 64,
} as const;

export const radius = {
  r1: 4, // buttons, inputs, badges
  r2: 8, // cards, dialogs
  pill: 999, // tags only
} as const;

export const border = {
  hair: 1,
  strong: 1.5,
} as const;

export const dur = {
  d1: 120, // hover, press
  d2: 200, // toggles, tabs
  d3: 320, // dialogs, screen changes
} as const;

export const ease = {
  swift: Easing.bezier(0.2, 0, 0, 1),
  inout: Easing.bezier(0.4, 0, 0.2, 1),
} as const;

/** --shadow-1 (raised cards only) and --shadow-2 (dialogs/toasts only), approximated
 *  for RN's single-shadow model. Do not use elevation decoratively anywhere else. */
export const shadow1 = {
  shadowColor: color.ink,
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

export const shadow2 = {
  shadowColor: color.ink,
  shadowOpacity: 0.2,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 12,
} as const;
