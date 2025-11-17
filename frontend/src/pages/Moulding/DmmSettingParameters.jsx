
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, RefreshCw, FileText, Loader2, RotateCcw } from "lucide-react";
import CustomDatePicker from '../../Components/CustomDatePicker';
import Loader from '../../Components/Loader';
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
  coreMaskThickness: "",
  coreMaskHeightOutside: "",
  coreMaskHeightInside: "",
  spCoreMaskThickness: "", // mapped for backend persistence (thickness)
  spCoreMaskHeight: "", // mapped for backend persistence (outside height)
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


// Get today's date in YYYY-MM-DD format
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const DmmSettingParameters = () => {
  const navigate = useNavigate();
  const [primaryData, setPrimaryData] = useState({
    date: getTodaysDate(), // Set today's date by default
    machine: '',
    shift: '', // Move shift to primary
    operatorName: '',
    operatedBy: ''
  });
  const [isPrimaryLocked, setIsPrimaryLocked] = useState(false);
  const [checkingData, setCheckingData] = useState(false);
  const [primaryFieldLocked, setPrimaryFieldLocked] = useState({
    machine: false,
    shift: false,
    operatorName: false,
    operatedBy: false
  }); // Per-field locking for primary data (date never locked)
  const [shift1Row, setShift1Row] = useState({ ...initialRow });
  const [shift2Row, setShift2Row] = useState({ ...initialRow });
  const [shift3Row, setShift3Row] = useState({ ...initialRow });
  const [currentRow, setCurrentRow] = useState({ ...initialRow }); // Current form data
  const [loadingStates, setLoadingStates] = useState({
    primary: false,
    shift: false
  });
  const [allSubmitting, setAllSubmitting] = useState(false);
  const [shiftCounts, setShiftCounts] = useState({
    shift1: 0,
    shift2: 0,
    shift3: 0
  });
  
  // Refs for submit button and first input
  const shiftSubmitRef = useRef(null);
  const shiftFirstInputRef = useRef(null);

  // Auto-update date if user keeps page open past midnight
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getTodaysDate();
      if (primaryData.date !== today) {
        setPrimaryData(prev => ({ ...prev, date: today }));
      }
    }, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [primaryData.date]);

  // Handle Enter key navigation for form fields
  const handleEnterKeyNavigation = (e, nextFieldId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    }
  };

  const handlePrimaryChange = (field, value) => {
    // Date is always fixed to today, ignore any change attempts
    if (field === 'date') {
      return; // Do nothing - date is locked to today
    }
    
    setPrimaryData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if primary data exists for date, machine, and shift combination
  const checkExistingPrimaryData = async (date, machine, shift) => {
    if (!date || !machine || !shift) {
      // Clear all data if any primary field is empty
      setIsPrimaryLocked(false);
      setPrimaryFieldLocked({ machine: false, shift: false, operatorName: false, operatedBy: false });
      setShift1Row({ ...initialRow });
      setShift2Row({ ...initialRow });
      setShift3Row({ ...initialRow });
      setCurrentRow({ ...initialRow });
      return;
    }

    try {
      setCheckingData(true);
      const response = await api.get(`/dmm-settings/primary?date=${encodeURIComponent(date)}&machine=${encodeURIComponent(machine)}`);
      
      if (response.success && response.data && response.data.length > 0) {
        const record = response.data[0];
        
        // Check what data exists
        const hasMachine = record.machine !== undefined && record.machine !== null && String(record.machine).trim() !== '';
        const shiftKey = `shift${shift}`;
        const shiftData = record.shifts?.[shiftKey];
        
        const hasOperatorName = shiftData?.operatorName && String(shiftData.operatorName).trim() !== '';
        const hasOperatedBy = shiftData?.checkedBy && String(shiftData.checkedBy).trim() !== '';
        
        // Lock all fields if data exists, keep unlocked if no data
        const allFieldsHaveData = hasMachine && hasShift && hasOperatorName && hasOperatedBy;
        setPrimaryFieldLocked({
          machine: allFieldsHaveData,
          shift: allFieldsHaveData,
          operatorName: allFieldsHaveData,
          operatedBy: allFieldsHaveData
        });
        setIsPrimaryLocked(allFieldsHaveData);
        
        if (hasMachine) {
          setIsPrimaryLocked(true);
          
          // Populate primary fields including operator data for selected shift
          setPrimaryData({
            date: date,
            machine: String(record.machine).trim(),
            shift: shift,
            operatorName: hasOperatorName ? String(shiftData.operatorName).trim() : '',
            operatedBy: hasOperatedBy ? String(shiftData.checkedBy).trim() : ''
          });
        } else {
          setIsPrimaryLocked(false);
        }
        
        // Clear shift parameter rows - always start fresh
        setShift1Row({ ...initialRow });
        setShift2Row({ ...initialRow });
        setShift3Row({ ...initialRow });
        setCurrentRow({ ...initialRow });
      } else {
        // No record exists - unlock all
        setIsPrimaryLocked(false);
        setPrimaryFieldLocked({ machine: false, shift: false, operatorName: false, operatedBy: false });
      }
    } catch (error) {
      console.error('Error checking primary data:', error);
      setIsPrimaryLocked(false);
      setPrimaryFieldLocked({ machine: false, shift: false, operatorName: false, operatedBy: false });
    } finally {
      setCheckingData(false);
    }
  };

  // Handle primary data submission
  const handlePrimarySubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate required fields (now require operator fields too)
    if (!primaryData.date || !primaryData.machine || !primaryData.shift || !primaryData.operatorName || !primaryData.operatedBy) {
      alert('Please fill in Date, Machine, Shift, Operator Name and Operated By before submitting Primary.');
      return;
    }

    // Always send machine & operator info; backend requires machine/date each time
    // Section must be 'operation' for operatorName/checkedBy persistence

    try {
      setLoadingStates(prev => ({ ...prev, primary: true }));
      
      // Build payload
      const payload = {
        date: primaryData.date,
        machine: primaryData.machine.trim(),
        section: 'operation',
        shifts: {}
      };
      // Send operator data for selected shift always (validated already)
      const shiftKey = `shift${primaryData.shift}`;
      const shiftPayload = {};
      shiftPayload.operatorName = primaryData.operatorName.trim();
      shiftPayload.checkedBy = primaryData.operatedBy.trim();
      
      if (Object.keys(shiftPayload).length > 0) {
        payload.shifts[shiftKey] = shiftPayload;
      }

      const data = await api.post('/dmm-settings', payload);
      
      if (data.success) {
        // Lock all 4 fields together after save
        setPrimaryFieldLocked({
          machine: true,
          shift: true,
          operatorName: true,
          operatedBy: true
        });
        setIsPrimaryLocked(true);
        alert('Primary data saved successfully! All fields are now locked.');
        
        // Focus on first shift parameter input
        setTimeout(() => {
          if (shiftFirstInputRef.current) {
            shiftFirstInputRef.current.focus();
          }
        }, 100);
      } else {
        alert('Failed to save: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving primary data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert('Failed to save primary data: ' + errorMessage);
    } finally {
      setLoadingStates(prev => ({ ...prev, primary: false }));
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentRow((prev) => ({ ...prev, [field]: value }));
  };

  // Helper function to check if Shift parameters have at least one field with data
  const hasShiftParameterData = () => {
    // Check if any of the main fields (not remarks) have data
    return (currentRow.customer && currentRow.customer.trim() !== '') ||
           (currentRow.itemDescription && currentRow.itemDescription.trim() !== '') ||
           (currentRow.time && currentRow.time.trim() !== '') ||
           (currentRow.ppThickness && currentRow.ppThickness.toString().trim() !== '') ||
           (currentRow.ppHeight && currentRow.ppHeight.toString().trim() !== '') ||
           (currentRow.spThickness && currentRow.spThickness.toString().trim() !== '') ||
           (currentRow.spHeight && currentRow.spHeight.toString().trim() !== '');
  };

  // Fetch shift counts from database
  const fetchShiftCounts = async () => {
    if (!primaryData.date || !primaryData.machine) {
      setShiftCounts({ shift1: 0, shift2: 0, shift3: 0 });
      return;
    }

    try {
      const response = await api.get(`/dmm-settings/primary?date=${encodeURIComponent(primaryData.date)}&machine=${encodeURIComponent(primaryData.machine)}`);
      
      if (response.success && response.data && response.data.length > 0) {
        const record = response.data[0];
        const counts = {
          shift1: (record.parameters && Array.isArray(record.parameters.shift1)) ? record.parameters.shift1.length : 0,
          shift2: (record.parameters && Array.isArray(record.parameters.shift2)) ? record.parameters.shift2.length : 0,
          shift3: (record.parameters && Array.isArray(record.parameters.shift3)) ? record.parameters.shift3.length : 0
        };
        setShiftCounts(counts);
      } else {
        setShiftCounts({ shift1: 0, shift2: 0, shift3: 0 });
      }
    } catch (error) {
      console.error('Error fetching shift counts:', error);
      setShiftCounts({ shift1: 0, shift2: 0, shift3: 0 });
    }
  };

  // Update shift counts when date/machine changes
  useEffect(() => {
    if (primaryData.date && primaryData.machine) {
      fetchShiftCounts();
    } else {
      setShiftCounts({ shift1: 0, shift2: 0, shift3: 0 });
    }
  }, [primaryData.date, primaryData.machine]);

  const handleShiftSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Ensure a shift is selected in primary
    if (!primaryData.shift) {
      alert('Please select a shift in Primary section first.');
      return;
    }
    
    // Primary data must be saved first
    if (!isPrimaryLocked) {
      alert('Please save Primary data first before adding shift parameters.');
      return;
    }
    
    if (!primaryData.date || !primaryData.machine) {
      alert('Please fill in Primary data (Date, Machine, Shift) first');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, shift: true }));
      
      // Map unified core mask UI fields to backend expected fields
      const rowForSave = { ...currentRow };
      rowForSave.spCoreMaskThickness = currentRow.coreMaskThickness || '';
      rowForSave.spCoreMaskHeight = currentRow.coreMaskHeightOutside || '';
      // Persist inside height by appending to remarks (non-breaking)
      if (currentRow.coreMaskHeightInside) {
        const tag = `InsideMaskHeight:${currentRow.coreMaskHeightInside}`;
        rowForSave.remarks = rowForSave.remarks ? `${rowForSave.remarks} | ${tag}` : tag;
      }
      // Remove UI-only fields from object to avoid sending unused keys
      delete rowForSave.coreMaskThickness;
      delete rowForSave.coreMaskHeightOutside;
      delete rowForSave.coreMaskHeightInside;

      const payload = {
        date: primaryData.date,
        machine: primaryData.machine,
        section: `shift${primaryData.shift}`,
        parameters: {
          [`shift${primaryData.shift}`]: rowForSave
        }
      };

      const data = await api.post('/dmm-settings', payload);
      if (data.success) {
        // Clear current row for next entry
        setCurrentRow({ ...initialRow });
        
        // Fetch updated counts from database
        await fetchShiftCounts();
        
        // Focus customer input (first input)
        setTimeout(() => {
          if (shiftFirstInputRef.current) {
            shiftFirstInputRef.current.focus();
          }
        }, 100);
        
        alert(`Shift ${primaryData.shift} parameters saved successfully!`);
      }
    } catch (error) {
      console.error(`Error saving shift ${primaryData.shift} data:`, error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, shift: false }));
    }
  };

  // Handle Enter key navigation for shift parameter inputs
  const handleShiftKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Get all inputs in the current shift section
      const shiftSection = e.target.closest('.dmm-section');
      if (!shiftSection) return;
      
      const inputs = Array.from(shiftSection.querySelectorAll('input:not([type="button"]):not([disabled]), select:not([disabled])'));
      const currentIndex = inputs.indexOf(e.target);
      
      // If not the last input, move to next
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      } else {
        // Last input - focus Save All button
        const saveAllBtn = document.querySelector('button[title*="Save all"]');
        if (saveAllBtn) {
          saveAllBtn.focus();
        }
      }
    }
  };

  // Handle Enter key on submit button
  const handleSubmitButtonKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleShiftSubmit(e);
    }
  };

  // Separate reset functions for each section
  const resetPrimaryData = () => {
    if (!window.confirm('Are you sure you want to reset Primary data?')) return;
    const today = getTodaysDate();
    setPrimaryData({ date: today, machine: '', shift: '', operatorName: '', operatedBy: '' });
    setIsPrimaryLocked(false);
    setPrimaryFieldLocked({ machine: false, shift: false, operatorName: false, operatedBy: false });
    setCheckingData(false);
  };

  const resetShiftRow = () => {
    if (!primaryData.shift) {
      alert('Please select a shift in Primary section first.');
      return;
    }
    if (!window.confirm(`Are you sure you want to reset Shift ${primaryData.shift} Parameters?`)) return;
    setCurrentRow({ ...initialRow });
  };

  const handleViewReport = () => {
    navigate('/moulding/dmm-setting-parameters/report');
  };

  // Combined Save All for DMM page (backend-compat: operation then shift append)
  const handleSubmitAll = async () => {
    if (!primaryData.date || !primaryData.machine || !primaryData.shift) {
      alert('Please fill Date, Machine, and Shift before saving.');
      return;
    }

    setAllSubmitting(true);
    try {
      const shiftKey = `shift${primaryData.shift}`;

      // 1) Save operation info for selected shift
      const opPayload = {
        date: primaryData.date,
        machine: primaryData.machine,
        section: 'operation',
        shifts: {
          [shiftKey]: {
            operatorName: primaryData.operatorName || '',
            checkedBy: primaryData.operatedBy || ''
          }
        }
      };
      const opRes = await api.post('/dmm-settings', opPayload);
      if (!opRes.success) throw new Error(opRes.message || 'Failed to save operation');

      // 2) Save parameters row (map UI fields to backend expectations)
      if (hasShiftParameterData()) {
        const rowForSave = { ...currentRow };
        rowForSave.spCoreMaskThickness = currentRow.coreMaskThickness || '';
        rowForSave.spCoreMaskHeight = currentRow.coreMaskHeightOutside || '';
        if (currentRow.coreMaskHeightInside) {
          const tag = `InsideMaskHeight:${currentRow.coreMaskHeightInside}`;
          rowForSave.remarks = rowForSave.remarks ? `${rowForSave.remarks} | ${tag}` : tag;
        }
        delete rowForSave.coreMaskThickness;
        delete rowForSave.coreMaskHeightOutside;
        delete rowForSave.coreMaskHeightInside;

        const paramsPayload = {
          date: primaryData.date,
          machine: primaryData.machine,
          section: shiftKey,
          parameters: {
            [shiftKey]: rowForSave
          }
        };
        const paramsRes = await api.post('/dmm-settings', paramsPayload);
        if (!paramsRes.success) throw new Error(paramsRes.message || 'Failed to save parameters');
      }

      alert('All data saved successfully! Ready for next entry.');
      setCurrentRow({ ...initialRow });
      await fetchShiftCounts();
      setTimeout(() => {
        if (shiftFirstInputRef.current) {
          shiftFirstInputRef.current.focus();
        }
      }, 100);
    } catch (err) {
      console.error('Save All error:', err);
      alert('Failed to Save All: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setAllSubmitting(false);
    }
  };

  const renderRow = () => {
    return (
    <div className="dmm-form-grid dmm-shift-form-grid">
      <div className="dmm-form-group full-width">
        <label>Customer</label>
        <input
          type="text"
          ref={shiftFirstInputRef}
          value={currentRow.customer}
          onChange={(e) => handleInputChange("customer", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., ABC Industries"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Item Description</label>
        <input
          type="text"
          value={currentRow.itemDescription}
          onChange={(e) => handleInputChange("itemDescription", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., Engine Block Casting"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Time</label>
        <input
          type="text"
          value={currentRow.time}
          onChange={(e) => handleInputChange("time", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 08:30 AM"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Thickness (mm)</label>
        <input
          type="number"
          value={currentRow.ppThickness}
          onChange={(e) => handleInputChange("ppThickness", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 25.5"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Height (mm)</label>
        <input
          type="number"
          value={currentRow.ppHeight}
          onChange={(e) => handleInputChange("ppHeight", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 150.0"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Thickness (mm)</label>
        <input
          type="number"
          value={currentRow.spThickness}
          onChange={(e) => handleInputChange("spThickness", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 30.2"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Height (mm)</label>
        <input
          type="number"
          value={currentRow.spHeight}
          onChange={(e) => handleInputChange("spHeight", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 180.5"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Core Mask Thickness (mm)</label>
        <input
          type="number"
          value={currentRow.coreMaskThickness}
          onChange={(e) => handleInputChange("coreMaskThickness", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 12.0"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Core Mask Height Outside (mm)</label>
        <input
          type="number"
          value={currentRow.coreMaskHeightOutside}
          onChange={(e) => handleInputChange("coreMaskHeightOutside", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 95.5"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Core Mask Height Inside (mm)</label>
        <input
          type="number"
          value={currentRow.coreMaskHeightInside}
          onChange={(e) => handleInputChange("coreMaskHeightInside", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 85.0"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Sand Shot Pressure (Bar)</label>
        <input
          type="number"
          value={currentRow.sandShotPressureBar}
          onChange={(e) => handleInputChange("sandShotPressureBar", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 6.5"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Correction Shot Time (s)</label>
        <input
          type="number"
          value={currentRow.correctionShotTime}
          onChange={(e) => handleInputChange("correctionShotTime", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 2.5"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Squeeze Pressure (Kg/cm²)</label>
        <input
          type="number"
          value={currentRow.squeezePressure}
          onChange={(e) => handleInputChange("squeezePressure", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 45.0"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Stripping Acceleration</label>
        <input
          type="number"
          value={currentRow.ppStrippingAcceleration}
          onChange={(e) => handleInputChange("ppStrippingAcceleration", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 3.2"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Stripping Distance</label>
        <input
          type="number"
          value={currentRow.ppStrippingDistance}
          onChange={(e) => handleInputChange("ppStrippingDistance", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 120.0"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Stripping Acceleration</label>
        <input
          type="number"
          value={currentRow.spStrippingAcceleration}
          onChange={(e) => handleInputChange("spStrippingAcceleration", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 2.8"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Stripping Distance</label>
        <input
          type="number"
          value={currentRow.spStrippingDistance}
          onChange={(e) => handleInputChange("spStrippingDistance", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 140.0"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Mould Thickness ±10mm</label>
        <input
          type="number"
          value={currentRow.mouldThicknessPlus10}
          onChange={(e) => handleInputChange("mouldThicknessPlus10", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 250.0"
          step="any"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Close Up Force / Mould Close Up Pressure</label>
        <input
          type="text"
          value={currentRow.closeUpForceMouldCloseUpPressure}
          onChange={(e) => handleInputChange("closeUpForceMouldCloseUpPressure", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 800 kN / 55 bar"
          disabled={!isPrimaryLocked}
          style={{
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>Remarks</label>
        <input
          type="text"
          value={currentRow.remarks}
          onChange={(e) => handleInputChange("remarks", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., All parameters OK"
          maxLength={60}
          disabled={!isPrimaryLocked}
          style={{
            resize: 'none',
            backgroundColor: (!isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
    </div>
    );
  };

  return (
    <div className="page-wrapper">
      {checkingData && (
        <div className="dmm-loader-overlay">
          <Loader />
        </div>
      )}
      {/* Header */}
      <div className="dmm-header">
        <div className="dmm-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            DMM Setting Parameters Check Sheet
          </h2>
        </div>
      </div>

      <form>
        {/* Primary Information Section */}
        <div className="dmm-section primary-section">
          <div className="primary-header-container">
            <h3 className="primary-section-title">PRIMARY</h3>
            <div className="primary-date-display">DATE : {primaryData.date ? new Date(primaryData.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</div>
          </div>
          {checkingData && (
            <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
              Checking for existing data...
            </div>
          )}
          {isPrimaryLocked && !checkingData && (
            <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
              Machine and Shift are locked. Operator fields with data are locked, empty fields remain editable.
            </div>
          )}
          {/* Primary Data Fields */}
          <div className="primary-fields-row">
            <div className="dmm-form-group">
              <label>Machine <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                id="machine-field"
                type="text"
                value={primaryData.machine}
                onChange={(e) => handlePrimaryChange("machine", e.target.value)}
                onBlur={() => {
                  if (primaryData.date && primaryData.machine && primaryData.shift) {
                    checkExistingPrimaryData(primaryData.date, primaryData.machine, primaryData.shift);
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const nextField = document.getElementById('shift-field');
                    if (nextField) {
                      nextField.focus();
                    }
                  }
                }}
                placeholder="e.g., 1, 2, 3"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  border: '2px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: (primaryFieldLocked.machine || checkingData) ? '#f1f5f9' : '#ffffff',
                  cursor: (primaryFieldLocked.machine || checkingData) ? 'not-allowed' : 'text'
                }}
                disabled={primaryFieldLocked.machine || checkingData}
                readOnly={primaryFieldLocked.machine}
                required
              />
            </div>
            <div className="dmm-form-group">
              <label>Shift <span style={{ color: '#ef4444' }}>*</span></label>
              <select
                id="shift-field"
                value={primaryData.shift}
                onChange={(e) => {
                  handlePrimaryChange("shift", e.target.value);
                  if (primaryData.date && primaryData.machine && e.target.value) {
                    checkExistingPrimaryData(primaryData.date, primaryData.machine, e.target.value);
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const nextField = document.getElementById('operatorName-field');
                    if (nextField) {
                      nextField.focus();
                    }
                  }
                }}
                disabled={primaryFieldLocked.shift || checkingData}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  border: '2px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: (primaryFieldLocked.shift || checkingData) ? '#f1f5f9' : '#ffffff',
                  cursor: (primaryFieldLocked.shift || checkingData) ? 'not-allowed' : 'pointer'
                }}
                required
              >
                <option value="">Select Shift</option>
                <option value="1">Shift 1</option>
                <option value="2">Shift 2</option>
                <option value="3">Shift 3</option>
              </select>
            </div>
            <div className="dmm-form-group">
              <label>Operator Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                id="operatorName-field"
                type="text"
                value={primaryData.operatorName}
                onChange={(e) => handlePrimaryChange("operatorName", e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const nextField = document.getElementById('operatedBy-field');
                    if (nextField) {
                      nextField.focus();
                    }
                  }
                }}
                disabled={false}
                readOnly={false}
                placeholder="Enter operator name"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  border: '2px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: primaryFieldLocked.operatorName ? '#f1f5f9' : '#ffffff',
                  cursor: primaryFieldLocked.operatorName ? 'not-allowed' : 'text'
                }}
                required
              />
            </div>
            <div className="dmm-form-group">
              <label>Operated By <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                id="operatedBy-field"
                type="text"
                value={primaryData.operatedBy}
                onChange={(e) => handlePrimaryChange("operatedBy", e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // Attempt to submit primary (validation in handler will enforce required fields)
                    if (primaryData.machine && primaryData.shift) {
                      await handlePrimarySubmit();
                    } else {
                      // If machine/shift missing, move focus to first missing field
                      if (!primaryData.machine) {
                        const m = document.getElementById('machine-field'); if (m) m.focus();
                      } else if (!primaryData.shift) {
                        const s = document.getElementById('shift-field'); if (s) s.focus();
                      }
                    }
                    // Navigate to first shift parameter field after saving/attempt
                    setTimeout(() => {
                      const firstField = document.querySelector('.dmm-shift-input:not([disabled])');
                      if (firstField) {
                        firstField.focus();
                      }
                    }, 200);
                  }
                }}
                disabled={false}
                readOnly={false}
                placeholder="Enter name"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  border: '2px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: primaryFieldLocked.operatedBy ? '#f1f5f9' : '#ffffff',
                  cursor: primaryFieldLocked.operatedBy ? 'not-allowed' : 'text'
                }}
                required
              />
            </div>
          </div>
          {isPrimaryLocked && (
            <div className="dmm-primary-button-wrapper" style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                className="dmm-reset-btn"
                onClick={resetPrimaryData}
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                title="Unlock and reset primary data"
              >
                <RefreshCw size={16} />
                Reset Primary
              </button>
            </div>
          )}
        </div>

        {/* Divider line to separate primary data from other inputs */}
        <div style={{ width: '100%', marginTop: '1rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}></div>

        {/* Shift Parameters Section */}
        <div className="dmm-section">
            <h3 className="dmm-section-title">
              DMM Shift Parameters Information
              {primaryData.shift && ` - Shift ${primaryData.shift} (Count: ${shiftCounts[`shift${primaryData.shift}`] || 0})`}
            </h3>
            {!isPrimaryLocked && (
              <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                Please save Primary data first to enable shift parameters entry.
              </div>
            )}
            {renderRow()}
            <div className="dmm-section-submit" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* No reset button for shift parameters section */}
            </div>
          </div>
        </form>

        {/* Save All button only enabled after primary is locked */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={allSubmitting || checkingData || !isPrimaryLocked}
            className="dmm-submit-btn"
            title={!isPrimaryLocked ? 'Please submit Primary Data first' : 'Save all sections'}
          >
            {allSubmitting ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
            {allSubmitting ? 'Saving...' : 'Save All'}
        </button>
      </div>
    </div>
  );
};

export default DmmSettingParameters;