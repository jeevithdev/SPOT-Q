import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/QcProductionDetails.css';

const QcProductionReport = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const QcProductionTabs = () => (
    <div className="qcproduction-tabs-container">
      <div className="qcproduction-tabs">
        <Link
          to="/qc-production-details/data-entry"
          className={`qcproduction-tab ${isActive('/qc-production-details/data-entry') ? 'active' : ''}`}
        >
          Data Entry
        </Link>
        <Link
          to="/qc-production-details/report"
          className={`qcproduction-tab ${isActive('/qc-production-details/report') ? 'active' : ''}`}
        >
          Report
        </Link>
      </div>
    </div>
  );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
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
      const data = await api.get('/v1/qcproduction');
      if (data.success) {
        setItems(data.data);
        setFilteredItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching QC production data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const filtered = items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    
    setFilteredItems(filtered);
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/qcproduction/${editingItem._id}`, editFormData);
      
      if (data.success) {
        alert('QC production entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating QC production entry:', error);
      alert('Failed to update entry: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const data = await api.delete(`/v1/qcproduction/${id}`);
        if (data.success) {
          alert('QC production entry deleted successfully!');
          fetchItems();
        }
      } catch (error) {
        console.error('Error deleting QC production entry:', error);
        alert('Failed to delete entry: ' + error.message);
      }
    }
  };

  return (
    <div className="qcproduction-container">
      <QcProductionTabs />
      <div className="qcproduction-wrapper">

        {/* Report Container */}
        <div className="qcproduction-report-container">
          <div className="qcproduction-header">
            <h2>QC Production - Report Card</h2>
            <Button onClick={fetchItems} className="qcproduction-refresh-btn" type="button">
              <RefreshCw size={20} />
              Refresh
            </Button>
          </div>

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
                    <label>Hardness BHN *</label>
                    <input type="number" name="hardnessBHN" value={editFormData.hardnessBHN} onChange={handleEditChange} />
                  </div>
                  <div className="qcproduction-form-group">
                    <label>TS/YS/EL *</label>
                    <input type="text" name="tsYsEl" value={editFormData.tsYsEl} onChange={handleEditChange} />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="modal-cancel-btn" 
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button 
                  className="modal-save-btn" 
                  onClick={handleUpdate}
                  disabled={editLoading}
                >
                  {editLoading ? <Loader size={16} /> : 'Update Entry'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QcProductionReport;
