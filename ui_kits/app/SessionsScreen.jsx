import React from 'react';
export function SessionsScreen({ sessions, pb, onOpen, onRecord }) {
  const { Button, Card, Badge, Metric, Icon, IconButton } = window.SightscreenDesignSystem_9d8748;
  return (
    <div style={{ padding: '10px 16px 24px', display: 'grid', gap: 14, alignContent: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ font: '700 18px/1 var(--font-display)', letterSpacing: '.02em', textTransform: 'uppercase' }}>Sightscreen</div>
        <IconButton name="settings" label="Settings" size="sm" />
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <Metric label="Personal best" value={pb.best} unit="km/h" band={pb.band} sample={pb.date} size="lg" />
          <Badge tone="inverse">PB</Badge>
        </div>
      </Card>
      <Button size="lg" icon="video" full onClick={onRecord}>Record a spell</Button>
      <div style={{ font: '700 11px/1 var(--font-ui)', letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', color: 'var(--ink-2)', marginTop: 4 }}>Recent sessions</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {sessions.map(s => (
          <Card key={s.id} pad={14} style={{ cursor: 'pointer' }} onClick={() => onOpen(s)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{ font: '600 15px/1.2 var(--font-ui)' }}>{s.label}</div>
                <div style={{ font: '400 11.5px/1 var(--font-mono)', color: 'var(--ink-3)', marginTop: 5 }}>{s.date} · {s.balls} balls</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ font: '700 22px/1 var(--font-display)', fontVariantNumeric: 'tabular-nums' }}>{s.best}</div>
                  <div style={{ font: '400 10.5px/1 var(--font-mono)', color: 'var(--ink-3)', marginTop: 3 }}>±{s.band} km/h</div>
                </div>
                <Icon name="chevron-right" size={16} color="var(--ink-3)" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
