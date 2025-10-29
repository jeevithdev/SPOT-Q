import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import ValidationPopup from '../Components/ValidationPopup';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/Impact.css';

const Impact = () => {
  const [formData, setFormData] = useState({
    dateOfInspection: '',
    partName: '',
    dateCode: '',
    specification: '',
    observedValue: '',
    remarks: ''
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const required = ['dateOfInspection', 'partName', 'dateCode', 
                     'specification', 'observedValue'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFields(true);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/impact-tests', formData);
      
      if (data.success) {
        alert('Impact test entry created successfully!');
        setFormData({
          dateOfInspection: '', partName: '', dateCode: '', 
          specification: '', observedValue: '', remarks: ''
        });
        fetchItems();
      }
    } catch (error) {
      console.error('Error creating impact test:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
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
        alert('Impact test entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating impact test:', error);
      alert('Failed to update entry: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    try {
      const data = await api.delete(`/v1/impact-tests/${id}`);
      
      if (data.success) {
        alert('Impact test entry deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting impact test:', error);
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
      const itemDate = new Date(item.dateOfInspection);
      return itemDate >= start && itemDate <= end;
    });
    
    setFilteredItems(filtered);
  };

  const handleReset = () => {
    setFormData({
      dateOfInspection: '', partName: '', dateCode: '', 
      specification: '', observedValue: '', remarks: ''
    });
  };

  return (
    <div className="page-container impact-container" style={{ background: 'transparent' }}>
      <div className="impact-wrapper" style={{ background: 'transparent' }}>
        {showMissingFields && (
          <ValidationPopup
            missingFields={missingFields}
            onClose={() => setShowMissingFields(false)}
          />
        )}

        {/* Entry Form Container */}
        <div className="impact-entry-container" style={{ background: 'transparent' }}>
          <div className="impact-header">
            <div className="impact-header-text">
              <h2>
                <Save size={28} style={{ color: '#5B9AA9' }} />
                Impact Test - Entry Form
              </h2>
              <p>Record impact test measurements and specifications</p>
            </div>
            <Button onClick={handleReset} className="impact-reset-btn" variant="secondary">
              <RefreshCw size={18} />
              Reset
            </Button>
          </div>

          <div className="impact-form-grid">
            <div className="impact-form-group">
              <label>Date of Inspection *</label>
              <DatePicker
                name="dateOfInspection"
                value={formData.dateOfInspection}
                onChange={handleChange}
              />
            </div>

            <div className="impact-form-group">
              <label>Part Name *</label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                placeholder="e.g: Crankshaft"
              />
            </div>

            <div className="impact-form-group">
              <label>Date Code *</label>
              <input
                type="text"
                name="dateCode"
                value={formData.dateCode}
                onChange={handleChange}
                placeholder="e.g: DC-2024-101"
              />
            </div>

            <div className="impact-form-group">
              <label>Specification *</label>
              <input
                type="text"
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                placeholder="e.g: 60 J/cm2 (min)"
              />
            </div>

            <div className="impact-form-group">
              <label>Observed Value *</label>
              <input
                type="number"
                name="observedValue"
                value={formData.observedValue}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g: 92,96"
              />
            </div>

            <div className="impact-form-group full-width">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                placeholder="Enter any additional notes or observations..."
              />
            </div>
          </div>

          <div className="impact-submit-container">
            <Button onClick={handleSubmit} disabled={submitLoading} className="impact-submit-btn" type="button">
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </Button>
          </div>
        </div>

        {/* Report Container */}
        <div className="impact-report-container" style={{ background: 'transparent' }}>
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
              <Loader />
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
                      <td colSpan="9" className="impact-no-records">
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
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Date Code *</label>
                    <input
                      type="text"
                      name="dateCode"
                      value={editFormData.dateCode}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Specification *</label>
                    <input
                      type="text"
                      name="specification"
                      value={editFormData.specification}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Observed Value *</label>
                    <input
                      type="number"
                      name="observedValue"
                      value={editFormData.observedValue}
                      onChange={handleEditChange}
                      step="0.1"
                    />
                  </div>

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

export default Impact;