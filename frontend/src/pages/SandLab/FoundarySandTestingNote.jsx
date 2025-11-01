import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Save, FileText } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import '../../styles/PageStyles/Sandlab/FoundarySandTestingNote.css';

const initialFormData = {
  date: new Date().toISOString().split('T')[0],
  shift: "",
  sandPlant: "",
  compactibilitySetting: "",
  shearStrengthSetting: "",
  // Table 1
  totalClayTest1Input1: '',
  totalClayTest1Input2: '',
  totalClayTest1Input3: '',
  totalClayTest2Input1: '',
  totalClayTest2Input2: '',
  totalClayTest2Input3: '',
  activeClayTest1Input1: '',
  activeClayTest1Input2: '',
  activeClayTest1Input3: '',
  activeClayTest2Input1: '',
  activeClayTest2Input2: '',
  activeClayTest2Input3: '',
  deadClayTest1Input1: '',
  deadClayTest1Input2: '',
  deadClayTest2Input1: '',
  deadClayTest2Input2: '',
  vcmTest1Input1: '',
  vcmTest1Input2: '',
  vcmTest1Input3: '',
  vcmTest2Input1: '',
  vcmTest2Input2: '',
  vcmTest2Input3: '',
  loiTest1Input1: '',
  loiTest1Input2: '',
  loiTest1Input3: '',
  loiTest2Input1: '',
  loiTest2Input2: '',
  loiTest2Input3: '',
  // Table 2
  sieve1700Test1: '',
  sieve1700Test2: '',
  sieve850Test1: '',
  sieve850Test2: '',
  sieve600Test1: '',
  sieve600Test2: '',
  sieve425Test1: '',
  sieve425Test2: '',
  sieve300Test1: '',
  sieve300Test2: '',
  sieve212Test1: '',
  sieve212Test2: '',
  sieve150Test1: '',
  sieve150Test2: '',
  sieve106Test1: '',
  sieve106Test2: '',
  sieve75Test1: '',
  sieve75Test2: '',
  sieve53Test1: '',
  sieve53Test2: '',
  sievePanTest1: '',
  sievePanTest2: '',
  sieveTotalTest1: '',
  sieveTotalTest2: '',
  compactabilityTest1: '',
  compactabilityTest2: '',
  permeabilityTest1: '',
  permeabilityTest2: '',
  gcsTest1: '',
  gcsTest2: '',
  moistureTest1: '',
  moistureTest2: '',
  bentonitedTest1: '',
  bentonitedTest2: '',
  coalDustTest1: '',
  coalDustTest2: '',
  hopperLevelTest1: '',
  hopperLevelTest2: '',
  shearStrengthTest1: '',
  shearStrengthTest2: '',
  dustCollectorSettingsTest1: '',
  dustCollectorSettingsTest2: '',
  returnSandMoistureTest1: '',
  returnSandMoistureTest2: '',
  // Table 3
  mf5Test1: '',
  mf5Test2: '',
  mf10Test1: '',
  mf10Test2: '',
  mf20Test1: '',
  mf20Test2: '',
  mf30Test1: '',
  mf30Test2: '',
  mf40Test1: '',
  mf40Test2: '',
  mf50Test1: '',
  mf50Test2: '',
  mf70Test1: '',
  mf70Test2: '',
  mf100Test1: '',
  mf100Test2: '',
  mf140Test1: '',
  mf140Test2: '',
  mf200Test1: '',
  mf200Test2: '',
  mf300Test1: '',
  mf300Test2: '',
  mfRemainingTest1: '',
  mfRemainingTest2: '',
  // Table 4
  afsNoTest1: '',
  afsNoTest2: '',
  finesTest1: '',
  finesTest2: '',
  gdTest1: '',
  gdTest2: '',
  remarks: ''
};

export default function FoundrySandTestingNote() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
          [field]: value
      }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
      [name]: value
    }));
  };

  const calculatePercentage = (input1, input2, input3) => {
    const val1 = parseFloat(input1) || 0;
    const val2 = parseFloat(input2) || 0;
    const val3 = parseFloat(input3) || 0;
    if (val3 === 0) return '';
    const result = ((val1 - val2) / val3) * 100;
    return result.toFixed(2) + '%';
  };

  const calculateDeadClayPercentage = (input1, input2) => {
    const val1 = parseFloat(input1) || 0;
    const val2 = parseFloat(input2) || 0;
    const result = val1 - val2;
    if (result === 0 && !input1 && !input2) return '';
    return result.toFixed(2) + '%';
  };

  const handleViewReport = () => {
    navigate('/sand-lab/foundry-sand-testing-note/report');
  };

  return (
    <>
      {/* Header */}
      <div className="foundry-header">
        <div className="foundry-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Foundry Sand Testing Note - Entry Form
          </h2>
        </div>
        <div className="foundry-header-buttons">
          <button className="foundry-view-report-btn" onClick={handleViewReport} type="button">
            <div className="foundry-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="foundry-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

        <div className="foundry-form-grid">
          {/* Basic Info Section */}
          <h3 className="foundry-section-title">Basic Information</h3>
          <div className="foundry-form-group">
            <label>Sand Plant</label>
            <input
              type="text"
              placeholder="e.g. DISA"
              value={formData.sandPlant}
              onChange={(e) => handleInputChange("sandPlant", e.target.value)}
            />
          </div>
          <div className="foundry-form-group">
            <label>Date</label>
            <CustomDatePicker
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              name="date"
            />
          </div>
          <div className="foundry-form-group">
            <label>Shift</label>
            <input
              type="text"
              placeholder="e.g. 2nd Shift"
              value={formData.shift}
              onChange={(e) => handleInputChange("shift", e.target.value)}
            />
          </div>
          <div className="foundry-form-group">
            <label>Compactability Setting</label>
            <input
              type="text"
              placeholder="e.g. J.C. mode"
              value={formData.compactibilitySetting}
              onChange={(e) => handleInputChange("compactibilitySetting", e.target.value)}
            />
          </div>
          <div className="foundry-form-group">
            <label>Shear/Mould Strength Setting</label>
            <input
              type="text"
              placeholder="e.g. MP.VOX"
              value={formData.shearStrengthSetting}
              onChange={(e) => handleInputChange("shearStrengthSetting", e.target.value)}
            />
          </div>

          {/* Table 1 */}
          <h3 className="foundry-section-title">Table 1</h3>
          <div className="foundry-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <table className="foundry-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>Parameters</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>TEST - 1</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>TEST - 2</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Total Clay</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="totalClayTest1Input1"
                        value={formData.totalClayTest1Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                      <input
                        type="number"
                        name="totalClayTest1Input2"
                        value={formData.totalClayTest1Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>/</span>
                      <input
                        type="number"
                        name="totalClayTest1Input3"
                        value={formData.totalClayTest1Input3}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculatePercentage(formData.totalClayTest1Input1, formData.totalClayTest1Input2, formData.totalClayTest1Input3)}
                      </span>
                    </div>
                    </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="totalClayTest2Input1"
                        value={formData.totalClayTest2Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                      <input
                        type="number"
                        name="totalClayTest2Input2"
                        value={formData.totalClayTest2Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>/</span>
                      <input
                        type="number"
                        name="totalClayTest2Input3"
                        value={formData.totalClayTest2Input3}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculatePercentage(formData.totalClayTest2Input1, formData.totalClayTest2Input2, formData.totalClayTest2Input3)}
                      </span>
                    </div>
                    </td>
                  </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Active Clay</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="activeClayTest1Input1"
                        value={formData.activeClayTest1Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                      <input
                        type="number"
                        name="activeClayTest1Input2"
                        value={formData.activeClayTest1Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>/</span>
                      <input
                        type="number"
                        name="activeClayTest1Input3"
                        value={formData.activeClayTest1Input3}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculatePercentage(formData.activeClayTest1Input1, formData.activeClayTest1Input2, formData.activeClayTest1Input3)}
                      </span>
                    </div>
                    </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="activeClayTest2Input1"
                        value={formData.activeClayTest2Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                      <input
                        type="number"
                        name="activeClayTest2Input2"
                        value={formData.activeClayTest2Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>/</span>
                      <input
                        type="number"
                        name="activeClayTest2Input3"
                        value={formData.activeClayTest2Input3}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculatePercentage(formData.activeClayTest2Input1, formData.activeClayTest2Input2, formData.activeClayTest2Input3)}
                      </span>
                    </div>
                    </td>
                  </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Dead Clay</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="deadClayTest1Input1"
                        value={formData.deadClayTest1Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                      <input
                        type="number"
                        name="deadClayTest1Input2"
                        value={formData.deadClayTest1Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculateDeadClayPercentage(formData.deadClayTest1Input1, formData.deadClayTest1Input2)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="deadClayTest2Input1"
                        value={formData.deadClayTest2Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                    <input
                        type="number"
                        name="deadClayTest2Input2"
                        value={formData.deadClayTest2Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculateDeadClayPercentage(formData.deadClayTest2Input1, formData.deadClayTest2Input2)}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>VCM</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="vcmTest1Input1"
                        value={formData.vcmTest1Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                      <input
                        type="number"
                        name="vcmTest1Input2"
                        value={formData.vcmTest1Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>/</span>
                    <input
                        type="number"
                        name="vcmTest1Input3"
                        value={formData.vcmTest1Input3}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculatePercentage(formData.vcmTest1Input1, formData.vcmTest1Input2, formData.vcmTest1Input3)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="vcmTest2Input1"
                        value={formData.vcmTest2Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                      <input
                        type="number"
                        name="vcmTest2Input2"
                        value={formData.vcmTest2Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>/</span>
                    <input
                        type="number"
                        name="vcmTest2Input3"
                        value={formData.vcmTest2Input3}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculatePercentage(formData.vcmTest2Input1, formData.vcmTest2Input2, formData.vcmTest2Input3)}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>LOI</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="loiTest1Input1"
                        value={formData.loiTest1Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                      <input
                        type="number"
                        name="loiTest1Input2"
                        value={formData.loiTest1Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>/</span>
                      <input
                        type="number"
                        name="loiTest1Input3"
                        value={formData.loiTest1Input3}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculatePercentage(formData.loiTest1Input1, formData.loiTest1Input2, formData.loiTest1Input3)}
                      </span>
                    </div>
                    </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        name="loiTest2Input1"
                        value={formData.loiTest2Input1}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>−</span>
                      <input
                        type="number"
                        name="loiTest2Input2"
                        value={formData.loiTest2Input2}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>/</span>
                      <input
                        type="number"
                        name="loiTest2Input3"
                        value={formData.loiTest2Input3}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.1"
                        style={{ width: '60px', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>=</span>
                      <span style={{ minWidth: '60px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#5B9AA9' }}>
                        {calculatePercentage(formData.loiTest2Input1, formData.loiTest2Input2, formData.loiTest2Input3)}
                      </span>
                    </div>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2 */}
          <h3 className="foundry-section-title">Table 2</h3>
          <div className="foundry-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <table className="foundry-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>Sieve Testing</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>TEST - 1</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>TEST - 2</th>
                </tr>
                <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>Sieve Size (Mic)</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>% Wt Retained Sand</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>% Wt Retained Sand</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>1700</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="sieve1700Test1"
                      value={formData.sieve1700Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="sieve1700Test2"
                      value={formData.sieve1700Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>850</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="sieve850Test1"
                      value={formData.sieve850Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="sieve850Test2"
                      value={formData.sieve850Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                  </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>600</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve600Test1"
                      value={formData.sieve600Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve600Test2"
                      value={formData.sieve600Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>425</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve425Test1"
                      value={formData.sieve425Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve425Test2"
                      value={formData.sieve425Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>300</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve300Test1"
                      value={formData.sieve300Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve300Test2"
                      value={formData.sieve300Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>212</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve212Test1"
                      value={formData.sieve212Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve212Test2"
                      value={formData.sieve212Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>150</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve150Test1"
                      value={formData.sieve150Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve150Test2"
                      value={formData.sieve150Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>106</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve106Test1"
                      value={formData.sieve106Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve106Test2"
                      value={formData.sieve106Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>75</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve75Test1"
                      value={formData.sieve75Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve75Test2"
                      value={formData.sieve75Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>53</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve53Test1"
                      value={formData.sieve53Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieve53Test2"
                      value={formData.sieve53Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Pan</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sievePanTest1"
                      value={formData.sievePanTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sievePanTest2"
                      value={formData.sievePanTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Total</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieveTotalTest1"
                      value={formData.sieveTotalTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="sieveTotalTest2"
                      value={formData.sieveTotalTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Compactability</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="compactabilityTest1"
                      value={formData.compactabilityTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="compactabilityTest2"
                      value={formData.compactabilityTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Permeability</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="permeabilityTest1"
                      value={formData.permeabilityTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="permeabilityTest2"
                      value={formData.permeabilityTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>GCS</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="gcsTest1"
                      value={formData.gcsTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="gcsTest2"
                      value={formData.gcsTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Moisture</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="moistureTest1"
                      value={formData.moistureTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="moistureTest2"
                      value={formData.moistureTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Bentonited</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="bentonitedTest1"
                      value={formData.bentonitedTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="bentonitedTest2"
                      value={formData.bentonitedTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Coal Dust</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="coalDustTest1"
                      value={formData.coalDustTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="coalDustTest2"
                      value={formData.coalDustTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Hopper level</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="hopperLevelTest1"
                      value={formData.hopperLevelTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="hopperLevelTest2"
                      value={formData.hopperLevelTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Shear Strength</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="shearStrengthTest1"
                      value={formData.shearStrengthTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="shearStrengthTest2"
                      value={formData.shearStrengthTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Dust Collector Settings</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="dustCollectorSettingsTest1"
                      value={formData.dustCollectorSettingsTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="dustCollectorSettingsTest2"
                      value={formData.dustCollectorSettingsTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>Return Sand Moisture</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="returnSandMoistureTest1"
                      value={formData.returnSandMoistureTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="returnSandMoistureTest2"
                      value={formData.returnSandMoistureTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 3 */}
          <h3 className="foundry-section-title">Table 3</h3>
          <div className="foundry-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <table className="foundry-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }} rowSpan="2">MF</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }} colSpan="2">Product</th>
                </tr>
                <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>TEST - 1</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>TEST - 2</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>5</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="mf5Test1"
                      value={formData.mf5Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="mf5Test2"
                      value={formData.mf5Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                  </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>10</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf10Test1"
                      value={formData.mf10Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf10Test2"
                      value={formData.mf10Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>20</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf20Test1"
                      value={formData.mf20Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf20Test2"
                      value={formData.mf20Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>30</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf30Test1"
                      value={formData.mf30Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf30Test2"
                      value={formData.mf30Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>40</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf40Test1"
                      value={formData.mf40Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf40Test2"
                      value={formData.mf40Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>50</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf50Test1"
                      value={formData.mf50Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf50Test2"
                      value={formData.mf50Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>70</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf70Test1"
                      value={formData.mf70Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf70Test2"
                      value={formData.mf70Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>100</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf100Test1"
                      value={formData.mf100Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf100Test2"
                      value={formData.mf100Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>140</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf140Test1"
                      value={formData.mf140Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf140Test2"
                      value={formData.mf140Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>200</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf200Test1"
                      value={formData.mf200Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf200Test2"
                      value={formData.mf200Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>300</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf300Test1"
                      value={formData.mf300Test1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mf300Test2"
                      value={formData.mf300Test2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'center', border: '1px solid #e2e8f0' }}>Remaining</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mfRemainingTest1"
                      value={formData.mfRemainingTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="mfRemainingTest2"
                      value={formData.mfRemainingTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 4 */}
          <h3 className="foundry-section-title">Table 4</h3>
          <div className="foundry-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <table className="foundry-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>Parameters</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>TEST - 1</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>TEST - 2</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>AFS. NO</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="afsNoTest1"
                      value={formData.afsNoTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input
                      type="number"
                      name="afsNoTest2"
                      value={formData.afsNoTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                      />
                    </td>
                  </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>FINES</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="finesTest1"
                      value={formData.finesTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="finesTest2"
                      value={formData.finesTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', fontWeight: 500, background: '#f8fafc', textAlign: 'left', paddingLeft: '1rem', border: '1px solid #e2e8f0' }}>GD</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="gdTest1"
                      value={formData.gdTest1}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      name="gdTest2"
                      value={formData.gdTest2}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          <h3 className="foundry-section-title">Remarks</h3>
          <div className="foundry-form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              placeholder="Enter any additional remarks..."
              rows="4"
            />
          </div>
      </div>
    </>
  );
}
