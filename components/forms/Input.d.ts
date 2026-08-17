/** Text field with caps label, hint/error line, optional leading icon and mono suffix (e.g. a unit). */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Muted helper under the field. */
  hint?: string;
  /** Cherry border + message; replaces hint. */
  error?: string;
  /** Leading Lucide icon name. */
  icon?: string;
  /** Trailing mono text, e.g. "km/h", "m". */
  suffix?: string;
  inputStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
