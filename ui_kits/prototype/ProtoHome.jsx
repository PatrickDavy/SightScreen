import React from 'react';
export function ProtoHome({ app, view }) {
  const { NS, cvv } = window.SSP;
  const { Card, Badge, Button, Icon, Metric, Tabs, WorkloadMeter } = NS;
  const unit = app.user.unit;
  const cv = v => cvv(v, unit);
  const [trendTab, setTrendTab] = React.useState('pace');
  const latest = app.sessions[0];
  if (view.v === 'history') return (
    <div data-screen-label="S11 Session history" style={{ padding: '10px 16px 24px', display: 'grid', gap: 8, alignContent: 'start' }}>
      <window.SSP.Head title="All sessions" onBack={app.pop} />
      {app.sessions.map(s => (
        <Card key={s.id} pad={13} style={{ cursor: 'pointer' }} onClick={() => app.push('review', { id: s.id })}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div><div style={{ font: '600 14px/1.2 var(--font-ui)' }}>{s.label}</div><div style={{ font: '400 11px/1 var(--font-mono)', color: 'var(--ink-3)', marginTop: 4 }}>{s.date} · {s.balls} balls</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ font: '700 19px/1 var(--font-display)' }}>{cv(s.best)}</span>
              <Icon name="chevron-right" size={15} color="var(--ink-3)" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
  if (view.v === 'trends') {
    const pace = [108.4, 110.1, 109.2, 112.6, 113.8, 114.9, 116.2];
    const marks = { 2: 'drill', 5: 'retest' };
    return (
      <div data-screen-label="S60 Progress" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
        <window.SSP.Head title="Progress" onBack={app.pop} />
        <Tabs items={[{ id: 'pace', label: 'Pace trend' }, { id: 'metrics', label: 'Metric trends' }]} value={trendTab} onChange={setTrendTab} />
        {trendTab === 'pace' ? (
          <Card title="Fastest ball, this season" action={<Badge tone="good">+7.8 km/h</Badge>}>
            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-end', height: 110 }}>
              {pace.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'grid', gap: 4, justifyItems: 'center', alignContent: 'end', height: '100%' }}>
                  <div style={{ width: '100%', height: (v - 100) * 6, background: i === pace.length - 1 ? 'var(--cherry)' : 'var(--ink)', borderRadius: 2 }}></div>
                  {marks[i] ? <div style={{ width: 5, height: 5, borderRadius: '50%', background: marks[i] === 'drill' ? 'var(--amber)' : 'var(--turf)' }}></div> : <div style={{ height: 5 }}></div>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 10, font: '500 10px/1 var(--font-mono)', color: 'var(--ink-3)' }}>
              <span><span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--amber)', marginRight: 5 }}></span>DRILL STARTED</span>
              <span><span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--turf)', marginRight: 5 }}></span>RETEST PASSED</span>
            </div>
            <div style={{ font: '400 11px/1.6 var(--font-mono)', color: 'var(--ink-3)', marginTop: 8 }}>Within-season only — off-season gaps make continuous lines lie.</div>
          </Card>
        ) : (
          <Card title="Determinants over the season">
            <div style={{ display: 'grid', gap: 14 }}>
              {[['Front knee at release', '141° → 148°', 'good'], ['Run-up speed', '5.0 → 5.2 m/s', 'good'], ['Arm delay', '0.15 → 0.14 s', 'neutral'], ['Trunk flexion', '38° → 38°', 'neutral']].map(([n, v, t]) => (
                <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ font: '500 13px/1.3 var(--font-ui)' }}>{n}</span>
                  <span style={{ font: '500 12px/1 var(--font-mono)', color: t === 'good' ? 'var(--turf-deep)' : 'var(--ink-3)' }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }
  const paceCard = (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <Metric label="Current pace" value={cv(latest.best)} unit={unit} band={cv(latest.band)} sample={latest.date} size="lg" />
        <Badge tone="good">+1.3 vs last</Badge>
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 34, marginTop: 12, cursor: 'pointer' }} onClick={() => app.push('trends')}>
        {[108.4, 110.1, 109.2, 112.6, 113.8, 114.9, latest.best].map((v, i) => (
          <div key={i} style={{ flex: 1, height: Math.max((v - 104) * 2.6, 3), background: i === 6 ? 'var(--cherry)' : 'var(--band-fill)', opacity: i === 6 ? 1 : .28, borderRadius: 1.5 }}></div>
        ))}
      </div>
      <div style={{ font: '500 10.5px/1 var(--font-mono)', color: 'var(--ink-3)', marginTop: 8 }}>SEASON TREND · TAP FOR PROGRESS</div>
    </Card>
  );
  const loadCard = (
    <Card pad={14} style={{ cursor: 'pointer' }} onClick={() => app.setTab('load')}>
      <WorkloadMeter label="This week" used={14} limit={21} unit="overs" guideline={`${app.user.u18 ? 'U17' : 'Senior'} guideline · illustrative`} />
    </Card>
  );
  return (
    <div data-screen-label="S10 Home" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ font: '700 18px/1 var(--font-display)', textTransform: 'uppercase', letterSpacing: '.02em' }}>Sightscreen</div>
        {app.user.u18 ? <Badge>U17 account</Badge> : <NS.IconButton name="settings" label="Settings" size="sm" onClick={() => app.setTab('you')} />}
      </div>
      {app.user.u18 ? loadCard : paceCard}
      {app.user.u18 ? paceCard : loadCard}
      <Card pad={14} style={{ cursor: 'pointer' }} onClick={() => app.push('drill', { id: 'brace' })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="target" size={17} color="var(--cherry)" />
          <div style={{ flex: 1 }}><div style={{ font: '600 13.5px/1.2 var(--font-ui)' }}>Next: front-leg brace, then retest</div><div style={{ font: '400 11.5px/1.4 var(--font-ui)', color: 'var(--ink-2)', marginTop: 2 }}>Your one thing from the last session.</div></div>
          <Icon name="chevron-right" size={15} color="var(--ink-3)" />
        </div>
      </Card>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ font: '700 11px/1 var(--font-ui)', letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', color: 'var(--ink-2)' }}>Recent sessions</span>
        <a style={{ font: '600 12px/1 var(--font-ui)', cursor: 'pointer' }} onClick={() => app.push('history')}>All sessions</a>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {app.sessions.slice(0, 3).map(s => (
          <Card key={s.id} pad={13} style={{ cursor: 'pointer' }} onClick={() => app.push('review', { id: s.id })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div><div style={{ font: '600 14px/1.2 var(--font-ui)' }}>{s.label}</div><div style={{ font: '400 11px/1 var(--font-mono)', color: 'var(--ink-3)', marginTop: 4 }}>{s.date} · {s.balls} balls</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ textAlign: 'right' }}><span style={{ font: '700 19px/1 var(--font-display)' }}>{cv(s.best)}</span><span style={{ font: '400 10px/1 var(--font-mono)', color: 'var(--ink-3)' }}> ±{cv(s.band)}</span></div>
                <Icon name="chevron-right" size={15} color="var(--ink-3)" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
