import React, { useState } from "react";
import { FlaskConical, Factory } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import { DatePicker, SubmitButton, ResetButton } from '../../Components/Buttons';
import api from '../../utils/api';

export default function FoundrySandTestingNote() {
  // Form state
  const [formData, setFormData] = useState({
    sandPlant: "",
    date: "",
    compactabilitySetting: "",
    shift: "",
    shearMouldStrengthSetting: "",
    parameters: {
      totalClay: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }],
      activeClay: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }],
      deadClay: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }],
      vcm: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }],
      loi: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }]
    },
    sieveTesting: {
      data: [],
      total: {
        wtRetainedTest1: "",
        wtRetainedTest2: "",
        productTest1: "",
        productTest2: ""
      }
    },
    testResults: {
      compactibility: { test1: "", test2: "" },
      permeability: { test1: "", test2: "" },
      gcs: { test1: "", test2: "" },
      wts: { test1: "", test2: "" },
      moisture: { test1: "", test2: "" },
      bentonite: { test1: "", test2: "" },
      coalDust: { test1: "", test2: "" },
      hopperLevel: { test1: "", test2: "" },
      shearStrength: { test1: "", test2: "" },
      dustCollectorSetting: { test1: "", test2: "" },
      returnSandMoisture: { test1: "", test2: "" },
      afsNo: { test1: "", test2: "" },
      fines: { test1: "", test2: "" },
      gd: { test1: "", test2: "" }
    },
    remarks: ""
  });

  // Handle form save
  const handleSave = async () => {
    try {
      const response = await api.post('/v1/foundry-sand-testing', formData);
      if (response.success) {
        alert('Data saved successfully');
      }
    } catch (error) {
      alert('Error saving data: ' + error.message);
    }
  };

  // Handle form field changes
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle clearing form
  const handleClear = () => {
    setFormData({
      sandPlant: "",
      date: "",
      compactabilitySetting: "",
      shift: "",
      shearMouldStrengthSetting: "",
      parameters: {
        totalClay: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }],
        activeClay: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }],
        deadClay: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }],
        vcm: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }],
        loi: [{ test1: { value: "", calculated: "" }, test2: { value: "", calculated: "" } }]
      },
      sieveTesting: {
        data: [],
        total: {
          wtRetainedTest1: "",
          wtRetainedTest2: "",
          productTest1: "",
          productTest2: ""
        }
      },
      testResults: {
        compactibility: { test1: "", test2: "" },
        permeability: { test1: "", test2: "" },
        gcs: { test1: "", test2: "" },
        wts: { test1: "", test2: "" },
        moisture: { test1: "", test2: "" },
        bentonite: { test1: "", test2: "" },
        coalDust: { test1: "", test2: "" },
        hopperLevel: { test1: "", test2: "" },
        shearStrength: { test1: "", test2: "" },
        dustCollectorSetting: { test1: "", test2: "" },
        returnSandMoisture: { test1: "", test2: "" },
        afsNo: { test1: "", test2: "" },
        fines: { test1: "", test2: "" },
        gd: { test1: "", test2: "" }
      },
      remarks: ""
    });
  };
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Inline styles for tabs (keeps everything inside this file — no external CSS)
  const foundryContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  };

  const foundryWrapperStyle = {
    flex: 1,
    padding: '1rem',
  };

  const tabsContainerStyle = {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 2rem',
  };

  const tabsStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '-1px',
  };

  const tabStyle = {
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    color: '#64748b',
    borderBottom: '2px solid transparent',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  };

  const tabActiveStyle = {
    color: '#1e293b',
    borderBottomColor: '#1e293b',
  };

  const FoundrySandTestingTabs = () => (
    <div style={tabsContainerStyle}>
      <div style={tabsStyle}>
        <Link
          to="/sand-lab/foundry-sand-testing-note"
          style={isActive('/sand-lab/foundry-sand-testing-note') ? { ...tabStyle, ...tabActiveStyle } : tabStyle}
        >
          Data Entry
        </Link>
        <Link
          to="/sand-lab/foundry-sand-testing-note/report"
          style={isActive('/sand-lab/foundry-sand-testing-note/report') ? { ...tabStyle, ...tabActiveStyle } : tabStyle}
        >
          Report
        </Link>
      </div>
    </div>
  );
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

  // ===== STYLES =====
  const container = {
    fontFamily: "Segoe UI, Arial, sans-serif",
    padding: "2rem",
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    minHeight: "100vh",
    background: "#f0f4f8",
    color: "#1e1e1e",
  };

  const headerBox = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1.5rem",
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const title = {
    fontSize: "1.5rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
    margin: "0 0.75rem",
    color: "white",
  };

  const subHeader = {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto 1fr",
    rowGap: "10px",
    columnGap: "8px",
    fontSize: "14px",
    alignItems: "center",
    marginBottom: "15px",
  };

  const label = {
    fontWeight: "bold",
    color: "#1e293b",
  };

  const input = {
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    height: "32px",
    width: "100%",
    padding: "0 0.75rem",
    backgroundColor: "#fff",
    fontSize: "0.9rem",
    color: "#1e293b",
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
    marginTop: "1rem",
    border: "1px solid #e2e8f0",
    background: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const th = {
    border: "1px solid #94a3b8",
    padding: "0.75rem",
    textAlign: "center",
    fontWeight: "600",
    color: "white",
    background: "#1e293b",
  };

  const td = {
    border: "1px solid #e2e8f0",
    padding: "0.75rem",
    textAlign: "center",
    color: "#475569",
    backgroundColor: "white",
  };

  const altTableHeader = {
    ...th,
    background: "#52525b",
  };

  const sectionTitle = {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "25px",
    marginBottom: "6px",
    fontSize: "15.5px",
    color: "#111827",
  };

  const percentBox = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  };

  const remarkBox = {
    width: "100%",
    height: "60px",
    border: "1px solid #bbb",
    borderRadius: "6px",
    marginTop: "4px",
    padding: "6px",
    background: "#fff",
  };

  const buttonRow = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "18px",
  };

  const button = (bg) => ({
    border: "none",
    background: bg,
    color: "white",
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  });

  // ===== RENDER =====
  return (
    <div style={foundryContainerStyle}>
      <div style={foundryWrapperStyle}>
        <FoundrySandTestingTabs />
        <div style={container}>
          {/* Header Box */}
          <div style={headerBox}>
            <Factory color="white" size={24} />
            <div style={title}>FOUNDRY SAND TESTING NOTE</div>
            <FlaskConical color="white" size={24} />
          </div>

      {/* Sub Header */}
      <div style={subHeader}>
        <span style={label}>SAND PLANT:</span>
        <input 
          style={input} 
          placeholder="e.g. DISA" 
          value={formData.sandPlant}
          onChange={(e) => handleInputChange("sandPlant", "", e.target.value)}
        />
        <span style={label}>DATE:</span>
        <div style={{ gridColumn: 'span 1' }}>
          <DatePicker
            name="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", "", e.target.value)}
          />
        </div>
        <span style={label}>COMPACTABILITY SETTING:</span>
        <input 
          style={input} 
          placeholder="e.g. J.C. mode"
          value={formData.compactabilitySetting} 
          onChange={(e) => handleInputChange("compactabilitySetting", "", e.target.value)}
        />
        <span style={label}>SHIFT:</span>
        <input 
          style={input} 
          placeholder="e.g. 2nd Shift"
          value={formData.shift}
          onChange={(e) => handleInputChange("shift", "", e.target.value)}
        />
        <span style={label}>SHEAR/MOULD STRENGTH SETTING:</span>
        <input 
          style={input} 
          placeholder="e.g. MP.VOX"
          value={formData.shearMouldStrengthSetting}
          onChange={(e) => handleInputChange("shearMouldStrengthSetting", "", e.target.value)}
        />
      </div>

      {/* Parameters Table */}
      <div style={sectionTitle}>PARAMETERS</div>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Parameter</th>
            <th style={th}>TEST-1</th>
            <th style={th}>TEST-2</th>
          </tr>
        </thead>
        <tbody>
          {["Total Clay", "Active Clay", "Dead Clay", "VCM", "LOI"].map(
            (param, i) => (
              <tr key={i}>
                <td style={td}>{param}</td>
                {[1, 2].map((t) => (
                  <td key={t} style={td}>
                    <div style={percentBox}>
                      <input style={{ ...input, width: "45%" }} />
                      <span>% =</span>
                      <input style={{ ...input, width: "35%" }} />
                    </div>
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Sieve Testing */}
      <div style={sectionTitle}>SIEVE TESTING</div>
      <table style={table}>
        <thead>
          <tr>
            <th rowSpan="2" style={altTableHeader}>
              Sieve size (Mic)
            </th>
            <th colSpan="2" style={altTableHeader}>
              % Wt retained sand
            </th>
            <th rowSpan="2" style={altTableHeader}>
              MF
            </th>
            <th colSpan="2" style={altTableHeader}>
              Product
            </th>
          </tr>
          <tr>
            <th style={altTableHeader}>TEST-1</th>
            <th style={altTableHeader}>TEST-2</th>
            <th style={altTableHeader}>TEST-1</th>
            <th style={altTableHeader}>TEST-2</th>
          </tr>
        </thead>
        <tbody>
          {sieveData.map((row, i) => (
            <tr key={i}>
              <td style={td}>{row.size}</td>
              <td style={td}>
                <input style={input} />
              </td>
              <td style={td}>
                <input style={input} />
              </td>
              <td style={td}>{row.mf}</td>
              <td style={td}>
                <input style={input} />
              </td>
              <td style={td}>
                <input style={input} />
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ ...td, fontWeight: "bold" }}>Total</td>
            <td style={td}>
              <input style={input} />
            </td>
            <td style={td}>
              <input style={input} />
            </td>
            <td style={td}></td>
            <td style={td}>
              <input style={input} />
            </td>
            <td style={td}>
              <input style={input} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Test Results */}
      <div style={sectionTitle}>TEST RESULTS</div>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Parameter</th>
            <th style={th}>TEST-1</th>
            <th style={th}>TEST-2</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Compactibility", "%"],
            ["Permeability", ""],
            ["GCS", "gm/cm²"],
            ["WTS", "N/cm²"],
            ["Moisture", "%"],
            ["Bentonite", "kg"],
            ["Coal Dust", "kg"],
            ["Hopper Level", "%"],
            ["Shear Strength", "sec"],
            ["Dust Collector Setting", ""],
            ["Return Sand Moisture", "%"],
            ["AFS No", ""],
            ["Fines", "%"],
            ["GD", ""],
          ].map(([param, unit], i) => (
            <tr key={i}>
              <td style={td}>{param}</td>
              {[1, 2].map((t) => (
                <td key={t} style={td}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <input style={{ ...input, width: "60%" }} /> {unit}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Remarks */}
      <div style={{ marginTop: "20px" }}>
        <strong style={{ color: "#1f2937" }}>Remarks:</strong>
        <textarea style={remarkBox} />
      </div>

      {/* Buttons */}
      <div style={buttonRow}>
          <ResetButton onClick={handleClear}>Clear</ResetButton>
          <SubmitButton onClick={handleSave}>Save</SubmitButton>
        </div>
        </div>
      </div>
    </div>
  );
}