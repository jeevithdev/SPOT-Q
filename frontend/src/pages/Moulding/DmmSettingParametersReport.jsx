import React, { useState, useEffect } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { FilterButton } from '../../Components/Buttons';
import CustomDatePicker from '../../Components/CustomDatePicker';
import '../../styles/PageStyles/Moulding/DisamaticProductReport.css';

// Redesigned to mirror TensileReport: one consolidated table showing all parameter rows across shifts.
// Each parameter row gains Date + Machine + Shift context columns.

const DmmSettingParametersReport = () => {
  // Use LOCAL date (not UTC) to avoid off-by-one issues
  const formatDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const getTodayLocal = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const todayStr = getTodayLocal();
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedShift, setSelectedShift] = useState('All');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remarksModal, setRemarksModal] = useState({ show: false, content: '', title: 'Remarks' });

  // Section checkboxes removed – always show all columns

  const showRemarksPopup = (content, title = 'Remarks') => {
    setRemarksModal({ show: true, content, title });
  };

  const closeRemarksModal = () => {
    setRemarksModal({ show: false, content: '', title: 'Remarks' });
  };

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const resp = await api.get('/v1/dmm-settings');
      if (resp.success) {
        const all = resp.data || [];
        setReports(all);
        if (all.length === 0) { setFilteredReports([]); return; }
        let dateToUse = selectedDate || todayStr;
        const hasToday = all.some(r => r.date && formatDate(r.date) === todayStr);
        if (!hasToday) {
          const latest = [...all].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          if (latest?.date) {
            dateToUse = formatDate(latest.date);
            setSelectedDate(dateToUse);
          }
        }
        setFilteredReports(all.filter(r => r.date && formatDate(r.date) === dateToUse));
      }
    } catch (err) {
      console.error('Failed to fetch dmm settings', err);
    } finally { setLoading(false); }
  };

  const applyFilters = (date, shift, allReports = reports) => {
    let dateToUse = date || todayStr;
    let filtered = allReports.filter(r => r.date && formatDate(r.date) === dateToUse);
    if (filtered.length === 0 && dateToUse === todayStr && allReports.length > 0) {
      const latest = [...allReports].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      if (latest?.date) {
        const latestDate = formatDate(latest.date);
        setSelectedDate(latestDate);
        filtered = allReports.filter(r => r.date && formatDate(r.date) === latestDate);
      }
    }
    setFilteredReports(filtered);
  };

  const handleFilter = () => {
    applyFilters(selectedDate, selectedShift, reports);
  };

  useEffect(() => {
    if (reports && reports.length >= 0) {
      applyFilters(selectedDate, selectedShift, reports);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedShift, reports]);

  // Flatten each shift's parameter arrays into unified list of rows.
  const flattenedRows = filteredReports.flatMap(report => {
    const rows = [];
    if (report.parameters) {
      ['shift1','shift2','shift3'].forEach(shiftKey => {
        if (selectedShift !== 'All' && selectedShift !== shiftKey.replace('shift','Shift ')) return;
        const arr = report.parameters[shiftKey];
        if (Array.isArray(arr) && arr.length > 0) {
          arr.forEach((param, rowIndex) => {
            rows.push({
              _id: report._id,
              date: report.date,
              machine: report.machine,
              shift: shiftKey.replace('shift','Shift '),
              shiftKey,
              rowIndex,
              operatorName: report.shifts?.[shiftKey]?.operatorName || '-',
              checkedBy: report.shifts?.[shiftKey]?.checkedBy || '-',
              ...param
            });
          });
        }
      });
    }
    return rows;
  });

  // Resolve the full report by id, or fallback to date+machine match
  const resolveReportByRow = (row) => {
    const byId = reports.find(r => r._id === row._id);
    if (byId) return byId;
    try {
      const rowDateKey = row.date ? formatDate(row.date) : '';
      return reports.find(r => {
        const repDateKey = r.date ? formatDate(r.date) : '';
        return repDateKey === rowDateKey && String(r.machine) === String(row.machine);
      }) || null;
    } catch {
      return null;
    }
  };

  return (
    <div className="page-wrapper">
      <div className="impact-report-header">
        <div className="impact-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            DMM Setting Parameters Check Sheet - Report
          </h2>
        </div>
      </div>

      <div className="impact-filter-container" style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="impact-filter-group">
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Select Date</label>
            <CustomDatePicker value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} placeholder="Select date" />
          </div>
          <div className="impact-filter-group">
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Select Shift</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              style={{
                padding: '0.625rem 0.875rem',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="All">All Shifts</option>
              <option value="Shift 1">Shift 1</option>
              <option value="Shift 2">Shift 2</option>
              <option value="Shift 3">Shift 3</option>
            </select>
          </div>
          {/* Auto-applied filters; removed manual Apply button for consistency */}
        </div>
      </div>

      {/* Section checkboxes removed */}

      {loading ? <div className="impact-loader-container"><div>Loading...</div></div> : (
        <div className="impact-details-card">
          <div className="impact-table-container">
            <table className="impact-table">
              <thead>
                <tr>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Date</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Machine</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Shift</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Operator Name</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Checked By</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Customer</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Item Description</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Time</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>PP Thickness (mm)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>PP Height (mm)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>SP Thickness (mm)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>SP Height (mm)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Core Mask Thickness (mm)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Core Mask Height Outside (mm)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Core Mask Height Inside (mm)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Sand Shot Pressure (Bar)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Correction Shot Time (s)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Squeeze Pressure (Kg/cm²)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>PP Stripping Accel.</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>PP Stripping Dist.</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>SP Stripping Accel.</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>SP Stripping Dist.</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Mould Thickness ±10mm</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Close-Up Force/Pressure</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Remarks</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flattenedRows.length === 0 ? (
                  <tr><td colSpan="26" className="impact-no-records">No parameter rows found</td></tr>
                ) : (
                  flattenedRows.map((row, idx) => (
                    <tr key={row._id + '-' + idx} style={{ transition: 'background-color 0.2s ease' }}>
                      <td style={{ padding: '12px 18px', textAlign: 'center', fontWeight: 500 }}>{row.date ? (() => {
                        const date = new Date(row.date);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day} / ${month} / ${year}`;
                      })() : '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center', fontWeight: 500 }}>{row.machine || '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center', fontWeight: 500 }}>{row.shift}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.operatorName}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.checkedBy}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.customer || '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.itemDescription || '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.time || '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.ppThickness ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.ppHeight ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.spThickness ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.spHeight ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.coreMaskThickness ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.coreMaskHeightOutside ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.coreMaskHeightInside ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.sandShotPressureBar ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.correctionShotTime ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.squeezePressure ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.ppStrippingAcceleration ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.ppStrippingDistance ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.spStrippingAcceleration ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.spStrippingDistance ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.mouldThicknessPlus10 ?? '-'}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>{row.closeUpForceMouldCloseUpPressure || '-'}</td>
                      <td style={{ 
                        cursor: row.remarks ? 'pointer' : 'default',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        padding: '12px 18px',
                        textAlign: 'center',
                        color: row.remarks ? '#5B9AA9' : '#94a3b8',
                        textDecoration: row.remarks ? 'underline' : 'none'
                      }}
                        onClick={() => row.remarks && showRemarksPopup(row.remarks)}
                        title={row.remarks || 'No remarks'}>
                        {row.remarks || '-'}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Remarks Modal */}
      {remarksModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }} onClick={closeRemarksModal}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '300px',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{remarksModal.title}</h3>
              <button onClick={closeRemarksModal} style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0',
                color: '#64748b'
              }}>&times;</button>
            </div>
            <p style={{ margin: 0, lineHeight: '1.6', color: '#334155' }}>{remarksModal.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DmmSettingParametersReport;