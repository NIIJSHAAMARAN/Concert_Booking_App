import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Btn, Alert } from '../components/ui';
import { errMsg } from '../utils/helpers';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || '/concerts';

  const [f, setF]         = useState({ email:'', password:'' });
  const [err, setErr]     = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState('');

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!f.email)    e.email = 'Required';
    if (!f.password) e.password = 'Required';
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr('');
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(f.email, f.password);
      toast.success(`Welcome back, ${user.name}!`);
      nav(from, { replace: true });
    } catch (ex) {
      setApiErr(errMsg(ex));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
      <div style={{ width:'100%', maxWidth:'400px', animation:'fadeUp .4s ease' }}>

        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'30px', letterSpacing:'.07em', marginBottom:'6px' }}>SOUNDSTAGE</div>
          <p style={{ fontSize:'13.5px', color:'var(--text2)' }}>Sign in to your account</p>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:'var(--r-xl)', padding:'32px' }}>
          {apiErr && <div style={{ marginBottom:'16px' }}><Alert type="error">{apiErr}</Alert></div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <Input label="Email address" type="email" value={f.email} onChange={set('email')} error={err.email} placeholder="you@example.com" icon="✉" autoComplete="email" />
            <Input label="Password" type="password" value={f.password} onChange={set('password')} error={err.password} placeholder="••••••••" icon="🔒" autoComplete="current-password" />
            <Btn type="submit" full loading={loading} size="lg" style={{ marginTop:'4px' }}>Sign In</Btn>
          </form>

          <div style={{ marginTop:'18px', padding:'11px 13px', background:'var(--accent-dim)', border:'1px solid rgba(232,255,90,.15)', borderRadius:'var(--r)', fontSize:'12px', color:'var(--text2)' }}>
            <strong style={{ color:'var(--accent)' }}>Demo admin:</strong> admin@concertapp.com / admin1234
          </div>
        </div>

        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'13.5px', color:'var(--text2)' }}>
          No account? <Link to="/register" style={{ color:'var(--accent)', fontWeight:500 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;