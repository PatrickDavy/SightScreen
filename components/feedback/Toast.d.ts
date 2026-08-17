/** Ink notification bar; tone sets the leading icon color. Position/stacking is the consumer's job. */
export interface ToastProps {
  tone?: 'neutral' | 'good' | 'watch' | 'over';
  /** One sentence, honest: "Too shaky to read. Prop the phone and go again." */
  children?: React.ReactNode;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
