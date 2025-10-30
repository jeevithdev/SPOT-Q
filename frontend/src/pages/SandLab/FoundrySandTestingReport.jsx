import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DatePicker, FilterButton, ResetButton, EditActionButton, DeleteActionButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import '../../styles/PageStyles/Sandlab/FoundarySandTestingNote.css';

const FoundrySandTestingReport = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const FoundrySandTestingTabs = () => {
    const tabStyle = {
      padding: '0.75rem 1.5rem',
      textDecoration: 'none',
      color: '#64748b',
      borderBottom: '2px solid transparent',
      fontWeight: 500,
      transition: 'all 0.2s ease',
    };

    const tabActiveStyle = {
      color: '#1e293b',
      borderBottomColor: '#1e293b',
    };

    return (
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '-1px' }}>
          <Link
            to="/sand-lab/foundry-sand-testing-note"
            style={isActive('/sand-lab/foundry-sand-testing-note') ? { ...tabStyle, ...tabActiveStyle } : tabStyle}
          >
            Data Entry
          </Link>
          <Link
            to="/sand-lab/foundry-sand-testing-note/report"
            style={isActive('/sand-lab/foundry-sand-testing-note/report') ? { ...tabStyle, ...tabActiveStyle } : tabStyle}
          >
            Report
          </Link>
        </div>
      </div>
    );
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/foundry-sand-testing');
      if (response.success) {
        setItems(response.data || []);
        setFilteredItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching foundry sand testing records:', error);
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
        const response = await api.delete('/v1/foundry-sand-testing/' + id);
        if (response.success) {
          await fetchItems();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  return (
    <div className="foundry-page-container">
      <div className="foundry-main-card">
        <FoundrySandTestingTabs />
        <div className="foundry-report-container">
          <div className="foundry-report-header">
            <h3 className="foundry-report-title">Foundry Sand Testing - Report</h3>
          </div>

          <div className="foundry-report-filter-grid">
            <div className="foundry-filter-group">
              <label className="foundry-filter-label">Start Date</label>
              <DatePicker
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="foundry-filter-group">
              <label className="foundry-filter-label">End Date</label>
              <DatePicker
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Select end date"
              />
            </div>

            <div className="foundry-filter-actions" style={{ display: 'flex', gap: '0.5rem' }}>
              <FilterButton onClick={handleFilter}>Filter</FilterButton>
              <ResetButton onClick={fetchItems}>Refresh</ResetButton>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader />
            </div>
          ) : (
            <div className="foundry-report-table-wrapper">
              <table className="foundry-report-table">
                <thead className="foundry-report-table-head">
                  <tr>
                    <th className="foundry-report-th">Date</th>
                    <th className="foundry-report-th">Sand Plant</th>
                    <th className="foundry-report-th">Shift</th>
                    <th className="foundry-report-th">Total Clay (%)</th>
                    <th className="foundry-report-th">Active Clay (%)</th>
                    <th className="foundry-report-th">Dead Clay (%)</th>
                    <th className="foundry-report-th">VCM (%)</th>
                    <th className="foundry-report-th">LOI (%)</th>
                    <th className="foundry-report-th">AFS No.</th>
                    <th className="foundry-report-th">Compactibility (%)</th>
                    <th className="foundry-report-th">Permeability</th>
                    <th className="foundry-report-th">GCS (gm/cm²)</th>
                    <th className="foundry-report-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="foundry-no-records">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td className="foundry-table-body-cell">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="foundry-table-body-cell">{item.sandPlant}</td>
                        <td className="foundry-table-body-cell">{item.shift}</td>
                        <td className="foundry-table-body-cell">{item.totalClay}</td>
                        <td className="foundry-table-body-cell">{item.activeClay}</td>
                        <td className="foundry-table-body-cell">{item.deadClay}</td>
                        <td className="foundry-table-body-cell">{item.vcm}</td>
                        <td className="foundry-table-body-cell">{item.loi}</td>
                        <td className="foundry-table-body-cell">{item.afsNo}</td>
                        <td className="foundry-table-body-cell">{item.compactibility}</td>
                        <td className="foundry-table-body-cell">{item.permeability}</td>
                        <td className="foundry-table-body-cell">{item.gcs}</td>
                        <td className="foundry-table-body-cell" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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
      </div>
    </div>
  );
};

export default FoundrySandTestingReport;