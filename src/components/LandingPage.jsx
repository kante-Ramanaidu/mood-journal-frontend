import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="hero-section">
        <h1>Mood Journal</h1>
        <p className="tagline">Track your emotions. Discover patterns. Heal better.</p>
        <div className="hero-buttons">
          {/* Navigate to /login with mode=login to show login form */}
          <button onClick={() => navigate('/login?mode=login')}>Log In</button>
          {/* Navigate to /login with mode=signup to show signup form */}
          <button onClick={() => navigate('/login?mode=signup')}>Sign Up</button>
        </div>
      </header>

      <section className="features-section">
        <h2>How It Works</h2>
        <div className="features-steps">
          <div className="step">
            <h3>1. Login</h3>
            <p>Create or access your account securely.</p>
          </div>
          <div className="step">
            <h3>2. Select Your Mood</h3>
            <p>Choose how you’re feeling today with simple mood cards.</p>
          </div>
          <div className="step">
            <h3>3. Get Quotes & Songs</h3>
            <p>Receive personalized motivational quotes and music based on your mood.</p>
          </div>
          <div className="step">
            <h3>4. Add Mood Triggers</h3>
            <p>Log possible triggers to reflect on your emotional health.</p>
          </div>
          <div className="step">
            <h3>5. View Mood History</h3>
            <p>Analyze trends and insights to improve well-being over time.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
