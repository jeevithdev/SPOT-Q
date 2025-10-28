// src/Components/Dashboard.jsx
import React from 'react';
import '../styles/ComponentStyles/Dashboard.css';
const Dashboard = ({ title, children }) => {
  return (
    <div className="dashboard-page-container">
      {title && (
        <header className="dashboard-page-header">
          <h1>{title}</h1>
          {/* Add any page-specific action buttons here if needed */}
        </header>
      )}
      
      <main className="dashboard-page-content">
        {/* This is where the actual content of specific pages (e.g., Items, Spectro Analysis, etc.) will be rendered */}
        {children || <p>This is a content area. Specific page elements will be rendered here.</p>}
      </main>
    </div>
  );
};

export default Dashboard;