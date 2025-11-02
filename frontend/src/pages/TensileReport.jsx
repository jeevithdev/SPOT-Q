import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../styles/PageStyles/TensileReport.css';

const TensileReport = () => {
  return (
    <div className="tensile-report-header">
      <div className="tensile-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Tensile Test - Report
          <button 
            className="tensile-report-entry-btn"
            onClick={() => window.location.href = "/tensile"}
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

export default TensileReport;
