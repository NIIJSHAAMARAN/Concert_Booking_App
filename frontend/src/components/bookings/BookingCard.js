import React, { useState } from 'react';
import { bookingAPI } from '../../services/api';
import { Btn, Badge, Alert } from '../ui';
import { fmtDate, fmtTime, fmtMoney, errMsg } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BookingCard = ({ booking, onCancelled }) => {
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');

  const confirmed = booking.status === 'confirmed';
  const past      = booking.concert?.dateTime
    ? new Date(booking.concert.dateTime) < new Date()
    : false;

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setErr('');
    setLoading(true);
    try {
      await bookingAPI.cancel(booking._id);
      toast.success('Booking cancelled.');
      onCancelled(booking._id);
    } catch (ex) {
      setErr(errMsg(ex));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      transition: 'var(--t)',
    }}>
      {/* Status bar */}
      <div style={{ height: '3px', background: confirmed ? 'var(--green)' : 'var(--text3)' }} />

      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Top row: status badge + reference */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Badge
            color={confirmed ? 'var(--green)' : 'var(--text3)'}
            bg={confirmed ? 'var(--green-dim)' : 'var(--surface2)'}>
            {booking.status}
          </Badge>
          <code style={{ fontSize: '10.5px', color: 'var(--text3)', letterSpacing: '.04em' }}>
            {booking.bookingReference}
          </code>
        </div>

        {/* Concert info */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px', lineHeight: 1.3 }}>
            {booking.concert?.name || 'Concert'}
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: 500 }}>
            {booking.concert?.artist}
          </p>
        </div>

        {/* Date / venue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {booking.concert?.dateTime && (
            <>
              <span style={{ fontSize: '12.5px', color: 'var(--text2)' }}>
                📅 {fmtDate(booking.concert.dateTime)}
              </span>
              <span style={{ fontSize: '12.5px', color: 'var(--text2)' }}>
                🕐 {fmtTime(booking.concert.dateTime)}
              </span>
            </>
          )}
          {booking.concert?.venue && (
            <span style={{ fontSize: '12.5px', color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              📍 {booking.concert.venue.name}, {booking.concert.venue.city}
            </span>
          )}
        </div>

        {/* Amount row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '2px' }}>
              {booking.ticketsBooked} ticket{booking.ticketsBooked !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: '17px', fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '.02em' }}>
              {fmtMoney(booking.totalPrice)}
            </div>
          </div>

          {confirmed && !past && (
            <Btn size="sm" variant="danger" loading={loading} onClick={handleCancel}>
              Cancel
            </Btn>
          )}
        </div>

        {err && <Alert type="error">{err}</Alert>}
      </div>
    </div>
  );
};

export default BookingCard;