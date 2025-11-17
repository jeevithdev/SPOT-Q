import React, { useState, useRef, useEffect } from 'react';
import { Save, RefreshCw, FileText, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import '../../styles/PageStyles/Impact/Impact.css';

const Impact = () => {
  // Helper: display DD/MM/YYYY
  const formatDisplayDate = (iso) => {
    if (!iso || typeof iso !== 'string' || !iso.includes('-')) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

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

  const [submitLoading, setSubmitLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [dateLoading, setDateLoading] = useState(true);

  // Refs for navigation
  const submitButtonRef = useRef(null);
  const firstInputRef = useRef(null);

  // Fetch current date from backend on mount
  useEffect(() => {
    const fetchCurrentDate = async () => {
      try {
        setDateLoading(true);
        const data = await api.get('/impact-tests/current-date');

        if (data.success && data.date) {
          setFormData(prev => ({
            ...prev,
            date: data.date
          }));
        }
      } catch (error) {
        console.error('Error fetching current date:', error);
        // Fallback to local date if backend fails
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        setFormData(prev => ({
          ...prev,
          date: `${y}-${m}-${d}`
        }));
      } finally {
        setDateLoading(false);
      }
    };

    fetchCurrentDate();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent programmatic/user changes to date
    if (name === 'date') return;

    // Handle nested specification fields
    if (name === 'specificationVal' || name === 'specificationConstraint') {
      const field = name === 'specificationVal' ? 'val' : 'constraint';
      setFormData(prev => ({
        ...prev,
        specification: {
          ...prev.specification,
          [field]: value
        }
      }));

      // Clear validation error
      if (validationErrors[name]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
      return;
    }

    // Auto-capitalize dateCode
    if (name === 'dateCode') {
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear validation error when user starts typing
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
    const errors = {};

    // Check required fields
    if (!formData.partName) errors.partName = true;
    if (!formData.dateCode) errors.dateCode = true;
    if (!formData.specification.val) errors.specificationVal = true;
    if (!formData.observedValue) errors.observedValue = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Clear validation errors if all fields are valid
    setValidationErrors({});

    try {
      setSubmitLoading(true);
      const data = await api.post('/impact-tests', formData);

      if (data.success) {
        alert('Impact test entry created successfully!');

        // Re-fetch current date from backend to ensure consistency
        const dateData = await api.get('/impact-tests/current-date');
        const currentDate = dateData.success && dateData.date ? dateData.date : formData.date;

        setFormData({
          date: currentDate,
          partName: '',
          dateCode: '',
          specification: {
            val: '',
            constraint: ''
          },
          observedValue: '',
          remarks: ''
        });
        setValidationErrors({});

        // Focus first input after successful submission
        setTimeout(() => {
          if (firstInputRef.current && firstInputRef.current.focus) {
            firstInputRef.current.focus();
          } else if (firstInputRef.current) {
            firstInputRef.current.focus();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error creating impact test:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleReset = async () => {
    try {
      // Re-fetch current date from backend to ensure consistency
      const dateData = await api.get('/impact-tests/current-date');
      const currentDate = dateData.success && dateData.date ? dateData.date : formData.date;

      setFormData({
        date: currentDate,
        partName: '',
        dateCode: '',
        specification: {
          val: '',
          constraint: ''
        },
        observedValue: '',
        remarks: ''
      });
      setValidationErrors({});
    } catch (error) {
      console.error('Error resetting form:', error);
      // On error, just reset fields but keep current date
      setFormData({
        date: formData.date,
        partName: '',
        dateCode: '',
        specification: {
          val: '',
          constraint: ''
        },
        observedValue: '',
        remarks: ''
      });
      setValidationErrors({});
    }
  };

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
          {dateLoading ? 'Loading date...' : `DATE : ${formatDisplayDate(formData.date)}`}
        </div>
      </div>

      <form className="impact-form-grid">
            <div className="impact-form-group">
              <label>Part Name *</label>
              <input
                ref={firstInputRef}
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: Crankshaft"
                className={validationErrors.partName ? 'invalid-input' : ''}
              />
            </div>

            <div className="impact-form-group">
              <label>Date Code *</label>
              <input
                type="text"
                name="dateCode"
                value={formData.dateCode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 6F25"
                className={validationErrors.dateCode ? 'invalid-input' : ''}
              />
            </div>

            <div className="impact-form-group">
              <label>Specification Value *</label>
              <input
                type="number"
                name="specificationVal"
                value={formData.specification.val}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                step="0.1"
                placeholder="e.g: J/cm²"
                className={validationErrors.specificationVal ? 'invalid-input' : ''}
              />
            </div>

            <div className="impact-form-group">
              <label>Specification Constraint</label>
              <input
                type="text"
                name="specificationConstraint"
                value={formData.specification.constraint}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 30° unnotch"
              />
            </div>

            <div className="impact-form-group">
              <label>Observed Value *</label>
              <input
                type="text"
                name="observedValue"
                value={formData.observedValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g: 12 or 34,45"
                className={validationErrors.observedValue ? 'invalid-input' : ''}
              />
            </div>

            <div className="impact-form-group full-width">
              <label>Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter any additional notes or observations..."
                maxLength={80}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  resize: 'none'
                }}
                className=""
              />
            </div>
      </form>

      <div className="impact-submit-container">
        <button 
          className="impact-reset-btn"
          onClick={handleReset}
          type="button"
        >
          <RefreshCw size={18} />
          Reset Form
        </button>
        <button 
          ref={submitButtonRef}
          className="impact-submit-btn" 
          type="button"
          onClick={handleSubmit}
          onKeyDown={handleSubmitButtonKeyDown}
          disabled={submitLoading}
        >
          {submitLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
          {submitLoading ? 'Saving...' : 'Submit Entry'}
        </button>
      </div>
    </>
  );
};

export default Impact;