import React, { useState, useEffect } from 'react';

export default function KhoKhoEditor({ match, onScoreUpdate, onUndo, disabled }) {
  const [score, setScore] = useState(match.score);
  const [eventDesc, setEventDesc] = useState('');

  // Local timer state
  const [timeLeft, setTimeLeft] = useState(score.timeRemaining || 540);
  const [timerRunning, setTimerRunning] = useState(false);

  // Sync internal state with external score if it changes
  useEffect(() => {
    setScore(match.score);
    if (!timerRunning) setTimeLeft(match.score.timeRemaining);
  }, [match.score, timerRunning]);

  useEffect(() => {
    let interval;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      handleScoreSync(`Time up for ${score.turn === 'teamA' ? match.teamA : match.teamB} turn`);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, score.turn, match]);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
    handleScoreSync(`Timer ${!timerRunning ? 'started' : 'paused'} at ${formatTime(timeLeft)}`);
  };

  const addPoint = (team) => {
    const newScore = { ...score };
    newScore[team].points += 1;
    setScore(newScore);
    onScoreUpdate(newScore, `Point scored by ${match[team]}`);
  };

  const removePoint = (team) => {
    const newScore = { ...score };
    if (newScore[team].points > 0) {
      newScore[team].points -= 1;
      setScore(newScore);
      onScoreUpdate(newScore, `Point corrected for ${match[team]}`);
    }
  };

  const toggleTurn = () => {
    if (confirm('Switch turns (Chasing/Defending)? Timer will reset to 9 minutes.')) {
      setTimerRunning(false);
      const newScore = {
        ...score,
        turn: score.turn === 'teamA' ? 'teamB' : 'teamA',
        timeRemaining: 540 // Reset to 9 mins
      };
      setScore(newScore);
      setTimeLeft(540);
      onScoreUpdate(newScore, `Turn switched. ${score.turn === 'teamA' ? match.teamB : match.teamA} is now chasing.`);
    }
  };

  const handleScoreSync = (event = '') => {
    const newScore = { ...score, timeRemaining: timeLeft, timerRunning };
    setScore(newScore);
    onScoreUpdate(newScore, event);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.6 : 1 }}>
      {/* Timer Section */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', background: 'var(--bg-card-hover)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Chasing Turn: <span style={{ color: 'var(--accent-yellow)' }}>{score.turn === 'teamA' ? match.teamA : match.teamB}</span></div>
        <div style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, color: timeLeft <= 60 ? '#ef4444' : '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(timeLeft)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '1.5rem' }}>
          <button onClick={toggleTimer} className={`btn ${timerRunning ? 'btn-warning' : 'btn-success'}`}>
            {timerRunning ? '⏸ Pause Timer' : '▶ Start Timer'}
          </button>
          <button onClick={() => handleScoreSync('Score/Timer synced')} className="btn btn-outline">Sync State</button>
          <button onClick={toggleTurn} className="btn btn-outline">Switch Turn</button>
        </div>
      </div>

      {/* Points Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '1.5rem' }}>
        {['teamA', 'teamB'].map(team => (
          <div key={team} style={{ textAlign: 'center', padding: '1.5rem', borderRadius: '10px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px', color: score.turn === team ? 'var(--accent-yellow)' : 'inherit' }}>
              {match[team]} {score.turn === team && '(Chasing)'}
            </h4>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: '1rem' }}>
              {score[team].points}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button onClick={() => removePoint(team)} className="btn btn-outline btn-sm">-1</button>
              <button onClick={() => addPoint(team)} className="btn btn-primary">+1 Point</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input className="input" placeholder="Custom Event Log" value={eventDesc} onChange={e => setEventDesc(e.target.value)} style={{ flex: 1 }} />
        <button onClick={() => { if(eventDesc) { handleScoreSync(eventDesc); setEventDesc(''); } }} className="btn btn-primary">Publish Event</button>
        <button onClick={onUndo} className="btn btn-outline" style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)', marginLeft: 'auto' }}>
          ↩ Undo Action
        </button>
      </div>
    </div>
  );
}
