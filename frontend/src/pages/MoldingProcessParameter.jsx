import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { DatePicker } from '../Components/Buttons';

const MoldingProcessParameter = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      startDate: '',
      endDate: '',
      moldId: '',
      targetCycleTime: '',
      achievedCycleTime: '',
      totalMetalWeight: '',
      totalSandWeight: '',
      breakdownAMC: '',
      breakdownDMM: '',
      breakdownOthers: '',
      incharge: '',
      operatorName: '',
      supervisor: '',
      remarks: ''
    }
  ]);

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      startDate: '',
      endDate: '',
      moldId: '',
      targetCycleTime: '',
      achievedCycleTime: '',
      totalMetalWeight: '',
      totalSandWeight: '',
      breakdownAMC: '',
      breakdownDMM: '',
      breakdownOthers: '',
      incharge: '',
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
      entry.moldId && entry.targetCycleTime && entry.achievedCycleTime &&
      entry.totalMetalWeight && entry.operatorName
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
      startDate: '',
      endDate: '',
      moldId: '',
      targetCycleTime: '',
      achievedCycleTime: '',
      totalMetalWeight: '',
      totalSandWeight: '',
      breakdownAMC: '',
      breakdownDMM: '',
      breakdownOthers: '',
      incharge: '',
      operatorName: '',
      supervisor: '',
      remarks: ''
    }]);
  };

  return (
  <div className="page-container" style={{ minHeight: '100vh' }}>
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem'
              }}>
                {/* Start Date */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Start Date
                  </label>
                  <DatePicker
                    value={entry.startDate}
                    onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    End Date
                  </label>
                  <DatePicker
                    value={entry.endDate}
                    onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Mold ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Mold No./ID
                  </label>
                  <input
                    type="text"
                    value={entry.moldId}
                    onChange={(e) => updateEntry(entry.id, 'moldId', e.target.value)}
                    placeholder="e.g: MOLD-2024-001"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Target Cycle Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Target Cycle Time (sec)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.targetCycleTime}
                    onChange={(e) => updateEntry(entry.id, 'targetCycleTime', e.target.value)}
                    placeholder="e.g: 45.0"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Achieved Cycle Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Achieved Cycle Time (sec)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.achievedCycleTime}
                    onChange={(e) => updateEntry(entry.id, 'achievedCycleTime', e.target.value)}
                    placeholder="e.g: 46.2"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Total Metal Weight */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Total Metal Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.totalMetalWeight}
                    onChange={(e) => updateEntry(entry.id, 'totalMetalWeight', e.target.value)}
                    placeholder="e.g: 1250.50"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Total Sand Weight */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Total Sand Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.totalSandWeight}
                    onChange={(e) => updateEntry(entry.id, 'totalSandWeight', e.target.value)}
                    placeholder="e.g: 320.00"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Breakdown Fields */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Breakdown AMC
                  </label>
                  <input
                    type="number"
                    value={entry.breakdownAMC}
                    onChange={(e) => updateEntry(entry.id, 'breakdownAMC', e.target.value)}
                    placeholder="e.g: 0"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Breakdown DMM
                  </label>
                  <input
                    type="number"
                    value={entry.breakdownDMM}
                    onChange={(e) => updateEntry(entry.id, 'breakdownDMM', e.target.value)}
                    placeholder="e.g: 0"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Breakdown Others
                  </label>
                  <input
                    type="number"
                    value={entry.breakdownOthers}
                    onChange={(e) => updateEntry(entry.id, 'breakdownOthers', e.target.value)}
                    placeholder="e.g: 0"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Personnel fields */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Incharge
                  </label>
                  <input
                    type="text"
                    value={entry.incharge}
                    onChange={(e) => updateEntry(entry.id, 'incharge', e.target.value)}
                    placeholder="e.g: Alice"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Operator
                  </label>
                  <input
                    type="text"
                    value={entry.operatorName}
                    onChange={(e) => updateEntry(entry.id, 'operatorName', e.target.value)}
                    placeholder="e.g: John Smith"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Supervisor
                  </label>
                  <input
                    type="text"
                    value={entry.supervisor}
                    onChange={(e) => updateEntry(entry.id, 'supervisor', e.target.value)}
                    placeholder="e.g: Mike Johnson"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Remarks full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Remarks
                  </label>
                  <textarea
                    value={entry.remarks}
                    onChange={(e) => updateEntry(entry.id, 'remarks', e.target.value)}
                    placeholder="Enter any additional notes or observations..."
                    rows="3"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', resize: 'vertical' }}
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
            Save All Cycles
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoldingProcessParameter;
