import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuotesSongs.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function QuotesSongs() {
  const location = useLocation();
  const navigate = useNavigate();
  const mood = location.state?.mood || null;

  const [songs, setSongs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [visibleQuoteIndex, setVisibleQuoteIndex] = useState(0);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [errorSongs, setErrorSongs] = useState(null);
  const [errorQuotes, setErrorQuotes] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  const shuffleArray = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  const fetchQuotes = async () => {
    if (!mood) return;
    setLoadingQuotes(true);
    setErrorQuotes(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/quotes?mood=${mood}`);
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const data = await res.json();
      const shuffledQuotes = shuffleArray(data);
      setQuotes(shuffledQuotes);
      setVisibleQuoteIndex(0);
    } catch (err) {
      setErrorQuotes('Could not load quotes.');
    } finally {
      setLoadingQuotes(false);
    }
  };

  const fetchSongs = async () => {
    if (!mood) return;
    setLoadingSongs(true);
    setErrorSongs(null);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/songs?mood=${mood}${
          nextPageToken ? `&pageToken=${nextPageToken}` : ''
        }`
      );
      if (!res.ok) throw new Error('Failed to fetch songs');
      const data = await res.json();
      setSongs((prev) => [...prev, ...(data.items || [])]);
      setNextPageToken(data.nextPageToken || null);
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

  const refreshQuotes = () => {
    if (visibleQuoteIndex + 2 < quotes.length) {
      setVisibleQuoteIndex((prev) => prev + 2);
    } else {
      const reshuffled = shuffleArray([...quotes]);
      setQuotes(reshuffled);
      setVisibleQuoteIndex(0);
    }
  };

  if (!mood) return null;

  return (
    <div className="quotes-songs-container">
      <div className="header">
        <h2>
          🌟 Your Mood:{' '}
          <span className="mood-text">
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </span>
        </h2>
        <p className="subtitle">
          Here are hand-picked quotes and songs to match your vibe.
        </p>
      </div>

      {/* QUOTES SECTION */}
      <section className="quote-section">
        <h3 className="section-title">💬 Inspirational Quotes</h3>
        {loadingQuotes && <p className="loading">Loading quotes...</p>}
        {errorQuotes && <p className="error">{errorQuotes}</p>}
        <div className="grid quote-grid">
          {quotes.length > 0 ? (
            quotes
              .slice(visibleQuoteIndex, visibleQuoteIndex + 2)
              .map((q, index) => (
                <div key={index} className="quote-card">
                  <p>"{q.content || q.q}"</p>
                  <span>— {q.author || q.a}</span>
                </div>
              ))
          ) : (
            !loadingQuotes && <p className="empty">No quotes found.</p>
          )}
        </div>
        {quotes.length > 2 && (
          <button className="view-more-btn" onClick={refreshQuotes}>
            🔄 Refresh Quotes
          </button>
        )}
      </section>

      {/* SONGS SECTION */}
      <section className="songs-section">
        <h3 className="section-title">🎵 Mood-Based Songs</h3>
        {loadingSongs && <p className="loading">Loading songs...</p>}
        {errorSongs && <p className="error">{errorSongs}</p>}
        <div className="grid songs-grid">
          {songs.map((song) => (
            <a
              key={song.id.videoId}
              href={`https://www.youtube.com/watch?v=${song.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="song-card"
            >
              <div className="icon-wrap">
                <div className="icon-music">🎵</div>
              </div>
              <div className="song-info">
                <h4>{song.snippet.title}</h4>
                <p>{song.snippet.channelTitle}</p>
              </div>
              <div className="play-icon">▶</div>
            </a>
          ))}
        </div>
        {songs.length > 0 && nextPageToken && (
          <button className="view-more-btn" onClick={fetchSongs}>
            🔄 Load More Songs
          </button>
        )}
      </section>
    </div>
  );
}
