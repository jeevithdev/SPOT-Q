import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/MicroStructure.css';

const MicroStructure = () => {
  const [formData, setFormData] = useState({
    insDate: '',
    partName: '',
    dateCodeHeatCode: '',
    nodularityGraphiteType: '',
    countNos: '',
    size: '',
    ferritePercent: '',
    pearlitePercent: '',
    carbidePercent: '',
    remarks: ''
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
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
      const data = await api.get('/v1/micro-structure');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching micro structure reports:', error);
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
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;
    
    // Auto-format single digit numbers with leading zero
    if (type === 'number' && value && !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 9 && !value.includes('.') && value.length === 1) {
      const formattedValue = '0' + value;
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const inputs = Array.from(form.querySelectorAll('input, textarea'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const required = ['insDate', 'partName', 'dateCodeHeatCode', 'nodularityGraphiteType',
                     'countNos', 'size', 'ferritePercent', 'pearlitePercent', 'carbidePercent'];
    const missing = required.filter(field => !formData[field]);
    
    // Set validation errors for missing fields
    const errors = {};
    missing.forEach(field => {
      errors[field] = true;
    });
    setValidationErrors(errors);

    if (missing.length > 0) {
      return;
    }
    
    // Clear validation errors if all fields are valid
    setValidationErrors({});

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/micro-structure', formData);
      
      if (data.success) {
        alert('Micro structure report created successfully!');
        setFormData({
          insDate: '', partName: '', dateCodeHeatCode: '', nodularityGraphiteType: '',
          countNos: '', size: '', ferritePercent: '', pearlitePercent: '', carbidePercent: '', remarks: ''
        });
        fetchItems();
      }
    } catch (error) {
      console.error('Error creating micro structure report:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      insDate: item.insDate ? new Date(item.insDate).toISOString().split('T')[0] : '',
      partName: item.partName || '',
      dateCodeHeatCode: item.dateCodeHeatCode || '',
      nodularityGraphiteType: item.nodularityGraphiteType || '',
      countNos: item.countNos || '',
      size: item.size || '',
      ferritePercent: item.ferritePercent || '',
      pearlitePercent: item.pearlitePercent || '',
      carbidePercent: item.carbidePercent || '',
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/micro-structure/${editingItem._id}`, editFormData);
      
      if (data.success) {
        alert('Micro structure entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating micro structure:', error);
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
      const data = await api.delete(`/v1/micro-structure/${id}`);
      
      if (data.success) {
        alert('Micro structure entry deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting micro structure:', error);
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
      const itemDate = new Date(item.insDate);
      return itemDate >= start && itemDate <= end;
    });
    
    setFilteredItems(filtered);
  };

  const handleReset = () => {
    setFormData({
      insDate: '', partName: '', dateCodeHeatCode: '', nodularityGraphiteType: '',
      countNos: '', size: '', ferritePercent: '', pearlitePercent: '', carbidePercent: '', remarks: ''
    });
    setValidationErrors({});
  };

  return (
    <div className="microstructure-container" style={{ background: 'transparent' }}>
      <div className="microstructure-wrapper" style={{ background: 'transparent' }}>

        {/* Entry Form Container */}
        <div className="microstructure-entry-container" style={{ background: 'transparent' }}>
          <div className="microstructure-header">
            <div className="microstructure-header-text">
              <Save size={24} style={{ color: '#5B9AA9' }} />
              <h2>Micro Structure - Entry Form</h2>
            </div>
            <Button onClick={handleReset} className="microstructure-reset-btn" variant="secondary">
              <RefreshCw size={18} />
              Reset
            </Button>
          </div>

          <form className="microstructure-form-grid">
            <div className="microstructure-form-group">
              <label>Inspection Date *</label>
              <DatePicker
                name="insDate"
                value={formData.insDate}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={validationErrors.insDate ? 'invalid-input' : ''}
              />
            </div>

            <div className="microstructure-form-group">
              <label>Part Name *</label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: Engine Block"
                className={validationErrors.partName ? 'invalid-input' : ''}
              />
            </div>

            <div className="microstructure-form-group">
              <label>Date Code & Heat Code *</label>
              <input
                type="text"
                name="dateCodeHeatCode"
                value={formData.dateCodeHeatCode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 2024-HC-005"
                className={validationErrors.dateCodeHeatCode ? 'invalid-input' : ''}
              />
            </div>

            {/* Micro Structure Section */}
            <div className="section-header">
              <h3>Micro Structure Details </h3>
            </div>
            
            <div className="microstructure-form-group">
              <label>Nodularity % / Graphite Type *</label>
              <input
                type="text"
                name="nodularityGraphiteType"
                value={formData.nodularityGraphiteType}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 85% Type VI"
                className={validationErrors.nodularityGraphiteType ? 'invalid-input' : ''}
              />
            </div>

            <div className="microstructure-form-group">
              <label>Count Nos/mm² *</label>
              <input
                type="number"
                name="countNos"
                value={formData.countNos}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 150"
                className={validationErrors.countNos ? 'invalid-input' : ''}
              />
            </div>

            <div className="microstructure-form-group">
              <label>Size *</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 5-8 µm"
                className={validationErrors.size ? 'invalid-input' : ''}
              />
            </div>

            <div className="microstructure-form-group">
              <label>Ferrite % *</label>
              <input
                type="number"
                name="ferritePercent"
                value={formData.ferritePercent}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 20"
                className={validationErrors.ferritePercent ? 'invalid-input' : ''}
              />
            </div>

            <div className="microstructure-form-group">
              <label>Pearlite % *</label>
              <input
                type="number"
                name="pearlitePercent"
                value={formData.pearlitePercent}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 78"
                className={validationErrors.pearlitePercent ? 'invalid-input' : ''}
              />
            </div>

            <div className="microstructure-form-group">
              <label>Carbide % *</label>
              <input
                type="number"
                name="carbidePercent"
                value={formData.carbidePercent}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 2"
                className={validationErrors.carbidePercent ? 'invalid-input' : ''}
              />
            </div>

            <div className="microstructure-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                rows="3"
                placeholder="Enter any additional notes or observations..."
                className=""
              />
            </div>
          </form>

          <div className="microstructure-submit-container">
            <Button onClick={handleSubmit} disabled={submitLoading} className="microstructure-submit-btn" type="button">
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </Button>
          </div>
        </div>


        {/* Report Container */}
        <div className="microstructure-report-container" style={{ background: 'transparent' }}>
          <div className="microstructure-report-title">
            <Filter size={20} style={{ color: '#FF7F50' }} />
            <h3>Micro Structure - Report Card</h3>
          </div>

          <div className="microstructure-filter-grid">
            <div className="microstructure-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="microstructure-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="microstructure-filter-btn-container">
              <Button onClick={handleFilter} className="microstructure-filter-btn" type="button">
                <Filter size={18} />
                Filter
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="microstructure-loader-container">
              <Loader />
            </div>
          ) : (
            <div className="microstructure-table-container">
              <table className="microstructure-table">
                <thead>
                  <tr>
                    <th>Ins Date</th>
                    <th>Part Name</th>
                    <th>Heat Code</th>
                    <th>Nodularity</th>
                    <th>Count/mm²</th>
                    <th>Size</th>
                    <th>Ferrite %</th>
                    <th>Pearlite %</th>
                    <th>Carbide %</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="microstructure-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{new Date(item.insDate).toLocaleDateString()}</td>
                        <td>{item.partName}</td>
                        <td>{item.dateCodeHeatCode}</td>
                        <td>{item.nodularityGraphiteType}</td>
                        <td>{item.countNos}</td>
                        <td>{item.size}</td>
                        <td>{item.ferritePercent}</td>
                        <td>{item.pearlitePercent}</td>
                        <td>{item.carbidePercent}</td>
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
                <h2>Edit Micro Structure Entry</h2>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="microstructure-form-grid">
                  <div className="microstructure-form-group">
                    <label>Inspection Date *</label>
                    <DatePicker name="insDate" value={editFormData.insDate} onChange={handleEditChange} />
                  </div>
                  <div className="microstructure-form-group">
                    <label>Part Name *</label>
                    <input type="text" name="partName" value={editFormData.partName} onChange={handleEditChange} />
                  </div>
                  <div className="microstructure-form-group">
                    <label>Date Code & Heat Code *</label>
                    <input type="text" name="dateCodeHeatCode" value={editFormData.dateCodeHeatCode} onChange={handleEditChange} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>Micro Structure Details</h4>
                  </div>
                  <div className="microstructure-form-group">
                    <label>Nodularity % / Graphite Type *</label>
                    <input type="text" name="nodularityGraphiteType" value={editFormData.nodularityGraphiteType} onChange={handleEditChange} />
                  </div>
                  <div className="microstructure-form-group">
                    <label>Count Nos/mm² *</label>
                    <input type="number" name="countNos" value={editFormData.countNos} onChange={handleEditChange} />
                  </div>
                  <div className="microstructure-form-group">
                    <label>Size *</label>
                    <input type="text" name="size" value={editFormData.size} onChange={handleEditChange} />
                  </div>
                  <div className="microstructure-form-group">
                    <label>Ferrite % *</label>
                    <input type="number" name="ferritePercent" value={editFormData.ferritePercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microstructure-form-group">
                    <label>Pearlite % *</label>
                    <input type="number" name="pearlitePercent" value={editFormData.pearlitePercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microstructure-form-group">
                    <label>Carbide % *</label>
                    <input type="number" name="carbidePercent" value={editFormData.carbidePercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microstructure-form-group" style={{ gridColumn: '1 / -1' }}>
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
    </div>
  );
};

export default MicroStructure;