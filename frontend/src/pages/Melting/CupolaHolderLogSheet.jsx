import React, { useState } from 'react';
import { Save, RefreshCw, Loader2, FileText, RotateCcw } from 'lucide-react';
import { DatePicker } from '../../Components/Buttons';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/CupolaHolderLogSheet.css';

const CupolaHolderLogSheet = () => {
  const [formData, setFormData] = useState({
    date: '',
    shift: '',
    holderNumber: '',
    heatNo: '',
    // Additions
    cpc: '',
    mFeSl: '',
    feMn: '',
    sic: '',
    pureMg: '',
    cu: '',
    feCr: '',
    // Tapping
    actualTime: '',
    tappingTime: '',
    tappingTemp: '',
    metalKg: '',
    // Pouring
    disaLine: '',
    indFur: '',
    bailNo: '',
    // Electrical
    tap: '',
    kw: '',
    remarks: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [isPrimarySaved, setIsPrimarySaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrimarySubmit = () => {
    // If already locked, unlock it
    if (isPrimarySaved) {
      setIsPrimarySaved(false);
      alert('Primary data unlocked. You can now modify date, shift, and holder number.');
      return;
    }

    const required = ['date', 'shift', 'holderNumber'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      alert(`Please fill in the following required fields: ${missing.join(', ')}`);
      return;
    }

    // Lock primary fields (date, shift, holderNumber) without saving to database
    // The actual save will happen when user clicks "Submit Entry"
    setIsPrimarySaved(true);
    alert('Primary data locked. You can now fill other fields.');
  };

  const handleSubmit = async () => {
    const required = ['date', 'shift', 'holderNumber'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      alert(`Please fill in the following required fields: ${missing.join(', ')}`);
      return;
    }

    // Ensure primary data is locked first
    if (!isPrimarySaved) {
      alert('Please lock Primary data first before submitting.');
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Send all data (primary + other fields) combined to backend
      // Backend will find existing document by date+shift+holderNumber and update it, or create new one
      const data = await api.post('/v1/cupola-holder-logs', formData);
      if (data.success) {
        alert('Cupola holder log entry saved successfully!');
        handleReset();
      }
    } catch (error) {
      console.error('Error saving cupola holder log:', error);
      alert('Failed to save entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleReset = () => {
    setFormData({
      date: '', shift: '', holderNumber: '', heatNo: '', cpc: '', mFeSl: '', feMn: '', sic: '',
      pureMg: '', cu: '', feCr: '', actualTime: '', tappingTime: '',
      tappingTemp: '', metalKg: '', disaLine: '', indFur: '', bailNo: '',
      tap: '', kw: '', remarks: ''
    });
    setIsPrimarySaved(false);
  };

  return (
    <>

      <div className="cupola-holder-header">
        <div className="cupola-holder-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Cupola Holder Log Sheet - Entry Form
            <button 
              className="cupola-holder-view-report-btn"
              onClick={() => window.location.href = "/melting/cupola-holder-log-sheet/report"}
              title="View Reports"
            >
              <FileText size={16} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
      </div>

      <div className="cupola-holder-main-card">
        <h3 className="cupola-holder-main-card-title primary-data-title">Primary Data :</h3>

        <div className="cupola-holder-primary-row">
          {/* Primary Information */}
          <div className="cupola-holder-form-group">
            <label>Date *</label>
            <DatePicker 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              disabled={isPrimarySaved}
            />
          </div>

          <div className="cupola-holder-form-group">
            <label>Shift *</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              disabled={isPrimarySaved}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: isPrimarySaved ? '#f1f5f9' : '#ffffff',
                color: '#1e293b',
                cursor: isPrimarySaved ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">Select Shift</option>
              <option value="Shift 1">Shift 1</option>
              <option value="Shift 2">Shift 2</option>
              <option value="Shift 3">Shift 3</option>
            </select>
          </div>

          <div className="cupola-holder-form-group">
            <label>Holder Number *</label>
            <input
              type="text"
              name="holderNumber"
              value={formData.holderNumber}
              onChange={handleChange}
              placeholder="e.g: H001"
              disabled={isPrimarySaved}
              readOnly={isPrimarySaved}
              style={{
                backgroundColor: isPrimarySaved ? '#f1f5f9' : '#ffffff',
                cursor: isPrimarySaved ? 'not-allowed' : 'text'
              }}
            />
          </div>

          {/* Primary Submit Button */}
          <div className="cupola-holder-primary-button-wrapper">
            <button
              className="cupola-holder-submit-btn"
              type="button"
              onClick={handlePrimarySubmit}
              disabled={!isPrimarySaved && (!formData.date || !formData.shift || !formData.holderNumber)}
            >
              {isPrimarySaved ? 'Unlock Primary' : 'Lock Primary'}
            </button>
          </div>
        </div>

        {/* Divider line */}
        <div style={{ marginTop: '1rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}></div>

        {/* Heat No */}
        <div className="cupola-holder-form-grid">
          <div className="cupola-holder-form-group" style={{ maxWidth: '300px' }}>
            <label>Heat No</label>
            <input
              type="text"
              name="heatNo"
              value={formData.heatNo}
              onChange={handleChange}
              placeholder="e.g: H2024-001"
            />
          </div>
        </div>

        {/* Additions Section */}
        <div className="cupola-holder-sub-section">
          <h4 className="cupola-holder-sub-section-title">Additions</h4>
          <div className="cupola-holder-form-grid">
            <div className="cupola-holder-form-group">
              <label>CPC</label>
              <input
                type="number"
                name="cpc"
                value={formData.cpc}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Fe Sl</label>
              <input
                type="number"
                name="mFeSl"
                value={formData.mFeSl}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Fe Mn</label>
              <input
                type="number"
                name="feMn"
                value={formData.feMn}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Sic</label>
              <input
                type="number"
                name="sic"
                value={formData.sic}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Pure Mg</label>
              <input
                type="number"
                name="pureMg"
                value={formData.pureMg}
                onChange={handleChange}
                step="0.01"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Cu</label>
              <input
                type="number"
                name="cu"
                value={formData.cu}
                onChange={handleChange}
                step="0.01"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Fe Cr</label>
              <input
                type="number"
                name="feCr"
                value={formData.feCr}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Tapping Section */}
        <div className="cupola-holder-sub-section">
          <h4 className="cupola-holder-sub-section-title">Tapping</h4>
          <div className="cupola-holder-tapping-container">
            <div className="cupola-holder-form-group">
              <label>Actual Time</label>
              <input
                type="time"
                name="actualTime"
                value={formData.actualTime}
                onChange={handleChange}
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Tapping Time</label>
              <input
                type="time"
                name="tappingTime"
                value={formData.tappingTime}
                onChange={handleChange}
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Temp (°C)</label>
              <input
                type="number"
                name="tappingTemp"
                value={formData.tappingTemp}
                onChange={handleChange}
                placeholder="e.g: 1500"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Metal (KG)</label>
              <input
                type="number"
                name="metalKg"
                value={formData.metalKg}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g: 2000"
              />
            </div>
          </div>
        </div>

        {/* Pouring and Electrical Sections - Same Row */}
        <div className="cupola-holder-row-container">
          {/* Pouring Section */}
          <div className="cupola-holder-sub-section">
            <h4 className="cupola-holder-sub-section-title">Pouring Details</h4>
            <div className="cupola-holder-form-grid">
              <div className="cupola-holder-form-group">
                <label>DISA LINE</label>
                <input
                  type="text"
                  name="disaLine"
                  value={formData.disaLine}
                  onChange={handleChange}
                  placeholder="e.g: DISA-1"
                />
              </div>

              <div className="cupola-holder-form-group">
                <label>IND FUR</label>
                <input
                  type="text"
                  name="indFur"
                  value={formData.indFur}
                  onChange={handleChange}
                  placeholder="e.g: IND-FUR-1"
                />
              </div>

              <div className="cupola-holder-form-group">
                <label>BAIL NO</label>
                <input
                  type="text"
                  name="bailNo"
                  value={formData.bailNo}
                  onChange={handleChange}
                  placeholder="e.g: BAIL-001"
                />
              </div>
            </div>
          </div>

          {/* Electrical Section */}
          <div className="cupola-holder-sub-section">
            <h4 className="cupola-holder-sub-section-title">Electrical Readings</h4>
            <div className="cupola-holder-form-grid">
              <div className="cupola-holder-form-group">
                <label>TAP</label>
                <input
                  type="text"
                  name="tap"
                  value={formData.tap}
                  onChange={handleChange}
                  placeholder="Enter TAP value"
                />
              </div>

              <div className="cupola-holder-form-group">
                <label>KW</label>
                <input
                  type="number"
                  name="kw"
                  value={formData.kw}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="e.g: 2500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="cupola-holder-form-grid">
          <div className="cupola-holder-form-group" style={{ gridColumn: '1 / -1' }}>
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

        <div className="cupola-holder-submit-container">
          <button
            className="cupola-holder-reset-btn"
            type="button"
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            className="cupola-holder-submit-btn"
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading || !isPrimarySaved}
            title={!isPrimarySaved ? 'Please save Primary data first' : 'Submit Entry'}
          >
            {submitLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
            {submitLoading ? 'Saving...' : 'Submit Entry'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CupolaHolderLogSheet;


