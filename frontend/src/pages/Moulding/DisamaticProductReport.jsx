import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Trash2, Edit, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { DatePicker, FilterButton, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Moulding/DisamaticProductReport.css';

const DisamaticProductReport = () => {
  // Format a date to YYYY-MM-DD using local timezone (avoids UTC shift)
  const formatInputDateLocal = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShift, setSelectedShift] = useState('All');
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
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
  const [collapsedSections, setCollapsedSections] = useState({
    productionDetails: false,
    nextShiftPlan: false,
    delays: false,
    mouldHardness: false,
    patternTemperature: false
  });
  const [remarksModal, setRemarksModal] = useState({ show: false, content: '', title: 'Remarks' });

  const toggleSection = (section) => {
    setShowSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCollapse = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
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
      const data = await api.get('/dismatic-reports');
      if (data.success && data.data && data.data.length > 0) {
        setReports(data.data || []);
        
        // Get the latest/last entered date
        const sortedReports = [...data.data].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestDate = sortedReports[0].date;

        setSelectedDate(latestDate ? formatInputDateLocal(latestDate) : null);
        filterReportByDateAndShift(latestDate ? formatInputDateLocal(latestDate) : null, 'All', data.data);
      }
    } catch (err) {
      console.error('Failed to fetch disamatic reports', err);
    } finally {
      setLoading(false);
    }
  };

  const filterReportByDateAndShift = (date, shift, reportsData = reports) => {
    if (!date) {
      setCurrentReport(null);
      return;
    }
    
    const report = reportsData.find(r => {
      if (!r.date) return false;
      const reportDate = formatInputDateLocal(r.date);
      const dateMatch = reportDate === date;
      
      // If specific shift is selected, check if it matches
      if (shift !== 'All') {
        return dateMatch && r.shift === shift;
      }
      return dateMatch;
    });

    setCurrentReport(report || null);
  };

  const handleFilter = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    filterReportByDateAndShift(selectedDate, selectedShift);
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Delete this entire report and all its data?')) return;
    try {
      const res = await api.delete(`/dismatic-reports/${id}`);
      if (res.success) {
        alert('Report deleted successfully');
        fetchReports();
      }
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete report: ' + (err.message || 'Unknown error'));
    }
  };

  // Filter section data by shift
  const filterDataByShift = (dataArray) => {
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) return [];
    if (selectedShift === 'All') return dataArray;
    
    // Since shift is stored at report level, all data belongs to that shift
    return dataArray;
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
      
      const res = await api.put(`/dismatic-reports/${editingReport._id}`, payload);
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
    <div className="page-wrapper">
      <div className="impact-report-header">
        <div className="impact-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Disamatic Product - Report
          </h2>
        </div>
      </div>

      {/* Filter Section */}
      <div className="impact-filter-container" style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        marginBottom: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div className="impact-filter-group">
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Select Date</label>
            <DatePicker 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              placeholder="Select date" 
            />
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
          <FilterButton onClick={handleFilter} disabled={!selectedDate}>Apply Filter</FilterButton>
        </div>

        {/* Section Filter Dropdown */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', position: 'relative' }}>
          <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block', color: '#334155' }}>Show Sections</label>
          <div style={{ position: 'relative', minWidth: '250px', maxWidth: '400px' }}>
            <button
              onClick={() => setShowSectionDropdown(!showSectionDropdown)}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{Object.values(showSections).filter(v => v).length} sections selected</span>
              <span>{showSectionDropdown ? '▲' : '▼'}</span>
            </button>
            
            {showSectionDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.25rem',
                background: 'white',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1000,
                padding: '0.5rem'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <input 
                    type="checkbox" 
                    checked={showSections.productionDetails} 
                    onChange={() => toggleSection('productionDetails')}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Production Details</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <input 
                    type="checkbox" 
                    checked={showSections.nextShiftPlan} 
                    onChange={() => toggleSection('nextShiftPlan')}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Next Shift Plan</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <input 
                    type="checkbox" 
                    checked={showSections.delays} 
                    onChange={() => toggleSection('delays')}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Delays</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <input 
                    type="checkbox" 
                    checked={showSections.mouldHardness} 
                    onChange={() => toggleSection('mouldHardness')}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Mould Hardness</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <input 
                    type="checkbox" 
                    checked={showSections.patternTemperature} 
                    onChange={() => toggleSection('patternTemperature')}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Pattern Temperature</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="impact-loader-container"><Loader /></div>
      ) : !currentReport ? (
        <div className="impact-details-card">
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>No data found for the selected date and shift</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Please select a different date or shift</p>
          </div>
        </div>
      ) : (
        <>
          {/* Primary Information & Event Information - Non-table Format */}
          <div className="impact-details-card" style={{ marginBottom: '1rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #5B9AA9 0%, #4a7d8a 100%)', 
              padding: '1.5rem',
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                Report Information
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleEditClick(currentReport)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteReport(currentReport._id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(239,68,68,0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Primary Info Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '2px solid #e2e8f0'
              }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}>
                    {currentReport.date ? new Date(currentReport.date).toLocaleDateString('en-GB') : '-'}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shift</label>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}>
                    {currentReport.shift || '-'}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Incharge</label>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}>
                    {currentReport.incharge || '-'}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PP Operator</label>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}>
                    {currentReport.ppOperator || '-'}
                  </p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Members Present</label>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}>
                    {currentReport.memberspresent || '-'}
                  </p>
                </div>
              </div>

              {/* Event Information Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1.5rem'
              }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Significant Event</label>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9375rem', color: '#334155', lineHeight: '1.6' }}>
                    {currentReport.significantEvent || '-'}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Maintenance</label>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9375rem', color: '#334155', lineHeight: '1.6' }}>
                    {currentReport.maintenance || '-'}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supervisor Name</label>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9375rem', color: '#334155', lineHeight: '1.6' }}>
                    {currentReport.supervisorName || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Production Details Section */}
          {showSections.productionDetails && currentReport.productionDetails && currentReport.productionDetails.length > 0 && (
            <div className="impact-details-card" style={{ marginBottom: '1rem' }}>
              <div style={{
                background: '#f8fafc',
                padding: '1rem 1.5rem',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '2px solid #e2e8f0'
              }}
                onClick={() => toggleCollapse('productionDetails')}
              >
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
                  Production Details ({filterDataByShift(currentReport.productionDetails).length} entries)
                </h3>
                {collapsedSections.productionDetails ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </div>
              {!collapsedSections.productionDetails && (
                <div className="impact-table-container">
                  <table className="impact-table">
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>S.No</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Counter No</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Component Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Produced</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Poured</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Cycle Time</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Moulds/Hr</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterDataByShift(currentReport.productionDetails).map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '10px 16px', textAlign: 'center', background: '#f8fafc', fontWeight: 500 }}>{idx + 1}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.counterNo || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.componentName || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.produced || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.poured || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.cycleTime || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.mouldsPerHour || '-'}</td>
                          <td style={{ 
                            padding: '10px 16px', 
                            textAlign: 'center',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: item.remarks ? 'pointer' : 'default'
                          }}
                            onClick={() => item.remarks && showRemarksPopup(item.remarks, 'Production Remarks')}>
                            {item.remarks || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Next Shift Plan Section */}
          {showSections.nextShiftPlan && currentReport.nextShiftPlan && currentReport.nextShiftPlan.length > 0 && (
            <div className="impact-details-card" style={{ marginBottom: '1rem' }}>
              <div style={{
                background: '#f8fafc',
                padding: '1rem 1.5rem',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '2px solid #e2e8f0'
              }}
                onClick={() => toggleCollapse('nextShiftPlan')}
              >
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
                  Next Shift Plan ({filterDataByShift(currentReport.nextShiftPlan).length} entries)
                </h3>
                {collapsedSections.nextShiftPlan ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </div>
              {!collapsedSections.nextShiftPlan && (
                <div className="impact-table-container">
                  <table className="impact-table">
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>S.No</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Component Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Planned Moulds</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterDataByShift(currentReport.nextShiftPlan).map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '10px 16px', textAlign: 'center', background: '#f8fafc', fontWeight: 500 }}>{idx + 1}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.componentName || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.plannedMoulds || '-'}</td>
                          <td style={{ 
                            padding: '10px 16px', 
                            textAlign: 'center',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: item.remarks ? 'pointer' : 'default'
                          }}
                            onClick={() => item.remarks && showRemarksPopup(item.remarks, 'Next Shift Plan Remarks')}>
                            {item.remarks || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Delays Section */}
          {showSections.delays && currentReport.delays && currentReport.delays.length > 0 && (
            <div className="impact-details-card" style={{ marginBottom: '1rem' }}>
              <div style={{
                background: '#f8fafc',
                padding: '1rem 1.5rem',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '2px solid #e2e8f0'
              }}
                onClick={() => toggleCollapse('delays')}
              >
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
                  Delays ({filterDataByShift(currentReport.delays).length} entries)
                </h3>
                {collapsedSections.delays ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </div>
              {!collapsedSections.delays && (
                <div className="impact-table-container">
                  <table className="impact-table">
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>S.No</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Delays</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Duration (Minutes)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Duration (Time)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterDataByShift(currentReport.delays).map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '10px 16px', textAlign: 'center', background: '#f8fafc', fontWeight: 500 }}>{idx + 1}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.delays || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.durationMinutes || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.durationTime || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Mould Hardness Section */}
          {showSections.mouldHardness && currentReport.mouldHardness && currentReport.mouldHardness.length > 0 && (
            <div className="impact-details-card" style={{ marginBottom: '1rem' }}>
              <div style={{
                background: '#f8fafc',
                padding: '1rem 1.5rem',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '2px solid #e2e8f0'
              }}
                onClick={() => toggleCollapse('mouldHardness')}
              >
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
                  Mould Hardness ({filterDataByShift(currentReport.mouldHardness).length} entries)
                </h3>
                {collapsedSections.mouldHardness ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </div>
              {!collapsedSections.mouldHardness && (
                <div className="impact-table-container">
                  <table className="impact-table">
                    <thead>
                      <tr>
                        <th rowSpan="2" style={{ padding: '12px 16px', textAlign: 'center', verticalAlign: 'middle' }}>S.No</th>
                        <th rowSpan="2" style={{ padding: '12px 16px', textAlign: 'center', verticalAlign: 'middle' }}>Component Name</th>
                        <th colSpan="2" style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Mould Penetrant (N/cm²)</th>
                        <th colSpan="2" style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>B-Scale</th>
                        <th rowSpan="2" style={{ padding: '12px 16px', textAlign: 'center', verticalAlign: 'middle' }}>Remarks</th>
                      </tr>
                      <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>PP</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>SP</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>PP</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>SP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterDataByShift(currentReport.mouldHardness).map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '10px 16px', textAlign: 'center', background: '#f8fafc', fontWeight: 500 }}>{idx + 1}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.componentName || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.mpPP || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.mpSP || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.bsPP || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.bsSP || '-'}</td>
                          <td style={{ 
                            padding: '10px 16px', 
                            textAlign: 'center',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: item.remarks ? 'pointer' : 'default'
                          }}
                            onClick={() => item.remarks && showRemarksPopup(item.remarks, 'Mould Hardness Remarks')}>
                            {item.remarks || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Pattern Temperature Section */}
          {showSections.patternTemperature && currentReport.patternTemperature && currentReport.patternTemperature.length > 0 && (
            <div className="impact-details-card" style={{ marginBottom: '1rem' }}>
              <div style={{
                background: '#f8fafc',
                padding: '1rem 1.5rem',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '2px solid #e2e8f0'
              }}
                onClick={() => toggleCollapse('patternTemperature')}
              >
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
                  Pattern Temperature ({filterDataByShift(currentReport.patternTemperature).length} entries)
                </h3>
                {collapsedSections.patternTemperature ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </div>
              {!collapsedSections.patternTemperature && (
                <div className="impact-table-container">
                  <table className="impact-table">
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>S.No</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Item</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>PP</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>SP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterDataByShift(currentReport.patternTemperature).map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '10px 16px', textAlign: 'center', background: '#f8fafc', fontWeight: 500 }}>{idx + 1}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.item || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.pp || '-'}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>{item.sp || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
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
    </div>
  );
};

export default DisamaticProductReport;
