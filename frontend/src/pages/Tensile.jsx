import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/Tensile.css';

const Tensile = () => {
  const [formData, setFormData] = useState({
    dateOfInspection: '',
    item: '',
    dateHeatCode: '',
    dia: '',
    lo: '',
    li: '',
    breakingLoad: '',
    yieldLoad: '',
    uts: '',
    ys: '',
    elongation: '',
    testedBy: '',
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
      const data = await api.get('/v1/tensile-tests');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tensile tests:', error);
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
    const required = ['dateOfInspection', 'item', 'dateHeatCode', 'dia', 'lo', 'li', 
                     'breakingLoad', 'yieldLoad', 'uts', 'ys', 'elongation', 'testedBy' ];
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
      const data = await api.post('/v1/tensile-tests', formData);
      
      if (data.success) {
        alert('Tensile test entry created successfully!');
        setFormData({
          dateOfInspection: '', item: '', dateHeatCode: '', dia: '', lo: '', li: '',
          breakingLoad: '', yieldLoad: '', uts: '', ys: '', elongation: '', testedBy: '', remarks: ''
        });
        fetchItems();
      }
    } catch (error) {
      console.error('Error creating tensile test:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      dateOfInspection: item.dateOfInspection ? new Date(item.dateOfInspection).toISOString().split('T')[0] : '',
      item: item.item || '',
      dateHeatCode: item.dateHeatCode || '',
      dia: item.dia || '',
      lo: item.lo || '',
      li: item.li || '',
      breakingLoad: item.breakingLoad || '',
      yieldLoad: item.yieldLoad || '',
      uts: item.uts || '',
      ys: item.ys || '',
      elongation: item.elongation || '',
      testedBy: item.testedBy || '',
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/tensile-tests/${editingItem._id}`, editFormData);
      
      if (data.success) {
        alert('Tensile test entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating tensile test:', error);
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
      const data = await api.delete(`/v1/tensile-tests/${id}`);
      
      if (data.success) {
        alert('Tensile test entry deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting tensile test:', error);
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
      dateOfInspection: '', item: '', dateHeatCode: '', dia: '', lo: '', li: '',
      breakingLoad: '', yieldLoad: '', uts: '', ys: '', elongation: '', testedBy: '', remarks: ''
    });
    setValidationErrors({});
  };

  return (
    <div className="tensile-container">
      <div className="tensile-wrapper">

        {/* Entry Form Container */}
        <div className="tensile-entry-container">
          <div className="tensile-header">
            <div className="tensile-header-text">
              <h2>
                <Save size={28} style={{ color: '#5B9AA9' }} />
                Tensile Test - Entry Form
              </h2>
              <p>Record tensile test measurements and analysis</p>
            </div>
            <Button onClick={handleReset} className="tensile-reset-btn" variant="secondary">
              <RefreshCw size={18} />
              Reset
            </Button>
          </div>

          {/* Entry Form */}
          <div className="tensile-card">
          <form className="tensile-form-grid">
            <div className="tensile-form-group">
              <label>Date of Inspection *</label>
              <DatePicker
                name="dateOfInspection"
                value={formData.dateOfInspection}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={validationErrors.dateOfInspection ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>Item *</label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: Steel Rod"
                className={validationErrors.item ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>Date & Heat Code *</label>
              <input
                type="text"
                name="dateHeatCode"
                value={formData.dateHeatCode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 2024-HC-001"
                className={validationErrors.dateHeatCode ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>Dia (mm) *</label>
              <input
                type="number"
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 10.5"
                className={validationErrors.dia ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>Lo (mm) *</label>
              <input
                type="number"
                name="lo"
                value={formData.lo}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 50.0"
                className={validationErrors.lo ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>Li (mm) *</label>
              <input
                type="number"
                name="li"
                value={formData.li}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 52.5"
                className={validationErrors.li ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>Breaking Load (kN) *</label>
              <input
                type="number"
                name="breakingLoad"
                value={formData.breakingLoad}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 45.5"
                className={validationErrors.breakingLoad ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>Yield Load *</label>
              <input
                type="number"
                name="yieldLoad"
                value={formData.yieldLoad}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 38.2"
                className={validationErrors.yieldLoad ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>UTS (N/mm²) *</label>
              <input
                type="number"
                name="uts"
                value={formData.uts}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 550"
                className={validationErrors.uts ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>YS (N/mm²) *</label>
              <input
                type="number"
                name="ys"
                value={formData.ys}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 460"
                className={validationErrors.ys ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>Elongation (%) *</label>
              <input
                type="number"
                name="elongation"
                value={formData.elongation}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.01"
                placeholder="e.g: 18.5"
                className={validationErrors.elongation ? 'invalid-input' : ''}
              />
            </div>

             <div className="tensile-form-group">
              <label>TestedBy *</label>
              <input
                type="text"
                name="testedBy"
                value={formData.testedBy}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: John Doe"
                className={validationErrors.testedBy ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group full-width">
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

          <div className="tensile-submit-container">
            <Button onClick={handleSubmit} disabled={submitLoading} className="tensile-submit-btn" type="button">
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </Button>
          </div>
        </div>
        </div>

        {/* Report Container */}
        <div className="tensile-report-container">
          <h3 className="tensile-report-title">
            <Filter size={28} style={{ color: '#FF7F50' }} />
            Tensile Test - Report Card
          </h3>

          <div className="tensile-filter-grid">
            <div className="tensile-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="tensile-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="tensile-filter-btn-container">
              <Button onClick={handleFilter} className="tensile-filter-btn" type="button">
                <Filter size={18} />
                Filter
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="tensile-loader-container">
              <Loader />
            </div>
          ) : (
            <div className="tensile-table-container">
              <table className="tensile-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Heat Code</th>
                    <th>Dia(mm)</th>
                    <th>Lo(mm)</th>
                    <th>Li(mm)</th>
                    <th>Break Load</th>
                    <th>Yield Load</th>
                    <th>UTS</th>
                    <th>YS</th>
                    <th>Elongation</th>
                    <th>TestedBy</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="tensile-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{new Date(item.dateOfInspection).toLocaleDateString()}</td>
                        <td>{item.item}</td>
                        <td>{item.dateHeatCode}</td>
                        <td>{item.dia}</td>
                        <td>{item.lo}</td>
                        <td>{item.li}</td>
                        <td>{item.breakingLoad}</td>
                        <td>{item.yieldLoad}</td>
                        <td>{item.uts}</td>
                        <td>{item.ys}</td>
                        <td>{item.elongation}</td>
                        <td>{item.testedBy}</td>
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
                <h2>Edit Tensile Test Entry</h2>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="tensile-form-grid">
                  <div className="tensile-form-group">
                    <label>Date of Inspection *</label>
                    <DatePicker
                      name="dateOfInspection"
                      value={editFormData.dateOfInspection}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>Item *</label>
                    <input
                      type="text"
                      name="item"
                      value={editFormData.item}
                      onChange={handleEditChange}
                      placeholder="e.g: Steel Rod"
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>Date & Heat Code *</label>
                    <input
                      type="text"
                      name="dateHeatCode"
                      value={editFormData.dateHeatCode}
                      onChange={handleEditChange}
                      placeholder="e.g: 2024-HC-001"
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>Dia (mm) *</label>
                    <input
                      type="number"
                      name="dia"
                      value={editFormData.dia}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>Lo (mm) *</label>
                    <input
                      type="number"
                      name="lo"
                      value={editFormData.lo}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>Li (mm) *</label>
                    <input
                      type="number"
                      name="li"
                      value={editFormData.li}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>Breaking Load (kN) *</label>
                    <input
                      type="number"
                      name="breakingLoad"
                      value={editFormData.breakingLoad}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>Yield Load *</label>
                    <input
                      type="number"
                      name="yieldLoad"
                      value={editFormData.yieldLoad}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>UTS (N/mm²) *</label>
                    <input
                      type="number"
                      name="uts"
                      value={editFormData.uts}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>YS (N/mm²) *</label>
                    <input
                      type="number"
                      name="ys"
                      value={editFormData.ys}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="tensile-form-group">
                    <label>Elongation (%) *</label>
                    <input
                      type="number"
                      name="elongation"
                      value={editFormData.elongation}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                   <div className="tensile-form-group">
                    <label>TestedBy *</label>
                    <input
                      type="text"
                      name="testedBy"
                      value={editFormData.testedBy}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="tensile-form-group full-width">
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

export default Tensile;