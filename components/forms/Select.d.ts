/** Native select styled to match Input; chevron via Icon. */
export interface SelectOption { value: string; label: string; }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Strings or {value,label} pairs. */
  options?: (string | SelectOption)[];
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
