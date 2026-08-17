import React from 'react';
const toMph = v => Math.round(v * 62.1371) / 100;
export function ResultScreen({ session, onBack }) {
  const { Card, Metric, CueCard, SegmentedControl, IconButton, Icon } = window.SightscreenDesignSystem_9d8748;
  const [unit, setUnit] = React.useState('km/h');
  const cv = v => unit === 'km/h' ? v : toMph(v);
  return (
    <div style={{ padding: '10px 16px 24px', display: 'grid', gap: 14, alignContent: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <button type="button" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: '4px 0', font: '600 13px/1 var(--font-ui)', color: 'var(--ink-2)', cursor: 'pointer' }}>
          <Icon name="chevron-left" size={16} />{session.label} · {session.date}
        </button>
        <IconButton name="share-2" label="Share" size="sm" />
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <Metric label="Fastest ball" value={cv(session.best)} unit={unit} band={cv(session.band)} sample={`from ${session.frames} frames`} size="lg" />
          <SegmentedControl size="sm" options={['km/h', 'mph']} value={unit} onChange={setUnit} />
        </div>
        <div style={{ display: 'flex', gap: 28, marginTop: 16, paddingTop: 14, borderTop: 'var(--border-hair)' }}>
          <Metric label="Average" value={cv(session.avg)} unit={unit} band={cv(session.avgBand)} size="sm" />
          <Metric label="Balls measured" value={session.balls} size="sm" />
        </div>
      </Card>
      <CueCard cue="Brace your front knee" gain="+3–6 km/h estimated"
        detail="At front-foot contact your knee flexes to 38° ±5°. Bowlers a band quicker hold it under 20°. Land heel-first and push tall through the front leg."
        actionLabel="Watch the drill" onAction={() => {}} />
      <Card title="Your action, measured">
        <div style={{ display: 'grid', gap: 16 }}>
          <Metric label="Front knee flexion at contact" value={38} unit="°" band={5} size="sm" range={{ min: 0, max: 60, good: [0, 20] }} />
          <Metric label="Hip–shoulder separation" value={31} unit="°" band={4} size="sm" range={{ min: 0, max: 60, good: [35, 50] }} />
          <Metric label="Run-up speed" value={5.2} unit="m/s" band={0.3} size="sm" range={{ min: 3, max: 8, good: [5.5, 7] }} />
        </div>
      </Card>
      <div style={{ font: '400 10.5px/1.6 var(--font-mono)', color: 'var(--ink-3)' }}>Measured from {session.frames} of 31 frames · phone 21 m from crease · good light</div>
    </div>
  );
}
