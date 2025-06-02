import React, { useState, useEffect } from "react";
import "./AttackSimulator.css";
import { db } from './firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

function AttackSimulator() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingScenario, setEditingScenario] = useState(null);
  const [isNewScenario, setIsNewScenario] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    options: [{ id: "A", text: "" }, { id: "B", text: "" }, { id: "C", text: "" }, { id: "D", text: "" }],
    correctOption: "",
    explanation: "",
    difficulty: "easy",
    points: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const scenariosRef = collection(db, 'attackScenarios');
      const snapshot = await getDocs(scenariosRef);
      const scenariosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setScenarios(scenariosData);
    } catch (err) {
      console.error('Error fetching scenarios:', err);
      setError('Failed to load scenarios. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].text = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleNewScenario = () => {
    setIsNewScenario(true);
    setEditingScenario('new');
    setFormData({
      type: "",
      description: "",
      options: [{ id: "A", text: "" }, { id: "B", text: "" }, { id: "C", text: "" }, { id: "D", text: "" }],
      correctOption: "",
      explanation: "",
      difficulty: "easy",
      points: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleEdit = (scenario) => {
    setIsNewScenario(false);
    setEditingScenario(scenario.id);
    setFormData({
      type: scenario.type,
      description: scenario.description,
      options: scenario.options,
      correctOption: scenario.correctOption,
      explanation: scenario.explanation,
      difficulty: scenario.difficulty,
      points: scenario.points,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt
    });
  };

  const handleUpdate = async (scenarioId) => {
    try {
      console.log('Original formData:', formData);
      
      const updatedData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (isNewScenario) {
        // Add new scenario
        updatedData.createdAt = new Date().toISOString();
        const scenariosRef = collection(db, 'attackScenarios');
        console.log('Attempting to add new scenario with data:', updatedData);
        const docRef = await addDoc(scenariosRef, updatedData);
        console.log('New scenario added with ID:', docRef.id);
      } else {
        // Update existing scenario
        const scenarioRef = doc(db, 'attackScenarios', scenarioId);
        console.log('Attempting to update scenario', scenarioId, 'with data:', updatedData);
        await updateDoc(scenarioRef, updatedData);
        console.log('Scenario updated successfully');
      }
      
      setEditingScenario(null);
      setIsNewScenario(false);
      fetchScenarios();
    } catch (err) {
      console.error('Error saving scenario:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      setError('Failed to save scenario. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      try {
        await deleteDoc(doc(db, 'attackScenarios', id));
        fetchScenarios();
      } catch (err) {
        console.error('Error deleting scenario:', err);
        setError('Failed to delete scenario. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="attack-simulator">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading scenarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attack-simulator">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="attack-simulator">
      <div className="admin-header">
        <h2>Attack Scenarios</h2>
        <button className="new-scenario-btn" onClick={handleNewScenario}>
          Add New Scenario
        </button>
      </div>

      <div className="scenarios-list">
        {editingScenario === 'new' && (
          <div className="scenario-card new-scenario-card">
            <div className="level-header">
              <h2>Create New Scenario</h2>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setEditingScenario(null);
                  setIsNewScenario(false);
                }}
              >
                Cancel
              </button>
            </div>
            <div className="edit-form">
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                placeholder="Attack Type"
                className="edit-input"
              />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description"
                className="edit-textarea"
              />
              {formData.options.map((option, index) => (
                <input
                  key={option.id}
                  type="text"
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[index].text = e.target.value;
                    setFormData({...formData, options: newOptions});
                  }}
                  placeholder={`Option ${option.id}`}
                  className="edit-input"
                />
              ))}
              <select
                value={formData.correctOption}
                onChange={(e) => setFormData({...formData, correctOption: e.target.value})}
                className="edit-select"
              >
                <option value="">Select correct option</option>
                {formData.options.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.id}
                  </option>
                ))}
              </select>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                placeholder="Explanation"
                className="edit-textarea"
              />
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="edit-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                min="1"
                className="edit-input"
              />
              <div className="edit-actions">
                <button 
                  className="save-btn"
                  onClick={() => handleUpdate('new')}
                >
                  Create Scenario
                </button>
              </div>
            </div>
          </div>
        )}

        {scenarios.map((scenario) => (
          <div key={scenario.id} className="scenario-card">
            {editingScenario === scenario.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  placeholder="Attack Type"
                  className="edit-input"
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description"
                  className="edit-textarea"
                />
                {formData.options.map((option, index) => (
                  <input
                    key={option.id}
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index].text = e.target.value;
                      setFormData({...formData, options: newOptions});
                    }}
                    placeholder={`Option ${option.id}`}
                    className="edit-input"
                  />
                ))}
                <select
                  value={formData.correctOption}
                  onChange={(e) => setFormData({...formData, correctOption: e.target.value})}
                  className="edit-select"
                >
                  <option value="">Select correct option</option>
                  {formData.options.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.id}
                    </option>
                  ))}
                </select>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  placeholder="Explanation"
                  className="edit-textarea"
                />
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="edit-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                  min="1"
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button 
                    className="save-btn"
                    onClick={() => handleUpdate(scenario.id)}
                  >
                    Save Changes
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => setEditingScenario(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>{scenario.type}</h3>
                <p>{scenario.description}</p>
                <div className="scenario-details">
                  <p><strong>Difficulty:</strong> {scenario.difficulty}</p>
                  <p><strong>Points:</strong> {scenario.points}</p>
                  <p><strong>Correct Option:</strong> {scenario.correctOption}</p>
                </div>
                <div className="scenario-actions">
                  <button className="edit-btn" onClick={() => handleEdit(scenario)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(scenario.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttackSimulator;
