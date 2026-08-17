/**
 * Whether the bowler has asked the system to reduce motion.
 *
 * Nothing in this app carries information by animation alone — the recording
 * screen's colour change is also a word and a sound — so honouring this costs
 * nothing but the transition itself.
 */
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!cancelled) setReduced(enabled);
      })
      .catch(() => {
        // Unsupported: assume motion is fine rather than flattening everything.
      });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  return reduced;
}
