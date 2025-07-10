import React from 'react';
import '../global.css'; 
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const dsaTopics = [
  { id: 1, name: "Arrays", description: "Master array manipulation and optimization techniques" },
  { id: 2, name: "Strings", description: "Learn string processing and pattern matching" },
  { id: 3, name: "Linked Lists", description: "Understand linked list operations and variations" },
  { id: 4, name: "Trees", description: "Explore binary trees and advanced tree structures" },
  { id: 5, name: "Graphs", description: "Master graph traversal and algorithms" },
  { id: 6, name: "Dynamic Programming", description: "Solve complex problems with DP techniques" },
  { id: 7, name: "Sorting & Searching", description: "Optimize search and sort algorithms" },
  { id: 8, name: "Stacks & Queues", description: "Learn stack and queue implementations" },
];

function TopicCard({ topic }) {
  const navigate = useNavigate();
  return (
    <div className="topic-card">
      <h3>{topic.name}</h3>
      <p>{topic.description}</p>
      <button onClick={() => {
  localStorage.setItem('selectedTopic', JSON.stringify(topic));
  navigate('/user');
}}>
  Start Interview
</button>

    </div>
  );
}

function Topics() {
  return (
    <section id="topics" className="topics">
      <div className="container">
        <h2>DSA Topics</h2>
        <div className="topics-grid">
          {dsaTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Topics;