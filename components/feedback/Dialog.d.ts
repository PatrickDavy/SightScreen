/** Modal over an unblurred ink overlay. One decision per dialog. */
export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  /** Renders the × and enables overlay-click dismiss. */
  onClose?: () => void;
  /** Right-aligned action row, e.g. <Button/>s. */
  footer?: React.ReactNode;
  /** Max width in px. Default 440. */
  width?: number;
  children?: React.ReactNode;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
