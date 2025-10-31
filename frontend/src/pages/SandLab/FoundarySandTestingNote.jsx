import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Save, RefreshCw, FileText } from 'lucide-react';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/FoundarySandTestingNote.css';

const initialFormData = {
  date: new Date().toISOString().split('T')[0],
  shift: "",
  sandPlant: "",
  compactibilitySetting: "",
  shearStrengthSetting: "",
  clayTests: {
    test1: { totalClay: "", activeClay: "", deadClay: "", vcm: "", loi: "" },
    test2: { totalClay: "", activeClay: "", deadClay: "", vcm: "", loi: "" }
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
    }
  },
  parameters: {
    test1: {
      gcs: "", bentonitePremix: "", premixCoaldust: "", lcCompactSmcat: "",
      mouldStrengthSncat: "", permeability: "", wts: "", moisture: "",
      hopperLevel: "", returnSand: ""
    },
    test2: {
      gcs: "", bentonitePremix: "", premixCoaldust: "", lcCompactSmcat: "",
      mouldStrengthSncat: "", permeability: "", wts: "", moisture: "",
      hopperLevel: "", returnSand: ""
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
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (section, field, value, subField = null) => {
    if (subField) {
      setFormData(prev => ({
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
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/v1/foundry-sand-testing-notes', formData);
      if (response.success) {
        alert('Foundry Sand Testing Note saved successfully!');
        handleClear();
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (!window.confirm('Are you sure you want to reset the entire form?')) return;
    setFormData(initialFormData);
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

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="foundry-form-grid">
          {/* Basic Info Section */}
          <h3 className="foundry-section-title">Basic Information</h3>
          <div className="foundry-form-group">
            <label>Sand Plant</label>
            <input
              type="text"
              placeholder="e.g. DISA"
              value={formData.sandPlant}
              onChange={(e) => handleInputChange("sandPlant", "", e.target.value)}
            />
          </div>
          <div className="foundry-form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", null, e.target.value)}
            />
          </div>
          <div className="foundry-form-group">
            <label>Shift</label>
            <input
              type="text"
              placeholder="e.g. 2nd Shift"
              value={formData.shift}
              onChange={(e) => handleInputChange("shift", null, e.target.value)}
            />
          </div>
          <div className="foundry-form-group">
            <label>Compactability Setting</label>
            <input
              type="text"
              placeholder="e.g. J.C. mode"
              value={formData.compactibilitySetting}
              onChange={(e) => handleInputChange("compactibilitySetting", null, e.target.value)}
            />
          </div>
          <div className="foundry-form-group">
            <label>Shear/Mould Strength Setting</label>
            <input
              type="text"
              placeholder="e.g. MP.VOX"
              value={formData.shearStrengthSetting}
              onChange={(e) => handleInputChange("shearStrengthSetting", null, e.target.value)}
            />
          </div>

          {/* Clay Parameters */}
          <h3 className="foundry-section-title">Clay Parameters</h3>
          <div className="foundry-table-wrapper full-width">
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
                      <input
                        type="text"
                        placeholder="Enter value"
                        value={formData.clayTests.test1[param]}
                        onChange={(e) => handleInputChange("clayTests", "test1", e.target.value, param)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter value"
                        value={formData.clayTests.test2[param]}
                        onChange={(e) => handleInputChange("clayTests", "test2", e.target.value, param)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sieve Testing */}
          <h3 className="foundry-section-title">Sieve Testing</h3>
          <div className="foundry-table-wrapper full-width">
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
                        value={formData.test1.sieveSize[row.size] || ''}
                        onChange={(e) => handleInputChange("test1", "sieveSize", e.target.value, row.size)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter %"
                        value={formData.test2.sieveSize[row.size] || ''}
                        onChange={(e) => handleInputChange("test2", "sieveSize", e.target.value, row.size)}
                      />
                    </td>
                    <td>{row.mf}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Product"
                        value={formData.mfTest.mf[row.mf] || ''}
                        onChange={(e) => handleInputChange("mfTest", "mf", e.target.value, row.mf)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Product"
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
                      value={formData.test1.sieveSize.total}
                      onChange={(e) => handleInputChange("test1", "sieveSize", e.target.value, "total")}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Total"
                      value={formData.test2.sieveSize.total}
                      onChange={(e) => handleInputChange("test2", "sieveSize", e.target.value, "total")}
                    />
                  </td>
                  <td></td>
                  <td>
                    <input
                      type="text"
                      placeholder="Total"
                      value={formData.mfTest.mf.total}
                      onChange={(e) => handleInputChange("mfTest", "mf", e.target.value, "total")}
                    />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Test Parameters */}
          <h3 className="foundry-section-title">Test Parameters</h3>
          <div className="foundry-table-wrapper full-width">
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
                  { key: "gcs", label: "GCS" },
                  { key: "bentonitePremix", label: "Bentonite Premix" },
                  { key: "premixCoaldust", label: "Premix Coaldust" },
                  { key: "lcCompactSmcat", label: "LC Compact SMCAT" },
                  { key: "mouldStrengthSncat", label: "Mould Strength SNCAT" },
                  { key: "permeability", label: "Permeability" },
                  { key: "wts", label: "WTS" },
                  { key: "moisture", label: "Moisture" },
                  { key: "hopperLevel", label: "Hopper Level" },
                  { key: "returnSand", label: "Return Sand" }
                ].map((param) => (
                  <tr key={param.key}>
                    <td>{param.label}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter value"
                        value={formData.parameters.test1[param.key]}
                        onChange={(e) => handleInputChange("parameters", "test1", e.target.value, param.key)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter value"
                        value={formData.parameters.test2[param.key]}
                        onChange={(e) => handleInputChange("parameters", "test2", e.target.value, param.key)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Additional Data */}
          <h3 className="foundry-section-title">Additional Data</h3>
          <div className="foundry-table-wrapper full-width">
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
                        value={formData.additionalData.test1[param]}
                        onChange={(e) => handleInputChange("additionalData", "test1", e.target.value, param)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter value"
                        value={formData.additionalData.test2[param]}
                        onChange={(e) => handleInputChange("additionalData", "test2", e.target.value, param)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          <h3 className="foundry-section-title">Remarks</h3>
          <div className="foundry-form-group full-width">
            <label>Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", null, e.target.value)}
              placeholder="Enter any additional remarks..."
              rows="4"
            />
          </div>

        {/* Submit Button */}
      <div className="foundry-submit-container">
        <button onClick={handleSave} disabled={loading} className="foundry-submit-btn" type="button">
          {loading ? 'Saving...' : (
            <>
              <Save size={18} />
              Submit Entry
            </>
          )}
        </button>
        </div>
      </form>

      <div className="foundry-reset-container">
        <button onClick={handleClear} disabled={loading} className="foundry-reset-btn">
          <RefreshCw size={18} />
          Reset
        </button>
      </div>
    </>
  );
}
