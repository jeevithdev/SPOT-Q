import React, { useState, useRef } from 'react';
import { Save, Loader2, RefreshCw, FileText } from 'lucide-react';
import CustomDatePicker from '../Components/CustomDatePicker';
import api from '../utils/api';
import '../styles/PageStyles/MicroTensile.css';

const MicroTensile = () => {
  const inputRefs = useRef({});
  const [formData, setFormData] = useState({
    dateOfInspection: '',
    disa: [],
    item: '',
    dateCode: '',
    heatCode: '',
    barDia: '',
    gaugeLength: '',
    maxLoad: '',
    yieldLoad: '',
    tensileStrength: '',
    yieldStrength: '',
    elongation: '',
    remarks: '',
    testedBy: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const disaOptions = ['DISA 1', 'DISA 2', 'DISA 3', 'DISA 4'];

  // Field order for keyboard navigation
  const fieldOrder = ['disa', 'dateOfInspection', 'item', 'dateCode', 'heatCode', 'barDia', 'gaugeLength',
                     'maxLoad', 'yieldLoad', 'tensileStrength', 'yieldStrength', 'elongation', 'remarks', 'testedBy'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDisaChange = (disaValue) => {
    setFormData(prev => {
      const currentDisa = prev.disa || [];
      const isSelected = currentDisa.includes(disaValue);
      const newDisa = isSelected
        ? currentDisa.filter(d => d !== disaValue)
        : [...currentDisa, disaValue];
      
      return {
        ...prev,
        disa: newDisa
      };
    });
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      dateOfInspection: e.target.value
    }));
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const idx = fieldOrder.indexOf(field);
      if (idx < fieldOrder.length - 1) {
        inputRefs.current[fieldOrder[idx + 1]]?.focus();
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    const required = ['dateOfInspection', 'item', 'dateCode', 'heatCode', 'barDia', 'gaugeLength',
                     'maxLoad', 'yieldLoad', 'tensileStrength', 'yieldStrength', 'elongation', 'testedBy'];
    const missing = required.filter(field => !formData[field]);
    
    if (!formData.disa || formData.disa.length === 0) {
      missing.push('disa');
    }

    if (missing.length > 0) {
      alert(`Please fill in the following required fields: ${missing.join(', ')}`);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/micro-tensile-tests', formData);
      
      if (data.success) {
        alert('Micro tensile test entry created successfully!');
        
        // Reset all fields except DISA checklist
        const resetData = { ...formData };
        Object.keys(formData).forEach(key => {
          if (key !== 'disa') {
            resetData[key] = '';
          }
        });
        setFormData(resetData);
        
        // Focus on Date of Inspection for next entry
        setTimeout(() => {
          inputRefs.current.dateOfInspection?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('Error creating micro tensile test:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleReset = () => {
    // Reset all fields except DISA checklist
    const resetData = { ...formData };
    Object.keys(formData).forEach(key => {
      if (key !== 'disa') {
        resetData[key] = '';
      }
    });
    setFormData(resetData);
    // Focus on Date of Inspection for next entry
    setTimeout(() => {
      inputRefs.current.dateOfInspection?.focus();
    }, 100);
  };

  return (
    <>

      <div className="microtensile-header">
        <div className="microtensile-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Micro Tensile Test - Entry Form
            <button 
              className="microtensile-view-report-btn"
              onClick={() => window.location.href = "/micro-tensile/report"}
              title="View Reports"
            >
              <FileText size={16} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
      </div>

      <div className="microtensile-form-grid">
            <div className="microtensile-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>DISA *</label>
              <div className="microtensile-disa-checklist">
                {disaOptions.map((option) => (
                  <label key={option} className="microtensile-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.disa?.includes(option) || false}
                      onChange={() => handleDisaChange(option)}
                      className="microtensile-checkbox"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="microtensile-form-group">
              <label>Date of Inspection *</label>
              <CustomDatePicker
                ref={el => inputRefs.current.dateOfInspection = el}
                name="dateOfInspection"
                value={formData.dateOfInspection}
                onChange={handleDateChange}
                onKeyDown={e => handleKeyDown(e, 'dateOfInspection')}
              />
            </div>

            <div className="microtensile-form-group">
              <label>Item *</label>
              <input
                ref={el => inputRefs.current.item = el}
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'item')}
                placeholder="e.g: Sample Bar"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Date Code *</label>
              <input
                ref={el => inputRefs.current.dateCode = el}
                type="text"
                name="dateCode"
                value={formData.dateCode}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'dateCode')}
                placeholder="e.g: 2024-HC"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Heat Code *</label>
              <input
                ref={el => inputRefs.current.heatCode = el}
                type="text"
                name="heatCode"
                value={formData.heatCode}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'heatCode')}
                placeholder="e.g: 012"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Bar Dia (mm) *</label>
              <input
                ref={el => inputRefs.current.barDia = el}
                type="number"
                name="barDia"
                value={formData.barDia}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'barDia')}
                step="0.01"
                placeholder="e.g: 6.0"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Gauge Length (mm) *</label>
              <input
                ref={el => inputRefs.current.gaugeLength = el}
                type="number"
                name="gaugeLength"
                value={formData.gaugeLength}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'gaugeLength')}
                step="0.01"
                placeholder="e.g: 30.0"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Max Load (Kgs) or KN *</label>
              <input
                ref={el => inputRefs.current.maxLoad = el}
                type="number"
                name="maxLoad"
                value={formData.maxLoad}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'maxLoad')}
                step="0.01"
                placeholder="e.g: 1560"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Yield Load (Kgs) or KN *</label>
              <input
                ref={el => inputRefs.current.yieldLoad = el}
                type="number"
                name="yieldLoad"
                value={formData.yieldLoad}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'yieldLoad')}
                step="0.01"
                placeholder="e.g: 1290"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Tensile Strength (Kg/mm² or Mpa) *</label>
              <input
                ref={el => inputRefs.current.tensileStrength = el}
                type="number"
                name="tensileStrength"
                value={formData.tensileStrength}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'tensileStrength')}
                step="0.01"
                placeholder="e.g: 550"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Yield Strength (Kg/mm² or Mpa) *</label>
              <input
                ref={el => inputRefs.current.yieldStrength = el}
                type="number"
                name="yieldStrength"
                value={formData.yieldStrength}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'yieldStrength')}
                step="0.01"
                placeholder="e.g: 455"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Elongation % *</label>
              <input
                ref={el => inputRefs.current.elongation = el}
                type="number"
                name="elongation"
                value={formData.elongation}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'elongation')}
                step="0.01"
                placeholder="e.g: 18.5"
              />
            </div>

            <div className="microtensile-form-group" style={{ gridColumn: 'span 2' }}>
              <label>Remarks</label>
              <textarea
                ref={el => inputRefs.current.remarks = el}
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleKeyDown(e, 'remarks'); } }}
                rows="3"
                placeholder="Enter any additional notes or observations..."
              />
            </div>

            <div className="microtensile-form-group">
              <label>Tested By *</label>
              <input
                ref={el => inputRefs.current.testedBy = el}
                type="text"
                name="testedBy"
                value={formData.testedBy}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'testedBy')}
                placeholder="e.g: John Smith"
              />
            </div>
          </div>

      <div className="microtensile-submit-container">
        <button 
          className="microtensile-reset-btn"
          onClick={handleReset}
          type="button"
        >
          <RefreshCw size={18} />
          Reset Form
        </button>
        <button 
          className="microtensile-submit-btn" 
          type="button"
          onClick={handleSubmit}
          disabled={submitLoading}
        >
          {submitLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
          {submitLoading ? 'Saving...' : 'Submit Entry'}
        </button>
      </div>
    </>
  );
};

export default MicroTensile;
