import React, { useState, useRef } from 'react';
import { Save, Loader2, FileText } from 'lucide-react';
import { SubmitButton } from '../../Components/Buttons';
import CustomDatePicker from '../../Components/CustomDatePicker';
import Sakthi from '../../Components/Sakthi';
import { API_ENDPOINTS } from '../../config/api';
import '../../styles/PageStyles/QcProduction/QcProductionDetails.css';

const QcProductionDetails = () => {
  // Helper: display DD/MM/YYYY
  const formatDisplayDate = (iso) => {
    if (!iso || typeof iso !== 'string' || !iso.includes('-')) return '';
    const [y, m, d] = iso.split('-');
    return `${d} / ${m} / ${y}`;
  };

  // Helper to get current date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    partName: '',
    noOfMoulds: '',
    cPercentFrom: '',
    cPercentTo: '',
    siPercentFrom: '',
    siPercentTo: '',
    mnPercentFrom: '',
    mnPercentTo: '',
    pPercentFrom: '',
    pPercentTo: '',
    sPercentFrom: '',
    sPercentTo: '',
    mgPercentFrom: '',
    mgPercentTo: '',
    cuPercentFrom: '',
    cuPercentTo: '',
    crPercentFrom: '',
    crPercentTo: '',
    nodularity: '',
    graphiteTypeFrom: '',
    graphiteTypeTo: '',
    pearliteFerrite: '',
    hardnessBHNFrom: '',
    hardnessBHNTo: '',
    ts: '',
    ys: '',
    el: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSakthi, setShowSakthi] = useState(false);

  /* 
   * VALIDATION STATES
   * null = neutral/default (no border color)
   * false = invalid (red border) - shown after submit when field is empty/invalid
   */
  const [dateValid, setDateValid] = useState(null);
  const [partNameValid, setPartNameValid] = useState(null);
  const [noOfMouldsValid, setNoOfMouldsValid] = useState(null);
  const [cPercentFromValid, setCPercentFromValid] = useState(null);
  const [cPercentToValid, setCPercentToValid] = useState(null);
  const [siPercentFromValid, setSiPercentFromValid] = useState(null);
  const [siPercentToValid, setSiPercentToValid] = useState(null);
  const [mnPercentFromValid, setMnPercentFromValid] = useState(null);
  const [mnPercentToValid, setMnPercentToValid] = useState(null);
  const [pPercentFromValid, setPPercentFromValid] = useState(null);
  const [pPercentToValid, setPPercentToValid] = useState(null);
  const [sPercentFromValid, setSPercentFromValid] = useState(null);
  const [sPercentToValid, setSPercentToValid] = useState(null);
  const [mgPercentFromValid, setMgPercentFromValid] = useState(null);
  const [mgPercentToValid, setMgPercentToValid] = useState(null);
  const [cuPercentFromValid, setCuPercentFromValid] = useState(null);
  const [cuPercentToValid, setCuPercentToValid] = useState(null);
  const [crPercentFromValid, setCrPercentFromValid] = useState(null);
  const [crPercentToValid, setCrPercentToValid] = useState(null);
  const [nodularityValid, setNodularityValid] = useState(null);
  const [graphiteTypeFromValid, setGraphiteTypeFromValid] = useState(null);
  const [graphiteTypeToValid, setGraphiteTypeToValid] = useState(null);
  const [pearliteFertiteValid, setPearliteFertiteValid] = useState(null);
  const [hardnessBHNFromValid, setHardnessBHNFromValid] = useState(null);
  const [hardnessBHNToValid, setHardnessBHNToValid] = useState(null);
  const [tsValid, setTsValid] = useState(null);
  const [ysValid, setYsValid] = useState(null);
  const [elValid, setElValid] = useState(null);

  // Refs for navigation
  const submitButtonRef = useRef(null);
  const firstInputRef = useRef(null);

  /*
   * Returns the appropriate CSS class for an input field based on validation state:
   * - Red border (invalid-input) when field is invalid/empty after submit
   * - Neutral (no color) otherwise
   */
  const getInputClassName = (validationState) => {
    if (validationState === false) return 'invalid-input';
    return '';
  };

  // Helper function to validate number input
  const isValidNumber = (value) => {
    if (!value || value.trim() === '') return false;
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  /*
   * Handle input change
   * When user starts typing, reset validation state to null (neutral)
   * This removes the red border as user begins correcting the field
   */

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset validation to neutral when user starts typing
    switch (name) {
      case 'date':
        setDateValid(null);
        break;
      case 'partName':
        setPartNameValid(null);
        break;
      case 'noOfMoulds':
        setNoOfMouldsValid(null);
        break;
      case 'cPercentFrom':
        setCPercentFromValid(null);
        break;
      case 'cPercentTo':
        setCPercentToValid(null);
        break;
      case 'siPercentFrom':
        setSiPercentFromValid(null);
        break;
      case 'siPercentTo':
        setSiPercentToValid(null);
        break;
      case 'mnPercentFrom':
        setMnPercentFromValid(null);
        break;
      case 'mnPercentTo':
        setMnPercentToValid(null);
        break;
      case 'pPercentFrom':
        setPPercentFromValid(null);
        break;
      case 'pPercentTo':
        setPPercentToValid(null);
        break;
      case 'sPercentFrom':
        setSPercentFromValid(null);
        break;
      case 'sPercentTo':
        setSPercentToValid(null);
        break;
      case 'mgPercentFrom':
        setMgPercentFromValid(null);
        break;
      case 'mgPercentTo':
        setMgPercentToValid(null);
        break;
      case 'cuPercentFrom':
        setCuPercentFromValid(null);
        break;
      case 'cuPercentTo':
        setCuPercentToValid(null);
        break;
      case 'crPercentFrom':
        setCrPercentFromValid(null);
        break;
      case 'crPercentTo':
        setCrPercentToValid(null);
        break;
      case 'nodularity':
        setNodularityValid(null);
        break;
      case 'graphiteTypeFrom':
        setGraphiteTypeFromValid(null);
        break;
      case 'graphiteTypeTo':
        setGraphiteTypeToValid(null);
        break;
      case 'pearliteFerrite':
        setPearliteFertiteValid(null);
        break;
      case 'hardnessBHNFrom':
        setHardnessBHNFromValid(null);
        break;
      case 'hardnessBHNTo':
        setHardnessBHNToValid(null);
        break;
      case 'ts':
        setTsValid(null);
        break;
      case 'ys':
        setYsValid(null);
        break;
      case 'el':
        setElValid(null);
        break;
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Dynamic validation removal for from/to pairs
    if (name.endsWith('From') || name.endsWith('To')) {
      const isFromField = name.endsWith('From');
      const fromField = isFromField ? name : name.replace('To', 'From');
      const toField = isFromField ? name.replace('From', 'To') : name;
      
      const fromValue = isFromField ? parseFloat(value) : parseFloat(formData[fromField]);
      const toValue = isFromField ? parseFloat(formData[toField]) : parseFloat(value);

      // If the range is now valid, remove red borders from both
      if (!isNaN(fromValue) && !isNaN(toValue) && (toValue === 0 || fromValue <= toValue)) {
        // Clear validation errors for both from and to fields
        const baseField = fromField.replace('From', '');
        
        switch(baseField) {
          case 'cPercent':
            setCPercentFromValid(null);
            setCPercentToValid(null);
            break;
          case 'siPercent':
            setSiPercentFromValid(null);
            setSiPercentToValid(null);
            break;
          case 'mnPercent':
            setMnPercentFromValid(null);
            setMnPercentToValid(null);
            break;
          case 'pPercent':
            setPPercentFromValid(null);
            setPPercentToValid(null);
            break;
          case 'sPercent':
            setSPercentFromValid(null);
            setSPercentToValid(null);
            break;
          case 'mgPercent':
            setMgPercentFromValid(null);
            setMgPercentToValid(null);
            break;
          case 'cuPercent':
            setCuPercentFromValid(null);
            setCuPercentToValid(null);
            break;
          case 'crPercent':
            setCrPercentFromValid(null);
            setCrPercentToValid(null);
            break;
          case 'graphiteType':
            setGraphiteTypeFromValid(null);
            setGraphiteTypeToValid(null);
            break;
          case 'hardnessBHN':
            setHardnessBHNFromValid(null);
            setHardnessBHNToValid(null);
            break;
        }
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;

    // Auto-format numbers to decimal format (e.g., 2 -> 2.0)
    if (type === 'number' && value && !isNaN(value)) {
      const numValue = parseFloat(value);
      if (!value.includes('.')) {
        // Add .0 if no decimal point
        const formattedValue = numValue.toFixed(1);
        setFormData(prev => ({
          ...prev,
          [name]: formattedValue
        }));
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const inputs = Array.from(form.querySelectorAll('input, textarea'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];

      if (nextInput) {
        nextInput.focus();
      } else {
        // Last input - focus submit button
        if (submitButtonRef.current) {
          submitButtonRef.current.focus();
        }
      }
    }
  };

  const handleSubmitButtonKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Check all required fields and set validation states
    let hasErrors = false;

    if (!formData.date || formData.date.trim() === '') {
      setDateValid(false);
      hasErrors = true;
    }
    if (!formData.partName || formData.partName.trim() === '') {
      setPartNameValid(false);
      hasErrors = true;
    }
    if (!formData.noOfMoulds || isNaN(formData.noOfMoulds) || parseFloat(formData.noOfMoulds) < 1) {
      setNoOfMouldsValid(false);
      hasErrors = true;
    }
    if (!formData.cPercentFrom || !isValidNumber(formData.cPercentFrom)) {
      setCPercentFromValid(false);
      hasErrors = true;
    }
    if (!formData.siPercentFrom || !isValidNumber(formData.siPercentFrom)) {
      setSiPercentFromValid(false);
      hasErrors = true;
    }
    if (!formData.mnPercentFrom || !isValidNumber(formData.mnPercentFrom)) {
      setMnPercentFromValid(false);
      hasErrors = true;
    }
    if (!formData.pPercentFrom || !isValidNumber(formData.pPercentFrom)) {
      setPPercentFromValid(false);
      hasErrors = true;
    }
    if (!formData.sPercentFrom || !isValidNumber(formData.sPercentFrom)) {
      setSPercentFromValid(false);
      hasErrors = true;
    }
    if (!formData.mgPercentFrom || !isValidNumber(formData.mgPercentFrom)) {
      setMgPercentFromValid(false);
      hasErrors = true;
    }
    if (!formData.cuPercentFrom || !isValidNumber(formData.cuPercentFrom)) {
      setCuPercentFromValid(false);
      hasErrors = true;
    }
    if (!formData.crPercentFrom || !isValidNumber(formData.crPercentFrom)) {
      setCrPercentFromValid(false);
      hasErrors = true;
    }
    if (!formData.nodularity || formData.nodularity.trim() === '') {
      setNodularityValid(false);
      hasErrors = true;
    }
    if (!formData.graphiteTypeFrom || !isValidNumber(formData.graphiteTypeFrom)) {
      setGraphiteTypeFromValid(false);
      hasErrors = true;
    }
    if (!formData.pearliteFerrite || formData.pearliteFerrite.trim() === '') {
      setPearliteFertiteValid(false);
      hasErrors = true;
    }
    if (!formData.hardnessBHNFrom || !isValidNumber(formData.hardnessBHNFrom)) {
      setHardnessBHNFromValid(false);
      hasErrors = true;
    }
    if (!formData.ts || formData.ts.trim() === '') {
      setTsValid(false);
      hasErrors = true;
    }
    if (!formData.ys || formData.ys.trim() === '') {
      setYsValid(false);
      hasErrors = true;
    }
    if (!formData.el || formData.el.trim() === '') {
      setElValid(false);
      hasErrors = true;
    }

    // Validate from/to pairs - ensure from <= to when to > 0
    const validateRange = (fromVal, toVal, fromSetter, toSetter, label) => {
      const from = parseFloat(fromVal);
      const to = parseFloat(toVal);
      if (!isNaN(from) && !isNaN(to) && to > 0 && from > to) {
        fromSetter(false);
        toSetter(false);
        hasErrors = true;
      }
    };

    validateRange(formData.cPercentFrom, formData.cPercentTo, setCPercentFromValid, setCPercentToValid, 'C %');
    validateRange(formData.siPercentFrom, formData.siPercentTo, setSiPercentFromValid, setSiPercentToValid, 'Si %');
    validateRange(formData.mnPercentFrom, formData.mnPercentTo, setMnPercentFromValid, setMnPercentToValid, 'Mn %');
    validateRange(formData.pPercentFrom, formData.pPercentTo, setPPercentFromValid, setPPercentToValid, 'P %');
    validateRange(formData.sPercentFrom, formData.sPercentTo, setSPercentFromValid, setSPercentToValid, 'S %');
    validateRange(formData.mgPercentFrom, formData.mgPercentTo, setMgPercentFromValid, setMgPercentToValid, 'Mg %');
    validateRange(formData.cuPercentFrom, formData.cuPercentTo, setCuPercentFromValid, setCuPercentToValid, 'Cu %');
    validateRange(formData.crPercentFrom, formData.crPercentTo, setCrPercentFromValid, setCrPercentToValid, 'Cr %');
    validateRange(formData.graphiteTypeFrom, formData.graphiteTypeTo, setGraphiteTypeFromValid, setGraphiteTypeToValid, 'Graphite Type');
    validateRange(formData.hardnessBHNFrom, formData.hardnessBHNTo, setHardnessBHNFromValid, setHardnessBHNToValid, 'Hardness BHN');

    if (hasErrors) {
      return;
    }

    // Clear all validation states on successful validation
    setDateValid(null);
    setPartNameValid(null);
    setNoOfMouldsValid(null);
    setCPercentFromValid(null);
    setCPercentToValid(null);
    setSiPercentFromValid(null);
    setSiPercentToValid(null);
    setMnPercentFromValid(null);
    setMnPercentToValid(null);
    setPPercentFromValid(null);
    setPPercentToValid(null);
    setSPercentFromValid(null);
    setSPercentToValid(null);
    setMgPercentFromValid(null);
    setMgPercentToValid(null);
    setCuPercentFromValid(null);
    setCuPercentToValid(null);
    setCrPercentFromValid(null);
    setCrPercentToValid(null);
    setNodularityValid(null);
    setGraphiteTypeFromValid(null);
    setGraphiteTypeToValid(null);
    setPearliteFertiteValid(null);
    setHardnessBHNFromValid(null);
    setHardnessBHNToValid(null);
    setTsValid(null);
    setYsValid(null);
    setElValid(null);

    // Helper: save entry locally if backend fails
    const saveLocalEntry = () => {
      try {
        const existingRaw = localStorage.getItem('qcProductionLocalEntries');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const localEntry = {
          ...formData,
          _id: `local-${Date.now()}`,
          local: true
        };
        const updated = [...existing, localEntry];
        localStorage.setItem('qcProductionLocalEntries', JSON.stringify(updated));
      } catch (storageError) {
        console.error('Error saving QC entry to localStorage:', storageError);
      }
    };

    try {
      setSubmitLoading(true);
      const response = await fetch(API_ENDPOINTS.qcReports, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(formData) });
      const data = await response.json();

      if (data.success) {
        setShowSakthi(true);
        // Reset form and validation states
        setFormData({
          date: getTodayDate(), partName: '', noOfMoulds: '',
          cPercentFrom: '', cPercentTo: '',
          siPercentFrom: '', siPercentTo: '',
          mnPercentFrom: '', mnPercentTo: '',
          pPercentFrom: '', pPercentTo: '',
          sPercentFrom: '', sPercentTo: '',
          mgPercentFrom: '', mgPercentTo: '',
          cuPercentFrom: '', cuPercentTo: '',
          crPercentFrom: '', crPercentTo: '',
          nodularity: '',
          graphiteTypeFrom: '', graphiteTypeTo: '',
          pearliteFerrite: '',
          hardnessBHNFrom: '', hardnessBHNTo: '',
          ts: '', ys: '', el: ''
        });
        setPartNameValid(null);
        setNoOfMouldsValid(null);
        setCPercentFromValid(null);
        setCPercentToValid(null);
        setSiPercentFromValid(null);
        setSiPercentToValid(null);
        setMnPercentFromValid(null);
        setMnPercentToValid(null);
        setPPercentFromValid(null);
        setPPercentToValid(null);
        setSPercentFromValid(null);
        setSPercentToValid(null);
        setMgPercentFromValid(null);
        setMgPercentToValid(null);
        setCuPercentFromValid(null);
        setCuPercentToValid(null);
        setCrPercentFromValid(null);
        setCrPercentToValid(null);
        setNodularityValid(null);
        setGraphiteTypeFromValid(null);
        setGraphiteTypeToValid(null);
        setPearliteFertiteValid(null);
        setHardnessBHNFromValid(null);
        setHardnessBHNToValid(null);
        setTsValid(null);
        setYsValid(null);
        setElValid(null);
        
        // Focus first input after successful submission
        setTimeout(() => {
          if (firstInputRef.current && firstInputRef.current.focus) {
            firstInputRef.current.focus();
          }
        }, 100);
      }

      setFormData({
        date: getTodayDate(), partName: '', noOfMoulds: '',
        cPercentFrom: '', cPercentTo: '',
        siPercentFrom: '', siPercentTo: '',
        mnPercentFrom: '', mnPercentTo: '',
        pPercentFrom: '', pPercentTo: '',
        sPercentFrom: '', sPercentTo: '',
        mgPercentFrom: '', mgPercentTo: '',
        cuPercentFrom: '', cuPercentTo: '',
        crPercentFrom: '', crPercentTo: '',
        nodularity: '',
        graphiteTypeFrom: '', graphiteTypeTo: '',
        pearliteFerrite: '',
        hardnessBHNFrom: '', hardnessBHNTo: '',
        ts: '', ys: '', el: ''
      });
      // Reset all validation states
      setPartNameValid(null);
      setNoOfMouldsValid(null);
      setCPercentFromValid(null);
      setCPercentToValid(null);
      setSiPercentFromValid(null);
      setSiPercentToValid(null);
      setMnPercentFromValid(null);
      setMnPercentToValid(null);
      setPPercentFromValid(null);
      setPPercentToValid(null);
      setSPercentFromValid(null);
      setSPercentToValid(null);
      setMgPercentFromValid(null);
      setMgPercentToValid(null);
      setCuPercentFromValid(null);
      setCuPercentToValid(null);
      setCrPercentFromValid(null);
      setCrPercentToValid(null);
      setNodularityValid(null);
      setGraphiteTypeFromValid(null);
      setGraphiteTypeToValid(null);
      setPearliteFertiteValid(null);
      setHardnessBHNFromValid(null);
      setHardnessBHNToValid(null);
      setTsValid(null);
      setYsValid(null);
      setElValid(null);
      // Focus first input after submission handling
      setTimeout(() => {
        if (firstInputRef.current && firstInputRef.current.focus) {
          firstInputRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Error creating QC report:', error);
      saveLocalEntry();
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <div className="qcproduction-header">
        <div className="qcproduction-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            QC Production Details - Entry Form
          </h2>
        </div>
        <div aria-label="Date" style={{ fontWeight: 600, color: '#25424c' }}>
          DATE : {formData.date ? formatDisplayDate(formData.date) : '-'}
        </div>
      </div>

      <form className="qcproduction-form-grid">

            <div className="qcproduction-form-group">
              <label>Date *</label>
              <CustomDatePicker
                ref={firstInputRef}
                name="date"
                value={formData.date}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                max={new Date().toISOString().split('T')[0]}
                style={{
                  border: dateValid === false ? '2px solid #ef4444' : '2px solid #cbd5e1',
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: '#fff'
                }}
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Part Name *</label>
              <input
                ref={firstInputRef}
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: Brake Disc"
                className={getInputClassName(partNameValid)}
              />
            </div>

            <div className="qcproduction-form-group">
              <label>No. of Moulds *</label>
              <input
                type="text"
                name="noOfMoulds"
                value={formData.noOfMoulds}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 5"
                className={getInputClassName(noOfMouldsValid)}
              />
            </div>

            <div className="qcproduction-form-group">
              <label>C % *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  step="0.01"
                  name="cPercentFrom"
                  value={formData.cPercentFrom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(cPercentFromValid)}
                />
                <input
                  type="number"
                  step="0.01"
                  name="cPercentTo"
                  value={formData.cPercentTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(cPercentToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>Si % *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  step="0.01"
                  name="siPercentFrom"
                  value={formData.siPercentFrom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(siPercentFromValid)}
                />
                <input
                  type="number"
                  step="0.01"
                  name="siPercentTo"
                  value={formData.siPercentTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(siPercentToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>Mn % *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  step="0.01"
                  name="mnPercentFrom"
                  value={formData.mnPercentFrom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(mnPercentFromValid)}
                />
                <input
                  type="number"
                  step="0.01"
                  name="mnPercentTo"
                  value={formData.mnPercentTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(mnPercentToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>P % *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  step="0.01"
                  name="pPercentFrom"
                  value={formData.pPercentFrom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(pPercentFromValid)}
                />
                <input
                  type="number"
                  step="0.01"
                  name="pPercentTo"
                  value={formData.pPercentTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(pPercentToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>S % *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  step="0.01"
                  name="sPercentFrom"
                  value={formData.sPercentFrom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(sPercentFromValid)}
                />
                <input
                  type="number"
                  step="0.01"
                  name="sPercentTo"
                  value={formData.sPercentTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(sPercentToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>Mg % *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  step="0.01"
                  name="mgPercentFrom"
                  value={formData.mgPercentFrom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(mgPercentFromValid)}
                />
                <input
                  type="number"
                  step="0.01"
                  name="mgPercentTo"
                  value={formData.mgPercentTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(mgPercentToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>Cu % *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  step="0.01"
                  name="cuPercentFrom"
                  value={formData.cuPercentFrom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(cuPercentFromValid)}
                />
                <input
                  type="number"
                  step="0.01"
                  name="cuPercentTo"
                  value={formData.cuPercentTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(cuPercentToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>Cr % *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  step="0.01"
                  name="crPercentFrom"
                  value={formData.crPercentFrom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(crPercentFromValid)}
                />
                <input
                  type="number"
                  step="0.01"
                  name="crPercentTo"
                  value={formData.crPercentTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(crPercentToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>Nodularity *</label>
              <input
                type="text"
                name="nodularity"
                value={formData.nodularity}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 85"
                className={getInputClassName(nodularityValid)}
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Graphite Type *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  name="graphiteTypeFrom"
                  value={formData.graphiteTypeFrom}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(graphiteTypeFromValid)}
                />
                <input
                  type="number"
                  name="graphiteTypeTo"
                  value={formData.graphiteTypeTo}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(graphiteTypeToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>Pearlite Ferrite *</label>
              <input
                type="text"
                name="pearliteFerrite"
                value={formData.pearliteFerrite}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 55-65P"
                className={getInputClassName(pearliteFertiteValid)}
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Hardness BHN *</label>
              <div className="qcproduction-range-input">
                <input
                  type="number"
                  name="hardnessBHNFrom"
                  value={formData.hardnessBHNFrom}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="From"
                  className={getInputClassName(hardnessBHNFromValid)}
                />
                <input
                  type="number"
                  name="hardnessBHNTo"
                  value={formData.hardnessBHNTo}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="To"
                  className={getInputClassName(hardnessBHNToValid)}
                />
              </div>
            </div>

            <div className="qcproduction-form-group">
              <label>TS (Tensile Strength) *</label>
              <input
                type="text"
                name="ts"
                value={formData.ts}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 550.23"
                className={getInputClassName(tsValid)}
              />
            </div>

            <div className="qcproduction-form-group">
              <label>YS (Yield Strength) *</label>
              <input
                type="text"
                name="ys"
                value={formData.ys}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 460.23"
                className={getInputClassName(ysValid)}
              />
            </div>

            <div className="qcproduction-form-group">
              <label>EL (Elongation) *</label>
              <input
                type="text"
                name="el"
                value={formData.el}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 18.5"
                className={getInputClassName(elValid)}
              />
            </div>
      </form>

      <div className="qcproduction-submit-container">
        <SubmitButton
          onClick={handleSubmit}
          disabled={submitLoading}
          type="button"
        >
          {submitLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            'Submit Entry'
          )}
        </SubmitButton>
      </div>

      {showSakthi && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <Sakthi onComplete={() => setShowSakthi(false)} />
        </div>
      )}
    </>
  );
};

export default QcProductionDetails;

