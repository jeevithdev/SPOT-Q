import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import ValidationPopup from '../Components/ValidationPopup';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/Process.css';

const Process = () => {
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    heatCode: '',
    qtyOfMoulds: '',
    cPercent: '',
    siPercent: '',
    mnPercent: '',
    pPercent: '',
    sPercent: '',
    mgFlPercent: '',
    cuPercent: '',
    crPercent: '',
    timeOfPouring: '',
    pouringTemperature: '',
    resMgConvertorPercent: '',
    recMgPercent: '',
    streamInoculantGmsSec: '',
    pTimeSec: '',
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
      const data = await api.get('/v1/process-records');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching process records:', error);
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
    const required = ['date', 'partName', 'heatCode', 'qtyOfMoulds', 'cPercent', 'siPercent', 
                     'mnPercent', 'pPercent', 'sPercent', 'mgFlPercent', 'cuPercent', 'crPercent',
                     'timeOfPouring', 'pouringTemperature'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFields(true);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/process-records', formData);
      
      if (data.success) {
        alert('Process record created successfully!');
        setFormData({
          date: '', partName: '', heatCode: '', qtyOfMoulds: '',
          cPercent: '', siPercent: '', mnPercent: '', pPercent: '', sPercent: '',
          mgFlPercent: '', cuPercent: '', crPercent: '', timeOfPouring: '',
          pouringTemperature: '', resMgConvertorPercent: '', recMgPercent: '',
          streamInoculantGmsSec: '', pTimeSec: '', remarks: ''
        });
        fetchItems();
      }
    } catch (error) {
      console.error('Error creating process record:', error);
      alert('Failed to create entry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      partName: item.partName || '',
      heatCode: item.heatCode || '',
      qtyOfMoulds: item.qtyOfMoulds || '',
      cPercent: item.cPercent || '',
      siPercent: item.siPercent || '',
      mnPercent: item.mnPercent || '',
      pPercent: item.pPercent || '',
      sPercent: item.sPercent || '',
      mgFlPercent: item.mgFlPercent || '',
      cuPercent: item.cuPercent || '',
      crPercent: item.crPercent || '',
      timeOfPouring: item.timeOfPouring || '',
      pouringTemperature: item.pouringTemperature || '',
      resMgConvertorPercent: item.resMgConvertorPercent || '',
      recMgPercent: item.recMgPercent || '',
      streamInoculantGmsSec: item.streamInoculantGmsSec || '',
      pTimeSec: item.pTimeSec || '',
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/process-records/${editingItem._id}`, editFormData);
      
      if (data.success) {
        alert('Process record updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating process record:', error);
      alert('Failed to update entry: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    try {
      const data = await api.delete(`/v1/process-records/${id}`);
      
      if (data.success) {
        alert('Process record deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting process record:', error);
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
      date: '', partName: '', heatCode: '', qtyOfMoulds: '',
      cPercent: '', siPercent: '', mnPercent: '', pPercent: '', sPercent: '',
      mgFlPercent: '', cuPercent: '', crPercent: '', timeOfPouring: '',
      pouringTemperature: '', resMgConvertorPercent: '', recMgPercent: '',
      streamInoculantGmsSec: '', pTimeSec: '', remarks: ''
    });
  };

  return (
    <div className="process-container">
      <div className="process-wrapper">
        {showMissingFields && (
          <ValidationPopup
            missingFields={missingFields}
            onClose={() => setShowMissingFields(false)}
          />
        )}

        {/* Entry Form Container */}
        <div className="process-entry-container">
          <div className="process-header">
            <div className="process-header-text">
              <Save size={24} style={{ color: '#5B9AA9' }} />
              <h2>Process Record - Entry Form</h2>
            </div>
            <Button onClick={handleReset} className="process-reset-btn" variant="secondary">
              <RefreshCw size={18} />
              Reset
            </Button>
          </div>

          <div className="process-form-grid">
            {/* Basic Information */}
            <div className="process-form-group">
              <label>Date *</label>
              <DatePicker
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="process-form-group">
              <label>Part Name *</label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                placeholder="e.g: Cylinder Head"
              />
            </div>

            <div className="process-form-group">
              <label>Heat Code *</label>
              <input
                type="text"
                name="heatCode"
                value={formData.heatCode}
                onChange={handleChange}
                placeholder="e.g: HC-2024-001"
              />
            </div>

            <div className="process-form-group">
              <label>Qty of Moulds *</label>
              <input
                type="number"
                name="qtyOfMoulds"
                value={formData.qtyOfMoulds}
                onChange={handleChange}
                placeholder="e.g: 100"
              />
            </div>

            {/* Metal Composition Section */}
            <div className="section-separator">
              <h4 className="section-title">Metal Composition (%)</h4>
            </div>

            <div className="process-form-group">
              <label>C (Carbon) % *</label>
              <input
                type="number"
                name="cPercent"
                value={formData.cPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 3.5"
              />
            </div>

            <div className="process-form-group">
              <label>Si (Silicon) % *</label>
              <input
                type="number"
                name="siPercent"
                value={formData.siPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 2.5"
              />
            </div>

            <div className="process-form-group">
              <label>Mn (Manganese) % *</label>
              <input
                type="number"
                name="mnPercent"
                value={formData.mnPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.5"
              />
            </div>

            <div className="process-form-group">
              <label>P (Phosphorus) % *</label>
              <input
                type="number"
                name="pPercent"
                value={formData.pPercent}
                onChange={handleChange}
                step="0.001"
                placeholder="e.g: 0.05"
              />
            </div>

            <div className="process-form-group">
              <label>S (Sulfur) % *</label>
              <input
                type="number"
                name="sPercent"
                value={formData.sPercent}
                onChange={handleChange}
                step="0.001"
                placeholder="e.g: 0.02"
              />
            </div>

            <div className="process-form-group">
              <label>Mg (F/L) % *</label>
              <input
                type="number"
                name="mgFlPercent"
                value={formData.mgFlPercent}
                onChange={handleChange}
                step="0.001"
                placeholder="e.g: 0.045"
              />
            </div>

            <div className="process-form-group">
              <label>Cu (Copper) % *</label>
              <input
                type="number"
                name="cuPercent"
                value={formData.cuPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.8"
              />
            </div>

            <div className="process-form-group">
              <label>Cr (Chromium) % *</label>
              <input
                type="number"
                name="crPercent"
                value={formData.crPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.1"
              />
            </div>

            {/* Pouring Details Section */}
            <div className="section-separator">
              <h4 className="section-title">Pouring Details</h4>
            </div>

            <div className="process-form-group">
              <label>Time of Pouring *</label>
              <input
                type="time"
                name="timeOfPouring"
                value={formData.timeOfPouring}
                onChange={handleChange}
              />
            </div>

            <div className="process-form-group">
              <label>Pouring Temperature (°C) *</label>
              <input
                type="number"
                name="pouringTemperature"
                value={formData.pouringTemperature}
                onChange={handleChange}
                placeholder="e.g: 1450"
              />
            </div>

            <div className="process-form-group">
              <label>Res. Mg Convertor %</label>
              <input
                type="number"
                name="resMgConvertorPercent"
                value={formData.resMgConvertorPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.035"
              />
            </div>

            <div className="process-form-group">
              <label>Rec. of Mg %</label>
              <input
                type="number"
                name="recMgPercent"
                value={formData.recMgPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.04"
              />
            </div>

            <div className="process-form-group">
              <label>Stream Inoculant (gms/sec)</label>
              <input
                type="number"
                name="streamInoculantGmsSec"
                value={formData.streamInoculantGmsSec}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g: 5.5"
              />
            </div>

            <div className="process-form-group">
              <label>P.Time (sec)</label>
              <input
                type="number"
                name="pTimeSec"
                value={formData.pTimeSec}
                onChange={handleChange}
                placeholder="e.g: 30"
              />
            </div>

            {/* Remarks */}
            <div className="process-form-group" style={{ gridColumn: '1 / -1' }}>
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

          <div className="process-submit-container">
            <Button onClick={handleSubmit} disabled={submitLoading} className="process-submit-btn" type="button">
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </Button>
          </div>
        </div>

        {/* Report Container */}
        <div className="process-report-container">
          <div className="process-report-title">
            <Filter size={20} style={{ color: '#FF7F50' }} />
            <h3>Process Record - Report</h3>
          </div>

          <div className="process-filter-grid">
            <div className="process-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="process-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="process-filter-btn-container">
              <Button onClick={handleFilter} className="process-filter-btn" type="button">
                <Filter size={18} />
                Filter
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="process-loader-container">
              <Loader />
            </div>
          ) : (
            <div className="process-table-container">
              <table className="process-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Part Name</th>
                    <th>Heat Code</th>
                    <th>Qty Moulds</th>
                    <th>C %</th>
                    <th>Si %</th>
                    <th>Mn %</th>
                    <th>P %</th>
                    <th>S %</th>
                    <th>Mg(F/L) %</th>
                    <th>Cu %</th>
                    <th>Cr %</th>
                    <th>Pour Time</th>
                    <th>Pour Temp</th>
                    <th>Res.Mg %</th>
                    <th>Rec.Mg %</th>
                    <th>Stream In.</th>
                    <th>P.Time</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="20" className="process-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.partName}</td>
                        <td>{item.heatCode}</td>
                        <td>{item.qtyOfMoulds}</td>
                        <td>{item.cPercent}</td>
                        <td>{item.siPercent}</td>
                        <td>{item.mnPercent}</td>
                        <td>{item.pPercent}</td>
                        <td>{item.sPercent}</td>
                        <td>{item.mgFlPercent}</td>
                        <td>{item.cuPercent}</td>
                        <td>{item.crPercent}</td>
                        <td>{item.timeOfPouring}</td>
                        <td>{item.pouringTemperature}°C</td>
                        <td>{item.resMgConvertorPercent || '-'}</td>
                        <td>{item.recMgPercent || '-'}</td>
                        <td>{item.streamInoculantGmsSec || '-'}</td>
                        <td>{item.pTimeSec || '-'}</td>
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
                <h2>Edit Process Record</h2>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="process-form-grid">
                  <div className="process-form-group">
                    <label>Date *</label>
                    <DatePicker name="date" value={editFormData.date} onChange={handleEditChange} />
                  </div>

                  <div className="process-form-group">
                    <label>Part Name *</label>
                    <input type="text" name="partName" value={editFormData.partName} onChange={handleEditChange} />
                  </div>

                  <div className="process-form-group">
                    <label>Heat Code *</label>
                    <input type="text" name="heatCode" value={editFormData.heatCode} onChange={handleEditChange} />
                  </div>

                  <div className="process-form-group">
                    <label>Qty of Moulds *</label>
                    <input type="number" name="qtyOfMoulds" value={editFormData.qtyOfMoulds} onChange={handleEditChange} />
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>Metal Composition (%)</h4>
                  </div>

                  <div className="process-form-group">
                    <label>C %</label>
                    <input type="number" name="cPercent" value={editFormData.cPercent} onChange={handleEditChange} step="0.01" />
                  </div>

                  <div className="process-form-group">
                    <label>Si %</label>
                    <input type="number" name="siPercent" value={editFormData.siPercent} onChange={handleEditChange} step="0.01" />
                  </div>

                  <div className="process-form-group">
                    <label>Mn %</label>
                    <input type="number" name="mnPercent" value={editFormData.mnPercent} onChange={handleEditChange} step="0.01" />
                  </div>

                  <div className="process-form-group">
                    <label>P %</label>
                    <input type="number" name="pPercent" value={editFormData.pPercent} onChange={handleEditChange} step="0.001" />
                  </div>

                  <div className="process-form-group">
                    <label>S %</label>
                    <input type="number" name="sPercent" value={editFormData.sPercent} onChange={handleEditChange} step="0.001" />
                  </div>

                  <div className="process-form-group">
                    <label>Mg (F/L) %</label>
                    <input type="number" name="mgFlPercent" value={editFormData.mgFlPercent} onChange={handleEditChange} step="0.001" />
                  </div>

                  <div className="process-form-group">
                    <label>Cu %</label>
                    <input type="number" name="cuPercent" value={editFormData.cuPercent} onChange={handleEditChange} step="0.01" />
                  </div>

                  <div className="process-form-group">
                    <label>Cr %</label>
                    <input type="number" name="crPercent" value={editFormData.crPercent} onChange={handleEditChange} step="0.01" />
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: 0 }}>Pouring Details</h4>
                  </div>

                  <div className="process-form-group">
                    <label>Time of Pouring</label>
                    <input type="time" name="timeOfPouring" value={editFormData.timeOfPouring} onChange={handleEditChange} />
                  </div>

                  <div className="process-form-group">
                    <label>Pouring Temperature (°C)</label>
                    <input type="number" name="pouringTemperature" value={editFormData.pouringTemperature} onChange={handleEditChange} />
                  </div>

                  <div className="process-form-group">
                    <label>Res. Mg Convertor %</label>
                    <input type="number" name="resMgConvertorPercent" value={editFormData.resMgConvertorPercent} onChange={handleEditChange} step="0.01" />
                  </div>

                  <div className="process-form-group">
                    <label>Rec. of Mg %</label>
                    <input type="number" name="recMgPercent" value={editFormData.recMgPercent} onChange={handleEditChange} step="0.01" />
                  </div>

                  <div className="process-form-group">
                    <label>Stream Inoculant (gms/sec)</label>
                    <input type="number" name="streamInoculantGmsSec" value={editFormData.streamInoculantGmsSec} onChange={handleEditChange} step="0.1" />
                  </div>

                  <div className="process-form-group">
                    <label>P.Time (sec)</label>
                    <input type="number" name="pTimeSec" value={editFormData.pTimeSec} onChange={handleEditChange} />
                  </div>

                  <div className="process-form-group" style={{ gridColumn: '1 / -1' }}>
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

export default Process;
