import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RefreshCw, FileText, Loader2, RotateCcw } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/SandTestingRecord.css';

const SandTestingRecord = () => {
  const navigate = useNavigate();
  
  // Primary: Date
  const [primaryData, setPrimaryData] = useState({ date: '' });
  const [primaryLoading, setPrimaryLoading] = useState(false);
  
  // Table 1: Shift Data
  const [table1, setTable1] = useState({
    shiftI: {
      rSand: '',
      nSand: '',
      mixingMode: '',
      bentonite: '',
      coalDustPremix: '',
      checkpointBentonite: '',
      checkpointCoalDustPremix: '',
      batchNoBentonite: '',
      batchNoCoalDustPremix: ''
    },
    shiftII: {
      rSand: '',
      nSand: '',
      mixingMode: '',
      bentonite: '',
      coalDustPremix: '',
      checkpointBentonite: '',
      checkpointCoalDustPremix: '',
      batchNoBentonite: '',
      batchNoCoalDustPremix: ''
    },
    shiftIII: {
      rSand: '',
      nSand: '',
      mixingMode: '',
      bentonite: '',
      coalDustPremix: '',
      checkpointBentonite: '',
      checkpointCoalDustPremix: '',
      batchNoBentonite: '',
      batchNoCoalDustPremix: ''
    }
  });
  
  // Table 2: Clay Parameters
  const [table2, setTable2] = useState({
    shiftI: {
      totalClay: '',
      activeClay: '',
      deadClay: '',
      vcm: '',
      loi: '',
      afsNo: '',
      fines: ''
    },
    shiftII: {
      totalClay: '',
      activeClay: '',
      deadClay: '',
      vcm: '',
      loi: '',
      afsNo: '',
      fines: ''
    },
    shiftIII: {
      totalClay: '',
      activeClay: '',
      deadClay: '',
      vcm: '',
      loi: '',
      afsNo: '',
      fines: ''
    }
  });
  
  // Table 3: Mix Data
  const [table3, setTable3] = useState({
    shiftI: {
      mixNoStart: '',
      mixNoEnd: '',
      mixNoTotal: '',
      noOfMixRejected: '',
      returnSandHopperLevel: ''
    },
    shiftII: {
      mixNoStart: '',
      mixNoEnd: '',
      mixNoTotal: '',
      noOfMixRejected: '',
      returnSandHopperLevel: ''
    },
    shiftIII: {
      mixNoStart: '',
      mixNoEnd: '',
      mixNoTotal: '',
      noOfMixRejected: '',
      returnSandHopperLevel: ''
    },
    total: {
      mixNoEnd: '',
      mixNoTotal: '',
      noOfMixRejected: ''
    }
  });
  
  // Table 4: Sand Properties
  const [table4, setTable4] = useState({
    sandLump: '',
    newSandWt: '',
    friability: {
      shiftI: '',
      shiftII: '',
      shiftIII: ''
    }
  });
  
  // Table 5: Sand Properties & Test Parameters
  const [table5, setTable5] = useState({
    sno: '',
    time: '',
    mixNo: '',
    permeability: '',
    gcsCheckpoint: '',
    gcsValue: '',
    wts: '',
    moisture: '',
    compactability: '',
    compressability: '',
    waterLitrePerKgMix: '',
    sandTempBC: '',
    sandTempWU: '',
    sandTempSSU: '',
    newSandKgsPerMould: '',
    bentoniteCheckpoint: '',
    bentoniteWithPremix: '',
    bentoniteOnly: '',
    premixCoalDustCheckpoint: '',
    premixKgsMix: '',
    coalDustKgsMix: '',
    lcScmCompactabilityCheckpoint: '',
    lcScmCompactabilityValue: '',
    mouldStrengthShearCheckpoint: '',
    mouldStrengthShearValue: '',
    preparedSandLumpsPerKg: '',
    itemName: '',
    remarks: ''
  });

  const [loadingStates, setLoadingStates] = useState({
    table1: false,
    table2: false,
    table3: false,
    table4: false,
    table5: false
  });

  const handleTableChange = (tableNum, field, value, nestedField = null) => {
    const setters = {
      1: setTable1,
      2: setTable2,
      3: setTable3,
      4: setTable4,
      5: setTable5
    };
    
    if ((tableNum === 1 || tableNum === 2 || tableNum === 3) && nestedField) {
      // For table 1, 2, and 3, handle nested shift structure
      setters[tableNum](prev => ({
          ...prev,
            [field]: {
          ...prev[field],
              [nestedField]: value
            }
      }));
    } else if (tableNum === 4 && field === 'friability' && nestedField) {
      // For table 4 friability, handle nested shift structure
      setters[tableNum](prev => ({
        ...prev,
        friability: {
          ...prev.friability,
          [nestedField]: value
        }
      }));
    } else {
      setters[tableNum](prev => ({
          ...prev,
            [field]: value
      }));
    }
  };

  const handleTableSubmit = async (tableNum) => {
    const tables = { 1: table1, 2: table2, 3: table3, 4: table4, 5: table5 };
    const tableData = tables[tableNum];
    
    setLoadingStates(prev => ({ ...prev, [`table${tableNum}`]: true }));
    
    try {
      // TODO: Update with actual API endpoint
      const response = await api.post(`/v1/sand-testing-records/table${tableNum}`, {
        tableNum,
        data: tableData
      });
      
      if (response.success) {
        alert(`Table ${tableNum} saved successfully!`);
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      console.error(`Error saving table ${tableNum}:`, error);
      alert(`Failed to save table ${tableNum}. Please try again.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`table${tableNum}`]: false }));
    }
  };

  const handlePrimaryChange = (field, value) => {
    setPrimaryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrimarySubmit = async () => {
    setPrimaryLoading(true);
    
    try {
      // TODO: Update with actual API endpoint
      const response = await api.post('/v1/sand-testing-records/primary', {
        data: primaryData
      });
      
      if (response.success) {
        alert('Primary data saved successfully!');
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      console.error('Error saving primary data:', error);
      alert('Failed to save primary data. Please try again.');
    } finally {
      setPrimaryLoading(false);
    }
  };

  // Separate reset functions for each table
  const resetPrimaryData = () => {
    if (!window.confirm('Are you sure you want to reset Primary data?')) return;
    setPrimaryData({ date: '' });
  };

  const resetTable1 = () => {
    if (!window.confirm('Are you sure you want to reset Table 1?')) return;
    setTable1({
      shiftI: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', checkpointBentonite: '', checkpointCoalDustPremix: '', batchNoBentonite: '', batchNoCoalDustPremix: '' },
      shiftII: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', checkpointBentonite: '', checkpointCoalDustPremix: '', batchNoBentonite: '', batchNoCoalDustPremix: '' },
      shiftIII: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', checkpointBentonite: '', checkpointCoalDustPremix: '', batchNoBentonite: '', batchNoCoalDustPremix: '' }
    });
  };

  const resetTable2 = () => {
    if (!window.confirm('Are you sure you want to reset Table 2?')) return;
    setTable2({
      shiftI: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
      shiftII: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
      shiftIII: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' }
    });
  };

  const resetTable3 = () => {
    if (!window.confirm('Are you sure you want to reset Table 3?')) return;
    setTable3({
      shiftI: { mixNoStart: '', mixNoEnd: '', mixNoTotal: '', noOfMixRejected: '', returnSandHopperLevel: '' },
      shiftII: { mixNoStart: '', mixNoEnd: '', mixNoTotal: '', noOfMixRejected: '', returnSandHopperLevel: '' },
      shiftIII: { mixNoStart: '', mixNoEnd: '', mixNoTotal: '', noOfMixRejected: '', returnSandHopperLevel: '' },
      total: { mixNoEnd: '', mixNoTotal: '', noOfMixRejected: '' }
    });
  };

  const resetTable4 = () => {
    if (!window.confirm('Are you sure you want to reset Table 4?')) return;
    setTable4({
      sandLump: '',
      newSandWt: '',
      friability: {
        shiftI: '',
        shiftII: '',
        shiftIII: ''
      }
    });
  };

  const resetTable5 = () => {
    if (!window.confirm('Are you sure you want to reset Table 5?')) return;
    setTable5({
      sno: '',
      time: '',
      mixNo: '',
      permeability: '',
      gcsCheckpoint: '',
      gcsValue: '',
      wts: '',
      moisture: '',
      compactability: '',
      compressability: '',
      waterLitrePerKgMix: '',
      sandTempBC: '',
      sandTempWU: '',
      sandTempSSU: '',
      newSandKgsPerMould: '',
      bentoniteCheckpoint: '',
      bentoniteWithPremix: '',
      bentoniteOnly: '',
      premixCoalDustCheckpoint: '',
      premixKgsMix: '',
      coalDustKgsMix: '',
      lcScmCompactabilityCheckpoint: '',
      lcScmCompactabilityValue: '',
      mouldStrengthShearCheckpoint: '',
      mouldStrengthShearValue: '',
      preparedSandLumpsPerKg: '',
      itemName: '',
      remarks: ''
    });
  };

  const handleViewReport = () => {
    navigate('/sand-lab/sand-testing-record/report');
  };

  const renderTableRow = (tableNum, field, label, type = "text") => (
    <tr>
      <td>{label}</td>
      <td>
        {type === "textarea" ? (
          <textarea
            value={tableNum === 1 ? (table1[field] || '') : tableNum === 2 ? (table2[field] || '') : tableNum === 3 ? (table3[field] || '') : tableNum === 4 ? (table4[field] || '') : (table5[field] || '')}
            onChange={(e) => handleTableChange(tableNum, field, e.target.value)}
            rows="4"
            placeholder={`Enter ${label.toLowerCase()}`}
            className="sand-table-input"
          />
        ) : (
      <input
        type={type}
            value={tableNum === 1 ? (table1[field] || '') : tableNum === 2 ? (table2[field] || '') : tableNum === 3 ? (table3[field] || '') : tableNum === 4 ? (table4[field] || '') : (table5[field] || '')}
            onChange={(e) => handleTableChange(tableNum, field, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="sand-table-input"
          />
        )}
      </td>
    </tr>
  );

  return (
    <>
      {/* Header */}
      <div className="sand-header">
        <div className="sand-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Sand Testing Record
            <button 
              className="sand-view-report-btn"
              onClick={handleViewReport}
              title="View Reports"
            >
              <FileText size={16} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
      </div>

      {/* Primary */}
      <div className="sand-section-header">
        <h3>Primary</h3>
      </div>
      <div className="sand-primary-row">
        <div className="sand-primary-form-group">
          <label>Date</label>
          <CustomDatePicker
            value={primaryData.date}
            onChange={(e) => handlePrimaryChange('date', e.target.value)}
            name="date"
          />
        </div>
        <div className="sand-primary-button-wrapper">
          <button
            className="sand-submit-btn"
            onClick={handlePrimarySubmit}
            disabled={primaryLoading || !primaryData.date}
          >
            {primaryLoading ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
            {primaryLoading ? 'Saving...' : 'Save Primary'}
          </button>
        </div>
      </div>

      {/* Table 1 */}
      <div className="sand-section-header">
        <h3>Table 1</h3>
            </div>
      <table className="sand-shift-table">
        <thead>
          <tr>
            <th>Shift</th>
            <th>I</th>
            <th>II</th>
            <th>III</th>
          </tr>
        </thead>
        <tbody>
          <tr key="r-sand">
            <td>R. Sand ( Kgs/Mix )</td>
            <td>
              <input
                type="number"
                value={table1.shiftI.rSand || ''}
                onChange={(e) => handleTableChange(1, 'shiftI', e.target.value, 'rSand')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table1.shiftII.rSand || ''}
                onChange={(e) => handleTableChange(1, 'shiftII', e.target.value, 'rSand')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table1.shiftIII.rSand || ''}
                onChange={(e) => handleTableChange(1, 'shiftIII', e.target.value, 'rSand')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr key="n-sand">
            <td>N. Sand ( Kgs/Mix )</td>
            <td>
              <input
                type="number"
                value={table1.shiftI.nSand || ''}
                onChange={(e) => handleTableChange(1, 'shiftI', e.target.value, 'nSand')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table1.shiftII.nSand || ''}
                onChange={(e) => handleTableChange(1, 'shiftII', e.target.value, 'nSand')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table1.shiftIII.nSand || ''}
                onChange={(e) => handleTableChange(1, 'shiftIII', e.target.value, 'nSand')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr key="mixing-mode">
            <td>Mixing Mode</td>
            <td>
              <input
                type="text"
                value={table1.shiftI.mixingMode || ''}
                onChange={(e) => handleTableChange(1, 'shiftI', e.target.value, 'mixingMode')}
                placeholder="Enter mode"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="text"
                value={table1.shiftII.mixingMode || ''}
                onChange={(e) => handleTableChange(1, 'shiftII', e.target.value, 'mixingMode')}
                placeholder="Enter mode"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="text"
                value={table1.shiftIII.mixingMode || ''}
                onChange={(e) => handleTableChange(1, 'shiftIII', e.target.value, 'mixingMode')}
                placeholder="Enter mode"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr key="bentonite">
            <td>Bentonite ( Kgs/Mix )</td>
            <td>
              <input
                type="number"
                value={table1.shiftI.bentonite || ''}
                onChange={(e) => handleTableChange(1, 'shiftI', e.target.value, 'bentonite')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table1.shiftII.bentonite || ''}
                onChange={(e) => handleTableChange(1, 'shiftII', e.target.value, 'bentonite')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table1.shiftIII.bentonite || ''}
                onChange={(e) => handleTableChange(1, 'shiftIII', e.target.value, 'bentonite')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr key="batch-no">
            <td>Batch NO...</td>
            <td>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="checkpoint-shiftI"
                      value="bentonite"
                      checked={table1.shiftI.checkpointBentonite === 'bentonite'}
                      onChange={(e) => handleTableChange(1, 'shiftI', e.target.value, 'checkpointBentonite')}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Bentonite</span>
                  </label>
          </div>
                <input
                  type="text"
                  value={table1.shiftI.batchNoBentonite || ''}
                  onChange={(e) => handleTableChange(1, 'shiftI', e.target.value, 'batchNoBentonite')}
                  placeholder="Enter batch no"
                  className="sand-table-input"
                />
            </div>
            </td>
            <td colSpan={2}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="checkpoint-shiftIIIII"
                      value="coalDust"
                      checked={table1.shiftI.checkpointCoalDustPremix === 'coalDust'}
                      onChange={(e) => handleTableChange(1, 'shiftI', e.target.value, 'checkpointCoalDustPremix')}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Coal dust</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="checkpoint-shiftIIIII"
                      value="premix"
                      checked={table1.shiftI.checkpointCoalDustPremix === 'premix'}
                      onChange={(e) => handleTableChange(1, 'shiftI', e.target.value, 'checkpointCoalDustPremix')}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Premix</span>
                  </label>
          </div>
                <input
                  type="text"
                  value={table1.shiftI.batchNoCoalDustPremix || ''}
                  onChange={(e) => handleTableChange(1, 'shiftI', e.target.value, 'batchNoCoalDustPremix')}
                  placeholder="Enter batch no"
                  className="sand-table-input"
                />
            </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="sand-table-submit" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="sand-reset-btn"
          onClick={resetTable1}
          type="button"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          className="sand-submit-btn"
          onClick={() => handleTableSubmit(1)}
          disabled={loadingStates.table1}
        >
          {loadingStates.table1 ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
          {loadingStates.table1 ? 'Saving...' : 'Save Table 1'}
        </button>
      </div>

      {/* Table 2 */}
      <div className="sand-section-header">
        <h3>Table 2</h3>
            </div>
      <table className="sand-shift-table">
        <thead>
          <tr>
            <th>Shift</th>
            <th>I</th>
            <th>II</th>
            <th>III</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Clay ( 11.0 - 14.5%)</td>
            <td>
              <input
                type="number"
                value={table2.shiftI.totalClay || ''}
                onChange={(e) => handleTableChange(2, 'shiftI', e.target.value, 'totalClay')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftII.totalClay || ''}
                onChange={(e) => handleTableChange(2, 'shiftII', e.target.value, 'totalClay')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftIII.totalClay || ''}
                onChange={(e) => handleTableChange(2, 'shiftIII', e.target.value, 'totalClay')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr>
            <td>Active Clay ( 8.5 - 11.0 % )</td>
            <td>
              <input
                type="number"
                value={table2.shiftI.activeClay || ''}
                onChange={(e) => handleTableChange(2, 'shiftI', e.target.value, 'activeClay')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftII.activeClay || ''}
                onChange={(e) => handleTableChange(2, 'shiftII', e.target.value, 'activeClay')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftIII.activeClay || ''}
                onChange={(e) => handleTableChange(2, 'shiftIII', e.target.value, 'activeClay')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr>
            <td>Dead Clay ( 2.0 - 4.0% )</td>
            <td>
              <input
                type="number"
                value={table2.shiftI.deadClay || ''}
                onChange={(e) => handleTableChange(2, 'shiftI', e.target.value, 'deadClay')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftII.deadClay || ''}
                onChange={(e) => handleTableChange(2, 'shiftII', e.target.value, 'deadClay')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftIII.deadClay || ''}
                onChange={(e) => handleTableChange(2, 'shiftIII', e.target.value, 'deadClay')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr>
            <td>V.C.M (2.0 - 3.2%)</td>
            <td>
              <input
                type="number"
                value={table2.shiftI.vcm || ''}
                onChange={(e) => handleTableChange(2, 'shiftI', e.target.value, 'vcm')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftII.vcm || ''}
                onChange={(e) => handleTableChange(2, 'shiftII', e.target.value, 'vcm')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftIII.vcm || ''}
                onChange={(e) => handleTableChange(2, 'shiftIII', e.target.value, 'vcm')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr>
            <td>L.O.I ( 4.5 - 6.0 % )</td>
            <td>
              <input
                type="number"
                value={table2.shiftI.loi || ''}
                onChange={(e) => handleTableChange(2, 'shiftI', e.target.value, 'loi')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftII.loi || ''}
                onChange={(e) => handleTableChange(2, 'shiftII', e.target.value, 'loi')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftIII.loi || ''}
                onChange={(e) => handleTableChange(2, 'shiftIII', e.target.value, 'loi')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr>
            <td>AFS No. ( min 48 )</td>
            <td>
              <input
                type="number"
                value={table2.shiftI.afsNo || ''}
                onChange={(e) => handleTableChange(2, 'shiftI', e.target.value, 'afsNo')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftII.afsNo || ''}
                onChange={(e) => handleTableChange(2, 'shiftII', e.target.value, 'afsNo')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftIII.afsNo || ''}
                onChange={(e) => handleTableChange(2, 'shiftIII', e.target.value, 'afsNo')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr>
            <td>Fines (10% Max )</td>
            <td>
              <input
                type="number"
                value={table2.shiftI.fines || ''}
                onChange={(e) => handleTableChange(2, 'shiftI', e.target.value, 'fines')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftII.fines || ''}
                onChange={(e) => handleTableChange(2, 'shiftII', e.target.value, 'fines')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table2.shiftIII.fines || ''}
                onChange={(e) => handleTableChange(2, 'shiftIII', e.target.value, 'fines')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="sand-table-submit" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="sand-reset-btn"
          onClick={resetTable2}
          type="button"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          className="sand-submit-btn"
          onClick={() => handleTableSubmit(2)}
          disabled={loadingStates.table2}
        >
          {loadingStates.table2 ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
          {loadingStates.table2 ? 'Saving...' : 'Save Table 2'}
        </button>
      </div>

      {/* Table 3 */}
      <div className="sand-section-header">
        <h3>Table 3</h3>
            </div>
      <table className="sand-shift-table">
        <thead>
          <tr>
            <th rowSpan={2} style={{ width: '60px', minWidth: '60px' }}>Shift</th>
            <th colSpan={3} style={{ textAlign: 'center', width: '35%' }}>Mix No.</th>
            <th rowSpan={2} style={{ width: '20%' }}>No. Of Mix Rejected</th>
            <th rowSpan={2} style={{ width: '25%' }}>Return Sand Hopper Level</th>
          </tr>
          <tr>
            <th style={{ borderRight: '1px solid #e2e8f0', width: '11.67%' }}>Start</th>
            <th style={{ borderRight: '1px solid #e2e8f0', width: '11.67%' }}>End</th>
            <th style={{ width: '11.67%' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ width: '60px', minWidth: '60px', textAlign: 'center', fontWeight: 600 }}>I</td>
            <td style={{ borderRight: '1px solid #e2e8f0', width: '11.67%', padding: '0.4rem' }}>
              <input
                type="number"
                value={table3.shiftI.mixNoStart || ''}
                onChange={(e) => handleTableChange(3, 'shiftI', e.target.value, 'mixNoStart')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td style={{ borderRight: '1px solid #e2e8f0', width: '11.67%', padding: '0.4rem' }}>
              <input
                type="number"
                value={table3.shiftI.mixNoEnd || ''}
                onChange={(e) => handleTableChange(3, 'shiftI', e.target.value, 'mixNoEnd')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td style={{ width: '11.67%', padding: '0.4rem', borderRight: '1px solid #e2e8f0' }}>
              <input
                type="number"
                value={table3.shiftI.mixNoTotal || ''}
                onChange={(e) => handleTableChange(3, 'shiftI', e.target.value, 'mixNoTotal')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td>
              <input
                type="number"
                value={table3.shiftI.noOfMixRejected || ''}
                onChange={(e) => handleTableChange(3, 'shiftI', e.target.value, 'noOfMixRejected')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table3.shiftI.returnSandHopperLevel || ''}
                onChange={(e) => handleTableChange(3, 'shiftI', e.target.value, 'returnSandHopperLevel')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr>
            <td style={{ width: '60px', minWidth: '60px', textAlign: 'center', fontWeight: 600 }}>II</td>
            <td style={{ borderRight: '1px solid #e2e8f0', width: '11.67%', padding: '0.4rem' }}>
              <input
                type="number"
                value={table3.shiftII.mixNoStart || ''}
                onChange={(e) => handleTableChange(3, 'shiftII', e.target.value, 'mixNoStart')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td style={{ borderRight: '1px solid #e2e8f0', width: '11.67%', padding: '0.4rem' }}>
              <input
                type="number"
                value={table3.shiftII.mixNoEnd || ''}
                onChange={(e) => handleTableChange(3, 'shiftII', e.target.value, 'mixNoEnd')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td style={{ width: '11.67%', padding: '0.4rem', borderRight: '1px solid #e2e8f0' }}>
              <input
                type="number"
                value={table3.shiftII.mixNoTotal || ''}
                onChange={(e) => handleTableChange(3, 'shiftII', e.target.value, 'mixNoTotal')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td>
              <input
                type="number"
                value={table3.shiftII.noOfMixRejected || ''}
                onChange={(e) => handleTableChange(3, 'shiftII', e.target.value, 'noOfMixRejected')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table3.shiftII.returnSandHopperLevel || ''}
                onChange={(e) => handleTableChange(3, 'shiftII', e.target.value, 'returnSandHopperLevel')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr>
            <td style={{ width: '60px', minWidth: '60px', textAlign: 'center', fontWeight: 600 }}>III</td>
            <td style={{ borderRight: '1px solid #e2e8f0', width: '11.67%', padding: '0.4rem' }}>
              <input
                type="number"
                value={table3.shiftIII.mixNoStart || ''}
                onChange={(e) => handleTableChange(3, 'shiftIII', e.target.value, 'mixNoStart')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td style={{ borderRight: '1px solid #e2e8f0', width: '11.67%', padding: '0.4rem' }}>
              <input
                type="number"
                value={table3.shiftIII.mixNoEnd || ''}
                onChange={(e) => handleTableChange(3, 'shiftIII', e.target.value, 'mixNoEnd')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td style={{ width: '11.67%', padding: '0.4rem', borderRight: '1px solid #e2e8f0' }}>
              <input
                type="number"
                value={table3.shiftIII.mixNoTotal || ''}
                onChange={(e) => handleTableChange(3, 'shiftIII', e.target.value, 'mixNoTotal')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td>
              <input
                type="number"
                value={table3.shiftIII.noOfMixRejected || ''}
                onChange={(e) => handleTableChange(3, 'shiftIII', e.target.value, 'noOfMixRejected')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td>
              <input
                type="number"
                value={table3.shiftIII.returnSandHopperLevel || ''}
                onChange={(e) => handleTableChange(3, 'shiftIII', e.target.value, 'returnSandHopperLevel')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ fontWeight: 600, textAlign: 'center' }}>Total</td>
            <td style={{ borderRight: '1px solid #e2e8f0', width: '11.67%', padding: '0.4rem' }}>
              <input
                type="number"
                value={table3.total.mixNoEnd || ''}
                onChange={(e) => handleTableChange(3, 'total', e.target.value, 'mixNoEnd')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td style={{ width: '11.67%', padding: '0.4rem', borderRight: '1px solid #e2e8f0' }}>
              <input
                type="number"
                value={table3.total.mixNoTotal || ''}
                onChange={(e) => handleTableChange(3, 'total', e.target.value, 'mixNoTotal')}
                placeholder="Enter value"
                className="sand-table-input"
                style={{ padding: '0.3rem 0.4rem', fontSize: '0.8125rem', width: '100%' }}
              />
            </td>
            <td>
              <input
                type="number"
                value={table3.total.noOfMixRejected || ''}
                onChange={(e) => handleTableChange(3, 'total', e.target.value, 'noOfMixRejected')}
                placeholder="Enter value"
                className="sand-table-input"
              />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div className="sand-table-submit" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="sand-reset-btn"
          onClick={resetTable3}
          type="button"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          className="sand-submit-btn"
          onClick={() => handleTableSubmit(3)}
          disabled={loadingStates.table3}
        >
          {loadingStates.table3 ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
          {loadingStates.table3 ? 'Saving...' : 'Save Table 3'}
        </button>
      </div>

      {/* Table 4 */}
      <div className="sand-section-header">
        <h3>Table 4</h3>
            </div>
      <div className="sand-table-container-wrapper">
        <table className="sand-table sand-table-boxed">
          <tbody>
            <tr>
              <td>Sand Lump</td>
              <td>
              <input
                type="text"
                  value={table4.sandLump || ''}
                  onChange={(e) => handleTableChange(4, 'sandLump', e.target.value)}
                  placeholder="Enter value"
                  className="sand-table-input-small"
                />
              </td>
            </tr>
            <tr>
              <td>New Sand Wt</td>
              <td>
                <input
                  type="number"
                  value={table4.newSandWt || ''}
                  onChange={(e) => handleTableChange(4, 'newSandWt', e.target.value)}
                  placeholder="Enter value"
                  className="sand-table-input-small"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <table className="sand-shift-table">
          <thead>
            <tr>
              <th>Shift</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prepared Sand Friability ( 8.0 - 13.0 % )</td>
              <td>
                <input
                  type="number"
                  value={table4.friability.shiftI || ''}
                  onChange={(e) => handleTableChange(4, 'friability', e.target.value, 'shiftI')}
                  placeholder="Enter value"
                  className="sand-table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={table4.friability.shiftII || ''}
                  onChange={(e) => handleTableChange(4, 'friability', e.target.value, 'shiftII')}
                  placeholder="Enter value"
                  className="sand-table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={table4.friability.shiftIII || ''}
                  onChange={(e) => handleTableChange(4, 'friability', e.target.value, 'shiftIII')}
                  placeholder="Enter value"
                  className="sand-table-input"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sand-table-submit" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="sand-reset-btn"
          onClick={resetTable4}
          type="button"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          className="sand-submit-btn"
          onClick={() => handleTableSubmit(4)}
          disabled={loadingStates.table4}
        >
          {loadingStates.table4 ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
          {loadingStates.table4 ? 'Saving...' : 'Save Table 4'}
        </button>
      </div>

      {/* Table 5 */}
      <div className="sand-table5-main-card">
        <h4 className="sand-table5-main-card-title">Sand Properties & Test Parameters</h4>

        <table className="sand-table">
          <tbody>
            <tr>
              <td>Sno</td>
              <td>
                <input 
                  type="text" 
                  name="sno" 
                  value={table5.sno || ''} 
                  onChange={(e) => handleTableChange(5, 'sno', e.target.value)} 
                  placeholder="Enter Sno"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Time</td>
              <td>
                <input 
                  type="time" 
                  name="time" 
                  value={table5.time || ''} 
                  onChange={(e) => handleTableChange(5, 'time', e.target.value)} 
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Mix No</td>
              <td>
                <input 
                  type="text" 
                  name="mixNo" 
                  value={table5.mixNo || ''} 
                  onChange={(e) => handleTableChange(5, 'mixNo', e.target.value)} 
                  placeholder="Enter Mix No"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Permeability (90-160)</td>
              <td>
                <input 
                  type="number" 
                  name="permeability" 
                  value={table5.permeability || ''} 
                  onChange={(e) => handleTableChange(5, 'permeability', e.target.value)} 
                  placeholder="Enter value"
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>G.C.S (Gm/cm²)</td>
              <td>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="gcs-checkpoint"
                      value="fdyA"
                      checked={table5.gcsCheckpoint === 'fdyA'}
                      onChange={(e) => handleTableChange(5, 'gcsCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>FDY-A (Min 1800)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="gcs-checkpoint"
                      value="fdyB"
                      checked={table5.gcsCheckpoint === 'fdyB'}
                      onChange={(e) => handleTableChange(5, 'gcsCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>FDY-B (Min 1900)</span>
                  </label>
                </div>
                <input 
                  type="number" 
                  name="gcsValue" 
                  value={table5.gcsValue || ''} 
                  onChange={(e) => handleTableChange(5, 'gcsValue', e.target.value)} 
                  placeholder={table5.gcsCheckpoint === 'fdyA' ? 'FDY-A value' : table5.gcsCheckpoint === 'fdyB' ? 'FDY-B value' : 'Enter value'}
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>W.T.S (N/cm² Min 0.15)</td>
              <td>
                <input 
                  type="number" 
                  name="wts" 
                  value={table5.wts || ''} 
                  onChange={(e) => handleTableChange(5, 'wts', e.target.value)} 
                  placeholder="Enter value"
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Moisture% (3.0-4.0%)</td>
              <td>
                <input 
                  type="number" 
                  name="moisture" 
                  value={table5.moisture || ''} 
                  onChange={(e) => handleTableChange(5, 'moisture', e.target.value)} 
                  placeholder="Enter %"
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Compactability% (At DMM 33-40%)</td>
              <td>
                <input 
                  type="number" 
                  name="compactability" 
                  value={table5.compactability || ''} 
                  onChange={(e) => handleTableChange(5, 'compactability', e.target.value)} 
                  placeholder="Enter %"
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Compressability% (At DMM 20-28%)</td>
              <td>
                <input 
                  type="number" 
                  name="compressability" 
                  value={table5.compressability || ''} 
                  onChange={(e) => handleTableChange(5, 'compressability', e.target.value)} 
                  placeholder="Enter %"
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Water (Litre /Kg Mix)</td>
              <td>
                <input 
                  type="number" 
                  name="waterLitrePerKgMix" 
                  value={table5.waterLitrePerKgMix || ''} 
                  onChange={(e) => handleTableChange(5, 'waterLitrePerKgMix', e.target.value)} 
                  placeholder="Enter value"
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Sand Temp C (°C)</td>
              <td>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginBottom: '0.25rem' }}>BC</label>
                    <input 
                      type="number" 
                      name="sandTempBC" 
                      value={table5.sandTempBC || ''} 
                      onChange={(e) => handleTableChange(5, 'sandTempBC', e.target.value)} 
                      placeholder="Enter BC"
                      step="0.01"
                      className="sand-table-input"
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginBottom: '0.25rem' }}>WU</label>
                    <input 
                      type="number" 
                      name="sandTempWU" 
                      value={table5.sandTempWU || ''} 
                      onChange={(e) => handleTableChange(5, 'sandTempWU', e.target.value)} 
                      placeholder="Enter WU"
                      step="0.01"
                      className="sand-table-input"
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginBottom: '0.25rem' }}>SSU Max 45C</label>
                    <input 
                      type="number" 
                      name="sandTempSSU" 
                      value={table5.sandTempSSU || ''} 
                      onChange={(e) => handleTableChange(5, 'sandTempSSU', e.target.value)} 
                      placeholder="Enter SSU Max 45C"
                      step="0.01"
                      className="sand-table-input"
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>New Sand (kgs/Mould 0.0-5.0)</td>
              <td>
                <input 
                  type="number" 
                  name="newSandKgsPerMould" 
                  value={table5.newSandKgsPerMould || ''} 
                  onChange={(e) => handleTableChange(5, 'newSandKgsPerMould', e.target.value)} 
                  placeholder="Enter value"
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Bentonite</td>
              <td>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="bentonite-checkpoint"
                      value="withPremix"
                      checked={table5.bentoniteCheckpoint === 'withPremix'}
                      onChange={(e) => handleTableChange(5, 'bentoniteCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Bentonite Kgs/mix with premix (0.60-1.20%)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="bentonite-checkpoint"
                      value="only"
                      checked={table5.bentoniteCheckpoint === 'only'}
                      onChange={(e) => handleTableChange(5, 'bentoniteCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Bentonite kgs/mix (0.80-2.20%)</span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginBottom: '0.25rem' }}>Kgs</label>
                    <input 
                      type="number" 
                      name="bentoniteWithPremix" 
                      value={table5.bentoniteWithPremix || ''} 
                      onChange={(e) => handleTableChange(5, 'bentoniteWithPremix', e.target.value)} 
                      placeholder="Enter value"
                      step="0.01"
                      className="sand-table-input"
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginBottom: '0.25rem' }}>%</label>
                    <input 
                      type="number" 
                      name="bentoniteOnly" 
                      value={table5.bentoniteOnly || ''} 
                      onChange={(e) => handleTableChange(5, 'bentoniteOnly', e.target.value)} 
                      placeholder="Enter value"
                      step="0.01"
                      className="sand-table-input"
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Premix / Coal Dust</td>
              <td>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="premix-coaldust-checkpoint"
                      value="premix"
                      checked={table5.premixCoalDustCheckpoint === 'premix'}
                      onChange={(e) => handleTableChange(5, 'premixCoalDustCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Premix Kgs/mix (0.60-1.20%)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="premix-coaldust-checkpoint"
                      value="coalDust"
                      checked={table5.premixCoalDustCheckpoint === 'coalDust'}
                      onChange={(e) => handleTableChange(5, 'premixCoalDustCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Coal dust kgs/mix (0.20-0.70%)</span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginBottom: '0.25rem' }}>Kgs</label>
                    <input 
                      type="number" 
                      name="premixKgsMix" 
                      value={table5.premixKgsMix || ''} 
                      onChange={(e) => handleTableChange(5, 'premixKgsMix', e.target.value)} 
                      placeholder="Enter value"
                      step="0.01"
                      className="sand-table-input"
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginBottom: '0.25rem' }}>%</label>
                    <input 
                      type="number" 
                      name="coalDustKgsMix" 
                      value={table5.coalDustKgsMix || ''} 
                      onChange={(e) => handleTableChange(5, 'coalDustKgsMix', e.target.value)} 
                      placeholder="Enter value"
                      step="0.01"
                      className="sand-table-input"
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>LC SCM / Compactability Setting</td>
              <td>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="lcscm-compactability-checkpoint"
                      value="lcScm"
                      checked={table5.lcScmCompactabilityCheckpoint === 'lcScm'}
                      onChange={(e) => handleTableChange(5, 'lcScmCompactabilityCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>LC SCM (42 ± 3)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="lcscm-compactability-checkpoint"
                      value="compactabilitySetting"
                      checked={table5.lcScmCompactabilityCheckpoint === 'compactabilitySetting'}
                      onChange={(e) => handleTableChange(5, 'lcScmCompactabilityCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Compactability setting At1 (40±3)</span>
                  </label>
                </div>
                <input 
                  type="number" 
                  name="lcScmCompactabilityValue" 
                  value={table5.lcScmCompactabilityValue || ''} 
                  onChange={(e) => handleTableChange(5, 'lcScmCompactabilityValue', e.target.value)} 
                  placeholder={table5.lcScmCompactabilityCheckpoint === 'lcScm' ? 'LC SCM value' : table5.lcScmCompactabilityCheckpoint === 'compactabilitySetting' ? 'Compactability setting value' : 'Enter value'}
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Mould Strength / Shear Strength</td>
              <td>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="mouldstrength-shear-checkpoint"
                      value="mouldStrength"
                      checked={table5.mouldStrengthShearCheckpoint === 'mouldStrength'}
                      onChange={(e) => handleTableChange(5, 'mouldStrengthShearCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Mould strength SMC- (23±3)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="radio"
                      name="mouldstrength-shear-checkpoint"
                      value="shearStrength"
                      checked={table5.mouldStrengthShearCheckpoint === 'shearStrength'}
                      onChange={(e) => handleTableChange(5, 'mouldStrengthShearCheckpoint', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Shear Strength Setting At1 (5.0±1%)</span>
                  </label>
                </div>
                <input 
                  type="number" 
                  name="mouldStrengthShearValue" 
                  value={table5.mouldStrengthShearValue || ''} 
                  onChange={(e) => handleTableChange(5, 'mouldStrengthShearValue', e.target.value)} 
                  placeholder={table5.mouldStrengthShearCheckpoint === 'mouldStrength' ? 'Mould strength value' : table5.mouldStrengthShearCheckpoint === 'shearStrength' ? 'Shear strength setting value' : 'Enter value'}
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Prepared Sand Lumps/kg</td>
              <td>
                <input 
                  type="number" 
                  name="preparedSandLumpsPerKg" 
                  value={table5.preparedSandLumpsPerKg || ''} 
                  onChange={(e) => handleTableChange(5, 'preparedSandLumpsPerKg', e.target.value)} 
                  placeholder="Enter value"
                  step="0.01"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Item Name</td>
              <td>
                <input 
                  type="text" 
                  name="itemName" 
                  value={table5.itemName || ''} 
                  onChange={(e) => handleTableChange(5, 'itemName', e.target.value)} 
                  placeholder="Enter item name"
                  className="sand-table-input"
                />
              </td>
            </tr>
            <tr>
              <td>Remarks</td>
              <td>
                <textarea 
                  name="remarks" 
                  value={table5.remarks || ''} 
                  onChange={(e) => handleTableChange(5, 'remarks', e.target.value)} 
                  rows="4" 
                  placeholder="Enter any additional notes..."
                  className="sand-table-input"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="sand-table-submit" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="sand-reset-btn"
            onClick={resetTable5}
            type="button"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            className="sand-submit-btn"
            onClick={() => handleTableSubmit(5)}
            disabled={loadingStates.table5}
          >
            {loadingStates.table5 ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
            {loadingStates.table5 ? 'Saving...' : 'Save Table 5'}
          </button>
        </div>
      </div>

    </>
  );
};

export default SandTestingRecord;
