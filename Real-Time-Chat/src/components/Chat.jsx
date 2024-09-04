import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './Chat.css';
import ImageUploader from './ImageUploader';

const socket = io('http://localhost:4000');

function Chat() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
        imageUrl: selectedImage ? `/uploads/${selectedImage.name}` : ''
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

  return (
    <div>
      {!isUsernameSet ? (
        <div>
          <input
            className='input-name'
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className='input-name'
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button className='btn' onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.username}:</strong> {msg.text} 
                {msg.imageUrl && <img src={`http://localhost:4000${msg.imageUrl}`} alt="uploaded" style={{ maxWidth: '200px', display: 'block', marginTop: '10px' }} />}
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
            {typingUsers.length > 0 && (
              <div>{typingUsers.join(', ')} {typingUsers.length > 1 ? 'are typing...' : 'is typing...'}</div>
            )}
          </div>
          <input
            className='input-send'
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
              clearTimeout(window.typingTimeout);
              window.typingTimeout = setTimeout(handleStopTyping, 1000); 
            }}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className='send-btn' onClick={sendMessage}>Send</button>
          <ImageUploader setSelectedImage={setSelectedImage} />
        </div>
      )}
    </div>
  );
}

export default Chat;
