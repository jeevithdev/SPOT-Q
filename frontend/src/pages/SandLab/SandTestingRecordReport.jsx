import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { FilterButton, DatePicker, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/SandTestingRecordReport.css';

const SandTestingRecordReport = () => {
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

  return (
    <div className="sand-report-container">
      <div className="sand-report-content">
        {/* Header */}
        <div className="sand-report-header">
          <div className="sand-report-header-text">
            <Filter size={24} />
            <h2>Sand Testing Record - Reports</h2>
          </div>
        </div>

        {/* Filter Section */}
        <div className="sand-filter-section">
          <div className="sand-filter-grid">
            <div className="sand-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                name="startDate"
                placeholder="Select start date"
              />
            </div>
            <div className="sand-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                name="endDate"
                placeholder="Select end date"
              />
            </div>
          </div>
          <div className="sand-filter-actions">
            <FilterButton onClick={handleFilter}>
              Apply Filter
            </FilterButton>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <Loader />
        ) : (
          <div className="sand-table-container">
            <div className="sand-table-wrapper">
              <table className="sand-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sand Lump</th>
                    <th>New Sand Wt</th>
                    <th>Mix No</th>
                    <th>Permeability</th>
                    <th>Moisture</th>
                    <th>Compactability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="sand-no-data">
                        No records found. Submit entries to see them here.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                        <td>{item.sandLump || '-'}</td>
                        <td>{item.newSandWt || '-'}</td>
                        <td>{item.testParameter?.mixno || '-'}</td>
                        <td>{item.testParameter?.permeability || '-'}</td>
                        <td>{item.testParameter?.moisture || '-'}</td>
                        <td>{item.testParameter?.compactability || '-'}</td>
                        <td className="sand-table-actions">
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
      </div>
    </div>
  );
};

export default SandTestingRecordReport;
