/** Ink-outlined segmented toggle for 2–3 mutually exclusive short options (km/h · mph). */
export interface SegmentOption { value: string; label: string; }
export interface SegmentedControlProps {
  /** Strings or {value,label} pairs — keep labels to one word. */
  options?: (string | SegmentOption)[];
  value?: string;
  onChange?: (value: string) => void;
  /** 'sm' 28px · 'md' 34px (default). */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
