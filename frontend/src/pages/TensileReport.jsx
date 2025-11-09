import React, { useState } from 'react';
import { PencilLine, BookOpenCheck, Filter } from 'lucide-react';
import CustomDatePicker from '../Components/CustomDatePicker';
import '../styles/PageStyles/TensileReport.css';

const TensileReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log('Filtering from:', fromDate, 'to:', toDate);
  };

  return (
    <>
      <div className="tensile-report-header">
        <div className="tensile-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Tensile Test - Report
            <button 
              className="tensile-report-entry-btn"
              onClick={() => window.location.href = "/tensile"}
              title="Entry"
            >
              <PencilLine size={16} />
              <span>Entry</span>
            </button>
          </h2>
        </div>
      </div>

      {/* Filter Section */}
      <div className="tensile-report-container">
        <div className="tensile-filter-grid">
          <div className="tensile-filter-group">
            <label>From Date</label>
            <CustomDatePicker
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              name="fromDate"
            />
          </div>
          <div className="tensile-filter-group">
            <label>To Date</label>
            <CustomDatePicker
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              name="toDate"
            />
          </div>
          <div className="tensile-filter-btn-container">
            <button
              className="tensile-filter-btn"
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

export default TensileReport;
