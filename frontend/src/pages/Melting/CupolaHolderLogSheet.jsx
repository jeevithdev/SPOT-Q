import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../../Components/Buttons';
import ValidationPopup from '../../Components/ValidationPopup';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/CupolaHolderLogSheet.css';

const CupolaHolderLogSheet = () => {
  const [formData, setFormData] = useState({
    date: '',
    heatNo: '',
    // Additions
    cpc: '',
    mFeSl: '',
    feMn: '',
    sic: '',
    pureMg: '',
    cu: '',
    feCr: '',
    // Tapping
    actualTime: '',
    tappingTime: '',
    tappingTemp: '',
    metalKg: '',
    // Pouring
    disaLine: '',
    indFur: '',
    bailNo: '',
    // Electrical
    tap: '',
    kw: '',
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
  
  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.get('/v1/cupola-holder-logs');
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching cupola holder logs:', error);
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const required = ['date', 'heatNo'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFields(true);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/cupola-holder-logs', formData);
      if (data.success) {
        alert('Cupola holder log entry created successfully!');
        handleReset();
        fetchItems();
      }
    } catch (error) {
      console.error('Error creating cupola holder log:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      heatNo: item.heatNo || '',
      ...item
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/cupola-holder-logs/${editingItem._id}`, editFormData);
      if (data.success) {
        alert('Cupola holder log entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating cupola holder log:', error);
      alert('Failed to update entry: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const data = await api.delete(`/v1/cupola-holder-logs/${id}`);
      if (data.success) {
        alert('Cupola holder log entry deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting cupola holder log:', error);
      alert('Failed to delete entry: ' + error.message);
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
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    setFilteredItems(filtered);
  };

  const handleReset = () => {
    setFormData({
      date: '', heatNo: '', cpc: '', mFeSl: '', feMn: '', sic: '',
      pureMg: '', cu: '', feCr: '', actualTime: '', tappingTime: '',
      tappingTemp: '', metalKg: '', disaLine: '', indFur: '', bailNo: '',
      tap: '', kw: '', remarks: ''
    });
  };

  return (
    <div className="cupola-holder-container container">
      <div className="cupola-holder-wrapper">
        {showMissingFields && (
          <ValidationPopup
            missingFields={missingFields}
            onClose={() => setShowMissingFields(false)}
          />
        )}

        {/* Entry Form Container */}
        <div className="cupola-holder-entry-container">
          <div className="cupola-holder-header">
            <div className="cupola-holder-header-text">
              <Save size={24} style={{ color: '#5B9AA9' }} />
              <h2>Cupola Holder Log Sheet - Entry Form</h2>
            </div>
            <Button onClick={handleReset} className="cupola-holder-reset-btn" variant="secondary">
              <RefreshCw size={18} />
              Reset
            </Button>
          </div>

          <div className="cupola-holder-form-grid">
            {/* Basic Information */}
            <div className="cupola-holder-form-group">
              <label>Date *</label>
              <DatePicker name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div className="cupola-holder-form-group">
              <label>Heat No *</label>
              <input
                type="text"
                name="heatNo"
                value={formData.heatNo}
                onChange={handleChange}
                placeholder="e.g: H2024-001"
              />
            </div>

            {/* Additions Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Additions (All in kgs)
              </h4>
            </div>

            <div className="cupola-holder-form-group">
              <label>CPC (kgs)</label>
              <input
                type="number"
                name="cpc"
                value={formData.cpc}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>M Fe Sl (kgs)</label>
              <input
                type="number"
                name="mFeSl"
                value={formData.mFeSl}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Fe Mn (kgs)</label>
              <input
                type="number"
                name="feMn"
                value={formData.feMn}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>SiC (kgs)</label>
              <input
                type="number"
                name="sic"
                value={formData.sic}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Pure Mg (kgs)</label>
              <input
                type="number"
                name="pureMg"
                value={formData.pureMg}
                onChange={handleChange}
                step="0.01"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Cu (kgs)</label>
              <input
                type="number"
                name="cu"
                value={formData.cu}
                onChange={handleChange}
                step="0.01"
                placeholder="0"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Fe Cr (kgs)</label>
              <input
                type="number"
                name="feCr"
                value={formData.feCr}
                onChange={handleChange}
                step="0.1"
                placeholder="0"
              />
            </div>

            {/* Tapping Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Tapping Details
              </h4>
            </div>

            <div className="cupola-holder-form-group">
              <label>Actual Time</label>
              <input
                type="time"
                name="actualTime"
                value={formData.actualTime}
                onChange={handleChange}
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Tapping Time</label>
              <input
                type="time"
                name="tappingTime"
                value={formData.tappingTime}
                onChange={handleChange}
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Tapping Temp (°C)</label>
              <input
                type="number"
                name="tappingTemp"
                value={formData.tappingTemp}
                onChange={handleChange}
                placeholder="e.g: 1500"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>Metal (KG)</label>
              <input
                type="number"
                name="metalKg"
                value={formData.metalKg}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g: 2000"
              />
            </div>

            {/* Pouring Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Pouring Details
              </h4>
            </div>

            <div className="cupola-holder-form-group">
              <label>DISA LINE</label>
              <input
                type="text"
                name="disaLine"
                value={formData.disaLine}
                onChange={handleChange}
                placeholder="e.g: DISA-1"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>IND FUR</label>
              <input
                type="text"
                name="indFur"
                value={formData.indFur}
                onChange={handleChange}
                placeholder="e.g: IND-FUR-1"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>BAIL NO</label>
              <input
                type="text"
                name="bailNo"
                value={formData.bailNo}
                onChange={handleChange}
                placeholder="e.g: BAIL-001"
              />
            </div>

            {/* Electrical Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>
                Electrical Readings
              </h4>
            </div>

            <div className="cupola-holder-form-group">
              <label>TAP</label>
              <input
                type="text"
                name="tap"
                value={formData.tap}
                onChange={handleChange}
                placeholder="Enter TAP value"
              />
            </div>

            <div className="cupola-holder-form-group">
              <label>KW</label>
              <input
                type="number"
                name="kw"
                value={formData.kw}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g: 2500"
              />
            </div>

            {/* Remarks */}
            <div className="cupola-holder-form-group" style={{ gridColumn: '1 / -1' }}>
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

          <div className="cupola-holder-submit-container">
            <Button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="cupola-holder-submit-btn"
              type="button"
            >
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </Button>
          </div>
        </div>

        {/* Report Container */}
        <div className="cupola-holder-report-container">
          <div className="cupola-holder-report-title">
            <Filter size={20} style={{ color: '#FF7F50' }} />
            <h3>Cupola Holder Log - Report</h3>
          </div>

          <div className="cupola-holder-filter-grid">
            <div className="cupola-holder-filter-group">
              <label>Start Date</label>
              <DatePicker value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Select start date" />
            </div>

            <div className="cupola-holder-filter-group">
              <label>End Date</label>
              <DatePicker value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Select end date" />
            </div>

            <div className="cupola-holder-filter-btn-container">
              <Button onClick={handleFilter} className="cupola-holder-filter-btn" type="button">
                <Filter size={18} />
                Filter
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="cupola-holder-loader-container">
              <Loader />
            </div>
          ) : (
            <div className="cupola-holder-table-container table-wrapper">
              <table className="cupola-holder-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Heat No</th>
                    <th>Tapping Time</th>
                    <th>Tapping Temp</th>
                    <th>Metal (KG)</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="cupola-holder-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.heatNo}</td>
                        <td>{item.tappingTime || '-'}</td>
                        <td>{item.tappingTemp || '-'}</td>
                        <td>{item.metalKg || '-'}</td>
                        <td>{item.remarks || '-'}</td>
                        <td style={{ minWidth: '100px' }}>
                          <EditActionButton onClick={() => handleEdit(item)} />
                          <DeleteActionButton onClick={() => handleDelete(item._id)} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Cupola Holder Log Entry</h2>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="cupola-holder-form-grid">
                  <div className="cupola-holder-form-group">
                    <label>Date *</label>
                    <DatePicker name="date" value={editFormData.date} onChange={handleEditChange} />
                  </div>
                  <div className="cupola-holder-form-group">
                    <label>Heat No *</label>
                    <input type="text" name="heatNo" value={editFormData.heatNo} onChange={handleEditChange} />
                  </div>
                  <div className="cupola-holder-form-group">
                    <label>Tapping Time</label>
                    <input type="time" name="tappingTime" value={editFormData.tappingTime} onChange={handleEditChange} />
                  </div>
                  <div className="cupola-holder-form-group">
                    <label>Tapping Temp</label>
                    <input type="number" name="tappingTemp" value={editFormData.tappingTemp} onChange={handleEditChange} />
                  </div>
                  <div className="cupola-holder-form-group">
                    <label>Metal (KG)</label>
                    <input type="number" name="metalKg" value={editFormData.metalKg} onChange={handleEditChange} />
                  </div>
                  <div className="cupola-holder-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Remarks</label>
                    <textarea name="remarks" value={editFormData.remarks} onChange={handleEditChange} rows="3" />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="modal-cancel-btn" onClick={() => setShowEditModal(false)} disabled={editLoading}>
                  Cancel
                </button>
                <button className="modal-submit-btn" onClick={handleUpdate} disabled={editLoading}>
                  {editLoading ? 'Updating...' : 'Update Entry'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CupolaHolderLogSheet;


