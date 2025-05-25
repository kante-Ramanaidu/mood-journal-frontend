import React, { useState, useRef, useEffect } from 'react';
import './Account.css';

export default function Account({ userEmail, setUserEmail }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setUserEmail(null);
  };

  const toggleDropdown = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="account-container" ref={dropdownRef}>
      <button className="account-button" onClick={toggleDropdown}>
        Account <span className="chevron">&#x25BE;</span>
      </button>
      {open && (
        <div className="dropdown-menu">
          <p className="signed-in-label">Signed in as</p>
          <p className="user-email">{userEmail}</p>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🔓</span> Logout
          </button>
        </div>
      )}
    </div>
  );
}
