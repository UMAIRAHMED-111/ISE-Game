import React, { useState, useEffect } from "react";
import "./CyberEscapeRoom.css";
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

function CyberEscapeRoom() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, 'escapeRoomQuestions');
        const snapshot = await getDocs(questionsRef);
        const questionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsData);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (optionId) => {
    if (!showFeedback) {
      setSelectedAnswer(optionId);
    }
  };

  const handleSubmit = () => {
    const correct = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + questions[currentQuestionIndex].points);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="escape-room">
      <h2>Cyber Escape Room</h2>
      <div className="score">Score: {score}</div>
      
      <div className="question-container">
        <h3>{currentQuestion.question}</h3>
        
        <div className="options">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              className={`option ${
                selectedAnswer === option.id ? 'selected' : ''
              } ${
                showFeedback ? (
                  option.id === currentQuestion.correctAnswer ? 'correct' :
                  option.id === selectedAnswer ? 'incorrect' : ''
                ) : ''
              }`}
              onClick={() => handleAnswer(option.id)}
              disabled={showFeedback}
            >
              {option.text}
            </button>
          ))}
        </div>

        {showFeedback ? (
          <div className="feedback-container">
            <p className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
            </p>
            <p className="explanation">{currentQuestion.explanation}</p>
            <p className="security-tip">💡 {currentQuestion.securityTip}</p>
            <button onClick={handleNext}>
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default CyberEscapeRoom;
