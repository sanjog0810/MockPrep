import React from 'react';
import './Ch.css';

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className="chat-history">
      <h2>Interview History</h2>
      
      <div className="history-container">
        {chatHistory.length > 0 ? (
          <div className="messages">
            {chatHistory.map((entry) => (
              <div 
                key={entry.id} 
                className={`message ${entry.sender}`}
              >
                <div className="sender-label">
                  {entry.sender === 'ai' ? 'AI Interviewer' : 'You'}:
                </div>
                <div className="message-content">
                  {entry.message.startsWith('Submitted code:') ? (
                    <>
                      <div>Submitted code:</div>
                      <pre className="code-block">
                        {entry.message.replace('Submitted code:\n```javascript\n', '').replace('\n```', '')}
                      </pre>
                    </>
                  ) : (
                    entry.message
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-history">
            No chat history yet. Start your interview to see the conversation.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;