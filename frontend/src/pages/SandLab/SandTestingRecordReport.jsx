import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { DatePicker, FilterButton, ResetButton, EditActionButton, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/SandTestingRecord.css';

const SandTestingRecordReport = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const SandTestingTabs = () => (
    <div className="sand-testing-tabs-container">
      <div className="sand-testing-tabs">
        <Link
          to="/sand-lab/sand-testing-record"
          className={`sand-testing-tab ${isActive('/sand-lab/sand-testing-record') ? 'active' : ''}`}
        >
          Data Entry
        </Link>
        <Link
          to="/sand-lab/sand-testing-record/report"
          className={`sand-testing-tab ${isActive('/sand-lab/sand-testing-record/report') ? 'active' : ''}`}
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
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/sand-testing-record');
      if (response.success) {
        setItems(response.data || []);
        setFilteredItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching sand testing records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter((item) => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });

    setFilteredItems(filtered);
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
      date: item.date,
      time: item.time,
      mixNo: item.mixNo,
      permeability: item.permeability,
      moisture: item.moisture,
      compactability: item.compactability,
      compressibility: item.compressibility,
      sandTempBC: item.sandTempBC,
      newSandKgs: item.newSandKgs,
      bentoniteKgs: item.bentoniteKgs,
      premixKgs: item.premixKgs,
      coalDustKgs: item.coalDustKgs
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const response = await api.put('/v1/sand-testing-record/' + editingItem._id, editFormData);
      
      if (response.success) {
        setShowEditModal(false);
        await fetchItems();
      }
    } catch (error) {
      console.error('Error updating sand testing record:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await api.delete('/v1/sand-testing-record/' + id);
        if (response.success) {
          await fetchItems();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  return (
    <div className="sand-testing-container">
      <div className="sand-testing-wrapper">
        <SandTestingTabs />
        <div className="sand-testing-report-container">
          <h3 className="sand-testing-report-title">
            Sand Testing Record - Report Card
          </h3>

          <div className="sandrec-report-filter-grid">
            <div className="sand-testing-filter-group">
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Start Date</label>
              <DatePicker
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="sand-testing-filter-group">
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>End Date</label>
              <DatePicker
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="sand-testing-filter-actions" style={{ display: 'flex', gap: '0.5rem' }}>
              <FilterButton onClick={handleFilter}>Filter</FilterButton>
              <ResetButton onClick={fetchItems}>Refresh</ResetButton>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader />
            </div>
          ) : (
            <div className="sandrec-report-table-wrapper">
              <table className="sandrec-report-table">
                <thead className="sandrec-report-table-head">
                  <tr>
                    <th className="sandrec-report-th">Date</th>
                    <th className="sandrec-report-th">Time</th>
                    <th className="sandrec-report-th">Mix No</th>
                    <th className="sandrec-report-th">Permeability</th>
                    <th className="sandrec-report-th">Moisture (%)</th>
                    <th className="sandrec-report-th">Compactability (%)</th>
                    <th className="sandrec-report-th">Compressibility</th>
                    <th className="sandrec-report-th">Sand Temp (°C)</th>
                    <th className="sandrec-report-th">New Sand (Kgs)</th>
                    <th className="sandrec-report-th">Bentonite (Kgs)</th>
                    <th className="sandrec-report-th">Premix (Kgs)</th>
                    <th className="sandrec-report-th">Coal Dust (Kgs)</th>
                    <th className="sandrec-report-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="sandrec-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{new Date(item.date).toLocaleDateString()}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.time}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.mixNo}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.permeability}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.moisture}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.compactability}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.compressibility}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.sandTempBC}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.newSandKgs}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.bentoniteKgs}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.premixKgs}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>{item.coalDustKgs}</td>
                        <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <EditActionButton
                            onClick={() => {
                              setEditingItem(item);
                              setShowEditModal(true);
                            }}
                          />
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
                <h2>Edit Sand Testing Record Entry</h2>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="sand-testing-form-grid">
                  <div className="sand-testing-form-group">
                    <label>Date *</label>
                    <DatePicker
                      name="date"
                      value={editFormData.date || ''}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={editFormData.time}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Mix No *</label>
                    <input
                      type="text"
                      name="mixNo"
                      value={editFormData.mixNo}
                      onChange={handleEditChange}
                      placeholder="e.g. Mix-001"
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Permeability *</label>
                    <input
                      type="number"
                      name="permeability"
                      value={editFormData.permeability}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Moisture (%) *</label>
                    <input
                      type="number"
                      name="moisture"
                      value={editFormData.moisture}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Compactability (%) *</label>
                    <input
                      type="number"
                      name="compactability"
                      value={editFormData.compactability}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Compressibility *</label>
                    <input
                      type="number"
                      name="compressibility"
                      value={editFormData.compressibility}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Sand Temp (°C) *</label>
                    <input
                      type="number"
                      name="sandTempBC"
                      value={editFormData.sandTempBC}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>New Sand (Kgs) *</label>
                    <input
                      type="number"
                      name="newSandKgs"
                      value={editFormData.newSandKgs}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Bentonite (Kgs) *</label>
                    <input
                      type="number"
                      name="bentoniteKgs"
                      value={editFormData.bentoniteKgs}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Premix (Kgs) *</label>
                    <input
                      type="number"
                      name="premixKgs"
                      value={editFormData.premixKgs}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  </div>

                  <div className="sand-testing-form-group">
                    <label>Coal Dust (Kgs) *</label>
                    <input
                      type="number"
                      name="coalDustKgs"
                      value={editFormData.coalDustKgs}
                      onChange={handleEditChange}
                      step="0.01"
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
    </div>
  );
};

export default SandTestingRecordReport;