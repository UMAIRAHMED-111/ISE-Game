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
    options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }],
    correctAnswer: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
      options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }],
      correctAnswer: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleEdit = (question) => {
    setIsNewQuestion(false);
    setEditingQuestion(question.id);
    setEditForm({
      question: question.question || '',
      options: question.options || [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }],
      correctAnswer: question.correctAnswer || '',
      createdAt: question.createdAt || new Date().toISOString(),
      updatedAt: question.updatedAt || new Date().toISOString()
    });
  };

  const handleUpdate = async (questionId) => {
    try {
      console.log('Original editForm:', editForm);
      
      const updatedData = {
        ...editForm,
        updatedAt: new Date().toISOString()
      };

      if (isNewQuestion) {
        // Add new question
        updatedData.createdAt = new Date().toISOString();
        const questionsRef = collection(db, 'escapeRoomQuestions');
        console.log('Attempting to add new question with data:', updatedData);
        const docRef = await addDoc(questionsRef, updatedData);
        console.log('New question added with ID:', docRef.id);
      } else {
        // Update existing question
        const questionRef = doc(db, 'escapeRoomQuestions', questionId);
        console.log('Attempting to update question', questionId, 'with data:', updatedData);
        await updateDoc(questionRef, updatedData);
        console.log('Question updated successfully');
      }
      
      setEditingQuestion(null);
      setIsNewQuestion(false);
      fetchQuestions();
    } catch (err) {
      console.error('Error saving question:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
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
    newOptions[index].text = value;
    setEditForm({...editForm, options: newOptions});
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
              <textarea
                value={editForm.question}
                onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                placeholder="Question"
                className="edit-textarea"
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
                <option value="">Select correct answer</option>
                {editForm.options.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.id}
                  </option>
                ))}
              </select>
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

        {questions.length === 0 && !editingQuestion && (
          <div className="empty-state">
            <p>No questions yet. Click "New Question" to create one!</p>
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
                <textarea
                  value={editForm.question}
                  onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                  placeholder="Question"
                  className="edit-textarea"
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
                  <option value="">Select correct answer</option>
                  {editForm.options.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.id}
                    </option>
                  ))}
                </select>
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
                <p className="question">{question.question}</p>
                <ul className="options-preview">
                  {question.options?.map((option) => (
                    <li key={option.id} className={option.id === question.correctAnswer ? 'correct' : ''}>
                      {option.text}
                      {option.id === question.correctAnswer && <span className="correct-badge">Correct</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CyberEscapeRoom;
