import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaLock,
  FaDoorOpen,
  FaKey,
  FaBug,
  FaUserSecret,
  FaBookOpen,
  FaPuzzlePiece,
} from "react-icons/fa";
import { getChallenges, initializeChallenges } from './firebase/challenges';
import "./Challenges.css";

// Icon mapping for challenges
const iconMap = {
  "Cipher Quest": FaPuzzlePiece,
  "Security Quiz": FaLock,
  "Cyber Escape Room": FaDoorOpen,
  "Master the Passwords": FaKey,
  "Attack Simulator": FaBug,
  "Hack The Hacker": FaUserSecret,
};

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        // Initialize challenges if they don't exist
        await initializeChallenges();
        
        // Fetch challenges
        const fetchedChallenges = await getChallenges();
        
        // Add icons to challenges
        const challengesWithIcons = fetchedChallenges.map(challenge => ({
          ...challenge,
          icon: React.createElement(iconMap[challenge.title] || FaBookOpen, {
            className: "challenge-icon"
          })
        }));
        
        setChallenges(challengesWithIcons);
        setLoading(false);
      } catch (err) {
        console.error('Error loading challenges:', err);
        setError('Failed to load challenges. Please try again later.');
        setLoading(false);
      }
    };

    loadChallenges();
  }, []);

  const openPreview = (challenge) => setSelectedChallenge(challenge);
  const closePreview = () => setSelectedChallenge(null);

  if (loading) {
    return <div className="loading">Loading challenges...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="challenges-container">
      <h1>Security Challenges</h1>
      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="challenge-card"
            onClick={() => openPreview(challenge)}
          >
            <div className="challenge-icon">{challenge.icon}</div>
            <h3>{challenge.title}</h3>
            <p>{challenge.desc}</p>
            {challenge.isNew && <span className="new-badge">New</span>}
          </div>
        ))}
      </div>

      {selectedChallenge && (
        <div className="challenge-preview">
          <div className="preview-content">
            <h2>{selectedChallenge.title}</h2>
            <p>{selectedChallenge.desc}</p>
            <div className="rules">
              <h3>Rules:</h3>
              <p>{selectedChallenge.rules}</p>
            </div>
            <div className="preview-actions">
              <Link
                to={selectedChallenge.path}
                className="start-button"
                onClick={closePreview}
              >
                Start Challenge
              </Link>
              <button className="close-button" onClick={closePreview}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Challenges;
