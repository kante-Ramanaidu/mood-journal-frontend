import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LoginSignup from './components/LoginSignup';
import MoodSelection from './components/MoodSelection';
import QuotesSongs from './components/QuotesSongs';
import MoodHistory from './components/MoodHistory';
import Account from './components/Account';
import Navbar from './components/Navbar';
import MoodLogger from './components/MoodLogger';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';

function App() {
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail'));
  const isLoggedIn = Boolean(userEmail);
  const location = useLocation();

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [userEmail]);

  // Determine if navbar should be shown
  const showNavbar = isLoggedIn && location.pathname !== '/';

  return (
  <div className="app-container">
    {showNavbar && <Navbar userEmail={userEmail} setUserEmail={setUserEmail} />}

    <main>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/mood" /> : <LoginSignup onLogin={setUserEmail} />}
        />
        <Route
          path="/mood"
          element={isLoggedIn ? <MoodSelection userEmail={userEmail} /> : <Navigate to="/login" />}
        />
        <Route
          path="/quotes"
          element={isLoggedIn ? <QuotesSongs userEmail={userEmail} /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={isLoggedIn ? <MoodHistory userEmail={userEmail} /> : <Navigate to="/login" />}
        />
        <Route
          path="/triggers"
          element={isLoggedIn ? <MoodLogger userEmail={userEmail} /> : <Navigate to="/login" />}
        />
        <Route
          path="/account"
          element={isLoggedIn ? <Account userEmail={userEmail} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </main>

    <Footer />
  </div>
);

}

export default App;
