import React, { useState, useRef } from 'react';
import { Save, Loader2, RefreshCw, FileText } from 'lucide-react';
import { Button, DatePicker } from '../Components/Buttons';
import api from '../utils/api';
import '../styles/PageStyles/Process.css';

export default function ProcessControl() {
  const [formData, setFormData] = useState({
    date: '', disa: '', partName: '', datecode: '', heatcode: '', quantityOfMoulds: '', metalCompositionC: '', metalCompositionSi: '',
    metalCompositionMn: '', metalCompositionP: '', metalCompositionS: '', metalCompositionMgFL: '',
    metalCompositionCr: '', metalCompositionCu: '', timeOfPouring: '', pouringTemperature: '',
    ppCode: '', treatmentNo: '', fcNo: '', heatNo: '', conNo: '', tappingTime: '', correctiveAdditionC: '',
    correctiveAdditionSi: '', correctiveAdditionMn: '', correctiveAdditionS: '', correctiveAdditionCr: '',
    correctiveAdditionCu: '', correctiveAdditionSn: '', tappingWt: '', mg: '', resMgConvertor: '',
    recOfMg: '', streamInoculant: '', pTime: '', remarks: ''
  });


  const inputRefs = useRef({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [primaryLoading, setPrimaryLoading] = useState(false);
  
  const fieldOrder = ['date', 'disa', 'partName', 'datecode', 'heatcode', 'quantityOfMoulds', 'metalCompositionC', 'metalCompositionSi',
    'metalCompositionMn', 'metalCompositionP', 'metalCompositionS', 'metalCompositionMgFL', 'metalCompositionCr',
    'metalCompositionCu', 'timeOfPouring', 'pouringTemperature', 'ppCode', 'treatmentNo', 'fcNo', 'heatNo', 'conNo',
    'tappingTime', 'correctiveAdditionC', 'correctiveAdditionSi', 'correctiveAdditionMn', 'correctiveAdditionS',
    'correctiveAdditionCr', 'correctiveAdditionCu', 'correctiveAdditionSn', 'tappingWt', 'mg', 'resMgConvertor',
    'recOfMg', 'streamInoculant', 'pTime', 'remarks'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };
  
  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const idx = fieldOrder.indexOf(field);
      if (idx < fieldOrder.length - 1) {
        inputRefs.current[fieldOrder[idx + 1]]?.focus();
      }
    }
  };

  const handlePrimarySubmit = async () => {
    // Validate required fields
    if (!formData.date) {
      alert('Please fill in Date');
      return;
    }
    if (!formData.disa) {
      alert('Please fill in DISA');
      return;
    }

    try {
      setPrimaryLoading(true);
      
      const primaryData = {
        date: formData.date,
        disa: formData.disa
      };
      
      const data = await api.post('/v1/process-records/primary', primaryData);
      
      if (data.success) {
        alert('Primary data saved successfully!');
      }
    } catch (error) {
      console.error('Error saving primary data:', error);
      alert('Failed to save primary data: ' + error.message);
    } finally {
      setPrimaryLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.date) {
      alert('Please fill in Date');
      return;
    }
    if (!formData.disa) {
      alert('Please fill in DISA');
      return;
    }

    try {
      setSubmitLoading(true);
      
      const data = await api.post('/v1/process-records', formData);
      
      if (data.success) {
        alert('Process control entry created successfully!');
        handleReset();
      }
    } catch (error) {
      console.error('Error creating process control entry:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    const resetData = {};
    Object.keys(formData).forEach(key => resetData[key] = '');
    setFormData(resetData);
    inputRefs.current.date?.focus();
  };

  return (
    <>

      <div className="process-header">
        <div className="process-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Process Control - Entry Form
            <button 
              className="process-view-report-btn"
              onClick={() => window.location.href = "/process/report"}
              title="View Reports"
            >
              <FileText size={16} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
      </div>

      <div className="process-form-grid">
            <div className="section-header" style={{gridColumn: '1 / -1'}}>
              <h3>Primary</h3>
            </div>

            {/* Primary Row Container */}
            <div className="process-primary-row" style={{gridColumn: '1 / -1'}}>
              <div className="process-form-group">
                <label>Date *</label>
                <DatePicker 
                  ref={el => inputRefs.current.date = el} 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  onKeyDown={e => handleKeyDown(e, 'date')} 
                />
              </div>

              <div className="process-form-group">
                <label>DISA *</label>
                <select
                  ref={el => inputRefs.current.disa = el}
                  name="disa"
                  value={formData.disa}
                  onChange={handleChange}
                  onKeyDown={e => handleKeyDown(e, 'disa')}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    border: '2px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select DISA</option>
                  <option value="DISA I">DISA I</option>
                  <option value="DISA II">DISA II</option>
                  <option value="DISA III">DISA III</option>
                  <option value="DISA IV">DISA IV</option>
                </select>
              </div>

              {/* Primary Submit Button */}
              <div className="process-primary-button-wrapper">
                <button
                  className="process-submit-btn"
                  type="button"
                  onClick={handlePrimarySubmit}
                  disabled={primaryLoading || !formData.date || !formData.disa}
                >
                  {primaryLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
                  {primaryLoading ? 'Saving...' : 'Save Primary'}
                </button>
              </div>
            </div>

            {/* Divider line */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}></div>

            <div className="process-form-group">
              <label>Part Name</label>
              <input 
                ref={el => inputRefs.current.partName = el} 
                type="text" 
                name="partName" 
                value={formData.partName} 
                onChange={handleChange} 
                onKeyDown={e => handleKeyDown(e, 'partName')} 
                placeholder="e.g., ABC-123" 
              />
            </div>

            <div className="process-form-group">
              <label>Date Code</label>
              <input 
                ref={el => inputRefs.current.datecode = el} 
                type="text" 
                name="datecode" 
                value={formData.datecode} 
                onChange={handleChange} 
                onKeyDown={e => handleKeyDown(e, 'datecode')} 
                placeholder="e.g., 29-10-2025" 
              />
            </div>

            <div className="process-form-group">
              <label>Heat Code</label>
              <input 
                ref={el => inputRefs.current.heatcode = el} 
                type="text" 
                name="heatcode" 
                value={formData.heatcode} 
                onChange={handleChange} 
                onKeyDown={e => handleKeyDown(e, 'heatcode')} 
                placeholder="e.g., HC-001" 
              />
            </div>

            <div className="process-form-group">
              <label>Qty. Of Moulds</label>
              <input ref={el => inputRefs.current.quantityOfMoulds = el} type="number" name="quantityOfMoulds" value={formData.quantityOfMoulds} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'quantityOfMoulds')} placeholder="Enter quantity" />
            </div>

            <div className="section-header">
              <h3>Metal Composition (%)</h3>
            </div>

            {['C', 'Si', 'Mn', 'P', 'S', 'MgFL', 'Cu', 'Cr'].map(el => (
              <div className="process-form-group" key={el}>
                <label>{el === 'MgFL' ? 'Mg F/L' : el}</label>
                <input ref={r => inputRefs.current[`metalComposition${el}`] = r} type="number" name={`metalComposition${el}`} step="0.001" value={formData[`metalComposition${el}`]} onChange={handleChange} onKeyDown={e => handleKeyDown(e, `metalComposition${el}`)} placeholder="%" />
              </div>
            ))}

            {/* Divider line */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}></div>

            <div className="process-form-group">
              <label>Time of Pouring</label>
              <input ref={el => inputRefs.current.timeOfPouring = el} type="time" name="timeOfPouring" value={formData.timeOfPouring} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'timeOfPouring')} />
            </div>

            <div className="process-form-group">
              <label>Pouring Temp (°C)</label>
              <input ref={el => inputRefs.current.pouringTemperature = el} type="number" name="pouringTemperature" step="0.01" value={formData.pouringTemperature} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'pouringTemperature')} placeholder="e.g., 1450" />
            </div>

            <div className="process-form-group">
              <label>PP Code</label>
              <input ref={el => inputRefs.current.ppCode = el} type="text" name="ppCode" value={formData.ppCode} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'ppCode')} placeholder="Enter PP code" />
            </div>

            <div className="process-form-group">
              <label>Treatment No</label>
              <input ref={el => inputRefs.current.treatmentNo = el} type="text" name="treatmentNo" value={formData.treatmentNo} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'treatmentNo')} placeholder="Enter treatment no" />
            </div>

            <div className="process-form-group">
              <label>F/C No.</label>
              <input 
                ref={el => inputRefs.current.fcNo = el} 
                type="text" 
                name="fcNo" 
                value={formData.fcNo} 
                onChange={handleChange} 
                onKeyDown={e => handleKeyDown(e, 'fcNo')} 
                placeholder="Enter F/C No." 
              />
            </div>

            <div className="process-form-group">
              <label>Heat No</label>
              <input 
                ref={el => inputRefs.current.heatNo = el} 
                type="text" 
                name="heatNo" 
                value={formData.heatNo} 
                onChange={handleChange} 
                onKeyDown={e => handleKeyDown(e, 'heatNo')} 
                placeholder="Enter Heat No" 
              />
            </div>

            <div className="process-form-group">
              <label>Con No</label>
              <input ref={el => inputRefs.current.conNo = el} type="text" name="conNo" value={formData.conNo} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'conNo')} placeholder="Enter con no" />
            </div>

            <div className="process-form-group">
              <label>Tapping Time</label>
              <input ref={el => inputRefs.current.tappingTime = el} type="time" name="tappingTime" value={formData.tappingTime} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'tappingTime')} />
            </div>

            <div className="section-header">
              <h3>Corrective Addition (Kgs)</h3>
            </div>

            {['C', 'Si', 'Mn', 'S', 'Cr', 'Cu', 'Sn'].map(el => (
              <div className="process-form-group" key={`add-${el}`}>
                <label>{el}</label>
                <input ref={r => inputRefs.current[`correctiveAddition${el}`] = r} type="number" name={`correctiveAddition${el}`} step="0.01" value={formData[`correctiveAddition${el}`]} onChange={handleChange} onKeyDown={e => handleKeyDown(e, `correctiveAddition${el}`)} placeholder="Kgs" />
              </div>
            ))}

            {/* Divider line */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}></div>

            <div className="process-form-group">
              <label>Tapping Wt (Kgs)</label>
              <input ref={el => inputRefs.current.tappingWt = el} type="number" name="tappingWt" step="0.01" value={formData.tappingWt} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'tappingWt')} placeholder="Enter weight" />
            </div>

            <div className="process-form-group">
              <label>Mg (Kgs)</label>
              <input ref={el => inputRefs.current.mg = el} type="number" name="mg" step="0.01" value={formData.mg} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'mg')} placeholder="Enter Mg" />
            </div>

            <div className="process-form-group">
              <label>Res. Mg. Convertor (%)</label>
              <input ref={el => inputRefs.current.resMgConvertor = el} type="number" name="resMgConvertor" step="0.01" value={formData.resMgConvertor} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'resMgConvertor')} placeholder="Enter %" />
            </div>

            <div className="process-form-group">
              <label>Rec. Of Mg (%)</label>
              <input ref={el => inputRefs.current.recOfMg = el} type="number" name="recOfMg" step="0.01" value={formData.recOfMg} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'recOfMg')} placeholder="Enter %" />
            </div>

            <div className="process-form-group">
              <label>Stream Inoculant (gm/Sec)</label>
              <input 
                ref={el => inputRefs.current.streamInoculant = el}
                type="number"
                name="streamInoculant"
                value={formData.streamInoculant}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'streamInoculant')}
                step="0.1"
                placeholder="e.g., 5.5"
              />
            </div>

            <div className="process-form-group">
              <label>P.Time (sec)</label>
              <input 
                ref={el => inputRefs.current.pTime = el}
                type="number"
                name="pTime"
                value={formData.pTime}
                onChange={handleChange}
                onKeyDown={e => handleKeyDown(e, 'pTime')}
                step="0.1"
                placeholder="e.g., 120"
              />
            </div>

            <div className="process-form-group" style={{gridColumn: '1 / -1'}}>
              <label>Remarks</label>
              <textarea ref={el => inputRefs.current.remarks = el} name="remarks" value={formData.remarks} onChange={handleChange} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }}} rows="4" placeholder="Enter any additional notes..." />
            </div>
      </div>

      <div className="process-submit-container">
        <button 
          className="process-reset-btn"
          onClick={handleReset}
          type="button"
        >
          <RefreshCw size={18} />
          Reset Form
        </button>
        <button 
          className="process-submit-btn" 
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
}