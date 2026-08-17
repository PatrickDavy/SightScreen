import React from 'react';
export function WorkloadScreen() {
  const { Card, Badge, WorkloadMeter, Icon, Select } = window.SightscreenDesignSystem_9d8748;
  const [age, setAge] = React.useState('U17');
  const spells = [
    { d: 'Sat 15 Aug', o: '6 overs', t: 'Club nets' },
    { d: 'Tue 12 Aug', o: '5 overs', t: 'School nets' },
    { d: 'Sun 9 Aug', o: '7 overs', t: 'Match' },
  ];
  return (
    <div style={{ padding: '10px 16px 24px', display: 'grid', gap: 14, alignContent: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ font: '700 18px/1 var(--font-display)', letterSpacing: '.02em', textTransform: 'uppercase' }}>Workload</div>
        <Badge>{age} directives</Badge>
      </div>
      <Card>
        <div style={{ display: 'grid', gap: 18 }}>
          <WorkloadMeter label="Today" used={6} limit={7} unit="overs" guideline={`${age} guideline · 7 overs a spell`} />
          <WorkloadMeter label="This week" used={18} limit={21} unit="overs" guideline={`${age} guideline · 21 overs a week`} />
        </div>
      </Card>
      <Card title="Recent spells" pad={14}>
        <div style={{ display: 'grid' }}>
          {spells.map((s, i) => (
            <div key={s.d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, padding: '9px 0', borderTop: i ? 'var(--border-hair)' : 'none' }}>
              <span style={{ font: '500 13.5px/1 var(--font-ui)' }}>{s.t}</span>
              <span style={{ font: '400 11.5px/1 var(--font-mono)', color: 'var(--ink-3)' }}>{s.d} · {s.o}</span>
            </div>
          ))}
        </div>
      </Card>
      <Select label="Age group" options={['U13', 'U15', 'U17', 'U19', 'Open']} value={age} onChange={e => setAge(e.target.value)} hint="Sets which guideline protects you." />
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', background: 'var(--turf-tint)', border: '1px solid var(--turf-soft)', borderRadius: 'var(--radius-2)' }}>
        <Icon name="shield" size={17} color="var(--turf-deep)" style={{ marginTop: 1 }} />
        <span style={{ font: '400 12.5px/1.5 var(--font-ui)', color: 'var(--turf-deep)' }}>Workload limits are always free. Safety never sits behind a paywall.</span>
      </div>
    </div>
  );
}
