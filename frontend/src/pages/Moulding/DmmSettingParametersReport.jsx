import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Edit, X, Save } from 'lucide-react';
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
  const [editingReport, setEditingReport] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const handleEditClick = (report) => {
    setEditingReport(report._id);
    setEditFormData({
      date: report.date ? new Date(report.date).toISOString().split('T')[0] : '',
      machine: report.machine || '',
      shifts: report.shifts || {
        shift1: { operatorName: '', checkedBy: '' },
        shift2: { operatorName: '', checkedBy: '' },
        shift3: { operatorName: '', checkedBy: '' }
      },
      parameters: report.parameters || {
        shift1: [],
        shift2: [],
        shift3: []
      }
    });
  };

  const handleUpdateReport = async () => {
    if (!editFormData) return;
    
    try {
      setUpdating(true);
      const res = await api.put(`/v1/dmm-settings/${editingReport}`, editFormData);
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
                      <td style={{ minWidth: '120px' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button 
                            onClick={() => {
                              // Find the full report object for this row
                              const fullReport = reports.find(r => r._id === row._id);
                              if (fullReport) handleEditClick(fullReport);
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
                          <DeleteActionButton onClick={() => deleteWholeReport(row._id)} />
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

      {/* Edit Modal */}
      {editingReport && editFormData && (
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
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '1200px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Edit DMM Settings Report</h3>
              <button onClick={() => { setEditingReport(null); setEditFormData(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Primary Information */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Primary Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date</label>
                  <input type="date" value={editFormData.date}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Machine</label>
                  <input type="text" value={editFormData.machine}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, machine: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
              </div>
            </div>

            {/* Operation Information */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Operation Information</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '0.75rem', border: '1px solid #cbd5e1', textAlign: 'left' }}>Parameter</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #cbd5e1', textAlign: 'left' }}>Shift I</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #cbd5e1', textAlign: 'left' }}>Shift II</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #cbd5e1', textAlign: 'left' }}>Shift III</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.5rem', border: '1px solid #cbd5e1', fontWeight: 500 }}>Operator Name</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #cbd5e1' }}>
                      <input type="text" value={editFormData.shifts.shift1.operatorName}
                        onChange={(e) => handleOperationChange('shift1', 'operatorName', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #cbd5e1' }}>
                      <input type="text" value={editFormData.shifts.shift2.operatorName}
                        onChange={(e) => handleOperationChange('shift2', 'operatorName', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #cbd5e1' }}>
                      <input type="text" value={editFormData.shifts.shift3.operatorName}
                        onChange={(e) => handleOperationChange('shift3', 'operatorName', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem', border: '1px solid #cbd5e1', fontWeight: 500 }}>Checked By</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #cbd5e1' }}>
                      <input type="text" value={editFormData.shifts.shift1.checkedBy}
                        onChange={(e) => handleOperationChange('shift1', 'checkedBy', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #cbd5e1' }}>
                      <input type="text" value={editFormData.shifts.shift2.checkedBy}
                        onChange={(e) => handleOperationChange('shift2', 'checkedBy', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #cbd5e1' }}>
                      <input type="text" value={editFormData.shifts.shift3.checkedBy}
                        onChange={(e) => handleOperationChange('shift3', 'checkedBy', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
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
                <div key={shiftKey} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>
                    Shift {shiftIdx + 1} Parameters
                  </h4>
                  {shiftParams.map((param, rowIdx) => (
                    <div key={rowIdx} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                      <h5 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 500 }}>Entry #{param.sNo}</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Customer</label>
                          <input type="text" value={param.customer || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'customer', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Item Description</label>
                          <input type="text" value={param.itemDescription || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'itemDescription', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Time</label>
                          <input type="text" value={param.time || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'time', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>PP Thickness</label>
                          <input type="number" value={param.ppThickness || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'ppThickness', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>PP Height</label>
                          <input type="number" value={param.ppHeight || param.ppheight || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'ppHeight', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>SP Thickness</label>
                          <input type="number" value={param.spThickness || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'spThickness', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>SP Height</label>
                          <input type="number" value={param.spHeight || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'spHeight', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Remarks</label>
                          <input type="text" value={param.remarks || ''}
                            onChange={(e) => handleParameterChange(shiftKey, rowIdx, 'remarks', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => { setEditingReport(null); setEditFormData(null); }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}>
                Cancel
              </button>
              <button onClick={handleUpdateReport} disabled={updating}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#5B9AA9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: updating ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                <Save size={18} />
                {updating ? 'Updating...' : 'Update Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DmmSettingParametersReport;
