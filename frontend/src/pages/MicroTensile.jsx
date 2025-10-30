import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Button, DatePicker, ViewReportButton, ResetFormButton } from '../Components/Buttons';
import ValidationPopup from '../Components/ValidationPopup';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/MicroTensile.css';

const MicroTensile = () => {
  const [formData, setFormData] = useState({
    dateOfInspection: '',
    item: '',
    dateCodeHeatCode: '',
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

  const [showMissingFields, setShowMissingFields] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async () => {
    const required = ['dateOfInspection', 'item', 'dateCodeHeatCode', 'barDia', 'gaugeLength',
                     'maxLoad', 'yieldLoad', 'tensileStrength', 'yieldStrength', 'elongation', 'testedBy'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFields(true);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/micro-tensile-tests', formData);
      
      if (data.success) {
        alert('Micro tensile test entry created successfully!');
        setFormData({
          dateOfInspection: '', item: '', dateCodeHeatCode: '', barDia: '', gaugeLength: '',
          maxLoad: '', yieldLoad: '', tensileStrength: '', yieldStrength: '', elongation: '',
          remarks: '', testedBy: ''
        });
      }
    } catch (error) {
      console.error('Error creating micro tensile test:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleReset = () => {
    setFormData({
      dateOfInspection: '', item: '', dateCodeHeatCode: '', barDia: '', gaugeLength: '',
      maxLoad: '', yieldLoad: '', tensileStrength: '', yieldStrength: '', elongation: '',
      remarks: '', testedBy: ''
    });
  };

  return (
    <div className="microtensile-container">
      <ViewReportButton to="/micro-tensile/report" />
      <div className="microtensile-content">
        {showMissingFields && (
          <ValidationPopup
            missingFields={missingFields}
            onClose={() => setShowMissingFields(false)}
          />
        )}

        {/* Entry Form Container */}
        <div className="microtensile-entry-container">
          <div className="microtensile-header">
            <div className="microtensile-header-text">
              <Save size={24} style={{ color: '#5B9AA9' }} />
              <h2>Micro Tensile Test - Entry Form</h2>
            </div>
            <ResetFormButton onClick={handleReset} />
          </div>

          <div className="microtensile-form-grid">
            <div className="microtensile-form-group">
              <label>Date of Inspection *</label>
              <DatePicker
                name="dateOfInspection"
                value={formData.dateOfInspection}
                onChange={handleChange}
              />
            </div>

            <div className="microtensile-form-group">
              <label>Item *</label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                placeholder="e.g: Sample Bar"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Date Code & Heat Code *</label>
              <input
                type="text"
                name="dateCodeHeatCode"
                value={formData.dateCodeHeatCode}
                onChange={handleChange}
                placeholder="e.g: 2024-HC-012"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Bar Dia (mm) *</label>
              <input
                type="number"
                name="barDia"
                value={formData.barDia}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 6.0"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Gauge Length (mm) *</label>
              <input
                type="number"
                name="gaugeLength"
                value={formData.gaugeLength}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 30.0"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Max Load (Kgs) or KN *</label>
              <input
                type="number"
                name="maxLoad"
                value={formData.maxLoad}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 1560"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Yield Load (Kgs) or KN *</label>
              <input
                type="number"
                name="yieldLoad"
                value={formData.yieldLoad}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 1290"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Tensile Strength (Kg/mm² or Mpa) *</label>
              <input
                type="number"
                name="tensileStrength"
                value={formData.tensileStrength}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 550"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Yield Strength (Kg/mm² or Mpa) *</label>
              <input
                type="number"
                name="yieldStrength"
                value={formData.yieldStrength}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 455"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Elongation % *</label>
              <input
                type="number"
                name="elongation"
                value={formData.elongation}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 18.5"
              />
            </div>

            <div className="microtensile-form-group">
              <label>Tested By *</label>
              <input
                type="text"
                name="testedBy"
                value={formData.testedBy}
                onChange={handleChange}
                placeholder="e.g: John Smith"
              />
            </div>

            <div className="microtensile-form-group full-width">
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

          <div className="microtensile-submit-container">
            <Button onClick={handleSubmit} disabled={submitLoading} className="microtensile-submit-btn" type="button">
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroTensile;
