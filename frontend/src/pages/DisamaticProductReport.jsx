import React, { useState } from 'react';
import { Save, Users, Factory, Clock, Zap, X } from 'lucide-react';

// Define the number of rows needed
const NUM_ROWS = 20;

// --- 1. SIMPLIFIED STYLE DEFINITIONS ---
const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  mainCard: {
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  header: {
    padding: "1rem 1.5rem",
    borderBottom: "4px solid #0056b3",
    backgroundColor: "#e6f2ff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  titleContainer: { textAlign: "center", flexGrow: 1 },
  headerTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#0056b3",
    margin: "0 0 0.25rem 0",
  },
  headerSubtitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
  },
  inputGroup: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    gap: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#333",
  },
  inputLabel: {
    fontWeight: 600,
    color: "#1a202c",
    textAlign: "right",
  },
  inputBase: {
    padding: "0.3rem 0.6rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "0.8rem",
    outline: "none",
    width: "120px",
    boxSizing: "border-box",
    backgroundColor: "white",
  },
  section: { padding: "1.5rem", borderBottom: "1px solid #ddd" },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
    borderBottom: "2px solid #ccc",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  tableWrapper: { overflowX: "auto", marginBottom: "1rem" },
  tableBase: { width: "100%", borderCollapse: "collapse" },
  tableHeadCell: {
    backgroundColor: "#cce5ff",
    color: "#0056b3",
    padding: "0.6rem",
    textAlign: "center",
    fontWeight: 600,
    border: "1px solid #aaa",
  },
  tableBodyCell: {
    padding: "0px",
    textAlign: "center",
    border: "1px solid #ddd",
    fontSize: "0.875rem",
    color: "#333",
  },
  tableInput: {
    width: "100%",
    padding: "0.4rem",
    border: "none",
    outline: "none",
    fontSize: "0.875rem",
    textAlign: "center",
    backgroundColor: "transparent",
  },
  addRowButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    backgroundColor: "#0056b3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    margin: "0.5rem 0",
  },
  buttonGroup: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    paddingTop: "1.5rem",
  },
  baseButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: 500,
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  submitButton: { backgroundColor: "#0056b3", color: "white" },
};

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
    <div style={styles.tableWrapper}>
      <table style={styles.tableBase}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={styles.tableHeadCell}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {Object.keys(row).map((key, j) => (
                <td key={j} style={styles.tableBodyCell}>
                  <input
                    type="text"
                    value={row[key]}
                    onChange={(e) =>
                      handleArrayChange(arrayName, i, key, e.target.value)
                    }
                    style={styles.tableInput}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        style={styles.addRowButton}
        onClick={() => addRow(arrayName, emptyRow)}
      >
        <Plus size={16} /> Add Row
      </button>
    </div>
  );

    return (
        <div style={styles.pageContainer}>
            <div style={styles.mainCard}>

                {/* --- HEADER --- */}
                <div style={styles.header}>
                    <Factory size={40} style={{ color: '#0056b3' }} />
                    <div style={styles.titleContainer}>
                        <h1 style={styles.headerTitle}>DISAMATIC PRODUCT REPORT</h1>
                        <p style={styles.headerSubtitle}>SAKTHI AUTO / DISA</p>
                    </div>
                    {/* Header Input Fields (Tab Indices 1-3) */}
                    <div style={styles.inputGroup}>
                        <span style={styles.inputLabel}>Date:</span>
                        <input type="date" value={formData.date} onChange={(e) => handleMainChange('date', e.target.value)} style={styles.inputBase} tabIndex={1} />

                        <span style={styles.inputLabel}>Shift:</span>
                        <input type="text" value={formData.shift} onChange={(e) => handleMainChange('shift', e.target.value)} style={styles.inputBase} tabIndex={2} />

                        <span style={styles.inputLabel}>Incharge:</span>
                        <input type="text" value={formData.incharge} onChange={(e) => handleMainChange('incharge', e.target.value)} style={styles.inputBase} tabIndex={3} />
                    </div>
                </div>

        <form onSubmit={handleSubmit}>
          {/* Members */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Users size={20} color="#0056b3" /> Members Present:
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
              }}
            >
              {formData.members.map((m, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Member ${i + 1}`}
                  style={styles.inputBase}
                  value={m}
                  onChange={(e) =>
                    handleArrayChange("members", i, "", e.target.value)
                  }
                />
              ))}
            </div>
          </div>

          {/* Production */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
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
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
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
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
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
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleReset}
              style={{ ...styles.baseButton, backgroundColor: "#333", color: "white" }}
            >
              <X size={18} /> Reset
            </button>
            <button type="submit" style={{ ...styles.baseButton, ...styles.submitButton }}>
              <Save size={18} /> Save Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MouldingReport;