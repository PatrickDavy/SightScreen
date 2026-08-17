/** Square icon-only button. label (aria) is required. */
export interface IconButtonProps {
  /** Lucide icon name. */
  name: string;
  /** Accessible label — required; icon-only buttons must still say what they do. */
  label: string;
  variant?: 'ghost' | 'primary' | 'secondary';
  /** 'sm' 28px · 'md' 36px (default) · 'lg' 44px. */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
