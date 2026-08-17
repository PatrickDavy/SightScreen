/** Checkbox with label; checked fills ink. */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  /** Receives the next boolean. */
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
