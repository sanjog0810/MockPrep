import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ResultPage.css'; // Create this file for styling
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ResultsPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const questionId = localStorage.getItem('questionId');
  const username = localStorage.getItem('username') || 'candidate';

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/end`, {
          questionId,
          username,
          finalCode: localStorage.getItem('finalCode'),
          chatHistory: JSON.parse(localStorage.getItem('chatHistory')),
          timeExpired: true
        });

        const parsedResult = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        setResult(parsedResult);
      } catch (err) {
        console.error('Failed to fetch result:', err);
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  if (loading) return <div className="loading">Analyzing your interview...</div>;

  if (!result) return <div className="error">Error fetching interview result. Please try again.</div>;

  return (
    <div className="results-container">
      <h1 className={result.passed ? 'pass' : 'fail'}>
        {result.passed ? '🎉 Congratulations! You Passed' : '❌ Interview Not Cleared'}
      </h1>

      <p className="verdict"><strong>Verdict:</strong> {result.verdict}</p>

      <section>
        <h2>💪 Strengths</h2>
        <ul>
          {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>

      <section>
        <h2>📉 Weaknesses</h2>
        <ul>
          {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </section>

      <section>
        <h2>🧠 Feedback</h2>
        <p>{result.feedback}</p>
      </section>

      <section>
        <h2>📌 Recommendations</h2>
        <ul>
          {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </section>
    </div>
  );
}

export default ResultsPage;
