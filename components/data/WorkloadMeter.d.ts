/**
 * Overs bowled vs age-group guideline. Tone derives automatically: <80% good, ≥80% watch, ≥100% over.
 * @startingPoint section="Data" subtitle="Bowling load vs guideline" viewport="420x180"
 */
export interface WorkloadMeterProps {
  /** Period label. Default "This week". */
  label?: string;
  /** Overs/balls bowled. */
  used?: number;
  /** The guideline limit. */
  limit?: number;
  /** Default "overs". */
  unit?: string;
  /** Mono footnote naming the guideline, e.g. "U17 guideline · 21 overs a week". */
  guideline?: string;
  style?: React.CSSProperties;
}
export declare function WorkloadMeter(props: WorkloadMeterProps): JSX.Element;
