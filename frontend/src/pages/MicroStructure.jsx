import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '../Components/Buttons';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/MicroStructure.css';

const MicroStructure = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    disa: '',
    insDate: '',
    partName: '',
    dateCode: '',
    heatCode: '',
    nodularity: '',
    graphiteType: '',
    countNos: '',
    size: '',
    ferritePercent: '',
    pearlitePercent: '',
    carbidePercent: '',
    remarks: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const disaOptions = ['DISA I', 'DISA II', 'DISA III', 'DISA IV'];

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
      const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
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
    const required = ['disa', 'insDate', 'partName', 'dateCode','heatCode', 'nodularity','graphiteType',
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
          disa: '',
          insDate: '', 
          partName: '', 
          dateCode:'', 
          heatCode: '', 
          nodularity:'', 
          graphiteType: '',
          countNos: '', 
          size: '', 
          ferritePercent: '', 
          pearlitePercent: '', 
          carbidePercent: '', 
          remarks: ''
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
      disa: '',
      insDate: '', 
      partName: '', 
      dateCode:'', 
      heatCode: '', 
      nodularity: '', 
      graphiteType: '',
      countNos: '', 
      size: '', 
      ferritePercent: '', 
      pearlitePercent: '', 
      carbidePercent: '', 
      remarks: ''
    });
    setValidationErrors({});
  };

  return (
    <>
      <div className="microstructure-header">
        <div className="microstructure-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Micro Structure - Entry Form
          </h2>
        </div>
        <div className="microstructure-header-buttons">
          <button className="microstructure-view-report-btn" onClick={() => navigate('/micro-structure/report')} type="button">
            <div className="microstructure-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="microstructure-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

      <form className="microstructure-form-grid">
            <div className="microstructure-form-group">
              <label>DISA *</label>
              <select
                name="disa"
                value={formData.disa}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={validationErrors.disa ? 'invalid-input' : ''}
              >
                <option value="">Select DISA</option>
                {disaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

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
              <label>Date Code *</label>
              <input
                type="text"
                name="dateCode"
                value={formData.dateCode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 2024-HC-005"
                className={validationErrors.dateCode ? 'invalid-input' : ''}
              />
            </div>

            <div className="microstructure-form-group">
              <label>Heat Code *</label>
              <input
                type="text"
                name="heatCode"
                value={formData.heatCode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 2024-HC-005"
                className={validationErrors.heatCode ? 'invalid-input' : ''}
              />
            </div>

            {/* Micro Structure Section */}
            <div className="section-header">
              <h3>Micro Structure Details </h3>
            </div>
            
            <div className="microstructure-form-group">
              <label>Nodularity % *</label>
              <input
                type="text"
                name="nodularity"
                value={formData.nodularity}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 85% Type VI"
                className={validationErrors.nodularity ? 'invalid-input' : ''}
              />
            </div>

             
            <div className="microstructure-form-group">
              <label>GraphiteType *</label>
              <input
                type="text"
                name="graphiteType"
                value={formData.graphiteType}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 85% Type VI"
                className={validationErrors.graphiteType ? 'invalid-input' : ''}
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
        <button onClick={handleSubmit} disabled={submitLoading} className="microstructure-submit-btn" type="button">
          {submitLoading ? <Loader size={20} /> : <Save size={18} />}
          {submitLoading ? 'Saving...' : 'Submit Entry'}
        </button>
      </div>

      <div className="microstructure-reset-container">
        <button onClick={handleReset} className="microstructure-reset-btn">
          <RefreshCw size={18} />
          Reset
        </button>
      </div>
    </>
  );
};

export default MicroStructure;