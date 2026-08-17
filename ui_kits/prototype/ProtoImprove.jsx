import React from 'react';
const drills = {
  brace: { name: 'Front-leg brace', det: 'Front knee at release', cues: ['Land heel-first, toes to the sky', 'Push tall through the front hip', 'Chest stays up as the arm fires'], reps: '3 × 6 balls, short run', feel: 'The front leg lands like a pole, not a spring. You should feel taller at release, and the ball should come out in front of you.' },
  rhythm: { name: 'Run-up rhythm', det: 'Run-up speed', cues: ['Build, don’t sprint', 'Last four steps quickest', 'Hit the crease accelerating'], reps: '4 run-throughs, then 2 × 6 balls', feel: 'The approach feels downhill. No gather-and-stall in the last two strides.' },
  delay: { name: 'Arm delay', det: 'Arm delay', cues: ['Front arm pulls first', 'Bowling arm stays long and late', 'Snap through, don’t push'], reps: '2 × 6 balls off a walk-in', feel: 'A stretch across the chest just before the arm comes over — the sling, not the shove.' },
  stack: { name: 'Trunk stack', det: 'Trunk flexion at release', cues: ['Drive forward, not sideways', 'Head chases the target', 'Finish over the front leg'], reps: '3 × 6 balls, three-quarter pace', feel: 'The follow-through carries you down the pitch instead of falling away to the off side.' },
};
export function ProtoImprove({ app, view }) {
  const { NS } = window.SSP;
  const { Card, Badge, Button, Icon, Metric } = NS;
  const u18 = app.user.u18;
  if (view.v === 'drill') {
    const d = drills[view.id] || drills.brace;
    return (
      <div data-screen-label="S41 Drill detail" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 16px 24px' }}>
        <window.SSP.Head title={d.name} onBack={app.pop} right={<Badge>{d.det}</Badge>} />
        <div style={{ flex: 1, display: 'grid', gap: 12, alignContent: 'start', marginTop: 4, overflowY: 'auto' }}>
          <div style={{ position: 'relative', height: 180, background: 'var(--ink)', borderRadius: 'var(--radius-2)', display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 8 }}>
            <Icon name="play" size={30} color="var(--chalk)" />
            <div style={{ font: '500 10px/1 var(--font-mono)', letterSpacing: '.1em', color: 'rgba(242,240,233,.7)' }}>DEMONSTRATION VIDEO</div>
          </div>
          <Card title="Cues"><div style={{ display: 'grid', gap: 8 }}>{d.cues.map((c, i) => (
            <div key={c} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}><span style={{ font: '700 13px/1 var(--font-display)', color: 'var(--cherry)' }}>{i + 1}</span><span style={{ font: '400 14px/1.4 var(--font-ui)' }}>{c}</span></div>
          ))}</div></Card>
          <Card title="Prescription"><div style={{ font: '500 13px/1.5 var(--font-mono)', color: 'var(--ink-2)' }}>{d.reps}</div></Card>
          <Card title="What should feel different"><div style={{ font: '400 13px/1.55 var(--font-ui)', color: 'var(--ink-2)' }}>{d.feel}</div></Card>
        </div>
        <Button size="lg" full icon="video" onClick={() => { app.setCaptureType('Drill check'); app.push('capture'); }} style={{ marginTop: 12 }}>Retest this in your next session</Button>
      </div>
    );
  }
  if (view.v === 'retest') return (
    <div data-screen-label="S42 Retest comparison" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
      <window.SSP.Head title="Retest — front-leg brace" onBack={app.pop} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {['BEFORE · 2 AUG', 'AFTER · 15 AUG'].map(t => (
          <div key={t} style={{ position: 'relative', height: 150, background: 'var(--ink)', borderRadius: 'var(--radius-2)', display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 6 }}>
            <Icon name="play" size={22} color="var(--chalk)" />
            <div style={{ font: '500 8.5px/1 var(--font-mono)', letterSpacing: '.1em', color: 'rgba(242,240,233,.7)' }}>{t}</div>
          </div>
        ))}
      </div>
      <div style={{ font: '500 10.5px/1 var(--font-mono)', color: 'var(--ink-3)', textAlign: 'center' }}>SYNCHRONISED AT FRONT-FOOT CONTACT</div>
      <Card>
        <div style={{ display: 'flex', gap: 26 }}>
          <Metric label="Front knee at release" value="148 → 153" unit="°" band={5} size="sm" />
          <Metric label="Speed change" value="+2.8" unit="km/h" band={1.4} size="sm" tone="var(--turf)" />
        </div>
        <div style={{ font: '400 12.5px/1.55 var(--font-ui)', color: 'var(--ink-2)', marginTop: 12, paddingTop: 12, borderTop: 'var(--border-hair)' }}>The change is bigger than its error band — this one's real. Keep the drill for one more week, then move to the next limiter.</div>
      </Card>
      {u18 ? (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', background: 'var(--chalk)', border: 'var(--border-hair)', borderRadius: 'var(--radius-2)' }}>
          <Icon name="shield" size={16} color="var(--ink-2)" style={{ marginTop: 1 }} />
          <span style={{ font: '400 12.5px/1.5 var(--font-ui)', color: 'var(--ink-2)' }}>Sharing is off for under-18 accounts until your guardian turns it on.</span>
        </div>
      ) : <Button variant="secondary" full icon="share-2" onClick={app.openShare}>Share this comparison</Button>}
    </div>
  );
  if (view.v === 'library') return (
    <div data-screen-label="S43 Drill library" style={{ padding: '10px 16px 24px', display: 'grid', gap: 10, alignContent: 'start' }}>
      <window.SSP.Head title="Drill library" onBack={app.pop} />
      <div style={{ font: '400 12.5px/1.5 var(--font-ui)', color: 'var(--ink-2)' }}>One drill per determinant. Small on purpose — the app prescribes; the library is for the curious.</div>
      {Object.entries(drills).map(([id, d]) => (
        <Card key={id} pad={14} style={{ cursor: 'pointer' }} onClick={() => app.push('drill', { id })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div><div style={{ font: '600 15px/1.2 var(--font-ui)' }}>{d.name}</div><div style={{ font: '500 11px/1 var(--font-mono)', color: 'var(--ink-3)', marginTop: 4 }}>{d.det}</div></div>
            <Icon name="chevron-right" size={16} color="var(--ink-3)" />
          </div>
        </Card>
      ))}
    </div>
  );
  return (
    <div data-screen-label="S40 Improve home" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ font: '700 18px/1 var(--font-display)', textTransform: 'uppercase', letterSpacing: '.02em' }}>Improve</div>
        <Badge tone="watch">Retest due</Badge>
      </div>
      <Card title="Current focus" action={<Badge tone="inverse">Week 2</Badge>}>
        <div style={{ font: '600 20px/1.15 var(--font-display)' }}>Brace your front knee</div>
        <div style={{ font: '400 12.5px/1.5 var(--font-ui)', color: 'var(--ink-2)', marginTop: 6 }}>2 drill sessions done since the insight. Enough bowling has passed — time to check it stuck.</div>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          <Button full icon="video" onClick={() => { app.setCaptureType('Drill check'); app.push('capture'); }}>Retest — bowl a drill check</Button>
          <Button variant="secondary" full onClick={() => app.push('drill', { id: 'brace' })}>Open the drill</Button>
        </div>
      </Card>
      <Card pad={14} style={{ cursor: 'pointer' }} onClick={() => app.push('retest')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <div><div style={{ font: '600 14px/1.2 var(--font-ui)' }}>Last retest — front-leg brace</div><div style={{ font: '500 11px/1 var(--font-mono)', color: 'var(--turf-deep)', marginTop: 4 }}>+2.8 ±1.4 km/h · verified</div></div>
          <Icon name="chevron-right" size={16} color="var(--ink-3)" />
        </div>
      </Card>
      <Card pad={14} style={{ cursor: 'pointer' }} onClick={() => app.push('library')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <div style={{ font: '600 14px/1.2 var(--font-ui)' }}>Drill library</div>
          <Icon name="chevron-right" size={16} color="var(--ink-3)" />
        </div>
      </Card>
    </div>
  );
}
