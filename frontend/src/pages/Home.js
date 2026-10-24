import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { concertAPI } from '../services/api';
import ConcertCard from '../components/concerts/ConcertCard';
import { Btn, Spinner } from '../components/ui';

const Home = () => {
  const nav = useNavigate();
  const [concerts, setConcerts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    concertAPI.getAll({ available: 'true', limit: 6, sortBy: 'dateTime', order: 'asc' })
      .then(r => setConcerts(r.data.data.concerts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section style={{ minHeight:'88vh', display:'flex', alignItems:'center', padding:'80px 24px', maxWidth:'1200px', margin:'0 auto', position:'relative' }}>
        {/* subtle grid bg */}
        <div style={{ position:'absolute', inset:0, opacity:.025, backgroundImage:'linear-gradient(var(--border2) 1px,transparent 1px),linear-gradient(90deg,var(--border2) 1px,transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none' }} />

        <div style={{ maxWidth:'680px', position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'5px 14px', background:'var(--accent-dim)', border:'1px solid rgba(232,255,90,.22)', borderRadius:'20px', marginBottom:'28px' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--accent)', animation:'shimmer 1.8s ease infinite' }} />
            <span style={{ fontSize:'11.5px', color:'var(--accent)', fontWeight:700, letterSpacing:'.08em' }}>LIVE MUSIC BOOKING</span>
          </div>

          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(62px,10vw,116px)', lineHeight:.88, letterSpacing:'.02em', color:'var(--text)', marginBottom:'26px', animation:'fadeUp .55s ease both' }}>
            FEEL THE<br />
            <span style={{ color:'var(--accent)' }}>MUSIC</span><br />
            LIVE.
          </h1>

          <p style={{ fontSize:'17px', color:'var(--text2)', lineHeight:1.75, maxWidth:'460px', marginBottom:'36px', animation:'fadeUp .55s .1s ease both' }}>
            Discover and book the world's best live concerts. Up to <strong style={{ color:'var(--text)' }}>3 tickets per show</strong> — because great music is better shared.
          </p>

          <div style={{ display:'flex', gap:'12px', animation:'fadeUp .55s .2s ease both' }}>
            <Btn size="lg" onClick={() => nav('/concerts')}>Browse Concerts →</Btn>
            <Btn size="lg" variant="ghost" onClick={() => nav('/register')}>Create Account</Btn>
          </div>

          <div style={{ display:'flex', gap:'40px', marginTop:'56px', animation:'fadeUp .55s .3s ease both' }}>
            {[['3','Max tickets / booking'],['100%','Secure checkout'],['Live','Support']].map(([v,l])=>(
              <div key={l}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'28px', color:'var(--accent)', letterSpacing:'.04em' }}>{v}</div>
                <div style={{ fontSize:'11.5px', color:'var(--text3)', marginTop:'2px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming ────────────────────────────────────────────── */}
      <section style={{ padding:'50px 24px 80px', maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'28px' }}>
          <div>
            <div style={{ fontSize:'11px', color:'var(--accent)', fontWeight:700, letterSpacing:'.1em', marginBottom:'6px' }}>UPCOMING</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'40px', letterSpacing:'.04em' }}>HOT SHOWS</h2>
          </div>
          <Btn variant="ghost" size="sm" onClick={() => nav('/concerts')}>View all →</Btn>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}><Spinner size={34} /></div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:'18px' }}>
            {concerts.map((c,i) => (
              <div key={c._id} style={{ animation:`fadeUp .4s ${i*.06}s ease both` }}>
                <ConcertCard concert={c} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;