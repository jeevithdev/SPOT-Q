import React, { useState } from "react";
import Button from '../Components/Buttons';
import '../styles/PageStyles/MoultingPage3.css';

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

const DmmSettingParametersCheckSheet = () => {
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

  const handleKeyPress = (e, currentField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form || e.target.closest('.container');
      const inputs = Array.from(form.querySelectorAll('input:not([type="button"])'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const renderRow = (row, index, shift) => (
    <div key={index} className="parameter-row-container">
      <div className="parameter-grid">
        <div className="parameter-field">
          <label>Customer</label>
          <input
            type="text"
            value={row.customer}
            onChange={(e) => handleInputChange(shift, index, "customer", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., ABC Industries"
            aria-label="Customer"
          />
        </div>
        <div className="parameter-field">
          <label>Item Description</label>
          <input
            type="text"
            value={row.itemDescription}
            onChange={(e) => handleInputChange(shift, index, "itemDescription", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Engine Block Casting"
            aria-label="Item Description"
          />
        </div>
        <div className="parameter-field">
          <label>Time</label>
          <input
            type="text"
            value={row.time}
            onChange={(e) => handleInputChange(shift, index, "time", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 08:30 AM"
            aria-label="Time"
          />
        </div>
        <div className="parameter-field">
          <label>PP Thickness (mm)</label>
          <input
            type="number"
            value={row.ppThickness}
            onChange={(e) => handleInputChange(shift, index, "ppThickness", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 25.5"
            step="any"
            aria-label="PP Thickness (mm)"
          />
        </div>
        <div className="parameter-field">
          <label>PP Height (mm)</label>
          <input
            type="number"
            value={row.ppHeight}
            onChange={(e) => handleInputChange(shift, index, "ppHeight", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 150.0"
            step="any"
            aria-label="PP Height (mm)"
          />
        </div>
        <div className="parameter-field">
          <label>SP Thickness (mm)</label>
          <input
            type="number"
            value={row.spThickness}
            onChange={(e) => handleInputChange(shift, index, "spThickness", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 30.2"
            step="any"
            aria-label="SP Thickness (mm)"
          />
        </div>
        <div className="parameter-field">
          <label>SP Height (mm)</label>
          <input
            type="number"
            value={row.spHeight}
            onChange={(e) => handleInputChange(shift, index, "spHeight", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 180.5"
            step="any"
            aria-label="SP Height (mm)"
          />
        </div>
        <div className="parameter-field">
          <label>SP Core Mask Thickness (mm)</label>
          <input
            type="number"
            value={row.spCoreMaskThickness}
            onChange={(e) => handleInputChange(shift, index, "spCoreMaskThickness", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 12.0"
            step="any"
            aria-label="SP Core Mask Thickness (mm)"
          />
        </div>
        <div className="parameter-field">
          <label>SP Core Mask Height (mm)</label>
          <input
            type="number"
            value={row.spCoreMaskHeight}
            onChange={(e) => handleInputChange(shift, index, "spCoreMaskHeight", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 95.5"
            step="any"
            aria-label="SP Core Mask Height (mm)"
          />
        </div>
        <div className="parameter-field">
          <label>PP Core Mask Thickness (mm)</label>
          <input
            type="number"
            value={row.ppCoreMaskThickness}
            onChange={(e) => handleInputChange(shift, index, "ppCoreMaskThickness", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 10.5"
            step="any"
            aria-label="PP Core Mask Thickness (mm)"
          />
        </div>
        <div className="parameter-field">
          <label>PP Core Mask Height (mm)</label>
          <input
            type="number"
            value={row.ppCoreMaskHeight}
            onChange={(e) => handleInputChange(shift, index, "ppCoreMaskHeight", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 85.0"
            step="any"
            aria-label="PP Core Mask Height (mm)"
          />
        </div>
        <div className="parameter-field">
          <label>Sand Shot Pressure (Bar)</label>
          <input
            type="number"
            value={row.sandShotPressureBar}
            onChange={(e) => handleInputChange(shift, index, "sandShotPressureBar", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 6.5"
            step="any"
            aria-label="Sand Shot Pressure (Bar)"
          />
        </div>
        <div className="parameter-field">
          <label>Correction Shot Time (s)</label>
          <input
            type="number"
            value={row.correctionShotTime}
            onChange={(e) => handleInputChange(shift, index, "correctionShotTime", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 2.5"
            step="any"
            aria-label="Correction Shot Time (s)"
          />
        </div>
        <div className="parameter-field">
          <label>Squeeze Pressure (Kg/cm²)</label>
          <input
            type="number"
            value={row.squeezePressure}
            onChange={(e) => handleInputChange(shift, index, "squeezePressure", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 45.0"
            step="any"
            aria-label="Squeeze Pressure (Kg/cm²)"
          />
        </div>
        <div className="parameter-field">
          <label>PP Stripping Acceleration</label>
          <input
            type="number"
            value={row.ppStrippingAcceleration}
            onChange={(e) => handleInputChange(shift, index, "ppStrippingAcceleration", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 3.2"
            step="any"
            aria-label="PP Stripping Acceleration"
          />
        </div>
        <div className="parameter-field">
          <label>PP Stripping Distance</label>
          <input
            type="number"
            value={row.ppStrippingDistance}
            onChange={(e) => handleInputChange(shift, index, "ppStrippingDistance", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 120.0"
            step="any"
            aria-label="PP Stripping Distance"
          />
        </div>
        <div className="parameter-field">
          <label>SP Stripping Acceleration</label>
          <input
            type="number"
            value={row.spStrippingAcceleration}
            onChange={(e) => handleInputChange(shift, index, "spStrippingAcceleration", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 2.8"
            step="any"
            aria-label="SP Stripping Acceleration"
          />
        </div>
        <div className="parameter-field">
          <label>SP Stripping Distance</label>
          <input
            type="number"
            value={row.spStrippingDistance}
            onChange={(e) => handleInputChange(shift, index, "spStrippingDistance", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 140.0"
            step="any"
            aria-label="SP Stripping Distance"
          />
        </div>
        <div className="parameter-field">
          <label>Mould Thickness ±10mm</label>
          <input
            type="number"
            value={row.mouldThicknessPlus10}
            onChange={(e) => handleInputChange(shift, index, "mouldThicknessPlus10", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 250.0"
            step="any"
            aria-label="Mould Thickness ±10mm"
          />
        </div>
        <div className="parameter-field">
          <label>Close Up Force / Mould Close Up Pressure</label>
          <input
            type="text"
            value={row.closeUpForceMouldCloseUpPressure}
            onChange={(e) => handleInputChange(shift, index, "closeUpForceMouldCloseUpPressure", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 800 kN / 55 bar"
            aria-label="Close Up Force / Mould Close Up Pressure"
          />
        </div>
        <div className="parameter-field">
          <label>Remarks</label>
          <input
            type="text"
            value={row.remarks}
            onChange={(e) => handleInputChange(shift, index, "remarks", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., All parameters OK"
            aria-label="Remarks"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>

      <div className="container" role="main" aria-label="DMM Setting Parameters Check Sheet">
        <h1>DMM Setting Parameters Check Sheet</h1>

        <section className="header-form" aria-label="Form Header Information">
          <div className="header-field">
            <label htmlFor="customer">Customer</label>
            <input
              id="customer"
              type="text"
              value={header.customer}
              onChange={(e) => handleHeaderChange("customer", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., ABC Industries"
            />
          </div>
          <div className="header-field">
            <label htmlFor="model">Model</label>
            <input
              id="model"
              type="text"
              value={header.model}
              onChange={(e) => handleHeaderChange("model", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., XZ-2000"
            />
          </div>
          <div className="header-field">
            <label htmlFor="mcNo">M/C No.</label>
            <input
              id="mcNo"
              type="text"
              value={header.mcNo}
              onChange={(e) => handleHeaderChange("mcNo", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., MC-001"
            />
          </div>
          <div className="header-field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={header.date}
              onChange={(e) => handleHeaderChange("date", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Select date"
            />
          </div>
          <div className="header-field">
            <label htmlFor="checker">Checker</label>
            <input
              id="checker"
              type="text"
              value={header.checker}
              onChange={(e) => handleHeaderChange("checker", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., John Doe"
            />
          </div>
          <div className="header-field">
            <label htmlFor="shift">Shift</label>
            <input
              id="shift"
              type="text"
              value={header.shift}
              onChange={(e) => handleHeaderChange("shift", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., A, B, C or 1, 2, 3"
            />
          </div>
        </section>

        <section className="shift-container" aria-label="Shift 1 Parameters">
          <div className="shift-header">Shift 1</div>
          <div role="region" aria-labelledby="shift1-label">
            {shift1Rows.map((row, i) => renderRow(row, i, 1))}
          </div>
          <Button
            type="button"
            onClick={() => addRow(1)}
            className="add-row-button"
            aria-label="Add row to shift 1"
          >
            Add Row to Shift 1
          </Button>
        </section>

        <section className="shift-container" aria-label="Shift 2 Parameters">
          <div className="shift-header">Shift 2</div>
          <div role="region" aria-labelledby="shift2-label">
            {shift2Rows.map((row, i) => renderRow(row, i, 2))}
          </div>
          <Button
            type="button"
            onClick={() => addRow(2)}
            className="add-row-button"
            aria-label="Add row to shift 2"
          >
            Add Row to Shift 2
          </Button>
        </section>

        <section className="shift-container" aria-label="Shift 3 Parameters">
          <div className="shift-header">Shift 3</div>
          <div role="region" aria-labelledby="shift3-label">
            {shift3Rows.map((row, i) => renderRow(row, i, 3))}
          </div>
          <Button
            type="button"
            onClick={() => addRow(3)}
            className="add-row-button"
            aria-label="Add row to shift 3"
          >
            Add Row to Shift 3
          </Button>
        </section>

        {/* Report Section */}
        <div className="moulting-report-container">
          <div className="moulting-report-header">
            <h3 className="moulting-report-title">📊 DMM Setting Parameters - Records</h3>
          </div>

          <div className="moulting-report-filter-grid">
            <div>
              <label className="moulting-filter-label">Start Date</label>
              <input type="date" className="moulting-filter-input" />
            </div>
            <div>
              <label className="moulting-filter-label">End Date</label>
              <input type="date" className="moulting-filter-input" />
            </div>
            <Button className="moulting-filter-btn">🔍 Filter</Button>
          </div>

          <div className="moulting-table-wrapper table-wrapper">
            <table className="moulting-table">
              <thead>
                <tr>
                  <th className="moulting-table-head">Date</th>
                  <th className="moulting-table-head">Customer</th>
                  <th className="moulting-table-head">Model</th>
                  <th className="moulting-table-head">Machine No</th>
                  <th className="moulting-table-head">Total Entries</th>
                  <th className="moulting-table-head">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="moulting-no-records">
                    No records found. Submit entries above to see them here.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default DmmSettingParametersCheckSheet;