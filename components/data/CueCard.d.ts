/**
 * The one thing to change — the only ink-inverse card in the system; at most one per screen.
 * @startingPoint section="Data" subtitle="The one thing to change" viewport="420x300"
 */
export interface CueCardProps {
  /** Caps eyebrow. Default "The one thing". */
  eyebrow?: string;
  /** Short imperative, e.g. "Brace your front knee". */
  cue?: React.ReactNode;
  /** Mono estimated gain, e.g. "+3–6 km/h estimated". */
  gain?: string;
  /** The evidence: what was measured and what quicker bowlers do. */
  detail?: React.ReactNode;
  /** Renders an outlined action button, e.g. "Watch the drill". */
  actionLabel?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}
export declare function CueCard(props: CueCardProps): JSX.Element;
