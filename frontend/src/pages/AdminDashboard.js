import React, { useEffect, useState, useCallback } from 'react';
import { concertAPI, bookingAPI } from '../services/api';
import ConcertForm from '../components/concerts/ConcertForm';
import { Btn, Badge, Modal, Spinner, StatCard, EmptyState, Alert } from '../components/ui';
import { fmtDate, fmtTime, fmtMoney, errMsg, GENRE_COLOR } from '../utils/helpers';
import toast from 'react-hot-toast';

/* ─── Tabs ─────────────────────────────────────────────────────────────── */
const TABS = ['Concerts', 'Bookings'];

const AdminDashboard = () => {
  const [tab,       setTab]       = useState('Concerts');
  const [concerts,  setConcerts]  = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [bLoading,  setBLoading]  = useState(false);
  const [pagination,setPagination]= useState({});
  const [bPagination,setBPagination]=useState({});
  const [cPage,     setCPage]     = useState(1);
  const [bPage,     setBPage]     = useState(1);

  // Modals
  const [showCreate,  setShowCreate]  = useState(false);
  const [editConcert, setEditConcert] = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);
  const [deleting,    setDeleting]    = useState(false);
  const [deleteErr,   setDeleteErr]   = useState('');

  /* ── Fetch concerts ────────────────────────────────────────────────── */
  const fetchConcerts = useCallback(() => {
    setLoading(true);
    concertAPI.getAll({ page: cPage, limit: 10 })
      .then(r => { setConcerts(r.data.data.concerts); setPagination(r.data.data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cPage]);

  /* ── Fetch all bookings (admin) ───────────────────────────────────── */
  const fetchBookings = useCallback(() => {
    setBLoading(true);
    bookingAPI.getAllAdmin({ page: bPage, limit: 12 })
      .then(r => { setBookings(r.data.data.bookings); setBPagination(r.data.data.pagination); })
      .catch(() => {})
      .finally(() => setBLoading(false));
  }, [bPage]);

  useEffect(() => { fetchConcerts(); }, [fetchConcerts]);
  useEffect(() => { if (tab === 'Bookings') fetchBookings(); }, [tab, fetchBookings]);

  /* ── Delete concert ───────────────────────────────────────────────── */
  const handleDelete = async () => {
    setDeleting(true);
    setDeleteErr('');
    try {
      await concertAPI.remove(deleteId);
      toast.success('Concert deleted.');
      setDeleteId(null);
      fetchConcerts();
    } catch (ex) {
      setDeleteErr(errMsg(ex));
    } finally {
      setDeleting(false);
    }
  };

  /* ── Summary stats ────────────────────────────────────────────────── */
  const totalTicketsSold = concerts.reduce((s, c) => s + (c.totalTickets - c.availableTickets), 0);
  const totalRevenue     = concerts.reduce((s, c) => s + (c.totalTickets - c.availableTickets) * c.ticketPrice, 0);

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom:'28px' }}>
        <div style={{ fontSize:'11px', color:'var(--accent)', fontWeight:700, letterSpacing:'.1em', marginBottom:'6px' }}>ADMIN PANEL</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'46px', letterSpacing:'.04em' }}>DASHBOARD</h1>
      </div>

      {/* Summary stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'14px', marginBottom:'32px' }}>
        <StatCard label="Total concerts"  value={pagination.total || 0} />
        <StatCard label="Tickets sold"    value={totalTicketsSold} accent />
        <StatCard label="Est. revenue"    value={fmtMoney(totalRevenue)} />
        <StatCard label="All bookings"    value={bPagination.total || '—'} />
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:'0', borderBottom:'1px solid var(--border)', marginBottom:'24px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'10px 22px', fontSize:'13.5px', fontWeight:500, cursor:'pointer', background:'none', border:'none', color: tab===t?'var(--text)':'var(--text2)', borderBottom:`2px solid ${tab===t?'var(--accent)':'transparent'}`, transition:'var(--t)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* ══ CONCERTS TAB ══════════════════════════════════════════════ */}
      {tab === 'Concerts' && (
        <>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'18px' }}>
            <Btn onClick={() => setShowCreate(true)}>+ New Concert</Btn>
          </div>

          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}><Spinner size={32} /></div>
          ) : concerts.length === 0 ? (
            <EmptyState icon="🎵" title="No concerts yet" message="Create your first concert." action={<Btn onClick={() => setShowCreate(true)}>+ New Concert</Btn>} />
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'1px', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
              {/* Table header */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1fr 1fr 1fr 110px', gap:'12px', padding:'11px 18px', background:'var(--surface2)', fontSize:'11px', fontWeight:700, letterSpacing:'.07em', color:'var(--text3)', textTransform:'uppercase' }}>
                <span>Concert</span><span>Date</span><span>Price</span><span>Sold</span><span>Available</span><span>Actions</span>
              </div>

              {concerts.map(c => {
                const gc   = GENRE_COLOR[c.genre] || '#8f8fa8';
                const sold = c.totalTickets - c.availableTickets;
                return (
                  <div key={c._id} style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1fr 1fr 1fr 110px', gap:'12px', padding:'13px 18px', background:'var(--surface)', borderTop:'1px solid var(--border)', alignItems:'center' }}>
                    <div style={{ minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'2px' }}>
                        <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:gc, flexShrink:0 }} />
                        <span style={{ fontWeight:500, fontSize:'13.5px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</span>
                      </div>
                      <span style={{ fontSize:'11.5px', color:'var(--text2)' }}>{c.artist}</span>
                    </div>
                    <div style={{ fontSize:'12.5px', color:'var(--text2)' }}>
                      <div>{fmtDate(c.dateTime)}</div>
                      <div style={{ color:'var(--text3)' }}>{fmtTime(c.dateTime)}</div>
                    </div>
                    <span style={{ fontSize:'13.5px' }}>{fmtMoney(c.ticketPrice)}</span>
                    <span style={{ fontSize:'13.5px', color: sold>0?'var(--accent)':'var(--text3)' }}>{sold}</span>
                    <span style={{ fontSize:'13.5px', color: c.availableTickets===0?'var(--red)':'var(--green)' }}>{c.availableTickets}</span>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <Btn size="sm" variant="secondary" onClick={() => setEditConcert(c)}>Edit</Btn>
                      <Btn size="sm" variant="danger"    onClick={() => { setDeleteId(c._id); setDeleteErr(''); }}>Del</Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {pagination.pages > 1 && (
            <div style={{ display:'flex', justifyContent:'center', gap:'7px', marginTop:'24px' }}>
              <Btn variant="ghost" size="sm" disabled={cPage<=1} onClick={() => setCPage(p=>p-1)}>← Prev</Btn>
              <span style={{ fontSize:'13px', color:'var(--text2)', alignSelf:'center' }}>Page {cPage} / {pagination.pages}</span>
              <Btn variant="ghost" size="sm" disabled={cPage>=pagination.pages} onClick={() => setCPage(p=>p+1)}>Next →</Btn>
            </div>
          )}
        </>
      )}

      {/* ══ BOOKINGS TAB ══════════════════════════════════════════════ */}
      {tab === 'Bookings' && (
        <>
          {bLoading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}><Spinner size={32} /></div>
          ) : bookings.length === 0 ? (
            <EmptyState icon="🎟" title="No bookings yet" message="Bookings will appear here." />
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'1px', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 0.8fr 0.8fr 90px', gap:'12px', padding:'11px 18px', background:'var(--surface2)', fontSize:'11px', fontWeight:700, letterSpacing:'.07em', color:'var(--text3)', textTransform:'uppercase' }}>
                <span>User</span><span>Concert</span><span>Reference</span><span>Tickets</span><span>Amount</span><span>Status</span>
              </div>
              {bookings.map(b => (
                <div key={b._id} style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 0.8fr 0.8fr 90px', gap:'12px', padding:'12px 18px', background:'var(--surface)', borderTop:'1px solid var(--border)', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:500 }}>{b.user?.name}</div>
                    <div style={{ fontSize:'11.5px', color:'var(--text3)' }}>{b.user?.email}</div>
                  </div>
                  <div style={{ fontSize:'12.5px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.concert?.name}</div>
                  <code style={{ fontSize:'10.5px', color:'var(--text3)' }}>{b.bookingReference}</code>
                  <span style={{ fontSize:'13.5px' }}>{b.ticketsBooked}</span>
                  <span style={{ fontSize:'13.5px' }}>{fmtMoney(b.totalAmount)}</span>
                  <Badge
                    color={b.status==='confirmed'?'var(--green)':'var(--text3)'}
                    bg={b.status==='confirmed'?'var(--green-dim)':'var(--surface2)'}>
                    {b.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {bPagination.pages > 1 && (
            <div style={{ display:'flex', justifyContent:'center', gap:'7px', marginTop:'24px' }}>
              <Btn variant="ghost" size="sm" disabled={bPage<=1} onClick={() => setBPage(p=>p-1)}>← Prev</Btn>
              <span style={{ fontSize:'13px', color:'var(--text2)', alignSelf:'center' }}>Page {bPage} / {bPagination.pages}</span>
              <Btn variant="ghost" size="sm" disabled={bPage>=bPagination.pages} onClick={() => setBPage(p=>p+1)}>Next →</Btn>
            </div>
          )}
        </>
      )}

      {/* ── Create Concert Modal ───────────────────────────────────── */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Concert" maxWidth="600px">
        <ConcertForm onSuccess={() => { setShowCreate(false); fetchConcerts(); }} onCancel={() => setShowCreate(false)} />
      </Modal>

      {/* ── Edit Concert Modal ─────────────────────────────────────── */}
      <Modal open={!!editConcert} onClose={() => setEditConcert(null)} title="Edit Concert" maxWidth="600px">
        {editConcert && (
          <ConcertForm concert={editConcert} onSuccess={() => { setEditConcert(null); fetchConcerts(); }} onCancel={() => setEditConcert(null)} />
        )}
      </Modal>

      {/* ── Delete Confirm Modal ───────────────────────────────────── */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Concert">
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <p style={{ fontSize:'14px', color:'var(--text2)', lineHeight:1.6 }}>
            This will soft-delete the concert. Active bookings will block deletion.
          </p>
          {deleteErr && <Alert type="error">{deleteErr}</Alert>}
          <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
            <Btn variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Btn>
            <Btn variant="danger" loading={deleting} onClick={handleDelete}>Yes, Delete</Btn>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminDashboard;