import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw } from 'lucide-react';
import { DatePicker } from '../../Components/Buttons';
import ValidationPopup from '../../Components/ValidationPopup';
import Loader from '../../Components/Loader';
import '../../styles/PageStyles/MeltingLogSheet.css';

const MeltingLogSheet = () => {
  const [formData, setFormData] = useState({
    date: '',
    heatNo: '',
    grade: '',
    // Charging
    chargingTime: '',
    ifBath: '',
    liquidMetalPressPour: '',
    liquidMetalHolder: '',
    sgMsSteel: '',
    greyMsSteel: '',
    ralumsSg: '',
    gl: '',
    pigIron: '',
    borings: '',
    finalBath: '',
    // Materials in kgs
    charCoal: '',
    cpcFur: '',
    cpcLc: '',
    siliconCarbideFur: '',
    ferroSiliconFur: '',
    ferroSiliconLc: '',
    ferroManganeseFur: '',
    ferroManganeseLc: '',
    cu: '',
    cr: '',
    pureMg: '',
    ironPyrite: '',
    // Lab Coin
    labCoinTime: '',
    labCoinTemp: '',
    // Deslaging
    deslagingFrom: '',
    deslagingTo: '',
    metalReadyTime: '',
    // Waiting for Tapping
    waitingFrom: '',
    waitingTo: '',
    waitingReason: '',
    // Metal Tapping
    tappingTime: '',
    tappingTemp: '',
    directFurnace: '',
    holderToFurnace: '',
    furnaceToHolder: '',
    disaNo: '',
    item: '',
    // Electrical Readings - Furnace 1
    f1Kw: '',
    f1V: '',
    f1A: '',
    f1Gld: '',
    f1Hz: '',
    f1BelowKw: '',
    f1BelowA: '',
    f1BelowV: '',
    // Furnace 2
    f2Kw: '',
    f2V: '',
    f2A: '',
    f2Gld: '',
    f2Hz: '',
    f2BelowKw: '',
    f2BelowA: '',
    f2BelowV: '',
    // Furnace 3
    f3Kw: '',
    f3V: '',
    f3A: '',
    f3Gld: '',
    f3Hz: '',
    f3BelowKw: '',
    f3BelowA: '',
    f3BelowV: '',
    // Furnace 4
    f4Kw: '',
    f4V: '',
    f4A: '',
    f4Gld: '',
    f4Hz: '',
    f4BelowHz: '',
    f4BelowGld: '',
    f4BelowGld1: '',
    remarks: ''
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const required = ['date', 'heatNo', 'grade', 'chargingTime'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFields(true);
      return;
    }

    try {
      setSubmitLoading(true);
      // API call would go here
      alert('Melting log entry created successfully!');
      handleReset();
    } catch (error) {
      console.error('Error creating melting log:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      date: '', heatNo: '', grade: '', chargingTime: '', ifBath: '',
      liquidMetalPressPour: '', liquidMetalHolder: '', sgMsSteel: '',
      greyMsSteel: '', ralumsSg: '', gl: '', pigIron: '', borings: '',
      finalBath: '', charCoal: '', cpcFur: '', cpcLc: '', siliconCarbideFur: '',
      ferroSiliconFur: '', ferroSiliconLc: '', ferroManganeseFur: '',
      ferroManganeseLc: '', cu: '', cr: '', pureMg: '', ironPyrite: '',
      labCoinTime: '', labCoinTemp: '', deslagingFrom: '', deslagingTo: '',
      metalReadyTime: '', waitingFrom: '', waitingTo: '', waitingReason: '',
      tappingTime: '', tappingTemp: '', directFurnace: '', holderToFurnace: '',
      furnaceToHolder: '', disaNo: '', item: '',
      f1Kw: '', f1V: '', f1A: '', f1Gld: '', f1Hz: '', f1BelowKw: '', f1BelowA: '', f1BelowV: '',
      f2Kw: '', f2V: '', f2A: '', f2Gld: '', f2Hz: '', f2BelowKw: '', f2BelowA: '', f2BelowV: '',
      f3Kw: '', f3V: '', f3A: '', f3Gld: '', f3Hz: '', f3BelowKw: '', f3BelowA: '', f3BelowV: '',
      f4Kw: '', f4V: '', f4A: '', f4Gld: '', f4Hz: '', f4BelowHz: '', f4BelowGld: '', f4BelowGld1: '',
      remarks: ''
    });
  };

  return (
    <div className="melting-log-container">
      <div className="melting-log-wrapper">
        {showMissingFields && (
          <ValidationPopup
            missingFields={missingFields}
            onClose={() => setShowMissingFields(false)}
          />
        )}

        {/* Entry Form Container */}
        <div className="melting-log-entry-container">
          <div className="melting-log-header">
            <div className="melting-log-header-text">
              <Save size={24} style={{ color: '#5B9AA9' }} />
              <h2>Melting Log Sheet - Entry Form</h2>
            </div>
            <button onClick={handleReset} className="melting-log-reset-btn">
              <RefreshCw size={18} />
              Reset
            </button>
          </div>

          <div className="melting-log-form-grid">
            {/* Basic Information */}
            <div className="melting-log-form-group">
              <label>Date *</label>
              <DatePicker name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div className="melting-log-form-group">
              <label>Heat No *</label>
              <input type="text" name="heatNo" value={formData.heatNo} onChange={handleChange} placeholder="e.g: H2024-001" />
            </div>

            <div className="melting-log-form-group">
              <label>Grade *</label>
              <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="e.g: SG 500/7" />
            </div>

            {/* Charging Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Charging Details (Foundry B)
              </h4>
            </div>

            <div className="melting-log-form-group">
              <label>Charging Time *</label>
              <input type="time" name="chargingTime" value={formData.chargingTime} onChange={handleChange} />
            </div>

            <div className="melting-log-form-group">
              <label>If Bath</label>
              <input type="text" name="ifBath" value={formData.ifBath} onChange={handleChange} placeholder="Yes/No" />
            </div>

            <div className="melting-log-form-group">
              <label>Liquid Metal - Press Pour (kgs)</label>
              <input type="number" name="liquidMetalPressPour" value={formData.liquidMetalPressPour} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Liquid Metal - Holder (kgs)</label>
              <input type="number" name="liquidMetalHolder" value={formData.liquidMetalHolder} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>SG-MS Steel (400-2500 kgs)</label>
              <input type="number" name="sgMsSteel" value={formData.sgMsSteel} onChange={handleChange} min="400" max="2500" placeholder="400" />
            </div>

            <div className="melting-log-form-group">
              <label>Grey MS Steel (400-2500 kgs)</label>
              <input type="number" name="greyMsSteel" value={formData.greyMsSteel} onChange={handleChange} min="400" max="2500" placeholder="400" />
            </div>

            <div className="melting-log-form-group">
              <label>Ralums SG (500-2500 kgs)</label>
              <input type="number" name="ralumsSg" value={formData.ralumsSg} onChange={handleChange} min="500" max="2500" placeholder="500" />
            </div>

            <div className="melting-log-form-group">
              <label>GL (800-2250 kgs)</label>
              <input type="number" name="gl" value={formData.gl} onChange={handleChange} min="800" max="2250" placeholder="800" />
            </div>

            <div className="melting-log-form-group">
              <label>Pig Iron (0-350 kgs)</label>
              <input type="number" name="pigIron" value={formData.pigIron} onChange={handleChange} min="0" max="350" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Borings (0-1500 kgs)</label>
              <input type="number" name="borings" value={formData.borings} onChange={handleChange} min="0" max="1500" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Final Bath (kgs)</label>
              <input type="number" name="finalBath" value={formData.finalBath} onChange={handleChange} placeholder="0" />
            </div>

            {/* Materials Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Materials (All in kgs)
              </h4>
            </div>

            <div className="melting-log-form-group">
              <label>Char Coal (kgs)</label>
              <input type="number" name="charCoal" value={formData.charCoal} onChange={handleChange} step="0.1" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>CPC - FUR (kgs)</label>
              <input type="number" name="cpcFur" value={formData.cpcFur} onChange={handleChange} step="0.1" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>CPC - L/C (kgs)</label>
              <input type="number" name="cpcLc" value={formData.cpcLc} onChange={handleChange} step="0.1" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Silicon Carbide FUR (03-09 kgs)</label>
              <input type="number" name="siliconCarbideFur" value={formData.siliconCarbideFur} onChange={handleChange} step="0.1" min="3" max="9" placeholder="3" />
            </div>

            <div className="melting-log-form-group">
              <label>Ferro Silicon - FUR (kgs)</label>
              <input type="number" name="ferroSiliconFur" value={formData.ferroSiliconFur} onChange={handleChange} step="0.1" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Ferro Silicon - L/C (kgs)</label>
              <input type="number" name="ferroSiliconLc" value={formData.ferroSiliconLc} onChange={handleChange} step="0.1" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Ferro Manganese - FUR (kgs)</label>
              <input type="number" name="ferroManganeseFur" value={formData.ferroManganeseFur} onChange={handleChange} step="0.1" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Ferro Manganese - L/C (kgs)</label>
              <input type="number" name="ferroManganeseLc" value={formData.ferroManganeseLc} onChange={handleChange} step="0.1" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>CU (kgs)</label>
              <input type="number" name="cu" value={formData.cu} onChange={handleChange} step="0.01" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>CR (kgs)</label>
              <input type="number" name="cr" value={formData.cr} onChange={handleChange} step="0.01" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Pure MG (kgs)</label>
              <input type="number" name="pureMg" value={formData.pureMg} onChange={handleChange} step="0.01" placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Iron Pyrite (kgs)</label>
              <input type="number" name="ironPyrite" value={formData.ironPyrite} onChange={handleChange} step="0.1" placeholder="0" />
            </div>

            {/* Lab Coin Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Lab Coin & Timing
              </h4>
            </div>

            <div className="melting-log-form-group">
              <label>Lab Coin Time</label>
              <input type="time" name="labCoinTime" value={formData.labCoinTime} onChange={handleChange} />
            </div>

            <div className="melting-log-form-group">
              <label>Lab Coin Temp (°C)</label>
              <input type="number" name="labCoinTemp" value={formData.labCoinTemp} onChange={handleChange} placeholder="1500" />
            </div>

            <div className="melting-log-form-group">
              <label>Deslaging From</label>
              <input type="time" name="deslagingFrom" value={formData.deslagingFrom} onChange={handleChange} />
            </div>

            <div className="melting-log-form-group">
              <label>Deslaging To</label>
              <input type="time" name="deslagingTo" value={formData.deslagingTo} onChange={handleChange} />
            </div>

            <div className="melting-log-form-group">
              <label>Metal Ready Time</label>
              <input type="time" name="metalReadyTime" value={formData.metalReadyTime} onChange={handleChange} />
            </div>

            <div className="melting-log-form-group">
              <label>Waiting for Tapping - From</label>
              <input type="time" name="waitingFrom" value={formData.waitingFrom} onChange={handleChange} />
            </div>

            <div className="melting-log-form-group">
              <label>Waiting for Tapping - To</label>
              <input type="time" name="waitingTo" value={formData.waitingTo} onChange={handleChange} />
            </div>

            <div className="melting-log-form-group">
              <label>Waiting Reason</label>
              <input type="text" name="waitingReason" value={formData.waitingReason} onChange={handleChange} placeholder="Enter reason" />
            </div>

            {/* Metal Tapping Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Metal Tapping (SG: 1460-1550°C, Grey: 1440-1550°C)
              </h4>
            </div>

            <div className="melting-log-form-group">
              <label>Tapping Time</label>
              <input type="time" name="tappingTime" value={formData.tappingTime} onChange={handleChange} />
            </div>

            <div className="melting-log-form-group">
              <label>Tapping Temp (°C)</label>
              <input type="number" name="tappingTemp" value={formData.tappingTemp} onChange={handleChange} min="1440" max="1550" placeholder="1500" />
            </div>

            <div className="melting-log-form-group">
              <label>Direct Furnace (kgs)</label>
              <input type="number" name="directFurnace" value={formData.directFurnace} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Holder to Furnace (kgs)</label>
              <input type="number" name="holderToFurnace" value={formData.holderToFurnace} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Furnace to Holder (kgs)</label>
              <input type="number" name="furnaceToHolder" value={formData.furnaceToHolder} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Disa No</label>
              <input type="text" name="disaNo" value={formData.disaNo} onChange={handleChange} placeholder="e.g: DISA-1" />
            </div>

            <div className="melting-log-form-group">
              <label>Item</label>
              <input type="text" name="item" value={formData.item} onChange={handleChange} placeholder="Item name" />
            </div>

            {/* Electrical Readings - Furnace 1 */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Electrical Readings - Furnace 1
              </h4>
            </div>

            <div className="melting-log-form-group">
              <label>KW (2000-3000)</label>
              <input type="number" name="f1Kw" value={formData.f1Kw} onChange={handleChange} min="2000" max="3000" placeholder="2500" />
            </div>

            <div className="melting-log-form-group">
              <label>V (2000-3000)</label>
              <input type="number" name="f1V" value={formData.f1V} onChange={handleChange} min="2000" max="3000" placeholder="2500" />
            </div>

            <div className="melting-log-form-group">
              <label>A (1000-1500)</label>
              <input type="number" name="f1A" value={formData.f1A} onChange={handleChange} min="1000" max="1500" placeholder="1200" />
            </div>

            <div className="melting-log-form-group">
              <label>GLD (Max 80)</label>
              <input type="number" name="f1Gld" value={formData.f1Gld} onChange={handleChange} max="80" placeholder="60" />
            </div>

            <div className="melting-log-form-group">
              <label>HZ (200-250)</label>
              <input type="number" name="f1Hz" value={formData.f1Hz} onChange={handleChange} min="200" max="250" placeholder="225" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - KW</label>
              <input type="number" name="f1BelowKw" value={formData.f1BelowKw} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - A</label>
              <input type="number" name="f1BelowA" value={formData.f1BelowA} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - V</label>
              <input type="number" name="f1BelowV" value={formData.f1BelowV} onChange={handleChange} placeholder="0" />
            </div>

            {/* Electrical Readings - Furnace 2 */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Electrical Readings - Furnace 2
              </h4>
            </div>

            <div className="melting-log-form-group">
              <label>KW (2000-3000)</label>
              <input type="number" name="f2Kw" value={formData.f2Kw} onChange={handleChange} min="2000" max="3000" placeholder="2500" />
            </div>

            <div className="melting-log-form-group">
              <label>V (2000-3000)</label>
              <input type="number" name="f2V" value={formData.f2V} onChange={handleChange} min="2000" max="3000" placeholder="2500" />
            </div>

            <div className="melting-log-form-group">
              <label>A (1000-1500)</label>
              <input type="number" name="f2A" value={formData.f2A} onChange={handleChange} min="1000" max="1500" placeholder="1200" />
            </div>

            <div className="melting-log-form-group">
              <label>GLD (Max 80)</label>
              <input type="number" name="f2Gld" value={formData.f2Gld} onChange={handleChange} max="80" placeholder="60" />
            </div>

            <div className="melting-log-form-group">
              <label>HZ (200-250)</label>
              <input type="number" name="f2Hz" value={formData.f2Hz} onChange={handleChange} min="200" max="250" placeholder="225" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - KW</label>
              <input type="number" name="f2BelowKw" value={formData.f2BelowKw} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - A</label>
              <input type="number" name="f2BelowA" value={formData.f2BelowA} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - V</label>
              <input type="number" name="f2BelowV" value={formData.f2BelowV} onChange={handleChange} placeholder="0" />
            </div>

            {/* Electrical Readings - Furnace 3 */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Electrical Readings - Furnace 3
              </h4>
            </div>

            <div className="melting-log-form-group">
              <label>KW (2000-3000)</label>
              <input type="number" name="f3Kw" value={formData.f3Kw} onChange={handleChange} min="2000" max="3000" placeholder="2500" />
            </div>

            <div className="melting-log-form-group">
              <label>V (2000-3000)</label>
              <input type="number" name="f3V" value={formData.f3V} onChange={handleChange} min="2000" max="3000" placeholder="2500" />
            </div>

            <div className="melting-log-form-group">
              <label>A (1000-1500)</label>
              <input type="number" name="f3A" value={formData.f3A} onChange={handleChange} min="1000" max="1500" placeholder="1200" />
            </div>

            <div className="melting-log-form-group">
              <label>GLD (Max 80)</label>
              <input type="number" name="f3Gld" value={formData.f3Gld} onChange={handleChange} max="80" placeholder="60" />
            </div>

            <div className="melting-log-form-group">
              <label>HZ (200-250)</label>
              <input type="number" name="f3Hz" value={formData.f3Hz} onChange={handleChange} min="200" max="250" placeholder="225" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - KW</label>
              <input type="number" name="f3BelowKw" value={formData.f3BelowKw} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - A</label>
              <input type="number" name="f3BelowA" value={formData.f3BelowA} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - V</label>
              <input type="number" name="f3BelowV" value={formData.f3BelowV} onChange={handleChange} placeholder="0" />
            </div>

            {/* Electrical Readings - Furnace 4 */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Electrical Readings - Furnace 4 (Different Specifications)
              </h4>
            </div>

            <div className="melting-log-form-group">
              <label>KW (2500-4000)</label>
              <input type="number" name="f4Kw" value={formData.f4Kw} onChange={handleChange} min="2500" max="4000" placeholder="3000" />
            </div>

            <div className="melting-log-form-group">
              <label>V (2000-3000)</label>
              <input type="number" name="f4V" value={formData.f4V} onChange={handleChange} min="2000" max="3000" placeholder="2500" />
            </div>

            <div className="melting-log-form-group">
              <label>A (1000-2200)</label>
              <input type="number" name="f4A" value={formData.f4A} onChange={handleChange} min="1000" max="2200" placeholder="1500" />
            </div>

            <div className="melting-log-form-group">
              <label>GLD (Max 80)</label>
              <input type="number" name="f4Gld" value={formData.f4Gld} onChange={handleChange} max="80" placeholder="60" />
            </div>

            <div className="melting-log-form-group">
              <label>HZ (200-300)</label>
              <input type="number" name="f4Hz" value={formData.f4Hz} onChange={handleChange} min="200" max="300" placeholder="250" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - HZ</label>
              <input type="number" name="f4BelowHz" value={formData.f4BelowHz} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - GLD</label>
              <input type="number" name="f4BelowGld" value={formData.f4BelowGld} onChange={handleChange} placeholder="0" />
            </div>

            <div className="melting-log-form-group">
              <label>Below - GLD1</label>
              <input type="number" name="f4BelowGld1" value={formData.f4BelowGld1} onChange={handleChange} placeholder="0" />
            </div>

            {/* Remarks */}
            <div className="melting-log-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                placeholder="Enter any additional notes or observations..."
              />
            </div>
          </div>

          <div className="melting-log-submit-container">
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="melting-log-submit-btn"
            >
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </button>
          </div>
        </div>


        {/* Report Container */}
        <div className="melting-log-report-container">
          <div className="melting-log-report-title">
            <Filter size={20} style={{ color: '#FF7F50' }} />
            <h3>Melting Log Sheet - Report</h3>
          </div>

          <div className="melting-log-filter-grid">
            <div className="melting-log-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="melting-log-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="melting-log-filter-btn-container">
              <button onClick={() => {}} className="melting-log-filter-btn">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          <div className="melting-log-table-container">
            <table className="melting-log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Heat No</th>
                  <th>Grade</th>
                  <th>Charging Time</th>
                  <th>Lab Coin Temp</th>
                  <th>Tapping Time</th>
                  <th>Metal Ready Time</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" className="melting-log-no-records">
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

export default MeltingLogSheet;
