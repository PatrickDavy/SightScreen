import React from 'react';
export function ProtoCapture({ app }) {
  const { NS, beep, say } = window.SSP;
  const { Button, Badge, Select, Switch, Card, Icon, SegmentedControl } = NS;
  const [step, setStep] = React.useState('type');
  const [type, setType] = React.useState(app.captureType || 'Net session');
  const [taps, setTaps] = React.useState([]);
  const [cd, setCd] = React.useState('30 s');
  const [audio, setAudio] = React.useState(true);
  const [spoken, setSpoken] = React.useState(false);
  const [count, setCount] = React.useState(5);
  const [balls, setBalls] = React.useState([]);
  const [amber, setAmber] = React.useState(null);
  const [prog, setProg] = React.useState(0);
  const ballsRef = React.useRef(balls); ballsRef.current = balls;
  React.useEffect(() => {
    if (step !== 'count') return;
    if (count <= 0) { setStep('rec'); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000); return () => clearTimeout(t);
  }, [step, count]);
  React.useEffect(() => {
    if (step !== 'rec') return;
    const iv = setInterval(() => {
      setBalls(b => {
        const speed = Math.round((105 + Math.random() * 12) * 10) / 10;
        if (audio) beep(880);
        if (spoken) say(String(Math.round(speed)).split('').join(' '));
        return [...b, { n: b.length + 1, speed, band: Math.round((1.9 + Math.random()) * 10) / 10, conf: Math.random() < .18 ? 'low' : 'ok' }];
      });
    }, 3800);
    const a1 = setTimeout(() => { setAmber('CAN’T SEE THE BOWLER'); if (audio) beep(300); if (spoken) say('Can’t see the bowler'); }, 13000);
    const a2 = setTimeout(() => setAmber(null), 18000);
    return () => { clearInterval(iv); clearTimeout(a1); clearTimeout(a2); };
  }, [step, audio, spoken]);
  React.useEffect(() => {
    if (step !== 'proc') return;
    if (prog >= balls.length) {
      const t = setTimeout(() => {
        const sp = balls.map(b => b.speed);
        const best = Math.max(...sp), avg = Math.round(sp.reduce((a, c) => a + c, 0) / sp.length * 10) / 10;
        app.finishCapture({ id: Date.now(), label: type, date: 'Sun 17 Aug', balls: balls.length, best, band: 2.5, avg, avgBand: 1.9, frames: 24, d: balls, prev: 114.9 });
      }, 700); return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProg(p => p + 1), 550); return () => clearTimeout(t);
  }, [step, prog]);
  const Bar = ({ title, sub }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px 0' }}>
      <button type="button" onClick={app.pop} style={{ display: 'inline-flex', background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--ink-2)' }}><Icon name="x" size={18} /></button>
      <div><div style={{ font: '700 16px/1 var(--font-display)', textTransform: 'uppercase', letterSpacing: '.02em' }}>{title}</div>{sub ? <div style={{ font: '400 10.5px/1 var(--font-mono)', color: 'var(--ink-3)', marginTop: 3 }}>{sub}</div> : null}</div>
    </div>
  );
  const fastest = balls.length ? Math.max(...balls.map(b => b.speed)) : 0;
  const avg = balls.length ? Math.round(balls.map(b => b.speed).reduce((a, c) => a + c, 0) / balls.length * 10) / 10 : 0;
  if (step === 'type') return (
    <div data-screen-label="S20 Session type" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Bar title="Bowl" sub="S20 · WHAT KIND OF SPELL?" />
      <div style={{ flex: 1, display: 'grid', gap: 10, alignContent: 'start', padding: '14px 16px' }}>
        {[['Net session', 'The default. Counts toward load at net weighting.'], ['Match spell', 'Weighted heavier in your workload — match balls cost more.'], ['Drill check', 'Short, focused retest of your current drill. 6–12 balls.']].map(([t, d]) => (
          <Card key={t} pad={14} style={{ cursor: 'pointer', borderColor: type === t ? 'var(--ink)' : undefined, borderWidth: type === t ? 1.5 : 1, borderStyle: 'solid' }} onClick={() => setType(t)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <div><div style={{ font: '600 15px/1.2 var(--font-ui)' }}>{t}</div><div style={{ font: '400 12px/1.45 var(--font-ui)', color: 'var(--ink-2)', marginTop: 3 }}>{d}</div></div>
              {type === t ? <Icon name="check" size={18} /> : null}
            </div>
          </Card>
        ))}
      </div>
      <div style={{ padding: '0 16px 24px' }}><Button size="lg" full onClick={() => setStep('place')}>Continue</Button></div>
    </div>
  );
  if (step === 'place') {
    const checks = [['Landscape orientation', true, ''], ['Device level', true, ''], ['Crease and stumps visible', app.calib, 'Mark them once — remembered for this venue.'], ['Light for 240 fps', true, '']];
    const allOk = checks.every(c => c[1]);
    return (
      <div data-screen-label="S21 Placement guide" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Bar title="Place the phone" sub="S21 · CHECKS PASS AS YOU FIX THEM" />
        <div style={{ flex: 1, display: 'grid', gap: 12, alignContent: 'start', padding: '14px 16px', overflowY: 'auto' }}>
          <div style={{ position: 'relative', height: 170, background: 'var(--ink)', borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 24, right: 24, top: 20, bottom: 42, border: '1.5px solid var(--chalk)', borderRadius: 2 }}></div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 42, height: 1.5, background: 'rgba(242,240,233,.45)' }}></div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center', font: '500 9.5px/1 var(--font-mono)', letterSpacing: '.1em', color: 'rgba(242,240,233,.8)' }}>LIVE PREVIEW</div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {checks.map(([t, ok, fix]) => (
              <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--paper)', border: 'var(--border-hair)', borderRadius: 'var(--radius-1)' }}>
                <Icon name={ok ? 'circle-check' : 'circle-alert'} size={17} color={ok ? 'var(--turf)' : 'var(--amber)'} style={{ marginTop: 1 }} />
                <div style={{ flex: 1 }}><div style={{ font: '500 13.5px/1.3 var(--font-ui)' }}>{t}</div>{!ok && fix ? <div style={{ font: '400 12px/1.45 var(--font-ui)', color: 'var(--ink-2)', marginTop: 2 }}>{fix}</div> : null}</div>
              </div>
            ))}
          </div>
          {!allOk ? <div style={{ font: '400 12px/1.5 var(--font-ui)', color: 'var(--ink-3)' }}>You can continue anyway — affected deliveries get marked low-confidence rather than hidden.</div> : null}
        </div>
        <div style={{ display: 'grid', gap: 8, padding: '0 16px 24px' }}>
          {app.calib ? <Button size="lg" full onClick={() => setStep('ready')}>Continue</Button> : <Button size="lg" full onClick={() => setStep('calib')}>Mark crease and stumps</Button>}
          {!app.calib ? <Button variant="ghost" full onClick={() => setStep('ready')}>Continue anyway</Button> : null}
        </div>
      </div>
    );
  }
  if (step === 'calib') return (
    <div data-screen-label="S22 Framing and calibration" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Bar title="Calibrate" sub="S22 · TAP THE CREASE, THEN THE STUMPS" />
      <div style={{ flex: 1, padding: '14px 16px', display: 'grid', gap: 12, alignContent: 'start' }}>
        <div onClick={e => { if (taps.length >= 2) return; const r = e.currentTarget.getBoundingClientRect(); setTaps(t => [...t, { x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 }]); }}
          style={{ position: 'relative', height: 300, background: 'var(--ink)', borderRadius: 'var(--radius-2)', overflow: 'hidden', cursor: 'crosshair' }}>
          {taps[0] ? <div style={{ position: 'absolute', left: 0, right: 0, top: taps[0].y + '%', height: 2, background: 'var(--cherry)' }}></div> : null}
          {taps[1] ? <div style={{ position: 'absolute', left: `calc(${taps[1].x}% - 5px)`, top: `calc(${taps[1].y}% - 5px)`, width: 10, height: 10, borderRadius: '50%', background: 'var(--cherry)', border: '2px solid var(--chalk)' }}></div> : null}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 12, textAlign: 'center', font: '500 10px/1.6 var(--font-mono)', letterSpacing: '.09em', color: 'rgba(242,240,233,.85)' }}>
            {taps.length === 0 ? 'TAP THE POPPING CREASE LINE' : taps.length === 1 ? 'NOW TAP THE BASE OF THE STUMPS' : 'PITCH GEOMETRY LOCKED · 22 YD · 1.22 M CREASE'}
          </div>
        </div>
        <div style={{ font: '400 12px/1.5 var(--font-ui)', color: 'var(--ink-2)' }}>Known pitch geometry calibrates run-up and ball speed. Remembered for this venue — next time you skip this step.</div>
      </div>
      <div style={{ padding: '0 16px 24px' }}><Button size="lg" full disabled={taps.length < 2} onClick={() => { app.setCalib(true); setStep('ready'); }}>Continue</Button></div>
    </div>
  );
  if (step === 'ready') return (
    <div data-screen-label="S23 Ready" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Bar title="Ready" sub="S23 · THE LAST TOUCH OF THE SESSION" />
      <div style={{ flex: 1, display: 'grid', gap: 14, alignContent: 'start', padding: '14px 16px' }}>
        <div style={{ font: '400 14px/1.55 var(--font-ui)', color: 'var(--ink-2)' }}>Arm it, walk to your mark, bowl. The screen stays readable from 20 m; a tone confirms each delivery. Tap the screen when you're done.</div>
        <Select label="Countdown" options={['15 s', '30 s', '60 s']} value={cd} onChange={e => setCd(e.target.value)} />
        <Switch label="Audio confirmation per delivery" checked={audio} onChange={setAudio} />
        <Switch label="Speak the speed aloud" checked={spoken} onChange={setSpoken} />
        <div style={{ font: '500 12px/1.5 var(--font-mono)', color: 'var(--ink-3)' }}>Room for about 45 deliveries at 62% battery. Recording warms the phone up; that's normal.</div>
      </div>
      <div style={{ padding: '0 16px 24px' }}><Button size="lg" full icon="video" onClick={() => { setCount(5); setStep('count'); }}>Arm and walk away</Button></div>
    </div>
  );
  if (step === 'count') return (
    <div data-screen-label="S24 Countdown" onClick={() => setStep('rec')} style={{ height: '100%', display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 10, background: 'var(--ink)', cursor: 'pointer' }}>
      <div style={{ font: '700 170px/1 var(--font-display)', color: 'var(--chalk)' }}>{count}</div>
      <div style={{ font: '500 11px/1.6 var(--font-mono)', letterSpacing: '.1em', color: 'rgba(242,240,233,.7)', textAlign: 'center' }}>WALK TO YOUR MARK<br />({cd} SET · SHORTENED IN PROTOTYPE)</div>
    </div>
  );
  if (step === 'rec') return (
    <div data-screen-label="S24 Recording" onClick={() => setStep('ended')} style={{ height: '100%', display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 6, background: amber ? 'var(--amber)' : 'var(--turf)', cursor: 'pointer', transition: 'background var(--dur-2) var(--ease-swift)' }}>
      {amber ? (
        <React.Fragment>
          <div style={{ font: '700 44px/1.05 var(--font-display)', color: '#FFF', textAlign: 'center', maxWidth: 300 }}>{amber}</div>
          <div style={{ font: '500 12px/1.7 var(--font-mono)', color: 'rgba(255,255,255,.85)', textAlign: 'center', marginTop: 8 }}>SAID ALOUD TOO — A SILENT FAILURE<br />COSTS YOU THE SPELL. RESUMES ITSELF.</div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ font: '600 13px/1 var(--font-mono)', letterSpacing: '.14em', color: 'rgba(255,255,255,.85)' }}>RECORDING</div>
          <div style={{ font: '700 190px/1 var(--font-display)', color: '#FFF', fontVariantNumeric: 'tabular-nums' }}>{balls.length}</div>
          <div style={{ font: '600 13px/1 var(--font-mono)', letterSpacing: '.14em', color: 'rgba(255,255,255,.85)' }}>DELIVERIES</div>
          <div style={{ font: '500 10.5px/1 var(--font-mono)', letterSpacing: '.1em', color: 'rgba(255,255,255,.65)', marginTop: 26 }}>TAP ANYWHERE TO END</div>
        </React.Fragment>
      )}
    </div>
  );
  if (step === 'ended') return (
    <div data-screen-label="S25 Session ended" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Bar title="Session ended" sub={`S25 · ${type.toUpperCase()}`} />
      <div style={{ flex: 1, display: 'grid', gap: 14, alignContent: 'start', padding: '14px 16px' }}>
        {balls.length ? (
          <Card>
            <NS.Metric label="Deliveries" value={balls.length} size="md" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 26px', marginTop: 14, paddingTop: 14, borderTop: 'var(--border-hair)' }}>
              <NS.Metric label="Fastest" value={fastest} unit="km/h" band={2.5} size="sm" />
              <NS.Metric label="Average" value={avg} unit="km/h" band={1.9} size="sm" />
            </div>
          </Card>
        ) : (
          <Card><div style={{ font: '400 13.5px/1.55 var(--font-ui)', color: 'var(--ink-2)' }}>No deliveries detected. Most likely a framing or angle problem — the placement checks will catch it next time. Nothing was counted against your workload.</div></Card>
        )}
        {balls.length ? <div style={{ font: '400 12px/1.5 var(--font-mono)', color: 'var(--ink-3)' }}>Added to workload: {Math.round(balls.length / 6 * 10) / 10} overs · {type === 'Match spell' ? 'match' : 'net'} weighting</div> : null}
      </div>
      <div style={{ display: 'grid', gap: 8, padding: '0 16px 24px' }}>
        {balls.length ? <Button size="lg" full onClick={() => { setProg(0); setStep('proc'); }}>Process session</Button> : <Button size="lg" full onClick={() => setStep('ready')}>Try again</Button>}
        <Button variant="ghost" full onClick={app.pop}>Close</Button>
      </div>
    </div>
  );
  return (
    <div data-screen-label="S26 Processing" style={{ height: '100%', display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 16, background: 'var(--ink)', padding: 24 }}>
      <div style={{ font: '600 26px/1.1 var(--font-display)', color: 'var(--chalk)' }}>Processing</div>
      <div style={{ font: '500 13px/1 var(--font-mono)', color: 'rgba(242,240,233,.8)' }}>Delivery {Math.min(prog + 1, balls.length)} of {balls.length}</div>
      <div style={{ width: 200, height: 4, background: 'rgba(242,240,233,.22)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: (balls.length ? (prog / balls.length) * 100 : 0) + '%', height: '100%', background: 'var(--chalk)', transition: 'width .5s var(--ease-inout)' }}></div>
      </div>
      <div style={{ font: '400 11px/1.7 var(--font-mono)', color: 'rgba(242,240,233,.6)', textAlign: 'center' }}>ON-DEVICE · WORKS IN AEROPLANE MODE<br />THIS WARMS THE PHONE UP — IT'S NORMAL<br />YOU CAN LEAVE; WE'LL NOTIFY WHEN DONE</div>
    </div>
  );
}
