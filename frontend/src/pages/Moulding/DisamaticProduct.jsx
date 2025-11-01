import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, FileText, Plus, X } from "lucide-react";
import CustomDatePicker from "../../Components/CustomDatePicker";
import "../../styles/PageStyles/Moulding/DisamaticProduct.css";

const initialFormData = {
  date: "",
  shift: "",
  incharge: "",
  members: [""],
  productionTable: [{ counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }],
  nextShiftPlanTable: [{ componentName: "", plannedMoulds: "", remarks: "" }],
  delaysTable: [{ delays: "", durationMinutes: "", durationTime: "" }],
  mouldHardnessTable: [{ componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }],
  patternTempTable: [{ item: "", pp: "", sp: "" }],
  significantEvent: "",
  maintenance: "",
  supervisorName: "",
};

const DisamaticProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleMemberChange = (index, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = value;
    setFormData(prev => ({ ...prev, members: updatedMembers }));
  };

  const addMemberField = () => {
    setFormData(prev => ({ ...prev, members: [...prev.members, ""] }));
  };

  const removeMemberField = (index) => {
    if (formData.members.length > 1) {
      const updatedMembers = formData.members.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, members: updatedMembers }));
    }
  };

  const handleProductionTableChange = (index, field, value) => {
    const updatedTable = [...formData.productionTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, productionTable: updatedTable }));
  };

  const addProductionRow = () => {
    setFormData(prev => ({
      ...prev,
      productionTable: [...prev.productionTable, { counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }]
    }));
  };

  const removeProductionRow = (index) => {
    if (formData.productionTable.length > 1) {
      const updatedTable = formData.productionTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, productionTable: updatedTable }));
    }
  };

  const handleNextShiftPlanChange = (index, field, value) => {
    const updatedTable = [...formData.nextShiftPlanTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, nextShiftPlanTable: updatedTable }));
  };

  const addNextShiftPlanRow = () => {
    setFormData(prev => ({
      ...prev,
      nextShiftPlanTable: [...prev.nextShiftPlanTable, { componentName: "", plannedMoulds: "", remarks: "" }]
    }));
  };

  const removeNextShiftPlanRow = (index) => {
    if (formData.nextShiftPlanTable.length > 1) {
      const updatedTable = formData.nextShiftPlanTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, nextShiftPlanTable: updatedTable }));
    }
  };

  const handleDelaysTableChange = (index, field, value) => {
    const updatedTable = [...formData.delaysTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, delaysTable: updatedTable }));
  };

  const addDelaysRow = () => {
    setFormData(prev => ({
      ...prev,
      delaysTable: [...prev.delaysTable, { delays: "", durationMinutes: "", durationTime: "" }]
    }));
  };

  const removeDelaysRow = (index) => {
    if (formData.delaysTable.length > 1) {
      const updatedTable = formData.delaysTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, delaysTable: updatedTable }));
    }
  };

  const handleMouldHardnessTableChange = (index, field, value) => {
    const updatedTable = [...formData.mouldHardnessTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, mouldHardnessTable: updatedTable }));
  };

  const addMouldHardnessRow = () => {
    setFormData(prev => ({
      ...prev,
      mouldHardnessTable: [...prev.mouldHardnessTable, { componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }]
    }));
  };

  const removeMouldHardnessRow = (index) => {
    if (formData.mouldHardnessTable.length > 1) {
      const updatedTable = formData.mouldHardnessTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, mouldHardnessTable: updatedTable }));
    }
  };

  const handlePatternTempTableChange = (index, field, value) => {
    const updatedTable = [...formData.patternTempTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, patternTempTable: updatedTable }));
  };

  const addPatternTempRow = () => {
    setFormData(prev => ({
      ...prev,
      patternTempTable: [...prev.patternTempTable, { item: "", pp: "", sp: "" }]
    }));
  };

  const removePatternTempRow = (index) => {
    if (formData.patternTempTable.length > 1) {
      const updatedTable = formData.patternTempTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, patternTempTable: updatedTable }));
    }
  };

  const handleViewReport = () => {
    navigate('/moulding/disamatic-product-report/report');
  };

  return (
    <>
      {/* Header */}
      <div className="disamatic-header">
        <div className="disamatic-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Disamatic Production Report DISA - Entry Form
          </h2>
        </div>
        <div className="disamatic-header-buttons">
          <button className="disamatic-view-report-btn" onClick={handleViewReport} type="button">
            <div className="disamatic-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="disamatic-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

          {/* Basic Info Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Basic Info</h3>
            <div className="disamatic-form-grid">
          <div className="disamatic-form-group">
            <label>Date</label>
            <CustomDatePicker
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              name="date"
            />
          </div>
              <div className="disamatic-form-group">
                <label>Shift</label>
                <input 
                  type="text" 
                  value={formData.shift} 
                  onChange={e => handleChange("shift", e.target.value)}
                  placeholder="e.g., A, B, C"
                />
              </div>
              <div className="disamatic-form-group">
                <label>Incharge</label>
                <input 
                  type="text" 
                  value={formData.incharge} 
                  onChange={e => handleChange("incharge", e.target.value)}
                  placeholder="Enter incharge name"
                />
              </div>
          <div className="disamatic-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Members Present</label>
            <div className="disamatic-members-container">
              {formData.members.map((member, index) => (
                <div key={index} className="disamatic-member-input-wrapper">
                  <input
                    type="text"
                    value={member}
                    onChange={e => handleMemberChange(index, e.target.value)}
                    placeholder={`Enter member name ${index + 1}`}
                    className="disamatic-member-input"
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
          </div>

      {/* Production Table */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Production</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Mould Counter No.</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Component Name</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Produced</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Poured</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Cycle Time</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Moulds Per Hour</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Remarks</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.productionTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.counterNo}
                      onChange={e => handleProductionTableChange(index, 'counterNo', e.target.value)}
                      placeholder="Counter No"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleProductionTableChange(index, 'componentName', e.target.value)}
                      placeholder="Component Name"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.produced}
                      onChange={e => handleProductionTableChange(index, 'produced', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.poured}
                      onChange={e => handleProductionTableChange(index, 'poured', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.cycleTime}
                      onChange={e => handleProductionTableChange(index, 'cycleTime', e.target.value)}
                      placeholder="e.g., 30s"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.mouldsPerHour}
                      onChange={e => handleProductionTableChange(index, 'mouldsPerHour', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <input 
                  type="text" 
                      value={row.remarks}
                      onChange={e => handleProductionTableChange(index, 'remarks', e.target.value)}
                      placeholder="Remarks"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    {formData.productionTable.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProductionRow(index)}
                        className="disamatic-remove-row-btn"
                        title="Remove row"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addProductionRow}
              className="disamatic-add-row-btn"
            >
              <Plus size={16} />
              Add Row
            </button>
          </div>
                </div>
          </div>

      {/* Next Shift Plan Table */}
          <div className="disamatic-section">
        <h3 className="disamatic-section-title">Next Shift Plan</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>S.No</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Component Name</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Planned Moulds</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Remarks</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.nextShiftPlanTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 500, background: '#f8fafc' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleNextShiftPlanChange(index, 'componentName', e.target.value)}
                      placeholder="Component Name"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.plannedMoulds}
                      onChange={e => handleNextShiftPlanChange(index, 'plannedMoulds', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleNextShiftPlanChange(index, 'remarks', e.target.value)}
                      placeholder="Remarks"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    {formData.nextShiftPlanTable.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNextShiftPlanRow(index)}
                        className="disamatic-remove-row-btn"
                        title="Remove row"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addNextShiftPlanRow}
              className="disamatic-add-row-btn"
            >
              <Plus size={16} />
              Add Row
            </button>
          </div>
                </div>
          </div>

      {/* Delays Table */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Delays</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>S.No</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Delays</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Duration In Minutes</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Duration In Time</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.delaysTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 500, background: '#f8fafc' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.delays}
                      onChange={e => handleDelaysTableChange(index, 'delays', e.target.value)}
                      placeholder="Describe delay"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.durationMinutes}
                      onChange={e => handleDelaysTableChange(index, 'durationMinutes', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.durationTime}
                      onChange={e => handleDelaysTableChange(index, 'durationTime', e.target.value)}
                      placeholder="HH:MM"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    {formData.delaysTable.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDelaysRow(index)}
                        className="disamatic-remove-row-btn"
                        title="Remove row"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addDelaysRow}
              className="disamatic-add-row-btn"
            >
              <Plus size={16} />
              Add Row
            </button>
          </div>
        </div>
      </div>

      {/* Production (Mould Hardness) Table */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Production : ( Mould Hardness )</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }} rowSpan="2">S.No</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap' }} rowSpan="2">Component Name</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap' }} colSpan="2">Mould Penetrant tester ( N/cmsquare )</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap' }} colSpan="2">B - Scale</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap' }} rowSpan="2">Remarks</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }} rowSpan="2">Action</th>
              </tr>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>PP</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>SP</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>PP</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>SP</th>
              </tr>
            </thead>
            <tbody>
              {formData.mouldHardnessTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 500, background: '#f8fafc' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleMouldHardnessTableChange(index, 'componentName', e.target.value)}
                      placeholder="Component Name"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.mpPP}
                      onChange={e => handleMouldHardnessTableChange(index, 'mpPP', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.mpSP}
                      onChange={e => handleMouldHardnessTableChange(index, 'mpSP', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.bsPP}
                      onChange={e => handleMouldHardnessTableChange(index, 'bsPP', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.bsSP}
                      onChange={e => handleMouldHardnessTableChange(index, 'bsSP', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleMouldHardnessTableChange(index, 'remarks', e.target.value)}
                      placeholder="Remarks"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    {formData.mouldHardnessTable.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMouldHardnessRow(index)}
                        className="disamatic-remove-row-btn"
                        title="Remove row"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addMouldHardnessRow}
              className="disamatic-add-row-btn"
            >
              <Plus size={16} />
              Add Row
            </button>
          </div>
        </div>
      </div>

      {/* Pattern Temp Table */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Pattern Temp in C degree</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>S.No</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>ITEMS</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>PP</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>SP</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.patternTempTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 500, background: '#f8fafc' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.item}
                      onChange={e => handlePatternTempTableChange(index, 'item', e.target.value)}
                      placeholder="Enter item"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.pp}
                      onChange={e => handlePatternTempTableChange(index, 'pp', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.sp}
                      onChange={e => handlePatternTempTableChange(index, 'sp', e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{ width: '100%', padding: '0.5rem', border: '1.5px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    {formData.patternTempTable.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePatternTempRow(index)}
                        className="disamatic-remove-row-btn"
                        title="Remove row"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addPatternTempRow}
              className="disamatic-add-row-btn"
            >
              <Plus size={16} />
              Add Row
            </button>
          </div>
        </div>
      </div>

      {/* Significance Event */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Significance Event</h3>
        <div className="disamatic-form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Significance Event</label>
          <textarea
            value={formData.significantEvent}
            onChange={e => handleChange("significantEvent", e.target.value)}
            placeholder="Describe significant event..."
            rows={4}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '2px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', color: '#1e293b', backgroundColor: '#ffffff', transition: 'all 0.3s ease', resize: 'vertical' }}
          />
        </div>
      </div>

      {/* Maintenance */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Maintenance</h3>
        <div className="disamatic-form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Maintenance</label>
          <textarea
            value={formData.maintenance}
            onChange={e => handleChange("maintenance", e.target.value)}
            placeholder="Describe maintenance activities..."
            rows={4}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '2px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', color: '#1e293b', backgroundColor: '#ffffff', transition: 'all 0.3s ease', resize: 'vertical' }}
          />
        </div>
      </div>

      {/* Supervisor Name */}
      <div className="disamatic-section">
        <div className="disamatic-form-grid">
          <div className="disamatic-form-group" style={{ maxWidth: '400px' }}>
            <label>Supervisor Name</label>
            <input
              type="text"
              value={formData.supervisorName}
              onChange={e => handleChange("supervisorName", e.target.value)}
              placeholder="Enter supervisor name"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DisamaticProduct;
