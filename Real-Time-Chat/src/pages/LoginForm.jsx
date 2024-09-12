import React, { useState } from 'react';
import './LoginForm.css';
import Logo from '/pulse-logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';


function LoginForm({ onLogin, onCreateAccountClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false); 
  const [email, setEmail] = useState(''); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(username, password);
      setLoading(false);
    }, 2000); 
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Sending reset token to:', email);
    setForgotPasswordMode(false);
    alert('A password reset link has been sent to your email.');
    //API call here for reset
  };

  return (
    <div className='parent-login-form'>
      <div className='login-form'>
        <div className='title'>
          <img className="pulse-logo" src={Logo} alt="pulse logo" />
          <h1 className='title1'>Chat</h1><h1 className='title2'>Pulse</h1>
        </div>

        {forgotPasswordMode ? (
          <div>
            <h2 className='login'>Forgot Password</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className='input-wrapper'>
                <input 
                  type="email" 
                  placeholder="/" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <label>Email</label>
              </div>
              <button 
                className='reset-btn'
                type="submit"
              >
                Send Reset Link
              </button>
            </form>
            <div className='back-login-container'>
            <a className='back-login' onClick={() => setForgotPasswordMode(false)}>Back to Login</a>
            </div>
          </div>
        ) : (
          <div>
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
                  type={showPassword ? "text" : "password"} 
                  placeholder=" " 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <label>Password</label>
                <i 
                  className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`} 
                  onClick={togglePasswordVisibility} 
                ></i>
              </div>
              <a className='setNewPassword' onClick={() => setForgotPasswordMode(true)}>Forgot password?</a>
              <button 
                className={`login-btn ${loading ? 'loading' : ''}`} 
                type="submit" 
                disabled={loading}
              >
                {loading ? '' : 'Login'}
              </button>
            </form>
            <p className='dont-have-acct'>Don't have an account?</p>
            <a className='create-account' onClick={onCreateAccountClick}>Create account</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
