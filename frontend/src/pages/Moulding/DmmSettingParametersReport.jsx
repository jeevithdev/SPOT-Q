import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Trash2, Edit, X, Save } from 'lucide-react';
import { DatePicker, FilterButton, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Moulding/DisamaticProductReport.css';

// Redesigned to mirror TensileReport: one consolidated table showing all parameter rows across shifts.
// Each parameter row gains Date + Machine + Shift context columns.

const DmmSettingParametersReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [remarksModal, setRemarksModal] = useState({ show: false, content: '', title: 'Remarks' });
  const [showSections, setShowSections] = useState({
    basicInfo: true,
    ppParameters: true,
    spParameters: true,
    coreMaskParameters: true,
    pressureParameters: true,
    strippingParameters: true,
    mouldParameters: true
  });

  const toggleSection = (section) => {
    setShowSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
        setReports(resp.data || []);
        setFilteredReports(resp.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch dmm settings', err);
    } finally { setLoading(false); }
  };

  const handleFilter = () => {
    if (!startDate) { setFilteredReports(reports); return; }
    const start = new Date(startDate); start.setHours(0,0,0,0);
    const filtered = reports.filter(r => {
      if (!r.date) return false;
      const d = new Date(r.date); d.setHours(0,0,0,0);
      if (endDate) {
        const end = new Date(endDate); end.setHours(23,59,59,999);
        return d >= start && d <= end;
      }
      return d.getTime() === start.getTime();
    });
    setFilteredReports(filtered);
  };

  // Flatten each shift's parameter arrays into unified list of rows.
  const flattenedRows = filteredReports.flatMap(report => {
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

  // Resolve the full report by id, or fallback to date+machine match
  const resolveReportByRow = (row) => {
    const byId = reports.find(r => r._id === row._id);
    if (byId) return byId;
    try {
      const rowDateKey = row.date ? new Date(row.date).toISOString().split('T')[0] : '';
      return reports.find(r => {
        const repDateKey = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
        return repDateKey === rowDateKey && String(r.machine) === String(row.machine);
      }) || null;
    } catch {
      return null;
    }
  };

  const handleEditClick = (report) => {
    console.log('Editing report:', report);
    setEditingReport(report._id);
    setEditFormData({
      date: report.date ? new Date(report.date).toISOString().split('T')[0] : '',
      machine: report.machine || '',
      shifts: {
        shift1: { 
          operatorName: report.shifts?.shift1?.operatorName || '', 
          checkedBy: report.shifts?.shift1?.checkedBy || '' 
        },
        shift2: { 
          operatorName: report.shifts?.shift2?.operatorName || '', 
          checkedBy: report.shifts?.shift2?.checkedBy || '' 
        },
        shift3: { 
          operatorName: report.shifts?.shift3?.operatorName || '', 
          checkedBy: report.shifts?.shift3?.checkedBy || '' 
        }
      },
      parameters: {
        shift1: report.parameters?.shift1 || [],
        shift2: report.parameters?.shift2 || [],
        shift3: report.parameters?.shift3 || []
      }
    });
  };

  const handleUpdateReport = async () => {
    if (!editFormData) return;

    // Normalize payload to backend schema expectations
    const normalized = JSON.parse(JSON.stringify(editFormData));
    // Normalize parameter field names per shift
    ['shift1','shift2','shift3'].forEach(shiftKey => {
      if (Array.isArray(normalized.parameters?.[shiftKey])) {
        normalized.parameters[shiftKey] = normalized.parameters[shiftKey].map((p, idx) => {
          const out = { ...p };
          // ppHeight/ppheight consistency
          if (out.ppHeight == null && out.ppheight != null) out.ppHeight = out.ppheight;
          if (shiftKey === 'shift1' && out.ppHeight != null) out.ppheight = out.ppHeight;
          // Core Mask: backend stores combined fields
          if (out.CoreMaskThickness == null) {
            out.CoreMaskThickness = out.spCoreMaskThickness ?? out.ppCoreMaskThickness ?? 0;
          }
          if (out.CoreMaskHeight == null) {
            out.CoreMaskHeight = out.spCoreMaskHeight ?? out.ppCoreMaskHeight ?? 0;
          }
          // Sand shot pressure key normalization
          if (out.sandShotPressurebar == null && out.sandShotPressureBar != null) {
            out.sandShotPressurebar = out.sandShotPressureBar;
          }
          // Mould thickness normalization
          if (out.mouldThickness == null && out.mouldThicknessPlus10 != null) {
            out.mouldThickness = out.mouldThicknessPlus10;
          }
          return out;
        });
      }
    });

    try {
      setUpdating(true);
      const res = await api.put(`/v1/dmm-settings/${editingReport}`, normalized);
      if (res.success) {
        alert('Report updated successfully!');
        setEditingReport(null);
        setEditFormData(null);
        fetchReports();
      }
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setUpdating(false);
    }
  };

  const handleOperationChange = (shift, field, value) => {
    setEditFormData(prev => ({
      ...prev,
      shifts: {
        ...prev.shifts,
        [shift]: {
          ...prev.shifts[shift],
          [field]: value
        }
      }
    }));
  };

  const handleParameterChange = (shiftKey, rowIndex, field, value) => {
    setEditFormData(prev => {
      const newParams = { ...prev.parameters };
      const shiftParams = [...(newParams[shiftKey] || [])];
      if (shiftParams[rowIndex]) {
        shiftParams[rowIndex] = {
          ...shiftParams[rowIndex],
          [field]: value
        };
        newParams[shiftKey] = shiftParams;
      }
      return {
        ...prev,
        parameters: newParams
      };
    });
  };

  return (
    <>
      <div className="impact-report-header">
        <div className="impact-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            DMM Setting Parameters Check Sheet - Report
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

      {/* Section Checkboxes */}
      <div style={{ 
        background: 'white', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#334155' }}>Sections Filter:</div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.basicInfo} 
              onChange={() => toggleSection('basicInfo')}
              style={{ cursor: 'pointer' }}
            />
            <span>Basic Info</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.ppParameters} 
              onChange={() => toggleSection('ppParameters')}
              style={{ cursor: 'pointer' }}
            />
            <span>PP Parameters</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.spParameters} 
              onChange={() => toggleSection('spParameters')}
              style={{ cursor: 'pointer' }}
            />
            <span>SP Parameters</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.coreMaskParameters} 
              onChange={() => toggleSection('coreMaskParameters')}
              style={{ cursor: 'pointer' }}
            />
            <span>Core Mask Parameters</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.pressureParameters} 
              onChange={() => toggleSection('pressureParameters')}
              style={{ cursor: 'pointer' }}
            />
            <span>Pressure Parameters</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.strippingParameters} 
              onChange={() => toggleSection('strippingParameters')}
              style={{ cursor: 'pointer' }}
            />
            <span>Stripping Parameters</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.mouldParameters} 
              onChange={() => toggleSection('mouldParameters')}
              style={{ cursor: 'pointer' }}
            />
            <span>Mould Parameters</span>
          </label>
        </div>
      </div>

      {loading ? <div className="impact-loader-container"><Loader /></div> : (
        <div className="impact-details-card">
          <div className="impact-table-container">
            <table className="impact-table">
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Machine</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Shift</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Operator Name</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Checked By</th>
                  {showSections.basicInfo && (
                    <>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>S.No</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Customer</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Item Description</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Time</th>
                    </>
                  )}
                  {showSections.ppParameters && (
                    <>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>PP Thickness (mm)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>PP Height (mm)</th>
                    </>
                  )}
                  {showSections.spParameters && (
                    <>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>SP Thickness (mm)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>SP Height (mm)</th>
                    </>
                  )}
                  {showSections.coreMaskParameters && (
                    <>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Core Mask Thickness (mm)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Core Mask Height (mm)</th>
                    </>
                  )}
                  {showSections.pressureParameters && (
                    <>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Sand Shot Pressure (Bar)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Correction Shot Time (s)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Squeeze Pressure (Kg/cm²)</th>
                    </>
                  )}
                  {showSections.strippingParameters && (
                    <>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>PP Stripping Acceleration</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>PP Stripping Distance</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>SP Stripping Acceleration</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>SP Stripping Distance</th>
                    </>
                  )}
                  {showSections.mouldParameters && (
                    <>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Mould Thickness ±10mm</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Close Up Force/Pressure</th>
                    </>
                  )}
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Remarks</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flattenedRows.length === 0 ? (
                  <tr><td colSpan="28" className="impact-no-records">No parameter rows found</td></tr>
                ) : (
                  flattenedRows.map((row, idx) => (
                    <tr key={row._id + '-' + idx}>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.machine || '-'}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.shift}</td>
                                            <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.operatorName}</td>
                                            <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.checkedBy}</td>
                      {showSections.basicInfo && (
                        <>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.sNo || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.customer || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.itemDescription || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.time || '-'}</td>
                        </>
                      )}
                      {showSections.ppParameters && (
                        <>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.ppThickness || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.ppHeight || row.ppheight || '-'}</td>
                        </>
                      )}
                      {showSections.spParameters && (
                        <>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.spThickness || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.spHeight || '-'}</td>
                        </>
                      )}
                      {showSections.coreMaskParameters && (
                        <>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.CoreMaskThickness ?? row.spCoreMaskThickness ?? row.ppCoreMaskThickness ?? '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.CoreMaskHeight ?? row.spCoreMaskHeight ?? row.ppCoreMaskHeight ?? '-'}</td>
                        </>
                      )}
                      {showSections.pressureParameters && (
                        <>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.sandShotPressurebar || row.sandShotPressureBar || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.correctionShotTime || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.squeezePressure || '-'}</td>
                        </>
                      )}
                      {showSections.strippingParameters && (
                        <>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.ppStrippingAcceleration || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.ppStrippingDistance || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.spStrippingAcceleration || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.spStrippingDistance || '-'}</td>
                        </>
                      )}
                      {showSections.mouldParameters && (
                        <>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.mouldThickness || row.mouldThicknessPlus10 || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{row.closeUpForcePressure || row.closeUpForceMouldCloseUpPressure || '-'}</td>
                        </>
                      )}
                      <td style={{ 
                        cursor: row.remarks ? 'pointer' : 'default',
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        padding: '10px 16px',
                        textAlign: 'center'
                      }}
                        onClick={() => row.remarks && showRemarksPopup(row.remarks)}>
                        {row.remarks || '-'}
                      </td>
                      <td style={{ minWidth: '120px', padding: '10px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button 
                            onClick={() => {
                              const fullReport = resolveReportByRow(row);
                              if (fullReport) handleEditClick(fullReport);
                              else alert('Unable to open editor: report not found for this row');
                            }}
                            style={{
                              padding: '0.5rem',
                              background: '#5B9AA9',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Edit size={16} />
                          </button>
                          <DeleteActionButton onClick={() => {
                            const fullReport = resolveReportByRow(row);
                            if (!fullReport?._id) {
                              alert('Failed to delete: Report not found for this row');
                              return;
                            }
                            deleteWholeReport(fullReport._id);
                          }} />
                        </div>
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

      {/* Edit Modal */}
      {editingReport && editFormData && (
        <div className="modal-overlay" onClick={() => { setEditingReport(null); setEditFormData(null); }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit DMM Settings Report</h2>
              <button className="modal-close-btn" onClick={() => { setEditingReport(null); setEditFormData(null); }}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
            {/* Primary Information */}
            <div className="edit-section">
              <h3 className="edit-section-title">Primary Information</h3>
              <div className="disamatic-form-grid">
                <div className="disamatic-form-group">
                  <label>Date</label>
                  <input type="date" value={editFormData.date}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value}))} />
                </div>
                <div className="disamatic-form-group">
                  <label>Machine</label>
                  <input type="text" value={editFormData.machine}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, machine: e.target.value}))} />
                </div>
              </div>
            </div>

            {/* Operation Information */}
            <div className="edit-section">
              <h3 className="edit-section-title">Operation Information</h3>
              <table className="edit-operations-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Shift I</th>
                    <th>Shift II</th>
                    <th>Shift III</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="param-label">Operator Name</td>
                    <td>
                      <input type="text" value={editFormData.shifts.shift1.operatorName}
                        onChange={(e) => handleOperationChange('shift1', 'operatorName', e.target.value)} />
                    </td>
                    <td>
                      <input type="text" value={editFormData.shifts.shift2.operatorName}
                        onChange={(e) => handleOperationChange('shift2', 'operatorName', e.target.value)} />
                    </td>
                    <td>
                      <input type="text" value={editFormData.shifts.shift3.operatorName}
                        onChange={(e) => handleOperationChange('shift3', 'operatorName', e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td className="param-label">Checked By</td>
                    <td>
                      <input type="text" value={editFormData.shifts.shift1.checkedBy}
                        onChange={(e) => handleOperationChange('shift1', 'checkedBy', e.target.value)} />
                    </td>
                    <td>
                      <input type="text" value={editFormData.shifts.shift2.checkedBy}
                        onChange={(e) => handleOperationChange('shift2', 'checkedBy', e.target.value)} />
                    </td>
                    <td>
                      <input type="text" value={editFormData.shifts.shift3.checkedBy}
                        onChange={(e) => handleOperationChange('shift3', 'checkedBy', e.target.value)} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Shift Parameters - Show each shift's parameters */}
            {['shift1', 'shift2', 'shift3'].map((shiftKey, shiftIdx) => {
              const shiftParams = editFormData.parameters[shiftKey] || [];
              if (shiftParams.length === 0) return null;
              
              return (
                <div key={shiftKey} className="edit-section">
                  <h3 className="edit-section-title">Shift {shiftIdx + 1} Parameters</h3>
                  {shiftParams.map((param, rowIdx) => (
                    <div key={rowIdx} className="edit-table-row">
                                            <h4 style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: '#64748b' }}>Entry #{param.sNo || rowIdx + 1}</h4>
                                              <div className="disamatic-form-group">
                                                <label>S.No</label>
                                                <input type="number" value={param.sNo || rowIdx + 1}
                                                  onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'sNo', e.target.value)} />
                                              </div>
                      <div className="disamatic-form-grid">
                        <div className="disamatic-form-group">
                          <label>Customer</label>
                          <input type="text" value={param.customer || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'customer', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Item Description</label>
                          <input type="text" value={param.itemDescription || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'itemDescription', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Time</label>
                          <input type="text" value={param.time || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'time', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>PP Thickness</label>
                          <input type="number" value={param.ppThickness || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'ppThickness', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>PP Height</label>
                          <input type="number" value={param.ppHeight || param.ppheight || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'ppHeight', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>SP Thickness</label>
                          <input type="number" value={param.spThickness || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'spThickness', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>SP Height</label>
                          <input type="number" value={param.spHeight || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'spHeight', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Core Mask Thickness</label>
                          <input type="number" value={param.CoreMaskThickness ?? param.spCoreMaskThickness ?? param.ppCoreMaskThickness ?? ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'CoreMaskThickness', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Core Mask Height</label>
                          <input type="number" value={param.CoreMaskHeight ?? param.spCoreMaskHeight ?? param.ppCoreMaskHeight ?? ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'CoreMaskHeight', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Sand Shot Pressure (Bar)</label>
                          <input type="number" value={param.sandShotPressurebar || param.sandShotPressureBar || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'sandShotPressurebar', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Correction Shot Time</label>
                          <input type="number" value={param.correctionShotTime || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'correctionShotTime', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Squeeze Pressure</label>
                          <input type="number" value={param.squeezePressure || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'squeezePressure', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>PP Stripping Acceleration</label>
                          <input type="number" value={param.ppStrippingAcceleration || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'ppStrippingAcceleration', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>PP Stripping Distance</label>
                          <input type="number" value={param.ppStrippingDistance || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'ppStrippingDistance', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>SP Stripping Acceleration</label>
                          <input type="number" value={param.spStrippingAcceleration || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'spStrippingAcceleration', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>SP Stripping Distance</label>
                          <input type="number" value={param.spStrippingDistance || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'spStrippingDistance', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Mould Thickness ±10mm</label>
                          <input type="number" value={param.mouldThickness || param.mouldThicknessPlus10 || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'mouldThickness', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Close Up Force/Pressure</label>
                          <input type="text" value={param.closeUpForceMouldCloseUpPressure || param.closeUpForcePressure || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'closeUpForceMouldCloseUpPressure', e.target.value)} />
                        </div>
                        <div className="disamatic-form-group full-width">
                          <label>Remarks</label>
                          <input type="text" value={param.remarks || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'remarks', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={() => { setEditingReport(null); setEditFormData(null); }}>
                Cancel
              </button>
              <button className="modal-submit-btn" onClick={handleUpdateReport} disabled={updating}>
                <Save size={18} />
                {updating ? 'Updating...' : 'Update Report'}
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DmmSettingParametersReport;
