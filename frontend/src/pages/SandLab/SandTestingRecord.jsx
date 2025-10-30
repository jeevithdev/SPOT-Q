import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DatePicker, SubmitButton, ResetButton } from '../../Components/Buttons';
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
    shiftData: {
      shift1: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
      shift2: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
      shift3: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },

      clay: {
        totalClayI: '', totalClayII: '', totalClayIII: '',
        activeClayI: '', activeClayII: '', activeClayIII: '',
        deadClayI: '', deadClayII: '', deadClayIII: '',
        vcmI: '', vcmII: '', vcmIII: '',
        loiI: '', loiII: '', loiIII: '',
        afsNoI: '', afsNoII: '', afsNoIII: '',
        finesI: '', finesII: '', finesIII: '',
      },

      mixRun: {
        start1: '', end1: '', total1: '', rejected1: '', hopper1: '',
        start2: '', end2: '', total2: '', rejected2: '', hopper2: '',
        start3: '', end3: '', total3: '', rejected3: '', hopper3: '',
        overallStart: '', overallEnd: '', overallTotal: '', overallRejected: '', overallHopper: ''
      },

      friability: { shiftI: '', shiftII: '', shiftIII: '' },

      sandLumps: {
        sandLumpsI: '', sandLumpsII: '', sandLumpsIII: '', sandLumpsTotal: '',
        newSandWtI: '', newSandWtII: '', newSandWtIII: '', newSandWtTotal: ''
      }
    },

    time: '', mixNo: '', permeability: '', gcsFdyA: '', gcsFdyB: '', wts: '',
    moisture: '', compactability: '', compressibility: '', waterLitre: '',
    sandTempBC: '', sandTempWU: '', sandTempSSU: '', newSandKgs: '',
    bentoniteKgs: '', bentonitePercent: '', premixKgs: '', premixPercent: '',
    coalDustKgs: '', coalDustPercent: '',
    bentoniteDropdown: '',
    premixDropdown: '',
    lcDropdown: '',
    lcValue: '',
    mouldDropdown: '',
    mouldValue: '',
    lcCompactSMC: '', lcCompactAt1: '',
    mouldStrengthSMC: '', shearStrengthAt: '', preparedSandLumps: '',
    itemName: '', remarks: ''
  });

  const [selectedGcsType, setSelectedGcsType] = useState('FDY-A');

  const handleMainChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleShiftDataChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      shiftData: {
        ...prev.shiftData,
        [section]: { ...prev.shiftData[section], [field]: value }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Sand Testing Record Submitted!');
  };

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset the entire form?')) return;
    setFormData({
      date: new Date().toISOString().split('T')[0],
      // Reset all fields to empty values...
      shiftData: {
        shift1: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
        shift2: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
        shift3: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
        clay: {
          totalClayI: '', totalClayII: '', totalClayIII: '',
          activeClayI: '', activeClayII: '', activeClayIII: '',
          deadClayI: '', deadClayII: '', deadClayIII: '',
          vcmI: '', vcmII: '', vcmIII: '',
          loiI: '', loiII: '', loiIII: '',
          afsNoI: '', afsNoII: '', afsNoIII: '',
          finesI: '', finesII: '', finesIII: '',
        },
        mixRun: {
          start1: '', end1: '', total1: '', rejected1: '', hopper1: '',
          start2: '', end2: '', total2: '', rejected2: '', hopper2: '',
          start3: '', end3: '', total3: '', rejected3: '', hopper3: '',
          overallStart: '', overallEnd: '', overallTotal: '', overallRejected: '', overallHopper: ''
        },
        friability: { shiftI: '', shiftII: '', shiftIII: '' },
        sandLumps: {
          sandLumpsI: '', sandLumpsII: '', sandLumpsIII: '', sandLumpsTotal: '',
          newSandWtI: '', newSandWtII: '', newSandWtIII: '', newSandWtTotal: ''
        }
      },
      time: '', mixNo: '', permeability: '', gcsFdyA: '', gcsFdyB: '', wts: '',
      moisture: '', compactability: '', compressibility: '', waterLitre: '',
      sandTempBC: '', sandTempWU: '', sandTempSSU: '', newSandKgs: '',
      bentoniteKgs: '', bentonitePercent: '', premixKgs: '', premixPercent: '',
      coalDustKgs: '', coalDustPercent: '',
      bentoniteDropdown: '',
      premixDropdown: '',
      lcDropdown: '',
      lcValue: '',
      mouldDropdown: '',
      mouldValue: '',
      lcCompactSMC: '', lcCompactAt1: '',
      mouldStrengthSMC: '', shearStrengthAt: '', preparedSandLumps: '',
      itemName: '', remarks: ''
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
                onChange={(e) => handleMainChange('date', e.target.value)}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="sand-testing-form">
            <div className="grid-top">
              {/* Shift summaries (3 columns) */}
              <div className="table-box">
                <div className="table-header">Shift 1</div>
                <div style={{ padding: '0.75rem' }}>
                  <label className="label">Remaining Sand (kgs)</label>
                  <input className="input-field" value={formData.shiftData.shift1.rSand} onChange={(e) => handleShiftDataChange('shift1', 'rSand', e.target.value)} />
                  <label className="label">New Sand (kgs)</label>
                  <input className="input-field" value={formData.shiftData.shift1.nSand} onChange={(e) => handleShiftDataChange('shift1', 'nSand', e.target.value)} />
                  <label className="label">Mixing Mode</label>
                  <input className="input-field" value={formData.shiftData.shift1.mixingMode} onChange={(e) => handleShiftDataChange('shift1', 'mixingMode', e.target.value)} />
                  <label className="label">Bentonite (kgs)</label>
                  <input className="input-field" value={formData.shiftData.shift1.bentonite} onChange={(e) => handleShiftDataChange('shift1', 'bentonite', e.target.value)} />
                </div>
              </div>

              <div className="table-box">
                <div className="table-header">Shift 2</div>
                <div style={{ padding: '0.75rem' }}>
                  <label className="label">Remaining Sand (kgs)</label>
                  <input className="input-field" value={formData.shiftData.shift2.rSand} onChange={(e) => handleShiftDataChange('shift2', 'rSand', e.target.value)} />
                  <label className="label">New Sand (kgs)</label>
                  <input className="input-field" value={formData.shiftData.shift2.nSand} onChange={(e) => handleShiftDataChange('shift2', 'nSand', e.target.value)} />
                  <label className="label">Mixing Mode</label>
                  <input className="input-field" value={formData.shiftData.shift2.mixingMode} onChange={(e) => handleShiftDataChange('shift2', 'mixingMode', e.target.value)} />
                  <label className="label">Bentonite (kgs)</label>
                  <input className="input-field" value={formData.shiftData.shift2.bentonite} onChange={(e) => handleShiftDataChange('shift2', 'bentonite', e.target.value)} />
                </div>
              </div>

              <div className="table-box">
                <div className="table-header">Shift 3</div>
                <div style={{ padding: '0.75rem' }}>
                  <label className="label">Remaining Sand (kgs)</label>
                  <input className="input-field" value={formData.shiftData.shift3.rSand} onChange={(e) => handleShiftDataChange('shift3', 'rSand', e.target.value)} />
                  <label className="label">New Sand (kgs)</label>
                  <input className="input-field" value={formData.shiftData.shift3.nSand} onChange={(e) => handleShiftDataChange('shift3', 'nSand', e.target.value)} />
                  <label className="label">Mixing Mode</label>
                  <input className="input-field" value={formData.shiftData.shift3.mixingMode} onChange={(e) => handleShiftDataChange('shift3', 'mixingMode', e.target.value)} />
                  <label className="label">Bentonite (kgs)</label>
                  <input className="input-field" value={formData.shiftData.shift3.bentonite} onChange={(e) => handleShiftDataChange('shift3', 'bentonite', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid-mid">
              {/* Clay parameters and AFS/Fines */}
              <div>
                <div className="table-header">Clay / Fractions</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  <div className="field-container">
                    <label className="label">Total Clay I</label>
                    <input className="input-field" value={formData.shiftData.clay.totalClayI} onChange={(e) => handleShiftDataChange('clay', 'totalClayI', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Total Clay II</label>
                    <input className="input-field" value={formData.shiftData.clay.totalClayII} onChange={(e) => handleShiftDataChange('clay', 'totalClayII', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Total Clay III</label>
                    <input className="input-field" value={formData.shiftData.clay.totalClayIII} onChange={(e) => handleShiftDataChange('clay', 'totalClayIII', e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div className="field-container">
                      <label className="label">AFS No I</label>
                      <input className="input-field" value={formData.shiftData.clay.afsNoI} onChange={(e) => handleShiftDataChange('clay', 'afsNoI', e.target.value)} />
                    </div>
                    <div className="field-container">
                      <label className="label">Fines I (%)</label>
                      <input className="input-field" value={formData.shiftData.clay.finesI} onChange={(e) => handleShiftDataChange('clay', 'finesI', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="table-header">Mix Run Summary</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  <div className="three-col-row">
                    <div className="field-container">
                      <label className="label">Start 1</label>
                      <input className="input-field" value={formData.shiftData.mixRun.start1} onChange={(e) => handleShiftDataChange('mixRun', 'start1', e.target.value)} />
                    </div>
                    <div className="field-container">
                      <label className="label">End 1</label>
                      <input className="input-field" value={formData.shiftData.mixRun.end1} onChange={(e) => handleShiftDataChange('mixRun', 'end1', e.target.value)} />
                    </div>
                    <div className="field-container">
                      <label className="label">Total 1</label>
                      <input className="input-field" value={formData.shiftData.mixRun.total1} onChange={(e) => handleShiftDataChange('mixRun', 'total1', e.target.value)} />
                    </div>
                  </div>
                  <div className="three-col-row">
                    <div className="field-container">
                      <label className="label">Rejected 1</label>
                      <input className="input-field" value={formData.shiftData.mixRun.rejected1} onChange={(e) => handleShiftDataChange('mixRun', 'rejected1', e.target.value)} />
                    </div>
                    <div className="field-container">
                      <label className="label">Hopper 1</label>
                      <input className="input-field" value={formData.shiftData.mixRun.hopper1} onChange={(e) => handleShiftDataChange('mixRun', 'hopper1', e.target.value)} />
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid-main">
              {/* Measurements and production info */}
              <div>
                <div className="table-header">General Measurements</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  <div className="field-container">
                    <label className="label">Permeability</label>
                    <input className="input-field" value={formData.permeability} onChange={(e) => handleMainChange('permeability', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Moisture (%)</label>
                    <input className="input-field" value={formData.moisture} onChange={(e) => handleMainChange('moisture', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Compactability (%)</label>
                    <input className="input-field" value={formData.compactability} onChange={(e) => handleMainChange('compactability', e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <div className="table-header">Temperatures & Weights</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  <div className="field-container">
                    <label className="label">Sand Temp (BC °C)</label>
                    <input className="input-field" value={formData.sandTempBC} onChange={(e) => handleMainChange('sandTempBC', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">New Sand (Kgs)</label>
                    <input className="input-field" value={formData.newSandKgs} onChange={(e) => handleMainChange('newSandKgs', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Bentonite (Kgs)</label>
                    <input className="input-field" value={formData.bentoniteKgs} onChange={(e) => handleMainChange('bentoniteKgs', e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <div className="table-header">Other</div>
                <div style={{ padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  <div className="field-container">
                    <label className="label">Premix (Kgs)</label>
                    <input className="input-field" value={formData.premixKgs} onChange={(e) => handleMainChange('premixKgs', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Coal Dust (Kgs)</label>
                    <input className="input-field" value={formData.coalDustKgs} onChange={(e) => handleMainChange('coalDustKgs', e.target.value)} />
                  </div>
                  <div className="field-container">
                    <label className="label">Remarks</label>
                    <textarea className="textarea" value={formData.remarks} onChange={(e) => handleMainChange('remarks', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="button-group">
              <ResetButton onClick={handleReset}>Reset Form</ResetButton>
              <SubmitButton onClick={handleSubmit}>Save Sand Record</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SandTestingRecord;