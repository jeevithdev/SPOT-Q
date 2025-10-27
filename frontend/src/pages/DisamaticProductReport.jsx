import React, { useState } from 'react';
import { Save, Users, Factory, Clock, Zap, X } from 'lucide-react';

// Define the number of rows needed
const NUM_ROWS = 20;

// --- 1. SIMPLIFIED STYLE DEFINITIONS ---
const styles = {
    // General Page & Card Structure
    pageContainer: { minHeight: '100vh', backgroundColor: '#f0f4f8', padding: '2rem', fontFamily: 'Arial, sans-serif' },
    mainCard: { maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' },

    // Header Styles
    header: { padding: '1rem 1.5rem', borderBottom: '4px solid #0056b3', backgroundColor: '#e6f2ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
    titleContainer: { textAlign: 'center', flexGrow: 1 },
    headerTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: '#0056b3', margin: '0 0 0.25rem 0' },
    headerSubtitle: { fontSize: '1.2rem', fontWeight: 'bold', color: '#333' },
    
    // Input Fields
    inputGroup: { display: 'grid', gridTemplateColumns: 'auto auto', gap: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#333' },
    inputLabel: { fontWeight: 600, color: '#1a202c', textAlign: 'right' },
    inputBase: { padding: '0.3rem 0.6rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem', outline: 'none', width: '120px', boxSizing: 'border-box', backgroundColor: 'white' },

    // Section Styles
    section: { padding: '1.5rem', borderBottom: '1px solid #ddd' },
    sectionTitle: { fontSize: '1.2rem', fontWeight: 'bold', color: '#333', borderBottom: '2px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    
    // Table Styles
    tableWrapper: { overflowX: 'auto', marginBottom: '1rem', maxHeight: '400px', overflowY: 'auto' }, // Added max height for scrollable tables
    tableBase: { width: '100%', borderCollapse: 'collapse', minWidth: '700px' },
    tableHeadCell: { backgroundColor: '#cce5ff', color: '#0056b3', padding: '0.6rem', textAlign: 'center', fontWeight: 600, border: '1px solid #aaa', position: 'sticky', top: 0, zIndex: 1, }, // Sticky header for scrolling
    tableBodyCell: { padding: '0px', textAlign: 'center', border: '1px solid #eee', fontSize: '0.875rem', color: '#333' },
    tableInput: { width: '100%', padding: '0.5rem', border: 'none', outline: 'none', fontSize: '0.875rem', textAlign: 'center', boxSizing: 'border-box', backgroundColor: 'transparent' },
    
    // Utility
    memberList: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '0.5rem' },
    prodInfo: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem 2rem', marginBottom: '1rem' },

    // Button Styles
    buttonGroup: { marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1.5rem' },
    baseButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'transform 0.3s ease', transform: 'scale(1)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' },
    submitButton: { backgroundColor: '#0056b3', color: 'white' },
};

// --- 2. INITIAL STATE & DATA STRUCTURES ---
const initialProductionRow = { counterNo: '', componentName: '', produced: '', poured: '', cycleTime: '', mouldsPerHour: '', remarks: '' };
const initialPlanRow = { componentName: '', plannedMoulds: '', remarks: '' };
const initialDelayRow = { delays: '', durationMinutes: '', durationTime: '' };

const InitialState = {
    date: new Date().toISOString().split('T')[0],
    shift: '',
    incharge: '',
    members: ['', '', '', ''],
    production: '',
    ppOperator: '',
    // --- EXTENDED TABLES TO NUM_ROWS (20) ---
    productionTable: Array(NUM_ROWS).fill(null).map(() => ({ ...initialProductionRow })),
    nextShiftPlan: Array(NUM_ROWS).fill(null).map(() => ({ ...initialPlanRow })),
    delaysTable: Array(NUM_ROWS).fill(null).map((_, i) => ({ ...initialDelayRow, sno: i + 1 })),
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
const DisamaticProductReport = () => {
    const [formData, setFormData] = useState(InitialState);

    // --- HANDLERS ---
    const handleMainChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleArrayChange = (arrayName, index, field, value) => {
        const updatedArray = [...formData[arrayName]];
        if (arrayName === 'members') {
            updatedArray[index] = value;
        } else {
            updatedArray[index] = { ...updatedArray[index], [field]: value };
        }
        setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log('Disamatic Product Report Data Submitted:', formData);
        alert('Disamatic Product Report Submitted!');
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the entire form?')) {
            setFormData(InitialState);
        }
    };


    // --- RENDER FUNCTIONS ---

    const renderProductionTable = () => {
        // Tab index calculation: Starts at 10. Each row has 7 fields. (10 + index * 7)
        const START_TAB_INDEX = 10;
        const FIELDS_PER_ROW = 7;
        
        return (
            <div style={styles.tableWrapper}>
                <table style={styles.tableBase}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.tableHeadCell, width: '10%' }}>Mould Counter No.</th>
                            <th style={{ ...styles.tableHeadCell, width: '25%' }}>Component Name</th>
                            <th style={{ ...styles.tableHeadCell, width: '10%' }}>Produced</th>
                            <th style={{ ...styles.tableHeadCell, width: '10%' }}>Poured</th>
                            <th style={{ ...styles.tableHeadCell, width: '15%' }}>Cycle Time</th>
                            <th style={{ ...styles.tableHeadCell, width: '15%' }}>Moulds per hour</th>
                            <th style={{ ...styles.tableHeadCell, width: '15%' }}>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.productionTable.map((row, index) => (
                            <tr key={index}>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.counterNo} onChange={(e) => handleArrayChange('productionTable', index, 'counterNo', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.componentName} onChange={(e) => handleArrayChange('productionTable', index, 'componentName', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 1} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.produced} onChange={(e) => handleArrayChange('productionTable', index, 'produced', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 2} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.poured} onChange={(e) => handleArrayChange('productionTable', index, 'poured', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 3} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.cycleTime} onChange={(e) => handleArrayChange('productionTable', index, 'cycleTime', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 4} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.mouldsPerHour} onChange={(e) => handleArrayChange('productionTable', index, 'mouldsPerHour', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 5} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.remarks} onChange={(e) => handleArrayChange('productionTable', index, 'remarks', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 6} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderShiftPlanTable = () => {
        // Tab index calculation: Starts after the Production table ends. 10 + 20*7 = 150. Use 150 as the start.
        const START_TAB_INDEX = 150;
        const FIELDS_PER_ROW = 3;
        
        return (
            <div style={styles.tableWrapper}>
                <table style={styles.tableBase}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.tableHeadCell, width: '10%' }}>S.No</th>
                            <th style={{ ...styles.tableHeadCell, width: '35%' }}>Component Name</th>
                            <th style={{ ...styles.tableHeadCell, width: '30%' }}>Planned Moulds</th>
                            <th style={{ ...styles.tableHeadCell, width: '25%' }}>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.nextShiftPlan.map((row, index) => (
                            <tr key={index}>
                                <td style={{ ...styles.tableBodyCell, padding: '0.5rem' }}>{index + 1}</td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.componentName} onChange={(e) => handleArrayChange('nextShiftPlan', index, 'componentName', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.plannedMoulds} onChange={(e) => handleArrayChange('nextShiftPlan', index, 'plannedMoulds', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 1} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.remarks} onChange={(e) => handleArrayChange('nextShiftPlan', index, 'remarks', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 2} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderDelaysTable = () => {
        // Tab index calculation: Starts after the Shift Plan table ends. 150 + 20*3 = 210. Use 210 as the start.
        const START_TAB_INDEX = 210;
        const FIELDS_PER_ROW = 3;

        return (
            <div style={styles.tableWrapper}>
                <table style={styles.tableBase}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.tableHeadCell, width: '10%' }}>S.No</th>
                            <th style={{ ...styles.tableHeadCell, width: '30%' }}>Delays</th>
                            <th style={{ ...styles.tableHeadCell, width: '30%' }}>Duration in Minutes</th>
                            <th style={{ ...styles.tableHeadCell, width: '30%' }}>Duration in Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.delaysTable.map((row, index) => (
                            <tr key={index}>
                                <td style={{ ...styles.tableBodyCell, padding: '0.5rem' }}>{row.sno}</td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.delays} onChange={(e) => handleArrayChange('delaysTable', index, 'delays', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.durationMinutes} onChange={(e) => handleArrayChange('delaysTable', index, 'durationMinutes', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 1} />
                                </td>
                                <td style={styles.tableBodyCell}>
                                    <TableInput value={row.durationTime} onChange={(e) => handleArrayChange('delaysTable', index, 'durationTime', e.target.value)} tabIndex={START_TAB_INDEX + index * FIELDS_PER_ROW + 2} />
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

                    {/* --- 1. MEMBERS PRESENT (Tab Indices 4-7) --- */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}><Users size={20} style={{color: '#0056b3'}} />Members Present:</h2>
                        <div style={styles.memberList}>
                            {formData.members.map((member, index) => (
                                <input 
                                    key={index}
                                    type="text" 
                                    placeholder={`${index + 1}. Name`}
                                    value={member}
                                    onChange={(e) => handleArrayChange('members', index, '', e.target.value)} 
                                    style={styles.inputBase} 
                                    tabIndex={4 + index} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* --- 2. PRODUCTION INFO & TABLE (Tab Indices 8-9 + Table) --- */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}><Zap size={20} style={{color: '#0056b3'}} />Production</h2>
                        <div style={styles.prodInfo}>
                            <div style={styles.inputGroup}>
                                <span style={styles.inputLabel}>Production:</span>
                                <input type="text" value={formData.production} onChange={(e) => handleMainChange('production', e.target.value)} style={{ ...styles.inputBase, width: '100px' }} tabIndex={8} />
                            </div>
                            <div style={styles.inputGroup}>
                                <span style={styles.inputLabel}>P/P Operator:</span>
                                <input type="text" value={formData.ppOperator} onChange={(e) => handleMainChange('ppOperator', e.target.value)} style={{ ...styles.inputBase, width: '150px' }} tabIndex={9} />
                            </div>
                        </div>
                        {/* Table indices start at 10, run to 149 (10 + 20*7 - 1) */}
                        {renderProductionTable()}
                    </div>

                    {/* --- 3. NEXT SHIFT PLAN TABLE (Tab Indices 150-209) --- */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}><Clock size={20} style={{color: '#0056b3'}} />Next Shift Plan:</h2>
                         {/* Table indices start at 150, run to 209 (150 + 20*3 - 1) */}
                        {renderShiftPlanTable()}
                    </div>

                    {/* --- 4. DELAYS TABLE (Tab Indices 210-269) --- */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}><X size={20} style={{color: 'red'}} />Delays:</h2>
                         {/* Table indices start at 210, run to 269 (210 + 20*3 - 1) */}
                        {renderDelaysTable()}
                    </div>

                    {/* --- SUBMIT BUTTONS (Tab Indices 300/301) --- */}
                    <div style={{...styles.buttonGroup, padding: '1.5rem'}}>
                        <button
                            type="button"
                            onClick={handleReset}
                            style={{ ...styles.baseButton, backgroundColor: '#333', color: 'white' }}
                            tabIndex={300}
                        >
                            <X size={18} />
                            Reset Form
                        </button>
                        <button
                            type="submit" 
                            style={{ ...styles.baseButton, ...styles.submitButton }}
                            tabIndex={301}
                        >
                            <Save size={20} />
                            Save Disamatic Product Report
                        </button>
                    </div>
                     {/* Hidden button: Ensures Enter key in any input/table element triggers focus to the next tabIndex, preventing unwanted submission. */}
                    <button type="submit" tabIndex={999} style={{ display: 'none' }} aria-hidden="true"></button>
                </form>
            </div>
        </div>
    );
};

export default DisamaticProductReport;
