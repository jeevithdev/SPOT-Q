import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw } from 'lucide-react';
import { DatePicker } from '../Components/Buttons';
import ValidationPopup from '../Components/ValidationPopup';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/MicroStructure.css';

const MicroStructure = () => {
  const [formData, setFormData] = useState({
    insDate: '',
    partName: '',
    dateCodeHeatCode: '',
    nodularityGraphiteType: '',
    countNos: '',
    size: '',
    ferritePercent: '',
    pearlitePercent: '',
    carbidePercent: '',
    remarks: ''
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.get('/v1/micro-structure');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching micro structure reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const required = ['insDate', 'partName', 'dateCodeHeatCode', 'nodularityGraphiteType',
                     'countNos', 'size', 'ferritePercent', 'pearlitePercent', 'carbidePercent'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFields(true);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/micro-structure', formData);
      
      if (data.success) {
        alert('Micro structure report created successfully!');
        setFormData({
          insDate: '', partName: '', dateCodeHeatCode: '', nodularityGraphiteType: '',
          countNos: '', size: '', ferritePercent: '', pearlitePercent: '', carbidePercent: '', remarks: ''
        });
        fetchItems();
      }
    } catch (error) {
      console.error('Error creating micro structure report:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredItems(items);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filtered = items.filter(item => {
      const itemDate = new Date(item.insDate);
      return itemDate >= start && itemDate <= end;
    });
    
    setFilteredItems(filtered);
  };

  const handleReset = () => {
    setFormData({
      insDate: '', partName: '', dateCodeHeatCode: '', nodularityGraphiteType: '',
      countNos: '', size: '', ferritePercent: '', pearlitePercent: '', carbidePercent: '', remarks: ''
    });
  };

  return (
    <div className="microstructure-container">
      <div className="microstructure-wrapper">
        {showMissingFields && (
          <ValidationPopup
            missingFields={missingFields}
            onClose={() => setShowMissingFields(false)}
          />
        )}

        {/* Entry Form Container */}
        <div className="microstructure-entry-container">
          <div className="microstructure-header">
            <div className="microstructure-header-text">
              <Save size={24} style={{ color: '#5B9AA9' }} />
              <h2>Micro Structure - Entry Form</h2>
            </div>
            <button onClick={handleReset} className="microstructure-reset-btn">
              <RefreshCw size={18} />
              Reset
            </button>
          </div>

          <div className="microstructure-form-grid">
            <div className="microstructure-form-group">
              <label>Inspection Date *</label>
              <DatePicker
                name="insDate"
                value={formData.insDate}
                onChange={handleChange}
              />
            </div>

            <div className="microstructure-form-group">
              <label>Part Name *</label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                placeholder="e.g: Engine Block"
              />
            </div>

            <div className="microstructure-form-group">
              <label>Date Code & Heat Code *</label>
              <input
                type="text"
                name="dateCodeHeatCode"
                value={formData.dateCodeHeatCode}
                onChange={handleChange}
                placeholder="e.g: 2024-HC-005"
              />
            </div>

            {/* Micro Structure Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Micro Structure Details
              </h4>
            </div>

            <div className="microstructure-form-group">
              <label>Nodularity % / Graphite Type *</label>
              <input
                type="text"
                name="nodularityGraphiteType"
                value={formData.nodularityGraphiteType}
                onChange={handleChange}
                placeholder="e.g: 85% Type VI"
              />
            </div>

            <div className="microstructure-form-group">
              <label>Count Nos/mm² *</label>
              <input
                type="number"
                name="countNos"
                value={formData.countNos}
                onChange={handleChange}
                placeholder="e.g: 150"
              />
            </div>

            <div className="microstructure-form-group">
              <label>Size *</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g: 5-8 µm"
              />
            </div>

            <div className="microstructure-form-group">
              <label>Ferrite % *</label>
              <input
                type="number"
                name="ferritePercent"
                value={formData.ferritePercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 20"
              />
            </div>

            <div className="microstructure-form-group">
              <label>Pearlite % *</label>
              <input
                type="number"
                name="pearlitePercent"
                value={formData.pearlitePercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 78"
              />
            </div>

            <div className="microstructure-form-group">
              <label>Carbide % *</label>
              <input
                type="number"
                name="carbidePercent"
                value={formData.carbidePercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 2"
              />
            </div>

            <div className="microstructure-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                placeholder="Enter any additional notes or observations..."
              />
            </div>
          </div>

          <div className="microstructure-submit-container">
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="microstructure-submit-btn"
            >
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </button>
          </div>
        </div>


        {/* Report Container */}
        <div className="microstructure-report-container">
          <div className="microstructure-report-title">
            <Filter size={20} style={{ color: '#FF7F50' }} />
            <h3>Micro Structure - Report Card</h3>
          </div>

          <div className="microstructure-filter-grid">
            <div className="microstructure-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="microstructure-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="microstructure-filter-btn-container">
              <button onClick={handleFilter} className="microstructure-filter-btn">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          {loading ? (
            <div className="microstructure-loader-container">
              <Loader />
            </div>
          ) : (
            <div className="microstructure-table-container">
              <table className="microstructure-table">
                <thead>
                  <tr>
                    <th>Ins Date</th>
                    <th>Part Name</th>
                    <th>Heat Code</th>
                    <th>Nodularity</th>
                    <th>Count/mm²</th>
                    <th>Size</th>
                    <th>Ferrite %</th>
                    <th>Pearlite %</th>
                    <th>Carbide %</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="microstructure-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{new Date(item.insDate).toLocaleDateString()}</td>
                        <td>{item.partName}</td>
                        <td>{item.dateCodeHeatCode}</td>
                        <td>{item.nodularityGraphiteType}</td>
                        <td>{item.countNos}</td>
                        <td>{item.size}</td>
                        <td>{item.ferritePercent}</td>
                        <td>{item.pearlitePercent}</td>
                        <td>{item.carbidePercent}</td>
                        <td>{item.remarks || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicroStructure;
