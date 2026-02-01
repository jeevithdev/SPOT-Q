import React, { useEffect, useState } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { FilterButton, ClearButton } from '../../Components/Buttons';
import CustomDatePicker from '../../Components/CustomDatePicker';
import Table from '../../Components/Table';
import '../../styles/PageStyles/Melting/CupolaHolderLogSheetReport.css';

const CupolaHolderLogSheetReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [entries, setEntries] = useState([]);
  const [show, setShow] = useState({ table1: false, table2: false, table3: false, remarks: false });
  
  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Load current data on mount
  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/cupola-logs/filter?startDate=${currentDate}&endDate=${currentDate}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data?.success) {
        const list = Array.isArray(data.data) ? data.data : [];
        const sorted = [...list].sort((a, b) => {
          const da = new Date(a.date || a.createdAt || 0).getTime();
          const db = new Date(b.date || b.createdAt || 0).getTime();
          return db - da;
        });
        setEntries(sorted);
      } else {
        setEntries([]);
      }
    } catch (e) {
      setError(e.message || 'Failed to fetch current data');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    if (!startDate) {
      alert('Please select at least a start date');
      return;
    }
    
    // Use endDate if provided, otherwise use startDate for single day filter
    const filterEndDate = endDate || startDate;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/cupola-logs/filter?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(filterEndDate)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data?.success) {
        const list = Array.isArray(data.data) ? data.data : [];
        const sorted = [...list].sort((a, b) => {
          const da = new Date(a.date || a.createdAt || 0).getTime();
          const db = new Date(b.date || b.createdAt || 0).getTime();
          return db - da;
        });
        setEntries(sorted);
      } else {
        setEntries([]);
      }
    } catch (e) {
      setError(e.message || 'Failed to fetch report data');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setError('');
    loadCurrentData(); // Reload current data when filters are cleared
  };

  const toggle = (key) => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const [confirm, setConfirm] = useState({ open: false, row: null });
  const [editModal, setEditModal] = useState({ open: false, row: null });
  const [editForm, setEditForm] = useState({});
  const [saveConfirm, setSaveConfirm] = useState({ open: false });
  const [remarkModal, setRemarkModal] = useState({ open: false, text: '' });

  const requestDelete = (row) => {
    if (!row?._id) return;
    setConfirm({ open: true, row });
  };

  const closeConfirm = () => setConfirm({ open: false, row: null });

  const performDelete = async () => {
    const row = confirm.row;
    if (!row?._id) return;
    try {
      const response = await fetch(`/v1/cupola-holder-logs/${row._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      if (response.ok) {
        setEntries((prev) => prev.filter((e) => e._id !== row._id));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete the record');
      }
    } catch (e) {
      alert(e.message || 'Failed to delete the record');
    } finally {
      closeConfirm();
    }
  };

  const requestEdit = (row) => {
    if (!row?._id) return;
    setEditForm({
      date: row.date ? new Date(row.date).toISOString().split('T')[0] : '',
      shift: row.shift || '',
      holderNumber: row.holderNumber || row.holderno || '',
      heatNo: row.heatNo || '',
      cpc: row.cpc ?? '',
      mFeSl: row.mFeSl ?? row.FeSl ?? '',
      feMn: row.feMn ?? '',
      sic: row.sic ?? '',
      pureMg: row.pureMg ?? '',
      cu: row.cu ?? '',
      feCr: row.feCr ?? '',
      actualTime: row.actualTime ?? row?.tapping?.time?.actualTime ?? '',
      tappingTime: row.tappingTime ?? row?.tapping?.time?.tappingTime ?? '',
      tappingTemp: row.tappingTemp ?? row?.tapping?.tempC ?? '',
      metalKg: row.metalKg ?? row?.tapping?.metalKgs ?? '',
      disaLine: row.disaLine ?? row?.pouring?.disaLine ?? '',
      indFur: row.indFur ?? row?.pouring?.indFur ?? '',
      bailNo: row.bailNo ?? row?.pouring?.bailNo ?? '',
      tap: row.tap ?? row?.electrical?.tap ?? '',
      kw: row.kw ?? row?.electrical?.kw ?? '',
      remarks: row.remarks || ''
    });
    setEditModal({ open: true, row });
  };

  const closeEditModal = () => setEditModal({ open: false, row: null });
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const openSaveConfirm = () => setSaveConfirm({ open: true });
  const closeSaveConfirm = () => setSaveConfirm({ open: false });
  const performSave = async () => {
    const row = editModal.row;
    if (!row?._id) return;
    try {
      const payload = { ...editForm };
      const response = await fetch(`/v1/cupola-holder-logs/${row._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(payload)
      });
      const res = await response.json();
      if (res?.success) {
        setEntries((prev) => prev.map((e) => (e._id === row._id ? { ...e, ...payload, _id: row._id } : e)));
        setEditModal({ open: false, row: null });
        setSaveConfirm({ open: false });
      }
    } catch (e) {
      alert(e.message || 'Failed to update the record');
    } finally {
      setSaveConfirm({ open: false });
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString('en-GB');
  };

  const buildColumns = () => {
    const columns = [
      { key: 'date', label: 'Date', width: '100px', render: (r) => formatDate(r.date) },
      { key: 'shift', label: 'Shift', width: '80px', render: (r) => r.shift || '-' },
      { key: 'holderNumber', label: 'Holder No', width: '100px', render: (r) => r.holderNumber || r.holderno || '-' },
      { key: 'heatNo', label: 'Heat No', width: '90px', render: (r) => r.heatNo || '-' },
    ];

    if (show.table1) {
      columns.push(
        { key: 'cpc', label: 'CPC', width: '80px', render: (r) => r.cpc ?? '-' },
        { key: 'mFeSl', label: 'Fe Sl', width: '80px', render: (r) => r.mFeSl ?? r.FeSl ?? '-' },
        { key: 'feMn', label: 'Fe Mn', width: '80px', render: (r) => r.feMn ?? '-' },
        { key: 'sic', label: 'Sic', width: '80px', render: (r) => r.sic ?? '-' },
        { key: 'pureMg', label: 'Pure Mg', width: '90px', render: (r) => r.pureMg ?? '-' },
        { key: 'cu', label: 'Cu', width: '70px', render: (r) => r.cu ?? '-' },
        { key: 'feCr', label: 'Fe Cr', width: '80px', render: (r) => r.feCr ?? '-' },
      );
    }

    if (show.table2) {
      columns.push(
        { key: 'actualTime', label: 'Actual Time', width: '110px', render: (r) => r.actualTime ?? r?.tapping?.time?.actualTime ?? '-' },
        { key: 'tappingTime', label: 'Tapping Time', width: '110px', render: (r) => r.tappingTime ?? r?.tapping?.time?.tappingTime ?? '-' },
        { key: 'tappingTemp', label: 'Temp (°C)', width: '90px', render: (r) => r.tappingTemp ?? r?.tapping?.tempC ?? '-' },
        { key: 'metalKg', label: 'Metal (KG)', width: '100px', render: (r) => r.metalKg ?? r?.tapping?.metalKgs ?? '-' },
      );
    }

    if (show.table3) {
      columns.push(
        { key: 'disaLine', label: 'DISA LINE', width: '100px', render: (r) => r.disaLine ?? r?.pouring?.disaLine ?? '-' },
        { key: 'indFur', label: 'IND FUR', width: '90px', render: (r) => r.indFur ?? r?.pouring?.indFur ?? '-' },
        { key: 'bailNo', label: 'BAIL NO', width: '90px', render: (r) => r.bailNo ?? r?.pouring?.bailNo ?? '-' },
        { key: 'tap', label: 'TAP', width: '80px', render: (r) => r.tap ?? r?.electrical?.tap ?? '-' },
        { key: 'kw', label: 'KW', width: '70px', render: (r) => r.kw ?? r?.electrical?.kw ?? '-' },
      );
    }

    if (show.remarks) {
      columns.push({
        key: 'remarks',
        label: 'Remarks',
        width: '120px',
        render: (r) => {
          const value = r?.remarks || r?.remark || r?.notes || r?.note || '';
          if (!value) return '-';
          const short = value.length > 6 ? value.slice(0, 5) + '..' : value;
          return (
            <span
              onClick={() => setRemarkModal({ open: true, text: value })}
              title={value}
              style={{ cursor: 'pointer', color: '#0ea5e9', textDecoration: 'underline dotted' }}
            >
              {short}</span>
          );
        }
      });
    }

    return columns;
  };

  const PrimaryTable = ({ list, show }) => {
    const columns = buildColumns();

    return (
      <div className="chr-primary-table-wrap">
        <div className="chr-section-title">Cupola Holder Log Sheet Report</div>
        <Table
          columns={columns}
          data={list}
          noDataMessage="No records found for the selected date range."
          minWidth={1600}
          striped={true}
          headerGradient={true}
        />
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="cupola-holder-report-header">
        <div className="cupola-holder-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Cupola Holder Log Sheet - Report
          </h2>
        </div>
      </div>

      {/* Filter Section */}
      <div className="cupola-holder-filter-container">
        <div className="cupola-holder-filter-group">
          <label>Start Date</label>
          <CustomDatePicker
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="cupola-holder-filter-group">
          <label>End Date</label>
          <CustomDatePicker
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <FilterButton onClick={loadFilteredData} disabled={loading}>
          {loading ? 'Loading...' : 'Filter'}
        </FilterButton>
        <ClearButton onClick={clearFilters}>
          Clear
        </ClearButton>
      </div>

      {/* Show/Hide Sections */}

      <div className="chr-checklist-container">
        <div className="chr-checklist-title">Checklist</div>
        <div className="chr-checklist">
          <label className="chr-check">
            <input type="checkbox" checked={show.table1} onChange={() => toggle('table1')} />
            <span>Table 1</span>
          </label>
          <label className="chr-check">
            <input type="checkbox" checked={show.table2} onChange={() => toggle('table2')} />
            <span>Table 2</span>
          </label>
          <label className="chr-check">
            <input type="checkbox" checked={show.table3} onChange={() => toggle('table3')} />
            <span>Table 3</span>
          </label>
          <label className="chr-check">
            <input type="checkbox" checked={show.remarks} onChange={() => toggle('remarks')} />
            <span>Remarks</span>
          </label>
        </div>
      </div>

      <PrimaryTable list={entries} show={show} />




    </div>
  );
};

export default CupolaHolderLogSheetReport;
