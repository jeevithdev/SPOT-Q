import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../../styles/PageStyles/Sandlab/SandTestingRecordReport.css';

const SandTestingRecordReport = () => {
  return (
    <div className="sand-testing-report-header">
      <div className="sand-testing-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Sand Testing Record - Report
          <button 
            className="sand-testing-report-entry-btn"
            onClick={() => window.location.href = "/sand-lab/sand-testing-record"}
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

export default SandTestingRecordReport;
