import React, { useState } from 'react';
import { PencilLine, BookOpenCheck, Filter } from 'lucide-react';
import CustomDatePicker from '../Components/CustomDatePicker';
import '../styles/PageStyles/MicroStructureReport.css';

const MicroStructureReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log('Filtering from:', fromDate, 'to:', toDate);
  };

  return (
    <>
      <div className="microstructure-report-header">
        <div className="microstructure-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Micro Structure - Report
            <button 
              className="microstructure-report-entry-btn"
              onClick={() => window.location.href = "/micro-structure"}
              title="Entry"
            >
              <PencilLine size={16} />
              <span>Entry</span>
            </button>
          </h2>
        </div>
      </div>

      {/* Filter Section */}
      <div className="microstructure-report-container">
        <div className="microstructure-filter-grid">
          <div className="microstructure-filter-group">
            <label>From Date</label>
            <CustomDatePicker
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              name="fromDate"
            />
          </div>
          <div className="microstructure-filter-group">
            <label>To Date</label>
            <CustomDatePicker
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              name="toDate"
            />
          </div>
          <div className="microstructure-filter-btn-container">
            <button
              className="microstructure-filter-btn"
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

export default MicroStructureReport;
