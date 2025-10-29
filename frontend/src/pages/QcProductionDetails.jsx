import React, { useState, useEffect } from 'react';
import { Save, Filter, RefreshCw, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import ValidationPopup from '../Components/ValidationPopup';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/QcProductionDetails.css';

const QcProductionDetails = () => {
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    noOfMoulds: '',
    cPercent: '',
    siPercent: '',
    mnPercent: '',
    pPercent: '',
    sPercent: '',
    mgPercent: '',
    cuPercent: '',
    crPercent: '',
    nodularityGraphiteType: '',
    pearliteFerrite: '',
    hardnessBHN: '',
    tsYsEl: ''
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
      const data = await api.get('/v1/qc-reports');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching QC reports:', error);
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
    const required = ['date', 'partName', 'noOfMoulds', 'cPercent', 'siPercent', 'mnPercent',
                     'pPercent', 'sPercent', 'mgPercent', 'cuPercent', 'crPercent',
                     'nodularityGraphiteType', 'pearliteFerrite', 'hardnessBHN', 'tsYsEl'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFields(true);
      return;
    }

    try {
      setSubmitLoading(true);
      const data = await api.post('/v1/qc-reports', formData);
      
      if (data.success) {
        alert('QC Production report created successfully!');
        setFormData({
          date: '', partName: '', noOfMoulds: '', cPercent: '', siPercent: '', mnPercent: '',
          pPercent: '', sPercent: '', mgPercent: '', cuPercent: '', crPercent: '',
          nodularityGraphiteType: '', pearliteFerrite: '', hardnessBHN: '', tsYsEl: ''
        });
        fetchItems();
      }
    } catch (error) {
      console.error('Error creating QC report:', error);
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
      noOfMoulds: item.noOfMoulds || '',
      cPercent: item.cPercent || '',
      siPercent: item.siPercent || '',
      mnPercent: item.mnPercent || '',
      pPercent: item.pPercent || '',
      sPercent: item.sPercent || '',
      mgPercent: item.mgPercent || '',
      cuPercent: item.cuPercent || '',
      crPercent: item.crPercent || '',
      nodularityGraphiteType: item.nodularityGraphiteType || '',
      pearliteFerrite: item.pearliteFerrite || '',
      hardnessBHN: item.hardnessBHN || '',
      tsYsEl: item.tsYsEl || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/qc-reports/${editingItem._id}`, editFormData);
      
      if (data.success) {
        alert('QC Production entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating QC report:', error);
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
      const data = await api.delete(`/v1/qc-reports/${id}`);
      
      if (data.success) {
        alert('QC Production entry deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting QC report:', error);
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
      date: '', partName: '', noOfMoulds: '', cPercent: '', siPercent: '', mnPercent: '',
      pPercent: '', sPercent: '', mgPercent: '', cuPercent: '', crPercent: '',
      nodularityGraphiteType: '', pearliteFerrite: '', hardnessBHN: '', tsYsEl: ''
    });
  };

  return (
    <div className="qcproduction-container">
      <div className="qcproduction-wrapper">
        {showMissingFields && (
          <ValidationPopup
            missingFields={missingFields}
            onClose={() => setShowMissingFields(false)}
          />
        )}

        {/* Entry Form Container */}
        <div className="qcproduction-entry-container">
          <div className="qcproduction-header">
            <div className="qcproduction-header-text">
              <Save size={24} style={{ color: '#5B9AA9' }} />
              <h2>QC Production Details - Entry Form</h2>
            </div>
            <Button onClick={handleReset} className="qcproduction-reset-btn" variant="secondary">
              <RefreshCw size={18} />
              Reset
            </Button>
          </div>

          <div className="qcproduction-form-grid">
            <div className="qcproduction-form-group">
              <label>Date *</label>
              <DatePicker
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Part Name *</label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                placeholder="e.g: Brake Disc"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>No. of Moulds *</label>
              <input
                type="number"
                name="noOfMoulds"
                value={formData.noOfMoulds}
                onChange={handleChange}
                placeholder="e.g: 5"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>C % *</label>
              <input
                type="number"
                name="cPercent"
                value={formData.cPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 3.5"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Si % *</label>
              <input
                type="number"
                name="siPercent"
                value={formData.siPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 2.5"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Mn % *</label>
              <input
                type="number"
                name="mnPercent"
                value={formData.mnPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.5"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>P % *</label>
              <input
                type="number"
                name="pPercent"
                value={formData.pPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.05"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>S % *</label>
              <input
                type="number"
                name="sPercent"
                value={formData.sPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.03"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Mg % *</label>
              <input
                type="number"
                name="mgPercent"
                value={formData.mgPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.04"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Cu % *</label>
              <input
                type="number"
                name="cuPercent"
                value={formData.cuPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.5"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Cr % *</label>
              <input
                type="number"
                name="crPercent"
                value={formData.crPercent}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g: 0.2"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Nodularity / Graphite Type *</label>
              <input
                type="text"
                name="nodularityGraphiteType"
                value={formData.nodularityGraphiteType}
                onChange={handleChange}
                placeholder="e.g: Type VI"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Pearlite Ferrite *</label>
              <input
                type="text"
                name="pearliteFerrite"
                value={formData.pearliteFerrite}
                onChange={handleChange}
                placeholder="e.g: 80/20"
              />
            </div>

            <div className="qcproduction-form-group">
              <label>Hardness BHN *</label>
              <input
                type="number"
                name="hardnessBHN"
                value={formData.hardnessBHN}
                onChange={handleChange}
                placeholder="e.g: 220"
              />
            </div>

            <div className="qcproduction-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>TS/YS/EL *</label>
              <input
                type="text"
                name="tsYsEl"
                value={formData.tsYsEl}
                onChange={handleChange}
                placeholder="e.g: 550/460/18"
              />
            </div>
          </div>

          <div className="qcproduction-submit-container">
            <Button onClick={handleSubmit} disabled={submitLoading} className="qcproduction-submit-btn" type="button">
              {submitLoading ? <Loader size={20} /> : <Save size={20} />}
              {submitLoading ? 'Saving...' : 'Submit Entry'}
            </Button>
          </div>
        </div>

        {/* Report Container */}
        <div className="qcproduction-report-container">
          <div className="qcproduction-report-title">
            <Filter size={20} style={{ color: '#FF7F50' }} />
            <h3>QC Production - Report Card</h3>
          </div>

          <div className="qcproduction-filter-grid">
            <div className="qcproduction-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="qcproduction-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="qcproduction-filter-btn-container">
              <Button onClick={handleFilter} className="qcproduction-filter-btn" type="button">
                <Filter size={18} />
                Filter
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="qcproduction-loader-container">
              <Loader />
            </div>
          ) : (
            <div className="qcproduction-table-container">
              <table className="qcproduction-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Part Name</th>
                    <th>Moulds</th>
                    <th>C %</th>
                    <th>Si %</th>
                    <th>Mn %</th>
                    <th>P %</th>
                    <th>S %</th>
                    <th>Mg %</th>
                    <th>Cu %</th>
                    <th>Cr %</th>
                    <th>Nodularity</th>
                    <th>P/F</th>
                    <th>BHN</th>
                    <th>TS/YS/EL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="16" className="qcproduction-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.partName}</td>
                        <td>{item.noOfMoulds}</td>
                        <td>{item.cPercent}</td>
                        <td>{item.siPercent}</td>
                        <td>{item.mnPercent}</td>
                        <td>{item.pPercent}</td>
                        <td>{item.sPercent}</td>
                        <td>{item.mgPercent}</td>
                        <td>{item.cuPercent}</td>
                        <td>{item.crPercent}</td>
                        <td>{item.nodularityGraphiteType}</td>
                        <td>{item.pearliteFerrite}</td>
                        <td>{item.hardnessBHN}</td>
                        <td>{item.tsYsEl}</td>
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
                <h2>Edit QC Production Entry</h2>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="qcproduction-form-grid">
                  <div className="qcproduction-form-group">
                    <label>Date *</label>
                    <DatePicker name="date" value={editFormData.date} onChange={handleEditChange} />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>Part Name *</label>
                    <input type="text" name="partName" value={editFormData.partName} onChange={handleEditChange} />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>No. of Moulds *</label>
                    <input type="number" name="noOfMoulds" value={editFormData.noOfMoulds} onChange={handleEditChange} />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>C % *</label>
                    <input type="number" name="cPercent" value={editFormData.cPercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>Si % *</label>
                    <input type="number" name="siPercent" value={editFormData.siPercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>Mn % *</label>
                    <input type="number" name="mnPercent" value={editFormData.mnPercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>P % *</label>
                    <input type="number" name="pPercent" value={editFormData.pPercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>S % *</label>
                    <input type="number" name="sPercent" value={editFormData.sPercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>Mg % *</label>
                    <input type="number" name="mgPercent" value={editFormData.mgPercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>Cu % *</label>
                    <input type="number" name="cuPercent" value={editFormData.cuPercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>Cr % *</label>
                    <input type="number" name="crPercent" value={editFormData.crPercent} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>Nodularity / Graphite Type *</label>
                    <input type="text" name="nodularityGraphiteType" value={editFormData.nodularityGraphiteType} onChange={handleEditChange} />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>Pearlite Ferrite *</label>
                    <input type="text" name="pearliteFerrite" value={editFormData.pearliteFerrite} onChange={handleEditChange} />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>Hardness (BHN) *</label>
                    <input type="number" name="hardnessBHN" value={editFormData.hardnessBHN} onChange={handleEditChange} />
                  </div>
                  <div className="qcproduction-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>TS/YS/EL *</label>
                    <input type="text" name="tsYsEl" value={editFormData.tsYsEl} onChange={handleEditChange} />
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

export default QcProductionDetails;
