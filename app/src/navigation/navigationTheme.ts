/** React Navigation's theme, expressed in design-system tokens. */
import { DefaultTheme, type Theme } from '@react-navigation/native';

import { color, font } from '@/theme/tokens';

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.surfaceApp,
    card: color.surfaceCard,
    text: color.textBody,
    border: color.line,
    // Ink, not cherry: cherry is reserved for the one thing, recording and
    // alarms, and stays rare so it stays loud.
    primary: color.ink,
    notification: color.cherry,
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: { fontFamily: font.ui, fontWeight: '400' },
    medium: { fontFamily: font.uiMedium, fontWeight: '500' },
    bold: { fontFamily: font.uiSemi, fontWeight: '600' },
    heavy: { fontFamily: font.uiBold, fontWeight: '700' },
  },
};
