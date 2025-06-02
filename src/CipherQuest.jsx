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
    hint:
      "Shift the letters back by 3 positions in the alphabet.",
  },
  {
    level: 2,
    title: "One-Time Pad Fix",
    scenario:
      "Alice and Bob are using a one-time pad to communicate securely. However, due to limited key material, they begin reusing keys across multiple messages.",
    question: "Select the correct step(s) in the correct order:",
    type: "ordered-choice",
    options: [
      "Use each key only once and discard it after use.",
      "Switch to a Caesar cipher with a fixed shift.",
      "Generate a long pseudo-random key stream from a shared seed.",
      "Keep reusing the key but add a salt to each message.",
      "Switch to symmetric encryption with a secure key exchange mechanism.",
    ],
    correctAnswer: [0, 4],
    hint:
      "Reusing keys violates the core principle of a one-time pad. Think about what ensures perfect secrecy — and what modern methods can safely replace one-time pads in practice.",
  },
  {
    level: 3,
    title: "Digital Signature Check",
    scenario:
      'Bob receives an email from Alice asking for data. How can he verify the authenticity using digital signatures?',
    question: "Select the correct step(s) in the correct order:",
    type: "ordered-choice",
    options: [
      "Hash the message using the agreed-upon algorithm",
      "Encrypt the message using Bob’s private key",
      "Compare the hash from signature with the hash of the message",
      "Use Alice’s public key to decrypt the signed hash",
      "Replace the hash algorithm with MD5 instead",
    ],
    correctAnswer: [3, 0, 2],
    hint:
      "To verify a signed message, you must check the origin and the integrity. Start by confirming who signed it and whether the content was altered.",
  },
  {
    level: 4,
    title: "Key Management Mistake",
    scenario:
      "Customer data was encrypted using AES, but keys were left in plaintext.",
    question: "Pick correct steps to improve key handling:",
    type: "ordered-choice",
    options: [
      "Move encryption keys to a secure hardware module (HSM).",
      "Encrypt the encryption key using Base64 encoding.",
      "Use access controls to restrict key file access to specific services.",
      "Implement key rotation policies.",
      "Store the keys in a hidden folder on the same server.",
    ],
    correctAnswer: [0, 2, 3],
    hint:
      "Storing keys securely, limiting access, and rotating keys strengthens protection.",
  },
  {
    level: 5,
    title: "RSA Broadcast Flaw",
    scenario:
      "Same plaintext sent with RSA (e=3) to 3 recipients. An attacker decrypts.",
    question: "Pick all correct steps to fix this vulnerability:",
    type: "ordered-choice",
    options: [
      "Use message padding (e.g., OAEP) before encryption.",
      "Decrease the public exponent to 1.",
      "Use the same modulus across all users.",
      "Randomize the plaintext before encryption.",
      "Switch to AES for broadcast messaging.",
    ],
    correctAnswer: [0, 3, 4],
    hint:
      "Padding, randomness, and symmetric encryption prevent this RSA flaw.",
  },
];

function CipherQuest() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selected, setSelected] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showHint, setshowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitClicked, setSubmitClicked] = useState(false);

  const current = levels[currentLevel];

  const handleSubmit = () => {
    setshowHint(false);
    setSubmitClicked(true);
    let correct = false;

    if (current.type === "input") {
      correct = inputAnswer.trim().toUpperCase() === current.correctAnswer;
    // } else if (current.type === "multi-choice") {
    //   correct =
    //     JSON.stringify(selected.sort()) ===
    //     JSON.stringify(current.correctAnswer.sort());
    } else correct = JSON.stringify(selected) === JSON.stringify(current.correctAnswer);

    setIsCorrect(correct);
    if (correct) setCorrectCount((prev) => prev + 1);
  };

  const handleHint = () => {
    setshowHint(true);
    setSubmitClicked(false);
    setIsCorrect(false);
  }

  const handleReplay = () => {
    setSubmitClicked(false);
    setshowHint(false);
    setSelected([]);
    setInputAnswer("");
    setIsCorrect(false);
  }

  const handleNext = () => {
    setIsCorrect(false);
    setSubmitClicked(false);
    setshowHint(false);
    setSelected([]);
    setInputAnswer("");

    if (currentLevel < levels.length - 1) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const restart = () => {
    setSubmitClicked(false);
    setCurrentLevel(0);
    setSelected([]);
    setInputAnswer("");
    setshowHint(false);
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
            <p className="emoji-hint">
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

          {current.type === "ordered-choice" && (
            <ul className="options">
              {current.options.map((opt, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setSelected((prev) =>
                      prev.includes(idx)
                        ? prev.filter((i) => i !== idx)
                        : [...prev, idx]
                    );
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

          {!isCorrect ? (
            <>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
              <button className="submit-btn" onClick={handleHint}>
                Hint
              </button>
              {showHint && (
                <p className="hint">{current.hint}</p>
              )}
              {submitClicked && (
                <p className="hint incorrect">
                  ❌ Incorrect
                </p>
              )}
            </>
          ) : (
            <>
              <p
                className="hint correct">
                ✅ Correct!
              </p>
              <button className="next-btn" onClick={handleReplay}>
                Replay Level
              </button>
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
