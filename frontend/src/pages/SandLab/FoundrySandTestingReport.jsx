import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { FilterButton, DatePicker, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/FoundarySandTestingNoteReport.css';

const FoundrySandTestingReport = () => {
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
      const response = await api.get('/v1/foundry-sand-testing-notes');
      if (response.success) {
        setItems(response.data || []);
        setFilteredItems(response.data || []);
      } else {
        console.error('Error:', response.message);
        alert('Failed to fetch records');
      }
    } catch (error) {
      console.error('Error fetching foundry sand testing records:', error);
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
        const response = await api.delete(`/v1/foundry-sand-testing-notes/${id}`);
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
    <div className="foundry-report-container">
      <div className="foundry-report-content">
        {/* Header */}
        <div className="foundry-report-header">
          <div className="foundry-report-header-text">
            <Filter size={24} />
            <h2>Foundry Sand Testing Note - Reports</h2>
          </div>
        </div>

        {/* Filter Section */}
        <div className="foundry-filter-section">
          <div className="foundry-filter-grid">
            <div className="foundry-filter-group">
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                name="startDate"
                placeholder="Select start date"
              />
            </div>
            <div className="foundry-filter-group">
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                name="endDate"
                placeholder="Select end date"
              />
            </div>
          </div>
          <div className="foundry-filter-actions">
            <FilterButton onClick={handleFilter}>
              Apply Filter
            </FilterButton>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <Loader />
        ) : (
          <div className="foundry-table-container">
            <div className="foundry-table-wrapper">
              <table className="foundry-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Shift</th>
                    <th>Sand Plant</th>
                    <th>Compactability Setting</th>
                    <th>Shear Strength Setting</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="foundry-no-data">
                        No records found. Submit entries to see them here.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                        <td>{item.shift || '-'}</td>
                        <td>{item.sandPlant || '-'}</td>
                        <td>{item.compactibilitySetting || '-'}</td>
                        <td>{item.shearStrengthSetting || '-'}</td>
                        <td className="foundry-table-actions">
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

export default FoundrySandTestingReport;
