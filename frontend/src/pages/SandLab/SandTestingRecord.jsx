import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RefreshCw, FileText } from 'lucide-react';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/SandTestingRecord.css';

const initialFormData = {
  date: new Date().toISOString().split('T')[0],
  sandShifts: {
    shiftI: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: { bentonite: '' } },
    shiftII: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: { coalDust: '', Premix: '' } },
    shiftIII: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: { coalDust: '', Premix: '' } }
  },
  clayShifts: {
    shiftI: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
    ShiftII: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
    ShiftIII: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' }
  },
  mixshifts: {
    ShiftI: { mixno: { start: '', end: '', total: '' }, numberOfMixRejected: '', returnSandHopperLevel: '' },
    ShiftII: { mixno: { start: '', end: '', total: '' }, numberOfMixRejected: '', returnSandHopperLevel: '' },
    ShiftIII: { mixno: { start: '', end: '', total: '' }, numberOfMixRejected: '', returnSandHopperLevel: '' }
  },
  sandLump: '',
  newSandWt: '',
  sandFriability: { shiftI: '', shiftII: '', shiftIII: '' },
  testParameter: {
    sno: '', time: '', mixno: '', permeability: '', gcsFdyA: '', gcsFdyB: '', wts: '', moisture: '',
    compactability: '', compressibility: '', waterLitre: '', sandTemp: { BC: '', WU: '', SSUmax: '' },
    newSandKgs: '', mould: '', bentoniteWithPremix: { Kgs: '', Percent: '' },
    bentonite: { Kgs: '', Percent: '' }, premix: { Kgs: '', Percent: '' },
    coalDust: { Kgs: '', Percent: '' }, lc: '', CompactabilitySettings: '',
    mouldStrength: '', shearStrengthSetting: '', preparedSandlumps: '', itemName: '', remarks: ''
  }
};

const SandTestingRecord = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
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
    setFormData(initialFormData);
  };

  const handleViewReport = () => {
    navigate('/sand-lab/sand-testing-record/report');
  };

  const InputField = ({ label, value, onChange, type = "text", placeholder = "" }) => (
    <div className="sand-form-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="sand-header">
        <div className="sand-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Sand Testing Record - Entry Form
          </h2>
        </div>
        <div className="sand-header-buttons">
          <button className="sand-view-report-btn" onClick={handleViewReport} type="button">
            <div className="sand-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="sand-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

        <form onSubmit={handleSubmit} className="sand-form-grid">
          {/* Date Section */}
          <h3 className="sand-section-title">Basic Information</h3>
          <InputField label="Date" type="date" value={formData.date}
            onChange={(e) => handleChange(null, 'date', e.target.value)} />

          {/* Shift I */}
          <h3 className="sand-section-title">Shift I - Sand Data</h3>
          <InputField label="Remaining Sand (kgs)" value={formData.sandShifts.shiftI.rSand}
            onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'rSand')} placeholder="0" />
          <InputField label="New Sand (kgs)" value={formData.sandShifts.shiftI.nSand}
            onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'nSand')} placeholder="0" />
          <InputField label="Mixing Mode" value={formData.sandShifts.shiftI.mixingMode}
            onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'mixingMode')} placeholder="Enter mode" />
          <InputField label="Bentonite (kgs)" value={formData.sandShifts.shiftI.bentonite}
            onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'bentonite')} placeholder="0" />
          <InputField label="Coal Dust Premix" value={formData.sandShifts.shiftI.coalDustPremix}
            onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'coalDustPremix')} placeholder="Enter value" />
          <InputField label="Bentonite Batch No" value={formData.sandShifts.shiftI.batchNo.bentonite}
            onChange={(e) => handleChange('sandShifts', 'shiftI', e.target.value, 'batchNo', 'bentonite')} placeholder="Batch number" />

          {/* Shift II */}
          <h3 className="sand-section-title">Shift II - Sand Data</h3>
          <InputField label="Remaining Sand (kgs)" value={formData.sandShifts.shiftII.rSand}
            onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'rSand')} placeholder="0" />
          <InputField label="New Sand (kgs)" value={formData.sandShifts.shiftII.nSand}
            onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'nSand')} placeholder="0" />
          <InputField label="Mixing Mode" value={formData.sandShifts.shiftII.mixingMode}
            onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'mixingMode')} placeholder="Enter mode" />
          <InputField label="Bentonite (kgs)" value={formData.sandShifts.shiftII.bentonite}
            onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'bentonite')} placeholder="0" />
          <InputField label="Coal Dust Premix" value={formData.sandShifts.shiftII.coalDustPremix}
            onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'coalDustPremix')} placeholder="Enter value" />
          <InputField label="Coal Dust Batch No" value={formData.sandShifts.shiftII.batchNo.coalDust}
            onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'batchNo', 'coalDust')} placeholder="Batch number" />
          <InputField label="Premix Batch No" value={formData.sandShifts.shiftII.batchNo.Premix}
            onChange={(e) => handleChange('sandShifts', 'shiftII', e.target.value, 'batchNo', 'Premix')} placeholder="Batch number" />

          {/* Shift III */}
          <h3 className="sand-section-title">Shift III - Sand Data</h3>
          <InputField label="Remaining Sand (kgs)" value={formData.sandShifts.shiftIII.rSand}
            onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'rSand')} placeholder="0" />
          <InputField label="New Sand (kgs)" value={formData.sandShifts.shiftIII.nSand}
            onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'nSand')} placeholder="0" />
          <InputField label="Mixing Mode" value={formData.sandShifts.shiftIII.mixingMode}
            onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'mixingMode')} placeholder="Enter mode" />
          <InputField label="Bentonite (kgs)" value={formData.sandShifts.shiftIII.bentonite}
            onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'bentonite')} placeholder="0" />
          <InputField label="Coal Dust Premix" value={formData.sandShifts.shiftIII.coalDustPremix}
            onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'coalDustPremix')} placeholder="Enter value" />
          <InputField label="Coal Dust Batch No" value={formData.sandShifts.shiftIII.batchNo.coalDust}
            onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'batchNo', 'coalDust')} placeholder="Batch number" />
          <InputField label="Premix Batch No" value={formData.sandShifts.shiftIII.batchNo.Premix}
            onChange={(e) => handleChange('sandShifts', 'shiftIII', e.target.value, 'batchNo', 'Premix')} placeholder="Batch number" />

          {/* Clay Parameters */}
          <h3 className="sand-section-title">Clay Parameters - All Shifts</h3>
          <InputField label="Total Clay - Shift I" value={formData.clayShifts.shiftI.totalClay}
            onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'totalClay')} placeholder="0" />
          <InputField label="Total Clay - Shift II" value={formData.clayShifts.ShiftII.totalClay}
            onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'totalClay')} placeholder="0" />
          <InputField label="Total Clay - Shift III" value={formData.clayShifts.ShiftIII.totalClay}
            onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'totalClay')} placeholder="0" />
          <InputField label="Active Clay - Shift I" value={formData.clayShifts.shiftI.activeClay}
            onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'activeClay')} placeholder="0" />
          <InputField label="Active Clay - Shift II" value={formData.clayShifts.ShiftII.activeClay}
            onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'activeClay')} placeholder="0" />
          <InputField label="Active Clay - Shift III" value={formData.clayShifts.ShiftIII.activeClay}
            onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'activeClay')} placeholder="0" />
          <InputField label="Dead Clay - Shift I" value={formData.clayShifts.shiftI.deadClay}
            onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'deadClay')} placeholder="0" />
          <InputField label="Dead Clay - Shift II" value={formData.clayShifts.ShiftII.deadClay}
            onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'deadClay')} placeholder="0" />
          <InputField label="Dead Clay - Shift III" value={formData.clayShifts.ShiftIII.deadClay}
            onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'deadClay')} placeholder="0" />
          <InputField label="VCM - Shift I" value={formData.clayShifts.shiftI.vcm}
            onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'vcm')} placeholder="0" />
          <InputField label="VCM - Shift II" value={formData.clayShifts.ShiftII.vcm}
            onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'vcm')} placeholder="0" />
          <InputField label="VCM - Shift III" value={formData.clayShifts.ShiftIII.vcm}
            onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'vcm')} placeholder="0" />
          <InputField label="LOI - Shift I" value={formData.clayShifts.shiftI.loi}
            onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'loi')} placeholder="0" />
          <InputField label="LOI - Shift II" value={formData.clayShifts.ShiftII.loi}
            onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'loi')} placeholder="0" />
          <InputField label="LOI - Shift III" value={formData.clayShifts.ShiftIII.loi}
            onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'loi')} placeholder="0" />
          <InputField label="AFS No - Shift I" value={formData.clayShifts.shiftI.afsNo}
            onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'afsNo')} placeholder="0" />
          <InputField label="AFS No - Shift II" value={formData.clayShifts.ShiftII.afsNo}
            onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'afsNo')} placeholder="0" />
          <InputField label="AFS No - Shift III" value={formData.clayShifts.ShiftIII.afsNo}
            onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'afsNo')} placeholder="0" />
          <InputField label="Fines - Shift I" value={formData.clayShifts.shiftI.fines}
            onChange={(e) => handleChange('clayShifts', 'shiftI', e.target.value, 'fines')} placeholder="0" />
          <InputField label="Fines - Shift II" value={formData.clayShifts.ShiftII.fines}
            onChange={(e) => handleChange('clayShifts', 'ShiftII', e.target.value, 'fines')} placeholder="0" />
          <InputField label="Fines - Shift III" value={formData.clayShifts.ShiftIII.fines}
            onChange={(e) => handleChange('clayShifts', 'ShiftIII', e.target.value, 'fines')} placeholder="0" />

          {/* Mix Shifts */}
          <h3 className="sand-section-title">Mix Shifts - Timing & Hopper Levels</h3>
          {['ShiftI', 'ShiftII', 'ShiftIII'].map((shift) => (
            <React.Fragment key={shift}>
              <InputField label={`${shift} - Start Mix`} value={formData.mixshifts[shift].mixno.start}
                onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'mixno', 'start')} placeholder="Start" />
              <InputField label={`${shift} - End Mix`} value={formData.mixshifts[shift].mixno.end}
                onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'mixno', 'end')} placeholder="End" />
              <InputField label={`${shift} - Total`} value={formData.mixshifts[shift].mixno.total}
                onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'mixno', 'total')} placeholder="Total" />
              <InputField label={`${shift} - Mix Rejected`} type="number" value={formData.mixshifts[shift].numberOfMixRejected}
                onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'numberOfMixRejected')} placeholder="0" />
              <InputField label={`${shift} - Hopper Level`} type="number" value={formData.mixshifts[shift].returnSandHopperLevel}
                onChange={(e) => handleChange('mixshifts', shift, e.target.value, 'returnSandHopperLevel')} placeholder="0" />
            </React.Fragment>
          ))}

          {/* Sand Properties */}
          <h3 className="sand-section-title">Sand Properties</h3>
          <InputField label="Sand Lump" value={formData.sandLump}
            onChange={(e) => handleChange(null, 'sandLump', e.target.value)} placeholder="Enter value" />
          <InputField label="New Sand Weight" value={formData.newSandWt}
            onChange={(e) => handleChange(null, 'newSandWt', e.target.value)} placeholder="0" />
          <InputField label="Friability - Shift I" value={formData.sandFriability.shiftI}
            onChange={(e) => handleChange('sandFriability', 'shiftI', e.target.value)} placeholder="0" />
          <InputField label="Friability - Shift II" value={formData.sandFriability.shiftII}
            onChange={(e) => handleChange('sandFriability', 'shiftII', e.target.value)} placeholder="0" />
          <InputField label="Friability - Shift III" value={formData.sandFriability.shiftIII}
            onChange={(e) => handleChange('sandFriability', 'shiftIII', e.target.value)} placeholder="0" />

          {/* Test Parameters */}
          <h3 className="sand-section-title">Test Parameters</h3>
          <InputField label="S.No" type="number" value={formData.testParameter.sno}
            onChange={(e) => handleChange('testParameter', 'sno', e.target.value)} placeholder="0" />
          <InputField label="Time" type="number" value={formData.testParameter.time}
            onChange={(e) => handleChange('testParameter', 'time', e.target.value)} placeholder="0" />
          <InputField label="Mix No" type="number" value={formData.testParameter.mixno}
            onChange={(e) => handleChange('testParameter', 'mixno', e.target.value)} placeholder="0" />
          <InputField label="Mould" type="number" value={formData.testParameter.mould}
            onChange={(e) => handleChange('testParameter', 'mould', e.target.value)} placeholder="0" />
          <InputField label="Permeability" type="number" value={formData.testParameter.permeability}
            onChange={(e) => handleChange('testParameter', 'permeability', e.target.value)} placeholder="0" />
          <InputField label="GCS FDY-A" type="number" value={formData.testParameter.gcsFdyA}
            onChange={(e) => handleChange('testParameter', 'gcsFdyA', e.target.value)} placeholder="0" />
          <InputField label="GCS FDY-B" type="number" value={formData.testParameter.gcsFdyB}
            onChange={(e) => handleChange('testParameter', 'gcsFdyB', e.target.value)} placeholder="0" />
          <InputField label="WTS" type="number" value={formData.testParameter.wts}
            onChange={(e) => handleChange('testParameter', 'wts', e.target.value)} placeholder="0" />
          <InputField label="Moisture (%)" type="number" value={formData.testParameter.moisture}
            onChange={(e) => handleChange('testParameter', 'moisture', e.target.value)} placeholder="0" />
          <InputField label="Compactability (%)" type="number" value={formData.testParameter.compactability}
            onChange={(e) => handleChange('testParameter', 'compactability', e.target.value)} placeholder="0" />
          <InputField label="Compressibility" type="number" value={formData.testParameter.compressibility}
            onChange={(e) => handleChange('testParameter', 'compressibility', e.target.value)} placeholder="0" />
          <InputField label="Water (Litre)" type="number" value={formData.testParameter.waterLitre}
            onChange={(e) => handleChange('testParameter', 'waterLitre', e.target.value)} placeholder="0" />
          <InputField label="Sand Temp BC (°C)" type="number" value={formData.testParameter.sandTemp.BC}
            onChange={(e) => handleChange('testParameter', 'sandTemp', e.target.value, 'BC')} placeholder="0" />
          <InputField label="Sand Temp WU (°C)" type="number" value={formData.testParameter.sandTemp.WU}
            onChange={(e) => handleChange('testParameter', 'sandTemp', e.target.value, 'WU')} placeholder="0" />
          <InputField label="Sand Temp SSUmax (°C)" type="number" value={formData.testParameter.sandTemp.SSUmax}
            onChange={(e) => handleChange('testParameter', 'sandTemp', e.target.value, 'SSUmax')} placeholder="0" />
          <InputField label="New Sand (Kgs)" type="number" value={formData.testParameter.newSandKgs}
            onChange={(e) => handleChange('testParameter', 'newSandKgs', e.target.value)} placeholder="0" />
          <InputField label="Bentonite w/ Premix (Kgs)" type="number" value={formData.testParameter.bentoniteWithPremix.Kgs}
            onChange={(e) => handleChange('testParameter', 'bentoniteWithPremix', e.target.value, 'Kgs')} placeholder="0" />
          <InputField label="Bentonite w/ Premix (%)" type="number" value={formData.testParameter.bentoniteWithPremix.Percent}
            onChange={(e) => handleChange('testParameter', 'bentoniteWithPremix', e.target.value, 'Percent')} placeholder="0" />
          <InputField label="Bentonite (Kgs)" type="number" value={formData.testParameter.bentonite.Kgs}
            onChange={(e) => handleChange('testParameter', 'bentonite', e.target.value, 'Kgs')} placeholder="0" />
          <InputField label="Bentonite (%)" type="number" value={formData.testParameter.bentonite.Percent}
            onChange={(e) => handleChange('testParameter', 'bentonite', e.target.value, 'Percent')} placeholder="0" />
          <InputField label="Premix (Kgs)" type="number" value={formData.testParameter.premix.Kgs}
            onChange={(e) => handleChange('testParameter', 'premix', e.target.value, 'Kgs')} placeholder="0" />
          <InputField label="Premix (%)" type="number" value={formData.testParameter.premix.Percent}
            onChange={(e) => handleChange('testParameter', 'premix', e.target.value, 'Percent')} placeholder="0" />
          <InputField label="Coal Dust (Kgs)" type="number" value={formData.testParameter.coalDust.Kgs}
            onChange={(e) => handleChange('testParameter', 'coalDust', e.target.value, 'Kgs')} placeholder="0" />
          <InputField label="Coal Dust (%)" type="number" value={formData.testParameter.coalDust.Percent}
            onChange={(e) => handleChange('testParameter', 'coalDust', e.target.value, 'Percent')} placeholder="0" />
          <InputField label="LC" type="number" value={formData.testParameter.lc}
            onChange={(e) => handleChange('testParameter', 'lc', e.target.value)} placeholder="0" />
          <InputField label="Compactability Settings" type="number" value={formData.testParameter.CompactabilitySettings}
            onChange={(e) => handleChange('testParameter', 'CompactabilitySettings', e.target.value)} placeholder="0" />
          <InputField label="Mould Strength" type="number" value={formData.testParameter.mouldStrength}
            onChange={(e) => handleChange('testParameter', 'mouldStrength', e.target.value)} placeholder="0" />
          <InputField label="Shear Strength Setting" type="number" value={formData.testParameter.shearStrengthSetting}
            onChange={(e) => handleChange('testParameter', 'shearStrengthSetting', e.target.value)} placeholder="0" />
          <InputField label="Prepared Sand Lumps" type="number" value={formData.testParameter.preparedSandlumps}
            onChange={(e) => handleChange('testParameter', 'preparedSandlumps', e.target.value)} placeholder="0" />

          {/* Remarks */}
          <h3 className="sand-section-title">Additional Information</h3>
          <div className="sand-form-group full-width">
            <label>Item Name</label>
            <input
              type="text"
              value={formData.testParameter.itemName}
              onChange={(e) => handleChange('testParameter', 'itemName', e.target.value)}
              placeholder="Enter item name"
            />
          </div>
          <div className="sand-form-group full-width">
            <label>Remarks</label>
            <textarea
              value={formData.testParameter.remarks}
              onChange={(e) => handleChange('testParameter', 'remarks', e.target.value)}
              placeholder="Enter remarks..."
              rows="4"
            />
          </div>

      {/* Submit Button */}
      <div className="sand-submit-container">
        <button onClick={handleSubmit} disabled={submitLoading} className="sand-submit-btn" type="button">
          {submitLoading ? 'Saving...' : (
            <>
              <Save size={18} />
              Submit Record
            </>
          )}
        </button>
      </div>
      </form>

      <div className="sand-reset-container">
        <button onClick={handleReset} className="sand-reset-btn">
          <RefreshCw size={18} />
          Reset
        </button>
      </div>
    </>
  );
};

export default SandTestingRecord;
