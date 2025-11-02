import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../../styles/PageStyles/Melting/CupolaHolderLogSheetReport.css';

const CupolaHolderLogSheetReport = () => {
  return (
    <div className="cupola-holder-report-header">
      <div className="cupola-holder-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Cupola Holder Log Sheet - Report
          <button 
            className="cupola-holder-report-entry-btn"
            onClick={() => window.location.href = "/melting/cupola-holder-log-sheet"}
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

export default CupolaHolderLogSheetReport;
