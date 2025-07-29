import { useState } from 'react';
import './MoodLogger.css';

const availableTriggers = [
  'Work',
  'Family',
  'Sleep',
  'Diet',
  'Health',
  'Finances',
  'Weather',
  'Social Media',
  'Relationships',
  'Deadlines',
];

const moodRecommendations = {
  happy: [
    'Keep up the good vibes with a walk outside.',
    'Share your joy with a friend.',
    'Listen to your favorite upbeat music.',
  ],
  anxious: [
    'Try some deep breathing exercises.',
    'Write down what’s worrying you.',
    'Take a short break and stretch.',
  ],
  sad: [
    'Watch a favorite comedy or uplifting movie.',
    'Call a loved one for support.',
    'Go for a gentle walk or do some light exercise.',
  ],
  calm: [
    'Continue your mindfulness or meditation practice.',
    'Read a book or listen to soothing music.',
  ],
  angry: [
    'Try some physical exercise to release tension.',
    'Practice deep breathing or meditation.',
    'Take some time alone to cool down.',
  ],
  energetic: [
    'Channel your energy into a workout.',
    'Try a new hobby or creative activity.',
  ],
  stressed: [
    'Prioritize your tasks and take breaks.',
    'Try yoga or progressive muscle relaxation.',
  ],
  relaxed: [
    'Enjoy some quiet time or a hobby you love.',
    'Consider journaling your thoughts.',
  ],
};

export default function MoodLogger({ userEmail }) {
  const [mood, setMood] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecs, setShowRecs] = useState(false);

  const toggleTrigger = (trigger) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood) return alert('Select a mood');

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, mood, triggers: selectedTriggers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const moodLower = mood.toLowerCase();
      const recs = moodRecommendations[moodLower] || ['Keep taking care of yourself!'];
      setRecommendations(recs);
      setShowRecs(false);

      setMood('');
      setSelectedTriggers([]);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="mood-logger-wrapper">
      <form onSubmit={handleSubmit} className="mood-form">
        <h2>Log Your Mood</h2>

        <label>Mood:</label>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="e.g. happy, sad, Loved..."
        />

        <label>What triggered this mood?</label>
        <div className="trigger-grid">
          {availableTriggers.map((trigger) => (
            <label
              key={trigger}
              className={`trigger-option ${selectedTriggers.includes(trigger) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedTriggers.includes(trigger)}
                onChange={() => toggleTrigger(trigger)}
              />
              {trigger}
            </label>
          ))}
        </div>

        <button type="submit">Log Mood</button>
      </form>

      {recommendations.length > 0 && (
        <div className="recommendations-wrapper">
          <button
            className="toggle-recommendations-btn"
            onClick={() => setShowRecs((prev) => !prev)}
          >
            {showRecs ? 'Hide Recommendations' : 'Show Recommendations'}
          </button>

          {showRecs && (
            <div className="recommendations-section">
              <h3>Recommendations</h3>
              <ul>
                {recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
