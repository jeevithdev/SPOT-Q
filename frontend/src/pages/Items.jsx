import React, { useState, useEffect } from 'react';
import '../styles/PageStyles/Items.css';
import CustomDatePicker from '../Components/CustomDatePicker';
import ValidationPopup from '../Components/ValidationPopup';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Items = () => {
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch all items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/items`);
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
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

    try {
      setSubmitLoading(true);
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Item submitted successfully!');
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
        // Refresh the items list
        fetchItems();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!startDate && !endDate) {
      alert('Please select at least one date');
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_URL}/items/filter?${params}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data);
        alert(`Found ${data.count} items`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error filtering items:', error);
      alert('Failed to filter items');
    } finally {
      setLoading(false);
    }
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
                Date
              </label>
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
                Machine
              </label>
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
                PP No
              </label>
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
                Part Name
              </label>
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
              disabled={submitLoading}
              style={{ 
                padding: '10px 30px', 
                backgroundColor: submitLoading ? '#9CA3AF' : '#5B9AA9', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: submitLoading ? 'not-allowed' : 'pointer', 
                fontWeight: '500', 
                fontSize: '15px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (!submitLoading) {
                  e.target.style.backgroundColor = '#4A8494';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 16px rgba(91, 154, 169, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitLoading) {
                  e.target.style.backgroundColor = '#5B9AA9';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                }
              }}
              onMouseDown={(e) => !submitLoading && (e.target.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => !submitLoading && (e.target.style.transform = 'scale(1.05)')}
            >
              {submitLoading ? 'Submitting...' : 'Submit'}
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
        <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
          Item Report
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '20px' }}>
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
            disabled={loading}
            style={{ 
              padding: '10px 30px', 
              backgroundColor: loading ? '#9CA3AF' : '#5B9AA9', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: '500',
              fontSize: '15px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              height: 'fit-content'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#4A8494';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 16px rgba(91, 154, 169, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#5B9AA9';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              }
            }}
            onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1.05)')}
          >
            {loading ? 'Loading...' : 'Filter'}
          </button>

          <button 
            onClick={fetchItems}
            disabled={loading}
            style={{ 
              padding: '10px 30px', 
              backgroundColor: loading ? '#9CA3AF' : '#6B7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: '500',
              fontSize: '15px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              height: 'fit-content'
            }}
          >
            Reset
          </button>
        </div>

        {/* Items Display */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>Loading items...</p>
        ) : items.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <p style={{ marginBottom: '12px', color: '#374151', fontWeight: '500' }}>
              Total Items: {items.length}
            </p>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#F3F4F6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Machine</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>PP No</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Part Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Date Code</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Heat Code</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>PC No</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Heat No</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id} style={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB',
                    borderBottom: '1px solid #E5E7EB'
                  }}>
                    <td style={{ padding: '12px' }}>{new Date(item.date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}>{item.machine}</td>
                    <td style={{ padding: '12px' }}>{item.ppNo}</td>
                    <td style={{ padding: '12px' }}>{item.partName}</td>
                    <td style={{ padding: '12px' }}>{item.dateCode}</td>
                    <td style={{ padding: '12px' }}>{item.heatCode}</td>
                    <td style={{ padding: '12px' }}>{item.timeOfPouring}</td>
                    <td style={{ padding: '12px' }}>{item.pcNo}</td>
                    <td style={{ padding: '12px' }}>{item.heatNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>No items found</p>
        )}
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