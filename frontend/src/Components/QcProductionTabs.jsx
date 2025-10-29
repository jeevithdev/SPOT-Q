import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/ComponentStyles/QcProductionTabs.css';

const QcProductionTabs = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="qcproduction-tabs-container">
      <div className="qcproduction-tabs">
        <Link
          to="/qc-production-details/data-entry"
          className={`qcproduction-tab ${isActive('/qc-production-details/data-entry') ? 'active' : ''}`}
        >
          Data Entry
        </Link>
        <Link
          to="/qc-production-details/report"
          className={`qcproduction-tab ${isActive('/qc-production-details/report') ? 'active' : ''}`}
        >
          Report
        </Link>
      </div>
    </div>
  );
};

export default QcProductionTabs;
