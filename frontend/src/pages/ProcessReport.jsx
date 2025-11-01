import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw, X } from 'lucide-react';
import { Button, DatePicker, EditActionButton, DeleteActionButton } from '../Components/Buttons';
import Loader from '../Components/Loader';
import api from '../utils/api';
import '../styles/PageStyles/ProcessReport.css';

const ProcessReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
      const data = await api.get('/v1/process-controls');
      
      if (data.success) {
        setItems(data.data || []);
        setFilteredItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching process controls:', error);
    } finally {
      setLoading(false);
    }
  };

  const parsePartInfo = (combined) => {
    const parts = (combined || '').split(' / ').map(p => p.trim());
    return {partName: parts[0] || '', date: parts[1] || '', heatCode: parts[2] || ''};
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
      partNameDateHeatCode: item.partNameDateHeatCode || '',
      quantityOfMoulds: item.quantityOfMoulds || '',
      metalCompositionC: item.metalCompositionC || '',
      metalCompositionSi: item.metalCompositionSi || '',
      metalCompositionMn: item.metalCompositionMn || '',
      metalCompositionP: item.metalCompositionP || '',
      metalCompositionS: item.metalCompositionS || '',
      metalCompositionMgFL: item.metalCompositionMgFL || '',
      metalCompositionCr: item.metalCompositionCr || '',
      metalCompositionCu: item.metalCompositionCu || '',
      timeOfPouring: item.timeOfPouring || '',
      pouringTemperature: item.pouringTemperature || '',
      ppCode: item.ppCode || '',
      treatmentNo: item.treatmentNo || '',
      fcNoHeatNo: item.fcNoHeatNo || '',
      conNo: item.conNo || '',
      tappingTime: item.tappingTime || '',
      correctiveAdditionC: item.correctiveAdditionC || '',
      correctiveAdditionSi: item.correctiveAdditionSi || '',
      correctiveAdditionMn: item.correctiveAdditionMn || '',
      correctiveAdditionS: item.correctiveAdditionS || '',
      correctiveAdditionCr: item.correctiveAdditionCr || '',
      correctiveAdditionCu: item.correctiveAdditionCu || '',
      correctiveAdditionSn: item.correctiveAdditionSn || '',
      tappingWt: item.tappingWt || '',
      mg: item.mg || '',
      resMgConvertor: item.resMgConvertor || '',
      recOfMg: item.recOfMg || '',
      streamInnoculantPTime: item.streamInnoculantPTime || '',
      remarks: item.remarks || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const data = await api.put(`/v1/process-controls/${editingItem._id}`, editFormData);
      
      if (data.success) {
        alert('Process control entry updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating process control:', error);
      alert('Failed to update entry: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    try {
      const data = await api.delete(`/v1/process-controls/${id}`);
      
      if (data.success) {
        alert('Process control entry deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting process control:', error);
      alert('Failed to delete entry: ' + error.message);
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredItems(items);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filtered = items.filter(item => {
      const itemDate = new Date(item.date || parsePartInfo(item.partNameDateHeatCode).date);
      return itemDate >= start && itemDate <= end;
    });
    
    setFilteredItems(filtered);
  };

  return (
    <div className="process-report-container">
      <div className="process-report-title">
        <Filter size={28} color="#FF7F50" />
        <h3>Process Record - Report</h3>
      </div>

      <div className="process-filter-grid">
        <div className="process-filter-group">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>

        <div className="process-filter-group">
          <label>End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        <div className="process-filter-btn-container">
          <button onClick={handleFilter} className="process-filter-btn">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="process-loader-container">
          <Loader />
        </div>
      ) : (
        <div className="process-table-container">
          <table className="process-table">
            <thead>
              <tr>
                <th className="sticky-date">Date</th>
                <th className="sticky-part">Part Name</th>
                <th>Heat Code</th>
                <th>Qty Moulds</th>
                <th>C %</th>
                <th>Si %</th>
                <th>Mn %</th>
                <th>P %</th>
                <th>S %</th>
                <th>Mg(F/L) %</th>
                <th>Cu %</th>
                <th>Cr %</th>
                <th>Pour Time</th>
                <th>Pour Temp</th>
                <th>PP Code</th>
                <th>Treatment No</th>
                <th>F/C No</th>
                <th>Con No</th>
                <th>Tap Time</th>
                <th>C (Kg)</th>
                <th>Si (Kg)</th>
                <th>Mn (Kg)</th>
                <th>S (Kg)</th>
                <th>Cr (Kg)</th>
                <th>Cu (Kg)</th>
                <th>Sn (Kg)</th>
                <th>Tap Wt</th>
                <th>Mg (Kg)</th>
                <th>Res Mg %</th>
                <th>Rec Mg %</th>
                <th>Stream/P.Time</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr><td colSpan={33} className="process-no-records">No records found</td></tr>
              ) : (
                filteredItems.map((item, i) => {
                  // prefer stored separate fields, fallback to parsing combined if missing
                  const info = {
                    partName: item.partName || parsePartInfo(item.partNameDateHeatCode).partName,
                    date: item.date || parsePartInfo(item.partNameDateHeatCode).date,
                    heatCode: item.heatCode || parsePartInfo(item.partNameDateHeatCode).heatCode
                  };
                  return (
                    <tr key={item._id || i}>
                      <td className="sticky-date">{info.date}</td>
                      <td className="sticky-part">{info.partName}</td>
                      <td>{info.heatCode}</td>
                      <td>{item.quantityOfMoulds}</td>
                      <td>{item.metalCompositionC}</td>
                      <td>{item.metalCompositionSi}</td>
                      <td>{item.metalCompositionMn}</td>
                      <td>{item.metalCompositionP}</td>
                      <td>{item.metalCompositionS}</td>
                      <td>{item.metalCompositionMgFL}</td>
                      <td>{item.metalCompositionCu}</td>
                      <td>{item.metalCompositionCr}</td>
                      <td>{item.timeOfPouring}</td>
                      <td>{item.pouringTemperature}</td>
                      <td>{item.ppCode}</td>
                      <td>{item.treatmentNo}</td>
                      <td>{item.fcNoHeatNo}</td>
                      <td>{item.conNo}</td>
                      <td>{item.tappingTime}</td>
                      <td>{item.correctiveAdditionC}</td>
                      <td>{item.correctiveAdditionSi}</td>
                      <td>{item.correctiveAdditionMn}</td>
                      <td>{item.correctiveAdditionS}</td>
                      <td>{item.correctiveAdditionCr}</td>
                      <td>{item.correctiveAdditionCu}</td>
                      <td>{item.correctiveAdditionSn}</td>
                      <td>{item.tappingWt}</td>
                      <td>{item.mg}</td>
                      <td>{item.resMgConvertor}</td>
                      <td>{item.recOfMg}</td>
                      <td>{item.streamInnoculantPTime}</td>
                      <td>{item.remarks}</td> 
                      <td style={{ minWidth: '100px' }}>
                        <EditActionButton onClick={() => handleEdit(item)} />
                        <DeleteActionButton onClick={() => handleDelete(item._id)} />
                      </td>
                    </tr>
                  );
                })
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
              <h2>Edit Process Control Entry</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="process-form-grid">
                <div className="process-form-group">
                  <label>Part Name / Date / Heat Code</label>
                  <input type="text" name="partNameDateHeatCode" value={editFormData.partNameDateHeatCode} onChange={handleEditChange} placeholder="e.g., ABC-123 / 29-10-2025 / HC-001" />
                </div>
                <div className="process-form-group">
                  <label>Qty. Of Moulds</label>
                  <input type="number" name="quantityOfMoulds" value={editFormData.quantityOfMoulds} onChange={handleEditChange} placeholder="Enter quantity" />
                </div>
                {/* Add other form fields as needed */}
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={() => setShowEditModal(false)} disabled={editLoading}>
                Cancel
              </button>
              <button className="modal-submit-btn" onClick={handleUpdate} disabled={editLoading}>
                {editLoading ? 'Updating...' : 'Update Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessReport;