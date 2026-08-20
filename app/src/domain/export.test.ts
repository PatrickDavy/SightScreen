/**
 * The export is a privacy-access answer as much as a convenience, so the tests
 * check what a person would be misled by: a number without its band, a
 * low-confidence ball that looks measured, or a simulated session that reads
 * like a real one.
 */
import {
  ExportInput,
  buildExport,
  csvCell,
  deliveriesCsv,
  exportFolderName,
  metricsCsv,
  sessionsCsv,
  workloadCsv,
} from './export';
import { Delivery, MetricRow, Session, SessionSummary, WorkloadEntry } from './types';

const AT = new Date('2026-08-19T09:30:00.000Z').getTime();

const session = (over: Partial<Session> = {}): Session => ({
  id: 's1',
  bowlerId: 'b1',
  type: 'net',
  venueId: null,
  startedAt: AT,
  endedAt: AT + 60_000,
  deviceModel: 'Pixel 8',
  captureFps: 240,
  scaleUncertainty: null,
  thermalEvents: [],
  calibrationId: null,
  weighting: 1,
  status: 'complete',
  processedCount: 2,
  lowConfOverride: false,
  clipPath: null,
  simulated: false,
  ...over,
});

const summary = (over: Partial<Session> = {}): SessionSummary => ({
  session: session(over),
  balls: 2,
  bestKmh: 128.4,
  bestBandKmh: 4,
  avgKmh: 126.1,
  avgBandKmh: 4.2,
  frames: 26,
});

const delivery = (over: Partial<Delivery> = {}): Delivery => ({
  id: 'd1',
  sessionId: 's1',
  index: 0,
  speedKmh: 128.4,
  speedBandKmh: 4,
  confidence: 'ok',
  clipPath: null,
  frameCount: 26,
  events: { bfc: 0.1, ffc: 0.4, release: 0.6 },
  createdAt: AT,
  ...over,
});

const metric = (over: Partial<MetricRow> = {}): MetricRow => ({
  deliveryId: 'd1',
  key: 'knee',
  value: 148,
  bandValue: 5,
  referenceLo: 150,
  referenceHi: 180,
  ...over,
});

const entry = (over: Partial<WorkloadEntry> = {}): WorkloadEntry => ({
  id: 'w1',
  bowlerId: 'b1',
  date: '2026-08-19',
  deliveries: 36,
  source: 'captured',
  weighting: 1,
  sessionId: 's1',
  ...over,
});

const input = (over: Partial<ExportInput> = {}): ExportInput => ({
  summaries: [summary()],
  deliveries: [delivery()],
  metrics: [metric()],
  workload: [entry()],
  clipPaths: [],
  ...over,
});

/** First file of an export — the readme, by construction. */
function first(files: { name: string; contents: string }[]) {
  const file = files[0];
  if (!file) throw new Error('export produced no files');
  return file;
}

/** Split a CSV into header and data rows. */
function rows(csv: string) {
  const lines = csv.split('\n');
  return { header: (lines[0] ?? '').split(','), body: lines.slice(1) };
}

describe('CSV escaping', () => {
  it('leaves plain values alone', () => {
    expect(csvCell('net')).toBe('net');
    expect(csvCell(128.4)).toBe('128.4');
  });

  it('quotes anything that would break a row, and doubles inner quotes', () => {
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('line\nbreak')).toBe('"line\nbreak"');
    expect(csvCell('say "go"')).toBe('"say ""go"""');
  });

  it('writes an empty cell for null and undefined, not the word null', () => {
    expect(csvCell(null)).toBe('');
    expect(csvCell(undefined)).toBe('');
  });
});

describe('every measured value carries its band', () => {
  it('pairs each speed with a band column', () => {
    const { header } = rows(deliveriesCsv([delivery()]));
    expect(header).toContain('speed_kmh');
    expect(header).toContain('speed_band_kmh');
    expect(header.indexOf('speed_band_kmh')).toBe(header.indexOf('speed_kmh') + 1);
  });

  it('pairs each metric with a band column', () => {
    const { header } = rows(metricsCsv([metric()]));
    expect(header.indexOf('band_value')).toBe(header.indexOf('value') + 1);
  });

  it('pairs each session aggregate with a band column', () => {
    const { header } = rows(sessionsCsv([summary()]));
    expect(header.indexOf('best_band_kmh')).toBe(header.indexOf('best_kmh') + 1);
    expect(header.indexOf('avg_band_kmh')).toBe(header.indexOf('avg_kmh') + 1);
  });
});

describe('confidence survives the export', () => {
  it('writes confidence on every delivery', () => {
    const csv = deliveriesCsv([delivery({ confidence: 'low' })]);
    expect(rows(csv).header).toContain('confidence');
    expect(csv).toContain('low');
  });

  it('keeps low-confidence deliveries rather than dropping them', () => {
    const csv = deliveriesCsv([delivery({ id: 'd1' }), delivery({ id: 'd2', confidence: 'low' })]);
    expect(rows(csv).body).toHaveLength(2);
  });

  it('says how many are low confidence, so an average is not taken blind', () => {
    const readme = first(buildExport(
      input({ deliveries: [delivery(), delivery({ id: 'd2', confidence: 'low' })] }),
      AT,
    ));
    expect(readme.contents).toContain('1 of 2 deliveries in this export are low confidence');
  });
});

describe('simulated sessions are declared', () => {
  it('flags them in the session table', () => {
    expect(sessionsCsv([summary({ simulated: true })])).toContain('true');
  });

  it('says plainly in the readme that those speeds were never measured', () => {
    const readme = first(buildExport(input({ summaries: [summary({ simulated: true })] }), AT));
    expect(readme.contents).toContain('were never measured');
  });

  it('says so when none were simulated, rather than staying silent', () => {
    const readme = first(buildExport(input(), AT));
    expect(readme.contents).toContain('No session in this export came from the simulated engine');
  });
});

describe('the export as a whole', () => {
  it('writes a readme and one file per table', () => {
    expect(buildExport(input(), AT).map((f) => f.name)).toEqual([
      'README.txt',
      'sessions.csv',
      'deliveries.csv',
      'metrics.csv',
      'workload.csv',
    ]);
  });

  it('writes headers even when there is nothing to export', () => {
    const files = buildExport(
      { summaries: [], deliveries: [], metrics: [], workload: [], clipPaths: [] },
      AT,
    );
    for (const file of files.filter((f) => f.name.endsWith('.csv'))) {
      expect(file.contents.split('\n')).toHaveLength(1);
      expect(file.contents.length).toBeGreaterThan(0);
    }
  });

  it('exports the workload ledger, which is free on every tier', () => {
    const csv = workloadCsv([entry({ source: 'manual' })]);
    expect(rows(csv).body).toHaveLength(1);
    expect(csv).toContain('manual');
  });

  it('says clips stay on the phone rather than implying they are included', () => {
    const readme = first(buildExport(input({ clipPaths: ['/clips/a.mp4'] }), AT));
    expect(readme.contents).toContain('are not copied into this export');
  });

  it('names the folder so exports sort and never collide', () => {
    expect(exportFolderName(AT)).toBe('sightscreen-export-2026-08-19T09-30-00-000Z');
  });

  it('writes timestamps as ISO 8601, not as epoch millis', () => {
    expect(deliveriesCsv([delivery()])).toContain('2026-08-19T09:30:00.000Z');
  });
});
