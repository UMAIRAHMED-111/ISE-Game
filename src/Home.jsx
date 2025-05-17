import React from "react";
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

const challenges = [
  {
    id: 0,
    title: "Cipher Quest",
    desc: "Crack codes, decipher messages, and prove your cryptography mastery in this thrilling challenge!",
    icon: <FaPuzzlePiece className="challenge-icon" />,
    path: "/games/cipher-quest",
    isFeatured: true,
    label: "Most Played",
  },
  {
    id: 1,
    title: "Security Quiz",
    desc: "Test your knowledge: identify social engineering tactics and common cyber threats.",
    icon: <FaLock className="challenge-icon" />,
    path: "/games/security-quiz",
    isFeatured: false,
  },
  {
    id: 2,
    title: "Cyber Escape Room",
    desc: "Navigate a high-stakes scenario. Solve intricate cybersecurity puzzles to evade a hacker's trap.",
    icon: <FaDoorOpen className="challenge-icon" />,
    path: "/games/escape-room",
    isFeatured: false,
  },
  {
    id: 3,
    title: "Password Fortress", // Enhanced title
    desc: "Learn the art of crafting unbreakable passwords and test their resilience against attacks.",
    icon: <FaKey className="challenge-icon" />,
    path: "/games/password-challenge",
    isFeatured: false,
  },
  {
    id: 4,
    title: "Threat Simulator", // Enhanced title
    desc: "Immerse yourself in real-time scenarios and practice your response to evolving cyber threats.",
    icon: <FaBug className="challenge-icon" />,
    path: "/games/attack-sim",
    isFeatured: false,
  },
  {
    id: 5,
    title: "Digital Forensics", // Enhanced title
    desc: "Become a cyber detective. Analyze digital traces and decrypt hacker methodologies.",
    icon: <FaUserSecret className="challenge-icon" />,
    path: "/games/hack-hacker",
    isFeatured: false,
  },
];

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          {" "}
          {/* Wrapper for z-index with pseudo-elements */}
          <h1>Cybersecurity Awareness Platform</h1>
          <p>
            Elevate your cyber defense skills. Engage with interactive
            challenges and realistic simulations to guard against digital
            threats.
          </p>
        </div>
      </div>

      <h2 className="challenges-section-title">Explore Challenges</h2>

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
