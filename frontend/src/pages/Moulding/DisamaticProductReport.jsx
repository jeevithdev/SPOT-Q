import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Trash2, Edit, X, Save } from 'lucide-react';
import { DatePicker, FilterButton, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Moulding/DisamaticProductReport.css';

const DisamaticProductReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Delete this entire report and all its data?')) return;
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

  const handleEditClick = (report) => {
    setEditingReport(report);
    setEditFormData({
      date: report.date ? new Date(report.date).toISOString().split('T')[0] : '',
      shift: report.shift || '',
      incharge: report.incharge || '',
      ppOperator: report.ppOperator || '',
      memberspresent: report.memberspresent || '',
      productionDetails: report.productionDetails || [],
      nextShiftPlan: report.nextShiftPlan || [],
      delays: report.delays || [],
      mouldHardness: report.mouldHardness || [],
      patternTemperature: report.patternTemperature || [],
      significantEvent: report.significantEvent || '',
      maintenance: report.maintenance || '',
      supervisorName: report.supervisorName || ''
    });
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTableChange = (tableName, index, field, value) => {
    setEditFormData(prev => {
      const updatedTable = [...prev[tableName]];
      updatedTable[index] = { ...updatedTable[index], [field]: value };
      return { ...prev, [tableName]: updatedTable };
    });
  };

  const handleUpdateReport = async () => {
    try {
      setUpdating(true);
      const payload = {
        ...editFormData,
        section: 'all'
      };
      
      const res = await api.put(`/v1/dismatic-reports/${editingReport._id}`, payload);
      if (res.success) {
        alert('Report updated successfully!');
        setEditingReport(null);
        setEditFormData(null);
        fetchReports();
      }
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update report: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setUpdating(false);
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
                  <th>Production Details</th>
                  <th>Next Shift Plan</th>
                  <th>Delays</th>
                  <th>Mould Hardness</th>
                  <th>Pattern Temperature</th>
                  <th>Significant Event</th>
                  <th>Maintenance</th>
                  <th>Supervisor Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr><td colSpan="14" className="impact-no-records">No records found</td></tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.date ? new Date(report.date).toLocaleDateString('en-GB') : '-'}</td>
                      <td>{report.shift || '-'}</td>
                      <td>{report.incharge || '-'}</td>
                      <td>{report.ppOperator || '-'}</td>
                      <td>{report.memberspresent || '-'}</td>
                      <td>
                        {report.productionDetails && report.productionDetails.length > 0 
                          ? report.productionDetails.map(item => 
                              `${item.componentName || '-'} (${item.produced || 0})`
                            ).join(', ')
                          : '-'}
                      </td>
                      <td>
                        {report.nextShiftPlan && report.nextShiftPlan.length > 0
                          ? report.nextShiftPlan.map(item => 
                              `${item.componentName || '-'} (${item.plannedMoulds || 0})`
                            ).join(', ')
                          : '-'}
                      </td>
                      <td>
                        {report.delays && report.delays.length > 0
                          ? report.delays.map(item => 
                              `${item.delays || '-'} (${item.durationMinutes || 0}min)`
                            ).join(', ')
                          : '-'}
                      </td>
                      <td>
                        {report.mouldHardness && report.mouldHardness.length > 0
                          ? report.mouldHardness.map(item => 
                              `${item.componentName || '-'}`
                            ).join(', ')
                          : '-'}
                      </td>
                      <td>
                        {report.patternTemperature && report.patternTemperature.length > 0
                          ? report.patternTemperature.map(item => 
                              `${item.item || '-'}`
                            ).join(', ')
                          : '-'}
                      </td>
                      <td>{report.significantEvent || '-'}</td>
                      <td>{report.maintenance || '-'}</td>
                      <td>{report.supervisorName || '-'}</td>
                      <td style={{ minWidth: '120px' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleEditClick(report)}
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
                          <DeleteActionButton onClick={() => handleDeleteReport(report._id)} />
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
        <div className="modal-overlay" onClick={() => setEditingReport(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1200px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>Edit Disamatic Product Entry</h2>
              <button className="modal-close-btn" onClick={() => setEditingReport(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Primary Information */}
              <div className="edit-section">
                <h3 className="edit-section-title">Primary Information</h3>
                <div className="disamatic-form-grid">
                  <div className="disamatic-form-group">
                    <label>Date *</label>
                    <input 
                      type="date" 
                      value={editFormData.date} 
                      onChange={(e) => handleEditChange('date', e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="disamatic-form-group">
                    <label>Shift *</label>
                    <input 
                      type="text" 
                      value={editFormData.shift} 
                      onChange={(e) => handleEditChange('shift', e.target.value)}
                    />
                  </div>
                  <div className="disamatic-form-group">
                    <label>Incharge</label>
                    <input 
                      type="text" 
                      value={editFormData.incharge} 
                      onChange={(e) => handleEditChange('incharge', e.target.value)}
                    />
                  </div>
                  <div className="disamatic-form-group">
                    <label>PP Operator</label>
                    <input 
                      type="text" 
                      value={editFormData.ppOperator} 
                      onChange={(e) => handleEditChange('ppOperator', e.target.value)}
                    />
                  </div>
                  <div className="disamatic-form-group full-width">
                    <label>Members Present</label>
                    <input 
                      type="text" 
                      value={editFormData.memberspresent} 
                      onChange={(e) => handleEditChange('memberspresent', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Production Details */}
              {editFormData.productionDetails && editFormData.productionDetails.length > 0 && (
                <div className="edit-section">
                  <h3 className="edit-section-title">Production Details</h3>
                  {editFormData.productionDetails.map((item, idx) => (
                    <div key={idx} className="edit-table-row">
                      <div className="disamatic-form-grid">
                        <div className="disamatic-form-group">
                          <label>Counter No</label>
                          <input 
                            type="text" 
                            value={item.counterNo || ''} 
                            onChange={(e) => handleTableChange('productionDetails', idx, 'counterNo', e.target.value)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Component Name</label>
                          <input 
                            type="text" 
                            value={item.componentName || ''} 
                            onChange={(e) => handleTableChange('productionDetails', idx, 'componentName', e.target.value)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Produced</label>
                          <input 
                            type="number" 
                            value={item.produced || 0} 
                            onChange={(e) => handleTableChange('productionDetails', idx, 'produced', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Poured</label>
                          <input 
                            type="number" 
                            value={item.poured || 0} 
                            onChange={(e) => handleTableChange('productionDetails', idx, 'poured', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Cycle Time</label>
                          <input 
                            type="text" 
                            value={item.cycleTime || ''} 
                            onChange={(e) => handleTableChange('productionDetails', idx, 'cycleTime', e.target.value)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Moulds/Hour</label>
                          <input 
                            type="number" 
                            value={item.mouldsPerHour || 0} 
                            onChange={(e) => handleTableChange('productionDetails', idx, 'mouldsPerHour', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group full-width">
                          <label>Remarks</label>
                          <input 
                            type="text" 
                            value={item.remarks || ''} 
                            onChange={(e) => handleTableChange('productionDetails', idx, 'remarks', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Next Shift Plan */}
              {editFormData.nextShiftPlan && editFormData.nextShiftPlan.length > 0 && (
                <div className="edit-section">
                  <h3 className="edit-section-title">Next Shift Plan</h3>
                  {editFormData.nextShiftPlan.map((item, idx) => (
                    <div key={idx} className="edit-table-row">
                      <div className="disamatic-form-grid">
                        <div className="disamatic-form-group">
                          <label>Component Name</label>
                          <input 
                            type="text" 
                            value={item.componentName || ''} 
                            onChange={(e) => handleTableChange('nextShiftPlan', idx, 'componentName', e.target.value)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Planned Moulds</label>
                          <input 
                            type="number" 
                            value={item.plannedMoulds || 0} 
                            onChange={(e) => handleTableChange('nextShiftPlan', idx, 'plannedMoulds', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group full-width">
                          <label>Remarks</label>
                          <input 
                            type="text" 
                            value={item.remarks || ''} 
                            onChange={(e) => handleTableChange('nextShiftPlan', idx, 'remarks', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delays */}
              {editFormData.delays && editFormData.delays.length > 0 && (
                <div className="edit-section">
                  <h3 className="edit-section-title">Delays</h3>
                  {editFormData.delays.map((item, idx) => (
                    <div key={idx} className="edit-table-row">
                      <div className="disamatic-form-grid">
                        <div className="disamatic-form-group">
                          <label>Delays</label>
                          <input 
                            type="text" 
                            value={item.delays || ''} 
                            onChange={(e) => handleTableChange('delays', idx, 'delays', e.target.value)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Duration (Minutes)</label>
                          <input 
                            type="number" 
                            value={item.durationMinutes || 0} 
                            onChange={(e) => handleTableChange('delays', idx, 'durationMinutes', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>Duration (Time)</label>
                          <input 
                            type="text" 
                            value={item.durationTime || ''} 
                            onChange={(e) => handleTableChange('delays', idx, 'durationTime', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mould Hardness */}
              {editFormData.mouldHardness && editFormData.mouldHardness.length > 0 && (
                <div className="edit-section">
                  <h3 className="edit-section-title">Mould Hardness Production</h3>
                  {editFormData.mouldHardness.map((item, idx) => (
                    <div key={idx} className="edit-table-row">
                      <div className="disamatic-form-grid">
                        <div className="disamatic-form-group">
                          <label>Component Name</label>
                          <input 
                            type="text" 
                            value={item.componentName || ''} 
                            onChange={(e) => handleTableChange('mouldHardness', idx, 'componentName', e.target.value)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>MP-PP</label>
                          <input 
                            type="number" 
                            value={item.mpPP || 0} 
                            onChange={(e) => handleTableChange('mouldHardness', idx, 'mpPP', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>MP-SP</label>
                          <input 
                            type="number" 
                            value={item.mpSP || 0} 
                            onChange={(e) => handleTableChange('mouldHardness', idx, 'mpSP', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>BS-PP</label>
                          <input 
                            type="number" 
                            value={item.bsPP || 0} 
                            onChange={(e) => handleTableChange('mouldHardness', idx, 'bsPP', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>BS-SP</label>
                          <input 
                            type="number" 
                            value={item.bsSP || 0} 
                            onChange={(e) => handleTableChange('mouldHardness', idx, 'bsSP', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group full-width">
                          <label>Remarks</label>
                          <input 
                            type="text" 
                            value={item.remarks || ''} 
                            onChange={(e) => handleTableChange('mouldHardness', idx, 'remarks', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pattern Temperature */}
              {editFormData.patternTemperature && editFormData.patternTemperature.length > 0 && (
                <div className="edit-section">
                  <h3 className="edit-section-title">Pattern Temperature</h3>
                  {editFormData.patternTemperature.map((item, idx) => (
                    <div key={idx} className="edit-table-row">
                      <div className="disamatic-form-grid">
                        <div className="disamatic-form-group">
                          <label>Item</label>
                          <input 
                            type="text" 
                            value={item.item || ''} 
                            onChange={(e) => handleTableChange('patternTemperature', idx, 'item', e.target.value)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>PP</label>
                          <input 
                            type="number" 
                            value={item.pp || 0} 
                            onChange={(e) => handleTableChange('patternTemperature', idx, 'pp', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="disamatic-form-group">
                          <label>SP</label>
                          <input 
                            type="number" 
                            value={item.sp || 0} 
                            onChange={(e) => handleTableChange('patternTemperature', idx, 'sp', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Event Section */}
              <div className="edit-section">
                <h3 className="edit-section-title">Event Information</h3>
                <div className="disamatic-form-grid">
                  <div className="disamatic-form-group full-width">
                    <label>Significant Event</label>
                    <textarea 
                      value={editFormData.significantEvent} 
                      onChange={(e) => handleEditChange('significantEvent', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="disamatic-form-group full-width">
                    <label>Maintenance</label>
                    <textarea 
                      value={editFormData.maintenance} 
                      onChange={(e) => handleEditChange('maintenance', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="disamatic-form-group">
                    <label>Supervisor Name</label>
                    <input 
                      type="text" 
                      value={editFormData.supervisorName} 
                      onChange={(e) => handleEditChange('supervisorName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={() => setEditingReport(null)} disabled={updating}>
                Cancel
              </button>
              <button className="modal-submit-btn" onClick={handleUpdateReport} disabled={updating}>
                {updating ? 'Updating...' : 'Update Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisamaticProductReport;
