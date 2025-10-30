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
                    <th className="sandrec-report-th">Permeability</th>
                    <th className="sandrec-report-th">Moisture (%)</th>
                    <th className="sandrec-report-th">Compactability (%)</th>
                    <th className="sandrec-report-th">GCS FDY-A</th>
                    <th className="sandrec-report-th">GCS FDY-B</th>
                    <th className="sandrec-report-th">WTS</th>
                    <th className="sandrec-report-th">Sand Temp BC (°C)</th>
                    <th className="sandrec-report-th">New Sand (Kgs)</th>
                    <th className="sandrec-report-th">Bentonite (Kgs)</th>
                    <th className="sandrec-report-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="sandrec-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {item.testParameter?.permeability || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {item.testParameter?.moisture || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {item.testParameter?.compactability || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {item.testParameter?.gcsFdyA || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {item.testParameter?.gcsFdyB || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {item.testParameter?.wts || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {item.testParameter?.sandTempBC || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {item.testParameter?.newSandKgs || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'left' }}>
                          {item.testParameter?.bentoniteKgs || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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
      </div>
    </div>
  );
};

export default SandTestingRecordReport;
