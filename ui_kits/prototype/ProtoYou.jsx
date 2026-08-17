import React from 'react';
export function ProtoYou({ app, view }) {
  const { NS } = window.SSP;
  const { Card, Badge, Button, Icon, Switch, SegmentedControl, Dialog } = NS;
  const [notif, setNotif] = React.useState(true);
  const [del, setDel] = React.useState(false);
  const u = app.user;
  if (view.v === 'sub') return (
    <div data-screen-label="S71 Subscription" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
      <window.SSP.Head title="Subscription" onBack={app.pop} right={<Badge>Free</Badge>} />
      <Card title="This month" action={<Badge tone={app.monthUsed >= 3 ? 'watch' : 'good'}>{Math.min(app.monthUsed, 3)} of 3 used</Badge>}>
        <div style={{ font: '400 13px/1.55 var(--font-ui)', color: 'var(--ink-2)' }}>Three analysed sessions a month, the full speed log and the whole workload ledger are free — the ledger stays free forever.</div>
      </Card>
      <Card title="Pro">
        <div style={{ display: 'grid', gap: 7 }}>
          {['Unlimited analysed sessions', 'Full metric breakdown per delivery', 'Retest comparisons', 'Trends and season history', 'Drill library and export'].map(f => (
            <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Icon name="check" size={14} color="var(--turf)" /><span style={{ font: '400 13px/1.4 var(--font-ui)' }}>{f}</span></div>
          ))}
        </div>
        <Button full onClick={app.openPay} style={{ marginTop: 14 }}>See plans</Button>
      </Card>
    </div>
  );
  if (view.v === 'linked') return (
    <div data-screen-label="S72 Linked accounts" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
      <window.SSP.Head title="Linked accounts" onBack={app.pop} />
      {u.u18 ? (
        <Card title="Guardian" action={<Badge tone={u.consentPending ? 'watch' : 'good'}>{u.consentPending ? 'Pending' : 'Linked'}</Badge>}>
          <div style={{ font: '400 13px/1.55 var(--font-ui)', color: 'var(--ink-2)' }}>Read-only workload access and alerts if a limit is breached. No access to your video by default. Until consent returns, sharing stays off.</div>
          {u.consentPending ? <Button variant="secondary" full style={{ marginTop: 12 }} onClick={() => app.note('Consent request re-sent.')}>Re-send request</Button> : null}
        </Card>
      ) : null}
      <Card title="Coach">
        <div style={{ font: '400 13px/1.55 var(--font-ui)', color: 'var(--ink-2)' }}>Invite a coach to see your sessions and trends. They see measurements, not billing.</div>
        <Button variant="secondary" full style={{ marginTop: 12 }} onClick={() => app.note('Coach invite link copied.')}>Invite a coach</Button>
      </Card>
    </div>
  );
  if (view.v === 'privacy') return (
    <div data-screen-label="S73 Data and privacy" style={{ padding: '10px 16px 24px', display: 'grid', gap: 12, alignContent: 'start' }}>
      <window.SSP.Head title="Data and privacy" onBack={app.pop} />
      <Card>
        <div style={{ font: '400 13px/1.6 var(--font-ui)', color: 'var(--ink-2)' }}>Your video is processed on this phone and stays on it{u.u18 ? ' — under-18 accounts keep everything on-device unless a guardian opts in' : ''}. Cloud backup only exists once you create an account, and you haven't needed one yet.</div>
      </Card>
      <Button variant="secondary" full icon="download" onClick={() => app.note('Export prepared — measurements as CSV, clips as files.')}>Export my data</Button>
      <Button variant="danger" full icon="trash-2" onClick={() => setDel(true)}>Delete everything</Button>
      <Dialog open={del} title="Delete everything?" onClose={() => setDel(false)}
        footer={<React.Fragment><Button variant="secondary" onClick={() => setDel(false)}>Keep it</Button><Button variant="danger" onClick={() => { setDel(false); app.resetAll(); }}>Delete</Button></React.Fragment>}>
        Every session, measurement and setting on this phone. There's no cloud copy to restore from.
      </Dialog>
    </div>
  );
  const Row = ({ icon, title, sub, onClick, right }) => (
    <Card pad={13} style={{ cursor: 'pointer' }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name={icon} size={17} color="var(--ink-2)" />
        <div style={{ flex: 1 }}><div style={{ font: '600 14px/1.2 var(--font-ui)' }}>{title}</div>{sub ? <div style={{ font: '400 11.5px/1.4 var(--font-ui)', color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div> : null}</div>
        {right || <Icon name="chevron-right" size={15} color="var(--ink-3)" />}
      </div>
    </Card>
  );
  return (
    <div data-screen-label="S70 Profile and settings" style={{ padding: '10px 16px 24px', display: 'grid', gap: 10, alignContent: 'start' }}>
      <div style={{ font: '700 18px/1 var(--font-display)', textTransform: 'uppercase', letterSpacing: '.02em' }}>You</div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <div>
            <div style={{ font: '600 16px/1.2 var(--font-ui)' }}>{u.arm === 'left' ? 'Left' : 'Right'}-arm {u.type.toLowerCase()}</div>
            <div style={{ font: '400 11.5px/1 var(--font-mono)', color: 'var(--ink-3)', marginTop: 5 }}>{u.ht} cm · span {u.span} cm · target {u.tgt} km/h{u.u18 ? ' · U17 account' : ''}</div>
          </div>
          <Badge tone="inverse">No account yet</Badge>
        </div>
        <div style={{ font: '400 11.5px/1.5 var(--font-ui)', color: 'var(--ink-3)', marginTop: 8 }}>Everything lives on this phone. An account is only needed for backup, sharing or a second device.</div>
      </Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px' }}>
        <span style={{ font: '500 13.5px/1 var(--font-ui)' }}>Units</span>
        <SegmentedControl size="sm" options={['km/h', 'mph']} value={u.unit} onChange={app.setUnit} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px' }}>
        <Switch label="Notifications — workload, retests, processing only" checked={notif} onChange={setNotif} />
      </div>
      <Row icon="credit-card" title="Subscription" sub={`Free · ${Math.min(app.monthUsed, 3)} of 3 analyses used this month`} onClick={() => app.push('sub')} />
      <Row icon="users" title="Linked accounts" sub={u.u18 ? (u.consentPending ? 'Guardian consent pending' : 'Guardian linked') : 'Coach and guardian access'} onClick={() => app.push('linked')} />
      <Row icon="lock" title="Data and privacy" sub="On-device by default" onClick={() => app.push('privacy')} />
      <Button variant="ghost" full onClick={app.resetAll} style={{ marginTop: 6 }}>Reset prototype</Button>
    </div>
  );
}
