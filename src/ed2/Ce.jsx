import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './Ce.css';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CodeEditor = ({ code, setCode, onSubmit, isSubmitting }) => {
  const [language, setLanguage] = useState('javascript');
  
  const handleEditorChange = (value) => {
    setCode(value);
  };
  
  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <h2>Code Editor</h2>
        <div className="language-selector">
          <label>Language: </label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>
        </div>
      </div>
      
      <div className="monaco-editor">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      
      <button 
        className="submit-button"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'AI is evaluating...' : 'Submit Code'}
      </button>
    </div>
  );
};

export default CodeEditor;