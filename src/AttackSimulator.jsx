import React, { useState, useEffect } from "react";
import "./AttackSimulator.css";
import { db } from './firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

function AttackSimulator() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingScenario, setEditingScenario] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    options: [{ id: "A", text: "" }, { id: "B", text: "" }, { id: "C", text: "" }, { id: "D", text: "" }],
    correctOption: "",
    explanation: "",
    difficulty: "easy",
    points: 10
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scenariosRef = collection(db, 'attackScenarios');
      if (editingScenario) {
        await updateDoc(doc(db, 'attackScenarios', editingScenario.id), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(scenariosRef, {
          ...formData,
          createdAt: new Date().toISOString()
        });
      }
      setFormData({
        type: "",
        description: "",
        options: [{ id: "A", text: "" }, { id: "B", text: "" }, { id: "C", text: "" }, { id: "D", text: "" }],
        correctOption: "",
        explanation: "",
        difficulty: "easy",
        points: 10
      });
      setEditingScenario(null);
      fetchScenarios();
    } catch (err) {
      console.error('Error saving scenario:', err);
      setError('Failed to save scenario. Please try again.');
    }
  };

  const handleEdit = (scenario) => {
    setEditingScenario(scenario);
    setFormData({
      type: scenario.type,
      description: scenario.description,
      options: scenario.options,
      correctOption: scenario.correctOption,
      explanation: scenario.explanation,
      difficulty: scenario.difficulty,
      points: scenario.points
    });
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
        <button className="new-scenario-btn" onClick={() => setEditingScenario(null)}>
          Add New Scenario
        </button>
      </div>

      <div className="scenarios-list">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="scenario-card">
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
          </div>
        ))}
      </div>

      <div className="scenario-form">
        <h3>{editingScenario ? 'Edit Scenario' : 'Add New Scenario'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Attack Type:</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Options:</label>
            {formData.options.map((option, index) => (
              <input
                key={option.id}
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${option.id}`}
                required
              />
            ))}
          </div>

          <div className="form-group">
            <label>Correct Option:</label>
            <select
              name="correctOption"
              value={formData.correctOption}
              onChange={handleInputChange}
              required
            >
              <option value="">Select correct option</option>
              {formData.options.map(option => (
                <option key={option.id} value={option.id}>
                  {option.id}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Explanation:</label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty:</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Points:</label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {editingScenario ? 'Update Scenario' : 'Add Scenario'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AttackSimulator;
