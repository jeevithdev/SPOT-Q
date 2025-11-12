import React, { useState } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { DatePicker, FilterButton } from '../../Components/Buttons';
import '../../styles/PageStyles/Sandlab/SandTestingRecordReport.css';

const SandTestingRecordReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log('Filtering from:', fromDate, 'to:', toDate);
  };

  return (
    <>
      <div className="sand-testing-report-header">
        <div className="sand-testing-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Sand Testing Record - Report
          </h2>
        </div>
      </div>

      <div className="sand-testing-filter-container">
        <div className="sand-testing-filter-group">
          <label>Start Date</label>
          <DatePicker
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="Select start date"
          />
        </div>
        <div className="sand-testing-filter-group">
          <label>End Date</label>
          <DatePicker
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="Select end date"
          />
        </div>
        <FilterButton onClick={handleFilter} disabled={!fromDate}>
          Filter
        </FilterButton>
      </div>
    </>
  );
};

export default SandTestingRecordReport;
