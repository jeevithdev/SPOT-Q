import React, { useState } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { DatePicker, FilterButton } from '../Components/Buttons';
import '../styles/PageStyles/MicroTensileReport.css';

const MicroTensileReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log('Filtering from:', fromDate, 'to:', toDate);
  };

  return (
    <>
      <div className="microtensile-report-header">
        <div className="microtensile-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Micro Tensile Test - Report
          </h2>
        </div>
      </div>

      <div className="microtensile-filter-container">
        <div className="microtensile-filter-group">
          <label>Start Date</label>
          <DatePicker
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="Select start date"
          />
        </div>
        <div className="microtensile-filter-group">
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

export default MicroTensileReport;
