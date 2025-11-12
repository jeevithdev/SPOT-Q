import React, { useState, useEffect } from 'react';
import { X, PencilLine, BookOpenCheck } from 'lucide-react';
import { DatePicker, EditActionButton, DeleteActionButton, FilterButton } from '../Components/Buttons';
import Loader from '../Components/Loader';
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
      dateOfInspection: item.dateOfInspection ? new Date(item.dateOfInspection).toISOString().split('T')[0] : '',
      item: item.item || '',
      dateCode: item.dateCode || '',
      heatCode: item.heatCode || '',
      dia: item.dia || '',
      lo: item.lo || '',
      li: item.li || '',
      breakingLoad: item.breakingLoad || '',
      yieldLoad: item.yieldLoad || '',
      uts: item.uts || '',
      ys: item.ys || '',
      elongation: item.elongation || '',
      remarks: item.remarks || '',
      testedBy: item.testedBy || ''
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
      alert('Failed to update entry: ' + (error.message || 'Unknown error'));
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
        alert('Failed to delete entry: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleFilter = () => {
    if (!startDate) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => {
      if (!item.dateOfInspection) return false;
      const itemDate = new Date(item.dateOfInspection);
      itemDate.setHours(0, 0, 0, 0);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      // If end date is provided, filter by date range
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return itemDate >= start && itemDate <= end;
      } else {
        // If only start date is provided, show only records from that exact date
        return itemDate.getTime() === start.getTime();
      }
    });

    setFilteredItems(filtered);
  };

  return (
    <>
      <div className="tensile-report-header">
        <div className="tensile-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Tensile Test - Report
          </h2>
        </div>
      </div>

      <div className="impact-filter-container">
        <div className="impact-filter-group">
          <label>Start Date</label>
          <DatePicker
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Select start date"
          />
        </div>
        <div className="impact-filter-group">
          <label>End Date</label>
          <DatePicker
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Select end date"
          />
        </div>
        <FilterButton onClick={handleFilter} disabled={!startDate}>
          Filter
        </FilterButton>
      </div>

      {loading ? (
        <div className="impact-loader-container">
          <Loader />
        </div>
      ) : (
        <div className="impact-details-card">
          <div className="impact-table-container">
            <table className="impact-table">
              <thead>
                <tr>
                  <th>Date Of Inspection</th>
                  <th>Item</th>
                  <th>Date Code</th>
                  <th>Heat Code</th>
                  <th>Dia (mm)</th>
                  <th>Lo (mm)</th>
                  <th>Li (mm)</th>
                  <th>Breaking Load (kN)</th>
                  <th>Yield Load (kN)</th>
                  <th>UTS (N/mm²)</th>
                  <th>YS (N/mm²)</th>
                  <th>Elongation (%)</th>
                  <th>Tested By</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="15" className="impact-no-records">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{item.dateOfInspection ? new Date(item.dateOfInspection).toLocaleDateString() : '-'}</td>
                      <td>{item.item || '-'}</td>
                      <td>{item.dateCode || '-'}</td>
                      <td>{item.heatCode || '-'}</td>
                      <td>{item.dia !== undefined && item.dia !== null ? item.dia : '-'}</td>
                      <td>{item.lo !== undefined && item.lo !== null ? item.lo : '-'}</td>
                      <td>{item.li !== undefined && item.li !== null ? item.li : '-'}</td>
                      <td>{item.breakingLoad !== undefined && item.breakingLoad !== null ? item.breakingLoad : '-'}</td>
                      <td>{item.yieldLoad !== undefined && item.yieldLoad !== null ? item.yieldLoad : '-'}</td>
                      <td>{item.uts !== undefined && item.uts !== null ? item.uts : '-'}</td>
                      <td>{item.ys !== undefined && item.ys !== null ? item.ys : '-'}</td>
                      <td>{item.elongation !== undefined && item.elongation !== null ? item.elongation : '-'}</td>
                      <td>{item.testedBy || '-'}</td>
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
                  <label>Date Code</label>
                  <input
                    type="text"
                    name="dateCode"
                    value={editFormData.dateCode}
                    onChange={handleEditChange}
                    placeholder="e.g: 2024-DC-001"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Heat Code</label>
                  <input
                    type="text"
                    name="heatCode"
                    value={editFormData.heatCode}
                    onChange={handleEditChange}
                    placeholder="e.g: HC-2024-001"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Dia (mm)</label>
                  <input
                    type="number"
                    name="dia"
                    value={editFormData.dia}
                    onChange={handleEditChange}
                    step="0.01"
                    placeholder="e.g: 10.5"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Lo (mm)</label>
                  <input
                    type="number"
                    name="lo"
                    value={editFormData.lo}
                    onChange={handleEditChange}
                    step="0.01"
                    placeholder="Original length"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Li (mm)</label>
                  <input
                    type="number"
                    name="li"
                    value={editFormData.li}
                    onChange={handleEditChange}
                    step="0.01"
                    placeholder="Final length"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Breaking Load (kN)</label>
                  <input
                    type="number"
                    name="breakingLoad"
                    value={editFormData.breakingLoad}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Yield Load (kN)</label>
                  <input
                    type="number"
                    name="yieldLoad"
                    value={editFormData.yieldLoad}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>UTS (N/mm²)</label>
                  <input
                    type="number"
                    name="uts"
                    value={editFormData.uts}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>YS (N/mm²)</label>
                  <input
                    type="number"
                    name="ys"
                    value={editFormData.ys}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Elongation (%)</label>
                  <input
                    type="number"
                    name="elongation"
                    value={editFormData.elongation}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                </div>

                <div className="tensile-form-group">
                  <label>Tested By</label>
                  <input
                    type="text"
                    name="testedBy"
                    value={editFormData.testedBy}
                    onChange={handleEditChange}
                    placeholder="e.g: John Doe"
                  />
                </div>

                <div className="tensile-form-group full-width">
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={editFormData.remarks}
                    onChange={handleEditChange}
                    rows="3"
                    placeholder="Any additional notes"
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
    </>
  );
};

export default TensileReport;