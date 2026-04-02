import React, { useState } from 'react';

export default function CricketEditor({ match, onScoreUpdate, onUndo, disabled }) {
  const [score, setScore] = useState(match.score);
  const [eventDesc, setEventDesc] = useState('');

  // Sync internal state when match prop changes (e.g. after Undo)
  React.useEffect(() => {
    setScore(match.score);
  }, [match.score]);

  const currentTeam = score.currentInnings === 1 ? 'teamA' : 'teamB';
  const battingTeamName = currentTeam === 'teamA' ? match.teamA : match.teamB;
  const bowlingTeamName = currentTeam === 'teamA' ? match.teamB : match.teamA;

  const handleUpdate = (type, value) => {
    const newScore = { ...score };
    if (type === 'runs') newScore[currentTeam].runs += value;
    if (type === 'wickets') newScore[currentTeam].wickets += value;
    if (type === 'overs') newScore[currentTeam].overs = value;
    setScore(newScore);
  };

  const saveScore = (autoEvent = '') => {
    onScoreUpdate(score, autoEvent || eventDesc);
    setEventDesc('');
  };

  const addBall = (runs, extra = '') => {
    const newScore = { ...score };
    let ev = `${battingTeamName} scored ${runs} run(s)`;
    if (extra) {
      if (extra === 'W') {
        newScore[currentTeam].wickets += 1;
        ev = `WICKET! ${battingTeamName} loses a wicket`;
      } else {
        newScore[currentTeam].runs += 1; // e.g. Wide or No Ball
        ev = `Extra: ${extra} to ${battingTeamName}`;
      }
    } else {
      newScore[currentTeam].runs += runs;
    }

    // Rough over calculation (ignoring 6 balls logic for simplicity in this demo)
    const [o, b] = newScore[currentTeam].overs.split('.').map(Number);
    if (!extra || extra === 'W') {
      if (b === 5) newScore[currentTeam].overs = `${o + 1}.0`;
      else newScore[currentTeam].overs = `${o}.${b + 1}`;
    }

    setScore(newScore);
    onScoreUpdate(newScore, ev);
  };

  const toggleInnings = () => {
    if (confirm('Switch innings?')) {
      const newScore = { ...score, currentInnings: score.currentInnings === 1 ? 2 : 1 };
      setScore(newScore);
      onScoreUpdate(newScore, `Innings changed. ${currentTeam === 'teamA' ? match.teamB : match.teamA} is batting.`);
    }
  };

  return (
    <div style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.6 : 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '1.5rem' }}>
        {/* Team A */}
        <div style={{ background: currentTeam === 'teamA' ? 'var(--bg-card-hover)' : 'transparent', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: currentTeam === 'teamA' ? 'var(--accent-green)' : 'inherit' }}>{match.teamA} {currentTeam === 'teamA' && '(Batting)'}</h4>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{score.teamA.runs}/{score.teamA.wickets}</div>
          <div style={{ color: 'var(--text-muted)' }}>Overs: {score.teamA.overs}</div>
        </div>
        {/* Team B */}
        <div style={{ background: currentTeam === 'teamB' ? 'var(--bg-card-hover)' : 'transparent', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: currentTeam === 'teamB' ? 'var(--accent-green)' : 'inherit' }}>{match.teamB} {currentTeam === 'teamB' && '(Batting)'}</h4>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{score.teamB.runs}/{score.teamB.wickets}</div>
          <div style={{ color: 'var(--text-muted)' }}>Overs: {score.teamB.overs}</div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[0, 1, 2, 3, 4, 6].map(r => (
          <button key={r} onClick={() => addBall(r)} className="btn btn-outline" style={{ width: '45px', height: '45px', justifyContent: 'center', padding: 0 }}>
            {r}
          </button>
        ))}
        <button onClick={() => addBall(0, 'W')} className="btn btn-danger" style={{ height: '45px' }}>Wicket</button>
        <button onClick={() => addBall(0, 'Wd')} className="btn btn-warning" style={{ height: '45px' }}>Wide</button>
        <button onClick={() => addBall(0, 'Nb')} className="btn btn-warning" style={{ height: '45px' }}>No Ball</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          className="input"
          placeholder="Custom Event Description (e.g., Great catch!)"
          value={eventDesc}
          onChange={e => setEventDesc(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={() => saveScore()} className="btn btn-primary">Publish Event</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={onUndo} className="btn btn-outline" style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
            ↩ Undo
          </button>
          <button onClick={toggleInnings} className="btn btn-outline">Switch Innings</button>
        </div>
      </div>
    </div>
  );
}
