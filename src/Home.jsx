import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Ensure this path is correct
import {
  FaLock,
  FaDoorOpen,
  FaKey,
  FaBug,
  FaUserSecret,
  FaBookOpen, // Kept as in original
  FaPuzzlePiece,
} from "react-icons/fa";
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// Map of challenge paths to their icons
const challengeIcons = {
  "/games/cipher-quest": <FaPuzzlePiece className="challenge-icon" />,
  "/games/security-quiz": <FaLock className="challenge-icon" />,
  "/games/escape-room": <FaDoorOpen className="challenge-icon" />,
  "/games/password-challenge": <FaKey className="challenge-icon" />,
  "/games/attack-sim": <FaBug className="challenge-icon" />,
  "/games/hack-hacker": <FaUserSecret className="challenge-icon" />,
};

function Home() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        console.log('🔍 Fetching challenges from Firestore...');
        const challengesRef = collection(db, 'challenges');
        const snapshot = await getDocs(challengesRef);
        
        const challengesData = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            desc: data.description,
            path: data.path,
            isFeatured: data.isNew || false,
            label: data.isNew ? "NEW" : null,
            icon: challengeIcons[data.path] || <FaBookOpen className="challenge-icon" />
          };
        })
        .filter(challenge => challenge.path === "/games/cipher-quest");

        console.log('✅ Fetched challenges:', challengesData);
        setChallenges(challengesData);
      } catch (err) {
        console.error('❌ Error fetching challenges:', err);
        setError('Failed to load challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading challenge...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content" style={{ }}>
          {" "}
          {/* Wrapper for z-index with pseudo-elements */}
          <h1>Welcome to HackAware</h1>
          <p>
          Refine information security skills through engaging challenges and games.
          </p>
        </div>
      </div>


      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            {challenge.isFeatured && (
              <span className="new-label">{challenge.label || "NEW"}</span>
            )}
            <div className="challenge-icon-wrapper">{challenge.icon}</div>
            <h3>{challenge.title}</h3>
            <p>{challenge.desc}</p>
            <Link
              to={challenge.path}
              className="challenge-button"
              style={{ backgroundColor: "#0c2f27" }}
            >
              Start Challenge
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
