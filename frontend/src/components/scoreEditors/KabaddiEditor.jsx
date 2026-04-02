import React, { useState } from 'react';

export default function KabaddiEditor({ match, onScoreUpdate, onUndo, disabled }) {
  const [score, setScore] = useState(match.score);
  const [eventDesc, setEventDesc] = useState('');

  // Sync state if match changes
  React.useEffect(() => {
    setScore(match.score);
  }, [match.score]);

  const updatePoints = (team, type, value) => {
    const newScore = { ...score };
    newScore[team][type] += value;
    // Recalculate total points
    newScore[team].totalPoints = newScore[team].raidPoints + newScore[team].tacklePoints + newScore[team].bonusPoints;

    let action = value > 0 ? 'gained' : 'lost';
    let typeName = type.replace('Points', ' Points');
    const ev = `${match[team]} ${action} ${Math.abs(value)} ${typeName}`;

    setScore(newScore);
    onScoreUpdate(newScore, ev);
  };

  const publishEvent = () => {
    if (eventDesc) {
      onScoreUpdate(score, eventDesc);
      setEventDesc('');
    }
  };

  const teams = [
    { key: 'teamA', name: match.teamA },
    { key: 'teamB', name: match.teamB }
  ];

  return (
    <div style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.6 : 1 }}>
      <div className="stack-on-mobile" style={{ marginBottom: '1.5rem' }}>
        {teams.map(t => (
          <div key={t.key} style={{ flex: 1, padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--accent-purple)', fontWeight: 800 }}>{t.name}</h4>
            <div style={{ textAlign: 'center', fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', fontFamily: 'Outfit' }}>
              {score[t.key].totalPoints}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Raid Points ({score[t.key].raidPoints})</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => updatePoints(t.key, 'raidPoints', -1)} className="btn btn-outline btn-sm">-</button>
                  <button onClick={() => updatePoints(t.key, 'raidPoints', 1)} className="btn btn-outline btn-sm">+1</button>
                  <button onClick={() => updatePoints(t.key, 'raidPoints', 2)} className="btn btn-outline btn-sm">+2</button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tackle Points ({score[t.key].tacklePoints})</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => updatePoints(t.key, 'tacklePoints', -1)} className="btn btn-outline btn-sm">-</button>
                  <button onClick={() => updatePoints(t.key, 'tacklePoints', 1)} className="btn btn-outline btn-sm">+1</button>
                  <button onClick={() => updatePoints(t.key, 'tacklePoints', 2)} className="btn btn-outline btn-sm">+2</button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Bonus/All-Out ({score[t.key].bonusPoints})</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => updatePoints(t.key, 'bonusPoints', -1)} className="btn btn-outline btn-sm">-</button>
                  <button onClick={() => updatePoints(t.key, 'bonusPoints', 1)} className="btn btn-outline btn-sm">+1</button>
                  <button onClick={() => updatePoints(t.key, 'bonusPoints', 2)} className="btn btn-outline btn-sm">ALL OUT</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input className="input" placeholder="Custom Event (e.g., Super Tackle!)" value={eventDesc} onChange={e => setEventDesc(e.target.value)} style={{ flex: '1 1 200px' }} />
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between', marginTop: '10px' }}>
          <button onClick={publishEvent} className="btn btn-primary" style={{ flex: 1 }}>Publish Event</button>
          <button onClick={onUndo} className="btn btn-outline" style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}>
            ↩ Undo
          </button>
        </div>
      </div>
    </div>
  );
}

