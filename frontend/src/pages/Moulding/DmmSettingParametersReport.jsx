import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../../styles/PageStyles/Moulding/DmmSettingParametersReport.css';

const DmmSettingParametersReport = () => {
  return (
    <div className="dmm-report-header">
      <div className="dmm-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          DMM Setting Parameters Check Sheet - Report
          <button 
            className="dmm-report-entry-btn"
            onClick={() => window.location.href = "/moulding/dmm-setting-parameters"}
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

export default DmmSettingParametersReport;
