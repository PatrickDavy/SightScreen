/**
 * Flat white card with hairline border — the default container.
 * @startingPoint section="Containers" subtitle="Flat white card, hairline border" viewport="420x220"
 */
export interface CardProps {
  /** Optional header title (sentence case). */
  title?: React.ReactNode;
  /** Optional header-right node (Badge, IconButton, link). */
  action?: React.ReactNode;
  /** Adds --shadow-1. Cards are flat by default. */
  raised?: boolean;
  /** Padding in px. Default 16. */
  pad?: number | string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
