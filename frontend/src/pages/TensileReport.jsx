import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw, X, Loader2 } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import api from '../utils/api';
import '../styles/PageStyles/TensileReport.css';

const TensileReport = () => {
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
      dateOfInspection: item.dateOfInspection,
      item: item.item,
      date: item.date,
      heatCode: item.heatCode,
      dia: item.dia,
      lo: item.lo,
      li: item.li,
      breakingLoad: item.breakingLoad,
      yieldLoad: item.yieldLoad,
      uts: item.uts,
      ys: item.ys,
      elongation: item.elongation,
      testedBy: item.testedBy,
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/tensile-tests/${editingItem._id}`, editFormData);
      
      if (data.success) {
        setShowEditModal(false);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating tensile test:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const data = await api.delete(`/v1/tensile-tests/${id}`);
        
        if (data.success) {
          fetchItems();
        }
      } catch (error) {
        console.error('Error deleting tensile test:', error);
      }
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => {
      const itemDate = new Date(item.dateOfInspection);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return itemDate >= start && itemDate <= end;
    });

    setFilteredItems(filtered);
  };

  return (
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
          <Button onClick={handleFilter} className="tensile-filter-btn" type="button">
            <Filter size={18} />
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="tensile-loader-container">
          <Loader2 size={40} className="animate-spin" />
        </div>
      ) : (
        <div className="tensile-table-container">
          <table className="tensile-table">
            <thead>
              <tr>
                <th className="sticky-date">Inspection Date</th>
                <th className="sticky-item">Item</th>
                <th>Date</th>
                <th>Heat Code</th>
                <th>Dia(mm)</th>
                <th>Lo(mm)</th>
                <th>Li(mm)</th>
                <th>Break Load</th>
                <th>Yield Load</th>
                <th>UTS</th>
                <th>YS</th>
                <th>Elongation</th>
                <th>TestedBy</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="15" className="tensile-no-records">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item._id || index}>
                    <td className="sticky-date">{new Date(item.dateOfInspection).toLocaleDateString()}</td>
                    <td className="sticky-item">{item.item}</td>
                    <td>{item.date}</td>
                    <td>{item.heatCode}</td>
                    <td>{item.dia}</td>
                    <td>{item.lo}</td>
                    <td>{item.li}</td>
                    <td>{item.breakingLoad}</td>
                    <td>{item.yieldLoad}</td>
                    <td>{item.uts}</td>
                    <td>{item.ys}</td>
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
              <h2>Edit Tensile Test Entry</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="tensile-form-grid">
                <div className="tensile-form-group">
                  <label>Date of Inspection *</label>
                  <DatePicker
                    name="dateOfInspection"
                    value={editFormData.dateOfInspection}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Item *</label>
                  <input
                    type="text"
                    name="item"
                    value={editFormData.item}
                    onChange={handleEditChange}
                    placeholder="e.g: Steel Rod"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Date *</label>
                  <input
                    type="text"
                    name="date"
                    value={editFormData.date}
                    onChange={handleEditChange}
                    placeholder="e.g: 2024-10-30"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Heat Code *</label>
                  <input
                    type="text"
                    name="heatCode"
                    value={editFormData.heatCode}
                    onChange={handleEditChange}
                    placeholder="e.g: HC-001"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Dia (mm) *</label>
                  <input
                    type="number"
                    name="dia"
                    value={editFormData.dia}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Lo (mm) *</label>
                  <input
                    type="number"
                    name="lo"
                    value={editFormData.lo}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Li (mm) *</label>
                  <input
                    type="number"
                    name="li"
                    value={editFormData.li}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Breaking Load (kN) *</label>
                  <input
                    type="number"
                    name="breakingLoad"
                    value={editFormData.breakingLoad}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Yield Load *</label>
                  <input
                    type="number"
                    name="yieldLoad"
                    value={editFormData.yieldLoad}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>UTS (N/mm²) *</label>
                  <input
                    type="number"
                    name="uts"
                    value={editFormData.uts}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>YS (N/mm²) *</label>
                  <input
                    type="number"
                    name="ys"
                    value={editFormData.ys}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Elongation (%) *</label>
                  <input
                    type="number"
                    name="elongation"
                    value={editFormData.elongation}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                 <div className="tensile-form-group">
                  <label>TestedBy *</label>
                  <input
                    type="text"
                    name="testedBy"
                    value={editFormData.testedBy}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group full-width">
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

export default TensileReport;
