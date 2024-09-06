import React, { useState } from 'react';
import './CreateAccountForm.css'

function CreateAccountForm({ onCreateAccount }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateAccount(username, password, email);
  };

  return (
    <div className='parent-container'>
    <div className="create-account-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='create-account-form-container'>
        <button className='create-account-btn' type="submit">Create Account</button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default CreateAccountForm;
