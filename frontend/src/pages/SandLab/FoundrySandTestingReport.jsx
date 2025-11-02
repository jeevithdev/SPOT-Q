import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../../styles/PageStyles/Sandlab/FoundarySandTestingNoteReport.css';

const FoundrySandTestingReport = () => {
  return (
    <div className="foundry-sand-report-header">
      <div className="foundry-sand-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Foundry Sand Testing Note - Report
          <button 
            className="foundry-sand-report-entry-btn"
            onClick={() => window.location.href = "/sand-lab/foundry-sand-testing-note"}
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

export default FoundrySandTestingReport;
