import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, RefreshCw, FileText, Loader2 } from "lucide-react";
import CustomDatePicker from '../../Components/CustomDatePicker';
import api from '../../utils/api';
import '../../styles/PageStyles/Moulding/DmmSettingParameters.css';

const initialRow = {
  customer: "",
  itemDescription: "",
  time: "",
  ppThickness: "",
  ppHeight: "",
  spThickness: "",
  spHeight: "",
  spCoreMaskThickness: "",
  spCoreMaskHeight: "",
  ppCoreMaskThickness: "",
  ppCoreMaskHeight: "",
  sandShotPressureBar: "",
  correctionShotTime: "",
  squeezePressure: "",
  ppStrippingAcceleration: "",
  ppStrippingDistance: "",
  spStrippingAcceleration: "",
  spStrippingDistance: "",
  mouldThicknessPlus10: "",
  closeUpForceMouldCloseUpPressure: "",
  remarks: "",
};


const DmmSettingParameters = () => {
  const navigate = useNavigate();
  const [primaryData, setPrimaryData] = useState({
    date: '',
    machine: ''
  });
  const [isPrimaryLocked, setIsPrimaryLocked] = useState(false);
  const [checkingData, setCheckingData] = useState(false);
  const [operationData, setOperationData] = useState({
    shift1: {
      operatorName: '',
      operatedBy: ''
    },
    shift2: {
      operatorName: '',
      operatedBy: ''
    },
    shift3: {
      operatorName: '',
      operatedBy: ''
    }
  });
  const [shift1Row, setShift1Row] = useState({ ...initialRow });
  const [shift2Row, setShift2Row] = useState({ ...initialRow });
  const [shift3Row, setShift3Row] = useState({ ...initialRow });
  const [loadingStates, setLoadingStates] = useState({
    operation: false,
    shift1: false,
    shift2: false,
    shift3: false
  });

  const handlePrimaryChange = (field, value) => {
    setPrimaryData((prev) => {
      const updated = { ...prev, [field]: value };
      // Check for existing data when date or machine changes
      if ((field === 'date' || field === 'machine') && updated.date && updated.machine) {
        checkExistingPrimaryData(updated.date, updated.machine);
      }
      return updated;
    });
  };

  // Check if primary data exists for date and machine combination
  const checkExistingPrimaryData = async (date, machine) => {
    if (!date || !machine) {
      setIsPrimaryLocked(false);
      return;
    }

    try {
      setCheckingData(true);
      const response = await api.get(`/v1/dmm-settings/primary?date=${encodeURIComponent(date)}&machine=${encodeURIComponent(machine)}`);
      
      if (response.success && response.data && response.data.length > 0) {
        const record = response.data[0];
        // If record exists, lock primary fields and populate them
        setIsPrimaryLocked(true);
        setPrimaryData({
          date: record.date ? new Date(record.date).toISOString().split('T')[0] : date,
          machine: record.machine ? String(record.machine) : machine
        });
      } else {
        setIsPrimaryLocked(false);
      }
    } catch (error) {
      console.error('Error checking primary data:', error);
      setIsPrimaryLocked(false);
    } finally {
      setCheckingData(false);
    }
  };

  // Handle primary data submission
  const handlePrimarySubmit = async (e) => {
    e.preventDefault();
    
    if (!primaryData.date || !primaryData.machine) {
      alert('Please fill in both Date and Machine fields');
      return;
    }

    // Check if already locked
    if (isPrimaryLocked) {
      alert('Primary data is already locked. Use Reports page to edit.');
      return;
    }

    try {
      setCheckingData(true);
      const payload = {
        date: primaryData.date,
        machine: parseInt(primaryData.machine) || primaryData.machine,
        section: 'primary'
      };

      const data = await api.post('/v1/dmm-settings', payload);
      
      if (data.success) {
        alert('Primary data saved successfully!');
        setIsPrimaryLocked(true);
      }
    } catch (error) {
      console.error('Error saving primary data:', error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    } finally {
      setCheckingData(false);
    }
  };

  const handleOperationChange = (shift, field, value) => {
    setOperationData((prev) => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [field]: value
      }
    }));
  };

  const handleInputChange = (shift, field, value) => {
    if (shift === 1) {
      setShift1Row((prev) => ({ ...prev, [field]: value }));
    } else if (shift === 2) {
      setShift2Row((prev) => ({ ...prev, [field]: value }));
    } else if (shift === 3) {
      setShift3Row((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle Operation table submission
  const handleOperationSubmit = async (e) => {
    e.preventDefault();
    if (!primaryData.date || !primaryData.machine) {
      alert('Please fill in Primary data (Date and Machine) first');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, operation: true }));
      const payload = {
        date: primaryData.date,
        machine: primaryData.machine,
        section: 'operation',
        shifts: {
          shift1: {
            operatorName: operationData.shift1.operatorName,
            checkedBy: operationData.shift1.operatedBy
          },
          shift2: {
            operatorName: operationData.shift2.operatorName,
            checkedBy: operationData.shift2.operatedBy
          },
          shift3: {
            operatorName: operationData.shift3.operatorName,
            checkedBy: operationData.shift3.operatedBy
          }
        }
      };

      const data = await api.post('/v1/dmm-settings', payload);
      if (data.success) {
        alert('Operation data saved successfully!');
      }
    } catch (error) {
      console.error('Error saving operation data:', error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, operation: false }));
    }
  };

  // Handle Shift parameter submission
  const handleShiftSubmit = async (e, shiftNumber) => {
    e.preventDefault();
    if (!primaryData.date || !primaryData.machine) {
      alert('Please fill in Primary data (Date and Machine) first');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, [`shift${shiftNumber}`]: true }));
      const shiftRow = shiftNumber === 1 ? shift1Row : shiftNumber === 2 ? shift2Row : shift3Row;
      
      const payload = {
        date: primaryData.date,
        machine: primaryData.machine,
        section: `shift${shiftNumber}`,
        parameters: {
          [`shift${shiftNumber}`]: shiftRow
        }
      };

      const data = await api.post('/v1/dmm-settings', payload);
      if (data.success) {
        alert(`Shift ${shiftNumber} Parameters saved successfully!`);
      }
    } catch (error) {
      console.error(`Error saving shift ${shiftNumber} data:`, error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, [`shift${shiftNumber}`]: false }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form || e.target.closest('.dmm-content');
      const inputs = Array.from(form.querySelectorAll('input:not([type="button"])'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };


  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset the entire form? All unsaved data will be lost.')) return;
    setPrimaryData({ date: '', machine: '' });
    setIsPrimaryLocked(false);
    setOperationData({
      shift1: { operatorName: '', operatedBy: '' },
      shift2: { operatorName: '', operatedBy: '' },
      shift3: { operatorName: '', operatedBy: '' }
    });
    setShift1Row({ ...initialRow });
    setShift2Row({ ...initialRow });
    setShift3Row({ ...initialRow });
  };

  const handleViewReport = () => {
    navigate('/moulding/dmm-setting-parameters/report');
  };

  const renderRow = (row, shift) => (
    <div className="dmm-form-grid">
      <div className="dmm-form-group">
        <label>Customer</label>
        <input
          type="text"
                        value={row.customer}
                        onChange={(e) => handleInputChange(shift, "customer", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., ABC Industries"
        />
      </div>
      <div className="dmm-form-group">
        <label>Item Description</label>
        <input
          type="text"
          value={row.itemDescription}
                        onChange={(e) => handleInputChange(shift, "itemDescription", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Engine Block Casting"
        />
      </div>
      <div className="dmm-form-group">
        <label>Time</label>
        <input
          type="text"
          value={row.time}
                        onChange={(e) => handleInputChange(shift, "time", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 08:30 AM"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Thickness (mm)</label>
        <input
          type="number"
          value={row.ppThickness}
                        onChange={(e) => handleInputChange(shift, "ppThickness", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 25.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Height (mm)</label>
        <input
          type="number"
          value={row.ppHeight}
                        onChange={(e) => handleInputChange(shift, "ppHeight", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 150.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Thickness (mm)</label>
        <input
          type="number"
          value={row.spThickness}
                        onChange={(e) => handleInputChange(shift, "spThickness", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 30.2"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Height (mm)</label>
        <input
          type="number"
          value={row.spHeight}
                        onChange={(e) => handleInputChange(shift, "spHeight", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 180.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Core Mask Thickness (mm)</label>
        <input
          type="number"
          value={row.spCoreMaskThickness}
                        onChange={(e) => handleInputChange(shift, "spCoreMaskThickness", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 12.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Core Mask Height (mm)</label>
        <input
          type="number"
          value={row.spCoreMaskHeight}
                        onChange={(e) => handleInputChange(shift, "spCoreMaskHeight", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 95.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Core Mask Thickness (mm)</label>
        <input
          type="number"
          value={row.ppCoreMaskThickness}
                        onChange={(e) => handleInputChange(shift, "ppCoreMaskThickness", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 10.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Core Mask Height (mm)</label>
        <input
          type="number"
          value={row.ppCoreMaskHeight}
                        onChange={(e) => handleInputChange(shift, "ppCoreMaskHeight", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 85.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Sand Shot Pressure (Bar)</label>
        <input
          type="number"
          value={row.sandShotPressureBar}
                        onChange={(e) => handleInputChange(shift, "sandShotPressureBar", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 6.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Correction Shot Time (s)</label>
        <input
          type="number"
          value={row.correctionShotTime}
                        onChange={(e) => handleInputChange(shift, "correctionShotTime", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 2.5"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Squeeze Pressure (Kg/cm²)</label>
        <input
          type="number"
          value={row.squeezePressure}
                        onChange={(e) => handleInputChange(shift, "squeezePressure", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 45.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Stripping Acceleration</label>
        <input
          type="number"
          value={row.ppStrippingAcceleration}
                        onChange={(e) => handleInputChange(shift, "ppStrippingAcceleration", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 3.2"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Stripping Distance</label>
        <input
          type="number"
          value={row.ppStrippingDistance}
                        onChange={(e) => handleInputChange(shift, "ppStrippingDistance", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 120.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Stripping Acceleration</label>
        <input
          type="number"
          value={row.spStrippingAcceleration}
                        onChange={(e) => handleInputChange(shift, "spStrippingAcceleration", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 2.8"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Stripping Distance</label>
        <input
          type="number"
          value={row.spStrippingDistance}
                        onChange={(e) => handleInputChange(shift, "spStrippingDistance", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 140.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Mould Thickness ±10mm</label>
        <input
          type="number"
          value={row.mouldThicknessPlus10}
                        onChange={(e) => handleInputChange(shift, "mouldThicknessPlus10", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 250.0"
          step="any"
        />
      </div>
      <div className="dmm-form-group">
        <label>Close Up Force / Mould Close Up Pressure</label>
        <input
          type="text"
          value={row.closeUpForceMouldCloseUpPressure}
                        onChange={(e) => handleInputChange(shift, "closeUpForceMouldCloseUpPressure", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 800 kN / 55 bar"
        />
      </div>
      <div className="dmm-form-group">
        <label>Remarks</label>
        <input
          type="text"
          value={row.remarks}
                        onChange={(e) => handleInputChange(shift, "remarks", e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., All parameters OK"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="dmm-header">
        <div className="dmm-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            DMM Setting Parameters Check Sheet
            <button 
              className="dmm-view-report-btn"
              onClick={handleViewReport}
              title="View Reports"
            >
              <FileText size={14} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
        <div className="dmm-header-buttons">
          <button 
            className="dmm-reset-btn"
            onClick={handleReset}
          >
            <RefreshCw size={18} />
            Reset Form
          </button>
        </div>
      </div>

      <form>
          {/* Primary Information Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">Primary</h3>
            <div className="dmm-form-grid">
              <div className="dmm-form-group">
                <label>Date *</label>
                <CustomDatePicker
                  value={primaryData.date}
                  onChange={(e) => handlePrimaryChange("date", e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isPrimaryLocked || checkingData}
                  name="date"
                  style={{
                    backgroundColor: isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                    cursor: isPrimaryLocked ? 'not-allowed' : 'text'
                  }}
                />
              </div>
              <div className="dmm-form-group">
                <label>Machine *</label>
                <input
                  type="text"
                  value={primaryData.machine}
                  onChange={(e) => handlePrimaryChange("machine", e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isPrimaryLocked || checkingData}
                  readOnly={isPrimaryLocked}
                  placeholder="e.g., 1, 2, 3"
                  style={{
                    backgroundColor: isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                    cursor: isPrimaryLocked ? 'not-allowed' : 'text'
                  }}
                  required
                />
              </div>
              <div className="dmm-form-group">
                <button
                  type="button"
                  onClick={handlePrimarySubmit}
                  disabled={isPrimaryLocked || checkingData || !primaryData.date || !primaryData.machine}
                  className="dmm-submit-btn"
                  style={{ marginTop: '28px' }}
                >
                  {checkingData ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                  {isPrimaryLocked ? 'Primary Data Locked' : 'Save Primary Data'}
                </button>
              </div>
            </div>
          </div>

          {/* Operation Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">Operation</h3>
            <div className="dmm-operation-table-container">
              <table className="dmm-operation-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Shift I</th>
                    <th>Shift II</th>
                    <th>Shift III</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="dmm-parameter-label">Operator Name</td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift1.operatorName}
                        onChange={(e) => handleOperationChange('shift1', 'operatorName', e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter operator name"
                        className="dmm-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift2.operatorName}
                        onChange={(e) => handleOperationChange('shift2', 'operatorName', e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter operator name"
                        className="dmm-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift3.operatorName}
                        onChange={(e) => handleOperationChange('shift3', 'operatorName', e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter operator name"
                        className="dmm-table-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="dmm-parameter-label">Operated By</td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift1.operatedBy}
                        onChange={(e) => handleOperationChange('shift1', 'operatedBy', e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter name"
                        className="dmm-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift2.operatedBy}
                        onChange={(e) => handleOperationChange('shift2', 'operatedBy', e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter name"
                        className="dmm-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift3.operatedBy}
                        onChange={(e) => handleOperationChange('shift3', 'operatedBy', e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter name"
                        className="dmm-table-input"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="dmm-section-submit">
              <button
                type="button"
                onClick={handleOperationSubmit}
                disabled={loadingStates.operation || !primaryData.date || !primaryData.machine}
                className="dmm-submit-btn"
              >
                {loadingStates.operation ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                Submit Operation
              </button>
            </div>
          </div>

          {/* Shift 1 Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">Shift 1 Parameters</h3>
            {renderRow(shift1Row, 1)}
            <div className="dmm-section-submit">
              <button
                type="button"
                onClick={(e) => handleShiftSubmit(e, 1)}
                disabled={loadingStates.shift1 || !primaryData.date || !primaryData.machine}
                className="dmm-submit-btn"
              >
                {loadingStates.shift1 ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                Submit Shift 1
              </button>
            </div>
          </div>

          {/* Shift 2 Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">Shift 2 Parameters</h3>
            {renderRow(shift2Row, 2)}
            <div className="dmm-section-submit">
              <button
                type="button"
                onClick={(e) => handleShiftSubmit(e, 2)}
                disabled={loadingStates.shift2 || !primaryData.date || !primaryData.machine}
                className="dmm-submit-btn"
              >
                {loadingStates.shift2 ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                Submit Shift 2
              </button>
            </div>
          </div>

          {/* Shift 3 Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">Shift 3 Parameters</h3>
            {renderRow(shift3Row, 3)}
            <div className="dmm-section-submit">
              <button
                type="button"
                onClick={(e) => handleShiftSubmit(e, 3)}
                disabled={loadingStates.shift3 || !primaryData.date || !primaryData.machine}
                className="dmm-submit-btn"
              >
                {loadingStates.shift3 ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                Submit Shift 3
              </button>
            </div>
          </div>
      </form>
    </>
  );
};

export default DmmSettingParameters;
