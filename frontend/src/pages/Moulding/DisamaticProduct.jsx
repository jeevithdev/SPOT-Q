import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import Select from "react-select";
import { SubmitButton, ViewReportButton, ResetFormButton } from "../../Components/Buttons";
import "../../styles/PageStyles/Moulding/DisamaticProduct.css";

const memberOptions = [
  { value: "Member A", label: "Member A" },
  { value: "Member B", label: "Member B" },
  { value: "Member C", label: "Member C" },
];

const initialFormData = {
  date: "",
  shift: "",
  incharge: "",
  members: [],
  ppOperator: "",
  productionTable: [{ counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }],
  nextShiftPlan: [{ componentName: "", plannedMoulds: "", remarks: "" }],
  delaysTable: [{ delays: "", durationMinutes: "", durationTime: "" }],
  mouldHardness: [{ componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }],
  patternTemp: [{ item: "", pp: "", sp: "" }],
  significantEvent: "",
  maintanance: ""
};

const DisamaticProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleArrayChange = (arrayName, i, field, value) => {
    const arr = [...formData[arrayName]];
    arr[i] = { ...arr[i], [field]: value };
    setFormData(prev => ({ ...prev, [arrayName]: arr }));
  };
  
  const addRow = (arrayName, emptyRow) => setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], { ...emptyRow }] }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert('Form submitted successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All unsaved data will be lost.')) {
      setFormData(initialFormData);
    }
  };

  const handleViewReport = () => {
    navigate('/moulding/disamatic-product-report/report');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const inputs = Array.from(form.querySelectorAll('input:not([readonly]), textarea, select'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <>
      {/* Header */}
      <div className="disamatic-header">
        <div className="disamatic-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Disamatic Production Report DISA
          </h2>
        </div>
        <div className="disamatic-header-buttons">
          <ViewReportButton onClick={handleViewReport} />
          <ResetFormButton onClick={handleReset} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Basic Info</h3>
            <div className="disamatic-form-grid">
              <div className="disamatic-form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={e => handleChange("date", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="disamatic-form-group">
                <label>Shift</label>
                <input 
                  type="text" 
                  value={formData.shift} 
                  onChange={e => handleChange("shift", e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., A, B, C"
                />
              </div>
              <div className="disamatic-form-group">
                <label>Incharge</label>
                <input 
                  type="text" 
                  value={formData.incharge} 
                  onChange={e => handleChange("incharge", e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter incharge name"
                />
              </div>
              <div className="disamatic-form-group">
                <label>Members Present</label>
                <Select 
                  isMulti 
                  options={memberOptions} 
                  value={formData.members} 
                  onChange={val => handleChange("members", val)} 
                  className="disamatic-multiselect" 
                  placeholder="Select Members..." 
                />
              </div>
            </div>
          </div>

          {/* Production Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Production</h3>
            <div className="disamatic-form-grid">
              <div className="disamatic-form-group">
                <label>P/P Operator</label>
                <input 
                  type="text" 
                  value={formData.ppOperator} 
                  onChange={e => handleChange("ppOperator", e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter operator name"
                />
              </div>
            </div>
            {formData.productionTable.map((row, i) => (
              <div className="disamatic-form-grid" key={i}>
                <div className="disamatic-form-group">
                  <label>Mould Counter No</label>
                  <input value={row.counterNo} onChange={e => handleArrayChange("productionTable", i, "counterNo", e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter counter no" />
                </div>
                <div className="disamatic-form-group">
                  <label>Component Name</label>
                  <input value={row.componentName} onChange={e => handleArrayChange("productionTable", i, "componentName", e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter component" />
                </div>
                <div className="disamatic-form-group">
                  <label>Produced</label>
                  <input type="number" value={row.produced} onChange={e => handleArrayChange("productionTable", i, "produced", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" />
                </div>
                <div className="disamatic-form-group">
                  <label>Poured</label>
                  <input type="number" value={row.poured} onChange={e => handleArrayChange("productionTable", i, "poured", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" />
                </div>
                <div className="disamatic-form-group">
                  <label>Cycle Time</label>
                  <input value={row.cycleTime} onChange={e => handleArrayChange("productionTable", i, "cycleTime", e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., 30s" />
                </div>
                <div className="disamatic-form-group">
                  <label>Moulds Per Hour</label>
                  <input type="number" value={row.mouldsPerHour} onChange={e => handleArrayChange("productionTable", i, "mouldsPerHour", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" />
                </div>
                <div className="disamatic-form-group">
                  <label>Remarks</label>
                  <input value={row.remarks} onChange={e => handleArrayChange("productionTable", i, "remarks", e.target.value)} onKeyDown={handleKeyDown} placeholder="Optional remarks" />
                </div>
              </div>
            ))}
          </div>

          {/* Next Shift Plan Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Next Shift Plan</h3>
            {formData.nextShiftPlan.map((row, i) => (
              <div className="disamatic-form-grid" key={i}>
                <div className="disamatic-form-group">
                  <label>Component Name</label>
                  <input value={row.componentName} onChange={e => handleArrayChange("nextShiftPlan", i, "componentName", e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter component" />
                </div>
                <div className="disamatic-form-group">
                  <label>Planned Moulds</label>
                  <input type="number" value={row.plannedMoulds} onChange={e => handleArrayChange("nextShiftPlan", i, "plannedMoulds", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" />
                </div>
                <div className="disamatic-form-group">
                  <label>Remarks</label>
                  <input value={row.remarks} onChange={e => handleArrayChange("nextShiftPlan", i, "remarks", e.target.value)} onKeyDown={handleKeyDown} placeholder="Optional remarks" />
                </div>
              </div>
            ))}
          </div>

          {/* Delays Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Delays</h3>
            {formData.delaysTable.map((row, i) => (
              <div className="disamatic-form-grid" key={i}>
                <div className="disamatic-form-group">
                  <label>Delays</label>
                  <input value={row.delays} onChange={e => handleArrayChange("delaysTable", i, "delays", e.target.value)} onKeyDown={handleKeyDown} placeholder="Describe delay" />
                </div>
                <div className="disamatic-form-group">
                  <label>Duration (Minutes)</label>
                  <input type="number" value={row.durationMinutes} onChange={e => handleArrayChange("delaysTable", i, "durationMinutes", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" />
                </div>
                <div className="disamatic-form-group">
                  <label>Duration (Time)</label>
                  <input value={row.durationTime} onChange={e => handleArrayChange("delaysTable", i, "durationTime", e.target.value)} onKeyDown={handleKeyDown} placeholder="HH:MM" />
                </div>
              </div>
            ))}
          </div>

          {/* Mould Hardness - Production Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Mould Hardness - Production</h3>
            {formData.mouldHardness.map((row, i) => (
              <div className="disamatic-form-grid" key={i}>
                <div className="disamatic-form-group">
                  <label>Component Name</label>
                  <input value={row.componentName} onChange={e => handleArrayChange("mouldHardness", i, "componentName", e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter component" />
                </div>
                <div className="disamatic-form-group">
                  <label>Mould Penetrant Tester (PP)</label>
                  <input type="number" value={row.mpPP} onChange={e => handleArrayChange("mouldHardness", i, "mpPP", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" step="any" />
                </div>
                <div className="disamatic-form-group">
                  <label>Mould Penetrant Tester (SP)</label>
                  <input type="number" value={row.mpSP} onChange={e => handleArrayChange("mouldHardness", i, "mpSP", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" step="any" />
                </div>
                <div className="disamatic-form-group">
                  <label>B-Scale (PP)</label>
                  <input type="number" value={row.bsPP} onChange={e => handleArrayChange("mouldHardness", i, "bsPP", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" step="any" />
                </div>
                <div className="disamatic-form-group">
                  <label>B-Scale (SP)</label>
                  <input type="number" value={row.bsSP} onChange={e => handleArrayChange("mouldHardness", i, "bsSP", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" step="any" />
                </div>
                <div className="disamatic-form-group">
                  <label>Remarks</label>
                  <input value={row.remarks} onChange={e => handleArrayChange("mouldHardness", i, "remarks", e.target.value)} onKeyDown={handleKeyDown} placeholder="Optional remarks" />
                </div>
              </div>
            ))}
          </div>

          {/* Pattern Temperature Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Mould Hardness - Pattern Temp</h3>
            {formData.patternTemp.map((row, i) => (
              <div className="disamatic-form-grid" key={i}>
                <div className="disamatic-form-group">
                  <label>Item</label>
                  <input value={row.item} onChange={e => handleArrayChange("patternTemp", i, "item", e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter item" />
                </div>
                <div className="disamatic-form-group">
                  <label>PP</label>
                  <input type="number" value={row.pp} onChange={e => handleArrayChange("patternTemp", i, "pp", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" step="any" />
                </div>
                <div className="disamatic-form-group">
                  <label>SP</label>
                  <input type="number" value={row.sp} onChange={e => handleArrayChange("patternTemp", i, "sp", e.target.value)} onKeyDown={handleKeyDown} placeholder="0" step="any" />
                </div>
              </div>
            ))}
          </div>

          {/* Significant Event Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Significant Event</h3>
            <div className="disamatic-form-group">
              <label>Significant Event</label>
              <textarea 
                className="disamatic-textarea" 
                value={formData.significantEvent} 
                onChange={e => handleChange("significantEvent", e.target.value)} 
                placeholder="Describe significant event..." 
                rows={4}
              />
            </div>
          </div>

          {/* Maintenance Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Maintenance</h3>
            <div className="disamatic-form-group">
              <label>Maintenance</label>
              <textarea 
                className="disamatic-textarea" 
                value={formData.maintanance} 
                onChange={e => handleChange("maintanance", e.target.value)} 
                placeholder="Describe maintenance activities..." 
                rows={4}
              />
            </div>
          </div>

        {/* Submit Button */}
        <div className="disamatic-submit-container">
          <SubmitButton onClick={handleSubmit}>
            Submit Entry
          </SubmitButton>
        </div>
      </form>
    </>
  );
};

export default DisamaticProduct;
