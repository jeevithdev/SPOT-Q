import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button, DatePicker, ViewReportButton, ResetFormButton } from '../Components/Buttons';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/Tensile.css';

const Tensile = () => {
  const [formData, setFormData] = useState({
    dateOfInspection: '',
    item: '',
    date: '',
    heatCode: '',
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
    const required = ['dateOfInspection', 'item', 'date', 'heatCode', 'dia', 'lo', 'li', 
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
          dateOfInspection: '', item: '', date: '', heatCode: '', dia: '', lo: '', li: '',
          breakingLoad: '', yieldLoad: '', uts: '', ys: '', elongation: '', testedBy: '', remarks: ''
        });
      }
    } catch (error) {
      console.error('Error creating tensile test:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset= () => {
    setFormData({
      dateOfInspection: '', item: '', date: '', heatCode: '', dia: '', lo: '', li: '',
      breakingLoad: '', yieldLoad: '', uts: '', ys: '', elongation: '', testedBy: '', remarks: ''
    });
    setValidationErrors({});
  };

  return (
    <>
      <div className="tensile-header">
        <div className="tensile-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Tensile Test - Entry Form
          </h2>
        </div>
        <div className="tensile-header-buttons">
          <ViewReportButton to="/tensile/report" />
          <ResetFormButton onClick={handleReset} />
        </div>
      </div>

      {/* Entry Form */}
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
              <label>Date *</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 2024-10-30"
                className={validationErrors.date ? 'invalid-input' : ''}
              />
            </div>

            <div className="tensile-form-group">
              <label>Heat Code *</label>
              <input
                type="text"
                name="heatCode"
                value={formData.heatCode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: HC-001"
                className={validationErrors.heatCode ? 'invalid-input' : ''}
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
    </>
  );
};

export default Tensile;