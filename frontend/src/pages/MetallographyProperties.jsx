import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import CustomDatePicker from '../Components/CustomDatePicker';

const MetallographyProperties = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '',
      sampleId: '',
      partNumber: '',
      heatNumber: '',
      sampleLocation: '',
      magnification: '',
      grainSize: '',
      graphiteType: '',
      graphiteSize: '',
      graphiteDistribution: '',
      pearliteContent: '',
      ferriteContent: '',
      cementiteContent: '',
      inclusionType: '',
      inclusionRating: '',
      porosityLevel: '',
      surfaceFinish: '',
      microhardness: '',
      testStandard: '',
      metallurgist: '',
      remarks: ''
    }
  ]);

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      date: '',
      sampleId: '',
      partNumber: '',
      heatNumber: '',
      sampleLocation: '',
      magnification: '',
      grainSize: '',
      graphiteType: '',
      graphiteSize: '',
      graphiteDistribution: '',
      pearliteContent: '',
      ferriteContent: '',
      cementiteContent: '',
      inclusionType: '',
      inclusionRating: '',
      porosityLevel: '',
      surfaceFinish: '',
      microhardness: '',
      testStandard: '',
      metallurgist: '',
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
      entry.date && entry.sampleId && entry.partNumber && entry.heatNumber && 
      entry.sampleLocation && entry.magnification && entry.grainSize && 
      entry.graphiteType && entry.graphiteSize && entry.metallurgist
    );

    if (isValid) {
      console.log('Submitted metallography properties:', entries);
      alert('Metallography properties submitted successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleReset = () => {
    setEntries([{
      id: 1,
      date: '',
      sampleId: '',
      partNumber: '',
      heatNumber: '',
      sampleLocation: '',
      magnification: '',
      grainSize: '',
      graphiteType: '',
      graphiteSize: '',
      graphiteDistribution: '',
      pearliteContent: '',
      ferriteContent: '',
      cementiteContent: '',
      inclusionType: '',
      inclusionRating: '',
      porosityLevel: '',
      surfaceFinish: '',
      microhardness: '',
      testStandard: '',
      metallurgist: '',
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
                Metallography Properties Analysis
              </h2>
              <p style={{ color: '#64748b', margin: 0 }}>
                Record metallographic analysis for automotive component quality assessment
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
                Add Analysis
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
                  Analysis #{index + 1}
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
                    Analysis Date                  </label>
                  <CustomDatePicker
                    value={entry.date}
                    onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Sample ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Sample ID                  </label>
                  <input
                    type="text"
                    value={entry.sampleId}
                    onChange={(e) => updateEntry(entry.id, 'sampleId', e.target.value)}
                    placeholder="e.g: MET-2024-001"
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
                    Part Number                  </label>
                  <input
                    type="text"
                    value={entry.partNumber}
                    onChange={(e) => updateEntry(entry.id, 'partNumber', e.target.value)}
                    placeholder="e.g: BRAKE_DISC_001"
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

                {/* Sample Location */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Sample Location                  </label>
                  <select
                    value={entry.sampleLocation}
                    onChange={(e) => updateEntry(entry.id, 'sampleLocation', e.target.value)}
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
                    <option value="Center">Center</option>
                    <option value="Edge">Edge</option>
                    <option value="Surface">Surface</option>
                    <option value="Core">Core</option>
                    <option value="Transition Zone">Transition Zone</option>
                  </select>
                </div>

                {/* Magnification */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Magnification                  </label>
                  <select
                    value={entry.magnification}
                    onChange={(e) => updateEntry(entry.id, 'magnification', e.target.value)}
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
                    <option value="">Select Magnification</option>
                    <option value="50x">50x</option>
                    <option value="100x">100x</option>
                    <option value="200x">200x</option>
                    <option value="500x">500x</option>
                    <option value="1000x">1000x</option>
                  </select>
                </div>

                {/* Grain Size */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Grain Size (ASTM)                  </label>
                  <select
                    value={entry.grainSize}
                    onChange={(e) => updateEntry(entry.id, 'grainSize', e.target.value)}
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
                    <option value="">Select Grain Size</option>
                    <option value="ASTM 1">ASTM 1 (Very Coarse)</option>
                    <option value="ASTM 2">ASTM 2</option>
                    <option value="ASTM 3">ASTM 3</option>
                    <option value="ASTM 4">ASTM 4</option>
                    <option value="ASTM 5">ASTM 5 (Medium)</option>
                    <option value="ASTM 6">ASTM 6</option>
                    <option value="ASTM 7">ASTM 7</option>
                    <option value="ASTM 8">ASTM 8 (Fine)</option>
                    <option value="ASTM 9">ASTM 9</option>
                    <option value="ASTM 10">ASTM 10</option>
                  </select>
                </div>

                {/* Graphite Analysis Section */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Graphite Analysis
                  </h4>
                </div>

                {/* Graphite Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Graphite Type                  </label>
                  <select
                    value={entry.graphiteType}
                    onChange={(e) => updateEntry(entry.id, 'graphiteType', e.target.value)}
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
                    <option value="Type A">Type A (Flaky)</option>
                    <option value="Type B">Type B (Rosette)</option>
                    <option value="Type C">Type C (Coarse Flaky)</option>
                    <option value="Type D">Type D (Fine Flaky)</option>
                    <option value="Type E">Type E (Interdendritic)</option>
                    <option value="Type F">Type F (Exploded)</option>
                  </select>
                </div>

                {/* Graphite Size */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Graphite Size                  </label>
                  <select
                    value={entry.graphiteSize}
                    onChange={(e) => updateEntry(entry.id, 'graphiteSize', e.target.value)}
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
                    <option value="">Select Size</option>
                    <option value="1">Size 1 (Very Large)</option>
                    <option value="2">Size 2 (Large)</option>
                    <option value="3">Size 3 (Medium)</option>
                    <option value="4">Size 4 (Small)</option>
                    <option value="5">Size 5 (Very Small)</option>
                    <option value="6">Size 6 (Fine)</option>
                    <option value="7">Size 7 (Very Fine)</option>
                    <option value="8">Size 8 (Extremely Fine)</option>
                  </select>
                </div>

                {/* Graphite Distribution */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Graphite Distribution
                  </label>
                  <select
                    value={entry.graphiteDistribution}
                    onChange={(e) => updateEntry(entry.id, 'graphiteDistribution', e.target.value)}
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
                    <option value="">Select Distribution</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Slightly Segregated">Slightly Segregated</option>
                    <option value="Segregated">Segregated</option>
                    <option value="Heavily Segregated">Heavily Segregated</option>
                  </select>
                </div>

                {/* Phase Analysis Section */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Phase Analysis (%)
                  </h4>
                </div>

                {/* Pearlite Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Pearlite Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.pearliteContent}
                    onChange={(e) => updateEntry(entry.id, 'pearliteContent', e.target.value)}
                    placeholder="e.g: 85.5"
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

                {/* Ferrite Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Ferrite Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.ferriteContent}
                    onChange={(e) => updateEntry(entry.id, 'ferriteContent', e.target.value)}
                    placeholder="e.g: 12.3"
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

                {/* Cementite Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Cementite Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={entry.cementiteContent}
                    onChange={(e) => updateEntry(entry.id, 'cementiteContent', e.target.value)}
                    placeholder="e.g: 2.2"
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

                {/* Quality Assessment Section */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Quality Assessment
                  </h4>
                </div>

                {/* Inclusion Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Inclusion Type
                  </label>
                  <select
                    value={entry.inclusionType}
                    onChange={(e) => updateEntry(entry.id, 'inclusionType', e.target.value)}
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
                    <option value="Sulfides">Sulfides</option>
                    <option value="Oxides">Oxides</option>
                    <option value="Silicates">Silicates</option>
                    <option value="Aluminates">Aluminates</option>
                    <option value="None">None</option>
                  </select>
                </div>

                {/* Inclusion Rating */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Inclusion Rating
                  </label>
                  <select
                    value={entry.inclusionRating}
                    onChange={(e) => updateEntry(entry.id, 'inclusionRating', e.target.value)}
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
                    <option value="">Select Rating</option>
                    <option value="0.5">0.5 (Very Light)</option>
                    <option value="1.0">1.0 (Light)</option>
                    <option value="1.5">1.5 (Moderate)</option>
                    <option value="2.0">2.0 (Heavy)</option>
                    <option value="2.5">2.5 (Very Heavy)</option>
                    <option value="3.0">3.0 (Excessive)</option>
                  </select>
                </div>

                {/* Porosity Level */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Porosity Level
                  </label>
                  <select
                    value={entry.porosityLevel}
                    onChange={(e) => updateEntry(entry.id, 'porosityLevel', e.target.value)}
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
                    <option value="">Select Level</option>
                    <option value="None">None</option>
                    <option value="Very Low">Very Low</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Excessive">Excessive</option>
                  </select>
                </div>

                {/* Surface Finish */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Surface Finish
                  </label>
                  <select
                    value={entry.surfaceFinish}
                    onChange={(e) => updateEntry(entry.id, 'surfaceFinish', e.target.value)}
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
                    <option value="">Select Finish</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Very Poor">Very Poor</option>
                  </select>
                </div>

                {/* Microhardness */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Microhardness (HV)
                  </label>
                  <input
                    type="number"
                    value={entry.microhardness}
                    onChange={(e) => updateEntry(entry.id, 'microhardness', e.target.value)}
                    placeholder="e.g: 185"
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
                    <option value="ASTM E112">ASTM E112 (Grain Size)</option>
                    <option value="ASTM A247">ASTM A247 (Graphite)</option>
                    <option value="ASTM E45">ASTM E45 (Inclusions)</option>
                    <option value="ISO 945">ISO 945 (Graphite)</option>
                    <option value="EN 1563">EN 1563 (Spheroidal Graphite)</option>
                  </select>
                </div>

                {/* Metallurgist */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
                    Metallurgist                  </label>
                  <input
                    type="text"
                    value={entry.metallurgist}
                    onChange={(e) => updateEntry(entry.id, 'metallurgist', e.target.value)}
                    placeholder="e.g: Dr. Sarah Johnson"
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
                    placeholder="Enter any additional observations or recommendations..."
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
            Save All Analyses
          </button>
        </div>

        {/* Metallography guidelines moved to global Guidelines component */}
      </div>
    </div>
  );
};

export default MetallographyProperties;
