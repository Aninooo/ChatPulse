import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';
import ImageUploader from './ImageUploader';
import SendIcon from '@mui/icons-material/Send';
import { Button } from '@mui/material';
import Logo from '/pulse-logo.png';

const socket = io('http://localhost:4000');

function Chat() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleTimestamp, setVisibleTimestamp] = useState(null);

  useEffect(() => {
    if (isUsernameSet) {
      socket.on('message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on('messageHistory', (history) => {
        setMessages(history);
      });

      socket.on('typing', (data) => {
        setTypingUsers((prevTypingUsers) => [...prevTypingUsers, data.username]);
      });

      socket.on('stopTyping', (data) => {
        setTypingUsers((prevTypingUsers) => prevTypingUsers.filter((user) => user !== data.username));
      });

      return () => {
        socket.off('message');
        socket.off('messageHistory');
        socket.off('typing');
        socket.off('stopTyping');
      };
    }
  }, [isUsernameSet]);

  const joinRoom = () => {
    if (username.trim() && room.trim()) {
      socket.emit('joinRoom', { username, room });
      setIsUsernameSet(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() || selectedImage) {
      const messageData = {
        text: message,
        imageUrl: selectedImage ? `/uploads/${selectedImage.name}` : '',
        username
      };
      socket.emit('message', messageData);
      setMessage('');
      setSelectedImage(null);
    }
  };

  const handleTyping = () => {
    socket.emit('typing');
  };

  const handleStopTyping = () => {
    socket.emit('stopTyping');
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString();

  const shouldShowTimestamp = (index) => {
    if (index === 0) return true;

    const currentMessageDate = new Date(messages[index].timestamp);
    const previousMessageDate = new Date(messages[index - 1].timestamp);
    const difference = (currentMessageDate - previousMessageDate) / (1000 * 60 * 60);
    return difference >= 1;
  };

  const handleMessageClick = (index) => {
    setVisibleTimestamp(visibleTimestamp === index ? null : index);
  };

  return (
    <div className='chat-container'>
      {!isUsernameSet ? (
        <div className='join-container'>
           <div className='title'>
        <h1 className='title1'>Chat</h1><h1 className='title2'>Pulse</h1>
        <img className="pulse-logo" src={Logo} alt="pulse logo" />
      </div>
          <div className='input-username'>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          </div>
          <div className='input-room-name'>
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          </div>
          <div>
          <button className='btn' onClick={joinRoom}>Join Room</button>
          </div>
           
        </div>
      ) : (
        <div className='chat-wrapper'>
          <div className='message-container'>
            {messages.map((msg, index) => (
             <div 
             key={index} 
             className={`message ${msg.username === username ? 'my-message' : 'other-message'}`}
             onClick={() => handleMessageClick(index)}
           >
             {visibleTimestamp === index && (
               <div className='message-timestamp'>{formatTime(msg.timestamp)}</div>
             )}
             {msg.username !== username && <strong>{msg.username}:</strong>}
             {msg.text}
             {msg.imageUrl && (
               <img
                 src={`http://localhost:4000${msg.imageUrl}`}
                 alt="uploaded"
                 className='message-image'
               />
             )}
           </div>
           
            ))}
            {typingUsers.length > 0 && (
              <div className='typing-indicator'>
                {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are typing...' : 'is typing...'}
              </div>
            )}
          </div>
          <div className='input-footer'>
            <ImageUploader setSelectedImage={setSelectedImage} />
            <input
              className='input-send'
              placeholder=''
              type='text'
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
                clearTimeout(window.typingTimeout);
                window.typingTimeout = setTimeout(handleStopTyping, 1000);
              }}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              className='send-btn'
              onClick={sendMessage}
              endIcon={<SendIcon className='send-icon' />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
