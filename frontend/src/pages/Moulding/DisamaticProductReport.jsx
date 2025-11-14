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
  const [showSections, setShowSections] = useState({
    productionDetails: true,
    nextShiftPlan: true,
    delays: true,
    mouldHardness: true,
    patternTemperature: true
  });
  const [remarksModal, setRemarksModal] = useState({ show: false, content: '', title: 'Remarks' });

  const toggleSection = (section) => {
    setShowSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const showRemarksPopup = (content, title = 'Remarks') => {
    setRemarksModal({ show: true, content, title });
  };

  const closeRemarksModal = () => {
    setRemarksModal({ show: false, content: '', title: 'Remarks' });
  };

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
              checked={showSections.productionDetails} 
              onChange={() => toggleSection('productionDetails')}
              style={{ cursor: 'pointer' }}
            />
            <span>Production Details</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.nextShiftPlan} 
              onChange={() => toggleSection('nextShiftPlan')}
              style={{ cursor: 'pointer' }}
            />
            <span>Next Shift Plan</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.delays} 
              onChange={() => toggleSection('delays')}
              style={{ cursor: 'pointer' }}
            />
            <span>Delays</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.mouldHardness} 
              onChange={() => toggleSection('mouldHardness')}
              style={{ cursor: 'pointer' }}
            />
            <span>Mould Hardness</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showSections.patternTemperature} 
              onChange={() => toggleSection('patternTemperature')}
              style={{ cursor: 'pointer' }}
            />
            <span>Pattern Temperature</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="impact-loader-container"><Loader /></div>
      ) : (
        <div className="impact-details-card">
          <div className="impact-table-container">
            <table className="impact-table">
              <thead>
                <tr>
                  <th rowSpan="2" style={{ verticalAlign: 'middle', padding: '12px 16px', textAlign: 'center' }}>Date</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle', padding: '12px 16px', textAlign: 'center' }}>Shift</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle', padding: '12px 16px', textAlign: 'center' }}>Incharge</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle', padding: '12px 16px', textAlign: 'center' }}>PP Operator</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle', padding: '12px 16px', textAlign: 'center' }}>Members Present</th>
                  {showSections.productionDetails && (
                    <th colSpan="7" style={{ background: '#e0f2f1', borderBottom: '2px solid #5B9AA9', padding: '12px 16px', textAlign: 'center' }}>Production Details</th>
                  )}
                  {showSections.nextShiftPlan && (
                    <th colSpan="3" style={{ background: '#fff3e0', borderBottom: '2px solid #5B9AA9', padding: '12px 16px', textAlign: 'center' }}>Next Shift Plan</th>
                  )}
                  {showSections.delays && (
                    <th colSpan="3" style={{ background: '#fce4ec', borderBottom: '2px solid #5B9AA9', padding: '12px 16px', textAlign: 'center' }}>Delays</th>
                  )}
                  {showSections.mouldHardness && (
                    <th colSpan="6" style={{ background: '#f3e5f5', borderBottom: '2px solid #5B9AA9', padding: '12px 16px', textAlign: 'center' }}>Mould Hardness</th>
                  )}
                  {showSections.patternTemperature && (
                    <th colSpan="3" style={{ background: '#e8f5e9', borderBottom: '2px solid #5B9AA9', padding: '12px 16px', textAlign: 'center' }}>Pattern Temperature</th>
                  )}
                  <th rowSpan="2" style={{ verticalAlign: 'middle', padding: '12px 16px', textAlign: 'center' }}>Significant Event</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle', padding: '12px 16px', textAlign: 'center' }}>Maintenance</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle', padding: '12px 16px', textAlign: 'center' }}>Supervisor Name</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle', padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
                <tr>
                  {showSections.productionDetails && (
                    <>
                      <th style={{ background: '#e0f2f1', padding: '12px 16px', textAlign: 'center' }}>Counter No</th>
                      <th style={{ background: '#e0f2f1', padding: '12px 16px', textAlign: 'center' }}>Component</th>
                      <th style={{ background: '#e0f2f1', padding: '12px 16px', textAlign: 'center' }}>Produced</th>
                      <th style={{ background: '#e0f2f1', padding: '12px 16px', textAlign: 'center' }}>Poured</th>
                      <th style={{ background: '#e0f2f1', padding: '12px 16px', textAlign: 'center' }}>Cycle Time</th>
                      <th style={{ background: '#e0f2f1', padding: '12px 16px', textAlign: 'center' }}>Moulds/Hr</th>
                      <th style={{ background: '#e0f2f1', padding: '12px 16px', textAlign: 'center' }}>Remarks</th>
                    </>
                  )}
                  {showSections.nextShiftPlan && (
                    <>
                      <th style={{ background: '#fff3e0', padding: '12px 16px', textAlign: 'center' }}>Component</th>
                      <th style={{ background: '#fff3e0', padding: '12px 16px', textAlign: 'center' }}>Planned Moulds</th>
                      <th style={{ background: '#fff3e0', padding: '12px 16px', textAlign: 'center' }}>Remarks</th>
                    </>
                  )}
                  {showSections.delays && (
                    <>
                      <th style={{ background: '#fce4ec', padding: '12px 16px', textAlign: 'center' }}>Delays</th>
                      <th style={{ background: '#fce4ec', padding: '12px 16px', textAlign: 'center' }}>Duration (min)</th>
                      <th style={{ background: '#fce4ec', padding: '12px 16px', textAlign: 'center' }}>Duration Time</th>
                    </>
                  )}
                  {showSections.mouldHardness && (
                    <>
                      <th style={{ background: '#f3e5f5', padding: '12px 16px', textAlign: 'center' }}>Component</th>
                      <th style={{ background: '#f3e5f5', padding: '12px 16px', textAlign: 'center' }}>MP PP</th>
                      <th style={{ background: '#f3e5f5', padding: '12px 16px', textAlign: 'center' }}>MP SP</th>
                      <th style={{ background: '#f3e5f5', padding: '12px 16px', textAlign: 'center' }}>BS PP</th>
                      <th style={{ background: '#f3e5f5', padding: '12px 16px', textAlign: 'center' }}>BS SP</th>
                      <th style={{ background: '#f3e5f5', padding: '12px 16px', textAlign: 'center' }}>Remarks</th>
                    </>
                  )}
                  {showSections.patternTemperature && (
                    <>
                      <th style={{ background: '#e8f5e9', padding: '12px 16px', textAlign: 'center' }}>Item</th>
                      <th style={{ background: '#e8f5e9', padding: '12px 16px', textAlign: 'center' }}>PP</th>
                      <th style={{ background: '#e8f5e9', padding: '12px 16px', textAlign: 'center' }}>SP</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr><td colSpan="50" className="impact-no-records">No records found</td></tr>
                ) : (
                  filteredReports.map((report) => {
                    const maxRows = Math.max(
                      showSections.productionDetails ? (report.productionDetails?.length || 1) : 1,
                      showSections.nextShiftPlan ? (report.nextShiftPlan?.length || 1) : 1,
                      showSections.delays ? (report.delays?.length || 1) : 1,
                      showSections.mouldHardness ? (report.mouldHardness?.length || 1) : 1,
                      showSections.patternTemperature ? (report.patternTemperature?.length || 1) : 1
                    );

                    return Array.from({ length: maxRows }).map((_, rowIdx) => (
                      <tr key={`${report._id}-${rowIdx}`}>
                        {rowIdx === 0 && (
                          <>
                            <td rowSpan={maxRows} style={{ padding: '10px 16px', textAlign: 'center' }}>{report.date ? new Date(report.date).toLocaleDateString('en-GB') : '-'}</td>
                            <td rowSpan={maxRows} style={{ padding: '10px 16px', textAlign: 'center' }}>{report.shift || '-'}</td>
                            <td rowSpan={maxRows} style={{ padding: '10px 16px', textAlign: 'center' }}>{report.incharge || '-'}</td>
                            <td rowSpan={maxRows} style={{ padding: '10px 16px', textAlign: 'center' }}>{report.ppOperator || '-'}</td>
                            <td rowSpan={maxRows} style={{ 
                              maxWidth: '150px',
                              cursor: report.memberspresent ? 'pointer' : 'default',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              padding: '10px 16px',
                              textAlign: 'center'
                            }}
                              onClick={() => report.memberspresent && showRemarksPopup(report.memberspresent, 'Members Present')}>
                              {report.memberspresent || '-'}
                            </td>
                          </>
                        )}
                        {showSections.productionDetails && (
                          <>
                            <td style={{ background: '#f1fffe', padding: '10px 16px', textAlign: 'center' }}>{report.productionDetails?.[rowIdx]?.counterNo || '-'}</td>
                            <td style={{ background: '#f1fffe', padding: '10px 16px', textAlign: 'center' }}>{report.productionDetails?.[rowIdx]?.componentName || '-'}</td>
                            <td style={{ background: '#f1fffe', padding: '10px 16px', textAlign: 'center' }}>{report.productionDetails?.[rowIdx]?.produced || '-'}</td>
                            <td style={{ background: '#f1fffe', padding: '10px 16px', textAlign: 'center' }}>{report.productionDetails?.[rowIdx]?.poured || '-'}</td>
                            <td style={{ background: '#f1fffe', padding: '10px 16px', textAlign: 'center' }}>{report.productionDetails?.[rowIdx]?.cycleTime || '-'}</td>
                            <td style={{ background: '#f1fffe', padding: '10px 16px', textAlign: 'center' }}>{report.productionDetails?.[rowIdx]?.mouldsPerHour || '-'}</td>
                            <td style={{ 
                              background: '#f1fffe', 
                              cursor: report.productionDetails?.[rowIdx]?.remarks ? 'pointer' : 'default',
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              padding: '10px 16px',
                              textAlign: 'center'
                            }}
                              onClick={() => report.productionDetails?.[rowIdx]?.remarks && showRemarksPopup(report.productionDetails[rowIdx].remarks, 'Production Details - Remarks')}>
                              {report.productionDetails?.[rowIdx]?.remarks || '-'}
                            </td>
                          </>
                        )}
                        {showSections.nextShiftPlan && (
                          <>
                            <td style={{ background: '#fffbf5', padding: '10px 16px', textAlign: 'center' }}>{report.nextShiftPlan?.[rowIdx]?.componentName || '-'}</td>
                            <td style={{ background: '#fffbf5', padding: '10px 16px', textAlign: 'center' }}>{report.nextShiftPlan?.[rowIdx]?.plannedMoulds || '-'}</td>
                            <td style={{ 
                              background: '#fffbf5', 
                              cursor: report.nextShiftPlan?.[rowIdx]?.remarks ? 'pointer' : 'default',
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              padding: '10px 16px',
                              textAlign: 'center'
                            }}
                              onClick={() => report.nextShiftPlan?.[rowIdx]?.remarks && showRemarksPopup(report.nextShiftPlan[rowIdx].remarks, 'Next Shift Plan - Remarks')}>
                              {report.nextShiftPlan?.[rowIdx]?.remarks || '-'}
                            </td>
                          </>
                        )}
                        {showSections.delays && (
                          <>
                            <td style={{ background: '#fff9fb', padding: '10px 16px', textAlign: 'center' }}>{report.delays?.[rowIdx]?.delays || '-'}</td>
                            <td style={{ background: '#fff9fb', padding: '10px 16px', textAlign: 'center' }}>{report.delays?.[rowIdx]?.durationMinutes || '-'}</td>
                            <td style={{ background: '#fff9fb', padding: '10px 16px', textAlign: 'center' }}>{report.delays?.[rowIdx]?.durationTime || '-'}</td>
                          </>
                        )}
                        {showSections.mouldHardness && (
                          <>
                            <td style={{ background: '#fbf8fc', padding: '10px 16px', textAlign: 'center' }}>{report.mouldHardness?.[rowIdx]?.componentName || '-'}</td>
                            <td style={{ background: '#fbf8fc', padding: '10px 16px', textAlign: 'center' }}>{report.mouldHardness?.[rowIdx]?.mpPP || '-'}</td>
                            <td style={{ background: '#fbf8fc', padding: '10px 16px', textAlign: 'center' }}>{report.mouldHardness?.[rowIdx]?.mpSP || '-'}</td>
                            <td style={{ background: '#fbf8fc', padding: '10px 16px', textAlign: 'center' }}>{report.mouldHardness?.[rowIdx]?.bsPP || '-'}</td>
                            <td style={{ background: '#fbf8fc', padding: '10px 16px', textAlign: 'center' }}>{report.mouldHardness?.[rowIdx]?.bsSP || '-'}</td>
                            <td style={{ 
                              background: '#fbf8fc', 
                              cursor: report.mouldHardness?.[rowIdx]?.remarks ? 'pointer' : 'default',
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              padding: '10px 16px',
                              textAlign: 'center'
                            }}
                              onClick={() => report.mouldHardness?.[rowIdx]?.remarks && showRemarksPopup(report.mouldHardness[rowIdx].remarks, 'Mould Hardness - Remarks')}>
                              {report.mouldHardness?.[rowIdx]?.remarks || '-'}
                            </td>
                          </>
                        )}
                        {showSections.patternTemperature && (
                          <>
                            <td style={{ background: '#f7fcf8', padding: '10px 16px', textAlign: 'center' }}>{report.patternTemperature?.[rowIdx]?.item || '-'}</td>
                            <td style={{ background: '#f7fcf8', padding: '10px 16px', textAlign: 'center' }}>{report.patternTemperature?.[rowIdx]?.pp || '-'}</td>
                            <td style={{ background: '#f7fcf8', padding: '10px 16px', textAlign: 'center' }}>{report.patternTemperature?.[rowIdx]?.sp || '-'}</td>
                          </>
                        )}
                        {rowIdx === 0 && (
                          <>
                            <td rowSpan={maxRows} style={{ 
                              maxWidth: '200px',
                              cursor: report.significantEvent ? 'pointer' : 'default',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              padding: '10px 16px',
                              textAlign: 'center'
                            }}
                              onClick={() => report.significantEvent && showRemarksPopup(report.significantEvent, 'Significant Event')}>
                              {report.significantEvent || '-'}
                            </td>
                            <td rowSpan={maxRows} style={{ 
                              maxWidth: '200px',
                              cursor: report.maintenance ? 'pointer' : 'default',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              padding: '10px 16px',
                              textAlign: 'center'
                            }}
                              onClick={() => report.maintenance && showRemarksPopup(report.maintenance, 'Maintenance')}>
                              {report.maintenance || '-'}
                            </td>
                            <td rowSpan={maxRows} style={{ 
                              maxWidth: '150px',
                              cursor: report.supervisorName ? 'pointer' : 'default',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              padding: '10px 16px',
                              textAlign: 'center'
                            }}
                              onClick={() => report.supervisorName && showRemarksPopup(report.supervisorName, 'Supervisor Name')}>
                              {report.supervisorName || '-'}
                            </td>
                            <td rowSpan={maxRows} style={{ minWidth: '120px', padding: '10px 16px', textAlign: 'center' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <div className="disamatic-form-group">
                    <label>Significant Event</label>
                    <input 
                      type="text" 
                      value={editFormData.significantEvent} 
                      onChange={(e) => handleEditChange('significantEvent', e.target.value)}
                    />
                  </div>
                  <div className="disamatic-form-group">
                    <label>Maintenance</label>
                    <input 
                      type="text" 
                      value={editFormData.maintenance} 
                      onChange={(e) => handleEditChange('maintenance', e.target.value)}
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
