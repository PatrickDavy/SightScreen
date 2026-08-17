/** Hover/focus tooltip — an honest rectangle, no arrow. For defining terms, not hiding essentials. */
export interface TooltipProps {
  /** Short definition, e.g. "Angle between hips and shoulders at back-foot contact". */
  label: React.ReactNode;
  /** The trigger element. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
