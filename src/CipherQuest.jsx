import React, { useState, useEffect } from "react";
import "./CipherQuest.css";
import { db } from './firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

function CipherQuest() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingLevel, setEditingLevel] = useState(null);
  const [isNewLevel, setIsNewLevel] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    scenario: '',
    question: '',
    type: 'ordered-choice',
    correctAnswer: [],
    feedback: '',
    options: [],
    level: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const levelsRef = collection(db, 'cipherQuestLevels');
      const snapshot = await getDocs(levelsRef);
      const levelsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => a.level - b.level);
      setLevels(levelsData);
    } catch (err) {
      console.error('Error fetching levels:', err);
      setError('Failed to load levels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewLevel = () => {
    setIsNewLevel(true);
    setEditingLevel('new');
    setEditForm({
      title: '',
      scenario: '',
      question: '',
      type: 'ordered-choice',
      correctAnswer: [],
      feedback: '',
      options: [],
      level: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleEdit = (level) => {
    setIsNewLevel(false);
    setEditingLevel(level.id);
    setEditForm({
      title: level.title,
      scenario: level.scenario,
      question: level.question,
      type: level.type,
      correctAnswer: level.correctAnswer,
      feedback: level.feedback,
      options: level.options,
      level: level.level,
      createdAt: level.createdAt,
      updatedAt: level.updatedAt
    });
  };

  const handleUpdate = async (levelId) => {
    try {
      console.log('Original editForm:', editForm);
      
      const updatedData = {
        ...editForm,
        updatedAt: new Date().toISOString()
      };

      if (isNewLevel) {
        // Add new level
        updatedData.level = levels.length + 1;
        updatedData.createdAt = new Date().toISOString();
        const levelsRef = collection(db, 'cipherQuestLevels');
        console.log('Attempting to add new level with data:', updatedData);
        const docRef = await addDoc(levelsRef, updatedData);
        console.log('New level added with ID:', docRef.id);
      } else {
        // Update existing level
        const levelRef = doc(db, 'cipherQuestLevels', levelId);
        console.log('Attempting to update level', levelId, 'with data:', updatedData);
        await updateDoc(levelRef, updatedData);
        console.log('Level updated successfully');
      }
      
      setEditingLevel(null);
      setIsNewLevel(false);
      fetchLevels();
    } catch (err) {
      console.error('Error saving level:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      setError('Failed to save level. Please try again.');
    }
  };

  const handleDelete = async (levelId) => {
    if (window.confirm('Are you sure you want to delete this level?')) {
      try {
        const levelRef = doc(db, 'cipherQuestLevels', levelId);
        await deleteDoc(levelRef);
        fetchLevels();
      } catch (err) {
        console.error('Error deleting level:', err);
        setError('Failed to delete level. Please try again.');
      }
    }
  };

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

  return (
    <div className="cipher-quest-container">
      <div className="levels-column">
        <div className="admin-header">
          <h1>CipherQuest Levels</h1>
          <button className="new-level-btn" onClick={handleNewLevel}>
            + New Level
          </button>
        </div>

        {editingLevel === 'new' && (
          <div className="level-card new-level-card">
            <div className="level-header">
              <h2>Create New Level</h2>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setEditingLevel(null);
                  setIsNewLevel(false);
                }}
              >
                Cancel
              </button>
            </div>
            <div className="edit-form">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                placeholder="Level Title"
                className="edit-input"
              />
              <textarea
                value={editForm.scenario}
                onChange={(e) => setEditForm({...editForm, scenario: e.target.value})}
                placeholder="Scenario"
                className="edit-textarea"
              />
              <input
                type="text"
                value={editForm.question}
                onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                placeholder="Question"
                className="edit-input"
              />
              <select
                value={editForm.type}
                onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                className="edit-select"
              >
                <option value="input">Input</option>
                <option value="multi-choice">Multiple Choice</option>
                <option value="ordered-choice">Ordered Choice</option>
              </select>
              <textarea
                value={editForm.options.join('\n')}
                onChange={(e) => setEditForm({...editForm, options: e.target.value.split('\n')})}
                placeholder="Options (one per line)"
                className="edit-textarea"
              />
              <input
                type="text"
                value={editForm.correctAnswer.join(',')}
                onChange={(e) => setEditForm({...editForm, correctAnswer: e.target.value.split(',').map(num => parseInt(num.trim()))})}
                placeholder="Correct Answer (comma-separated numbers)"
                className="edit-input"
              />
              <textarea
                value={editForm.feedback}
                onChange={(e) => setEditForm({...editForm, feedback: e.target.value})}
                placeholder="Feedback"
                className="edit-textarea"
              />
              <div className="edit-actions">
                <button 
                  className="save-btn"
                  onClick={() => handleUpdate('new')}
                >
                  Create Level
                </button>
              </div>
            </div>
          </div>
        )}

        {levels.map((level) => (
          <div key={level.id} className="level-card">
            <div className="level-header">
              <h2>Level {level.level}: {level.title}</h2>
              <div className="level-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(level)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(level.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {editingLevel === level.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  placeholder="Level Title"
                  className="edit-input"
                />
                <textarea
                  value={editForm.scenario}
                  onChange={(e) => setEditForm({...editForm, scenario: e.target.value})}
                  placeholder="Scenario"
                  className="edit-textarea"
                />
                <input
                  type="text"
                  value={editForm.question}
                  onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                  placeholder="Question"
                  className="edit-input"
                />
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                  className="edit-select"
                >
                  <option value="input">Input</option>
                  <option value="multi-choice">Multiple Choice</option>
                  <option value="ordered-choice">Ordered Choice</option>
                </select>
                <textarea
                  value={editForm.options.join('\n')}
                  onChange={(e) => setEditForm({...editForm, options: e.target.value.split('\n')})}
                  placeholder="Options (one per line)"
                  className="edit-textarea"
                />
                <input
                  type="text"
                  value={editForm.correctAnswer.join(',')}
                  onChange={(e) => setEditForm({...editForm, correctAnswer: e.target.value.split(',').map(num => parseInt(num.trim()))})}
                  placeholder="Correct Answer (comma-separated numbers)"
                  className="edit-input"
                />
                <textarea
                  value={editForm.feedback}
                  onChange={(e) => setEditForm({...editForm, feedback: e.target.value})}
                  placeholder="Feedback"
                  className="edit-textarea"
                />
                <div className="edit-actions">
                  <button 
                    className="save-btn"
                    onClick={() => handleUpdate(level.id)}
                  >
                    Save Changes
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => setEditingLevel(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="level-content">
                <p className="scenario">{level.scenario}</p>
                <p className="question">{level.question}</p>
                {level.type !== 'input' && level.options && (
                  <ul className="options-preview">
                    {level.options.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                )}
                <p className="feedback-preview">Feedback: {level.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CipherQuest;
