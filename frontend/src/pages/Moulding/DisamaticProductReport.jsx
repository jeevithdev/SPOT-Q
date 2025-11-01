import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { FilterButton, DatePicker, DeleteActionButton } from "../../Components/Buttons";
import Loader from "../../Components/Loader";
import api from "../../utils/api";
import "../../styles/PageStyles/Moulding/DisamaticProductReport.css";

const DisamaticProductReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/dismatic-reports');
      if (response.success) {
        setItems(response.data || []);
        setFilteredItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching disamatic product reports:', error);
      alert('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter((item) => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });

    setFilteredItems(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await api.delete(`/v1/dismatic-reports/${id}`);
        if (response.success) {
          alert('Record deleted successfully');
          await fetchItems();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record');
      }
    }
  };

  return (
    <div className="disamatic-report-container">
      <div className="disamatic-report-content">
        {/* Header */}
        <div className="disamatic-report-header">
          <div className="disamatic-report-header-text">
            <Filter size={24} style={{ color: '#FF7F50' }} />
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
            <div className="disamatic-filter-actions">
              <FilterButton onClick={handleFilter}>
                Apply Filter
              </FilterButton>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <Loader />
        ) : (
        <div className="disamatic-table-container">
          <div className="disamatic-table-wrapper">
            <table className="disamatic-table">
              <thead>
                <tr>
                    <th rowSpan="2" className="sticky-date">Date</th>
                    <th rowSpan="2" className="sticky-shift">Shift</th>
                    <th rowSpan="2" className="sticky-incharge">Incharge</th>
                    <th rowSpan="2">Members</th>
                    <th rowSpan="2">P/P Operator</th>
                    {/* Production Columns */}
                    <th colSpan="7">Production Table</th>
                    {/* Next Shift Plan Columns */}
                    <th colSpan="3">Next Shift Plan</th>
                    {/* Delays Columns */}
                    <th colSpan="3">Delays</th>
                    {/* Mould Hardness Columns */}
                    <th colSpan="6">Mould Hardness</th>
                    {/* Pattern Temp Columns */}
                    <th colSpan="3">Pattern Temperature</th>
                    <th rowSpan="2">Significant Event</th>
                    <th rowSpan="2">Maintenance</th>
                    <th rowSpan="2">Actions</th>
                  </tr>
                  <tr>
                    {/* Production Headers */}
                    <th>Counter No</th>
                    <th>Component Name</th>
                    <th>Produced</th>
                    <th>Poured</th>
                    <th>Cycle Time</th>
                    <th>Moulds/Hr</th>
                    <th>Remarks</th>
                    {/* Next Shift Plan Headers */}
                    <th>Component</th>
                    <th>Planned</th>
                    <th>Remarks</th>
                    {/* Delays Headers */}
                    <th>Delay</th>
                    <th>Duration (Min)</th>
                    <th>Duration (Time)</th>
                    {/* Mould Hardness Headers */}
                    <th>Component</th>
                    <th>MP (PP)</th>
                    <th>MP (SP)</th>
                    <th>BS (PP)</th>
                    <th>BS (SP)</th>
                    <th>Remarks</th>
                    {/* Pattern Temp Headers */}
                    <th>Item</th>
                    <th>PP</th>
                    <th>SP</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                      <td colSpan="30" className="disamatic-no-data">
                      No records found. Submit entries to see them here.
                    </td>
                  </tr>
                ) : (
                    filteredItems.map((item, index) => {
                      // Get maximum length of arrays to determine rowspan
                      const productionCount = item.productionTable?.length || (item.productionDetails ? 1 : 0);
                      const planCount = item.nextShiftPlan?.length || (item.nextShiftPlan ? 1 : 0);
                      const delaysCount = item.delaysTable?.length || (item.delays ? 1 : 0);
                      const mouldCount = item.mouldHardness?.length || (item.mouldHardness ? 1 : 0);
                      const patternCount = item.patternTemp?.length || (item.patternTemperature ? 1 : 0);
                      
                      const maxRows = Math.max(
                        productionCount,
                        planCount,
                        delaysCount,
                        mouldCount,
                        patternCount,
                        1
                      );
                      
                      return Array.from({ length: maxRows }).map((_, rowIndex) => (
                        <tr key={`${item._id || index}-${rowIndex}`}>
                          {rowIndex === 0 && (
                            <>
                              <td rowSpan={maxRows} className="sticky-date">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                              <td rowSpan={maxRows} className="sticky-shift">{item.shift || '-'}</td>
                              <td rowSpan={maxRows} className="sticky-incharge">{item.incharge || '-'}</td>
                              <td rowSpan={maxRows} className="disamatic-text-cell">
                                {item.memberspresent || '-'}
                              </td>
                              <td rowSpan={maxRows}>{item.ppOperator || '-'}</td>
                            </>
                          )}
                          
                          {/* Production Data */}
                          <td>{item.productionTable?.[rowIndex]?.counterNo || item.productionDetails?.[rowIndex]?.mouldCounterNo || '-'}</td>
                          <td>{item.productionTable?.[rowIndex]?.componentName || item.productionDetails?.[rowIndex]?.componentName || '-'}</td>
                          <td>{item.productionTable?.[rowIndex]?.produced || item.productionDetails?.[rowIndex]?.produced || '-'}</td>
                          <td>{item.productionTable?.[rowIndex]?.poured || item.productionDetails?.[rowIndex]?.poured || '-'}</td>
                          <td>{item.productionTable?.[rowIndex]?.cycleTime || item.productionDetails?.[rowIndex]?.cycleTime || '-'}</td>
                          <td>{item.productionTable?.[rowIndex]?.mouldsPerHour || item.productionDetails?.[rowIndex]?.mouldsPerHour || '-'}</td>
                          <td>{item.productionTable?.[rowIndex]?.remarks || item.productionDetails?.[rowIndex]?.remarks || '-'}</td>
                          
                          {/* Next Shift Plan Data */}
                          <td>{item.nextShiftPlan?.[rowIndex]?.componentName || '-'}</td>
                          <td>{item.nextShiftPlan?.[rowIndex]?.plannedMoulds || '-'}</td>
                          <td>{item.nextShiftPlan?.[rowIndex]?.remarks || '-'}</td>
                          
                          {/* Delays Data */}
                          <td>{item.delaysTable?.[rowIndex]?.delays || item.delays?.[rowIndex]?.delay || '-'}</td>
                          <td>{item.delaysTable?.[rowIndex]?.durationMinutes || item.delays?.[rowIndex]?.durationInMinutes || '-'}</td>
                          <td>{item.delaysTable?.[rowIndex]?.durationTime || item.delays?.[rowIndex]?.durationInTime || '-'}</td>
                          
                          {/* Mould Hardness Data */}
                          <td>{item.mouldHardness?.[rowIndex]?.componentName || '-'}</td>
                          <td>{item.mouldHardness?.[rowIndex]?.mpPP || item.mouldHardness?.[rowIndex]?.mouldPenetrantTester?.pp || '-'}</td>
                          <td>{item.mouldHardness?.[rowIndex]?.mpSP || item.mouldHardness?.[rowIndex]?.mouldPenetrantTester?.sp || '-'}</td>
                          <td>{item.mouldHardness?.[rowIndex]?.bsPP || item.mouldHardness?.[rowIndex]?.bScale?.pp || '-'}</td>
                          <td>{item.mouldHardness?.[rowIndex]?.bsSP || item.mouldHardness?.[rowIndex]?.bScale?.sp || '-'}</td>
                          <td>{item.mouldHardness?.[rowIndex]?.remarks || '-'}</td>
                          
                          {/* Pattern Temp Data */}
                          <td>{item.patternTemp?.[rowIndex]?.item || item.patternTemperature?.[rowIndex]?.items || '-'}</td>
                          <td>{item.patternTemp?.[rowIndex]?.pp || item.patternTemperature?.[rowIndex]?.pp || '-'}</td>
                          <td>{item.patternTemp?.[rowIndex]?.sp || item.patternTemperature?.[rowIndex]?.sp || '-'}</td>
                          
                          {rowIndex === 0 && (
                            <>
                              <td rowSpan={maxRows} className="disamatic-text-cell">{item.significantEvent || '-'}</td>
                              <td rowSpan={maxRows} className="disamatic-text-cell">{item.maintanance || item.maintenance || '-'}</td>
                              <td rowSpan={maxRows} className="disamatic-table-actions">
                                <DeleteActionButton onClick={() => handleDelete(item._id)} />
                      </td>
                            </>
                          )}
                    </tr>
                      ));
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default DisamaticProductReport;
