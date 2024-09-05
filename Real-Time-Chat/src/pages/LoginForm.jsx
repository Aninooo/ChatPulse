import React, { useState } from 'react';
import './LoginForm.css'

function LoginForm({ onLogin, onCreateAccountClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className='Login-form'>
      <h2 className='login'>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <label>Password:</label>
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button className='login-btn' type="submit">Login</button>
      </form>
     <p>Don't have account?</p>
     <a className='create-account' onClick={onCreateAccountClick}>Create account</a>
    </div>
  );
}

export default LoginForm;
 