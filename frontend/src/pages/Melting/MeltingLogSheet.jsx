import React, { useState, useRef } from 'react';
import { Save, RefreshCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ValidationPopup from '../../Components/ValidationPopup';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/MeltingLogSheet.css';

const MeltingLogSheet = () => {
  const navigate = useNavigate();
  const inputRefs = useRef({});
  
  const initialFormData = {
    date: '',
    heatNo: '',
    grade: '',
    chargingTime: '',
    ifBath: '',
    liquidMetalPressPour: '',
    liquidMetalHolder: '',
    sgMsSteel: '',
    greyMsSteel: '',
    ralumsSg: '',
    gl: '',
    pigIron: '',
    borings: '',
    finalBath: '',
    charCoal: '',
    cpcFur: '',
    cpcLc: '',
    siliconCarbideFur: '',
    ferroSiliconFur: '',
    ferroSiliconLc: '',
    ferroManganeseFur: '',
    ferroManganeseLc: '',
    cu: '',
    cr: '',
    pureMg: '',
    ironPyrite: '',
    labCoinTime: '',
    labCoinTemp: '',
    deslagingFrom: '',
    deslagingTo: '',
    metalReadyTime: '',
    waitingFrom: '',
    waitingTo: '',
    waitingReason: '',
    tappingTime: '',
    tappingTemp: '',
    directFurnace: '',
    holderToFurnace: '',
    furnaceToHolder: '',
    disaNo: '',
    item: '',
    f1Kw: '',
    f1V: '',
    f1A: '',
    f1Gld: '',
    f1Hz: '',
    f1BelowKw: '',
    f1BelowA: '',
    f1BelowV: '',
    f2Kw: '',
    f2V: '',
    f2A: '',
    f2Gld: '',
    f2Hz: '',
    f2BelowKw: '',
    f2BelowA: '',
    f2BelowV: '',
    f3Kw: '',
    f3V: '',
    f3A: '',
    f3Gld: '',
    f3Hz: '',
    f3BelowKw: '',
    f3BelowA: '',
    f3BelowV: '',
    f4Kw: '',
    f4V: '',
    f4A: '',
    f4Gld: '',
    f4Hz: '',
    f4BelowHz: '',
    f4BelowGld: '',
    f4BelowGld1: '',
    remarks: ''
  };

  // Form field configurations for each section
  const formSections = [
    {
      title: 'Table 1',
      fields: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'heatNo', label: 'Heat No', type: 'text' },
        { name: 'grade', label: 'Grade', type: 'text' },
        { name: 'chargingTime', label: 'Charging Time', type: 'time' },
        { name: 'ifBath', label: 'If Bath', type: 'number', step: '0.1' },
        { name: 'liquidMetalPressPour', label: 'Liquid Metal Press Pour (kgs)', type: 'number', step: '0.1' },
        { name: 'liquidMetalHolder', label: 'Liquid Metal Holder (kgs)', type: 'number', step: '0.1' },
        { name: 'sgMsSteel', label: 'SG-MS Steel (kgs)', type: 'number', step: '0.1' },
        { name: 'greyMsSteel', label: 'Grey MS Steel (kgs)', type: 'number', step: '0.1' },
        { name: 'ralumsSg', label: 'Ralums SG (kgs)', type: 'number', step: '0.1' },
        { name: 'gl', label: 'GL (kgs)', type: 'number', step: '0.1' },
        { name: 'pigIron', label: 'Pig Iron (kgs)', type: 'number', step: '0.1' },
        { name: 'borings', label: 'Borings (kgs)', type: 'number', step: '0.1' },
        { name: 'finalBath', label: 'Final Bath (kgs)', type: 'number', step: '0.1' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    },
    {
      title: 'Table 2',
      fields: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'charCoal', label: 'Char Coal (kgs)', type: 'number', step: '0.1' },
        { name: 'cpcFur', label: 'CPC FUR (kgs)', type: 'number', step: '0.1' },
        { name: 'cpcLc', label: 'CPC L/C (kgs)', type: 'number', step: '0.1' },
        { name: 'siliconCarbideFur', label: 'Silicon Carbide FUR (kgs)', type: 'number', step: '0.1' },
        { name: 'ferroSiliconFur', label: 'Ferro Silicon FUR (kgs)', type: 'number', step: '0.1' },
        { name: 'ferroSiliconLc', label: 'Ferro Silicon L/C (kgs)', type: 'number', step: '0.1' },
        { name: 'ferroManganeseFur', label: 'Ferro Manganese FUR (kgs)', type: 'number', step: '0.1' },
        { name: 'ferroManganeseLc', label: 'Ferro Manganese L/C (kgs)', type: 'number', step: '0.1' },
        { name: 'cu', label: 'CU (kgs)', type: 'number', step: '0.01' },
        { name: 'cr', label: 'CR (kgs)', type: 'number', step: '0.01' },
        { name: 'pureMg', label: 'Pure MG (kgs)', type: 'number', step: '0.01' },
        { name: 'ironPyrite', label: 'Iron Pyrite (kgs)', type: 'number', step: '0.1' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    },
    {
      title: 'Table 3',
      fields: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'labCoinTime', label: 'Lab Coin Time', type: 'time' },
        { name: 'labCoinTemp', label: 'Lab Coin Temp (°C)', type: 'number', step: '0.1' },
        { name: 'deslagingFrom', label: 'Deslaging From', type: 'time' },
        { name: 'deslagingTo', label: 'Deslaging To', type: 'time' },
        { name: 'metalReadyTime', label: 'Metal Ready Time', type: 'time' },
        { name: 'waitingFrom', label: 'Waiting From', type: 'time' },
        { name: 'waitingTo', label: 'Waiting To', type: 'time' },
        { name: 'waitingReason', label: 'Waiting Reason', type: 'text' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    },
    {
      title: 'Metal Tapping',
      fields: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'tappingTime', label: 'Tapping Time', type: 'time' },
        { name: 'tappingTemp', label: 'Tapping Temp (°C)', type: 'number', step: '0.1' },
        { name: 'directFurnace', label: 'Direct Furnace (kgs)', type: 'number', step: '0.1' },
        { name: 'holderToFurnace', label: 'Holder to Furnace (kgs)', type: 'number', step: '0.1' },
        { name: 'furnaceToHolder', label: 'Furnace to Holder (kgs)', type: 'number', step: '0.1' },
        { name: 'disaNo', label: 'Disa No', type: 'text' },
        { name: 'item', label: 'Item', type: 'text' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    },
    {
      title: 'Electrical Readings',
      fields: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'f1Kw', label: 'F1 KW', type: 'number', step: '0.1' },
        { name: 'f1V', label: 'F1 V', type: 'number', step: '0.1' },
        { name: 'f1A', label: 'F1 A', type: 'number', step: '0.1' },
        { name: 'f1Gld', label: 'F1 GLD', type: 'number', step: '0.1' },
        { name: 'f1Hz', label: 'F1 HZ', type: 'number', step: '0.1' },
        { name: 'f1BelowKw', label: 'F1 Below KW', type: 'number', step: '0.1' },
        { name: 'f1BelowA', label: 'F1 Below A', type: 'number', step: '0.1' },
        { name: 'f1BelowV', label: 'F1 Below V', type: 'number', step: '0.1' },
        { name: 'f2Kw', label: 'F2 KW', type: 'number', step: '0.1' },
        { name: 'f2V', label: 'F2 V', type: 'number', step: '0.1' },
        { name: 'f2A', label: 'F2 A', type: 'number', step: '0.1' },
        { name: 'f2Gld', label: 'F2 GLD', type: 'number', step: '0.1' },
        { name: 'f2Hz', label: 'F2 HZ', type: 'number', step: '0.1' },
        { name: 'f2BelowKw', label: 'F2 Below KW', type: 'number', step: '0.1' },
        { name: 'f2BelowA', label: 'F2 Below A', type: 'number', step: '0.1' },
        { name: 'f2BelowV', label: 'F2 Below V', type: 'number', step: '0.1' },
        { name: 'f3Kw', label: 'F3 KW', type: 'number', step: '0.1' },
        { name: 'f3V', label: 'F3 V', type: 'number', step: '0.1' },
        { name: 'f3A', label: 'F3 A', type: 'number', step: '0.1' },
        { name: 'f3Gld', label: 'F3 GLD', type: 'number', step: '0.1' },
        { name: 'f3Hz', label: 'F3 HZ', type: 'number', step: '0.1' },
        { name: 'f3BelowKw', label: 'F3 Below KW', type: 'number', step: '0.1' },
        { name: 'f3BelowA', label: 'F3 Below A', type: 'number', step: '0.1' },
        { name: 'f3BelowV', label: 'F3 Below V', type: 'number', step: '0.1' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    },
    {
      title: 'Furnace 4',
      fields: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'f4Kw', label: 'F4 KW', type: 'number', step: '0.1' },
        { name: 'f4V', label: 'F4 V', type: 'number', step: '0.1' },
        { name: 'f4A', label: 'F4 A', type: 'number', step: '0.1' },
        { name: 'f4Gld', label: 'F4 GLD', type: 'number', step: '0.1' },
        { name: 'f4Hz', label: 'F4 HZ', type: 'number', step: '0.1' },
        { name: 'f4BelowHz', label: 'F4 Below HZ', type: 'number', step: '0.1' },
        { name: 'f4BelowGld', label: 'F4 Below GLD', type: 'number', step: '0.1' },
        { name: 'f4BelowGld1', label: 'F4 Below GLD1', type: 'number', step: '0.1' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    }
  ];

  // Flatten all fields for keyboard navigation
  const allFields = formSections.flatMap(section => section.fields.map(f => f.name));

  const [formData, setFormData] = useState({ ...initialFormData });
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const idx = allFields.indexOf(field);
      if (idx < allFields.length - 1) {
        inputRefs.current[allFields[idx + 1]]?.focus();
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    const required = ['date', 'heatNo', 'grade', 'chargingTime'];
    const missing = [];
    
    required.forEach(field => {
      if (!formData[field]) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      setMissingFields(missing.map(f => `Field: ${f}`));
      setShowMissingFields(true);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/melting-logs', formData);
      
      if (data.success) {
        alert('Melting log entry created successfully!');
        handleReset();
      }
    } catch (error) {
      console.error('Error creating melting log:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...initialFormData });
    inputRefs.current.date?.focus();
  };

  const renderFormSection = (section) => {
    return (
      <div className="melting-log-section" key={section.title}>
        <h3 className="melting-log-section-title">{section.title}</h3>
        <div className="melting-log-form-grid">
          {section.fields.map((field) => (
            <div className="melting-log-form-group" key={field.name} style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
              <label>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  ref={el => inputRefs.current[field.name] = el}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                  rows="4"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              ) : (
                <input
                  ref={el => inputRefs.current[field.name] = el}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, field.name)}
                  step={field.step || 'any'}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {showMissingFields && (
        <ValidationPopup
          missingFields={missingFields}
          onClose={() => setShowMissingFields(false)}
        />
      )}

      <div className="melting-log-header">
        <div className="melting-log-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Melting Log Sheet - Entry Form
          </h2>
        </div>
        <div className="melting-log-header-buttons">
          <button className="melting-log-view-report-btn" onClick={() => navigate('/melting/melting-log-sheet/report')} type="button">
            <div className="melting-log-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="melting-log-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

      {formSections.map(section => renderFormSection(section))}

          <div className="melting-log-submit-container">
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="melting-log-submit-btn"
              type="button"
            >
              {submitLoading ? <Loader size={20} /> : <Save size={18} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </button>
          </div>

      <div className="melting-log-reset-container">
        <button onClick={handleReset} className="melting-log-reset-btn">
          <RefreshCw size={18} />
          Reset
        </button>
      </div>
    </>
  );
};

export default MeltingLogSheet;
