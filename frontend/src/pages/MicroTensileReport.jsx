import React from 'react';
import { PencilLine, BookOpenCheck } from 'lucide-react';
import '../styles/PageStyles/MicroTensileReport.css';

const MicroTensileReport = () => {
  return (
    <div className="microtensile-report-header">
      <div className="microtensile-report-header-text">
        <h2>
          <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
          Micro Tensile Test - Report
          <button 
            className="microtensile-report-entry-btn"
            onClick={() => window.location.href = "/micro-tensile"}
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

export default MicroTensileReport;
