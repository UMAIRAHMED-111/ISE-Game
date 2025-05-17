import React, { useState } from "react";
import Confetti from "react-confetti";
import "./CipherQuest.css";

const levels = [
  {
    level: 1,
    title: "Caesar Cipher Challenge",
    scenario:
      'Alice finds her grandfather\'s old safe, locked with a 4-letter code. She remembers he loved the Caesar cipher. On the safe is the note: "FDVH".',
    question: "Decode the note:",
    type: "input",
    correctAnswer: "CASE",
    feedback:
      "The Caesar cipher shifts letters. Shifting F-D-V-H back by 3 gives C-A-S-E.",
  },
  {
    level: 2,
    title: "One-Time Pad Fix",
    scenario:
      "Alice and Bob are reusing one-time pad keys across messages. Select steps to fix this.",
    question: "Select all correct steps in order:",
    type: "multi-choice",
    options: [
      "Use each key only once and discard it after use.",
      "Switch to a Caesar cipher with a fixed shift.",
      "Generate a long pseudo-random key stream from a shared seed.",
      "Keep reusing the key but add a salt to each message.",
      "Switch to symmetric encryption with a secure key exchange mechanism.",
    ],
    correctAnswer: [0, 4],
    feedback:
      "Correct! Step 1 ensures uniqueness, Step 5 provides a scalable fix.",
  },
  {
    level: 3,
    title: "Digital Signature Check",
    scenario:
      'Bob receives an email from "Alice" asking for data. Validate the signature with these steps.',
    question: "Arrange steps in correct order:",
    type: "ordered-choice",
    options: [
      "Use Alice’s public key to decrypt the signed hash",
      "Hash the message using the agreed-upon algorithm",
      "Compare the hash from signature with the hash of the message",
      "Encrypt the message using Bob’s private key",
      "Replace the hash algorithm with MD5 instead",
    ],
    correctAnswer: [0, 1, 2],
    feedback:
      "Correct! These are the steps to verify digital signatures. The rest are either irrelevant or insecure.",
  },
  {
    level: 4,
    title: "Key Management Mistake",
    scenario:
      "Customer data was encrypted using AES, but keys were left in plaintext.",
    question: "Pick correct steps to improve key handling:",
    type: "multi-choice",
    options: [
      "Move encryption keys to a secure hardware module (HSM).",
      "Encrypt the encryption key using Base64 encoding.",
      "Use access controls to restrict key file access to specific services.",
      "Implement key rotation policies.",
      "Store the keys in a hidden folder on the same server.",
    ],
    correctAnswer: [0, 2, 3],
    feedback:
      "Storing keys securely, limiting access, and rotating keys strengthens protection.",
  },
  {
    level: 5,
    title: "RSA Broadcast Flaw",
    scenario:
      "Same plaintext sent with RSA (e=3) to 3 recipients. An attacker decrypts.",
    question: "Pick all correct steps to fix this vulnerability:",
    type: "multi-choice",
    options: [
      "Use message padding (e.g., OAEP) before encryption.",
      "Decrease the public exponent to 1.",
      "Use the same modulus across all users.",
      "Randomize the plaintext before encryption.",
      "Switch to AES for broadcast messaging.",
    ],
    correctAnswer: [0, 3, 4],
    feedback:
      "Padding, randomness, and symmetric encryption prevent this RSA flaw.",
  },
];

function CipherQuest() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selected, setSelected] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const current = levels[currentLevel];

  const handleSubmit = () => {
    let correct = false;

    if (current.type === "input") {
      correct = inputAnswer.trim().toUpperCase() === current.correctAnswer;
    } else if (current.type === "multi-choice") {
      correct =
        JSON.stringify(selected.sort()) ===
        JSON.stringify(current.correctAnswer.sort());
    } else if (current.type === "ordered-choice") {
      correct =
        JSON.stringify(selected) === JSON.stringify(current.correctAnswer);
    }

    setIsCorrect(correct);
    if (correct) setCorrectCount((prev) => prev + 1);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected([]);
    setInputAnswer("");

    if (currentLevel < levels.length - 1) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const restart = () => {
    setCurrentLevel(0);
    setSelected([]);
    setInputAnswer("");
    setShowFeedback(false);
    setShowSummary(false);
    setCorrectCount(0);
  };

  return (
    <div className="cipher-quest-container">
      {showSummary && (
        <>
          <Confetti numberOfPieces={300} recycle={false} />
          <div className="card animate-fade-in summary-card">
            <h2>🎉 Mission Complete</h2>
            <p className="summary-score">
              You scored {correctCount} / {levels.length}
            </p>
            <p className="emoji-feedback">
              {correctCount === levels.length
                ? "🎯🧠🔐 You're a true cyber defender!"
                : correctCount >= 3
                ? "💡 Great job! Keep practicing."
                : "🧪 Good attempt! Try again to improve your skills."}
            </p>
            <button className="next-btn" onClick={restart}>
              Restart Game
            </button>
          </div>
        </>
      )}

      {!showSummary && (
        <div className="card animate-fade-in">
          <h2>
            Level {current.level}: {current.title}
          </h2>
          <p className="scenario">{current.scenario}</p>
          <p className="question">{current.question}</p>

          {current.type === "input" && (
            <input
              type="text"
              placeholder="Your Answer"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              className="input-field"
            />
          )}

          {(current.type === "multi-choice" ||
            current.type === "ordered-choice") && (
            <ul className="options">
              {current.options.map((opt, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    if (current.type === "multi-choice") {
                      setSelected((prev) =>
                        prev.includes(idx)
                          ? prev.filter((i) => i !== idx)
                          : [...prev, idx]
                      );
                    } else {
                      setSelected((prev) =>
                        prev.includes(idx) ? prev : [...prev, idx]
                      );
                    }
                  }}
                  className={
                    selected.includes(idx) ? "option selected" : "option"
                  }
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}

          {!showFeedback ? (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          ) : (
            <>
              <p
                className={
                  isCorrect ? "feedback correct" : "feedback incorrect"
                }
              >
                {isCorrect ? "✅ Correct!" : "❌ Not quite."}
              </p>
              <p className="explanation">💡 {current.feedback}</p>
              <button className="next-btn" onClick={handleNext}>
                {currentLevel === levels.length - 1
                  ? "Finish Game"
                  : "Next Level"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CipherQuest;
