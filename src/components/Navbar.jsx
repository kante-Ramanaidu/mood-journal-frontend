import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ userEmail, setUserEmail }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setUserEmail(null);
    
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* MOBILE: Hamburger + Logo Center + Account Right */}
      <div className="mobile-bar">
        <button className="hamburger" onClick={toggleMobileMenu}>☰</button>

        <div className="logo">
          <img src="/assests/logo.png" alt="MoodTrack Logo" className="logo-image" />
          <span className="logo-text">MoodTrack</span>
        </div>

        <div className="account-wrapper" ref={dropdownRef}>
          <button className="account-button" onClick={toggleDropdown}>
            Account <span className="arrow"></span>
          </button>
          {dropdownOpen && (
            <div className="account-dropdown">
              <p className="signed-in">Signed in as</p>
              <p className="user-email">{userEmail}</p>
              <button className="logout-button" onClick={handleLogout}>
                <span className="logout-icon">🔓</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP: Logo + Links + Account */}
      <div className="desktop-bar">
        <div className="logo">
          <img src="/assests/logo.png" alt="MoodTrack Logo" className="logo-image" />
          <span className="logo-text">MoodTrack</span>
        </div>

        <div className="nav-links">
          <Link to="/mood">Moods</Link>
          <Link to="/history">Mood History</Link>
          <Link to="/triggers">Mood Triggers</Link>
        </div>

        <div className="account-wrapper" ref={dropdownRef}>
          <button className="account-button" onClick={toggleDropdown}>
            Account <span className="arrow"></span>
          </button>
          {dropdownOpen && (
            <div className="account-dropdown">
              <p className="signed-in">Signed in as</p>
              <p className="user-email">{userEmail}</p>
              <button className="logout-button" onClick={handleLogout}>
                <span className="logout-icon">🔓</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE: Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/mood" onClick={() => setMobileMenuOpen(false)}>Moods</Link>
          <Link to="/history" onClick={() => setMobileMenuOpen(false)}>Mood History</Link>
          <Link to="/triggers" onClick={() => setMobileMenuOpen(false)}>Mood Triggers</Link>
          <button className="logout-button" onClick={handleLogout}>
                <span className="logout-icon">🔓</span> Logout
              </button>
        </div>
      )}
    </nav>
  );
}
