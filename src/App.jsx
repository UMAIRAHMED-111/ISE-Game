import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import Challenges from "./Challenges";
import SecurityQuiz from "./SecurityQuiz";
import CyberEscapeRoom from "./CyberEscapeRoom";
import PasswordChallenge from "./PasswordChallenge";
import AttackSimulator from "./AttackSimulator";
import HackTheHacker from "./HackTheHacker";
import HackTheHackerComplete from "./HackTheHackerComplete";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import HackAware from "./assets/HackAware.png";
import CipherQuest from "./CipherQuest";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle the fake login submission.
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setShowLoginForm(false);
    setAlertMessage(
      "Important! This is a simulated scenario to raise awareness:\n\nYour credentials are 'compromised' in this demonstration. Never trust a website without proper verification. Always check the URL, SSL certificate, and overall authenticity before sharing personal details. Protect your data to avoid identity theft, financial loss, and other risks."
    );
  };

  // Handle the fake sign-up submission.
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setShowSignUpForm(false);
    setAlertMessage(
      "Important! This simulation is for awareness only:\n\nYour data was never truly at risk. However, always confirm the website's legitimacy before providing any information. Check security indicators and verify the authenticity to stay safe online."
    );
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="nav-logo">
            <img
              src={HackAware}
              alt="HackAware Logo"
              style={{ height: "40px", verticalAlign: "middle" }}
            />
          </Link>
          <button className="hamburger" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <li>
              <Link to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/challenges" onClick={toggleMenu}>
                Challenges
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowLoginForm(true);
                  setIsMenuOpen(false);
                }}
              >
                Login
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowSignUpForm(true);
                  setIsMenuOpen(false);
                }}
              >
                Sign Up
              </button>
            </li>
          </ul>
        </nav>

        {/* Alert message for the fake data leak */}
        {alertMessage && (
          <div className="alert-message improved-alert">
            <p>
              <strong>Alert:</strong>
            </p>
            <p style={{ whiteSpace: "pre-line" }}>{alertMessage}</p>
            <button onClick={() => setAlertMessage("")} className="alert-close">
              Got It!
            </button>
          </div>
        )}

        {/* Render the Login Modal */}
        {showLoginForm && (
          <LoginModal
            onClose={() => setShowLoginForm(false)}
            onSubmit={handleLoginSubmit}
          />
        )}

        {/* Render the Sign Up Modal */}
        {showSignUpForm && (
          <SignUpModal
            onClose={() => setShowSignUpForm(false)}
            onSubmit={handleSignUpSubmit}
          />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/games/cipher-quest" element={<CipherQuest />} />
          <Route path="/games/security-quiz" element={<SecurityQuiz />} />
          <Route path="/games/escape-room" element={<CyberEscapeRoom />} />
          <Route
            path="/games/password-challenge"
            element={<PasswordChallenge />}
          />
          <Route path="/games/attack-sim" element={<AttackSimulator />} />
          <Route path="/games/hack-hacker" element={<HackTheHacker />} />
          <Route
            path="/games/hack-hacker/complete"
            element={<HackTheHackerComplete />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
