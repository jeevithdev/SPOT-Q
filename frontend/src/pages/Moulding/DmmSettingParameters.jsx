import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, FileText, RefreshCw } from "lucide-react";
import CustomDatePicker from '../../Components/CustomDatePicker';
import api from '../../utils/api';
import '../../styles/PageStyles/Moulding/DmmSettingParameters.css';

const DmmSettingParameters = () => {
  const navigate = useNavigate();
  const inputRefs = useRef({});

  const initialFormData = {
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
    sandShotPressureBar: "",
    correctionShotTime: "",
    squeezePressure: "",
    ppStrippingAcceleration: "",
    ppStrippingDistance: "",
    spStrippingAcceleration: "",
    spStrippingDistance: "",
    mouldThickness: "",
    closeUpForce: "",
    remarks: "",
  };

  const [shift1FormData, setShift1FormData] = useState({ ...initialFormData });
  const [shift2FormData, setShift2FormData] = useState({ ...initialFormData });
  const [shift3FormData, setShift3FormData] = useState({ ...initialFormData });
  const [basicInfo, setBasicInfo] = useState({
    machine: "",
    date: "",
    operatorNameShift1: "",
    operatedByShift1: "",
    operatorNameShift2: "",
    operatedByShift2: "",
    operatorNameShift3: "",
    operatedByShift3: "",
  });

  const fieldOrder = [
    'customer', 'itemDescription', 'time', 'ppThickness', 'ppHeight',
    'spThickness', 'spHeight', 'coreMaskThickness', 'coreMaskHeightOutside',
    'coreMaskHeightInside', 'sandShotPressureBar', 'correctionShotTime',
    'squeezePressure', 'ppStrippingAcceleration', 'ppStrippingDistance',
    'spStrippingAcceleration', 'spStrippingDistance', 'mouldThickness',
    'closeUpForce', 'remarks'
  ];

  const handleViewReport = () => {
    navigate('/moulding/dmm-setting-parameters/report');
  };

  const handleChange = (e, shift) => {
    const { name, value } = e.target;
    if (shift === 1) {
      setShift1FormData({ ...shift1FormData, [name]: value });
    } else if (shift === 2) {
      setShift2FormData({ ...shift2FormData, [name]: value });
    } else if (shift === 3) {
      setShift3FormData({ ...shift3FormData, [name]: value });
    }
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo({ ...basicInfo, [name]: value });
  };

  const handleKeyDown = (e, field, shift) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const idx = fieldOrder.indexOf(field);
      if (idx < fieldOrder.length - 1) {
        const nextField = fieldOrder[idx + 1];
        inputRefs.current[`shift${shift}_${nextField}`]?.focus();
      } else {
        handleSubmit(shift);
      }
    }
  };

  const handleSubmit = async (shift) => {
    try {
      const formData = shift === 1 ? shift1FormData : shift === 2 ? shift2FormData : shift3FormData;
      
      // Structure data to match backend model
      const payload = {
        machine: parseInt(basicInfo.machine) || 1,
        date: basicInfo.date || new Date(),
        shifts: {
          shift1: {
            operatorName: basicInfo.operatorNameShift1 || '',
            checkedBy: basicInfo.operatedByShift1 || ''
          },
          shift2: {
            operatorName: basicInfo.operatorNameShift2 || '',
            checkedBy: basicInfo.operatedByShift2 || ''
          },
          shift3: {
            operatorName: basicInfo.operatorNameShift3 || '',
            checkedBy: basicInfo.operatedByShift3 || ''
          }
        },
        parameters: {
          [shift === 1 ? 'shift1' : shift === 2 ? 'shift2' : 'shift3']: {
            customer: formData.customer,
            itemDescription: formData.itemDescription,
            time: formData.time,
            ppThickness: formData.ppThickness,
            ppheight: formData.ppHeight,
            spThickness: formData.spThickness,
            spHeight: formData.spHeight,
            CoreMaskThickness: formData.coreMaskThickness,
            CoreMaskHeight: formData.coreMaskHeightOutside,
            sandShotPressurebar: formData.sandShotPressureBar,
            correctionShotTime: formData.correctionShotTime,
            squeezePressure: formData.squeezePressure,
            ppStrippingAcceleration: formData.ppStrippingAcceleration,
            ppStrippingDistance: formData.ppStrippingDistance,
            spStrippingAcceleration: formData.spStrippingAcceleration,
            spStrippingDistance: formData.spStrippingDistance,
            mouldThickness: formData.mouldThickness,
            closeUpForceMouldCloseUpPressure: formData.closeUpForce,
            remarks: formData.remarks
          }
        }
      };

      const data = await api.post('/v1/dmm-settings', payload);
      
      if (data.success) {
        alert(`Shift ${shift === 1 ? 'I' : shift === 2 ? 'II' : 'III'} entry submitted successfully!`);
        handleReset(shift);
      }
    } catch (error) {
      console.error('Error submitting DMM setting:', error);
      alert('Failed to submit entry: ' + error.message);
    }
  };

  const handleReset = (shift) => {
    if (shift === 1) {
      setShift1FormData({ ...initialFormData });
      inputRefs.current[`shift1_customer`]?.focus();
    } else if (shift === 2) {
      setShift2FormData({ ...initialFormData });
      inputRefs.current[`shift2_customer`]?.focus();
    } else if (shift === 3) {
      setShift3FormData({ ...initialFormData });
      inputRefs.current[`shift3_customer`]?.focus();
    }
  };

  const renderShiftForm = (shift, formData, setFormData) => {
    const shiftLabel = shift === 1 ? 'I' : shift === 2 ? 'II' : 'III';
    return (
      <div className="dmm-section" key={`shift-${shift}`}>
        <h3 className="dmm-section-title">Shift {shiftLabel}</h3>
        <div className="dmm-form-grid">
          <div className="dmm-form-group">
            <label>Customer</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_customer`] = el}
              type="text"
              name="customer"
              value={formData.customer}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'customer', shift)}
              placeholder="Enter customer"
            />
          </div>

          <div className="dmm-form-group">
            <label>Item Description</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_itemDescription`] = el}
              type="text"
              name="itemDescription"
              value={formData.itemDescription}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'itemDescription', shift)}
              placeholder="Enter item description"
            />
          </div>

          <div className="dmm-form-group">
            <label>Time</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_time`] = el}
              type="text"
              name="time"
              value={formData.time}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'time', shift)}
              placeholder="Enter time"
            />
          </div>

          <div className="dmm-form-group">
            <label>PP Thickness (mm)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_ppThickness`] = el}
              type="number"
              name="ppThickness"
              value={formData.ppThickness}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'ppThickness', shift)}
              step="any"
              placeholder="Enter PP thickness"
            />
          </div>

          <div className="dmm-form-group">
            <label>PP Height (mm)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_ppHeight`] = el}
              type="number"
              name="ppHeight"
              value={formData.ppHeight}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'ppHeight', shift)}
              step="any"
              placeholder="Enter PP height"
            />
          </div>

          <div className="dmm-form-group">
            <label>SP Thickness (mm)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_spThickness`] = el}
              type="number"
              name="spThickness"
              value={formData.spThickness}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'spThickness', shift)}
              step="any"
              placeholder="Enter SP thickness"
            />
          </div>

          <div className="dmm-form-group">
            <label>SP Height (mm)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_spHeight`] = el}
              type="number"
              name="spHeight"
              value={formData.spHeight}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'spHeight', shift)}
              step="any"
              placeholder="Enter SP height"
            />
          </div>

          <div className="dmm-form-group">
            <label>Core Mask Thickness (mm)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_coreMaskThickness`] = el}
              type="number"
              name="coreMaskThickness"
              value={formData.coreMaskThickness}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'coreMaskThickness', shift)}
              step="any"
              placeholder="Enter core mask thickness"
            />
          </div>

          <div className="dmm-form-group">
            <label>Core Mask Height (Outside Mask) (mm)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_coreMaskHeightOutside`] = el}
              type="number"
              name="coreMaskHeightOutside"
              value={formData.coreMaskHeightOutside}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'coreMaskHeightOutside', shift)}
              step="any"
              placeholder="Enter outside mask height"
            />
          </div>

          <div className="dmm-form-group">
            <label>Core Mask Height (Inside Mask) (mm)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_coreMaskHeightInside`] = el}
              type="number"
              name="coreMaskHeightInside"
              value={formData.coreMaskHeightInside}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'coreMaskHeightInside', shift)}
              step="any"
              placeholder="Enter inside mask height"
            />
          </div>

          <div className="dmm-form-group">
            <label>Sand Shot Pressure Bar</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_sandShotPressureBar`] = el}
              type="number"
              name="sandShotPressureBar"
              value={formData.sandShotPressureBar}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'sandShotPressureBar', shift)}
              step="any"
              placeholder="Enter sand shot pressure"
            />
          </div>

          <div className="dmm-form-group">
            <label>Correction of Shot Time / Shot Time (Sec)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_correctionShotTime`] = el}
              type="text"
              name="correctionShotTime"
              value={formData.correctionShotTime}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'correctionShotTime', shift)}
              placeholder="Enter shot time"
            />
          </div>

          <div className="dmm-form-group">
            <label>Squeeze Pressure (kg/cm square/Bar)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_squeezePressure`] = el}
              type="number"
              name="squeezePressure"
              value={formData.squeezePressure}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'squeezePressure', shift)}
              step="any"
              placeholder="Enter squeeze pressure"
            />
          </div>

          <div className="dmm-form-group">
            <label>PP Stripping Acceleration</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_ppStrippingAcceleration`] = el}
              type="number"
              name="ppStrippingAcceleration"
              value={formData.ppStrippingAcceleration}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'ppStrippingAcceleration', shift)}
              step="any"
              placeholder="Enter PP stripping acceleration"
            />
          </div>

          <div className="dmm-form-group">
            <label>PP Stripping Distance</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_ppStrippingDistance`] = el}
              type="number"
              name="ppStrippingDistance"
              value={formData.ppStrippingDistance}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'ppStrippingDistance', shift)}
              step="any"
              placeholder="Enter PP stripping distance"
            />
          </div>

          <div className="dmm-form-group">
            <label>SP Stripping Acceleration</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_spStrippingAcceleration`] = el}
              type="number"
              name="spStrippingAcceleration"
              value={formData.spStrippingAcceleration}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'spStrippingAcceleration', shift)}
              step="any"
              placeholder="Enter SP stripping acceleration"
            />
          </div>

          <div className="dmm-form-group">
            <label>SP Stripping Distance</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_spStrippingDistance`] = el}
              type="number"
              name="spStrippingDistance"
              value={formData.spStrippingDistance}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'spStrippingDistance', shift)}
              step="any"
              placeholder="Enter SP stripping distance"
            />
          </div>

          <div className="dmm-form-group">
            <label>Mould Thickness (+ or - 10mm)</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_mouldThickness`] = el}
              type="number"
              name="mouldThickness"
              value={formData.mouldThickness}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'mouldThickness', shift)}
              step="any"
              placeholder="Enter mould thickness"
            />
          </div>

          <div className="dmm-form-group">
            <label>Close Up Force (%)/ Mould Close Up Pressure</label>
            <input
              ref={el => inputRefs.current[`shift${shift}_closeUpForce`] = el}
              type="text"
              name="closeUpForce"
              value={formData.closeUpForce}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => handleKeyDown(e, 'closeUpForce', shift)}
              placeholder="Enter close up force"
            />
          </div>

          <div className="dmm-form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Remarks</label>
            <textarea
              ref={el => inputRefs.current[`shift${shift}_remarks`] = el}
              name="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange(e, shift)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(shift); } }}
              rows="4"
              placeholder="Enter any additional notes..."
            />
          </div>
        </div>

        <div className="dmm-submit-container">
          <button onClick={() => handleSubmit(shift)} className="dmm-submit-btn" type="button">
            <Save size={18} />
            Submit Entry
          </button>
        </div>

        <div className="dmm-reset-container">
          <button onClick={() => handleReset(shift)} className="dmm-reset-btn">
            <RefreshCw size={18} />
            Reset
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <div className="dmm-header">
        <div className="dmm-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            DMM Setting Parameters Check Sheet - Entry Form
          </h2>
        </div>
        <div className="dmm-header-buttons">
          <button className="dmm-view-report-btn" onClick={handleViewReport} type="button">
            <div className="dmm-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="dmm-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="dmm-section">
        <h3 className="dmm-section-title">Basic Information</h3>
        
        {/* Machine and Date Inputs */}
        <div className="dmm-basic-inputs">
          <div className="dmm-basic-input-group">
            <label>Machine</label>
            <input 
              type="number" 
              className="dmm-basic-input" 
              name="machine"
              value={basicInfo.machine}
              onChange={handleBasicInfoChange}
              placeholder="Enter machine number" 
            />
          </div>
          <div className="dmm-basic-input-group">
            <label>Date</label>
            <CustomDatePicker
              name="date"
              value={basicInfo.date}
              onChange={handleBasicInfoChange}
            />
          </div>
        </div>

        <div className="dmm-table-container">
          <div className="dmm-table-wrapper">
            <table className="dmm-table">
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
                  <td>OPERATOR NAME</td>
                  <td>
                    <input 
                      type="text" 
                      className="dmm-table-input" 
                      name="operatorNameShift1"
                      value={basicInfo.operatorNameShift1}
                      onChange={handleBasicInfoChange}
                      placeholder="Enter operator name" 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="dmm-table-input" 
                      name="operatorNameShift2"
                      value={basicInfo.operatorNameShift2}
                      onChange={handleBasicInfoChange}
                      placeholder="Enter operator name" 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="dmm-table-input" 
                      name="operatorNameShift3"
                      value={basicInfo.operatorNameShift3}
                      onChange={handleBasicInfoChange}
                      placeholder="Enter operator name" 
                    />
                  </td>
                </tr>
                <tr>
                  <td>OPERATED BY</td>
                  <td>
                    <input 
                      type="text" 
                      className="dmm-table-input" 
                      name="operatedByShift1"
                      value={basicInfo.operatedByShift1}
                      onChange={handleBasicInfoChange}
                      placeholder="Enter operated by" 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="dmm-table-input" 
                      name="operatedByShift2"
                      value={basicInfo.operatedByShift2}
                      onChange={handleBasicInfoChange}
                      placeholder="Enter operated by" 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="dmm-table-input" 
                      name="operatedByShift3"
                      value={basicInfo.operatedByShift3}
                      onChange={handleBasicInfoChange}
                      placeholder="Enter operated by" 
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shift Forms */}
      {renderShiftForm(1, shift1FormData, setShift1FormData)}
      {renderShiftForm(2, shift2FormData, setShift2FormData)}
      {renderShiftForm(3, shift3FormData, setShift3FormData)}
    </>
  );
};

export default DmmSettingParameters;
