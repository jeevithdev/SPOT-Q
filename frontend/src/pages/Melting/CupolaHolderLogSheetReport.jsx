import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/CupolaHolderLogSheetReport.css';

const CupolaHolderLogSheetReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.get('/v1/cupola-holder-logs');
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching cupola holder logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      heatNo: item.heatNo || '',
      ...item
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/cupola-holder-logs/${editingItem._id}`, editFormData);
      if (data.success) {
        alert('Cupola holder log entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating cupola holder log:', error);
      alert('Failed to update entry: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const data = await api.delete(`/v1/cupola-holder-logs/${id}`);
      if (data.success) {
        alert('Cupola holder log entry deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting cupola holder log:', error);
      alert('Failed to delete entry: ' + error.message);
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredItems(items);
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    setFilteredItems(filtered);
  };

  return (
    <div className="cupola-holder-wrapper">
      {/* Report Container */}
      <div className="cupola-holder-report-container">
        <div className="cupola-holder-report-title">
          <Filter size={20} style={{ color: '#FF7F50' }} />
          <h3>Cupola Holder Log - Report</h3>
        </div>

        <div className="cupola-holder-filter-grid">
          <div className="cupola-holder-filter-group">
            <label>Start Date</label>
            <DatePicker value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Select start date" />
          </div>

          <div className="cupola-holder-filter-group">
            <label>End Date</label>
            <DatePicker value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Select end date" />
          </div>

          <div className="cupola-holder-filter-btn-container">
            <Button onClick={handleFilter} className="cupola-holder-filter-btn" type="button">
              <Filter size={18} />
              Filter
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="cupola-holder-loader-container">
            <Loader />
          </div>
        ) : (
          <div className="cupola-holder-table-container table-wrapper">
            <table className="cupola-holder-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Heat No</th>
                  <th>Tapping Time</th>
                  <th>Tapping Temp</th>
                  <th>Metal (KG)</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="cupola-holder-no-records">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.heatNo}</td>
                      <td>{item.tappingTime || '-'}</td>
                      <td>{item.tappingTemp || '-'}</td>
                      <td>{item.metalKg || '-'}</td>
                      <td>{item.remarks || '-'}</td>
                      <td style={{ minWidth: '100px' }}>
                        <EditActionButton onClick={() => handleEdit(item)} />
                        <DeleteActionButton onClick={() => handleDelete(item._id)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Cupola Holder Log Entry</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="cupola-holder-form-grid">
                <div className="cupola-holder-form-group">
                  <label>Date *</label>
                  <DatePicker name="date" value={editFormData.date} onChange={handleEditChange} />
                </div>
                <div className="cupola-holder-form-group">
                  <label>Heat No *</label>
                  <input type="text" name="heatNo" value={editFormData.heatNo} onChange={handleEditChange} />
                </div>
                <div className="cupola-holder-form-group">
                  <label>Tapping Time</label>
                  <input type="time" name="tappingTime" value={editFormData.tappingTime} onChange={handleEditChange} />
                </div>
                <div className="cupola-holder-form-group">
                  <label>Tapping Temp</label>
                  <input type="number" name="tappingTemp" value={editFormData.tappingTemp} onChange={handleEditChange} />
                </div>
                <div className="cupola-holder-form-group">
                  <label>Metal (KG)</label>
                  <input type="number" name="metalKg" value={editFormData.metalKg} onChange={handleEditChange} />
                </div>
                <div className="cupola-holder-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Remarks</label>
                  <textarea name="remarks" value={editFormData.remarks} onChange={handleEditChange} rows="3" />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={() => setShowEditModal(false)} disabled={editLoading}>
                Cancel
              </button>
              <button className="modal-submit-btn" onClick={handleUpdate} disabled={editLoading}>
                {editLoading ? 'Updating...' : 'Update Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CupolaHolderLogSheetReport;
