import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './MoodHistory.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const moodsList = [
  'calm',
  'happy',
  'sad',
  'energetic',
  'angry',
  'anxious',
  'relaxed',
  'stressed',
];

export default function MoodHistory({ userEmail }) {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);

  const [availableTriggers, setAvailableTriggers] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);

  useEffect(() => {
    if (!userEmail) return;

    async function fetchHistory() {
      setLoading(true);
      setError(null);

      let url = `http://localhost:5000/api/mood/history?email=${encodeURIComponent(userEmail)}&days=${days}`;
      if (selectedTriggers.length > 0) {
        const triggersParam = encodeURIComponent(selectedTriggers.join(','));
        url += `&triggers=${triggersParam}`;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch mood history');
        const data = await res.json();
        setMoodHistory(data.moodHistory || []);

        const triggersSet = new Set();
        (data.moodHistory || []).forEach(entry => {
          (entry.triggers || []).forEach(t => triggersSet.add(t));
        });
        setAvailableTriggers(Array.from(triggersSet).sort());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [userEmail, days, selectedTriggers]);

  if (!userEmail)
    return <p className="mood-history-message">Please log in to view your mood history.</p>;

  const filteredMoodHistory =
    selectedTriggers.length > 0
      ? moodHistory.filter(entry =>
          entry.triggers && entry.triggers.some(t => selectedTriggers.includes(t))
        )
      : moodHistory;

  const moodCounts = moodsList.reduce((acc, mood) => {
    acc[mood] = 0;
    return acc;
  }, {});

  filteredMoodHistory.forEach(({ mood }) => {
    const m = mood.toLowerCase();
    if (moodsList.includes(m)) moodCounts[m]++;
  });

  const moodColors = {
    calm: '#3498db',
    happy: '#2ecc71',
    sad: '#9b59b6',
    energetic: '#e67e22',
    angry: '#e74c3c',
    anxious: '#f1c40f',
    relaxed: '#1abc9c',
    stressed: '#d35400',
  };

  const chartData = {
    labels: moodsList.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
    datasets: [
      {
        label: 'Mood Count',
        data: moodsList.map(m => moodCounts[m]),
        backgroundColor: moodsList.map(m => moodColors[m]),
        borderRadius: 8,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${context.raw} times`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  const toggleTrigger = (trigger) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  // Clear filters handler
  const clearFilters = () => {
    setSelectedTriggers([]);
  };

  return (
    <div className="mood-history-container">
      <h2 className="mood-history-header">Your Mood History (Last {days} Days)</h2>

      <div className="mood-history-filter">
        <label htmlFor="days-select" className="filter-label">
          Show moods for past{' '}
          <select
            id="days-select"
            value={days}
            onChange={e => setDays(Number(e.target.value))}
          >
            <option value={1}>1 day</option>
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
          </select>{' '}
          days
        </label>

        {availableTriggers.length > 0 && (
          <button
            className="clear-filter-btn"
            onClick={clearFilters}
            type="button"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="trigger-filter">
        <p><strong>Filter by Triggers:</strong></p>
        {availableTriggers.length === 0 && <p>Add Mood triggers</p>}

        <div className="trigger-filter-list">
          {availableTriggers.map(trigger => (
            <label
              key={trigger}
              className={`trigger-filter-option ${
                selectedTriggers.includes(trigger) ? 'selected' : ''
              }`}
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
      </div>

      {loading && <p className="mood-history-message">Loading mood history...</p>}
      {error && <p className="mood-history-message mood-history-error">{error}</p>}

      {!loading && filteredMoodHistory.length === 0 && (
        <p className="mood-history-no-data">
          No mood history found for the selected period and triggers.
        </p>
      )}

      {!loading && filteredMoodHistory.length > 0 && (
        <div className="mood-chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
