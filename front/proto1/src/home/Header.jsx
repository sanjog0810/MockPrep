import React from 'react';
import '../global.css'; 


function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1>MockPrep</h1>
        <nav>
          <a href="#home">Home</a>
          <a href="#topics">Topics</a>
          <a href="#about">About</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;