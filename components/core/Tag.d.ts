/** Pill filter chip — selectable and/or removable. The only pill-shaped element in the system. */
export interface TagProps {
  /** Selected chips fill ink. */
  selected?: boolean;
  /** If given, renders a remove ×. */
  onRemove?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
