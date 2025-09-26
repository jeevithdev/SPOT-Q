// src/Components/Dashboard.jsx
import React from 'react';
import '../styles/ComponentStyles/Dashboard.css';
// You might want to import Button if it's used within this component
// import { Button } from './Buttons'; 

/**
 * This component serves as a layout wrapper for content that appears below the Navbar.
 * It's designed to hold the specific elements of a dashboard or other main page content.
 * You can pass specific page content as children.
 */
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