import React, { useState } from 'react';
import { PencilLine, BookOpenCheck, Filter } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import '../../styles/PageStyles/Melting/MeltingLogSheetReport.css';

const MeltingLogSheetReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log('Filtering from:', fromDate, 'to:', toDate);
  };

  return (
    <>
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

      {/* Filter Section */}
      <div className="melting-log-report-container">
        <div className="melting-log-filter-grid">
          <div className="melting-log-filter-group">
            <label>From Date</label>
            <CustomDatePicker
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              name="fromDate"
            />
          </div>
          <div className="melting-log-filter-group">
            <label>To Date</label>
            <CustomDatePicker
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              name="toDate"
            />
          </div>
          <div className="melting-log-filter-btn-container">
            <button
              className="melting-log-filter-btn"
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

export default MeltingLogSheetReport;
