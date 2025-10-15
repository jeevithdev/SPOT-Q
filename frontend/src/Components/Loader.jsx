import React from 'react';
import '../styles/ComponentStyles/Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <div className="loader-text">Loading...</div>
    </div>
  );
};

export default Loader;