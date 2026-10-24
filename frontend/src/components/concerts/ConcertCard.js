import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fmtDate, fmtTime, fmtMoney, isPastDate, GENRE_COLOR } from '../../utils/helpers';
import { Badge } from '../ui';

const ConcertCard = ({ concert }) => {
  const nav     = useNavigate();
  const past    = isPastDate(concert.dateTime);
  const soldOut = concert.availableTickets === 0;
  const gc      = GENRE_COLOR[concert.genre] || '#8f8fa8';

  return (
    <div
      onClick={() => nav(`/concerts/${concert._id}`)}
      style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden', cursor:'pointer', transition:'var(--t)', opacity: past ? .62 : 1 }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)';  e.currentTarget.style.transform='translateY(0)'; }}
    >
      <div style={{ height:'3px', background:gc, opacity:.85 }} />
      <div style={{ padding:'18px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
          <Badge color={gc} bg={gc+'1a'}>{concert.genre}</Badge>
          {soldOut && <Badge color="var(--red)" bg="var(--red-dim)">Sold Out</Badge>}
          {past && !soldOut && <Badge color="var(--text3)" bg="var(--surface2)">Past</Badge>}
        </div>
        <h3 style={{ fontSize:'16px', fontWeight:600, color:'var(--text)', marginBottom:'3px', lineHeight:1.3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {concert.name}
        </h3>
        <p style={{ fontSize:'12.5px', color:'var(--accent)', fontWeight:500, marginBottom:'14px' }}>{concert.artist}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'5px', marginBottom:'14px' }}>
          <span style={{ fontSize:'12.5px', color:'var(--text2)' }}>📅 {fmtDate(concert.dateTime)} · {fmtTime(concert.dateTime)}</span>
          <span style={{ fontSize:'12.5px', color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            📍 {concert.venue.name}, {concert.venue.city}
          </span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'12px', borderTop:'1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize:'17px', fontFamily:'var(--font-display)', letterSpacing:'.02em' }}>{fmtMoney(concert.ticketPrice)}</div>
            <div style={{ fontSize:'10.5px', color:'var(--text3)' }}>per ticket</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'14px', fontWeight:600, color: soldOut?'var(--red)':'var(--green)' }}>{concert.availableTickets}</div>
            <div style={{ fontSize:'10.5px', color:'var(--text3)' }}>available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertCard;