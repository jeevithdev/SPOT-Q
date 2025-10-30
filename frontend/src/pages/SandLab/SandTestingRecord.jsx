import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, FileText } from 'lucide-react';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/SandTestingRecord.css';

const SandTestingRecord = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sandShifts: {
      shiftI: {
        rSand: '',
        nSand: '',
        mixingMode: '',
        bentonite: '',
        coalDustPremix: '',
        batchNo: { bentonite: '' }
      },
      shiftII: {
        rSand: '',
        nSand: '',
        mixingMode: '',
        bentonite: '',
        coalDustPremix: '',
        batchNo: { coalDust: '', Premix: '' }
      },
      shiftIII: {
        rSand: '',
        nSand: '',
        mixingMode: '',
        bentonite: '',
        coalDustPremix: '',
        batchNo: { coalDust: '', Premix: '' }
      }
    },
    clayShifts: {
      shiftI: {
        totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: ''
      },
      ShiftII: {
        totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: ''
      },
      ShiftIII: {
        totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: ''
      }
    },
    mixshifts: {
      ShiftI: {
        mixno: { start: '', end: '', total: '' },
        numberOfMixRejected: '',
        returnSandHopperLevel: ''
      },
      ShiftII: {
        mixno: { start: '', end: '', total: '' },
        numberOfMixRejected: '',
        returnSandHopperLevel: ''
      },
      ShiftIII: {
        mixno: { start: '', end: '', total: '' },
        numberOfMixRejected: '',
        returnSandHopperLevel: ''
      }
    },
    sandLump: '',
    newSandWt: '',
    sandFriability: {
      shiftI: '',
      shiftII: '',
      shiftIII: ''
    },
    testParameter: {
      sno: '',
      time: '',
      mixno: '',
      permeability: '',
      gcsFdyA: '',
      gcsFdyB: '',
      wts: '',
      moisture: '',
      compactability: '',
      compressibility: '',
      waterLitre: '',
      sandTemp: { BC: '', WU: '', SSUmax: '' },
      newSandKgs: '',
      mould: '',
      bentoniteWithPremix: { Kgs: '', Percent: '' },
      bentonite: { Kgs: '', Percent: '' },
      premix: { Kgs: '', Percent: '' },
      coalDust: { Kgs: '', Percent: '' },
      lc: '',
      CompactabilitySettings: '',
      mouldStrength: '',
      shearStrengthSetting: '',
      preparedSandlumps: '',
      itemName: '',
      remarks: ''
    }
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (section, field, value, nestedField = null, deepNested = null) => {
    setFormData(prev => {
      if (deepNested) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: {
              ...prev[section][field],
              [nestedField]: {
                ...prev[section][field][nestedField],
                [deepNested]: value
              }
            }
          }
        };
      } else if (nestedField) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: {
              ...prev[section][field],
              [nestedField]: value
            }
          }
        };
      } else if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const response = await api.post('/v1/sand-testing-records', formData);
      if (response.success) {
        alert('Sand Testing Record saved successfully!');
        handleReset();
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      console.error('Error saving sand testing record:', error);
      alert('Failed to save sand testing record. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset the entire form?')) return;
    window.location.reload();
  };

  const InputField = ({ label, value, onChange, type = "text", placeholder = "" }) => (
    <div className="sand-input-group">
      <label className="sand-input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="sand-input-field"
      />
    </div>
  );

  return (
    <div className="sand-page-wrapper">
      <div className="sand-container">
        {/* Header */}
        <div className="sand-header-section">
          <div className="sand-header-content">
            <h1 className="sand-page-title">SAND TESTING RECORD</h1>
            <p className="sand-page-subtitle">Sand Laboratory Quality Control Parameters</p>
          </div>
          <div className="sand-header-actions">
            <button type="button" onClick={handleReset} className="sand-reset-btn" disabled={submitLoading}>
              <RotateCcw size={18} />
              Reset Form
            </button>
            <button type="button" onClick={() => navigate('/sand-lab/sand-testing-record/report')} className="sand-reports-btn">
              <FileText size={18} />
              View Reports
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="sand-form-content">
          {/* Date */}
          <div className="sand-section">
            <div className="sand-form-row">
              <InputField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange(null, 'date', e.target.value)}
              />
            </div>
          </div>

          {/* Shift I Data */}
          <div className="sand-section">
            <h3 className="sand-section-heading">Shift I</h3>
            <div className="sand-form-grid">
              <InputField label="Remaining Sand (kgs)" value={formData.sandShifts.shiftI.rSand}
                onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'rSand')} />
              <InputField label="New Sand (kgs)" value={formData.sandShifts.shiftI.nSand}
                onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'nSand')} />
              <InputField label="Mixing Mode" value={formData.sandShifts.shiftI.mixingMode}
                onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'mixingMode')} />
              <InputField label="Bentonite (kgs)" value={formData.sandShifts.shiftI.bentonite}
                onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'bentonite')} />
              <InputField label="Coal Dust Premix" value={formData.sandShifts.shiftI.coalDustPremix}
                onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'coalDustPremix')} />
              <InputField label="Bentonite Batch No" value={formData.sandShifts.shiftI.batchNo.bentonite}
                onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'batchNo', 'bentonite')} />
            </div>
          </div>

          {/* Shift II Data */}
          <div className="sand-section">
            <h3 className="sand-section-heading">Shift II</h3>
            <div className="sand-form-grid">
              <InputField label="Remaining Sand (kgs)" value={formData.sandShifts.shiftII.rSand}
                onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'rSand')} />
              <InputField label="New Sand (kgs)" value={formData.sandShifts.shiftII.nSand}
                onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'nSand')} />
              <InputField label="Mixing Mode" value={formData.sandShifts.shiftII.mixingMode}
                onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'mixingMode')} />
              <InputField label="Bentonite (kgs)" value={formData.sandShifts.shiftII.bentonite}
                onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'bentonite')} />
              <InputField label="Coal Dust Premix" value={formData.sandShifts.shiftII.coalDustPremix}
                onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'coalDustPremix')} />
              <InputField label="Coal Dust Batch No" value={formData.sandShifts.shiftII.batchNo.coalDust}
                onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'batchNo', 'coalDust')} />
              <InputField label="Premix Batch No" value={formData.sandShifts.shiftII.batchNo.Premix}
                onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'batchNo', 'Premix')} />
            </div>
          </div>

          {/* Shift III Data */}
          <div className="sand-section">
            <h3 className="sand-section-heading">Shift III</h3>
            <div className="sand-form-grid">
              <InputField label="Remaining Sand (kgs)" value={formData.sandShifts.shiftIII.rSand}
                onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'rSand')} />
              <InputField label="New Sand (kgs)" value={formData.sandShifts.shiftIII.nSand}
                onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'nSand')} />
              <InputField label="Mixing Mode" value={formData.sandShifts.shiftIII.mixingMode}
                onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'mixingMode')} />
              <InputField label="Bentonite (kgs)" value={formData.sandShifts.shiftIII.bentonite}
                onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'bentonite')} />
              <InputField label="Coal Dust Premix" value={formData.sandShifts.shiftIII.coalDustPremix}
                onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'coalDustPremix')} />
              <InputField label="Coal Dust Batch No" value={formData.sandShifts.shiftIII.batchNo.coalDust}
                onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'batchNo', 'coalDust')} />
              <InputField label="Premix Batch No" value={formData.sandShifts.shiftIII.batchNo.Premix}
                onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'batchNo', 'Premix')} />
            </div>
          </div>

          {/* Clay Parameters */}
          <div className="sand-section">
            <h3 className="sand-section-heading">Clay Parameters</h3>
            <div className="sand-form-grid">
              <InputField label="Total Clay - Shift I" value={formData.clayShifts.shiftI.totalClay}
                onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'totalClay')} />
              <InputField label="Total Clay - Shift II" value={formData.clayShifts.ShiftII.totalClay}
                onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'totalClay')} />
              <InputField label="Total Clay - Shift III" value={formData.clayShifts.ShiftIII.totalClay}
                onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'totalClay')} />
              <InputField label="Active Clay - Shift I" value={formData.clayShifts.shiftI.activeClay}
                onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'activeClay')} />
              <InputField label="Active Clay - Shift II" value={formData.clayShifts.ShiftII.activeClay}
                onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'activeClay')} />
              <InputField label="Active Clay - Shift III" value={formData.clayShifts.ShiftIII.activeClay}
                onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'activeClay')} />
              <InputField label="Dead Clay - Shift I" value={formData.clayShifts.shiftI.deadClay}
                onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'deadClay')} />
              <InputField label="Dead Clay - Shift II" value={formData.clayShifts.ShiftII.deadClay}
                onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'deadClay')} />
              <InputField label="Dead Clay - Shift III" value={formData.clayShifts.ShiftIII.deadClay}
                onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'deadClay')} />
              <InputField label="VCM - Shift I" value={formData.clayShifts.shiftI.vcm}
                onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'vcm')} />
              <InputField label="VCM - Shift II" value={formData.clayShifts.ShiftII.vcm}
                onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'vcm')} />
              <InputField label="VCM - Shift III" value={formData.clayShifts.ShiftIII.vcm}
                onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'vcm')} />
              <InputField label="LOI - Shift I" value={formData.clayShifts.shiftI.loi}
                onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'loi')} />
              <InputField label="LOI - Shift II" value={formData.clayShifts.ShiftII.loi}
                onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'loi')} />
              <InputField label="LOI - Shift III" value={formData.clayShifts.ShiftIII.loi}
                onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'loi')} />
              <InputField label="AFS No - Shift I" value={formData.clayShifts.shiftI.afsNo}
                onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'afsNo')} />
              <InputField label="AFS No - Shift II" value={formData.clayShifts.ShiftII.afsNo}
                onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'afsNo')} />
              <InputField label="AFS No - Shift III" value={formData.clayShifts.ShiftIII.afsNo}
                onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'afsNo')} />
              <InputField label="Fines - Shift I" value={formData.clayShifts.shiftI.fines}
                onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'fines')} />
              <InputField label="Fines - Shift II" value={formData.clayShifts.ShiftII.fines}
                onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'fines')} />
              <InputField label="Fines - Shift III" value={formData.clayShifts.ShiftIII.fines}
                onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'fines')} />
            </div>
          </div>

          {/* Mix Shifts */}
          <div className="sand-section">
            <h3 className="sand-section-heading">Mix Shifts</h3>
            <div className="sand-form-grid">
              {['ShiftI', 'ShiftII', 'ShiftIII'].map((shift) => (
                <React.Fragment key={shift}>
                  <InputField label={`${shift} - Start Time`} value={formData.mixshifts[shift].mixno.start}
                    onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'mixno', 'start')} />
                  <InputField label={`${shift} - End Time`} value={formData.mixshifts[shift].mixno.end}
                    onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'mixno', 'end')} />
                  <InputField label={`${shift} - Total Time`} value={formData.mixshifts[shift].mixno.total}
                    onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'mixno', 'total')} />
                  <InputField label={`${shift} - Mix Rejected`} type="number" value={formData.mixshifts[shift].numberOfMixRejected}
                    onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'numberOfMixRejected')} />
                  <InputField label={`${shift} - Hopper Level`} type="number" value={formData.mixshifts[shift].returnSandHopperLevel}
                    onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'returnSandHopperLevel')} />
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sand Properties */}
          <div className="sand-section">
            <h3 className="sand-section-heading">Sand Properties</h3>
            <div className="sand-form-grid">
              <InputField label="Sand Lump" value={formData.sandLump}
                onChange={(e) => handleChange(null, 'sandLump', e.target.value)} />
              <InputField label="New Sand Weight" value={formData.newSandWt}
                onChange={(e) => handleChange(null, 'newSandWt', e.target.value)} />
              <InputField label="Friability - Shift I" value={formData.sandFriability.shiftI}
                onChange={(e) => handleChange('sandFriability', 'shiftI', e.target.value)} />
              <InputField label="Friability - Shift II" value={formData.sandFriability.shiftII}
                onChange={(e) => handleChange('sandFriability', 'shiftII', e.target.value)} />
              <InputField label="Friability - Shift III" value={formData.sandFriability.shiftIII}
                onChange={(e) => handleChange('sandFriability', 'shiftIII', e.target.value)} />
            </div>
          </div>

          {/* Test Parameters */}
          <div className="sand-section">
            <h3 className="sand-section-heading">Test Parameters</h3>
            <div className="sand-form-grid">
              <InputField label="S.No" type="number" value={formData.testParameter.sno}
                onChange={(e) => handleChange('testParameter', 'sno', e.target.value)} />
              <InputField label="Time" type="number" value={formData.testParameter.time}
                onChange={(e) => handleChange('testParameter', 'time', e.target.value)} />
              <InputField label="Mix No" type="number" value={formData.testParameter.mixno}
                onChange={(e) => handleChange('testParameter', 'mixno', e.target.value)} />
              <InputField label="Mould" type="number" value={formData.testParameter.mould}
                onChange={(e) => handleChange('testParameter', 'mould', e.target.value)} />
              <InputField label="Permeability" type="number" value={formData.testParameter.permeability}
                onChange={(e) => handleChange('testParameter', 'permeability', e.target.value)} />
              <InputField label="GCS FDY-A" type="number" value={formData.testParameter.gcsFdyA}
                onChange={(e) => handleChange('testParameter', 'gcsFdyA', e.target.value)} />
              <InputField label="GCS FDY-B" type="number" value={formData.testParameter.gcsFdyB}
                onChange={(e) => handleChange('testParameter', 'gcsFdyB', e.target.value)} />
              <InputField label="WTS" type="number" value={formData.testParameter.wts}
                onChange={(e) => handleChange('testParameter', 'wts', e.target.value)} />
              <InputField label="Moisture (%)" type="number" value={formData.testParameter.moisture}
                onChange={(e) => handleChange('testParameter', 'moisture', e.target.value)} />
              <InputField label="Compactability (%)" type="number" value={formData.testParameter.compactability}
                onChange={(e) => handleChange('testParameter', 'compactability', e.target.value)} />
              <InputField label="Compressibility" type="number" value={formData.testParameter.compressibility}
                onChange={(e) => handleChange('testParameter', 'compressibility', e.target.value)} />
              <InputField label="Water (Litre)" type="number" value={formData.testParameter.waterLitre}
                onChange={(e) => handleChange('testParameter', 'waterLitre', e.target.value)} />
              <InputField label="Sand Temp BC (°C)" type="number" value={formData.testParameter.sandTemp.BC}
                onChange={(e) => handleChange('testParameter', 'sandTemp', e.target.value, 'BC')} />
              <InputField label="Sand Temp WU (°C)" type="number" value={formData.testParameter.sandTemp.WU}
                onChange={(e) => handleChange('testParameter', 'sandTemp', e.target.value, 'WU')} />
              <InputField label="Sand Temp SSUmax (°C)" type="number" value={formData.testParameter.sandTemp.SSUmax}
                onChange={(e) => handleChange('testParameter', 'sandTemp', e.target.value, 'SSUmax')} />
              <InputField label="New Sand (Kgs)" type="number" value={formData.testParameter.newSandKgs}
                onChange={(e) => handleChange('testParameter', 'newSandKgs', e.target.value)} />
              <InputField label="Bentonite w/ Premix (Kgs)" type="number" value={formData.testParameter.bentoniteWithPremix.Kgs}
                onChange={(e) => handleChange('testParameter', 'bentoniteWithPremix', e.target.value, 'Kgs')} />
              <InputField label="Bentonite w/ Premix (%)" type="number" value={formData.testParameter.bentoniteWithPremix.Percent}
                onChange={(e) => handleChange('testParameter', 'bentoniteWithPremix', e.target.value, 'Percent')} />
              <InputField label="Bentonite (Kgs)" type="number" value={formData.testParameter.bentonite.Kgs}
                onChange={(e) => handleChange('testParameter', 'bentonite', e.target.value, 'Kgs')} />
              <InputField label="Bentonite (%)" type="number" value={formData.testParameter.bentonite.Percent}
                onChange={(e) => handleChange('testParameter', 'bentonite', e.target.value, 'Percent')} />
              <InputField label="Premix (Kgs)" type="number" value={formData.testParameter.premix.Kgs}
                onChange={(e) => handleChange('testParameter', 'premix', e.target.value, 'Kgs')} />
              <InputField label="Premix (%)" type="number" value={formData.testParameter.premix.Percent}
                onChange={(e) => handleChange('testParameter', 'premix', e.target.value, 'Percent')} />
              <InputField label="Coal Dust (Kgs)" type="number" value={formData.testParameter.coalDust.Kgs}
                onChange={(e) => handleChange('testParameter', 'coalDust', e.target.value, 'Kgs')} />
              <InputField label="Coal Dust (%)" type="number" value={formData.testParameter.coalDust.Percent}
                onChange={(e) => handleChange('testParameter', 'coalDust', e.target.value, 'Percent')} />
              <InputField label="LC" type="number" value={formData.testParameter.lc}
                onChange={(e) => handleChange('testParameter', 'lc', e.target.value)} />
              <InputField label="Compactability Settings" type="number" value={formData.testParameter.CompactabilitySettings}
                onChange={(e) => handleChange('testParameter', 'CompactabilitySettings', e.target.value)} />
              <InputField label="Mould Strength" type="number" value={formData.testParameter.mouldStrength}
                onChange={(e) => handleChange('testParameter', 'mouldStrength', e.target.value)} />
              <InputField label="Shear Strength Setting" type="number" value={formData.testParameter.shearStrengthSetting}
                onChange={(e) => handleChange('testParameter', 'shearStrengthSetting', e.target.value)} />
              <InputField label="Prepared Sand Lumps" type="number" value={formData.testParameter.preparedSandlumps}
                onChange={(e) => handleChange('testParameter', 'preparedSandlumps', e.target.value)} />
            </div>
          </div>

          {/* Remarks */}
          <div className="sand-section">
            <h3 className="sand-section-heading">Remarks</h3>
            <div className="sand-form-grid">
              <div className="sand-input-group sand-full-width">
                <label className="sand-input-label">Item Name</label>
                <input
                  type="text"
                  value={formData.testParameter.itemName}
                  onChange={(e) => handleChange('testParameter', 'itemName', e.target.value)}
                  className="sand-input-field"
                />
              </div>
              <div className="sand-input-group sand-full-width">
                <label className="sand-input-label">Remarks</label>
                <textarea
                  value={formData.testParameter.remarks}
                  onChange={(e) => handleChange('testParameter', 'remarks', e.target.value)}
                  className="sand-textarea-field"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="sand-form-footer">
            <button type="submit" className="sand-submit-btn" disabled={submitLoading}>
              {submitLoading ? 'Saving...' : 'Submit Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SandTestingRecord;
