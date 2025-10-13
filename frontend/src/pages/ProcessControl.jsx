import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

const ProcessControl = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '',
      shift: '',
      controlPoint: '',
      parameterName: '',
      targetValue: '',
      actualValue: '',
      upperLimit: '',
      lowerLimit: '',
      status: '',
      deviation: '',
      correctiveAction: '',
      operatorName: '',
      supervisor: '',
      remarks: ''
    }
  ]);

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      date: '',
      shift: '',
      controlPoint: '',
      parameterName: '',
      targetValue: '',
      actualValue: '',
      upperLimit: '',
      lowerLimit: '',
      status: '',
      deviation: '',
      correctiveAction: '',
      operatorName: '',
      supervisor: '',
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
      entry.date && entry.shift && entry.controlPoint && entry.parameterName && 
      entry.targetValue && entry.actualValue && entry.upperLimit && 
      entry.lowerLimit && entry.status && entry.operatorName
    );

    if (isValid) {
      console.log('Submitted process control data:', entries);
      alert('Process control data submitted successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleReset = () => {
    setEntries([{
      id: 1,
      date: '',
      shift: '',
      controlPoint: '',
      parameterName: '',
      targetValue: '',
      actualValue: '',
      upperLimit: '',
      lowerLimit: '',
      status: '',
      deviation: '',
      correctiveAction: '',
      operatorName: '',
      supervisor: '',
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
                Process Control Monitoring
              </h2>
              <p style={{ color: '#64748b', margin: 0 }}>
                Monitor and control critical process parameters for automotive manufacturing
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
                Add Control Point
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
                  Control Point #{index + 1}
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
                    Date                  </label>
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
                    Shift                  </label>
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

                {/* Control Point */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Control Point                  </label>
                  <select
                    value={entry.controlPoint}
                    onChange={(e) => updateEntry(entry.id, 'controlPoint', e.target.value)}
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
                    <option value="">Select Control Point</option>
                    <option value="Melting Furnace">Melting Furnace</option>
                    <option value="Pouring Station">Pouring Station</option>
                    <option value="Molding Machine">Molding Machine</option>
                    <option value="Cooling Zone">Cooling Zone</option>
                    <option value="Heat Treatment">Heat Treatment</option>
                    <option value="Machining Center">Machining Center</option>
                  </select>
                </div>

                {/* Parameter Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Parameter Name                  </label>
                  <input
                    type="text"
                    value={entry.parameterName}
                    onChange={(e) => updateEntry(entry.id, 'parameterName', e.target.value)}
                    placeholder="e.g: Temperature, Pressure, Speed"
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

                {/* Target Value */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Target Value                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.targetValue}
                    onChange={(e) => updateEntry(entry.id, 'targetValue', e.target.value)}
                    placeholder="e.g: 1500.00"
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

                {/* Actual Value */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Actual Value                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.actualValue}
                    onChange={(e) => updateEntry(entry.id, 'actualValue', e.target.value)}
                    placeholder="e.g: 1502.50"
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

                {/* Upper Limit */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Upper Limit                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.upperLimit}
                    onChange={(e) => updateEntry(entry.id, 'upperLimit', e.target.value)}
                    placeholder="e.g: 1520.00"
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

                {/* Lower Limit */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Lower Limit                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.lowerLimit}
                    onChange={(e) => updateEntry(entry.id, 'lowerLimit', e.target.value)}
                    placeholder="e.g: 1480.00"
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

                {/* Status */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Status                  </label>
                  <select
                    value={entry.status}
                    onChange={(e) => updateEntry(entry.id, 'status', e.target.value)}
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
                    <option value="">Select Status</option>
                    <option value="In Control">In Control</option>
                    <option value="Warning">Warning</option>
                    <option value="Out of Control">Out of Control</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Deviation */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Deviation
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.deviation}
                    onChange={(e) => updateEntry(entry.id, 'deviation', e.target.value)}
                    placeholder="e.g: 2.50"
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

                {/* Corrective Action */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Corrective Action
                  </label>
                  <select
                    value={entry.correctiveAction}
                    onChange={(e) => updateEntry(entry.id, 'correctiveAction', e.target.value)}
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
                    <option value="">Select Action</option>
                    <option value="None Required">None Required</option>
                    <option value="Adjustment Made">Adjustment Made</option>
                    <option value="Process Stopped">Process Stopped</option>
                    <option value="Maintenance Called">Maintenance Called</option>
                    <option value="Engineer Notified">Engineer Notified</option>
                  </select>
                </div>

                {/* Operator Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Operator Name                  </label>
                  <input
                    type="text"
                    value={entry.operatorName}
                    onChange={(e) => updateEntry(entry.id, 'operatorName', e.target.value)}
                    placeholder="e.g: John Smith"
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
                    placeholder="e.g: Mike Johnson"
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

                {/* Remarks */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Remarks
                  </label>
                  <textarea
                    value={entry.remarks}
                    onChange={(e) => updateEntry(entry.id, 'remarks', e.target.value)}
                    placeholder="Enter any additional notes or observations..."
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
            Save All Control Points
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
                Process Control Guidelines
              </h4>
              <ul style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0, paddingLeft: '1.25rem', lineHeight: '1.5' }}>
                <li>Monitor all critical process parameters continuously</li>
                <li>Record deviations and take immediate corrective actions</li>
                <li>Maintain control charts for trend analysis</li>
                <li>Escalate out-of-control conditions to supervisors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessControl;
