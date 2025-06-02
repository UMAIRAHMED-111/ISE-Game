import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import "./SecurityQuiz.css";
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// Utility function to get random questions
const getRandomQuestions = (questions, count) => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

function SecurityQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [width, height] = useWindowSize();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, 'securityQuizQuestions');
        const snapshot = await getDocs(questionsRef);
        const questionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort questions by difficulty (easy -> medium -> hard)
        const sortedQuestions = questionsData.sort((a, b) => {
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        setQuestions(getRandomQuestions(sortedQuestions, 5));
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId) => {
    if (!isAnswered) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || selectedOption === null) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setQuestions(getRandomQuestions(questions, 5));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  const returnToHome = () => {
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="error-container">
          <p className="error-message">No questions available. Please try again later.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <main className="quiz-container">
        {isQuizComplete ? (
          <>
            <Confetti width={width} height={height} />
            <div className="final-score animate-slide-up">
              <h3>🎉 Quiz Completed!</h3>
              <p>
                🎯 Your Score: <strong>{score}</strong> / {questions.length}
              </p>
              <p>🧠 Keep learning, stay alert, and stay safe online! 🔐</p>
              <div className="final-buttons">
                <button onClick={restartQuiz} className="restart-btn">
                  Restart Quiz
                </button>
                <button onClick={returnToHome} className="home-btn">
                  Return to Home
                </button>
              </div>
            </div>
          </>
        ) : currentQuestion ? (
          <>
            <div className="quiz-header">
              <a href="/" className="exit-link">
                <span className="arrow-left">←</span> Exit Quiz
              </a>
              <div className="question-counter">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>

            <div className="quiz-card animate-fade-in">
              <div className="quiz-card-header">
                <h2>{currentQuestion.question}</h2>
              </div>
              <div className="quiz-card-content">
                <div className="options-grid">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`option-item ${
                        selectedOption === option.id ? "selected" : ""
                      } ${
                        isAnswered
                          ? option.id === currentQuestion.correctAnswer
                            ? "correct"
                            : selectedOption === option.id
                            ? "incorrect"
                            : ""
                          : ""
                      }`}
                    >
                      <div className="option-label">{option.id}</div>
                      <div className="option-text">{option.text}</div>
                      {isAnswered &&
                        option.id === currentQuestion.correctAnswer && (
                          <span className="icon correct-icon">✔</span>
                        )}
                      {isAnswered &&
                        selectedOption === option.id &&
                        option.id !== currentQuestion.correctAnswer && (
                          <span className="icon incorrect-icon">✘</span>
                        )}
                    </div>
                  ))}
                </div>

                {isAnswered && (
                  <div className="feedback-section">
                    <div className="explanation">
                      <h4>Explanation:</h4>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                    <div className="security-tip">
                      <h4>Security Tip:</h4>
                      <p>🛡️ {currentQuestion.securityTip}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="quiz-card-footer">
                {!isAnswered ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOption}
                    className="submit-btn"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button onClick={handleNextQuestion} className="next-btn">
                    {currentQuestionIndex === questions.length - 1
                      ? "Finish Quiz"
                      : "Next Question "}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>Loading questions...</p>
        )}
      </main>
    </div>
  );
}

export default SecurityQuiz;
