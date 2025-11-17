import React, { useState, useEffect } from 'react';
import { X, PencilLine, BookOpenCheck } from 'lucide-react';
import { DatePicker, EditActionButton, DeleteActionButton, FilterButton } from '../Components/Buttons';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/ImpactReport.css';
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
      const data = await api.get('/v1/microstructures');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching microstructures:', error);
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
      disa: item.disa || '',
      partName: item.partName|| '',
      dateCode: item.dateCode || '',
      heatCode: item.heatCode || '',
      nodularity: item.nodularity || '',
      graphiteType: item.graphiteType || '',
      countNos: item.countNos || '',
      size: item.size || '',
      ferritePercentage: item.ferritePercentage || '',
      pearlitePercentage: item.pearlitePercentage || '',
      carbidePercentage: item.carbidePercentage || '',
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/microstructures/${editingItem._id}`, editFormData);
      
      if (data.success) {
        setShowEditModal(false);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating microstructure:', error);
      alert('Failed to update entry: ' + (error.message || 'Unknown error'));
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const data = await api.delete(`/v1/microstructures/${id}`);
        
        if (data.success) {
          fetchItems();
        }
      } catch (error) {
        console.error('Error deleting microstructure:', error);
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
    <div className="page-wrapper">
      <div className="impact-report-header">
        <div className="impact-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Micro Structure - Report Card
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
          <div className="microstructure-table-container">
            <table className="microstructure-table">
              <thead>
                <tr>
                  <th>Date Of Inspection</th>
                  <th>Disa</th>
                  <th>Part Name</th>
                  <th>Date Code</th>
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
                    <td colSpan="14" className="impact-no-records">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{item.dateOfInspection ? new Date(item.dateOfInspection).toLocaleDateString() : '-'}</td>
                      <td>{item.disa || '-'}</td>
                      <td>{item.partName || '-'}</td>
                      <td>{item.dateCode || '-'}</td>
                      <td>{item.heatCode || '-'}</td>
                      <td>{item.nodularity || '-'}</td>
                      <td>{item.graphiteType || '-'}</td>
                      <td>{item.countNos || '-'}</td>
                      <td>{item.size || '-'}</td>
                      <td>{item.ferritePercentage !== undefined && item.ferritePercentage !== null ? item.ferritePercentage : '-'}</td>
                      <td>{item.pearlitePercentage !== undefined && item.pearlitePercentage !== null ? item.pearlitePercentage : '-'}</td>
                      <td>{item.carbidePercentage !== undefined && item.carbidePercentage !== null ? item.carbidePercentage : '-'}</td>
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
              <h2>Edit Micro Structure Entry</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="impact-form-grid">
                <div className="impact-form-group">
                  <label>Date of Inspection *</label>
                  <DatePicker
                    name="dateOfInspection"
                    value={editFormData.dateOfInspection}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="impact-form-group">
                  <label>Disa *</label>
                  <input
                    type="text"
                    name="disa"
                    value={editFormData.disa}
                    onChange={handleEditChange}
                    placeholder="e.g: DISA-001"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Part Name *</label>
                  <input
                    type="text"
                    name="partName"
                    value={editFormData.partName}
                    onChange={handleEditChange}
                    placeholder="e.g: Gear shaft"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Date Code *</label>
                  <input
                    type="text"
                    name="dateCode"
                    value={editFormData.dateCode}
                    onChange={handleEditChange}
                    placeholder="e.g: HC-2024-001"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Heat Code *</label>
                  <input
                    type="text"
                    name="heatCode"
                    value={editFormData.heatCode}
                    onChange={handleEditChange}
                    placeholder="e.g: HT-12345"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Nodularity *</label>
                  <input
                    type="text"
                    name="nodularity"
                    value={editFormData.nodularity}
                    onChange={handleEditChange}
                    placeholder="e.g: 85%"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Graphite Type *</label>
                  <input
                    type="text"
                    name="graphiteType"
                    value={editFormData.graphiteType}
                    onChange={handleEditChange}
                    placeholder="e.g: Type VI"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Count Nos *</label>
                  <input
                    type="text"
                    name="countNos"
                    value={editFormData.countNos}
                    onChange={handleEditChange}
                    placeholder="e.g: 150"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Size *</label>
                  <input
                    type="text"
                    name="size"
                    value={editFormData.size}
                    onChange={handleEditChange}
                    placeholder="e.g: 25mm"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Ferrite % *</label>
                  <input
                    type="number"
                    name="ferritePercentage"
                    value={editFormData.ferritePercentage}
                    onChange={handleEditChange}
                    step="0.01"
                    placeholder="e.g: 75.5"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Pearlite % *</label>
                  <input
                    type="number"
                    name="pearlitePercentage"
                    value={editFormData.pearlitePercentage}
                    onChange={handleEditChange}
                    step="0.01"
                    placeholder="e.g: 20.5"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Carbide % *</label>
                  <input
                    type="number"
                    name="carbidePercentage"
                    value={editFormData.carbidePercentage}
                    onChange={handleEditChange}
                    step="0.01"
                    placeholder="e.g: 4.0"
                  />
                </div>

                <div className="impact-form-group full-width">
                  <label>Remarks</label>
                  <input
                    type="text"
                    name="remarks"
                    value={editFormData.remarks}
                    onChange={handleEditChange}
                    placeholder="Enter any additional remarks..."
                    maxLength={80}
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      resize: 'none'
                    }}
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