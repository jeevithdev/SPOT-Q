import React, { useState } from 'react';
import { PencilLine, BookOpenCheck, Filter } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import '../../styles/PageStyles/Moulding/DmmSettingParametersReport.css';

const DmmSettingParametersReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log('Filtering from:', fromDate, 'to:', toDate);
  };

  return (
    <>
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

      {/* Filter Section */}
      <div className="dmm-report-container">
        <div className="dmm-filter-grid">
          <div className="dmm-filter-group">
            <label>From Date</label>
            <CustomDatePicker
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              name="fromDate"
            />
          </div>
          <div className="dmm-filter-group">
            <label>To Date</label>
            <CustomDatePicker
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              name="toDate"
            />
          </div>
          <div className="dmm-filter-btn-container">
            <button
              className="dmm-filter-btn"
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

export default DmmSettingParametersReport;
