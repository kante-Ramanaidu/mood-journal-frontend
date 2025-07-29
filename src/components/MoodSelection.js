import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MoodSelection.css';

const moods = [
  { id: 'happy', label: '😊', title: 'Happy', desc: 'Joyful, content, pleased' },
  { id: 'calm', label: '😌', title: 'Calm', desc: 'Relaxed, peaceful, at ease' },
  { id: 'neutral', label: '🤔', title: 'Neutral', desc: 'OK, fine, indifferent' },
  { id: 'worried', label: '😟', title: 'Worried', desc: 'Anxious, concerned, uneasy' },
  { id: 'sad', label: '😢', title: 'Sad', desc: 'Down, blue, unhappy' },
  { id: 'frustrated', label: '😤', title: 'Frustrated', desc: 'Annoyed, irritated, agitated' },
  { id: 'angry', label: '😡', title: 'Angry', desc: 'Mad, furious, outraged' },
  { id: 'loved', label: '🥰', title: 'Loved', desc: 'Appreciated, cherished, adored' },
];

export default function MoodSelection({ userEmail }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dominantMood, setDominantMood] = useState(null);
  const [history, setHistory] = useState([]);
  const buttonRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMoodHistory() {
      if (!userEmail) return;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/mood/history?email=${encodeURIComponent(userEmail)}&days=7`
        );
        if (!res.ok) throw new Error('Failed to fetch mood history');
        const data = await res.json();
        setHistory(data.moodHistory || []);
        computeDominantMood(data.moodHistory || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMoodHistory();
  }, [userEmail]);

  const computeDominantMood = (data) => {
    const counts = {};
    data.forEach(({ mood }) => {
      const m = mood.toLowerCase();
      counts[m] = (counts[m] || 0) + 1;
    });

    let max = 0;
    let domMood = null;
    for (const mood in counts) {
      if (counts[mood] > max) {
        max = counts[mood];
        domMood = mood;
      }
    }
    setDominantMood(domMood ? domMood.charAt(0).toUpperCase() + domMood.slice(1) : null);
  };

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, mood }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save mood');
      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);

      // Auto scroll to button
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  };

  const handleGoToQuotes = () => {
    if (!selectedMood) {
      alert('Please select a mood first.');
      return;
    }
    navigate('/quotes', { state: { mood: selectedMood } });
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const handleGoToTriggers = () => {
    navigate('/triggers');
  };

  return (
    <div className="mood-container">
      <h2>How are you feeling today?</h2>
      <p className="subtitle">
        Track your mood to gain insights into your emotional patterns and improve your well-being.
      </p>

      <div className="mood-grid">
        {moods.map((m) => (
          <div
            key={m.id}
            className={`mood-card ${selectedMood === m.id ? 'selected' : ''}`}
            onClick={() => handleMoodSelect(m.id)}
          >
            <div className="emoji">{m.label}</div>
            <div className="title">{m.title}</div>
            <div className="desc">{m.desc}</div>
          </div>
        ))}
      </div>

      {loading && <p className="feedback">Saving mood...</p>}
      {message && <p className="feedback success">{message}</p>}
      {error && <p className="feedback error">{error}</p>}

      {selectedMood && (
        <div className="next-button-wrapper" ref={buttonRef}>
          <button className="next-button" onClick={handleGoToQuotes}>
            Go to Quotes & Songs
          </button>
        </div>
      )}

      <div className="mood-insights">
        <div className="insights-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Your Mood Insights</h3>
          <button className="view-history" onClick={handleViewHistory}>
            View Full History →
          </button>
        </div>

        <p className="subtitle">Track your mood regularly to see patterns and insights.</p>

        <div className="insight-cards">
          <div className="insight-card blue">
            <h4>Weekly Summary</h4>
            <p>
              {dominantMood
                ? `Your mood has been mostly ${dominantMood} this week.`
                : 'Not enough data to summarize this week.'}
            </p>
          </div>

          <div
            className="insight-card pink"
            onClick={handleGoToTriggers}
            style={{ cursor: 'pointer' }}
          >
            <h4>Mood Triggers</h4>
            <p>Identify what affects your emotional state.</p>
          </div>

          <div className="insight-card yellow">
            <h4>Recommendations</h4>
            <p>Activities to help maintain positive emotions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
