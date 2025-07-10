import React from 'react';
import '../global.css'; 

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container">
        <h1>Welcome to MockPrep</h1>
        <p>
          Elevate your coding interview skills with our cutting-edge mock interview platform.
          Master Data Structures and Algorithms with real-time feedback and expert insights.
        </p>
        <a href="#topics" className="btn">Start Practicing</a>
      </div>
    </section>
  );
}

export default Hero;