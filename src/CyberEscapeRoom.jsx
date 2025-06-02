import React, { useState, useEffect } from "react";
import "./CyberEscapeRoom.css";
import { db } from './firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

function CyberEscapeRoom() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [editForm, setEditForm] = useState({
    question: '',
    options: [],
    correctAnswer: '',
    explanation: '',
    securityTip: '',
    difficulty: 'easy',
    points: 10
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
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

  const handleNewQuestion = () => {
    setIsNewQuestion(true);
    setEditingQuestion('new');
    setEditForm({
      question: '',
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" }
      ],
      correctAnswer: '',
      explanation: '',
      securityTip: '',
      difficulty: 'easy',
      points: 10
    });
  };

  const handleEdit = (question) => {
    setIsNewQuestion(false);
    setEditingQuestion(question.id);
    setEditForm({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      securityTip: question.securityTip,
      difficulty: question.difficulty || 'easy',
      points: question.points || 10
    });
  };

  const handleUpdate = async (questionId) => {
    try {
      const updatedData = {
        ...editForm,
        updatedAt: new Date().toISOString()
      };

      if (isNewQuestion) {
        updatedData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'escapeRoomQuestions'), updatedData);
      } else {
        const questionRef = doc(db, 'escapeRoomQuestions', questionId);
        await updateDoc(questionRef, updatedData);
      }
      
      setEditingQuestion(null);
      setIsNewQuestion(false);
      fetchQuestions();
    } catch (err) {
      console.error('Error saving question:', err);
      setError('Failed to save question. Please try again.');
    }
  };

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const questionRef = doc(db, 'escapeRoomQuestions', questionId);
        await deleteDoc(questionRef);
        fetchQuestions();
      } catch (err) {
        console.error('Error deleting question:', err);
        setError('Failed to delete question. Please try again.');
      }
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editForm.options];
    newOptions[index] = { ...newOptions[index], text: value };
    setEditForm({ ...editForm, options: newOptions });
  };

  if (loading) {
    return (
      <div className="escape-room">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="escape-room">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="escape-room">
      <div className="questions-column">
        <div className="admin-header">
          <h1>Escape Room Questions</h1>
          <button className="new-question-btn" onClick={handleNewQuestion}>
            + New Question
          </button>
        </div>

        {editingQuestion === 'new' && (
          <div className="question-card new-question-card">
            <div className="question-header">
              <h2>Create New Question</h2>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsNewQuestion(false);
                }}
              >
                Cancel
              </button>
            </div>
            <div className="edit-form">
              <input
                type="text"
                value={editForm.question}
                onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                placeholder="Question"
                className="edit-input"
              />
              {editForm.options.map((option, index) => (
                <input
                  key={option.id}
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${option.id}`}
                  className="edit-input"
                />
              ))}
              <select
                value={editForm.correctAnswer}
                onChange={(e) => setEditForm({...editForm, correctAnswer: e.target.value})}
                className="edit-select"
              >
                <option value="">Select Correct Answer</option>
                {editForm.options.map(option => (
                  <option key={option.id} value={option.id}>{option.id}</option>
                ))}
              </select>
              <textarea
                value={editForm.explanation}
                onChange={(e) => setEditForm({...editForm, explanation: e.target.value})}
                placeholder="Explanation"
                className="edit-textarea"
              />
              <textarea
                value={editForm.securityTip}
                onChange={(e) => setEditForm({...editForm, securityTip: e.target.value})}
                placeholder="Security Tip"
                className="edit-textarea"
              />
              <select
                value={editForm.difficulty}
                onChange={(e) => setEditForm({...editForm, difficulty: e.target.value})}
                className="edit-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <input
                type="number"
                value={editForm.points}
                onChange={(e) => setEditForm({...editForm, points: parseInt(e.target.value)})}
                placeholder="Points"
                className="edit-input"
              />
              <div className="edit-actions">
                <button 
                  className="save-btn"
                  onClick={() => handleUpdate('new')}
                >
                  Create Question
                </button>
              </div>
            </div>
          </div>
        )}

        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <div className="question-header">
              <h2>{question.question}</h2>
              <div className="question-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(question)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(question.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {editingQuestion === question.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.question}
                  onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                  placeholder="Question"
                  className="edit-input"
                />
                {editForm.options.map((option, index) => (
                  <input
                    key={option.id}
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${option.id}`}
                    className="edit-input"
                  />
                ))}
                <select
                  value={editForm.correctAnswer}
                  onChange={(e) => setEditForm({...editForm, correctAnswer: e.target.value})}
                  className="edit-select"
                >
                  <option value="">Select Correct Answer</option>
                  {editForm.options.map(option => (
                    <option key={option.id} value={option.id}>{option.id}</option>
                  ))}
                </select>
                <textarea
                  value={editForm.explanation}
                  onChange={(e) => setEditForm({...editForm, explanation: e.target.value})}
                  placeholder="Explanation"
                  className="edit-textarea"
                />
                <textarea
                  value={editForm.securityTip}
                  onChange={(e) => setEditForm({...editForm, securityTip: e.target.value})}
                  placeholder="Security Tip"
                  className="edit-textarea"
                />
                <select
                  value={editForm.difficulty}
                  onChange={(e) => setEditForm({...editForm, difficulty: e.target.value})}
                  className="edit-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input
                  type="number"
                  value={editForm.points}
                  onChange={(e) => setEditForm({...editForm, points: parseInt(e.target.value)})}
                  placeholder="Points"
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button 
                    className="save-btn"
                    onClick={() => handleUpdate(question.id)}
                  >
                    Save Changes
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => setEditingQuestion(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="question-content">
                <div className="options-preview">
                  {question.options.map((option) => (
                    <div key={option.id} className="option-preview">
                      <span className="option-label">{option.id}</span>
                      <span className="option-text">{option.text}</span>
                      {option.id === question.correctAnswer && (
                        <span className="correct-badge">Correct</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="question-details">
                  <p><strong>Difficulty:</strong> {question.difficulty}</p>
                  <p><strong>Points:</strong> {question.points}</p>
                  <p><strong>Explanation:</strong> {question.explanation}</p>
                  <p><strong>Security Tip:</strong> {question.securityTip}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CyberEscapeRoom;
