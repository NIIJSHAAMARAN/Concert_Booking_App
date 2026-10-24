import React from 'react';

/* ─── Spinner ─────────────────────────────────────────────────────────── */
export const Spinner = ({ size = 22, color = 'var(--accent)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    style={{ animation: 'spin .75s linear infinite', flexShrink: 0, display:'block' }}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" strokeOpacity=".18" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* ─── Button ──────────────────────────────────────────────────────────── */
export const Btn = ({ children, variant='primary', size='md', loading, disabled, full, style={}, ...p }) => {
  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'7px',
    fontFamily:'var(--font-body)', fontWeight:500, borderRadius:'var(--r)',
    transition:'var(--t)', cursor: (disabled||loading)?'not-allowed':'pointer',
    opacity: (disabled||loading)?0.55:1, border:'none', whiteSpace:'nowrap',
    width: full ? '100%' : undefined,
  };
  const sizes = { sm:{padding:'7px 14px',fontSize:'12.5px'}, md:{padding:'10px 22px',fontSize:'13.5px'}, lg:{padding:'13px 30px',fontSize:'15px'} };
  const vars  = {
    primary:  { background:'var(--accent)', color:'#000', fontWeight:600 },
    secondary:{ background:'var(--surface2)', color:'var(--text)', border:'1px solid var(--border2)' },
    ghost:    { background:'transparent', color:'var(--text2)', border:'1px solid var(--border)' },
    danger:   { background:'var(--red-dim)', color:'var(--red)', border:'1px solid rgba(255,89,89,.22)' },
    success:  { background:'var(--green-dim)', color:'var(--green)', border:'1px solid rgba(61,220,132,.22)' },
  };
  return (
    <button style={{ ...base, ...sizes[size], ...vars[variant], ...style }} disabled={disabled||loading} {...p}>
      {loading && <Spinner size={14} color={variant==='primary'?'#000':'currentColor'} />}
      {children}
    </button>
  );
};

/* ─── Input ───────────────────────────────────────────────────────────── */
export const Input = ({ label, error, hint, icon, ...p }) => (
  <label style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
    {label && <span style={{ fontSize:'12.5px', fontWeight:500, color:'var(--text2)' }}>{label}</span>}
    <div style={{ position:'relative' }}>
      {icon && <span style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', fontSize:'14px', color:'var(--text3)', pointerEvents:'none' }}>{icon}</span>}
      <input
        style={{
          width:'100%', padding: icon ? '10px 13px 10px 36px' : '10px 13px',
          background:'var(--surface)', border:`1px solid ${error?'var(--red)':'var(--border2)'}`,
          borderRadius:'var(--r)', color:'var(--text)', fontSize:'13.5px', transition:'var(--t)',
        }}
        {...p}
      />
    </div>
    {error && <span style={{ fontSize:'11.5px', color:'var(--red)' }}>{error}</span>}
    {hint  && <span style={{ fontSize:'11.5px', color:'var(--text3)' }}>{hint}</span>}
  </label>
);

/* ─── Textarea ────────────────────────────────────────────────────────── */
export const Textarea = ({ label, error, ...p }) => (
  <label style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
    {label && <span style={{ fontSize:'12.5px', fontWeight:500, color:'var(--text2)' }}>{label}</span>}
    <textarea
      style={{
        width:'100%', padding:'10px 13px', background:'var(--surface)',
        border:`1px solid ${error?'var(--red)':'var(--border2)'}`, borderRadius:'var(--r)',
        color:'var(--text)', fontSize:'13.5px', resize:'vertical', minHeight:'80px', transition:'var(--t)',
      }}
      {...p}
    />
    {error && <span style={{ fontSize:'11.5px', color:'var(--red)' }}>{error}</span>}
  </label>
);

/* ─── Select ──────────────────────────────────────────────────────────── */
export const Select = ({ label, error, children, ...p }) => (
  <label style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
    {label && <span style={{ fontSize:'12.5px', fontWeight:500, color:'var(--text2)' }}>{label}</span>}
    <select
      style={{
        width:'100%', padding:'10px 13px', background:'var(--surface)',
        border:`1px solid ${error?'var(--red)':'var(--border2)'}`, borderRadius:'var(--r)',
        color:'var(--text)', fontSize:'13.5px', appearance:'none', cursor:'pointer',
      }}
      {...p}
    >{children}</select>
    {error && <span style={{ fontSize:'11.5px', color:'var(--red)' }}>{error}</span>}
  </label>
);

/* ─── Badge ───────────────────────────────────────────────────────────── */
export const Badge = ({ children, color='var(--accent)', bg='var(--accent-dim)', style={} }) => (
  <span style={{ display:'inline-block', padding:'2px 9px', borderRadius:'20px', fontSize:'10.5px', fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color, background:bg, ...style }}>
    {children}
  </span>
);

/* ─── Card ────────────────────────────────────────────────────────────── */
export const Card = ({ children, style={}, onClick, ...p }) => (
  <div
    onClick={onClick}
    style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'22px', cursor:onClick?'pointer':'default', transition:'var(--t)', ...style }}
    {...p}
  >{children}</div>
);

/* ─── Modal ───────────────────────────────────────────────────────────── */
export const Modal = ({ open, onClose, title, children, maxWidth='520px' }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.78)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px', animation:'fadeIn .18s ease' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:'var(--r-xl)', padding:'30px', width:'100%', maxWidth, animation:'fadeUp .22s ease', maxHeight:'90vh', overflowY:'auto' }}>
        {title && (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'22px' }}>
            <h2 style={{ fontSize:'18px', fontWeight:600, color:'var(--text)' }}>{title}</h2>
            <button onClick={onClose} style={{ background:'none', color:'var(--text3)', fontSize:'18px', cursor:'pointer', border:'none', lineHeight:1, padding:'4px' }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

/* ─── PageLoader ──────────────────────────────────────────────────────── */
export const PageLoader = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
    <Spinner size={38} />
  </div>
);

/* ─── EmptyState ──────────────────────────────────────────────────────── */
export const EmptyState = ({ icon='🎵', title, message, action }) => (
  <div style={{ textAlign:'center', padding:'70px 24px', color:'var(--text2)' }}>
    <div style={{ fontSize:'52px', marginBottom:'14px', opacity:.4 }}>{icon}</div>
    <h3 style={{ fontSize:'17px', color:'var(--text)', marginBottom:'8px' }}>{title}</h3>
    <p style={{ fontSize:'14px', marginBottom: action ? '22px' : 0 }}>{message}</p>
    {action}
  </div>
);

/* ─── StatCard ────────────────────────────────────────────────────────── */
export const StatCard = ({ label, value, accent }) => (
  <div style={{ background: accent?'var(--accent-dim)':'var(--surface)', border:`1px solid ${accent?'rgba(232,255,90,.18)':'var(--border)'}`, borderRadius:'var(--r-lg)', padding:'18px 22px' }}>
    <div style={{ fontSize:'11px', color: accent?'var(--accent)':'var(--text2)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.07em', marginBottom:'7px' }}>{label}</div>
    <div style={{ fontSize:'26px', fontFamily:'var(--font-display)', letterSpacing:'.02em', color: accent?'var(--accent)':'var(--text)', lineHeight:1 }}>{value}</div>
  </div>
);

/* ─── Alert ───────────────────────────────────────────────────────────── */
export const Alert = ({ type='info', children }) => {
  const map = { info:{c:'var(--blue)',bg:'rgba(91,159,255,.1)'}, error:{c:'var(--red)',bg:'var(--red-dim)'}, success:{c:'var(--green)',bg:'var(--green-dim)'} };
  const s = map[type] || map.info;
  return (
    <div style={{ padding:'11px 14px', background:s.bg, border:`1px solid ${s.c}30`, borderRadius:'var(--r)', fontSize:'13px', color:s.c }}>
      {children}
    </div>
  );
};