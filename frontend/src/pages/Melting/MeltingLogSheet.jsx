import React, { useState, useRef } from 'react';
import { Save, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/MeltingLogSheet.css';

const MeltingLogSheet = () => {
  const navigate = useNavigate();
  const inputRefs = useRef({});
  
  const initialFormData = {
    // Basic Information
    basicDate: '',
    shift: '',
    furnaceNo: '',
    panel: '',
    cumulativeLiquidMetal: '',
    finalKwHr: '',
    initialKwHr: '',
    totalUnits: '',
    cumulativeUnits: '',
    // Table 1
    date: '',
    heatNo: '',
    grade: '',
    chargingTime: '',
    ifBath: '',
    liquidMetalPressPour: '',
    liquidMetalHolder: '',
    sgMsSteel: '',
    greyMsSteel: '',
    ralumsSg: '',
    gl: '',
    pigIron: '',
    borings: '',
    finalBath: '',
    charCoal: '',
    cpcFur: '',
    cpcLc: '',
    siliconCarbideFur: '',
    siliconCarbideLc: '',
    ferroSiliconFur: '',
    ferroSiliconLc: '',
    ferroManganeseFur: '',
    ferroManganeseLc: '',
    cu: '',
    cr: '',
    pureMg: '',
    ironPyrite: '',
    labCoinTime: '',
    labCoinTemp: '',
    deslagingFrom: '',
    deslagingTo: '',
    metalReadyTime: '',
    waitingFrom: '',
    waitingTo: '',
    waitingReason: '',
    tappingTime: '',
    tappingTemp: '',
    directFurnace: '',
    holderToFurnace: '',
    furnaceToHolder: '',
    disaNo: '',
    item: '',
    f1Kw: '',
    f1V: '',
    f1A: '',
    f1Gld: '',
    f1Hz: '',
    f1BelowKw: '',
    f1BelowA: '',
    f1BelowV: '',
    f2Kw: '',
    f2V: '',
    f2A: '',
    f2Gld: '',
    f2Hz: '',
    f2BelowKw: '',
    f2BelowA: '',
    f2BelowV: '',
    f3Kw: '',
    f3V: '',
    f3A: '',
    f3Gld: '',
    f3Hz: '',
    f3BelowKw: '',
    f3BelowA: '',
    f3BelowV: '',
    f4Kw: '',
    f4V: '',
    f4A: '',
    f4Gld: '',
    f4Hz: '',
    f4BelowHz: '',
    f4BelowGld: '',
    f4BelowGld1: '',
    remarks: ''
  };

  // Form field configurations for each section
  const formSections = [
    {
      title: 'Table 1',
      fields: [
        { name: 'heatNo', label: 'Heat No', type: 'text' },
        { name: 'grade', label: 'Grade', type: 'text' }
      ],
      subsections: [
        {
          title: 'Charging ( in Kgs )',
          fields: [
            { name: 'chargingTime', label: 'Time', type: 'time' },
            { name: 'ifBath', label: 'If Bath', type: 'number', step: '0.1' }
          ],
          subgroups: [
            {
              title: 'Liquid Metal',
              fields: [
                { name: 'liquidMetalPressPour', label: 'Press Pour (kgs)', type: 'number', step: '0.1' },
                { name: 'liquidMetalHolder', label: 'Holder (kgs)', type: 'number', step: '0.1' }
              ]
            }
          ],
          additionalFields: [
            { name: 'sgMsSteel', label: 'SG - MS Steel (400 - 2500)', type: 'number', step: '0.1' },
            { name: 'greyMsSteel', label: 'Grey MS Steel (400 to 2500)', type: 'number', step: '0.1' },
            { name: 'ralumsSg', label: 'Ralums SG (500 to 2500)', type: 'number', step: '0.1' },
            { name: 'gl', label: 'GI (900 to 2250)', type: 'number', step: '0.1' },
            { name: 'pigIron', label: 'Pig Iron (0 to 350)', type: 'number', step: '0.1' },
            { name: 'borings', label: 'Borings (0 to 1600)', type: 'number', step: '0.1' },
            { name: 'finalBath', label: 'Final Bath', type: 'number', step: '0.1' }
          ]
        }
      ]
    },
    {
      title: 'Table 2',
      fields: [
        { name: 'charCoal', label: 'Char Coal (kgs)', type: 'number', step: '0.1' }
      ],
      subsections: [
        {
          title: '',
          subgroups: [
            {
              title: 'CPC',
              fields: [
                { name: 'cpcFur', label: 'Fur (kgs)', type: 'number', step: '0.1' },
                { name: 'cpcLc', label: 'L/C (kgs)', type: 'number', step: '0.1' }
              ]
            },
            {
              title: 'Silicon Carbide',
              fields: [
                { name: 'siliconCarbideFur', label: 'Fur (kgs)', type: 'number', step: '0.1' },
                { name: 'siliconCarbideLc', label: 'L/C (kgs)', type: 'number', step: '0.1' }
              ]
            },
            {
              title: 'Ferro Silicon',
              fields: [
                { name: 'ferroSiliconFur', label: 'Fur (kgs)', type: 'number', step: '0.1' },
                { name: 'ferroSiliconLc', label: 'L/C (kgs)', type: 'number', step: '0.1' }
              ]
            },
            {
              title: 'Ferro Manganese',
              fields: [
                { name: 'ferroManganeseFur', label: 'Fur (kgs)', type: 'number', step: '0.1' },
                { name: 'ferroManganeseLc', label: 'L/C (kgs)', type: 'number', step: '0.1' }
              ]
            }
          ],
          additionalFields: [
            { name: 'cu', label: 'CU (kgs)', type: 'number', step: '0.01' },
            { name: 'cr', label: 'CR (kgs)', type: 'number', step: '0.01' },
            { name: 'pureMg', label: 'Pure MG (kgs)', type: 'number', step: '0.01' },
            { name: 'ironPyrite', label: 'Iron Pyrite (kgs)', type: 'number', step: '0.1' }
          ]
        }
      ]
    },
    {
      title: 'Table 3',
      fields: [],
      subsections: [
        {
          title: 'Lab Coin',
          fields: [
            { name: 'labCoinTime', label: 'Time', type: 'time' },
            { name: 'labCoinTemp', label: 'Temp (°C)', type: 'number', step: '0.1' }
          ]
        },
        {
          title: 'Deslaging Time',
          fields: [
            { name: 'deslagingFrom', label: 'From', type: 'time' },
            { name: 'deslagingTo', label: 'To', type: 'time' }
          ]
        },
        {
          title: '',
          fields: [
            { name: 'metalReadyTime', label: 'Metal Ready Time', type: 'time' }
          ]
        },
        {
          title: 'Waiting For Tapping',
          fields: [
            { name: 'waitingFrom', label: 'From', type: 'time' },
            { name: 'waitingTo', label: 'To', type: 'time' }
          ]
        },
        {
          title: '',
          fields: [
            { name: 'waitingReason', label: 'Reason', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Metal Tapping',
      fields: [
        { name: 'tappingTime', label: 'Time', type: 'time' },
        { name: 'tappingTemp', label: 'Temp C', type: 'number', step: '0.1' },
        { name: 'directFurnace', label: 'Direct Furnace (kgs)', type: 'number', step: '0.1' },
        { name: 'holderToFurnace', label: 'Holder to Furnace (kgs)', type: 'number', step: '0.1' },
        { name: 'furnaceToHolder', label: 'Furnace to Holder (kgs)', type: 'number', step: '0.1' },
        { name: 'disaNo', label: 'Disa No', type: 'text' },
        { name: 'item', label: 'Item', type: 'text' }
      ]
    },
    {
      title: 'Electrical Readings',
      fields: [],
      subsections: [
        {
          title: 'Furnace 1, 2, 3',
          fields: [
            { name: 'f1Kw', label: 'Kw', type: 'number', step: '0.1' },
            { name: 'f1A', label: 'A', type: 'number', step: '0.1' },
            { name: 'f1V', label: 'V', type: 'number', step: '0.1' }
          ]
        },
        {
          title: 'Furnace 4',
          fields: [
            { name: 'f4Hz', label: 'Hz', type: 'number', step: '0.1' },
            { name: 'f4Gld', label: 'GLD', type: 'number', step: '0.1' },
            { name: 'f4Kw', label: 'Kw/Hr', type: 'number', step: '0.1' }
          ]
        }
      ]
    }
  ];

  // Flatten all fields for keyboard navigation
  const allFields = formSections.flatMap(section => {
    const mainFields = section.fields ? section.fields.map(f => f.name) : [];
    const subsectionFields = section.subsections ? section.subsections.flatMap(sub => {
      const subFields = sub.fields ? sub.fields.map(f => f.name) : [];
      const subgroupFields = sub.subgroups ? sub.subgroups.flatMap(sg => sg.fields ? sg.fields.map(f => f.name) : []) : [];
      const additionalFields = sub.additionalFields ? sub.additionalFields.map(f => f.name) : [];
      return [...subFields, ...subgroupFields, ...additionalFields];
    }) : [];
    const remainingFields = section.remainingFields ? section.remainingFields.map(f => f.name) : [];
    return [...mainFields, ...subsectionFields, ...remainingFields];
  });

  const [formData, setFormData] = useState({ ...initialFormData });
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const idx = allFields.indexOf(field);
      if (idx < allFields.length - 1) {
        inputRefs.current[allFields[idx + 1]]?.focus();
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    const required = ['date', 'heatNo', 'grade', 'chargingTime'];
    const missing = [];
    
    required.forEach(field => {
      if (!formData[field]) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      alert(`Please fill in the following required fields: ${missing.join(', ')}`);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/melting-logs', formData);
      
      if (data.success) {
        alert('Melting log entry created successfully!');
        handleReset();
      }
    } catch (error) {
      console.error('Error creating melting log:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...initialFormData });
    inputRefs.current.basicDate?.focus();
  };

  const renderField = (field) => {
    return (
      <div className="melting-log-form-group" key={field.name} style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
        <label>{field.label}</label>
        {field.type === 'textarea' ? (
          <textarea
            ref={el => inputRefs.current[field.name] = el}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            rows="4"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        ) : (
          <input
            ref={el => inputRefs.current[field.name] = el}
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, field.name)}
            step={field.step || 'any'}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )}
      </div>
    );
  };

  const renderFormSection = (section) => {
    const isTableCard = section.title === 'Table 1' || section.title === 'Table 2' || section.title === 'Table 3';
    
    return (
      <div className={`melting-log-section ${isTableCard ? 'melting-log-table-card' : ''}`} key={section.title}>
        <h3 className="melting-log-section-title">{section.title}</h3>
        <div className="melting-log-form-grid">
          {/* Render main fields with special handling for Table 1 */}
          {section.title === 'Table 1' && section.subsections && section.subsections[0] ? (
            <>
              {/* Heat No */}
              {section.fields[0] && renderField(section.fields[0])}
              {/* Grade - right of Heat No */}
              {section.fields[1] && renderField(section.fields[1])}
              {/* Charging ( in Kgs ) Card - below Heat No and Grade */}
              {section.subsections[0].title && (
                <div className="melting-log-charging-card" style={{ gridColumn: '1 / -1' }}>
                  <h4 className="melting-log-charging-card-title">{section.subsections[0].title}</h4>
                  <div className="melting-log-charging-card-content-horizontal">
                    {/* Time */}
                    {section.subsections[0].fields && section.subsections[0].fields[0] && renderField(section.subsections[0].fields[0])}
                    {/* If Bath - right of Time */}
                    {section.subsections[0].fields && section.subsections[0].fields[1] && renderField(section.subsections[0].fields[1])}
                    
                    {/* Liquid Metal card inside Charging card */}
                    {section.subsections[0].subgroups && section.subsections[0].subgroups.map((subgroup) => (
                      subgroup.title === 'Liquid Metal' && (
                        <div key={subgroup.title} className="melting-log-liquid-metal-card-nested">
                          <h5 className="melting-log-liquid-metal-card-title">{subgroup.title}</h5>
                          <div className="melting-log-liquid-metal-card-content-horizontal">
                            {subgroup.fields.map((field) => renderField(field))}
                          </div>
                        </div>
                      )
                    ))}
                    
                    {/* Remaining additional fields */}
                    {section.subsections[0].additionalFields && section.subsections[0].additionalFields.map((field) => renderField(field))}
                  </div>
                </div>
              )}
            </>
          ) : (
            section.fields.map((field) => renderField(field))
          )}
          
          {/* Render subsections if they exist */}
          {section.subsections && section.subsections.map((subsection, subIndex) => (
            <React.Fragment key={subIndex}>
              {/* Skip Table 1's first subsection as it's all rendered in the Charging card */}
              {section.title === 'Table 1' && subIndex === 0 ? null : (
                <>
                  {/* Add separator line before subsection if it has no title (standalone field) and it's not the first subsection */}
                  {!subsection.title && subIndex > 0 && (
                    <div className="melting-log-separator-line" style={{ gridColumn: '1 / -1' }}></div>
                  )}
                  
                  {subsection.title && (
                    <div className="melting-log-subsection-header" style={{ gridColumn: '1 / -1' }}>
                      <h4>{subsection.title}</h4>
                    </div>
                  )}
                  {subsection.fields && subsection.fields.map((field) => renderField(field))}
                  
                  {/* Render subgroups if they exist */}
                  {subsection.subgroups && subsection.subgroups.map((subgroup, sgIndex) => (
                    <React.Fragment key={sgIndex}>
                      <div className="melting-log-subgroup-header" style={{ gridColumn: '1 / -1' }}>
                        <h5>{subgroup.title}</h5>
                      </div>
                      {subgroup.fields.map((field) => renderField(field))}
                      
                      {/* Add separator line after each subgroup except the last one */}
                      {sgIndex < subsection.subgroups.length - 1 && (
                        <div className="melting-log-separator-line" style={{ gridColumn: '1 / -1' }}></div>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {/* Separator line before additional fields */}
                  {subsection.additionalFields && subsection.additionalFields.length > 0 && (
                    <div className="melting-log-separator-line" style={{ gridColumn: '1 / -1' }}></div>
                  )}
                  
                  {/* Render additional fields if they exist */}
                  {subsection.additionalFields && subsection.additionalFields.map((field) => renderField(field))}
                </>
              )}
              
              {/* Add separator line after subsection if it has no title (standalone field) and it's not the last subsection */}
              {!subsection.title && subIndex < section.subsections.length - 1 && (
                <div className="melting-log-separator-line" style={{ gridColumn: '1 / -1' }}></div>
              )}
            </React.Fragment>
          ))}
          
          {/* Render remaining fields if they exist */}
          {section.remainingFields && section.remainingFields.map((field) => renderField(field))}
        </div>
      </div>
    );
  };

  return (
    <>

      <div className="melting-log-header">
        <div className="melting-log-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Melting Log Sheet - Entry Form
          </h2>
        </div>
        <div className="melting-log-header-buttons">
          <button className="melting-log-view-report-btn" onClick={() => navigate('/melting/melting-log-sheet/report')} type="button">
            <div className="melting-log-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="melting-log-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

      {/* Basic Information Table */}
      <div className="melting-log-section">
        <h3 className="melting-log-section-title">Basic Information</h3>
        <div className="melting-log-basic-table-wrapper">
          <table className="melting-log-basic-table">
            <tbody>
              <tr>
                <td>Date</td>
                <td>
                  <input
                    ref={el => inputRefs.current.basicDate = el}
                    type="date"
                    name="basicDate"
                    value={formData.basicDate}
                    onChange={handleChange}
                    className="melting-log-table-input"
                  />
                </td>
                <td>Shift</td>
                <td>
                  <input
                    ref={el => inputRefs.current.shift = el}
                    type="text"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="melting-log-table-input"
                    placeholder="Enter shift"
                  />
                </td>
                <td>Furnace No</td>
                <td>
                  <input
                    ref={el => inputRefs.current.furnaceNo = el}
                    type="text"
                    name="furnaceNo"
                    value={formData.furnaceNo}
                    onChange={handleChange}
                    className="melting-log-table-input"
                    placeholder="Enter furnace number"
                  />
                </td>
              </tr>
              <tr>
                <td>Panel</td>
                <td>
                  <input
                    ref={el => inputRefs.current.panel = el}
                    type="text"
                    name="panel"
                    value={formData.panel}
                    onChange={handleChange}
                    className="melting-log-table-input"
                    placeholder="Enter panel"
                  />
                </td>
                <td>Cumulative Liquid Metal</td>
                <td>
                  <input
                    ref={el => inputRefs.current.cumulativeLiquidMetal = el}
                    type="number"
                    name="cumulativeLiquidMetal"
                    value={formData.cumulativeLiquidMetal}
                    onChange={handleChange}
                    className="melting-log-table-input"
                    step="0.1"
                    placeholder="0"
                  />
                </td>
                <td>Final KW Hr</td>
                <td>
                  <input
                    ref={el => inputRefs.current.finalKwHr = el}
                    type="number"
                    name="finalKwHr"
                    value={formData.finalKwHr}
                    onChange={handleChange}
                    className="melting-log-table-input"
                    step="0.1"
                    placeholder="0"
                  />
                </td>
              </tr>
              <tr>
                <td>Initial Kw Hr</td>
                <td>
                  <input
                    ref={el => inputRefs.current.initialKwHr = el}
                    type="number"
                    name="initialKwHr"
                    value={formData.initialKwHr}
                    onChange={handleChange}
                    className="melting-log-table-input"
                    step="0.1"
                    placeholder="0"
                  />
                </td>
                <td>Total Units</td>
                <td>
                  <input
                    ref={el => inputRefs.current.totalUnits = el}
                    type="number"
                    name="totalUnits"
                    value={formData.totalUnits}
                    onChange={handleChange}
                    className="melting-log-table-input"
                    step="0.1"
                    placeholder="0"
                  />
                </td>
                <td>Cumulative Units</td>
                <td>
                  <input
                    ref={el => inputRefs.current.cumulativeUnits = el}
                    type="number"
                    name="cumulativeUnits"
                    value={formData.cumulativeUnits}
                onChange={handleChange}
                    className="melting-log-table-input"
                    step="0.1"
                    placeholder="0"
              />
                </td>
              </tr>
            </tbody>
          </table>
            </div>
          </div>

      {formSections.map(section => renderFormSection(section))}

          <div className="melting-log-submit-container">
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="melting-log-submit-btn"
              type="button"
            >
              {submitLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={18} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </button>
          </div>

      <div className="melting-log-reset-container">
        <button onClick={handleReset} className="melting-log-reset-btn">
          <RefreshCw size={18} />
          Reset
        </button>
      </div>
    </>
  );
};

export default MeltingLogSheet;
