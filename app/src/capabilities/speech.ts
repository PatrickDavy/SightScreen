/**
 * Spoken feedback during capture — the delivery speed, and the reason for an
 * amber state. A failure that is only shown is a failure the bowler discovers
 * at the end of the spell, by which time it has cost them the spell.
 */
import * as Speech from 'expo-speech';

import { Speech as SpeechCapability } from './types';

export function createSpeech(): SpeechCapability {
  const speak = (text: string) => {
    try {
      Speech.speak(text, { language: 'en-GB' });
    } catch {
      // Silence is survivable; the screen colour still carries the state.
    }
  };

  return {
    speakDigits(digits: string) {
      // "128" as "1 2 8" — digit by digit is what carries across twenty metres
      // of net, wind and other players.
      speak(digits.split('').join(' '));
    },
    speakSentence(text: string) {
      speak(text);
    },
    stop() {
      try {
        Speech.stop();
      } catch {
        // Nothing was speaking.
      }
    },
  };
}
