import React, { useState, useEffect } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { DatePicker, FilterButton, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Moulding/DmmSettingParametersReport.css';

// Redesigned to mirror TensileReport: one consolidated table showing all parameter rows across shifts.
// Each parameter row gains Date + Machine + Shift context columns.

const DmmSettingParametersReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const resp = await api.get('/v1/dmm-settings');
      if (resp.success) {
        setReports(resp.data || []);
        setFiltered(resp.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch dmm settings', err);
    } finally { setLoading(false); }
  };

  const handleFilter = () => {
    if (!startDate) { setFiltered(reports); return; }
    const start = new Date(startDate); start.setHours(0,0,0,0);
    const filteredReports = reports.filter(r => {
      if (!r.date) return false;
      const d = new Date(r.date); d.setHours(0,0,0,0);
      if (endDate) {
        const end = new Date(endDate); end.setHours(23,59,59,999);
        return d >= start && d <= end;
      }
      return d.getTime() === start.getTime();
    });
    setFiltered(filteredReports);
  };

  // Flatten each shift's parameter arrays into unified list of rows.
  const flattenedRows = filtered.flatMap(report => {
    const rows = [];
    if (report.parameters) {
      ['shift1','shift2','shift3'].forEach(shiftKey => {
        const arr = report.parameters[shiftKey];
        if (Array.isArray(arr) && arr.length > 0) {
          arr.forEach(param => {
            rows.push({
              _id: report._id,
              date: report.date,
              machine: report.machine,
              shift: shiftKey.replace('shift','Shift '),
              ...param
            });
          });
        }
      });
    }
    return rows;
  });

  const deleteWholeReport = async (id) => {
    if (!window.confirm('Delete entire machine report (all shift rows)?')) return;
    try {
      const res = await api.delete(`/v1/dmm-settings/${id}`);
      if (res.success) fetchReports();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <>
      <div className="dmm-report-header">
        <div className="dmm-report-header-text">
          <h2><BookOpenCheck size={28} style={{ color: '#5B9AA9' }} /> DMM Setting Parameters Check Sheet - Report</h2>
        </div>
      </div>

      <div className="dmm-filter-container">
        <div className="dmm-filter-group">
          <label>Start Date</label>
          <DatePicker value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Select start date" />
        </div>
        <div className="dmm-filter-group">
          <label>End Date</label>
          <DatePicker value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Select end date" />
        </div>
        <FilterButton onClick={handleFilter} disabled={!startDate}>Filter</FilterButton>
      </div>

      {loading ? <div className="dmm-loader-container"><Loader /></div> : (
        <div className="dmm-details-card">
          <div className="dmm-table-container">
            <table className="dmm-report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Machine</th>
                  <th>Shift</th>
                  <th>S.No</th>
                  <th>Customer</th>
                  <th>Item Description</th>
                  <th>Time</th>
                  <th>PP Thickness</th>
                  <th>PP Height</th>
                  <th>SP Thickness</th>
                  <th>SP Height</th>
                  <th>Core Mask Thickness</th>
                  <th>Core Mask Height</th>
                  <th>Sand Shot Pressure (bar)</th>
                  <th>Correction Shot Time</th>
                  <th>Squeeze Pressure</th>
                  <th>PP Stripping Acceleration</th>
                  <th>PP Stripping Distance</th>
                  <th>SP Stripping Acceleration</th>
                  <th>SP Stripping Distance</th>
                  <th>Mould Thickness</th>
                  <th>Close Up Force/Pressure</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flattenedRows.length === 0 ? (
                  <tr><td colSpan="24" className="dmm-no-records">No parameter rows found</td></tr>
                ) : (
                  flattenedRows.map((row, idx) => (
                    <tr key={row._id + '-' + idx}>
                      <td>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</td>
                      <td>{row.machine || '-'}</td>
                      <td>{row.shift}</td>
                      <td>{row.sNo || '-'}</td>
                      <td>{row.customer || '-'}</td>
                      <td>{row.itemDescription || '-'}</td>
                      <td>{row.time || '-'}</td>
                      <td>{row.ppThickness || '-'}</td>
                      <td>{row.ppHeight || row.ppheight || '-'}</td>
                      <td>{row.spThickness || '-'}</td>
                      <td>{row.spHeight || '-'}</td>
                      <td>{row.CoreMaskThickness || '-'}</td>
                      <td>{row.CoreMaskHeight || '-'}</td>
                      <td>{row.sandShotPressurebar || '-'}</td>
                      <td>{row.correctionShotTime || '-'}</td>
                      <td>{row.squeezePressure || '-'}</td>
                      <td>{row.ppStrippingAcceleration || '-'}</td>
                      <td>{row.ppStrippingDistance || '-'}</td>
                      <td>{row.spStrippingAcceleration || '-'}</td>
                      <td>{row.spStrippingDistance || '-'}</td>
                      <td>{row.mouldThickness || '-'}</td>
                      <td>{row.closeUpForceMouldCloseUpPressure || '-'}</td>
                      <td>{row.remarks || '-'}</td>
                      <td style={{ minWidth: '80px' }}>
                        <DeleteActionButton onClick={() => deleteWholeReport(row._id)} />
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

export default DmmSettingParametersReport;
