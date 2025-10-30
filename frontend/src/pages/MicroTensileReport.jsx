import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/MicroTensileReport.css';

const MicroTensileReport = () => {
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
      const data = await api.get('/v1/micro-tensile-tests');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching micro tensile tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      dateOfInspection: item.dateOfInspection ? new Date(item.dateOfInspection).toISOString().split('T')[0] : '',
      item: item.item || '',
      dateCodeHeatCode: item.dateCodeHeatCode || '',
      barDia: item.barDia || '',
      gaugeLength: item.gaugeLength || '',
      maxLoad: item.maxLoad || '',
      yieldLoad: item.yieldLoad || '',
      tensileStrength: item.tensileStrength || '',
      yieldStrength: item.yieldStrength || '',
      elongation: item.elongation || '',
      remarks: item.remarks || '',
      testedBy: item.testedBy || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/micro-tensile-tests/${editingItem._id}`, editFormData);
      
      if (data.success) {
        alert('Micro tensile test entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating micro tensile test:', error);
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
      const data = await api.delete(`/v1/micro-tensile-tests/${id}`);
      
      if (data.success) {
        alert('Micro tensile test entry deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting micro tensile test:', error);
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
      const itemDate = new Date(item.dateOfInspection);
      return itemDate >= start && itemDate <= end;
    });
    
    setFilteredItems(filtered);
  };

  return (
    <div className="microtensile-report-container container">
      <div className="microtensile-report-wrapper">
        <div className="microtensile-report-title">
          <Filter size={20} style={{ color: '#FF7F50' }} />
          <h3>Micro Tensile Test - Report Card</h3>
        </div>

        <div className="microtensile-filter-grid">
          <div className="microtensile-filter-group">
            <label>Start Date</label>
            <DatePicker
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Select start date"
            />
          </div>

          <div className="microtensile-filter-group">
            <label>End Date</label>
            <DatePicker
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Select end date"
            />
          </div>

          <div className="microtensile-filter-btn-container">
            <Button onClick={handleFilter} className="microtensile-filter-btn" type="button">
              <Filter size={18} />
              Filter
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="microtensile-loader-container">
            <Loader />
          </div>
        ) : (
          <div className="microtensile-table-container table-wrapper">
            <table className="microtensile-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Item</th>
                  <th>Heat Code</th>
                  <th>Bar Dia</th>
                  <th>Gauge Len</th>
                  <th>Max Load</th>
                  <th>Yield Load</th>
                  <th>TS</th>
                  <th>YS</th>
                  <th>Elong %</th>
                  <th>Tested By</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="microtensile-no-records">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{new Date(item.dateOfInspection).toLocaleDateString()}</td>
                      <td>{item.item}</td>
                      <td>{item.dateCodeHeatCode}</td>
                      <td>{item.barDia}</td>
                      <td>{item.gaugeLength}</td>
                      <td>{item.maxLoad}</td>
                      <td>{item.yieldLoad}</td>
                      <td>{item.tensileStrength}</td>
                      <td>{item.yieldStrength}</td>
                      <td>{item.elongation}</td>
                      <td>{item.testedBy}</td>
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

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Micro Tensile Test Entry</h2>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="microtensile-form-grid">
                  <div className="microtensile-form-group">
                    <label>Date of Inspection *</label>
                    <DatePicker name="dateOfInspection" value={editFormData.dateOfInspection} onChange={handleEditChange} />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Item *</label>
                    <input type="text" name="item" value={editFormData.item} onChange={handleEditChange} />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Date Code & Heat Code *</label>
                    <input type="text" name="dateCodeHeatCode" value={editFormData.dateCodeHeatCode} onChange={handleEditChange} />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Bar Dia (mm) *</label>
                    <input type="number" name="barDia" value={editFormData.barDia} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Gauge Length (mm) *</label>
                    <input type="number" name="gaugeLength" value={editFormData.gaugeLength} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Max Load (Kgs) or KN *</label>
                    <input type="number" name="maxLoad" value={editFormData.maxLoad} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Yield Load (Kgs) or KN *</label>
                    <input type="number" name="yieldLoad" value={editFormData.yieldLoad} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Tensile Strength (Kg/mm² or Mpa) *</label>
                    <input type="number" name="tensileStrength" value={editFormData.tensileStrength} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Yield Strength (Kg/mm² or Mpa) *</label>
                    <input type="number" name="yieldStrength" value={editFormData.yieldStrength} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Elongation % *</label>
                    <input type="number" name="elongation" value={editFormData.elongation} onChange={handleEditChange} step="0.01" />
                  </div>
                  <div className="microtensile-form-group">
                    <label>Tested By *</label>
                    <input type="text" name="testedBy" value={editFormData.testedBy} onChange={handleEditChange} />
                  </div>
                  <div className="microtensile-form-group" style={{ gridColumn: '1 / -1' }}>
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

export default MicroTensileReport;
