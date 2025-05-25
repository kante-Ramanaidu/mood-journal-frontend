import { useState } from 'react';

export default function Footer() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(prev => (prev === section ? null : section));
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Mood Journal. All rights reserved.</p>
        <div className="footer-links">
          <button onClick={() => toggleSection("about")}>About</button>
          <button onClick={() => toggleSection("privacy")}>Privacy Policy</button>
          <button onClick={() => toggleSection("contact")}>Contact</button>
        </div>
      </div>

      {activeSection === "about" && (
        <div className="footer-section">
          <h3>About Mood Journal</h3>
          <p>
            Mood journal helps track your emotional well-being and offers insights to support your mental wellness journey.
          </p>
        </div>
      )}
      {activeSection === "privacy" && (
        <div className="footer-section">
          <h3>Privacy Policy</h3>
          <p>
            Your mood data is private and never shared.
          </p>
        </div>
      )}
      {activeSection === "contact" && (
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>
            Email us at <strong>ramkante84@gmail.com</strong> for feedback or support.
          </p>
        </div>
      )}
    </footer>
  );
}
