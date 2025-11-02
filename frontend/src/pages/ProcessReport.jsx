import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../styles/PageStyles/ProcessReport.css';

const ProcessReport = () => {
  return (
    <div className="process-report-header">
      <div className="process-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Process Control - Report
          <button 
            className="process-report-entry-btn"
            onClick={() => window.location.href = "/process"}
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

export default ProcessReport;
