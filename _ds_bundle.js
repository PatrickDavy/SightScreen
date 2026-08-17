/* @ds-bundle: {"format":4,"namespace":"SightscreenDesignSystem_9d8748","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"CueCard","sourcePath":"components/data/CueCard.jsx"},{"name":"Metric","sourcePath":"components/data/Metric.jsx"},{"name":"WorkloadMeter","sourcePath":"components/data/WorkloadMeter.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"SegmentedControl","sourcePath":"components/navigation/SegmentedControl.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"RecordScreen","sourcePath":"ui_kits/app/RecordScreen.jsx"},{"name":"ResultScreen","sourcePath":"ui_kits/app/ResultScreen.jsx"},{"name":"SessionsScreen","sourcePath":"ui_kits/app/SessionsScreen.jsx"},{"name":"WorkloadScreen","sourcePath":"ui_kits/app/WorkloadScreen.jsx"},{"name":"ProtoCapture","sourcePath":"ui_kits/prototype/ProtoCapture.jsx"},{"name":"ProtoHome","sourcePath":"ui_kits/prototype/ProtoHome.jsx"},{"name":"ProtoImprove","sourcePath":"ui_kits/prototype/ProtoImprove.jsx"},{"name":"ProtoLoad","sourcePath":"ui_kits/prototype/ProtoLoad.jsx"},{"name":"ProtoOnboarding","sourcePath":"ui_kits/prototype/ProtoOnboarding.jsx"},{"name":"ProtoReview","sourcePath":"ui_kits/prototype/ProtoReview.jsx"},{"name":"ProtoYou","sourcePath":"ui_kits/prototype/ProtoYou.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"c3eb0d4865c8","components/core/Button.jsx":"734798dfccd2","components/core/Card.jsx":"88fdcdb18ac8","components/core/Icon.jsx":"32b373f16f6c","components/core/IconButton.jsx":"7f1fcfe6b19b","components/core/Tag.jsx":"ddc5a40f177a","components/data/CueCard.jsx":"24b09707d012","components/data/Metric.jsx":"6a81ebb54cc6","components/data/WorkloadMeter.jsx":"faf7082038c4","components/feedback/Dialog.jsx":"1d4dae4d926f","components/feedback/Toast.jsx":"b96be2d29798","components/feedback/Tooltip.jsx":"af463a481b87","components/forms/Checkbox.jsx":"70900d10c8ee","components/forms/Input.jsx":"814074e78974","components/forms/Radio.jsx":"2b591b77ef95","components/forms/Select.jsx":"d5c66fc1b2b1","components/forms/Switch.jsx":"d0c790167f72","components/navigation/SegmentedControl.jsx":"eec779df68d3","components/navigation/Tabs.jsx":"f626ee642772","handover/doc-page.js":"371bab66f42d","ui_kits/app/RecordScreen.jsx":"0a71bdd6091b","ui_kits/app/ResultScreen.jsx":"7e2667c13fee","ui_kits/app/SessionsScreen.jsx":"ced0474936e4","ui_kits/app/WorkloadScreen.jsx":"7f6089a091da","ui_kits/prototype/ProtoCapture.jsx":"a7c5c42564ab","ui_kits/prototype/ProtoHome.jsx":"9389d63ee04d","ui_kits/prototype/ProtoImprove.jsx":"120d2ae2e4d9","ui_kits/prototype/ProtoLoad.jsx":"06a77c3e5f66","ui_kits/prototype/ProtoOnboarding.jsx":"ce42cf0edcfc","ui_kits/prototype/ProtoReview.jsx":"7be92d234f4e","ui_kits/prototype/ProtoYou.jsx":"afcde69da493"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SightscreenDesignSystem_9d8748 = window.SightscreenDesignSystem_9d8748 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = 'neutral',
  children,
  style
}) {
  const t = {
    neutral: {
      bg: 'var(--chalk)',
      c: 'var(--ink-2)',
      bc: 'var(--line-strong)'
    },
    good: {
      bg: 'var(--good-bg)',
      c: 'var(--turf-deep)',
      bc: 'var(--turf-soft)'
    },
    watch: {
      bg: 'var(--watch-bg)',
      c: 'var(--amber-deep)',
      bc: 'var(--amber-soft)'
    },
    over: {
      bg: 'var(--over-bg)',
      c: 'var(--cherry-deep)',
      bc: 'var(--cherry-soft)'
    },
    inverse: {
      bg: 'var(--ink)',
      c: 'var(--chalk)',
      bc: 'var(--ink)'
    }
  }[tone] || {
    bg: 'var(--chalk)',
    c: 'var(--ink-2)',
    bc: 'var(--line-strong)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 20,
      padding: '0 7px',
      fontFamily: 'var(--font-ui)',
      fontWeight: 700,
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--track-caps)',
      textTransform: 'uppercase',
      lineHeight: 1,
      color: t.c,
      background: t.bg,
      border: `1px solid ${t.bc}`,
      borderRadius: 'var(--radius-1)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  title,
  action,
  raised,
  pad = 16,
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-hair)',
      borderRadius: 'var(--radius-2)',
      boxShadow: raised ? 'var(--shadow-1)' : 'none',
      padding: pad,
      ...style
    }
  }), title || action ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 'var(--text-md)',
      lineHeight: 1.3
    }
  }, title), action || null) : null, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function Icon({
  name,
  size = 18,
  strokeWidth = 2,
  color,
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = `<i data-lucide="${name}"></i>`;
    if (window.lucide) {
      window.lucide.createIcons();
      const svg = el.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('stroke-width', strokeWidth);
        svg.style.display = 'block';
      }
    }
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flex: 'none',
      color,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const btnSizes = {
  sm: {
    h: 32,
    fs: 13,
    px: 12,
    ic: 15
  },
  md: {
    h: 40,
    fs: 15,
    px: 16,
    ic: 17
  },
  lg: {
    h: 48,
    fs: 16,
    px: 20,
    ic: 18
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  full,
  style,
  children,
  ...rest
}) {
  const [st, setSt] = React.useState({
    h: 0,
    p: 0,
    f: 0
  });
  const s = btnSizes[size] || btnSizes.md;
  const looks = {
    primary: {
      bg: st.p ? 'var(--ink-deep)' : st.h ? '#000000' : 'var(--ink)',
      c: 'var(--chalk)',
      bc: 'transparent'
    },
    secondary: {
      bg: st.p ? 'var(--line)' : st.h ? 'var(--chalk)' : 'var(--paper)',
      c: 'var(--ink)',
      bc: 'var(--ink)'
    },
    ghost: {
      bg: st.h || st.p ? 'rgba(28,27,23,.08)' : 'transparent',
      c: 'var(--ink)',
      bc: 'transparent'
    },
    danger: {
      bg: st.p ? '#701A0F' : st.h ? 'var(--cherry-deep)' : 'var(--cherry)',
      c: '#FFFFFF',
      bc: 'transparent'
    }
  };
  const l = looks[variant] || looks.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled
  }, rest, {
    onMouseEnter: () => setSt(v => ({
      ...v,
      h: 1
    })),
    onMouseLeave: () => setSt(v => ({
      ...v,
      h: 0,
      p: 0
    })),
    onMouseDown: () => setSt(v => ({
      ...v,
      p: 1
    })),
    onMouseUp: () => setSt(v => ({
      ...v,
      p: 0
    })),
    onFocus: () => setSt(v => ({
      ...v,
      f: 1
    })),
    onBlur: () => setSt(v => ({
      ...v,
      f: 0
    })),
    style: {
      display: full ? 'flex' : 'inline-flex',
      width: full ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: `0 ${s.px}px`,
      fontFamily: 'var(--font-ui)',
      fontWeight: 600,
      fontSize: s.fs,
      lineHeight: 1,
      color: disabled ? 'var(--ink-3)' : l.c,
      background: disabled ? 'var(--line)' : l.bg,
      border: `1.5px solid ${disabled ? 'transparent' : l.bc}`,
      borderRadius: 'var(--radius-1)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      transform: st.p && !disabled ? 'translateY(1px)' : 'none',
      transition: 'background var(--dur-1) var(--ease-swift), color var(--dur-1) var(--ease-swift)',
      boxShadow: st.f ? 'var(--focus-ring)' : 'none',
      outline: 'none',
      ...style
    }
  }), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.ic
  }) : null, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ibSizes = {
  sm: {
    d: 28,
    ic: 15
  },
  md: {
    d: 36,
    ic: 18
  },
  lg: {
    d: 44,
    ic: 20
  }
};
function IconButton({
  name,
  label,
  variant = 'ghost',
  size = 'md',
  disabled,
  style,
  ...rest
}) {
  const [st, setSt] = React.useState({
    h: 0,
    p: 0,
    f: 0
  });
  const s = ibSizes[size] || ibSizes.md;
  const looks = {
    ghost: {
      bg: st.h || st.p ? 'rgba(28,27,23,.08)' : 'transparent',
      c: 'var(--ink)',
      bc: 'transparent'
    },
    primary: {
      bg: st.p ? 'var(--ink-deep)' : st.h ? '#000000' : 'var(--ink)',
      c: 'var(--chalk)',
      bc: 'transparent'
    },
    secondary: {
      bg: st.p ? 'var(--line)' : st.h ? 'var(--chalk)' : 'var(--paper)',
      c: 'var(--ink)',
      bc: 'var(--ink)'
    }
  };
  const l = looks[variant] || looks.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled
  }, rest, {
    onMouseEnter: () => setSt(v => ({
      ...v,
      h: 1
    })),
    onMouseLeave: () => setSt(v => ({
      ...v,
      h: 0,
      p: 0
    })),
    onMouseDown: () => setSt(v => ({
      ...v,
      p: 1
    })),
    onMouseUp: () => setSt(v => ({
      ...v,
      p: 0
    })),
    onFocus: () => setSt(v => ({
      ...v,
      f: 1
    })),
    onBlur: () => setSt(v => ({
      ...v,
      f: 0
    })),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: s.d,
      height: s.d,
      flex: 'none',
      color: disabled ? 'var(--ink-3)' : l.c,
      background: disabled ? 'var(--line)' : l.bg,
      border: `1.5px solid ${disabled ? 'transparent' : l.bc}`,
      borderRadius: 'var(--radius-1)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transform: st.p && !disabled ? 'translateY(1px)' : 'none',
      transition: 'background var(--dur-1) var(--ease-swift)',
      boxShadow: st.f ? 'var(--focus-ring)' : 'none',
      outline: 'none',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: s.ic
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  selected,
  onRemove,
  style,
  children,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button"
  }, rest, {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 28,
      padding: '0 12px',
      fontFamily: 'var(--font-ui)',
      fontWeight: 500,
      fontSize: 'var(--text-sm)',
      lineHeight: 1,
      color: selected ? 'var(--chalk)' : 'var(--ink)',
      background: selected ? 'var(--ink)' : h ? 'var(--chalk)' : 'var(--paper)',
      border: `1px solid ${selected ? 'var(--ink)' : 'var(--line-strong)'}`,
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      transition: 'background var(--dur-1) var(--ease-swift)',
      ...style
    }
  }), children, onRemove ? /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'inline-flex',
      marginRight: -4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 13
  })) : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/CueCard.jsx
try { (() => {
function CueCard({
  eyebrow = 'The one thing',
  cue,
  gain,
  detail,
  actionLabel,
  onAction,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--text-inverse)',
      borderRadius: 'var(--radius-2)',
      padding: '20px 20px 18px',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 'var(--text-2xs)',
      fontWeight: 700,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--cherry-soft)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "target",
    size: 13,
    strokeWidth: 2.5
  }), eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--text-2xl)',
      lineHeight: 1.08,
      marginTop: 10
    }
  }, cue), gain ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--turf-soft)',
      marginTop: 6
    }
  }, gain) : null, detail ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      lineHeight: 1.5,
      color: 'var(--text-inverse-muted)',
      marginTop: 10
    }
  }, detail) : null, actionLabel ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 16,
      height: 36,
      padding: '0 14px',
      background: h ? 'rgba(242,240,233,.14)' : 'transparent',
      color: 'var(--chalk)',
      border: '1.5px solid var(--chalk)',
      borderRadius: 'var(--radius-1)',
      fontFamily: 'var(--font-ui)',
      fontWeight: 600,
      fontSize: 'var(--text-sm)',
      lineHeight: 1,
      cursor: 'pointer',
      transition: 'background var(--dur-1) var(--ease-swift)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "play",
    size: 15
  }), actionLabel) : null);
}
Object.assign(__ds_scope, { CueCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/CueCard.jsx", error: String((e && e.message) || e) }); }

// components/data/Metric.jsx
try { (() => {
const mSizes = {
  sm: {
    v: 26,
    u: 12
  },
  md: {
    v: 40,
    u: 14
  },
  lg: {
    v: 64,
    u: 17
  }
};
function Metric({
  label,
  value,
  unit,
  band,
  sample,
  size = 'md',
  range,
  tone,
  style
}) {
  const s = mSizes[size] || mSizes.md;
  const num = typeof value === 'number' ? value : parseFloat(value);
  let bar = null;
  if (range && isFinite(num)) {
    const {
      min = 0,
      max = 100,
      good
    } = range;
    const pct = x => Math.max(0, Math.min(100, (x - min) / (max - min) * 100));
    const b = typeof band === 'number' ? band : parseFloat(band) || 0;
    bar = /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 6,
        background: 'var(--band-track)',
        borderRadius: 3,
        marginTop: 10
      }
    }, good ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: pct(good[0]) + '%',
        width: pct(good[1]) - pct(good[0]) + '%',
        background: 'var(--turf-soft)',
        opacity: .55,
        borderRadius: 3
      }
    }) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: pct(num - b) + '%',
        width: Math.max(pct(num + b) - pct(num - b), 1.5) + '%',
        background: 'var(--band-fill)',
        borderRadius: 3
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -3,
        bottom: -3,
        left: `calc(${pct(num)}% - 1px)`,
        width: 2,
        background: tone || 'var(--cherry)'
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      minWidth: 0,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 700,
      letterSpacing: 'var(--track-caps)',
      textTransform: 'uppercase',
      color: 'var(--ink-2)',
      marginBottom: 4
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: s.v,
      lineHeight: 'var(--leading-tight)',
      color: tone || 'var(--ink)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '.01em'
    }
  }, value), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: s.u,
      fontWeight: 500,
      color: 'var(--ink-2)'
    }
  }, unit) : null), band != null || sample ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, band != null ? `±${band}` : '', band != null && unit ? ` ${unit}` : '', band != null && sample ? ' · ' : '', sample || '') : null, bar);
}
Object.assign(__ds_scope, { Metric });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Metric.jsx", error: String((e && e.message) || e) }); }

// components/data/WorkloadMeter.jsx
try { (() => {
function WorkloadMeter({
  label = 'This week',
  used = 0,
  limit = 1,
  unit = 'overs',
  guideline,
  style
}) {
  const ratio = limit > 0 ? used / limit : 0;
  const tone = ratio >= 1 ? 'over' : ratio >= .8 ? 'watch' : 'good';
  const fill = {
    good: 'var(--turf)',
    watch: 'var(--amber)',
    over: 'var(--cherry)'
  }[tone];
  const word = {
    good: 'Within limit',
    watch: 'Near limit',
    over: 'Over limit'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 600
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, used), " / ", limit, " ", unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 16,
      background: 'var(--paper)',
      border: 'var(--border-strong)',
      borderRadius: 'var(--radius-1)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: Math.min(ratio, 1) * 100 + '%',
      background: fill,
      transition: 'width var(--dur-3) var(--ease-swift)'
    }
  }), [25, 50, 75].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: t + '%',
      width: 1,
      background: 'rgba(28,27,23,.22)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--ink-3)'
    }
  }, guideline || ''), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: tone
  }, word)));
}
Object.assign(__ds_scope, { WorkloadMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/WorkloadMeter.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  onClose,
  footer,
  width = 440,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: width,
      background: 'var(--paper)',
      borderRadius: 'var(--radius-2)',
      boxShadow: 'var(--shadow-2)',
      padding: 20,
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 700,
      lineHeight: 1.25
    }
  }, title), onClose ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    name: "x",
    label: "Close",
    size: "sm",
    onClick: onClose,
    style: {
      margin: '-4px -6px 0 0'
    }
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-md)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--ink-2)'
    }
  }, children), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 20
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = 'neutral',
  children,
  onDismiss,
  style
}) {
  const t = {
    neutral: {
      icon: 'info',
      c: 'var(--chalk)'
    },
    good: {
      icon: 'circle-check',
      c: 'var(--turf-soft)'
    },
    watch: {
      icon: 'triangle-alert',
      c: 'var(--amber-soft)'
    },
    over: {
      icon: 'octagon-alert',
      c: 'var(--cherry-soft)'
    }
  }[tone] || {
    icon: 'info',
    c: 'var(--chalk)'
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      maxWidth: 420,
      padding: '10px 12px 10px 14px',
      background: 'var(--ink)',
      color: 'var(--chalk)',
      borderRadius: 'var(--radius-1)',
      boxShadow: 'var(--shadow-2)',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      lineHeight: 1.4,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 17,
    color: t.c
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, children), onDismiss ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Dismiss",
    onClick: onDismiss,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      flex: 'none',
      background: 'transparent',
      border: 'none',
      color: 'var(--text-inverse-muted)',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })) : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  children,
  style
}) {
  const [v, setV] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setV(true),
    onMouseLeave: () => setV(false),
    onFocus: () => setV(true),
    onBlur: () => setV(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 7px)',
      left: '50%',
      transform: `translateX(-50%) translateY(${v ? 0 : 3}px)`,
      background: 'var(--ink)',
      color: 'var(--chalk)',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      lineHeight: 1.35,
      padding: '5px 9px',
      borderRadius: 'var(--radius-1)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      opacity: v ? 1 : 0,
      transition: 'opacity var(--dur-1) var(--ease-swift), transform var(--dur-1) var(--ease-swift)',
      zIndex: 50
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 18,
      height: 18,
      flex: 'none',
      marginTop: 1,
      background: checked ? 'var(--ink)' : 'var(--paper)',
      border: `1.5px solid ${checked ? 'var(--ink)' : h ? 'var(--ink)' : 'var(--line-strong)'}`,
      borderRadius: 3,
      color: 'var(--chalk)',
      transition: 'background var(--dur-1) var(--ease-swift), border-color var(--dur-1) var(--ease-swift)'
    }
  }, checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 12,
    strokeWidth: 3.5
  }) : null), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-md)',
      lineHeight: 1.35
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  icon,
  suffix,
  style,
  inputStyle,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  const bc = error ? 'var(--cherry)' : f ? 'var(--ink)' : 'var(--line-strong)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      minWidth: 0,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 6,
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      letterSpacing: 'var(--track-caps)',
      textTransform: 'uppercase',
      color: 'var(--ink-2)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 40,
      padding: '0 12px',
      background: 'var(--paper)',
      border: `1.5px solid ${bc}`,
      borderRadius: 'var(--radius-1)',
      boxShadow: f ? error ? '0 0 0 3px var(--over-bg)' : '0 0 0 3px rgba(28,27,23,.1)' : 'none',
      transition: 'border-color var(--dur-1) var(--ease-swift), box-shadow var(--dur-1) var(--ease-swift)'
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    color: "var(--ink-3)"
  }) : null, /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    onFocus: e => {
      setF(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setF(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-md)',
      color: 'var(--ink)',
      padding: 0,
      ...inputStyle
    }
  })), suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-3)',
      flex: 'none'
    }
  }, suffix) : null), error || hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 6,
      fontSize: 'var(--text-xs)',
      fontWeight: error ? 600 : 400,
      color: error ? 'var(--cherry)' : 'var(--ink-3)'
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  onChange,
  name,
  value,
  disabled,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: !!checked,
    disabled: disabled,
    onChange: () => onChange && onChange(value),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 18,
      height: 18,
      flex: 'none',
      marginTop: 1,
      background: 'var(--paper)',
      border: `1.5px solid ${checked || h ? 'var(--ink)' : 'var(--line-strong)'}`,
      borderRadius: '50%',
      transition: 'border-color var(--dur-1) var(--ease-swift)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--ink)',
      transform: checked ? 'scale(1)' : 'scale(0)',
      transition: 'transform var(--dur-1) var(--ease-swift)'
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-md)',
      lineHeight: 1.35
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  error,
  options = [],
  style,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  const bc = error ? 'var(--cherry)' : f ? 'var(--ink)' : 'var(--line-strong)';
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      minWidth: 0,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 6,
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      letterSpacing: 'var(--track-caps)',
      textTransform: 'uppercase',
      color: 'var(--ink-2)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({}, rest, {
    onFocus: e => {
      setF(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setF(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      width: '100%',
      height: 40,
      padding: '0 34px 0 12px',
      appearance: 'none',
      WebkitAppearance: 'none',
      background: 'var(--paper)',
      border: `1.5px solid ${bc}`,
      borderRadius: 'var(--radius-1)',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-md)',
      color: 'var(--ink)',
      outline: 'none',
      cursor: 'pointer',
      boxShadow: f ? '0 0 0 3px rgba(28,27,23,.1)' : 'none',
      transition: 'border-color var(--dur-1) var(--ease-swift)'
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--ink-2)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16
  }))), error || hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 6,
      fontSize: 'var(--text-xs)',
      fontWeight: error ? 600 : 400,
      color: error ? 'var(--cherry)' : 'var(--ink-3)'
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  onChange,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    role: "switch",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'relative',
      width: 40,
      height: 22,
      flex: 'none',
      background: checked ? 'var(--ink)' : 'var(--line-strong)',
      borderRadius: 'var(--radius-pill)',
      transition: 'background var(--dur-2) var(--ease-swift)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 20 : 2,
      width: 18,
      height: 18,
      background: 'var(--paper)',
      borderRadius: '50%',
      boxShadow: '0 1px 2px rgba(28,27,23,.25)',
      transition: 'left var(--dur-2) var(--ease-swift)'
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-md)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SegmentedControl.jsx
try { (() => {
function SegmentedControl({
  options = [],
  value,
  onChange,
  size = 'md',
  style
}) {
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const h = size === 'sm' ? 28 : 34;
  return /*#__PURE__*/React.createElement("span", {
    role: "group",
    style: {
      display: 'inline-flex',
      border: 'var(--border-strong)',
      borderRadius: 'var(--radius-1)',
      background: 'var(--paper)',
      overflow: 'hidden',
      ...style
    }
  }, opts.map((o, i) => {
    const active = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      "aria-pressed": active,
      onClick: () => onChange && onChange(o.value),
      style: {
        appearance: 'none',
        outline: 'none',
        cursor: 'pointer',
        height: h,
        padding: '0 12px',
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        lineHeight: 1,
        color: active ? 'var(--chalk)' : 'var(--ink-2)',
        background: active ? 'var(--ink)' : 'transparent',
        border: 'none',
        borderLeft: i ? '1.5px solid var(--ink)' : 'none',
        transition: 'background var(--dur-1) var(--ease-swift), color var(--dur-1) var(--ease-swift)'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = 'var(--chalk)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }
    }, o.label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  style
}) {
  const list = items.map(i => typeof i === 'string' ? {
    id: i,
    label: i
  } : i);
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 20,
      borderBottom: 'var(--border-hair)',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, list.map(it => {
    const active = it.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      "aria-selected": active,
      type: "button",
      onClick: () => onChange && onChange(it.id),
      style: {
        appearance: 'none',
        background: 'none',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        padding: '10px 2px',
        marginBottom: -1,
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        letterSpacing: '.02em',
        lineHeight: 1,
        color: active ? 'var(--ink)' : 'var(--ink-3)',
        borderBottom: `2px solid ${active ? 'var(--ink)' : 'transparent'}`,
        transition: 'color var(--dur-1) var(--ease-swift), border-color var(--dur-1) var(--ease-swift)'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.color = 'var(--ink-2)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.color = 'var(--ink-3)';
      }
    }, it.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// handover/doc-page.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <doc-page> — paged-document shell for printable HTML.
 *
 * FIRST, decide how the document paginates — up front, before building:
 *
 * - FLOWING document (the default): write the whole document as one
 *   normal HTML flow inside <doc-page>; the browser's print engine
 *   splits it onto pages at export. Use for long-form documents with a
 *   single text flow: reports, memos, letters, essays.
 * - EXPLICIT pagination: a fixed set of pre-paginated pages, one
 *   <section class="page"> child per page. Use when the user asks for a
 *   specific page count, or the design implies one: a one-page resume, a
 *   two-sided flier, a poster, a certificate, a brochure — any richly
 *   laid-out document without a single text flow.
 * - If in doubt, ask the user as part of the build.
 *
 * PAGE SIZING — paper differs by country (letter vs A4), so the printed
 * sheet is not one fixed truth:
 * - FLOWING documents pin NO paper size: the print engine paginates
 *   onto the user's real paper, and the content reflows to it.
 * - EXPLICITLY PAGINATED documents print each page at a FIXED page box
 *   with overflow hidden — letter by default, size="a4" for a clearly
 *   metric user, the user's chosen paper when they export. Design each
 *   page to FILL that box, fitting letter and A4 alike without overlap.
 * - width/height pin an explicit fixed size, ONLY when the user gives
 *   one.
 * Never write your own @page rule or hard-code paper dimensions in the
 * content.
 *
 * Sizing modes (attributes):
 *   (none)                      — portrait: flowing docs use the user's
 *           paper; explicitly paginated pages use the named size box
 *           (letter unless size="a4")
 *   orientation="landscape"     — the same, landscape
 *   width / height              — explicit fixed size, ONLY when the user
 *           gives one (e.g. width="22in" height="30in" for a 22×30
 *           poster): the page IS the design's size, printed at true
 *           dimensions (or scaled onto the user's paper at print time).
 *           Any absolute CSS length: px/in/mm/cm/pt/pc.
 * The component announces the chosen mode to the host app at runtime (a
 * meta tag it injects), so the print path can inject the user's true
 * paper size.
 *
 * On screen the document renders on a desk background: a flowing
 * document as one tall scrolling sheet (Google Docs' pageless view);
 * explicitly paginated documents as one card per page.
 *
 * EXPLICIT pagination usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page>
 *     <section class="page" id="p1">…one page's design…</section>
 *     <section class="page" id="p2">…</section>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * How the page box works, concretely: each .page prints as ONE full-bleed
 * sheet at a FIXED physical size — letter by default (set size="a4" for
 * a clearly metric user), the user's chosen paper when they export —
 * with overflow hidden. Nothing scrolls and nothing reflows onto a next
 * sheet: content that misses the box is CLIPPED. Design each page to
 * FILL that page box, and to fit it — letter and A4 alike — without
 * overlap. Each page is a size container; don't size anything in
 * viewport units (they track the window, not the page), and never set
 * width or height on the .page section itself (the component sizes the
 * page box; an authored height like 100% is meaningless at print and is
 * overridden). The component owns the page box, the screen card chrome,
 * and the page breaks (never add your own break-before/after). Don't mix
 * .page sections with flowing content or header/footer slots in the same
 * document.
 *
 * FLOWING usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page margin="0.75in">
 *     <h1>Title</h1>
 *     <p>…body…</p>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * There is no manual page-splitting — the browser's print engine
 * paginates at export. Standard break-hygiene rules (`break-inside:
 * avoid` on figures, code blocks, images and table rows; `orphans/
 * widows: 3`) are applied so paragraphs and groups split cleanly. On
 * screen and at print, headings default to `text-wrap: balance` and
 * body text to `text-wrap: pretty`; the defaults have zero specificity,
 * so any text-wrap you declare wins.
 *
 * Other attributes:
 *   size    — letter | a4 | legal (default letter). Flowing documents:
 *           preview proportion only — it does NOT pin their printed
 *           paper (the print dialog's paper governs); leave it alone
 *           there. Explicitly paginated documents: it sets the page box
 *           the cards and the pinned @page share (the export dialog's
 *           choice overrides both at print) — set size="a4" for a
 *           clearly metric user. Scaled-fit: names the sheet the fit is
 *           computed against, same a4-for-metric-users advice.
 *   content-width / content-height — the design's own fixed dimensions
 *           (CSS lengths), for scaling a fixed-size design ONTO the
 *           named sheet: content lays out at exactly this size, and the
 *           component scales it to fit that sheet's printable area
 *           (centered horizontally, top-aligned; the export dialog
 *           re-fits to the user's actual paper choice where available).
 *           Both must be set; they do not change the page box. For pages
 *           WITHOUT running header/footer slots.
 *   margin  — printable inset on every page of a FLOWING document
 *           (default 0.75in); margin="0" makes pages full-bleed.
 *           Explicitly paginated pages are always full-bleed.
 *
 * Running header/footer (flowing documents only): give an element
 * `slot="header"` or `slot="footer"` and it repeats on every printed
 * page via `position: fixed`. To keep body text from sliding under it,
 * the component prints inside a single-cell table whose <thead>/<tfoot>
 * are spacers sized to the header/footer height — browsers repeat
 * thead/tfoot on every page, so each sheet's content starts below the
 * header and ends above the footer. On screen the header/footer render
 * once at the top/bottom of the sheet.
 *
 * At print the component injects `@page { margin: 0 }` (which leaves
 * Chrome no margin box to draw its date/URL/page-count header in) and
 * moves the visual margin onto the sheet's own padding. It also marks
 * the document as owning its print CSS (a
 * `meta[name="omelette-owns-print"]` it injects at runtime), so the
 * PDF export never injects page-geometry CSS of its own on top.
 *
 * Print best practices for the content you author:
 * - Multi-column text: use CSS columns (`column-count` +
 *   `column-gap`), never side-by-side flex/grid columns — only real
 *   CSS columns flow and break across pages. `column-span: all` lets
 *   a heading span the columns; `hyphens: auto` (needs `lang` on
 *   the html element) keeps narrow columns readable.
 * - Page breaks in flowing documents: `break-before: page` on an
 *   element that must start a new page (a chapter, an appendix). Add
 *   your own kept-together blocks (callouts, stat tiles, cards) to a
 *   `break-inside: avoid` rule, and keep each one shorter than a page.
 * - Extend `orphans: 3; widows: 3` to any custom text blocks you add
 *   (p and li are covered by default).
 * - Give long tables a <thead> — browsers repeat it on every printed
 *   page.
 * - No `position: fixed`/`sticky` and no viewport units in content:
 *   fixed elements stamp every printed page (running headers/footers go
 *   in the component's slots) and `100vh` mis-sizes at print.
 *
 * Author content as static HTML so the user can click-to-edit any text
 * directly. Do not set width/padding/background on the document body —
 * the component owns the sheet box.
 */
/* END USAGE */

(() => {
  const PAPER = {
    letter: ['8.5in', '11in'],
    a4: ['210mm', '297mm'],
    legal: ['8.5in', '14in']
  };
  const CSS_LENGTH = /^\d+(\.\d+)?(px|in|mm|cm|pt|pc)$/;
  // Unitless "0" is a valid CSS length and the natural way to write
  // margin="0"; normalise it to 0px so max()/calc() (which reject a bare
  // number) keep working.
  const safeLen = (v, fb) => {
    v = (v || '').trim();
    return v === '0' ? '0px' : CSS_LENGTH.test(v) ? v : fb;
  };
  // WebKit (Safari and every iOS browser shell) never repeats a table's
  // thead/tfoot on printed pages (WebKit bug 17205), so the spacer-borne
  // vertical margins of a FLOWING document reach only the first page
  // there. Engine check, not browser check: vendor is 'Apple Computer,
  // Inc.' exactly for WebKit and 'Google Inc.' for Blink.
  const WK_PRINT = /apple/i.test(navigator.vendor || '');
  // CSS length → px number (CSS absolute units are exact: 1in = 96px).
  // Returns NaN for anything safeLen would reject — callers gate on it.
  const PX_PER = {
    px: 1,
    in: 96,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    pt: 96 / 72,
    pc: 16
  };
  const toPx = v => {
    const m = /^(\d+(?:\.\d+)?)(px|in|mm|cm|pt|pc)$/.exec((v || '').trim());
    return m ? parseFloat(m[1]) * PX_PER[m[2]] : NaN;
  };
  const stylesheet = `
    :host {
      position: relative;
      display: block;
      /* When the viewport is narrower than the page, grow to wrap the
       * sheet (plus this padding) instead of staying viewport-width, so
       * the desk background and right margin reach the sheet's far edge
       * in the horizontal scroll. */
      min-width: max-content;
      min-height: 100vh;
      background: #f5f5f4;
      padding: 48px 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      --doc-page-w: 8.5in;
      --doc-page-h: 11in;
      --doc-page-margin: 0.75in;
      --doc-hdr-h: 0px;
      --doc-ftr-h: 0px;
      --doc-hdr-pad: 0px;
      --doc-ftr-pad: 0px;
    }
    .sheet {
      width: var(--doc-page-w);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 10px rgba(20, 20, 19, 0.12);
      border-radius: 7px;
      box-sizing: border-box;
      padding: var(--doc-page-margin);
    }
    .frame { width: 100%; border-collapse: collapse; }
    /* Scaled-fit mode (content-width/content-height): the inner .fit box
     * lays the content out at its authored fixed size and scales it onto
     * the printable area; .fit-box reserves the scaled footprint in flow
     * (transforms don't affect layout) and centers it. Without the mode,
     * both divs are unstyled block pass-throughs. */
    /* Explicit pagination: direct .page children are the pages. The sheet
     * becomes a transparent stack and each page carries the card look on
     * screen; at print each page is exactly one full-bleed sheet. The
     * ::slotted defaults are deliberately weak (document CSS wins), so
     * authored page styling can override any of this. */
    .sheet.paginated {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }
    .paginated ::slotted(.page) {
      position: relative;
      display: block;
      width: 100%;
      aspect-ratio: var(--doc-page-ar);
      container-type: size;
      overflow: hidden;
      box-sizing: border-box;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
      break-inside: avoid;
    }
    .paginated ::slotted(.page:not(:first-child)) { margin-top: 1rem; }
    @media print {
      .sheet.paginated { padding: 0; }
      /* The flowing-document vertical inset lives on the repeating
       * thead/tfoot spacers, not the sheet padding — they must go too,
       * or each full-sheet .page is pushed ~margin down and spills onto
       * a second sheet. Paginated pages are full-bleed by definition
       * (content owns its insets). */
      .sheet.paginated .hdr-space,
      .sheet.paginated .ftr-space { height: 0; }
      .paginated ::slotted(.page) {
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        /* Physical page-box sizing, no viewport units: Safari resolves
         * 100vh against the window, not the page box, so a vh-sized card
         * paginates wrong there. --doc-page-w/h are the named size by
         * default and are overridden to the user's chosen paper by the
         * export path, so every card is exactly one sheet either way.
         * Width + height (same source values as @page size) rather than
         * width + aspect-ratio: the ratio is a 6-decimal rounding of the
         * same division, and a few millionths of overflow would spill a
         * blank sheet after every page. The screen-only aspect-ratio
         * (preview proportions) must not leak into print. cqh typography
         * tracks the same box.
         *
         * Every declaration is !important: per CSS Scoping, unimportant
         * shadow ::slotted rules LOSE to the document context, so a page
         * section's authored inline style would silently beat this print
         * geometry. A model-authored height:100% did exactly that — the
         * percentage resolves as auto in the all-auto print ancestry, the
         * base rule's size containment turns auto into ZERO, and
         * overflow:hidden then paints nothing: a blank PDF with perfect
         * page boxes. At print the component's geometry is the design's
         * whole contract, so it must win over any authored sizing. */
        aspect-ratio: auto !important;
        width: var(--doc-page-w) !important;
        height: var(--doc-page-h) !important;
        overflow: hidden !important;
      }
      .paginated ::slotted(.page:not(:first-child)) {
        break-before: page !important;
        margin-top: 0 !important;
      }
    }
    .fit-mode .fit-box {
      width: calc(var(--doc-fit-w) * var(--doc-fit-scale));
      height: calc(var(--doc-fit-h) * var(--doc-fit-scale));
      margin: 0 auto;
      break-inside: avoid;
    }
    .fit-mode .fit {
      width: var(--doc-fit-w);
      height: var(--doc-fit-h);
      transform: scale(var(--doc-fit-scale));
      transform-origin: top left;
    }
    .frame td, .frame th { padding: 0; text-align: left; font-weight: inherit; }
    .hdr-space { height: var(--doc-hdr-h); }
    .ftr-space { height: var(--doc-ftr-h); }
    ::slotted([slot="header"]),
    ::slotted([slot="footer"]) { display: block; box-sizing: border-box; }
    @media print {
      :host { background: none; padding: 0; min-width: 0; min-height: 0; }
      .sheet {
        width: auto; margin: 0; box-shadow: none; border-radius: 0;
        padding: 0 var(--doc-page-margin);
      }
      /* The thead/tfoot spacers repeat on every page, so they carry the
       * vertical page margin (which the sheet's own padding cannot, since
       * that padding is consumed once on the first/last page). The running
       * header/footer are fixed inside that band. */
      /* The 0.35in is breathing room between a running header/footer and
       * the body; without one the spacer is exactly the page margin, so a
       * margin="0" full-bleed document gets truly full-bleed pages. */
      .hdr-space { height: max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))); }
      .ftr-space { height: max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))); }
      /* WebKit flowing documents: @page carries the vertical margin (see
       * _syncPrintPageRule), so the spacers keep only whatever a running
       * header/footer needs BEYOND it — page 1 would otherwise double its
       * top inset. Paginated sheets already zero their spacers above. */
      .sheet.wk-print:not(.paginated) .hdr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))) - var(--doc-page-margin))); }
      .sheet.wk-print:not(.paginated) .ftr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))) - var(--doc-page-margin))); }
      ::slotted([slot="header"]) {
        position: fixed; top: 0; left: 0; right: 0; margin: 0;
        padding: calc(var(--doc-page-margin) * 0.45) var(--doc-page-margin) 0;
      }
      ::slotted([slot="footer"]) {
        position: fixed; bottom: 0; left: 0; right: 0; margin: 0;
        padding: 0 var(--doc-page-margin) calc(var(--doc-page-margin) * 0.45);
      }
    }
  `;
  class DocPage extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'width', 'height', 'margin', 'orientation', 'content-width', 'content-height'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._mo = typeof MutationObserver === 'function' ? new MutationObserver(() => this._scheduleMeasure()) : null;
    }

    /** The named paper's [w, h], swapped when orientation="landscape".
     *  Only the named size swaps — explicit width/height are exact values
     *  the author already oriented. */
    _paperSize() {
      const named = PAPER[(this.getAttribute('size') || '').toLowerCase()] || PAPER.letter;
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? [named[1], named[0]] : named;
    }
    get pageWidth() {
      return safeLen(this.getAttribute('width'), this._paperSize()[0]);
    }
    get pageHeight() {
      return safeLen(this.getAttribute('height'), this._paperSize()[1]);
    }
    get pageMargin() {
      return safeLen(this.getAttribute('margin'), '0.75in');
    }

    /** Scaled-fit mode's content box [w, h] as CSS lengths, or null when
     *  the mode is off (either attribute missing/invalid/zero — a partial
     *  declaration falls back to normal flow rather than guessing). */
    _contentFit() {
      const w = safeLen(this.getAttribute('content-width'), null);
      const h = safeLen(this.getAttribute('content-height'), null);
      if (!w || !h) return null;
      const wPx = toPx(w),
        hPx = toPx(h);
      return wPx > 0 && hPx > 0 ? [w, h, wPx, hPx] : null;
    }
    connectedCallback() {
      if (!this._sheet) this._render();
      this._syncSize();
      this._syncPrintPageRule();
      this._ensureTextWrapDefaults();
      this._ensureOwnsPrintMeta();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      if (this._mo) this._mo.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      this._onResize = () => this._scheduleMeasure();
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this._scheduleMeasure());
      }
      this._scheduleMeasure();
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      if (this._mo) this._mo.disconnect();
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      // Drop the head rules when the last doc-page leaves, so a deleted
      // document's @page geometry and text-wrap defaults can't apply to
      // whatever replaces it.
      const survivor = document.querySelector('doc-page');
      if (!survivor) {
        ['doc-page-print', 'doc-page-text-wrap', 'doc-page-owns-print', 'doc-page-fixed-size', 'doc-page-print-sizing'].forEach(id => {
          const tag = document.getElementById(id);
          if (tag) tag.remove();
        });
        // A live deck-stage deferred its own print-sizing meta to ours —
        // hand the page-global meta over so the deck isn't left unmarked.
        const deck = document.querySelector('deck-stage');
        if (deck && typeof deck._ensurePrintSizingMeta === 'function') {
          deck._ensurePrintSizingMeta();
        }
      } else {
        // A departed owner hands each page-global meta to whatever
        // doc-page remains (or it's removed).
        if (typeof survivor._syncFixedSizeMeta === 'function') {
          survivor._syncFixedSizeMeta();
        }
        if (typeof survivor._syncPrintSizingMeta === 'function') {
          survivor._syncPrintSizingMeta();
        }
      }
    }
    attributeChangedCallback() {
      if (!this._sheet) return;
      this._syncSize();
      this._syncPrintPageRule();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      this._scheduleMeasure();
    }
    _render() {
      this._root.innerHTML = `
        <style>${stylesheet}</style>
        <style id="vars"></style>
        <div class="sheet" data-screen-label="Document">
          <table class="frame" role="presentation">
            <thead><tr><th><div class="hdr-space"><slot name="header"></slot></div></th></tr></thead>
            <tbody><tr><td class="body"><div class="fit-box"><div class="fit"><slot></slot></div></div></td></tr></tbody>
            <tfoot><tr><td><div class="ftr-space"><slot name="footer"></slot></div></td></tr></tfoot>
          </table>
        </div>`;
      this._sheet = this._root.querySelector('.sheet');
      this._vars = this._root.getElementById('vars');
    }

    /** Runtime sizing lives in a shadow <style> :host rule, never on the
     *  light-DOM host element, so serialize-persist can't write it back. */
    _syncSize(hdrH, ftrH) {
      // Scaled-fit mode: content at its authored size, scaled onto the
      // printable area (page minus margins on both axes). The factor is a
      // plain number var so calc(length * number) stays valid; 4 decimals
      // keeps the shadow style stable across re-measures. Upscaling is
      // allowed — print transforms are vector, so text and CSS stay crisp
      // (raster images soften, which the catalog bullet warns about).
      const fit = this._contentFit();
      let fitVars = '';
      if (fit) {
        const marginPx = toPx(this.pageMargin) || 0;
        const availW = toPx(this.pageWidth) - 2 * marginPx;
        const availH = toPx(this.pageHeight) - 2 * marginPx;
        const scale = Math.min(availW / fit[2], availH / fit[3]);
        if (scale > 0 && Number.isFinite(scale)) {
          fitVars = '--doc-fit-w:' + fit[0] + ';' + '--doc-fit-h:' + fit[1] + ';' + '--doc-fit-scale:' + scale.toFixed(4) + ';';
        }
      }
      this._sheet.classList.toggle('fit-mode', !!fitVars);
      // Numeric w/h ratio for the paginated page cards' aspect-ratio —
      // aspect-ratio takes a number, not a length ratio, so compute it
      // here (CSS length division isn't portable). 6 decimals keeps the
      // shadow style stable across re-syncs.
      const arW = toPx(this.pageWidth);
      const arH = toPx(this.pageHeight);
      const ar = arW > 0 && arH > 0 ? (arW / arH).toFixed(6) : '0.772727';
      this._vars.textContent = ':host{' + fitVars + '--doc-page-ar:' + ar + ';' + '--doc-page-w:' + this.pageWidth + ';' + '--doc-page-h:' + this.pageHeight + ';' + '--doc-page-margin:' + this.pageMargin + ';' + '--doc-hdr-h:' + (hdrH || 0) + 'px;' + '--doc-ftr-h:' + (ftrH || 0) + 'px;' + '--doc-hdr-pad:' + (hdrH ? '0.35in' : '0px') + ';' + '--doc-ftr-pad:' + (ftrH ? '0.35in' : '0px') + '}';
    }

    /** @page is a no-op inside shadow DOM, so the rule lives in <head>.
     *  Re-appended on every sync so it stays last in source order — the
     *  @page cascade is source-order per descriptor, so this rule wins
     *  over any other @page rule in the document.
     *
     *  The @page SIZE is pinned where the page box IS part of the design:
     *  explicit-fixed-size mode (width + height authored), scaled-fit
     *  mode (the named sheet the fit targets), and explicit pagination
     *  (the named size the cards share — so card and sheet agree on
     *  every print path, and the export path's chosen paper overrides
     *  BOTH with one later rule). For FLOWING documents no paper size is
     *  emitted at all — the true size comes from the user's preference,
     *  injected by the export path or chosen in the print dialog — so a
     *  flowing document never fights the paper it lands on.
     *  margin: 0 is emitted in every mode: it leaves Chrome no margin box
     *  to draw its date/URL/page-count header in, and the visual margin
     *  lives on the sheet's own padding. */
    _syncPrintPageRule() {
      const id = 'doc-page-print';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      document.head.appendChild(tag);
      // Three print-geometry regimes:
      // - true-size: the page IS the design — pin its exact size.
      // - scaled-fit (content-width/height): the fit factor is computed
      //   against the NAMED paper's printable area, so that paper must
      //   stay pinned or the scaled content overflows a smaller sheet
      //   (the export path re-fits and re-pins at print time on top).
      // - default modes: no paper size — but landscape still needs the
      //   paper-agnostic 'size: landscape' keyword, because the size
      //   descriptor is what carries orientation; without it a landscape
      //   document prints portrait whenever nothing injects a size.
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      // Explicit pagination pins the page box to the SAME values that
      // size the cards (the named size by default, the export path's
      // chosen paper when its later rule overrides both) — card and
      // sheet agree on every print path, and a mismatched real paper
      // shrinks-to-fit in the dialog instead of clipping a Letter card
      // on A4. Declared before the paginated read below so both derive
      // from one check.
      const paginatedNow = this.querySelector(':scope > .page') !== null;
      const sizeDescriptor = this._trueSizePx() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : this._contentFit() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : paginatedNow ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : landscape ? 'size: landscape; ' : '';
      // WebKit never repeats the thead/tfoot spacers that carry a flowing
      // document's vertical page margins (see WK_PRINT above), so pages
      // after the first print edge-to-edge there. Carry the VERTICAL
      // margins on @page for WebKit instead, and the shadow print CSS
      // trims the first-page spacers by the same amount (.sheet.wk-print
      // rules). Horizontal inset stays on the sheet's own padding in
      // every engine. Blink keeps margin: 0 (a nonzero margin there
      // re-opens the box Chrome draws its header furniture in). One cost,
      // learned in testing: Safari's own date/URL headers are a USER
      // dialog setting ("Print headers and footers") that renders in the
      // margin area when room exists — margin: 0 only suppressed it by
      // leaving no room, and no CSS controls it. The export dialog's
      // Safari guide teaches turning the setting off for flowing
      // documents. Explicitly paginated and fixed-size documents keep
      // margin: 0 everywhere: their pages ARE the sheet.
      const wkFlowing = WK_PRINT && !paginatedNow && !this._trueSizePx() && !this._contentFit();
      const marginDescriptor = wkFlowing ? 'margin: ' + this.pageMargin + ' 0; ' : 'margin: 0; ';
      // Shadow-internal marker (never serialized), kept in lockstep with
      // the @page decision above: the print CSS trims the first-page
      // spacers ONLY while @page actually carries the margins — a
      // true-size or scaled-fit sheet keeps margin: 0 and must keep its
      // spacers too. Re-synced here so attribute changes and pagination
      // flips move both together.
      if (this._sheet) this._sheet.classList.toggle('wk-print', wkFlowing);
      tag.textContent = '@page { ' + sizeDescriptor + marginDescriptor + '} ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; height: auto !important; overflow: visible !important; } ' + 'h1,h2,h3,h4,h5,h6 { break-after: avoid; } ' + 'figure,pre,blockquote,img,svg,tr { break-inside: avoid; } ' + 'p,li { orphans: 3; widows: 3; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; ' + 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important; } ' + '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }

    /** Typographic defaults for document text: balance headings, avoid
     *  widowed/orphaned words in body copy (browsers without text-wrap
     *  support drop the declarations). Zero-specificity via :where() so
     *  any text-wrap authored on those elements wins; document-level so the
     *  rules reach the slotted (light DOM) content — shadow styles can't.
     *  data-omelette-injected marks the tag for the host editor to strip
     *  at serialize, so it is never written back as authored source. */
    _ensureTextWrapDefaults() {
      if (document.getElementById('doc-page-text-wrap')) return;
      const tag = document.createElement('style');
      tag.id = 'doc-page-text-wrap';
      tag.setAttribute('data-omelette-injected', '');
      tag.textContent = ':where(h1,h2,h3,h4,h5,h6){text-wrap:balance}' + ':where(p,li,blockquote,figcaption){text-wrap:pretty}';
      document.head.appendChild(tag);
    }

    /** Declares that this document owns its print CSS. The instant-PDF
     *  export checks for the meta by NAME PRESENCE alone (content is
     *  ignored) and skips its automatic print-CSS injections, so the
     *  component's @page geometry is never overridden by a heuristic.
     *  data-omelette-injected keeps it out of serialized source. */
    _ensureOwnsPrintMeta() {
      if (document.getElementById('doc-page-owns-print')) return;
      const tag = document.createElement('meta');
      tag.id = 'doc-page-owns-print';
      tag.name = 'omelette-owns-print';
      tag.content = 'true';
      tag.setAttribute('data-omelette-injected', '');
      document.head.appendChild(tag);
    }

    /** This page's valid true-size page box (explicit width AND height)
     *  as [w, h] px ints, or null when the mode is off. */
    _trueSizePx() {
      if (!safeLen(this.getAttribute('width'), null) || !safeLen(this.getAttribute('height'), null)) return null;
      const w = Math.round(toPx(this.pageWidth));
      const h = Math.round(toPx(this.pageHeight));
      return w > 0 && h > 0 ? [w, h] : null;
    }

    /** True-size pages (explicit width AND height) also declare the page
     *  box as the preview size: the in-app preview reads
     *  meta[name="omelette-fixed-size"] (content "W,H" in px ints) and
     *  scales the sheet into view — without it an 18in poster previews at
     *  true size with scrollbars. Never overrides an author-set meta
     *  (only the component's own id is managed). The meta is page-global
     *  while doc-page instances are not, so every sync recomputes the
     *  page-wide owner — the first connected true-size doc-page — and a
     *  non-true-size sibling's sync can never delete the owner's meta.
     *  Removed when no true-size page remains (the owner's disconnect
     *  re-syncs via any survivor) or when an author-set meta exists. */
    _syncFixedSizeMeta() {
      const id = 'doc-page-fixed-size';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-fixed-size"]:not([data-omelette-injected])');
      // The page-wide owner, not this instance: an upgraded true-size page
      // anywhere in the document keeps the meta alive and sized.
      let box = null;
      for (const el of document.querySelectorAll('doc-page')) {
        box = typeof el._trueSizePx === 'function' ? el._trueSizePx() : null;
        if (box) break;
      }
      if (!box || authored) {
        if (own) own.remove();
        return;
      }
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-fixed-size';
      tag.content = box[0] + ',' + box[1];
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }

    /** This page's print-sizing mode: 'fixed' when an explicit width AND
     *  height are authored (the page is the design's own size), else the
     *  default paper in the authored orientation. */
    _printSizingMode() {
      if (this._trueSizePx()) return 'fixed';
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? 'default-landscape' : 'default-portrait';
    }

    /** Announces the print-sizing mode to the host app:
     *  meta[name="omelette-print-sizing"] with content 'default-portrait',
     *  'default-landscape', or 'fixed' (fixed pages also carry the
     *  omelette-fixed-size meta with the page box in px). The export path
     *  probes it to decide what true paper size to inject at print time —
     *  in the default modes the component emits no paper size of its own.
     *  Same page-global ownership rules as the fixed-size meta above:
     *  first connected doc-page owns it, an authored meta is never
     *  overridden, removed when no doc-page remains. */
    _syncPrintSizingMeta() {
      const id = 'doc-page-print-sizing';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-print-sizing"]:not([data-omelette-injected])');
      // A fixed page wins outright (mirroring the fixed-size loop above,
      // so the two metas can never contradict each other in a mixed
      // multi-page document); otherwise the first page's mode holds.
      let mode = null;
      for (const el of document.querySelectorAll('doc-page')) {
        if (typeof el._printSizingMode !== 'function') continue;
        const m = el._printSizingMode();
        if (m === 'fixed') {
          mode = m;
          break;
        }
        if (mode === null) mode = m;
      }
      if (!mode || authored) {
        if (own) own.remove();
        return;
      }
      // A deck-stage that connected first injected its own meta and
      // defers to any existing one — take it over, or the document ends
      // up with two conflicting injected metas (a doc-page page is the
      // document; the deck re-ensures its meta if every doc-page leaves).
      const deckMeta = document.getElementById('deck-stage-print-sizing');
      if (deckMeta) deckMeta.remove();
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-print-sizing';
      tag.content = mode;
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }
    _scheduleMeasure() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._measure();
      });
    }

    /** Slot heights feed the print spacers (--doc-hdr-h / --doc-ftr-h), so
     *  they re-measure on content mutation, resize, and font load. The
     *  same pass detects explicit pagination (direct .page children) and
     *  toggles the sheet between the flowing-document card and the
     *  page-per-card stack — content edits can add or remove pages at any
     *  time, so this tracks the same mutations the measurement does. */
    _measure() {
      const hdr = this.querySelector(':scope > [slot="header"]');
      const ftr = this.querySelector(':scope > [slot="footer"]');
      const wasPaginated = this._sheet.classList.contains('paginated');
      this._sheet.classList.toggle('paginated', this.querySelector(':scope > .page') !== null);
      // The WebKit @page margin is flowing-only, so a pagination flip
      // must re-emit the rule (content edits can add or remove .page
      // sections at any time).
      if (this._sheet.classList.contains('paginated') !== wasPaginated) {
        this._syncPrintPageRule();
      }
      this._syncSize(hdr ? hdr.offsetHeight : 0, ftr ? ftr.offsetHeight : 0);
    }
  }
  if (!customElements.get('doc-page')) {
    customElements.define('doc-page', DocPage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "handover/doc-page.js", error: String((e && e.message) || e) }); }

// ui_kits/app/RecordScreen.jsx
try { (() => {
function RecordScreen({
  onMeasured
}) {
  const {
    Badge,
    SegmentedControl
  } = window.SightscreenDesignSystem_9d8748;
  const [fps, setFps] = React.useState('240 fps');
  const [state, setState] = React.useState('idle');
  const [prog, setProg] = React.useState(0);
  React.useEffect(() => {
    if (state !== 'measuring') return;
    const t0 = setTimeout(() => setProg(100), 60);
    const t1 = setTimeout(onMeasured, 2400);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [state]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 14,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 18px/1 var(--font-display)',
      letterSpacing: '.02em',
      textTransform: 'uppercase'
    }
  }, "Record"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 470,
      background: 'var(--ink)',
      borderRadius: 'var(--radius-2)',
      overflow: 'hidden'
    }
  }, state === 'idle' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      right: 12,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "good"
  }, "Light: good"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, fps)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 46,
      right: 46,
      top: 64,
      bottom: 96,
      border: '1.5px solid var(--chalk)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 96,
      height: 1.5,
      background: 'rgba(242,240,233,.45)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 42,
      textAlign: 'center',
      font: '500 10px/1.7 var(--font-mono)',
      letterSpacing: '.09em',
      color: 'rgba(242,240,233,.8)'
    }
  }, "KEEP THE BOWLER INSIDE THE FRAME", /*#__PURE__*/React.createElement("br", null), "PHONE 20 M FROM THE CREASE \xB7 WAIST HEIGHT")) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeContent: 'center',
      gap: 14,
      justifyItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 22px/1.1 var(--font-display), sans-serif',
      color: 'var(--chalk)',
      fontFamily: 'var(--font-display)'
    }
  }, "Measuring"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11px/1.6 var(--font-mono)',
      color: 'rgba(242,240,233,.75)',
      textAlign: 'center'
    }
  }, "Tracking the ball across 31 frames.", /*#__PURE__*/React.createElement("br", null), "Marking front-foot contact and release."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 180,
      height: 4,
      background: 'rgba(242,240,233,.22)',
      borderRadius: 2,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: prog + '%',
      height: '100%',
      background: 'var(--chalk)',
      transition: 'width 2.2s var(--ease-inout)'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    size: "sm",
    options: ['120 fps', '240 fps'],
    value: fps,
    onChange: setFps
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Record",
    disabled: state === 'measuring',
    onClick: () => setState('measuring'),
    style: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: state === 'measuring' ? 'var(--cherry-deep)' : 'var(--cherry)',
      border: '4px solid var(--paper)',
      boxShadow: '0 0 0 1.5px var(--line-strong)',
      cursor: 'pointer',
      transition: 'background var(--dur-1) var(--ease-swift)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 11px/1.4 var(--font-mono)',
      color: 'var(--ink-3)',
      width: 92,
      textAlign: 'right'
    }
  }, "6-ball spell")));
}
Object.assign(__ds_scope, { RecordScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/RecordScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ResultScreen.jsx
try { (() => {
const toMph = v => Math.round(v * 62.1371) / 100;
function ResultScreen({
  session,
  onBack
}) {
  const {
    Card,
    Metric,
    CueCard,
    SegmentedControl,
    IconButton,
    Icon
  } = window.SightscreenDesignSystem_9d8748;
  const [unit, setUnit] = React.useState('km/h');
  const cv = v => unit === 'km/h' ? v : toMph(v);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 14,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'none',
      border: 'none',
      padding: '4px 0',
      font: '600 13px/1 var(--font-ui)',
      color: 'var(--ink-2)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  }), session.label, " \xB7 ", session.date), /*#__PURE__*/React.createElement(IconButton, {
    name: "share-2",
    label: "Share",
    size: "sm"
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Fastest ball",
    value: cv(session.best),
    unit: unit,
    band: cv(session.band),
    sample: `from ${session.frames} frames`,
    size: "lg"
  }), /*#__PURE__*/React.createElement(SegmentedControl, {
    size: "sm",
    options: ['km/h', 'mph'],
    value: unit,
    onChange: setUnit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      marginTop: 16,
      paddingTop: 14,
      borderTop: 'var(--border-hair)'
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Average",
    value: cv(session.avg),
    unit: unit,
    band: cv(session.avgBand),
    size: "sm"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Balls measured",
    value: session.balls,
    size: "sm"
  }))), /*#__PURE__*/React.createElement(CueCard, {
    cue: "Brace your front knee",
    gain: "+3\u20136 km/h estimated",
    detail: "At front-foot contact your knee flexes to 38\xB0 \xB15\xB0. Bowlers a band quicker hold it under 20\xB0. Land heel-first and push tall through the front leg.",
    actionLabel: "Watch the drill",
    onAction: () => {}
  }), /*#__PURE__*/React.createElement(Card, {
    title: "Your action, measured"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Front knee flexion at contact",
    value: 38,
    unit: "\xB0",
    band: 5,
    size: "sm",
    range: {
      min: 0,
      max: 60,
      good: [0, 20]
    }
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Hip\u2013shoulder separation",
    value: 31,
    unit: "\xB0",
    band: 4,
    size: "sm",
    range: {
      min: 0,
      max: 60,
      good: [35, 50]
    }
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Run-up speed",
    value: 5.2,
    unit: "m/s",
    band: 0.3,
    size: "sm",
    range: {
      min: 3,
      max: 8,
      good: [5.5, 7]
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 10.5px/1.6 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, "Measured from ", session.frames, " of 31 frames \xB7 phone 21 m from crease \xB7 good light"));
}
Object.assign(__ds_scope, { ResultScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ResultScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SessionsScreen.jsx
try { (() => {
function SessionsScreen({
  sessions,
  pb,
  onOpen,
  onRecord
}) {
  const {
    Button,
    Card,
    Badge,
    Metric,
    Icon,
    IconButton
  } = window.SightscreenDesignSystem_9d8748;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 14,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 18px/1 var(--font-display)',
      letterSpacing: '.02em',
      textTransform: 'uppercase'
    }
  }, "Sightscreen"), /*#__PURE__*/React.createElement(IconButton, {
    name: "settings",
    label: "Settings",
    size: "sm"
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Personal best",
    value: pb.best,
    unit: "km/h",
    band: pb.band,
    sample: pb.date,
    size: "lg"
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "inverse"
  }, "PB"))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    icon: "video",
    full: true,
    onClick: onRecord
  }, "Record a spell"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 11px/1 var(--font-ui)',
      letterSpacing: 'var(--track-caps)',
      textTransform: 'uppercase',
      color: 'var(--ink-2)',
      marginTop: 4
    }
  }, "Recent sessions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, sessions.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.id,
    pad: 14,
    style: {
      cursor: 'pointer'
    },
    onClick: () => onOpen(s)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.2 var(--font-ui)'
    }
  }, s.label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11.5px/1 var(--font-mono)',
      color: 'var(--ink-3)',
      marginTop: 5
    }
  }, s.date, " \xB7 ", s.balls, " balls")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 22px/1 var(--font-display)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.best), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 10.5px/1 var(--font-mono)',
      color: 'var(--ink-3)',
      marginTop: 3
    }
  }, "\xB1", s.band, " km/h")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "var(--ink-3)"
  })))))));
}
Object.assign(__ds_scope, { SessionsScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SessionsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/WorkloadScreen.jsx
try { (() => {
function WorkloadScreen() {
  const {
    Card,
    Badge,
    WorkloadMeter,
    Icon,
    Select
  } = window.SightscreenDesignSystem_9d8748;
  const [age, setAge] = React.useState('U17');
  const spells = [{
    d: 'Sat 15 Aug',
    o: '6 overs',
    t: 'Club nets'
  }, {
    d: 'Tue 12 Aug',
    o: '5 overs',
    t: 'School nets'
  }, {
    d: 'Sun 9 Aug',
    o: '7 overs',
    t: 'Match'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 14,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 18px/1 var(--font-display)',
      letterSpacing: '.02em',
      textTransform: 'uppercase'
    }
  }, "Workload"), /*#__PURE__*/React.createElement(Badge, null, age, " directives")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(WorkloadMeter, {
    label: "Today",
    used: 6,
    limit: 7,
    unit: "overs",
    guideline: `${age} guideline · 7 overs a spell`
  }), /*#__PURE__*/React.createElement(WorkloadMeter, {
    label: "This week",
    used: 18,
    limit: 21,
    unit: "overs",
    guideline: `${age} guideline · 21 overs a week`
  }))), /*#__PURE__*/React.createElement(Card, {
    title: "Recent spells",
    pad: 14
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid'
    }
  }, spells.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.d,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 10,
      padding: '9px 0',
      borderTop: i ? 'var(--border-hair)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13.5px/1 var(--font-ui)'
    }
  }, s.t), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 11.5px/1 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, s.d, " \xB7 ", s.o))))), /*#__PURE__*/React.createElement(Select, {
    label: "Age group",
    options: ['U13', 'U15', 'U17', 'U19', 'Open'],
    value: age,
    onChange: e => setAge(e.target.value),
    hint: "Sets which guideline protects you."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      padding: '12px 14px',
      background: 'var(--turf-tint)',
      border: '1px solid var(--turf-soft)',
      borderRadius: 'var(--radius-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 17,
    color: "var(--turf-deep)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12.5px/1.5 var(--font-ui)',
      color: 'var(--turf-deep)'
    }
  }, "Workload limits are always free. Safety never sits behind a paywall.")));
}
Object.assign(__ds_scope, { WorkloadScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/WorkloadScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/prototype/ProtoCapture.jsx
try { (() => {
function ProtoCapture({
  app
}) {
  const {
    NS,
    beep,
    say
  } = window.SSP;
  const {
    Button,
    Badge,
    Select,
    Switch,
    Card,
    Icon,
    SegmentedControl
  } = NS;
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
  const ballsRef = React.useRef(balls);
  ballsRef.current = balls;
  React.useEffect(() => {
    if (step !== 'count') return;
    if (count <= 0) {
      setStep('rec');
      return;
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, count]);
  React.useEffect(() => {
    if (step !== 'rec') return;
    const iv = setInterval(() => {
      setBalls(b => {
        const speed = Math.round((105 + Math.random() * 12) * 10) / 10;
        if (audio) beep(880);
        if (spoken) say(String(Math.round(speed)).split('').join(' '));
        return [...b, {
          n: b.length + 1,
          speed,
          band: Math.round((1.9 + Math.random()) * 10) / 10,
          conf: Math.random() < .18 ? 'low' : 'ok'
        }];
      });
    }, 3800);
    const a1 = setTimeout(() => {
      setAmber('CAN’T SEE THE BOWLER');
      if (audio) beep(300);
      if (spoken) say('Can’t see the bowler');
    }, 13000);
    const a2 = setTimeout(() => setAmber(null), 18000);
    return () => {
      clearInterval(iv);
      clearTimeout(a1);
      clearTimeout(a2);
    };
  }, [step, audio, spoken]);
  React.useEffect(() => {
    if (step !== 'proc') return;
    if (prog >= balls.length) {
      const t = setTimeout(() => {
        const sp = balls.map(b => b.speed);
        const best = Math.max(...sp),
          avg = Math.round(sp.reduce((a, c) => a + c, 0) / sp.length * 10) / 10;
        app.finishCapture({
          id: Date.now(),
          label: type,
          date: 'Sun 17 Aug',
          balls: balls.length,
          best,
          band: 2.5,
          avg,
          avgBand: 1.9,
          frames: 24,
          d: balls,
          prev: 114.9
        });
      }, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProg(p => p + 1), 550);
    return () => clearTimeout(t);
  }, [step, prog]);
  const Bar = ({
    title,
    sub
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: app.pop,
    style: {
      display: 'inline-flex',
      background: 'none',
      border: 'none',
      padding: 4,
      cursor: 'pointer',
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 16px/1 var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '.02em'
    }
  }, title), sub ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 10.5px/1 var(--font-mono)',
      color: 'var(--ink-3)',
      marginTop: 3
    }
  }, sub) : null));
  const fastest = balls.length ? Math.max(...balls.map(b => b.speed)) : 0;
  const avg = balls.length ? Math.round(balls.map(b => b.speed).reduce((a, c) => a + c, 0) / balls.length * 10) / 10 : 0;
  if (step === 'type') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S20 Session type",
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Bar, {
    title: "Bowl",
    sub: "S20 \xB7 WHAT KIND OF SPELL?"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gap: 10,
      alignContent: 'start',
      padding: '14px 16px'
    }
  }, [['Net session', 'The default. Counts toward load at net weighting.'], ['Match spell', 'Weighted heavier in your workload — match balls cost more.'], ['Drill check', 'Short, focused retest of your current drill. 6–12 balls.']].map(([t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    pad: 14,
    style: {
      cursor: 'pointer',
      borderColor: type === t ? 'var(--ink)' : undefined,
      borderWidth: type === t ? 1.5 : 1,
      borderStyle: 'solid'
    },
    onClick: () => setType(t)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.2 var(--font-ui)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px/1.45 var(--font-ui)',
      color: 'var(--ink-2)',
      marginTop: 3
    }
  }, d)), type === t ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18
  }) : null)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 24px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    onClick: () => setStep('place')
  }, "Continue")));
  if (step === 'place') {
    const checks = [['Landscape orientation', true, ''], ['Device level', true, ''], ['Crease and stumps visible', app.calib, 'Mark them once — remembered for this venue.'], ['Light for 240 fps', true, '']];
    const allOk = checks.every(c => c[1]);
    return /*#__PURE__*/React.createElement("div", {
      "data-screen-label": "S21 Placement guide",
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement(Bar, {
      title: "Place the phone",
      sub: "S21 \xB7 CHECKS PASS AS YOU FIX THEM"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'grid',
        gap: 12,
        alignContent: 'start',
        padding: '14px 16px',
        overflowY: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 170,
        background: 'var(--ink)',
        borderRadius: 'var(--radius-2)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 24,
        right: 24,
        top: 20,
        bottom: 42,
        border: '1.5px solid var(--chalk)',
        borderRadius: 2
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 42,
        height: 1.5,
        background: 'rgba(242,240,233,.45)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 14,
        textAlign: 'center',
        font: '500 9.5px/1 var(--font-mono)',
        letterSpacing: '.1em',
        color: 'rgba(242,240,233,.8)'
      }
    }, "LIVE PREVIEW")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 8
      }
    }, checks.map(([t, ok, fix]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        padding: '10px 12px',
        background: 'var(--paper)',
        border: 'var(--border-hair)',
        borderRadius: 'var(--radius-1)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ok ? 'circle-check' : 'circle-alert',
      size: 17,
      color: ok ? 'var(--turf)' : 'var(--amber)',
      style: {
        marginTop: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '500 13.5px/1.3 var(--font-ui)'
      }
    }, t), !ok && fix ? /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 12px/1.45 var(--font-ui)',
        color: 'var(--ink-2)',
        marginTop: 2
      }
    }, fix) : null)))), !allOk ? /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 12px/1.5 var(--font-ui)',
        color: 'var(--ink-3)'
      }
    }, "You can continue anyway \u2014 affected deliveries get marked low-confidence rather than hidden.") : null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 8,
        padding: '0 16px 24px'
      }
    }, app.calib ? /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      full: true,
      onClick: () => setStep('ready')
    }, "Continue") : /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      full: true,
      onClick: () => setStep('calib')
    }, "Mark crease and stumps"), !app.calib ? /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      full: true,
      onClick: () => setStep('ready')
    }, "Continue anyway") : null));
  }
  if (step === 'calib') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S22 Framing and calibration",
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Bar, {
    title: "Calibrate",
    sub: "S22 \xB7 TAP THE CREASE, THEN THE STUMPS"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '14px 16px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (taps.length >= 2) return;
      const r = e.currentTarget.getBoundingClientRect();
      setTaps(t => [...t, {
        x: (e.clientX - r.left) / r.width * 100,
        y: (e.clientY - r.top) / r.height * 100
      }]);
    },
    style: {
      position: 'relative',
      height: 300,
      background: 'var(--ink)',
      borderRadius: 'var(--radius-2)',
      overflow: 'hidden',
      cursor: 'crosshair'
    }
  }, taps[0] ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: taps[0].y + '%',
      height: 2,
      background: 'var(--cherry)'
    }
  }) : null, taps[1] ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: `calc(${taps[1].x}% - 5px)`,
      top: `calc(${taps[1].y}% - 5px)`,
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--cherry)',
      border: '2px solid var(--chalk)'
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 12,
      textAlign: 'center',
      font: '500 10px/1.6 var(--font-mono)',
      letterSpacing: '.09em',
      color: 'rgba(242,240,233,.85)'
    }
  }, taps.length === 0 ? 'TAP THE POPPING CREASE LINE' : taps.length === 1 ? 'NOW TAP THE BASE OF THE STUMPS' : 'PITCH GEOMETRY LOCKED · 22 YD · 1.22 M CREASE')), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px/1.5 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Known pitch geometry calibrates run-up and ball speed. Remembered for this venue \u2014 next time you skip this step.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 24px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    disabled: taps.length < 2,
    onClick: () => {
      app.setCalib(true);
      setStep('ready');
    }
  }, "Continue")));
  if (step === 'ready') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S23 Ready",
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Bar, {
    title: "Ready",
    sub: "S23 \xB7 THE LAST TOUCH OF THE SESSION"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gap: 14,
      alignContent: 'start',
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px/1.55 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Arm it, walk to your mark, bowl. The screen stays readable from 20 m; a tone confirms each delivery. Tap the screen when you're done."), /*#__PURE__*/React.createElement(Select, {
    label: "Countdown",
    options: ['15 s', '30 s', '60 s'],
    value: cd,
    onChange: e => setCd(e.target.value)
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Audio confirmation per delivery",
    checked: audio,
    onChange: setAudio
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Speak the speed aloud",
    checked: spoken,
    onChange: setSpoken
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 12px/1.5 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, "Room for about 45 deliveries at 62% battery. Recording warms the phone up; that's normal.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 24px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    icon: "video",
    onClick: () => {
      setCount(5);
      setStep('count');
    }
  }, "Arm and walk away")));
  if (step === 'count') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S24 Countdown",
    onClick: () => setStep('rec'),
    style: {
      height: '100%',
      display: 'grid',
      placeContent: 'center',
      justifyItems: 'center',
      gap: 10,
      background: 'var(--ink)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 170px/1 var(--font-display)',
      color: 'var(--chalk)'
    }
  }, count), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 11px/1.6 var(--font-mono)',
      letterSpacing: '.1em',
      color: 'rgba(242,240,233,.7)',
      textAlign: 'center'
    }
  }, "WALK TO YOUR MARK", /*#__PURE__*/React.createElement("br", null), "(", cd, " SET \xB7 SHORTENED IN PROTOTYPE)"));
  if (step === 'rec') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S24 Recording",
    onClick: () => setStep('ended'),
    style: {
      height: '100%',
      display: 'grid',
      placeContent: 'center',
      justifyItems: 'center',
      gap: 6,
      background: amber ? 'var(--amber)' : 'var(--turf)',
      cursor: 'pointer',
      transition: 'background var(--dur-2) var(--ease-swift)'
    }
  }, amber ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 44px/1.05 var(--font-display)',
      color: '#FFF',
      textAlign: 'center',
      maxWidth: 300
    }
  }, amber), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 12px/1.7 var(--font-mono)',
      color: 'rgba(255,255,255,.85)',
      textAlign: 'center',
      marginTop: 8
    }
  }, "SAID ALOUD TOO \u2014 A SILENT FAILURE", /*#__PURE__*/React.createElement("br", null), "COSTS YOU THE SPELL. RESUMES ITSELF.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1 var(--font-mono)',
      letterSpacing: '.14em',
      color: 'rgba(255,255,255,.85)'
    }
  }, "RECORDING"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 190px/1 var(--font-display)',
      color: '#FFF',
      fontVariantNumeric: 'tabular-nums'
    }
  }, balls.length), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1 var(--font-mono)',
      letterSpacing: '.14em',
      color: 'rgba(255,255,255,.85)'
    }
  }, "DELIVERIES"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 10.5px/1 var(--font-mono)',
      letterSpacing: '.1em',
      color: 'rgba(255,255,255,.65)',
      marginTop: 26
    }
  }, "TAP ANYWHERE TO END")));
  if (step === 'ended') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S25 Session ended",
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Bar, {
    title: "Session ended",
    sub: `S25 · ${type.toUpperCase()}`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gap: 14,
      alignContent: 'start',
      padding: '14px 16px'
    }
  }, balls.length ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(NS.Metric, {
    label: "Deliveries",
    value: balls.length,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '14px 26px',
      marginTop: 14,
      paddingTop: 14,
      borderTop: 'var(--border-hair)'
    }
  }, /*#__PURE__*/React.createElement(NS.Metric, {
    label: "Fastest",
    value: fastest,
    unit: "km/h",
    band: 2.5,
    size: "sm"
  }), /*#__PURE__*/React.createElement(NS.Metric, {
    label: "Average",
    value: avg,
    unit: "km/h",
    band: 1.9,
    size: "sm"
  }))) : /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13.5px/1.55 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "No deliveries detected. Most likely a framing or angle problem \u2014 the placement checks will catch it next time. Nothing was counted against your workload.")), balls.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px/1.5 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, "Added to workload: ", Math.round(balls.length / 6 * 10) / 10, " overs \xB7 ", type === 'Match spell' ? 'match' : 'net', " weighting") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      padding: '0 16px 24px'
    }
  }, balls.length ? /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    onClick: () => {
      setProg(0);
      setStep('proc');
    }
  }, "Process session") : /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    onClick: () => setStep('ready')
  }, "Try again"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    full: true,
    onClick: app.pop
  }, "Close")));
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S26 Processing",
    style: {
      height: '100%',
      display: 'grid',
      placeContent: 'center',
      justifyItems: 'center',
      gap: 16,
      background: 'var(--ink)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 26px/1.1 var(--font-display)',
      color: 'var(--chalk)'
    }
  }, "Processing"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 13px/1 var(--font-mono)',
      color: 'rgba(242,240,233,.8)'
    }
  }, "Delivery ", Math.min(prog + 1, balls.length), " of ", balls.length), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200,
      height: 4,
      background: 'rgba(242,240,233,.22)',
      borderRadius: 2,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: (balls.length ? prog / balls.length * 100 : 0) + '%',
      height: '100%',
      background: 'var(--chalk)',
      transition: 'width .5s var(--ease-inout)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11px/1.7 var(--font-mono)',
      color: 'rgba(242,240,233,.6)',
      textAlign: 'center'
    }
  }, "ON-DEVICE \xB7 WORKS IN AEROPLANE MODE", /*#__PURE__*/React.createElement("br", null), "THIS WARMS THE PHONE UP \u2014 IT'S NORMAL", /*#__PURE__*/React.createElement("br", null), "YOU CAN LEAVE; WE'LL NOTIFY WHEN DONE"));
}
Object.assign(__ds_scope, { ProtoCapture });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/prototype/ProtoCapture.jsx", error: String((e && e.message) || e) }); }

// ui_kits/prototype/ProtoHome.jsx
try { (() => {
function ProtoHome({
  app,
  view
}) {
  const {
    NS,
    cvv
  } = window.SSP;
  const {
    Card,
    Badge,
    Button,
    Icon,
    Metric,
    Tabs,
    WorkloadMeter
  } = NS;
  const unit = app.user.unit;
  const cv = v => cvv(v, unit);
  const [trendTab, setTrendTab] = React.useState('pace');
  const latest = app.sessions[0];
  if (view.v === 'history') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S11 Session history",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 8,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(window.SSP.Head, {
    title: "All sessions",
    onBack: app.pop
  }), app.sessions.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.id,
    pad: 13,
    style: {
      cursor: 'pointer'
    },
    onClick: () => app.push('review', {
      id: s.id
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-ui)'
    }
  }, s.label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11px/1 var(--font-mono)',
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, s.date, " \xB7 ", s.balls, " balls")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 19px/1 var(--font-display)'
    }
  }, cv(s.best)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 15,
    color: "var(--ink-3)"
  }))))));
  if (view.v === 'trends') {
    const pace = [108.4, 110.1, 109.2, 112.6, 113.8, 114.9, 116.2];
    const marks = {
      2: 'drill',
      5: 'retest'
    };
    return /*#__PURE__*/React.createElement("div", {
      "data-screen-label": "S60 Progress",
      style: {
        padding: '10px 16px 24px',
        display: 'grid',
        gap: 12,
        alignContent: 'start'
      }
    }, /*#__PURE__*/React.createElement(window.SSP.Head, {
      title: "Progress",
      onBack: app.pop
    }), /*#__PURE__*/React.createElement(Tabs, {
      items: [{
        id: 'pace',
        label: 'Pace trend'
      }, {
        id: 'metrics',
        label: 'Metric trends'
      }],
      value: trendTab,
      onChange: setTrendTab
    }), trendTab === 'pace' ? /*#__PURE__*/React.createElement(Card, {
      title: "Fastest ball, this season",
      action: /*#__PURE__*/React.createElement(Badge, {
        tone: "good"
      }, "+7.8 km/h")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 7,
        alignItems: 'flex-end',
        height: 110
      }
    }, pace.map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'grid',
        gap: 4,
        justifyItems: 'center',
        alignContent: 'end',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: (v - 100) * 6,
        background: i === pace.length - 1 ? 'var(--cherry)' : 'var(--ink)',
        borderRadius: 2
      }
    }), marks[i] ? /*#__PURE__*/React.createElement("div", {
      style: {
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: marks[i] === 'drill' ? 'var(--amber)' : 'var(--turf)'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        height: 5
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 18,
        marginTop: 10,
        font: '500 10px/1 var(--font-mono)',
        color: 'var(--ink-3)'
      }
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: 'var(--amber)',
        marginRight: 5
      }
    }), "DRILL STARTED"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: 'var(--turf)',
        marginRight: 5
      }
    }), "RETEST PASSED")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 11px/1.6 var(--font-mono)',
        color: 'var(--ink-3)',
        marginTop: 8
      }
    }, "Within-season only \u2014 off-season gaps make continuous lines lie.")) : /*#__PURE__*/React.createElement(Card, {
      title: "Determinants over the season"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 14
      }
    }, [['Front knee at release', '141° → 148°', 'good'], ['Run-up speed', '5.0 → 5.2 m/s', 'good'], ['Arm delay', '0.15 → 0.14 s', 'neutral'], ['Trunk flexion', '38° → 38°', 'neutral']].map(([n, v, t]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 13px/1.3 var(--font-ui)'
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 12px/1 var(--font-mono)',
        color: t === 'good' ? 'var(--turf-deep)' : 'var(--ink-3)'
      }
    }, v))))));
  }
  const paceCard = /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Current pace",
    value: cv(latest.best),
    unit: unit,
    band: cv(latest.band),
    sample: latest.date,
    size: "lg"
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "good"
  }, "+1.3 vs last")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      alignItems: 'flex-end',
      height: 34,
      marginTop: 12,
      cursor: 'pointer'
    },
    onClick: () => app.push('trends')
  }, [108.4, 110.1, 109.2, 112.6, 113.8, 114.9, latest.best].map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: Math.max((v - 104) * 2.6, 3),
      background: i === 6 ? 'var(--cherry)' : 'var(--band-fill)',
      opacity: i === 6 ? 1 : .28,
      borderRadius: 1.5
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 10.5px/1 var(--font-mono)',
      color: 'var(--ink-3)',
      marginTop: 8
    }
  }, "SEASON TREND \xB7 TAP FOR PROGRESS"));
  const loadCard = /*#__PURE__*/React.createElement(Card, {
    pad: 14,
    style: {
      cursor: 'pointer'
    },
    onClick: () => app.setTab('load')
  }, /*#__PURE__*/React.createElement(WorkloadMeter, {
    label: "This week",
    used: 14,
    limit: 21,
    unit: "overs",
    guideline: `${app.user.u18 ? 'U17' : 'Senior'} guideline · illustrative`
  }));
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S10 Home",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 18px/1 var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '.02em'
    }
  }, "Sightscreen"), app.user.u18 ? /*#__PURE__*/React.createElement(Badge, null, "U17 account") : /*#__PURE__*/React.createElement(NS.IconButton, {
    name: "settings",
    label: "Settings",
    size: "sm",
    onClick: () => app.setTab('you')
  })), app.user.u18 ? loadCard : paceCard, app.user.u18 ? paceCard : loadCard, /*#__PURE__*/React.createElement(Card, {
    pad: 14,
    style: {
      cursor: 'pointer'
    },
    onClick: () => app.push('drill', {
      id: 'brace'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 17,
    color: "var(--cherry)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13.5px/1.2 var(--font-ui)'
    }
  }, "Next: front-leg brace, then retest"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11.5px/1.4 var(--font-ui)',
      color: 'var(--ink-2)',
      marginTop: 2
    }
  }, "Your one thing from the last session.")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 15,
    color: "var(--ink-3)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 11px/1 var(--font-ui)',
      letterSpacing: 'var(--track-caps)',
      textTransform: 'uppercase',
      color: 'var(--ink-2)'
    }
  }, "Recent sessions"), /*#__PURE__*/React.createElement("a", {
    style: {
      font: '600 12px/1 var(--font-ui)',
      cursor: 'pointer'
    },
    onClick: () => app.push('history')
  }, "All sessions")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, app.sessions.slice(0, 3).map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.id,
    pad: 13,
    style: {
      cursor: 'pointer'
    },
    onClick: () => app.push('review', {
      id: s.id
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-ui)'
    }
  }, s.label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11px/1 var(--font-mono)',
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, s.date, " \xB7 ", s.balls, " balls")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 19px/1 var(--font-display)'
    }
  }, cv(s.best)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 10px/1 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, " \xB1", cv(s.band))), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 15,
    color: "var(--ink-3)"
  })))))));
}
Object.assign(__ds_scope, { ProtoHome });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/prototype/ProtoHome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/prototype/ProtoImprove.jsx
try { (() => {
const drills = {
  brace: {
    name: 'Front-leg brace',
    det: 'Front knee at release',
    cues: ['Land heel-first, toes to the sky', 'Push tall through the front hip', 'Chest stays up as the arm fires'],
    reps: '3 × 6 balls, short run',
    feel: 'The front leg lands like a pole, not a spring. You should feel taller at release, and the ball should come out in front of you.'
  },
  rhythm: {
    name: 'Run-up rhythm',
    det: 'Run-up speed',
    cues: ['Build, don’t sprint', 'Last four steps quickest', 'Hit the crease accelerating'],
    reps: '4 run-throughs, then 2 × 6 balls',
    feel: 'The approach feels downhill. No gather-and-stall in the last two strides.'
  },
  delay: {
    name: 'Arm delay',
    det: 'Arm delay',
    cues: ['Front arm pulls first', 'Bowling arm stays long and late', 'Snap through, don’t push'],
    reps: '2 × 6 balls off a walk-in',
    feel: 'A stretch across the chest just before the arm comes over — the sling, not the shove.'
  },
  stack: {
    name: 'Trunk stack',
    det: 'Trunk flexion at release',
    cues: ['Drive forward, not sideways', 'Head chases the target', 'Finish over the front leg'],
    reps: '3 × 6 balls, three-quarter pace',
    feel: 'The follow-through carries you down the pitch instead of falling away to the off side.'
  }
};
function ProtoImprove({
  app,
  view
}) {
  const {
    NS
  } = window.SSP;
  const {
    Card,
    Badge,
    Button,
    Icon,
    Metric
  } = NS;
  const u18 = app.user.u18;
  if (view.v === 'drill') {
    const d = drills[view.id] || drills.brace;
    return /*#__PURE__*/React.createElement("div", {
      "data-screen-label": "S41 Drill detail",
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 16px 24px'
      }
    }, /*#__PURE__*/React.createElement(window.SSP.Head, {
      title: d.name,
      onBack: app.pop,
      right: /*#__PURE__*/React.createElement(Badge, null, d.det)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'grid',
        gap: 12,
        alignContent: 'start',
        marginTop: 4,
        overflowY: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 180,
        background: 'var(--ink)',
        borderRadius: 'var(--radius-2)',
        display: 'grid',
        placeContent: 'center',
        justifyItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 30,
      color: "var(--chalk)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '500 10px/1 var(--font-mono)',
        letterSpacing: '.1em',
        color: 'rgba(242,240,233,.7)'
      }
    }, "DEMONSTRATION VIDEO")), /*#__PURE__*/React.createElement(Card, {
      title: "Cues"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 8
      }
    }, d.cues.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: c,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 13px/1 var(--font-display)',
        color: 'var(--cherry)'
      }
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 14px/1.4 var(--font-ui)'
      }
    }, c))))), /*#__PURE__*/React.createElement(Card, {
      title: "Prescription"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '500 13px/1.5 var(--font-mono)',
        color: 'var(--ink-2)'
      }
    }, d.reps)), /*#__PURE__*/React.createElement(Card, {
      title: "What should feel different"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 13px/1.55 var(--font-ui)',
        color: 'var(--ink-2)'
      }
    }, d.feel))), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      full: true,
      icon: "video",
      onClick: () => {
        app.setCaptureType('Drill check');
        app.push('capture');
      },
      style: {
        marginTop: 12
      }
    }, "Retest this in your next session"));
  }
  if (view.v === 'retest') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S42 Retest comparison",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(window.SSP.Head, {
    title: "Retest \u2014 front-leg brace",
    onBack: app.pop
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, ['BEFORE · 2 AUG', 'AFTER · 15 AUG'].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      position: 'relative',
      height: 150,
      background: 'var(--ink)',
      borderRadius: 'var(--radius-2)',
      display: 'grid',
      placeContent: 'center',
      justifyItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 22,
    color: "var(--chalk)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 8.5px/1 var(--font-mono)',
      letterSpacing: '.1em',
      color: 'rgba(242,240,233,.7)'
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 10.5px/1 var(--font-mono)',
      color: 'var(--ink-3)',
      textAlign: 'center'
    }
  }, "SYNCHRONISED AT FRONT-FOOT CONTACT"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Front knee at release",
    value: "148 \u2192 153",
    unit: "\xB0",
    band: 5,
    size: "sm"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Speed change",
    value: "+2.8",
    unit: "km/h",
    band: 1.4,
    size: "sm",
    tone: "var(--turf)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12.5px/1.55 var(--font-ui)',
      color: 'var(--ink-2)',
      marginTop: 12,
      paddingTop: 12,
      borderTop: 'var(--border-hair)'
    }
  }, "The change is bigger than its error band \u2014 this one's real. Keep the drill for one more week, then move to the next limiter.")), u18 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      padding: '12px 14px',
      background: 'var(--chalk)',
      border: 'var(--border-hair)',
      borderRadius: 'var(--radius-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 16,
    color: "var(--ink-2)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12.5px/1.5 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Sharing is off for under-18 accounts until your guardian turns it on.")) : /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    full: true,
    icon: "share-2",
    onClick: app.openShare
  }, "Share this comparison"));
  if (view.v === 'library') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S43 Drill library",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 10,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(window.SSP.Head, {
    title: "Drill library",
    onBack: app.pop
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12.5px/1.5 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "One drill per determinant. Small on purpose \u2014 the app prescribes; the library is for the curious."), Object.entries(drills).map(([id, d]) => /*#__PURE__*/React.createElement(Card, {
    key: id,
    pad: 14,
    style: {
      cursor: 'pointer'
    },
    onClick: () => app.push('drill', {
      id
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.2 var(--font-ui)'
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 11px/1 var(--font-mono)',
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, d.det)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "var(--ink-3)"
  })))));
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S40 Improve home",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 18px/1 var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '.02em'
    }
  }, "Improve"), /*#__PURE__*/React.createElement(Badge, {
    tone: "watch"
  }, "Retest due")), /*#__PURE__*/React.createElement(Card, {
    title: "Current focus",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "inverse"
    }, "Week 2")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 20px/1.15 var(--font-display)'
    }
  }, "Brace your front knee"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12.5px/1.5 var(--font-ui)',
      color: 'var(--ink-2)',
      marginTop: 6
    }
  }, "2 drill sessions done since the insight. Enough bowling has passed \u2014 time to check it stuck."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    full: true,
    icon: "video",
    onClick: () => {
      app.setCaptureType('Drill check');
      app.push('capture');
    }
  }, "Retest \u2014 bowl a drill check"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    full: true,
    onClick: () => app.push('drill', {
      id: 'brace'
    })
  }, "Open the drill"))), /*#__PURE__*/React.createElement(Card, {
    pad: 14,
    style: {
      cursor: 'pointer'
    },
    onClick: () => app.push('retest')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-ui)'
    }
  }, "Last retest \u2014 front-leg brace"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 11px/1 var(--font-mono)',
      color: 'var(--turf-deep)',
      marginTop: 4
    }
  }, "+2.8 \xB11.4 km/h \xB7 verified")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "var(--ink-3)"
  }))), /*#__PURE__*/React.createElement(Card, {
    pad: 14,
    style: {
      cursor: 'pointer'
    },
    onClick: () => app.push('library')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-ui)'
    }
  }, "Drill library"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "var(--ink-3)"
  }))));
}
Object.assign(__ds_scope, { ProtoImprove });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/prototype/ProtoImprove.jsx", error: String((e && e.message) || e) }); }

// ui_kits/prototype/ProtoLoad.jsx
try { (() => {
function ProtoLoad({
  app,
  view
}) {
  const {
    NS
  } = window.SSP;
  const {
    Card,
    Badge,
    Button,
    Icon,
    WorkloadMeter,
    SegmentedControl
  } = NS;
  const [span, setSpan] = React.useState('Week');
  const days = [['M', 18], ['T', 0], ['W', 24], ['T', 12], ['F', 0], ['S', 30], ['S', app.extraBalls || 0]];
  const weekBalls = days.reduce((a, [, v]) => a + v, 0);
  if (view.v === 'rest') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S52 Rest guidance",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(window.SSP.Head, {
    title: "Bowl light today",
    onBack: app.pop,
    right: /*#__PURE__*/React.createElement(Badge, {
      tone: "watch"
    }, "Advice")
  }), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13.5px/1.6 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "You've bowled three of the last four days and your rolling 7-day load is near the ", app.user.u18 ? 'U17' : 'senior', " guideline. The research ties injury risk to the 7-day peak more than any single day \u2014 today is the cheap day to go easy.")), /*#__PURE__*/React.createElement(Card, {
    title: "Still useful today"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, [['Front-leg brace, no ball', 'Walk-throughs against a wall — serves your current focus'], ['Run-up rhythm only', 'Run-throughs without bowling cost nothing'], ['Watch your last session', 'Two minutes on the insight beats six overs of grooving the fault']].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13.5px/1.2 var(--font-ui)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px/1.5 var(--font-ui)',
      color: 'var(--ink-2)',
      marginTop: 2
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px/1.6 var(--font-ui)',
      color: 'var(--ink-3)'
    }
  }, "The app advises, you decide. Nothing is blocked \u2014 but the ledger keeps honest count either way."));
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S50 Workload",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 18px/1 var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '.02em'
    }
  }, "Load"), /*#__PURE__*/React.createElement(SegmentedControl, {
    size: "sm",
    options: ['Week', 'Season'],
    value: span,
    onChange: setSpan
  })), /*#__PURE__*/React.createElement(Card, {
    pad: 14,
    style: {
      cursor: 'pointer'
    },
    onClick: () => app.push('rest')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "watch"
  }, "Bowl light"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12.5px/1.4 var(--font-ui)',
      color: 'var(--ink-2)',
      flex: 1
    }
  }, "Three days in a row \u2014 see why and what's still useful today."), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 15,
    color: "var(--ink-3)"
  }))), span === 'Week' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    title: "Deliveries by day"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-end',
      height: 90
    }
  }, days.map(([d, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'grid',
      gap: 4,
      justifyItems: 'center',
      alignContent: 'end',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 9.5px/1 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, v || ''), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: Math.max(v * 2, 2),
      background: i === 6 ? 'var(--cherry)' : v ? 'var(--ink)' : 'var(--band-track)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 10px/1 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, d))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(WorkloadMeter, {
    label: "Rolling 7 days",
    used: Math.round(weekBalls / 6 * 10) / 10,
    limit: 21,
    unit: "overs",
    guideline: `${app.user.u18 ? 'U17' : 'Senior'} guideline · illustrative figures`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11px/1.6 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, "3 spells this week \xB7 match balls weighted heavier \xB7 uncaptured sessions can be added by hand \u2014 a ledger that only counts filmed balls is worse than useless."))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    full: true,
    icon: "plus",
    onClick: () => app.note('Manual entry added: 4 overs, net weighting.')
  }, "Add an uncaptured session")) : /*#__PURE__*/React.createElement(Card, {
    title: "Season",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "watch"
    }, "Ramp flagged")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      alignItems: 'flex-end',
      height: 80
    }
  }, [8, 10, 9, 0, 0, 4, 12, 16, 14, 18, 22, 26].map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: Math.max(v * 2.6, 2),
      background: i > 9 ? 'var(--amber)' : v ? 'var(--ink)' : 'var(--band-track)',
      borderRadius: 2
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12.5px/1.55 var(--font-ui)',
      color: 'var(--ink-2)',
      marginTop: 12
    }
  }, "Load is up sharply since the June break \u2014 sudden ramps after time off are a documented risk, and exactly what chasing pace invites. Build over three weeks, not one.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      padding: '12px 14px',
      background: 'var(--turf-tint)',
      border: '1px solid var(--turf-soft)',
      borderRadius: 'var(--radius-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 16,
    color: "var(--turf-deep)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12.5px/1.5 var(--font-ui)',
      color: 'var(--turf-deep)'
    }
  }, "The ledger is free forever. Safety never sits behind a paywall.")));
}
Object.assign(__ds_scope, { ProtoLoad });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/prototype/ProtoLoad.jsx", error: String((e && e.message) || e) }); }

// ui_kits/prototype/ProtoOnboarding.jsx
try { (() => {
function ProtoOnboarding({
  onDone,
  note
}) {
  const {
    NS
  } = window.SSP;
  const {
    Button,
    Input,
    Select,
    Radio,
    Tag,
    Icon
  } = NS;
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
  const years = Array.from({
    length: 40
  }, (_, i) => String(2016 - i));
  const finish = first => onDone({
    u18,
    yob,
    arm,
    type,
    ht,
    span,
    tgt,
    fix,
    unit: 'km/h',
    consentPending: u18
  }, first);
  const next = () => setStep(s => s === 1 && !u18 ? 3 : s + 1);
  const Frame = ({
    label,
    title,
    sub,
    children,
    cta,
    onCta,
    ghost,
    onGhost,
    disabled
  }) => /*#__PURE__*/React.createElement("div", {
    "data-screen-label": label,
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '14px 20px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 10px/1 var(--font-mono)',
      letterSpacing: '.1em',
      color: 'var(--ink-3)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 30px/1.08 var(--font-display)',
      marginTop: 14
    }
  }, title), sub ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13.5px/1.5 var(--font-ui)',
      color: 'var(--ink-2)',
      marginTop: 8
    }
  }, sub) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gap: 14,
      alignContent: 'start',
      marginTop: 18,
      overflowY: 'auto'
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      marginTop: 14
    }
  }, cta ? /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    onClick: onCta,
    disabled: disabled
  }, cta) : null, ghost ? /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    full: true,
    onClick: onGhost
  }, ghost) : null));
  if (step === 0) return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S01 Welcome",
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '14px 20px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      alignContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 34px/1 var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '.015em'
    }
  }, "Sightscreen"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 26px/1.15 var(--font-display)'
    }
  }, "One phone video. One thing to change. Bowl quicker."), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px/1.55 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Sightscreen measures your action from a single clip \u2014 speed with its error band, the one biggest opportunity in your action, and the workload limits that protect your back. No account needed for your first session.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    onClick: () => setStep(1)
  }, "Get started"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    full: true,
    onClick: () => note('Sign-in comes later — your first session runs without an account.')
  }, "I already have an account")));
  if (step === 1) return /*#__PURE__*/React.createElement(Frame, {
    label: "S02 Age gate",
    title: "When were you born?",
    sub: "So we can set safe bowling limits \u2014 they change with age.",
    cta: "Continue",
    onCta: next
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Year of birth",
    options: years,
    value: yob,
    onChange: e => setYob(e.target.value),
    hint: u18 ? 'Under-18: workload comes first and a guardian is looped in.' : 'Adult guidelines apply.'
  }));
  if (step === 2) return /*#__PURE__*/React.createElement(Frame, {
    label: "S03 Guardian consent",
    title: "A guardian signs off",
    sub: "They get an email and consent on their own device. Until then: recording and workload work, sharing doesn't.",
    cta: sent ? 'Continue' : 'Send consent request',
    onCta: () => {
      if (sent) next();else {
        setSent(true);
        note('Consent request sent. The app keeps working meanwhile.');
      }
    },
    ghost: "Do this later",
    onGhost: next,
    disabled: !sent && !gmail.includes('@')
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Guardian email",
    placeholder: "name@example.com",
    value: gmail,
    onChange: e => setGmail(e.target.value),
    icon: "mail"
  }), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 12px/1.5 var(--font-mono)',
      color: 'var(--turf-deep)'
    }
  }, "Sent. Status: pending \u2014 read-only workload access for your guardian, alerts on limit breaches, no access to your video by default.") : null);
  if (step === 3) return /*#__PURE__*/React.createElement(Frame, {
    label: "S04 Bowler profile",
    title: "Your action, on paper",
    cta: "Continue",
    onCta: next
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Radio, {
    name: "arm",
    value: "right",
    label: "Right arm",
    checked: arm === 'right',
    onChange: setArm
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "arm",
    value: "left",
    label: "Left arm",
    checked: arm === 'left',
    onChange: setArm
  })), /*#__PURE__*/React.createElement(Select, {
    label: "Bowling type",
    options: ['Pace', 'Fast-medium', 'Medium', 'Spin'],
    value: type,
    onChange: e => setType(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Height",
    suffix: "cm",
    inputMode: "numeric",
    value: ht,
    onChange: e => setHt(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Arm span",
    suffix: "cm",
    inputMode: "numeric",
    value: span,
    onChange: e => setSpan(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px/1.55 var(--font-ui)',
      color: 'var(--ink-3)'
    }
  }, "Why arm span: it correlates strongly with release speed and it can't be changed. Better you know what's levers and what's given, from minute one."));
  if (step === 4) return /*#__PURE__*/React.createElement(Frame, {
    label: "S05 Goals",
    title: "Where are you headed?",
    sub: "Optional \u2014 it frames your first insight.",
    cta: "Continue",
    onCta: next,
    ghost: "Skip",
    onGhost: next
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Target speed",
    suffix: "km/h",
    inputMode: "numeric",
    value: tgt,
    onChange: e => setTgt(e.target.value)
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 12px/1 var(--font-ui)',
      letterSpacing: 'var(--track-caps)',
      textTransform: 'uppercase',
      color: 'var(--ink-2)',
      marginBottom: 8
    }
  }, "What do you want to fix?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, ['More pace', 'Smoother action', 'Stay injury-free'].map(f => /*#__PURE__*/React.createElement(Tag, {
    key: f,
    selected: fix === f,
    onClick: () => setFix(f)
  }, f)))));
  if (step === 5) return /*#__PURE__*/React.createElement(Frame, {
    label: "S06 Permissions",
    title: "We'll ask when it matters",
    sub: "Each permission is requested at the moment it's needed, not now.",
    cta: "Continue",
    onCta: next
  }, [['camera', 'Camera', 'Asked right before your first recording.'], ['hard-drive', 'Storage', '240 fps clips are big; kept on this phone.'], ['bell', 'Notifications', 'Only workload alerts, retest prompts and “processing done”. Nothing else — asked after your first session.']].map(([ic, t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      padding: '12px 14px',
      background: 'var(--paper)',
      border: 'var(--border-hair)',
      borderRadius: 'var(--radius-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18,
    color: "var(--ink-2)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-ui)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12.5px/1.5 var(--font-ui)',
      color: 'var(--ink-2)',
      marginTop: 3
    }
  }, d)))));
  return /*#__PURE__*/React.createElement(Frame, {
    label: "S07 Setup tutorial",
    title: "Stand the phone here",
    cta: "Bowl your first session",
    onCta: () => finish(true),
    ghost: "Go to home",
    onGhost: () => finish(false)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 210,
      background: 'var(--ink)',
      borderRadius: 'var(--radius-2)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 26,
      right: 26,
      top: 24,
      bottom: 56,
      border: '1.5px solid var(--chalk)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 56,
      height: 1.5,
      background: 'rgba(242,240,233,.45)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 16,
      textAlign: 'center',
      font: '500 9.5px/1.8 var(--font-mono)',
      letterSpacing: '.09em',
      color: 'rgba(242,240,233,.8)'
    }
  }, "SIDE-ON \xB7 LEVEL WITH THE POPPING CREASE", /*#__PURE__*/React.createElement("br", null), "8\u201310 M FROM THE PITCH \xB7 TRIPOD AT HIP HEIGHT")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.6 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Landscape, side-on, crease and stumps both in frame. The app checks all of this live before you bowl \u2014 you can't silently get it wrong."));
}
Object.assign(__ds_scope, { ProtoOnboarding });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/prototype/ProtoOnboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/prototype/ProtoReview.jsx
try { (() => {
function ProtoReview({
  app,
  view
}) {
  const {
    NS,
    cvv
  } = window.SSP;
  const {
    Card,
    Metric,
    CueCard,
    Badge,
    Icon,
    Button,
    SegmentedControl
  } = NS;
  const s = app.sessions.find(x => x.id === view.id) || app.sessions[0];
  const unit = app.user.unit;
  const cv = v => cvv(v, unit);
  const metrics = [{
    id: 'knee',
    name: 'Front knee at release',
    val: '148',
    unit: '°',
    band: 5,
    ref: 'Faster bowlers: >150°',
    mean: 'A braced, straight front leg converts run-up momentum into ball speed. Yours collapses slightly.',
    range: {
      min: 120,
      max: 180,
      good: [150, 180]
    }
  }, {
    id: 'runup',
    name: 'Run-up speed',
    val: '5.2',
    unit: 'm/s',
    band: 0.3,
    ref: 'Faster bowlers: 5.5–7.0 m/s',
    mean: 'Momentum in is speed out — but only if the front leg can brace against it.',
    range: {
      min: 3,
      max: 8,
      good: [5.5, 7]
    }
  }, {
    id: 'delay',
    name: 'Arm delay',
    val: '0.14',
    unit: 's',
    band: 0.02,
    ref: 'Faster bowlers: 0.10–0.13 s',
    mean: 'The lag between front-foot contact and the arm firing. Longer isn’t better past a point.',
    range: {
      min: 0.05,
      max: 0.25,
      good: [0.10, 0.13]
    }
  }, {
    id: 'trunk',
    name: 'Trunk flexion at release',
    val: '38',
    unit: '°',
    band: 6,
    ref: 'Typical band: 25–45°',
    mean: 'Forward trunk drive adds speed; sideways collapse costs it and loads the back.',
    range: {
      min: 0,
      max: 60,
      good: [25, 45]
    }
  }];
  if (view.v === 'insight') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S33 The one insight",
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px 16px 24px'
    }
  }, /*#__PURE__*/React.createElement(window.SSP.Head, {
    title: "The one insight",
    onBack: app.pop
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gap: 14,
      alignContent: 'start',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(CueCard, {
    cue: "Brace your front knee",
    gain: "+3\u20136 km/h estimated",
    detail: "At release your knee sits at 148\xB0 \xB15\xB0 \u2014 quicker bowlers hold above 150\xB0. Land heel-first and push tall through the front leg."
  }), /*#__PURE__*/React.createElement(Card, {
    title: "Why this one"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.6 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Two limiters were close \u2014 front knee and run-up speed. The knee comes first because it's safer and easier to change, and a faster run-up without a brace just leaks more speed. One thing at a time; the rest waits on Improve.")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11px/1.6 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, "Chosen from ", s.balls, " deliveries \xB7 confidence-weighted \xB7 low-confidence balls excluded")), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    icon: "play",
    onClick: () => app.push('drill', {
      id: 'brace'
    })
  }, "Start the drill"));
  if (view.v === 'explainer') {
    const m = metrics.find(x => x.id === view.mid) || metrics[0];
    return /*#__PURE__*/React.createElement("div", {
      "data-screen-label": "S32 Metric explainer",
      style: {
        padding: '10px 16px 24px',
        display: 'grid',
        gap: 12,
        alignContent: 'start'
      }
    }, /*#__PURE__*/React.createElement(window.SSP.Head, {
      title: m.name,
      onBack: app.pop
    }), /*#__PURE__*/React.createElement(Metric, {
      label: "Yours",
      value: m.val,
      unit: m.unit,
      band: m.band,
      size: "md",
      range: m.range
    }), [['What it is', m.mean], ['Why it links to speed', m.ref + '. The correlation is one of the few consistent findings across fast-bowling studies.'], ['How it’s measured here', 'Pose estimation on your 240 fps clip, read at the release frame. The ± band is the model’s uncertainty on your video — light, angle and distance move it.'], ['Limitations', 'A single side-on phone view can’t see everything; small angle errors are expected. Low-confidence deliveries are flagged and left out of trends, never silently included.'], ['Research', 'Portus et al. (2004), J Sports Sci — front-leg kinematics and release speed. Summarised in plain language; the full citation list is in Settings.']].map(([h, b]) => /*#__PURE__*/React.createElement("div", {
      key: h
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 11px/1 var(--font-ui)',
        letterSpacing: 'var(--track-caps)',
        textTransform: 'uppercase',
        color: 'var(--ink-2)',
        marginBottom: 5
      }
    }, h), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 13px/1.55 var(--font-ui)',
        color: 'var(--ink-2)'
      }
    }, b))));
  }
  if (view.v === 'delivery') {
    const d = s.d[view.n - 1] || s.d[0];
    return /*#__PURE__*/React.createElement("div", {
      "data-screen-label": "S31 Delivery detail",
      style: {
        padding: '10px 16px 24px',
        display: 'grid',
        gap: 12,
        alignContent: 'start'
      }
    }, /*#__PURE__*/React.createElement(window.SSP.Head, {
      title: `Delivery ${d.n}`,
      onBack: app.pop,
      right: d.conf === 'low' ? /*#__PURE__*/React.createElement(Badge, {
        tone: "watch"
      }, "Low confidence") : /*#__PURE__*/React.createElement(Badge, {
        tone: "good"
      }, "Confident")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 200,
        background: 'var(--ink)',
        borderRadius: 'var(--radius-2)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeContent: 'center',
        justifyItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 30,
      color: "var(--chalk)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '500 10px/1 var(--font-mono)',
        letterSpacing: '.1em',
        color: 'rgba(242,240,233,.7)'
      }
    }, "VIDEO + SKELETON OVERLAY \xB7 FRAME-STEP"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 9,
        height: 4,
        background: 'var(--band-track)',
        borderRadius: 2
      }
    }), [['BFC', 22], ['FFC', 46], ['REL', 58]].map(([t, x]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        position: 'absolute',
        left: x + '%',
        top: 0,
        display: 'grid',
        justifyItems: 'center',
        gap: 2,
        transform: 'translateX(-50%)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 2,
        height: 12,
        background: 'var(--ink)',
        marginTop: 5
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '500 8.5px/1 var(--font-mono)',
        color: 'var(--ink-3)'
      }
    }, t))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '58%',
        top: 5,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: 'var(--cherry)',
        border: '2px solid var(--paper)',
        transform: 'translateX(-50%)'
      }
    })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Metric, {
      label: "Ball speed",
      value: cv(d.speed),
      unit: unit,
      band: cv(d.band),
      sample: "this delivery",
      size: "md"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 8
      }
    }, metrics.map(m => /*#__PURE__*/React.createElement(Card, {
      key: m.id,
      pad: 13,
      style: {
        cursor: 'pointer'
      },
      onClick: () => app.push('explainer', {
        mid: m.id
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13.5px/1.25 var(--font-ui)'
      }
    }, m.name, " \u2014 ", m.val, m.unit, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 11px/1 var(--font-mono)',
        color: 'var(--ink-3)'
      }
    }, "\xB1", m.band, m.unit)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '500 11.5px/1.4 var(--font-mono)',
        color: 'var(--ink-3)',
        marginTop: 4
      }
    }, m.ref), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 12.5px/1.5 var(--font-ui)',
        color: 'var(--ink-2)',
        marginTop: 4
      }
    }, m.mean)), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      color: "var(--ink-3)",
      style: {
        marginTop: 2
      }
    }))))));
  }
  const sp = s.d.map(x => x.speed);
  const fast = Math.max(...sp),
    slow = Math.min(...sp);
  const delta = s.prev ? Math.round((s.best - s.prev) * 10) / 10 : null;
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S30 Session review",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(window.SSP.Head, {
    title: `${s.label} · ${s.date}`,
    onBack: app.pop,
    right: /*#__PURE__*/React.createElement(SegmentedControl, {
      size: "sm",
      options: ['km/h', 'mph'],
      value: unit,
      onChange: app.setUnit
    })
  }), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Fastest ball",
    value: cv(s.best),
    unit: unit,
    band: cv(s.band),
    sample: `from ${s.frames} frames`,
    size: "lg"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Average",
    value: cv(s.avg),
    unit: unit,
    band: cv(s.avgBand),
    size: "sm"
  })), delta != null ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 12px/1.5 var(--font-mono)',
      color: delta >= 0 ? 'var(--turf-deep)' : 'var(--ink-2)',
      marginTop: 12,
      paddingTop: 12,
      borderTop: 'var(--border-hair)'
    }
  }, delta >= 0 ? '+' : '', cv(Math.abs(delta)) * Math.sign(delta) || delta, " ", unit, " vs last session \u2014 within the \xB1", cv(s.band), " band, so treat it as level.") : null), /*#__PURE__*/React.createElement(CueCard, {
    cue: "Brace your front knee",
    gain: "+3\u20136 km/h estimated",
    detail: "Your biggest opportunity this session. See why it was chosen ahead of the others.",
    actionLabel: "See the one insight",
    onAction: () => app.push('insight', {
      id: s.id
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 11px/1 var(--font-ui)',
      letterSpacing: 'var(--track-caps)',
      textTransform: 'uppercase',
      color: 'var(--ink-2)',
      marginTop: 2
    }
  }, "Deliveries"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, s.d.map(d => /*#__PURE__*/React.createElement(Card, {
    key: d.n,
    pad: 12,
    style: {
      cursor: 'pointer'
    },
    onClick: () => app.push('delivery', {
      id: s.id,
      n: d.n
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 24,
      background: 'var(--ink)',
      borderRadius: 3,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1 var(--font-ui)',
      width: 22
    }
  }, d.n), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13px/1 var(--font-mono)',
      flex: 1
    }
  }, cv(d.speed), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)',
      fontSize: 11
    }
  }, "\xB1", cv(d.band), " ", unit)), d.speed === fast ? /*#__PURE__*/React.createElement(Badge, {
    tone: "inverse"
  }, "Fastest") : null, d.speed === slow ? /*#__PURE__*/React.createElement(Badge, null, "Slowest") : null, d.conf === 'low' ? /*#__PURE__*/React.createElement(Badge, {
    tone: "watch"
  }, "Low conf") : null, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 15,
    color: "var(--ink-3)"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 10.5px/1.6 var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, "Low-confidence deliveries stay visible but sit outside your trend. Speeds shown with their error band \u2014 never a false-precision decimal."));
}
Object.assign(__ds_scope, { ProtoReview });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/prototype/ProtoReview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/prototype/ProtoYou.jsx
try { (() => {
function ProtoYou({
  app,
  view
}) {
  const {
    NS
  } = window.SSP;
  const {
    Card,
    Badge,
    Button,
    Icon,
    Switch,
    SegmentedControl,
    Dialog
  } = NS;
  const [notif, setNotif] = React.useState(true);
  const [del, setDel] = React.useState(false);
  const u = app.user;
  if (view.v === 'sub') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S71 Subscription",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(window.SSP.Head, {
    title: "Subscription",
    onBack: app.pop,
    right: /*#__PURE__*/React.createElement(Badge, null, "Free")
  }), /*#__PURE__*/React.createElement(Card, {
    title: "This month",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: app.monthUsed >= 3 ? 'watch' : 'good'
    }, Math.min(app.monthUsed, 3), " of 3 used")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.55 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Three analysed sessions a month, the full speed log and the whole workload ledger are free \u2014 the ledger stays free forever.")), /*#__PURE__*/React.createElement(Card, {
    title: "Pro"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 7
    }
  }, ['Unlimited analysed sessions', 'Full metric breakdown per delivery', 'Retest comparisons', 'Trends and season history', 'Drill library and export'].map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: 'flex',
      gap: 9,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    color: "var(--turf)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 13px/1.4 var(--font-ui)'
    }
  }, f)))), /*#__PURE__*/React.createElement(Button, {
    full: true,
    onClick: app.openPay,
    style: {
      marginTop: 14
    }
  }, "See plans")));
  if (view.v === 'linked') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S72 Linked accounts",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(window.SSP.Head, {
    title: "Linked accounts",
    onBack: app.pop
  }), u.u18 ? /*#__PURE__*/React.createElement(Card, {
    title: "Guardian",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: u.consentPending ? 'watch' : 'good'
    }, u.consentPending ? 'Pending' : 'Linked')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.55 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Read-only workload access and alerts if a limit is breached. No access to your video by default. Until consent returns, sharing stays off."), u.consentPending ? /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    full: true,
    style: {
      marginTop: 12
    },
    onClick: () => app.note('Consent request re-sent.')
  }, "Re-send request") : null) : null, /*#__PURE__*/React.createElement(Card, {
    title: "Coach"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.55 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Invite a coach to see your sessions and trends. They see measurements, not billing."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    full: true,
    style: {
      marginTop: 12
    },
    onClick: () => app.note('Coach invite link copied.')
  }, "Invite a coach")));
  if (view.v === 'privacy') return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S73 Data and privacy",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(window.SSP.Head, {
    title: "Data and privacy",
    onBack: app.pop
  }), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.6 var(--font-ui)',
      color: 'var(--ink-2)'
    }
  }, "Your video is processed on this phone and stays on it", u.u18 ? ' — under-18 accounts keep everything on-device unless a guardian opts in' : '', ". Cloud backup only exists once you create an account, and you haven't needed one yet.")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    full: true,
    icon: "download",
    onClick: () => app.note('Export prepared — measurements as CSV, clips as files.')
  }, "Export my data"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    full: true,
    icon: "trash-2",
    onClick: () => setDel(true)
  }, "Delete everything"), /*#__PURE__*/React.createElement(Dialog, {
    open: del,
    title: "Delete everything?",
    onClose: () => setDel(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setDel(false)
    }, "Keep it"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      onClick: () => {
        setDel(false);
        app.resetAll();
      }
    }, "Delete"))
  }, "Every session, measurement and setting on this phone. There's no cloud copy to restore from."));
  const Row = ({
    icon,
    title,
    sub,
    onClick,
    right
  }) => /*#__PURE__*/React.createElement(Card, {
    pad: 13,
    style: {
      cursor: 'pointer'
    },
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17,
    color: "var(--ink-2)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-ui)'
    }
  }, title), sub ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11.5px/1.4 var(--font-ui)',
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, sub) : null), right || /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 15,
    color: "var(--ink-3)"
  })));
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "S70 Profile and settings",
    style: {
      padding: '10px 16px 24px',
      display: 'grid',
      gap: 10,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 18px/1 var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '.02em'
    }
  }, "You"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 16px/1.2 var(--font-ui)'
    }
  }, u.arm === 'left' ? 'Left' : 'Right', "-arm ", u.type.toLowerCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11.5px/1 var(--font-mono)',
      color: 'var(--ink-3)',
      marginTop: 5
    }
  }, u.ht, " cm \xB7 span ", u.span, " cm \xB7 target ", u.tgt, " km/h", u.u18 ? ' · U17 account' : '')), /*#__PURE__*/React.createElement(Badge, {
    tone: "inverse"
  }, "No account yet")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 11.5px/1.5 var(--font-ui)',
      color: 'var(--ink-3)',
      marginTop: 8
    }
  }, "Everything lives on this phone. An account is only needed for backup, sharing or a second device.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 2px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13.5px/1 var(--font-ui)'
    }
  }, "Units"), /*#__PURE__*/React.createElement(SegmentedControl, {
    size: "sm",
    options: ['km/h', 'mph'],
    value: u.unit,
    onChange: app.setUnit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 2px'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Notifications \u2014 workload, retests, processing only",
    checked: notif,
    onChange: setNotif
  })), /*#__PURE__*/React.createElement(Row, {
    icon: "credit-card",
    title: "Subscription",
    sub: `Free · ${Math.min(app.monthUsed, 3)} of 3 analyses used this month`,
    onClick: () => app.push('sub')
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "users",
    title: "Linked accounts",
    sub: u.u18 ? u.consentPending ? 'Guardian consent pending' : 'Guardian linked' : 'Coach and guardian access',
    onClick: () => app.push('linked')
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "lock",
    title: "Data and privacy",
    sub: "On-device by default",
    onClick: () => app.push('privacy')
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    full: true,
    onClick: app.resetAll,
    style: {
      marginTop: 6
    }
  }, "Reset prototype"));
}
Object.assign(__ds_scope, { ProtoYou });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/prototype/ProtoYou.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.CueCard = __ds_scope.CueCard;

__ds_ns.Metric = __ds_scope.Metric;

__ds_ns.WorkloadMeter = __ds_scope.WorkloadMeter;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.RecordScreen = __ds_scope.RecordScreen;

__ds_ns.ResultScreen = __ds_scope.ResultScreen;

__ds_ns.SessionsScreen = __ds_scope.SessionsScreen;

__ds_ns.WorkloadScreen = __ds_scope.WorkloadScreen;

__ds_ns.ProtoCapture = __ds_scope.ProtoCapture;

__ds_ns.ProtoHome = __ds_scope.ProtoHome;

__ds_ns.ProtoImprove = __ds_scope.ProtoImprove;

__ds_ns.ProtoLoad = __ds_scope.ProtoLoad;

__ds_ns.ProtoOnboarding = __ds_scope.ProtoOnboarding;

__ds_ns.ProtoReview = __ds_scope.ProtoReview;

__ds_ns.ProtoYou = __ds_scope.ProtoYou;

})();
