/** Lucide icon by name (requires the Lucide CDN script on the page). Color inherits currentColor. */
export interface IconProps {
  /** Lucide icon name, e.g. "video", "shield", "chevron-right". */
  name: string;
  /** Square size in px. Default 18. */
  size?: number;
  /** Stroke width. Default 2. */
  strokeWidth?: number;
  /** CSS color; defaults to currentColor. */
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
