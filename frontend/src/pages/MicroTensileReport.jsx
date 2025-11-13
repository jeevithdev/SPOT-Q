import React, { useEffect, useState } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { DatePicker, FilterButton } from '../Components/Buttons';
import CustomDatePicker from '../Components/CustomDatePicker';
import api from '../utils/api';
import '../styles/PageStyles/MicroTensileReport.css';
import '../styles/PageStyles/MicroTensile.css';
import '../styles/PageStyles/Melting/CupolaHolderLogSheetReport.css';

const MicroTensileReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [entries, setEntries] = useState([]);
  const [show, setShow] = useState({ table1: false, remarks: false });
  const [confirm, setConfirm] = useState({ open: false, row: null });
  const [editModal, setEditModal] = useState({ open: false, row: null });
  const [editForm, setEditForm] = useState({});
  const [saveConfirm, setSaveConfirm] = useState({ open: false });
  const [remarkModal, setRemarkModal] = useState({ open: false, text: '' });
  const disaOptions = ['DISA 1', 'DISA 2', 'DISA 3', 'DISA 4'];

  const toggle = (key) => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const requestDelete = (row) => {
    if (!row?._id) return;
    setConfirm({ open: true, row });
  };

  const closeConfirm = () => setConfirm({ open: false, row: null });

  const performDelete = async () => {
    const row = confirm.row;
    if (!row?._id) return;
    try {
      await api.delete(`/v1/micro-tensile-tests/${row._id}`);
      setEntries((prev) => prev.filter((e) => e._id !== row._id));
    } catch (e) {
      alert(e.message || 'Failed to delete the record');
    } finally {
      closeConfirm();
    }
  };

  const requestEdit = (row) => {
    if (!row?._id) return;
    setEditForm({
      dateOfInspection: row.dateOfInspection ? new Date(row.dateOfInspection).toISOString().split('T')[0] : '',
      disa: Array.isArray(row.disa) ? row.disa.slice() : (row.disa ? [row.disa] : []),
      item: row.item || '',
      dateCode: row.dateCode || '',
      heatCode: row.heatCode || '',
      barDia: row.barDia ?? '',
      gaugeLength: row.gaugeLength ?? '',
      maxLoad: row.maxLoad ?? '',
      yieldLoad: row.yieldLoad ?? '',
      tensileStrength: row.tensileStrength ?? '',
      yieldStrength: row.yieldStrength ?? '',
      elongation: row.elongation ?? '',
      testedBy: row.testedBy ?? '',
      remarks: row.remarks || ''
    });
    setEditModal({ open: true, row });
  };

  const closeEditModal = () => setEditModal({ open: false, row: null });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditDisa = (value) => {
    setEditForm((prev) => {
      const arr = Array.isArray(prev.disa) ? prev.disa : [];
      const exists = arr.includes(value);
      return { ...prev, disa: exists ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const openSaveConfirm = () => setSaveConfirm({ open: true });
  const closeSaveConfirm = () => setSaveConfirm({ open: false });

  const performSave = async () => {
    const row = editModal.row;
    if (!row?._id) return;
    try {
      const payload = { ...editForm };
      const res = await api.put(`/v1/micro-tensile-tests/${row._id}`, payload);
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
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) {
      const [y, m, rest] = d.split('-');
      const day = rest.slice(0, 2);
      return `${day}-${m}-${y}`;
    }
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return String(d);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleFilter = async () => {
    if (!fromDate) return;
    setLoading(true);
    setError('');
    try {
      const start = fromDate;
      const end = toDate || fromDate;
      const data = await api.get(`/v1/micro-tensile-tests?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`);
      if (data?.success) {
        const list = Array.isArray(data.data) ? data.data : [];
        const sorted = [...list].sort((a, b) => {
          const da = new Date(a.dateOfInspection || a.createdAt || 0).getTime();
          const db = new Date(b.dateOfInspection || b.createdAt || 0).getTime();
          return db - da;
        });
        setEntries(sorted.slice(0, 5));
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

  useEffect(() => {
    setEntries([]);
  }, [fromDate, toDate]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const today = new Date();
        const end = today.toISOString().split('T')[0];
        const past = new Date(today);
        past.setDate(past.getDate() - 60);
        const start = past.toISOString().split('T')[0];
        const res = await api.get(`/v1/micro-tensile-tests?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`);
        if (res?.success && Array.isArray(res.data)) {
          const sorted = [...res.data].sort((a, b) => {
            const da = new Date(a.dateOfInspection || a.createdAt || 0).getTime();
            const db = new Date(b.dateOfInspection || b.createdAt || 0).getTime();
            return db - da;
          });
          setEntries(sorted.slice(0, 5));
        } else {
          setEntries([]);
        }
      } catch (e) {
        setEntries([]);
      }
    };
    loadRecent();
  }, []);

  const PrimaryTable = ({ list, show }) => {
    const renderRemarkCell = (text) => {
      const value = typeof text === 'string' ? text : '';
      if (!value) return '-';
      const short = value.length > 6 ? value.slice(0, 5) + '..' : value;
      return (
        <span
          onClick={() => setRemarkModal({ open: true, text: value })}
          title={value}
          style={{ cursor: 'pointer', color: '#0ea5e9', textDecoration: 'underline dotted' }}
        >
          {short}
        </span>
      );
    };

    const columns = [
      { key: 'dateOfInspection', label: 'Date of Inspection', get: (r) => formatDate(r.dateOfInspection) },
      { key: 'disa', label: 'DISA', get: (r) => Array.isArray(r.disa) ? r.disa.join(', ') : (r.disa || '-') },
      { key: 'item', label: 'Item', get: (r) => r.item || '-' },
      { key: 'dateCode', label: 'Date Code', get: (r) => r.dateCode || '-' },
      { key: 'heatCode', label: 'Heat Code', get: (r) => r.heatCode || '-' },
    ];

    if (show.table1) {
      columns.push(
        { key: 'barDia', label: 'Bar Dia (mm)', get: (r) => r.barDia ?? '-' },
        { key: 'gaugeLength', label: 'Gauge Length (mm)', get: (r) => r.gaugeLength ?? '-' },
        { key: 'maxLoad', label: 'Max Load (Kgs/KN)', get: (r) => r.maxLoad ?? '-' },
        { key: 'yieldLoad', label: 'Yield Load (Kgs/KN)', get: (r) => r.yieldLoad ?? '-' },
        { key: 'tensileStrength', label: 'Tensile Strength (Kg/mm² or MPa)', get: (r) => r.tensileStrength ?? '-' },
        { key: 'yieldStrength', label: 'Yield Strength (Kg/mm² or MPa)', get: (r) => r.yieldStrength ?? '-' },
        { key: 'elongation', label: 'Elongation', get: (r) => r.elongation ?? '-' },
        { key: 'testedBy', label: 'Tested By', get: (r) => r.testedBy ?? '-' },
      );
    }

    if (show.remarks) {
      columns.push({ key: 'remarks', label: 'Remarks', get: (r) => renderRemarkCell(r.remarks) });
    }

    return (
      <div className="chr-primary-table-wrap">
        <div className="chr-section-title">Primary Data</div>
        <div className="chr-table-scroll">
          <table className="chr-primary-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={`primary-${row._id || `${row.item}-${row.dateCode}-${row.heatCode}`}` }>
                  {columns.map((c) => (
                    <td key={`${(row._id || 'row')}-${c.key}`}>{c.get(row)}</td>
                  ))}
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => requestEdit(row)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => requestDelete(row)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #fecaca', background: '#fee2e2', color: '#b91c1c', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="microtensile-report-header">
        <div className="microtensile-report-header-text">
          <h2>
            <BookOpenCheck size={28} style={{ color: '#5B9AA9' }} />
            Micro Tensile Test - Report
          </h2>
        </div>
      </div>

      <div className="microtensile-filter-container">
        <div className="microtensile-filter-group">
          <label>Start Date</label>
          <DatePicker
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="Select start date"
          />
        </div>
        <div className="microtensile-filter-group">
          <label>End Date</label>
          <DatePicker
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="Select end date"
          />
        </div>
        <FilterButton onClick={handleFilter} disabled={!fromDate || loading}>
          {loading ? 'Loading...' : 'Filter'}
        </FilterButton>
      </div>

      <div className="chr-checklist-container">
        <div className="chr-checklist-title">Checklist</div>
        <div className="chr-checklist">
          <label className="chr-check">
            <input type="checkbox" checked={show.table1} onChange={() => toggle('table1')} />
            <span>Table 1</span>
          </label>
          <label className="chr-check">
            <input type="checkbox" checked={show.remarks} onChange={() => toggle('remarks')} />
            <span>Remarks</span>
          </label>
        </div>
      </div>

      <PrimaryTable list={entries} show={show} />

      {error && (
        <div className="chr-error">{error}</div>
      )}

      <div className="chr-results">
        {entries.length === 0 && !loading && (
          <div className="chr-empty">No records found for the selected date range.</div>
        )}
      </div>

      {confirm.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: 8, padding: 20, width: 'min(420px, 95vw)', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Confirm Deletion</div>
            <div style={{ color: '#334155' }}>Are you sure you want to delete this record?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button onClick={closeConfirm} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}>Cancel</button>
              <button onClick={performDelete} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #fecaca', background: '#fee2e2', color: '#b91c1c', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {editModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 20, width: 'min(900px, 95vw)', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Edit Micro Tensile Test</div>
              <button onClick={closeEditModal} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>Close</button>
            </div>

            <div className="microtensile-form-grid">
              <div className="microtensile-form-group">
                <label>Date of Inspection *</label>
                <CustomDatePicker
                  name="dateOfInspection"
                  value={editForm.dateOfInspection || ''}
                  onChange={(e) => handleEditChange({ target: { name: 'dateOfInspection', value: e.target.value } })}
                />
              </div>

              <div className="microtensile-form-group">
                <label>Item *</label>
                <input type="text" name="item" value={editForm.item || ''} onChange={handleEditChange} placeholder="e.g: Sample Bar" />
              </div>

              <div className="microtensile-form-group">
                <label>Date Code *</label>
                <input type="text" name="dateCode" value={editForm.dateCode || ''} onChange={handleEditChange} placeholder="e.g: 2024-HC" />
              </div>

              <div className="microtensile-form-group">
                <label>Heat Code *</label>
                <input type="text" name="heatCode" value={editForm.heatCode || ''} onChange={handleEditChange} placeholder="e.g: 012" />
              </div>

              <div className="microtensile-form-group">
                <label>Bar Dia (mm) *</label>
                <input type="number" step="0.01" name="barDia" value={editForm.barDia ?? ''} onChange={handleEditChange} placeholder="e.g: 6.0" />
              </div>

              <div className="microtensile-form-group">
                <label>Gauge Length (mm) *</label>
                <input type="number" step="0.01" name="gaugeLength" value={editForm.gaugeLength ?? ''} onChange={handleEditChange} placeholder="e.g: 30.0" />
              </div>

              <div className="microtensile-form-group">
                <label>Max Load (Kgs) or KN *</label>
                <input type="number" step="0.01" name="maxLoad" value={editForm.maxLoad ?? ''} onChange={handleEditChange} placeholder="e.g: 1560" />
              </div>

              <div className="microtensile-form-group">
                <label>Yield Load (Kgs) or KN *</label>
                <input type="number" step="0.01" name="yieldLoad" value={editForm.yieldLoad ?? ''} onChange={handleEditChange} placeholder="e.g: 1290" />
              </div>

              <div className="microtensile-form-group">
                <label>Tensile Strength (Kg/mm² or Mpa) *</label>
                <input type="number" step="0.01" name="tensileStrength" value={editForm.tensileStrength ?? ''} onChange={handleEditChange} placeholder="e.g: 550" />
              </div>

              <div className="microtensile-form-group">
                <label>Yield Strength (Kg/mm² or Mpa) *</label>
                <input type="number" step="0.01" name="yieldStrength" value={editForm.yieldStrength ?? ''} onChange={handleEditChange} placeholder="e.g: 455" />
              </div>

              <div className="microtensile-form-group">
                <label>Elongation % *</label>
                <input type="number" step="0.01" name="elongation" value={editForm.elongation ?? ''} onChange={handleEditChange} placeholder="e.g: 18.5" />
              </div>

              <div className="microtensile-form-group" style={{ gridColumn: 'span 2' }}>
                <label>Remarks</label>
                <input type="text" name="remarks" value={editForm.remarks || ''} onChange={handleEditChange} placeholder="Enter any additional notes or observations..." maxLength={80} />
              </div>

              <div className="microtensile-form-group">
                <label>Tested By *</label>
                <input type="text" name="testedBy" value={editForm.testedBy || ''} onChange={handleEditChange} placeholder="e.g: John Smith" />
              </div>

              <div className="microtensile-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>DISA *</label>
                <div className="microtensile-disa-checklist">
                  {disaOptions.map((opt) => (
                    <label key={opt} className="microtensile-checkbox-label">
                      <input
                        type="checkbox"
                        className="microtensile-checkbox"
                        checked={Array.isArray(editForm.disa) && editForm.disa.includes(opt)}
                        onChange={() => toggleEditDisa(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button onClick={closeEditModal} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }}>Cancel</button>
              <button onClick={openSaveConfirm} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #bbf7d0', background: '#dcfce7', color: '#166534', cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {saveConfirm.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'white', borderRadius: 8, padding: 20, width: '100%', maxWidth: 420, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Confirm Save</div>
            <div style={{ color: '#334155' }}>Do you want to save the changes?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button onClick={closeSaveConfirm} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}>No</button>
              <button onClick={performSave} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #bbf7d0', background: '#dcfce7', color: '#166534', cursor: 'pointer' }}>Yes, Save</button>
            </div>
          </div>
        </div>
      )}

      {remarkModal.open && (
        <div onClick={() => setRemarkModal({ open: false, text: '' })} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 10, padding: 16, width: 'min(520px, 95vw)', maxWidth: '95vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Remarks</div>
            <div style={{ color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{remarkModal.text}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default MicroTensileReport;
