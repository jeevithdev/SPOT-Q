import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RefreshCw, FileText, Loader2 } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/MeltingLogSheet.css';

const MeltingLogSheet = () => {
  const navigate = useNavigate();
  
  // Primary: Date, Shift, Furnace No., Panel, Cumulative Liquid metal, Final KWHr, Initial KWHr, Total Units, Cumulative Units
  const [primaryData, setPrimaryData] = useState({
    date: '',
    shift: '',
    furnaceNo: '',
    panel: '',
    cumulativeLiquidMetal: '',
    finalKWHr: '',
    initialKWHr: '',
    totalUnits: '',
    cumulativeUnits: ''
  });
  const [primaryLoading, setPrimaryLoading] = useState(false);
  
  const [table1, setTable1] = useState({
    heatNo: '',
    grade: '',
    chargingTime: '',
    ifBath: '',
    liquidMetalPressPour: '',
    liquidMetalHolder: '',
    sgMsSteel: '',
    greyMsSteel: '',
    returnsSg: '',
    gl: '',
    pigIron: '',
    borings: '',
    finalBath: ''
  });
  const [table2, setTable2] = useState({
    charCoal: '',
    cpcFur: '',
    cpcLc: '',
    siliconCarbideFur: '',
    ferrosiliconFur: '',
    ferrosiliconLc: '',
    ferroManganeseFur: '',
    ferroManganeseLc: '',
    cu: '',
    cr: '',
    pureMg: '',
    ironPyrite: ''
  });
  const [table3, setTable3] = useState({
    labCoinTime: '',
    labCoinTempC: '',
    deslagingTimeFrom: '',
    deslagingTimeTo: '',
    metalReadyTime: '',
    waitingForTappingFrom: '',
    waitingForTappingTo: '',
    reason: ''
  });
  const [table4, setTable4] = useState({
    time: '',
    tempCSg: '',
    tempCGrey: '',
    directFurnace: '',
    holderToFurnace: '',
    furnaceToHolder: '',
    disaNo: '',
    item: ''
  });
  const [table5, setTable5] = useState({
    furnace1Kw: '',
    furnace1A: '',
    furnace1V: '',
    furnace2Kw: '',
    furnace2A: '',
    furnace2V: '',
    furnace3Kw: '',
    furnace3A: '',
    furnace3V: '',
    furnace4Hz: '',
    furnace4Gld: '',
    furnace4KwHr: ''
  });

  const [loadingStates, setLoadingStates] = useState({
    table1: false,
    table2: false,
    table3: false,
    table4: false,
    table5: false
  });

  const handleTableChange = (tableNum, field, value) => {
    const setters = {
      1: setTable1,
      2: setTable2,
      3: setTable3,
      4: setTable4,
      5: setTable5
    };
    
    setters[tableNum](prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTableSubmit = async (tableNum) => {
    const tables = { 1: table1, 2: table2, 3: table3, 4: table4, 5: table5 };
    const tableData = tables[tableNum];
    
    setLoadingStates(prev => ({ ...prev, [`table${tableNum}`]: true }));
    
    try {
      // TODO: Update with actual API endpoint
      const response = await api.post(`/v1/melting-logs/table${tableNum}`, {
        tableNum,
        data: tableData
      });
      
      if (response.success) {
        alert(`Table ${tableNum} saved successfully!`);
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      console.error(`Error saving table ${tableNum}:`, error);
      alert(`Failed to save table ${tableNum}. Please try again.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`table${tableNum}`]: false }));
    }
  };

  const handlePrimaryChange = (field, value) => {
    setPrimaryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrimarySubmit = async () => {
    setPrimaryLoading(true);
    
    try {
      // TODO: Update with actual API endpoint
      const response = await api.post('/v1/melting-logs/primary', {
        data: primaryData
      });
      
      if (response.success) {
        alert('Primary data saved successfully!');
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      console.error('Error saving primary data:', error);
      alert('Failed to save primary data. Please try again.');
    } finally {
      setPrimaryLoading(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset all tables?')) return;
    setPrimaryData({
      date: '',
      shift: '',
      furnaceNo: '',
      panel: '',
      cumulativeLiquidMetal: '',
      finalKWHr: '',
      initialKWHr: '',
      totalUnits: '',
      cumulativeUnits: ''
    });
    setTable1({
      heatNo: '',
      grade: '',
      chargingTime: '',
      ifBath: '',
      liquidMetalPressPour: '',
      liquidMetalHolder: '',
      sgMsSteel: '',
      greyMsSteel: '',
      returnsSg: '',
      gl: '',
      pigIron: '',
      borings: '',
      finalBath: ''
    });
    setTable2({
      charCoal: '',
      cpcFur: '',
      cpcLc: '',
      siliconCarbideFur: '',
      ferrosiliconFur: '',
      ferrosiliconLc: '',
      ferroManganeseFur: '',
      ferroManganeseLc: '',
      cu: '',
      cr: '',
      pureMg: '',
      ironPyrite: ''
    });
    setTable3({
      labCoinTime: '',
      labCoinTempC: '',
      deslagingTimeFrom: '',
      deslagingTimeTo: '',
      metalReadyTime: '',
      waitingForTappingFrom: '',
      waitingForTappingTo: '',
      reason: ''
    });
    setTable4({
      time: '',
      tempCSg: '',
      tempCGrey: '',
      directFurnace: '',
      holderToFurnace: '',
      furnaceToHolder: '',
      disaNo: '',
      item: ''
    });
    setTable5({
      furnace1Kw: '',
      furnace1A: '',
      furnace1V: '',
      furnace2Kw: '',
      furnace2A: '',
      furnace2V: '',
      furnace3Kw: '',
      furnace3A: '',
      furnace3V: '',
      furnace4Hz: '',
      furnace4Gld: '',
      furnace4KwHr: ''
    });
  };

  const handleViewReport = () => {
    navigate('/melting/melting-log-sheet/report');
  };

  return (
    <>
      {/* Header */}
      <div className="cupola-holder-header">
        <div className="cupola-holder-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Melting Log Sheet - Entry Form
            <button 
              className="cupola-holder-view-report-btn"
              onClick={handleViewReport}
              title="View Reports"
            >
              <FileText size={14} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
        <div className="cupola-holder-header-buttons">
          <button 
            className="cupola-holder-reset-btn"
            onClick={handleReset}
          >
            <RefreshCw size={18} />
            Reset Form
          </button>
        </div>
      </div>

      {/* Primary Section */}
      <div className="melting-log-main-card">
        <h3 className="melting-log-main-card-title">Primary Information</h3>
        
        <div className="melting-log-form-grid">
          <div className="melting-log-form-group">
            <label>Date *</label>
              <CustomDatePicker
                value={primaryData.date}
                onChange={(e) => handlePrimaryChange('date', e.target.value)}
                name="date"
              />
          </div>

          <div className="melting-log-form-group">
            <label>Shift</label>
          <input
                type="text"
                value={primaryData.shift}
                onChange={(e) => handlePrimaryChange('shift', e.target.value)}
                placeholder="Enter shift"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Furnace No.</label>
          <input
                type="text"
                value={primaryData.furnaceNo}
                onChange={(e) => handlePrimaryChange('furnaceNo', e.target.value)}
                placeholder="Enter furnace no"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Panel</label>
          <input
                type="text"
                value={primaryData.panel}
                onChange={(e) => handlePrimaryChange('panel', e.target.value)}
                placeholder="Enter panel"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Cumulative Liquid Metal</label>
          <input
                type="number"
                value={primaryData.cumulativeLiquidMetal}
                onChange={(e) => handlePrimaryChange('cumulativeLiquidMetal', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Final KWHr</label>
          <input
                type="number"
                value={primaryData.finalKWHr}
                onChange={(e) => handlePrimaryChange('finalKWHr', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Initial KWHr</label>
          <input
                type="number"
                value={primaryData.initialKWHr}
                onChange={(e) => handlePrimaryChange('initialKWHr', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Total Units</label>
          <input
                type="number"
                value={primaryData.totalUnits}
                onChange={(e) => handlePrimaryChange('totalUnits', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Cumulative Units</label>
          <input
                type="number"
                value={primaryData.cumulativeUnits}
                onChange={(e) => handlePrimaryChange('cumulativeUnits', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>
        </div>

        <div className="melting-log-submit-container">
        <button
            className="cupola-holder-submit-btn"
          onClick={handlePrimarySubmit}
          disabled={primaryLoading || !primaryData.date}
        >
            {primaryLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
          {primaryLoading ? 'Saving...' : 'Save Primary'}
        </button>
        </div>
            </div>

      {/* Table 1 */}
      <div className="melting-log-main-card">
        <h3 className="melting-log-main-card-title">Table 1 - Charging Details</h3>
        
        <div className="melting-log-form-grid">
          <div className="melting-log-form-group">
            <label>Heat No</label>
          <input
                type="text"
                value={table1.heatNo || ''}
                onChange={(e) => handleTableChange(1, 'heatNo', e.target.value)}
                placeholder="Enter heat no"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Grade</label>
          <input
                type="text"
                value={table1.grade || ''}
                onChange={(e) => handleTableChange(1, 'grade', e.target.value)}
                placeholder="Enter grade"
            />
          </div>
        </div>

        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">Charging (in Kgs)</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>Charging Time</label>
          <input
                type="time"
                value={table1.chargingTime || ''}
                onChange={(e) => handleTableChange(1, 'chargingTime', e.target.value)}
              />
            </div>

            <div className="melting-log-form-group">
              <label>If Bath</label>
          <input
                type="text"
                value={table1.ifBath || ''}
                onChange={(e) => handleTableChange(1, 'ifBath', e.target.value)}
                placeholder="Enter if bath"
              />
            </div>
          </div>
        </div>

        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">Liquid Metal</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>Press Pour (kgs)</label>
          <input
                type="number"
                value={table1.liquidMetalPressPour || ''}
                onChange={(e) => handleTableChange(1, 'liquidMetalPressPour', e.target.value)}
                placeholder="Enter value"
                step="0.01"
              />
            </div>

            <div className="melting-log-form-group">
              <label>Holder (kgs)</label>
          <input
                type="number"
                value={table1.liquidMetalHolder || ''}
                onChange={(e) => handleTableChange(1, 'liquidMetalHolder', e.target.value)}
                placeholder="Enter value"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="melting-log-form-grid">
          <div className="melting-log-form-group">
            <label>SG-MS Steel (400 - 2500 kgs)</label>
          <input
                type="number"
                value={table1.sgMsSteel || ''}
                onChange={(e) => handleTableChange(1, 'sgMsSteel', e.target.value)}
                placeholder="Enter value"
                min="400"
                max="2500"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Grey MS Steel (400 - 2500 kgs)</label>
          <input
                type="number"
                value={table1.greyMsSteel || ''}
                onChange={(e) => handleTableChange(1, 'greyMsSteel', e.target.value)}
                placeholder="Enter value"
                min="400"
                max="2500"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Returns SG (500 - 2500 kgs)</label>
          <input
                type="number"
                value={table1.returnsSg || ''}
                onChange={(e) => handleTableChange(1, 'returnsSg', e.target.value)}
                placeholder="Enter value"
                min="500"
                max="2500"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>GL (900 - 2250 kgs)</label>
          <input
                type="number"
                value={table1.gl || ''}
                onChange={(e) => handleTableChange(1, 'gl', e.target.value)}
                placeholder="Enter value"
                min="900"
                max="2250"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Pig Iron (0 - 350 kgs)</label>
          <input
                type="number"
                value={table1.pigIron || ''}
                onChange={(e) => handleTableChange(1, 'pigIron', e.target.value)}
                placeholder="Enter value"
                min="0"
                max="350"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Borings (0 - 1900 kgs)</label>
          <input
                type="number"
                value={table1.borings || ''}
                onChange={(e) => handleTableChange(1, 'borings', e.target.value)}
                placeholder="Enter value"
                min="0"
                max="1900"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Final Bath (kgs)</label>
          <input
                type="number"
                value={table1.finalBath || ''}
                onChange={(e) => handleTableChange(1, 'finalBath', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>
        </div>

        <div className="melting-log-submit-container">
        <button
            className="cupola-holder-submit-btn"
          onClick={() => handleTableSubmit(1)}
          disabled={loadingStates.table1}
        >
            {loadingStates.table1 ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
          {loadingStates.table1 ? 'Saving...' : 'Save Table 1'}
        </button>
        </div>
            </div>

      {/* Table 2 */}
      <div className="melting-log-main-card">
        <h3 className="melting-log-main-card-title">Table 2 - Additions (All in kgs)</h3>
        
        <div className="melting-log-form-grid">
          <div className="melting-log-form-group">
            <label>CharCoal (kgs)</label>
          <input
                type="number"
                value={table2.charCoal || ''}
                onChange={(e) => handleTableChange(2, 'charCoal', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>
        </div>

        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">CPC</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>CPC - Fur (kgs)</label>
          <input
                type="number"
                value={table2.cpcFur || ''}
                onChange={(e) => handleTableChange(2, 'cpcFur', e.target.value)}
                placeholder="Enter value"
                step="0.01"
              />
            </div>

            <div className="melting-log-form-group">
              <label>CPC - LC (kgs)</label>
          <input
                type="number"
                value={table2.cpcLc || ''}
                onChange={(e) => handleTableChange(2, 'cpcLc', e.target.value)}
                placeholder="Enter value"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">Silicon Carbide (0.03 to 0.09)</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>Silicon Carbide - Fur (kgs)</label>
          <input
                type="number"
                value={table2.siliconCarbideFur || ''}
                onChange={(e) => handleTableChange(2, 'siliconCarbideFur', e.target.value)}
                placeholder="Enter value (0.03 to 0.09)"
                min="0.03"
                max="0.09"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">Ferrosilicon</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>Ferrosilicon - Fur (kgs)</label>
          <input
                type="number"
                value={table2.ferrosiliconFur || ''}
                onChange={(e) => handleTableChange(2, 'ferrosiliconFur', e.target.value)}
                placeholder="Enter value"
                step="0.01"
              />
            </div>

            <div className="melting-log-form-group">
              <label>Ferrosilicon - LC (kgs)</label>
          <input
                type="number"
                value={table2.ferrosiliconLc || ''}
                onChange={(e) => handleTableChange(2, 'ferrosiliconLc', e.target.value)}
                placeholder="Enter value"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">FerroManganese</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>FerroManganese - Fur (kgs)</label>
          <input
                type="number"
                value={table2.ferroManganeseFur || ''}
                onChange={(e) => handleTableChange(2, 'ferroManganeseFur', e.target.value)}
                placeholder="Enter value"
                step="0.01"
              />
            </div>

            <div className="melting-log-form-group">
              <label>FerroManganese - LC (kgs)</label>
          <input
                type="number"
                value={table2.ferroManganeseLc || ''}
                onChange={(e) => handleTableChange(2, 'ferroManganeseLc', e.target.value)}
                placeholder="Enter value"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="melting-log-form-grid">
          <div className="melting-log-form-group">
            <label>Cu (kgs)</label>
          <input
                type="number"
                value={table2.cu || ''}
                onChange={(e) => handleTableChange(2, 'cu', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Cr (kgs)</label>
          <input
                type="number"
                value={table2.cr || ''}
                onChange={(e) => handleTableChange(2, 'cr', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Pure Mg (kgs)</label>
          <input
                type="number"
                value={table2.pureMg || ''}
                onChange={(e) => handleTableChange(2, 'pureMg', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>

          <div className="melting-log-form-group">
            <label>Iron Pyrite (kgs)</label>
          <input
                type="number"
                value={table2.ironPyrite || ''}
                onChange={(e) => handleTableChange(2, 'ironPyrite', e.target.value)}
                placeholder="Enter value"
                step="0.01"
            />
          </div>
        </div>

        <div className="melting-log-submit-container">
        <button
            className="cupola-holder-submit-btn"
          onClick={() => handleTableSubmit(2)}
          disabled={loadingStates.table2}
        >
            {loadingStates.table2 ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
          {loadingStates.table2 ? 'Saving...' : 'Save Table 2'}
        </button>
        </div>
            </div>

      {/* Table 3 */}
      <div className="melting-log-main-card">
        <h3 className="melting-log-main-card-title">Table 3 - Timing Details</h3>
        
        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">Lab Coin</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>Lab Coin Time</label>
          <input
                type="time"
                value={table3.labCoinTime || ''}
                onChange={(e) => handleTableChange(3, 'labCoinTime', e.target.value)}
              />
            </div>

            <div className="melting-log-form-group">
              <label>Lab Coin Temp (°C)</label>
          <input
                type="number"
                value={table3.labCoinTempC || ''}
                onChange={(e) => handleTableChange(3, 'labCoinTempC', e.target.value)}
                placeholder="Enter temperature in °C"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">Deslaging Time</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>Deslaging Time From</label>
          <input
                type="time"
                value={table3.deslagingTimeFrom || ''}
                onChange={(e) => handleTableChange(3, 'deslagingTimeFrom', e.target.value)}
              />
            </div>

            <div className="melting-log-form-group">
              <label>Deslaging Time To</label>
          <input
                type="time"
                value={table3.deslagingTimeTo || ''}
                onChange={(e) => handleTableChange(3, 'deslagingTimeTo', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="melting-log-form-grid">
          <div className="melting-log-form-group">
            <label>Metal Ready Time</label>
          <input
                type="time"
                value={table3.metalReadyTime || ''}
                onChange={(e) => handleTableChange(3, 'metalReadyTime', e.target.value)}
            />
          </div>
        </div>

        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">Waiting for Tapping</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>Waiting for Tapping From</label>
          <input
                type="time"
                value={table3.waitingForTappingFrom || ''}
                onChange={(e) => handleTableChange(3, 'waitingForTappingFrom', e.target.value)}
              />
            </div>

            <div className="melting-log-form-group">
              <label>Waiting for Tapping To</label>
          <input
                type="time"
                value={table3.waitingForTappingTo || ''}
                onChange={(e) => handleTableChange(3, 'waitingForTappingTo', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="melting-log-form-grid">
          <div className="melting-log-form-group">
            <label>Reason</label>
          <input
                type="text"
                value={table3.reason || ''}
                onChange={(e) => handleTableChange(3, 'reason', e.target.value)}
                placeholder="Enter reason"
            />
          </div>
        </div>

        <div className="melting-log-submit-container">
        <button
            className="cupola-holder-submit-btn"
          onClick={() => handleTableSubmit(3)}
          disabled={loadingStates.table3}
        >
            {loadingStates.table3 ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
          {loadingStates.table3 ? 'Saving...' : 'Save Table 3'}
        </button>
        </div>
      </div>

      {/* Table 4 - Metal Tapping in Kgs */}
      <div className="melting-log-main-card">
        <h3 className="melting-log-main-card-title">Table 4 - Metal Tapping (in Kgs)</h3>
        
        <div className="melting-log-form-grid">
        <div className="melting-log-form-group">
          <label>Time</label>
          <input
            type="time"
            value={table4.time || ''}
            onChange={(e) => handleTableChange(4, 'time', e.target.value)}
          />
        </div>

        <div className="melting-log-form-group">
          <label>Temp C SG (1460 - 1550 °C)</label>
          <input
                type="number"
                value={table4.tempCSg || ''}
                onChange={(e) => handleTableChange(4, 'tempCSg', e.target.value)}
                placeholder="Enter temperature (1460 - 1550)"
                min="1460"
                max="1550"
                step="0.01"
          />
        </div>

        <div className="melting-log-form-group">
          <label>Temp C Grey (1440 - 1550 °C)</label>
          <input
                type="number"
                value={table4.tempCGrey || ''}
                onChange={(e) => handleTableChange(4, 'tempCGrey', e.target.value)}
                placeholder="Enter temperature (1440 - 1550)"
                min="1440"
                max="1550"
                step="0.01"
          />
        </div>

        <div className="melting-log-form-group">
          <label>Direct Furnace (kgs)</label>
          <input
                type="number"
                value={table4.directFurnace || ''}
                onChange={(e) => handleTableChange(4, 'directFurnace', e.target.value)}
                placeholder="Enter value"
                step="0.01"
          />
        </div>

        <div className="melting-log-form-group">
          <label>Holder To Furnace (kgs)</label>
          <input
                type="number"
                value={table4.holderToFurnace || ''}
                onChange={(e) => handleTableChange(4, 'holderToFurnace', e.target.value)}
                placeholder="Enter value"
                step="0.01"
          />
        </div>

        <div className="melting-log-form-group">
          <label>Furnace To Holder (kgs)</label>
          <input
                type="number"
                value={table4.furnaceToHolder || ''}
                onChange={(e) => handleTableChange(4, 'furnaceToHolder', e.target.value)}
                placeholder="Enter value"
                step="0.01"
          />
        </div>

        <div className="melting-log-form-group">
          <label>Disa No.</label>
          <input
                type="text"
                value={table4.disaNo || ''}
                onChange={(e) => handleTableChange(4, 'disaNo', e.target.value)}
                placeholder="Enter Disa No."
          />
        </div>

        <div className="melting-log-form-group">
          <label>Item</label>
          <input
                type="text"
                value={table4.item || ''}
                onChange={(e) => handleTableChange(4, 'item', e.target.value)}
                placeholder="Enter item"
          />
        </div>
      </div>

        <div className="melting-log-submit-container">
          <button
            className="cupola-holder-submit-btn"
            onClick={() => handleTableSubmit(4)}
            disabled={loadingStates.table4}
          >
            {loadingStates.table4 ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
            {loadingStates.table4 ? 'Saving...' : 'Save Metal Tapping in Kgs'}
          </button>
        </div>
      </div>

      {/* Table 5 - Electrical Readings */}
      <div className="melting-log-main-card">
        <h3 className="melting-log-main-card-title">Table 5 - Electrical Readings</h3>
        
        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">Furnace 1, 2, 3</h4>
          <div className="melting-log-form-grid">

        <div className="melting-log-form-group">
          <label>Kw</label>
          <input
            type="number"
            value={table5.furnace1Kw || ''}
            onChange={(e) => handleTableChange(5, 'furnace1Kw', e.target.value)}
            placeholder="Enter Kw"
            step="0.01"
          />
        </div>

        <div className="melting-log-form-group">
          <label>A</label>
          <input
                type="number"
                value={table5.furnace1A || ''}
                onChange={(e) => handleTableChange(5, 'furnace1A', e.target.value)}
                placeholder="Enter A"
                step="0.01"
          />
        </div>

        <div className="melting-log-form-group">
          <label>V</label>
          <input
                type="number"
                value={table5.furnace1V || ''}
                onChange={(e) => handleTableChange(5, 'furnace1V', e.target.value)}
                placeholder="Enter V"
                step="0.01"
          />
        </div>

          </div>
        </div>

        <div className="melting-log-sub-section">
          <h4 className="melting-log-sub-section-title">Furnace 4</h4>
          <div className="melting-log-form-grid">
            <div className="melting-log-form-group">
              <label>Furnace 4 - Hz</label>
          <input
                type="number"
                value={table5.furnace4Hz || ''}
                onChange={(e) => handleTableChange(5, 'furnace4Hz', e.target.value)}
                placeholder="Enter Hz"
                step="0.01"
              />
            </div>

            <div className="melting-log-form-group">
              <label>Furnace 4 - GLD</label>
          <input
                type="number"
                value={table5.furnace4Gld || ''}
                onChange={(e) => handleTableChange(5, 'furnace4Gld', e.target.value)}
                placeholder="Enter GLD"
                step="0.01"
              />
            </div>

            <div className="melting-log-form-group">
              <label>Furnace 4 - Kw/Hr</label>
          <input
                type="number"
                value={table5.furnace4KwHr || ''}
                onChange={(e) => handleTableChange(5, 'furnace4KwHr', e.target.value)}
                placeholder="Enter Kw/Hr"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="melting-log-submit-container">
          <button
            className="cupola-holder-submit-btn"
            onClick={() => handleTableSubmit(5)}
            disabled={loadingStates.table5}
          >
            {loadingStates.table5 ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
            {loadingStates.table5 ? 'Saving...' : 'Save Electrical Readings'}
          </button>
        </div>
      </div>
    </>
  );
};

export default MeltingLogSheet;
