import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../styles/PageStyles/QcProductionDetailsReport.css';

const QcProductionDetailsReport = () => {
  return (
    <div className="qc-production-report-header">
      <div className="qc-production-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          QC Production Details - Report
          <button 
            className="qc-production-report-entry-btn"
            onClick={() => window.location.href = "/qc-production-details"}
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

export default QcProductionDetailsReport;
