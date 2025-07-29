import { useState } from 'react';
import './Footer.css';

export default function Footer() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(prev => (prev === section ? null : section));
  };

  return (
    <footer className="app-footer">
      <div className="footer-top">
        <p>© {new Date().getFullYear()} Mood Tracker</p>
        <div className="footer-links">
          <button onClick={() => toggleSection("about")}>About</button>
          <button onClick={() => toggleSection("privacy")}>Privacy</button>
          <button onClick={() => toggleSection("contact")}>Contact</button>
        </div>
      </div>

      {activeSection && (
        <div className="footer-dropdown">
          {activeSection === "about" && (
            <p>Mood Journal helps track your emotions and gives insights into your mental wellness journey.</p>
          )}
          {activeSection === "privacy" && (
            <p>Your mood data is private and never shared. We respect your privacy fully.</p>
          )}
          {activeSection === "contact" && (
            <p>Email us at <strong>xyz@gmail.com</strong> for feedback or support.</p>
          )}
        </div>
      )}
    </footer>
  );
}
