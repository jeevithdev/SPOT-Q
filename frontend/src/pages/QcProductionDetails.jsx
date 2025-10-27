import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import CustomDatePicker from '../Components/CustomDatePicker';
import '../styles/PageStyles/QcProductionDetails.css';

const QcProductionDetails = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '',
      machine: '',
      ppNo: '',
      partName: '',
      dataCode: '',
      heatCode: '',
      timeOfPouring: '',
      fcNo: '',
      heatNo: ''
    }
  ]);
  // rely on global validation from Guidelines (validated-control classes)

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      date: '',
      machine: '',
      ppNo: '',
      partName: '',
      dataCode: '',
      heatCode: '',
      timeOfPouring: '',
      fcNo: '',
      heatNo: ''
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

  // Normalize date changes coming from CustomDatePicker which may emit
  // either an event ({ target: { value } }) or a raw value string.
  const normalizeEntryDateChange = (id) => (eOrValue) => {
    const value = eOrValue && eOrValue.target ? eOrValue.target.value : eOrValue;
    updateEntry(id, 'date', value);
  };

  // Rely on central validation (Guidelines) for touched/valid/invalid state.

  const handleSubmit = () => {
    const isValid = entries.every(entry => 
      entry.date && entry.machine && entry.ppNo && entry.partName && 
      entry.dataCode && entry.heatCode && entry.timeOfPouring && 
      entry.fcNo && entry.heatNo
    );

    if (isValid) {
      console.log('Submitted entries:', entries);
      // TODO: Send data to backend API
      alert('Data submitted successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleReset = () => {
    setEntries([{
      id: 1,
      date: '',
      machine: '',
      ppNo: '',
      partName: '',
      dataCode: '',
      heatCode: '',
      timeOfPouring: '',
      fcNo: '',
      heatNo: ''
    }]);
    // rely on global validation state; nothing else to clear here
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
                Spectro Analysis
              </h2>
              <p style={{ color: '#64748b', margin: 0 }}>
                Enter spectroscopic analysis data for quality control
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
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4A8494';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(91,154,169,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#5B9AA9';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1.05)'}
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
                Add Entry
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
                  Entry #{index + 1}
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
                      color: '#FF7F50',
                      border: '1px solid #FF7F50',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.3s ease',
                      transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#FFF5F0';
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 2px 4px rgba(255, 127, 80, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1.05)'}
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
                    onChange={(eOrVal) => {
                      normalizeEntryDateChange(entry.id)(eOrVal);
                    }}
                    
                    max={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem'
                    }}
                    className={'validated-control'}
                    required
                  />
                </div>

                {/* Machine */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Machine                  </label>
                  <select
                    value={entry.machine}
                    onChange={(e) => updateEntry(entry.id, 'machine', e.target.value)}
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
                    className={'validated-control'}
                    required
                    
                  >
                    <option value="">Select Machine</option>
                    <option value="DISA-1">DISA-1</option>
                    <option value="DISA-2">DISA-2</option>
                    <option value="DISA-3">DISA-3</option>
                  </select>
                </div>

                {/* PP NO */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    PP NO                  </label>
                  <input
                    type="number"
                    value={entry.ppNo}
                    onChange={(e) => updateEntry(entry.id, 'ppNo', e.target.value)}
                    placeholder="Enter PP Number"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    className={'validated-control'}
                    required
                    
                  />
                </div>

                {/* Part Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Part Name                  </label>
                  <input
                    type="text"
                    value={entry.partName}
                    onChange={(e) => updateEntry(entry.id, 'partName', e.target.value)}
                    placeholder="e.g: PSA 7B K"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    className={'validated-control'}
                    required
                    
                  />
                </div>

                {/* Data Code */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Data Code                  </label>
                  <input
                    type="text"
                    value={entry.dataCode}
                    onChange={(e) => updateEntry(entry.id, 'dataCode', e.target.value)}
                    placeholder="e.g: SH02"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    className={'validated-control'}
                    required
                    
                  />
                </div>

                {/* Heat Code */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Heat Code                  </label>
                  <input
                    type="number"
                    value={entry.heatCode}
                    onChange={(e) => updateEntry(entry.id, 'heatCode', e.target.value)}
                    placeholder="Enter Heat Code"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    className={'validated-control'}
                    required
                    
                  />
                </div>

                {/* Time of Pouring */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Time of Pouring                  </label>
                  <input
                    type="time"
                    value={entry.timeOfPouring}
                    onChange={(e) => updateEntry(entry.id, 'timeOfPouring', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    className={'validated-control'}
                    required
                    
                  />
                </div>

                {/* F/C NO */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    F/C NO                  </label>
                  <input
                    type="number"
                    value={entry.fcNo}
                    onChange={(e) => updateEntry(entry.id, 'fcNo', e.target.value)}
                    placeholder="Enter F/C Number"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    className={'validated-control'}
                    required
                    
                  />
                </div>

                {/* Heat NO */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Heat NO                  </label>
                  <input
                    type="text"
                    value={entry.heatNo}
                    onChange={(e) => updateEntry(entry.id, 'heatNo', e.target.value)}
                    placeholder="Enter Heat Number"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    className={'validated-control'}
                    required
                    
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
            Save All Entries
          </button>
        </div>

        {/* Instructions removed — use the central Guidelines tab instead */}
      </div>
    </div>
  );
};

export default QcProductionDetails;