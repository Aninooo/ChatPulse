import React, { useState } from 'react';
import Chat from './components/Chat.jsx';
import CreateAccountForm from './pages/CreateAccountForm';

function App() {
  const [isAccountCreated, setIsAccountCreated] = useState(false);

  const handleCreateAccount = (username, password, email) => {
    console.log("Account created for:", { username, email });

    setIsAccountCreated(true);
  };

  return (
    <div>
      <div className='title'>
        <h1 className='title1'>Chat</h1><h1 className='title2'>Pulse</h1>
      </div>
      {!isAccountCreated ? (
        <CreateAccountForm onCreateAccount={handleCreateAccount} />
      ) : (
        <Chat />
      )}
    </div>
  );
}

export default App;
