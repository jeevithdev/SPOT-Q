import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, FileText, Plus, Minus, X, Loader2, Edit2, RotateCcw, RefreshCw } from "lucide-react";
import CustomDatePicker from "../../Components/CustomDatePicker";
import Loader from "../../Components/Loader";
import api from "../../utils/api";
import "../../styles/PageStyles/Moulding/DisamaticProduct.css";

// Get today's date in YYYY-MM-DD format
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const initialFormData = {
  date: getTodaysDate(), // Set today's date by default
  shift: "",
  incharge: "",
  ppOperator: "",
  members: [""],
  productionTable: [{ counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }],
  nextShiftPlanTable: [{ componentName: "", plannedMoulds: "", remarks: "" }],
  delaysTable: [{ delays: "", durationMinutes: "", durationTime: "" }],
  mouldHardnessTable: [{ componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }],
  patternTempTable: [{ item: "", pp: "", sp: "" }],
  significantEvent: "",
  maintenance: "",
  supervisorName: "",
};

const DisamaticProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loadingStates, setLoadingStates] = useState({
    basicInfo: false,
    production: false,
    nextShiftPlan: false,
    delays: false,
    mouldHardness: false,
    patternTemp: false,
    eventSection: false
  });
  const [checkingData, setCheckingData] = useState(false);
  const [isPrimaryLocked, setIsPrimaryLocked] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const [allSubmitting, setAllSubmitting] = useState(false);
  const [primaryId, setPrimaryId] = useState(null);
  const [basicInfoLocked, setBasicInfoLocked] = useState(false);
  const [basicFieldLocked, setBasicFieldLocked] = useState({
    shift: false,
    incharge: false,
    ppOperator: false
  });
  const [eventSectionLocked, setEventSectionLocked] = useState({
    significantEvent: false,
    maintenance: false,
    supervisorName: false
  });
  const [initialMembers, setInitialMembers] = useState([]);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    shift: false,
    incharge: false,
    ppOperator: false,
    members: false
  });
  
  // Auto-update date if user keeps page open past midnight
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getTodaysDate();
      if (formData.date !== today) {
        // Update date silently; keep other data. Do not unlock primary.
        setFormData(prev => ({ ...prev, date: today }));
      }
    }, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [formData.date]);
  
  // Validate primary field in real-time
  const validateField = (field, value) => {
    let isValid = false;
    
    switch(field) {
      case 'shift':
        isValid = value && value.trim() !== '';
        break;
      case 'incharge':
        isValid = value && value.trim() !== '';
        break;
      case 'ppOperator':
        isValid = value && value.trim() !== '';
        break;
      case 'members':
        // Check if at least one member has a value
        if (Array.isArray(value)) {
          isValid = value.some(m => m && m.trim() !== '');
        } else {
          isValid = false;
        }
        break;
      default:
        isValid = true;
    }
    
    setValidationErrors(prev => ({ ...prev, [field]: !isValid }));
    return isValid;
  };
  
  // Reset form (new entry) utility
  const resetForm = () => {
    const today = getTodaysDate();
    setFormData({ ...initialFormData, date: today });
    setIsPrimaryLocked(false);
    setBasicFieldLocked({ shift: false, incharge: false, ppOperator: false });
    setEventSectionLocked({ significantEvent: false, maintenance: false, supervisorName: false });
    setPrimaryId(null);
    setIsNewRecord(true);
    setValidationErrors({ shift: false, incharge: false, ppOperator: false, members: false });
  };

  // New simplified Enter handling for member fields to avoid needing multiple presses
  const handleMemberKeyDown = (e, index) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    // Include current input value immediately (keydown fires before potential state sync edge cases)
    const updatedMembers = [...formData.members];
    updatedMembers[index] = e.target.value;
    const shiftValid = formData.shift && formData.shift.trim() !== '';
    const inchargeValid = formData.incharge && formData.incharge.trim() !== '';
    const ppOperatorValid = formData.ppOperator && formData.ppOperator.trim() !== '';
    const membersValid = updatedMembers.some(m => m && m.trim() !== '');
    const isLast = index === updatedMembers.length - 1;
    if (shiftValid && inchargeValid && ppOperatorValid && membersValid && isLast) {
      // Persist updated members then lock & jump
      setFormData(prev => ({ ...prev, members: updatedMembers }));
      handlePrimaryLockAndJump(updatedMembers); // pass override
    } else {
      // Navigate or show validation focus
      if (!shiftValid) {
        document.getElementById('shift-field')?.focus();
        return;
      }
      if (!inchargeValid) {
        document.getElementById('incharge-field')?.focus();
        return;
      }
      if (!ppOperatorValid) {
        document.getElementById('ppoperator-field')?.focus();
        return;
      }
      if (!membersValid) {
        document.getElementById('member-field-0')?.focus();
        return;
      }
      // Move to next member field if exists
      const nextId = `member-field-${index + 1}`;
      const nextEl = document.getElementById(nextId);
      if (nextEl) nextEl.focus();
    }
  };
  
  // Lock primary section and jump to production table
  const handlePrimaryLockAndJump = async (overrideMembers) => {
    if (!formData.date) {
      alert('Date is required');
      return;
    }

    // Validate all fields
    const shiftValid = validateField('shift', formData.shift);
    const inchargeValid = validateField('incharge', formData.incharge);
    const ppOperatorValid = validateField('ppOperator', formData.ppOperator);
    const membersToUse = overrideMembers || formData.members;
    const membersValid = validateField('members', membersToUse);
    
    if (!shiftValid || !inchargeValid || !ppOperatorValid || !membersValid) {
      alert('Please fill all required fields: Shift, Incharge, PP Operator, and at least one Member');
      return;
    }

  const allMembers = membersToUse.filter(m => m.trim() !== '');

    try {
      setLoadingStates(prev => ({ ...prev, basicInfo: true }));
      
      const payload = {
        date: formData.date,
        section: 'basicInfo'
      };
      
      if (isNewRecord) {
        payload.shift = formData.shift && formData.shift.trim() !== '' ? formData.shift.trim() : '';
        if (formData.incharge && formData.incharge.trim() !== '') {
          payload.incharge = formData.incharge.trim();
        }
        if (formData.ppOperator && formData.ppOperator.trim() !== '') {
          payload.ppOperator = formData.ppOperator.trim();
        }
        if (allMembers.length > 0) {
          payload.members = allMembers;
        }
      } else {
        if (!basicFieldLocked.shift) {
          payload.shift = formData.shift.trim();
        }
        if (!basicFieldLocked.incharge) {
          payload.incharge = formData.incharge.trim();
        }
        if (!basicFieldLocked.ppOperator) {
          payload.ppOperator = formData.ppOperator.trim();
        }
        if (allMembers.length > 0) {
          payload.members = allMembers;
        }
      }

      const data = await api.post('/v1/dismatic-reports', payload);
      
      if (data.success) {
        setPrimaryId(data.data?._id || null);
        if (formData.shift) {
          await checkAndLockByDateAndShift(formData.date, formData.shift);
        }
        await checkExistingPrimaryData(formData.date);
        
        // Lock the primary section
        setIsPrimaryLocked(true);
        
        // Jump to first production table input
        setTimeout(() => {
          focusFirstTableInput('production');
        }, 50);
      } else {
        alert('Failed to save: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving basic info:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert('Failed to save basic information: ' + errorMessage);
    } finally {
      setLoadingStates(prev => ({ ...prev, basicInfo: false }));
    }
  };
  
  const handleChange = (field, value) => {
    // Date is always fixed to today, ignore any change attempts
    if (field === 'date') {
      return; // Do nothing - date is locked to today
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate the field
    if (['shift', 'incharge', 'ppOperator'].includes(field)) {
      validateField(field, value);
    }
  };
  
  const handleMemberChange = (index, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = value;
    setFormData(prev => ({ ...prev, members: updatedMembers }));
    
    // Validate members
    validateField('members', updatedMembers);
  };

  const addMemberField = () => {
    setFormData(prev => ({ ...prev, members: [...prev.members, ""] }));
  };

  const removeMemberField = (index) => {
    if (formData.members.length > 1) {
      const updatedMembers = formData.members.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, members: updatedMembers }));
    }
  };

  const handleProductionTableChange = (index, field, value) => {
    const updatedTable = [...formData.productionTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, productionTable: updatedTable }));
  };

  const handleNextShiftPlanChange = (index, field, value) => {
    const updatedTable = [...formData.nextShiftPlanTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, nextShiftPlanTable: updatedTable }));
  };

  const handleDelaysTableChange = (index, field, value) => {
    const updatedTable = [...formData.delaysTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, delaysTable: updatedTable }));
  };

  const handleMouldHardnessTableChange = (index, field, value) => {
    const updatedTable = [...formData.mouldHardnessTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, mouldHardnessTable: updatedTable }));
  };

  const handlePatternTempTableChange = (index, field, value) => {
    const updatedTable = [...formData.patternTempTable];
    updatedTable[index] = { ...updatedTable[index], [field]: value };
    setFormData(prev => ({ ...prev, patternTempTable: updatedTable }));
  };

  // Add row functions
  const addProductionRow = () => {
    setFormData(prev => ({
      ...prev,
      productionTable: [...prev.productionTable, { counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }]
    }));
  };

  const addNextShiftPlanRow = () => {
    setFormData(prev => ({
      ...prev,
      nextShiftPlanTable: [...prev.nextShiftPlanTable, { componentName: "", plannedMoulds: "", remarks: "" }]
    }));
  };

  const addDelaysRow = () => {
    setFormData(prev => ({
      ...prev,
      delaysTable: [...prev.delaysTable, { delays: "", durationMinutes: "", durationTime: "" }]
    }));
  };

  const addMouldHardnessRow = () => {
    setFormData(prev => ({
      ...prev,
      mouldHardnessTable: [...prev.mouldHardnessTable, { componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }]
    }));
  };

  const addPatternTempRow = () => {
    setFormData(prev => ({
      ...prev,
      patternTempTable: [...prev.patternTempTable, { item: "", pp: "", sp: "" }]
    }));
  };

  // Delete row functions
  const deleteProductionRow = (index) => {
    if (formData.productionTable.length > 1) {
      const updatedTable = formData.productionTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, productionTable: updatedTable }));
    }
  };

  const deleteNextShiftPlanRow = (index) => {
    if (formData.nextShiftPlanTable.length > 1) {
      const updatedTable = formData.nextShiftPlanTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, nextShiftPlanTable: updatedTable }));
    }
  };

  const deleteDelaysRow = (index) => {
    if (formData.delaysTable.length > 1) {
      const updatedTable = formData.delaysTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, delaysTable: updatedTable }));
    }
  };

  const deleteMouldHardnessRow = (index) => {
    if (formData.mouldHardnessTable.length > 1) {
      const updatedTable = formData.mouldHardnessTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, mouldHardnessTable: updatedTable }));
    }
  };

  const deletePatternTempRow = (index) => {
    if (formData.patternTempTable.length > 1) {
      const updatedTable = formData.patternTempTable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, patternTempTable: updatedTable }));
    }
  };

  // Handle Enter key navigation for table inputs
  const handleTableKeyDown = (e, tableName, rowIndex, fieldIndex, totalFields) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Get all inputs in the current table row
      const currentRow = e.target.closest('tr');
      if (!currentRow) return;
      
      const inputs = Array.from(currentRow.querySelectorAll('input:not([disabled]), textarea:not([disabled])'));
      const currentInputIndex = inputs.indexOf(e.target);
      
      // If not the last input in the row, move to next input
      if (currentInputIndex < inputs.length - 1) {
        inputs[currentInputIndex + 1].focus();
        return;
      }
      
      // If this is the last input in the row, just move to next section (no save)
      if (currentInputIndex === inputs.length - 1) {
        // Just navigate to the next section without saving
        const nextSection = {
          'production': 'nextShiftPlan',
          'nextShiftPlan': 'delays',
          'delays': 'mouldHardness',
          'mouldHardness': 'patternTemp',
          'patternTemp': 'eventSection'
        };
        
        if (nextSection[tableName]) {
          setTimeout(() => {
            focusFirstTableInput(nextSection[tableName]);
          }, 50);
        }
      }
    }
  };

  // Removed updateNextSNoForTable - no longer needed

  // Focus first input of a table - simplified
  const focusFirstTableInput = (tableSection) => {
    setTimeout(() => {
      // Find all sections and match by h3 text content
      const sections = document.querySelectorAll('.disamatic-section');
      let targetSection = null;
      
      sections.forEach(section => {
        const h3 = section.querySelector('h3.disamatic-section-title');
        if (h3) {
          const text = h3.textContent || '';
          if (tableSection === 'production' && text.includes('Production') && !text.includes('Mould Hardness')) {
            targetSection = section;
          } else if (tableSection === 'nextShiftPlan' && text.includes('Next Shift Plan')) {
            targetSection = section;
          } else if (tableSection === 'delays' && text.includes('Delays')) {
            targetSection = section;
          } else if (tableSection === 'mouldHardness' && text.includes('Mould Hardness')) {
            targetSection = section;
          } else if (tableSection === 'patternTemp' && text.includes('Pattern Temp')) {
            targetSection = section;
          } else if (tableSection === 'eventSection' && text.includes('Event Information')) {
            targetSection = section;
          }
        }
      });
      
      if (targetSection) {
        if (tableSection === 'eventSection') {
          // For event section, focus on the first textarea (Significant Event)
          const firstTextarea = targetSection.querySelector('textarea:not([disabled])');
          if (firstTextarea) {
            firstTextarea.focus();
          }
        } else {
          const tableWrapper = targetSection.querySelector('.disamatic-table-wrapper');
          if (tableWrapper) {
            const firstInput = tableWrapper.querySelector('tbody tr:first-child input:not([disabled])');
            if (firstInput) {
              firstInput.focus();
            }
          }
        }
      }
    }, 50);
  };

  // Reset functions for each table - reset to show next S.No
  
  // ===== VALIDATION HELPER FUNCTIONS =====
  
  // Check if production table has at least one row with data
  const hasProductionData = () => {
    return formData.productionTable.some(row => 
      row.counterNo?.trim() !== '' || 
      row.componentName?.trim() !== '' || 
      row.produced?.toString().trim() !== '' || 
      row.poured?.toString().trim() !== '' || 
      row.cycleTime?.trim() !== '' || 
      row.mouldsPerHour?.toString().trim() !== '' ||
      row.remarks?.trim() !== ''
    );
  };

  // Check if nextShiftPlan table has at least one row with data
  const hasNextShiftPlanData = () => {
    return formData.nextShiftPlanTable.some(row => 
      row.componentName?.trim() !== '' || 
      row.plannedMoulds?.toString().trim() !== '' || 
      row.remarks?.trim() !== ''
    );
  };

  // Check if delays table has at least one row with data
  const hasDelaysData = () => {
    return formData.delaysTable.some(row => 
      row.delays?.trim() !== '' || 
      row.durationMinutes?.toString().trim() !== '' || 
      row.durationTime?.trim() !== ''
    );
  };

  // Check if mouldHardness table has at least one row with data
  const hasMouldHardnessData = () => {
    return formData.mouldHardnessTable.some(row => 
      row.componentName?.trim() !== '' || 
      row.mpPP?.toString().trim() !== '' || 
      row.mpSP?.toString().trim() !== '' || 
      row.bsPP?.toString().trim() !== '' || 
      row.bsSP?.toString().trim() !== '' ||
      row.remarks?.trim() !== ''
    );
  };

  // Check if patternTemp table has at least one row with data
  const hasPatternTempData = () => {
    return formData.patternTempTable.some(row => 
      row.item?.trim() !== '' || 
      row.pp?.toString().trim() !== '' || 
      row.sp?.toString().trim() !== ''
    );
  };

  // Check if event section has at least one field with data
  const hasEventSectionData = () => {
    return (formData.significantEvent?.trim() !== '') || 
           (formData.maintenance?.trim() !== '') || 
           (formData.supervisorName?.trim() !== '');
  };

  // ===== END VALIDATION HELPERS =====

  const resetProductionTable = () => {
    setFormData(prev => ({ ...prev, productionTable: [{ counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }] }));
  };

  const resetNextShiftPlanTable = () => {
    setFormData(prev => ({ ...prev, nextShiftPlanTable: [{ componentName: "", plannedMoulds: "", remarks: "" }] }));
  };

  const resetDelaysTable = () => {
    setFormData(prev => ({ ...prev, delaysTable: [{ delays: "", durationMinutes: "", durationTime: "" }] }));
  };

  const resetMouldHardnessTable = () => {
    setFormData(prev => ({ ...prev, mouldHardnessTable: [{ componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }] }));
  };

  const resetPatternTempTable = () => {
    setFormData(prev => ({ ...prev, patternTempTable: [{ item: "", pp: "", sp: "" }] }));
  };

  const handleViewReport = () => {
    navigate('/moulding/disamatic-product/report');
  };

  // Check if primary data exists for date (similar to DmmSettingParameters)
  const checkExistingPrimaryData = async (date) => {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      // Reset all locks when no valid date
      setPrimaryId(null);
      setBasicInfoLocked(false);
      setIsPrimaryLocked(false);
      setBasicFieldLocked({
        shift: false,
        incharge: false,
        ppOperator: false
      });
      return;
    }

    try {
      setCheckingData(true);
      // Get report by date (primary identifier) - date is unique
      const response = await api.get(`/v1/dismatic-reports/date?date=${encodeURIComponent(date)}`);
      
      if (response.success && response.data && response.data.length > 0) {
        const report = response.data[0];
        setPrimaryId(report._id || null);
        
        // Determine per-field locks for primary data - only lock if field has actual saved data
        const hasShift = report.shift !== undefined && report.shift !== null && String(report.shift).trim() !== '';
        const hasIncharge = report.incharge !== undefined && report.incharge !== null && String(report.incharge).trim() !== '';
        const hasPpOperator = report.ppOperator !== undefined && report.ppOperator !== null && String(report.ppOperator).trim() !== '';
        const hasMembers = report.memberspresent && String(report.memberspresent).trim() !== '';

        // Lock only fields that have saved data
        setBasicFieldLocked({
          shift: hasShift,
          incharge: hasIncharge,
          ppOperator: hasPpOperator
        });
        
        // Check if there's existing data for this date+shift combination and lock shift accordingly
        if (hasShift && report.shift) {
          await checkAndLockByDateAndShift(date, report.shift);
        }

        // Check if any primary info exists (for UX messaging and primary lock state)
        if (report && (hasShift || hasIncharge || hasPpOperator || hasMembers)) {
          setBasicInfoLocked(true);
          setIsPrimaryLocked(true);
          
          // Populate basic info fields only - update all at once
          setFormData(prev => {
            const updated = { ...prev };
            if (hasShift) {
              updated.shift = String(report.shift || '').trim();
            } else {
              updated.shift = ''; // Clear if not saved
            }
            if (hasIncharge) {
              updated.incharge = String(report.incharge || '').trim();
            } else {
              updated.incharge = ''; // Clear if not saved
            }
            if (hasPpOperator) {
              updated.ppOperator = String(report.ppOperator || '').trim();
            } else {
              updated.ppOperator = ''; // Clear if not saved
            }
            if (hasMembers) {
              const members = String(report.memberspresent || '').split(',').map(m => m.trim()).filter(m => m);
              updated.members = members.length > 0 ? members : [''];
              // Store initial members to distinguish from newly added ones
              setInitialMembers([...members]);
            } else {
              updated.members = prev.members.length > 0 ? prev.members : [''];
              setInitialMembers([]);
            }
            return updated;
          });
          
          // Immediately check for full data since date record exists
          setTimeout(() => {
            checkExistingData();
          }, 100);
        } else {
          // No primary data exists - unlock all fields
          setBasicInfoLocked(false);
          setIsPrimaryLocked(false);
          setBasicFieldLocked({
            shift: false,
            incharge: false,
            ppOperator: false
          });
          // Clear form data for primary fields
          setFormData(prev => ({
            ...prev,
            shift: '',
            incharge: '',
            ppOperator: '',
            members: ['']
          }));
          setInitialMembers([]);
        }
      } else {
        // No record exists for this date - unlock all fields
        setPrimaryId(null);
        setBasicInfoLocked(false);
        setIsPrimaryLocked(false);
        setBasicFieldLocked({
          shift: false,
          incharge: false,
          ppOperator: false
        });
        // Clear form data for primary fields
        setFormData(prev => ({
          ...prev,
          shift: '',
          incharge: '',
          ppOperator: '',
          members: ['']
        }));
        setInitialMembers([]);
      }
    } catch (error) {
      console.error('Error checking primary data:', error);
      // On error, unlock all fields
      setPrimaryId(null);
      setBasicInfoLocked(false);
      setIsPrimaryLocked(false);
      setBasicFieldLocked({
        shift: false,
        incharge: false,
        ppOperator: false
      });
    } finally {
      setCheckingData(false);
    }
  };

  // Check if data exists for current date (date is primary identifier)
  const checkExistingData = async () => {
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      setIsLocked(false);
      return;
    }

    try {
      setCheckingData(true);
      // Get report by date (primary identifier) - date is unique
      const response = await api.get(`/v1/dismatic-reports/date?date=${encodeURIComponent(formData.date)}`);
      
      if (response.success && response.data && response.data.length > 0) {
        const report = response.data[0];
        
        // Check if report has any data beyond basic info (indicates form is complete/locked)
        const hasAdditionalData = (
          (report.productionDetails && report.productionDetails.length > 0) ||
          (report.nextShiftPlan && report.nextShiftPlan.length > 0) ||
          (report.delays && report.delays.length > 0) ||
          (report.mouldHardness && report.mouldHardness.length > 0) ||
          (report.patternTemperature && report.patternTemperature.length > 0) ||
          report.significantEvent ||
          report.maintenance ||
          report.supervisorName
        );

        if (hasAdditionalData) {
          setIsLocked(true);
        } else {
          setIsLocked(false);
        }

        // Check if individual event section fields have data (lock each field separately)
        // Only lock if field exists, is not null, not empty string, and has actual content after trimming
        // Empty strings (MongoDB defaults) should NOT trigger locks - only real data
        const significantEventValue = report.significantEvent;
        const maintenanceValue = report.maintenance;
        const supervisorNameValue = report.supervisorName;
        
        // STRICT check: value must be truthy (not null, undefined, or empty string)
        // AND must have non-empty content after trimming
        // This ensures MongoDB default empty strings don't trigger locks
        const hasSignificantEvent = significantEventValue !== undefined && 
                                   significantEventValue !== null &&
                                   significantEventValue !== '' &&
                                   typeof significantEventValue === 'string' &&
                                   significantEventValue.trim() !== '';
        const hasMaintenance = maintenanceValue !== undefined && 
                              maintenanceValue !== null &&
                              maintenanceValue !== '' &&
                              typeof maintenanceValue === 'string' &&
                              maintenanceValue.trim() !== '';
        const hasSupervisorName = supervisorNameValue !== undefined && 
                                 supervisorNameValue !== null &&
                                 supervisorNameValue !== '' &&
                                 typeof supervisorNameValue === 'string' &&
                                 supervisorNameValue.trim() !== '';
        
        // Only lock fields that actually have content - empty strings from defaults should not lock
        setEventSectionLocked({
          significantEvent: hasSignificantEvent,
          maintenance: hasMaintenance,
          supervisorName: hasSupervisorName
        });
        
        
        // Load all existing data into form - update all sections EXCEPT primary fields
        // NOTE: Primary fields (shift, incharge, ppOperator, members) are handled by checkExistingPrimaryData
        // This function only updates other sections (tables, event section) to avoid conflicts with locking logic
        setFormData(prev => {
          const updatedFormData = { ...prev };
          
          // DO NOT update primary fields here - they're fully handled by checkExistingPrimaryData
          // This prevents race conditions and ensures locks are set correctly
          // Primary fields will be loaded and locked by checkExistingPrimaryData before this function runs

          // Production Details
          if (report.productionDetails && Array.isArray(report.productionDetails) && report.productionDetails.length > 0) {
            updatedFormData.productionTable = report.productionDetails.map(item => ({
              sNo: item.sNo || 0,
              counterNo: String(item.counterNo || ''),
              componentName: String(item.componentName || ''),
              produced: item.produced !== undefined && item.produced !== null ? item.produced : '',
              poured: item.poured !== undefined && item.poured !== null ? item.poured : '',
              cycleTime: String(item.cycleTime || ''),
              mouldsPerHour: item.mouldsPerHour !== undefined && item.mouldsPerHour !== null ? item.mouldsPerHour : '',
              remarks: String(item.remarks || '')
            }));
            // Calculate next S.No for production (max sNo + 1)
            // Calculate next S.No for production (max sNo + 1) - not needed anymore
          } else {
            // Keep existing productionTable if no data, reset next S.No to 1 - not needed anymore
            updatedFormData.productionTable = prev.productionTable.length > 0 ? prev.productionTable : [{ counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }];
          }
          
          // Next Shift Plan
          if (report.nextShiftPlan && Array.isArray(report.nextShiftPlan) && report.nextShiftPlan.length > 0) {
            updatedFormData.nextShiftPlanTable = report.nextShiftPlan.map(item => ({
              sNo: item.sNo || 0,
              componentName: String(item.componentName || ''),
              plannedMoulds: item.plannedMoulds !== undefined && item.plannedMoulds !== null ? item.plannedMoulds : '',
              remarks: String(item.remarks || '')
            }));
            // Calculate next S.No for nextShiftPlan (max sNo + 1) - not needed anymore
          } else {
            updatedFormData.nextShiftPlanTable = prev.nextShiftPlanTable.length > 0 ? prev.nextShiftPlanTable : [{ componentName: "", plannedMoulds: "", remarks: "" }];
          }
          
          // Delays
          if (report.delays && Array.isArray(report.delays) && report.delays.length > 0) {
            updatedFormData.delaysTable = report.delays.map(item => ({
              sNo: item.sNo || 0,
              delays: String(item.delays || ''),
              durationMinutes: item.durationMinutes !== undefined && item.durationMinutes !== null ? item.durationMinutes : '',
              durationTime: String(item.durationTime || '')
            }));
            // Calculate next S.No for delays (max sNo + 1) - not needed anymore
          } else {
            updatedFormData.delaysTable = prev.delaysTable.length > 0 ? prev.delaysTable : [{ delays: "", durationMinutes: "", durationTime: "" }];
          }
          
          // Mould Hardness
          if (report.mouldHardness && Array.isArray(report.mouldHardness) && report.mouldHardness.length > 0) {
            updatedFormData.mouldHardnessTable = report.mouldHardness.map(item => ({
              sNo: item.sNo || 0,
              componentName: String(item.componentName || ''),
              mpPP: item.mpPP !== undefined && item.mpPP !== null ? item.mpPP : '',
              mpSP: item.mpSP !== undefined && item.mpSP !== null ? item.mpSP : '',
              bsPP: item.bsPP !== undefined && item.bsPP !== null ? item.bsPP : '',
              bsSP: item.bsSP !== undefined && item.bsSP !== null ? item.bsSP : '',
              remarks: String(item.remarks || '')
            }));
            // Calculate next S.No for mouldHardness (max sNo + 1) - not needed anymore
          } else {
            updatedFormData.mouldHardnessTable = prev.mouldHardnessTable.length > 0 ? prev.mouldHardnessTable : [{ componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }];
          }
          
          // Pattern Temperature
          if (report.patternTemperature && Array.isArray(report.patternTemperature) && report.patternTemperature.length > 0) {
            updatedFormData.patternTempTable = report.patternTemperature.map(item => ({
              sNo: item.sNo || 0,
              item: String(item.item || ''),
              pp: item.pp !== undefined && item.pp !== null ? item.pp : '',
              sp: item.sp !== undefined && item.sp !== null ? item.sp : ''
            }));
            // Calculate next S.No for patternTemp (max sNo + 1) - not needed anymore
          } else {
            updatedFormData.patternTempTable = prev.patternTempTable.length > 0 ? prev.patternTempTable : [{ item: "", pp: "", sp: "" }];
          }
          
          // Other fields - only load if they have actual content
          // Don't overwrite form data with empty strings from database
          if (report.significantEvent !== undefined && report.significantEvent !== null && String(report.significantEvent).trim() !== '') {
            updatedFormData.significantEvent = String(report.significantEvent).trim();
          }
          if (report.maintenance !== undefined && report.maintenance !== null && String(report.maintenance).trim() !== '') {
            updatedFormData.maintenance = String(report.maintenance).trim();
          }
          if (report.supervisorName !== undefined && report.supervisorName !== null && String(report.supervisorName).trim() !== '') {
            updatedFormData.supervisorName = String(report.supervisorName).trim();
          }
          
          return updatedFormData;
        });
      } else {
        setIsLocked(false);
        setEventSectionLocked({
          significantEvent: false,
          maintenance: false,
          supervisorName: false
        });
      }
    } catch (error) {
      console.error('Error checking existing data:', error);
      setIsLocked(false);
      setEventSectionLocked({
        significantEvent: false,
        maintenance: false,
        supervisorName: false
      });
    } finally {
      setCheckingData(false);
    }
  };

  // Check for primary data when date changes (date is always today, so only check once on mount)
  useEffect(() => {
    // Date is always set to today, so check primary data once on mount
    if (formData.date) {
      checkExistingPrimaryData(formData.date);
    }
  }, []); // Only run once on mount since date never changes

  // Check for full form lock when component mounts (date is always today)
  useEffect(() => {
    // Date is always today, check once on mount
    if (formData.date) {
      checkExistingData();
    }
  }, []); // Only run once on mount since date never changes

  // Handle click on locked input fields to show popup
  const handleLockedFieldClick = (fieldName) => {
    // Primary per-field lock popup
    if ((fieldName === 'shift' && basicFieldLocked.shift) ||
        (fieldName === 'incharge' && basicFieldLocked.incharge) ||
        (fieldName === 'ppOperator' && basicFieldLocked.ppOperator)) {
      setShowLockedPopup(true);
    } else if ((fieldName === 'significantEvent' && eventSectionLocked.significantEvent) ||
               (fieldName === 'maintenance' && eventSectionLocked.maintenance) ||
               (fieldName === 'supervisorName' && eventSectionLocked.supervisorName)) {
      setShowLockedPopup(true);
    }
    // Members are allowed to be edited even when locked
    // Event section fields (significantEvent, maintenance, supervisorName) show popup when locked individually
  };

  // Check if a member field is newly added (not in initial members)
  const isNewMember = (index) => {
    if (!basicInfoLocked) return true; // If not locked, all members are editable
    if (initialMembers.length === 0) return true; // If no initial members, all are new
    const member = String(formData.members[index] || '').trim();
    // If index is beyond initial members or member is empty or not in initial list, it's new
    return index >= initialMembers.length || member === '' || !initialMembers.includes(member);
  };

  // Check and lock shift if data exists for date+shift combination
  const checkAndLockByDateAndShift = async (date, shift) => {
    if (!date || !shift) return;
    
    try {
      const response = await api.get(`/v1/dismatic-reports/date?date=${encodeURIComponent(date)}`);
      if (response.success && response.data && response.data.length > 0) {
        const report = response.data[0];
        if (report.shift && String(report.shift).trim() === String(shift).trim()) {
          setBasicFieldLocked(prev => ({ ...prev, shift: true }));
        }
      }
    } catch (error) {
      console.error('Error checking date+shift lock:', error);
    }
  };

  const handleProductionSubmit = async () => {
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      alert('Please select a valid date');
      return;
    }

    // Check if primary data is saved
    // Always allow additional section saves; primary will be re-sent with each request.

    try {
      setLoadingStates(prev => ({ ...prev, production: true }));
      const data = await api.post('/v1/dismatic-reports', {
        date: formData.date,
        shift: formData.shift || '', // Include shift if available
        productionTable: formData.productionTable,
        section: 'production'
      });
      
      if (data.success) {
        alert('Production data saved successfully!');
        // Clear production table after successful save to allow entering next entry
        resetProductionTable();
        // Update next S.No based on database (without loading data into form)
        await updateNextSNoForTable('production');
        // Focus first input for next entry
        focusFirstTableInput('production');
      }
    } catch (error) {
      console.error('Error saving production:', error);
      alert('Failed to save production data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, production: false }));
    }
  };

  const handleNextShiftPlanSubmit = async () => {
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      alert('Please select a valid date');
      return;
    }

    // Check if primary data is saved
    // Allow save without strict primary lock requirement.

    try {
      setLoadingStates(prev => ({ ...prev, nextShiftPlan: true }));
      const data = await api.post('/v1/dismatic-reports', {
        date: formData.date,
        shift: formData.shift || '', // Include shift if available
        nextShiftPlanTable: formData.nextShiftPlanTable,
        section: 'nextShiftPlan'
      });
      
      if (data.success) {
        alert('Next Shift Plan data saved successfully!');
        // Clear next shift plan table after successful save to allow entering next entry
        resetNextShiftPlanTable();
        // Update next S.No based on database (without loading data into form)
        await updateNextSNoForTable('nextShiftPlan');
        // Focus first input for next entry
        focusFirstTableInput('nextShiftPlan');
      }
    } catch (error) {
      console.error('Error saving next shift plan:', error);
      alert('Failed to save next shift plan data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, nextShiftPlan: false }));
    }
  };

  const handleDelaysSubmit = async () => {
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      alert('Please select a valid date');
      return;
    }

    // Check if primary data is saved
    // Allow save; primary snapshot will be included.

    try {
      setLoadingStates(prev => ({ ...prev, delays: true }));
      const data = await api.post('/v1/dismatic-reports', {
        date: formData.date,
        shift: formData.shift || '', // Include shift if available
        delaysTable: formData.delaysTable,
        section: 'delays'
      });
      
      if (data.success) {
        alert('Delays data saved successfully!');
        // Clear delays table after successful save to allow entering next entry
        resetDelaysTable();
        // Update next S.No based on database (without loading data into form)
        await updateNextSNoForTable('delays');
        // Focus first input for next entry
        focusFirstTableInput('delays');
      }
    } catch (error) {
      console.error('Error saving delays:', error);
      alert('Failed to save delays data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, delays: false }));
    }
  };

  const handleMouldHardnessSubmit = async () => {
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      alert('Please select a valid date');
      return;
    }

    // Check if primary data is saved
    // Allow save regardless of primary lock.

    try {
      setLoadingStates(prev => ({ ...prev, mouldHardness: true }));
      const data = await api.post('/v1/dismatic-reports', {
        date: formData.date,
        shift: formData.shift || '', // Include shift if available
        mouldHardnessTable: formData.mouldHardnessTable,
        section: 'mouldHardness'
      });
      
      if (data.success) {
        alert('Mould Hardness data saved successfully!');
        // Clear mould hardness table after successful save to allow entering next entry
        resetMouldHardnessTable();
        // Update next S.No based on database (without loading data into form)
        await updateNextSNoForTable('mouldHardness');
        // Focus first input for next entry
        focusFirstTableInput('mouldHardness');
      }
    } catch (error) {
      console.error('Error saving mould hardness:', error);
      alert('Failed to save mould hardness data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, mouldHardness: false }));
    }
  };

  const handlePatternTempSubmit = async () => {
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      alert('Please select a valid date');
      return;
    }

    // Check if primary data is saved
    // Allow save.

    try {
      setLoadingStates(prev => ({ ...prev, patternTemp: true }));
      const data = await api.post('/v1/dismatic-reports', {
        date: formData.date,
        shift: formData.shift || '', // Include shift if available
        patternTempTable: formData.patternTempTable,
        section: 'patternTemp'
      });
      
      if (data.success) {
        alert('Pattern Temperature data saved successfully!');
        // Clear pattern temp table after successful save to allow entering next entry
        resetPatternTempTable();
        // Update next S.No based on database (without loading data into form)
        await updateNextSNoForTable('patternTemp');
        // Focus first input for next entry
        focusFirstTableInput('patternTemp');
      }
    } catch (error) {
      console.error('Error saving pattern temp:', error);
      alert('Failed to save pattern temperature data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, patternTemp: false }));
    }
  };

  const handleEventSectionSubmit = async () => {
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      alert('Please select a valid date');
      return;
    }

    // Check if primary data is saved
    // Allow save.

    // Check if all event fields are locked individually - show popup
    if (eventSectionLocked.significantEvent && eventSectionLocked.maintenance && eventSectionLocked.supervisorName) {
      setShowLockedPopup(true);
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, eventSection: true }));
      
      // Prepare data - only send fields that have actual content
      // This prevents overwriting existing data with empty strings
      const payload = {
        date: formData.date,
        shift: formData.shift || '',
        section: 'eventSection'
      };
      
      // Only include fields that have non-empty values
      if (formData.significantEvent && formData.significantEvent.trim() !== '') {
        payload.significantEvent = formData.significantEvent;
      }
      if (formData.maintenance && formData.maintenance.trim() !== '') {
        payload.maintenance = formData.maintenance;
      }
      if (formData.supervisorName && formData.supervisorName.trim() !== '') {
        payload.supervisorName = formData.supervisorName;
      }
      
      const data = await api.post('/v1/dismatic-reports', payload);
      
      if (data.success) {
        // Lock only the fields that were actually saved (have non-empty values)
        // Check each field individually - only lock if it has actual content
        const significantEventHasData = formData.significantEvent && 
                                       String(formData.significantEvent).trim() !== '';
        const maintenanceHasData = formData.maintenance && 
                                  String(formData.maintenance).trim() !== '';
        const supervisorNameHasData = formData.supervisorName && 
                                     String(formData.supervisorName).trim() !== '';
        
        // Update locks: ONLY lock fields that have actual data
        // Don't merge with previous state - reset based on what was actually saved
        // This ensures empty fields stay unlocked
        setEventSectionLocked({
          significantEvent: significantEventHasData,
          maintenance: maintenanceHasData,
          supervisorName: supervisorNameHasData
        });
        
        alert('Event section data saved successfully!');
        
        // Keep the saved values visible in locked fields (do not clear),
        // mirroring the behavior of the Primary Data section
      }
    } catch (error) {
      console.error('Error saving event section:', error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, eventSection: false }));
    }
  };

  // Combined "Save All" handler - saves primary first (if needed) then other sections that have data
  const handleSubmitAll = async () => {
    // Always sync date to current day before saving all
    const today = getTodaysDate();
    if (formData.date !== today) {
      setFormData(prev => ({ ...prev, date: today }));
    }
    if (!today) {
      alert('Date unavailable');
      return;
    }

    setAllSubmitting(true);
    try {
      // Build single consolidated payload
      const consolidated = {
        date: today,
        shift: formData.shift || '',
        incharge: formData.incharge || '',
        ppOperator: formData.ppOperator || '',
        members: formData.members.filter(m => m && m.trim() !== ''),
        productionTable: hasProductionData() ? formData.productionTable : [],
        nextShiftPlanTable: hasNextShiftPlanData() ? formData.nextShiftPlanTable : [],
        delaysTable: hasDelaysData() ? formData.delaysTable : [],
        mouldHardnessTable: hasMouldHardnessData() ? formData.mouldHardnessTable : [],
        patternTempTable: hasPatternTempData() ? formData.patternTempTable : [],
        significantEvent: formData.significantEvent && formData.significantEvent.trim() !== '' ? formData.significantEvent.trim() : undefined,
        maintenance: formData.maintenance && formData.maintenance.trim() !== '' ? formData.maintenance.trim() : undefined,
        supervisorName: formData.supervisorName && formData.supervisorName.trim() !== '' ? formData.supervisorName.trim() : undefined,
        section: 'all'
      };

      const res = await api.post('/v1/dismatic-reports', consolidated);
      if (!res.success) throw new Error(res.message || 'Save failed');

      alert('All data saved successfully for ' + today + '! Ready for next entry.');
      
      // Reset only non-primary sections for next entry (keep primary locked and intact)
      resetProductionTable();
      resetNextShiftPlanTable();
      resetDelaysTable();
      resetMouldHardnessTable();
      resetPatternTempTable();
      
      // Clear event section fields
      setFormData(prev => ({
        ...prev,
        significantEvent: '',
        maintenance: '',
        supervisorName: ''
      }));
      
      // Reset event section locks
      setEventSectionLocked({
        significantEvent: false,
        maintenance: false,
        supervisorName: false
      });
      
      // Focus back to production table for next entry
      setTimeout(() => {
        focusFirstTableInput('production');
      }, 100);
      
      // Don't navigate to report - stay on entry page for next data set
    } catch (err) {
      console.error('Error saving all:', err);
      alert('Save All failed: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setAllSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const inputs = Array.from(form.querySelectorAll('input:not([readonly]), textarea, select'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <>
      {checkingData && (
        <div className="disamatic-loader-overlay">
          <Loader />
        </div>
      )}
      {/* Header (simplified without date) */}
      <div className="disamatic-header">
        <div className="disamatic-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Disamatic Product - Entry Form
          </h2>
        </div>
      </div>

      {/* Primary Section */}
      <div className="disamatic-section primary-section">
            <div className="primary-header-container">
              <h3 className="primary-section-title">PRIMARY</h3>
              <div className="primary-date-display">DATE : {formData.date ? new Date(formData.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</div>
            </div>
            <div className="primary-fields-row">
              <div className="disamatic-form-group">
                <label>Shift <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  id="shift-field"
                  value={formData.shift}
                  onChange={e => handleChange("shift", e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('incharge-field')?.focus(); } }}
                  onClick={() => handleLockedFieldClick('shift')}
                  onFocus={() => handleLockedFieldClick('shift')}
                  onMouseDown={(e) => {
                    if (basicFieldLocked.shift || checkingData || isPrimaryLocked) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  disabled={basicFieldLocked.shift || checkingData || isPrimaryLocked}
                  readOnly={basicFieldLocked.shift || isPrimaryLocked}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    border: `2px solid ${validationErrors.shift ? '#ef4444' : (formData.shift && !validationErrors.shift ? '#22c55e' : '#cbd5e1')}`,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: (basicFieldLocked.shift || checkingData || isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
                    color: (basicFieldLocked.shift || checkingData || isPrimaryLocked) ? '#64748b' : '#1e293b',
                    cursor: (basicFieldLocked.shift || checkingData || isPrimaryLocked) ? 'not-allowed' : 'pointer',
                    opacity: (basicFieldLocked.shift || checkingData || isPrimaryLocked) ? 0.8 : 1,
                    pointerEvents: (basicFieldLocked.shift || checkingData || isPrimaryLocked) ? 'none' : 'auto'
                  }}
                >
                  <option value="">Select Shift</option>
                  <option value="Shift 1">Shift 1</option>
                  <option value="Shift 2">Shift 2</option>
                  <option value="Shift 3">Shift 3</option>
                </select>
              </div>
              <div className="disamatic-form-group">
                <label>Incharge <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  id="incharge-field"
                  type="text" 
                  value={formData.incharge} 
                  onChange={e => handleChange("incharge", e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('ppoperator-field')?.focus(); } }}
                  onClick={() => handleLockedFieldClick('incharge')}
                  onFocus={() => handleLockedFieldClick('incharge')}
                  placeholder="Enter incharge name"
                  disabled={basicFieldLocked.incharge || isPrimaryLocked}
                  readOnly={basicFieldLocked.incharge || isPrimaryLocked}
                  style={{ 
                    cursor: (basicFieldLocked.incharge || isPrimaryLocked) ? 'not-allowed' : 'text',
                    backgroundColor: (basicFieldLocked.incharge || isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
                    border: `2px solid ${validationErrors.incharge ? '#ef4444' : (formData.incharge && !validationErrors.incharge ? '#22c55e' : '#cbd5e1')}`,
                  }}
                />
              </div>
              <div className="disamatic-form-group">
                <label>PP Operator <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  id="ppoperator-field"
                  type="text" 
                  value={formData.ppOperator} 
                  onChange={e => handleChange("ppOperator", e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('member-field-0')?.focus(); } }}
                  onClick={() => handleLockedFieldClick('ppOperator')}
                  onFocus={() => handleLockedFieldClick('ppOperator')}
                  placeholder="Enter PP Operator name"
                  disabled={basicFieldLocked.ppOperator || isPrimaryLocked}
                  readOnly={basicFieldLocked.ppOperator || isPrimaryLocked}
                  style={{ 
                    cursor: (basicFieldLocked.ppOperator || isPrimaryLocked) ? 'not-allowed' : 'text',
                    backgroundColor: (basicFieldLocked.ppOperator || isPrimaryLocked) ? '#f1f5f9' : '#ffffff',
                    border: `2px solid ${validationErrors.ppOperator ? '#ef4444' : (formData.ppOperator && !validationErrors.ppOperator ? '#22c55e' : '#cbd5e1')}`,
                  }}
                />
              </div>
              <div className="disamatic-form-group">
                <label>Members Present <span style={{ color: '#ef4444' }}>*</span></label>
            <div className="disamatic-members-container">
              {formData.members.map((member, index) => {
                const isNewMemberField = isNewMember(index);
                const isEditable = !basicInfoLocked || isNewMemberField;
                const isDisabled = isPrimaryLocked || (!isEditable && (basicInfoLocked || isLocked));
                return (
                  <div key={index} className="disamatic-member-input-wrapper">
                    <input
                      id={`member-field-${index}`}
                      type="text"
                      value={member}
                      onChange={e => handleMemberChange(index, e.target.value)}
                      onKeyDown={(e) => handleMemberKeyDown(e, index)}
                      onClick={() => {
                        if (!isEditable) {
                          handleLockedFieldClick('members');
                        }
                      }}
                      onFocus={() => {
                        if (!isEditable) {
                          handleLockedFieldClick('members');
                        }
                      }}
                        placeholder={`Enter member name ${index + 1}`}
                      className="disamatic-member-input"
                      disabled={isDisabled}
                      readOnly={isDisabled}
                      style={{ 
                        cursor: isDisabled ? 'not-allowed' : 'text',
                        backgroundColor: isDisabled ? '#f1f5f9' : '#ffffff',
                        border: `2px solid ${validationErrors.members && !member ? '#ef4444' : (member ? '#22c55e' : '#cbd5e1')}`,
                      }}
                    />
                    {formData.members.length > 1 && isEditable && !isPrimaryLocked && (
                      <button
                        type="button"
                        onClick={() => removeMemberField(index)}
                        className="disamatic-remove-member-btn"
                        title="Remove member"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
              {/* Allow adding members only when not locked */}
              {!isPrimaryLocked && (
                <button
                  type="button"
                  onClick={addMemberField}
                  className="disamatic-add-member-btn"
                  title="Add another member"
                >
                  <Plus size={16} />
                  Add Member
                </button>
              )}
            </div>
              </div>
            </div>
            {/* Only show Reset button - no Save button */}
            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '0.5rem' }}>
              {isPrimaryLocked && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to unlock and reset primary data? This will clear Date, Shift, Incharge, PP Operator, and Members.')) {
                      resetForm();
                    }
                  }}
                  className="disamatic-reset-btn"
                  title="Unlock and reset primary data"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', marginTop: '1.75rem' }}
                >
                  <RefreshCw size={14} />
                  Reset Primary
                </button>
              )}
            </div>
          </div>

      {/* Divider line to separate primary data from other inputs */}
      <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}></div>

      {/* Production Table */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Production Table</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>S.No</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Mould Counter No.</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Component Name</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Produced</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Poured</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Cycle Time</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Moulds Per Hour</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {formData.productionTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 500, background: '#f8fafc' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.counterNo}
                      onChange={e => handleProductionTableChange(index, 'counterNo', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 0, 7)}
                      placeholder="Counter No"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleProductionTableChange(index, 'componentName', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 1, 7)}
                      placeholder="Component Name"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.produced}
                      onChange={e => handleProductionTableChange(index, 'produced', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 2, 7)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.poured}
                      onChange={e => handleProductionTableChange(index, 'poured', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 3, 7)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.cycleTime}
                      onChange={e => handleProductionTableChange(index, 'cycleTime', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 4, 7)}
                      placeholder="e.g., 30s"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.mouldsPerHour}
                      onChange={e => handleProductionTableChange(index, 'mouldsPerHour', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 5, 7)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <input 
                  type="text" 
                      value={row.remarks}
                      onChange={e => handleProductionTableChange(index, 'remarks', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 6, 7)}
                      placeholder="Remarks"
                      maxLength={60}
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text',
                        resize: 'none'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={addProductionRow}
                    disabled={!isPrimaryLocked}
                    style={{
                      width: '42px',
                      height: '42px',
                      background: isPrimaryLocked ? '#22c55e' : '#cbd5e1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                    title="Add row"
                  >
                    <Plus size={20} />
                  </button>
                  {formData.productionTable.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteProductionRow(formData.productionTable.length - 1)}
                      disabled={!isPrimaryLocked}
                      style={{
                        width: '42px',
                        height: '42px',
                        background: isPrimaryLocked ? '#ef4444' : '#cbd5e1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                      title="Delete last row"
                    >
                      <Minus size={20} />
                    </button>
                  )}
                </div>
          </div>

          {/* Next Shift Plan Section */}
          <div className="disamatic-section">
        <h3 className="disamatic-section-title">Next Shift Plan Table</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>S.No</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Component Name</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Planned Moulds</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {formData.nextShiftPlanTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 500, background: '#f8fafc' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleNextShiftPlanChange(index, 'componentName', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'nextShiftPlan', index, 0, 3)}
                      placeholder="Component Name"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.plannedMoulds}
                      onChange={e => handleNextShiftPlanChange(index, 'plannedMoulds', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'nextShiftPlan', index, 1, 3)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleNextShiftPlanChange(index, 'remarks', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'nextShiftPlan', index, 2, 3)}
                      placeholder="Remarks"
                      maxLength={60}
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={addNextShiftPlanRow}
            disabled={!isPrimaryLocked}
            style={{
              width: '42px',
              height: '42px',
              background: isPrimaryLocked ? '#22c55e' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Add row"
          >
            <Plus size={20} />
          </button>
          {formData.nextShiftPlanTable.length > 1 && (
            <button
              type="button"
              onClick={() => deleteNextShiftPlanRow(formData.nextShiftPlanTable.length - 1)}
              disabled={!isPrimaryLocked}
              style={{
                width: '42px',
                height: '42px',
                background: isPrimaryLocked ? '#ef4444' : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Delete last row"
            >
              <Minus size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Delays Table */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Delays Table</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>S.No</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Delays</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Duration In Minutes</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>Duration In Time</th>
              </tr>
            </thead>
            <tbody>
              {formData.delaysTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 500, background: '#f8fafc' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.delays}
                      onChange={e => handleDelaysTableChange(index, 'delays', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'delays', index, 0, 3)}
                      placeholder="Describe delay"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.durationMinutes}
                      onChange={e => handleDelaysTableChange(index, 'durationMinutes', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'delays', index, 1, 3)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.durationTime}
                      onChange={e => handleDelaysTableChange(index, 'durationTime', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'delays', index, 2, 3)}
                      placeholder="HH:MM"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={addDelaysRow}
            disabled={!isPrimaryLocked}
            style={{
              width: '42px',
              height: '42px',
              background: isPrimaryLocked ? '#22c55e' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Add row"
          >
            <Plus size={20} />
          </button>
          {formData.delaysTable.length > 1 && (
            <button
              type="button"
              onClick={() => deleteDelaysRow(formData.delaysTable.length - 1)}
              disabled={!isPrimaryLocked}
              style={{
                width: '42px',
                height: '42px',
                background: isPrimaryLocked ? '#ef4444' : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Delete last row"
            >
              <Minus size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Production (Mould Hardness) Table */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Mould Hardness Table</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }} rowSpan="2">S.No</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap' }} rowSpan="2">Component Name</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap' }} colSpan="2">Mould Penetrant tester ( N/cmsquare )</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap' }} colSpan="2">B - Scale</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', whiteSpace: 'nowrap' }} rowSpan="2">Remarks</th>
              </tr>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>PP</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>SP</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>PP</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>SP</th>
              </tr>
            </thead>
            <tbody>
              {formData.mouldHardnessTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 500, background: '#f8fafc' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleMouldHardnessTableChange(index, 'componentName', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 0, 6)}
                      placeholder="Component Name"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.mpPP}
                      onChange={e => handleMouldHardnessTableChange(index, 'mpPP', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 1, 6)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.mpSP}
                      onChange={e => handleMouldHardnessTableChange(index, 'mpSP', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 2, 6)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.bsPP}
                      onChange={e => handleMouldHardnessTableChange(index, 'bsPP', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 3, 6)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.bsSP}
                      onChange={e => handleMouldHardnessTableChange(index, 'bsSP', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 4, 6)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleMouldHardnessTableChange(index, 'remarks', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 5, 6)}
                      placeholder="Remarks"
                      maxLength={60}
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={addMouldHardnessRow}
            disabled={!isPrimaryLocked}
            style={{
              width: '42px',
              height: '42px',
              background: isPrimaryLocked ? '#22c55e' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Add row"
          >
            <Plus size={20} />
          </button>
          {formData.mouldHardnessTable.length > 1 && (
            <button
              type="button"
              onClick={() => deleteMouldHardnessRow(formData.mouldHardnessTable.length - 1)}
              disabled={!isPrimaryLocked}
              style={{
                width: '42px',
                height: '42px',
                background: isPrimaryLocked ? '#ef4444' : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Delete last row"
            >
              <Minus size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Pattern Temp Table */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Pattern Temperature Table</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap', width: '80px' }}>S.No</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>ITEMS</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>PP</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', border: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', whiteSpace: 'nowrap' }}>SP</th>
              </tr>
            </thead>
            <tbody>
              {formData.patternTempTable.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 500, background: '#f8fafc' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.item}
                      onChange={e => handlePatternTempTableChange(index, 'item', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'patternTemp', index, 0, 3)}
                      placeholder="Enter item"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.pp}
                      onChange={e => handlePatternTempTableChange(index, 'pp', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'patternTemp', index, 1, 3)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="number"
                      value={row.sp}
                      onChange={e => handlePatternTempTableChange(index, 'sp', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'patternTemp', index, 2, 3)}
                      placeholder="0"
                      step="0.1"
                      disabled={!isPrimaryLocked}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem', 
                        textAlign: 'center',
                        backgroundColor: !isPrimaryLocked ? '#f1f5f9' : '#ffffff',
                        cursor: !isPrimaryLocked ? 'not-allowed' : 'text'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={addPatternTempRow}
            disabled={!isPrimaryLocked}
            style={{
              width: '42px',
              height: '42px',
              background: isPrimaryLocked ? '#22c55e' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Add row"
          >
            <Plus size={20} />
          </button>
          {formData.patternTempTable.length > 1 && (
            <button
              type="button"
              onClick={() => deletePatternTempRow(formData.patternTempTable.length - 1)}
              disabled={!isPrimaryLocked}
              style={{
                width: '42px',
                height: '42px',
                background: isPrimaryLocked ? '#ef4444' : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isPrimaryLocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Delete last row"
            >
              <Minus size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Event Information Section */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Event Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
          <div className="disamatic-form-group">
            <label>Significant Event : </label>
            <input
              type="text"
              value={formData.significantEvent}
              onChange={e => handleChange("significantEvent", e.target.value)}
              onClick={() => handleLockedFieldClick('significantEvent')}
              onFocus={() => handleLockedFieldClick('significantEvent')}
              placeholder="Describe significant event..."
              disabled={eventSectionLocked.significantEvent}
              readOnly={eventSectionLocked.significantEvent}
              style={{ 
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#1e293b',
                backgroundColor: (eventSectionLocked.significantEvent) ? '#f1f5f9' : '#ffffff',
                cursor: (eventSectionLocked.significantEvent) ? 'not-allowed' : 'text'
              }}
            />
          </div>
          <div className="disamatic-form-group">
            <label>Maintenance : </label>
            <input
              type="text"
              value={formData.maintenance}
              onChange={e => handleChange("maintenance", e.target.value)}
              onClick={() => handleLockedFieldClick('maintenance')}
              onFocus={() => handleLockedFieldClick('maintenance')}
              placeholder="Describe maintenance activities..."
              disabled={eventSectionLocked.maintenance}
              readOnly={eventSectionLocked.maintenance}
              style={{ 
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#1e293b',
                backgroundColor: (eventSectionLocked.maintenance) ? '#f1f5f9' : '#ffffff',
                cursor: (eventSectionLocked.maintenance) ? 'not-allowed' : 'text'
              }}
            />
          </div>
          <div className="disamatic-form-group">
            <label>Supervisor Name : </label>
            <input
              type="text"
              value={formData.supervisorName}
              onChange={e => handleChange("supervisorName", e.target.value)}
              onClick={() => handleLockedFieldClick('supervisorName')}
              onFocus={() => handleLockedFieldClick('supervisorName')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // Focus the Save All button
                  const saveBtn = document.querySelector('.disamatic-submit-btn');
                  if (saveBtn) saveBtn.focus();
                }
              }}
              placeholder="Enter supervisor name"
              disabled={eventSectionLocked.supervisorName}
              readOnly={eventSectionLocked.supervisorName}
              style={{ 
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#1e293b',
                backgroundColor: (eventSectionLocked.supervisorName) ? '#f1f5f9' : '#ffffff',
                cursor: (eventSectionLocked.supervisorName) ? 'not-allowed' : 'text'
              }}
            />
          </div>
        </div>
      </div>

      {/* Single master Save button */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleSubmitAll}
          disabled={allSubmitting || checkingData || !formData.date}
          className="disamatic-submit-btn"
          title={!formData.date ? 'Please select a date' : 'Save all entered sections'}
        >
          {allSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {allSubmitting ? 'Saving...' : 'Submit All'}
        </button>
      </div>

      {/* Locked Form Popup */}
      {showLockedPopup && (basicInfoLocked || eventSectionLocked.significantEvent || eventSectionLocked.maintenance || eventSectionLocked.supervisorName) && (
        <div className="disamatic-locked-popup-overlay" onClick={() => setShowLockedPopup(false)}>
          <div className="disamatic-locked-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="disamatic-locked-popup-header">
              <div className="disamatic-locked-popup-icon">🔒</div>
              <h3>Form Locked</h3>
              <button 
                className="disamatic-locked-popup-close" 
                onClick={() => setShowLockedPopup(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="disamatic-locked-popup-body">
              {basicInfoLocked && (
                <p className="disamatic-locked-popup-message">
                  Basic information (Shift, Incharge, PP Operator, Members) is locked for this date. These fields cannot be modified.
                </p>
              )}
              {(eventSectionLocked.significantEvent || eventSectionLocked.maintenance || eventSectionLocked.supervisorName) && (
                <p className="disamatic-locked-popup-message">
                  Some event section fields are locked. Saved fields cannot be modified. Use the Reports page to edit.
                </p>
              )}
              {/* Removed global form lock messaging for event section. We lock per-field instead. */}
              <p className="disamatic-locked-popup-hint">
                You can edit the data from the Reports page by clicking the edit button on any record.
              </p>
            </div>

            <div className="disamatic-locked-popup-footer">
              <button
                className="disamatic-locked-popup-ok-btn"
                onClick={() => setShowLockedPopup(false)}
              >
                OK, Got it
              </button>
              <button
                className="disamatic-locked-popup-edit-btn"
                onClick={() => {
                  setShowLockedPopup(false);
                  navigate('/moulding/disamatic-product/report');
                }}
              >
                <Edit2 size={16} />
                Edit in Reports Page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DisamaticProduct;
