import { useState, useRef, useEffect } from 'react';
import { Save } from 'lucide-react';
import { SubmitButton, ResetButton } from '../../Components/Buttons';
import CustomDatePicker from '../../Components/CustomDatePicker';
import '../../styles/PageStyles/Impact/Impact.css';

const Impact = () => {

  // ====================== State ======================
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    dateCode: '',
    specification: {
      val: '',
      constraint: ''
    },
    observedValue: '',
    remarks: ''
  });

  // VALIDATION STATES
  const [dateValid, setDateValid] = useState(null);
  const [partNameValid, setPartNameValid] = useState(null); // null = default, true = green, false = red
  const [dateCodeValid, setDateCodeValid] = useState(null);
  const [specificationValValid, setSpecificationValValid] = useState(null);
  const [observedValueValid, setObservedValueValid] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Refs
  const submitButtonRef = useRef(null);
  const firstInputRef = useRef(null);

  // ====================== Format date ======================
  const formatDisplayDate = (iso) => {
    if (!iso || typeof iso !== 'string' || !iso.includes('-')) return '';
    const [y, m, d] = iso.split('-');
    return `${d} / ${m} / ${y}`;
  };

  // ====================== Handle input change ======================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // --- VALIDATE DATE ---
    if (name === "date") {
      setDateValid(
        value.trim() === "" ? null : value.trim().length > 0
      );
    }

    // --- VALIDATE PART NAME: alphabets and spaces ---
    if (name === "partName") {
      const pattern = /^[A-Za-z\s]+$/;
      setPartNameValid(
        value.trim() === "" ? null : pattern.test(value)
      );
    }

    // --- VALIDATE DATE CODE: specific format (e.g., 6F25) ---
    // Pattern: 1 digit + 1 uppercase letter + 2 digits
    if (name === "dateCode") {
      const pattern = /^[0-9][A-Z][0-9]{2}$/;
      setDateCodeValid(
        value.trim() === "" ? null : pattern.test(value)
      );
    }

    // --- VALIDATE SPECIFICATION VALUE: number ---
    if (name === 'specificationVal') {
      const isValid = value.trim() === "" ? null : !isNaN(value) && value.trim() !== "";
      setSpecificationValValid(isValid);

      setFormData(prev => ({
        ...prev,
        specification: {
          ...prev.specification,
          val: value
        }
      }));
      return;
    }

    // --- VALIDATE OBSERVED VALUE: number or comma-separated numbers ---
    if (name === "observedValue") {
      // Pattern allows: single number, or comma-separated numbers (e.g., "12" or "34,45")
      const pattern = /^[\d.,\s]+$/;
      setObservedValueValid(
        value.trim() === "" ? null : pattern.test(value)
      );
    }

    // Specification Constraint (no validation needed)
    if (name === 'specificationConstraint') {
      setFormData(prev => ({
        ...prev,
        specification: {
          ...prev.specification,
          constraint: value
        }
      }));
      return;
    }

    // Auto-uppercase dateCode
    const finalValue = name === 'dateCode' ? value.toUpperCase() : value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };


  // ====================== Enter Key Navigation ======================
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
        if (submitButtonRef.current) submitButtonRef.current.focus();
      }
    }
  };

  // ====================== Submit ======================
  const handleSubmitButtonKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Clear any previous error
    setSubmitError('');

    // Validate required fields
    const requiredFields = [
      { name: 'date', value: formData.date, label: 'Date', setState: setDateValid },
      { name: 'partName', value: formData.partName, label: 'Part Name', setState: setPartNameValid },
      { name: 'dateCode', value: formData.dateCode, label: 'Date Code', setState: setDateCodeValid },
      { name: 'specificationVal', value: formData.specification.val, label: 'Specification Value', setState: setSpecificationValValid },
      { name: 'observedValue', value: formData.observedValue, label: 'Observed Value', setState: setObservedValueValid }
    ];

    const emptyFields = requiredFields.filter(field => !field.value || field.value.trim() === '');

    if (emptyFields.length > 0) {
      // Highlight all empty required fields in red
      emptyFields.forEach(field => {
        field.setState(false);
      });

      // Set error message
      setSubmitError('Please fill in all required fields');

      // Clear error message after 3 seconds
      setTimeout(() => {
        setSubmitError('');
      }, 3000);

      return;
    }

    try {
      setSubmitLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/impact-tests', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        // Show success popup
        setShowSuccessPopup(true);

        // Reset form
        setFormData({
          date: '',
          partName: '',
          dateCode: '',
          specification: { val: '', constraint: '' },
          observedValue: '',
          remarks: ''
        });

        // Reset validation states
        setDateValid(null);
        setPartNameValid(null);
        setDateCodeValid(null);
        setSpecificationValValid(null);
        setObservedValueValid(null);

        setTimeout(() => {
          firstInputRef.current?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('Error creating impact test:', error);
      alert('Failed to create entry: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitLoading(false);
    }
  };

  // ====================== Reset ======================
  const handleReset = () => {
    setFormData({
      date: '',
      partName: '',
      dateCode: '',
      specification: { val: '', constraint: '' },
      observedValue: '',
      remarks: ''
    });

    setDateValid(null);
    setPartNameValid(null);
    setDateCodeValid(null);
    setSpecificationValValid(null);
    setObservedValueValid(null);
  };

  // ====================== JSX ======================
  return (
    <>
      <div className="impact-header">
        <div className="impact-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Impact Test - Entry Form
          </h2>
        </div>
        <div aria-label="Date" style={{ fontWeight: 600, color: '#25424c' }}>
          DATE : {formData.date ? formatDisplayDate(formData.date) : '-'}
        </div>
      </div>

      <form className="impact-form-grid">

        {/* DATE INPUT */}
        <div className="impact-form-group">
          <label>
            Date <span className="required-indicator">*</span>
          </label>

          <CustomDatePicker
            ref={firstInputRef}
            name="date"
            value={formData.date}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            max={new Date().toISOString().split('T')[0]}
            style={{
              border: dateValid === null ? '2px solid #cbd5e1' : dateValid ? '2px solid #10b981' : '2px solid #ef4444',
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: '#fff'
            }}
          />
        </div>

        {/* PART NAME - with validation */}
        <div className="impact-form-group">
          <label>
            Part Name <span className="required-indicator">*</span>
          </label>

          <input
            type="text"
            name="partName"
            value={formData.partName}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g: Crankshaft"
            autoComplete="off"
            className={
              partNameValid === null
                ? ""
                : partNameValid
                ? "valid-input"
                : "invalid-input"
            }
          />
        </div>

        {/* DATE CODE */}
        <div className="impact-form-group">
          <label>Date Code <span className="required-indicator">*</span></label>
          <input
            type="text"
            name="dateCode"
            value={formData.dateCode}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g: 6F25"
            autoComplete="off"
            className={
              dateCodeValid === null
                ? ""
                : dateCodeValid
                ? "valid-input"
                : "invalid-input"
            }
          />
        </div>

        {/* SPEC VALUE */}
        <div className="impact-form-group">
          <label>Specification Value <span className="required-indicator">*</span></label>
          <input
            type="number"
            name="specificationVal"
            value={formData.specification.val}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g: 12.5"
            step="0.1"
            autoComplete="off"
            className={
              specificationValValid === null
                ? ""
                : specificationValValid
                ? "valid-input"
                : "invalid-input"
            }
          />
        </div>

        {/* SPEC CONSTRAINT */}
        <div className="impact-form-group">
          <label>Specification Constraint</label>
          <input
            type="text"
            name="specificationConstraint"
            value={formData.specification.constraint}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g: 30° unnotch"
            autoComplete="off"
          />
        </div>

        {/* OBSERVED VALUE */}
        <div className="impact-form-group">
          <label>Observed Value <span className="required-indicator">*</span></label>
          <input
            type="text"
            name="observedValue"
            value={formData.observedValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g: 12 or 34,45"
            autoComplete="off"
            className={
              observedValueValid === null
                ? ""
                : observedValueValid
                ? "valid-input"
                : "invalid-input"
            }
          />
        </div>

        {/* REMARKS */}
        <div className="impact-form-group medium-width">
          <label>Remarks</label>
          <input
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter any additional notes or observations..."
            maxLength={80}
            autoComplete="off"
          />
        </div>

      </form>

      <div className="impact-submit-container">
        <ResetButton onClick={handleReset}>
          Reset Form
        </ResetButton>

        <div className="impact-submit-right">
          {submitError && (
            <span className="impact-submit-error">{submitError}</span>
          )}
          <SubmitButton
            onClick={handleSubmit}
            disabled={submitLoading}
          >
            {submitLoading ? 'Saving...' : 'Submit Entry'}
          </SubmitButton>
        </div>
      </div>
    </>
  );
};

export default Impact;
