import React from 'react';
import useConcerts from '../hooks/useConcerts';
import ConcertCard from '../components/concerts/ConcertCard';
import { Spinner, EmptyState, Btn } from '../components/ui';
import { GENRES } from '../utils/helpers';

const Concerts = () => {
  const { concerts, pagination, loading, error, params, setFilter, setPage } = useConcerts();

  const totalConcerts = pagination?.total ?? 0;
  const totalPages = pagination?.pages ?? 1;
  const currentPage = params?.page ?? 1;

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom:'30px' }}>
        <div style={{ fontSize:'11px', color:'var(--accent)', fontWeight:700, letterSpacing:'.1em', marginBottom:'6px' }}>DISCOVER</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'50px', letterSpacing:'.04em' }}>ALL CONCERTS</h1>
      </div>

      {/* Filter bar */}
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'28px', padding:'14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)' }}>
        <input
          type="text"
          placeholder="Search concerts or artists..."
          value={params?.search || ''}
          onChange={e => setFilter('search', e.target.value)}
          style={{ flex:1, minWidth:'180px', padding:'8px 13px', background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:'var(--r)', color:'var(--text)', fontSize:'13px' }}
        />

        <select value={params?.genre || ''} onChange={e => setFilter('genre', e.target.value)}
          style={{ padding:'8px 13px', background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:'var(--r)', color:'var(--text)', fontSize:'13px', cursor:'pointer' }}>
          <option value="">All genres</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select value={params?.available || ''} onChange={e => setFilter('available', e.target.value)}
          style={{ padding:'8px 13px', background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:'var(--r)', color:'var(--text)', fontSize:'13px', cursor:'pointer' }}>
          <option value="">All shows</option>
          <option value="true">Available only</option>
        </select>

        <select
          value={`${params?.sortBy || 'dateTime'}_${params?.order || 'asc'}`}
          onChange={e => { 
            const [sortBy, order] = e.target.value.split('_'); 
            setFilter('sortBy', sortBy); 
            setFilter('order', order); 
          }}
          style={{ padding:'8px 13px', background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:'var(--r)', color:'var(--text)', fontSize:'13px', cursor:'pointer' }}>
          <option value="dateTime_asc">Date: Soonest</option>
          <option value="dateTime_desc">Date: Latest</option>
          <option value="ticketPrice_asc">Price: Low → High</option>
          <option value="ticketPrice_desc">Price: High → Low</option>
        </select>

        {(params?.genre || params?.available || params?.search) && (
          <Btn variant="ghost" size="sm" onClick={() => { setFilter('genre',''); setFilter('available',''); setFilter('search',''); }}>
            Clear
          </Btn>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'80px' }}><Spinner size={34} /></div>
      ) : error ? (
        <EmptyState icon="⚠️" title="Failed to load" message={error} />
      ) : concerts.length === 0 ? (
        <EmptyState icon="🎵" title="No concerts found" message="Try adjusting your filters or check back soon." />
      ) : (
        <>
          <p style={{ fontSize:'12.5px', color:'var(--text3)', marginBottom:'18px' }}>
            {totalConcerts} concert{totalConcerts !== 1 ? 's' : ''} found
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(285px,1fr))', gap:'18px', marginBottom:'36px' }}>
            {concerts.map((c, i) => (
              <div key={c._id} style={{ animation:`fadeUp .35s ${i*.05}s ease both` }}>
                <ConcertCard concert={c} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'7px' }}>
              <Btn variant="ghost" size="sm" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>← Prev</Btn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ 
                    width:'34px', height:'34px', borderRadius:'var(--r)', fontSize:'13px', fontWeight:500,
                    cursor:'pointer', transition:'var(--t)',
                    background: p === currentPage ? 'var(--accent)' : 'var(--surface2)',
                    color: p === currentPage ? '#000' : 'var(--text2)',
                    border:'1px solid var(--border2)'
                  }}>
                  {p}
                </button>
              ))}
              <Btn variant="ghost" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>Next →</Btn>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Concerts;