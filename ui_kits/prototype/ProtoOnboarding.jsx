import React from 'react';
export function ProtoOnboarding({ onDone, note }) {
  const { NS } = window.SSP;
  const { Button, Input, Select, Radio, Tag, Icon } = NS;
  const [step, setStep] = React.useState(0);
  const [yob, setYob] = React.useState('2009');
  const [gmail, setGmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [arm, setArm] = React.useState('right');
  const [type, setType] = React.useState('Pace');
  const [ht, setHt] = React.useState('178');
  const [span, setSpan] = React.useState('183');
  const [tgt, setTgt] = React.useState('120');
  const [fix, setFix] = React.useState('More pace');
  const u18 = +yob > 2008;
  const years = Array.from({ length: 40 }, (_, i) => String(2016 - i));
  const finish = first => onDone({ u18, yob, arm, type, ht, span, tgt, fix, unit: 'km/h', consentPending: u18 }, first);
  const next = () => setStep(s => (s === 1 && !u18 ? 3 : s + 1));
  const Frame = ({ label, title, sub, children, cta, onCta, ghost, onGhost, disabled }) => (
    <div data-screen-label={label} style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '14px 20px 28px' }}>
      <div style={{ font: '500 10px/1 var(--font-mono)', letterSpacing: '.1em', color: 'var(--ink-3)' }}>{label}</div>
      <div style={{ font: '600 30px/1.08 var(--font-display)', marginTop: 14 }}>{title}</div>
      {sub ? <div style={{ font: '400 13.5px/1.5 var(--font-ui)', color: 'var(--ink-2)', marginTop: 8 }}>{sub}</div> : null}
      <div style={{ flex: 1, display: 'grid', gap: 14, alignContent: 'start', marginTop: 18, overflowY: 'auto' }}>{children}</div>
      <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
        {cta ? <Button size="lg" full onClick={onCta} disabled={disabled}>{cta}</Button> : null}
        {ghost ? <Button variant="ghost" full onClick={onGhost}>{ghost}</Button> : null}
      </div>
    </div>
  );
  if (step === 0) return (
    <div data-screen-label="S01 Welcome" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '14px 20px 28px' }}>
      <div style={{ flex: 1, display: 'grid', alignContent: 'center', gap: 16 }}>
        <div style={{ font: '700 34px/1 var(--font-display)', textTransform: 'uppercase', letterSpacing: '.015em' }}>Sightscreen</div>
        <div style={{ font: '600 26px/1.15 var(--font-display)' }}>One phone video. One thing to change. Bowl quicker.</div>
        <div style={{ font: '400 14px/1.55 var(--font-ui)', color: 'var(--ink-2)' }}>Sightscreen measures your action from a single clip — speed with its error band, the one biggest opportunity in your action, and the workload limits that protect your back. No account needed for your first session.</div>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <Button size="lg" full onClick={() => setStep(1)}>Get started</Button>
        <Button variant="ghost" full onClick={() => note('Sign-in comes later — your first session runs without an account.')}>I already have an account</Button>
      </div>
    </div>
  );
  if (step === 1) return (
    <Frame label="S02 Age gate" title="When were you born?" sub="So we can set safe bowling limits — they change with age." cta="Continue" onCta={next}>
      <Select label="Year of birth" options={years} value={yob} onChange={e => setYob(e.target.value)} hint={u18 ? 'Under-18: workload comes first and a guardian is looped in.' : 'Adult guidelines apply.'} />
    </Frame>
  );
  if (step === 2) return (
    <Frame label="S03 Guardian consent" title="A guardian signs off" sub="They get an email and consent on their own device. Until then: recording and workload work, sharing doesn't."
      cta={sent ? 'Continue' : 'Send consent request'} onCta={() => { if (sent) next(); else { setSent(true); note('Consent request sent. The app keeps working meanwhile.'); } }}
      ghost="Do this later" onGhost={next} disabled={!sent && !gmail.includes('@')}>
      <Input label="Guardian email" placeholder="name@example.com" value={gmail} onChange={e => setGmail(e.target.value)} icon="mail" />
      {sent ? <div style={{ font: '500 12px/1.5 var(--font-mono)', color: 'var(--turf-deep)' }}>Sent. Status: pending — read-only workload access for your guardian, alerts on limit breaches, no access to your video by default.</div> : null}
    </Frame>
  );
  if (step === 3) return (
    <Frame label="S04 Bowler profile" title="Your action, on paper" cta="Continue" onCta={next}>
      <div style={{ display: 'flex', gap: 16 }}>
        <Radio name="arm" value="right" label="Right arm" checked={arm === 'right'} onChange={setArm} />
        <Radio name="arm" value="left" label="Left arm" checked={arm === 'left'} onChange={setArm} />
      </div>
      <Select label="Bowling type" options={['Pace', 'Fast-medium', 'Medium', 'Spin']} value={type} onChange={e => setType(e.target.value)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Height" suffix="cm" inputMode="numeric" value={ht} onChange={e => setHt(e.target.value)} />
        <Input label="Arm span" suffix="cm" inputMode="numeric" value={span} onChange={e => setSpan(e.target.value)} />
      </div>
      <div style={{ font: '400 12px/1.55 var(--font-ui)', color: 'var(--ink-3)' }}>Why arm span: it correlates strongly with release speed and it can't be changed. Better you know what's levers and what's given, from minute one.</div>
    </Frame>
  );
  if (step === 4) return (
    <Frame label="S05 Goals" title="Where are you headed?" sub="Optional — it frames your first insight." cta="Continue" onCta={next} ghost="Skip" onGhost={next}>
      <Input label="Target speed" suffix="km/h" inputMode="numeric" value={tgt} onChange={e => setTgt(e.target.value)} />
      <div>
        <div style={{ font: '600 12px/1 var(--font-ui)', letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 8 }}>What do you want to fix?</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['More pace', 'Smoother action', 'Stay injury-free'].map(f => <Tag key={f} selected={fix === f} onClick={() => setFix(f)}>{f}</Tag>)}
        </div>
      </div>
    </Frame>
  );
  if (step === 5) return (
    <Frame label="S06 Permissions" title="We'll ask when it matters" sub="Each permission is requested at the moment it's needed, not now." cta="Continue" onCta={next}>
      {[['camera', 'Camera', 'Asked right before your first recording.'], ['hard-drive', 'Storage', '240 fps clips are big; kept on this phone.'], ['bell', 'Notifications', 'Only workload alerts, retest prompts and “processing done”. Nothing else — asked after your first session.']].map(([ic, t, d]) => (
        <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', background: 'var(--paper)', border: 'var(--border-hair)', borderRadius: 'var(--radius-2)' }}>
          <Icon name={ic} size={18} color="var(--ink-2)" style={{ marginTop: 1 }} />
          <div><div style={{ font: '600 14px/1.2 var(--font-ui)' }}>{t}</div><div style={{ font: '400 12.5px/1.5 var(--font-ui)', color: 'var(--ink-2)', marginTop: 3 }}>{d}</div></div>
        </div>
      ))}
    </Frame>
  );
  return (
    <Frame label="S07 Setup tutorial" title="Stand the phone here" cta="Bowl your first session" onCta={() => finish(true)} ghost="Go to home" onGhost={() => finish(false)}>
      <div style={{ position: 'relative', height: 210, background: 'var(--ink)', borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 26, right: 26, top: 24, bottom: 56, border: '1.5px solid var(--chalk)', borderRadius: 2 }}></div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, height: 1.5, background: 'rgba(242,240,233,.45)' }}></div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, textAlign: 'center', font: '500 9.5px/1.8 var(--font-mono)', letterSpacing: '.09em', color: 'rgba(242,240,233,.8)' }}>SIDE-ON · LEVEL WITH THE POPPING CREASE<br />8–10 M FROM THE PITCH · TRIPOD AT HIP HEIGHT</div>
      </div>
      <div style={{ font: '400 13px/1.6 var(--font-ui)', color: 'var(--ink-2)' }}>Landscape, side-on, crease and stumps both in frame. The app checks all of this live before you bowl — you can't silently get it wrong.</div>
    </Frame>
  );
}
