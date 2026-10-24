import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import BookingCard from '../components/bookings/BookingCard';
import { Spinner, EmptyState, Btn, StatCard } from '../components/ui';

const MyBookings = () => {
  const nav = useNavigate();
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  // const [pagination, setPagination] = useState({});
  const [pagination, setPagination] = useState({
  total: 0,
  pages: 1,
  page: 1,
  limit: 9,
});
  const [page,       setPage]       = useState(1);
  const [filter,     setFilter]     = useState('');   // '' | 'confirmed' | 'cancelled'

  const fetch = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (filter) params.status = filter;
    bookingAPI.getMyBookings(params)
      .then(r => {
        setBookings(r.data.data.bookings);
        setPagination(r.data.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, filter]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [filter]);

  const handleCancelled = (id) => setBookings(b => b.map(x => x._id === id ? { ...x, status:'cancelled' } : x));

  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom:'28px' }}>
        <div style={{ fontSize:'11px', color:'var(--accent)', fontWeight:700, letterSpacing:'.1em', marginBottom:'6px' }}>YOUR ACCOUNT</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'46px', letterSpacing:'.04em' }}>MY BOOKINGS</h1>
      </div>

      {/* Stats */}
      {!loading && bookings.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'28px' }}>
          <StatCard label="Total"     value={pagination?.total || 0} />
          <StatCard label="Confirmed" value={confirmed} accent />
          <StatCard label="Cancelled" value={cancelled} />
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'24px' }}>
        {[['', 'All'], ['confirmed','Confirmed'], ['cancelled','Cancelled']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            style={{ padding:'7px 16px', fontSize:'12.5px', fontWeight:500, borderRadius:'20px', cursor:'pointer', transition:'var(--t)', border:`1px solid ${filter===v?'var(--accent)':'var(--border2)'}`, background: filter===v?'var(--accent-dim)':'var(--surface)', color: filter===v?'var(--accent)':'var(--text2)' }}>
            {l}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'80px' }}><Spinner size={34} /></div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="🎟"
          title="No bookings yet"
          message="Book your first concert to see it here."
          action={<Btn onClick={() => nav('/concerts')}>Browse Concerts →</Btn>}
        />
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px', marginBottom:'32px' }}>
            {bookings.map((b, i) => (
              <div key={b._id} style={{ animation:`fadeUp .35s ${i*.05}s ease both` }}>
                <BookingCard booking={b} onCancelled={handleCancelled} />
              </div>
            ))}
          </div>

          {pagination?.pages > 1 && (
  <div style={{ display:'flex', justifyContent:'center', gap:'7px' }}>
    <Btn variant="ghost" size="sm" disabled={page<=1} onClick={() => setPage(p=>p-1)}>← Prev</Btn>
    {Array.from({ length: pagination?.pages || 1 }, (_,i) => i+1).map(p => (
      <button key={p} onClick={() => setPage(p)}
        style={{ width:'34px', height:'34px', borderRadius:'var(--r)', fontSize:'13px', cursor:'pointer', background: p===page?'var(--accent)':'var(--surface2)', color: p===page?'#000':'var(--text2)', border:'1px solid var(--border2)' }}>
        {p}
      </button>
    ))}
    <Btn variant="ghost" size="sm" disabled={page>= (pagination?.pages || 1)} onClick={() => setPage(p=>p+1)}>Next →</Btn>
  </div>
)}
        </>
      )}
    </div>
  );
};

export default MyBookings;