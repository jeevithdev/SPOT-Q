import React, { useState } from 'react';
import { Save, Users, Factory, Clock, Zap, X, Plus, Filter } from 'lucide-react';
import { Button } from '../../Components/Buttons';
import '../../styles/PageStyles/Moulding/DisamaticProductReport.css';

// per-page styles are in the imported CSS file

// --- COMPONENT ---
const MouldingReport = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    shift: "",
    incharge: "",
    members: ["", "", "", ""],
    production: "",
    ppOperator: "",
    productionTable: Array(8).fill({
      counterNo: "",
      componentName: "",
      produced: "",
      poured: "",
      cycleTime: "",
      mouldsPerHour: "",
      remarks: "",
    }),
    nextShiftPlan: Array(8).fill({
      componentName: "",
      plannedMoulds: "",
      remarks: "",
    }),
    delaysTable: Array(8).fill({
      delays: "",
      durationMinutes: "",
      durationTime: "",
    }),
  });

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleArrayChange = (arrayName, index, field, value) => {
    const updated = [...formData[arrayName]];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, [arrayName]: updated }));
  };

  const addRow = (arrayName, emptyRow) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...emptyRow }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Report Saved Successfully!");
    console.log(formData);
  };

  const handleReset = () => {
    if (window.confirm("Reset entire form?")) {
      window.location.reload();
    }
  };

  const renderTable = (rows, headers, arrayName, emptyRow) => (
    <div className="disamatic-table-wrapper">
  <table className="disamatic-table">
        <thead>
          <tr>
              {headers.map((h, i) => (
              <th key={i} className="disamatic-table-head-cell">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {Object.keys(row).map((key, j) => (
                <td key={j} className="disamatic-table-body-cell">
                  <input
                    type="text"
                    value={row[key]}
                    onChange={(e) =>
                      handleArrayChange(arrayName, i, key, e.target.value)
                    }
                    className="disamatic-table-input"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        type="button"
        className="disamatic-add-row-btn"
        onClick={() => addRow(arrayName, emptyRow)}
      >
        <Plus size={16} /> Add Row
      </Button>
    </div>
  );

    return (
    <div className="disamatic-page-container">
      <div className="disamatic-main-card">

                {/* --- HEADER --- */}
        <div className="disamatic-header">
          <Factory size={40} className="disamatic-factory-icon" />
          <div className="disamatic-title-container">
            <h1 className="disamatic-header-title">DISAMATIC PRODUCT REPORT</h1>
            <p className="disamatic-header-subtitle">SAKTHI AUTO / DISA</p>
          </div>
                    {/* Header Input Fields (Tab Indices 1-3) */}
          <div className="disamatic-input-group">
            <span className="disamatic-input-label">Date:</span>
            <input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} className="disamatic-input-base" tabIndex={1} />

            <span className="disamatic-input-label">Shift:</span>
            <input type="text" value={formData.shift} onChange={(e) => handleChange('shift', e.target.value)} className="disamatic-input-base" tabIndex={2} />

            <span className="disamatic-input-label">Incharge:</span>
            <input type="text" value={formData.incharge} onChange={(e) => handleChange('incharge', e.target.value)} className="disamatic-input-base" tabIndex={3} />
          </div>
                </div>

        <form onSubmit={handleSubmit}>
          {/* Members */}
          <div className="disamatic-section">
            <h2 className="disamatic-section-title">
              <Users size={20} color="#0056b3" /> Members Present:
            </h2>
            <div className="disamatic-members-grid">
              {formData.members.map((m, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Member ${i + 1}`}
                  className="disamatic-input-base"
                  value={m}
                  onChange={(e) =>
                    handleArrayChange("members", i, "", e.target.value)
                  }
                />
              ))}
            </div>
          </div>

          {/* Production */}
          <div className="disamatic-section">
            <h2 className="disamatic-section-title">
              <Zap size={20} color="#0056b3" /> Production:
            </h2>
            {renderTable(
              formData.productionTable,
              [
                "Mould Counter No",
                "Component Name",
                "Produced",
                "Poured",
                "Cycle Time",
                "Moulds/hour",
                "Remarks",
              ],
              "productionTable",
              {
                counterNo: "",
                componentName: "",
                produced: "",
                poured: "",
                cycleTime: "",
                mouldsPerHour: "",
                remarks: "",
              }
            )}
          </div>

          {/* Next Shift Plan */}
          <div className="disamatic-section">
            <h2 className="disamatic-section-title">
              <Clock size={20} color="#0056b3" /> Next Shift Plan:
            </h2>
            {renderTable(
              formData.nextShiftPlan.map((r, i) => ({
                sno: i + 1,
                ...r,
              })),
              ["S.No", "Component Name", "Planned Moulds", "Remarks"],
              "nextShiftPlan",
              { componentName: "", plannedMoulds: "", remarks: "" }
            )}
          </div>

          {/* Delays */}
          <div className="disamatic-section">
            <h2 className="disamatic-section-title">
              <X size={20} color="red" /> Delays:
            </h2>
            {renderTable(
              formData.delaysTable.map((r, i) => ({
                sno: i + 1,
                ...r,
              })),
              ["S.No", "Delays", "Duration (min)", "Duration (time)"],
              "delaysTable",
              { delays: "", durationMinutes: "", durationTime: "" }
            )}
          </div>

          {/* Buttons */}
          <div className="disamatic-button-group">
            <Button
              type="button"
              onClick={handleReset}
              className="disamatic-base-button disamatic-reset-btn"
            >
              <X size={18} /> Reset
            </Button>
            <Button type="submit" className="disamatic-base-button disamatic-submit-btn">
              <Save size={18} /> Save Report
            </Button>
          </div>
        </form>

        {/* Report Section */}
        <div className="disamatic-report-container">
          <div className="disamatic-report-header">
            <Filter size={20} className="disamatic-filter-icon" />
            <h3 className="disamatic-report-title">Disamatic Product Report - Records</h3>
          </div>

          <div className="disamatic-report-filter-grid">
            <div>
              <label className="disamatic-filter-label">Start Date</label>
              <input type="date" className="disamatic-filter-input" />
            </div>
            <div>
              <label className="disamatic-filter-label">End Date</label>
              <input type="date" className="disamatic-filter-input" />
            </div>
            <Button className="disamatic-filter-btn">
              <Filter size={18} />
              Filter
            </Button>
          </div>

          <div className="disamatic-table-wrapper">
            <table className="disamatic-table">
              <thead>
                <tr>
                  <th className="disamatic-table-head-cell-left">Date</th>
                  <th className="disamatic-table-head-cell-left">Shift</th>
                  <th className="disamatic-table-head-cell-left">Part Name</th>
                  <th className="disamatic-table-head-cell-left">Total Boxes</th>
                  <th className="disamatic-table-head-cell-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="disamatic-no-records">
                    No records found. Submit entries above to see them here.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MouldingReport;