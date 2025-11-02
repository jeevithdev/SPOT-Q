import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw, X, Loader2 } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import api from '../utils/api';
import '../styles/PageStyles/MicroStructureReport.css';

const MicroStructureReport = () => {
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
      disa: item.disa || '',
      insDate: item.insDate,
      partName: item.partName,
      dateCodeHeatCode: item.dateCodeHeatCode,
      nodularity: item.nodularity || '',
      graphiteType: item.graphiteType || '',
      countNos: item.countNos,
      size: item.size,
      ferritePercent: item.ferritePercent,
      pearlitePercent: item.pearlitePercent,
      carbidePercent: item.carbidePercent,
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/micro-structure/${editingItem._id}`, editFormData);
      
      if (data.success) {
        setShowEditModal(false);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating micro structure report:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const data = await api.delete(`/v1/micro-structure/${id}`);
        
        if (data.success) {
          fetchItems();
        }
      } catch (error) {
        console.error('Error deleting micro structure report:', error);
      }
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => {
      const itemDate = new Date(item.insDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return itemDate >= start && itemDate <= end;
    });

    setFilteredItems(filtered);
  };

  return (
    <div className="microstructure-container">
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
          <Button onClick={handleFilter} className="microstructure-filter-btn" type="button">
            <Filter size={18} />
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="microstructure-loader-container">
          <Loader2 size={40} className="animate-spin" />
        </div>
      ) : (
        <div className="microstructure-table-container">
          <table className="microstructure-table">
            <thead>
              <tr>
                <th>Disa</th>
                <th>Ins Date</th>
                <th>Part Name</th>
                <th>Heat Code</th>
                <th>Nodularity</th>
                <th>Graphite Type</th>
                <th>Count Nos</th>
                <th>Size</th>
                <th>Ferrite %</th>
                <th>Pearlite %</th>
                <th>Carbide %</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="13" className="microstructure-no-records">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{item.disa || '-'}</td>
                    <td>{new Date(item.insDate).toLocaleDateString()}</td>
                    <td>{item.partName}</td>
                    <td>{item.dateCodeHeatCode}</td>
                    <td>{item.nodularity || '-'}</td>
                    <td>{item.graphiteType || '-'}</td>
                    <td>{item.countNos}</td>
                    <td>{item.size}</td>
                    <td>{item.ferritePercent}</td>
                    <td>{item.pearlitePercent}</td>
                    <td>{item.carbidePercent}</td>
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
              <h2>Edit Micro Structure Entry</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="microstructure-form-grid">
                <div className="microstructure-form-group">
                  <label>Disa *</label>
                  <input
                    type="text"
                    name="disa"
                    value={editFormData.disa}
                    onChange={handleEditChange}
                    placeholder="e.g: DISA-001"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Inspection Date *</label>
                  <DatePicker
                    name="insDate"
                    value={editFormData.insDate}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Part Name *</label>
                  <input
                    type="text"
                    name="partName"
                    value={editFormData.partName}
                    onChange={handleEditChange}
                    placeholder="e.g: Engine Block"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Date Code & Heat Code *</label>
                  <input
                    type="text"
                    name="dateCodeHeatCode"
                    value={editFormData.dateCodeHeatCode}
                    onChange={handleEditChange}
                    placeholder="e.g: 2024-HC-001"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Nodularity *</label>
                  <input
                    type="text"
                    name="nodularity"
                    value={editFormData.nodularity}
                    onChange={handleEditChange}
                    placeholder="e.g: 85%"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Graphite Type *</label>
                  <input
                    type="text"
                    name="graphiteType"
                    value={editFormData.graphiteType}
                    onChange={handleEditChange}
                    placeholder="e.g: Spheroidal"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Count Nos *</label>
                  <input
                    type="number"
                    name="countNos"
                    value={editFormData.countNos}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Size *</label>
                  <input
                    type="text"
                    name="size"
                    value={editFormData.size}
                    onChange={handleEditChange}
                    placeholder="e.g: 50-100 μm"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Ferrite % *</label>
                  <input
                    type="number"
                    name="ferritePercent"
                    value={editFormData.ferritePercent}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Pearlite % *</label>
                  <input
                    type="number"
                    name="pearlitePercent"
                    value={editFormData.pearlitePercent}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Carbide % *</label>
                  <input
                    type="number"
                    name="carbidePercent"
                    value={editFormData.carbidePercent}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="microstructure-form-group full-width">
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={editFormData.remarks}
                    onChange={handleEditChange}
                    rows="3"
                  />
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
                className="modal-submit-btn" 
                onClick={handleUpdate}
                disabled={editLoading}
              >
                {editLoading ? 'Updating...' : 'Update Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MicroStructureReport;