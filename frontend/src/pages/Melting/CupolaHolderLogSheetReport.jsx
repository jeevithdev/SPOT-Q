import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/PageStyles/Melting/CupolaHolderLogSheetReport.css';

const CupolaHolderLogSheetReport = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="cupola-report-container">
      <div className="cupola-tabs">
        <Link to="/melting/cupola-holder-log-sheet" className={`cupola-tab ${isActive('/melting/cupola-holder-log-sheet') ? 'active' : ''}`}>Data Entry</Link>
        <Link to="/melting/cupola-holder-log-sheet/report" className={`cupola-tab ${isActive('/melting/cupola-holder-log-sheet/report') ? 'active' : ''}`}>Report</Link>
      </div>

      <div className="cupola-report-card">
        <h3>Cupola Holder Log Sheet - Report</h3>
        <div className="cupola-report-placeholder">Design your report UI here.</div>
      </div>
    </div>
  );
};

export default CupolaHolderLogSheetReport;


