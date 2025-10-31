import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/MeltingLogSheetReport.css';

const MeltingLogSheetReport = () => {
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
      const data = await api.get('/v1/melting-logs');
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching melting logs:', error);
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
      grade: item.grade || '',
      ...item
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/melting-logs/${editingItem._id}`, editFormData);
      if (data.success) {
        alert('Melting log entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating melting log:', error);
      alert('Failed to update entry: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const data = await api.delete(`/v1/melting-logs/${id}`);
      if (data.success) {
        alert('Melting log entry deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting melting log:', error);
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
    <div className="melting-log-wrapper">
      {/* Report Container */}
      <div className="melting-log-report-container">
        <div className="melting-log-report-title">
          <Filter size={20} style={{ color: '#FF7F50' }} />
          <h3>Melting Log Sheet - Report</h3>
        </div>

        <div className="melting-log-filter-grid">
          <div className="melting-log-filter-group">
            <label>Start Date</label>
            <DatePicker
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Select start date"
            />
          </div>

          <div className="melting-log-filter-group">
            <label>End Date</label>
            <DatePicker
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Select end date"
            />
          </div>

          <div className="melting-log-filter-btn-container">
            <Button onClick={handleFilter} className="melting-log-filter-btn" type="button">
              <Filter size={18} />
              Filter
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="melting-log-loader-container">
            <Loader />
          </div>
        ) : (
          <div className="melting-log-table-container table-wrapper">
            <table className="melting-log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Heat No</th>
                  <th>Grade</th>
                  <th>Charging Time</th>
                  <th>Lab Coin Temp</th>
                  <th>Tapping Time</th>
                  <th>Metal Ready Time</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="melting-log-no-records">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.heatNo}</td>
                      <td>{item.grade}</td>
                      <td>{item.chargingTime}</td>
                      <td>{item.labCoinTemp || '-'}</td>
                      <td>{item.tappingTime || '-'}</td>
                      <td>{item.metalReadyTime || '-'}</td>
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
              <h2>Edit Melting Log Entry</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="melting-log-form-grid">
                <div className="melting-log-form-group">
                  <label>Date *</label>
                  <DatePicker name="date" value={editFormData.date} onChange={handleEditChange} />
                </div>
                <div className="melting-log-form-group">
                  <label>Heat No *</label>
                  <input type="text" name="heatNo" value={editFormData.heatNo} onChange={handleEditChange} />
                </div>
                <div className="melting-log-form-group">
                  <label>Grade *</label>
                  <input type="text" name="grade" value={editFormData.grade} onChange={handleEditChange} />
                </div>
                <div className="melting-log-form-group">
                  <label>Charging Time *</label>
                  <input type="time" name="chargingTime" value={editFormData.chargingTime} onChange={handleEditChange} />
                </div>
                <div className="melting-log-form-group" style={{ gridColumn: '1 / -1' }}>
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

export default MeltingLogSheetReport;
