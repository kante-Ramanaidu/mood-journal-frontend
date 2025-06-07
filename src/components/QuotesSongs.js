import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuotesSongs.css'; // Your custom styles

export default function QuotesSongs() {
  const location = useLocation();
  const navigate = useNavigate();
  const mood = location.state?.mood || null;

  const [songs, setSongs] = useState([]);
  const [quotes, setQuotes] = useState([]); // Now an array of quotes
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [errorSongs, setErrorSongs] = useState(null);
  const [errorQuotes, setErrorQuotes] = useState(null);

  // Fetch quotes from your backend
  const fetchQuotes = async () => {
    if (!mood) return;
    setLoadingQuotes(true);
    setErrorQuotes(null);

    try {
      const res = await fetch(`http://localhost:5000/api/quotes?mood=${mood}`);
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const data = await res.json();
      setQuotes(data);
    } catch (err) {
      setErrorQuotes('Could not load quotes.');
    } finally {
      setLoadingQuotes(false);
    }
  };

  // Fetch songs as before
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
    fetchQuotes();
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
          <h3>Quotes</h3>
        </div>
        {loadingQuotes && <p>Loading quotes...</p>}
        {errorQuotes && <p className="error">{errorQuotes}</p>}
        {quotes.length > 0 ? (
          quotes.map((quoteObj, index) => (
            <blockquote key={index} className="quote-card">
              “{quoteObj.content || quoteObj.q}” — <b>{quoteObj.author || quoteObj.a}</b>
            </blockquote>
          ))
        ) : (
          !loadingQuotes && <p>No quotes found for this mood.</p>
        )}
        
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
