import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuotesSongs.css'; // Custom CSS file

export default function QuotesSongs() {
  const location = useLocation();
  const navigate = useNavigate();
  const mood = location.state?.mood || null;

  const [songs, setSongs] = useState([]);
  const [quote, setQuote] = useState('');
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [errorSongs, setErrorSongs] = useState(null);
  const [errorQuote, setErrorQuote] = useState(null);

  // ✅ Reusable: Fetch quote
  const fetchQuote = async () => {
    setLoadingQuote(true);
    setErrorQuote(null);
    try {
      const res = await fetch(
        'https://api.quotable.io/random?tags=motivational|inspirational&maxLength=140'
      );
      if (!res.ok) throw new Error('Failed to fetch quote');
      const data = await res.json();
      setQuote(data.content);
    } catch (err) {
      setErrorQuote('Could not load quote.');
    } finally {
      setLoadingQuote(false);
    }
  };

  // ✅ Reusable: Fetch songs
  const fetchSongs = async () => {
    if (!mood) return;
    setLoadingSongs(true);
    setErrorSongs(null);
    try {
      const res = await fetch(`http://localhost:5000/api/songs?mood=${mood}`);
      if (!res.ok) throw new Error('Failed to fetch songs');
      const data = await res.json();
      setSongs(data.items || []);
    } catch (err) {
      setErrorSongs(err.message);
    } finally {
      setLoadingSongs(false);
    }
  };

  useEffect(() => {
    if (!mood) {
      alert('Please select a mood first.');
      navigate('/');
      return;
    }

    fetchSongs();
    fetchQuote();
  }, [mood, navigate]);

  if (!mood) return null;

  return (
    <div className="quotes-songs-container">
      <div className="header">
        <h2>Quotes & Songs for "{mood.charAt(0).toUpperCase() + mood.slice(1)}" Mood</h2>
        <p className="subtitle">Discover inspiration and relaxation for your peaceful state of mind</p>
      </div>

      <section className="quote-section">
        <div className="section-title">
          <span role="img" aria-label="quote">💬</span>
          <h3>Quote</h3>
        </div>
        {loadingQuote && <p>Loading quote...</p>}
        {errorQuote && <p className="error">{errorQuote}</p>}
        {quote && (
          <blockquote className="quote-card">
            “{quote}”
          </blockquote>
        )}
        <button className="refresh-btn" onClick={fetchQuote}>
          🔄 New Quote
        </button>
      </section>

      <section className="songs-section">
        <div className="section-title">
          <span role="img" aria-label="music">🎵</span>
          <h3>Songs</h3>
        </div>
        {loadingSongs && <p>Loading songs...</p>}
        {errorSongs && <p className="error">{errorSongs}</p>}
        <div className="songs-grid">
          {songs.map((song) => (
            <div key={song.id.videoId} className="song-card">
              <div className="song-icon">▶️</div>
              <div className="song-info">
                <a
                  href={`https://www.youtube.com/watch?v=${song.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h4>{song.snippet.title}</h4>
                </a>
                <p>{song.snippet.channelTitle}</p>
              </div>
            </div>
          ))}
        </div>
        {songs.length > 0 && (
          <button className="view-more-btn" onClick={fetchSongs}>
            🔄 View More Songs
          </button>
        )}
      </section>
    </div>
  );
}
