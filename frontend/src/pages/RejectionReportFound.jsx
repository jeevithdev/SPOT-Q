import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

const RejectionReportFound = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '',
      shift: '',
      partNumber: '',
      heatNumber: '',
      batchNumber: '',
      castingNumber: '',
      defectType: '',
      defectLocation: '',
      defectSeverity: '',
      defectDescription: '',
      rejectionReason: '',
      inspectorName: '',
      supervisor: '',
      disposition: '',
      remarks: ''
    }
  ]);

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      date: '',
      shift: '',
      partNumber: '',
      heatNumber: '',
      batchNumber: '',
      castingNumber: '',
      defectType: '',
      defectLocation: '',
      defectSeverity: '',
      defectDescription: '',
      rejectionReason: '',
      inspectorName: '',
      supervisor: '',
      disposition: '',
      remarks: ''
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (id) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const updateEntry = (id, field, value) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSubmit = () => {
    const isValid = entries.every(entry => 
      entry.date && entry.shift && entry.partNumber && entry.heatNumber && 
      entry.batchNumber && entry.castingNumber && entry.defectType && 
      entry.defectLocation && entry.defectSeverity && entry.rejectionReason && 
      entry.inspectorName
    );

    if (isValid) {
      console.log('Submitted rejection report (foundry):', entries);
      alert('Rejection report submitted successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleReset = () => {
    setEntries([{
      id: 1,
      date: '',
      shift: '',
      partNumber: '',
      heatNumber: '',
      batchNumber: '',
      castingNumber: '',
      defectType: '',
      defectLocation: '',
      defectSeverity: '',
      defectDescription: '',
      rejectionReason: '',
      inspectorName: '',
      supervisor: '',
      disposition: '',
      remarks: ''
    }]);
  };

  return (
    <div className="page-container" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.25rem 0' }}>
                Rejection Report - Foundry
              </h2>
              <p style={{ color: '#64748b', margin: 0 }}>
                Record casting defects and rejection reasons for automotive components
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
              >
                <X size={18} />
                Reset
              </button>
              <button
                onClick={addNewEntry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                <Plus size={18} />
                Add Rejection
              </button>
            </div>
          </div>
        </div>

        {/* Form Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.map((entry, index) => (
            <div 
              key={entry.id} 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                padding: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  Rejection #{index + 1}
                </h3>
                {entries.length > 1 && (
                  <button
                    onClick={() => removeEntry(entry.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.75rem',
                      backgroundColor: 'transparent',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                {/* Date */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Date <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>

                {/* Shift */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Shift <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={entry.shift}
                    onChange={(e) => updateEntry(entry.id, 'shift', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <option value="">Select Shift</option>
                    <option value="Day">Day (6:00 AM - 2:00 PM)</option>
                    <option value="Evening">Evening (2:00 PM - 10:00 PM)</option>
                    <option value="Night">Night (10:00 PM - 6:00 AM)</option>
                  </select>
                </div>

                {/* Part Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Part Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.partNumber}
                    onChange={(e) => updateEntry(entry.id, 'partNumber', e.target.value)}
                    placeholder="e.g., BRAKE_DISC_001"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>

                {/* Heat Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Heat Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.heatNumber}
                    onChange={(e) => updateEntry(entry.id, 'heatNumber', e.target.value)}
                    placeholder="e.g., H2024001"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>

                {/* Batch Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Batch Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.batchNumber}
                    onChange={(e) => updateEntry(entry.id, 'batchNumber', e.target.value)}
                    placeholder="e.g., B240001"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>

                {/* Casting Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Casting Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.castingNumber}
                    onChange={(e) => updateEntry(entry.id, 'castingNumber', e.target.value)}
                    placeholder="e.g., CAST-2024-001"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>

                {/* Defect Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Defect Type <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={entry.defectType}
                    onChange={(e) => updateEntry(entry.id, 'defectType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <option value="">Select Defect Type</option>
                    <option value="Porosity">Porosity</option>
                    <option value="Shrinkage">Shrinkage</option>
                    <option value="Cold Shut">Cold Shut</option>
                    <option value="Misrun">Misrun</option>
                    <option value="Inclusion">Inclusion</option>
                    <option value="Sand Inclusion">Sand Inclusion</option>
                    <option value="Crack">Crack</option>
                    <option value="Surface Defect">Surface Defect</option>
                    <option value="Dimensional">Dimensional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Defect Location */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Defect Location <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={entry.defectLocation}
                    onChange={(e) => updateEntry(entry.id, 'defectLocation', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <option value="">Select Location</option>
                    <option value="Surface">Surface</option>
                    <option value="Sub-surface">Sub-surface</option>
                    <option value="Internal">Internal</option>
                    <option value="Edge">Edge</option>
                    <option value="Corner">Corner</option>
                    <option value="Center">Center</option>
                    <option value="Thick Section">Thick Section</option>
                    <option value="Thin Section">Thin Section</option>
                  </select>
                </div>

                {/* Defect Severity */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Defect Severity <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={entry.defectSeverity}
                    onChange={(e) => updateEntry(entry.id, 'defectSeverity', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <option value="">Select Severity</option>
                    <option value="Minor">Minor</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                    <option value="Catastrophic">Catastrophic</option>
                  </select>
                </div>

                {/* Rejection Reason */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Rejection Reason <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={entry.rejectionReason}
                    onChange={(e) => updateEntry(entry.id, 'rejectionReason', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <option value="">Select Reason</option>
                    <option value="Quality Standard">Quality Standard</option>
                    <option value="Customer Specification">Customer Specification</option>
                    <option value="Safety Requirement">Safety Requirement</option>
                    <option value="Functional Issue">Functional Issue</option>
                    <option value="Dimensional Out of Tolerance">Dimensional Out of Tolerance</option>
                    <option value="Surface Finish">Surface Finish</option>
                  </select>
                </div>

                {/* Disposition */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Disposition
                  </label>
                  <select
                    value={entry.disposition}
                    onChange={(e) => updateEntry(entry.id, 'disposition', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <option value="">Select Disposition</option>
                    <option value="Scrap">Scrap</option>
                    <option value="Rework">Rework</option>
                    <option value="Repair">Repair</option>
                    <option value="Use As Is">Use As Is</option>
                    <option value="Customer Concession">Customer Concession</option>
                  </select>
                </div>

                {/* Inspector Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Inspector Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.inspectorName}
                    onChange={(e) => updateEntry(entry.id, 'inspectorName', e.target.value)}
                    placeholder="e.g., John Smith"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>

                {/* Supervisor */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Supervisor
                  </label>
                  <input
                    type="text"
                    value={entry.supervisor}
                    onChange={(e) => updateEntry(entry.id, 'supervisor', e.target.value)}
                    placeholder="e.g., Mike Johnson"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>

                {/* Defect Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Defect Description
                  </label>
                  <textarea
                    value={entry.defectDescription}
                    onChange={(e) => updateEntry(entry.id, 'defectDescription', e.target.value)}
                    placeholder="Describe the defect in detail..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Remarks */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Remarks
                  </label>
                  <textarea
                    value={entry.remarks}
                    onChange={(e) => updateEntry(entry.id, 'remarks', e.target.value)}
                    placeholder="Enter any additional notes or recommendations..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
          >
            <Save size={20} />
            Save All Rejections
          </button>
        </div>

        {/* Info Card */}
        <div style={{ 
          marginTop: '1.5rem', 
          backgroundColor: '#eff6ff', 
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ 
              flexShrink: 0,
              width: '24px',
              height: '24px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              i
            </div>
            <div>
              <h4 style={{ fontWeight: '600', color: '#1e3a8a', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                Foundry Quality Guidelines
              </h4>
              <ul style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0, paddingLeft: '1.25rem', lineHeight: '1.5' }}>
                <li>Document all defects with detailed descriptions and measurements</li>
                <li>Follow standard rejection criteria and disposition procedures</li>
                <li>Investigate root causes to prevent future occurrences</li>
                <li>Maintain traceability for quality improvement initiatives</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectionReportFound;
