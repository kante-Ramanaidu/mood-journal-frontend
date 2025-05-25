import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ userEmail, setUserEmail }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
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
      <div className="logo">
        <img src="/assests/logo.png" alt="MoodTrack Logo" className="logo-image" />
        <span className="logo-text">MoodTrack</span>
      </div>

      <div className="nav-links">
        <Link to="/mood">Mood</Link>
        <Link to="/history">Mood History</Link>
        <Link to="/triggers">Mood Triggers</Link>

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
    </nav>
  );
}
