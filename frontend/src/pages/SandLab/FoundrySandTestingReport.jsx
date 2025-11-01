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
                    <th rowSpan="2">Date</th>
                    <th rowSpan="2">Shift</th>
                    <th rowSpan="2">Sand Plant</th>
                    <th rowSpan="2">Compactability Setting</th>
                    <th rowSpan="2">Shear Strength Setting</th>
                    {/* Clay Tests */}
                    <th colSpan="5">Clay Tests - Test 1</th>
                    <th colSpan="5">Clay Tests - Test 2</th>
                    {/* Sieve Size Test 1 */}
                    <th colSpan="11">Sieve Size Test 1</th>
                    {/* Sieve Size Test 2 */}
                    <th colSpan="11">Sieve Size Test 2</th>
                    {/* MF Test */}
                    <th colSpan="11">MF Test</th>
                    {/* Test Parameters Test 1 */}
                    <th colSpan="10">Test Parameters - Test 1</th>
                    {/* Test Parameters Test 2 */}
                    <th colSpan="10">Test Parameters - Test 2</th>
                    {/* Additional Data Test 1 */}
                    <th colSpan="3">Additional Data - Test 1</th>
                    {/* Additional Data Test 2 */}
                    <th colSpan="3">Additional Data - Test 2</th>
                    <th rowSpan="2">Remarks</th>
                    <th rowSpan="2">Actions</th>
                  </tr>
                  <tr>
                    {/* Clay Test Headers */}
                    <th>Total Clay</th>
                    <th>Active Clay</th>
                    <th>Dead Clay</th>
                    <th>VCM</th>
                    <th>LOI</th>
                    <th>Total Clay</th>
                    <th>Active Clay</th>
                    <th>Dead Clay</th>
                    <th>VCM</th>
                    <th>LOI</th>
                    {/* Sieve Size Headers */}
                    <th>1700</th>
                    <th>850</th>
                    <th>600</th>
                    <th>425</th>
                    <th>300</th>
                    <th>212</th>
                    <th>150</th>
                    <th>106</th>
                    <th>75</th>
                    <th>Pan</th>
                    <th>Total</th>
                    <th>1700</th>
                    <th>850</th>
                    <th>600</th>
                    <th>425</th>
                    <th>300</th>
                    <th>212</th>
                    <th>150</th>
                    <th>106</th>
                    <th>75</th>
                    <th>Pan</th>
                    <th>Total</th>
                    {/* MF Test Headers */}
                    <th>5</th>
                    <th>10</th>
                    <th>20</th>
                    <th>30</th>
                    <th>50</th>
                    <th>70</th>
                    <th>100</th>
                    <th>140</th>
                    <th>200</th>
                    <th>300</th>
                    <th>Total</th>
                    {/* Test Parameters Headers */}
                    <th>GCS</th>
                    <th>Bentonite Premix</th>
                    <th>Premix Coal Dust</th>
                    <th>LC Compact SMCAT</th>
                    <th>Mould Strength SNCAT</th>
                    <th>Permeability</th>
                    <th>WTS</th>
                    <th>Moisture</th>
                    <th>Hopper Level</th>
                    <th>Return Sand</th>
                    <th>GCS</th>
                    <th>Bentonite Premix</th>
                    <th>Premix Coal Dust</th>
                    <th>LC Compact SMCAT</th>
                    <th>Mould Strength SNCAT</th>
                    <th>Permeability</th>
                    <th>WTS</th>
                    <th>Moisture</th>
                    <th>Hopper Level</th>
                    <th>Return Sand</th>
                    {/* Additional Data Headers */}
                    <th>AFS No</th>
                    <th>Fines</th>
                    <th>GD</th>
                    <th>AFS No</th>
                    <th>Fines</th>
                    <th>GD</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="81" className="foundry-no-data">
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
                        {/* Clay Tests Test 1 */}
                        <td>{item.clayTests?.test1?.totalClay || '-'}</td>
                        <td>{item.clayTests?.test1?.activeClay || '-'}</td>
                        <td>{item.clayTests?.test1?.deadClay || '-'}</td>
                        <td>{item.clayTests?.test1?.vcm || '-'}</td>
                        <td>{item.clayTests?.test1?.loi || '-'}</td>
                        {/* Clay Tests Test 2 */}
                        <td>{item.clayTests?.test2?.totalClay || '-'}</td>
                        <td>{item.clayTests?.test2?.activeClay || '-'}</td>
                        <td>{item.clayTests?.test2?.deadClay || '-'}</td>
                        <td>{item.clayTests?.test2?.vcm || '-'}</td>
                        <td>{item.clayTests?.test2?.loi || '-'}</td>
                        {/* Sieve Size Test 1 */}
                        <td>{item.test1?.sieveSize?.['1700'] || '-'}</td>
                        <td>{item.test1?.sieveSize?.['850'] || '-'}</td>
                        <td>{item.test1?.sieveSize?.['600'] || '-'}</td>
                        <td>{item.test1?.sieveSize?.['425'] || '-'}</td>
                        <td>{item.test1?.sieveSize?.['300'] || '-'}</td>
                        <td>{item.test1?.sieveSize?.['212'] || '-'}</td>
                        <td>{item.test1?.sieveSize?.['150'] || '-'}</td>
                        <td>{item.test1?.sieveSize?.['106'] || '-'}</td>
                        <td>{item.test1?.sieveSize?.['75'] || '-'}</td>
                        <td>{item.test1?.sieveSize?.pan || '-'}</td>
                        <td>{item.test1?.sieveSize?.total || '-'}</td>
                        {/* Sieve Size Test 2 */}
                        <td>{item.test2?.sieveSize?.['1700'] || '-'}</td>
                        <td>{item.test2?.sieveSize?.['850'] || '-'}</td>
                        <td>{item.test2?.sieveSize?.['600'] || '-'}</td>
                        <td>{item.test2?.sieveSize?.['425'] || '-'}</td>
                        <td>{item.test2?.sieveSize?.['300'] || '-'}</td>
                        <td>{item.test2?.sieveSize?.['212'] || '-'}</td>
                        <td>{item.test2?.sieveSize?.['150'] || '-'}</td>
                        <td>{item.test2?.sieveSize?.['106'] || '-'}</td>
                        <td>{item.test2?.sieveSize?.['75'] || '-'}</td>
                        <td>{item.test2?.sieveSize?.pan || '-'}</td>
                        <td>{item.test2?.sieveSize?.total || '-'}</td>
                        {/* MF Test */}
                        <td>{item.mfTest?.mf?.['5'] || '-'}</td>
                        <td>{item.mfTest?.mf?.['10'] || '-'}</td>
                        <td>{item.mfTest?.mf?.['20'] || '-'}</td>
                        <td>{item.mfTest?.mf?.['30'] || '-'}</td>
                        <td>{item.mfTest?.mf?.['50'] || '-'}</td>
                        <td>{item.mfTest?.mf?.['70'] || '-'}</td>
                        <td>{item.mfTest?.mf?.['100'] || '-'}</td>
                        <td>{item.mfTest?.mf?.['140'] || '-'}</td>
                        <td>{item.mfTest?.mf?.['200'] || '-'}</td>
                        <td>{item.mfTest?.mf?.pan || '-'}</td>
                        <td>{item.mfTest?.mf?.total || '-'}</td>
                        {/* Test Parameters Test 1 */}
                        <td>{item.parameters?.test1?.gcs || '-'}</td>
                        <td>{item.parameters?.test1?.bentonitePremix || '-'}</td>
                        <td>{item.parameters?.test1?.premixCoaldust || '-'}</td>
                        <td>{item.parameters?.test1?.lcCompactSmcat || '-'}</td>
                        <td>{item.parameters?.test1?.mouldStrengthSncat || '-'}</td>
                        <td>{item.parameters?.test1?.permeability || '-'}</td>
                        <td>{item.parameters?.test1?.wts || '-'}</td>
                        <td>{item.parameters?.test1?.moisture || '-'}</td>
                        <td>{item.parameters?.test1?.hopperLevel || '-'}</td>
                        <td>{item.parameters?.test1?.returnSand || '-'}</td>
                        {/* Test Parameters Test 2 */}
                        <td>{item.parameters?.test2?.gcs || '-'}</td>
                        <td>{item.parameters?.test2?.bentonitePremix || '-'}</td>
                        <td>{item.parameters?.test2?.premixCoaldust || '-'}</td>
                        <td>{item.parameters?.test2?.lcCompactSmcat || '-'}</td>
                        <td>{item.parameters?.test2?.mouldStrengthSncat || '-'}</td>
                        <td>{item.parameters?.test2?.permeability || '-'}</td>
                        <td>{item.parameters?.test2?.wts || '-'}</td>
                        <td>{item.parameters?.test2?.moisture || '-'}</td>
                        <td>{item.parameters?.test2?.hopperLevel || '-'}</td>
                        <td>{item.parameters?.test2?.returnSand || '-'}</td>
                        {/* Additional Data Test 1 */}
                        <td>{item.additionalData?.test1?.afsNo || '-'}</td>
                        <td>{item.additionalData?.test1?.fines || '-'}</td>
                        <td>{item.additionalData?.test1?.gd || '-'}</td>
                        {/* Additional Data Test 2 */}
                        <td>{item.additionalData?.test2?.afsNo || '-'}</td>
                        <td>{item.additionalData?.test2?.fines || '-'}</td>
                        <td>{item.additionalData?.test2?.gd || '-'}</td>
                        {/* Remarks */}
                        <td className="foundry-remarks-cell">{item.remarks || '-'}</td>
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
