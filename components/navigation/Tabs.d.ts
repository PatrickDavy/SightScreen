/** Underline tabs — the crease line. For sections of one screen, not app-level navigation. */
export interface TabItem { id: string; label: string; }
export interface TabsProps {
  /** Strings or {id,label} pairs. */
  items?: (string | TabItem)[];
  /** Active tab id. */
  value?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
