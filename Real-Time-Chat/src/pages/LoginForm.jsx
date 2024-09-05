import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onLogin, onCreateAccountClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className='login-form'>
      <h2 className='login'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='input-wrapper'>
          <input 
            type="text" 
            placeholder=" " 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <label>Username</label>
        </div>
        <div className='input-wrapper'>
          <input 
            type="password" 
            placeholder=" " 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <label>Password</label>
        </div>
        <button className='login-btn' type="submit">Login</button>
      </form>
      <p>Don't have an account?</p>
      <a className='create-account' onClick={onCreateAccountClick}>Create account</a>
    </div>
  );
}

export default LoginForm;
