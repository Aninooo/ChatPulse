import React, { useState } from 'react';
import Chat from './components/Chat.jsx';
import CreateAccountForm from './pages/CreateAccountForm';
import LoginForm from './pages/LoginForm.jsx';

function App() {
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleCreateAccount = (username, password, email) => {
    console.log("Account created for:", { username, email });
    setIsAccountCreated(true);
    setIsCreatingAccount(false); 
  };

  const handleLogin = (username, password) => {
    console.log("User logged in:", { username });
    setIsLoggedIn(true);
  };

  const handleCreateAccountClick = () => {
    setIsCreatingAccount(true); 
  };

  const handleLoginClick = () => {
    setIsCreatingAccount(false); 
  };

  return (
    <div> 
      {isLoggedIn ? (
        <Chat />
      ) : (
        <div>
          {isCreatingAccount ? (
            <CreateAccountForm 
              onCreateAccount={handleCreateAccount} 
              onLoginClick={handleLoginClick}
            />
          ) : (
            <LoginForm 
              onLogin={handleLogin} 
              onCreateAccountClick={handleCreateAccountClick}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
