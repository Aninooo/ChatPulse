import React from 'react';
import Chat from './components/Chat.jsx';
import CreateUserAccount from '../src/pages/CreateUserAccount.jsx'

function App() {
  return (
    <div>
      <div className='title'>
        <h1 className='title1'>Chat</h1><h1 className='title2'>Pulse</h1>
      </div>
      <CreateUserAccount/>
      <Chat />
    </div>
  );
}

export default App;
