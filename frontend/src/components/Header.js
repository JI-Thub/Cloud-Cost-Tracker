import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <span className="logo">☁️</span>
          <h1>Cloud Cost Tracker</h1>
        </div>
        <p className="header-subtitle">Monitor and optimize your cloud resource costs</p>
      </div>
    </header>
  );
}

export default Header;
