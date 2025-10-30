import React, { useState } from "react";
import Select from "react-select";
import { Save, Plus } from "lucide-react";
import { Button } from "../../Components/Buttons";
import "../../styles/PageStyles/Moulding/DisamaticProductReport.css";

const memberOptions = [
  { value: "Member A", label: "Member A" },
  { value: "Member B", label: "Member B" },
  { value: "Member C", label: "Member C" },
];

const DisamaticProductReport = () => {
  const [formData, setFormData] = useState({
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
  });
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleArrayChange = (arrayName, i, field, value) => {
    const arr = [...formData[arrayName]];
    arr[i] = { ...arr[i], [field]: value };
    setFormData(prev => ({ ...prev, [arrayName]: arr }));
  };
  const addRow = (arrayName, emptyRow) => setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], { ...emptyRow }] }));
  return (
    <div className="disamatic-page-container">
      <div className="disamatic-content">
        <div className="disamatic-title section-header" style={{marginBottom:'2.2rem'}}>
          <h2>Disametric Production Report DISA</h2>
        </div>

        <div className="section-header"><h3>Basic Info</h3></div>
        <div className="disamatic-form-grid">
          <div className="disamatic-form-group"><label>Date</label><input type="date" value={formData.date} onChange={e => handleChange("date", e.target.value)} /></div>
          <div className="disamatic-form-group"><label>Shift</label><input type="text" value={formData.shift} onChange={e => handleChange("shift", e.target.value)} /></div>
          <div className="disamatic-form-group"><label>Incharge</label><input type="text" value={formData.incharge} onChange={e => handleChange("incharge", e.target.value)} /></div>
          <div className="disamatic-form-group" style={{minWidth:200}}><label>Members Present</label>
            <Select isMulti options={memberOptions} value={formData.members} onChange={val => handleChange("members", val)} className="disamatic-multiselect" placeholder="Select Members..." />
          </div>
        </div>

        <div className="section-header" style={{marginTop:'2.5rem'}}><h3>Production</h3></div>
        <div className="disamatic-form-grid">
          <div className="disamatic-form-group"><label>P/P Operator</label><input type="text" value={formData.ppOperator} onChange={e => handleChange("ppOperator", e.target.value)} /></div>
        </div>
        {formData.productionTable.map((row,i) => (
          <div className="disamatic-form-grid" key={i}>
            <div className="disamatic-form-group"><label>Mould Counter No</label><input value={row.counterNo} onChange={e => handleArrayChange("productionTable", i, "counterNo", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Component Name</label><input value={row.componentName} onChange={e => handleArrayChange("productionTable", i, "componentName", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Produced</label><input value={row.produced} onChange={e => handleArrayChange("productionTable", i, "produced", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Poured</label><input value={row.poured} onChange={e => handleArrayChange("productionTable", i, "poured", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Cycle Time</label><input value={row.cycleTime} onChange={e => handleArrayChange("productionTable", i, "cycleTime", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Moulds Per Hour</label><input value={row.mouldsPerHour} onChange={e => handleArrayChange("productionTable", i, "mouldsPerHour", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Remarks</label><input value={row.remarks} onChange={e => handleArrayChange("productionTable", i, "remarks", e.target.value)} /></div>
          </div>
        ))}

        <div className="section-header" style={{marginTop:'2.5rem'}}><h3>Next Shift Plan</h3></div>
        {formData.nextShiftPlan.map((row, i) => (
          <div className="disamatic-form-grid" key={i}>
            <div className="disamatic-form-group"><label>Component Name</label><input value={row.componentName} onChange={e => handleArrayChange("nextShiftPlan", i, "componentName", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Planned Moulds</label><input value={row.plannedMoulds} onChange={e => handleArrayChange("nextShiftPlan", i, "plannedMoulds", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Remarks</label><input value={row.remarks} onChange={e => handleArrayChange("nextShiftPlan", i, "remarks", e.target.value)} /></div>
          </div>
        ))}

        <div className="section-header" style={{marginTop:'2.5rem'}}><h3>Delays</h3></div>
        {formData.delaysTable.map((row, i) => (
          <div className="disamatic-form-grid" key={i}>
            <div className="disamatic-form-group"><label>Delays</label><input value={row.delays} onChange={e => handleArrayChange("delaysTable", i, "delays", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Duration (Minutes)</label><input value={row.durationMinutes} onChange={e => handleArrayChange("delaysTable", i, "durationMinutes", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Duration (Time)</label><input value={row.durationTime} onChange={e => handleArrayChange("delaysTable", i, "durationTime", e.target.value)} /></div>
          </div>
        ))}

        <div className="section-header" style={{marginTop:'2.5rem'}}><h3>Mould Hardness - Production</h3></div>
        {formData.mouldHardness.map((row, i) => (
          <div className="disamatic-form-grid" key={i}>
            <div className="disamatic-form-group"><label>Component Name</label><input value={row.componentName} onChange={e => handleArrayChange("mouldHardness", i, "componentName", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Mould Penetrant Tester (PP)</label><input value={row.mpPP} onChange={e => handleArrayChange("mouldHardness", i, "mpPP", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Mould Penetrant Tester (SP)</label><input value={row.mpSP} onChange={e => handleArrayChange("mouldHardness", i, "mpSP", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>B-Scale (PP)</label><input value={row.bsPP} onChange={e => handleArrayChange("mouldHardness", i, "bsPP", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>B-Scale (SP)</label><input value={row.bsSP} onChange={e => handleArrayChange("mouldHardness", i, "bsSP", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>Remarks</label><input value={row.remarks} onChange={e => handleArrayChange("mouldHardness", i, "remarks", e.target.value)} /></div>
          </div>
        ))}

        <div className="section-header" style={{marginTop:'2.5rem'}}><h3>Mould Hardness - Pattern Temp</h3></div>
        {formData.patternTemp.map((row, i) => (
          <div className="disamatic-form-grid" key={i}>
            <div className="disamatic-form-group"><label>Item</label><input value={row.item} onChange={e => handleArrayChange("patternTemp", i, "item", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>PP</label><input value={row.pp} onChange={e => handleArrayChange("patternTemp", i, "pp", e.target.value)} /></div>
            <div className="disamatic-form-group"><label>SP</label><input value={row.sp} onChange={e => handleArrayChange("patternTemp", i, "sp", e.target.value)} /></div>
          </div>
        ))}

        <div className="section-header" style={{marginTop:'2.5rem'}}><h3>Significant Event</h3></div>
        <div className="disamatic-form-grid">
          <div className="disamatic-form-group" style={{gridColumn:'1/-1'}}>
            <label>Significant Event</label>
            <textarea className="disamatic-large-text" value={formData.significantEvent} onChange={e => handleChange("significantEvent", e.target.value)} placeholder="Describe significant event..." rows={4} />
          </div>
        </div>

        <div className="section-header" style={{marginTop:'2.5rem'}}><h3>Maintanance</h3></div>
        <div className="disamatic-form-grid">
          <div className="disamatic-form-group" style={{gridColumn:'1/-1'}}>
            <label>Maintanance</label>
            <textarea className="disamatic-large-text" value={formData.maintanance} onChange={e => handleChange("maintanance", e.target.value)} placeholder="Describe maintanance..." rows={4} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DisamaticProductReport;