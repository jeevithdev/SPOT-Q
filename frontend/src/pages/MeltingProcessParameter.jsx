import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import CustomDatePicker from '../Components/CustomDatePicker';

const MeltingProcessParameter = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '',
      shift: '',
      furnaceId: '',
      heatNumber: '',
      meltStartTime: '',
      meltEndTime: '',
      chargeWeight: '',
      tapTemperature: '',
      pouringTemperature: '',
      carbonContent: '',
      siliconContent: '',
      manganeseContent: '',
      phosphorusContent: '',
      sulfurContent: '',
      chromiumContent: '',
      nickelContent: '',
      aluminumContent: '',
      titaniumContent: '',
      finalComposition: '',
      meltOperator: '',
      supervisor: '',
      remarks: ''
    }
  ]);

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      date: '',
      shift: '',
      furnaceId: '',
      heatNumber: '',
      meltStartTime: '',
      meltEndTime: '',
      chargeWeight: '',
      tapTemperature: '',
      pouringTemperature: '',
      carbonContent: '',
      siliconContent: '',
      manganeseContent: '',
      phosphorusContent: '',
      sulfurContent: '',
      chromiumContent: '',
      nickelContent: '',
      aluminumContent: '',
      titaniumContent: '',
      finalComposition: '',
      meltOperator: '',
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
      entry.date && entry.shift && entry.furnaceId && entry.heatNumber && 
      entry.meltStartTime && entry.meltEndTime && entry.chargeWeight && 
      entry.tapTemperature && entry.pouringTemperature && entry.carbonContent &&
      entry.siliconContent && entry.manganeseContent && entry.meltOperator
    );

    if (isValid) {
      console.log('Submitted melting process parameters:', entries);
      alert('Melting process parameters submitted successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleReset = () => {
    setEntries([{
      id: 1,
      date: '',
      shift: '',
      furnaceId: '',
      heatNumber: '',
      meltStartTime: '',
      meltEndTime: '',
      chargeWeight: '',
      tapTemperature: '',
      pouringTemperature: '',
      carbonContent: '',
      siliconContent: '',
      manganeseContent: '',
      phosphorusContent: '',
      sulfurContent: '',
      chromiumContent: '',
      nickelContent: '',
      aluminumContent: '',
      titaniumContent: '',
      finalComposition: '',
      meltOperator: '',
      supervisor: '',
      remarks: ''
    }]);
  };

  return (
  <div className="page-container" style={{ minHeight: '100vh', backgroundColor: '#91bccf' }}>
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
                Melting Process Parameters
              </h2>
              <p style={{ color: '#64748b', margin: 0 }}>
                Record melting process parameters for automotive casting operations
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
                  backgroundColor: '#163442',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1f4f5d';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 6px rgba(22,52,66,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#163442';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1.05)'}
              >
                <X size={18} />
                Reset
              </button>
              <button
                onClick={() => document.dispatchEvent(new Event('guidelines:open'))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#5B9AA9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4A8494';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(74,132,148,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#5B9AA9';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              >
                Guidelines
              </button>
              <button
                onClick={addNewEntry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#FF7F50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FF6A3D';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 127, 80, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#FF7F50';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1.05)'}
              >
                <Plus size={18} />
                Add Melt
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
                  Melt #{index + 1}
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
                  <CustomDatePicker
                    value={entry.date}
                    onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
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

                {/* Furnace ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Furnace ID                  </label>
                  <select
                    value={entry.furnaceId}
                    onChange={(e) => updateEntry(entry.id, 'furnaceId', e.target.value)}
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
                    <option value="">Select Furnace</option>
                    <option value="FURNACE-1">FURNACE-1 (Induction)</option>
                    <option value="FURNACE-2">FURNACE-2 (Electric Arc)</option>
                    <option value="FURNACE-3">FURNACE-3 (Cupola)</option>
                    <option value="FURNACE-4">FURNACE-4 (Induction)</option>
                  </select>
                </div>

                {/* Heat Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Heat Number                  </label>
                  <input
                    type="text"
                    value={entry.heatNumber}
                    onChange={(e) => updateEntry(entry.id, 'heatNumber', e.target.value)}
                    placeholder="e.g: H2024001"
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

                {/* Melt Start Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Melt Start Time                  </label>
                  <input
                    type="time"
                    value={entry.meltStartTime}
                    onChange={(e) => updateEntry(entry.id, 'meltStartTime', e.target.value)}
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

                {/* Melt End Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Melt End Time                  </label>
                  <input
                    type="time"
                    value={entry.meltEndTime}
                    onChange={(e) => updateEntry(entry.id, 'meltEndTime', e.target.value)}
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

                {/* Charge Weight */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Charge Weight (kg)                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.chargeWeight}
                    onChange={(e) => updateEntry(entry.id, 'chargeWeight', e.target.value)}
                    placeholder="e.g: 2500.5"
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

                {/* Tap Temperature */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Tap Temperature (°C)                  </label>
                  <input
                    type="number"
                    value={entry.tapTemperature}
                    onChange={(e) => updateEntry(entry.id, 'tapTemperature', e.target.value)}
                    placeholder="e.g: 1580"
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

                {/* Pouring Temperature */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Pouring Temperature (°C)                  </label>
                  <input
                    type="number"
                    value={entry.pouringTemperature}
                    onChange={(e) => updateEntry(entry.id, 'pouringTemperature', e.target.value)}
                    placeholder="e.g: 1520"
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

                {/* Chemical Composition Section */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Chemical Composition (%)
                  </h4>
                </div>

                {/* Carbon Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Carbon (C)                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.carbonContent}
                    onChange={(e) => updateEntry(entry.id, 'carbonContent', e.target.value)}
                    placeholder="e.g: 3.25"
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

                {/* Silicon Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Silicon (Si)                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.siliconContent}
                    onChange={(e) => updateEntry(entry.id, 'siliconContent', e.target.value)}
                    placeholder="e.g: 2.15"
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

                {/* Manganese Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Manganese (Mn)                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.manganeseContent}
                    onChange={(e) => updateEntry(entry.id, 'manganeseContent', e.target.value)}
                    placeholder="e.g: 0.75"
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

                {/* Phosphorus Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Phosphorus (P)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={entry.phosphorusContent}
                    onChange={(e) => updateEntry(entry.id, 'phosphorusContent', e.target.value)}
                    placeholder="e.g: 0.045"
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

                {/* Sulfur Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Sulfur (S)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={entry.sulfurContent}
                    onChange={(e) => updateEntry(entry.id, 'sulfurContent', e.target.value)}
                    placeholder="e.g: 0.015"
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

                {/* Chromium Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Chromium (Cr)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.chromiumContent}
                    onChange={(e) => updateEntry(entry.id, 'chromiumContent', e.target.value)}
                    placeholder="e.g: 0.25"
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

                {/* Nickel Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Nickel (Ni)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.nickelContent}
                    onChange={(e) => updateEntry(entry.id, 'nickelContent', e.target.value)}
                    placeholder="e.g: 0.15"
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

                {/* Aluminum Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Aluminum (Al)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={entry.aluminumContent}
                    onChange={(e) => updateEntry(entry.id, 'aluminumContent', e.target.value)}
                    placeholder="e.g: 0.005"
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

                {/* Titanium Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Titanium (Ti)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={entry.titaniumContent}
                    onChange={(e) => updateEntry(entry.id, 'titaniumContent', e.target.value)}
                    placeholder="e.g: 0.025"
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

                {/* Melt Operator */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Melt Operator                  </label>
                  <input
                    type="text"
                    value={entry.meltOperator}
                    onChange={(e) => updateEntry(entry.id, 'meltOperator', e.target.value)}
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
              backgroundColor: '#5B9AA9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#4A8494';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 16px rgba(91, 154, 169, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#5B9AA9';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1.05)'}
          >
            <Save size={20} />
            Save All Melts
          </button>
        </div>

        {/* Melting Guidelines moved to global Guidelines component */}
      </div>
    </div>
  );
};

export default MeltingProcessParameter;
