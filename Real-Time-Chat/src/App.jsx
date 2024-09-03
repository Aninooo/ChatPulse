import React from 'react';
import Chat from './Chat';
import CreateUserAccount from '../src/pages/CreateUserAccount.jsx'

function App() {
  return (
    <div>
      <h1 className='title'>ChatPulse</h1>
      <CreateUserAccount/>
      <Chat />
    </div>
  );
}

export default App;
