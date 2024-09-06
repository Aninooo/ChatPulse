import React, { useState } from 'react';
import './LoginForm.css';
import Logo from '/pulse-logo.png'

function LoginForm({ onLogin, onCreateAccountClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className='parent-login-form'>
    <div className='login-form'>
      <div className='title'>
        <img className="pulse-logo" src={Logo} alt="pulse logo" />
        <h1 className='title1'>Chat</h1><h1 className='title2'>Pulse</h1>
      </div>
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
    </div>
  );
}

export default LoginForm;
