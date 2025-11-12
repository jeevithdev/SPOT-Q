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
  const [primaryFieldLocked, setPrimaryFieldLocked] = useState({
    date: false,
    machine: false
  }); // Per-field locking for primary data
  const [operationFieldLocked, setOperationFieldLocked] = useState({
    shift1: { operatorName: false, operatedBy: false },
    shift2: { operatorName: false, operatedBy: false },
    shift3: { operatorName: false, operatedBy: false }
  }); // Per-field locking for operation data
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
  const [selectedShift, setSelectedShift] = useState(null); // 1, 2, 3, or null
  const [currentRow, setCurrentRow] = useState({ ...initialRow }); // Current form data
  const [loadingStates, setLoadingStates] = useState({
    primary: false,
    operation: false,
    shift: false
  });
  const [shiftCounts, setShiftCounts] = useState({
    shift1: 0,
    shift2: 0,
    shift3: 0
  });
  
  // Refs for submit button and first input
  const shiftSubmitRef = useRef(null);
  const shiftFirstInputRef = useRef(null);

  const handlePrimaryChange = (field, value) => {
    setPrimaryData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // If date changes, check for existing data for that date
      if (field === 'date') {
        // Clear all fields first (will be repopulated if data exists)
        setIsPrimaryLocked(false);
        setPrimaryFieldLocked({ date: false, machine: false });
        setOperationFieldLocked({
          shift1: { operatorName: false, operatedBy: false },
          shift2: { operatorName: false, operatedBy: false },
          shift3: { operatorName: false, operatedBy: false }
        });
        // Clear operation data
        setOperationData({
          shift1: { operatorName: '', operatedBy: '' },
          shift2: { operatorName: '', operatedBy: '' },
          shift3: { operatorName: '', operatedBy: '' }
        });
        // Clear shift parameter data
        setShift1Row({ ...initialRow });
        setShift2Row({ ...initialRow });
        setShift3Row({ ...initialRow });
        setSelectedShift(null);
        setCurrentRow({ ...initialRow });
        
        // Check for data with common machines (1, 2, 3, etc.) for this date
        // Start with machine "1" as it's most common
        if (updated.date) {
          setTimeout(() => {
            checkExistingDataForDate(updated.date);
          }, 100);
        }
        
        return updated;
      }
      
      // Check for existing data when date or machine changes
      // Always check when both date and machine are present
      if (updated.date && updated.machine) {
        // Use setTimeout to allow the input to update first before checking
        setTimeout(() => {
          checkExistingPrimaryData(updated.date, updated.machine);
        }, 0);
      }
      
      return updated;
    });
  };

  // Check for existing data when date changes - try common machines
  const checkExistingDataForDate = async (date) => {
    if (!date) return;

    try {
      setCheckingData(true);
      // Try common machines: 1, 2, 3, etc.
      const machinesToCheck = ['1', '2', '3', '4', '5'];
      
      for (const machine of machinesToCheck) {
        const response = await api.get(`/v1/dmm-settings/primary?date=${encodeURIComponent(date)}&machine=${encodeURIComponent(machine)}`);
        
        if (response.success && response.data && response.data.length > 0) {
          const record = response.data[0];
          
          // Found data for this machine - populate and lock
          const hasMachine = record.machine !== undefined && record.machine !== null && String(record.machine).trim() !== '';
          
          if (hasMachine) {
            // Lock machine field
            setPrimaryFieldLocked({
              date: false, // Date is always editable
              machine: true // Lock machine since data exists
            });
            setIsPrimaryLocked(true);
            
            // Populate primary fields
            setPrimaryData({
              date: date,
              machine: String(record.machine).trim()
            });
            
            // Load and lock operation data if it exists
            if (record.shifts) {
              const newOperationFieldLocked = {
                shift1: { operatorName: false, operatedBy: false },
                shift2: { operatorName: false, operatedBy: false },
                shift3: { operatorName: false, operatedBy: false }
              };
              
              const newOperationData = {
                shift1: { operatorName: '', operatedBy: '' },
                shift2: { operatorName: '', operatedBy: '' },
                shift3: { operatorName: '', operatedBy: '' }
              };
              
              // Process each shift
              ['shift1', 'shift2', 'shift3'].forEach(shiftKey => {
                const shiftData = record.shifts[shiftKey];
                if (shiftData) {
                  const hasOperatorName = shiftData.operatorName !== undefined && 
                                         shiftData.operatorName !== null && 
                                         String(shiftData.operatorName).trim() !== '';
                  const hasOperatedBy = shiftData.checkedBy !== undefined && 
                                       shiftData.checkedBy !== null && 
                                       String(shiftData.checkedBy).trim() !== '';
                  
                  newOperationFieldLocked[shiftKey] = {
                    operatorName: hasOperatorName,
                    operatedBy: hasOperatedBy
                  };
                  
                  if (hasOperatorName) {
                    newOperationData[shiftKey].operatorName = String(shiftData.operatorName).trim();
                  }
                  if (hasOperatedBy) {
                    newOperationData[shiftKey].operatedBy = String(shiftData.checkedBy).trim();
                  }
                }
              });
              
              setOperationFieldLocked(newOperationFieldLocked);
              setOperationData(newOperationData);
            }
            
        // Load shift parameter data if it exists
        // Note: Parameters are now arrays, so we don't load them into the form
        // The form should always start empty for new entries
        // Clear all shift rows - always start with empty form for new entry
        setShift1Row({ ...initialRow });
        setShift2Row({ ...initialRow });
        setShift3Row({ ...initialRow });
        setSelectedShift(null);
        setCurrentRow({ ...initialRow });
        
        // Found data, stop checking other machines
        setCheckingData(false);
        return;
          }
        }
      }
      
      // No data found for any common machine - leave fields empty
      setIsPrimaryLocked(false);
      setPrimaryFieldLocked({ date: false, machine: false });
      setOperationFieldLocked({
        shift1: { operatorName: false, operatedBy: false },
        shift2: { operatorName: false, operatedBy: false },
        shift3: { operatorName: false, operatedBy: false }
      });
      setOperationData({
        shift1: { operatorName: '', operatedBy: '' },
        shift2: { operatorName: '', operatedBy: '' },
        shift3: { operatorName: '', operatedBy: '' }
      });
      setShift1Row({ ...initialRow });
      setShift2Row({ ...initialRow });
      setShift3Row({ ...initialRow });
      setSelectedShift(null);
      setCurrentRow({ ...initialRow });
      setPrimaryData({
        date: date,
        machine: ''
      });
      
    } catch (error) {
      console.error('Error checking data for date:', error);
      setIsPrimaryLocked(false);
      setPrimaryFieldLocked({ date: false, machine: false });
    } finally {
      setCheckingData(false);
    }
  };

  // Check if primary data exists for date and machine combination
  const checkExistingPrimaryData = async (date, machine) => {
    if (!date || !machine) {
      // Clear all data if date or machine is empty
      setIsPrimaryLocked(false);
      setPrimaryFieldLocked({ date: false, machine: false });
      setOperationFieldLocked({
        shift1: { operatorName: false, operatedBy: false },
        shift2: { operatorName: false, operatedBy: false },
        shift3: { operatorName: false, operatedBy: false }
      });
      setOperationData({
        shift1: { operatorName: '', operatedBy: '' },
        shift2: { operatorName: '', operatedBy: '' },
        shift3: { operatorName: '', operatedBy: '' }
      });
      setShift1Row({ ...initialRow });
      setShift2Row({ ...initialRow });
      setShift3Row({ ...initialRow });
      setSelectedShift(null);
      setCurrentRow({ ...initialRow });
      return;
    }

    try {
      setCheckingData(true);
      const response = await api.get(`/v1/dmm-settings/primary?date=${encodeURIComponent(date)}&machine=${encodeURIComponent(machine)}`);
      
      if (response.success && response.data && response.data.length > 0) {
        const record = response.data[0];
        
        // Check if machine has data (date is always editable, never locked)
        const hasMachine = record.machine !== undefined && record.machine !== null && String(record.machine).trim() !== '';
        
        // Lock only machine field if it has saved data (date is never locked)
        setPrimaryFieldLocked({
          date: false, // Date is always editable
          machine: hasMachine
        });
        
        // Check if any primary data exists
        if (hasMachine) {
          setIsPrimaryLocked(true);
          
          // Populate primary fields (always use current date from input, machine from record if exists)
          setPrimaryData({
            date: date, // Always use the date from input (editable)
            machine: hasMachine ? String(record.machine).trim() : machine
          });
        } else {
          setIsPrimaryLocked(false);
          // Keep current date and machine from input
          setPrimaryData({
            date: date,
            machine: machine
          });
        }
        
        // Load and lock operation data if it exists
        if (record.shifts) {
          const newOperationFieldLocked = {
            shift1: { operatorName: false, operatedBy: false },
            shift2: { operatorName: false, operatedBy: false },
            shift3: { operatorName: false, operatedBy: false }
          };
          
          const newOperationData = {
            shift1: { operatorName: '', operatedBy: '' },
            shift2: { operatorName: '', operatedBy: '' },
            shift3: { operatorName: '', operatedBy: '' }
          };
          
          // Process each shift
          ['shift1', 'shift2', 'shift3'].forEach(shiftKey => {
            const shiftData = record.shifts[shiftKey];
            if (shiftData) {
              const hasOperatorName = shiftData.operatorName !== undefined && 
                                     shiftData.operatorName !== null && 
                                     String(shiftData.operatorName).trim() !== '';
              const hasOperatedBy = shiftData.checkedBy !== undefined && 
                                   shiftData.checkedBy !== null && 
                                   String(shiftData.checkedBy).trim() !== '';
              
              newOperationFieldLocked[shiftKey] = {
                operatorName: hasOperatorName,
                operatedBy: hasOperatedBy
              };
              
              if (hasOperatorName) {
                newOperationData[shiftKey].operatorName = String(shiftData.operatorName).trim();
              }
              if (hasOperatedBy) {
                newOperationData[shiftKey].operatedBy = String(shiftData.checkedBy).trim();
              }
            }
          });
          
          setOperationFieldLocked(newOperationFieldLocked);
          setOperationData(newOperationData);
        } else {
          // No operation data - clear and unlock all
          setOperationFieldLocked({
            shift1: { operatorName: false, operatedBy: false },
            shift2: { operatorName: false, operatedBy: false },
            shift3: { operatorName: false, operatedBy: false }
          });
          setOperationData({
            shift1: { operatorName: '', operatedBy: '' },
            shift2: { operatorName: '', operatedBy: '' },
            shift3: { operatorName: '', operatedBy: '' }
          });
        }
        
        // Load shift parameter data if it exists
        // Note: Parameters are now arrays, so we don't load them into the form
        // The form should always start empty for new entries
        // Clear all shift rows - always start with empty form for new entry
        setShift1Row({ ...initialRow });
        setShift2Row({ ...initialRow });
        setShift3Row({ ...initialRow });
        setSelectedShift(null);
        setCurrentRow({ ...initialRow });
      } else {
        // No record exists for this date+machine - clear everything except machine (keep user input)
        setIsPrimaryLocked(false);
        setPrimaryFieldLocked({ date: false, machine: false });
        setOperationFieldLocked({
          shift1: { operatorName: false, operatedBy: false },
          shift2: { operatorName: false, operatedBy: false },
          shift3: { operatorName: false, operatedBy: false }
        });
        // Clear all data
        setOperationData({
          shift1: { operatorName: '', operatedBy: '' },
          shift2: { operatorName: '', operatedBy: '' },
          shift3: { operatorName: '', operatedBy: '' }
        });
        setShift1Row({ ...initialRow });
        setShift2Row({ ...initialRow });
        setShift3Row({ ...initialRow });
        setSelectedShift(null);
        setCurrentRow({ ...initialRow });
        // Keep machine field value that user entered (don't clear it)
        setPrimaryData({
          date: date,
          machine: machine // Keep the machine value user entered
        });
      }
    } catch (error) {
      console.error('Error checking primary data:', error);
      // On error, clear everything
      setIsPrimaryLocked(false);
      setPrimaryFieldLocked({ date: false, machine: false });
      setOperationFieldLocked({
        shift1: { operatorName: false, operatedBy: false },
        shift2: { operatorName: false, operatedBy: false },
        shift3: { operatorName: false, operatedBy: false }
      });
      setOperationData({
        shift1: { operatorName: '', operatedBy: '' },
        shift2: { operatorName: '', operatedBy: '' },
        shift3: { operatorName: '', operatedBy: '' }
      });
      setShift1Row({ ...initialRow });
      setShift2Row({ ...initialRow });
      setShift3Row({ ...initialRow });
      setSelectedShift(null);
      setCurrentRow({ ...initialRow });
    } finally {
      setCheckingData(false);
    }
  };

  // Handle primary data submission
  const handlePrimarySubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate required fields
    if (!primaryData.date || !primaryData.machine) {
      alert('Please fill in both Date and Machine fields');
      return;
    }

    // Check if there are any unlocked fields with data to save
    // Date is always editable, so we check if machine is unlocked and has data
    const hasUnlockedMachine = !primaryFieldLocked.machine && primaryData.machine && primaryData.machine.trim() !== '';
    
    // Check if this is a new record (no machine data exists)
    const isNewRecord = !isPrimaryLocked || !primaryFieldLocked.machine;
    
    // Check if there's anything new to save
    // Date can always be updated, machine can be updated if unlocked
    if (!isNewRecord && !hasUnlockedMachine) {
      alert('No new data to save. Machine field is locked.');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, primary: true }));
      
      // Build payload - always include date and machine (needed to find/create record)
      const payload = {
        date: primaryData.date,
        section: 'primary'
      };
      
      // Always send date (it's always editable)
      // Only send machine if it's unlocked or if it's a new record
      if (isNewRecord || hasUnlockedMachine) {
        payload.machine = primaryData.machine.trim();
      }

      const data = await api.post('/v1/dmm-settings', payload);
      
      if (data.success) {
        // After successful save, re-check the data to update locks properly
        await checkExistingPrimaryData(primaryData.date, primaryData.machine);
        alert('Primary data saved successfully! Saved fields are now locked.');
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

  const handleOperationChange = (shift, field, value) => {
    setOperationData((prev) => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [field]: value
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setCurrentRow((prev) => ({ ...prev, [field]: value }));
  };

  // Handle shift selection from dropdown
  const handleShiftChange = (shiftNumber) => {
    // Save current row data to the previously selected shift before switching
    if (selectedShift) {
      if (selectedShift === 1) {
        setShift1Row({ ...currentRow });
      } else if (selectedShift === 2) {
        setShift2Row({ ...currentRow });
      } else if (selectedShift === 3) {
        setShift3Row({ ...currentRow });
      }
    }

    if (!shiftNumber) {
      setSelectedShift(null);
      setCurrentRow({ ...initialRow });
      return;
    }

    setSelectedShift(shiftNumber);
    
    // Load the selected shift's data into current row
    if (shiftNumber === 1) {
      setCurrentRow({ ...shift1Row });
    } else if (shiftNumber === 2) {
      setCurrentRow({ ...shift2Row });
    } else if (shiftNumber === 3) {
      setCurrentRow({ ...shift3Row });
    }
  };

  // Handle Operation table submission
  const handleOperationSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure primary data is saved first
    if (!isPrimaryLocked) {
      alert('Please save Primary data (Date and Machine) first before submitting.');
      return;
    }
    
    if (!primaryData.date || !primaryData.machine) {
      alert('Please fill in Primary data (Date and Machine) first');
      return;
    }

    // Check if there are any unlocked fields with data to save
    const hasUnlockedData = ['shift1', 'shift2', 'shift3'].some(shiftKey => {
      const shiftLocked = operationFieldLocked[shiftKey];
      const shiftData = operationData[shiftKey];
      return (!shiftLocked.operatorName && shiftData.operatorName && shiftData.operatorName.trim() !== '') ||
             (!shiftLocked.operatedBy && shiftData.operatedBy && shiftData.operatedBy.trim() !== '');
    });

    // Check if this is a new record (no operation data exists)
    const isNewRecord = !operationFieldLocked.shift1.operatorName && 
                       !operationFieldLocked.shift1.operatedBy &&
                       !operationFieldLocked.shift2.operatorName && 
                       !operationFieldLocked.shift2.operatedBy &&
                       !operationFieldLocked.shift3.operatorName && 
                       !operationFieldLocked.shift3.operatedBy;

    // Check if there's anything new to save
    if (!isNewRecord && !hasUnlockedData) {
      alert('No new data to save. All fields are either locked or empty.');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, operation: true }));
      
      // Build payload - only include unlocked fields for existing records
      const payload = {
        date: primaryData.date,
        machine: primaryData.machine,
        section: 'operation',
        shifts: {}
      };

      // Process each shift - only include unlocked fields
      ['shift1', 'shift2', 'shift3'].forEach(shiftKey => {
        const shiftLocked = operationFieldLocked[shiftKey];
        const shiftData = operationData[shiftKey];
        const shiftPayload = {};
        
        if (isNewRecord) {
          // New record - send all fields that have data
          if (shiftData.operatorName && shiftData.operatorName.trim() !== '') {
            shiftPayload.operatorName = shiftData.operatorName.trim();
          }
          if (shiftData.operatedBy && shiftData.operatedBy.trim() !== '') {
            shiftPayload.checkedBy = shiftData.operatedBy.trim();
          }
        } else {
          // Existing record - only send unlocked fields
          if (!shiftLocked.operatorName && shiftData.operatorName && shiftData.operatorName.trim() !== '') {
            shiftPayload.operatorName = shiftData.operatorName.trim();
          }
          if (!shiftLocked.operatedBy && shiftData.operatedBy && shiftData.operatedBy.trim() !== '') {
            shiftPayload.checkedBy = shiftData.operatedBy.trim();
          }
        }
        
        // Only add shift to payload if it has data
        if (Object.keys(shiftPayload).length > 0) {
          payload.shifts[shiftKey] = shiftPayload;
        }
      });

      // Only send if there's at least one shift with data
      if (Object.keys(payload.shifts).length === 0) {
        alert('Please enter at least one field in the operation table.');
        setLoadingStates(prev => ({ ...prev, operation: false }));
        return;
      }

      const data = await api.post('/v1/dmm-settings', payload);
      if (data.success) {
        // After successful save, re-check the data to update locks properly
        await checkExistingPrimaryData(primaryData.date, primaryData.machine);
        alert('Operation data saved successfully! Saved fields are now locked.');
      }
    } catch (error) {
      console.error('Error saving operation data:', error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, operation: false }));
    }
  };

  // Handle Shift parameter submission
  // Fetch shift counts from database
  const fetchShiftCounts = async () => {
    if (!primaryData.date || !primaryData.machine) {
      setShiftCounts({ shift1: 0, shift2: 0, shift3: 0 });
      return;
    }

    try {
      const response = await api.get(`/v1/dmm-settings/primary?date=${encodeURIComponent(primaryData.date)}&machine=${encodeURIComponent(primaryData.machine)}`);
      
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
    e.preventDefault();
    
    // Ensure a shift is selected
    if (!selectedShift) {
      alert('Please select a shift first.');
      return;
    }
    
    // Ensure primary data is locked first
    if (!isPrimaryLocked) {
      alert('Please save Primary data first before submitting.');
      return;
    }
    
    if (!primaryData.date || !primaryData.machine) {
      alert('Please fill in Primary data (Date and Machine) first');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, shift: true }));
      
      const payload = {
        date: primaryData.date,
        machine: primaryData.machine,
        section: `shift${selectedShift}`,
        parameters: {
          [`shift${selectedShift}`]: currentRow
        }
      };

      const data = await api.post('/v1/dmm-settings', payload);
      if (data.success) {
        // Clear the corresponding shift row state after successful save
        if (selectedShift === 1) {
          setShift1Row({ ...initialRow });
        } else if (selectedShift === 2) {
          setShift2Row({ ...initialRow });
        } else if (selectedShift === 3) {
          setShift3Row({ ...initialRow });
        }
        
        // Clear current row for next entry
        setCurrentRow({ ...initialRow });
        
        // Fetch updated counts from database
        await fetchShiftCounts();
        
        // Focus customer input (first input after shift dropdown)
        setTimeout(() => {
          if (shiftFirstInputRef.current) {
            shiftFirstInputRef.current.focus();
          }
        }, 100);
        
        alert(`Shift ${selectedShift} parameters saved successfully!`);
      }
    } catch (error) {
      console.error(`Error saving shift ${selectedShift} data:`, error);
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
        // Last input - focus submit button
        if (shiftSubmitRef.current) {
          shiftSubmitRef.current.focus();
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
    setPrimaryData({ date: '', machine: '' });
    setIsPrimaryLocked(false);
    // Also reset checking state
    setCheckingData(false);
  };

  const resetOperationData = () => {
    if (!window.confirm('Are you sure you want to reset Operation data?')) return;
    setOperationData({
      shift1: { operatorName: '', operatedBy: '' },
      shift2: { operatorName: '', operatedBy: '' },
      shift3: { operatorName: '', operatedBy: '' }
    });
  };

  const resetShiftRow = () => {
    if (!selectedShift) {
      alert('Please select a shift first.');
      return;
    }
    if (!window.confirm(`Are you sure you want to reset Shift ${selectedShift} Parameters?`)) return;
    setCurrentRow({ ...initialRow });
  };

  const handleViewReport = () => {
    navigate('/moulding/dmm-setting-parameters/report');
  };

  const renderRow = () => {
    return (
    <div className="dmm-form-grid dmm-shift-form-grid">
      <div className="dmm-form-group">
        <label>Shift *</label>
        <select
          value={selectedShift || ''}
          onChange={(e) => handleShiftChange(e.target.value ? parseInt(e.target.value) : null)}
          onKeyDown={handleShiftKeyDown}
          disabled={!isPrimaryLocked}
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            border: '2px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '0.875rem',
            backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
            color: !isPrimaryLocked ? '#64748b' : '#1e293b',
            cursor: !isPrimaryLocked ? 'not-allowed' : 'pointer'
          }}
        >
          <option value="">Select Shift</option>
          <option value="1">Shift 1 (Count: {shiftCounts.shift1})</option>
          <option value="2">Shift 2 (Count: {shiftCounts.shift2})</option>
          <option value="3">Shift 3 (Count: {shiftCounts.shift3})</option>
        </select>
      </div>
      <div className="dmm-form-group">
        <label>Customer</label>
        <input
          type="text"
          ref={shiftFirstInputRef}
          value={currentRow.customer}
          onChange={(e) => handleInputChange("customer", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., ABC Industries"
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Core Mask Thickness (mm)</label>
        <input
          type="number"
          value={currentRow.spCoreMaskThickness}
          onChange={(e) => handleInputChange("spCoreMaskThickness", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 12.0"
          step="any"
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>SP Core Mask Height (mm)</label>
        <input
          type="number"
          value={currentRow.spCoreMaskHeight}
          onChange={(e) => handleInputChange("spCoreMaskHeight", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 95.5"
          step="any"
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Core Mask Thickness (mm)</label>
        <input
          type="number"
          value={currentRow.ppCoreMaskThickness}
          onChange={(e) => handleInputChange("ppCoreMaskThickness", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 10.5"
          step="any"
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
      <div className="dmm-form-group">
        <label>PP Core Mask Height (mm)</label>
        <input
          type="number"
          value={currentRow.ppCoreMaskHeight}
          onChange={(e) => handleInputChange("ppCoreMaskHeight", e.target.value)}
          onKeyDown={handleShiftKeyDown}
          placeholder="e.g., 85.0"
          step="any"
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
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
          disabled={!selectedShift || !isPrimaryLocked}
          style={{
            resize: 'none',
            backgroundColor: (!selectedShift || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
            cursor: (!selectedShift || !isPrimaryLocked) ? 'not-allowed' : 'text'
          }}
        />
      </div>
    </div>
    );
  };

  return (
    <>
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
          <div className="dmm-section">
            <h3 className="dmm-section-title">Primary Data</h3>
            {checkingData && (
              <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                Checking for existing data...
              </div>
            )}
            {isPrimaryLocked && !checkingData && (
              <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                Machine field is locked. Date is always editable. Operation table fields with data are locked, empty fields remain editable.
              </div>
            )}
            {/* Primary Data Grid */}
            <div className="dmm-form-grid">
              <div className="dmm-form-group">
                <label>Date *</label>
                <CustomDatePicker
                  value={primaryData.date}
                  onChange={(e) => handlePrimaryChange("date", e.target.value)}
                  disabled={checkingData}
                  name="date"
                  style={{
                    backgroundColor: '#ffffff',
                    cursor: 'text'
                  }}
                />
              </div>
              <div className="dmm-form-group">
                <label>Machine *</label>
                <input
                  type="text"
                  value={primaryData.machine}
                  onChange={(e) => handlePrimaryChange("machine", e.target.value)}
                  disabled={primaryFieldLocked.machine || checkingData}
                  readOnly={primaryFieldLocked.machine}
                  placeholder="e.g., 1, 2, 3"
                  style={{
                    backgroundColor: primaryFieldLocked.machine ? '#f1f5f9' : '#ffffff',
                    cursor: primaryFieldLocked.machine ? 'not-allowed' : 'text'
                  }}
                  required
                />
              </div>
              <div className="dmm-form-group">
                <label>&nbsp;</label>
                <button
                  type="button"
                  onClick={handlePrimarySubmit}
                  disabled={checkingData || loadingStates.primary || (!primaryData.date || !primaryData.machine)}
                  className="dmm-lock-primary-btn"
                >
                  {loadingStates.primary ? 'Saving...' : (isPrimaryLocked ? 'Save Changes' : 'Save Primary')}
                </button>
              </div>
            </div>
          </div>

      {/* Divider line to separate primary data from other inputs */}
      <div style={{ width: '100%', marginTop: '1rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}></div>

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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const form = e.target.closest('form');
                            const inputs = Array.from(form.querySelectorAll('input, textarea'));
                            const currentIndex = inputs.indexOf(e.target);
                            const nextInput = inputs[currentIndex + 1];
                            if (nextInput) {
                              nextInput.focus();
                            }
                          }
                        }}
                        placeholder="Enter operator name"
                        className="dmm-table-input"
                        disabled={operationFieldLocked.shift1.operatorName || !isPrimaryLocked}
                        readOnly={operationFieldLocked.shift1.operatorName}
                        style={{
                          backgroundColor: (operationFieldLocked.shift1.operatorName || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
                          cursor: (operationFieldLocked.shift1.operatorName || !isPrimaryLocked) ? 'not-allowed' : 'text'
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift2.operatorName}
                        onChange={(e) => handleOperationChange('shift2', 'operatorName', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const form = e.target.closest('form');
                            const inputs = Array.from(form.querySelectorAll('input, textarea'));
                            const currentIndex = inputs.indexOf(e.target);
                            const nextInput = inputs[currentIndex + 1];
                            if (nextInput) {
                              nextInput.focus();
                            }
                          }
                        }}
                        placeholder="Enter operator name"
                        className="dmm-table-input"
                        disabled={operationFieldLocked.shift2.operatorName || !isPrimaryLocked}
                        readOnly={operationFieldLocked.shift2.operatorName}
                        style={{
                          backgroundColor: (operationFieldLocked.shift2.operatorName || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
                          cursor: (operationFieldLocked.shift2.operatorName || !isPrimaryLocked) ? 'not-allowed' : 'text'
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift3.operatorName}
                        onChange={(e) => handleOperationChange('shift3', 'operatorName', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const form = e.target.closest('form');
                            const inputs = Array.from(form.querySelectorAll('input, textarea'));
                            const currentIndex = inputs.indexOf(e.target);
                            const nextInput = inputs[currentIndex + 1];
                            if (nextInput) {
                              nextInput.focus();
                            }
                          }
                        }}
                        placeholder="Enter operator name"
                        className="dmm-table-input"
                        disabled={operationFieldLocked.shift3.operatorName || !isPrimaryLocked}
                        readOnly={operationFieldLocked.shift3.operatorName}
                        style={{
                          backgroundColor: (operationFieldLocked.shift3.operatorName || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
                          cursor: (operationFieldLocked.shift3.operatorName || !isPrimaryLocked) ? 'not-allowed' : 'text'
                        }}
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const form = e.target.closest('form');
                            const inputs = Array.from(form.querySelectorAll('input, textarea'));
                            const currentIndex = inputs.indexOf(e.target);
                            const nextInput = inputs[currentIndex + 1];
                            if (nextInput) {
                              nextInput.focus();
                            }
                          }
                        }}
                        placeholder="Enter name"
                        className="dmm-table-input"
                        disabled={operationFieldLocked.shift1.operatedBy || !isPrimaryLocked}
                        readOnly={operationFieldLocked.shift1.operatedBy}
                        style={{
                          backgroundColor: (operationFieldLocked.shift1.operatedBy || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
                          cursor: (operationFieldLocked.shift1.operatedBy || !isPrimaryLocked) ? 'not-allowed' : 'text'
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift2.operatedBy}
                        onChange={(e) => handleOperationChange('shift2', 'operatedBy', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const form = e.target.closest('form');
                            const inputs = Array.from(form.querySelectorAll('input, textarea'));
                            const currentIndex = inputs.indexOf(e.target);
                            const nextInput = inputs[currentIndex + 1];
                            if (nextInput) {
                              nextInput.focus();
                            }
                          }
                        }}
                        placeholder="Enter name"
                        className="dmm-table-input"
                        disabled={operationFieldLocked.shift2.operatedBy || !isPrimaryLocked}
                        readOnly={operationFieldLocked.shift2.operatedBy}
                        style={{
                          backgroundColor: (operationFieldLocked.shift2.operatedBy || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
                          cursor: (operationFieldLocked.shift2.operatedBy || !isPrimaryLocked) ? 'not-allowed' : 'text'
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={operationData.shift3.operatedBy}
                        onChange={(e) => handleOperationChange('shift3', 'operatedBy', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const form = e.target.closest('form');
                            const inputs = Array.from(form.querySelectorAll('input, textarea'));
                            const currentIndex = inputs.indexOf(e.target);
                            const nextInput = inputs[currentIndex + 1];
                            if (nextInput) {
                              nextInput.focus();
                            }
                          }
                        }}
                        placeholder="Enter name"
                        className="dmm-table-input"
                        disabled={operationFieldLocked.shift3.operatedBy || !isPrimaryLocked}
                        readOnly={operationFieldLocked.shift3.operatedBy}
                        style={{
                          backgroundColor: (operationFieldLocked.shift3.operatedBy || !isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
                          cursor: (operationFieldLocked.shift3.operatedBy || !isPrimaryLocked) ? 'not-allowed' : 'text'
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="dmm-section-submit" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={resetOperationData}
                className="dmm-reset-btn"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                type="button"
                onClick={handleOperationSubmit}
                disabled={loadingStates.operation || !isPrimaryLocked}
                className="dmm-submit-btn"
                title={!isPrimaryLocked ? 'Please save Primary data first' : 'Save Operation'}
              >
                {loadingStates.operation ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                {loadingStates.operation ? 'Saving...' : (isPrimaryLocked ? 'Save Changes' : 'Save Operation')}
              </button>
            </div>
          </div>

          {/* Shift Parameters Section */}
          <div className="dmm-section">
            <h3 className="dmm-section-title">
              Shift Parameters
              {selectedShift && ` - Shift ${selectedShift} (Count: ${shiftCounts[`shift${selectedShift}`] || 0})`}
            </h3>
            {!isPrimaryLocked && (
              <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                Please save Primary data first to enable shift parameters entry.
              </div>
            )}
            {renderRow()}
            <div className="dmm-section-submit" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={resetShiftRow}
                className="dmm-reset-btn"
                disabled={!selectedShift}
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                ref={shiftSubmitRef}
                type="button"
                onClick={handleShiftSubmit}
                onKeyDown={handleSubmitButtonKeyDown}
                disabled={loadingStates.shift || !isPrimaryLocked || !selectedShift}
                title={!isPrimaryLocked ? 'Please save Primary data first' : !selectedShift ? 'Please select a shift' : `Submit Shift ${selectedShift}`}
                className="dmm-submit-btn"
              >
                {loadingStates.shift ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                {loadingStates.shift ? 'Saving...' : selectedShift ? `Submit Shift ${selectedShift}` : 'Submit'}
              </button>
            </div>
          </div>
      </form>
    </>
  );
};

export default DmmSettingParameters;
