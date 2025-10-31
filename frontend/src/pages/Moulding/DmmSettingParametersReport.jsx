import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import { FilterButton, ViewReportButton } from '../../Components/Buttons';
import '../../styles/PageStyles/Moulding/DmmSettingParametersReport.css';

const DmmSettingParametersReport = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    alert(`Filtering from ${filters.startDate} to ${filters.endDate}`);
    // Implement actual filtering logic here
  };

  const handleBackToEntry = () => {
    navigate('/moulding/dmm-setting-parameters');
  };

  return (
    <div className="dmm-page-container">
      <ViewReportButton onClick={handleBackToEntry} icon={Edit2}>
        Data Entry
      </ViewReportButton>
      
      <div className="dmm-content">
        <div className="dmm-title section-header" style={{ marginBottom: '2rem' }}>
          <h2>DMM Setting Parameters - Records</h2>
        </div>

        <div className="report-section">
          <div className="section-header">
            <h3>📊 Parameter Records</h3>
          </div>

          <div className="report-filter-grid">
            <div>
              <label className="filter-label">Start Date</label>
              <input
                type="date"
                className="filter-input"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="filter-label">End Date</label>
              <input
                type="date"
                className="filter-input"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div className="filter-button-container">
              <FilterButton onClick={handleFilter}>
                Filter
              </FilterButton>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Model</th>
                  <th>Machine No</th>
                  <th>Checker</th>
                  <th>Shift</th>
                  <th>Total Entries</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" className="no-records">
                    No records found. Submit entries to see them here.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DmmSettingParametersReport;
