import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

import SportIcon from './SportIcon';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 1.5rem',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.jpg" alt="Poornodaya E.M. School Logo" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'contain', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.2)' }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            PURNODAYA SPORTS
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>Live Scoreboard</div>
        </div>
      </Link>

      {/* Center sport icons */}
      <div style={{ display: 'flex', gap: '6px', fontSize: '1.2rem' }}>
        {['cricket', 'badminton', 'kabaddi', 'kho-kho'].map((sport, i) => (
          <SportIcon key={i} sport={sport} style={{ opacity: 0.8 }} />
        ))}
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: connected ? 'var(--accent-green)' : 'var(--text-muted)' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: connected ? 'var(--accent-green)' : 'var(--text-muted)',
            animation: connected ? 'pulse-live 2s infinite' : 'none'
          }} />
          {connected ? 'Live' : 'Connecting'}
        </div>

        {user ? (
          <>
            <Link to="/admin" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
              ⚡ Admin Panel
            </Link>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              👤 {user.username}
            </span>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
}
