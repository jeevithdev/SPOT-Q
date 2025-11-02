import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../styles/PageStyles/MicroStructureReport.css';

const MicroStructureReport = () => {
  return (
    <div className="microstructure-report-header">
      <div className="microstructure-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Micro Structure - Report
          <button 
            className="microstructure-report-entry-btn"
            onClick={() => window.location.href = "/micro-structure"}
            title="Entry"
          >
            <PencilLine size={16} />
            <span>Entry</span>
          </button>
        </h2>
      </div>
    </div>
  );
};

export default MicroStructureReport;
