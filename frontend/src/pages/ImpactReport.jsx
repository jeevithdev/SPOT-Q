import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../styles/PageStyles/ImpactReport.css';

const ImpactReport = () => {
  return (
    <div className="impact-report-header">
      <div className="impact-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Impact Test - Report
          <button 
            className="impact-report-entry-btn"
            onClick={() => window.location.href = "/impact"}
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

export default ImpactReport;
