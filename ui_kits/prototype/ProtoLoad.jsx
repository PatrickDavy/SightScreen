import React from 'react';
export function ProtoLoad({ app, view }) {
  const { NS } = window.SSP;
  const { Card, Badge, Button, Icon, WorkloadMeter, SegmentedControl } = NS;
  const [span, setSpan] = React.useState('Week');
  const days = [['M', 18], ['T', 0], ['W', 24], ['T', 12], ['F', 0], ['S', 30], ['S', app.extraBalls || 0]];
  const weekBalls = days.reduce((a, [, v]) => a + v, 0);
  if (view.v === 'rest') return (
    <div data-screen-label="S52 Rest guidance" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
      <window.SSP.Head title="Bowl light today" onBack={app.pop} right={<Badge tone="watch">Advice</Badge>} />
      <Card>
        <div style={{ font: '400 13.5px/1.6 var(--font-ui)', color: 'var(--ink-2)' }}>You've bowled three of the last four days and your rolling 7-day load is near the {app.user.u18 ? 'U17' : 'senior'} guideline. The research ties injury risk to the 7-day peak more than any single day — today is the cheap day to go easy.</div>
      </Card>
      <Card title="Still useful today">
        <div style={{ display: 'grid', gap: 10 }}>
          {[['Front-leg brace, no ball', 'Walk-throughs against a wall — serves your current focus'], ['Run-up rhythm only', 'Run-throughs without bowling cost nothing'], ['Watch your last session', 'Two minutes on the insight beats six overs of grooving the fault']].map(([t, d]) => (
            <div key={t}><div style={{ font: '600 13.5px/1.2 var(--font-ui)' }}>{t}</div><div style={{ font: '400 12px/1.5 var(--font-ui)', color: 'var(--ink-2)', marginTop: 2 }}>{d}</div></div>
          ))}
        </div>
      </Card>
      <div style={{ font: '400 12px/1.6 var(--font-ui)', color: 'var(--ink-3)' }}>The app advises, you decide. Nothing is blocked — but the ledger keeps honest count either way.</div>
    </div>
  );
  return (
    <div data-screen-label="S50 Workload" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ font: '700 18px/1 var(--font-display)', textTransform: 'uppercase', letterSpacing: '.02em' }}>Load</div>
        <SegmentedControl size="sm" options={['Week', 'Season']} value={span} onChange={setSpan} />
      </div>
      <Card pad={14} style={{ cursor: 'pointer' }} onClick={() => app.push('rest')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Badge tone="watch">Bowl light</Badge>
          <span style={{ font: '400 12.5px/1.4 var(--font-ui)', color: 'var(--ink-2)', flex: 1 }}>Three days in a row — see why and what's still useful today.</span>
          <Icon name="chevron-right" size={15} color="var(--ink-3)" />
        </div>
      </Card>
      {span === 'Week' ? (
        <React.Fragment>
          <Card title="Deliveries by day">
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 90 }}>
              {days.map(([d, v], i) => (
                <div key={i} style={{ flex: 1, display: 'grid', gap: 4, justifyItems: 'center', alignContent: 'end', height: '100%' }}>
                  <span style={{ font: '500 9.5px/1 var(--font-mono)', color: 'var(--ink-3)' }}>{v || ''}</span>
                  <div style={{ width: '100%', height: Math.max(v * 2, 2), background: i === 6 ? 'var(--cherry)' : v ? 'var(--ink)' : 'var(--band-track)', borderRadius: 2 }}></div>
                  <span style={{ font: '500 10px/1 var(--font-mono)', color: 'var(--ink-3)' }}>{d}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div style={{ display: 'grid', gap: 16 }}>
              <WorkloadMeter label="Rolling 7 days" used={Math.round(weekBalls / 6 * 10) / 10} limit={21} unit="overs" guideline={`${app.user.u18 ? 'U17' : 'Senior'} guideline · illustrative figures`} />
              <div style={{ font: '400 11px/1.6 var(--font-mono)', color: 'var(--ink-3)' }}>3 spells this week · match balls weighted heavier · uncaptured sessions can be added by hand — a ledger that only counts filmed balls is worse than useless.</div>
            </div>
          </Card>
          <Button variant="secondary" full icon="plus" onClick={() => app.note('Manual entry added: 4 overs, net weighting.')}>Add an uncaptured session</Button>
        </React.Fragment>
      ) : (
        <Card title="Season" action={<Badge tone="watch">Ramp flagged</Badge>}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 80 }}>
            {[8, 10, 9, 0, 0, 4, 12, 16, 14, 18, 22, 26].map((v, i) => (
              <div key={i} style={{ flex: 1, height: Math.max(v * 2.6, 2), background: i > 9 ? 'var(--amber)' : v ? 'var(--ink)' : 'var(--band-track)', borderRadius: 2 }}></div>
            ))}
          </div>
          <div style={{ font: '400 12.5px/1.55 var(--font-ui)', color: 'var(--ink-2)', marginTop: 12 }}>Load is up sharply since the June break — sudden ramps after time off are a documented risk, and exactly what chasing pace invites. Build over three weeks, not one.</div>
        </Card>
      )}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', background: 'var(--turf-tint)', border: '1px solid var(--turf-soft)', borderRadius: 'var(--radius-2)' }}>
        <Icon name="shield" size={16} color="var(--turf-deep)" style={{ marginTop: 1 }} />
        <span style={{ font: '400 12.5px/1.5 var(--font-ui)', color: 'var(--turf-deep)' }}>The ledger is free forever. Safety never sits behind a paywall.</span>
      </div>
    </div>
  );
}
