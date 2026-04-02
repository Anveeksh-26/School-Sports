import React from 'react';
import { Link } from 'react-router-dom';

import SportIcon from './SportIcon';
const SPORT_COLOR = { cricket: 'var(--accent-green)', badminton: 'var(--accent-blue)', kabaddi: 'var(--accent-purple)', 'kho-kho': 'var(--accent-yellow)' };
const statusColor = { live: 'badge-live', upcoming: 'badge-upcoming', completed: 'badge-completed', paused: 'badge-paused' };

/** Sport-specific Score Blocks */
const CricketScore = ({ score }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '15px', alignItems: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>{score.teamA?.runs}/{score.teamA?.wickets}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{score.teamA?.overs} OV</div>
    </div>
    <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>VS</div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>{score.teamB?.runs}/{score.teamB?.wickets}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{score.teamB?.overs} OV</div>
    </div>
  </div>
);

const BadmintonScore = ({ score }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59,130,246,0.05)', padding: '12px 20px', borderRadius: '15px', border: '1px solid rgba(59,130,246,0.1)' }}>
      <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-blue)', fontFamily: 'Outfit' }}>{score.teamA?.points}</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CURRENT SET</div>
        <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>SET {score.currentSet}</div>
      </div>
      <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-blue)', fontFamily: 'Outfit' }}>{score.teamB?.points}</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '0.85rem' }}>
      <div style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
        <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>SETS</span>
        <span style={{ fontWeight: 800 }}>{score.teamA?.sets} – {score.teamB?.sets}</span>
      </div>
    </div>
  </div>
);

const KabaddiScore = ({ score }) => (
  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent-purple)', fontFamily: 'Outfit', lineHeight: 1 }}>{score.teamA?.totalPoints}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '5px', textTransform: 'uppercase' }}>POINTS</div>
    </div>
    <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.1)', fontSize: '1rem' }}>:</div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent-purple)', fontFamily: 'Outfit', lineHeight: 1 }}>{score.teamB?.totalPoints}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '5px', textTransform: 'uppercase' }}>POINTS</div>
    </div>
  </div>
);

const KhoKhoScore = ({ score }) => (
  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
     <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent-yellow)', fontFamily: 'Outfit', lineHeight: 1 }}>{score.teamA?.points}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '5px', textTransform: 'uppercase' }}>POINTS</div>
    </div>
    <div style={{ textAlign: 'center', background: 'rgba(245,158,11,0.08)', padding: '10px 15px', borderRadius: '15px', border: '1px solid rgba(245,158,11,0.1)' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CHASING</div>
      <div style={{ fontSize: '0.9rem', color: 'var(--accent-yellow)', fontWeight: 800 }}>{score.turn === 'teamA' ? 'TEAM A' : 'TEAM B'}</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent-yellow)', fontFamily: 'Outfit', lineHeight: 1 }}>{score.teamB?.points}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '5px', textTransform: 'uppercase' }}>POINTS</div>
    </div>
  </div>
);

const ScoreRenderer = ({ sport, score }) => {
  if (!score || !score.teamA) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600, padding: '1rem' }}>AWAITING DATA...</div>;
  switch (sport) {
    case 'cricket': return <CricketScore score={score} />;
    case 'badminton': return <BadmintonScore score={score} />;
    case 'kabaddi': return <KabaddiScore score={score} />;
    case 'kho-kho': return <KhoKhoScore score={score} />;
    default: return <div>Generic Score View</div>;
  }
};

export default function ScoreCard({ match }) {
  const isLive = match.status === 'live';

  return (
    <div className={`card ${isLive ? 'glow-blue' : ''}`} style={{
      display: 'flex', flexDirection: 'column',
      borderTop: `6px solid ${SPORT_COLOR[match.sport] || 'var(--accent-blue)'}`,
      padding: '1.25rem'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
          <SportIcon sport={match.sport} />
          <span style={{ color: SPORT_COLOR[match.sport] }}>{match.sport}</span>
        </div>
        <span className={`badge ${statusColor[match.status] || 'badge-upcoming'}`}>
          {isLive && <span style={{ marginRight: '4px' }}>●</span>}{match.status}
        </span>
      </div>

      {/* Teams Overview */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '15px' }}>
        <div style={{ fontWeight: 800, fontSize: '1.2rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Outfit' }}>
          {match.teamA}
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', opacity: 0.5 }}>VS</div>
        <div style={{ fontWeight: 800, fontSize: '1.2rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right', fontFamily: 'Outfit' }}>
          {match.teamB}
        </div>
      </div>

      {/* The Actual Score Graphic */}
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem 1rem', borderRadius: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
        <ScoreRenderer sport={match.sport} score={match.score} />
      </div>

      {/* Footer / Winner Announcement */}
      {match.winner ? (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem', border: '1px solid rgba(16,185,129,0.2)' }}>
          🏆 WINNER: {match.winner.toUpperCase()}
        </div>
      ) : match.status === 'upcoming' ? (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
          MATCH STARTING SOON
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
          LIVE TRACKING ACTIVE
        </div>
      )}
    </div>
  );
}

