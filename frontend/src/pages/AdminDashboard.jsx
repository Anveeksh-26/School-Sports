import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '/api';
import SportIcon from '../components/SportIcon';
export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ sport: 'cricket', teamA: '', teamB: '' });
  const [error, setError] = useState('');

  const fetchMatches = async () => {
    try {
      const { data } = await axios.get(`${API}/matches`);
      setMatches(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMatches(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const { data } = await axios.post(`${API}/matches`, form);
      setMatches(prev => [data, ...prev]);
      setForm({ sport: 'cricket', teamA: '', teamB: '' });
      navigate(`/admin/match/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create match');
    } finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this match?')) return;
    try {
      await axios.delete(`${API}/matches/${id}`);
      setMatches(prev => prev.filter(m => m._id !== id));
    } catch (e) { alert('Failed to delete match'); }
  };

  const statusColor = { live: 'badge-live', upcoming: 'badge-upcoming', completed: 'badge-completed', paused: 'badge-paused' };

  return (
    <div className="container animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>⚡ <span className="gradient-text">Admin Panel</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
          Welcome back, <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{user?.username}</span>!
        </p>
      </div>

      <div className="stack-on-mobile" style={{ alignItems: 'start' }}>
        {/* Create Match Form */}
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.2rem', letterSpacing: '0.05em' }}>➕ NEW MATCH</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label">SPORT</label>
              <select
                className="input"
                value={form.sport}
                onChange={e => setForm(p => ({ ...p, sport: e.target.value }))}
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                {['cricket', 'badminton', 'kabaddi', 'kho-kho'].map(s => (
                  <option key={s} value={s} style={{ background: '#0f172a' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">TEAM A</label>
              <input className="input" placeholder="e.g. Red Eagles" value={form.teamA}
                onChange={e => setForm(p => ({ ...p, teamA: e.target.value }))} required />
            </div>
            <div>
              <label className="label">TEAM B</label>
              <input className="input" placeholder="e.g. Blue Lions" value={form.teamB}
                onChange={e => setForm(p => ({ ...p, teamB: e.target.value }))} required />
            </div>
            {error && (
              <div className="animate-popIn" style={{ color: '#f87171', fontSize: '0.85rem', padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
                ⚠️ {error}
              </div>
            )}
            <button type="submit" className="btn btn-success" disabled={creating} style={{ padding: '14px', marginTop: '10px' }}>
              {creating ? 'Creating...' : '🚀 Launch Match'}
            </button>
          </form>
        </div>

        {/* All Matches */}
        <div style={{ flex: 1, width: '100%' }}>
          <h2 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.2rem', letterSpacing: '0.05em' }}>📋 LIVE & RECENT</h2>
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', padding: '4rem', textAlign: 'center' }}>
              <div className="animate-spin" style={{ display: 'inline-block', fontSize: '2rem' }}>💿</div>
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>Syncing matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏟️</div>
              <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No matches yet. Let's start one!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {matches.map(m => (
                <div key={m._id} className="card animate-popIn" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: '200px' }}>
                    <div style={{ fontSize: '1.6rem', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                      <SportIcon sport={m.sport} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{m.teamA} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs</span> {m.teamB}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginTop: '2px' }}>{m.sport}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span className={`badge ${statusColor[m.status] || 'badge-upcoming'}`}>
                      {m.status}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/admin/match/${m._id}`} className="btn btn-primary btn-sm" style={{ borderRadius: '10px' }}>
                        Manage
                      </Link>
                      <button onClick={() => handleDelete(m._id)} className="btn btn-outline btn-sm" style={{ color: 'var(--accent-red)', padding: '8px' }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

