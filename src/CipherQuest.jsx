import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./CipherQuest.css";
import { getCipherQuestLevels, initializeCipherQuestLevels } from './firebase/cipherQuest';

function CipherQuest() {
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selected, setSelected] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        // Initialize levels if they don't exist
        await initializeCipherQuestLevels();
        
        // Fetch levels
        const fetchedLevels = await getCipherQuestLevels();
        setLevels(fetchedLevels);
      } catch (err) {
        console.error('Error loading levels:', err);
        setError('Failed to load levels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadLevels();
  }, []);

  if (loading) {
    return (
      <div className="cipher-quest-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading levels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cipher-quest-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <div className="cipher-quest-container">
        <div className="error-container">
          <p className="error-message">No levels found. Please try again later.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

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
