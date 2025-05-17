import React from 'react';

const LoginModal = ({ onClose, onSubmit }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <header className="modal-header">
          <h2>Login</h2>
        </header>
        <form onSubmit={onSubmit} className="modal-body">
          <label htmlFor="login-username">Username:</label>
          <input id="login-username" type="text" placeholder="Username" required />
          <label htmlFor="login-password">Password:</label>
          <input id="login-password" type="password" placeholder="Password" required />
          <div className="modal-footer">
            <button type="submit" className="btn-submit">Submit</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
