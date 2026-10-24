import React, { useState } from 'react';
import { Input, Textarea, Select, Btn } from '../ui';
import { GENRES, errMsg } from '../../utils/helpers';
import { concertAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY = { name:'', artist:'', description:'', dateTime:'', venueName:'', venueAddress:'', venueCity:'', ticketPrice:'', totalTickets:'', genre:'Other' };

const ConcertForm = ({ concert, onSuccess, onCancel }) => {
  const isEdit = !!concert;
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState(isEdit ? {
    name:         concert.name,
    artist:       concert.artist,
    description:  concert.description || '',
    dateTime:     new Date(concert.dateTime).toISOString().slice(0,16),
    venueName:    concert.venue.name,
    venueAddress: concert.venue.address,
    venueCity:    concert.venue.city,
    ticketPrice:  concert.ticketPrice,
    totalTickets: concert.totalTickets,
    genre:        concert.genre || 'Other',
  } : EMPTY);
  const [err, setErr] = useState({});

  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!f.name)         e.name = 'Required';
    if (!f.artist)       e.artist = 'Required';
    if (!f.dateTime)     e.dateTime = 'Required';
    if (!f.venueName)    e.venueName = 'Required';
    if (!f.venueAddress) e.venueAddress = 'Required';
    if (!f.venueCity)    e.venueCity = 'Required';
    if (!f.ticketPrice || isNaN(f.ticketPrice)) e.ticketPrice = 'Valid price required';
    if (!f.totalTickets || isNaN(f.totalTickets)) e.totalTickets = 'Valid number required';
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: f.name, artist: f.artist, description: f.description,
        dateTime: new Date(f.dateTime).toISOString(),
        venue: { name: f.venueName, address: f.venueAddress, city: f.venueCity },
        ticketPrice:  Number(f.ticketPrice),
        totalTickets: Number(f.totalTickets),
        genre: f.genre,
      };
      if (isEdit) {
        await concertAPI.update(concert._id, payload);
        toast.success('Concert updated!');
      } else {
        await concertAPI.create(payload);
        toast.success('Concert created!');
      }
      onSuccess();
    } catch (ex) {
      toast.error(errMsg(ex));
    } finally {
      setLoading(false);
    }
  };

  const G2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' };

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
      <Input label="Concert name *" value={f.name} onChange={set('name')} error={err.name} placeholder="e.g. Rock Night 2025" />
      <div style={G2}>
        <Input label="Artist *" value={f.artist} onChange={set('artist')} error={err.artist} placeholder="Artist / band name" />
        <Select label="Genre" value={f.genre} onChange={set('genre')}>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </Select>
      </div>
      <Textarea label="Description" value={f.description} onChange={set('description')} placeholder="Optional description" />
      <Input label="Date & Time *" type="datetime-local" value={f.dateTime} onChange={set('dateTime')} error={err.dateTime} />
      <div style={G2}>
        <Input label="Venue name *" value={f.venueName} onChange={set('venueName')} error={err.venueName} placeholder="Venue name" />
        <Input label="City *" value={f.venueCity} onChange={set('venueCity')} error={err.venueCity} placeholder="City" />
      </div>
      <Input label="Venue address *" value={f.venueAddress} onChange={set('venueAddress')} error={err.venueAddress} placeholder="Full address" />
      <div style={G2}>
        <Input label="Ticket price (₹) *" type="number" min="0" value={f.ticketPrice} onChange={set('ticketPrice')} error={err.ticketPrice} placeholder="0" />
        <Input label="Total tickets *" type="number" min="1" value={f.totalTickets} onChange={set('totalTickets')} error={err.totalTickets} placeholder="500" />
      </div>
      <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'6px' }}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" loading={loading}>{isEdit ? 'Update Concert' : 'Create Concert'}</Btn>
      </div>
    </form>
  );
};

export default ConcertForm;