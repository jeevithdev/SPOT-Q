import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Trash2 } from 'lucide-react';
import { DatePicker, FilterButton, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Moulding/DisamaticProductReport.css';

// Redesigned to mimic TensileReport layout: header + filters + single wide table with horizontal scroll.
// Each productionDetails entry becomes a row, enriched with primary info columns.

const DisamaticProductReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.get('/v1/dismatic-reports');
      if (data.success) {
        setReports(data.data || []);
        setFilteredReports(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch disamatic reports', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!startDate) {
      setFilteredReports(reports);
      return;
    }
    let filtered = reports.filter(r => {
      if (!r.date) return false;
      const d = new Date(r.date); d.setHours(0,0,0,0);
      const start = new Date(startDate); start.setHours(0,0,0,0);
      if (endDate) {
        const end = new Date(endDate); end.setHours(23,59,59,999);
        return d >= start && d <= end;
      }
      return d.getTime() === start.getTime();
    });
    setFilteredReports(filtered);
  };

  // Flatten productionDetails into table rows. Skip reports with no production data.
  const flattenedRows = filteredReports
    .filter(r => Array.isArray(r.productionDetails) && r.productionDetails.length > 0)
    .flatMap(report => {
      return report.productionDetails.map(detail => ({
        _id: report._id,
        date: report.date,
        shift: report.shift,
        incharge: report.incharge,
        ppOperator: report.ppOperator,
        memberspresent: report.memberspresent,
        ...detail
      }));
    });

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Delete entire report (all rows for its date)?')) return;
    try {
      const res = await api.delete(`/v1/dismatic-reports/${id}`);
      if (res.success) {
        fetchReports();
      }
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete report: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <>
      <div className="impact-report-header">
        <div className="impact-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Disamatic Product - Report
          </h2>
        </div>
      </div>

      <div className="impact-filter-container">
        <div className="impact-filter-group">
          <label>Start Date</label>
          <DatePicker value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Select start date" />
        </div>
        <div className="impact-filter-group">
          <label>End Date</label>
          <DatePicker value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Select end date" />
        </div>
        <FilterButton onClick={handleFilter} disabled={!startDate}>Filter</FilterButton>
      </div>

      {loading ? (
        <div className="impact-loader-container"><Loader /></div>
      ) : (
        <div className="impact-details-card">
          <div className="impact-table-container">
            <table className="impact-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Shift</th>
                  <th>Incharge</th>
                  <th>PP Operator</th>
                  <th>Members Present</th>
                  <th>S.No</th>
                  <th>Counter No</th>
                  <th>Component Name</th>
                  <th>Produced</th>
                  <th>Poured</th>
                  <th>Cycle Time</th>
                  <th>Moulds/Hour</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flattenedRows.length === 0 ? (
                  <tr><td colSpan="14" className="impact-no-records">No production records found</td></tr>
                ) : (
                  flattenedRows.map((row, idx) => (
                    <tr key={row._id + '-' + idx}>
                      <td>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</td>
                      <td>{row.shift || '-'}</td>
                      <td>{row.incharge || '-'}</td>
                      <td>{row.ppOperator || '-'}</td>
                      <td>{row.memberspresent || '-'}</td>
                      <td>{row.sNo || '-'}</td>
                      <td>{row.counterNo || '-'}</td>
                      <td>{row.componentName || '-'}</td>
                      <td>{row.produced !== undefined ? row.produced : '-'}</td>
                      <td>{row.poured !== undefined ? row.poured : '-'}</td>
                      <td>{row.cycleTime || '-'}</td>
                      <td>{row.mouldsPerHour !== undefined ? row.mouldsPerHour : '-'}</td>
                      <td>{row.remarks || '-'}</td>
                      <td style={{ minWidth: '80px' }}>
                        <DeleteActionButton onClick={() => handleDeleteReport(row._id)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default DisamaticProductReport;
