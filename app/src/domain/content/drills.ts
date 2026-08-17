/** The four-drill authored set — one per determinant, from the prototype
 *  (ProtoImprove.jsx). Small on purpose: the app prescribes; the library is
 *  for the curious. */

export interface Drill {
  id: string;
  name: string;
  det: string;
  determinantKey: string;
  cues: string[];
  reps: string;
  feel: string;
}

export const DRILLS: Record<string, Drill> = {
  brace: {
    id: 'brace',
    name: 'Front-leg brace',
    det: 'Front knee at release',
    determinantKey: 'knee',
    cues: [
      'Land heel-first, toes to the sky',
      'Push tall through the front hip',
      'Chest stays up as the arm fires',
    ],
    reps: '3 × 6 balls, short run',
    feel: 'The front leg lands like a pole, not a spring. You should feel taller at release, and the ball should come out in front of you.',
  },
  rhythm: {
    id: 'rhythm',
    name: 'Run-up rhythm',
    det: 'Run-up speed',
    determinantKey: 'runup',
    cues: ["Build, don't sprint", 'Last four steps quickest', 'Hit the crease accelerating'],
    reps: '4 run-throughs, then 2 × 6 balls',
    feel: 'The approach feels downhill. No gather-and-stall in the last two strides.',
  },
  delay: {
    id: 'delay',
    name: 'Arm delay',
    det: 'Arm delay',
    determinantKey: 'delay',
    cues: ['Front arm pulls first', 'Bowling arm stays long and late', "Snap through, don't push"],
    reps: '2 × 6 balls off a walk-in',
    feel: 'A stretch across the chest just before the arm comes over — the sling, not the shove.',
  },
  stack: {
    id: 'stack',
    name: 'Trunk stack',
    det: 'Trunk flexion at release',
    determinantKey: 'trunk',
    cues: ['Drive forward, not sideways', 'Head chases the target', 'Finish over the front leg'],
    reps: '3 × 6 balls, three-quarter pace',
    feel: 'The follow-through carries you down the pitch instead of falling away to the off side.',
  },
};

export const DRILL_IDS = Object.keys(DRILLS);
