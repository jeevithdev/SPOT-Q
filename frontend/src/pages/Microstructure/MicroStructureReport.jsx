
import React, { useState, useEffect } from 'react';
import { X, PencilLine, BookOpenCheck } from 'lucide-react';
import { DatePicker, EditActionButton, DeleteActionButton, FilterButton, ClearButton } from '../../Components/Buttons';
import Loader from '../../Components/Loader';
import api from '../../utils/api';
import "../../styles/PageStyles/MicroStructure/MicroStructureReport.css";

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

  // Remarks preview modal
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarksText, setRemarksText] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.get('/v1/micro-structure');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching micro structure tests:', error);
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
      partName: item.partName || '',
      dateCode: item.dateCode || '',
      heatCode: item.heatCode || '',
      nodularity: item.nodularity || '',
      graphiteType: item.graphiteType || '',
      countNos: item.countNos || '',
      size: item.size || '',
      ferrite: item.ferrite || item.ferritePercentage || '',
      pearlite: item.pearlite || item.pearlitePercentage || '',
      carbide: item.carbide || item.carbidePercentage || '',
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/micro-structure/${editingItem._id}`, editFormData);
      
      if (data.success) {
        setShowEditModal(false);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating micro structure test:', error);
      alert('Failed to update entry: ' + (error.message || 'Unknown error'));
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const data = await api.delete(`/v1/micro-structure/${id}`);
        
        if (data.success) {
          fetchItems();
        }
      } catch (error) {
        console.error('Error deleting micro structure test:', error);
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
      // Use dateOfInspection if present, otherwise fall back to insDate from entry page
      const rawDate = item.dateOfInspection || item.insDate;
      if (!rawDate) return false;

      const itemDate = new Date(rawDate);
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

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredItems(items);
  };
  
  // Safely get a displayable field value from item or its nested microStructure
  const getFieldValue = (item, key) => {
    if (!item) return '-';

    // For these fields, prefer to build a "from-to" range from any available From/To values
    const rangeFields = ['countNos', 'size', 'ferrite', 'pearlite', 'carbide'];

    const buildRange = (baseKey) => {
      const fromKey = `${baseKey}From`;
      const toKey = `${baseKey}To`;

      const ms = item.microStructure || {};

      const fromVal =
        item[fromKey] !== undefined && item[fromKey] !== null && item[fromKey] !== ''
          ? item[fromKey]
          : ms[fromKey];
      const toVal =
        item[toKey] !== undefined && item[toKey] !== null && item[toKey] !== ''
          ? item[toKey]
          : ms[toKey];

      if (
        fromVal !== undefined && fromVal !== null && fromVal !== '' &&
        toVal !== undefined && toVal !== null && toVal !== ''
      ) {
        return `${fromVal}-${toVal}`;
      }
      return null;
    };

    // Helper: if this is a range field and we only have a single value, show it as value-value
    const asRangeIfNeeded = (val) => {
      if (val === undefined || val === null || val === '') return null;
      if (!rangeFields.includes(key)) return val;
      const str = String(val).trim();
      if (!str) return null;
      if (str.includes('-')) return str; // already a range
      return `${str}-${str}`;
    };

    if (rangeFields.includes(key)) {
      const range = buildRange(key);
      if (range) return range;
    }

    const direct = item[key];
    const directRange = asRangeIfNeeded(direct);
    if (directRange !== null && directRange !== undefined) {
      return directRange;
    }

    // Look into nested microStructure object if present
    if (item.microStructure && item.microStructure[key] !== undefined && item.microStructure[key] !== null && item.microStructure[key] !== '') {
      const nestedRange = asRangeIfNeeded(item.microStructure[key]);
      if (nestedRange !== null && nestedRange !== undefined) return nestedRange;
    }

    // Common alternate keys mapping
    const altMap = {
      countNos: ['noduleCount', 'count'],
      ferrite: ['ferritePercent', 'ferritePercentage'],
      pearlite: ['pearlitePercent', 'pearlitePercentage'],
      carbide: ['carbidePercent', 'carbidePercentage'],
    };

    const alternates = altMap[key] || [];
    for (const altKey of alternates) {
      if (item[altKey] !== undefined && item[altKey] !== null && item[altKey] !== '') {
        const altRange = asRangeIfNeeded(item[altKey]);
        if (altRange !== null && altRange !== undefined) return altRange;
      }
      if (item.microStructure && item.microStructure[altKey] !== undefined && item.microStructure[altKey] !== null && item.microStructure[altKey] !== '') {
        const altNestedRange = asRangeIfNeeded(item.microStructure[altKey]);
        if (altNestedRange !== null && altNestedRange !== undefined) return altNestedRange;
      }
    }

    return '-';
  };

  // Parse combined nodularity/graphiteType text when stored together
  const getNodularityParts = (item) => {
    if (!item) return null;

    const combined =
      item.nodularityGraphiteType ||
      item.microStructure?.nodularityGraphiteType ||
      '';

    if (!combined || typeof combined !== 'string') return null;

    const parts = combined.trim().split(/\s+/);
    if (parts.length === 0) return null;

    const nodularity = parts[0];
    const graphiteType = parts.slice(1).join(' ');

    return { nodularity, graphiteType };
  };
  // Group items by date (using dateOfInspection or insDate)
  const groupedItems = filteredItems.reduce((groups, item) => {
    const rawDate = item.dateOfInspection || item.insDate;

    let displayDate = '-';
    if (rawDate) {
      const d = new Date(rawDate);
      if (!Number.isNaN(d.getTime())) {
        // Format as DD/MM/YYYY for display
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        displayDate = `${day}/${month}/${year}`;
      } else {
        displayDate = String(rawDate);
      }
    }

    if (!groups[displayDate]) {
      groups[displayDate] = { date: displayDate, items: [] };
    }
    groups[displayDate].items.push(item);
    return groups;
  }, {});

  const groupedItemsArray = Object.values(groupedItems);

  return (
    <>
      <div className="impact-report-header">
        <div className="impact-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Micro Structure - Report
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
        <ClearButton onClick={handleClearFilter} disabled={!startDate && !endDate}>
          Clear
        </ClearButton>
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
                  <th>Disa</th>
                  <th>Part Name</th>
                  <th>Date Code</th>
                  <th>Heat Code</th>
                  <th
                     style={{
                       minWidth: '100px',
                       maxWidth: '110px',
                       whiteSpace: 'normal',
                       textAlign: 'center',
                        }}
                     >
                     NODULARITY
                 </th>
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
                {groupedItemsArray.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="impact-no-records">
                      No records found
                    </td>
                  </tr>
                ) : (
                  groupedItemsArray.map((group, groupIndex) => (
                    <React.Fragment key={group.date || groupIndex}>
                      {group.items.map((item, index) => {
                      const partNameValue = getFieldValue(item, 'partName');
                      const dateCodeValue = getFieldValue(item, 'dateCode');
                      const heatCodeValue = getFieldValue(item, 'heatCode');

                      // For each date group, only show Part Name once per unique value, with rowSpan
                      const firstIndexForPart = group.items.findIndex(
                        (gItem) => getFieldValue(gItem, 'partName') === partNameValue
                      );
                      const occurrencesForPart = group.items.filter(
                        (gItem) => getFieldValue(gItem, 'partName') === partNameValue
                      ).length;

                      const showPartNameCell =
                        partNameValue !== '-' && partNameValue !== '' && firstIndexForPart === index;

                      // Similarly, merge Date Code per unique value within the date group
                      const firstIndexForDateCode = group.items.findIndex(
                        (gItem) => getFieldValue(gItem, 'dateCode') === dateCodeValue
                      );
                      const occurrencesForDateCode = group.items.filter(
                        (gItem) => getFieldValue(gItem, 'dateCode') === dateCodeValue
                      ).length;

                      const showDateCodeCell =
                        dateCodeValue !== '-' && dateCodeValue !== '' && firstIndexForDateCode === index;

                      // And merge Heat Code per unique value within the date group
                      const firstIndexForHeatCode = group.items.findIndex(
                        (gItem) => getFieldValue(gItem, 'heatCode') === heatCodeValue
                      );
                      const occurrencesForHeatCode = group.items.filter(
                        (gItem) => getFieldValue(gItem, 'heatCode') === heatCodeValue
                      ).length;

                      const showHeatCodeCell =
                        heatCodeValue !== '-' && heatCodeValue !== '' && firstIndexForHeatCode === index;

                      return (
                        <tr key={item._id || `${group.date || 'nodate'}-${index}`}>
                          {index === 0 && (
                            <td rowSpan={group.items.length} style={{ textAlign: 'center' }}>
                              {group.date}
                            </td>
                          )}
                          <td style={{ textAlign: 'center' }}>{getFieldValue(item, 'disa')}</td>
                          {showPartNameCell ? (
                            <td
                              rowSpan={occurrencesForPart}
                              style={{ textAlign: 'center' }}
                            >
                              {partNameValue}
                            </td>
                          ) : null}

                          {showDateCodeCell ? (
                            <td
                              rowSpan={occurrencesForDateCode}
                              style={{ textAlign: 'center' }}
                            >
                              {dateCodeValue}
                            </td>
                          ) : null}

                          {showHeatCodeCell ? (
                            <td
                              rowSpan={occurrencesForHeatCode}
                              style={{ textAlign: 'center' }}
                            >
                              {heatCodeValue}
                            </td>
                          ) : null}
                          <td>
                            {(() => {
                              const direct = getFieldValue(item, 'nodularity');
                              if (direct !== '-') return direct;
                              const parsed = getNodularityParts(item);
                              return parsed?.nodularity || '-';
                            })()}
                          </td>
                          <td>
                            {(() => {
                              const direct = getFieldValue(item, 'graphiteType');
                              if (direct !== '-') return direct;
                              const parsed = getNodularityParts(item);
                              return parsed?.graphiteType || '-';
                            })()}
                          </td>
                          <td style={{ textAlign: 'center' }}>{getFieldValue(item, 'countNos')}</td>
                          <td style={{ textAlign: 'center' }}>{getFieldValue(item, 'size')}</td>
                          <td style={{ textAlign: 'center' }}>{getFieldValue(item, 'ferrite')}</td>
                          <td style={{ textAlign: 'center' }}>{getFieldValue(item, 'pearlite')}</td>
                          <td style={{ textAlign: 'center' }}>{getFieldValue(item, 'carbide')}</td>
                          <td style={{ textAlign: 'center' }}>
                            {(() => {
                              const value = typeof item.remarks === 'string' ? item.remarks : '';
                              const display = value || getFieldValue(item, 'remarks');

                              if (!display || display === '-') return '-';
                              const short = display.length > 6 ? display.slice(0, 5) + '..' : display;
                              return (
                                <span
                                  onClick={() => { setRemarksText(display); setShowRemarksModal(true); }}
                                  title={display}
                                  style={{
                                    cursor: 'pointer',
                                    color: '#0ea5e9',
                                    textDecoration: 'underline dotted',
                                    fontSize: '12px',   // smaller size
                                  }}
                                >
                                  {short}
                                </span>
                              );
                            })()}
                          </td>
                          <td style={{ minWidth: '100px' }}>
                            <EditActionButton onClick={() => handleEdit(item)} />
                            <DeleteActionButton onClick={() => handleDelete(item._id)} />
                          </td>
                        </tr>
                      );
                    })}

                      {groupIndex < groupedItemsArray.length - 1 && (
                        <tr>
                          {/* span across all table columns to draw a full-width line */}
                          <td
                            colSpan="14"
                            style={{
                              borderTop: '2px solid #cbd5e1', // light grey line
                              padding: 0,
                            }}
                          />
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showRemarksModal && (
        <div
          onClick={() => setShowRemarksModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 80
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: 10,
              padding: 16,
              width: 'min(520px, 95vw)',
              maxWidth: '95vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Remarks</div>
            <div style={{ color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{remarksText}</div>
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
              <div className="microstructure-form-grid">
                <div className="microstructure-form-group">
                  <label>Date of Inspection *</label>
                  <DatePicker
                    name="dateOfInspection"
                    value={editFormData.dateOfInspection}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Disa</label>
                  <input
                    type="text"
                    name="disa"
                    value={editFormData.disa}
                    onChange={handleEditChange}
                    placeholder="e.g: DISA-001"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Part Name</label>
                  <input
                    type="text"
                    name="partName"
                    value={editFormData.partName}
                    onChange={handleEditChange}
                    placeholder="e.g: Cylinder Head"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Date Code</label>
                  <input
                    type="text"
                    name="dateCode"
                    value={editFormData.dateCode}
                    onChange={handleEditChange}
                    placeholder="e.g: 2024-DC-001"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Heat Code</label>
                  <input
                    type="text"
                    name="heatCode"
                    value={editFormData.heatCode}
                    onChange={handleEditChange}
                    placeholder="e.g: HC-2024-001"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Nodularity</label>
                  <input
                    type="text"
                    name="nodularity"
                    value={editFormData.nodularity}
                    onChange={handleEditChange}
                    placeholder="e.g: 85%"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Graphite Type</label>
                  <input
                    type="text"
                    name="graphiteType"
                    value={editFormData.graphiteType}
                    onChange={handleEditChange}
                    placeholder="e.g: Type VI"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Count Nos</label>
                  <input
                    type="text"
                    name="countNos"
                    value={editFormData.countNos}
                    onChange={handleEditChange}
                    placeholder="e.g: 150-200"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    name="size"
                    value={editFormData.size}
                    onChange={handleEditChange}
                    placeholder="e.g: 5-7"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Ferrite %</label>
                  <input
                    type="text"
                    name="ferrite"
                    value={editFormData.ferrite}
                    onChange={handleEditChange}
                    placeholder="e.g: 60"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Pearlite %</label>
                  <input
                    type="text"
                    name="pearlite"
                    value={editFormData.pearlite}
                    onChange={handleEditChange}
                    placeholder="e.g: 35"
                  />
                </div>

                <div className="microstructure-form-group">
                  <label>Carbide %</label>
                  <input
                    type="text"
                    name="carbide"
                    value={editFormData.carbide}
                    onChange={handleEditChange}
                    placeholder="e.g: 5"
                  />
                </div>

                <div className="microstructure-form-group full-width">
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

export default MicroStructureReport;

