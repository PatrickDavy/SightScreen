import React from 'react';
export function ProtoReview({ app, view }) {
  const { NS, cvv } = window.SSP;
  const { Card, Metric, CueCard, Badge, Icon, Button, SegmentedControl } = NS;
  const s = app.sessions.find(x => x.id === view.id) || app.sessions[0];
  const unit = app.user.unit;
  const cv = v => cvv(v, unit);
  const metrics = [
    { id: 'knee', name: 'Front knee at release', val: '148', unit: '°', band: 5, ref: 'Faster bowlers: >150°', mean: 'A braced, straight front leg converts run-up momentum into ball speed. Yours collapses slightly.', range: { min: 120, max: 180, good: [150, 180] } },
    { id: 'runup', name: 'Run-up speed', val: '5.2', unit: 'm/s', band: 0.3, ref: 'Faster bowlers: 5.5–7.0 m/s', mean: 'Momentum in is speed out — but only if the front leg can brace against it.', range: { min: 3, max: 8, good: [5.5, 7] } },
    { id: 'delay', name: 'Arm delay', val: '0.14', unit: 's', band: 0.02, ref: 'Faster bowlers: 0.10–0.13 s', mean: 'The lag between front-foot contact and the arm firing. Longer isn’t better past a point.', range: { min: 0.05, max: 0.25, good: [0.10, 0.13] } },
    { id: 'trunk', name: 'Trunk flexion at release', val: '38', unit: '°', band: 6, ref: 'Typical band: 25–45°', mean: 'Forward trunk drive adds speed; sideways collapse costs it and loads the back.', range: { min: 0, max: 60, good: [25, 45] } },
  ];
  if (view.v === 'insight') return (
    <div data-screen-label="S33 The one insight" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 16px 24px' }}>
      <window.SSP.Head title="The one insight" onBack={app.pop} />
      <div style={{ flex: 1, display: 'grid', gap: 14, alignContent: 'start', marginTop: 4 }}>
        <CueCard cue="Brace your front knee" gain="+3–6 km/h estimated"
          detail="At release your knee sits at 148° ±5° — quicker bowlers hold above 150°. Land heel-first and push tall through the front leg." />
        <Card title="Why this one">
          <div style={{ font: '400 13px/1.6 var(--font-ui)', color: 'var(--ink-2)' }}>Two limiters were close — front knee and run-up speed. The knee comes first because it's safer and easier to change, and a faster run-up without a brace just leaks more speed. One thing at a time; the rest waits on Improve.</div>
        </Card>
        <div style={{ font: '400 11px/1.6 var(--font-mono)', color: 'var(--ink-3)' }}>Chosen from {s.balls} deliveries · confidence-weighted · low-confidence balls excluded</div>
      </div>
      <Button size="lg" full icon="play" onClick={() => app.push('drill', { id: 'brace' })}>Start the drill</Button>
    </div>
  );
  if (view.v === 'explainer') {
    const m = metrics.find(x => x.id === view.mid) || metrics[0];
    return (
      <div data-screen-label="S32 Metric explainer" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
        <window.SSP.Head title={m.name} onBack={app.pop} />
        <Metric label="Yours" value={m.val} unit={m.unit} band={m.band} size="md" range={m.range} />
        {[['What it is', m.mean], ['Why it links to speed', m.ref + '. The correlation is one of the few consistent findings across fast-bowling studies.'], ['How it’s measured here', 'Pose estimation on your 240 fps clip, read at the release frame. The ± band is the model’s uncertainty on your video — light, angle and distance move it.'], ['Limitations', 'A single side-on phone view can’t see everything; small angle errors are expected. Low-confidence deliveries are flagged and left out of trends, never silently included.'], ['Research', 'Portus et al. (2004), J Sports Sci — front-leg kinematics and release speed. Summarised in plain language; the full citation list is in Settings.']].map(([h, b]) => (
          <div key={h}><div style={{ font: '700 11px/1 var(--font-ui)', letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 5 }}>{h}</div><div style={{ font: '400 13px/1.55 var(--font-ui)', color: 'var(--ink-2)' }}>{b}</div></div>
        ))}
      </div>
    );
  }
  if (view.v === 'delivery') {
    const d = s.d[view.n - 1] || s.d[0];
    return (
      <div data-screen-label="S31 Delivery detail" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
        <window.SSP.Head title={`Delivery ${d.n}`} onBack={app.pop} right={d.conf === 'low' ? <Badge tone="watch">Low confidence</Badge> : <Badge tone="good">Confident</Badge>} />
        <div style={{ position: 'relative', height: 200, background: 'var(--ink)', borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 8 }}>
            <Icon name="play" size={30} color="var(--chalk)" />
            <div style={{ font: '500 10px/1 var(--font-mono)', letterSpacing: '.1em', color: 'rgba(242,240,233,.7)' }}>VIDEO + SKELETON OVERLAY · FRAME-STEP</div>
          </div>
        </div>
        <div style={{ position: 'relative', height: 22 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 9, height: 4, background: 'var(--band-track)', borderRadius: 2 }}></div>
          {[['BFC', 22], ['FFC', 46], ['REL', 58]].map(([t, x]) => (
            <div key={t} style={{ position: 'absolute', left: x + '%', top: 0, display: 'grid', justifyItems: 'center', gap: 2, transform: 'translateX(-50%)' }}>
              <div style={{ width: 2, height: 12, background: 'var(--ink)', marginTop: 5 }}></div>
              <div style={{ font: '500 8.5px/1 var(--font-mono)', color: 'var(--ink-3)' }}>{t}</div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: '58%', top: 5, width: 12, height: 12, borderRadius: '50%', background: 'var(--cherry)', border: '2px solid var(--paper)', transform: 'translateX(-50%)' }}></div>
        </div>
        <Card><Metric label="Ball speed" value={cv(d.speed)} unit={unit} band={cv(d.band)} sample="this delivery" size="md" /></Card>
        <div style={{ display: 'grid', gap: 8 }}>
          {metrics.map(m => (
            <Card key={m.id} pad={13} style={{ cursor: 'pointer' }} onClick={() => app.push('explainer', { mid: m.id })}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ font: '600 13.5px/1.25 var(--font-ui)' }}>{m.name} — {m.val}{m.unit} <span style={{ font: '400 11px/1 var(--font-mono)', color: 'var(--ink-3)' }}>±{m.band}{m.unit}</span></div>
                  <div style={{ font: '500 11.5px/1.4 var(--font-mono)', color: 'var(--ink-3)', marginTop: 4 }}>{m.ref}</div>
                  <div style={{ font: '400 12.5px/1.5 var(--font-ui)', color: 'var(--ink-2)', marginTop: 4 }}>{m.mean}</div>
                </div>
                <Icon name="chevron-right" size={16} color="var(--ink-3)" style={{ marginTop: 2 }} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  const sp = s.d.map(x => x.speed);
  const fast = Math.max(...sp), slow = Math.min(...sp);
  const delta = s.prev ? Math.round((s.best - s.prev) * 10) / 10 : null;
  return (
    <div data-screen-label="S30 Session review" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
      <window.SSP.Head title={`${s.label} · ${s.date}`} onBack={app.pop} right={<SegmentedControl size="sm" options={['km/h', 'mph']} value={unit} onChange={app.setUnit} />} />
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <Metric label="Fastest ball" value={cv(s.best)} unit={unit} band={cv(s.band)} sample={`from ${s.frames} frames`} size="lg" />
          <Metric label="Average" value={cv(s.avg)} unit={unit} band={cv(s.avgBand)} size="sm" />
        </div>
        {delta != null ? <div style={{ font: '500 12px/1.5 var(--font-mono)', color: delta >= 0 ? 'var(--turf-deep)' : 'var(--ink-2)', marginTop: 12, paddingTop: 12, borderTop: 'var(--border-hair)' }}>{delta >= 0 ? '+' : ''}{cv(Math.abs(delta)) * Math.sign(delta) || delta} {unit} vs last session — within the ±{cv(s.band)} band, so treat it as level.</div> : null}
      </Card>
      <CueCard cue="Brace your front knee" gain="+3–6 km/h estimated" detail="Your biggest opportunity this session. See why it was chosen ahead of the others." actionLabel="See the one insight" onAction={() => app.push('insight', { id: s.id })} />
      <div style={{ font: '700 11px/1 var(--font-ui)', letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', color: 'var(--ink-2)', marginTop: 2 }}>Deliveries</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {s.d.map(d => (
          <Card key={d.n} pad={12} style={{ cursor: 'pointer' }} onClick={() => app.push('delivery', { id: s.id, n: d.n })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 24, background: 'var(--ink)', borderRadius: 3, flex: 'none' }}></div>
              <span style={{ font: '600 13px/1 var(--font-ui)', width: 22 }}>{d.n}</span>
              <span style={{ font: '500 13px/1 var(--font-mono)', flex: 1 }}>{cv(d.speed)} <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>±{cv(d.band)} {unit}</span></span>
              {d.speed === fast ? <Badge tone="inverse">Fastest</Badge> : null}
              {d.speed === slow ? <Badge>Slowest</Badge> : null}
              {d.conf === 'low' ? <Badge tone="watch">Low conf</Badge> : null}
              <Icon name="chevron-right" size={15} color="var(--ink-3)" />
            </div>
          </Card>
        ))}
      </div>
      <div style={{ font: '400 10.5px/1.6 var(--font-mono)', color: 'var(--ink-3)' }}>Low-confidence deliveries stay visible but sit outside your trend. Speeds shown with their error band — never a false-precision decimal.</div>
    </div>
  );
}
