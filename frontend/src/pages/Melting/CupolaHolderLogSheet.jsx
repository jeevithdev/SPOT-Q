import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2, FileText, RotateCcw } from 'lucide-react';
import { DatePicker } from '../../Components/Buttons';
import CustomDatePicker from '../../Components/CustomDatePicker';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/CupolaHolderLogSheet.css';

const CupolaHolderLogSheet = () => {
  const [formData, setFormData] = useState({
    date: '',
    shift: '',
    holderNumber: '',
    heatNo: '',
    // Additions
    cpc: '',
    mFeSl: '',
    feMn: '',
    sic: '',
    pureMg: '',
    cu: '',
    feCr: '',
    // Tapping
    actualTime: '',
    tappingTime: '',
    tappingTemp: '',
    metalKg: '',
    // Pouring
    disaLine: '',
    indFur: '',
    bailNo: '',
    // Electrical
    tap: '',
    kw: '',
    remarks: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [primaryId, setPrimaryId] = useState(null);
  const [fetchingPrimary, setFetchingPrimary] = useState(false);
  const [primaryLocks, setPrimaryLocks] = useState({});

  // Check if there's data for the specific date+shift combination and lock shift dropdown
  const checkAndLockByDateAndShift = async (date, shift) => {
    if (!date || !shift) {
      // If date or shift is not set, unlock shift (unless primaryId exists)
      if (!primaryId) {
        setPrimaryLocks(prev => {
          const newLocks = { ...prev };
          delete newLocks.shift;
          return newLocks;
        });
      }
      return;
    }
    
    try {
      const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
      const response = await api.get(`/v1/cupola-holder-logs?startDate=${dateStr}&endDate=${dateStr}`);
      
      if (response.success && response.data && response.data.length > 0) {
        // Check if any entry has the same date AND shift
        const hasDataForShift = response.data.some(entry => {
          const entryShift = entry.shift;
          return entryShift === shift;
        });
        
        if (hasDataForShift) {
          // Data exists for this date+shift combination, lock shift dropdown
          setPrimaryLocks(prev => ({
            ...prev,
            shift: true
          }));
        } else {
          // No data for this date+shift combination, unlock shift (unless primaryId exists)
          if (!primaryId) {
            setPrimaryLocks(prev => {
              const newLocks = { ...prev };
              delete newLocks.shift;
              return newLocks;
            });
          }
        }
      } else {
        // No data for this date, unlock shift (unless primaryId exists)
        if (!primaryId) {
          setPrimaryLocks(prev => {
            const newLocks = { ...prev };
            delete newLocks.shift;
            return newLocks;
          });
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
        setPrimaryLocks(prev => {
          const newLocks = { ...prev };
          delete newLocks.shift;
          return newLocks;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.date, formData.shift]);

  // Fetch primary data when date, shift, or holderNumber changes
  useEffect(() => {
    if (formData.date && formData.shift && formData.holderNumber) {
      const dateStr = formData.date instanceof Date 
        ? formData.date.toISOString().split('T')[0] 
        : formData.date;
      fetchPrimaryData(dateStr, formData.shift, formData.holderNumber);
    } else if (!formData.date || !formData.shift || !formData.holderNumber) {
      // Clear primary ID and locks when primary fields are cleared
      setPrimaryId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.date, formData.shift, formData.holderNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent changes to locked fields (except date)
    if (name !== 'date' && isPrimaryFieldLocked(name)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Prevent changes if field is disabled
    if (e.target.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchPrimaryData = async (date, shift, holderNumber) => {
    if (!date || !shift || !holderNumber) return;
    
    setFetchingPrimary(true);
    try {
      // Format date for API (YYYY-MM-DD)
      const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
      const encodedShift = encodeURIComponent(shift);
      const encodedHolder = encodeURIComponent(holderNumber);
      const response = await api.get(`/v1/cupola-holder-logs/primary/${dateStr}/${encodedShift}/${encodedHolder}`);
      
      if (response.success && response.data) {
        // Populate form with fetched data
        setFormData(prev => ({
          ...prev,
          date: response.data.date ? new Date(response.data.date).toISOString().split('T')[0] : date,
          shift: response.data.shift || shift,
          holderNumber: response.data.holderNumber || holderNumber,
          heatNo: response.data.heatNo || prev.heatNo
        }));
        setPrimaryId(response.data._id);
        
        // Lock all primary fields except date when data exists (date should remain changeable)
        // Since entry exists, lock shift and holderNumber (they are required fields)
        const locks = {};
        locks.shift = true; // Always lock shift when data exists
        locks.holderNumber = true; // Always lock holderNumber when data exists
        // Lock heatNo if it has a value
        if (response.data.heatNo !== undefined && response.data.heatNo !== null && response.data.heatNo !== '') {
          locks.heatNo = true;
        }
        setPrimaryLocks(locks);
      } else {
        // No data found, reset
        setPrimaryId(null);
        setPrimaryLocks({});
      }
    } catch (error) {
      console.error('Error fetching primary data:', error);
      // If error, assume no data exists
      setPrimaryId(null);
      setPrimaryLocks({});
    } finally {
      setFetchingPrimary(false);
    }
  };

  // Helper function to check if a primary field is locked
  const isPrimaryFieldLocked = (field) => {
    return primaryLocks[field] === true;
  };


  const handlePrimarySubmit = async () => {
    // Validate required fields
    if (!formData.date || !formData.shift || !formData.holderNumber) {
      alert('Please fill in Date, Shift, and Holder Number');
      return;
    }

    // Save primary data to database
    setPrimaryLoading(true);
    try {
      const response = await api.post('/v1/cupola-holder-logs/primary', {
        primaryData: {
          date: formData.date,
          shift: formData.shift,
          holderNumber: formData.holderNumber,
          heatNo: formData.heatNo
        }
      });
      
      if (response.success) {
        setPrimaryId(response.data._id);
        // Update form data with response data to ensure consistency
        setFormData(prev => ({
          ...prev,
          date: response.data.date ? new Date(response.data.date).toISOString().split('T')[0] : prev.date,
          shift: response.data.shift || prev.shift,
          holderNumber: response.data.holderNumber || prev.holderNumber,
          heatNo: response.data.heatNo || prev.heatNo
        }));
        
        // After saving, check if data exists for this date+shift combination and lock shift accordingly
        // This will lock shift only if data exists for that specific date+shift combination
        await checkAndLockByDateAndShift(formData.date, formData.shift);
        
        // Lock all primary fields except date after saving
        // Shift lock is determined by checkAndLockByDateAndShift based on whether data exists for date+shift
        // Always lock holderNumber since it's a required field
        setPrimaryLocks(prev => {
          const locks = { ...prev };
          // Shift lock is already set by checkAndLockByDateAndShift if data exists
          locks.holderNumber = true; // Always lock holderNumber after saving
          // Lock heatNo if it has a value
          if (formData.heatNo !== undefined && formData.heatNo !== null && formData.heatNo !== '') {
            locks.heatNo = true;
          }
          return locks;
        });
        
        alert('Primary data saved successfully.');
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      console.error('Error saving primary data:', error);
      alert('Failed to save primary data. Please try again.');
    } finally {
      setPrimaryLoading(false);
    }
  };

  const handleSubmit = async () => {
    const required = ['date', 'shift', 'holderNumber'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      alert(`Please fill in the following required fields: ${missing.join(', ')}`);
      return;
    }

    // Ensure primary data exists (date is required)
    if (!formData.date) {
      alert('Please enter a date first.');
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Send all data (primary + other fields) combined to backend
      // Backend will find existing document by date+shift+holderNumber and update it, or create new one
      const data = await api.post('/v1/cupola-holder-logs', formData);
      if (data.success) {
        alert('Cupola holder log entry saved successfully!');
        handleReset();
      }
    } catch (error) {
      console.error('Error saving cupola holder log:', error);
      alert('Failed to save entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleReset = () => {
    setFormData({
      date: '', shift: '', holderNumber: '', heatNo: '', cpc: '', mFeSl: '', feMn: '', sic: '',
      pureMg: '', cu: '', feCr: '', actualTime: '', tappingTime: '',
      tappingTemp: '', metalKg: '', disaLine: '', indFur: '', bailNo: '',
      tap: '', kw: '', remarks: ''
    });
    setPrimaryId(null);
    setPrimaryLocks({});
  };

  return (
    <>

      <div className="cupola-holder-header">
        <div className="cupola-holder-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Cupola Holder Log Sheet - Entry Form
            <button 
              className="cupola-holder-view-report-btn"
              onClick={() => window.location.href = "/melting/cupola-holder-log-sheet/report"}
              title="View Reports"
            >
              <FileText size={16} />
              <span>View Reports</span>
            </button>
          </h2>
        </div>
      </div>

      <div className="cupola-holder-main-card">
        <h3 className="cupola-holder-main-card-title primary-data-title">Primary Data :</h3>

        <div className="cupola-holder-primary-row">
          {/* Primary Information */}
          <div className="cupola-holder-form-group">
            <label>Date *</label>
            <CustomDatePicker
              value={formData.date}
              onChange={(e) => handleChange({ target: { name: 'date', value: e.target.value } })}
              name="date"
              disabled={fetchingPrimary}
            />
            {fetchingPrimary && <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>Loading...</span>}
          </div>

          <div className="cupola-holder-form-group">
            <label>Shift *</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              onMouseDown={(e) => {
                if (isPrimaryFieldLocked('shift') || fetchingPrimary) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              onClick={(e) => {
                if (isPrimaryFieldLocked('shift') || fetchingPrimary) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              disabled={isPrimaryFieldLocked('shift') || fetchingPrimary}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: isPrimaryFieldLocked('shift') ? '#f1f5f9' : '#ffffff',
                color: isPrimaryFieldLocked('shift') ? '#64748b' : '#1e293b',
                cursor: isPrimaryFieldLocked('shift') ? 'not-allowed' : 'pointer',
                opacity: isPrimaryFieldLocked('shift') ? 0.8 : 1,
                pointerEvents: isPrimaryFieldLocked('shift') ? 'none' : 'auto'
              }}
            >
              <option value="">Select Shift</option>
              <option value="Shift 1">Shift 1</option>
              <option value="Shift 2">Shift 2</option>
              <option value="Shift 3">Shift 3</option>
            </select>
          </div>

          <div className="cupola-holder-form-group">
            <label>Holder Number *</label>
            <input
              type="text"
              name="holderNumber"
              value={formData.holderNumber}
              onChange={handleChange}
              placeholder="e.g: H001"
              disabled={isPrimaryFieldLocked('holderNumber') || fetchingPrimary}
              readOnly={isPrimaryFieldLocked('holderNumber')}
              style={{
                backgroundColor: isPrimaryFieldLocked('holderNumber') ? '#f1f5f9' : '#ffffff',
                cursor: isPrimaryFieldLocked('holderNumber') ? 'not-allowed' : 'text'
              }}
            />
          </div>

          {/* Primary Submit Button */}
          <div className="cupola-holder-primary-button-wrapper">
            <button
              className="cupola-holder-submit-btn"
              type="button"
              onClick={handlePrimarySubmit}
              disabled={primaryLoading || fetchingPrimary || (!formData.date || !formData.shift || !formData.holderNumber)}
            >
              {primaryLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Divider line */}
        <div style={{ marginTop: '1rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}></div>

        {/* Heat No */}
        <div className="cupola-holder-form-grid">
          <div className="cupola-holder-form-group" style={{ maxWidth: '300px' }}>
            <label>Heat No</label>
            <input
              type="text"
              name="heatNo"
              value={formData.heatNo}
              onChange={handleChange}
              placeholder="e.g: H2024-001"
              disabled={isPrimaryFieldLocked('heatNo')}
              readOnly={isPrimaryFieldLocked('heatNo')}
              style={{
                backgroundColor: isPrimaryFieldLocked('heatNo') ? '#f1f5f9' : '#ffffff',
                cursor: isPrimaryFieldLocked('heatNo') ? 'not-allowed' : 'text'
              }}
            />
          </div>
        </div>

        {/* Additions Section */}
        <div className="cupola-holder-sub-section">
          <h4 className="cupola-holder-sub-section-title">Additions</h4>
          <div className="cupola-holder-form-grid">
            <div className="cupola-holder-form-group">
              <label>CPC</label>
              <input
                type="number"
                name="cpc"
                value={formData.cpc}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Fe Sl</label>
              <input
                type="number"
                name="mFeSl"
                value={formData.mFeSl}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Fe Mn</label>
              <input
                type="number"
                name="feMn"
                value={formData.feMn}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Sic</label>
              <input
                type="number"
                name="sic"
                value={formData.sic}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Pure Mg</label>
              <input
                type="number"
                name="pureMg"
                value={formData.pureMg}
                onChange={handleChange}
                step="0.01"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Cu</label>
              <input
                type="number"
                name="cu"
                value={formData.cu}
                onChange={handleChange}
                step="0.01"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Fe Cr</label>
              <input
                type="number"
                name="feCr"
                value={formData.feCr}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Tapping Section */}
        <div className="cupola-holder-sub-section">
          <h4 className="cupola-holder-sub-section-title">Tapping</h4>
          <div className="cupola-holder-tapping-container">
            <div className="cupola-holder-form-group">
              <label>Actual Time</label>
              <input
                type="time"
                name="actualTime"
                value={formData.actualTime}
                onChange={handleChange}
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Tapping Time</label>
              <input
                type="time"
                name="tappingTime"
                value={formData.tappingTime}
                onChange={handleChange}
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Temp (°C)</label>
              <input
                type="number"
                name="tappingTemp"
                value={formData.tappingTemp}
                onChange={handleChange}
                placeholder="e.g: 1500"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Metal (KG)</label>
              <input
                type="number"
                name="metalKg"
                value={formData.metalKg}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g: 2000"
              />
            </div>
          </div>
        </div>

        {/* Pouring and Electrical Sections - Same Row */}
        <div className="cupola-holder-row-container">
          {/* Pouring Section */}
          <div className="cupola-holder-sub-section">
            <h4 className="cupola-holder-sub-section-title">Pouring Details</h4>
            <div className="cupola-holder-form-grid">
              <div className="cupola-holder-form-group">
                <label>DISA LINE</label>
                <input
                  type="text"
                  name="disaLine"
                  value={formData.disaLine}
                  onChange={handleChange}
                  placeholder="e.g: DISA-1"
                />
              </div>

              <div className="cupola-holder-form-group">
                <label>IND FUR</label>
                <input
                  type="text"
                  name="indFur"
                  value={formData.indFur}
                  onChange={handleChange}
                  placeholder="e.g: IND-FUR-1"
                />
              </div>

              <div className="cupola-holder-form-group">
                <label>BAIL NO</label>
                <input
                  type="text"
                  name="bailNo"
                  value={formData.bailNo}
                  onChange={handleChange}
                  placeholder="e.g: BAIL-001"
                />
              </div>
            </div>
          </div>

          {/* Electrical Section */}
          <div className="cupola-holder-sub-section">
            <h4 className="cupola-holder-sub-section-title">Electrical Readings</h4>
            <div className="cupola-holder-form-grid">
              <div className="cupola-holder-form-group">
                <label>TAP</label>
                <input
                  type="text"
                  name="tap"
                  value={formData.tap}
                  onChange={handleChange}
                  placeholder="Enter TAP value"
                />
              </div>

              <div className="cupola-holder-form-group">
                <label>KW</label>
                <input
                  type="number"
                  name="kw"
                  value={formData.kw}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="e.g: 2500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="cupola-holder-form-grid">
          <div className="cupola-holder-form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              placeholder="Enter any additional notes or observations..."
            />
          </div>
        </div>

        <div className="cupola-holder-submit-container">
          <button
            className="cupola-holder-reset-btn"
            type="button"
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            className="cupola-holder-submit-btn"
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading || !formData.date}
            title={!formData.date ? 'Please enter a date first' : 'Submit Entry'}
          >
            {submitLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
            {submitLoading ? 'Saving...' : 'Submit Entry'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CupolaHolderLogSheet;


