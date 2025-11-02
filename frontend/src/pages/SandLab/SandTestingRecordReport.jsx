import React, { useState, useEffect } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { FilterButton, DatePicker, DeleteActionButton } from '../../Components/Buttons';
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
          <Loader2 size={40} className="animate-spin" />
        ) : (
          <div className="sand-table-container">
            <div className="sand-table-wrapper">
              <table className="sand-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Date</th>
                    {/* Sand Shifts - Shift I */}
                    <th colSpan="6">Shift I - Sand Data</th>
                    {/* Sand Shifts - Shift II */}
                    <th colSpan="7">Shift II - Sand Data</th>
                    {/* Sand Shifts - Shift III */}
                    <th colSpan="7">Shift III - Sand Data</th>
                    {/* Clay Parameters - All Shifts */}
                    <th colSpan="7">Clay Parameters - Shift I</th>
                    <th colSpan="7">Clay Parameters - Shift II</th>
                    <th colSpan="7">Clay Parameters - Shift III</th>
                    {/* Mix Shifts */}
                    <th colSpan="5">Mix Shift I</th>
                    <th colSpan="5">Mix Shift II</th>
                    <th colSpan="5">Mix Shift III</th>
                    {/* Sand Properties */}
                    <th colSpan="5">Sand Properties</th>
                    {/* Test Parameters */}
                    <th colSpan="30">Test Parameters</th>
                    <th rowSpan="2">Actions</th>
                  </tr>
                  <tr>
                    {/* Shift I Sand */}
                    <th>R Sand</th>
                    <th>N Sand</th>
                    <th>Mix Mode</th>
                    <th>Bentonite</th>
                    <th>Coal Dust Premix</th>
                    <th>Batch No</th>
                    {/* Shift II Sand */}
                    <th>R Sand</th>
                    <th>N Sand</th>
                    <th>Mix Mode</th>
                    <th>Bentonite</th>
                    <th>Coal Dust Premix</th>
                    <th>Coal Dust Batch</th>
                    <th>Premix Batch</th>
                    {/* Shift III Sand */}
                    <th>R Sand</th>
                    <th>N Sand</th>
                    <th>Mix Mode</th>
                    <th>Bentonite</th>
                    <th>Coal Dust Premix</th>
                    <th>Coal Dust Batch</th>
                    <th>Premix Batch</th>
                    {/* Clay Shift I */}
                    <th>Total Clay</th>
                    <th>Active Clay</th>
                    <th>Dead Clay</th>
                    <th>VCM</th>
                    <th>LOI</th>
                    <th>AFS No</th>
                    <th>Fines</th>
                    {/* Clay Shift II */}
                    <th>Total Clay</th>
                    <th>Active Clay</th>
                    <th>Dead Clay</th>
                    <th>VCM</th>
                    <th>LOI</th>
                    <th>AFS No</th>
                    <th>Fines</th>
                    {/* Clay Shift III */}
                    <th>Total Clay</th>
                    <th>Active Clay</th>
                    <th>Dead Clay</th>
                    <th>VCM</th>
                    <th>LOI</th>
                    <th>AFS No</th>
                    <th>Fines</th>
                    {/* Mix Shift I */}
                    <th>Start Mix</th>
                    <th>End Mix</th>
                    <th>Total</th>
                    <th>Mix Rejected</th>
                    <th>Hopper Level</th>
                    {/* Mix Shift II */}
                    <th>Start Mix</th>
                    <th>End Mix</th>
                    <th>Total</th>
                    <th>Mix Rejected</th>
                    <th>Hopper Level</th>
                    {/* Mix Shift III */}
                    <th>Start Mix</th>
                    <th>End Mix</th>
                    <th>Total</th>
                    <th>Mix Rejected</th>
                    <th>Hopper Level</th>
                    {/* Sand Properties */}
                    <th>Sand Lump</th>
                    <th>New Sand Wt</th>
                    <th>Friability I</th>
                    <th>Friability II</th>
                    <th>Friability III</th>
                    {/* Test Parameters */}
                    <th>S.No</th>
                    <th>Time</th>
                    <th>Mix No</th>
                    <th>Mould</th>
                    <th>Permeability</th>
                    <th>GCS FDY-A</th>
                    <th>GCS FDY-B</th>
                    <th>WTS</th>
                    <th>Moisture</th>
                    <th>Compactability</th>
                    <th>Compressibility</th>
                    <th>Water (L)</th>
                    <th>Temp BC</th>
                    <th>Temp WU</th>
                    <th>Temp SSUmax</th>
                    <th>New Sand (Kgs)</th>
                    <th>Bent w/ Premix (Kgs)</th>
                    <th>Bent w/ Premix (%)</th>
                    <th>Bentonite (Kgs)</th>
                    <th>Bentonite (%)</th>
                    <th>Premix (Kgs)</th>
                    <th>Premix (%)</th>
                    <th>Coal Dust (Kgs)</th>
                    <th>Coal Dust (%)</th>
                    <th>LC</th>
                    <th>Compact Settings</th>
                    <th>Mould Strength</th>
                    <th>Shear Strength</th>
                    <th>Prepared Sand Lumps</th>
                    <th>Item Name</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="96" className="sand-no-data">
                        No records found. Submit entries to see them here.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                        {/* Shift I Sand Data */}
                        <td>{item.sandShifts?.shiftI?.rSand || '-'}</td>
                        <td>{item.sandShifts?.shiftI?.nSand || '-'}</td>
                        <td>{item.sandShifts?.shiftI?.mixingMode || '-'}</td>
                        <td>{item.sandShifts?.shiftI?.bentonite || '-'}</td>
                        <td>{item.sandShifts?.shiftI?.coalDustPremix || '-'}</td>
                        <td>{item.sandShifts?.shiftI?.batchNo?.bentonite || '-'}</td>
                        {/* Shift II Sand Data */}
                        <td>{item.sandShifts?.shiftII?.rSand || '-'}</td>
                        <td>{item.sandShifts?.shiftII?.nSand || '-'}</td>
                        <td>{item.sandShifts?.shiftII?.mixingMode || '-'}</td>
                        <td>{item.sandShifts?.shiftII?.bentonite || '-'}</td>
                        <td>{item.sandShifts?.shiftII?.coalDustPremix || '-'}</td>
                        <td>{item.sandShifts?.shiftII?.batchNo?.coalDust || '-'}</td>
                        <td>{item.sandShifts?.shiftII?.batchNo?.Premix || '-'}</td>
                        {/* Shift III Sand Data */}
                        <td>{item.sandShifts?.shiftIII?.rSand || '-'}</td>
                        <td>{item.sandShifts?.shiftIII?.nSand || '-'}</td>
                        <td>{item.sandShifts?.shiftIII?.mixingMode || '-'}</td>
                        <td>{item.sandShifts?.shiftIII?.bentonite || '-'}</td>
                        <td>{item.sandShifts?.shiftIII?.coalDustPremix || '-'}</td>
                        <td>{item.sandShifts?.shiftIII?.batchNo?.coalDust || '-'}</td>
                        <td>{item.sandShifts?.shiftIII?.batchNo?.Premix || '-'}</td>
                        {/* Clay Shift I */}
                        <td>{item.clayShifts?.shiftI?.totalClay || '-'}</td>
                        <td>{item.clayShifts?.shiftI?.activeClay || '-'}</td>
                        <td>{item.clayShifts?.shiftI?.deadClay || '-'}</td>
                        <td>{item.clayShifts?.shiftI?.vcm || '-'}</td>
                        <td>{item.clayShifts?.shiftI?.loi || '-'}</td>
                        <td>{item.clayShifts?.shiftI?.afsNo || '-'}</td>
                        <td>{item.clayShifts?.shiftI?.fines || '-'}</td>
                        {/* Clay Shift II */}
                        <td>{item.clayShifts?.ShiftII?.totalClay || '-'}</td>
                        <td>{item.clayShifts?.ShiftII?.activeClay || '-'}</td>
                        <td>{item.clayShifts?.ShiftII?.deadClay || '-'}</td>
                        <td>{item.clayShifts?.ShiftII?.vcm || '-'}</td>
                        <td>{item.clayShifts?.ShiftII?.loi || '-'}</td>
                        <td>{item.clayShifts?.ShiftII?.afsNo || '-'}</td>
                        <td>{item.clayShifts?.ShiftII?.fines || '-'}</td>
                        {/* Clay Shift III */}
                        <td>{item.clayShifts?.ShiftIII?.totalClay || '-'}</td>
                        <td>{item.clayShifts?.ShiftIII?.activeClay || '-'}</td>
                        <td>{item.clayShifts?.ShiftIII?.deadClay || '-'}</td>
                        <td>{item.clayShifts?.ShiftIII?.vcm || '-'}</td>
                        <td>{item.clayShifts?.ShiftIII?.loi || '-'}</td>
                        <td>{item.clayShifts?.ShiftIII?.afsNo || '-'}</td>
                        <td>{item.clayShifts?.ShiftIII?.fines || '-'}</td>
                        {/* Mix Shift I */}
                        <td>{item.mixshifts?.ShiftI?.mixno?.start || '-'}</td>
                        <td>{item.mixshifts?.ShiftI?.mixno?.end || '-'}</td>
                        <td>{item.mixshifts?.ShiftI?.mixno?.total || '-'}</td>
                        <td>{item.mixshifts?.ShiftI?.numberOfMixRejected || '-'}</td>
                        <td>{item.mixshifts?.ShiftI?.returnSandHopperLevel || '-'}</td>
                        {/* Mix Shift II */}
                        <td>{item.mixshifts?.ShiftII?.mixno?.start || '-'}</td>
                        <td>{item.mixshifts?.ShiftII?.mixno?.end || '-'}</td>
                        <td>{item.mixshifts?.ShiftII?.mixno?.total || '-'}</td>
                        <td>{item.mixshifts?.ShiftII?.numberOfMixRejected || '-'}</td>
                        <td>{item.mixshifts?.ShiftII?.returnSandHopperLevel || '-'}</td>
                        {/* Mix Shift III */}
                        <td>{item.mixshifts?.ShiftIII?.mixno?.start || '-'}</td>
                        <td>{item.mixshifts?.ShiftIII?.mixno?.end || '-'}</td>
                        <td>{item.mixshifts?.ShiftIII?.mixno?.total || '-'}</td>
                        <td>{item.mixshifts?.ShiftIII?.numberOfMixRejected || '-'}</td>
                        <td>{item.mixshifts?.ShiftIII?.returnSandHopperLevel || '-'}</td>
                        {/* Sand Properties */}
                        <td>{item.sandLump || '-'}</td>
                        <td>{item.newSandWt || '-'}</td>
                        <td>{item.sandFriability?.shiftI || '-'}</td>
                        <td>{item.sandFriability?.shiftII || '-'}</td>
                        <td>{item.sandFriability?.shiftIII || '-'}</td>
                        {/* Test Parameters */}
                        <td>{item.testParameter?.sno || '-'}</td>
                        <td>{item.testParameter?.time || '-'}</td>
                        <td>{item.testParameter?.mixno || '-'}</td>
                        <td>{item.testParameter?.mould || '-'}</td>
                        <td>{item.testParameter?.permeability || '-'}</td>
                        <td>{item.testParameter?.gcsFdyA || '-'}</td>
                        <td>{item.testParameter?.gcsFdyB || '-'}</td>
                        <td>{item.testParameter?.wts || '-'}</td>
                        <td>{item.testParameter?.moisture || '-'}</td>
                        <td>{item.testParameter?.compactability || '-'}</td>
                        <td>{item.testParameter?.compressibility || '-'}</td>
                        <td>{item.testParameter?.waterLitre || '-'}</td>
                        <td>{item.testParameter?.sandTemp?.BC || '-'}</td>
                        <td>{item.testParameter?.sandTemp?.WU || '-'}</td>
                        <td>{item.testParameter?.sandTemp?.SSUmax || '-'}</td>
                        <td>{item.testParameter?.newSandKgs || '-'}</td>
                        <td>{item.testParameter?.bentoniteWithPremix?.Kgs || '-'}</td>
                        <td>{item.testParameter?.bentoniteWithPremix?.Percent || '-'}</td>
                        <td>{item.testParameter?.bentonite?.Kgs || '-'}</td>
                        <td>{item.testParameter?.bentonite?.Percent || '-'}</td>
                        <td>{item.testParameter?.premix?.Kgs || '-'}</td>
                        <td>{item.testParameter?.premix?.Percent || '-'}</td>
                        <td>{item.testParameter?.coalDust?.Kgs || '-'}</td>
                        <td>{item.testParameter?.coalDust?.Percent || '-'}</td>
                        <td>{item.testParameter?.lc || '-'}</td>
                        <td>{item.testParameter?.CompactabilitySettings || '-'}</td>
                        <td>{item.testParameter?.mouldStrength || '-'}</td>
                        <td>{item.testParameter?.shearStrengthSetting || '-'}</td>
                        <td>{item.testParameter?.preparedSandlumps || '-'}</td>
                        <td>{item.testParameter?.itemName || '-'}</td>
                        <td className="sand-remarks-cell">{item.testParameter?.remarks || '-'}</td>
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
