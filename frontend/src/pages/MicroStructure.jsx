import React from 'react';
import '../styles/PageStyles/MicroStructure.css';

const MicroStructure = () => {
  return (
    <div className="micro-structure-container">
      <div className="page-header">
        <h1>Micro Structure</h1>
        <p>Micro Structure Analysis and Testing</p>
      </div>
      
      <div className="content-section">
        <div className="info-card">
          <h2>Micro Structure Analysis</h2>
          <p>This section is dedicated to micro structure analysis and testing procedures.</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔬</span>
              <span>Microscopic Analysis</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Structure Testing</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <span>Quality Assessment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroStructure;
