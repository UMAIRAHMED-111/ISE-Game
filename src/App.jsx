import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeChallenges } from './firebase/challenges';
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

// Initialize challenges immediately
console.log('🚀 Starting app initialization...');
initializeChallenges()
  .then(() => console.log('✅ Challenges initialized successfully'))
  .catch(error => console.error('❌ Error initializing challenges:', error));

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  console.log('🔄 App component rendering...');

  // Auth state listener
  useEffect(() => {
    console.log('🔐 Auth useEffect triggered');
    console.log('Setting up Firebase auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => {
      console.log('Cleaning up Firebase auth state listener');
      unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <>
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

                  <Home />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <>
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
                    <Route
                      path="/challenges"
                      element={<Challenges />}
                    />
                    <Route
                      path="/games/cipher-quest"
                      element={<CipherQuest />}
                    />
                    <Route
                      path="/games/security-quiz"
                      element={<SecurityQuiz />}
                    />
                    <Route
                      path="/games/escape-room"
                      element={<CyberEscapeRoom />}
                    />
                    <Route
                      path="/games/password-challenge"
                      element={<PasswordChallenge />}
                    />
                    <Route
                      path="/games/attack-sim"
                      element={<AttackSimulator />}
                    />
                    <Route
                      path="/games/hack-hacker"
                      element={<HackTheHacker />}
                    />
                    <Route
                      path="/games/hack-hacker/complete"
                      element={<HackTheHackerComplete />}
                    />
                  </Routes>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
