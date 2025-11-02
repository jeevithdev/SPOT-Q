import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw, X, Loader2 } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import api from '../utils/api';
import '../styles/PageStyles/ImpactReport.css';

const ImpactReport = () => {
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
      const data = await api.get('/v1/impact-tests');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching impact tests:', error);
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
      dateOfInspection: item.dateOfInspection ? new Date(item.dateOfInspection).toISOString().split('T')[0] : '',
      partName: item.partName || '',
      dateCode: item.dateCode || '',
      specification: item.specification || '',
      observedValue: item.observedValue || '',
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/impact-tests/${editingItem._id}`, editFormData);
      
      if (data.success) {
        setShowEditModal(false);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating impact test:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const data = await api.delete(`/v1/impact-tests/${id}`);
        
        if (data.success) {
          fetchItems();
        }
      } catch (error) {
        console.error('Error deleting impact test:', error);
      }
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => {
      const itemDate = new Date(item.dateOfInspection);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return itemDate >= start && itemDate <= end;
    });

    setFilteredItems(filtered);
  };

  return (
    <div className="impact-container">
      <div className="impact-wrapper">

        {/* Report Container */}
        <div className="impact-report-container">
          <h3 className="impact-report-title">
            <Filter size={28} style={{ color: '#FF7F50' }} />
            Impact Test - Report Card
          </h3>

          <div className="impact-filter-grid">
            <div className="impact-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="impact-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="impact-filter-btn-container">
              <Button onClick={handleFilter} className="impact-filter-btn" type="button">
                <Filter size={18} />
                Filter
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="impact-loader-container">
              <Loader2 size={40} className="animate-spin" />
            </div>
          ) : (
            <div className="impact-table-container">
              <table className="impact-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Part Name</th>
                    <th>Date Code</th>
                    <th>Specification</th>
                    <th>Observed Value</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="impact-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{new Date(item.dateOfInspection).toLocaleDateString()}</td>
                        <td>{item.partName}</td>
                        <td>{item.dateCode}</td>
                        <td>{item.specification}</td>
                        <td>{item.observedValue}</td>
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
                <h2>Edit Impact Test Entry</h2>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="impact-form-grid">
                  <div className="impact-form-group">
                    <label>Date of Inspection *</label>
                    <DatePicker
                      name="dateOfInspection"
                      value={editFormData.dateOfInspection}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Part Name *</label>
                    <input
                      type="text"
                      name="partName"
                      value={editFormData.partName}
                      onChange={handleEditChange}
                      placeholder="e.g: Engine Block"
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Date Code *</label>
                    <input
                      type="text"
                      name="dateCode"
                      value={editFormData.dateCode}
                      onChange={handleEditChange}
                      placeholder="e.g: 2024-DC-001"
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Specification *</label>
                    <input
                      type="text"
                      name="specification"
                      value={editFormData.specification}
                      onChange={handleEditChange}
                      placeholder="e.g: ASTM E23"
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Observed Value *</label>
                    <input
                      type="number"
                      name="observedValue"
                      value={editFormData.observedValue}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  {/* Energy, Temperature, Specimen Type and Heat Code fields removed per request */}

                  <div className="impact-form-group full-width">
                    <label>Remarks</label>
                    <textarea
                      name="remarks"
                      value={editFormData.remarks}
                      onChange={handleEditChange}
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="modal-cancel-btn" 
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button 
                  className="modal-submit-btn" 
                  onClick={handleUpdate}
                  disabled={editLoading}
                >
                  {editLoading ? 'Updating...' : 'Update Entry'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactReport;