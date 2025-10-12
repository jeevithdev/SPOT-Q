import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

const MoldingProcessParameter = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '',
      shift: '',
      machineId: '',
      moldId: '',
      partNumber: '',
      cycleTime: '',
      moldTemperature: '',
      injectionPressure: '',
      holdingPressure: '',
      injectionSpeed: '',
      coolingTime: '',
      ejectionTime: '',
      clampForce: '',
      shotWeight: '',
      meltTemperature: '',
      moldOpenTime: '',
      moldCloseTime: '',
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
      machineId: '',
      moldId: '',
      partNumber: '',
      cycleTime: '',
      moldTemperature: '',
      injectionPressure: '',
      holdingPressure: '',
      injectionSpeed: '',
      coolingTime: '',
      ejectionTime: '',
      clampForce: '',
      shotWeight: '',
      meltTemperature: '',
      moldOpenTime: '',
      moldCloseTime: '',
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
      entry.date && entry.shift && entry.machineId && entry.moldId && 
      entry.partNumber && entry.cycleTime && entry.moldTemperature && 
      entry.injectionPressure && entry.holdingPressure && entry.operatorName
    );

    if (isValid) {
      console.log('Submitted molding process parameters:', entries);
      alert('Molding process parameters submitted successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleReset = () => {
    setEntries([{
      id: 1,
      date: '',
      shift: '',
      machineId: '',
      moldId: '',
      partNumber: '',
      cycleTime: '',
      moldTemperature: '',
      injectionPressure: '',
      holdingPressure: '',
      injectionSpeed: '',
      coolingTime: '',
      ejectionTime: '',
      clampForce: '',
      shotWeight: '',
      meltTemperature: '',
      moldOpenTime: '',
      moldCloseTime: '',
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
                Molding Process Parameters
              </h2>
              <p style={{ color: '#64748b', margin: 0 }}>
                Record molding process parameters for automotive component manufacturing
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
                Add Cycle
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
                  Cycle #{index + 1}
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

                {/* Machine ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Machine ID <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={entry.machineId}
                    onChange={(e) => updateEntry(entry.id, 'machineId', e.target.value)}
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
                    <option value="">Select Machine</option>
                    <option value="INJ-001">INJ-001 (500 Ton)</option>
                    <option value="INJ-002">INJ-002 (750 Ton)</option>
                    <option value="INJ-003">INJ-003 (1000 Ton)</option>
                    <option value="INJ-004">INJ-004 (1500 Ton)</option>
                    <option value="INJ-005">INJ-005 (2000 Ton)</option>
                  </select>
                </div>

                {/* Mold ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Mold ID <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.moldId}
                    onChange={(e) => updateEntry(entry.id, 'moldId', e.target.value)}
                    placeholder="e.g., MOLD-2024-001"
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

                {/* Part Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Part Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.partNumber}
                    onChange={(e) => updateEntry(entry.id, 'partNumber', e.target.value)}
                    placeholder="e.g., DASHBOARD_001"
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

                {/* Cycle Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Cycle Time (sec) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.cycleTime}
                    onChange={(e) => updateEntry(entry.id, 'cycleTime', e.target.value)}
                    placeholder="e.g., 45.5"
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

                {/* Temperature Parameters Section */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Temperature Parameters
                  </h4>
                </div>

                {/* Mold Temperature */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Mold Temperature (°C) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={entry.moldTemperature}
                    onChange={(e) => updateEntry(entry.id, 'moldTemperature', e.target.value)}
                    placeholder="e.g., 85"
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

                {/* Melt Temperature */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Melt Temperature (°C)
                  </label>
                  <input
                    type="number"
                    value={entry.meltTemperature}
                    onChange={(e) => updateEntry(entry.id, 'meltTemperature', e.target.value)}
                    placeholder="e.g., 245"
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

                {/* Pressure Parameters Section */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Pressure Parameters
                  </h4>
                </div>

                {/* Injection Pressure */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Injection Pressure (bar) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.injectionPressure}
                    onChange={(e) => updateEntry(entry.id, 'injectionPressure', e.target.value)}
                    placeholder="e.g., 1200.5"
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

                {/* Holding Pressure */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Holding Pressure (bar) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.holdingPressure}
                    onChange={(e) => updateEntry(entry.id, 'holdingPressure', e.target.value)}
                    placeholder="e.g., 850.0"
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

                {/* Clamp Force */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Clamp Force (Ton)
                  </label>
                  <input
                    type="number"
                    value={entry.clampForce}
                    onChange={(e) => updateEntry(entry.id, 'clampForce', e.target.value)}
                    placeholder="e.g., 500"
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

                {/* Speed Parameters Section */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Speed Parameters
                  </h4>
                </div>

                {/* Injection Speed */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Injection Speed (mm/s)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.injectionSpeed}
                    onChange={(e) => updateEntry(entry.id, 'injectionSpeed', e.target.value)}
                    placeholder="e.g., 85.5"
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

                {/* Time Parameters Section */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Time Parameters
                  </h4>
                </div>

                {/* Cooling Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Cooling Time (sec)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.coolingTime}
                    onChange={(e) => updateEntry(entry.id, 'coolingTime', e.target.value)}
                    placeholder="e.g., 25.0"
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

                {/* Ejection Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Ejection Time (sec)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.ejectionTime}
                    onChange={(e) => updateEntry(entry.id, 'ejectionTime', e.target.value)}
                    placeholder="e.g., 3.5"
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

                {/* Mold Open Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Mold Open Time (sec)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.moldOpenTime}
                    onChange={(e) => updateEntry(entry.id, 'moldOpenTime', e.target.value)}
                    placeholder="e.g., 2.0"
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

                {/* Mold Close Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Mold Close Time (sec)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.moldCloseTime}
                    onChange={(e) => updateEntry(entry.id, 'moldCloseTime', e.target.value)}
                    placeholder="e.g., 3.0"
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

                {/* Shot Weight */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Shot Weight (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.shotWeight}
                    onChange={(e) => updateEntry(entry.id, 'shotWeight', e.target.value)}
                    placeholder="e.g., 1250.5"
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

                {/* Operator Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Operator Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.operatorName}
                    onChange={(e) => updateEntry(entry.id, 'operatorName', e.target.value)}
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
            Save All Cycles
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
                Molding Guidelines
              </h4>
              <ul style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0, paddingLeft: '1.25rem', lineHeight: '1.5' }}>
                <li>Maintain consistent process parameters for quality control</li>
                <li>Monitor mold temperature and pressure throughout the cycle</li>
                <li>Record cycle times for process optimization</li>
                <li>Ensure proper mold maintenance and cleaning schedules</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoldingProcessParameter;
