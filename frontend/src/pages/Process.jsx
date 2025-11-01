import React, { useState, useRef } from 'react';
import { Save, RefreshCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomDatePicker from '../Components/CustomDatePicker';
import '../styles/PageStyles/Process.css';

export default function ProcessControl() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    partName: '', date: '', heatCode: '', quantityOfMoulds: '', metalCompositionC: '', metalCompositionSi: '',
    metalCompositionMn: '', metalCompositionP: '', metalCompositionS: '', metalCompositionMgFL: '',
    metalCompositionCr: '', metalCompositionCu: '', timeOfPouring: '', pouringTemperature: '',
    ppCode: '', treatmentNo: '', fcNo: '', heatNo: '', conNo: '', tappingTime: '', correctiveAdditionC: '',
    correctiveAdditionSi: '', correctiveAdditionMn: '', correctiveAdditionS: '', correctiveAdditionCr: '',
    correctiveAdditionCu: '', correctiveAdditionSn: '', tappingWt: '', mg: '', resMgConvertor: '',
    recOfMg: '', streamInoculant: '', pTime: '', remarks: ''
  });


  const inputRefs = useRef({});
  const fieldOrder = ['partName', 'date', 'heatCode', 'quantityOfMoulds', 'metalCompositionC', 'metalCompositionSi',
    'metalCompositionMn', 'metalCompositionP', 'metalCompositionS', 'metalCompositionMgFL', 'metalCompositionCu',
    'metalCompositionCr', 'timeOfPouring', 'pouringTemperature', 'ppCode', 'treatmentNo', 'fcNo', 'heatNo', 'conNo',
    'tappingTime', 'correctiveAdditionC', 'correctiveAdditionSi', 'correctiveAdditionMn', 'correctiveAdditionS',
    'correctiveAdditionCr', 'correctiveAdditionCu', 'correctiveAdditionSn', 'tappingWt', 'mg', 'resMgConvertor',
    'recOfMg', 'streamInoculant', 'pTime', 'remarks'];

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  
  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const idx = fieldOrder.indexOf(field);
      if (idx < fieldOrder.length - 1) {
        inputRefs.current[fieldOrder[idx + 1]]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    // Combine separate fields for backward compatibility if needed
    const partNameDateHeatCode = `${formData.partName} / ${formData.date} / ${formData.heatCode}`;
    const streamInnoculantPTime = `${formData.streamInoculant} / ${formData.pTime}`;
    const fcNoHeatNo = `${formData.fcNo} / ${formData.heatNo}`;
    
    const newRecord = {
      ...formData,
      partNameDateHeatCode: partNameDateHeatCode.trim(),
      streamInnoculantPTime: streamInnoculantPTime.trim(),
      fcNoHeatNo: fcNoHeatNo.trim()
    };
    alert('Form submitted successfully! Record added.');
    handleReset();
  };

  const handleReset = () => {
    const resetData = {};
    Object.keys(formData).forEach(key => resetData[key] = '');
    setFormData(resetData);
    inputRefs.current.partName?.focus();
  };

  return (
    <>
      <div className="process-header">
        <div className="process-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Process Control - Entry Form
          </h2>
        </div>
        <div className="process-header-buttons">
          <button className="process-view-report-btn" onClick={() => navigate('/process/report')} type="button">
            <div className="process-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="process-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

      <div className="process-form-grid">
            <div className="process-form-group">
              <label>Part Name</label>
              <input ref={el => inputRefs.current.partName = el} type="text" name="partName" value={formData.partName} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'partName')} placeholder="e.g., ABC-123" />
            </div>

            <div className="process-form-group">
              <label>Date</label>
              <CustomDatePicker
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="process-form-group">
              <label>Heat Code</label>
              <input ref={el => inputRefs.current.heatCode = el} type="text" name="heatCode" value={formData.heatCode} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'heatCode')} placeholder="e.g., HC-001" />
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
              <input ref={el => inputRefs.current.fcNo = el} type="text" name="fcNo" value={formData.fcNo} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'fcNo')} placeholder="Enter F/C No." />
            </div>

            <div className="process-form-group">
              <label>Heat No</label>
              <input ref={el => inputRefs.current.heatNo = el} type="text" name="heatNo" value={formData.heatNo} onChange={handleChange} onKeyDown={e => handleKeyDown(e, 'heatNo')} placeholder="Enter Heat No" />
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
        <button onClick={handleSubmit} className="process-submit-btn" type="button">
          <Save size={18} />
          Submit Entry
        </button>
      </div>

      <div className="process-reset-container">
        <button onClick={handleReset} className="process-reset-btn">
          <RefreshCw size={18} />
          Reset
        </button>
      </div>
    </>
  );
}