import React, { useState } from "react";
import { Filter } from "lucide-react";
import { FilterButton, DatePicker } from "../../Components/Buttons";
import "../../styles/PageStyles/Moulding/DisamaticProductReport.css";

const DisamaticProductReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const handleFilter = () => {
    // Filter logic here
    console.log('Filtering with:', { startDate, endDate });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setFilteredItems(items);
  };

  return (
    <div className="disamatic-report-container">
      <div className="disamatic-report-content">
        {/* Header */}
        <div className="disamatic-report-header">
          <div className="disamatic-report-header-text">
            <Filter size={24} />
            <h2>Disamatic Production Report DISA - Records</h2>
          </div>
        </div>

        {/* Filter Section */}
        <div className="disamatic-filter-section">
          <div className="disamatic-filter-grid">
            <div className="disamatic-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                name="startDate"
                placeholder="Select start date"
              />
            </div>
            <div className="disamatic-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                name="endDate"
                placeholder="Select end date"
              />
            </div>
          </div>
          <div className="disamatic-filter-actions">
            <FilterButton onClick={handleFilter}>
              Apply Filter
            </FilterButton>
          </div>
        </div>

        {/* Table Section */}
        <div className="disamatic-table-container">
          <div className="disamatic-table-wrapper">
            <table className="disamatic-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Shift</th>
                  <th>Incharge</th>
                  <th>Total Production</th>
                  <th>Components</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="disamatic-no-data">
                      No records found. Submit entries to see them here.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.shift}</td>
                      <td>{item.incharge}</td>
                      <td>{item.totalProduction}</td>
                      <td>{item.components}</td>
                      <td className="disamatic-table-actions">
                        {/* Action buttons here */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisamaticProductReport;
