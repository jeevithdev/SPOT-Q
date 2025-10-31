import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { ViewReportButton, SubmitButton, ResetFormButton } from '../../Components/Buttons';
import '../../styles/PageStyles/Moulding/DmmSettingParameters.css';

const initialRow = {
  customer: "",
  itemDescription: "",
  time: "",
  ppThickness: "",
  ppHeight: "",
  spThickness: "",
  spHeight: "",
  spCoreMaskThickness: "",
  spCoreMaskHeight: "",
  ppCoreMaskThickness: "",
  ppCoreMaskHeight: "",
  sandShotPressureBar: "",
  correctionShotTime: "",
  squeezePressure: "",
  ppStrippingAcceleration: "",
  ppStrippingDistance: "",
  spStrippingAcceleration: "",
  spStrippingDistance: "",
  mouldThicknessPlus10: "",
  closeUpForceMouldCloseUpPressure: "",
  remarks: "",
};

const initialHeader = {
  customer: "",
  model: "",
  mcNo: "",
  date: "",
  checker: "",
  shift: "",
};

const DmmSettingParameters = () => {
  const navigate = useNavigate();
  const [header, setHeader] = useState({ ...initialHeader });
  const [shift1Rows, setShift1Rows] = useState([{ ...initialRow }]);
  const [shift2Rows, setShift2Rows] = useState([{ ...initialRow }]);
  const [shift3Rows, setShift3Rows] = useState([{ ...initialRow }]);

  const handleHeaderChange = (field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (shift, index, field, value) => {
    let updateRows;
    if (shift === 1) {
      updateRows = [...shift1Rows];
      updateRows[index][field] = value;
      setShift1Rows(updateRows);
    } else if (shift === 2) {
      updateRows = [...shift2Rows];
      updateRows[index][field] = value;
      setShift2Rows(updateRows);
    } else if (shift === 3) {
      updateRows = [...shift3Rows];
      updateRows[index][field] = value;
      setShift3Rows(updateRows);
    }
  };

  const addRow = (shift) => {
    if (shift === 1) setShift1Rows([...shift1Rows, { ...initialRow }]);
    if (shift === 2) setShift2Rows([...shift2Rows, { ...initialRow }]);
    if (shift === 3) setShift3Rows([...shift3Rows, { ...initialRow }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form || e.target.closest('.dmm-content');
      const inputs = Array.from(form.querySelectorAll('input:not([type="button"])'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted successfully!');
  };

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset the entire form? All unsaved data will be lost.')) return;
    setHeader({ ...initialHeader });
    setShift1Rows([{ ...initialRow }]);
    setShift2Rows([{ ...initialRow }]);
    setShift3Rows([{ ...initialRow }]);
  };

  const handleViewReport = () => {
    navigate('/moulding/dmm-setting-parameters/report');
  };

  const renderRow = (row, index, shift) => (
    <div key={index} className="dmm-form-grid">
      <div className="dmm-form-group">
        <label>Customer</label>
        <input
          type="text"
          value={row.customer}
          onChange={(e) => handleInputChange(shift, index, "customer", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., ABC Industries"
        />
      </div>
      <div className="dmm-form-group">
        <label>Item Description</label>
        <input
          type="text"
          value={row.itemDescription}
          onChange={(e) => handleInputChange(shift, index, "itemDescription", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Engine Block Casting"
        />
      </div>
      <div className="dmm-form-group">
        <label>Time</label>
        <input
          type="text"
          value={row.time}
          onChange={(e) => handleInputChange(shift, index, "time", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 08:30 AM"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Thickness (mm)</label>
        <input
          type="number"
          value={row.ppThickness}
          onChange={(e) => handleInputChange(shift, index, "ppThickness", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 25.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Height (mm)</label>
        <input
          type="number"
          value={row.ppHeight}
          onChange={(e) => handleInputChange(shift, index, "ppHeight", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 150.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Thickness (mm)</label>
        <input
          type="number"
          value={row.spThickness}
          onChange={(e) => handleInputChange(shift, index, "spThickness", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 30.2"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Height (mm)</label>
        <input
          type="number"
          value={row.spHeight}
          onChange={(e) => handleInputChange(shift, index, "spHeight", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 180.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Core Mask Thickness (mm)</label>
        <input
          type="number"
          value={row.spCoreMaskThickness}
          onChange={(e) => handleInputChange(shift, index, "spCoreMaskThickness", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 12.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Core Mask Height (mm)</label>
        <input
          type="number"
          value={row.spCoreMaskHeight}
          onChange={(e) => handleInputChange(shift, index, "spCoreMaskHeight", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 95.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Core Mask Thickness (mm)</label>
        <input
          type="number"
          value={row.ppCoreMaskThickness}
          onChange={(e) => handleInputChange(shift, index, "ppCoreMaskThickness", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 10.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Core Mask Height (mm)</label>
        <input
          type="number"
          value={row.ppCoreMaskHeight}
          onChange={(e) => handleInputChange(shift, index, "ppCoreMaskHeight", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 85.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Sand Shot Pressure (Bar)</label>
        <input
          type="number"
          value={row.sandShotPressureBar}
          onChange={(e) => handleInputChange(shift, index, "sandShotPressureBar", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 6.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Correction Shot Time (s)</label>
        <input
          type="number"
          value={row.correctionShotTime}
          onChange={(e) => handleInputChange(shift, index, "correctionShotTime", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 2.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Squeeze Pressure (Kg/cm²)</label>
        <input
          type="number"
          value={row.squeezePressure}
          onChange={(e) => handleInputChange(shift, index, "squeezePressure", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 45.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Stripping Acceleration</label>
        <input
          type="number"
          value={row.ppStrippingAcceleration}
          onChange={(e) => handleInputChange(shift, index, "ppStrippingAcceleration", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 3.2"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Stripping Distance</label>
        <input
          type="number"
          value={row.ppStrippingDistance}
          onChange={(e) => handleInputChange(shift, index, "ppStrippingDistance", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 120.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Stripping Acceleration</label>
        <input
          type="number"
          value={row.spStrippingAcceleration}
          onChange={(e) => handleInputChange(shift, index, "spStrippingAcceleration", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 2.8"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Stripping Distance</label>
        <input
          type="number"
          value={row.spStrippingDistance}
          onChange={(e) => handleInputChange(shift, index, "spStrippingDistance", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 140.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Mould Thickness ±10mm</label>
        <input
          type="number"
          value={row.mouldThicknessPlus10}
          onChange={(e) => handleInputChange(shift, index, "mouldThicknessPlus10", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 250.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Close Up Force / Mould Close Up Pressure</label>
        <input
          type="text"
          value={row.closeUpForceMouldCloseUpPressure}
          onChange={(e) => handleInputChange(shift, index, "closeUpForceMouldCloseUpPressure", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 800 kN / 55 bar"
        />
      </div>
      <div className="dmm-form-group">
        <label>Remarks</label>
        <input
          type="text"
          value={row.remarks}
          onChange={(e) => handleInputChange(shift, index, "remarks", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., All parameters OK"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="dmm-header">
        <div className="dmm-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            DMM Setting Parameters Check Sheet
          </h2>
        </div>
        <div className="dmm-header-buttons">
          <ViewReportButton onClick={handleViewReport} />
          <ResetFormButton onClick={handleReset} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">Basic Information</h3>
            <div className="dmm-form-grid">
              <div className="dmm-form-group">
                <label>Customer</label>
                <input
                  type="text"
                  value={header.customer}
                  onChange={(e) => handleHeaderChange("customer", e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., ABC Industries"
                />
              </div>
              <div className="dmm-form-group">
                <label>Model</label>
                <input
                  type="text"
                  value={header.model}
                  onChange={(e) => handleHeaderChange("model", e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., XZ-2000"
                />
              </div>
              <div className="dmm-form-group">
                <label>M/C No.</label>
                <input
                  type="text"
                  value={header.mcNo}
                  onChange={(e) => handleHeaderChange("mcNo", e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., MC-001"
                />
              </div>
              <div className="dmm-form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={header.date}
                  onChange={(e) => handleHeaderChange("date", e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="dmm-form-group">
                <label>Checker</label>
                <input
                  type="text"
                  value={header.checker}
                  onChange={(e) => handleHeaderChange("checker", e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="dmm-form-group">
                <label>Shift</label>
                <input
                  type="text"
                  value={header.shift}
                  onChange={(e) => handleHeaderChange("shift", e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., A, B, C or 1, 2, 3"
                />
              </div>
            </div>
          </div>

          {/* Shift 1 Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">Shift 1 Parameters</h3>
            {shift1Rows.map((row, i) => renderRow(row, i, 1))}
            <button
              type="button"
              onClick={() => addRow(1)}
              className="dmm-add-row-button"
            >
              + Add Another Row
            </button>
          </div>

          {/* Shift 2 Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">Shift 2 Parameters</h3>
            {shift2Rows.map((row, i) => renderRow(row, i, 2))}
            <button
              type="button"
              onClick={() => addRow(2)}
              className="dmm-add-row-button"
            >
              + Add Another Row
            </button>
          </div>

          {/* Shift 3 Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">Shift 3 Parameters</h3>
            {shift3Rows.map((row, i) => renderRow(row, i, 3))}
            <button
              type="button"
              onClick={() => addRow(3)}
              className="dmm-add-row-button"
            >
              + Add Another Row
            </button>
          </div>

        {/* Submit Button */}
        <div className="dmm-submit-container">
          <SubmitButton onClick={handleSubmit}>
            Submit Entry
          </SubmitButton>
        </div>
      </form>
    </>
  );
};

export default DmmSettingParameters;
