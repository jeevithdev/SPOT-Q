import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, RefreshCw, FileText } from 'lucide-react';
import { DatePicker } from '../../Components/Buttons';
import api from "../../utils/api";
import "../../styles/PageStyles/MicroStructure/MicroStructure.css";


const MicroStructure = () => {
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to display date as DD/MM/YYYY
  const formatDisplayDate = (iso) => {
    if (!iso || typeof iso !== 'string' || !iso.includes('-')) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const [formData, setFormData] = useState({
    disa: '',
    insDate: getTodayDate(),
    partName: '',
    dateCode: '',
    heatCode: '',
    nodularity: '',
    graphiteType: '',
    countNosFrom: '',
    countNosTo: '',
    sizeFrom: '',
    sizeTo: '',
    ferriteFrom: '',
    ferriteTo: '',
    pearliteFrom: '',
    pearliteTo: '',
    carbideFrom: '',
    carbideTo: '',
    remarks: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Refs for navigation
  const submitButtonRef = useRef(null);
  const firstInputRef = useRef(null);

  const disaOptions = ['DISA I', 'DISA II', 'DISA III', 'DISA IV'];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent date changes
    if (name === 'insDate') {
      return;
    }
    // Live numeric validation
    // nodularity & graphiteType: plain number (no letters)
    // ferrite/pearlite/carbide/size/countNos From-To: plain numbers (0–999) with max 3 digits
    // legacy fields ferritePercent/pearlitePercent/carbidePercent and size (single range string) still support range-style input
    if (
      name === 'nodularity' ||
      name === 'graphiteType' ||
      name === 'ferritePercent' ||
      name === 'pearlitePercent' ||
      name === 'carbidePercent' ||
      name === 'countNosFrom' ||
      name === 'countNosTo' ||
      name === 'size' ||
      name === 'sizeFrom' ||
      name === 'sizeTo' ||
      name === 'ferriteFrom' ||
      name === 'ferriteTo' ||
      name === 'pearliteFrom' ||
      name === 'pearliteTo' ||
      name === 'carbideFrom' ||
      name === 'carbideTo'
    ) {
      const isRangeField =
        name === 'size' ||
        name === 'ferritePercent' ||
        name === 'pearlitePercent' ||
        name === 'carbidePercent';

      // nodularity / graphiteType: up to 3 digits (for 0-100)
      const singleNumberLoose = /^\d{0,3}$/;
      // range-like fields: strict 1–3 digits on each side
      const singleNumber3 = /^\d{0,3}$/;                    // up to 3 digits
      const editingRange3 = /^\d{1,3}-?\d{0,3}$/;          // "120", "120-", "120-250"

      let isNumeric = false;
      if (value === '') {
        // Allow clearing the field: store empty string but mark as invalid/required
        setFormData(prev => ({
          ...prev,
          [name]: ''
        }));
        setValidationErrors(prev => ({ ...prev, [name]: true }));
        return;
      }

      if (value !== '') {
        if (isRangeField) {
          // allow 1–3 digit single or in-progress 3-digit range like "120-" or "120-250"
          isNumeric = singleNumber3.test(value) || editingRange3.test(value);
        } else {
          // nodularity / graphiteType: only digits, up to 3 characters
          isNumeric = singleNumberLoose.test(value);
        }
      }

      if (!isNumeric) {
        // Do NOT update formData; just mark error so invalid strings never appear
        setValidationErrors(prev => ({ ...prev, [name]: true }));
        return;
      }

      // For size and ferrite/pearlite/carbide From-To fields, restrict to max 2 digits while typing (00–99)
      if (
        (name === 'sizeFrom' || name === 'sizeTo' ||
         name === 'ferriteFrom' || name === 'ferriteTo' ||
         name === 'pearliteFrom' || name === 'pearliteTo' ||
         name === 'carbideFrom' || name === 'carbideTo') &&
        value.length > 2
      ) {
        setValidationErrors(prev => ({ ...prev, [name]: true }));
        return;
      }

      // Hard-limit nodularity & graphiteType to 0–100 during typing
      if (!isRangeField && (name === 'nodularity' || name === 'graphiteType')) {
        const numVal = parseInt(value, 10);
        if (!Number.isNaN(numVal) && (numVal < 0 || numVal > 100)) {
          setValidationErrors(prev => ({ ...prev, [name]: true }));
          return;
        }
      }

      // Valid value: update formData and clear error
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
      return; // skip generic clear logic
    }

    // Default: non-numeric fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing (for other fields)
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;

    // Auto-format single digit numbers with leading zero
    if (type === 'number' && value && !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 9 && !value.includes('.') && value.length === 1) {
      const formattedValue = '0' + value;
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
  };

  const handleKeyDown = (e) => {
    const { name } = e.target;

    // Block scientific-notation characters (e/E/+) for numeric-like fields.
    // For these numeric fields we do not want any exponent notation or '+' at all.
    if ((
          name === 'nodularity' ||
          name === 'graphiteType' ||
          name === 'ferritePercent' ||
          name === 'pearlitePercent' ||
          name === 'carbidePercent' ||
          name === 'countNosFrom' ||
          name === 'countNosTo' ||
          name === 'size' ||
          name === 'sizeFrom' ||
          name === 'sizeTo' ||
          name === 'ferriteFrom' ||
          name === 'ferriteTo' ||
          name === 'pearliteFrom' ||
          name === 'pearliteTo' ||
          name === 'carbideFrom' ||
          name === 'carbideTo'
        )
        && ['e', 'E', '+'].includes(e.key)) {
      e.preventDefault();
      return;
    }

    // For nodularity, graphiteType, Count Nos (from/to) and range From/To fields we block '-' so '-' never appears in these boxes
    if ((
          name === 'nodularity' ||
          name === 'graphiteType' ||
          name === 'countNosFrom' ||
          name === 'countNosTo' ||
          name === 'sizeFrom' ||
          name === 'sizeTo' ||
          name === 'ferriteFrom' ||
          name === 'ferriteTo' ||
          name === 'pearliteFrom' ||
          name === 'pearliteTo' ||
          name === 'carbideFrom' ||
          name === 'carbideTo'
        ) && e.key === '-') {
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
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
    const required = [
      'disa', 'partName', 'dateCode', 'heatCode',
      'nodularity', 'graphiteType',
      'countNosFrom', 'countNosTo',
      'sizeFrom', 'sizeTo',
      'ferriteFrom', 'ferriteTo',
      'pearliteFrom', 'pearliteTo',
      'carbideFrom', 'carbideTo'
    ];
    const missing = required.filter(field => !formData[field]);

    // Set validation errors for missing fields
    const errors = {};
    missing.forEach(field => {
      errors[field] = true;
    });

    // Range validation for percentage-like numeric fields
    const nodVal = parseFloat(formData.nodularity);
    const graphVal = parseFloat(formData.graphiteType);

    if (isNaN(nodVal) || nodVal < 0 || nodVal > 100) {
      errors.nodularity = true;
    }

    if (isNaN(graphVal) || graphVal < 0 || graphVal > 100) {
      errors.graphiteType = true;
    }

    // Count Nos from/to: each must be 2–3 digit number and from <= to
    const countFrom = parseInt(formData.countNosFrom, 10);
    const countTo = parseInt(formData.countNosTo, 10);

    if (
      Number.isNaN(countFrom) ||
      countFrom < 0 ||
      countFrom > 999 ||
      (formData.countNosFrom.length > 0 && (formData.countNosFrom.length < 2 || formData.countNosFrom.length > 3))
    ) {
      errors.countNosFrom = true;
    }

    if (
      Number.isNaN(countTo) ||
      countTo < 0 ||
      countTo > 999 ||
      (formData.countNosTo.length > 0 && (formData.countNosTo.length < 2 || formData.countNosTo.length > 3))
    ) {
      errors.countNosTo = true;
    }

    if (!Number.isNaN(countFrom) && !Number.isNaN(countTo) && countFrom > countTo) {
      errors.countNosFrom = true;
      errors.countNosTo = true;
    }

    // Size, Ferrite, Pearlite, Carbide: each From/To must be numeric and From <= To

    const makeRangeError = (fromKey, toKey, maxValue = 999) => {
      const fromVal = parseInt(formData[fromKey], 10);
      const toVal = parseInt(formData[toKey], 10);

      const isTwoDigitPercent = maxValue === 99; // ferrite/pearlite/carbide: 00–99 only

      if (
        Number.isNaN(fromVal) ||
        fromVal < 0 ||
        fromVal > maxValue ||
        formData[fromKey].length === 0 ||
        (!isTwoDigitPercent && formData[fromKey].length > 3) ||
        (isTwoDigitPercent && formData[fromKey].length !== 2)
      ) {
        errors[fromKey] = true;
      }

      if (
        Number.isNaN(toVal) ||
        toVal < 0 ||
        toVal > maxValue ||
        formData[toKey].length === 0 ||
        (!isTwoDigitPercent && formData[toKey].length > 3) ||
        (isTwoDigitPercent && formData[toKey].length !== 2)
      ) {
        errors[toKey] = true;
      }

      if (!Number.isNaN(fromVal) && !Number.isNaN(toVal) && fromVal > toVal) {
        errors[fromKey] = true;
        errors[toKey] = true;
      }
    };

    // For ranges: size 0–99 (exactly 2 digits), ferrite/pearlite/carbide 0–99 (exactly 2 digits)
    makeRangeError('sizeFrom', 'sizeTo', 99);
    makeRangeError('ferriteFrom', 'ferriteTo', 99);
    makeRangeError('pearliteFrom', 'pearliteTo', 99);
    makeRangeError('carbideFrom', 'carbideTo', 99);

    setValidationErrors(errors);

    if (
      missing.length > 0 ||
      errors.nodularity ||
      errors.graphiteType ||
      errors.countNosFrom ||
      errors.countNosTo ||
      errors.sizeFrom || errors.sizeTo ||
      errors.ferriteFrom || errors.ferriteTo ||
      errors.pearliteFrom || errors.pearliteTo ||
      errors.carbideFrom || errors.carbideTo
    ) {
      return;
    }

    // Clear validation errors if all fields are valid
    setValidationErrors({});

    try {
      setSubmitLoading(true);

      // Map DISA string to number
      const disaMap = {
        'DISA I': 1,
        'DISA II': 2,
        'DISA III': 3,
        'DISA IV': 4
      };

      // Transform formData to match backend schema
      const countNosCombined = `${formData.countNosFrom}-${formData.countNosTo}`;
      const sizeCombined = `${formData.sizeFrom}-${formData.sizeTo}`;
      const ferriteFromVal = parseInt(formData.ferriteFrom, 10) || 0;
      const pearliteFromVal = parseInt(formData.pearliteFrom, 10) || 0;
      const carbideFromVal = parseInt(formData.carbideFrom, 10) || 0;
      const ferriteCombined = `${formData.ferriteFrom}-${formData.ferriteTo}`;
      const pearliteCombined = `${formData.pearliteFrom}-${formData.pearliteTo}`;
      const carbideCombined = `${formData.carbideFrom}-${formData.carbideTo}`;

      const payload = {
        disa: disaMap[formData.disa] || 0,
        insDate: formData.insDate,
        partName: formData.partName,
        dateCode: formData.dateCode,
        heatCode: formData.heatCode,
        // Ensure count is persisted (map UI field to backend field)
        countNos: countNosCombined,
        noduleCount: countNosCombined,
        size: sizeCombined,
        // Combined range strings for display in reports
        ferrite: ferriteCombined,
        pearlite: pearliteCombined,
        carbide: carbideCombined,
        // Provide both combined and explicit fields for compatibility
        nodularity: formData.nodularity,
        graphiteType: formData.graphiteType,
        microStructure: {
          nodularityGraphiteType: `${formData.nodularity} ${formData.graphiteType}`.trim(),
          // Backend expects numbers for these percent fields; send the From value
          ferritePercent: ferriteFromVal,
          pearlitePercent: pearliteFromVal,
          carbidePercent: carbideFromVal,
          // Also send count and size nested
          countNos: countNosCombined,
          noduleCount: countNosCombined,
          size: sizeCombined
        },
        remarks: formData.remarks || ''
      };

      const data = await api.post('/v1/micro-structure', payload);

      if (data.success) {
        alert('Micro structure report created successfully!');
        // After saving, keep partName, dateCode, and heatCode; reset other fields
        setFormData(prev => ({
          disa: '',
          insDate: getTodayDate(),
          partName: prev.partName,
          dateCode: prev.dateCode,
          heatCode: prev.heatCode,
          nodularity: '',
          graphiteType: '',
          countNosFrom: '',
          countNosTo: '',
          sizeFrom: '',
          sizeTo: '',
          ferriteFrom: '',
          ferriteTo: '',
          pearliteFrom: '',
          pearliteTo: '',
          carbideFrom: '',
          carbideTo: '',
          remarks: ''
        }));

        setValidationErrors({});
        setTimeout(() => {
          if (firstInputRef.current && firstInputRef.current.focus) {
            firstInputRef.current.focus();
          } else if (firstInputRef.current) {
            firstInputRef.current.focus();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error creating micro structure report:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      disa: '',
      insDate: getTodayDate(), 
      partName: '', 
      dateCode:'', 
      heatCode: '', 
      nodularity: '', 
      graphiteType: '',
      countNos: '', 
      size: '', 
      ferritePercent: '', 
      pearlitePercent: '', 
      carbidePercent: '', 
      remarks: ''
    });
    setValidationErrors({});
  };

  return (
    <>
      <div className="microstructure-header">
        <div className="microstructure-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Micro Structure - Entry Form
          </h2>
        </div>
        <div aria-label="Date" style={{ fontWeight: 600, color: '#25424c' }}>
          {`DATE : ${formatDisplayDate(formData.insDate)}`}
        </div>
      </div>

      <form className="microstructure-form-grid">
        {/* Row 1: DISA, Part Name, Date Code, Heat Code */}
        <div className="microstructure-form-row">
          <div className="microstructure-form-group">
            <label>DISA *</label>
            <select
              ref={firstInputRef}
              name="disa"
              value={formData.disa}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={validationErrors.disa ? 'invalid-input' : ''}
            >
              <option value="">Select DISA</option>
              {disaOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="microstructure-form-group">
            <label>Part Name *</label>
            <input
              type="text"
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g: Engine Block"
              className={validationErrors.partName ? 'invalid-input' : ''}
            />
          </div>

          <div className="microstructure-form-group">
            <label>Date Code *</label>
            <input
              type="text"
              name="dateCode"
              value={formData.dateCode}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g: 2024-HC-005"
              className={validationErrors.dateCode ? 'invalid-input' : ''}
            />
          </div>

          <div className="microstructure-form-group">
            <label>Heat Code *</label>
            <input
              type="text"
              name="heatCode"
              value={formData.heatCode}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g: 2024-HC-005"
              className={validationErrors.heatCode ? 'invalid-input' : ''}
            />
          </div>
        </div>

        {/* Micro Structure Section */}
        <div className="section-header">
          <h3>Micro Structure Details </h3>
        </div>
        
        {/* Row 2: Nodularity, Graphite Type, Count Nos/mm², Size */}
        <div className="microstructure-form-row">
          <div className="microstructure-form-group">
            <label>Nodularity % *</label>
            <input
              type="number"
              name="nodularity"
              value={formData.nodularity}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              min="0"
              max="100"
              step="1"
              placeholder="e.g: 85"
              className={validationErrors.nodularity ? 'invalid-input' : ''}
            />
          </div>

          <div className="microstructure-form-group">
            <label>Graphite Type % *</label>
            <input
              type="number"
              name="graphiteType"
              value={formData.graphiteType}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              min="0"
              max="100"
              step="1"
              placeholder="e.g: 15"
              className={validationErrors.graphiteType ? 'invalid-input' : ''}
            />
          </div>

          <div className="microstructure-form-group">
            <label>Count Nos/mm² *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                name="countNosFrom"
                value={formData.countNosFrom}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="999"
                step="1"
                placeholder="From"
                className={validationErrors.countNosFrom ? 'invalid-input' : ''}
              />
              <input
                type="number"
                name="countNosTo"
                value={formData.countNosTo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="999"
                step="1"
                placeholder="To"
                className={validationErrors.countNosTo ? 'invalid-input' : ''}
              />
            </div>
          </div>

          <div className="microstructure-form-group">
            <label>Size *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                name="sizeFrom"
                value={formData.sizeFrom}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="999"
                step="1"
                placeholder="From"
                className={validationErrors.sizeFrom ? 'invalid-input' : ''}
              />
              <input
                type="number"
                name="sizeTo"
                value={formData.sizeTo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="999"
                step="1"
                placeholder="To"
                className={validationErrors.sizeTo ? 'invalid-input' : ''}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Ferrite, Pearlite, Carbide, Remarks */}
        <div className="microstructure-form-row">
          <div className="microstructure-form-group">
            <label>Ferrite % *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                name="ferriteFrom"
                value={formData.ferriteFrom}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="100"
                step="1"
                placeholder="From"
                className={validationErrors.ferriteFrom ? 'invalid-input' : ''}
              />
              <input
                type="number"
                name="ferriteTo"
                value={formData.ferriteTo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="100"
                step="1"
                placeholder="To"
                className={validationErrors.ferriteTo ? 'invalid-input' : ''}
              />
            </div>
          </div>

          <div className="microstructure-form-group">
            <label>Pearlite % *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                name="pearliteFrom"
                value={formData.pearliteFrom}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="100"
                step="1"
                placeholder="From"
                className={validationErrors.pearliteFrom ? 'invalid-input' : ''}
              />
              <input
                type="number"
                name="pearliteTo"
                value={formData.pearliteTo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="100"
                step="1"
                placeholder="To"
                className={validationErrors.pearliteTo ? 'invalid-input' : ''}
              />
            </div>
          </div>

          <div className="microstructure-form-group">
            <label>Carbide % *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                name="carbideFrom"
                value={formData.carbideFrom}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="100"
                step="1"
                placeholder="From"
                className={validationErrors.carbideFrom ? 'invalid-input' : ''}
              />
              <input
                type="number"
                name="carbideTo"
                value={formData.carbideTo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                min="0"
                max="100"
                step="1"
                placeholder="To"
                className={validationErrors.carbideTo ? 'invalid-input' : ''}
              />
            </div>
          </div>

          <div className="microstructure-form-group">
            <label>Remarks</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter remarks (max 3 words)"
              className=""
            />
          </div>
        </div>
      </form>

      <div className="microstructure-submit-container" style={{ justifyContent: 'flex-end' }} >
        <button 
          ref={submitButtonRef}
          className="microstructure-submit-btn" 
          type="button"
          onClick={handleSubmit}
          onKeyDown={handleSubmitButtonKeyDown}
          disabled={submitLoading}
        >
          {submitLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
          {submitLoading ? 'Saving...' : 'Submit All'}
        </button>
      </div>
    </>
  );
};

export default MicroStructure;


