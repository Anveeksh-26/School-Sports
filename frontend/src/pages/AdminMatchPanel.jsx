import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

// ──── Sport-specific Score Editor components ────
import CricketEditor from '../components/scoreEditors/CricketEditor';
import BadmintonEditor from '../components/scoreEditors/BadmintonEditor';
import KabaddiEditor from '../components/scoreEditors/KabaddiEditor';
import KhoKhoEditor from '../components/scoreEditors/KhoKhoEditor';

const API = import.meta.env.VITE_API_URL || '/api';
import SportIcon from '../components/SportIcon';
const SPORT_EDITOR = { cricket: CricketEditor, badminton: BadmintonEditor, kabaddi: KabaddiEditor, 'kho-kho': KhoKhoEditor };

export default function AdminMatchPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const { joinMatch, leaveMatch, emitScoreUpdate, emitStatusUpdate } = useSocket();

  const fetchMatch = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/matches/${id}`);
      setMatch(data);
    } catch { navigate('/admin'); }
    finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => {
    fetchMatch();
    joinMatch(id);
    return () => leaveMatch(id);
  }, [fetchMatch, id, joinMatch, leaveMatch]);

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Called by sport-specific editors when score changes
  const handleScoreUpdate = async (newScore, eventDesc) => {
    if (!match) return;
    setSaving(true);
    try {
      const { data } = await axios.patch(`${API}/matches/${id}/score`, {
        score: newScore,
        event: eventDesc,
      });
      setMatch(data);
      // Broadcast to all viewers watching this match
      emitScoreUpdate({
        matchId: id,
        score: newScore,
        event: eventDesc
      });
      showNotif('Score updated ✓');
    } catch {
      showNotif('Failed to update score', 'error');
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (newStatus, winner = null) => {
    setSaving(true);
    try {
      const { data } = await axios.patch(`${API}/matches/${id}/status`, { status: newStatus, winner });
      setMatch(data);
      emitStatusUpdate({
        matchId: id,
        status: newStatus,
        winner
      });
      showNotif(`Match ${newStatus} ✓`);
    } catch {
      showNotif('Failed to update status', 'error');
    } finally { setSaving(false); }
  };
  
  const handleUndo = async () => {
    if (!confirm('Undo last action?')) return;
    setSaving(true);
    try {
      const { data } = await axios.patch(`${API}/matches/${id}/undo`);
      setMatch(data);
      emitScoreUpdate({
        matchId: id,
        score: data.score,
        event: 'Last action undone'
      });
      showNotif('Action undone ✓');
    } catch (err) {
      showNotif(err.response?.data?.message || 'Failed to undo', 'error');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading match...</div>
  );
  if (!match) return null;

  const EditorComponent = SPORT_EDITOR[match.sport];
  const statusColor = { live: 'badge-live', upcoming: 'badge-upcoming', paused: 'badge-paused', completed: 'badge-completed' };

  return (
    <div className="container animate-fadeIn">
      {/* Back + Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <button onClick={() => navigate('/admin')} className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem', borderRadius: '30px' }}>
          ← Back to Admin
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            fontSize: '3rem', 
            background: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <SportIcon sport={match.sport} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {match.teamA} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8em' }}>VS</span> {match.teamB}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span className={`badge ${statusColor[match.status] || 'badge-upcoming'}`} style={{ fontSize: '0.75rem' }}>
                {match.status}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {match.sport}
              </span>
              {saving && <span style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 700 }}>⏳ SAVING...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="animate-popIn" style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
          background: notification.type === 'error' ? 'var(--accent-red)' : 'var(--accent-green)',
          color: 'white', padding: '14px 28px', borderRadius: '50px',
          fontWeight: 800, boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          {notification.type === 'error' ? '⚠️' : '✅'} {notification.msg}
        </div>
      )}

      <div className="stack-on-mobile" style={{ alignItems: 'start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          {/* Match Controls */}
          <div className="card">
            <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', fontSize: '1.1rem', letterSpacing: '0.05em' }}>⚙️ CONTROLS</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {match.status !== 'live' && match.status !== 'completed' && (
                <button className="btn btn-success" onClick={() => handleStatusChange('live')} style={{ flex: 1 }}>
                  ▶ Start Match
                </button>
              )}
              {match.status === 'live' && (
                <button className="btn btn-warning" onClick={() => handleStatusChange('paused')} style={{ flex: 1 }}>
                  ⏸ Pause
                </button>
              )}
              {match.status === 'paused' && (
                <button className="btn btn-success" onClick={() => handleStatusChange('live')} style={{ flex: 1 }}>
                  ▶ Resume
                </button>
              )}
              {(match.status === 'live' || match.status === 'paused') && (
                <button className="btn btn-danger" onClick={() => {
                  const winner = prompt(`Enter winner team name (${match.teamA} or ${match.teamB} or Draw):`);
                  if (winner !== null) handleStatusChange('completed', winner);
                }} style={{ flex: 1 }}>
                  🏁 End Match
                </button>
              )}
            </div>
            {match.winner && (
              <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🏆</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>WINNER: {match.winner}</span>
              </div>
            )}
          </div>

          {/* Sport-Specific Score Editor */}
          {EditorComponent && (
            <div className="card">
              <h3 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                📊 SCORE MANAGEMENT
              </h3>
              <EditorComponent
                match={match}
                onScoreUpdate={handleScoreUpdate}
                onUndo={handleUndo}
                disabled={match.status === 'completed' || saving}
              />
            </div>
          )}
        </div>

        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Events Log */}
          <div className="card" style={{ maxHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', fontSize: '1.1rem', letterSpacing: '0.05em' }}>📜 EVENT LOG</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '5px' }}>
              {(!match.events || match.events.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No events recorded yet.
                </div>
              ) : (
                [...match.events].reverse().map((ev, i) => (
                  <div key={i} className="animate-slideIn" style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '4px', 
                    fontSize: '0.85rem', 
                    padding: '12px', 
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    borderLeft: '3px solid var(--accent-blue)'
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ fontWeight: 500 }}>{ev.description}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
