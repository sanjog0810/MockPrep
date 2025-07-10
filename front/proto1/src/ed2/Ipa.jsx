import React from 'react';
import './Ipa.css';

const InterviewPanel = ({ 
  userQuestion,
  setUserQuestion,
  onAskQuestion,
  currentProblem
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAskQuestion();
    }
  };

  return (
    <div className="interview-panel">
      <div className="panel-header">
        <h2>Problem Panel</h2>
      </div>

      <div className="problem-container">
        <h3 className="problem-title">{currentProblem.title}</h3>
        
        <div className="problem-description">
          <p>{currentProblem.description}</p>
        </div>
        
        <div className="problem-constraints">
          <h4>Constraints:</h4>
          <ul>
            {currentProblem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
        
        <div className="test-cases">
          <h4>Test Cases:</h4>
          <div className="test-case-grid">
            {currentProblem.testCases.map((testCase, index) => (
              <div key={index} className="test-case">
                <div className="test-case-header">Test Case {index + 1}</div>
                <div className="test-case-content">
                  <div><strong>Input:</strong> {testCase.input}</div>
                  <div><strong>Output:</strong> {testCase.output}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Query Input */}
      <div className="user-input-container">
        <textarea
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your query here..."
          rows="2"
        />
        <button
          onClick={onAskQuestion}
          disabled={!userQuestion.trim()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default InterviewPanel;
