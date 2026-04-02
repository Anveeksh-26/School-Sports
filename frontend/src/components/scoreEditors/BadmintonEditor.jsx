import React, { useState } from 'react';

export default function BadmintonEditor({ match, onScoreUpdate, onUndo, disabled }) {
  const [score, setScore] = useState(match.score);
  const [eventDesc, setEventDesc] = useState('');

  // Sync state if match changes
  React.useEffect(() => {
    setScore(match.score);
  }, [match.score]);

  const saveScore = (newScore, event = '') => {
    setScore(newScore);
    onScoreUpdate(newScore, event);
  };

  const addPoint = (team) => {
    const newScore = { ...score };
    newScore[team].points += 1;
    const teamName = team === 'teamA' ? match.teamA : match.teamB;
    saveScore(newScore, `Point to ${teamName}`);
  };

  const subtractPoint = (team) => {
    const newScore = { ...score };
    if (newScore[team].points > 0) {
      newScore[team].points -= 1;
      setScore(newScore);
      onScoreUpdate(newScore, `Point corrected for ${team === 'teamA' ? match.teamA : match.teamB}`);
    }
  };

  const endSet = (winnerTeam) => {
    if (!confirm(`End Set ${score.currentSet} and award to ${winnerTeam === 'teamA' ? match.teamA : match.teamB}?`)) return;

    const newScore = { ...score };
    newScore.teamA.setHistory.push(newScore.teamA.points);
    newScore.teamB.setHistory.push(newScore.teamB.points);

    newScore[winnerTeam].sets += 1;
    newScore.currentSet += 1;

    // Reset current points for new set
    newScore.teamA.points = 0;
    newScore.teamB.points = 0;

    setScore(newScore);
    onScoreUpdate(newScore, `Set ends! Points: ${match.teamA} ${newScore.teamA.setHistory.slice(-1)} - ${newScore.teamB.setHistory.slice(-1)} ${match.teamB}`);
  };

  const saveCustomEvent = () => {
    if (eventDesc) {
      onScoreUpdate(score, eventDesc);
      setEventDesc('');
    }
  };

  return (
    <div style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.6 : 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-blue)', fontFamily: 'Outfit' }}>
        SET {score.currentSet}
      </div>

      <div className="stack-on-mobile" style={{ marginBottom: '1.5rem' }}>
        {['teamA', 'teamB'].map(team => (
          <div key={team} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>{match[team]}</h4>
            <div style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, color: 'var(--accent-blue)', marginBottom: '1rem', fontFamily: 'Outfit' }}>
              {score[team].points}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button onClick={() => subtractPoint(team)} className="btn btn-outline btn-sm">-1</button>
              <button onClick={() => addPoint(team)} className="btn btn-primary">+1 Point</button>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sets Won: <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{score[team].sets}</span></div>
              <button onClick={() => endSet(team)} className="btn btn-outline btn-sm" style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}>
                Award Set
              </button>
            </div>
          </div>
        ))}
      </div>

      {score.currentSet > 1 && (
        <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <strong>Set History:</strong> {match.teamA} [{score.teamA.setHistory.join(', ')}] | {match.teamB} [{score.teamB.setHistory.join(', ')}]
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input className="input" placeholder="Custom Event (e.g., Match point!)" value={eventDesc} onChange={e => setEventDesc(e.target.value)} style={{ flex: '1 1 200px' }} />
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between', marginTop: '10px' }}>
          <button onClick={saveCustomEvent} className="btn btn-primary" style={{ flex: 1 }}>Publish Event</button>
          <button onClick={onUndo} className="btn btn-outline" style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}>
            ↩ Undo
          </button>
        </div>
      </div>
    </div>
  );
}

