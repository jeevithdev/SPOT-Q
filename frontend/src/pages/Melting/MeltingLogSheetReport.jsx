import React, { useState, useEffect } from 'react';
import { Filter, X, Loader2 } from 'lucide-react';
import { Button, DatePicker, FilterButton, DeleteActionButton } from '../../Components/Buttons';
import api from '../../utils/api';
import '../../styles/PageStyles/Melting/MeltingLogSheetReport.css';

const MeltingLogSheetReport = () => {
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
      const response = await api.get('/v1/melting-logs');
      if (response.success) {
        setItems(response.data || []);
        setFilteredItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching melting logs:', error);
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
        const response = await api.delete(`/v1/melting-logs/${id}`);
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
    <div className="melting-report-container">
      <div className="melting-report-content">
        {/* Header */}
        <div className="melting-report-header">
          <div className="melting-report-header-text">
            <Filter size={24} />
            <h2>Melting Log Sheet - Records</h2>
          </div>
        </div>

        {/* Filter Section */}
        <div className="melting-filter-section">
          <div className="melting-filter-grid">
            <div className="melting-filter-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="melting-filter-input"
              />
            </div>
            <div className="melting-filter-group">
              <label>End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="melting-filter-input"
              />
            </div>
          </div>
          <div className="melting-filter-actions">
            <FilterButton onClick={handleFilter}>
              Apply Filter
            </FilterButton>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="melting-log-loader-container">
            <Loader2 size={40} className="animate-spin" />
          </div>
        ) : (
          <div className="melting-table-container">
            <div className="melting-table-wrapper">
              <table className="melting-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Date</th>
                    <th rowSpan="2">Heat No</th>
                    <th rowSpan="2">Grade</th>
                    {/* Charging Section */}
                    <th colSpan="11">Charging Details (Foundry B)</th>
                    {/* Materials Section */}
                    <th colSpan="12">Materials (All in kgs)</th>
                    {/* Lab Coin Section */}
                    <th colSpan="8">Lab Coin & Timing</th>
                    {/* Metal Tapping Section */}
                    <th colSpan="7">Metal Tapping</th>
                    {/* Furnace 1 Electrical */}
                    <th colSpan="8">Electrical - F1</th>
                    {/* Furnace 2 Electrical */}
                    <th colSpan="8">Electrical - F2</th>
                    {/* Furnace 3 Electrical */}
                    <th colSpan="8">Electrical - F3</th>
                    {/* Furnace 4 Electrical */}
                    <th colSpan="8">Electrical - F4</th>
                    <th rowSpan="2">Remarks</th>
                    <th rowSpan="2">Actions</th>
                  </tr>
                  <tr>
                    {/* Charging Headers */}
                    <th>Charging Time</th>
                    <th>If Bath</th>
                    <th>Liq Metal PP</th>
                    <th>Liq Metal Holder</th>
                    <th>SG-MS Steel</th>
                    <th>Grey MS Steel</th>
                    <th>Ralums SG</th>
                    <th>GL</th>
                    <th>Pig Iron</th>
                    <th>Borings</th>
                    <th>Final Bath</th>
                    {/* Materials Headers */}
                    <th>Char Coal</th>
                    <th>CPC FUR</th>
                    <th>CPC L/C</th>
                    <th>SiC FUR</th>
                    <th>Fe-Si FUR</th>
                    <th>Fe-Si L/C</th>
                    <th>Fe-Mn FUR</th>
                    <th>Fe-Mn L/C</th>
                    <th>CU</th>
                    <th>CR</th>
                    <th>Pure MG</th>
                    <th>Iron Pyrite</th>
                    {/* Lab Coin Headers */}
                    <th>Lab Coin Time</th>
                    <th>Lab Coin Temp</th>
                    <th>Deslag From</th>
                    <th>Deslag To</th>
                    <th>Metal Ready Time</th>
                    <th>Waiting From</th>
                    <th>Waiting To</th>
                    <th>Waiting Reason</th>
                    {/* Metal Tapping Headers */}
                    <th>Tap Time</th>
                    <th>Tap Temp</th>
                    <th>Direct Furnace</th>
                    <th>Holder→Furnace</th>
                    <th>Furnace→Holder</th>
                    <th>Disa No</th>
                    <th>Item</th>
                    {/* Furnace 1 Headers */}
                    <th>F1 KW</th>
                    <th>F1 V</th>
                    <th>F1 A</th>
                    <th>F1 GLD</th>
                    <th>F1 HZ</th>
                    <th>F1 Below KW</th>
                    <th>F1 Below A</th>
                    <th>F1 Below V</th>
                    {/* Furnace 2 Headers */}
                    <th>F2 KW</th>
                    <th>F2 V</th>
                    <th>F2 A</th>
                    <th>F2 GLD</th>
                    <th>F2 HZ</th>
                    <th>F2 Below KW</th>
                    <th>F2 Below A</th>
                    <th>F2 Below V</th>
                    {/* Furnace 3 Headers */}
                    <th>F3 KW</th>
                    <th>F3 V</th>
                    <th>F3 A</th>
                    <th>F3 GLD</th>
                    <th>F3 HZ</th>
                    <th>F3 Below KW</th>
                    <th>F3 Below A</th>
                    <th>F3 Below V</th>
                    {/* Furnace 4 Headers */}
                    <th>F4 KW</th>
                    <th>F4 V</th>
                    <th>F4 A</th>
                    <th>F4 GLD</th>
                    <th>F4 HZ</th>
                    <th>F4 Below HZ</th>
                    <th>F4 Below GLD</th>
                    <th>F4 Below GLD1</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="75" className="melting-no-data">
                        No records found. Submit entries to see them here.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                        <td>{item.heatNo || '-'}</td>
                        <td>{item.grade || '-'}</td>
                        
                        {/* Charging Data */}
                        <td>{item.chargingTime || '-'}</td>
                        <td>{item.ifBath || '-'}</td>
                        <td>{item.liquidMetalPressPour || '-'}</td>
                        <td>{item.liquidMetalHolder || '-'}</td>
                        <td>{item.sgMsSteel || '-'}</td>
                        <td>{item.greyMsSteel || '-'}</td>
                        <td>{item.ralumsSg || '-'}</td>
                        <td>{item.gl || '-'}</td>
                        <td>{item.pigIron || '-'}</td>
                        <td>{item.borings || '-'}</td>
                        <td>{item.finalBath || '-'}</td>
                        
                        {/* Materials Data */}
                        <td>{item.charCoal || '-'}</td>
                        <td>{item.cpcFur || '-'}</td>
                        <td>{item.cpcLc || '-'}</td>
                        <td>{item.siliconCarbideFur || '-'}</td>
                        <td>{item.ferroSiliconFur || '-'}</td>
                        <td>{item.ferroSiliconLc || '-'}</td>
                        <td>{item.ferroManganeseFur || '-'}</td>
                        <td>{item.ferroManganeseLc || '-'}</td>
                        <td>{item.cu || '-'}</td>
                        <td>{item.cr || '-'}</td>
                        <td>{item.pureMg || '-'}</td>
                        <td>{item.ironPyrite || '-'}</td>
                        
                        {/* Lab Coin Data */}
                        <td>{item.labCoinTime || '-'}</td>
                        <td>{item.labCoinTemp || '-'}</td>
                        <td>{item.deslagingFrom || '-'}</td>
                        <td>{item.deslagingTo || '-'}</td>
                        <td>{item.metalReadyTime || '-'}</td>
                        <td>{item.waitingFrom || '-'}</td>
                        <td>{item.waitingTo || '-'}</td>
                        <td className="melting-text-cell">{item.waitingReason || '-'}</td>
                        
                        {/* Metal Tapping Data */}
                        <td>{item.tappingTime || '-'}</td>
                        <td>{item.tappingTemp || '-'}</td>
                        <td>{item.directFurnace || '-'}</td>
                        <td>{item.holderToFurnace || '-'}</td>
                        <td>{item.furnaceToHolder || '-'}</td>
                        <td>{item.disaNo || '-'}</td>
                        <td>{item.item || '-'}</td>
                        
                        {/* Furnace 1 Data */}
                        <td>{item.f1Kw || '-'}</td>
                        <td>{item.f1V || '-'}</td>
                        <td>{item.f1A || '-'}</td>
                        <td>{item.f1Gld || '-'}</td>
                        <td>{item.f1Hz || '-'}</td>
                        <td>{item.f1BelowKw || '-'}</td>
                        <td>{item.f1BelowA || '-'}</td>
                        <td>{item.f1BelowV || '-'}</td>
                        
                        {/* Furnace 2 Data */}
                        <td>{item.f2Kw || '-'}</td>
                        <td>{item.f2V || '-'}</td>
                        <td>{item.f2A || '-'}</td>
                        <td>{item.f2Gld || '-'}</td>
                        <td>{item.f2Hz || '-'}</td>
                        <td>{item.f2BelowKw || '-'}</td>
                        <td>{item.f2BelowA || '-'}</td>
                        <td>{item.f2BelowV || '-'}</td>
                        
                        {/* Furnace 3 Data */}
                        <td>{item.f3Kw || '-'}</td>
                        <td>{item.f3V || '-'}</td>
                        <td>{item.f3A || '-'}</td>
                        <td>{item.f3Gld || '-'}</td>
                        <td>{item.f3Hz || '-'}</td>
                        <td>{item.f3BelowKw || '-'}</td>
                        <td>{item.f3BelowA || '-'}</td>
                        <td>{item.f3BelowV || '-'}</td>
                        
                        {/* Furnace 4 Data */}
                        <td>{item.f4Kw || '-'}</td>
                        <td>{item.f4V || '-'}</td>
                        <td>{item.f4A || '-'}</td>
                        <td>{item.f4Gld || '-'}</td>
                        <td>{item.f4Hz || '-'}</td>
                        <td>{item.f4BelowHz || '-'}</td>
                        <td>{item.f4BelowGld || '-'}</td>
                        <td>{item.f4BelowGld1 || '-'}</td>
                        
                        <td className="melting-text-cell">{item.remarks || '-'}</td>
                        <td className="melting-table-actions">
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

export default MeltingLogSheetReport;
