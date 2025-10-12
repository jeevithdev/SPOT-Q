import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

const MechanicalProperties = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '',
      partNumber: '',
      heatNumber: '',
      batchNumber: '',
      tensileStrength: '',
      yieldStrength: '',
      elongation: '',
      hardnessHB: '',
      hardnessHRC: '',
      impactEnergy: '',
      fatigueStrength: '',
      specimenType: '',
      testTemperature: '',
      operatorName: '',
      testStandard: ''
    }
  ]);

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      date: '',
      partNumber: '',
      heatNumber: '',
      batchNumber: '',
      tensileStrength: '',
      yieldStrength: '',
      elongation: '',
      hardnessHB: '',
      hardnessHRC: '',
      impactEnergy: '',
      fatigueStrength: '',
      specimenType: '',
      testTemperature: '',
      operatorName: '',
      testStandard: ''
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
      entry.date && entry.partNumber && entry.heatNumber && entry.batchNumber && 
      entry.tensileStrength && entry.yieldStrength && entry.elongation && 
      entry.hardnessHB && entry.impactEnergy && entry.operatorName
    );

    if (isValid) {
      console.log('Submitted mechanical properties:', entries);
      alert('Mechanical properties data submitted successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleReset = () => {
    setEntries([{
      id: 1,
      date: '',
      partNumber: '',
      heatNumber: '',
      batchNumber: '',
      tensileStrength: '',
      yieldStrength: '',
      elongation: '',
      hardnessHB: '',
      hardnessHRC: '',
      impactEnergy: '',
      fatigueStrength: '',
      specimenType: '',
      testTemperature: '',
      operatorName: '',
      testStandard: ''
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
                Mechanical Properties Testing
              </h2>
              <p style={{ color: '#64748b', margin: 0 }}>
                Record mechanical properties for automobile components
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
                Add Test
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
                  Test #{index + 1}
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
                    Test Date <span style={{ color: '#ef4444' }}>*</span>
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

                {/* Tensile Strength */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Tensile Strength (MPa) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={entry.tensileStrength}
                    onChange={(e) => updateEntry(entry.id, 'tensileStrength', e.target.value)}
                    placeholder="e.g., 450"
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

                {/* Yield Strength */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Yield Strength (MPa) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={entry.yieldStrength}
                    onChange={(e) => updateEntry(entry.id, 'yieldStrength', e.target.value)}
                    placeholder="e.g., 350"
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

                {/* Elongation */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Elongation (%) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.elongation}
                    onChange={(e) => updateEntry(entry.id, 'elongation', e.target.value)}
                    placeholder="e.g., 12.5"
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

                {/* Hardness HB */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Hardness HB <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={entry.hardnessHB}
                    onChange={(e) => updateEntry(entry.id, 'hardnessHB', e.target.value)}
                    placeholder="e.g., 220"
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

                {/* Hardness HRC */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Hardness HRC
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.hardnessHRC}
                    onChange={(e) => updateEntry(entry.id, 'hardnessHRC', e.target.value)}
                    placeholder="e.g., 18.5"
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

                {/* Impact Energy */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Impact Energy (J) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.impactEnergy}
                    onChange={(e) => updateEntry(entry.id, 'impactEnergy', e.target.value)}
                    placeholder="e.g., 45.2"
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

                {/* Fatigue Strength */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Fatigue Strength (MPa)
                  </label>
                  <input
                    type="number"
                    value={entry.fatigueStrength}
                    onChange={(e) => updateEntry(entry.id, 'fatigueStrength', e.target.value)}
                    placeholder="e.g., 180"
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

                {/* Specimen Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Specimen Type
                  </label>
                  <select
                    value={entry.specimenType}
                    onChange={(e) => updateEntry(entry.id, 'specimenType', e.target.value)}
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
                    <option value="">Select Type</option>
                    <option value="Standard">Standard</option>
                    <option value="Sub-size">Sub-size</option>
                    <option value="Round">Round</option>
                    <option value="Flat">Flat</option>
                  </select>
                </div>

                {/* Test Temperature */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Test Temperature (°C)
                  </label>
                  <input
                    type="number"
                    value={entry.testTemperature}
                    onChange={(e) => updateEntry(entry.id, 'testTemperature', e.target.value)}
                    placeholder="e.g., 23"
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

                {/* Test Standard */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Test Standard
                  </label>
                  <select
                    value={entry.testStandard}
                    onChange={(e) => updateEntry(entry.id, 'testStandard', e.target.value)}
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
                    <option value="">Select Standard</option>
                    <option value="ASTM E8">ASTM E8</option>
                    <option value="ASTM E23">ASTM E23</option>
                    <option value="ISO 6892">ISO 6892</option>
                    <option value="EN 10002">EN 10002</option>
                  </select>
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
            Save All Tests
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
                Testing Guidelines
              </h4>
              <ul style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0, paddingLeft: '1.25rem', lineHeight: '1.5' }}>
                <li>All tests should follow standard automotive industry protocols</li>
                <li>Record precise measurements for quality traceability</li>
                <li>Ensure proper specimen preparation and conditioning</li>
                <li>Maintain consistent testing environment conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicalProperties;
