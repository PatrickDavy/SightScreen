/** Radio with label; group by shared name, drive with onChange(value). */
export interface RadioProps {
  label?: React.ReactNode;
  checked?: boolean;
  /** Group name. */
  name?: string;
  value?: string;
  /** Receives this radio's value. */
  onChange?: (value: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;
