import React, { useState } from 'react';
import '../styles/PageStyles/Items.css';
import CustomDatePicker from '../Components/CustomDatePicker';
import ValidationPopup from '../Components/ValidationPopup';

const Items = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: '',
    machine: '',
    ppNo: '',
    partName: '',
    dateCode: '',
    heatCode: '',
    timeOfPouring: '',
    pcNo: '',
    heatNo: ''
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  // Helpers: CustomDatePicker may emit either an event (with target.value)
  // or a raw value. Normalize both shapes to reuse existing handlers.
  const normalizeDateChange = (name) => (eOrValue) => {
    const value = eOrValue && eOrValue.target ? eOrValue.target.value : eOrValue;
    handleChange({ target: { name, value } });
  };

  const handleStartDateChange = (eOrValue) => {
    const value = eOrValue && eOrValue.target ? eOrValue.target.value : eOrValue;
    setStartDate(value);
  };

  const handleEndDateChange = (eOrValue) => {
    const value = eOrValue && eOrValue.target ? eOrValue.target.value : eOrValue;
    setEndDate(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const allFields = [
      { key: 'date', label: 'Date' },
      { key: 'machine', label: 'Machine' },
      { key: 'ppNo', label: 'PP No' },
      { key: 'partName', label: 'Part Name' },
      { key: 'dateCode', label: 'Date Code' },
      { key: 'heatCode', label: 'Heat Code' },
      { key: 'timeOfPouring', label: 'Time of Pouring' },
      { key: 'pcNo', label: 'PC No' },
      { key: 'heatNo', label: 'Heat No' }
    ];

    const missing = allFields.filter(field => !formData[field.key]);

    if (missing.length > 0) {
      setMissingFields(missing.map(f => f.label));
      setShowMissingFields(true);
      return;
    }

    console.log('Form Data:', formData);
    alert('Form submitted successfully! Check the console for data.');
    
    setFormData({
      date: '',
      machine: '',
      ppNo: '',
      partName: '',
      dateCode: '',
      heatCode: '',
      timeOfPouring: '',
      pcNo: '',
      heatNo: ''
    });
  };

  const handleFilter = () => {
    console.log('Filter:', { startDate, endDate });
    alert(`Filtering from ${startDate || 'start'} to ${endDate || 'end'}`);
  };

  return (
  <div className="page-container" style={{ minHeight: '100vh' }}>
      {/* Form Section */}
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        marginBottom: '24px' 
      }}>
        <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
          Item Entry
        </h3>
        
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px', 
            marginBottom: '20px' 
          }}>
            {/* Date */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Date              </label>
              <CustomDatePicker
                name="date"
                value={formData.date}
                onChange={normalizeDateChange('date')}
                max={today}
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>

            {/* Machine */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Machine              </label>
              <input
                type="text"
                name="machine"
                value={formData.machine}
                onChange={handleChange}
                placeholder="e.g: DESA 2"
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* PP No */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                PP No              </label>
              <input
                type="text"
                name="ppNo"
                value={formData.ppNo}
                onChange={handleChange}
                placeholder="e.g: 21"
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Part Name */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Part Name              </label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                placeholder="e.g: YST EN"
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Date Code */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Date Code
              </label>
              <input
                type="text"
                name="dateCode"
                value={formData.dateCode}
                onChange={handleChange}
                placeholder="e.g: 5818"
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Heat Code */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Heat Code
              </label>
              <input
                type="text"
                name="heatCode"
                value={formData.heatCode}
                onChange={handleChange}
                placeholder="e.g: 21"
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Time of Pouring */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Time of Pouring
              </label>
              <input
                type="text"
                name="timeOfPouring"
                value={formData.timeOfPouring}
                onChange={handleChange}
                placeholder="e.g: 04:38PM"
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* PC No */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                PC No
              </label>
              <input
                type="text"
                name="pcNo"
                value={formData.pcNo}
                onChange={handleChange}
                placeholder="e.g: 2"
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Heat No */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Heat No
              </label>
              <input
                type="text"
                name="heatNo"
                value={formData.heatNo}
                onChange={handleChange}
                placeholder="e.g: 140"
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmit}
              style={{ 
                padding: '10px 30px', 
                backgroundColor: '#5B9AA9', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '500', 
                fontSize: '15px',
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
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Report Section */}
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        marginBottom: '24px' 
      }}>
        <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>Item Report</h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 250px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              Start Date
            </label>
            <CustomDatePicker
              name="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              max={today}
              style={{ 
                width: '100%',
                padding: '10px 12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '14px' 
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 250px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              End Date
            </label>
            <CustomDatePicker
              name="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              max={today}
              style={{ 
                width: '100%',
                padding: '10px 12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '14px' 
              }}
            />
          </div>
          
          <button 
            onClick={handleFilter}
            style={{ 
              padding: '10px 30px', 
              backgroundColor: '#5B9AA9', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '500',
              fontSize: '15px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              height: 'fit-content'
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
            Filter
          </button>
        </div>
      </div>

      {/* Validation Popup */}
      <ValidationPopup
        isOpen={showMissingFields}
        onClose={() => setShowMissingFields(false)}
        missingFields={missingFields}
      />
    </div>
  );
};

export default Items;