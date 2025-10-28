import React from 'react';
import '../styles/ComponentStyles/ValidationPopup.css';

const ValidationPopup = ({ isOpen = true, onClose, missingFields }) => {
  if (!isOpen || !missingFields || missingFields.length === 0) return null;

  // Determine size class based on number of missing fields
  const getSizeClass = () => {
    const count = missingFields.length;
    if (count <= 2) return 'small-popup';
    if (count <= 4) return 'medium-popup';
    return 'large-popup';
  };

  return (
    <div className="validation-popup-overlay" onClick={onClose}>
      <div className={`validation-popup-content ${getSizeClass()}`} onClick={(e) => e.stopPropagation()}>
        <div className="validation-popup-header">
          <h3 className="validation-popup-title">
            ⚠️ Missing Required Fields
          </h3>
          <button className="validation-popup-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="validation-popup-body">
          <p className="validation-popup-message">
            Please fill in the following required fields:
          </p>
          <ul className="validation-missing-fields-list">
            {missingFields.map((field, index) => (
              <li key={index} className="validation-missing-field-item">
                {field}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="validation-popup-footer">
          <button className="validation-popup-button" onClick={onClose}>
            OK, Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationPopup;

