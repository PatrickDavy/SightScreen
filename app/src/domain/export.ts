/**
 * "Export my data" — the whole local record, as CSV.
 *
 * Two jobs. It is the product's answer to a privacy access request, which the
 * NZ Information Privacy Principles and the Australian Privacy Principles both
 * give a person a right to; and it is what makes the delete-everything promise
 * on S73 fair, because leaving is only a real option if you can take your
 * record with you first.
 *
 * Pure. Everything here is data in, text out, so the whole export is testable
 * without touching a filesystem — the writing lives behind the `files`
 * capability. Same split as `workload.ts` and `confidence.ts`.
 *
 * The bare-number rule applies to a CSV as much as to a screen: every measured
 * value is written next to its band, in its own column, so a row can never be
 * read as more certain than it is. Confidence travels with every delivery for
 * the same reason — a low-confidence speed that arrives in a spreadsheet
 * stripped of that flag is exactly the misreading the flag exists to prevent.
 */
import { Delivery, MetricRow, Session, SessionSummary, WorkloadEntry } from './types';

/** RFC 4180: quote when the value could otherwise break the row, double inner quotes. */
export function csvCell(value: string | number | boolean | null | undefined): string {
  if (value == null) return '';
  const text = String(value);
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function csvRow(cells: (string | number | boolean | null | undefined)[]): string {
  return cells.map(csvCell).join(',');
}

export function csvTable(
  header: string[],
  rows: (string | number | boolean | null | undefined)[][],
): string {
  return [csvRow(header), ...rows.map(csvRow)].join('\n');
}

/** Epoch millis to ISO 8601, or blank. Timestamps export unambiguous or not at all. */
function iso(at: number | null | undefined): string {
  return at == null ? '' : new Date(at).toISOString();
}

export function sessionsCsv(summaries: SessionSummary[]): string {
  return csvTable(
    [
      'session_id',
      'started_at',
      'ended_at',
      'type',
      'status',
      'balls',
      'best_kmh',
      'best_band_kmh',
      'avg_kmh',
      'avg_band_kmh',
      'capture_fps',
      'simulated',
      'low_confidence_override',
      'thermal_events',
    ],
    summaries.map(({ session: s, ...agg }) => [
      s.id,
      iso(s.startedAt),
      iso(s.endedAt),
      s.type,
      s.status,
      agg.balls,
      agg.bestKmh,
      agg.bestBandKmh,
      agg.avgKmh,
      agg.avgBandKmh,
      s.captureFps,
      s.simulated,
      s.lowConfOverride,
      s.thermalEvents.join(' '),
    ]),
  );
}

export function deliveriesCsv(deliveries: Delivery[]): string {
  return csvTable(
    [
      'delivery_id',
      'session_id',
      'index',
      'speed_kmh',
      'speed_band_kmh',
      'confidence',
      'frame_count',
      'bfc',
      'ffc',
      'release',
      'created_at',
    ],
    deliveries.map((d) => [
      d.id,
      d.sessionId,
      d.index,
      d.speedKmh,
      d.speedBandKmh,
      d.confidence,
      d.frameCount,
      d.events?.bfc ?? null,
      d.events?.ffc ?? null,
      d.events?.release ?? null,
      iso(d.createdAt),
    ]),
  );
}

export function metricsCsv(metrics: MetricRow[]): string {
  return csvTable(
    ['delivery_id', 'key', 'value', 'band_value', 'reference_lo', 'reference_hi'],
    metrics.map((m) => [
      m.deliveryId,
      m.key,
      m.value,
      m.bandValue,
      m.referenceLo,
      m.referenceHi,
    ]),
  );
}

export function workloadCsv(entries: WorkloadEntry[]): string {
  return csvTable(
    ['entry_id', 'date', 'deliveries', 'source', 'weighting', 'session_id'],
    entries.map((e) => [e.id, e.date, e.deliveries, e.source, e.weighting, e.sessionId]),
  );
}

export interface ExportInput {
  summaries: SessionSummary[];
  deliveries: Delivery[];
  metrics: MetricRow[];
  workload: WorkloadEntry[];
  clipPaths: string[];
}

export interface ExportFile {
  /** Filename within the export directory. */
  name: string;
  contents: string;
}

/**
 * The README is not padding. A CSV of speeds with no note about error bands or
 * confidence invites exactly the false precision the product spends the rest of
 * its surface area avoiding, and a spreadsheet outlives the app that made it.
 */
function readmeFor(input: ExportInput, exportedAt: number): string {
  const simulated = input.summaries.filter((s) => s.session.simulated).length;
  const lowConfidence = input.deliveries.filter((d) => d.confidence === 'low').length;

  return [
    'Sightscreen data export',
    `Exported ${iso(exportedAt)}`,
    '',
    'Files',
    '  sessions.csv     one row per session, with its aggregates',
    '  deliveries.csv   one row per ball',
    '  metrics.csv      one row per measured determinant, per ball',
    '  workload.csv     the bowling load ledger, captured and hand-entered',
    '',
    'Reading the numbers',
    '',
    'Every measured value has a band column beside it. A speed of 128.4 with a',
    'band of 4.0 means the estimate is 128.4 plus or minus 4.0 km/h. The band is',
    'not decoration and it is not a rounding hint: it is the measurement error,',
    'and a value read without it is being read as more certain than it is.',
    '',
    'Deliveries carry a confidence of ok or low. Low-confidence balls are kept',
    'here rather than dropped, because hiding them would be its own distortion,',
    'but they are excluded from trends in the app and should be excluded from',
    'any average taken from this export.',
    '',
    `${lowConfidence} of ${input.deliveries.length} deliveries in this export are low confidence.`,
    simulated > 0
      ? `${simulated} of ${input.summaries.length} sessions were produced by the simulated engine. Those speeds were never measured. They are synthesised values from a development build and mean nothing about how fast anyone bowled.`
      : 'No session in this export came from the simulated engine.',
    '',
    'Video',
    '',
    input.clipPaths.length
      ? `${input.clipPaths.length} clip file(s) are referenced by clip_path in sessions.csv and deliveries.csv. They are stored on this phone and are not copied into this export.`
      : 'No clips are stored on this phone.',
    '',
    'This export was produced on the phone. Nothing was uploaded to produce it.',
  ].join('\n');
}

/** The complete export, as files. Pure: no I/O, no clock — pass the time in. */
export function buildExport(input: ExportInput, exportedAt: number): ExportFile[] {
  return [
    { name: 'README.txt', contents: readmeFor(input, exportedAt) },
    { name: 'sessions.csv', contents: sessionsCsv(input.summaries) },
    { name: 'deliveries.csv', contents: deliveriesCsv(input.deliveries) },
    { name: 'metrics.csv', contents: metricsCsv(input.metrics) },
    { name: 'workload.csv', contents: workloadCsv(input.workload) },
  ];
}

/** Directory name for one export, stable and sortable. */
export function exportFolderName(exportedAt: number): string {
  return `sightscreen-export-${iso(exportedAt).replace(/[:.]/g, '-')}`;
}
