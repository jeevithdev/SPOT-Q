import React, { useState } from 'react';
import { FileText, Calendar, FlaskConical, Save, X, Filter } from 'lucide-react';
import Button, { DatePicker } from '../../Components/Buttons';
import '../../styles/PageStyles/Sandlab/SandTestingRecord.css';

// Styles are moved to CSS file: SandTestingRecord.css

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
        sandProperties: {
            sandTempBC: '', sandTempWU: '', sandTempSSU: '', newSandKgs: '',
            bentoniteKgs: '', bentonitePercent: '', premixKgs: '', premixPercent: '',
            coalDustKgs: '', coalDustPercent: '', lcCompactSMC: '', lcCompactAt1: '',
            mouldStrengthSMC: '', shearStrengthAt: '', preparedSandLumps: '',
            itemName: '', remarks: ''
        }
    });

    const [selectedGcsType, setSelectedGcsType] = useState('FDY-A');

    const handleMainChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleShiftChange = (shift, field, value) => {
        setFormData(prev => ({
            ...prev,
            shiftData: {
                ...prev.shiftData,
                [shift]: {
                    ...prev.shiftData[shift],
                    [field]: value
                }
            }
        }));
    };

    const handleClayChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            shiftData: {
                ...prev.shiftData,
                clay: {
                    ...prev.shiftData.clay,
                    [field]: value
                }
            }
        }));
    };

    const handleMixRunChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            shiftData: {
                ...prev.shiftData,
                mixRun: {
                    ...prev.shiftData.mixRun,
                    [field]: value
                }
            }
        }));
    };

    const handleFriabilityChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            shiftData: {
                ...prev.shiftData,
                friability: {
                    ...prev.shiftData.friability,
                    [field]: value
                }
            }
        }));
    };

    const handleSandPropertiesChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            sandProperties: {
                ...prev.sandProperties,
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        console.log('Form Data:', formData);
        alert('Data saved successfully!');
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            window.location.reload();
        }
    };

    return (
        <div className="sandrec-root container">
            <div className="sandrec-card">
                {/* Header */}
                <div className="sandrec-header">
                    <div className="sandrec-header-content">
                        <h1 className="sandrec-title">Sand Testing Record</h1>
                        <div className="sandrec-date-input-container">
                            <Calendar className="sandrec-calendar-icon" />
                            <DatePicker
                                name="date"
                                value={formData.date}
                                onChange={(e) => handleMainChange('date', e.target.value)}
                                className="sandrec-date-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="sandrec-form-content">
                    {/* Shift Data Section */}
                    <div className="sandrec-section">
                        <h2 className="sandrec-section-title">Shift Data</h2>
                        
                        {/* Shift 1, 2, 3 */}
                        <div className="sandrec-grid-top">
                            <div className="sandrec-field-group">
                                <label className="sandrec-field-label">Shift 1 - R Sand</label>
                                <input
                                    type="text"
                                    className="sandrec-field-input"
                                    value={formData.shiftData.shift1.rSand}
                                    onChange={(e) => handleShiftChange('shift1', 'rSand', e.target.value)}
                                />
                            </div>
                            <div className="sandrec-field-group">
                                <label className="sandrec-field-label">Shift 1 - N Sand</label>
                                <input
                                    type="text"
                                    className="sandrec-field-input"
                                    value={formData.shiftData.shift1.nSand}
                                    onChange={(e) => handleShiftChange('shift1', 'nSand', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sandrec-grid-top">
                            <div className="sandrec-field-group">
                                <label className="sandrec-field-label">Shift 2 - R Sand</label>
                                <input
                                    type="text"
                                    className="sandrec-field-input"
                                    value={formData.shiftData.shift2.rSand}
                                    onChange={(e) => handleShiftChange('shift2', 'rSand', e.target.value)}
                                />
                            </div>
                            <div className="sandrec-field-group">
                                <label className="sandrec-field-label">Shift 2 - N Sand</label>
                                <input
                                    type="text"
                                    className="sandrec-field-input"
                                    value={formData.shiftData.shift2.nSand}
                                    onChange={(e) => handleShiftChange('shift2', 'nSand', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sandrec-grid-top">
                            <div className="sandrec-field-group">
                                <label className="sandrec-field-label">Shift 3 - R Sand</label>
                                <input
                                    type="text"
                                    className="sandrec-field-input"
                                    value={formData.shiftData.shift3.rSand}
                                    onChange={(e) => handleShiftChange('shift3', 'rSand', e.target.value)}
                                />
                            </div>
                            <div className="sandrec-field-group">
                                <label className="sandrec-field-label">Shift 3 - N Sand</label>
                                <input
                                    type="text"
                                    className="sandrec-field-input"
                                    value={formData.shiftData.shift3.nSand}
                                    onChange={(e) => handleShiftChange('shift3', 'nSand', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clay/VCM Section */}
                    <div className="sandrec-section">
                        <h2 className="sandrec-section-title">Clay/VCM Data</h2>
                        
                        <div className="sandrec-table-box">
                            <div className="sandrec-table-header">Clay Analysis</div>
                            <div className="sandrec-table-row">
                                <div className="sandrec-table-cell">Total Clay I</div>
                                <div className="sandrec-table-cell-last">
                                    <input
                                        type="text"
                                        className="sandrec-table-input"
                                        value={formData.shiftData.clay.totalClayI}
                                        onChange={(e) => handleClayChange('totalClayI', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="sandrec-table-row">
                                <div className="sandrec-table-cell">Total Clay II</div>
                                <div className="sandrec-table-cell-last">
                                    <input
                                        type="text"
                                        className="sandrec-table-input"
                                        value={formData.shiftData.clay.totalClayII}
                                        onChange={(e) => handleClayChange('totalClayII', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="sandrec-table-row">
                                <div className="sandrec-table-cell">Total Clay III</div>
                                <div className="sandrec-table-cell-last">
                                    <input
                                        type="text"
                                        className="sandrec-table-input"
                                        value={formData.shiftData.clay.totalClayIII}
                                        onChange={(e) => handleClayChange('totalClayIII', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sand Properties Section */}
                    <div className="sandrec-section">
                        <h2 className="sandrec-section-title">Sand Properties</h2>
                        
                        <div className="sandrec-grid-main">
                            <div className="sandrec-field-group">
                                <label className="sandrec-field-label">Sand Temp BC</label>
                                <input
                                    type="text"
                                    className="sandrec-field-input"
                                    value={formData.sandProperties.sandTempBC}
                                    onChange={(e) => handleSandPropertiesChange('sandTempBC', e.target.value)}
                                />
                            </div>
                            <div className="sandrec-field-group">
                                <label className="sandrec-field-label">Sand Temp WU</label>
                                <input
                                    type="text"
                                    className="sandrec-field-input"
                                    value={formData.sandProperties.sandTempWU}
                                    onChange={(e) => handleSandPropertiesChange('sandTempWU', e.target.value)}
                                />
                            </div>
                            <div className="sandrec-field-group">
                                <label className="sandrec-field-label">Sand Temp SSU</label>
                                <input
                                    type="text"
                                    className="sandrec-field-input"
                                    value={formData.sandProperties.sandTempSSU}
                                    onChange={(e) => handleSandPropertiesChange('sandTempSSU', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Button Group */}
                    <div className="sandrec-button-group">
                        <button className="sandrec-save-button" onClick={handleSave}>
                            <Save className="sandrec-button-icon" />
                            Save
                        </button>
                        <button className="sandrec-cancel-button" onClick={handleCancel}>
                            <X className="sandrec-button-icon" />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SandTestingForm;