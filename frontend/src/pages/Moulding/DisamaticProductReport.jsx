import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../../styles/PageStyles/Moulding/DisamaticProductReport.css';

const DisamaticProductReport = () => {
  return (
    <div className="disamatic-report-header">
      <div className="disamatic-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Disamatic Product - Report
          <button 
            className="disamatic-report-entry-btn"
            onClick={() => window.location.href = "/moulding/disamatic-product"}
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

export default DisamaticProductReport;
