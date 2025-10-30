import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DatePicker, SubmitButton, ResetButton } from '../../Components/Buttons';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/SandTestingRecord.css';

const SandTestingRecord = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const SandTestingTabs = () => (
    <div className="sand-testing-tabs-container">
      <div className="sand-testing-tabs">
        <Link
          to="/sand-lab/sand-testing-record"
          className={`sand-testing-tab ${isActive('/sand-lab/sand-testing-record') ? 'active' : ''}`}
        >
          Data Entry
        </Link>
        <Link
          to="/sand-lab/sand-testing-record/report"
          className={`sand-testing-tab ${isActive('/sand-lab/sand-testing-record/report') ? 'active' : ''}`}
        >
          Report
        </Link>
      </div>
    </div>
  );

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shiftI: {
      rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '',
      batchNo: { bentonite: '', coalDustPremix: '' }
    },
    shiftII: {
      rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '',
      batchNo: { bentonite: '', coalDustPremix: '' }
    },
    shiftIII: {
      rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '',
      batchNo: { bentonite: '', coalDustPremix: '' }
    },
    clayShiftI: {
      totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: ''
    },
    clayShiftII: {
      totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: ''
    },
    clayShiftIII: {
      totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: ''
    },
    mixNoShiftI: {
      starterTime: '', endTime: '', totalMixingTime: '', mixRejected: '', hopper: ''
    },
    mixNoShiftII: {
      starterTime: '', endTime: '', totalMixingTime: '', mixRejected: '', hopper: ''
    },
    mixNoShiftIII: {
      starterTime: '', endTime: '', totalMixingTime: '', mixRejected: '', hopper: ''
    },
    sandLump: '',
    newSandWt: '',
    shiftIFriability: '',
    shiftIIFriability: '',
    shiftIIIFriability: '',
    testParameter: {
      permeability: '', gcsFdyA: '', gcsFdyB: '', wts: '', moisture: '',
      compactability: '', compressibility: '', waterLitre: '', sandTempBC: '',
      sandTempWU: '', sandTempSSU: '', newSandKgs: '', bentoniteKgs: '',
      bentonitePercent: '', premixKgs: '', premixPercent: '', coalDustKgs: '',
      coalDustPercent: '', lc: 'Lc', lcCompactSMCAt: '', mouldStrengthSNCAt: '',
      shearStrength: '', preparedSand: '', itemName: '', remarks: ''
    }
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (section, field, value, nestedField = null) => {
    setFormData(prev => {
      if (nestedField) {
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
    setFormData({
      date: new Date().toISOString().split('T')[0],
      shiftI: {
        rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '',
        batchNo: { bentonite: '', coalDustPremix: '' }
      },
      shiftII: {
        rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '',
        batchNo: { bentonite: '', coalDustPremix: '' }
      },
      shiftIII: {
        rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '',
        batchNo: { bentonite: '', coalDustPremix: '' }
      },
      clayShiftI: {
        totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: ''
      },
      clayShiftII: {
        totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: ''
      },
      clayShiftIII: {
        totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: ''
      },
      mixNoShiftI: {
        starterTime: '', endTime: '', totalMixingTime: '', mixRejected: '', hopper: ''
      },
      mixNoShiftII: {
        starterTime: '', endTime: '', totalMixingTime: '', mixRejected: '', hopper: ''
      },
      mixNoShiftIII: {
        starterTime: '', endTime: '', totalMixingTime: '', mixRejected: '', hopper: ''
      },
      sandLump: '',
      newSandWt: '',
      shiftIFriability: '',
      shiftIIFriability: '',
      shiftIIIFriability: '',
      testParameter: {
        permeability: '', gcsFdyA: '', gcsFdyB: '', wts: '', moisture: '',
        compactability: '', compressibility: '', waterLitre: '', sandTempBC: '',
        sandTempWU: '', sandTempSSU: '', newSandKgs: '', bentoniteKgs: '',
        bentonitePercent: '', premixKgs: '', premixPercent: '', coalDustKgs: '',
        coalDustPercent: '', lc: 'Lc', lcCompactSMCAt: '', mouldStrengthSNCAt: '',
        shearStrength: '', preparedSand: '', itemName: '', remarks: ''
      }
    });
  };

  return (
    <div className="sand-testing-container">
      <div className="sand-testing-wrapper">
        <SandTestingTabs />
        <div className="sand-testing-entry-container">
          <div className="sand-testing-header">
            <div className="sand-testing-header-text">
              <h2>Sand Testing Record - Entry Form</h2>
              <p>Record sand testing measurements and analysis</p>
            </div>

            <div className="date-input-container">
              <label htmlFor="date-input">Date:</label>
              <DatePicker
                name="date"
                value={formData.date}
                onChange={(e) => handleChange(null, 'date', e.target.value)}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="sand-testing-form">
            {/* Shift Data */}
            <div className="grid-top">
              {['I', 'II', 'III'].map((shift) => (
                <div key={shift} className="table-box">
                  <div className="table-header">Shift {shift}</div>
                  <div style={{ padding: '0.75rem' }}>
                    <label className="label">Remaining Sand (kgs)</label>
                    <input className="input-field" value={formData[`shift${shift}`].rSand} 
                      onChange={(e) => handleChange(`shift${shift}`, 'rSand', e.target.value)} />
                    
                    <label className="label">New Sand (kgs)</label>
                    <input className="input-field" value={formData[`shift${shift}`].nSand} 
                      onChange={(e) => handleChange(`shift${shift}`, 'nSand', e.target.value)} />
                    
                    <label className="label">Mixing Mode</label>
                    <input className="input-field" value={formData[`shift${shift}`].mixingMode} 
                      onChange={(e) => handleChange(`shift${shift}`, 'mixingMode', e.target.value)} />
                    
                    <label className="label">Bentonite (kgs)</label>
                    <input className="input-field" value={formData[`shift${shift}`].bentonite} 
                      onChange={(e) => handleChange(`shift${shift}`, 'bentonite', e.target.value)} />
                    
                    <label className="label">Coal Dust Premix</label>
                    <input className="input-field" value={formData[`shift${shift}`].coalDustPremix} 
                      onChange={(e) => handleChange(`shift${shift}`, 'coalDustPremix', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Clay Data */}
            <div className="grid-mid">
              <div>
                <div className="table-header">Clay Parameters</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  {['totalClay', 'activeClay', 'deadClay', 'vcm', 'loi', 'afsNo', 'fines'].map((param) => (
                    <div key={param} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      <label className="label">{param.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input className="input-field" placeholder="Shift I"
                        value={formData.clayShiftI[param]} 
                        onChange={(e) => handleChange('clayShiftI', param, e.target.value)} />
                      <input className="input-field" placeholder="Shift II"
                        value={formData.clayShiftII[param]} 
                        onChange={(e) => handleChange('clayShiftII', param, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mix Run Data */}
              <div>
                <div className="table-header">Mix Run Summary</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  {['starterTime', 'endTime', 'totalMixingTime', 'mixRejected', 'hopper'].map((param) => (
                    <div key={param} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      <label className="label">{param.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input className="input-field" placeholder="Shift I"
                        value={formData.mixNoShiftI[param]} 
                        onChange={(e) => handleChange('mixNoShiftI', param, e.target.value)} />
                      <input className="input-field" placeholder="Shift II"
                        value={formData.mixNoShiftII[param]} 
                        onChange={(e) => handleChange('mixNoShiftII', param, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Test Parameters */}
            <div className="grid-main">
              <div>
                <div className="table-header">Test Parameters</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  <div className="field-container">
                    <label className="label">Permeability</label>
                    <input className="input-field" value={formData.testParameter.permeability} 
                      onChange={(e) => handleChange('testParameter', 'permeability', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Moisture (%)</label>
                    <input className="input-field" value={formData.testParameter.moisture} 
                      onChange={(e) => handleChange('testParameter', 'moisture', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Compactability (%)</label>
                    <input className="input-field" value={formData.testParameter.compactability} 
                      onChange={(e) => handleChange('testParameter', 'compactability', e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <div className="table-header">Temperatures & Weights</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  <div className="field-container">
                    <label className="label">Sand Temp BC (°C)</label>
                    <input className="input-field" value={formData.testParameter.sandTempBC} 
                      onChange={(e) => handleChange('testParameter', 'sandTempBC', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">New Sand (Kgs)</label>
                    <input className="input-field" value={formData.testParameter.newSandKgs} 
                      onChange={(e) => handleChange('testParameter', 'newSandKgs', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Bentonite (Kgs)</label>
                    <input className="input-field" value={formData.testParameter.bentoniteKgs} 
                      onChange={(e) => handleChange('testParameter', 'bentoniteKgs', e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <div className="table-header">Remarks</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  <div className="field-container">
                    <label className="label">Item Name</label>
                    <input className="input-field" value={formData.testParameter.itemName} 
                      onChange={(e) => handleChange('testParameter', 'itemName', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Remarks</label>
                    <textarea className="textarea" rows="3" value={formData.testParameter.remarks} 
                      onChange={(e) => handleChange('testParameter', 'remarks', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="button-group">
              <ResetButton onClick={handleReset} disabled={submitLoading}>Reset Form</ResetButton>
              <SubmitButton onClick={handleSubmit} disabled={submitLoading} loading={submitLoading}>
                {submitLoading ? 'Saving...' : 'Save Sand Record'}
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SandTestingRecord;
