import React, { useState } from "react";
import { Save, Plus, X, RefreshCw } from "lucide-react";
import CustomDatePicker from "../../Components/CustomDatePicker";
import { CustomTimeInput, Time, PlusButton, MinusButton } from "../../Components/Buttons";
import "../../styles/PageStyles/Moulding/DisamaticProduct.css";

const initialFormData = {
  date: "",
  shift: "",
  incharge: "",
  ppOperator: "",
  members: [""],
  productionTable: [{ counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }],
  nextShiftPlanTable: [{ componentName: "", plannedMoulds: "", remarks: "" }],
  delaysTable: [{ delays: "", durationMinutes: [""], fromTime: [""], toTime: [""] }],
  mouldHardnessTable: [{ componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }],
  patternTempTable: [{ item: "", pp: "", sp: "" }],
  significantEvent: "",
  maintenance: "",
  supervisorName: "",
};

// Helper function to create Time object from time string (e.g., "08:30 AM" or "08:30")
const createTimeFromString = (timeStr) => {
  if (!timeStr) return null;
  try {
    // Check if it has AM/PM
    const ampmMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (ampmMatch) {
      let hour = parseInt(ampmMatch[1], 10);
      const minute = parseInt(ampmMatch[2], 10);
      const period = ampmMatch[3].toUpperCase();
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return new Time(hour, minute);
    }
    // 24-hour format
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1], 10);
      const minute = parseInt(timeMatch[2], 10);
      return new Time(hour, minute);
    }
    return null;
  } catch {
    return null;
  }
};

// Helper function to convert Time object to string format (e.g., "08:30 AM")
const formatTimeToString = (timeObj) => {
  if (!timeObj) return '';
  let hour = timeObj.hour;
  const minute = timeObj.minute;
  const period = hour >= 12 ? 'PM' : 'AM';
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
};

const DisamaticProduct = () => {
  const [formData, setFormData] = useState(initialFormData);
  
  // Validation states (null = neutral, true = valid/green, false = invalid/red)
  const [dateValid, setDateValid] = useState(null);
  const [shiftValid, setShiftValid] = useState(null);
  const [inchargeValid, setInchargeValid] = useState(null);
  const [ppOperatorValid, setPpOperatorValid] = useState(null);
  const [membersValid, setMembersValid] = useState([null]);
  const [supervisorNameValid, setSupervisorNameValid] = useState(null);
  const [significantEventValid, setSignificantEventValid] = useState(null);
  const [maintenanceValid, setMaintenanceValid] = useState(null);
  
  // Table validation states (arrays of validation objects for each row)
  const [productionTableValid, setProductionTableValid] = useState([{
    counterNo: null, componentName: null, produced: null, poured: null, cycleTime: null, mouldsPerHour: null, remarks: null
  }]);
  const [nextShiftPlanTableValid, setNextShiftPlanTableValid] = useState([{
    componentName: null, plannedMoulds: null, remarks: null
  }]);
  const [delaysTableValid, setDelaysTableValid] = useState([{
    delays: null, durationMinutes: [null], fromTime: [null], toTime: [null]
  }]);
  const [mouldHardnessTableValid, setMouldHardnessTableValid] = useState([{
    componentName: null, mpPP: null, mpSP: null, bsPP: null, bsSP: null, remarks: null
  }]);
  const [patternTempTableValid, setPatternTempTableValid] = useState([{
    item: null, pp: null, sp: null
  }]);

  // Validation helper function
  const getValidationClass = (isValid) => {
    if (isValid === true) return 'valid-input';
    if (isValid === false) return 'invalid-input';
    return '';
  };

  // Handle basic field changes with validation
  const handleChange = (field, value) => {
    // Validate Date
    if (field === 'date') {
      if (value.trim() === '') {
        setDateValid(null);
      } else {
        setDateValid(value.trim().length > 0);
      }
    }

    // Validate Shift
    if (field === 'shift') {
      if (value.trim() === '') {
        setShiftValid(null);
      } else {
        setShiftValid(value.trim().length > 0);
      }
    }

    // Validate Incharge
    if (field === 'incharge') {
      if (value.trim() === '') {
        setInchargeValid(null);
      } else {
        setInchargeValid(value.trim().length > 0);
      }
    }

    // Validate PP Operator
    if (field === 'ppOperator') {
      if (value.trim() === '') {
        setPpOperatorValid(null);
      } else {
        setPpOperatorValid(value.trim().length > 0);
      }
    }

    // Validate Supervisor Name
    if (field === 'supervisorName') {
      if (value.trim() === '') {
        setSupervisorNameValid(null);
      } else {
        setSupervisorNameValid(value.trim().length > 0);
      }
    }

    // Validate Significant Event
    if (field === 'significantEvent') {
      if (value.trim() === '') {
        setSignificantEventValid(null);
      } else {
        setSignificantEventValid(value.trim().length > 0);
      }
    }

    // Validate Maintenance
    if (field === 'maintenance') {
      if (value.trim() === '') {
        setMaintenanceValid(null);
      } else {
        setMaintenanceValid(value.trim().length > 0);
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Members management
  const handleMemberChange = (index, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    
    // Update validation for this member
    const newMembersValid = [...membersValid];
    if (value.trim() === '') {
      newMembersValid[index] = null;
    } else {
      newMembersValid[index] = value.trim().length > 0;
    }
    setMembersValid(newMembersValid);
    
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const addMemberField = () => {
    setFormData(prev => ({ ...prev, members: [...prev.members, ""] }));
    setMembersValid(prev => [...prev, null]);
  };

  const removeMemberField = (index) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
    setMembersValid(prev => prev.filter((_, i) => i !== index));
  };

  // Production Table
  const addProductionRow = () => {
    setFormData(prev => ({
      ...prev,
      productionTable: [...prev.productionTable, { counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }]
    }));
    setProductionTableValid(prev => [...prev, {
      counterNo: null, componentName: null, produced: null, poured: null, cycleTime: null, mouldsPerHour: null, remarks: null
    }]);
  };

  const deleteProductionRow = (index) => {
    setFormData(prev => ({
      ...prev,
      productionTable: prev.productionTable.filter((_, i) => i !== index)
    }));
    setProductionTableValid(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductionChange = (index, field, value) => {
    const newTable = [...formData.productionTable];
    newTable[index][field] = value;
    setFormData(prev => ({ ...prev, productionTable: newTable }));
    
    // Update validation
    const newValid = [...productionTableValid];
    if (field === 'produced' || field === 'poured' || field === 'mouldsPerHour') {
      // Numeric fields
      if (value === '' || value.trim() === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = !isNaN(value) && parseFloat(value) >= 0;
      }
    } else if (field === 'cycleTime') {
      // Time field
      if (!value || value === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = value.length > 0;
      }
    } else {
      // Text fields
      if (value.trim() === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = value.trim().length > 0;
      }
    }
    setProductionTableValid(newValid);
  };

  // Next Shift Plan Table
  const addNextShiftPlanRow = () => {
    setFormData(prev => ({
      ...prev,
      nextShiftPlanTable: [...prev.nextShiftPlanTable, { componentName: "", plannedMoulds: "", remarks: "" }]
    }));
    setNextShiftPlanTableValid(prev => [...prev, { componentName: null, plannedMoulds: null, remarks: null }]);
  };

  const deleteNextShiftPlanRow = (index) => {
    setFormData(prev => ({
      ...prev,
      nextShiftPlanTable: prev.nextShiftPlanTable.filter((_, i) => i !== index)
    }));
    setNextShiftPlanTableValid(prev => prev.filter((_, i) => i !== index));
  };

  const handleNextShiftPlanChange = (index, field, value) => {
    const newTable = [...formData.nextShiftPlanTable];
    newTable[index][field] = value;
    setFormData(prev => ({ ...prev, nextShiftPlanTable: newTable }));
    
    // Update validation
    const newValid = [...nextShiftPlanTableValid];
    if (field === 'plannedMoulds') {
      // Numeric field
      if (value === '' || value.trim() === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = !isNaN(value) && parseFloat(value) >= 0;
      }
    } else {
      // Text fields
      if (value.trim() === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = value.trim().length > 0;
      }
    }
    setNextShiftPlanTableValid(newValid);
  };

  // Delays Table
  const addDelaysRow = () => {
    setFormData(prev => ({
      ...prev,
      delaysTable: [...prev.delaysTable, { delays: "", durationMinutes: [""], fromTime: [""], toTime: [""] }]
    }));
    setDelaysTableValid(prev => [...prev, { delays: null, durationMinutes: [null], fromTime: [null], toTime: [null] }]);
  };

  const deleteDelaysRow = (index) => {
    setFormData(prev => ({
      ...prev,
      delaysTable: prev.delaysTable.filter((_, i) => i !== index)
    }));
    setDelaysTableValid(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelaysChange = (index, field, value) => {
    const newTable = [...formData.delaysTable];
    newTable[index][field] = value;
    setFormData(prev => ({ ...prev, delaysTable: newTable }));
    
    // Update validation for delays field
    if (field === 'delays') {
      const newValid = [...delaysTableValid];
      if (value.trim() === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = value.trim().length > 0;
      }
      setDelaysTableValid(newValid);
    }
  };

  // Add/Remove duration minute inputs
  const addDurationInput = (rowIndex) => {
    const newTable = [...formData.delaysTable];
    if (newTable[rowIndex].durationMinutes.length < 10) {
      newTable[rowIndex].durationMinutes = [...newTable[rowIndex].durationMinutes, ""];
      newTable[rowIndex].fromTime = [...newTable[rowIndex].fromTime, ""];
      newTable[rowIndex].toTime = [...newTable[rowIndex].toTime, ""];
      setFormData(prev => ({ ...prev, delaysTable: newTable }));
      
      // Update validation
      const newValid = [...delaysTableValid];
      newValid[rowIndex].durationMinutes = [...newValid[rowIndex].durationMinutes, null];
      newValid[rowIndex].fromTime = [...newValid[rowIndex].fromTime, null];
      newValid[rowIndex].toTime = [...newValid[rowIndex].toTime, null];
      setDelaysTableValid(newValid);
    }
  };

  const removeDurationInput = (rowIndex, inputIndex) => {
    const newTable = [...formData.delaysTable];
    if (newTable[rowIndex].durationMinutes.length > 1) {
      newTable[rowIndex].durationMinutes = newTable[rowIndex].durationMinutes.filter((_, i) => i !== inputIndex);
      newTable[rowIndex].fromTime = newTable[rowIndex].fromTime.filter((_, i) => i !== inputIndex);
      newTable[rowIndex].toTime = newTable[rowIndex].toTime.filter((_, i) => i !== inputIndex);
      setFormData(prev => ({ ...prev, delaysTable: newTable }));
      
      // Update validation
      const newValid = [...delaysTableValid];
      newValid[rowIndex].durationMinutes = newValid[rowIndex].durationMinutes.filter((_, i) => i !== inputIndex);
      newValid[rowIndex].fromTime = newValid[rowIndex].fromTime.filter((_, i) => i !== inputIndex);
      newValid[rowIndex].toTime = newValid[rowIndex].toTime.filter((_, i) => i !== inputIndex);
      setDelaysTableValid(newValid);
    }
  };

  const handleDurationInputChange = (rowIndex, inputIndex, value) => {
    const newTable = [...formData.delaysTable];
    newTable[rowIndex].durationMinutes[inputIndex] = value;
    setFormData(prev => ({ ...prev, delaysTable: newTable }));
    
    // Update validation
    const newValid = [...delaysTableValid];
    if (value === '' || value.trim() === '') {
      newValid[rowIndex].durationMinutes[inputIndex] = null;
    } else {
      newValid[rowIndex].durationMinutes[inputIndex] = !isNaN(value) && parseFloat(value) >= 0;
    }
    setDelaysTableValid(newValid);
  };

  const handleTimeInputChange = (rowIndex, inputIndex, field, value) => {
    const newTable = [...formData.delaysTable];
    newTable[rowIndex][field][inputIndex] = value;
    setFormData(prev => ({ ...prev, delaysTable: newTable }));
    
    // Update validation
    const newValid = [...delaysTableValid];
    if (!value || value === '') {
      newValid[rowIndex][field][inputIndex] = null;
    } else {
      newValid[rowIndex][field][inputIndex] = value.length > 0;
    }
    setDelaysTableValid(newValid);
  };

  // Mould Hardness Table
  const addMouldHardnessRow = () => {
    setFormData(prev => ({
      ...prev,
      mouldHardnessTable: [...prev.mouldHardnessTable, { componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }]
    }));
    setMouldHardnessTableValid(prev => [...prev, { componentName: null, mpPP: null, mpSP: null, bsPP: null, bsSP: null, remarks: null }]);
  };

  const deleteMouldHardnessRow = (index) => {
    setFormData(prev => ({
      ...prev,
      mouldHardnessTable: prev.mouldHardnessTable.filter((_, i) => i !== index)
    }));
    setMouldHardnessTableValid(prev => prev.filter((_, i) => i !== index));
  };

  const handleMouldHardnessChange = (index, field, value) => {
    const newTable = [...formData.mouldHardnessTable];
    newTable[index][field] = value;
    setFormData(prev => ({ ...prev, mouldHardnessTable: newTable }));
    
    // Update validation
    const newValid = [...mouldHardnessTableValid];
    if (field === 'mpPP' || field === 'mpSP' || field === 'bsPP' || field === 'bsSP') {
      // Numeric fields
      if (value === '' || value.trim() === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = !isNaN(value) && parseFloat(value) >= 0;
      }
    } else {
      // Text fields (componentName, remarks)
      if (value.trim() === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = value.trim().length > 0;
      }
    }
    setMouldHardnessTableValid(newValid);
  };

  // Pattern Temp Table
  const addPatternTempRow = () => {
    setFormData(prev => ({
      ...prev,
      patternTempTable: [...prev.patternTempTable, { item: "", pp: "", sp: "" }]
    }));
    setPatternTempTableValid(prev => [...prev, { item: null, pp: null, sp: null }]);
  };

  const deletePatternTempRow = (index) => {
    setFormData(prev => ({
      ...prev,
      patternTempTable: prev.patternTempTable.filter((_, i) => i !== index)
    }));
    setPatternTempTableValid(prev => prev.filter((_, i) => i !== index));
  };

  const handlePatternTempChange = (index, field, value) => {
    const newTable = [...formData.patternTempTable];
    newTable[index][field] = value;
    setFormData(prev => ({ ...prev, patternTempTable: newTable }));
    
    // Update validation
    const newValid = [...patternTempTableValid];
    if (field === 'pp' || field === 'sp') {
      // Numeric fields
      if (value === '' || value.trim() === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = !isNaN(value) && parseFloat(value) >= 0;
      }
    } else {
      // Text field (item)
      if (value.trim() === '') {
        newValid[index][field] = null;
      } else {
        newValid[index][field] = value.trim().length > 0;
      }
    }
    setPatternTempTableValid(newValid);
  };

  // Reset Form
  const resetForm = () => {
    setFormData(initialFormData);
  };

  // Submit Handler (placeholder)
  const handleSubmit = () => {
    console.log("Form Data:", formData);
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="disamatic-header">
        <div className="disamatic-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Disamatic Product - Entry Form
          </h2>
        </div>
        <div aria-label="Date" style={{ fontWeight: 600, color: '#25424c' }}>
          DATE : {formData.date ? (() => {
            const [y, m, d] = formData.date.split('-');
            return `${d} / ${m} / ${y}`;
          })() : '-'}
        </div>
      </div>

      {/* Primary Section */}
      <div className="primary-header-container">
        <h3 className="primary-section-title">PRIMARY</h3>
      </div>
      
      {/* First Row: Date, Shift, Incharge, PP Operator */}
      <div className="primary-fields-row">
        <div className="disamatic-form-group">
          <label>Date <span style={{ color: '#ef4444' }}>*</span></label>
          <CustomDatePicker
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={getValidationClass(dateValid)}
          />
        </div>
        <div className="disamatic-form-group">
          <label>Shift <span style={{ color: '#ef4444' }}>*</span></label>
          <select
            value={formData.shift}
            onChange={e => handleChange("shift", e.target.value)}
            className={getValidationClass(shiftValid)}
          >
            <option value="">Select Shift</option>
            <option value="Shift 1">Shift 1</option>
            <option value="Shift 2">Shift 2</option>
            <option value="Shift 3">Shift 3</option>
          </select>
        </div>
        <div className="disamatic-form-group">
          <label>Incharge <span style={{ color: '#ef4444' }}>*</span></label>
          <input 
            type="text" 
            value={formData.incharge} 
            onChange={e => handleChange("incharge", e.target.value)}
            placeholder="Enter incharge name"
            className={getValidationClass(inchargeValid)}
          />
        </div>
        <div className="disamatic-form-group">
          <label>PP Operator <span style={{ color: '#ef4444' }}>*</span></label>
          <input 
            type="text" 
            value={formData.ppOperator} 
            onChange={e => handleChange("ppOperator", e.target.value)}
            placeholder="Enter PP Operator name"
            className={getValidationClass(ppOperatorValid)}
          />
        </div>
      </div>
      
      {/* Second Row: Members Present */}
      <div className="primary-fields-row">
        <div className="disamatic-form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Members Present <span style={{ color: '#ef4444' }}>*</span></label>
          <div className="disamatic-members-container">
            {formData.members.map((member, index) => (
              <div key={index} className="disamatic-member-input-wrapper">
                <input
                  type="text"
                  value={member}
                  onChange={e => handleMemberChange(index, e.target.value)}
                  placeholder={`Enter member name ${index + 1}`}
                  className={`disamatic-member-input ${getValidationClass(membersValid[index])}`}
                />
                {formData.members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMemberField(index)}
                    className="disamatic-remove-member-btn"
                    title="Remove member"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMemberField}
              className="disamatic-add-member-btn"
              title="Add another member"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>
        </div>
      </div>
      
      {/* Primary Submit Container */}
      <div className="disamatic-submit-container">
        <button className="disamatic-submit-btn" type="button" onClick={handleSubmit}>
          <Save size={18} />
          Save Primary
        </button>
      </div>

      {/* Production Table */}
      <div className="disamatic-section">
        <div className="disamatic-section-header">
          <h3 className="disamatic-section-title">Production Table</h3>
          <div className="disamatic-section-actions">
            <button type="button" onClick={addProductionRow} className="disamatic-add-row-btn">
              <Plus size={18} />
            </button>
            {formData.productionTable.length > 1 && (
              <button
                type="button"
                onClick={() => deleteProductionRow(formData.productionTable.length - 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>S.No</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Mould Counter No.</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Component Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Produced </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Poured </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Cycle Time</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Moulds/Hour</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {formData.productionTable.map((row, index) => (
                <tr key={index}>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.counterNo}
                      onChange={e => handleProductionChange(index, 'counterNo', e.target.value)}
                      placeholder="Counter No"
                      className={getValidationClass(productionTableValid[index]?.counterNo)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleProductionChange(index, 'componentName', e.target.value)}
                      placeholder="Component Name"
                      className={getValidationClass(productionTableValid[index]?.componentName)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.produced}
                      onChange={e => handleProductionChange(index, 'produced', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(productionTableValid[index]?.produced)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.poured}
                      onChange={e => handleProductionChange(index, 'poured', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(productionTableValid[index]?.poured)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <CustomTimeInput
                      value={createTimeFromString(row.cycleTime)}
                      onChange={(timeObj) => handleProductionChange(index, 'cycleTime', formatTimeToString(timeObj))}
                      className={getValidationClass(productionTableValid[index]?.cycleTime)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.mouldsPerHour}
                      onChange={e => handleProductionChange(index, 'mouldsPerHour', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(productionTableValid[index]?.mouldsPerHour)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleProductionChange(index, 'remarks', e.target.value)}
                      placeholder="Remarks"
                      className={getValidationClass(productionTableValid[index]?.remarks)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Shift Plan Table */}
      <div className="disamatic-section">
        <div className="disamatic-section-header">
          <h3 className="disamatic-section-title">Next Shift Plan</h3>
          <div className="disamatic-section-actions">
            <button type="button" onClick={addNextShiftPlanRow} className="disamatic-add-row-btn">
              <Plus size={18} />
            </button>
            {formData.nextShiftPlanTable.length > 1 && (
              <button
                type="button"
                onClick={() => deleteNextShiftPlanRow(formData.nextShiftPlanTable.length - 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>S.No</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Component Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Planned Moulds</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {formData.nextShiftPlanTable.map((row, index) => (
                <tr key={index}>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleNextShiftPlanChange(index, 'componentName', e.target.value)}
                      placeholder="Component Name"
                      className={getValidationClass(nextShiftPlanTableValid[index]?.componentName)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.plannedMoulds}
                      onChange={e => handleNextShiftPlanChange(index, 'plannedMoulds', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(nextShiftPlanTableValid[index]?.plannedMoulds)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleNextShiftPlanChange(index, 'remarks', e.target.value)}
                      placeholder="Remarks"
                      className={getValidationClass(nextShiftPlanTableValid[index]?.remarks)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delays Table */}
      <div className="disamatic-section">
        <div className="disamatic-section-header">
          <h3 className="disamatic-section-title">Delays</h3>
          <div className="disamatic-section-actions">
            <button type="button" onClick={addDelaysRow} className="disamatic-add-row-btn">
              <Plus size={18} />
            </button>
            {formData.delaysTable.length > 1 && (
              <button
                type="button"
                onClick={() => deleteDelaysRow(formData.delaysTable.length - 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>S.No</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Delays</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Duration (Minutes)</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Duration (From - To)</th>
              </tr>
            </thead>
            <tbody>
              {formData.delaysTable.map((row, index) => (
                <tr key={index}>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.delays}
                      onChange={e => handleDelaysChange(index, 'delays', e.target.value)}
                      placeholder="Delay reason"
                      className={getValidationClass(delaysTableValid[index]?.delays)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.25rem' }}>
                        <PlusButton
                          onClick={() => addDurationInput(index)}
                          title="Add entry"
                          disabled={row.durationMinutes.length >= 10}
                        />
                        {row.durationMinutes.length > 1 && (
                          <MinusButton
                            onClick={() => removeDurationInput(index, row.durationMinutes.length - 1)}
                            title="Remove entry"
                          />
                        )}
                      </div>
                      <div style={{ 
                        flex: 1,
                        display: 'grid', 
                        gridTemplateColumns: row.durationMinutes.length === 1 ? '1fr' : 'repeat(2, 1fr)', 
                        gap: '0.5rem' 
                      }}>
                        {row.durationMinutes.map((value, inputIndex) => (
                          <input
                            key={inputIndex}
                            type="number"
                            value={value}
                            onChange={e => handleDurationInputChange(index, inputIndex, e.target.value)}
                            placeholder="0"
                            className={getValidationClass(delaysTableValid[index]?.durationMinutes[inputIndex])}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: row.fromTime.length === 1 ? '1fr' : 'repeat(2, 1fr)', 
                      gap: '0.5rem',
                      alignItems: 'start'
                    }}>
                      {row.fromTime.map((fromValue, inputIndex) => (
                        <div key={inputIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CustomTimeInput
                            value={createTimeFromString(fromValue)}
                            onChange={(timeObj) => handleTimeInputChange(index, inputIndex, 'fromTime', formatTimeToString(timeObj))}
                            className={getValidationClass(delaysTableValid[index]?.fromTime[inputIndex])}
                            style={{ flex: 1 }}
                          />
                          <span style={{ color: '#64748b', fontWeight: 600 }}>-</span>
                          <CustomTimeInput
                            value={createTimeFromString(row.toTime[inputIndex])}
                            onChange={(timeObj) => handleTimeInputChange(index, inputIndex, 'toTime', formatTimeToString(timeObj))}
                            className={getValidationClass(delaysTableValid[index]?.toTime[inputIndex])}
                            style={{ flex: 1 }}
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mould Hardness Table */}
      <div className="disamatic-section">
        <div className="disamatic-section-header">
          <h3 className="disamatic-section-title">Mould Hardness</h3>
          <div className="disamatic-section-actions">
            <button type="button" onClick={addMouldHardnessRow} className="disamatic-add-row-btn">
              <Plus size={18} />
            </button>
            {formData.mouldHardnessTable.length > 1 && (
              <button
                type="button"
                onClick={() => deleteMouldHardnessRow(formData.mouldHardnessTable.length - 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th rowSpan={2} style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600, verticalAlign: 'middle' }}>S.No</th>
                <th rowSpan={2} style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600, verticalAlign: 'middle' }}>Component Name</th>
                <th colSpan={2} style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>Mould Penetrant tester (N/cm²)</th>
                <th colSpan={2} style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>B - Scale</th>
                <th rowSpan={2} style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600, verticalAlign: 'middle' }}>Remarks</th>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>PP</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>SP</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>PP</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>SP</th>
              </tr>
            </thead>
            <tbody>
              {formData.mouldHardnessTable.map((row, index) => (
                <tr key={index}>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleMouldHardnessChange(index, 'componentName', e.target.value)}
                      placeholder="Component Name"
                      className={getValidationClass(mouldHardnessTableValid[index]?.componentName)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.mpPP}
                      onChange={e => handleMouldHardnessChange(index, 'mpPP', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(mouldHardnessTableValid[index]?.mpPP)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.mpSP}
                      onChange={e => handleMouldHardnessChange(index, 'mpSP', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(mouldHardnessTableValid[index]?.mpSP)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.bsPP}
                      onChange={e => handleMouldHardnessChange(index, 'bsPP', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(mouldHardnessTableValid[index]?.bsPP)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.bsSP}
                      onChange={e => handleMouldHardnessChange(index, 'bsSP', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(mouldHardnessTableValid[index]?.bsSP)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleMouldHardnessChange(index, 'remarks', e.target.value)}
                      placeholder="Remarks"
                      className={getValidationClass(mouldHardnessTableValid[index]?.remarks)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pattern Temp Table */}
      <div className="disamatic-section">
        <div className="disamatic-section-header">
          <h3 className="disamatic-section-title">Pattern Temperature</h3>
          <div className="disamatic-section-actions">
            <button type="button" onClick={addPatternTempRow} className="disamatic-add-row-btn">
              <Plus size={18} />
            </button>
            {formData.patternTempTable.length > 1 && (
              <button
                type="button"
                onClick={() => deletePatternTempRow(formData.patternTempTable.length - 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>S.No</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>Item</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>PP</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0', fontWeight: 600 }}>SP</th>
              </tr>
            </thead>
            <tbody>
              {formData.patternTempTable.map((row, index) => (
                <tr key={index}>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.item}
                      onChange={e => handlePatternTempChange(index, 'item', e.target.value)}
                      placeholder="Item"
                      className={getValidationClass(patternTempTableValid[index]?.item)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.pp}
                      onChange={e => handlePatternTempChange(index, 'pp', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(patternTempTableValid[index]?.pp)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.sp}
                      onChange={e => handlePatternTempChange(index, 'sp', e.target.value)}
                      placeholder="0"
                      className={getValidationClass(patternTempTableValid[index]?.sp)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Section */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Significant Events & Maintenance</h3>
        
        <div className="disamatic-form-grid" style={{ marginTop: '1rem' }}>
          <div className="disamatic-form-group full-width">
            <label>Significant Event :</label>
            <textarea
              value={formData.significantEvent}
              onChange={e => handleChange("significantEvent", e.target.value)}
              placeholder="Enter any significant events"
              className={`disamatic-textarea ${getValidationClass(significantEventValid)}`}
              rows={3}
            />
          </div>
          
          <div className="disamatic-form-group full-width">
            <label>Maintenance :</label>
            <textarea
              value={formData.maintenance}
              onChange={e => handleChange("maintenance", e.target.value)}
              placeholder="Enter maintenance details"
              className={`disamatic-textarea ${getValidationClass(maintenanceValid)}`}
              rows={3}
            />
          </div>
          
          <div className="disamatic-form-group">
            <label>Supervisor Name :</label>
            <input
              type="text"
              value={formData.supervisorName}
              onChange={e => handleChange("supervisorName", e.target.value)}
              placeholder="Enter supervisor name"
              className={getValidationClass(supervisorNameValid)}
            />
          </div>
        </div>
      </div>

      {/* Submit All Button */}
      <div className="disamatic-submit-container">
        <button className="disamatic-reset-btn" type="button" onClick={resetForm}>
          <RefreshCw size={18} />
          Reset Form
        </button>
        <button className="disamatic-submit-btn" type="button" onClick={handleSubmit}>
          <Save size={18} />
          Submit All
        </button>
      </div>
    </div>
  );
};

export default DisamaticProduct;
