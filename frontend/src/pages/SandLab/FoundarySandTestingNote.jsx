import React, { useState } from 'react';
import { FlaskConical, Save, X, Factory, FileText, Filter } from 'lucide-react';
import Button, { DatePicker } from '../../Components/Buttons';
import '../../styles/PageStyles/Sandlab/FoundarySandTestingNote.css';

// --- 1. STYLE DEFINITIONS (Centralized Styles) ---
const styles = {
    // General Page & Card Structure
    pageContainer: { minHeight: '100vh', backgroundColor: '#f0f4f8', padding: '2rem', fontFamily: 'Arial, sans-serif', },
    mainCard: { maxWidth: '1280px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden', },

    // Header Styles
    header: { padding: '1rem 1.5rem', borderBottom: '4px solid #cc0000', backgroundColor: '#ffe6e6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', },
    headerTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: '#1a202c', margin: '0', textAlign: 'center' },
    headerInfoGrid: { display: 'grid', gridTemplateColumns: 'auto auto', gap: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155', },
    headerInfoLabel: { fontWeight: 600, color: '#1a202c', textAlign: 'right', },
    headerInfoInput: { padding: '0.3rem 0.6rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem', outline: 'none', width: '120px', boxSizing: 'border-box', backgroundColor: 'white' },

    // Form Content & Layout
    formContent: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', },
    
    // Table Styles
    tableWrapper: { border: '1px solid #aaa', borderRadius: '4px', overflow: 'hidden', },
    tableTitle: { backgroundColor: '#163442', color: 'white', fontWeight: 'bold', padding: '0.75rem', textAlign: 'center', fontSize: '1rem', borderBottom: '1px solid #aaa', },
    tableBase: { width: '100%', borderCollapse: 'collapse', },
    tableHeadCell: { backgroundColor: '#e2e8f0', color: '#1a202c', padding: '0.6rem', textAlign: 'center', fontWeight: 600, borderBottom: '1px solid #aaa', borderRight: '1px solid #ccc', },
    tableBodyCell: { padding: '0.4rem', textAlign: 'center', borderBottom: '1px solid #eee', borderRight: '1px solid #eee', fontSize: '0.875rem', color: '#334155', },
    tableBodyCellLeft: { textAlign: 'left', paddingLeft: '0.8rem', fontWeight: 500, },
    noBorderRight: { borderRight: 'none', },
    tableRowEven: { backgroundColor: '#f8fafc', },

    // Input Styles
    inputBase: { width: '100%', padding: '0.3rem', border: '1px solid #ccc', borderRadius: '3px', fontSize: '0.875rem', textAlign: 'center', boxSizing: 'border-box', outline: 'none', },
    inputSmall: { width: '60px', padding: '0.2rem', fontSize: '0.75rem', },
    
    // Bottom Section Styles
    bottomGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', },
    bottomGridTitle: { fontSize: '1.2rem', fontWeight: 'bold', color: '#1a202c', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '0.5rem', },
    bottomLabel: { fontWeight: 500, color: '#334155', minWidth: '120px', textAlign: 'right', fontSize: '0.875rem', },
    bottomValueContainer: { flexGrow: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', },
    bottomInput: { flexGrow: 1, padding: '0.4rem 0.6rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.875rem', outline: 'none', },
    bottomTextSuffix: { fontSize: '0.8rem', color: '#64748b', },

    // Button Styles
    buttonGroup: { marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem', },
    baseButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'transform 0.3s ease', transform: 'scale(1)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', },
    submitButton: { backgroundColor: '#5B9AA9', color: 'white', },
    resetButton: { backgroundColor: '#163442', color: 'white', },
};


// --- 2. REUSABLE ATOMIC COMPONENTS (Unchanged Logic/Tabs) ---

const LabeledInput = ({ label, value, onChange, field, suffix, inputStyle = {}, tabIndex }) => (
    <div className="foundry-labeled-input">
        <label className="foundry-bottom-label">{label}</label>
        <div className="foundry-bottom-value">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                className="foundry-bottom-input"
                style={inputStyle}
                tabIndex={tabIndex}
            />
            {suffix && <span className="foundry-bottom-suffix">{suffix}</span>}
        </div>
    </div>
);

const TestTable = ({ data, handleTestChange }) => {
    const fields = [
        { label: 'Total clay', f1: 'totalClay', f2: 'totalClayMod', startTab: 10 },
        { label: 'Active clay', f1: 'activeClay', f2: 'activeClayMod', startTab: 14 },
        { label: 'Dead clay', f1: 'deadClay', f2: 'deadClayMod', startTab: 18 },
        { label: 'VCM', f1: 'vcm', f2: 'vcmMod', startTab: 22 },
        { label: 'LOI', f1: 'loi', f2: 'loiMod', startTab: 26 },
    ];

    return (
        <div style={styles.tableWrapper}>
            <table style={styles.tableBase}>
                <thead>
                    <tr>
                        <th style={{ ...styles.tableHeadCell, width: '25%' }}>Parameters</th>
                        <th colSpan="2" style={{ ...styles.tableHeadCell, width: '37.5%' }}>TEST-1</th>
                        <th colSpan="2" style={{ ...styles.tableHeadCell, ...styles.noBorderRight, width: '37.5%' }}>TEST-2</th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map(({ label, f1, f2, startTab }, index) => (
                        <tr key={label} style={index % 2 === 0 ? styles.tableRowEven : {}}>
                            <td style={{ ...styles.tableBodyCell, ...styles.tableBodyCellLeft }}>{label}</td>
                            
                            {/* TEST-1 */}
                            <td style={styles.tableBodyCell}>
                                <input type="text" value={data.test1[f1]} onChange={(e) => handleTestChange(1, f1, e.target.value)} style={styles.inputBase} tabIndex={startTab} />
                            </td>
                            <td style={styles.tableBodyCell}>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>% = </span>
                                <input type="text" value={data.test1[f2]} onChange={(e) => handleTestChange(1, f2, e.target.value)} style={{ ...styles.inputBase, ...styles.inputSmall, width: '60px' }} tabIndex={startTab + 1} />
                            </td>
                            
                            {/* TEST-2 */}
                            <td style={styles.tableBodyCell}>
                                <input type="text" value={data.test2[f1]} onChange={(e) => handleTestChange(2, f1, e.target.value)} style={styles.inputBase} tabIndex={startTab + 2} />
                            </td>
                            <td style={{ ...styles.tableBodyCell, ...styles.noBorderRight }}>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>% = </span>
                                <input type="text" value={data.test2[f2]} onChange={(e) => handleTestChange(2, f2, e.target.value)} style={{ ...styles.inputBase, ...styles.inputSmall, width: '60px' }} tabIndex={startTab + 3} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const SieveTestTable = ({ data, handleSieveChange, handleSieveTotalChange }) => {
    const sieveStyles = {
        headerRow: { backgroundColor: '#f0f0f0' },
        totalRow: { backgroundColor: '#e2e8f0', fontWeight: 'bold' },
        inputCell: { padding: '0px', borderRight: '1px solid #ccc' },
        inputBase: { width: '100%', padding: '0.4rem', border: 'none', outline: 'none', fontSize: '0.875rem', textAlign: 'center', boxSizing: 'border-box', }
    };

    return (
        <div className="foundry-table-wrapper">
            <h2 className="foundry-table-title">Sieve Testing</h2>
            <table className="foundry-table-base">
                <thead>
                    <tr className="foundry-sieve-header-row">
                        <th rowSpan="2" className="foundry-table-head-cell foundry-head-size">Sieve size (Mic)</th>
                        <th colSpan="2" className="foundry-table-head-cell foundry-head-percent">% Wt retained sand</th>
                        <th rowSpan="2" className="foundry-table-head-cell foundry-head-mf">MF</th>
                        <th colSpan="2" className="foundry-table-head-cell foundry-head-product">Product</th>
                    </tr>
                    <tr className="foundry-sieve-header-row">
                        <th className="foundry-table-head-cell foundry-head-sub">TEST-1</th>
                        <th className="foundry-table-head-cell foundry-head-sub">TEST-2</th>
                        <th className="foundry-table-head-cell foundry-head-sub">TEST-1</th>
                        <th className="foundry-table-head-cell foundry-head-sub">TEST-2</th>
                    </tr>
                </thead>
                <tbody>
                    {data.sieveTest.map((row, index) => (
                        <tr key={row.sieveSize} className={index % 2 === 0 ? 'foundry-table-row-even' : ''}>
                            <td className="foundry-table-body-left">{row.sieveSize}</td>

                            {/* % Wt retained sand TEST-1 (Tab: 30-34, 35-39, etc.) */}
                            <td className="foundry-input-cell">
                                <input type="text" value={row.test1Retained} onChange={(e) => handleSieveChange(index, 'test1Retained', e.target.value)} className="foundry-input-base" tabIndex={30 + index * 5} />
                            </td>
                            {/* % Wt retained sand TEST-2 */}
                            <td className="foundry-input-cell">
                                <input type="text" value={row.test2Retained} onChange={(e) => handleSieveChange(index, 'test2Retained', e.target.value)} className="foundry-input-base" tabIndex={30 + index * 5 + 1} />
                            </td>

                            {/* MF */}
                            <td className="foundry-input-cell">
                                <input type="text" value={row.mf} onChange={(e) => handleSieveChange(index, 'mf', e.target.value)} className="foundry-input-base" tabIndex={30 + index * 5 + 2} />
                            </td>

                            {/* Product TEST-1 */}
                            <td className="foundry-input-cell">
                                <input type="text" value={row.product1} onChange={(e) => handleSieveChange(index, 'product1', e.target.value)} className="foundry-input-base" tabIndex={30 + index * 5 + 3} />
                            </td>
                            {/* Product TEST-2 */}
                            <td className="foundry-input-cell foundry-no-border-right">
                                <input type="text" value={row.product2} onChange={(e) => handleSieveChange(index, 'product2', e.target.value)} className="foundry-input-base" tabIndex={30 + index * 5 + 4} />
                            </td>
                        </tr>
                    ))}
                    {/* Totals Row (Tab Indices 85-89) */}
                    <tr className="foundry-total-row">
                        <td className="foundry-table-body-left foundry-total-label">Total</td>
                        <td className="foundry-input-cell"><input type="text" value={data.sieveTestTotals.test1Total} onChange={(e) => handleSieveTotalChange('test1Total', e.target.value)} className="foundry-input-base" tabIndex={85} /></td>
                        <td className="foundry-input-cell"><input type="text" value={data.sieveTestTotals.test2Total} onChange={(e) => handleSieveTotalChange('test2Total', e.target.value)} className="foundry-input-base" tabIndex={86} /></td>
                        <td className="foundry-input-cell"><input type="text" value={data.sieveTestTotals.mfTotal} onChange={(e) => handleSieveTotalChange('mfTotal', e.target.value)} className="foundry-input-base" tabIndex={87} /></td>
                        <td className="foundry-input-cell"><input type="text" value={data.sieveTestTotals.productTotal1} onChange={(e) => handleSieveTotalChange('productTotal1', e.target.value)} className="foundry-input-base" tabIndex={88} /></td>
                         <td className="foundry-input-cell foundry-no-border-right"><input type="text" value={data.sieveTestTotals.productTotal2} onChange={(e) => handleSieveTotalChange('productTotal2', e.target.value)} className="foundry-input-base" tabIndex={89} /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


// --- 3. MAIN COMPONENT (Updated handleSubmit/handleKeyDown) ---
const FoundrySandTestingNote = () => {
    
    // Initial State (All empty strings for user input)
    const [formData, setFormData] = useState({
        sandPlant: '', compactibilitySetting: '', shearStrengthSetting: '', 
        date: new Date().toISOString().split('T')[0], // Default today's date
        shift: '',
        test1: { totalClay: '', totalClayMod: '', activeClay: '', activeClayMod: '', deadClay: '', deadClayMod: '', vcm: '', vcmMod: '', loi: '', loiMod: '', },
        test2: { totalClay: '', totalClayMod: '', activeClay: '', activeClayMod: '', deadClay: '', deadClayMod: '', vcm: '', vcmMod: '', loi: '', loiMod: '', },
        sieveTest: [
            { sieveSize: '1700', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '850', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '600', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '425', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '300', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '212', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '150', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '106', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '75', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '53', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: 'pan', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' },
        ],
        sieveTestTotals: { test1Total: '', test2Total: '', mfTotal: '', productTotal1: '', productTotal2: '' },
        compactability: '', permeability: '', gcs: '', wts: '', moisture: '', bentonite: '', coalDust: '', hopperLevel: '', shearStrength: '', setting: '', returnSand: '', newSand: '', remarks: '',
        afsNo: '', afsNo2: '', fines: '', fines2: '', gd: '', gd2: '',
    });

    // --- STATE HANDLERS (Unchanged) ---
    const handleMainChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
    const handleTestChange = (testNum, field, value) => setFormData(prev => ({ ...prev, [`test${testNum}`]: { ...prev[`test${testNum}`], [field]: value } }));
    const handleSieveChange = (rowIndex, field, value) => {
        const updatedSieveTest = [...formData.sieveTest];
        updatedSieveTest[rowIndex] = { ...updatedSieveTest[rowIndex], [field]: value };
        setFormData(prev => ({ ...prev, sieveTest: updatedSieveTest }));
    };
    const handleSieveTotalChange = (field, value) => setFormData(prev => ({ ...prev, sieveTestTotals: { ...prev.sieveTestTotals, [field]: value } }));

    // --- FORM SUBMISSION HANDLER ---
    const handleSubmit = (e) => {
        e.preventDefault(); // <-- The logic to prevent Enter key submission is primarily here
        console.log('Foundry Sand Testing Data Submitted:', formData);
        alert('Foundry Sand Testing Note Submitted!');
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the entire form?')) {
            // Reset logic...
            setFormData({
                sandPlant: '', compactibilitySetting: '', shearStrengthSetting: '', date: new Date().toISOString().split('T')[0], shift: '',
                test1: { totalClay: '', totalClayMod: '', activeClay: '', activeClayMod: '', deadClay: '', deadClayMod: '', vcm: '', vcmMod: '', loi: '', loiMod: '' },
                test2: { totalClay: '', totalClayMod: '', activeClay: '', activeClayMod: '', deadClay: '', deadClayMod: '', vcm: '', vcmMod: '', loi: '', loiMod: '' },
                sieveTest: [
                    { sieveSize: '1700', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '850', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '600', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '425', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '300', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '212', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '150', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '106', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '75', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: '53', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' }, { sieveSize: 'pan', test1Retained: '', test2Retained: '', mf: '', product1: '', product2: '' },
                ],
                sieveTestTotals: { test1Total: '', test2Total: '', mfTotal: '', productTotal1: '', productTotal2: '' },
                compactability: '', permeability: '', gcs: '', wts: '', moisture: '', bentonite: '', coalDust: '', hopperLevel: '', shearStrength: '', setting: '', returnSand: '', newSand: '', remarks: '',
                afsNo: '', afsNo2: '', fines: '', fines2: '', gd: '', gd2: '',
            });
        }
    };

    // --- KEYDOWN HANDLER ---
    // This function intercepts the Enter keypress to ensure it only moves to the next field (via Tab),
    // and doesn't trigger form submission unless it's on a button of type 'submit'.
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents the default action (form submission)
            
            // Manually trigger the tab action
            const currentTabIndex = parseInt(e.target.tabIndex);
            if (!isNaN(currentTabIndex)) {
                const nextTabIndex = currentTabIndex + 1;
                const nextElement = document.querySelector(`[tabIndex="${nextTabIndex}"]`);
                if (nextElement) {
                    nextElement.focus();
                } else if (currentTabIndex < 200) {
                     // If the element doesn't exist (e.g., end of a section), jump to the next logical block start
                    const nextBlockStart = [6, 10, 30, 90, 110, 200].find(index => index > currentTabIndex);
                    if (nextBlockStart) {
                        document.querySelector(`[tabIndex="${nextBlockStart}"]`)?.focus();
                    }
                }
            }
        }
    };


    // --- JSX RENDERING ---

    return (
        <div className="foundry-page-container">
            <div className="foundry-main-card">

                {/* --- HEADER --- */}
                <div className="foundry-header">
                    <div className="foundry-header-info-grid">
                        <Factory size={24} className="foundry-factory-icon" />
                        <span className="foundry-sakthi">SAKTHI AUTO</span>
                    </div>
                    <div className="foundry-header-center">
                        <h1 className="foundry-header-title">FOUNDRY SAND TESTING NOTE</h1>
                    </div>
                    {/* Header Input Fields (Tab Indices 1-5) */}
                    <div className="foundry-header-grid">
                        <span className="foundry-header-label">SAND PLANT:</span>
                        <input type="text" value={formData.sandPlant} placeholder="e.g. DISA" onChange={(e) => handleMainChange('sandPlant', e.target.value)} className="foundry-header-input" tabIndex={1} onKeyDown={handleKeyDown} />

                        <span className="foundry-header-label">DATE:</span>
                        <DatePicker name="date" value={formData.date} onChange={(e) => handleMainChange('date', e.target.value)} className="foundry-header-input" />

                        <span className="foundry-header-label">COMPACTIBILITY SETTING:</span>
                        <input type="text" value={formData.compactibilitySetting} placeholder="e.g. J.C. mode" onChange={(e) => handleMainChange('compactibilitySetting', e.target.value)} className="foundry-header-input" tabIndex={3} onKeyDown={handleKeyDown} />

                        <span className="foundry-header-label">SHIFT:</span>
                        <input type="text" value={formData.shift} placeholder="e.g. 2nd Shift" onChange={(e) => handleMainChange('shift', e.target.value)} className="foundry-header-input" tabIndex={4} onKeyDown={handleKeyDown} />

                        <span className="foundry-header-label">SHEAR/MOULD STRENGTH SETTING:</span>
                        <input type="text" value={formData.shearStrengthSetting} placeholder="e.g. MP.VOX 2" onChange={(e) => handleMainChange('shearStrengthSetting', e.target.value)} className="foundry-header-input" tabIndex={5} onKeyDown={handleKeyDown} />
                    </div>
                </div>

                {/* IMPORTANT: The form onSubmit={handleSubmit} is now the primary mechanism to prevent Enter key submission. */}
                <form onSubmit={handleSubmit} className="foundry-form-content">

                    {/* --- 1. CLAY/VCM/LOI TABLES (Tab Indices 10-29) --- */}
                    <TestTable data={formData} handleTestChange={(testNum, field, value) => { handleTestChange(testNum, field, value); }} />

                    {/* --- 2. SIEVE TESTING TABLE (Tab Indices 30-89) --- */}
                    <SieveTestTable data={formData} handleSieveChange={handleSieveChange} handleSieveTotalChange={handleSieveTotalChange} />

                    {/* --- 3. BOTTOM PARAMETER SECTION --- */}
                    <div className="foundry-bottom-grid">
                        
                        {/* Left Column: Main Parameters (Tab Indices 90-101) */}
                        <div className="foundry-bottom-column">
                            <h3 className="foundry-bottom-title"><FlaskConical size={20} className="foundry-icon-teal" />Main Parameters</h3>
                            <LabeledInput label="Compactability" value={formData.compactability} onChange={handleMainChange} field="compactability" suffix="%" tabIndex={90} onKeyDown={handleKeyDown} />
                            <LabeledInput label="Permeability" value={formData.permeability} onChange={handleMainChange} field="permeability" tabIndex={91} onKeyDown={handleKeyDown} />
                            <LabeledInput label="GCS" value={formData.gcs} onChange={handleMainChange} field="gcs" suffix="gm/cm²" tabIndex={92} onKeyDown={handleKeyDown} />
                            <LabeledInput label="WTS" value={formData.wts} onChange={handleMainChange} field="wts" suffix="N/cm²" tabIndex={93} onKeyDown={handleKeyDown} />
                            <LabeledInput label="Moisture" value={formData.moisture} onChange={handleMainChange} field="moisture" suffix="%" tabIndex={94} onKeyDown={handleKeyDown} />
                            <LabeledInput label="Bentonite" value={formData.bentonite} onChange={handleMainChange} field="bentonite" suffix="kg" tabIndex={95} onKeyDown={handleKeyDown} />
                            <LabeledInput label="Coal Dust" value={formData.coalDust} onChange={handleMainChange} field="coalDust" suffix="kg" tabIndex={96} onKeyDown={handleKeyDown} />
                            <LabeledInput label="Hopper Level" value={formData.hopperLevel} onChange={handleMainChange} field="hopperLevel" suffix="%" tabIndex={97} onKeyDown={handleKeyDown} />
                            <LabeledInput label="Shear Strength" value={formData.shearStrength} onChange={handleMainChange} field="shearStrength" tabIndex={98} onKeyDown={handleKeyDown} />
                            <LabeledInput label="Setting" value={formData.setting} onChange={handleMainChange} field="setting" suffix="sec" tabIndex={99} onKeyDown={handleKeyDown} />
                            <LabeledInput label="Return Sand" value={formData.returnSand} onChange={handleMainChange} field="returnSand" suffix="%" tabIndex={100} onKeyDown={handleKeyDown} />
                            <LabeledInput label="New Sand" value={formData.newSand} onChange={handleMainChange} field="newSand" suffix="kg" tabIndex={101} onKeyDown={handleKeyDown} />
                        </div>

                        {/* Right Column: Additional Data & Remarks (Tab Indices 110-117) */}
                        <div className="foundry-bottom-column">
                            <h3 className="foundry-bottom-title"><FileText size={20} className="foundry-icon-teal" />Additional Data</h3>
                            
                            {/* AFS No */}
                            <div className="foundry-bottom-row">
                                <label className="foundry-bottom-label">AFS No.</label>
                                <div className="foundry-bottom-value">
                                    <input type="text" value={formData.afsNo} onChange={(e) => handleMainChange('afsNo', e.target.value)} className="foundry-bottom-input" tabIndex={110} onKeyDown={handleKeyDown} />
                                    <input type="text" value={formData.afsNo2} onChange={(e) => handleMainChange('afsNo2', e.target.value)} className="foundry-bottom-input" tabIndex={111} onKeyDown={handleKeyDown} />
                                </div>
                            </div>
                            
                            {/* Fines */}
                            <div className="foundry-bottom-row">
                                <label className="foundry-bottom-label">Fines</label>
                                <div className="foundry-bottom-value">
                                    <input type="text" value={formData.fines} onChange={(e) => handleMainChange('fines', e.target.value)} className="foundry-bottom-input" tabIndex={112} onKeyDown={handleKeyDown} />
                                    <input type="text" value={formData.fines2} onChange={(e) => handleMainChange('fines2', e.target.value)} className="foundry-bottom-input" tabIndex={113} onKeyDown={handleKeyDown} />
                                </div>
                            </div>

                            {/* GD */}
                            <div className="foundry-bottom-row">
                                <label className="foundry-bottom-label">GD</label>
                                <div className="foundry-bottom-value">
                                    <input type="text" value={formData.gd} onChange={(e) => handleMainChange('gd', e.target.value)} className="foundry-bottom-input" tabIndex={114} onKeyDown={handleKeyDown} />
                                    <input type="text" value={formData.gd2} onChange={(e) => handleMainChange('gd2', e.target.value)} className="foundry-bottom-input" tabIndex={115} onKeyDown={handleKeyDown} />
                                </div>
                            </div>

                            {/* Remarks */}
                            <div className="foundry-bottom-remarks">
                                <label className="foundry-bottom-label foundry-remarks-label">Remarks:</label>
                                <textarea value={formData.remarks} onChange={(e) => handleMainChange('remarks', e.target.value)} rows="4" className="foundry-bottom-input foundry-remarks-textarea" tabIndex={116} onKeyDown={handleKeyDown}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* --- SUBMIT BUTTONS (Tab Indices 200/201) --- */}
                    <div className="foundry-button-group">
                        <Button type="button" onClick={handleReset} className="foundry-base-btn foundry-reset-btn" tabIndex={200}>
                            <X size={18} /> Reset Form
                        </Button>
                        <Button type="submit" className="foundry-base-btn foundry-submit-btn" tabIndex={201}>
                            <Save size={20} /> Save Foundry Record
                        </Button>
                    </div>

                </form>

                {/* Report Section */}
                <div className="foundry-report-container">
                    <div className="foundry-report-header">
                        <Filter size={20} className="foundry-filter-icon" />
                        <h3 className="foundry-report-title">Foundry Sand Testing Note - Report</h3>
                    </div>

                    <div className="foundry-report-filter-grid">
                        <div>
                            <label className="foundry-filter-label">Start Date</label>
                            <DatePicker placeholder="Select start date" />
                        </div>
                        <div>
                            <label className="foundry-filter-label">End Date</label>
                            <DatePicker placeholder="Select end date" />
                        </div>
                        <Button className="foundry-filter-btn"><Filter size={18} /> Filter</Button>
                    </div>

                    <div className="foundry-report-table-wrapper">
                        <table className="foundry-report-table">
                            <thead className="foundry-report-table-head">
                                <tr>
                                    <th className="foundry-report-th">Date</th>
                                    <th className="foundry-report-th">Sand Type</th>
                                    <th className="foundry-report-th">Moisture %</th>
                                    <th className="foundry-report-th">Comp. Strength</th>
                                    <th className="foundry-report-th">Permeability</th>
                                    <th className="foundry-report-th">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="6" className="foundry-no-records">No records found. Submit entries above to see them here.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FoundrySandTestingNote;