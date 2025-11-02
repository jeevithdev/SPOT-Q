import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../../styles/PageStyles/Melting/MeltingLogSheetReport.css';

const MeltingLogSheetReport = () => {
  return (
    <div className="melting-log-report-header">
      <div className="melting-log-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Melting Log Sheet - Report
          <button 
            className="melting-log-report-entry-btn"
            onClick={() => window.location.href = "/melting/melting-log-sheet"}
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

export default MeltingLogSheetReport;
