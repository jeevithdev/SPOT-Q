import React, { useState } from 'react';
import { PencilLine, BookOpenCheck, Filter } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import '../../styles/PageStyles/Melting/CupolaHolderLogSheetReport.css';

const CupolaHolderLogSheetReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log('Filtering from:', fromDate, 'to:', toDate);
  };

  return (
    <>
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

      {/* Filter Section */}
      <div className="cupola-holder-report-container">
        <div className="cupola-holder-filter-grid">
          <div className="cupola-holder-filter-group">
            <label>From Date</label>
            <CustomDatePicker
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              name="fromDate"
            />
          </div>
          <div className="cupola-holder-filter-group">
            <label>To Date</label>
            <CustomDatePicker
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              name="toDate"
            />
          </div>
          <div className="cupola-holder-filter-btn-container">
            <button
              className="cupola-holder-filter-btn"
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

export default CupolaHolderLogSheetReport;
