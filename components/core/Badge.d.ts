/** Small caps status chip. Tones map to workload/measurement state. */
export interface BadgeProps {
  /** 'neutral' · 'good' within band · 'watch' approaching limit · 'over' past limit · 'inverse' ink. */
  tone?: 'neutral' | 'good' | 'watch' | 'over' | 'inverse';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
