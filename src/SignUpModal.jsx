import React from 'react';

const SignUpModal = ({ onClose, onSubmit }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <header className="modal-header">
          <h2>Sign Up</h2>
        </header>
        <form onSubmit={onSubmit} className="modal-body">
          <label htmlFor="signup-username">Username:</label>
          <input id="signup-username" type="text" placeholder="Username" required />
          <label htmlFor="signup-email">Email:</label>
          <input id="signup-email" type="email" placeholder="Email" required />
          <label htmlFor="signup-password">Password:</label>
          <input id="signup-password" type="password" placeholder="Password" required />
          <div className="modal-footer">
            <button type="submit" className="btn-submit">Submit</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
