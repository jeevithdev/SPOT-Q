import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/ComponentStyles/TensileTabs.css';

const TensileTabs = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="tensile-tabs-container">
      <div className="tensile-tabs">
        <Link
          to="/tensile"
          className={`tensile-tab ${isActive('/tensile') ? 'active' : ''}`}
        >
          Data Entry
        </Link>
        <Link
          to="/tensile/report"
          className={`tensile-tab ${isActive('/tensile/report') ? 'active' : ''}`}
        >
          Report
        </Link>
      </div>
    </div>
  );
};

export default TensileTabs;
