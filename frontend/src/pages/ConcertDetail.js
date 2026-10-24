import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { concertAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Btn, Badge, Modal, Spinner, Alert, StatCard } from '../components/ui';
import { fmtDate, fmtTime, fmtMoney, isPastDate, fromNow, errMsg, GENRE_COLOR } from '../utils/helpers';
import toast from 'react-hot-toast';

const ConcertDetail = () => {
  const { id }  = useParams();
  const nav     = useNavigate();
  const { isAuthenticated } = useAuth();

  const [concert, setConcert]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error,   setError]       = useState('');

  // Booking modal state
  const [showModal, setShowModal] = useState(false);
  const [tickets,   setTickets]   = useState(1);
  const [booking,   setBooking]   = useState(false);
  const [bookErr,   setBookErr]   = useState('');

  useEffect(() => {
    concertAPI.getOne(id)
      .then(r => setConcert(r.data.data.concert))
      .catch(() => setError('Concert not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    setBookErr('');
    setBooking(true);
    try {
      const r = await bookingAPI.book({ concertId: id, ticketsBooked: tickets });
      toast.success(`🎟 Booked ${tickets} ticket${tickets>1?'s':''}! Ref: ${r.data.data.booking.bookingReference}`);
      setShowModal(false);
      // Refresh available tickets count
      setConcert(c => ({ ...c, availableTickets: c.availableTickets - tickets }));
    } catch (ex) {
      setBookErr(errMsg(ex));
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', padding:'100px' }}><Spinner size={36} /></div>
  );
  if (error || !concert) return (
    <div style={{ maxWidth:'600px', margin:'80px auto', textAlign:'center', color:'var(--text2)' }}>
      <p style={{ fontSize:'48px', marginBottom:'16px' }}>🎵</p>
      <h2 style={{ marginBottom:'8px' }}>{error || 'Concert not found'}</h2>
      <Btn variant="ghost" onClick={() => nav('/concerts')} style={{ marginTop:'16px' }}>← Back to concerts</Btn>
    </div>
  );

  const past      = isPastDate(concert.dateTime);
  const soldOut   = concert.availableTickets === 0;
  const canBook   = !past && !soldOut && isAuthenticated;
  const gc        = GENRE_COLOR[concert.genre] || '#8f8fa8';
  const totalCost = fmtMoney(tickets * concert.ticketPrice);

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px', animation:'fadeUp .4s ease' }}>

      {/* Back */}
      <button onClick={() => nav(-1)} style={{ background:'none', border:'none', color:'var(--text2)', fontSize:'13px', cursor:'pointer', marginBottom:'24px', display:'flex', alignItems:'center', gap:'5px', padding:0 }}>
        ← Back
      </button>

      {/* Accent bar */}
      <div style={{ height:'4px', background:gc, borderRadius:'2px', marginBottom:'28px', opacity:.85 }} />

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'20px', marginBottom:'32px' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'10px', flexWrap:'wrap' }}>
            <Badge color={gc} bg={gc+'1a'}>{concert.genre}</Badge>
            {soldOut && <Badge color="var(--red)" bg="var(--red-dim)">Sold Out</Badge>}
            {past    && <Badge color="var(--text3)" bg="var(--surface2)">Past Event</Badge>}
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,5vw,56px)', letterSpacing:'.03em', lineHeight:.95, marginBottom:'8px' }}>
            {concert.name}
          </h1>
          <p style={{ fontSize:'16px', color:'var(--accent)', fontWeight:500 }}>{concert.artist}</p>
        </div>

        {/* Book CTA */}
        <div style={{ background:'var(--surface)', border:`1px solid ${canBook?'var(--border2)':'var(--border)'}`, borderRadius:'var(--r-lg)', padding:'20px', minWidth:'220px', textAlign:'center' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'32px', letterSpacing:'.02em', marginBottom:'4px' }}>
            {fmtMoney(concert.ticketPrice)}
          </div>
          <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'14px' }}>per ticket · max 3</div>

          {!isAuthenticated ? (
            <Btn full onClick={() => nav('/login', { state:{ from:{ pathname:`/concerts/${id}` } } })}>Login to Book</Btn>
          ) : past ? (
            <Btn full variant="ghost" disabled>Event Ended</Btn>
          ) : soldOut ? (
            <Btn full variant="ghost" disabled>Sold Out</Btn>
          ) : (
            <Btn full onClick={() => { setTickets(1); setBookErr(''); setShowModal(true); }}>
              Book Tickets →
            </Btn>
          )}

          {canBook && (
            <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'8px' }}>
              {concert.availableTickets} ticket{concert.availableTickets!==1?'s':''} remaining
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'14px', marginBottom:'32px' }}>
        <StatCard label="Date"     value={fmtDate(concert.dateTime)} />
        <StatCard label="Time"     value={fmtTime(concert.dateTime)} />
        <StatCard label="Available" value={concert.availableTickets} accent={concert.availableTickets > 0} />
        <StatCard label="Sold"     value={concert.totalTickets - concert.availableTickets} />
      </div>

      {/* Details */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'28px' }}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'20px' }}>
          <h3 style={{ fontSize:'12px', fontWeight:700, letterSpacing:'.08em', color:'var(--text3)', textTransform:'uppercase', marginBottom:'14px' }}>Venue</h3>
          <p style={{ fontWeight:600, marginBottom:'4px' }}>{concert.venue.name}</p>
          <p style={{ fontSize:'13.5px', color:'var(--text2)' }}>{concert.venue.address}</p>
          <p style={{ fontSize:'13.5px', color:'var(--text2)' }}>{concert.venue.city}</p>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'20px' }}>
          <h3 style={{ fontSize:'12px', fontWeight:700, letterSpacing:'.08em', color:'var(--text3)', textTransform:'uppercase', marginBottom:'14px' }}>Event info</h3>
          {!past && <p style={{ fontSize:'13.5px', color:'var(--text2)', marginBottom:'6px' }}>🕐 {fromNow(concert.dateTime)}</p>}
          <p style={{ fontSize:'13.5px', color:'var(--text2)', marginBottom:'6px' }}>🎫 {fmtMoney(concert.ticketPrice)} per ticket</p>
          <p style={{ fontSize:'13.5px', color:'var(--text2)' }}>📦 Total capacity: {concert.totalTickets}</p>
        </div>
      </div>

      {concert.description && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'20px' }}>
          <h3 style={{ fontSize:'12px', fontWeight:700, letterSpacing:'.08em', color:'var(--text3)', textTransform:'uppercase', marginBottom:'12px' }}>About</h3>
          <p style={{ fontSize:'14px', color:'var(--text2)', lineHeight:1.75 }}>{concert.description}</p>
        </div>
      )}

      {/* Booking Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Book Tickets">
        <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
          <div style={{ padding:'14px', background:'var(--surface2)', borderRadius:'var(--r)' }}>
            <p style={{ fontWeight:600, marginBottom:'2px' }}>{concert.name}</p>
            <p style={{ fontSize:'13px', color:'var(--text2)' }}>{fmtDate(concert.dateTime)} · {fmtTime(concert.dateTime)}</p>
          </div>

          {bookErr && <Alert type="error">{bookErr}</Alert>}

          <div>
            <label style={{ fontSize:'12.5px', fontWeight:500, color:'var(--text2)', display:'block', marginBottom:'8px' }}>
              Number of tickets (max 3 per concert)
            </label>
            <div style={{ display:'flex', gap:'8px' }}>
              {[1,2,3].map(n => (
                <button key={n} onClick={() => setTickets(n)}
                  style={{ flex:1, padding:'12px', borderRadius:'var(--r)', fontSize:'15px', fontWeight:600, cursor:'pointer', transition:'var(--t)', border:`1.5px solid ${tickets===n?'var(--accent)':'var(--border2)'}`, background: tickets===n?'var(--accent-dim)':'var(--surface2)', color: tickets===n?'var(--accent)':'var(--text2)' }}>
                  {n}
                </button>
              ))}
            </div>
            {concert.availableTickets < 3 && (
              <p style={{ fontSize:'11.5px', color:'var(--orange)', marginTop:'6px' }}>
                Only {concert.availableTickets} ticket{concert.availableTickets!==1?'s':''} left
              </p>
            )}
          </div>

          <div style={{ padding:'14px', background:'var(--surface2)', borderRadius:'var(--r)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:'13.5px', color:'var(--text2)' }}>{tickets} × {fmtMoney(concert.ticketPrice)}</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'22px', color:'var(--accent)', letterSpacing:'.02em' }}>{totalCost}</span>
          </div>

          <div style={{ display:'flex', gap:'10px' }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)} style={{ flex:1 }}>Cancel</Btn>
            <Btn loading={booking} onClick={handleBook} style={{ flex:2 }} disabled={tickets > concert.availableTickets}>
              Confirm Booking
            </Btn>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ConcertDetail;