import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  const active = (path) => loc.pathname === path || loc.pathname.startsWith(path + '/');

  const NavLink = ({ to, children }) => (
    <Link to={to} style={{
      fontSize:'13px', fontWeight:500, color: active(to) ? 'var(--accent)' : 'var(--text2)',
      padding:'5px 0', borderBottom:`1.5px solid ${active(to)?'var(--accent)':'transparent'}`,
      transition:'var(--t)',
    }}>{children}</Link>
  );

  const handleLogout = () => { logout(); nav('/'); };

  return (
    <nav style={{ position:'sticky', top:0, zIndex:200, background:'rgba(9,9,14,.93)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px', height:'58px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'26px', height:'26px', background:'var(--accent)', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px' }}>♪</div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'21px', letterSpacing:'.07em', color:'var(--text)' }}>SOUNDSTAGE</span>
        </Link>

        {/* Links */}
        <div style={{ display:'flex', gap:'26px', alignItems:'center' }}>
          <NavLink to="/concerts">Concerts</NavLink>
          {isAuthenticated && <NavLink to="/my-bookings">My Bookings</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </div>

        {/* Auth */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          {isAuthenticated ? (
            <>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'13px', fontWeight:500, color:'var(--text)' }}>{user.name}</div>
                {isAdmin && <div style={{ fontSize:'10px', color:'var(--accent)', fontWeight:700, letterSpacing:'.07em' }}>ADMIN</div>}
              </div>
              <button onClick={handleLogout} style={{ padding:'7px 14px', fontSize:'12.5px', background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:'var(--r)', color:'var(--text2)', cursor:'pointer', transition:'var(--t)' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding:'7px 14px', fontSize:'13px', color:'var(--text2)', transition:'var(--t)' }}>Login</Link>
              <Link to="/register" style={{ padding:'7px 16px', fontSize:'13px', fontWeight:600, background:'var(--accent)', color:'#000', borderRadius:'var(--r)', transition:'var(--t)' }}>Sign Up</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;