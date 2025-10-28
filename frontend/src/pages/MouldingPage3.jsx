import React, { useState } from "react";

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
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: #f9fafb;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .container {
          max-width: 1400px;
          margin: 20px auto;
          background: white;
          border-radius: 8px;
          padding: 24px 32px 40px;
          box-shadow: 0 4px 14px rgb(0 0 0 / 0.1);
        }

        h1 {
          margin-bottom: 16px;
          font-weight: 700;
          font-size: 24px;
          color: #0a2540;
          border-bottom: 3px solid #007bff;
          padding-bottom: 6px;
        }

        .header-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px 24px;
          margin-bottom: 36px;
          padding-bottom: 16px;
          border-bottom: 2px solid #ddd;
        }

        .header-field {
          display: flex;
          flex-direction: column;
        }
        .header-field label {
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 4px;
          color: #555;
          user-select: none;
        }
        .header-field input {
          padding: 8px 12px;
          font-size: 14px;
          border: 1.8px solid #ccc;
          border-radius: 4px;
          transition: border-color 0.25s ease;
        }
        .header-field input:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        .parameter-row-container {
          margin-bottom: 32px;
          padding: 20px;
          background: #f7faff;
          border-radius: 8px;
          border: 1px solid #d0e2ff;
        }
        
        .parameter-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 16px 12px;
        }
        
        .parameter-field {
          display: flex;
          flex-direction: column;
        }
        
        .parameter-field label {
          font-size: 11px;
          font-weight: 600;
          color: #0a2540;
          margin-bottom: 6px;
          user-select: none;
          min-height: 32px;
          display: flex;
          align-items: center;
        }

        input[type="text"], input[type="number"], input[type="date"] {
          width: 100%;
          font-size: 13px;
          padding: 6px 8px;
          border: 1.6px solid #bbb;
          border-radius: 4px;
          font-family: inherit;
          transition: border-color 0.25s ease;
          min-width: 0;
        }
        input[type="text"]:focus, input[type="number"]:focus, input[type="date"]:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
        }

        .shift-container {
          margin-bottom: 48px;
          border: 1.5px solid #007bff;
          border-radius: 8px;
          padding: 16px;
          background: #f0f7ff;
        }
        .shift-header {
          font-size: 16px;
          font-weight: 700;
          color: #007bff;
          margin-bottom: 12px;
          user-select: none;
        }
        .add-row-button {
          display: inline-block;
          margin-top: 12px;
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          box-shadow: 0 2px 7px rgb(0 123 255 / 0.7);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }
        .add-row-button:hover {
          background-color: #0056b3;
          box-shadow: 0 3px 11px rgb(0 86 179 / 0.9);
        }

        @media (max-width: 1200px) {
          .parameter-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        @media (max-width: 900px) {
          .parameter-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 720px) {
          .header-form {
            grid-template-columns: 1fr 1fr;
          }
          .parameter-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .shift-header {
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          .parameter-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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
          <button
            type="button"
            onClick={() => addRow(1)}
            className="add-row-button"
            aria-label="Add row to shift 1"
          >
            Add Row to Shift 1
          </button>
        </section>

        <section className="shift-container" aria-label="Shift 2 Parameters">
          <div className="shift-header">Shift 2</div>
          <div role="region" aria-labelledby="shift2-label">
            {shift2Rows.map((row, i) => renderRow(row, i, 2))}
          </div>
          <button
            type="button"
            onClick={() => addRow(2)}
            className="add-row-button"
            aria-label="Add row to shift 2"
          >
            Add Row to Shift 2
          </button>
        </section>

        <section className="shift-container" aria-label="Shift 3 Parameters">
          <div className="shift-header">Shift 3</div>
          <div role="region" aria-labelledby="shift3-label">
            {shift3Rows.map((row, i) => renderRow(row, i, 3))}
          </div>
          <button
            type="button"
            onClick={() => addRow(3)}
            className="add-row-button"
            aria-label="Add row to shift 3"
          >
            Add Row to Shift 3
          </button>
        </section>

        {/* Report Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '2rem',
          marginTop: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              📊 DMM Setting Parameters - Records
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Start Date
              </label>
              <input type="date" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '2px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                End Date
              </label>
              <input type="date" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '2px solid #cbd5e1' }} />
            </div>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.5rem',
              background: 'linear-gradient(135deg, #FF7F50 0%, #FF6A3D 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              alignSelf: 'end'
            }}>
              🔍 Filter
            </button>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '800px' }}>
              <thead style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white' }}>
                <tr>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Model</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Machine No</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Total Entries</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#94a3b8',
                    fontStyle: 'italic'
                  }}>
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