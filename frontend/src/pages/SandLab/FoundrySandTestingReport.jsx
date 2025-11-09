import React, { useState } from 'react';
import { PencilLine, BookOpenCheck, Filter } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import '../../styles/PageStyles/Sandlab/FoundarySandTestingNoteReport.css';

const FoundrySandTestingReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log('Filtering from:', fromDate, 'to:', toDate);
  };

  return (
    <>
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

      {/* Filter Section */}
      <div className="foundry-sand-report-container">
        <div className="foundry-sand-filter-grid">
          <div className="foundry-sand-filter-group">
            <label>From Date</label>
            <CustomDatePicker
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              name="fromDate"
            />
          </div>
          <div className="foundry-sand-filter-group">
            <label>To Date</label>
            <CustomDatePicker
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              name="toDate"
            />
          </div>
          <div className="foundry-sand-filter-btn-container">
            <button
              className="foundry-sand-filter-btn"
              onClick={handleFilter}
            >
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoundrySandTestingReport;
