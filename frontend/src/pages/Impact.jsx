import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw, X } from 'lucide-react';
import { DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import ValidationPopup from '../Components/ValidationPopup';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/Impact.css';

const Impact = () => {
  const [formData, setFormData] = useState({
    dateOfInspection: '',
    partName: '',
    dateCode: '',
    heatCode: '',
    specimenType: '',
    temp: '',
    energy: '',
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
    const required = ['dateOfInspection', 'partName', 'dateCode', 'heatCode', 
                     'specimenType', 'temp', 'energy'];
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
          dateOfInspection: '', partName: '', dateCode: '', heatCode: '',
          specimenType: '', temp: '', energy: '', remarks: ''
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
      heatCode: item.heatCode || '',
      specimenType: item.specimenType || '',
      temp: item.temp || '',
      energy: item.energy || '',
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
      dateOfInspection: '', partName: '', dateCode: '', heatCode: '',
      specimenType: '', temp: '', energy: '', remarks: ''
    });
  };

  return (
    <div className="page-container impact-container">
      <div className="impact-wrapper">
        {showMissingFields && (
          <ValidationPopup
            missingFields={missingFields}
            onClose={() => setShowMissingFields(false)}
          />
        )}

        {/* Entry Form Container */}
        <div className="impact-entry-container">
          <div className="impact-header">
            <div className="impact-header-text">
              <h2>
                <Save size={28} style={{ color: '#5B9AA9' }} />
                Impact Test - Entry Form
              </h2>
              <p>Record impact test measurements and specifications</p>
            </div>
            <button onClick={handleReset} className="impact-reset-btn">
              <RefreshCw size={18} />
              Reset
            </button>
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
              <label>Heat Code *</label>
              <input
                type="text"
                name="heatCode"
                value={formData.heatCode}
                onChange={handleChange}
                placeholder="e.g: HC-2024-501"
              />
            </div>

            <div className="impact-form-group">
              <label>Specimen Type *</label>
              <input
                type="text"
                name="specimenType"
                value={formData.specimenType}
                onChange={handleChange}
                placeholder="e.g: Charpy V-Notch"
              />
            </div>

            <div className="impact-form-group">
              <label>Temperature (°C) *</label>
              <input
                type="number"
                name="temp"
                value={formData.temp}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g: 25.5"
              />
            </div>

            <div className="impact-form-group">
              <label>Energy (J) *</label>
              <input
                type="number"
                name="energy"
                value={formData.energy}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g: 45.0"
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
            <button onClick={handleSubmit} disabled={submitLoading} className="impact-submit-btn">
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </button>
          </div>
        </div>

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
              <button onClick={handleFilter} className="impact-filter-btn">
                <Filter size={18} />
                Filter
              </button>
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
                    <th>Heat Code</th>
                    <th>Specimen Type</th>
                    <th>Temp (°C)</th>
                    <th>Energy (J)</th>
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
                        <td>{item.heatCode}</td>
                        <td>{item.specimenType}</td>
                        <td>{item.temp}</td>
                        <td>{item.energy}</td>
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
                    <label>Heat Code *</label>
                    <input
                      type="text"
                      name="heatCode"
                      value={editFormData.heatCode}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Specimen Type *</label>
                    <input
                      type="text"
                      name="specimenType"
                      value={editFormData.specimenType}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Temperature (°C) *</label>
                    <input
                      type="number"
                      name="temp"
                      value={editFormData.temp}
                      onChange={handleEditChange}
                      step="0.1"
                    />
                  </div>

                  <div className="impact-form-group">
                    <label>Energy (J) *</label>
                    <input
                      type="number"
                      name="energy"
                      value={editFormData.energy}
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
