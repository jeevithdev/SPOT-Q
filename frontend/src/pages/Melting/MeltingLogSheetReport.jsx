import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/PageStyles/Melting/MeltingLogSheetReport.css';

const MeltingLogSheetReport = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="melting-report-container">
      <div className="melting-tabs">
        <Link to="/melting/melting-log-sheet" className={`melting-tab ${isActive('/melting/melting-log-sheet') ? 'active' : ''}`}>Data Entry</Link>
        <Link to="/melting/melting-log-sheet/report" className={`melting-tab ${isActive('/melting/melting-log-sheet/report') ? 'active' : ''}`}>Report</Link>
      </div>

      <div className="melting-report-card">
        <h3>Melting Log Sheet - Report</h3>
        <div className="melting-report-placeholder">Design your report UI here.</div>
      </div>
    </div>
  );
};

export default MeltingLogSheetReport;


