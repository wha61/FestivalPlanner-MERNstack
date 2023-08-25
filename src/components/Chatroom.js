import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import '../style/Chatroom.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Chatroom = () => {
  const [username, setUsername] = useState('unknown');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [previousPath, setPreviousPath] = useState(null); // NEW: State to hold previous pathname
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const isUsernameSetRef = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('useEffect called');
    socketRef.current = io('http://localhost:3001')

    if (!isUsernameSetRef.current) {
      const name = prompt('Enter your name', 'unknown');
      setUsername(name);
      isUsernameSetRef.current = true;
      socketRef.current.emit('chat', JSON.stringify({text: `${name} is in the chat room`, sender: name}));
    }

    socketRef.current.on('clientChange', (clients) => {
      setOnlineUsers(clients);
    });

    socketRef.current.on('message', (message) => {
      console.log('Received message:', message);
      const parsedMessage = JSON.parse(message);
      setMessages((messages) => {
        console.log('Setting messages:', [...messages, parsedMessage]);
        return [...messages, parsedMessage];
      });
      
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setPreviousPath(location.pathname); // Save the current pathname to previousPath state
  }, []); // Only run on initial load

  useEffect(() => {
    return () => {
      if (location.pathname !== previousPath) {
        socketRef.current.emit('chat', JSON.stringify({text: `${username} is left`, sender: username}));
        socketRef.current.disconnect();
      }
    };
  }, [location]); // Run when `location` changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submitMessage = (e) => {
    e.preventDefault();
    socketRef.current.emit('chat', JSON.stringify({text: `${username}: ${message}`, sender: username}));
    setMessage('');
  };

  return (
    <div className="container">
      <h1 className="text-center my-3">Event chatroom</h1>
      <div id="messageArea" className="mb-3 p-3 border rounded bg-white">
        {messages.map((msg, idx) => (
          <p key={idx} className={`message ${msg.sender === username ? 'my-message' : 'other-message'}`}>{msg.text}</p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div id="number" className="text-center mb-3">{onlineUsers} users online</div>
      <form onSubmit={submitMessage}>
        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="message" value={message} onChange={(e) => setMessage(e.target.value)} required autoFocus />
          <button className="btn btn-outline-primary">send</button>
        </div>
      </form>
      <div className="d-grid">
        <button className="btn btn-outline-danger" onClick={() => {
          socketRef.current.disconnect();
          navigate(-1); // navigate back
        }}>exit room</button>
      </div>
    </div>
  );
};

export default Chatroom;
