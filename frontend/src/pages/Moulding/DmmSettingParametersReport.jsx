import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import { FilterButton, DeleteActionButton } from '../../Components/Buttons';
import { Loader2 } from 'lucide-react';
import api from '../../utils/api';
import '../../styles/PageStyles/Moulding/DmmSettingParametersReport.css';

const DmmSettingParametersReport = () => {
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
      const response = await api.get('/v1/dmm-reports');
      if (response.success) {
        setItems(response.data || []);
        setFilteredItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching DMM reports:', error);
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
        const response = await api.delete(`/v1/dmm-reports/${id}`);
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
    <div className="dmm-report-container">
      <div className="dmm-report-content">
        {/* Header */}
        <div className="dmm-report-header">
          <Filter size={20} style={{ color: '#FF7F50' }} />
          <h3>DMM Setting Parameters - Records</h3>
        </div>

        {/* Filter Section */}
        <div className="dmm-filter-grid">
          <div className="dmm-filter-group">
            <label>Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="dmm-filter-input"
            />
          </div>
          <div className="dmm-filter-group">
            <label>End Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="dmm-filter-input"
            />
          </div>
          <div className="dmm-filter-btn-container">
            <FilterButton onClick={handleFilter}>
              Filter
            </FilterButton>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <div className="dmm-table-container">
            <div className="dmm-table-wrapper">
              <table className="dmm-table">
                <thead>
                  <tr>
                    <th rowSpan="2" className="fixed-column">Date</th>
                    <th rowSpan="2" className="fixed-column">Customer</th>
                    <th rowSpan="2" className="fixed-column">Model</th>
                    <th rowSpan="2" className="fixed-column">M/C No</th>
                    <th rowSpan="2" className="fixed-column">Checker</th>
                    <th rowSpan="2" className="fixed-column">Shift</th>
                    {/* Shift 1 Parameters */}
                    <th colSpan="22">Shift 1 Parameters</th>
                    {/* Shift 2 Parameters */}
                    <th colSpan="22">Shift 2 Parameters</th>
                    {/* Shift 3 Parameters */}
                    <th colSpan="22">Shift 3 Parameters</th>
                    <th rowSpan="2">Actions</th>
                  </tr>
                  <tr>
                    {/* Shift 1 Headers */}
                    <th>Customer</th>
                    <th>Item Desc</th>
                    <th>Time</th>
                    <th>PP Thickness</th>
                    <th>PP Height</th>
                    <th>SP Thickness</th>
                    <th>SP Height</th>
                    <th>SP Core Mask Th</th>
                    <th>SP Core Mask Ht</th>
                    <th>PP Core Mask Th</th>
                    <th>PP Core Mask Ht</th>
                    <th>Sand Shot Press</th>
                    <th>Correction Shot</th>
                    <th>Squeeze Pressure</th>
                    <th>PP Strip Accel</th>
                    <th>PP Strip Dist</th>
                    <th>SP Strip Accel</th>
                    <th>SP Strip Dist</th>
                    <th>Mould Thickness</th>
                    <th>Close Up Force</th>
                    <th>Remarks</th>
                    {/* Shift 2 Headers */}
                    <th>Customer</th>
                    <th>Item Desc</th>
                    <th>Time</th>
                    <th>PP Thickness</th>
                    <th>PP Height</th>
                    <th>SP Thickness</th>
                    <th>SP Height</th>
                    <th>SP Core Mask Th</th>
                    <th>SP Core Mask Ht</th>
                    <th>PP Core Mask Th</th>
                    <th>PP Core Mask Ht</th>
                    <th>Sand Shot Press</th>
                    <th>Correction Shot</th>
                    <th>Squeeze Pressure</th>
                    <th>PP Strip Accel</th>
                    <th>PP Strip Dist</th>
                    <th>SP Strip Accel</th>
                    <th>SP Strip Dist</th>
                    <th>Mould Thickness</th>
                    <th>Close Up Force</th>
                    <th>Remarks</th>
                    {/* Shift 3 Headers */}
                    <th>Customer</th>
                    <th>Item Desc</th>
                    <th>Time</th>
                    <th>PP Thickness</th>
                    <th>PP Height</th>
                    <th>SP Thickness</th>
                    <th>SP Height</th>
                    <th>SP Core Mask Th</th>
                    <th>SP Core Mask Ht</th>
                    <th>PP Core Mask Th</th>
                    <th>PP Core Mask Ht</th>
                    <th>Sand Shot Press</th>
                    <th>Correction Shot</th>
                    <th>Squeeze Pressure</th>
                    <th>PP Strip Accel</th>
                    <th>PP Strip Dist</th>
                    <th>SP Strip Accel</th>
                    <th>SP Strip Dist</th>
                    <th>Mould Thickness</th>
                    <th>Close Up Force</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="73" className="dmm-no-data">
                        No records found. Submit entries to see them here.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td className="fixed-column">{item.header?.date ? new Date(item.header.date).toLocaleDateString() : '-'}</td>
                        <td className="fixed-column">{item.header?.customer || '-'}</td>
                        <td className="fixed-column">{item.header?.model || '-'}</td>
                        <td className="fixed-column">{item.header?.mcNo || '-'}</td>
                        <td className="fixed-column">{item.header?.checker || '-'}</td>
                        <td className="fixed-column">{item.header?.shift || '-'}</td>
                        
                        {/* Shift 1 Data */}
                        <td>{item.shift1Rows?.[0]?.customer || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.itemDescription || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.time || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.ppThickness || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.ppHeight || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.spThickness || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.spHeight || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.spCoreMaskThickness || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.spCoreMaskHeight || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.ppCoreMaskThickness || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.ppCoreMaskHeight || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.sandShotPressureBar || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.correctionShotTime || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.squeezePressure || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.ppStrippingAcceleration || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.ppStrippingDistance || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.spStrippingAcceleration || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.spStrippingDistance || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.mouldThicknessPlus10 || '-'}</td>
                        <td>{item.shift1Rows?.[0]?.closeUpForceMouldCloseUpPressure || '-'}</td>
                        <td className="dmm-text-cell">{item.shift1Rows?.[0]?.remarks || '-'}</td>
                        
                        {/* Shift 2 Data */}
                        <td>{item.shift2Rows?.[0]?.customer || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.itemDescription || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.time || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.ppThickness || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.ppHeight || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.spThickness || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.spHeight || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.spCoreMaskThickness || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.spCoreMaskHeight || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.ppCoreMaskThickness || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.ppCoreMaskHeight || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.sandShotPressureBar || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.correctionShotTime || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.squeezePressure || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.ppStrippingAcceleration || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.ppStrippingDistance || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.spStrippingAcceleration || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.spStrippingDistance || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.mouldThicknessPlus10 || '-'}</td>
                        <td>{item.shift2Rows?.[0]?.closeUpForceMouldCloseUpPressure || '-'}</td>
                        <td className="dmm-text-cell">{item.shift2Rows?.[0]?.remarks || '-'}</td>
                        
                        {/* Shift 3 Data */}
                        <td>{item.shift3Rows?.[0]?.customer || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.itemDescription || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.time || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.ppThickness || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.ppHeight || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.spThickness || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.spHeight || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.spCoreMaskThickness || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.spCoreMaskHeight || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.ppCoreMaskThickness || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.ppCoreMaskHeight || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.sandShotPressureBar || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.correctionShotTime || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.squeezePressure || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.ppStrippingAcceleration || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.ppStrippingDistance || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.spStrippingAcceleration || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.spStrippingDistance || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.mouldThicknessPlus10 || '-'}</td>
                        <td>{item.shift3Rows?.[0]?.closeUpForceMouldCloseUpPressure || '-'}</td>
                        <td className="dmm-text-cell">{item.shift3Rows?.[0]?.remarks || '-'}</td>
                        
                        <td className="dmm-table-actions">
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

export default DmmSettingParametersReport;
