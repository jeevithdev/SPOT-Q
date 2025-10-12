import React, { useState } from 'react';
import '../styles/PageStyles/Items.css';

const Items = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.date || !formData.machine || !formData.ppNo || !formData.partName) {
      alert('Please fill all required fields (Date, Machine, PP No, Part Name)');
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
    <div className="page-container">
      {/* Header Section */}
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        marginBottom: '24px' 
      }}>
        <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>Item Report</h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ 
                padding: '8px 12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '14px' 
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ 
                padding: '8px 12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '14px' 
              }}
            />
          </div>
          
          <button 
            onClick={handleFilter}
            style={{ 
              padding: '8px 20px', 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: '500' 
            }}
            onMouseOver={(e) => e.target.style.background = '#2563eb'}
            onMouseOut={(e) => e.target.style.background = '#3b82f6'}
          >
            Filter
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
          Add New Item
        </h3>
        
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px', 
            marginBottom: '20px' 
          }}>
            {/* Date */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Date <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{ 
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>

            {/* Machine */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Machine <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="machine"
                value={formData.machine}
                onChange={handleChange}
                placeholder="e.g., DESA 2"
                style={{ 
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>

            {/* PP No */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                PP No <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="ppNo"
                value={formData.ppNo}
                onChange={handleChange}
                placeholder="e.g., 21"
                style={{ 
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>

            {/* Part Name */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Part Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                placeholder="e.g., YST EN"
                style={{ 
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>

            {/* Date Code */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Date Code
              </label>
              <input
                type="text"
                name="dateCode"
                value={formData.dateCode}
                onChange={handleChange}
                placeholder="e.g., 5818"
                style={{ 
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>

            {/* Heat Code */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Heat Code
              </label>
              <input
                type="text"
                name="heatCode"
                value={formData.heatCode}
                onChange={handleChange}
                placeholder="e.g., 21"
                style={{ 
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>

            {/* Time of Pouring */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Time of Pouring
              </label>
              <input
                type="text"
                name="timeOfPouring"
                value={formData.timeOfPouring}
                onChange={handleChange}
                placeholder="e.g., 04:38PM"
                style={{ 
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>

            {/* PC No */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                PC No
              </label>
              <input
                type="text"
                name="pcNo"
                value={formData.pcNo}
                onChange={handleChange}
                placeholder="e.g., 2"
                style={{ 
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>

            {/* Heat No */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Heat No
              </label>
              <input
                type="text"
                name="heatNo"
                value={formData.heatNo}
                onChange={handleChange}
                placeholder="e.g., 140"
                style={{ 
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px' 
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmit}
              style={{ 
                padding: '10px 30px', 
                background: '#10b981', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: '500', 
                fontSize: '15px' 
              }}
              onMouseOver={(e) => e.target.style.background = '#059669'}
              onMouseOut={(e) => e.target.style.background = '#10b981'}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;