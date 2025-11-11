import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, FileText, Plus, X, Loader2, Edit2, RotateCcw, RefreshCw } from "lucide-react";
import CustomDatePicker from "../../Components/CustomDatePicker";
import Loader from "../../Components/Loader";
import api from "../../utils/api";
import "../../styles/PageStyles/Moulding/DisamaticProduct.css";

const initialFormData = {
  date: "",
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
  const [isLocked, setIsLocked] = useState(false);
  const [checkingData, setCheckingData] = useState(false);
  const [basicInfoLocked, setBasicInfoLocked] = useState(false);
  const [basicFieldLocked, setBasicFieldLocked] = useState({
    shift: false,
    incharge: false,
    ppOperator: false
  }); // All fields start unlocked - they lock only after data is saved
  const [isPrimaryLocked, setIsPrimaryLocked] = useState(false);
  const [primaryId, setPrimaryId] = useState(null);

  // Check if there's data for the specific date+shift combination and lock shift dropdown
  const checkAndLockByDateAndShift = async (date, shift) => {
    if (!date || !shift) {
      // If date or shift is not set, unlock shift (unless primaryId exists)
      if (!primaryId) {
        setBasicFieldLocked(prev => ({
          ...prev,
          shift: false
        }));
      }
      return;
    }
    
    try {
      const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
      // Use the date range endpoint to get all entries for this date
      const response = await api.get(`/v1/dismatic-reports/date-range?startDate=${dateStr}&endDate=${dateStr}`);
      
      if (response.success && response.data && response.data.length > 0) {
        // Check if any entry has the same date AND shift
        const hasDataForShift = response.data.some(entry => {
          const entryShift = entry.shift;
          return entryShift === shift;
        });
        
        if (hasDataForShift) {
          // Data exists for this date+shift combination, lock shift dropdown
          setBasicFieldLocked(prev => ({
            ...prev,
            shift: true
          }));
        } else {
          // No data for this date+shift combination, unlock shift (unless primaryId exists)
          if (!primaryId) {
            setBasicFieldLocked(prev => ({
              ...prev,
              shift: false
            }));
          }
        }
      } else {
        // No data for this date, unlock shift (unless primaryId exists)
        if (!primaryId) {
          setBasicFieldLocked(prev => ({
            ...prev,
            shift: false
          }));
        }
      }
    } catch (error) {
      console.error('Error checking existing data for date and shift:', error);
    }
  };

  // Check for existing data when date or shift changes
  useEffect(() => {
    if (formData.date && formData.shift) {
      checkAndLockByDateAndShift(formData.date, formData.shift);
    } else if (!formData.date || !formData.shift) {
      // Clear shift lock when date or shift is cleared (unless primaryId exists)
      if (!primaryId) {
        setBasicFieldLocked(prev => ({
          ...prev,
          shift: false
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.date, formData.shift]);
  const [eventSectionLocked, setEventSectionLocked] = useState({
    significantEvent: false,
    maintenance: false,
    supervisorName: false
  });
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const [initialMembers, setInitialMembers] = useState([]); // Track initial members when locked
  const [nextSNo, setNextSNo] = useState({
    production: 1,
    nextShiftPlan: 1,
    delays: 1,
    mouldHardness: 1,
    patternTemp: 1
  }); // Track next S.No for each table
  
  // Refs for submit buttons
  const productionSubmitRef = React.useRef(null);
  const nextShiftPlanSubmitRef = React.useRef(null);
  const delaysSubmitRef = React.useRef(null);
  const mouldHardnessSubmitRef = React.useRef(null);
  const patternTempSubmitRef = React.useRef(null);
  
  const handleChange = (field, value) => {
    // Handle date field specially - ensure we get the actual value string
    if (field === 'date') {
      // If value is an event object, extract the value
      const dateValue = value?.target?.value || value || '';
      setFormData(prev => ({ ...prev, [field]: dateValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handleMemberChange = (index, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = value;
    setFormData(prev => ({ ...prev, members: updatedMembers }));
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

  // Handle Enter key navigation for table inputs
  const handleTableKeyDown = (e, tableName, rowIndex, fieldIndex, totalFields, submitButtonRef) => {
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
      
      // If this is the last input in the row, focus the submit button
      if (submitButtonRef && submitButtonRef.current) {
        submitButtonRef.current.focus();
      }
    }
  };

  // Update next S.No for a specific table without loading data into form
  const updateNextSNoForTable = async (tableName) => {
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      return;
    }

    try {
      const response = await api.get(`/v1/dismatic-reports/date?date=${encodeURIComponent(formData.date)}`);
      
      if (response.success && response.data && response.data.length > 0) {
        const report = response.data[0];
        let maxSNo = 0;

        if (tableName === 'production' && report.productionDetails && Array.isArray(report.productionDetails) && report.productionDetails.length > 0) {
          maxSNo = Math.max(...report.productionDetails.map(item => item.sNo || 0), 0);
        } else if (tableName === 'nextShiftPlan' && report.nextShiftPlan && Array.isArray(report.nextShiftPlan) && report.nextShiftPlan.length > 0) {
          maxSNo = Math.max(...report.nextShiftPlan.map(item => item.sNo || 0), 0);
        } else if (tableName === 'delays' && report.delays && Array.isArray(report.delays) && report.delays.length > 0) {
          maxSNo = Math.max(...report.delays.map(item => item.sNo || 0), 0);
        } else if (tableName === 'mouldHardness' && report.mouldHardness && Array.isArray(report.mouldHardness) && report.mouldHardness.length > 0) {
          maxSNo = Math.max(...report.mouldHardness.map(item => item.sNo || 0), 0);
        } else if (tableName === 'patternTemp' && report.patternTemperature && Array.isArray(report.patternTemperature) && report.patternTemperature.length > 0) {
          maxSNo = Math.max(...report.patternTemperature.map(item => item.sNo || 0), 0);
        }

        setNextSNo(prev => ({ ...prev, [tableName]: maxSNo + 1 }));
      }
    } catch (error) {
      console.error(`Error updating next S.No for ${tableName}:`, error);
    }
  };

  // Focus first input of a table - improved selector
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
          }
        }
      });
      
      if (targetSection) {
        const tableWrapper = targetSection.querySelector('.disamatic-table-wrapper');
        if (tableWrapper) {
          const firstInput = tableWrapper.querySelector('tbody tr:first-child input:not([disabled])');
          if (firstInput) {
            firstInput.focus();
          }
        }
      }
    }, 200);
  };

  // Reset functions for each table - reset to show next S.No
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
            const maxSNo = Math.max(...report.productionDetails.map(item => item.sNo || 0), 0);
            setNextSNo(prev => ({ ...prev, production: maxSNo + 1 }));
          } else {
            // Keep existing productionTable if no data, reset next S.No to 1
            updatedFormData.productionTable = prev.productionTable.length > 0 ? prev.productionTable : [{ counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }];
            setNextSNo(prev => ({ ...prev, production: 1 }));
          }
          
          // Next Shift Plan
          if (report.nextShiftPlan && Array.isArray(report.nextShiftPlan) && report.nextShiftPlan.length > 0) {
            updatedFormData.nextShiftPlanTable = report.nextShiftPlan.map(item => ({
              sNo: item.sNo || 0,
              componentName: String(item.componentName || ''),
              plannedMoulds: item.plannedMoulds !== undefined && item.plannedMoulds !== null ? item.plannedMoulds : '',
              remarks: String(item.remarks || '')
            }));
            // Calculate next S.No for nextShiftPlan (max sNo + 1)
            const maxSNo = Math.max(...report.nextShiftPlan.map(item => item.sNo || 0), 0);
            setNextSNo(prev => ({ ...prev, nextShiftPlan: maxSNo + 1 }));
          } else {
            updatedFormData.nextShiftPlanTable = prev.nextShiftPlanTable.length > 0 ? prev.nextShiftPlanTable : [{ componentName: "", plannedMoulds: "", remarks: "" }];
            setNextSNo(prev => ({ ...prev, nextShiftPlan: 1 }));
          }
          
          // Delays
          if (report.delays && Array.isArray(report.delays) && report.delays.length > 0) {
            updatedFormData.delaysTable = report.delays.map(item => ({
              sNo: item.sNo || 0,
              delays: String(item.delays || ''),
              durationMinutes: item.durationMinutes !== undefined && item.durationMinutes !== null ? item.durationMinutes : '',
              durationTime: String(item.durationTime || '')
            }));
            // Calculate next S.No for delays (max sNo + 1)
            const maxSNo = Math.max(...report.delays.map(item => item.sNo || 0), 0);
            setNextSNo(prev => ({ ...prev, delays: maxSNo + 1 }));
          } else {
            updatedFormData.delaysTable = prev.delaysTable.length > 0 ? prev.delaysTable : [{ delays: "", durationMinutes: "", durationTime: "" }];
            setNextSNo(prev => ({ ...prev, delays: 1 }));
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
            // Calculate next S.No for mouldHardness (max sNo + 1)
            const maxSNo = Math.max(...report.mouldHardness.map(item => item.sNo || 0), 0);
            setNextSNo(prev => ({ ...prev, mouldHardness: maxSNo + 1 }));
          } else {
            updatedFormData.mouldHardnessTable = prev.mouldHardnessTable.length > 0 ? prev.mouldHardnessTable : [{ componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }];
            setNextSNo(prev => ({ ...prev, mouldHardness: 1 }));
          }
          
          // Pattern Temperature
          if (report.patternTemperature && Array.isArray(report.patternTemperature) && report.patternTemperature.length > 0) {
            updatedFormData.patternTempTable = report.patternTemperature.map(item => ({
              sNo: item.sNo || 0,
              item: String(item.item || ''),
              pp: item.pp !== undefined && item.pp !== null ? item.pp : '',
              sp: item.sp !== undefined && item.sp !== null ? item.sp : ''
            }));
            // Calculate next S.No for patternTemp (max sNo + 1)
            const maxSNo = Math.max(...report.patternTemperature.map(item => item.sNo || 0), 0);
            setNextSNo(prev => ({ ...prev, patternTemp: maxSNo + 1 }));
          } else {
            updatedFormData.patternTempTable = prev.patternTempTable.length > 0 ? prev.patternTempTable : [{ item: "", pp: "", sp: "" }];
            setNextSNo(prev => ({ ...prev, patternTemp: 1 }));
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

  // Check for primary data when date changes (similar to DmmSettingParameters)
  useEffect(() => {
    setShowLockedPopup(false); // Reset popup when date changes
    // Reset all locks immediately when date changes
    setBasicFieldLocked({
      shift: false,
      incharge: false,
      ppOperator: false
    });
    setBasicInfoLocked(false);
    setIsPrimaryLocked(false);
    
    const timeoutId = setTimeout(() => {
      if (formData.date) {
        checkExistingPrimaryData(formData.date);
      } else {
        // No date - unlock everything
        setBasicInfoLocked(false);
        setIsPrimaryLocked(false);
        setBasicFieldLocked({
          shift: false,
          incharge: false,
          ppOperator: false
        });
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [formData.date]);

  // Check for full form lock when date exists (date is primary identifier)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.date) {
        checkExistingData();
      } else {
        setIsLocked(false);
        setEventSectionLocked({
          significantEvent: false,
          maintenance: false,
          supervisorName: false
        });
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [formData.date]);

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

  const handleBasicInfoSubmit = async () => {
    const required = ['date'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      alert(`Please fill in the following required fields: ${missing.join(', ')}`);
      return;
    }

    // Validate date format (should be YYYY-MM-DD)
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      alert('Please select a valid date');
      return;
    }

    // Check if there are any unlocked fields with data to save
    const hasUnlockedShift = !basicFieldLocked.shift && formData.shift && formData.shift.trim() !== '';
    const hasUnlockedIncharge = !basicFieldLocked.incharge && formData.incharge && formData.incharge.trim() !== '';
    const hasUnlockedPpOperator = !basicFieldLocked.ppOperator && formData.ppOperator && formData.ppOperator.trim() !== '';
    
    // For members: include all current members (both existing locked ones and new ones)
    // The backend will merge them properly
    const allMembers = formData.members.filter(m => m.trim() !== '');
    const hasNewMembers = allMembers.length > 0 && (
      allMembers.length !== initialMembers.length || 
      !allMembers.every(m => initialMembers.includes(m))
    );

    // Check if there's anything new to save
    // Allow save if: any unlocked field has data, OR if this is a new record (no primary data exists yet)
    const isNewRecord = !isPrimaryLocked;
    if (!isNewRecord && !hasUnlockedShift && !hasUnlockedIncharge && !hasUnlockedPpOperator && !hasNewMembers) {
      alert('No new data to save. All fields are either locked or empty.');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, basicInfo: true }));
      
      // Build payload - always include date and section
      const payload = {
        date: formData.date,
        section: 'basicInfo'
      };
      
      // For new records: send all fields that have data (even if empty, shift is required by schema)
      // For existing records: only send unlocked fields to avoid overwriting locked ones
      if (isNewRecord) {
        // New record - send all fields that have data
        // Shift is required by schema, so always send it (backend will use 'Not Set' if empty)
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
        // Existing record - only send unlocked fields (fields that don't have saved data yet)
        // This ensures locked fields are not overwritten
        if (hasUnlockedShift) {
          payload.shift = formData.shift.trim();
        }
        if (hasUnlockedIncharge) {
          payload.incharge = formData.incharge.trim();
        }
        if (hasUnlockedPpOperator) {
          payload.ppOperator = formData.ppOperator.trim();
        }
        // Always send all members (both existing and new) so backend can merge them
        if (allMembers.length > 0) {
          payload.members = allMembers;
        }
      }

      const data = await api.post('/v1/dismatic-reports', payload);
      
      if (data.success) {
        setPrimaryId(data.data?._id || null);
        // Check if there's existing data for this date+shift combination and lock shift accordingly
        if (formData.shift) {
          await checkAndLockByDateAndShift(formData.date, formData.shift);
        }
        // After successful save, re-check the data to update locks properly
        // This ensures the UI reflects the current database state
        await checkExistingPrimaryData(formData.date);
        
        alert('Primary data saved successfully! Saved fields are now locked.');
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
    if (!isPrimaryLocked) {
      alert('Please save Primary data (Date, Shift, Incharge, PP Operator, Members) first before submitting other sections.');
      return;
    }

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
    if (!isPrimaryLocked) {
      alert('Please save Primary data (Date, Shift, Incharge, PP Operator, Members) first before submitting other sections.');
      return;
    }

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
    if (!isPrimaryLocked) {
      alert('Please save Primary data (Date, Shift, Incharge, PP Operator, Members) first before submitting other sections.');
      return;
    }

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
    if (!isPrimaryLocked) {
      alert('Please save Primary data (Date, Shift, Incharge, PP Operator, Members) first before submitting other sections.');
      return;
    }

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
    if (!isPrimaryLocked) {
      alert('Please save Primary data (Date, Shift, Incharge, PP Operator, Members) first before submitting other sections.');
      return;
    }

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
    if (!isPrimaryLocked) {
      alert('Please save Primary data (Date, Shift, Incharge, PP Operator, Members) first before submitting other sections.');
      return;
    }

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
        alert('Event section data saved successfully!');
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
      {/* Header */}
      <div className="disamatic-header">
        <div className="disamatic-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Disamatic Product - Entry Form
            <button 
              className="disamatic-view-report-btn"
              onClick={handleViewReport}
              title="View Reports"
            >
              <FileText size={16} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
      </div>
          {/* Primary Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Primary Data</h3>
            {checkingData && (
              <div className="disamatic-checking-message">
                Checking for existing data...
              </div>
            )}
              {isPrimaryLocked && !checkingData && (
              <div className="disamatic-primary-locked-message">
                Saved primary fields are locked individually. Empty fields remain editable.
              </div>
            )}
            <div className="disamatic-form-grid">
          <div className="disamatic-form-group">
            <label>Date</label>
            <CustomDatePicker
              value={formData.date}
              onChange={(e) => {
                // CustomDatePicker passes event object with target.value
                const dateValue = e?.target?.value || e || '';
                handleChange("date", dateValue);
              }}
              name="date"
              disabled={false}
            />
          </div>
              <div className="disamatic-form-group">
                <label>Shift</label>
                <select
                  value={formData.shift}
                  onChange={e => handleChange("shift", e.target.value)}
                  onClick={() => handleLockedFieldClick('shift')}
                  onFocus={() => handleLockedFieldClick('shift')}
                  onMouseDown={(e) => {
                    if (basicFieldLocked.shift || checkingData) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  disabled={basicFieldLocked.shift || checkingData}
                  readOnly={basicFieldLocked.shift}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    border: '2px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: (basicFieldLocked.shift || checkingData) ? '#f1f5f9' : '#ffffff',
                    color: (basicFieldLocked.shift || checkingData) ? '#64748b' : '#1e293b',
                    cursor: (basicFieldLocked.shift || checkingData) ? 'not-allowed' : 'pointer',
                    opacity: (basicFieldLocked.shift || checkingData) ? 0.8 : 1,
                    pointerEvents: (basicFieldLocked.shift || checkingData) ? 'none' : 'auto'
                  }}
                >
                  <option value="">Select Shift</option>
                  <option value="Shift 1">Shift 1</option>
                  <option value="Shift 2">Shift 2</option>
                  <option value="Shift 3">Shift 3</option>
                </select>
              </div>
              <div className="disamatic-form-group">
                <label>Incharge</label>
                <input 
                  type="text" 
                  value={formData.incharge} 
                  onChange={e => handleChange("incharge", e.target.value)}
                  onClick={() => handleLockedFieldClick('incharge')}
                  onFocus={() => handleLockedFieldClick('incharge')}
                  placeholder="Enter incharge name"
                  disabled={basicFieldLocked.incharge}
                  readOnly={basicFieldLocked.incharge}
                  style={{ 
                    cursor: (basicFieldLocked.incharge) ? 'not-allowed' : 'text',
                    backgroundColor: (basicFieldLocked.incharge) ? '#f1f5f9' : '#ffffff'
                  }}
                />
              </div>
              <div className="disamatic-form-group">
                <label>PP Operator</label>
                <input 
                  type="text" 
                  value={formData.ppOperator} 
                  onChange={e => handleChange("ppOperator", e.target.value)}
                  onClick={() => handleLockedFieldClick('ppOperator')}
                  onFocus={() => handleLockedFieldClick('ppOperator')}
                  placeholder="Enter PP Operator name"
                  disabled={basicFieldLocked.ppOperator}
                  readOnly={basicFieldLocked.ppOperator}
                  style={{ 
                    cursor: (basicFieldLocked.ppOperator) ? 'not-allowed' : 'text',
                    backgroundColor: (basicFieldLocked.ppOperator) ? '#f1f5f9' : '#ffffff'
                  }}
                />
              </div>
              <div className="disamatic-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Members Present</label>
            <div className="disamatic-members-container">
              {formData.members.map((member, index) => {
                const isNewMemberField = isNewMember(index);
                const isEditable = !basicInfoLocked || isNewMemberField;
                return (
                  <div key={index} className="disamatic-member-input-wrapper">
                    <input
                      type="text"
                      value={member}
                      onChange={e => handleMemberChange(index, e.target.value)}
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
                      disabled={!isEditable && (basicInfoLocked || isLocked)}
                      readOnly={!isEditable && (basicInfoLocked || isLocked)}
                      style={{ cursor: isEditable ? 'text' : 'not-allowed' }}
                    />
                    {formData.members.length > 1 && isEditable && (
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
              {/* Allow adding members even when locked */}
              <button
                type="button"
                onClick={addMemberField}
                className="disamatic-add-member-btn"
                title="Add another member"
              >
                <Plus size={16} />
                Add Member
              </button>
            </div>
              </div>
            </div>
            {/* Allow saving basic info even when locked to save new members */}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleBasicInfoSubmit}
                disabled={loadingStates.basicInfo}
                className="disamatic-submit-btn"
                title={!isPrimaryLocked ? 'Save Primary' : 'Save Changes'}
              >
                {loadingStates.basicInfo ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {loadingStates.basicInfo ? 'Saving...' : (!isPrimaryLocked ? 'Save Primary' : 'Save Changes')}
              </button>
            </div>
          </div>

      {/* Divider line to separate primary data from other inputs */}
      <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}></div>

      {/* Production Table */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Production</h3>
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
                    {row.sNo !== undefined ? row.sNo : (nextSNo.production + index)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.counterNo}
                      onChange={e => handleProductionTableChange(index, 'counterNo', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 0, 7, productionSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 1, 7, productionSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 2, 7, productionSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 3, 7, productionSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 4, 7, productionSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 5, 7, productionSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'production', index, 6, 7, productionSubmitRef)}
                      placeholder="Remarks"
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
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={resetProductionTable}
              className="disamatic-reset-btn"
              title="Reset table"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              ref={productionSubmitRef}
              type="button"
              onClick={handleProductionSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loadingStates.production && isPrimaryLocked) {
                  e.preventDefault();
                  handleProductionSubmit();
                }
              }}
              disabled={loadingStates.production || !isPrimaryLocked}
              className="disamatic-submit-btn"
              title={!isPrimaryLocked ? 'Please save Primary data first' : 'Save Production'}
            >
              {loadingStates.production ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loadingStates.production ? 'Saving...' : 'Save Production'}
            </button>
          </div>
                </div>
          </div>

          {/* Next Shift Plan Section */}
          <div className="disamatic-section">
        <h3 className="disamatic-section-title">Next Shift Plan</h3>
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
                    {row.sNo !== undefined ? row.sNo : (nextSNo.nextShiftPlan + index)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleNextShiftPlanChange(index, 'componentName', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'nextShiftPlan', index, 0, 3, nextShiftPlanSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'nextShiftPlan', index, 1, 3, nextShiftPlanSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'nextShiftPlan', index, 2, 3, nextShiftPlanSubmitRef)}
                      placeholder="Remarks"
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
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={resetNextShiftPlanTable}
              className="disamatic-reset-btn"
              title="Reset table"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              ref={nextShiftPlanSubmitRef}
              type="button"
              onClick={handleNextShiftPlanSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loadingStates.nextShiftPlan && isPrimaryLocked) {
                  e.preventDefault();
                  handleNextShiftPlanSubmit();
                }
              }}
              disabled={loadingStates.nextShiftPlan || !isPrimaryLocked}
              className="disamatic-submit-btn"
              title={!isPrimaryLocked ? 'Please save Primary data first' : 'Save Next Shift Plan'}
            >
              {loadingStates.nextShiftPlan ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loadingStates.nextShiftPlan ? 'Saving...' : 'Save Next Shift Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Delays Table */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Delays</h3>
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
                    {row.sNo !== undefined ? row.sNo : (nextSNo.delays + index)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.delays}
                      onChange={e => handleDelaysTableChange(index, 'delays', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'delays', index, 0, 3, delaysSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'delays', index, 1, 3, delaysSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'delays', index, 2, 3, delaysSubmitRef)}
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
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={resetDelaysTable}
              className="disamatic-reset-btn"
              title="Reset table"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              ref={delaysSubmitRef}
              type="button"
              onClick={handleDelaysSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loadingStates.delays && isPrimaryLocked) {
                  e.preventDefault();
                  handleDelaysSubmit();
                }
              }}
              disabled={loadingStates.delays || !isPrimaryLocked}
              className="disamatic-submit-btn"
              title={!isPrimaryLocked ? 'Please save Primary data first' : 'Save Delays'}
            >
              {loadingStates.delays ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loadingStates.delays ? 'Saving...' : 'Save Delays'}
            </button>
          </div>
        </div>
      </div>

      {/* Production (Mould Hardness) Table */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Production : ( Mould Hardness )</h3>
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
                    {row.sNo !== undefined ? row.sNo : (nextSNo.mouldHardness + index)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleMouldHardnessTableChange(index, 'componentName', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 0, 6, mouldHardnessSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 1, 6, mouldHardnessSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 2, 6, mouldHardnessSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 3, 6, mouldHardnessSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 4, 6, mouldHardnessSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'mouldHardness', index, 5, 6, mouldHardnessSubmitRef)}
                      placeholder="Remarks"
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
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={resetMouldHardnessTable}
              className="disamatic-reset-btn"
              title="Reset table"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              ref={mouldHardnessSubmitRef}
              type="button"
              onClick={handleMouldHardnessSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loadingStates.mouldHardness && isPrimaryLocked) {
                  e.preventDefault();
                  handleMouldHardnessSubmit();
                }
              }}
              disabled={loadingStates.mouldHardness || !isPrimaryLocked}
              className="disamatic-submit-btn"
              title={!isPrimaryLocked ? 'Please save Primary data first' : 'Save Mould Hardness'}
            >
              {loadingStates.mouldHardness ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loadingStates.mouldHardness ? 'Saving...' : 'Save Mould Hardness'}
            </button>
          </div>
        </div>
      </div>

      {/* Pattern Temp Table */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Pattern Temp in C degree</h3>
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
                    {row.sNo !== undefined ? row.sNo : (nextSNo.patternTemp + index)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.item}
                      onChange={e => handlePatternTempTableChange(index, 'item', e.target.value)}
                      onKeyDown={(e) => handleTableKeyDown(e, 'patternTemp', index, 0, 3, patternTempSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'patternTemp', index, 1, 3, patternTempSubmitRef)}
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
                      onKeyDown={(e) => handleTableKeyDown(e, 'patternTemp', index, 2, 3, patternTempSubmitRef)}
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
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={resetPatternTempTable}
              className="disamatic-reset-btn"
              title="Reset table"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              ref={patternTempSubmitRef}
              type="button"
              onClick={handlePatternTempSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loadingStates.patternTemp && isPrimaryLocked) {
                  e.preventDefault();
                  handlePatternTempSubmit();
                }
              }}
              disabled={loadingStates.patternTemp || !isPrimaryLocked}
              className="disamatic-submit-btn"
              title={!isPrimaryLocked ? 'Please save Primary data first' : 'Save Pattern Temp'}
            >
              {loadingStates.patternTemp ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loadingStates.patternTemp ? 'Saving...' : 'Save Pattern Temp'}
            </button>
          </div>
        </div>
      </div>

      {/* Significant event Section */}
      <div className="disamatic-section">
        <h3 className="disamatic-section-title">Event</h3>
        <div className="disamatic-form-grid">
          <div className="disamatic-form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Significant Event : </label>
            <textarea
              value={formData.significantEvent}
              onChange={e => handleChange("significantEvent", e.target.value)}
              onClick={() => handleLockedFieldClick('significantEvent')}
              onFocus={() => handleLockedFieldClick('significantEvent')}
              placeholder="Describe significant event..."
              rows={4}
              disabled={eventSectionLocked.significantEvent}
              readOnly={eventSectionLocked.significantEvent}
              style={{ 
                width: '100%', 
                padding: '0.625rem 0.875rem', 
                border: '2px solid #cbd5e1', 
                borderRadius: '8px', 
                fontSize: '0.875rem', 
                fontFamily: 'inherit', 
                color: '#1e293b', 
                backgroundColor: (eventSectionLocked.significantEvent) ? '#f1f5f9' : '#ffffff', 
                transition: 'all 0.3s ease', 
                resize: 'vertical', 
                cursor: (eventSectionLocked.significantEvent) ? 'not-allowed' : 'text' 
              }}
            />
          </div>
          <div className="disamatic-form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Maintenance : </label>
            <textarea
              value={formData.maintenance}
              onChange={e => handleChange("maintenance", e.target.value)}
              onClick={() => handleLockedFieldClick('maintenance')}
              onFocus={() => handleLockedFieldClick('maintenance')}
              placeholder="Describe maintenance activities..."
              rows={4}
              disabled={eventSectionLocked.maintenance}
              readOnly={eventSectionLocked.maintenance}
              style={{ 
                width: '100%', 
                padding: '0.625rem 0.875rem', 
                border: '2px solid #cbd5e1', 
                borderRadius: '8px', 
                fontSize: '0.875rem', 
                fontFamily: 'inherit', 
                color: '#1e293b', 
                backgroundColor: (eventSectionLocked.maintenance) ? '#f1f5f9' : '#ffffff', 
                transition: 'all 0.3s ease', 
                resize: 'vertical', 
                cursor: (eventSectionLocked.maintenance) ? 'not-allowed' : 'text' 
              }}
            />
          </div>
          <div className="disamatic-form-group" style={{ maxWidth: '400px' }}>
            <label>Supervisor Name : </label>
            <input
              type="text"
              value={formData.supervisorName}
              onChange={e => handleChange("supervisorName", e.target.value)}
              onClick={() => handleLockedFieldClick('supervisorName')}
              onFocus={() => handleLockedFieldClick('supervisorName')}
              placeholder="Enter supervisor name"
              disabled={eventSectionLocked.supervisorName}
              readOnly={eventSectionLocked.supervisorName}
              style={{ cursor: (eventSectionLocked.supervisorName) ? 'not-allowed' : 'text' }}
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleEventSectionSubmit}
            disabled={loadingStates.eventSection || !isPrimaryLocked || (eventSectionLocked.significantEvent && eventSectionLocked.maintenance && eventSectionLocked.supervisorName)}
            className="disamatic-submit-btn"
            title={!isPrimaryLocked ? 'Please save Primary data first' : 'Save Event Section'}
          >
            {loadingStates.eventSection ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loadingStates.eventSection ? 'Saving...' : 'Save Event Section'}
          </button>
        </div>
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
};

export default DisamaticProduct;
