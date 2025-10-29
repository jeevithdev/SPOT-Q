import React, { useState } from 'react';
import { Save, Gauge, Thermometer, Hammer, X, Filter } from 'lucide-react';
import { Button } from '../../Components/Buttons';
import '../../styles/PageStyles/MouldHardnessPatternTemperatureRecord.css';

const NUM_ROWS_HARDNESS = 8;
const NUM_ROWS_TEMP = 8;

// Styles are moved to CSS file: mould-hardness-pattern-temperature-record.css

const initialHardnessRow = {
  componentName: '',
  mouldPenetrantPP: '',
  mouldPenetrantSP: '',
  bScalePP: '',
  bScaleSP: '',
  remarks: '',
};

const initialPatternRow = { sno: 1, items: '', pp: '', sp: '' };

const InitialState = {
  mouldHardnessTable: Array(NUM_ROWS_HARDNESS)
    .fill(null)
    .map(() => ({ ...initialHardnessRow })),
  patternTempTable: Array(NUM_ROWS_TEMP)
    .fill(null)
    .map((_, i) => ({ ...initialPatternRow, sno: i + 1 })),
  significantEvent: '',
  maintenance: '',
  supervisorName: '',
  supervisorSign: '',
};

const TableInput = ({ value, onChange, tabIndex, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className="table-input"
    tabIndex={tabIndex}
  />
);

const MouldHardnessRecord = () => {
  const [formData, setFormData] = useState(InitialState);

  const handleHardnessChange = (index, field, value) => {
    const updated = [...formData.mouldHardnessTable];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, mouldHardnessTable: updated }));
  };

  const handlePatternTempChange = (index, field, value) => {
    const updated = [...formData.patternTempTable];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, patternTempTable: updated }));
  };

  const handleMainChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addHardnessRow = () => {
    setFormData((prev) => ({
      ...prev,
      mouldHardnessTable: [...prev.mouldHardnessTable, { ...initialHardnessRow }],
    }));
  };

  const addPatternTempRow = () => {
    setFormData((prev) => ({
      ...prev,
      patternTempTable: [
        ...prev.patternTempTable,
        { ...initialPatternRow, sno: prev.patternTempTable.length + 1 },
      ],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mould Hardness Record Submitted!');
  };

  const handleReset = () => {
    if (window.confirm('Reset all fields?')) setFormData(InitialState);
  };

  // ---------- TABLE RENDERING ----------
  const renderMouldHardnessTable = () => (
    <div className="table-wrapper">
      <table className="table-base">
        <thead>
          <tr>
            <th className="table-head-cell">SNO</th>
            <th className="table-head-cell">Component Name</th>
            <th className="table-head-cell">Mould Penetrant PP</th>
            <th className="table-head-cell">Mould Penetrant SP</th>
            <th className="table-head-cell">B-Scale PP</th>
            <th className="table-head-cell">B-Scale SP</th>
            <th className="table-head-cell">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {formData.mouldHardnessTable.map((row, index) => (
            <tr key={index}>
<<<<<<< Updated upstream
              <td className="table-body-cell" style={{ color: '#808080', fontWeight: 'bold' }}>
=======
              <td className="table-body-cell table-body-cell--muted">
>>>>>>> Stashed changes
                {index + 1}
              </td>
              <td className="table-body-cell">
                <TableInput
                  value={row.componentName}
                  onChange={(e) =>
                    handleHardnessChange(index, 'componentName', e.target.value)
                  }
                />
              </td>
              <td className="table-body-cell">
                <TableInput
                  value={row.mouldPenetrantPP}
                  onChange={(e) =>
                    handleHardnessChange(index, 'mouldPenetrantPP', e.target.value)
                  }
                />
              </td>
              <td className="table-body-cell">
                <TableInput
                  value={row.mouldPenetrantSP}
                  onChange={(e) =>
                    handleHardnessChange(index, 'mouldPenetrantSP', e.target.value)
                  }
                />
              </td>
              <td className="table-body-cell">
                <TableInput
                  value={row.bScalePP}
                  onChange={(e) =>
                    handleHardnessChange(index, 'bScalePP', e.target.value)
                  }
                />
              </td>
              <td className="table-body-cell">
                <TableInput
                  value={row.bScaleSP}
                  onChange={(e) =>
                    handleHardnessChange(index, 'bScaleSP', e.target.value)
                  }
                />
              </td>
              <td className="table-body-cell">
                <TableInput
                  value={row.remarks}
                  onChange={(e) =>
                    handleHardnessChange(index, 'remarks', e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
          {/* Add Row aligned under SNO */}
          <tr>
            <td className="add-row-cell">
              <Button
                type="button"
                onClick={addHardnessRow}
                className="add-circle-btn"
              >
                +
              </Button>
            </td>
            <td colSpan="6"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderPatternTemperatureTable = () => (
    <div className="table-wrapper">
      <table className="table-base">
        <thead>
          <tr>
            <th className="table-head-cell">SNO</th>
            <th className="table-head-cell">Items</th>
            <th className="table-head-cell">PP</th>
            <th className="table-head-cell">SP</th>
          </tr>
        </thead>
        <tbody>
          {formData.patternTempTable.map((row, index) => (
            <tr key={index}>
<<<<<<< Updated upstream
              <td className="table-body-cell" style={{ color: '#808080', fontWeight: 'bold' }}>
=======
              <td className="table-body-cell table-body-cell--muted">
>>>>>>> Stashed changes
                {row.sno}
              </td>
              <td className="table-body-cell">
                <TableInput
                  value={row.items}
                  onChange={(e) =>
                    handlePatternTempChange(index, 'items', e.target.value)
                  }
                />
              </td>
              <td className="table-body-cell">
                <TableInput
                  value={row.pp}
                  onChange={(e) =>
                    handlePatternTempChange(index, 'pp', e.target.value)
                  }
                />
              </td>
              <td className="table-body-cell">
                <TableInput
                  value={row.sp}
                  onChange={(e) =>
                    handlePatternTempChange(index, 'sp', e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
          {/* Add Row aligned under SNO */}
          <tr>
            <td className="add-row-cell">
              <Button
                type="button"
                onClick={addPatternTempRow}
                className="add-circle-btn"
              >
                +
              </Button>
            </td>
            <td colSpan="3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="page-container container">
      <div className="main-card">
        <div className="header">
          <h1 className="header-title">MOULD HARDNESS AND PATTERN TEMPERATURE RECORD</h1>
          <p className="header-subtitle">PRODUCTION REPORT</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h2 className="section-title">
              <Gauge size={20} /> Mould Hardness
            </h2>
            {renderMouldHardnessTable()}
          </div>

          <div className="split-section-grid">
            <div>
              <h2 className="section-title" style={{ color: '#d97706' }}>
                Significant Event
              </h2>
              <textarea
                value={formData.significantEvent}
                onChange={(e) => handleMainChange('significantEvent', e.target.value)}
                className="textarea-base"
                placeholder="Enter significant events here..."
              />
            </div>
            <div>
              <h2 className="section-title" style={{ color: '#059669' }}>
                <Thermometer size={20} /> Pattern Temp. in C°
              </h2>
              {renderPatternTemperatureTable()}
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <Hammer size={20} /> Maintenance:
            </h2>
            <textarea
              value={formData.maintenance}
              onChange={(e) => handleMainChange('maintenance', e.target.value)}
              className="textarea-base"
              placeholder="Enter maintenance notes here..."
            />
          </div>

          <div className="section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', borderBottom: 'none' }}>
            <div className="input-group">
              <span className="input-label">Supervisor Name:</span>
              <input
                type="text"
                value={formData.supervisorName}
                onChange={(e) => handleMainChange('supervisorName', e.target.value)}
                className="input-base"
                style={{ width: '200px' }}
              />
            </div>
            <div className="input-group">
              <span className="input-label">Sign:</span>
              <input
                type="text"
                value={formData.supervisorSign}
                onChange={(e) => handleMainChange('supervisorSign', e.target.value)}
                className="input-base"
                style={{ width: '200px' }}
              />
            </div>
          </div>

          <div className="button-group">
            <Button type="button" onClick={handleReset} className="add-reset" style={{ backgroundColor: '#333', color: 'white' }}>
              <X size={18} /> Reset Form
            </Button>
            <Button type="submit" className="submit-button base-button">
              <Save size={20} /> Save Record
            </Button>
          </div>
        </form>

        {/* Report Section */}
        <div className="report-container">
          <div className="report-header">
            <Filter size={20} className="filter-icon" />
            <h3 className="report-title">
              Mould Hardness & Pattern Temperature - Records
            </h3>
          </div>

          <div className="report-filter-grid">
            <div>
              <label className="filter-label">
                Start Date
              </label>
              <input type="date" className="filter-input" />
            </div>
            <div>
              <label className="filter-label">
                End Date
              </label>
              <input type="date" className="filter-input" />
            </div>
            <Button className="filter-button">
              <Filter size={18} />
              Filter
            </Button>
          </div>

          <div className="report-table-wrapper">
            <table className="report-table">
              <thead className="report-table-head">
                <tr>
                  <th className="report-table-head-cell">Date</th>
                  <th className="report-table-head-cell">Shift</th>
                  <th className="report-table-head-cell">Part Name</th>
                  <th className="report-table-head-cell">Avg Hardness</th>
                  <th className="report-table-head-cell">Avg Temp</th>
                  <th className="report-table-head-cell">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="no-records">
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

export default MouldHardnessRecord;