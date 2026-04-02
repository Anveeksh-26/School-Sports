import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import ScoreCard from '../components/ScoreCard';

const API = import.meta.env.VITE_API_URL || '/api';
const SPORTS = ['all', 'cricket', 'badminton', 'kabaddi', 'kho-kho'];
const STATUSES = ['all', 'live', 'upcoming', 'paused', 'completed'];

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSport, setFilterSport] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { onScoreUpdated, onStatusUpdated, joinMatch, leaveMatch } = useSocket();
  const fetchMatches = useCallback(async () => {
    try {
      const params = {};
      if (filterSport !== 'all') params.sport = filterSport;
      if (filterStatus !== 'all') params.status = filterStatus;
      const { data } = await axios.get(`${API}/matches`, { params });
      setMatches(data);
    } catch (err) {
      console.error('Failed to fetch matches', err);
    } finally {
      setLoading(false);
    }
  }, [filterSport, filterStatus]);
  useEffect(() => {
    if (!matches.length) return;

    // Join all match rooms
    matches.forEach(match => {
      joinMatch(match._id);
    });

    return () => {
      // Leave rooms on cleanup
      matches.forEach(match => {
        leaveMatch(match._id);
      });
    };
  }, [matches, joinMatch, leaveMatch]);
  useEffect(() => {
    setLoading(true);
    fetchMatches();
  }, [fetchMatches]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    const cleanupScore = onScoreUpdated((data) => {
      setMatches(prev => prev.map(m =>
        m._id === data.matchId ? { ...m, score: data.score } : m
      ));
    });
    const cleanupStatus = onStatusUpdated((data) => {
      setMatches(prev => prev.map(m =>
        m._id === data.matchId ? { ...m, status: data.status, winner: data.winner } : m
      ));
    });
    return () => { cleanupScore?.(); cleanupStatus?.(); };
  }, [onScoreUpdated, onStatusUpdated]);

  const liveCount = matches.filter(m => m.status === 'live').length;

  return (
    <div className="container animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: '3rem', textAlign: 'center', paddingTop: '1rem' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          <span className="gradient-text" style={{ display: 'block' }}>PURNODAYA</span>
          <span className="gradient-text" style={{ display: 'block' }}>Live Scoreboard</span>
        </h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {liveCount > 0
              ? `🔴 ${liveCount} match${liveCount > 1 ? 'es' : ''} LIVE now`
              : '🏟️ No live matches currently'}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {SPORTS.map(s => (
            <button
              key={s}
              onClick={() => setFilterSport(s)}
              className={`btn btn-sm ${filterSport === s ? 'btn-primary' : 'btn-outline'}`}
              style={{ textTransform: 'capitalize', borderRadius: '30px' }}
            >
              {s === 'all' ? '🏆 All' : s === 'cricket' ? '🏏 Cricket' : s === 'badminton' ? '🏸 Badminton' : s === 'kabaddi' ? '🤼 Kabaddi' : '🏃 Kho-Kho'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <select
            className="input"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ width: 'auto', minWidth: '180px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '30px' }}
          >
            {STATUSES.map(s => (
              <option key={s} value={s} style={{ background: '#0f172a' }}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Match Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-secondary)' }}>
          <div className="animate-pulse" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⏳</div>
          <p style={{ fontWeight: 600, letterSpacing: '0.05em' }}>FETCHING MATCHES...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏟️</div>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>No matches match your criteria.</p>
          <button onClick={() => { setFilterSport('all'); setFilterStatus('all'); }} className="btn btn-outline" style={{ marginTop: '20px' }}>Clear All Filters</button>
        </div>
      ) : (
        <div className="resp-grid">
          {matches.map(match => (
            <div key={match._id} className="animate-popIn">
              <ScoreCard match={match} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

