import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Btn, Alert } from '../components/ui';
import { errMsg } from '../utils/helpers';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const nav = useNavigate();

  const [f, setF]           = useState({ name:'', email:'', password:'', confirm:'' });
  const [err, setErr]       = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState('');

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!f.name || f.name.trim().length < 2)  e.name    = 'Min 2 characters';
    if (!f.email)                              e.email   = 'Required';
    if (!f.password || f.password.length < 6) e.password = 'Min 6 characters';
    if (f.password !== f.confirm)              e.confirm = 'Passwords do not match';
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr('');
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await register(f.name.trim(), f.email, f.password);
      toast.success(`Welcome, ${user.name}!`);
      nav('/concerts');
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
          <div style={{ fontFamily:'var(--font-display)', fontSize:'30px', letterSpacing:'.07em', marginBottom:'6px' }}>JOIN SOUNDSTAGE</div>
          <p style={{ fontSize:'13.5px', color:'var(--text2)' }}>Create your free account</p>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:'var(--r-xl)', padding:'32px' }}>
          {apiErr && <div style={{ marginBottom:'16px' }}><Alert type="error">{apiErr}</Alert></div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
            <Input label="Full name" value={f.name} onChange={set('name')} error={err.name} placeholder="John Doe" icon="👤" autoComplete="name" />
            <Input label="Email address" type="email" value={f.email} onChange={set('email')} error={err.email} placeholder="you@example.com" icon="✉" autoComplete="email" />
            <Input label="Password" type="password" value={f.password} onChange={set('password')} error={err.password} placeholder="Min 6 characters" icon="🔒" autoComplete="new-password" />
            <Input label="Confirm password" type="password" value={f.confirm} onChange={set('confirm')} error={err.confirm} placeholder="Repeat password" icon="🔒" autoComplete="new-password" />

            <div style={{ padding:'10px 12px', background:'var(--surface2)', borderRadius:'var(--r)', fontSize:'12px', color:'var(--text3)' }}>
              Max <strong style={{ color:'var(--text2)' }}>3 tickets</strong> per concert per account.
            </div>

            <Btn type="submit" full loading={loading} size="lg">Create Account</Btn>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'13.5px', color:'var(--text2)' }}>
          Already have an account? <Link to="/login" style={{ color:'var(--accent)', fontWeight:500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;