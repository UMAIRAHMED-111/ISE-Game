import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./CipherQuest.css";
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

function CipherQuest() {
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selected, setSelected] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showHint, setshowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState({});

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const levelsRef = collection(db, 'cipherQuestLevels');
        const snapshot = await getDocs(levelsRef);
        const levelsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const sortedLevels = levelsData.sort((a, b) => a.level - b.level);
        setLevels(sortedLevels);
      } catch (err) {
        console.error('Error fetching levels:', err);
        setError('Failed to load levels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  if (loading) {
    return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading levels...</p>
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
    setshowHint(false);
    setSubmitClicked(true);
    let correct = false;

    if (current.type === "input") {
      correct = inputAnswer.trim().toUpperCase() === current.correctAnswer;
    } else correct = JSON.stringify(selected) === JSON.stringify(current.correctAnswer);

    setIsCorrect(correct);
    if (correct && !answeredCorrectly[currentLevel]) {
      setCorrectCount((prev) => prev + 1);
      setAnsweredCorrectly((prev) => ({
        ...prev,
        [currentLevel]: true
      }));
    }
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
    setAnsweredCorrectly({});
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

          {!isCorrect && (
            <>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
              <button className="submit-btn" onClick={handleHint}>
                Hint
              </button>
              {showHint && (
                <p className="hint">{current.feedback}</p>
              )}
              {submitClicked && (
                <p className="hint incorrect">
                  ❌ Incorrect
                </p>
              )}
            </>
          )}
          {isCorrect && <p className="hint correct">✅ Correct!</p>}
          <div className="navigation-buttons">
            <button
              className="next-btn"
              onClick={() => setCurrentLevel((prev) => Math.max(prev - 1, 0))}
              disabled={currentLevel === 0}
            >
              Previous
            </button>
            <button
              className="next-btn"
              onClick={handleReplay}
            >
              Replay Level
            </button>
            <button
              className="next-btn"
              onClick={handleNext}
            >
              {currentLevel === levels.length - 1 ? "Finish Game" : "Next Level"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CipherQuest;
