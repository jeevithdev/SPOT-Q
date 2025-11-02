import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Save, RefreshCw, FileText, Loader2, RotateCcw } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/FoundarySandTestingNote.css';
import '../../styles/PageStyles/Sandlab/SandTestingRecord.css';

const initialFormData = {
  date: new Date().toISOString().split('T')[0],
  shift: "",
  sandPlant: "",
  compactibilitySetting: "",
  shearStrengthSetting: "",
  clayTests: {
    test1: { 
      totalClay: { input1: "", input2: "", input3: "", solution: "" }, 
      activeClay: { input1: "", input2: "", solution: "" }, 
      deadClay: { input1: "", input2: "", solution: "" }, 
      vcm: { input1: "", input2: "", input3: "", solution: "" }, 
      loi: { input1: "", input2: "", input3: "", solution: "" } 
    },
    test2: { 
      totalClay: { input1: "", input2: "", input3: "", solution: "" }, 
      activeClay: { input1: "", input2: "", solution: "" }, 
      deadClay: { input1: "", input2: "", solution: "" }, 
      vcm: { input1: "", input2: "", input3: "", solution: "" }, 
      loi: { input1: "", input2: "", input3: "", solution: "" } 
    }
  },
  test1: {
    sieveSize: {
      1700: "", 850: "", 600: "", 425: "", 300: "", 212: "", 
      150: "", 106: "", 75: "", pan: "", total: ""
    }
  },
  test2: {
    sieveSize: {
      1700: "", 850: "", 600: "", 425: "", 300: "", 212: "", 
      150: "", 106: "", 75: "", pan: "", total: ""
    }
  },
  mfTest: {
    mf: {
      5: "", 10: "", 20: "", 30: "", 50: "", 70: "", 
      100: "", 140: "", 200: "", pan: "", total: ""
    },
    mfTest2: {
      5: "", 10: "", 20: "", 30: "", 50: "", 70: "", 
      100: "", 140: "", 200: "", pan: "", total: ""
    }
  },
  parameters: {
    test1: {
      compactability: "",
      permeability: "",
      gcs: "",
      wts: "",
      moisture: "",
      bentonite: "",
      coalDust: "",
      hopperLevel: "",
      shearStrength: "",
      dustCollectorSettings: "",
      returnSandMoisture: ""
    },
    test2: {
      compactability: "",
      permeability: "",
      gcs: "",
      wts: "",
      moisture: "",
      bentonite: "",
      coalDust: "",
      hopperLevel: "",
      shearStrength: "",
      dustCollectorSettings: "",
      returnSandMoisture: ""
    }
  },
  additionalData: {
    test1: { afsNo: "", fines: "", gd: "" },
    test2: { afsNo: "", fines: "", gd: "" }
  },
  remarks: ""
};

export default function FoundrySandTestingNote() {
  const navigate = useNavigate();
  
  // Primary data (must be saved first)
  const [primaryData, setPrimaryData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: "",
    sandPlant: "",
    compactibilitySetting: "",
    shearStrengthSetting: ""
  });
  const [isPrimaryLocked, setIsPrimaryLocked] = useState(false);
  const [checkingData, setCheckingData] = useState(false);

  // Check if primary data exists for date and shift combination
  const checkExistingPrimaryData = async (date, shift) => {
    if (!date || !shift) {
      setIsPrimaryLocked(false);
      return;
    }

    try {
      setCheckingData(true);
      const response = await api.get(`/v1/foundry-sand-testing-notes/primary?date=${encodeURIComponent(date)}&shift=${encodeURIComponent(shift)}`);
      
      if (response.success && response.data && response.data.length > 0) {
        const record = response.data[0];
        // If record exists, lock primary fields and populate them
        setIsPrimaryLocked(true);
        setPrimaryData({
          date: record.date ? new Date(record.date).toISOString().split('T')[0] : date,
          shift: record.shift ? String(record.shift) : shift,
          sandPlant: record.sandPlant ? String(record.sandPlant) : '',
          compactibilitySetting: record.compactibilitySetting ? String(record.compactibilitySetting) : '',
          shearStrengthSetting: record.shearStrengthSetting ? String(record.shearStrengthSetting) : ''
        });
        
        // Also load existing section data
        if (record.clayTests) setSectionData(prev => ({ ...prev, clayTests: record.clayTests }));
        if (record.test1) setSectionData(prev => ({ ...prev, test1: record.test1 }));
        if (record.test2) setSectionData(prev => ({ ...prev, test2: record.test2 }));
        if (record.mfTest) setSectionData(prev => ({ ...prev, mfTest: record.mfTest }));
        if (record.parameters) setSectionData(prev => ({ ...prev, parameters: record.parameters }));
        if (record.additionalData) setSectionData(prev => ({ ...prev, additionalData: record.additionalData }));
        if (record.remarks !== undefined) setSectionData(prev => ({ ...prev, remarks: String(record.remarks || '') }));
      } else {
        setIsPrimaryLocked(false);
      }
    } catch (error) {
      console.error('Error checking primary data:', error);
      setIsPrimaryLocked(false);
    } finally {
      setCheckingData(false);
    }
  };

  // Check for primary data when date or shift changes
  useEffect(() => {
    if (primaryData.date && primaryData.shift) {
      const timeoutId = setTimeout(() => {
        checkExistingPrimaryData(primaryData.date, primaryData.shift);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setIsPrimaryLocked(false);
    }
  }, [primaryData.date, primaryData.shift]);
  
  // Other sections data
  const [sectionData, setSectionData] = useState({
    clayTests: {
      test1: { 
        totalClay: { input1: "", input2: "", input3: "", solution: "" }, 
        activeClay: { input1: "", input2: "", solution: "" }, 
        deadClay: { input1: "", input2: "", solution: "" }, 
        vcm: { input1: "", input2: "", input3: "", solution: "" }, 
        loi: { input1: "", input2: "", input3: "", solution: "" } 
      },
      test2: { 
        totalClay: { input1: "", input2: "", input3: "", solution: "" }, 
        activeClay: { input1: "", input2: "", solution: "" }, 
        deadClay: { input1: "", input2: "", solution: "" }, 
        vcm: { input1: "", input2: "", input3: "", solution: "" }, 
        loi: { input1: "", input2: "", input3: "", solution: "" } 
      }
    },
    test1: {
      sieveSize: {
        1700: "", 850: "", 600: "", 425: "", 300: "", 212: "", 
        150: "", 106: "", 75: "", pan: "", total: ""
      }
    },
    test2: {
      sieveSize: {
        1700: "", 850: "", 600: "", 425: "", 300: "", 212: "", 
        150: "", 106: "", 75: "", pan: "", total: ""
      }
    },
    mfTest: {
      mf: {
        5: "", 10: "", 20: "", 30: "", 50: "", 70: "", 
        100: "", 140: "", 200: "", pan: "", total: ""
      },
      mfTest2: {
        5: "", 10: "", 20: "", 30: "", 50: "", 70: "", 
        100: "", 140: "", 200: "", pan: "", total: ""
      }
    },
    parameters: {
      test1: {
        compactability: "",
        permeability: "",
        gcs: "",
        wts: "",
        moisture: "",
        bentonite: "",
        coalDust: "",
        hopperLevel: "",
        shearStrength: "",
        dustCollectorSettings: "",
        returnSandMoisture: ""
      },
      test2: {
        compactability: "",
        permeability: "",
        gcs: "",
        wts: "",
        moisture: "",
        bentonite: "",
        coalDust: "",
        hopperLevel: "",
        shearStrength: "",
        dustCollectorSettings: "",
        returnSandMoisture: ""
      }
    },
    additionalData: {
      test1: { afsNo: "", fines: "", gd: "" },
      test2: { afsNo: "", fines: "", gd: "" }
    },
    remarks: ""
  });
  
  const [loadingStates, setLoadingStates] = useState({
    primary: false,
    clayParameters: false,
    sieveTesting: false,
    testParameters: false,
    additionalData: false,
    remarks: false
  });

  // Handle primary data changes
  const handlePrimaryChange = (field, value) => {
    setPrimaryData(prev => ({ ...prev, [field]: value }));
  };

  // Handle section data changes
  const handleInputChange = (section, field, value, subField = null, subSubField = null) => {
    if (subSubField) {
      // For nested structure like clayTests.test1.totalClay.input1
      setSectionData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [subField]: {
              ...prev[section][field][subField],
              [subSubField]: value
            }
          }
        }
      }));
    } else if (subField) {
      setSectionData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [subField]: value
          }
        }
      }));
    } else if (field) {
      setSectionData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setSectionData(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };

  const calculateClaySolution = (param, testNum) => {
    const testData = sectionData.clayTests[testNum][param];
    
    if (!testData) return "";
    
    if (param === "activeClay") {
      // activeClay: input1 x input2 = Solution %
      const input1 = parseFloat(testData.input1) || 0;
      const input2 = parseFloat(testData.input2) || 0;
      const solution = input1 * input2;
      return isNaN(solution) ? "" : solution.toFixed(2);
    } else if (param === "deadClay") {
      // deadClay: input1 - input2 = Solution %
      const input1 = parseFloat(testData.input1) || 0;
      const input2 = parseFloat(testData.input2) || 0;
      const solution = input1 - input2;
      return isNaN(solution) ? "" : solution.toFixed(2);
    } else {
      // totalClay, vcm, loi: (input1 - input2 / input3) x 100 = Solution %
      const input1 = parseFloat(testData.input1) || 0;
      const input2 = parseFloat(testData.input2) || 0;
      const input3 = parseFloat(testData.input3) || 0;
      if (input3 === 0) return "";
      const solution = ((input1 - input2) / input3) * 100;
      return isNaN(solution) ? "" : solution.toFixed(2);
    }
  };

  // Handle primary data submission
  const handlePrimarySubmit = async (e) => {
    e.preventDefault();
    
    if (!primaryData.date || !primaryData.shift || !primaryData.sandPlant) {
      alert('Please fill in Date, Shift, and Sand Plant fields');
      return;
    }

    if (isPrimaryLocked) {
      alert('Primary data is already saved. Use Reports page to edit.');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, primary: true }));
      const payload = {
        ...primaryData,
        section: 'primary'
      };

      const response = await api.post('/v1/foundry-sand-testing-notes', payload);
      
      if (response.success) {
        alert('Primary data saved successfully!');
        setIsPrimaryLocked(true);
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      console.error('Error saving primary data:', error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, primary: false }));
    }
  };

  // Handle section-wise submissions
  const handleSectionSubmit = async (sectionName) => {
    if (!isPrimaryLocked) {
      alert('Please save Primary data first');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, [sectionName]: true }));
      
      const payload = {
        date: primaryData.date,
        shift: primaryData.shift,
        section: sectionName,
        ...(sectionName === 'clayParameters' && { clayTests: sectionData.clayTests }),
        ...(sectionName === 'sieveTesting' && { 
          test1: sectionData.test1,
          test2: sectionData.test2,
          mfTest: sectionData.mfTest
        }),
        ...(sectionName === 'testParameters' && { parameters: sectionData.parameters }),
        ...(sectionName === 'additionalData' && { additionalData: sectionData.additionalData }),
        ...(sectionName === 'remarks' && { remarks: sectionData.remarks })
      };

      const response = await api.post('/v1/foundry-sand-testing-notes', payload);
      
      if (response.success) {
        alert(`${sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} saved successfully!`);
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      console.error(`Error saving ${sectionName}:`, error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, [sectionName]: false }));
    }
  };

  // Reset primary data
  const resetPrimaryData = () => {
    if (!window.confirm('Are you sure you want to reset Primary data?')) return;
    setPrimaryData({
      date: new Date().toISOString().split('T')[0],
      shift: "",
      sandPlant: "",
      compactibilitySetting: "",
      shearStrengthSetting: ""
    });
    setIsPrimaryLocked(false);
  };

  // Handle section-wise resets
  const handleSectionReset = (sectionName) => {
    if (!window.confirm(`Are you sure you want to reset ${sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}?`)) return;
    
    if (sectionName === 'clayParameters') {
      setSectionData(prev => ({
        ...prev,
        clayTests: initialFormData.clayTests
      }));
    } else if (sectionName === 'sieveTesting') {
      setSectionData(prev => ({
        ...prev,
        test1: initialFormData.test1,
        test2: initialFormData.test2,
        mfTest: {
          mf: initialFormData.mfTest.mf,
          mfTest2: initialFormData.mfTest.mfTest2
        }
      }));
    } else if (sectionName === 'testParameters') {
      setSectionData(prev => ({
        ...prev,
        parameters: initialFormData.parameters
      }));
    } else if (sectionName === 'additionalData') {
      setSectionData(prev => ({
        ...prev,
        additionalData: initialFormData.additionalData
      }));
    } else if (sectionName === 'remarks') {
      setSectionData(prev => ({
        ...prev,
        remarks: ""
      }));
    }
  };


  const handleViewReport = () => {
    navigate('/sand-lab/foundry-sand-testing-note/report');
  };

  const sieveData = [
    { size: 1700, mf: 5 },
    { size: 850, mf: 10 },
    { size: 600, mf: 20 },
    { size: 425, mf: 30 },
    { size: 300, mf: 40 },
    { size: 212, mf: 50 },
    { size: 150, mf: 70 },
    { size: 106, mf: 100 },
    { size: 75, mf: 140 },
    { size: 53, mf: 200 },
    { size: "Pan", mf: 300 },
  ];

  return (
    <>
      {checkingData && (
        <div className="foundry-loader-overlay">
          <Loader />
        </div>
      )}
      {/* Header */}
      <div className="foundry-header">
        <div className="foundry-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Foundry Sand Testing Note
            <button 
              className="foundry-view-report-btn"
              onClick={handleViewReport}
              title="View Reports"
            >
              <FileText size={16} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
      </div>

      {/* Primary Section */}
      <div className="foundry-section">
        <h3 className="foundry-section-title">Primary</h3>
        <div className="foundry-form-grid">
          <div className="foundry-form-group">
            <label>Date *</label>
            <CustomDatePicker
              value={primaryData.date}
              onChange={(e) => {
                const dateValue = e?.target?.value || e || '';
                handlePrimaryChange("date", dateValue);
              }}
              name="date"
              disabled={isPrimaryLocked || checkingData}
              style={{
                backgroundColor: isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                cursor: isPrimaryLocked ? 'not-allowed' : 'text'
              }}
            />
          </div>
        <div className="foundry-form-group">
          <label>Shift *</label>
          <input
            type="text"
            placeholder="e.g. 2nd Shift"
            value={primaryData.shift}
            onChange={(e) => handlePrimaryChange("shift", e.target.value)}
            disabled={isPrimaryLocked || checkingData}
            readOnly={isPrimaryLocked}
            style={{
              backgroundColor: isPrimaryLocked ? '#f1f5f9' : '#ffffff',
              cursor: isPrimaryLocked ? 'not-allowed' : 'text'
            }}
          />
        </div>
        <div className="foundry-form-group">
          <label>Sand Plant *</label>
          <input
            type="text"
            placeholder="e.g. DISA"
            value={primaryData.sandPlant}
            onChange={(e) => handlePrimaryChange("sandPlant", e.target.value)}
            disabled={isPrimaryLocked || checkingData}
            readOnly={isPrimaryLocked}
            style={{
              backgroundColor: isPrimaryLocked ? '#f1f5f9' : '#ffffff',
              cursor: isPrimaryLocked ? 'not-allowed' : 'text'
            }}
          />
        </div>
        <div className="foundry-form-group">
          <label>Compactability Setting</label>
          <input
            type="text"
            placeholder="e.g. J.C. mode"
            value={primaryData.compactibilitySetting}
            onChange={(e) => handlePrimaryChange("compactibilitySetting", e.target.value)}
            disabled={isPrimaryLocked || checkingData}
            readOnly={isPrimaryLocked}
            style={{
              backgroundColor: isPrimaryLocked ? '#f1f5f9' : '#ffffff',
              cursor: isPrimaryLocked ? 'not-allowed' : 'text'
            }}
          />
        </div>
        <div className="foundry-form-group">
          <label>Shear/Mould Strength Setting</label>
          <input
            type="text"
            placeholder="e.g. MP.VOX"
            value={primaryData.shearStrengthSetting}
            onChange={(e) => handlePrimaryChange("shearStrengthSetting", e.target.value)}
            disabled={isPrimaryLocked || checkingData}
            readOnly={isPrimaryLocked}
            style={{
              backgroundColor: isPrimaryLocked ? '#f1f5f9' : '#ffffff',
              cursor: isPrimaryLocked ? 'not-allowed' : 'text'
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handlePrimarySubmit}
          disabled={loadingStates.primary || checkingData || isPrimaryLocked || !primaryData.date || !primaryData.shift || !primaryData.sandPlant}
          className="foundry-submit-btn"
          title={isPrimaryLocked ? 'Primary data is already saved. Use Reports page to edit.' : 'Save Primary'}
        >
          {loadingStates.primary ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loadingStates.primary ? 'Saving...' : (isPrimaryLocked ? 'Primary Data Locked' : 'Save Primary')}
        </button>
      </div>
      </div>

      {/* Clay Parameters */}
      <div className="foundry-section">
        <h3 className="foundry-section-title">Clay Parameters</h3>
            <div className="foundry-table-wrapper">
              <table className="foundry-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>TEST-1</th>
                    <th>TEST-2</th>
                  </tr>
                </thead>
                <tbody>
                  {["totalClay", "activeClay", "deadClay", "vcm", "loi"].map((param) => (
                    <tr key={param}>
                      <td>{param.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {param === "activeClay" || param === "deadClay" ? (
                            <>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 1"
                                value={sectionData.clayTests.test1[param]?.input1 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test1", e.target.value, param, "input1");
                                  // Trigger recalculation
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test1");
                                    handleInputChange("clayTests", "test1", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '80px', padding: '0.375rem' }}
                              />
                              <span>{param === "activeClay" ? "x" : "-"}</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 2"
                                value={sectionData.clayTests.test1[param]?.input2 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test1", e.target.value, param, "input2");
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test1");
                                    handleInputChange("clayTests", "test1", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '80px', padding: '0.375rem' }}
                              />
                              <span>=</span>
                              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9375rem' }}>
                                {sectionData.clayTests.test1[param]?.solution || '0'}%
                              </span>
                            </>
                          ) : (
                            <>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 1"
                                value={sectionData.clayTests.test1[param]?.input1 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test1", e.target.value, param, "input1");
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test1");
                                    handleInputChange("clayTests", "test1", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '70px', padding: '0.375rem' }}
                              />
                              <span>-</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 2"
                                value={sectionData.clayTests.test1[param]?.input2 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test1", e.target.value, param, "input2");
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test1");
                                    handleInputChange("clayTests", "test1", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '70px', padding: '0.375rem' }}
                              />
                              <span>/</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 3"
                                value={sectionData.clayTests.test1[param]?.input3 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test1", e.target.value, param, "input3");
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test1");
                                    handleInputChange("clayTests", "test1", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '70px', padding: '0.375rem' }}
                              />
                              <span>x 100 =</span>
                              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9375rem' }}>
                                {sectionData.clayTests.test1[param]?.solution || '0'}%
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {param === "activeClay" || param === "deadClay" ? (
                            <>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 1"
                                value={sectionData.clayTests.test2[param]?.input1 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test2", e.target.value, param, "input1");
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test2");
                                    handleInputChange("clayTests", "test2", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '80px', padding: '0.375rem' }}
                              />
                              <span>{param === "activeClay" ? "x" : "-"}</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 2"
                                value={sectionData.clayTests.test2[param]?.input2 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test2", e.target.value, param, "input2");
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test2");
                                    handleInputChange("clayTests", "test2", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '80px', padding: '0.375rem' }}
                              />
                              <span>=</span>
                              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9375rem' }}>
                                {sectionData.clayTests.test2[param]?.solution || '0'}%
                              </span>
                            </>
                          ) : (
                            <>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 1"
                                value={sectionData.clayTests.test2[param]?.input1 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test2", e.target.value, param, "input1");
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test2");
                                    handleInputChange("clayTests", "test2", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '70px', padding: '0.375rem' }}
                              />
                              <span>-</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 2"
                                value={sectionData.clayTests.test2[param]?.input2 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test2", e.target.value, param, "input2");
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test2");
                                    handleInputChange("clayTests", "test2", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '70px', padding: '0.375rem' }}
                              />
                              <span>/</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Input 3"
                                value={sectionData.clayTests.test2[param]?.input3 || ''}
                                disabled={!isPrimaryLocked}
                                onChange={(e) => {
                                  handleInputChange("clayTests", "test2", e.target.value, param, "input3");
                                  setTimeout(() => {
                                    const solution = calculateClaySolution(param, "test2");
                                    handleInputChange("clayTests", "test2", solution, param, "solution");
                                  }, 0);
                                }}
                                style={{ width: '70px', padding: '0.375rem' }}
                              />
                              <span>x 100 =</span>
                              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9375rem' }}>
                                {sectionData.clayTests.test2[param]?.solution || '0'}%
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => handleSectionReset('clayParameters')}
          disabled={loadingStates.clayParameters || !isPrimaryLocked}
          className="foundry-reset-btn"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          type="button"
          onClick={() => handleSectionSubmit('clayParameters')}
          disabled={loadingStates.clayParameters || !isPrimaryLocked}
          className="foundry-submit-btn"
        >
          {loadingStates.clayParameters ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loadingStates.clayParameters ? 'Saving...' : 'Save Clay Parameters'}
        </button>
      </div>
      </div>

      {/* Sieve Testing */}
      <div className="foundry-section">
        <h3 className="foundry-section-title">Sieve Testing</h3>
            <div className="foundry-table-wrapper">
              <table className="foundry-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Sieve size (Mic)</th>
                    <th colSpan="2">% Wt retained sand</th>
                    <th rowSpan="2">MF</th>
                    <th colSpan="2">Product</th>
                  </tr>
                  <tr>
                    <th>TEST-1</th>
                    <th>TEST-2</th>
                    <th>TEST-1</th>
                    <th>TEST-2</th>
                  </tr>
                </thead>
                <tbody>
                  {sieveData.map((row) => (
                    <tr key={row.size}>
                      <td>{row.size}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter %"
                          value={sectionData.test1.sieveSize[row.size] || ''}
                          onChange={(e) => handleInputChange("test1", "sieveSize", e.target.value, row.size)}
                          disabled={!isPrimaryLocked}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter %"
                          value={sectionData.test2.sieveSize[row.size] || ''}
                          onChange={(e) => handleInputChange("test2", "sieveSize", e.target.value, row.size)}
                          disabled={!isPrimaryLocked}
                        />
                      </td>
                      <td>{row.mf}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Product"
                          value={sectionData.mfTest.mf[row.mf] || ''}
                          onChange={(e) => handleInputChange("mfTest", "mf", e.target.value, row.mf)}
                          disabled={!isPrimaryLocked}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Product"
                          value={sectionData.mfTest.mfTest2[row.mf] || ''}
                          onChange={(e) => handleInputChange("mfTest", "mfTest2", e.target.value, row.mf)}
                          disabled={!isPrimaryLocked}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="foundry-table-total">
                    <td><strong>Total</strong></td>
                    <td>
                      <input
                        type="text"
                        placeholder="Total"
                        value={sectionData.test1.sieveSize.total}
                        onChange={(e) => handleInputChange("test1", "sieveSize", e.target.value, "total")}
                        disabled={!isPrimaryLocked}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Total"
                        value={sectionData.test2.sieveSize.total}
                        onChange={(e) => handleInputChange("test2", "sieveSize", e.target.value, "total")}
                        disabled={!isPrimaryLocked}
                      />
                    </td>
                    <td><strong>Total</strong></td>
                    <td>
                      <input
                        type="text"
                        placeholder="Total"
                        value={sectionData.mfTest.mf.total}
                        onChange={(e) => handleInputChange("mfTest", "mf", e.target.value, "total")}
                        disabled={!isPrimaryLocked}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Total"
                        value={sectionData.mfTest.mfTest2.total || ''}
                        onChange={(e) => handleInputChange("mfTest", "mfTest2", e.target.value, "total")}
                        disabled={!isPrimaryLocked}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => handleSectionReset('sieveTesting')}
          disabled={loadingStates.sieveTesting || !isPrimaryLocked}
          className="foundry-reset-btn"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          type="button"
          onClick={() => handleSectionSubmit('sieveTesting')}
          disabled={loadingStates.sieveTesting || !isPrimaryLocked}
          className="foundry-submit-btn"
        >
          {loadingStates.sieveTesting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loadingStates.sieveTesting ? 'Saving...' : 'Save Sieve Testing'}
        </button>
      </div>
      </div>

      {/* Test Parameters */}
      <div className="foundry-section">
        <h3 className="foundry-section-title">Test Parameters</h3>
            <div className="foundry-table-wrapper">
              <table className="foundry-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>TEST-1</th>
                    <th>TEST-2</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "compactability", label: "Compactability" },
                    { key: "permeability", label: "Permeability" },
                    { key: "gcs", label: "GCS" },
                    { key: "wts", label: "WTS" },
                    { key: "moisture", label: "Moisture" },
                    { key: "bentonite", label: "Bentonite" },
                    { key: "coalDust", label: "CoalDust" },
                    { key: "hopperLevel", label: "Hopper Level" },
                    { key: "shearStrength", label: "Shear Strength" },
                    { key: "dustCollectorSettings", label: "Dust Collector Settings" },
                    { key: "returnSandMoisture", label: "Return Sand Moisture" }
                  ].map((param) => (
                    <tr key={param.key}>
                      <td>{param.label}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter value"
                          value={sectionData.parameters.test1[param.key]}
                          onChange={(e) => handleInputChange("parameters", "test1", e.target.value, param.key)}
                          disabled={!isPrimaryLocked}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter value"
                          value={sectionData.parameters.test2[param.key]}
                          onChange={(e) => handleInputChange("parameters", "test2", e.target.value, param.key)}
                          disabled={!isPrimaryLocked}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => handleSectionReset('testParameters')}
          disabled={loadingStates.testParameters || !isPrimaryLocked}
          className="foundry-reset-btn"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          type="button"
          onClick={() => handleSectionSubmit('testParameters')}
          disabled={loadingStates.testParameters || !isPrimaryLocked}
          className="foundry-submit-btn"
        >
          {loadingStates.testParameters ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loadingStates.testParameters ? 'Saving...' : 'Save Test Parameters'}
        </button>
      </div>
      </div>

      {/* Additional Data */}
      <div className="foundry-section">
        <h3 className="foundry-section-title">Additional Data</h3>
            <div className="foundry-table-wrapper">
              <table className="foundry-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>TEST-1</th>
                    <th>TEST-2</th>
                  </tr>
                </thead>
                <tbody>
                  {["afsNo", "fines", "gd"].map((param) => (
                    <tr key={param}>
                      <td>{param.toUpperCase()}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter value"
                          value={sectionData.additionalData.test1[param]}
                          onChange={(e) => handleInputChange("additionalData", "test1", e.target.value, param)}
                          disabled={!isPrimaryLocked}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter value"
                          value={sectionData.additionalData.test2[param]}
                          onChange={(e) => handleInputChange("additionalData", "test2", e.target.value, param)}
                          disabled={!isPrimaryLocked}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => handleSectionReset('additionalData')}
          disabled={loadingStates.additionalData || !isPrimaryLocked}
          className="foundry-reset-btn"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          type="button"
          onClick={() => handleSectionSubmit('additionalData')}
          disabled={loadingStates.additionalData || !isPrimaryLocked}
          className="foundry-submit-btn"
        >
          {loadingStates.additionalData ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loadingStates.additionalData ? 'Saving...' : 'Save Additional Data'}
        </button>
      </div>
      </div>

      {/* Remarks */}
      <div className="foundry-section">
        <h3 className="foundry-section-title">Remarks</h3>
        <div className="foundry-form-group">
          <label>Remarks</label>
          <textarea
            value={sectionData.remarks}
            onChange={(e) => handleInputChange("remarks", null, e.target.value)}
            placeholder="Enter any additional remarks..."
            rows="4"
            disabled={!isPrimaryLocked}
            style={{
              backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
              cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
            }}
          />
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => handleSectionReset('remarks')}
            disabled={loadingStates.remarks || !isPrimaryLocked}
            className="foundry-reset-btn"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            type="button"
            onClick={() => handleSectionSubmit('remarks')}
            disabled={loadingStates.remarks || !isPrimaryLocked}
            className="foundry-submit-btn"
          >
            {loadingStates.remarks ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loadingStates.remarks ? 'Saving...' : 'Save Remarks'}
          </button>
        </div>
      </div>
    </>
  );
}
