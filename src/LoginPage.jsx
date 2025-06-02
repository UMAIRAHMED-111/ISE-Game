import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Handle login
      if (email && password) {
        onLogin({ email });
        navigate('/');
      } else {
        setError('Please enter both email and password');
      }
    } else {
      // Handle register
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // Here you would typically make an API call to register
      // For now, just switch to login view
      setIsLogin(true);
      setError('Registration successful! Please login.');
    }
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
      <div className="login-content">
        <div className="description-section">
          <h1>Welcome to HackAware</h1>
          <p className="subtitle">Your journey to cybersecurity awareness starts here</p>
          
          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div className="feature-text">
                <h3>Interactive Security Challenges</h3>
                <p>Test your knowledge with hands-on cybersecurity challenges and real-world scenarios</p>
              </div>
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">🎮</span>
              <div className="feature-text">
                <h3>Gamified Learning</h3>
                <p>Learn through engaging games like Cipher Quest and Cyber Escape Room</p>
              </div>
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div className="feature-text">
                <h3>Track Your Progress</h3>
                <p>Monitor your learning journey and compete on the leaderboard</p>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <button type="submit" className="submit-button">
              {isLogin ? 'Login' : 'Register'}
            </button>
            
            <button 
              type="button"
              className="toggle-btn"
              onClick={handleToggle}
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default LoginPage; 