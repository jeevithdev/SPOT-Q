import React, { useState } from 'react';
import { PencilLine, BookOpenCheck, Filter } from 'lucide-react';
import CustomDatePicker from '../Components/CustomDatePicker';
import '../styles/PageStyles/ProcessReport.css';

const ProcessReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log('Filtering from:', fromDate, 'to:', toDate);
  };

  return (
    <>
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

      {/* Filter Section */}
      <div className="process-report-container">
        <div className="process-filter-grid">
          <div className="process-filter-group">
            <label>From Date</label>
            <CustomDatePicker
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              name="fromDate"
            />
          </div>
          <div className="process-filter-group">
            <label>To Date</label>
            <CustomDatePicker
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              name="toDate"
            />
          </div>
          <div className="process-filter-btn-container">
            <button
              className="process-filter-btn"
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

export default ProcessReport;
