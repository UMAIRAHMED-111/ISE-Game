import React, { useState } from "react";
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
import "./Challenges.css";

const challenges = [
  {
    id: 0,
    title: "Cipher Quest",
    desc: "Crack ciphers, fix flaws, and prove your cryptography skills across levels.",
    icon: <FaPuzzlePiece className="challenge-icon" />,
    path: "/games/cipher-quest",
    isNew: true,
    rules:
      "Solve multi-step encryption and key management puzzles across 5 levels. Earn recognition for each correct step!",
  },
  {
    id: 1,
    title: "Security Quiz",
    desc: "Test your knowledge of social engineering, phishing, and cyber threat awareness.",
    icon: <FaLock className="challenge-icon" />,
    path: "/games/security-quiz",
    isNew: false,
    rules:
      "Answer 10 Cyber Security based questions. Correct answers earn 10 points. No penalties for wrong answers.",
  },
  {
    id: 2,
    title: "Cyber Escape Room",
    desc: "Solve challenging cybersecurity puzzles and escape the hacker’s digital trap in time.",
    icon: <FaDoorOpen className="challenge-icon" />,
    path: "/games/escape-room",
    isNew: false,
    rules:
      "Solve 5 cybersecurity riddles. Each correct solution unlocks the next step. Finish within 2 minutes.",
  },
  {
    id: 3,
    title: "Master the Passwords",
    desc: "Learn to create strong, secure passwords and test their strength in real-time simulations.",
    icon: <FaKey className="challenge-icon" />,
    path: "/games/password-challenge",
    isNew: false,
    rules:
      "Enter passwords to evaluate their strength. Learn tips for improving security. No time limit.",
  },
  {
    id: 4,
    title: "Attack Simulator",
    desc: "Respond to real-time cyber threats and simulate actions against common attack scenarios.",
    icon: <FaBug className="challenge-icon" />,
    path: "/games/attack-sim",
    isNew: false,
    rules:
      "React to 10 different attack scenarios by choosing the correct action within 10 seconds. Earn 20 points for correct choices.",
  },
  {
    id: 5,
    title: "Hack The Hacker",
    desc: "Analyze hidden clues, decrypt messages, and expose vulnerabilities used by hackers.",
    icon: <FaUserSecret className="challenge-icon" />,
    path: "/games/hack-hacker",
    isNew: false,
    rules:
      "Decrypt 3 messages and identify vulnerabilities. Each task earns 30 points.",
  },
];

function Challenges() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const openPreview = (challenge) => setSelectedChallenge(challenge);
  const closePreview = () => setSelectedChallenge(null);

  return (
    <div className="challenges">
      <h2>Explore Challenges</h2>
      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            {challenge.isNew && <span className="new-label">NEW</span>}
            <div className="challenge-icon-wrapper">{challenge.icon}</div>
            <h3>{challenge.title}</h3>
            <p>{challenge.desc}</p>
            <div className="challenge-buttons">
              <button
                onClick={() => openPreview(challenge)}
                className="preview-btn"
              >
                Preview
              </button>
              <Link
                to={challenge.path}
                style={{
                  display: "inline-block",
                  backgroundColor: "#32d27f", // brand green
                  color: "#0c2f27",
                  padding: "12px 24px",
                  fontWeight: 600,
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "16px",
                  letterSpacing: "0.4px",
                  border: "none",
                  boxShadow: "0 4px 14px rgba(50, 210, 127, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#29b86f";
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow =
                    "0 6px 20px rgba(50, 210, 127, 0.45)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#32d27f";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow =
                    "0 4px 14px rgba(50, 210, 127, 0.3)";
                }}
              >
                Start Challenge
              </Link>
            </div>
          </div>
        ))}
      </div>

      {selectedChallenge && (
        <div className="preview-modal">
          <div className="preview-content">
            <h3>{selectedChallenge.title}</h3>
            <p>
              <strong>Description:</strong> {selectedChallenge.desc}
            </p>
            <p>
              <strong>Rules:</strong> {selectedChallenge.rules}
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >
              <Link
                to={selectedChallenge.path}
                style={{
                  display: "inline-block",
                  backgroundColor: "#32d27f",
                  color: "#0c2f27",
                  padding: "12px 26px",
                  fontWeight: 600,
                  borderRadius: "12px",
                  fontSize: "16px",
                  letterSpacing: "0.4px",
                  textDecoration: "none",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(50, 210, 127, 0.25)",
                  transition: "all 0.25s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#29b86f";
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(50, 210, 127, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#32d27f";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(50, 210, 127, 0.25)";
                }}
              >
                Start Now
              </Link>

              <button
                onClick={closePreview}
                style={{
                  display: "inline-block",
                  backgroundColor: "#1f1f1f",
                  color: "#ffffff",
                  padding: "12px 26px",
                  fontWeight: 600,
                  borderRadius: "12px",
                  fontSize: "16px",
                  letterSpacing: "0.4px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                  transition: "all 0.25s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#333";
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#1f1f1f";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
                }}
              >
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
