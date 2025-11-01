import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '../Components/Buttons';
import api from '../utils/api';
import '../styles/PageStyles/Impact.css';

const Impact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dateOfInspection: '',
    partName: '',
    dateCode: '',
    specification: '',
    observedValue: '',
    remarks: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});


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
    const required = ['dateOfInspection', 'partName', 'dateCode', 
                     'specification', 'observedValue'];
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
      const data = await api.post('/v1/impact-tests', formData);
      
      if (data.success) {
        alert('Impact test entry created successfully!');
        setFormData({
          dateOfInspection: '', partName: '', dateCode: '', 
          specification: '', observedValue: '', remarks: ''
        });
      }
    } catch (error) {
      console.error('Error creating impact test:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleReset = () => {
    setFormData({
      dateOfInspection: '', partName: '', dateCode: '', 
      specification: '', observedValue: '', remarks: ''
    });
    setValidationErrors({});
  };

  return (
    <>
      <div className="impact-header">
        <div className="impact-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Impact Test - Entry Form
          </h2>
        </div>
        <div className="impact-header-buttons">
          <button className="impact-view-report-btn" onClick={() => navigate('/impact/report')} type="button">
            <div className="impact-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="impact-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

      <form className="impact-form-grid">
            <div className="impact-form-group">
              <label>Date of Inspection *</label>
              <DatePicker
                name="dateOfInspection"
                value={formData.dateOfInspection}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={validationErrors.dateOfInspection ? 'invalid-input' : ''}
              />
            </div>

            <div className="impact-form-group">
              <label>Part Name *</label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: Crankshaft"
                className={validationErrors.partName ? 'invalid-input' : ''}
              />
            </div>

            <div className="impact-form-group">
              <label>Date Code *</label>
              <input
                type="text"
                name="dateCode"
                value={formData.dateCode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: DC-2024-101"
                className={validationErrors.dateCode ? 'invalid-input' : ''}
              />
            </div>

            <div className="impact-form-group">
              <label>Specification *</label>
              <input
                type="text"
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 60 J/cm2 (min)"
                className={validationErrors.specification ? 'invalid-input' : ''}
              />
            </div>

            <div className="impact-form-group">
              <label>Observed Value *</label>
              <input
                type="number"
                name="observedValue"
                value={formData.observedValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                step="0.1"
                placeholder="e.g: 92,96"
                className={validationErrors.observedValue ? 'invalid-input' : ''}
              />
            </div>

            <div className="impact-form-group full-width">
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

      <div className="impact-submit-container">
        <button onClick={handleSubmit} disabled={submitLoading} className="impact-submit-btn" type="button">
          {submitLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
          {submitLoading ? 'Saving...' : 'Submit Entry'}
        </button>
      </div>

      <div className="impact-reset-container">
        <button onClick={handleReset} className="impact-reset-btn">
          <RefreshCw size={18} />
          Reset
        </button>
      </div>
    </>
  );
};

export default Impact;