import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, FileText, Plus, X, Loader2, Edit2, RotateCcw, RefreshCw } from "lucide-react";
import CustomDatePicker from "../../Components/CustomDatePicker";
import api from "../../utils/api";
import "../../styles/PageStyles/Moulding/DisamaticProduct.css";

const initialFormData = {
  date: "",
  shift: "",
  incharge: "",
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
  const [isPrimaryLocked, setIsPrimaryLocked] = useState(false);
  const [eventSectionLocked, setEventSectionLocked] = useState({
    significantEvent: false,
    maintenance: false,
    supervisorName: false
  });
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const [initialMembers, setInitialMembers] = useState([]); // Track initial members when locked
  
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

  // Reset functions for each table
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
      setBasicInfoLocked(false);
      return;
    }

    try {
      setCheckingData(true);
      // Get report by date (primary identifier) - date is unique
      const response = await api.get(`/v1/dismatic-reports/date?date=${encodeURIComponent(date)}`);
      
      if (response.success && response.data && response.data.length > 0) {
        const report = response.data[0];
        
        // Check if basic info exists (shift, incharge, or members)
        if (report && (report.shift || report.incharge || report.memberspresent)) {
          setBasicInfoLocked(true);
          setIsPrimaryLocked(true);
          
          // Lock and populate basic info fields only - update all at once
          setFormData(prev => {
            const updated = { ...prev };
            if (report.shift) {
              updated.shift = String(report.shift || '');
            }
            if (report.incharge) {
              updated.incharge = String(report.incharge || '');
            }
            if (report.memberspresent) {
              const members = String(report.memberspresent || '').split(',').map(m => m.trim()).filter(m => m);
              updated.members = members.length > 0 ? members : [''];
              // Store initial members to distinguish from newly added ones
              setInitialMembers([...members]);
            } else {
              setInitialMembers([]);
            }
            return updated;
          });
          
          // Immediately check for full data since date record exists
          setTimeout(() => {
            checkExistingData();
          }, 100);
        } else {
          setBasicInfoLocked(false);
          setIsPrimaryLocked(false);
        }
      } else {
        setBasicInfoLocked(false);
        setIsPrimaryLocked(false);
      }
    } catch (error) {
      console.error('Error checking primary data:', error);
      setBasicInfoLocked(false);
      setIsPrimaryLocked(false);
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
        
        
        // Load all existing data into form - update all sections
        // Use functional update to ensure we have the latest formData
        setFormData(prev => {
          const updatedFormData = { ...prev };
          
          // Update shift if available
          if (report.shift) {
            updatedFormData.shift = String(report.shift || '');
          }

          // Update incharge if available
          if (report.incharge) {
            updatedFormData.incharge = String(report.incharge || '');
          }

          // Update members - preserve newly added members that haven't been saved yet
          if (report.memberspresent) {
            const existingMembers = String(report.memberspresent || '').split(',').map(m => m.trim()).filter(m => m);
            // Find new members in current formData that aren't in the database yet
            const currentMembers = prev.members || [];
            const newMembers = currentMembers.filter(m => {
              const memberStr = String(m).trim();
              return memberStr && !existingMembers.includes(memberStr);
            });
            // Combine: existing locked members + newly added members
            updatedFormData.members = [...existingMembers, ...newMembers];
            if (updatedFormData.members.length === 0) {
              updatedFormData.members = [''];
            }
            // Update initial members when loading full data
            setInitialMembers([...existingMembers]);
          }

          // Production Details
          if (report.productionDetails && Array.isArray(report.productionDetails) && report.productionDetails.length > 0) {
            updatedFormData.productionTable = report.productionDetails.map(item => ({
              counterNo: String(item.counterNo || ''),
              componentName: String(item.componentName || ''),
              produced: item.produced !== undefined && item.produced !== null ? item.produced : '',
              poured: item.poured !== undefined && item.poured !== null ? item.poured : '',
              cycleTime: String(item.cycleTime || ''),
              mouldsPerHour: item.mouldsPerHour !== undefined && item.mouldsPerHour !== null ? item.mouldsPerHour : '',
              remarks: String(item.remarks || '')
            }));
          } else {
            // Keep existing productionTable if no data
            updatedFormData.productionTable = prev.productionTable.length > 0 ? prev.productionTable : [{ counterNo: "", componentName: "", produced: "", poured: "", cycleTime: "", mouldsPerHour: "", remarks: "" }];
          }
          
          // Next Shift Plan
          if (report.nextShiftPlan && Array.isArray(report.nextShiftPlan) && report.nextShiftPlan.length > 0) {
            updatedFormData.nextShiftPlanTable = report.nextShiftPlan.map(item => ({
              componentName: String(item.componentName || ''),
              plannedMoulds: item.plannedMoulds !== undefined && item.plannedMoulds !== null ? item.plannedMoulds : '',
              remarks: String(item.remarks || '')
            }));
          } else {
            updatedFormData.nextShiftPlanTable = prev.nextShiftPlanTable.length > 0 ? prev.nextShiftPlanTable : [{ componentName: "", plannedMoulds: "", remarks: "" }];
          }
          
          // Delays
          if (report.delays && Array.isArray(report.delays) && report.delays.length > 0) {
            updatedFormData.delaysTable = report.delays.map(item => ({
              delays: String(item.delays || ''),
              durationMinutes: item.durationMinutes !== undefined && item.durationMinutes !== null ? item.durationMinutes : '',
              durationTime: String(item.durationTime || '')
            }));
          } else {
            updatedFormData.delaysTable = prev.delaysTable.length > 0 ? prev.delaysTable : [{ delays: "", durationMinutes: "", durationTime: "" }];
          }
          
          // Mould Hardness
          if (report.mouldHardness && Array.isArray(report.mouldHardness) && report.mouldHardness.length > 0) {
            updatedFormData.mouldHardnessTable = report.mouldHardness.map(item => ({
              componentName: String(item.componentName || ''),
              mpPP: item.mpPP !== undefined && item.mpPP !== null ? item.mpPP : '',
              mpSP: item.mpSP !== undefined && item.mpSP !== null ? item.mpSP : '',
              bsPP: item.bsPP !== undefined && item.bsPP !== null ? item.bsPP : '',
              bsSP: item.bsSP !== undefined && item.bsSP !== null ? item.bsSP : '',
              remarks: String(item.remarks || '')
            }));
          } else {
            updatedFormData.mouldHardnessTable = prev.mouldHardnessTable.length > 0 ? prev.mouldHardnessTable : [{ componentName: "", mpPP: "", mpSP: "", bsPP: "", bsSP: "", remarks: "" }];
          }
          
          // Pattern Temperature
          if (report.patternTemperature && Array.isArray(report.patternTemperature) && report.patternTemperature.length > 0) {
            updatedFormData.patternTempTable = report.patternTemperature.map(item => ({
              item: String(item.item || ''),
              pp: item.pp !== undefined && item.pp !== null ? item.pp : '',
              sp: item.sp !== undefined && item.sp !== null ? item.sp : ''
            }));
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

  // Check for primary data when date changes (similar to DmmSettingParameters)
  useEffect(() => {
    setShowLockedPopup(false); // Reset popup when date changes
    const timeoutId = setTimeout(() => {
      if (formData.date) {
        checkExistingPrimaryData(formData.date);
      } else {
        setBasicInfoLocked(false);
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
    // Don't show popup for members if basicInfo is locked (members can be added)
    if (basicInfoLocked && (fieldName === 'shift' || fieldName === 'incharge')) {
      setShowLockedPopup(true);
    } else if (isLocked && fieldName !== 'members') {
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
    const required = ['date', 'shift', 'incharge'];
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

    // Check if we have new members to save when form is locked
    // Allow saving new members even when basicInfoLocked or isLocked is true
    if (basicInfoLocked || isLocked) {
      const allMembers = formData.members.filter(m => m.trim() !== '');
      const hasNewMembers = allMembers.some(m => {
        const memberStr = m.trim();
        return memberStr && !initialMembers.includes(memberStr);
      });

      // If no new members to save and form is fully locked, show popup
      if (isLocked && !hasNewMembers && allMembers.length === initialMembers.length) {
        setShowLockedPopup(true);
        return;
      }

      // If basicInfoLocked and no new members, show message
      if (basicInfoLocked && !hasNewMembers && allMembers.length === initialMembers.length) {
        alert('No new members to save. Add new member names and try again.');
        return;
      }

      // If we have new members, proceed with saving (even if isLocked is true)
      // This allows adding members to a fully locked form
    }

    try {
      setLoadingStates(prev => ({ ...prev, basicInfo: true }));
      const data = await api.post('/v1/dismatic-reports', {
        date: formData.date, // Should be in YYYY-MM-DD format
        shift: formData.shift.trim(),
        incharge: formData.incharge.trim(),
        members: formData.members.filter(m => m.trim() !== ''),
        section: 'basicInfo'
      });
      
      if (data.success) {
        const savedMembers = formData.members.filter(m => m.trim() !== '');
        // Update initial members to include newly saved ones
        if (basicInfoLocked && savedMembers.length > 0) {
          setInitialMembers([...savedMembers]);
        }
        alert(basicInfoLocked ? 'New members saved successfully!' : 'Primary information saved successfully!');
        setIsPrimaryLocked(true);
        setBasicInfoLocked(true);
        // Wait a bit for database to be updated
        setTimeout(async () => {
          // Re-check for primary data and full form lock
          await checkExistingPrimaryData(formData.date);
          if (formData.shift) {
            await checkExistingData();
          }
        }, 300);
      }
    } catch (error) {
      console.error('Error saving basic info:', error);
      alert('Failed to save basic information: ' + (error.response?.data?.message || error.message));
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
      alert('Please save Primary data (Date, Shift, Incharge, Members) first before submitting other sections.');
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
        // Wait a bit for database to be updated
        setTimeout(async () => {
          await checkExistingData();
        }, 300);
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
      alert('Please save Primary data (Date, Shift, Incharge, Members) first before submitting other sections.');
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
        setTimeout(async () => {
          await checkExistingData();
        }, 300);
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
      alert('Please save Primary data (Date, Shift, Incharge, Members) first before submitting other sections.');
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
        setTimeout(async () => {
          await checkExistingData();
        }, 300);
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
      alert('Please save Primary data (Date, Shift, Incharge, Members) first before submitting other sections.');
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
        setTimeout(async () => {
          await checkExistingData();
        }, 300);
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
      alert('Please save Primary data (Date, Shift, Incharge, Members) first before submitting other sections.');
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
        setTimeout(async () => {
          await checkExistingData();
        }, 300);
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
      alert('Please save Primary data (Date, Shift, Incharge, Members) first before submitting other sections.');
      return;
    }

    // Check if form is locked - show popup instead of saving
    if (isLocked) {
      setShowLockedPopup(true);
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
        
        // Don't call checkExistingData - it might reload empty strings from DB and override our locks
        // The locks are correctly set based on what was actually saved
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
      {/* Header */}
      <div className="disamatic-header">
        <div className="disamatic-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Disamatic Production Report DISA
            <button 
              className="disamatic-view-report-btn"
              onClick={handleViewReport}
              title="View Reports"
            >
              <FileText size={14} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
        <div className="disamatic-header-buttons">
          <button 
            className="disamatic-reset-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset the entire form? All unsaved data will be lost.')) {
                setFormData(initialFormData);
                setIsLocked(false);
                setBasicInfoLocked(false);
                setIsPrimaryLocked(false);
                setInitialMembers([]);
              }
            }}
          >
            <RefreshCw size={18} />
            Reset Form
          </button>
        </div>
      </div>
          {/* Primary Section */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Primary</h3>
            {checkingData && (
              <div className="disamatic-checking-message">
                Checking for existing data...
              </div>
            )}
            {isPrimaryLocked && !checkingData && (
              <div className="disamatic-primary-locked-message">
                Primary data is locked. Use Reports page to edit.
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
                <input 
                  type="text" 
                  value={formData.shift} 
                  onChange={e => handleChange("shift", e.target.value)}
                  onClick={() => handleLockedFieldClick('shift')}
                  onFocus={() => handleLockedFieldClick('shift')}
                  placeholder="e.g., A, B, C"
                  disabled={basicInfoLocked || isLocked}
                  readOnly={basicInfoLocked || isLocked}
                  style={{ cursor: (basicInfoLocked || isLocked) ? 'not-allowed' : 'text' }}
                />
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
                  disabled={basicInfoLocked || isLocked}
                  readOnly={basicInfoLocked || isLocked}
                  style={{ cursor: (basicInfoLocked || isLocked) ? 'not-allowed' : 'text' }}
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
                title={isLocked ? 'Cannot modify when form is fully locked. Use Reports page to edit.' : (basicInfoLocked ? 'Save new members' : 'Save Primary')}
              >
                {loadingStates.basicInfo ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {loadingStates.basicInfo ? 'Saving...' : (basicInfoLocked ? 'Save New Members' : 'Save Primary')}
              </button>
            </div>
          </div>

      {/* Production Table */}
          <div className="disamatic-section">
            <h3 className="disamatic-section-title">Production</h3>
        <div className="disamatic-table-wrapper" style={{ gridColumn: '1 / -1', border: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <table className="disamatic-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#1e293b' }}>
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
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.counterNo}
                      onChange={e => handleProductionTableChange(index, 'counterNo', e.target.value)}
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
              type="button"
              onClick={handleProductionSubmit}
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
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleNextShiftPlanChange(index, 'componentName', e.target.value)}
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
              type="button"
              onClick={handleNextShiftPlanSubmit}
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
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.delays}
                      onChange={e => handleDelaysTableChange(index, 'delays', e.target.value)}
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
              type="button"
              onClick={handleDelaysSubmit}
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
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.componentName}
                      onChange={e => handleMouldHardnessTableChange(index, 'componentName', e.target.value)}
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
              type="button"
              onClick={handleMouldHardnessSubmit}
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
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      value={row.item}
                      onChange={e => handlePatternTempTableChange(index, 'item', e.target.value)}
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
              type="button"
              onClick={handlePatternTempSubmit}
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
              disabled={eventSectionLocked.significantEvent || isLocked}
              readOnly={eventSectionLocked.significantEvent || isLocked}
              style={{ 
                width: '100%', 
                padding: '0.625rem 0.875rem', 
                border: '2px solid #cbd5e1', 
                borderRadius: '8px', 
                fontSize: '0.875rem', 
                fontFamily: 'inherit', 
                color: '#1e293b', 
                backgroundColor: (eventSectionLocked.significantEvent || isLocked) ? '#f1f5f9' : '#ffffff', 
                transition: 'all 0.3s ease', 
                resize: 'vertical', 
                cursor: (eventSectionLocked.significantEvent || isLocked) ? 'not-allowed' : 'text' 
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
              disabled={eventSectionLocked.maintenance || isLocked}
              readOnly={eventSectionLocked.maintenance || isLocked}
              style={{ 
                width: '100%', 
                padding: '0.625rem 0.875rem', 
                border: '2px solid #cbd5e1', 
                borderRadius: '8px', 
                fontSize: '0.875rem', 
                fontFamily: 'inherit', 
                color: '#1e293b', 
                backgroundColor: (eventSectionLocked.maintenance || isLocked) ? '#f1f5f9' : '#ffffff', 
                transition: 'all 0.3s ease', 
                resize: 'vertical', 
                cursor: (eventSectionLocked.maintenance || isLocked) ? 'not-allowed' : 'text' 
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
              disabled={eventSectionLocked.supervisorName || isLocked}
              readOnly={eventSectionLocked.supervisorName || isLocked}
              style={{ cursor: (eventSectionLocked.supervisorName || isLocked) ? 'not-allowed' : 'text' }}
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleEventSectionSubmit}
            disabled={loadingStates.eventSection || !isPrimaryLocked || isLocked || (eventSectionLocked.significantEvent && eventSectionLocked.maintenance && eventSectionLocked.supervisorName)}
            className="disamatic-submit-btn"
            title={!isPrimaryLocked ? 'Please save Primary data first' : (isLocked ? 'Cannot modify when form is fully locked. Use Reports page to edit.' : 'Save Event Section')}
          >
            {loadingStates.eventSection ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loadingStates.eventSection ? 'Saving...' : 'Save Event Section'}
          </button>
        </div>
      </div>

      {/* Locked Form Popup */}
      {showLockedPopup && (isLocked || basicInfoLocked || eventSectionLocked.significantEvent || eventSectionLocked.maintenance || eventSectionLocked.supervisorName) && (
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
                  Basic information (Shift, Incharge, Members) is locked for this date. These fields cannot be modified.
                </p>
              )}
              {(eventSectionLocked.significantEvent || eventSectionLocked.maintenance || eventSectionLocked.supervisorName) && (
                <p className="disamatic-locked-popup-message">
                  Some event section fields are locked. Saved fields cannot be modified. Use the Reports page to edit.
                </p>
              )}
              {isLocked && (
                <p className="disamatic-locked-popup-message">
                  This form is locked. Data has already been entered for this date. To modify, please use the Report page.
                </p>
              )}
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
