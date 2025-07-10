import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UsernamePage.css'; // optional for clean CSS separation

const Username = () => {
  const [username, setUsername] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve selected topic from localStorage
    const storedTopic = localStorage.getItem('selectedTopic');
    if (storedTopic) {
      setSelectedTopic(JSON.parse(storedTopic));
    }
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
  
    if (!username || !selectedTopic) {
      alert('Username or topic missing!');
      return;
    }
  
    localStorage.setItem('username', username);
    navigate('/inter');
  };

  return (
    <div className="username-container">
      <h2>Enter Your Name</h2>
      <form onSubmit={handleStart}>
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Start</button>
      </form>
    </div>
  );
};

export default Username;
