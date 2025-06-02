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
import LoginPage from "./LoginPage";
import SignUpModal from "./SignUpModal";
import ProtectedRoute from "./ProtectedRoute";
import HackAware from "./assets/HackAware.png";
import CipherQuest from "./CipherQuest";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
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
        {isAuthenticated && (
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
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </nav>
        )}

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

        {/* Render the Sign Up Modal */}
        {showSignUpForm && (
          <SignUpModal
            onClose={() => setShowSignUpForm(false)}
            onSubmit={handleSignUpSubmit}
          />
        )}

        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Challenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/cipher-quest"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CipherQuest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/security-quiz"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SecurityQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/escape-room"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CyberEscapeRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/password-challenge"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PasswordChallenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/attack-sim"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AttackSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/hack-hacker"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HackTheHacker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/hack-hacker/complete"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HackTheHackerComplete />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
