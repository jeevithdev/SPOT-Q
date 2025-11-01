import React, { useState } from 'react';
import { Save, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '../../Components/Buttons';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/CupolaHolderLogSheet.css';

const CupolaHolderLogSheet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const required = ['date', 'heatNo'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      alert(`Please fill in the following required fields: ${missing.join(', ')}`);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/cupola-holder-logs', formData);
      if (data.success) {
        alert('Cupola holder log entry created successfully!');
        handleReset();
      }
    } catch (error) {
      console.error('Error creating cupola holder log:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleReset = () => {
    setFormData({
      date: '', heatNo: '', cpc: '', mFeSl: '', feMn: '', sic: '',
      pureMg: '', cu: '', feCr: '', actualTime: '', tappingTime: '',
      tappingTemp: '', metalKg: '', disaLine: '', indFur: '', bailNo: '',
      tap: '', kw: '', remarks: ''
    });
  };

  return (
    <>

      <div className="cupola-holder-header">
        <div className="cupola-holder-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Cupola Holder Log Sheet - Entry Form
          </h2>
        </div>
        <div className="cupola-holder-header-buttons">
          <button className="cupola-holder-view-report-btn" onClick={() => navigate('/melting/cupola-holder-log-sheet/report')} type="button">
            <div className="cupola-holder-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="cupola-holder-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

      <div className="cupola-holder-form-grid">
            {/* Basic Information */}
            <div className="cupola-holder-form-group">
              <label>Date *</label>
              <DatePicker name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div className="cupola-holder-form-group">
              <label>Heat No *</label>
              <input
                type="text"
                name="heatNo"
                value={formData.heatNo}
                onChange={handleChange}
                placeholder="e.g: H2024-001"
              />
            </div>

            {/* Additions Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Additions (All in kgs)
              </h4>
            </div>

            <div className="cupola-holder-form-group">
              <label>CPC (kgs)</label>
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
              <label>M Fe Sl (kgs)</label>
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
              <label>Fe Mn (kgs)</label>
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
              <label>SiC (kgs)</label>
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
              <label>Pure Mg (kgs)</label>
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
              <label>Cu (kgs)</label>
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
              <label>Fe Cr (kgs)</label>
              <input
                type="number"
                name="feCr"
                value={formData.feCr}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            {/* Tapping Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Tapping Details
              </h4>
            </div>

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
              <label>Tapping Temp (°C)</label>
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

            {/* Pouring Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Pouring Details
              </h4>
            </div>

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

            {/* Electrical Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Electrical Readings
              </h4>
            </div>

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

            {/* Remarks */}
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
          onClick={handleSubmit}
          disabled={submitLoading}
          className="cupola-holder-submit-btn"
          type="button"
        >
          {submitLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
          {submitLoading ? 'Saving...' : 'Submit Entry'}
        </button>
      </div>

      <div className="cupola-holder-reset-container">
        <button onClick={handleReset} className="cupola-holder-reset-btn">
          <RefreshCw size={18} />
          Reset
        </button>
      </div>
    </>
  );
};

export default CupolaHolderLogSheet;


