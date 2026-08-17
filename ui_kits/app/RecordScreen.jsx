import React from 'react';
export function RecordScreen({ onMeasured }) {
  const { Badge, SegmentedControl } = window.SightscreenDesignSystem_9d8748;
  const [fps, setFps] = React.useState('240 fps');
  const [state, setState] = React.useState('idle');
  const [prog, setProg] = React.useState(0);
  React.useEffect(() => {
    if (state !== 'measuring') return;
    const t0 = setTimeout(() => setProg(100), 60);
    const t1 = setTimeout(onMeasured, 2400);
    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, [state]);
  return (
    <div style={{ padding: '10px 16px 24px', display: 'grid', gap: 14, alignContent: 'start' }}>
      <div style={{ font: '700 18px/1 var(--font-display)', letterSpacing: '.02em', textTransform: 'uppercase' }}>Record</div>
      <div style={{ position: 'relative', height: 470, background: 'var(--ink)', borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
        {state === 'idle' ? (
          <React.Fragment>
            <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between' }}>
              <Badge tone="good">Light: good</Badge>
              <Badge tone="neutral">{fps}</Badge>
            </div>
            <div style={{ position: 'absolute', left: 46, right: 46, top: 64, bottom: 96, border: '1.5px solid var(--chalk)', borderRadius: 2 }}></div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 96, height: 1.5, background: 'rgba(242,240,233,.45)' }}></div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 42, textAlign: 'center', font: '500 10px/1.7 var(--font-mono)', letterSpacing: '.09em', color: 'rgba(242,240,233,.8)' }}>
              KEEP THE BOWLER INSIDE THE FRAME<br />PHONE 20 M FROM THE CREASE · WAIST HEIGHT
            </div>
          </React.Fragment>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', gap: 14, justifyItems: 'center' }}>
            <div style={{ font: '600 22px/1.1 var(--font-display), sans-serif', color: 'var(--chalk)', fontFamily: 'var(--font-display)' }}>Measuring</div>
            <div style={{ font: '400 11px/1.6 var(--font-mono)', color: 'rgba(242,240,233,.75)', textAlign: 'center' }}>Tracking the ball across 31 frames.<br />Marking front-foot contact and release.</div>
            <div style={{ width: 180, height: 4, background: 'rgba(242,240,233,.22)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: prog + '%', height: '100%', background: 'var(--chalk)', transition: 'width 2.2s var(--ease-inout)' }}></div>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SegmentedControl size="sm" options={['120 fps', '240 fps']} value={fps} onChange={setFps} />
        <button type="button" aria-label="Record" disabled={state === 'measuring'} onClick={() => setState('measuring')}
          style={{ width: 64, height: 64, borderRadius: '50%', background: state === 'measuring' ? 'var(--cherry-deep)' : 'var(--cherry)', border: '4px solid var(--paper)', boxShadow: '0 0 0 1.5px var(--line-strong)', cursor: 'pointer', transition: 'background var(--dur-1) var(--ease-swift)' }}></button>
        <span style={{ font: '400 11px/1.4 var(--font-mono)', color: 'var(--ink-3)', width: 92, textAlign: 'right' }}>6-ball spell</span>
      </div>
    </div>
  );
}
