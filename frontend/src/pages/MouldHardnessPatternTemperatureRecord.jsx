import React, { useState } from 'react';
import { Save, Gauge, Thermometer, Hammer, User, X } from 'lucide-react';

const NUM_ROWS_HARDNESS = 8;
const NUM_ROWS_TEMP = 8;     // Number of rows for the Pattern Temperature table

// --- 1. STYLE DEFINITIONS ---
const styles = {
    // General Page & Card Structure
    pageContainer: { minHeight: '100vh', backgroundColor: '#f0f4f8', padding: '2rem', fontFamily: 'Arial, sans-serif' },
    // *** MODIFIED: Increased maxWidth to 1200px for a larger form ***
    mainCard: { maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' },

    // Header Styles
    header: { padding: '1.5rem', borderBottom: '4px solid #3b82f6', backgroundColor: '#eff6ff', textAlign: 'center' },
    headerTitle: { fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0' },
    headerSubtitle: { fontSize: '1.1rem', color: '#555', marginTop: '0.5rem' },
    
    // Section Styles
    section: { padding: '1.5rem', borderBottom: '1px solid #ddd' },
    sectionTitle: { fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6', borderBottom: '2px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    
    // Table Styles
    tableWrapper: { overflowX: 'auto', marginBottom: '1rem', width: '100%' },
    tableBase: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
    tableHeadCell: { backgroundColor: '#cfe2ff', color: '#1e40af', padding: '0.6rem', textAlign: 'center', fontWeight: 600, border: '1px solid #aaa' },
    tableBodyCell: { padding: '0px', textAlign: 'center', border: '1px solid #eee', fontSize: '0.875rem', color: '#333' },
    tableInput: { width: '100%', padding: '0.5rem', border: 'none', outline: 'none', fontSize: '0.875rem', textAlign: 'center', boxSizing: 'border-box', backgroundColor: 'transparent' },
    
    // Input Group Styles (for Supervisor)
    inputGroup: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
    inputLabel: { fontWeight: 600, color: '#1a202c', minWidth: '120px', textAlign: 'right', fontSize: '0.9rem' },
    inputBase: { padding: '0.3rem 0.6rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', width: '150px', boxSizing: 'border-box', backgroundColor: 'white' },
    
    // Textarea style for Significant Event and Maintenance
    textAreaBase: { flexGrow: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', minHeight: '120px', maxHeight: '200px', resize: 'vertical' },

    // Grid Layout for Significant Event and Pattern Temp (Swapped Order)
    splitSectionGrid: { 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1.5rem', 
        padding: '1.5rem', 
        borderBottom: '1px solid #ddd' 
    },
    
    // Button Styles
    buttonGroup: { padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #ddd' },
    baseButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'transform 0.3s ease', transform: 'scale(1)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' },
    submitButton: { backgroundColor: '#3b82f6', color: 'white' },
};

// --- 2. INITIAL STATE & DATA STRUCTURES ---
const initialHardnessRow = { production: '', componentName: '', mouldPenetrantPP: '', mouldPenetrantSP: '', bScalePP: '', bScaleSP: '', remarks: '' };

const InitialState = {
    mouldHardnessTable: Array(NUM_ROWS_HARDNESS).fill(null).map(() => ({ ...initialHardnessRow })),
    // Initialize Pattern Temp with some example item names
    patternTempTable: Array(NUM_ROWS_TEMP).fill(null).map((_, i) => ({ 
        sno: i + 1, 
        items: [][i] || '', 
        pp: '', 
        sp: '' 
    })),
    significantEvent: '', 
    maintenance: '',
    supervisorName: '',
    supervisorSign: '',
};

// --- 3. REUSABLE ATOMIC COMPONENTS ---
const TableInput = ({ value, onChange, tabIndex, type = 'text', readOnly = false }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        style={styles.tableInput}
        tabIndex={tabIndex}
        readOnly={readOnly}
    />
);

// --- 4. MAIN COMPONENT ---
const MouldHardnessPatternTemperatureRecord = () => {
    const [formData, setFormData] = useState(InitialState);

    // --- HANDLERS ---
    const handleHardnessChange = (index, field, value) => {
        const updatedTable = [...formData.mouldHardnessTable];
        updatedTable[index] = { ...updatedTable[index], [field]: value };
        setFormData(prev => ({ ...prev, mouldHardnessTable: updatedTable }));
    };

    const handlePatternTempChange = (index, field, value) => {
        const updatedTable = [...formData.patternTempTable];
        updatedTable[index] = { ...updatedTable[index], [field]: value };
        setFormData(prev => ({ ...prev, patternTempTable: updatedTable }));
    };

    const handleMainChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log('Mould Hardness and Pattern Temperature Record Submitted:', formData);
        alert('Mould Hardness and Pattern Temperature Record Submitted!');
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the entire form?')) {
            setFormData(InitialState);
        }
    };

    // --- RENDER FUNCTIONS ---
    const renderMouldHardnessTable = () => {
        const START_TAB_INDEX = 10;
        const FIELDS_PER_ROW = 7; 

        return (
            <div style={styles.tableWrapper}>
                <table style={styles.tableBase}>
                    <thead>
                        <tr>
                            <th rowSpan="2" style={{ ...styles.tableHeadCell, width: '10%' }}>SNO</th>
                            <th rowSpan="2" style={{ ...styles.tableHeadCell, width: '15%' }}>Component Name</th>
                            <th colSpan="2" style={{ ...styles.tableHeadCell, width: '25%' }}>Mould Penetrant (gm/cm²)</th>
                            <th colSpan="2" style={{ ...styles.tableHeadCell, width: '25%' }}>B-Scale</th>
                            <th rowSpan="2" style={{ ...styles.tableHeadCell, width: '25%' }}>Remarks</th>
                        </tr>
                        <tr>
                            <th style={styles.tableHeadCell}>PP</th>
                            <th style={styles.tableHeadCell}>SP</th>
                            <th style={styles.tableHeadCell}>PP</th>
                            <th style={styles.tableHeadCell}>SP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.mouldHardnessTable.map((row, index) => (
                            <tr key={index}>
                                <td style={{ ...styles.tableBodyCell, padding: '0.5rem' }}>{index + 1}</td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.componentName} onChange={(e) => handleHardnessChange(index, 'componentName', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.mouldPenetrantPP} onChange={(e) => handleHardnessChange(index, 'mouldPenetrantPP', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 1} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.mouldPenetrantSP} onChange={(e) => handleHardnessChange(index, 'mouldPenetrantSP', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 2} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.bScalePP} onChange={(e) => handleHardnessChange(index, 'bScalePP', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 3} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.bScaleSP} onChange={(e) => handleHardnessChange(index, 'bScaleSP', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 4} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.remarks} onChange={(e) => handleHardnessChange(index, 'remarks', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 5} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderPatternTemperatureTable = () => {
        // Tab index for this table is now higher due to the swap.
        // Significant Event is Tab 66. Pattern Temp starts at 70.
        const START_TAB_INDEX = 70;
        const FIELDS_PER_ROW = 3; // items, pp, sp

        return (
            <div style={styles.tableWrapper}>
                <table style={styles.tableBase}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.tableHeadCell, width: '10%' }}>SNO</th>
                            <th style={{ ...styles.tableHeadCell, width: '50%' }}>Items</th>
                            <th style={{ ...styles.tableHeadCell, width: '20%' }}>PP</th>
                            <th style={{ ...styles.tableHeadCell, width: '20%' }}>SP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.patternTempTable.map((row, index) => (
                            <tr key={index}>
                                <td style={{ ...styles.tableBodyCell, padding: '0.5rem' }}>{row.sno}</td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.items} onChange={(e) => handlePatternTempChange(index, 'items', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.pp} onChange={(e) => handlePatternTempChange(index, 'pp', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 1} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.sp} onChange={(e) => handlePatternTempChange(index, 'sp', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 2} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };


    // --- JSX RENDERING ---
    return (
        <div style={styles.pageContainer}>
            <div style={styles.mainCard}>

                {/* --- HEADER --- */}
                <div style={styles.header}>
                    <h1 style={styles.headerTitle}>MOULD HARDNESS AND PATTERN TEMPERATURE RECORD</h1>
                    <p style={styles.headerSubtitle}>PRODUCTION REPORT</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* --- 1. MOULD HARDNESS TABLE (Tab Indices 10-65) --- */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}><Gauge size={20} />Mould Hardness</h2>
                        {renderMouldHardnessTable()}
                    </div>

                    {/* --- 2. GRID FOR SIGNIFICANT EVENT & PATTERN TEMP (SWAPPED) --- */}
                    <div style={styles.splitSectionGrid}>
                        {/* LEFT: SIGNIFICANT EVENT (Tab Index 66) */}
                        <div>
                            <h2 style={{...styles.sectionTitle, color: '#d97706'}}>Significant Event</h2>
                            <textarea
                                value={formData.significantEvent}
                                onChange={(e) => handleMainChange('significantEvent', e.target.value)}
                                style={styles.textAreaBase}
                                tabIndex={66} 
                                placeholder="Enter significant events here..."
                            ></textarea>
                        </div>
                        
                        {/* RIGHT: PATTERN TEMPERATURE TABLE (Tab Indices 70-93) */}
                        <div>
                            <h2 style={{...styles.sectionTitle, color: '#059669'}}><Thermometer size={20} />Pattern Temp. in C°</h2>
                            {renderPatternTemperatureTable()}
                        </div>

                    </div>

                    {/* --- 3. MAINTENANCE (Tab Index 94) --- */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}><Hammer size={20} />Maintenance:</h2>
                        <textarea
                            value={formData.maintenance}
                            onChange={(e) => handleMainChange('maintenance', e.target.value)}
                            style={styles.textAreaBase}
                            tabIndex={94}
                            placeholder="Enter maintenance notes here..."
                        ></textarea>
                    </div>

                    {/* --- 4. SUPERVISOR DETAILS (Tab Indices 95-96) --- */}
                    <div style={{ ...styles.section, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', borderBottom: 'none' }}>
                        <div style={styles.inputGroup}>
                            <span style={styles.inputLabel}>Supervisor Name:</span>
                            <input
                                type="text"
                                value={formData.supervisorName}
                                onChange={(e) => handleMainChange('supervisorName', e.target.value)}
                                style={{ ...styles.inputBase, width: '200px' }}
                                tabIndex={95}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <span style={styles.inputLabel}>Sign:</span>
                            <input
                                type="text"
                                value={formData.supervisorSign}
                                onChange={(e) => handleMainChange('supervisorSign', e.target.value)}
                                style={{ ...styles.inputBase, width: '200px' }}
                                tabIndex={96}
                            />
                        </div>
                    </div>

                    {/* --- SUBMIT BUTTONS (Tab Indices 100/101) --- */}
                    <div style={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={handleReset}
                            style={{ ...styles.baseButton, backgroundColor: '#333', color: 'white' }}
                            tabIndex={100}
                        >
                            <X size={18} />
                            Reset Form
                        </button>
                        <button
                            type="submit" 
                            style={{ ...styles.baseButton, ...styles.submitButton }}
                            tabIndex={101}
                        >
                            <Save size={20} />
                            Save Record
                        </button>
                    </div>
                     {/* Hidden button to ensure smooth Enter-key navigation */}
                    <button type="submit" tabIndex={999} style={{ display: 'none' }} aria-hidden="true"></button>
                </form>
            </div>
        </div>
    );
};

export default MouldHardnessPatternTemperatureRecord;
