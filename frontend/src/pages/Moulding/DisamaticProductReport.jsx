import React, { useState, useEffect } from "react";
import { Filter, Edit2, X, Save, Plus, Loader2 } from "lucide-react";
import { FilterButton, DatePicker } from "../../Components/Buttons";
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

  return (
    <div className="disamatic-report-container">
      <div className="disamatic-report-content">
        {/* Header */}
        <div className="disamatic-report-header">
          <div className="disamatic-report-header-text">
            <Filter size={24} />
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
          </div>
          <div className="disamatic-filter-actions">
            <FilterButton onClick={handleFilter}>
              Apply Filter
            </FilterButton>
          </div>
        </div>

        {/* Table Section */}
        <div className="disamatic-table-container">
          <div className="disamatic-table-wrapper">
            <table className="disamatic-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Shift</th>
                  <th>Incharge</th>
                  <th>Total Production</th>
                  <th>Components</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="disamatic-no-data">
                      <Loader2 size={24} className="animate-spin" style={{ display: 'inline-block', margin: '20px' }} />
                      Loading reports...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="disamatic-no-data">
                      No records found. Submit entries to see them here.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => {
                    const dateStr = item.date instanceof Date 
                      ? item.date.toISOString().split('T')[0]
                      : (typeof item.date === 'string' ? item.date.split('T')[0] : item.date || 'N/A');
                    
                    const totalProduced = item.productionDetails && Array.isArray(item.productionDetails)
                      ? item.productionDetails.reduce((sum, prod) => sum + (parseFloat(prod.produced) || 0), 0)
                      : 0;

                    const componentCount = item.productionDetails && Array.isArray(item.productionDetails)
                      ? item.productionDetails.filter(p => p.componentName).length
                      : 0;

                    return (
                      <tr key={item._id || index}>
                        <td>{dateStr}</td>
                        <td>{item.shift || '-'}</td>
                        <td>{item.incharge || '-'}</td>
                        <td>{totalProduced}</td>
                        <td>{componentCount}</td>
                        <td className="disamatic-table-actions">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="disamatic-edit-btn"
                            title="Edit Basic Info"
                          >
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
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
