import React from 'react';
import '../styles/PageStyles/Impact.css';

const Impact = () => {
  return (
    <div className="impact-container">
      <div className="page-header">
        <h1>Impact Testing</h1>
        <p>Impact Testing and Analysis</p>
      </div>
      
      <div className="content-section">
        <div className="info-card">
          <h2>Impact Testing</h2>
          <p>This section is dedicated to impact testing and analysis procedures.</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">💥</span>
              <span>Impact Resistance Testing</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Energy Absorption Analysis</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <span>Performance Metrics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
