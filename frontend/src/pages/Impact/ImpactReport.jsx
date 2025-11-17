import React, { useState, useEffect } from 'react';
import { X, BookOpenCheck } from 'lucide-react';
import { DatePicker, EditActionButton, DeleteActionButton, FilterButton, ClearButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import { getCurrentDate, formatDateDisplay } from '../../utils/dateUtils';
import '../../styles/PageStyles/Impact/ImpactReport.css';

const ImpactReport = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchCurrentDateAndEntries();
  }, []);

  const fetchCurrentDateAndEntries = async () => {
    try {
      setLoading(true);
      const todayStr = await getCurrentDate(); // Get server date
      setCurrentDate(todayStr);

      // Fetch entries for current date
      const data = await api.get(`/impact-tests/by-date?date=${todayStr}`);

      if (data.success) {
        setEntries(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      // Set current date even on error
      const todayStr = await getCurrentDate();
      setCurrentDate(todayStr);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // Handle nested specification fields
    if (name === 'specificationVal' || name === 'specificationConstraint') {
      const field = name === 'specificationVal' ? 'val' : 'constraint';
      setEditFormData(prev => ({
        ...prev,
        specification: {
          ...prev.specification,
          [field]: value
        }
      }));
      return;
    }

    // Auto-capitalize dateCode
    if (name === 'dateCode') {
      setEditFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
      return;
    }

    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      partName: item.partName || '',
      dateCode: item.dateCode || '',
      specification: {
        val: item.specification?.val || '',
        constraint: item.specification?.constraint || ''
      },
      observedValue: item.observedValue || '',
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/impact-tests/${editingItem._id}`, editFormData);

      if (data.success) {
        setShowEditModal(false);
        // Refresh the entries - either filtered or current date
        if (isFiltered) {
          handleFilter();
        } else {
          fetchCurrentDateAndEntries();
        }
      }
    } catch (error) {
      console.error('Error updating impact test:', error);
      alert('Failed to update entry: ' + (error.message || 'Unknown error'));
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const data = await api.delete(`/impact-tests/${id}`);

        if (data.success) {
          // Refresh the entries - either filtered or current date
          if (isFiltered) {
            handleFilter();
          } else {
            fetchCurrentDateAndEntries();
          }
        }
      } catch (error) {
        console.error('Error deleting impact test:', error);
        alert('Failed to delete entry: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleFilter = async () => {
    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    try {
      setLoading(true);

      // Build query params
      let query = `startDate=${startDate}`;
      if (endDate) {
        query += `&endDate=${endDate}`;
      }

      const data = await api.get(`/impact-tests/filter?${query}`);

      if (data.success) {
        setEntries(data.data || []);
        setIsFiltered(true);
      }
    } catch (error) {
      console.error('Error filtering entries:', error);
      alert('Failed to filter entries: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setIsFiltered(false);
    fetchCurrentDateAndEntries();
  };

  // Helper function to format specification display
  const formatSpecification = (spec) => {
    if (!spec) return '-';
    const val = spec.val || '';
    const constraint = spec.constraint || '';
    if (val && constraint) {
      return `${val} ${constraint}`;
    }
    return val || constraint || '-';
  };


  return (
    <>
      <div className="impact-report-header">
        <div className="impact-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Impact Test - Report
          </h2>
        </div>
        <div aria-label="Date" style={{ fontWeight: 600, color: '#25424c' }}>
          {loading ? 'Loading...' : `DATE : ${formatDateDisplay(currentDate)}`}
        </div>
      </div>

      <div className="impact-filter-container">
        <div className="impact-filter-group">
          <label>Start Date</label>
          <DatePicker
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Select start date"
          />
        </div>
        <div className="impact-filter-group">
          <label>End Date</label>
          <DatePicker
            value={endDate || ''}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Select end date"
          />
        </div>
        <FilterButton onClick={handleFilter} disabled={!startDate}>
          Filter
        </FilterButton>
        <ClearButton onClick={handleClearFilter} disabled={!isFiltered}>
          Clear
        </ClearButton>
      </div>

      {loading ? (
        <div className="impact-loader-container">
          <Loader />
        </div>
      ) : (
          <div className="impact-table-container">
            <table className="impact-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Part Name</th>
                  <th>Date Code</th>
                  <th>Specification</th>
                  <th>Observed Value</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="impact-no-records">
                      {isFiltered ? 'No entries found for the selected date range' : 'No entries found for today'}
                    </td>
                  </tr>
                ) : (
                  entries.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{item.date ? formatDateDisplay(item.date.split('T')[0]) : formatDateDisplay(currentDate)}</td>
                      <td>{item.partName || '-'}</td>
                      <td>{item.dateCode || '-'}</td>
                      <td>{formatSpecification(item.specification)}</td>
                      <td>{item.observedValue !== undefined && item.observedValue !== null ? item.observedValue : '-'}</td>
                      <td>{item.remarks || '-'}</td>
                      <td>
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
              <h2>Edit Impact Test Entry</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="impact-form-grid">
                <div className="impact-form-group">
                  <label>Part Name *</label>
                  <input
                    type="text"
                    name="partName"
                    value={editFormData.partName}
                    onChange={handleEditChange}
                    placeholder="e.g: Engine Block"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Date Code *</label>
                  <input
                    type="text"
                    name="dateCode"
                    value={editFormData.dateCode}
                    onChange={handleEditChange}
                    placeholder="e.g: 3A21"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Specification Value *</label>
                  <input
                    type="number"
                    name="specificationVal"
                    value={editFormData.specification?.val || ''}
                    onChange={handleEditChange}
                    step="0.1"
                    placeholder="e.g: 3"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Specification Constraint</label>
                  <input
                    type="text"
                    name="specificationConstraint"
                    value={editFormData.specification?.constraint || ''}
                    onChange={handleEditChange}
                    placeholder="e.g: unnotch - Rj"
                  />
                </div>

                <div className="impact-form-group">
                  <label>Observed Value *</label>
                  <input
                    type="text"
                    name="observedValue"
                    value={editFormData.observedValue}
                    onChange={handleEditChange}
                    placeholder="e.g: 12 or 34,45"
                  />
                </div>

                <div className="impact-form-group full-width">
                  <label>Remarks</label>
                  <input
                    type="text"
                    name="remarks"
                    value={editFormData.remarks}
                    onChange={handleEditChange}
                    placeholder="Enter any additional notes..."
                    maxLength={80}
                    style={{
                      width: '100%',
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
    </>
  );
};

export default ImpactReport;
