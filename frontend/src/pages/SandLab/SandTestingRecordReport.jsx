import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/SandTestingRecord.css';

const SandTestingRecordReport = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/sand-testing-records');
      if (response.success) {
        setItems(response.data || []);
        setFilteredItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching sand testing records:', error);
      alert('Failed to fetch records');
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await api.delete(`/v1/sand-testing-records/${id}`);
        if (response.success) {
          alert('Record deleted successfully');
          await fetchItems();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record');
      }
    }
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredItems(items);
  };

  return (
    <div className="sand-page-wrapper">
      <div className="sand-container">
        {/* Header */}
        <div className="sand-header-section">
          <div className="sand-header-content">
            <h1 className="sand-page-title">SAND TESTING RECORDS</h1>
            <p className="sand-page-subtitle">View and Manage Sand Testing Records</p>
          </div>
          <div className="sand-header-actions">
            <button type="button" onClick={() => navigate('/sand-lab/sand-testing-record')} className="sand-back-btn">
              <ArrowLeft size={18} />
              Back to Form
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="sand-filter-section">
          <div className="sand-filter-grid">
            <div className="sand-input-group">
              <label className="sand-input-label">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="sand-input-field"
              />
            </div>

            <div className="sand-input-group">
              <label className="sand-input-label">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="sand-input-field"
              />
            </div>

            <div className="sand-filter-buttons">
              <button onClick={handleFilter} className="sand-filter-btn">
                <Filter size={18} />
                Filter
              </button>
              <button onClick={handleResetFilter} className="sand-reset-filter-btn">
                <RefreshCw size={18} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div className="sand-report-section">
          {loading ? (
            <div className="sand-loader-container">
              <Loader />
            </div>
          ) : (
            <div className="sand-table-container">
              <table className="sand-report-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>S.No</th>
                    <th>Time</th>
                    <th>Mix No</th>
                    <th>Permeability</th>
                    <th>Moisture (%)</th>
                    <th>Compactability (%)</th>
                    <th>GCS FDY-A</th>
                    <th>GCS FDY-B</th>
                    <th>WTS</th>
                    <th>Sand Temp BC</th>
                    <th>New Sand (Kgs)</th>
                    <th>Bentonite (Kgs)</th>
                    <th>Item Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="15" className="sand-no-data">
                        No records found. {items.length === 0 ? 'Submit entries in the Data Entry form to see them here.' : 'Try adjusting your filter criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.testParameter?.sno || '-'}</td>
                        <td>{item.testParameter?.time || '-'}</td>
                        <td>{item.testParameter?.mixno || '-'}</td>
                        <td>{item.testParameter?.permeability || '-'}</td>
                        <td>{item.testParameter?.moisture || '-'}</td>
                        <td>{item.testParameter?.compactability || '-'}</td>
                        <td>{item.testParameter?.gcsFdyA || '-'}</td>
                        <td>{item.testParameter?.gcsFdyB || '-'}</td>
                        <td>{item.testParameter?.wts || '-'}</td>
                        <td>{item.testParameter?.sandTemp?.BC || '-'}</td>
                        <td>{item.testParameter?.newSandKgs || '-'}</td>
                        <td>{item.testParameter?.bentonite?.Kgs || '-'}</td>
                        <td className="sand-item-name">{item.testParameter?.itemName || '-'}</td>
                        <td className="sand-actions-cell">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="sand-delete-action-btn"
                            title="Delete record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SandTestingRecordReport;
