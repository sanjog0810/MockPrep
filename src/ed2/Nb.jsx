import React, { useState, useEffect, useRef } from 'react';
import SiriWave from './SiriWave'; // Assuming this is your SiriWave component
import './Nb.css';

const Navbar = ({ activeTab, setActiveTab, onTimeExpired, isInterviewEnded }) => {
  const [timeLeft, setTimeLeft] = useState(2 * 60); // 2 minutes for testing, change to 60 * 60 for production
  const [isRunning, setIsRunning] = useState(false);
  const hasExpired = useRef(false); // Prevent multiple calls to onTimeExpired
  const siriRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0 && !isInterviewEnded) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          
          // Check if time has expired
          if (newTime <= 0 && !hasExpired.current) {
            hasExpired.current = true;
            if (onTimeExpired) {
              onTimeExpired(); // Call the callback to end interview
            }
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning, timeLeft, onTimeExpired, isInterviewEnded]);

  useEffect(() => {
    startTimer();
  }, []);

  // Stop timer if interview is ended externally
  useEffect(() => {
    if (isInterviewEnded) {
      setIsRunning(false);
    }
  }, [isInterviewEnded]);

  const startTimer = () => {
    if (!isInterviewEnded) {
      setIsRunning(true);
      setTimeLeft(1 * 60); // Reset to 2 minutes for testing (change to 60 * 60 for production)
      hasExpired.current = false;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="navbar">
      <div className="logo">
        {/* Shrunk SiriWave container */}
        <div className="siri-container">
          <SiriWave
            width={300}       // Render resolution
            height={100}
            amplitude={1.5}
            speed={0.3}
            style="ios9"      // ✅ use style instead of styleName
            autostart={true}
          />
        </div>
      </div>
      
      <div className="timer-container">
        <div className={`timer ${timeLeft < 300 ? 'warning' : ''} ${timeLeft === 0 ? 'expired' : ''} ${isInterviewEnded ? 'stopped' : ''}`}>
          {isInterviewEnded ? 'ENDED' : formatTime(timeLeft)}
        </div>
        {timeLeft <= 60 && timeLeft > 0 && !isInterviewEnded && (
          <div className="timer-alert">
            Interview ending soon!
          </div>
        )}
      </div>
      
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => !isInterviewEnded && setActiveTab('interview')}
          disabled={isInterviewEnded}
        >
          Interview
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Chat History
        </button>
      </div>
    </div>
  );
};

export default Navbar;