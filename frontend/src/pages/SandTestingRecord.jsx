import React, { useState } from 'react';
import { FileText, Calendar, FlaskConical, Save, X } from 'lucide-react';
import { DatePicker } from '../Components/Buttons';

// --- STYLE DEFINITIONS ---
const styles = {
    // General Styles
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
    // Header Styles
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
    // Form Layouts
    formContent: {
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    gridTop: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    gridMain: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        paddingTop: '1rem',
        borderTop: '2px solid #cbd5e1',
    },
    // Table Styles
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
    // Input/Label Styles
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#334155',
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
    // Button Styles (NOTE: Cannot define :hover styles inline. Will use a class for hover if needed)
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
};

// Helper component using inline styles
const InputField = ({ label, value, onChange, field, type = 'text', step = 'any', placeholder = '' }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={styles.label}>{label}</label>
        <input
            type={type}
            step={step}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            style={styles.inputField}
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
            clay: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
            mixRun: { start1: '', end1: '', total1: '', rejected1: '', hopper1: '', start2: '', end2: '', total2: '', rejected2: '', hopper2: '', start3: '', end3: '', total3: '', rejected3: '', hopper3: '' },
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
                    clay: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
                    mixRun: { start1: '', end1: '', total1: '', rejected1: '', hopper1: '', start2: '', end2: '', total2: '', rejected2: '', hopper2: '', start3: '', end3: '', total3: '', rejected3: '', hopper3: '' },
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

                {/* Header Section */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.headerTitle}>SAND TESTING RECORD</h1>
                    </div>
                    <div style={styles.dateInputContainer}>
                        <Calendar size={20} style={{ color: '#cc0000' }} />
                        <label htmlFor="date-input">DATE:</label>
                        <DatePicker
                            name="date"
                            value={formData.date}
                            onChange={(e) => handleMainChange('date', e.target.value)}
                            style={styles.dateInput}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.formContent}>

                    {/* TOP SECTION: 4 SHIFT BOXES/TABLES */}
                    <div style={styles.gridTop}>

                        {/* 1. Shift I/II/III (R.Sand, N.Sand, Additives) */}
                        <div style={styles.tableBox}>
                            <h2 style={styles.tableHeader}>SHIFT</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                                        <th style={{ ...styles.tableCell, ...styles.tableRowLabel, width: '25%', fontWeight: 'bold' }}></th>
                                        <th style={{ ...styles.tableCell, width: '25%', fontWeight: 'bold' }}>I</th>
                                        <th style={{ ...styles.tableCell, width: '25%', fontWeight: 'bold' }}>II</th>
                                        <th style={{ ...styles.tableCell, ...styles.tableCellLast, width: '25%', fontWeight: 'bold' }}>III</th>
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
                                            <td style={{ ...styles.tableCell, ...styles.tableRowLabel }}>{label}</td>
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
                                    {/* Batch No Row */}
                                    <tr style={{ borderTop: '1px solid #aaa', backgroundColor: '#f0f0f0' }}>
                                        <td style={{ ...styles.tableCell, ...styles.tableRowLabel }}>Batch No.</td>
                                        <td style={{ ...styles.tableCell, padding: 0 }}>
                                            <input type="text" value={formData.shiftData.shift1.batchNo} onChange={(e) => handleShiftDataChange('shift1', 'batchNo', e.target.value)} style={styles.tableInput} placeholder="Bentonite" />
                                        </td>
                                        <td colSpan="2" style={{ ...styles.tableCell, ...styles.tableCellLast, padding: 0 }}>
                                            <input type="text" value={formData.shiftData.shift2.batchNo} onChange={(e) => handleShiftDataChange('shift2', 'batchNo', e.target.value)} style={styles.tableInput} placeholder="Coal Dust / Premix" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 2. Clay/VCM Data (Total Clay, Active Clay, etc.) */}
                        <div style={styles.tableBox}>
                            <h2 style={styles.tableHeader}>CLAY / VCM</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                                        <th style={{ ...styles.tableCell, ...styles.tableRowLabel, width: '50%', fontWeight: 'bold' }}></th>
                                        <th style={{ ...styles.tableCell, width: '1/6', fontWeight: 'bold' }}>I</th>
                                        <th style={{ ...styles.tableCell, width: '1/6', fontWeight: 'bold' }}>II</th>
                                        <th style={{ ...styles.tableCell, ...styles.tableCellLast, width: '1/6', fontWeight: 'bold' }}>III</th>
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
                                            <td style={{ ...styles.tableCell, ...styles.tableRowLabel }}>{label}</td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" value={formData.shiftData.clay[field]} onChange={(e) => handleShiftDataChange('clay', field, e.target.value)} style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, padding: 0 }}>
                                                <input type="text" style={styles.tableInput} />
                                            </td>
                                            <td style={{ ...styles.tableCell, ...styles.tableCellLast, padding: 0 }}>
                                                <input type="text" style={styles.tableInput} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 3. Mix No Run Data & Hopper Level */}
                        <div style={{ ...styles.tableBox, gridColumn: 'span 2' }}>
                            <h2 style={styles.tableHeader}>Mix No. Run Data & Hopper Level</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                                        <th style={{ ...styles.tableCell, width: '1/6', fontWeight: 'bold' }}>Shift</th>
                                        <th style={{ ...styles.tableCell, width: '1/6', fontWeight: 'bold' }}>Start</th>
                                        <th style={{ ...styles.tableCell, width: '1/6', fontWeight: 'bold' }}>End</th>
                                        <th style={{ ...styles.tableCell, width: '1/6', fontWeight: 'bold' }}>Total</th>
                                        <th style={{ ...styles.tableCell, width: '1/6', fontWeight: 'bold' }}>No. of Mix Rejected</th>
                                        <th style={{ ...styles.tableCell, ...styles.tableCellLast, width: '1/6', fontWeight: 'bold' }}>Return Sand Hopper Level</th>
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
                                        <td colSpan="2" style={{ ...styles.tableCell, fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid #aaa' }}>TOTAL</td>
                                        <td colSpan="4" style={{ ...styles.tableCell, ...styles.tableCellLast, textAlign: 'center' }}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 4. Prepared Sand Friability */}
                        <div style={styles.tableBox}>
                            <h2 style={{ ...styles.tableHeader, backgroundColor: '#ffc107', color: '#163442' }}>Prepared Sand Friability (8.0-13.0%)</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {[1, 2, 3].map((num) => (
                                        <tr key={num}>
                                            <td style={{ ...styles.tableCell, width: '25%', backgroundColor: '#fffbe6', fontWeight: 'bold' }}>{['I', 'II', 'III'][num - 1]}</td>
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
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {/* --- MAIN TESTING PARAMETERS (19 FIELDS) --- */}
                    <div style={styles.gridMain}>

                        <InputField label="1. Time" value={formData.time} onChange={handleMainChange} field="time" type="time" />
                        <InputField label="2. Mix No." value={formData.mixNo} onChange={handleMainChange} field="mixNo" placeholder="Enter Mix No" />
                        <InputField label="3. Permeability (90-160)" value={formData.permeability} onChange={handleMainChange} field="permeability" type="number" placeholder="90-160" />
                        <InputField label="4. G.C.S Gm/cm² FDY-A (Min 1800)" value={formData.gcsFdyA} onChange={handleMainChange} field="gcsFdyA" type="number" placeholder="Min 1800" />
                        <InputField label="4. G.C.S Gm/cm² FDY-B (Min 1900)" value={formData.gcsFdyB} onChange={handleMainChange} field="gcsFdyB" type="number" placeholder="Min 1900" />
                        <InputField label="5. W.T.S N/cm² (Min 0.15)" value={formData.wts} onChange={handleMainChange} field="wts" type="number" step="0.01" placeholder="Min 0.15" />
                        <InputField label="6. Moisture % (3.0-4.0%)" value={formData.moisture} onChange={handleMainChange} field="moisture" type="number" step="0.1" placeholder="3.0-4.0" />
                        <InputField label="7. Compactability% (33-40%)" value={formData.compactability} onChange={handleMainChange} field="compactability" type="number" placeholder="33-40" />
                        <InputField label="8. Compressibility% (20-28%)" value={formData.compressibility} onChange={handleMainChange} field="compressibility" type="number" placeholder="20-28" />
                        <InputField label="9. Water Litre/kg Mix" value={formData.waterLitre} onChange={handleMainChange} field="waterLitre" type="number" step="0.1" placeholder="Enter Litres" />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h3 style={{ ...styles.label, color: '#e65100', fontWeight: 'bold' }}>10. Sand TEMP (Max 45°C)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                <InputField label="BC" value={formData.sandTempBC} onChange={handleMainChange} field="sandTempBC" type="number" placeholder="BC" />
                                <InputField label="WU" value={formData.sandTempWU} onChange={handleMainChange} field="sandTempWU" type="number" placeholder="WU" />
                                <InputField label="SSU" value={formData.sandTempSSU} onChange={handleMainChange} field="sandTempSSU" type="number" placeholder="SSU" />
                            </div>
                        </div>
                        
                        <InputField label="11. New sand Kgs/Mould (0.0-5.0)" value={formData.newSandKgs} onChange={handleMainChange} field="newSandKgs" type="number" step="0.1" placeholder="0.0-5.0" />
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h3 style={{ ...styles.label, color: '#4a148c', fontWeight: 'bold' }}>12. Bentonite</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                <InputField label="Kgs" value={formData.bentoniteKgs} onChange={handleMainChange} field="bentoniteKgs" type="number" step="0.1" placeholder="Kgs" />
                                <InputField label="%" value={formData.bentonitePercent} onChange={handleMainChange} field="bentonitePercent" type="number" step="0.1" placeholder="%" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h3 style={{ ...styles.label, color: '#4a148c', fontWeight: 'bold' }}>13. Premix (0.60-1.20%)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                <InputField label="Kgs" value={formData.premixKgs} onChange={handleMainChange} field="premixKgs" type="number" step="0.01" placeholder="Kgs" />
                                <InputField label="%" value={formData.premixPercent} onChange={handleMainChange} field="premixPercent" type="number" step="0.01" placeholder="0.60-1.20" />
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h3 style={{ ...styles.label, color: '#4a148c', fontWeight: 'bold' }}>14. Coal dust (0.20-0.70%)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                <InputField label="Kgs" value={formData.coalDustKgs} onChange={handleMainChange} field="coalDustKgs" type="number" step="0.01" placeholder="Kgs" />
                                <InputField label="%" value={formData.coalDustPercent} onChange={handleMainChange} field="coalDustPercent" type="number" step="0.01" placeholder="0.20-0.70" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h3 style={{ ...styles.label, color: '#b71c1c', fontWeight: 'bold' }}>15. LC/Compactability Setting</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                <InputField label="SMC 42 ±3" value={formData.lcCompactSMC} onChange={handleMainChange} field="lcCompactSMC" placeholder="SMC value" />
                                <InputField label="At1 40 ±3" value={formData.lcCompactAt1} onChange={handleMainChange} field="lcCompactAt1" placeholder="At1 value" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h3 style={{ ...styles.label, color: '#b71c1c', fontWeight: 'bold' }}>16. Mould strength</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                <InputField label="SMC -23 ±3" value={formData.mouldStrengthSMC} onChange={handleMainChange} field="mouldStrengthSMC" placeholder="SMC strength" />
                                <InputField label="Shear strength At 5.0 ±1%" value={formData.shearStrengthAt} onChange={handleMainChange} field="shearStrengthAt" placeholder="Shear %" />
                            </div>
                        </div>

                        <InputField label="17. Prepared sand lumps/kg" value={formData.preparedSandLumps} onChange={handleMainChange} field="preparedSandLumps" type="number" step="0.1" placeholder="Lumps/kg" />
                        <InputField label="18. Item name" value={formData.itemName} onChange={handleMainChange} field="itemName" placeholder="Enter Item Name" />
                        
                        {/* Remarks */}
                        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                            <label style={{ ...styles.label, fontWeight: 'bold' }}>19. Remarks</label>
                            <textarea
                                value={formData.remarks}
                                onChange={(e) => handleMainChange('remarks', e.target.value)}
                                placeholder="Enter any remarks"
                                rows="3"
                                style={styles.textarea}
                            ></textarea>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={styles.buttonGroup}>
                        
                        <button
                            type="button"
                            onClick={handleReset}
                            // Note: Hover effects are NOT possible with pure inline styles. They would require a separate CSS file or a CSS-in-JS library.
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