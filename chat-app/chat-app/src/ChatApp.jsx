import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatApp = () => {
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3010');
    setSocket(newSocket);

    newSocket.on('loadMessages', (loadedMessages) => {
      setMessages(loadedMessages.reverse());
    });

    newSocket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleUserName = () => {
    const name = prompt('Enter your name:');
    if (name) {
      setUserName(name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userName) {
      handleUserName();
    }

    if (socket && inputValue.trim() !== '') {
      socket.emit('newMessage', { user: userName, content: inputValue });
      setInputValue('');
    }
  };

  return (
    <div className='flex justify-center p-10'>
      {!userName && (
        <button
          className=' bg-sky-400 px-5 py-3 rounded-3xl'
          onClick={handleUserName}
        >
          Add User
        </button>
      )}

      {userName && (
        <div>
          <ul className='m-5'>
            {messages.map((message, index) => (
              <li className='w-fit bg-slate-300 p-2 rounded-xl m-2' key={index}>
                <span className=' font-semibold mr-3'>{message.user}:</span> {message.content}
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit}>
            <input
              id='input'
              autoComplete='off'
              className=' bg-white border-2 outline-none border-gray-400  px-5 py-3 rounded-3xl mr-5'
              value={inputValue}
              placeholder='Enter your message'
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className=' bg-sky-400 px-5 py-3 rounded-3xl' type='submit'>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
