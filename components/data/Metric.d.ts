/**
 * The signature readout: value + error band + optional range track. No measured number appears outside one.
 * @startingPoint section="Data" subtitle="Readout with error band" viewport="420x240"
 */
export interface MetricProps {
  /** Caps eyebrow, e.g. "Fastest ball". */
  label?: string;
  /** Display value — number or preformatted string. */
  value?: number | string;
  /** Unit, mono, e.g. "km/h", "°", "m/s". */
  unit?: string;
  /** Uncertainty (±). Always pass it when the value is measured. */
  band?: number | string;
  /** Evidence note, e.g. "from 26 frames". */
  sample?: string;
  /** 'sm' 26px · 'md' 40px (default) · 'lg' 64px value. */
  size?: 'sm' | 'md' | 'lg';
  /** Draws the band track: {min, max, good?: [lo, hi]} — good renders the target zone in turf. */
  range?: { min: number; max: number; good?: [number, number] };
  /** Value color override, e.g. var(--cherry) when over-limit. */
  tone?: string;
  style?: React.CSSProperties;
}
export declare function Metric(props: MetricProps): JSX.Element;
