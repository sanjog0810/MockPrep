import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Nb';
import CodeEditor from './Ce';
import InterviewPanel from './Ipa';
import ChatHistory from './Ch';
import './Ip.css';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


function App() {
  const [activeTab, setActiveTab] = useState('interview');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [code, setCode] = useState('// Write your solution here\nfunction solution(input) {\n  \n}');
  const [userQuestion, setUserQuestion] = useState('');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const hasSpokenWelcome = useRef(false); // Track if welcome has been spoken
  const topicObj = JSON.parse(localStorage.getItem('selectedTopic'));
  const topic = topicObj?.name || 'graphs';
  const navigate = useNavigate();


  // Function to handle interview end
  const handleInterviewEnd = async () => {
    if (isInterviewEnded) return; // Prevent multiple calls
    
    setIsInterviewEnded(true);
    
    try {
      const username = localStorage.getItem('username') || 'candidate';
      const questionId = localStorage.getItem('questionId');
      
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      // Add final message to chat
      const finalMessage = {
        id: chatHistory.length + 1,
        sender: 'ai',
        message: 'Time\'s up! The interview has ended. Analyzing your performance...'
      };
      
      setChatHistory(prev => [...prev, finalMessage]);
      
      
      // Call backend to finalize interview session
      localStorage.setItem('finalCode', code);
      localStorage.setItem('chatHistory', JSON.stringify([...chatHistory, finalMessage]));
      
      // Redirect to results page after a brief delay
      setTimeout(() => {
        // You can either use React Router or window.location
        // For React Router: navigate('/results');
        // For direct redirect:
        navigate('/results');

        
        // Or if you want to redirect to a specific results page with data:
        // window.location.href = `/results?username=${username}&questionId=${questionId}`;
      }, 2000);
      
    } catch (error) {
      console.error('Error ending interview:', error);
      // Still redirect even if there's an error
      setTimeout(() => {
        window.location.href = '/results';
      }, 2000);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        console.warn("No voices available");
        return;
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, []);

  const waitForVoices = () => {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length) return resolve(voices);

      const handler = () => {
        resolve(speechSynthesis.getVoices());
        speechSynthesis.removeEventListener('voiceschanged', handler);
      };
      speechSynthesis.addEventListener('voiceschanged', handler);
    });
  };

  // 🔥 Fetch question from Spring Boot backend
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/start/${topic}`);
        const data = res.data;
        localStorage.setItem('questionId', data.id);

        const formattedProblem = {
          title: data.title,
          description: data.description,
          constraints: [data.constraints],
          testCases: data.examples.map(e => ({
            input: e.input,
            output: e.output
          }))
        };

        setCurrentProblem(formattedProblem);
        setChatHistory([
          { id: 1, sender: 'ai', message: "Hello! I'm your AI interviewer. Let's start with a problem." },
          { id: 2, sender: 'ai', message: formattedProblem.description },
          { id: 3, sender: 'ai', message: "Constraints:\n" + formattedProblem.constraints.join("\n") }
        ]);
        
        // Only speak welcome if it hasn't been spoken yet
        if (!hasSpokenWelcome.current) {
          hasSpokenWelcome.current = true;
          
          await waitForVoices();

          const voices = speechSynthesis.getVoices();
          const hindiVoice = voices.find(
            (voice) =>
              voice.lang === 'hi-IN' || voice.name.toLowerCase().includes('hindi')
          ) || voices[0];
          
          if (hindiVoice) {
            const username = localStorage.getItem('username') || 'candidate';
            const welcomeMessage = `Welcome ${username} to MockPrep! I'm your virtual interviewer. Let's begin.`;
            const utterance = new SpeechSynthesisUtterance(welcomeMessage);
            utterance.voice = hindiVoice;
            utterance.rate = 1.0;
            utterance.pitch = 1.1;
            utterance.lang = hindiVoice.lang;
            speechSynthesis.speak(utterance);
          }
        }

      } catch (err) {
        console.error("Failed to fetch question:", err);
      } finally {
        setLoadingProblem(false);
      }
    };

    fetchQuestion();
  }, [topic]);

  const handleSubmitCode = async () => {
    if (!code.trim() || isInterviewEnded) return;
    setIsSpeaking(true);
  
    const newUserEntry = {
      id: chatHistory.length + 1,
      sender: 'user',
      message: `Submitted code:\n\`\`\`javascript\n${code}\n\`\`\``
    };
  
    setChatHistory(prev => [...prev, newUserEntry]);
  
    try {
      const questionId = localStorage.getItem('questionId');
      const username = localStorage.getItem('username') || 'candidate';
  
      const res = await axios.post(`${BASE_URL}/review`, {
        questionId,
        username,
        code
      });
      
  
      const aiMessage = res.data;
  
      const newAiEntry = {
        id: chatHistory.length + 2,
        sender: 'ai',
        message: aiMessage
      };
  
      setChatHistory(prev => [...prev, newAiEntry]);
  
      // 🗣 Speak the AI message
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(
        (voice) =>
          voice.lang === 'hi-IN' || voice.name.toLowerCase().includes('hindi')
      ) || voices[0];
  
      const utterance = new SpeechSynthesisUtterance(aiMessage);
      utterance.voice = hindiVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.lang = hindiVoice.lang;
  
      speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Error submitting code:", err);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!userQuestion.trim() || isInterviewEnded) return;
    setIsSpeaking(true);
  
    const newUserEntry = {
      id: chatHistory.length + 1,
      sender: 'user',
      message: userQuestion
    };
  
    setChatHistory(prev => [...prev, newUserEntry]);
  
    const questionId = localStorage.getItem('questionId');
  
    try {
      const res = await axios.post(`${BASE_URL}/query`, {
        questionId,
        userQuestion
      });
      
  
      const aiMessage = res.data;
  
      const newAiEntry = {
        id: chatHistory.length + 2,
        sender: 'ai',
        message: aiMessage
      };
  
      setChatHistory(prev => [...prev, newAiEntry]);
  
      // 🔊 Speak it
      const voices = speechSynthesis.getVoices();
      const hindiVoice = voices.find(
        (v) => v.lang === 'hi-IN' || v.name.toLowerCase().includes('hindi')
      ) || voices[0];
  
      const utterance = new SpeechSynthesisUtterance(aiMessage);
      utterance.voice = hindiVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
  
      speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Query failed:", err);
    } finally {
      setIsSpeaking(false);
      setUserQuestion('');
    }
  };

  if (loadingProblem) return <div className="loading">Fetching your problem...</div>;

  return (
    <div className="app">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onTimeExpired={handleInterviewEnd}
        isInterviewEnded={isInterviewEnded}
      />
      <div className="main-content">
        {isInterviewEnded ? (
          <div className="interview-ended">
            <h2>Interview Completed!</h2>
            <p>Analyzing your performance... You will be redirected to results shortly.</p>
            <div className="loading-spinner"></div>
          </div>
        ) : activeTab === 'interview' ? (
          <div className="interview-container">
            <InterviewPanel
              isSpeaking={isSpeaking}
              userQuestion={userQuestion}
              setUserQuestion={setUserQuestion}
              onAskQuestion={handleAskQuestion}
              currentProblem={currentProblem}
            />
            <CodeEditor
              code={code}
              setCode={setCode}
              onSubmit={handleSubmitCode}
              isSubmitting={isSpeaking}
            />
          </div>
        ) : (
          <ChatHistory chatHistory={chatHistory} />
        )}
      </div>
    </div>
  );
}

export default App;