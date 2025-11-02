import React, { useState, useEffect } from "react";
import { Filter, Edit2, X, Save, Plus, Loader2 } from "lucide-react";
import { FilterButton, DatePicker, DeleteActionButton } from "../../Components/Buttons";
import api from "../../utils/api";
import "../../styles/PageStyles/Moulding/DisamaticProductReport.css";

const DisamaticProductReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    shift: '',
    incharge: '',
    members: ['']
  });
  const [saving, setSaving] = useState(false);

  // Fetch reports on component mount and when filters change
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/dismatic-reports');
      if (response.success) {
        setItems(response.data || []);
        setFilteredItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to load reports: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
      }
      
      const response = await api.get(`/v1/dismatic-reports/range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
      if (response.success) {
        setFilteredItems(response.data || []);
      }
    } catch (error) {
      console.error('Error filtering reports:', error);
      alert('Failed to filter reports: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setStartDate('');
    setEndDate('');
    await fetchReports();
  };

  const handleEditClick = (item) => {
    // Parse members from string to array
    const members = item.memberspresent 
      ? item.memberspresent.split(',').map(m => m.trim()).filter(m => m)
      : [''];
    
    setEditFormData({
      shift: item.shift || '',
      incharge: item.incharge || '',
      members: members.length > 0 ? members : ['']
    });
    setEditingItem(item);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingItem(null);
    setEditFormData({
      shift: '',
      incharge: '',
      members: ['']
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...editFormData.members];
    updatedMembers[index] = value;
    setEditFormData(prev => ({ ...prev, members: updatedMembers }));
  };

  const addMemberField = () => {
    setEditFormData(prev => ({ ...prev, members: [...prev.members, ''] }));
  };

  const removeMemberField = (index) => {
    if (editFormData.members.length > 1) {
      const updatedMembers = editFormData.members.filter((_, i) => i !== index);
      setEditFormData(prev => ({ ...prev, members: updatedMembers }));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !editingItem.date) {
      alert('Invalid item selected');
      return;
    }

    // Validate required fields
    if (!editFormData.shift || !editFormData.incharge) {
      alert('Shift and Incharge are required fields');
      return;
    }

    try {
      setSaving(true);
      const dateStr = editingItem.date instanceof Date 
        ? editingItem.date.toISOString().split('T')[0]
        : (typeof editingItem.date === 'string' ? editingItem.date.split('T')[0] : editingItem.date);

      const response = await api.post('/v1/dismatic-reports', {
        date: dateStr,
        shift: editFormData.shift.trim(),
        incharge: editFormData.incharge.trim(),
        members: editFormData.members.filter(m => m.trim() !== ''),
        section: 'basicInfo'
      });

      if (response.success) {
        alert('Basic information updated successfully!');
        handleCloseModal();
        await fetchReports(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating basic info:', error);
      alert('Failed to update basic information: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await api.delete(`/v1/dismatic-reports/${id}`);
        if (response.success) {
          alert('Record deleted successfully');
          await fetchReports();
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
          <div className="disamatic-loader-container">
            <Loader2 size={40} className="animate-spin" />
          </div>
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
                              <button
                                onClick={() => handleEditClick(item)}
                                className="disamatic-edit-btn"
                                title="Edit Basic Info"
                              >
                                <Edit2 size={16} />
                              </button>
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

      {/* Edit Modal */}
      {editModalOpen && editingItem && (
        <div className="disamatic-edit-modal-overlay" onClick={handleCloseModal}>
          <div className="disamatic-edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="disamatic-edit-modal-header">
              <h3>Edit Basic Information</h3>
              <button className="disamatic-edit-modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="disamatic-edit-modal-body">
              <div className="disamatic-edit-form-group">
                <label>Date</label>
                <input
                  type="text"
                  value={editingItem.date instanceof Date 
                    ? editingItem.date.toISOString().split('T')[0]
                    : (typeof editingItem.date === 'string' ? editingItem.date.split('T')[0] : editingItem.date || '')}
                  disabled
                  className="disamatic-edit-input"
                />
              </div>

              <div className="disamatic-edit-form-group">
                <label>Shift *</label>
                <input
                  type="text"
                  value={editFormData.shift}
                  onChange={(e) => handleEditFormChange('shift', e.target.value)}
                  placeholder="e.g., A, B, C"
                  className="disamatic-edit-input"
                />
              </div>

              <div className="disamatic-edit-form-group">
                <label>Incharge *</label>
                <input
                  type="text"
                  value={editFormData.incharge}
                  onChange={(e) => handleEditFormChange('incharge', e.target.value)}
                  placeholder="Enter incharge name"
                  className="disamatic-edit-input"
                />
              </div>

              <div className="disamatic-edit-form-group">
                <label>Members Present</label>
                <div className="disamatic-edit-members-container">
                  {editFormData.members.map((member, index) => (
                    <div key={index} className="disamatic-edit-member-input-wrapper">
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        placeholder={`Enter member name ${index + 1}`}
                        className="disamatic-edit-member-input"
                      />
                      {editFormData.members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMemberField(index)}
                          className="disamatic-edit-remove-member-btn"
                          title="Remove member"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMemberField}
                    className="disamatic-edit-add-member-btn"
                    title="Add another member"
                  >
                    <Plus size={14} />
                    Add Member
                  </button>
                </div>
              </div>
            </div>

            <div className="disamatic-edit-modal-footer">
              <button
                className="disamatic-edit-cancel-btn"
                onClick={handleCloseModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="disamatic-edit-save-btn"
                onClick={handleSaveEdit}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisamaticProductReport;
