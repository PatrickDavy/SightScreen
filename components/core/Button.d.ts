/** Push button. Primary is ink — cherry (danger) is reserved for destructive or over-limit actions. */
export interface ButtonProps {
  /** 'primary' ink fill (default) · 'secondary' outlined · 'ghost' bare · 'danger' cherry. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** 'sm' 32px · 'md' 40px (default) · 'lg' 48px. */
  size?: 'sm' | 'md' | 'lg';
  /** Optional leading Lucide icon name. */
  icon?: string;
  disabled?: boolean;
  /** Stretch to full container width. */
  full?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
