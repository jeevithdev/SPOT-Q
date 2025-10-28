import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw } from 'lucide-react';
import { DatePicker } from '../Components/Buttons';
import ValidationPopup from '../Components/ValidationPopup';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/Tensile.css';

const Tensile = () => {
  const [formData, setFormData] = useState({
    dateOfInspection: '',
    item: '',
    dateHeatCode: '',
    dia: '',
    lo: '',
    li: '',
    breakingLoad: '',
    yieldLoad: '',
    uts: '',
    ys: '',
    elongation: '',
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
      const data = await api.get('/v1/tensile-tests');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tensile tests:', error);
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
    const required = ['dateOfInspection', 'item', 'dateHeatCode', 'dia', 'lo', 'li', 
                     'breakingLoad', 'yieldLoad', 'uts', 'ys', 'elongation'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFields(true);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/tensile-tests', formData);
      
      if (data.success) {
        alert('Tensile test entry created successfully!');
        setFormData({
          dateOfInspection: '', item: '', dateHeatCode: '', dia: '', lo: '', li: '',
          breakingLoad: '', yieldLoad: '', uts: '', ys: '', elongation: '', remarks: ''
        });
        fetchItems();
      }
    } catch (error) {
      console.error('Error creating tensile test:', error);
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
      const itemDate = new Date(item.dateOfInspection);
      return itemDate >= start && itemDate <= end;
    });
    
    setFilteredItems(filtered);
  };

  const handleReset = () => {
    setFormData({
      dateOfInspection: '', item: '', dateHeatCode: '', dia: '', lo: '', li: '',
      breakingLoad: '', yieldLoad: '', uts: '', ys: '', elongation: '', remarks: ''
    });
  };

  return (
    <div className="page-container tensile-container">
      <div className="tensile-wrapper">
        {showMissingFields && (
          <ValidationPopup
            missingFields={missingFields}
            onClose={() => setShowMissingFields(false)}
          />
        )}

        {/* Entry Form Container */}
        <div className="tensile-entry-container">
          <div className="tensile-header">
            <div className="tensile-header-text">
              <h2>
                <Save size={28} style={{ color: '#5B9AA9' }} />
                Tensile Test - Entry Form
              </h2>
              <p>Record tensile test measurements and analysis</p>
            </div>
            <button onClick={handleReset} className="tensile-reset-btn">
              <RefreshCw size={18} />
              Reset
            </button>
          </div>

          {/* Entry Form */}
          <div className="tensile-card">
          <div className="tensile-form-grid">
            <div className="tensile-form-group">
              <label>Date of Inspection *</label>
              <DatePicker
                name="dateOfInspection"
                value={formData.dateOfInspection}
                onChange={handleChange}
              />
            </div>

            <div className="tensile-form-group">
              <label>Item *</label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                placeholder="e.g: Steel Rod"
              />
            </div>

            <div className="tensile-form-group">
              <label>Date & Heat Code *</label>
              <input
                type="text"
                name="dateHeatCode"
                value={formData.dateHeatCode}
                onChange={handleChange}
                placeholder="e.g: 2024-HC-001"
              />
            </div>

            <div className="tensile-form-group">
              <label>Dia (mm) *</label>
              <input
                type="number"
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 10.5"
              />
            </div>

            <div className="tensile-form-group">
              <label>Lo (mm) *</label>
              <input
                type="number"
                name="lo"
                value={formData.lo}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 50.0"
              />
            </div>

            <div className="tensile-form-group">
              <label>Li (mm) *</label>
              <input
                type="number"
                name="li"
                value={formData.li}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 52.5"
              />
            </div>

            <div className="tensile-form-group">
              <label>Breaking Load (kN) *</label>
              <input
                type="number"
                name="breakingLoad"
                value={formData.breakingLoad}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 45.5"
              />
            </div>

            <div className="tensile-form-group">
              <label>Yield Load *</label>
              <input
                type="number"
                name="yieldLoad"
                value={formData.yieldLoad}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 38.2"
              />
            </div>

            <div className="tensile-form-group">
              <label>UTS (N/mm²) *</label>
              <input
                type="number"
                name="uts"
                value={formData.uts}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 550"
              />
            </div>

            <div className="tensile-form-group">
              <label>YS (N/mm²) *</label>
              <input
                type="number"
                name="ys"
                value={formData.ys}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 460"
              />
            </div>

            <div className="tensile-form-group">
              <label>Elongation (%) *</label>
              <input
                type="number"
                name="elongation"
                value={formData.elongation}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 18.5"
              />
            </div>

            <div className="tensile-form-group full-width">
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

          <div className="tensile-submit-container">
            <button onClick={handleSubmit} disabled={submitLoading} className="tensile-submit-btn">
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </button>
          </div>
        </div>
        </div>

        {/* Report Container */}
        <div className="tensile-report-container">
          <h3 className="tensile-report-title">
            <Filter size={28} style={{ color: '#FF7F50' }} />
            Tensile Test - Report Card
          </h3>

          <div className="tensile-filter-grid">
            <div className="tensile-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="tensile-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="tensile-filter-btn-container">
              <button onClick={handleFilter} className="tensile-filter-btn">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          {loading ? (
            <div className="tensile-loader-container">
              <Loader />
            </div>
          ) : (
            <div className="tensile-table-container">
              <table className="tensile-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Heat Code</th>
                    <th>Dia(mm)</th>
                    <th>Lo(mm)</th>
                    <th>Li(mm)</th>
                    <th>Break Load</th>
                    <th>Yield Load</th>
                    <th>UTS</th>
                    <th>YS</th>
                    <th>Elongation</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="tensile-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{new Date(item.dateOfInspection).toLocaleDateString()}</td>
                        <td>{item.item}</td>
                        <td>{item.dateHeatCode}</td>
                        <td>{item.dia}</td>
                        <td>{item.lo}</td>
                        <td>{item.li}</td>
                        <td>{item.breakingLoad}</td>
                        <td>{item.yieldLoad}</td>
                        <td>{item.uts}</td>
                        <td>{item.ys}</td>
                        <td>{item.elongation}</td>
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

export default Tensile;
