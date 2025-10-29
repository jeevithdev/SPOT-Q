import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button, DatePicker } from '../Components/Buttons';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/MicroStructure.css';

const MicroStructure = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const MicroStructureTabs = () => (
    <div className="microstructure-tabs-container">
      <div className="microstructure-tabs">
        <Link
          to="/micro-structure"
          className={`microstructure-tab ${isActive('/micro-structure') ? 'active' : ''}`}
        >
          Data Entry
        </Link>
        <Link
          to="/micro-structure/report"
          className={`microstructure-tab ${isActive('/micro-structure/report') ? 'active' : ''}`}
        >
          Report
        </Link>
      </div>
    </div>
  );

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
      }
    } catch (error) {
      console.error('Error creating micro structure report:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleReset = () => {
    setFormData({
      insDate: '', partName: '', dateCodeHeatCode: '', nodularityGraphiteType: '',
      countNos: '', size: '', ferritePercent: '', pearlitePercent: '', carbidePercent: '', remarks: ''
    });
    setValidationErrors({});
  };

  return (
    <div className="microstructure-container">
      <div className="microstructure-wrapper">
        <MicroStructureTabs />

        {/* Entry Form Container */}
        <div className="microstructure-entry-container">
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
            <div className="section-separator">
              <h4 className="section-title">Micro Structure Details</h4>
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



      </div>
    </div>
  );
};

export default MicroStructure;