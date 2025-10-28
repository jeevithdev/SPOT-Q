import React, { useState } from 'react';
import { Save, Gauge, Thermometer, Hammer, X, Filter } from 'lucide-react';

const NUM_ROWS_HARDNESS = 8;
const NUM_ROWS_TEMP = 8;

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  mainCard: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  header: {
    padding: '1.5rem',
    borderBottom: '4px solid #3b82f6',
    backgroundColor: '#eff6ff',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#3b82f6',
    margin: '0',
  },
  headerSubtitle: { fontSize: '1.1rem', color: '#555', marginTop: '0.5rem' },
  section: { padding: '1.5rem', borderBottom: '1px solid #ddd' },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#3b82f6',
    borderBottom: '2px solid #ccc',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  tableWrapper: { overflowX: 'auto', marginBottom: '1rem', width: '100%' },
  tableBase: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
  tableHeadCell: {
    backgroundColor: '#cfe2ff',
    color: '#1e40af',
    padding: '0.6rem',
    textAlign: 'center',
    fontWeight: 600,
    border: '1px solid #aaa',
  },
  tableBodyCell: {
    padding: '0px',
    textAlign: 'center',
    border: '1px solid #eee',
    fontSize: '0.875rem',
    color: '#333',
  },
  tableInput: {
    width: '100%',
    padding: '0.5rem',
    border: 'none',
    outline: 'none',
    fontSize: '0.875rem',
    textAlign: 'center',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  inputLabel: {
    fontWeight: 600,
    color: '#1a202c',
    minWidth: '120px',
    textAlign: 'right',
    fontSize: '0.9rem',
  },
  inputBase: {
    padding: '0.3rem 0.6rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem',
    outline: 'none',
    width: '150px',
    backgroundColor: 'white',
  },
  textAreaBase: {
    flexGrow: 1,
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem',
    outline: 'none',
    minHeight: '120px',
    maxHeight: '200px',
    resize: 'vertical',
  },
  splitSectionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    padding: '1.5rem',
    borderBottom: '1px solid #ddd',
  },
  buttonGroup: {
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    borderTop: '1px solid #ddd',
  },
  baseButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  submitButton: { backgroundColor: '#3b82f6', color: 'white' },
};

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
    style={styles.tableInput}
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
    <div style={styles.tableWrapper}>
      <table style={styles.tableBase}>
        <thead>
          <tr>
            <th style={styles.tableHeadCell}>SNO</th>
            <th style={styles.tableHeadCell}>Component Name</th>
            <th style={styles.tableHeadCell}>Mould Penetrant PP</th>
            <th style={styles.tableHeadCell}>Mould Penetrant SP</th>
            <th style={styles.tableHeadCell}>B-Scale PP</th>
            <th style={styles.tableHeadCell}>B-Scale SP</th>
            <th style={styles.tableHeadCell}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {formData.mouldHardnessTable.map((row, index) => (
            <tr key={index}>
              <td
                style={{
                  ...styles.tableBodyCell,
                  color: '#808080',
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </td>
              <td style={styles.tableBodyCell}>
                <TableInput
                  value={row.componentName}
                  onChange={(e) =>
                    handleHardnessChange(index, 'componentName', e.target.value)
                  }
                />
              </td>
              <td style={styles.tableBodyCell}>
                <TableInput
                  value={row.mouldPenetrantPP}
                  onChange={(e) =>
                    handleHardnessChange(index, 'mouldPenetrantPP', e.target.value)
                  }
                />
              </td>
              <td style={styles.tableBodyCell}>
                <TableInput
                  value={row.mouldPenetrantSP}
                  onChange={(e) =>
                    handleHardnessChange(index, 'mouldPenetrantSP', e.target.value)
                  }
                />
              </td>
              <td style={styles.tableBodyCell}>
                <TableInput
                  value={row.bScalePP}
                  onChange={(e) =>
                    handleHardnessChange(index, 'bScalePP', e.target.value)
                  }
                />
              </td>
              <td style={styles.tableBodyCell}>
                <TableInput
                  value={row.bScaleSP}
                  onChange={(e) =>
                    handleHardnessChange(index, 'bScaleSP', e.target.value)
                  }
                />
              </td>
              <td style={styles.tableBodyCell}>
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
            <td style={{ textAlign: 'center', padding: '0.6rem' }}>
              <button
                type="button"
                onClick={addHardnessRow}
                style={{
                  backgroundColor: '#808080',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  lineHeight: '28px',
                  textAlign: 'center',
                }}
              >
                +
              </button>
            </td>
            <td colSpan="6"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderPatternTemperatureTable = () => (
    <div style={styles.tableWrapper}>
      <table style={styles.tableBase}>
        <thead>
          <tr>
            <th style={styles.tableHeadCell}>SNO</th>
            <th style={styles.tableHeadCell}>Items</th>
            <th style={styles.tableHeadCell}>PP</th>
            <th style={styles.tableHeadCell}>SP</th>
          </tr>
        </thead>
        <tbody>
          {formData.patternTempTable.map((row, index) => (
            <tr key={index}>
              <td
                style={{
                  ...styles.tableBodyCell,
                  color: '#808080',
                  fontWeight: 'bold',
                }}
              >
                {row.sno}
              </td>
              <td style={styles.tableBodyCell}>
                <TableInput
                  value={row.items}
                  onChange={(e) =>
                    handlePatternTempChange(index, 'items', e.target.value)
                  }
                />
              </td>
              <td style={styles.tableBodyCell}>
                <TableInput
                  value={row.pp}
                  onChange={(e) =>
                    handlePatternTempChange(index, 'pp', e.target.value)
                  }
                />
              </td>
              <td style={styles.tableBodyCell}>
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
            <td style={{ textAlign: 'center', padding: '0.6rem' }}>
              <button
                type="button"
                onClick={addPatternTempRow}
                style={{
                  backgroundColor: '#808080',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  lineHeight: '28px',
                  textAlign: 'center',
                }}
              >
                +
              </button>
            </td>
            <td colSpan="3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainCard}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            MOULD HARDNESS AND PATTERN TEMPERATURE RECORD
          </h1>
          <p style={styles.headerSubtitle}>PRODUCTION REPORT</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Gauge size={20} /> Mould Hardness
            </h2>
            {renderMouldHardnessTable()}
          </div>

          <div style={styles.splitSectionGrid}>
            <div>
              <h2 style={{ ...styles.sectionTitle, color: '#d97706' }}>
                Significant Event
              </h2>
              <textarea
                value={formData.significantEvent}
                onChange={(e) => handleMainChange('significantEvent', e.target.value)}
                style={styles.textAreaBase}
                placeholder="Enter significant events here..."
              />
            </div>
            <div>
              <h2 style={{ ...styles.sectionTitle, color: '#059669' }}>
                <Thermometer size={20} /> Pattern Temp. in C°
              </h2>
              {renderPatternTemperatureTable()}
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Hammer size={20} /> Maintenance:
            </h2>
            <textarea
              value={formData.maintenance}
              onChange={(e) => handleMainChange('maintenance', e.target.value)}
              style={styles.textAreaBase}
              placeholder="Enter maintenance notes here..."
            />
          </div>

          <div
            style={{
              ...styles.section,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              borderBottom: 'none',
            }}
          >
            <div style={styles.inputGroup}>
              <span style={styles.inputLabel}>Supervisor Name:</span>
              <input
                type="text"
                value={formData.supervisorName}
                onChange={(e) => handleMainChange('supervisorName', e.target.value)}
                style={{ ...styles.inputBase, width: '200px' }}
              />
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.inputLabel}>Sign:</span>
              <input
                type="text"
                value={formData.supervisorSign}
                onChange={(e) => handleMainChange('supervisorSign', e.target.value)}
                style={{ ...styles.inputBase, width: '200px' }}
              />
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleReset}
              style={{ ...styles.baseButton, backgroundColor: '#333', color: 'white' }}
            >
              <X size={18} /> Reset Form
            </button>
            <button
              type="submit"
              style={{ ...styles.baseButton, ...styles.submitButton }}
            >
              <Save size={20} /> Save Record
            </button>
          </div>
        </form>

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
            <Filter size={20} style={{ color: '#FF7F50' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              Mould Hardness & Pattern Temperature - Records
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
              <Filter size={18} />
              Filter
            </button>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '700px' }}>
              <thead style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white' }}>
                <tr>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Shift</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Part Name</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Avg Hardness</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left' }}>Avg Temp</th>
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
    </div>
  );
};

export default MouldHardnessRecord;