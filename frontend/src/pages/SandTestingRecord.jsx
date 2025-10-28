import React, { useState } from 'react';
import { FileText, Calendar, FlaskConical, Save, X } from 'lucide-react';

// --- STYLE DEFINITIONS (REVISED) ---
const styles = {
    // General Styles (No Change)
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
    },
    mainCard: {
        maxWidth: '1280px',
        margin: '0 auto',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    // Header Styles (No Change)
    header: {
        padding: '1.5rem',
        borderBottom: '4px solid #cc0000',
        backgroundColor: '#ffe6e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    headerTitle: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#8b0000',
        margin: 0,
    },
    dateInputContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: 600,
    },
    dateInput: {
        padding: '0.5rem 0.75rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '0.875rem',
        outline: 'none',
    },
    // Form Layouts (*** KEY CHANGE HERE ***)
    formContent: {
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    // --- KEY CHANGE 1: Use 1fr 1fr for two equally extended columns (Shift and Clay/VCM) ---
    gridTop: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Forces two equal-width columns
        gap: '1.5rem',
    },
    // --- KEY CHANGE 2: Use repeat(3, 1fr) for 3 perfectly aligned columns for fields 1-19 ---
    gridMain: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', // Forces 3 equal-width columns
        gap: '1.5rem 2rem', // Adjusted gap for better spacing
        paddingTop: '1rem',
        borderTop: '2px solid #cbd5e1',
    },
    // --- KEY CHANGE 3: New style for the third section (Mix Run Data) to maintain layout ---
    gridMid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
    },
    // Table Styles (Adjusted table cell widths for Clay/VCM table)
    tableBox: {
        border: '1px solid #aaa',
    },
    tableHeader: {
        backgroundColor: '#163442',
        color: 'white',
        fontWeight: 'bold',
        padding: '0.75rem',
        textAlign: 'center',
        fontSize: '1rem',
    },
    tableCell: {
        borderRight: '1px solid #ccc',
        padding: '0.5rem',
        fontSize: '0.875rem',
        textAlign: 'center',
        borderTop: '1px solid #ccc',
    },
    tableCellLast: {
        borderRight: 'none',
    },
    tableRowLabel: {
        backgroundColor: '#fafafa',
        fontWeight: 500,
        textAlign: 'left',
    },
    tableInput: {
        width: '100%',
        padding: '0.5rem',
        border: 'none',
        outline: 'none',
        fontSize: '0.875rem',
        textAlign: 'center',
        boxSizing: 'border-box',
    },
    // Input/Label Styles (No Change)
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 600,      // unified weight for 1..19
        color: '#191919',     // unified color for 1..19
        marginBottom: '0.375rem',
    },
    inputField: {
        width: '100%',
        padding: '0.5rem 0.75rem',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        fontSize: '0.875rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        textAlign: 'left',
    },
    textarea: {
        width: '100%',
        padding: '0.5rem 0.75rem',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        fontSize: '0.875rem',
        outline: 'none',
        boxSizing: 'border-box',
        resize: 'vertical',
    },
    // small centered input used for SMC / Shear alignment
    smallInput: {
        width: '140px',            // increased for better visual alignment
        padding: '0.4rem',
        textAlign: 'center',
        borderRadius: '4px',
        border: '1px solid #cbd5e1',
        background: 'white',
        boxSizing: 'border-box'
    },
    // Button Styles (No Change)
    buttonGroup: {
        marginTop: '0.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        borderTop: '1px solid #cbd5e1',
        paddingTop: '1.5rem',
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
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        textDecoration: 'none',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    submitButton: {
        backgroundColor: '#5B9AA9',
        color: 'white',
    },
    resetButton: {
        backgroundColor: '#163442',
        color: 'white',
    },
    fieldContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    twoColRow: {
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
    },
    threeColRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem',
    },
};

// Helper component using inline styles (updated to accept optional inputStyle)
const InputField = ({ label, value, onChange, field, type = 'text', step = 'any', placeholder = '', inputStyle = {} }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={styles.label}>{label}</label>
        <input
            type={type}
            step={step}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            style={{ ...styles.inputField, ...inputStyle }}
        />
    </div>
);


const SandTestingForm = () => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        shiftData: {
            shift1: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
            shift2: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
            shift3: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
            clay: { totalClayI: '', totalClayII: '', totalClayIII: '', activeClayI: '', activeClayII: '', activeClayIII: '', deadClayI: '', deadClayII: '', deadClayIII: '', vcmI: '', vcmII: '', vcmIII: '', loiI: '', loiII: '', loiIII: '', afsNoI: '', afsNoII: '', afsNoIII: '', finesI: '', finesII: '', finesIII: '' },
            mixRun: { start1: '', end1: '', total1: '', rejected1: '', hopper1: '', start2: '', end2: '', total2: '', rejected2: '', hopper2: '', start3: '', end3: '', total3: '', rejected3: '', hopper3: '', overallTotal: '' },
            friability: { shiftI: '', shiftII: '', shiftIII: '' }
        },
        time: '', mixNo: '', permeability: '', gcsFdyA: '', gcsFdyB: '', wts: '',
        moisture: '', compactability: '', compressibility: '', waterLitre: '',
        sandTempBC: '', sandTempWU: '', sandTempSSU: '', newSandKgs: '',
        bentoniteKgs: '', bentonitePercent: '', premixKgs: '', premixPercent: '',
        coalDustKgs: '', coalDustPercent: '', lcCompactSMC: '', lcCompactAt1: '',
        mouldStrengthSMC: '', shearStrengthAt: '', preparedSandLumps: '',
        itemName: '', remarks: ''
    });

    // NEW: track which G.C.S type is selected (FDY-A or FDY-B)
    const [selectedGcsType, setSelectedGcsType] = useState('FDY-A');

    const handleMainChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleShiftDataChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            shiftData: {
                ...prev.shiftData,
                [section]: { ...prev.shiftData[section], [field]: value }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        alert('Sand Testing Record Submitted!');
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the entire form?')) {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                shiftData: {
                    shift1: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
                    shift2: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
                    shift3: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: '' },
                    clay: { totalClayI: '', totalClayII: '', totalClayIII: '', activeClayI: '', activeClayII: '', activeClayIII: '', deadClayI: '', deadClayII: '', deadClayIII: '', vcmI: '', vcmII: '', vcmIII: '', loiI: '', loiII: '', loiIII: '', afsNoI: '', afsNoII: '', afsNoIII: '', finesI: '', finesII: '', finesIII: '' },
                    mixRun: { start1: '', end1: '', total1: '', rejected1: '', hopper1: '', start2: '', end2: '', total2: '', rejected2: '', hopper2: '', start3: '', end3: '', total3: '', rejected3: '', hopper3: '', overallTotal: '' },
                    friability: { shiftI: '', shiftII: '', shiftIII: '' }
                },
                time: '', mixNo: '', permeability: '', gcsFdyA: '', gcsFdyB: '', wts: '',
                moisture: '', compactability: '', compressibility: '', waterLitre: '',
                sandTempBC: '', sandTempWU: '', sandTempSSU: '', newSandKgs: '',
                bentoniteKgs: '', bentonitePercent: '', premixKgs: '', premixPercent: '',
                coalDustKgs: '', coalDustPercent: '', lcCompactSMC: '', lcCompactAt1: '',
                mouldStrengthSMC: '', shearStrengthAt: '', preparedSandLumps: '',
                itemName: '', remarks: ''
            });
        }
    };

    // --- JSX Rendering ---

    return (
        <div style={styles.pageContainer}>
            <div style={styles.mainCard}>

                {/* Header Section (No Change) */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.headerTitle}>SAND TESTING RECORD</h1>
                    </div>
                    <div style={styles.dateInputContainer}>
                        <Calendar size={20} style={{ color: '#cc0000' }} />
                        <label htmlFor="date-input">DATE:</label>
                        <input
                            id="date-input"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleMainChange('date', e.target.value)}
                            style={styles.dateInput}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.formContent}>

                    {/* TOP SECTION: Shift & Clay/VCM - FORCED EQUAL WIDTH */}
                    <div style={styles.gridTop}>

                        {/* 1. Shift I/II/III (R.Sand, N.Sand, Additives) */}
                        <div style={styles.tableBox}>
                            <h2 style={styles.tableHeader}>SHIFT</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                                        <th style={{ ...styles.tableCell, ...styles.tableRowLabel, width: '40%', fontWeight: 'bold' }}></th>
                                        <th style={{ ...styles.tableCell, width: '20%', fontWeight: 'bold' }}>I</th>
                                        <th style={{ ...styles.tableCell, width: '20%', fontWeight: 'bold' }}>II</th>
                                        <th style={{ ...styles.tableCell, ...styles.tableCellLast, width: '20%', fontWeight: 'bold' }}>III</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { label: 'R. Sand (Kgs/Mix)', field: 'rSand' },
                                        { label: 'N. Sand (Kgs/Mould)', field: 'nSand' },
                                        { label: 'Mixing Mode', field: 'mixingMode' },
                                        { label: 'Bentonite (Kgs/Mix)', field: 'bentonite' },
                                        { label: 'Coal dust/Premix (Kgs/Mix)', field: 'coalDustPremix' },
                                    ].map(({ label, field }) => (
                                        <tr key={field}>
                                            <td style={{ ...styles.tableCell, ...styles.tableRowLabel, textAlign: 'left' }}>{label}</td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.shift1[field]} onChange={(e) => handleShiftDataChange('shift1', field, e.target.value)} style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.shift2[field]} onChange={(e) => handleShiftDataChange('shift2', field, e.target.value)} style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, ...styles.tableCellLast, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.shift3[field]} onChange={(e) => handleShiftDataChange('shift3', field, e.target.value)} style={styles.tableInput} />
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Batch No Row - Separate inputs for each shift (right side) */}
                                    <tr style={{ borderTop: '1px solid #aaa', backgroundColor: '#f0f0f0' }}>
                                        <td style={{ ...styles.tableCell, ...styles.tableRowLabel, textAlign: 'left', fontWeight: 'bold' }}>Batch No.</td>
                                        <td style={{ ...styles.tableCell, padding: 0 }}>
                                            <input type="text" value={formData.shiftData.shift1.batchNo} onChange={(e) => handleShiftDataChange('shift1', 'batchNo', e.target.value)} style={styles.tableInput} placeholder="Bentonite" />
                                        </td>
                                        <td style={{ ...styles.tableCell, padding: 0 }}>
                                            <input type="text" value={formData.shiftData.shift2.batchNo} onChange={(e) => handleShiftDataChange('shift2', 'batchNo', e.target.value)} style={styles.tableInput} placeholder="Coal Dust" />
                                        </td>
                                          <td style={{ ...styles.tableCell, ...styles.tableCellLast, padding: 0 }}>
                                            <input type="text" value={formData.shiftData.shift3.batchNo} onChange={(e) => handleShiftDataChange('shift3', 'batchNo', e.target.value)} style={styles.tableInput} placeholder="premix" />
                                        </td>
                                      
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 2. Clay/VCM Data - ALIGNED WITH SHIFT BOX (now with separate I/II/III inputs to show vertical lines) */}
                        <div style={styles.tableBox}>
                            <h2 style={styles.tableHeader}>CLAY / VCM</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                                        <th style={{ ...styles.tableCell, ...styles.tableRowLabel, width: '40%', fontWeight: 'bold' }}></th>
                                        <th style={{ ...styles.tableCell, width: '20%', fontWeight: 'bold' }}>I</th>
                                        <th style={{ ...styles.tableCell, width: '20%', fontWeight: 'bold' }}>II</th>
                                        <th style={{ ...styles.tableCell, ...styles.tableCellLast, width: '20%', fontWeight: 'bold' }}>III</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { label: 'Total Clay (11.0-14.5%)', field: 'totalClay' },
                                        { label: 'Active Clay (8.5-11.0%)', field: 'activeClay' },
                                        { label: 'Dead Clay (2.0-4.0%)', field: 'deadClay' },
                                        { label: 'V.C.M. (2.0-3.2%)', field: 'vcm' },
                                        { label: 'L.O.I. (4.5-6.0%)', field: 'loi' },
                                        { label: 'AFS No. (Min. 48)', field: 'afsNo' },
                                        { label: 'Fines (10% Max)', field: 'fines' },
                                    ].map(({ label, field }) => (
                                        <tr key={field}>
                                            <td style={{ ...styles.tableCell, ...styles.tableRowLabel, textAlign: 'left' }}>{label}</td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.clay[`${field}I`]} onChange={(e) => handleShiftDataChange('clay', `${field}I`, e.target.value)} style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.clay[`${field}II`]} onChange={(e) => handleShiftDataChange('clay', `${field}II`, e.target.value)} style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, ...styles.tableCellLast, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.clay[`${field}III`]} onChange={(e) => handleShiftDataChange('clay', `${field}III`, e.target.value)} style={styles.tableInput} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {/* MID SECTION: Mix No. Run Data & Friability (Placed below to free up the top grid for 1fr 1fr) */}
                    <div style={styles.gridMid}>
                         {/* 3. Mix No Run Data & Hopper Level */}
                         <div style={styles.tableBox}>
                            <h2 style={styles.tableHeader}>Mix No. Run Data & Hopper Level</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                                        <th style={{ ...styles.tableCell, width: '8%', fontWeight: 'bold' }}>Shift</th>
                                        <th style={{ ...styles.tableCell, width: '18%', fontWeight: 'bold' }}>Start</th>
                                        <th style={{ ...styles.tableCell, width: '18%', fontWeight: 'bold' }}>End</th>
                                        <th style={{ ...styles.tableCell, width: '18%', fontWeight: 'bold' }}>Total</th>
                                        <th style={{ ...styles.tableCell, width: '18%', fontWeight: 'bold' }}>No. of Mix Rejected</th>
                                        <th style={{ ...styles.tableCell, ...styles.tableCellLast, width: '20%', fontWeight: 'bold' }}>Return Sand Hopper Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3].map((num) => (
                                        <tr key={num}>
                                            <td style={{ ...styles.tableCell, backgroundColor: '#fafafa', fontWeight: 'bold' }}>{['I', 'II', 'III'][num - 1]}</td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.mixRun[`start${num}`]} onChange={(e) => handleShiftDataChange('mixRun', `start${num}`, e.target.value)} style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.mixRun[`end${num}`]} onChange={(e) => handleShiftDataChange('mixRun', `end${num}`, e.target.value)} style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.mixRun[`total${num}`]} onChange={(e) => handleShiftDataChange('mixRun', `total${num}`, e.target.value)} style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.mixRun[`rejected${num}`]} onChange={(e) => handleShiftDataChange('mixRun', `rejected${num}`, e.target.value)} style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, ...styles.tableCellLast, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.mixRun[`hopper${num}`]} onChange={(e) => handleShiftDataChange('mixRun', `hopper${num}`, e.target.value)} style={styles.tableInput} />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr style={{ borderTop: '2px solid #aaa', backgroundColor: '#e0e0e0' }}>
                                        <td style={{ ...styles.tableCell, fontWeight: 'bold', textAlign: 'center' }}>TOTAL</td>
                                        <td style={{ ...styles.tableCell, padding: 0 }}>
                                            {/* Overall total inputs left empty for user to enter if required */}
                                            <input type="text" value={formData.shiftData.mixRun.overallStart || ''} onChange={(e) => handleShiftDataChange('mixRun', 'overallStart', e.target.value)} placeholder="" style={styles.tableInput} />
                                        </td>
                                        <td style={{ ...styles.tableCell, padding: 0 }}>
                                            <input type="text" value={formData.shiftData.mixRun.overallEnd || ''} onChange={(e) => handleShiftDataChange('mixRun', 'overallEnd', e.target.value)} placeholder="" style={styles.tableInput} />
                                        </td>
                                        <td style={{ ...styles.tableCell, padding: 0 }}>
                                            <input type="text" value={formData.shiftData.mixRun.overallTotal || ''} onChange={(e) => handleShiftDataChange('mixRun', 'overallTotal', e.target.value)} placeholder="" style={styles.tableInput} />
                                        </td>
                                        <td style={{ ...styles.tableCell, padding: 0 }}>
                                            <input type="text" value={formData.shiftData.mixRun.overallRejected || ''} onChange={(e) => handleShiftDataChange('mixRun', 'overallRejected', e.target.value)} placeholder="" style={styles.tableInput} />
                                        </td>
                                        <td style={{ ...styles.tableCell, ...styles.tableCellLast, padding: 0 }}>
                                            <input type="text" value={formData.shiftData.mixRun.overallHopper || ''} onChange={(e) => handleShiftDataChange('mixRun', 'overallHopper', e.target.value)} placeholder="" style={styles.tableInput} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 4. Prepared Sand Friability */}
                        <div style={styles.tableBox}>
                          {/* Changed the friability header to use the shared tableHeader style (removes yellow) */}
                          <h2 style={styles.tableHeader}>Prepared Sand Friability (8.0-13.0%)</h2>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ height: '39px', backgroundColor: '#fafafa' }}>
                                <th colSpan="2" style={{ border: 'none' }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {[1, 2, 3].map((num) => (
                                <tr key={num}>
                                  <td style={{ ...styles.tableCell, width: '25%', backgroundColor: '#fafafa', fontWeight: 'bold' }}>{['Shift I', 'Shift II', 'Shift III'][num - 1]}</td>
                                  <td style={{ ...styles.tableCell, ...styles.tableCellLast, width: '75%', padding: 0 }}>
                                    <input
                                      type="text"
                                      value={formData.shiftData.friability[`shift${['I', 'II', 'III'][num - 1]}`]}
                                      onChange={(e) => handleShiftDataChange('friability', `shift${['I', 'II', 'III'][num - 1]}`, e.target.value)}
                                      style={styles.tableInput}
                                    />
                                  </td>
                                </tr>
                              ))}
                              <tr style={{ borderTop: '2px solid #aaa', backgroundColor: '#f0f0f0' }}>
                                <td colSpan="2" style={{ ...styles.tableCell, ...styles.tableCellLast, fontWeight: 'bold', textAlign: 'center' }}>FRIABILITY TOTAL</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                    </div>

                    {/* --- MAIN TESTING PARAMETERS (19 FIELDS) --- */}
                    {/* *** KEY ALIGNMENT: FORCED 3-COLUMN LAYOUT VIA gridTemplateColumns: 'repeat(3, 1fr)' *** */}
                    <div style={styles.gridMain}>
  {/* 1 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>1. Time</label>
    <input type="time" value={formData.time} onChange={(e) => handleMainChange('time', e.target.value)} style={styles.inputField} />
  </div>

  {/* 2 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>2. Mix No.</label>
    <input value={formData.mixNo} onChange={(e) => handleMainChange('mixNo', e.target.value)} style={styles.inputField} placeholder="Enter Mix No" />
  </div>

  {/* 3 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>3. Permeability (90-160)</label>
    <input type="number" value={formData.permeability} onChange={(e) => handleMainChange('permeability', e.target.value)} style={styles.inputField} placeholder="90-160" />
  </div>

  {/* 4 - G.C.S with dropdown */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>4. G.C.S Gm/cm²</label>
    <div style={styles.twoColRow}>
      <select value={selectedGcsType} onChange={(e) => setSelectedGcsType(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white' }}>
        <option value="FDY-A">FDY-A (Min 1800)</option>
        <option value="FDY-B">FDY-B (Min 1900)</option>
      </select>

      <input
        type="number"
        step="1"
        value={selectedGcsType === 'FDY-A' ? formData.gcsFdyA : formData.gcsFdyB}
        onChange={(e) => handleMainChange(selectedGcsType === 'FDY-A' ? 'gcsFdyA' : 'gcsFdyB', e.target.value)}
        placeholder={selectedGcsType === 'FDY-A' ? 'Min 1800' : 'Min 1900'}
        style={{ ...styles.inputField, width: '180px', textAlign: 'center' }}
      />

      <div style={{ fontSize: '0.875rem', color: '#334155', fontWeight: 600 }}>
        {selectedGcsType}
      </div>
    </div>
  </div>

  {/* 5 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>5. W.T.S N/cm² (Min 0.15)</label>
    <input type="number" step="0.01" value={formData.wts} onChange={(e) => handleMainChange('wts', e.target.value)} style={styles.inputField} placeholder="Min 0.15" />
  </div>

  {/* 6 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>6. Moisture % (3.0-4.0%)</label>
    <input type="number" step="0.1" value={formData.moisture} onChange={(e) => handleMainChange('moisture', e.target.value)} style={styles.inputField} placeholder="3.0-4.0%" />
  </div>

  {/* 7 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>7. Compactability% (33-40%)</label>
    <input type="number" value={formData.compactability} onChange={(e) => handleMainChange('compactability', e.target.value)} style={styles.inputField} placeholder="33-40%" />
  </div>

  {/* 8 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>8. Compressibility% (20-28%)</label>
    <input type="number" value={formData.compressibility} onChange={(e) => handleMainChange('compressibility', e.target.value)} style={styles.inputField} placeholder="20-28%" />
  </div>

  {/* 9 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>9. Water Litre/kg Mix</label>
    <input type="number" step="0.1" value={formData.waterLitre} onChange={(e) => handleMainChange('waterLitre', e.target.value)} style={styles.inputField} placeholder="Enter Litres" />
  </div>

  {/* 10 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>10. Sand TEMP (Max 45°C)</label>
    <div style={styles.threeColRow}>
      <input value={formData.sandTempBC} onChange={(e) => handleMainChange('sandTempBC', e.target.value)} style={styles.inputField} placeholder="BC" />
      <input value={formData.sandTempWU} onChange={(e) => handleMainChange('sandTempWU', e.target.value)} style={styles.inputField} placeholder="WU" />
      <input value={formData.sandTempSSU} onChange={(e) => handleMainChange('sandTempSSU', e.target.value)} style={styles.inputField} placeholder="SSU" />
    </div>
  </div>

  {/* 11 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>11. New sand Kgs/Mould (0.0-5.0)</label>
    <input type="number" step="0.1" value={formData.newSandKgs} onChange={(e) => handleMainChange('newSandKgs', e.target.value)} style={styles.inputField} placeholder="0.0-5.0" />
  </div>

  {/* 12 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>12. Bentonite</label>
    <div style={styles.twoColRow}>
      <input type="number" step="0.1" value={formData.bentoniteKgs} onChange={(e) => handleMainChange('bentoniteKgs', e.target.value)} style={styles.inputField} placeholder="0Kgs" />
      <input type="number" step="0.1" value={formData.bentonitePercent} onChange={(e) => handleMainChange('bentonitePercent', e.target.value)} style={styles.inputField} placeholder="%" />
    </div>
  </div>

  {/* 13 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>13. Premix (0.60-1.20%)</label>
    <div style={styles.twoColRow}>
      <input type="number" step="0.01" value={formData.premixKgs} onChange={(e) => handleMainChange('premixKgs', e.target.value)} style={styles.inputField} placeholder="0Kgs" />
      <input type="number" step="0.01" value={formData.premixPercent} onChange={(e) => handleMainChange('premixPercent', e.target.value)} style={styles.inputField} placeholder="0.60-1.20%" />
    </div>
  </div>

  {/* 14 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>14. Coal dust (0.20-0.70%)</label>
    <div style={styles.twoColRow}>
      <input type="number" step="0.01" value={formData.coalDustKgs} onChange={(e) => handleMainChange('coalDustKgs', e.target.value)} style={styles.inputField} placeholder="0Kgs" />
      <input type="number" step="0.01" value={formData.coalDustPercent} onChange={(e) => handleMainChange('coalDustPercent', e.target.value)} style={styles.inputField} placeholder="0.20-0.70%" />
    </div>
  </div>

  {/* 15 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>15. LC/Compactability Setting</label>
    <div style={styles.twoColRow}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>SMC 42 ±3</div>
        <input value={formData.lcCompactSMC} onChange={(e) => handleMainChange('lcCompactSMC', e.target.value)} style={styles.smallInput} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>At1 40 ±3</div>
        <input value={formData.lcCompactAt1} onChange={(e) => handleMainChange('lcCompactAt1', e.target.value)} style={styles.smallInput} />
      </div>
    </div>
  </div>

  {/* 16 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>16. Mould strength</label>
    <div style={styles.twoColRow}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>SMC -23 ±3</div>
        <input value={formData.mouldStrengthSMC} onChange={(e) => handleMainChange('mouldStrengthSMC', e.target.value)} style={styles.smallInput} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Shear strength At 5.0 ±1%</div>
        <input value={formData.shearStrengthAt} onChange={(e) => handleMainChange('shearStrengthAt', e.target.value)} style={styles.smallInput} />
      </div>
    </div>
  </div>

  {/* 17 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>17. Prepared sand lumps/kg</label>
    <input type="number" step="0.20" value={formData.preparedSandLumps} onChange={(e) => handleMainChange('preparedSandLumps', e.target.value)} style={styles.inputField} placeholder="0kgs" />
  </div>

  {/* 18 */}
  <div style={styles.fieldContainer}>
    <label style={styles.label}>18. Item name</label>
    <input value={formData.itemName} onChange={(e) => handleMainChange('itemName', e.target.value)} style={styles.inputField} placeholder="Enter Item Name" />
  </div>

  {/* 19 - Remarks (span full width) */}
  <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
    <label style={styles.label}>19. Remarks</label>
    <textarea value={formData.remarks} onChange={(e) => handleMainChange('remarks', e.target.value)} rows="3" style={styles.textarea} placeholder="Enter any remarks" />
  </div>
</div>

                    {/* Submit Button (No Change) */}
                    <div style={styles.buttonGroup}>

                        <button
                            type="button"
                            onClick={handleReset}
                            style={{ ...styles.baseButton, ...styles.resetButton }}
                        >
                            <X size={18} />
                            Reset Form
                        </button>

                        <button
                            type="submit"
                            style={{ ...styles.baseButton, ...styles.submitButton }}
                        >
                            <Save size={20} />
                            Save Sand Record
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default SandTestingForm;