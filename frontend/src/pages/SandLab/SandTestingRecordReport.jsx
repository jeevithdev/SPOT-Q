import React, { useEffect, useState } from 'react';
import { PencilLine, Filter as FilterIcon, Trash2, BookOpen } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import api from '../../utils/api';

import '../../styles/PageStyles/Sandlab/SandTestingRecordReport.css';

const TABS = ['All Data', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Sand Properties & Test Parameters'];

const TABLE5_ROWS = [
  'S.No',
  'Time',
  'Mix No',
  'Permeability',
  'GCS Checkpoint',
  'GCS Value',
  'WTS',
  'Moisture',
  'Compactability',
  'Compressability',
  'Water Litre/Kg Mix',
  'Sand Temp BC',
  'Sand Temp WU',
  'Sand Temp SSU',
  'New Sand Kgs/Mould',
  'Bentonite Checkpoint',
  'Bentonite With Premix',
  'Bentonite Only',
  'Premix Coal Dust Checkpoint',
  'Premix Kgs/Mix',
  'Coal Dust Kgs/Mix',
  'LCSM Compactability Checkpoint',
  'LCSM Compactability Value',
  'Mould Strength Shear Checkpoint',
  'Mould Strength Shear Value',
  'Prepared Sand Lumps/Kg',
  'Item Name',
  'Remarks'
];

const SHIFTS = [
  { key: 'shiftI', label: 'Shift I' },
  { key: 'shiftII', label: 'Shift II' },
  { key: 'shiftIII', label: 'Shift III' }
];

const TABLE5_KEYS = [
  'sno','time','mixNo','permeability','gcsCheckpoint','gcsValue','wts','moisture','compactability',
  'compressability','waterLitrePerKgMix','sandTempBC','sandTempWU','sandTempSSU','newSandKgsPerMould',
  'bentoniteCheckpoint','bentoniteWithPremix','bentoniteOnly','premixCoalDustCheckpoint','premixKgsMix',
  'coalDustKgsMix','lcScmCompactabilityCheckpoint','lcScmCompactabilityValue','mouldStrengthShearCheckpoint',
  'mouldStrengthShearValue','preparedSandLumpsPerKg','itemName','remarks'
];

const SandTestingRecordReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  // show only "Sand Properties & Test Parameters" inline by default.
  // Table 1-4 buttons will open card-size modals instead of switching inline view.
  const [activeTab, setActiveTab] = useState('Sand Properties & Test Parameters');
  const [records, setRecords] = useState([]);
  const [displayRecords, setDisplayRecords] = useState([]);

  // Edit modal state (Table 5 full edit)
  const [editTpModalOpen, setEditTpModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    sno: '',
    time: '',
    mixNo: '',
    permeability: '',
    gcsCheckpoint: '',
    gcsValue: '',
    wts: '',
    moisture: '',
    compactability: '',
    compressability: '',
    waterLitrePerKgMix: '',
    sandTempBC: '',
    sandTempWU: '',
    sandTempSSU: '',
    newSandKgsPerMould: '',
    bentoniteCheckpoint: '',
    bentoniteWithPremix: '',
    bentoniteOnly: '',
    premixCoalDustCheckpoint: '',
    premixKgsMix: '',
    coalDustKgsMix: '',
    lcScmCompactabilityCheckpoint: '',
    lcScmCompactabilityValue: '',
    mouldStrengthShearCheckpoint: '',
    mouldStrengthShearValue: '',
    preparedSandLumpsPerKg: '',
    itemName: '',
    remarks: ''
  });
  const [editMeta, setEditMeta] = useState({ id: null, date: null });

  const [t1EditModalOpen, setT1EditModalOpen] = useState(false);
  const [t1EditForm, setT1EditForm] = useState({
    shiftI: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNoBentonite: '', batchNoCoalDustPremix: '' },
    shiftII: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNoBentonite: '', batchNoCoalDustPremix: '' },
    shiftIII: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNoBentonite: '', batchNoCoalDustPremix: '' }
  });
  const [t1EditMeta, setT1EditMeta] = useState({ id: null, date: null });

  const [t2EditModalOpen, setT2EditModalOpen] = useState(false);
  const [t2EditForm, setT2EditForm] = useState({
    shiftI: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
    shiftII: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
    shiftIII: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' }
  });
  const [t2EditMeta, setT2EditMeta] = useState({ id: null, date: null });

  const [t3EditModalOpen, setT3EditModalOpen] = useState(false);
  const [t3EditForm, setT3EditForm] = useState({
    ShiftI: { mixnoStart: '', mixnoEnd: '', mixnoTotal: '', numberOfMixRejected: '', returnSandHopperLevel: '' },
    ShiftII: { mixnoStart: '', mixnoEnd: '', mixnoTotal: '', numberOfMixRejected: '', returnSandHopperLevel: '' },
    ShiftIII: { mixnoStart: '', mixnoEnd: '', mixnoTotal: '', numberOfMixRejected: '', returnSandHopperLevel: '' },
    total: { mixnoStart: '', mixnoEnd: '', mixnoTotal: '' }
  });
  const [t3EditMeta, setT3EditMeta] = useState({ id: null, date: null });

  const [t4EditModalOpen, setT4EditModalOpen] = useState(false);
  const [t4EditForm, setT4EditForm] = useState({ sandLump: '', newSandWt: '', sandFriability: { shiftI: '', shiftII: '', shiftIII: '' } });
  const [t4EditMeta, setT4EditMeta] = useState({ id: null, date: null });

  // Modal states for all tables
  const [table1ModalOpen, setTable1ModalOpen] = useState(false);
  const [table2ModalOpen, setTable2ModalOpen] = useState(false);
  const [table3ModalOpen, setTable3ModalOpen] = useState(false);
  const [table4ModalOpen, setTable4ModalOpen] = useState(false);
  
  const openTable1Modal = () => setTable1ModalOpen(true);
  const closeTable1Modal = () => setTable1ModalOpen(false);
  const openTable2Modal = () => setTable2ModalOpen(true);
  const closeTable2Modal = () => setTable2ModalOpen(false);
  const openTable3Modal = () => setTable3ModalOpen(true);
  const closeTable3Modal = () => setTable3ModalOpen(false);
  const openTable4Modal = () => setTable4ModalOpen(true);
  const closeTable4Modal = () => setTable4ModalOpen(false);
  
  // lightweight toast for success/error
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success', duration = 2000) => {
    setToast({ show: true, message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ show: false, message: '', type }), duration);
  };

  const openT2EditModal = (rec) => {
    const cs = rec?.clayShifts || {};
    const s1 = cs.shiftI || {};
    const s2 = cs.shiftII || cs.ShiftII || {};
    const s3 = cs.shiftIII || cs.ShiftIII || {};
    setT2EditForm({
      shiftI: { totalClay: s1.totalClay || '', activeClay: s1.activeClay || '', deadClay: s1.deadClay || '', vcm: s1.vcm || '', loi: s1.loi || '', afsNo: s1.afsNo || '', fines: s1.fines || '' },
      shiftII: { totalClay: s2.totalClay || '', activeClay: s2.activeClay || '', deadClay: s2.deadClay || '', vcm: s2.vcm || '', loi: s2.loi || '', afsNo: s2.afsNo || '', fines: s2.fines || '' },
      shiftIII: { totalClay: s3.totalClay || '', activeClay: s3.activeClay || '', deadClay: s3.deadClay || '', vcm: s3.vcm || '', loi: s3.loi || '', afsNo: s3.afsNo || '', fines: s3.fines || '' }
    });
    setT2EditMeta({ id: rec?._id || rec?.id || null, date: rec?.date || null });
    setT2EditModalOpen(true);
  };
  const closeT2EditModal = () => setT2EditModalOpen(false);
  const submitT2Edit = async () => {
    try {
      const payload = {
        tableNum: 2,
        data: {
          date: t2EditMeta.date,
          shiftI: { ...t2EditForm.shiftI },
          ShiftII: { ...t2EditForm.shiftII },
          ShiftIII: { ...t2EditForm.shiftIII }
        }
      };
      const res = await api.post('/v1/sand-testing-records/table2', payload);
      if (res?.success) {
        setT2EditModalOpen(false);
        await refetchByDateOrRange();
        showToast('Table 2 updated', 'success');
      } else {
        alert(res?.message || 'Update failed.');
      }
    } catch (e) {
      console.error('Error updating Table 2:', e);
      alert('Update failed.');
    }
  };

  const openT3EditModal = (rec) => {
    const ms = rec?.mixshifts || {};
    const s1 = ms.ShiftI || {};
    const s2 = ms.ShiftII || {};
    const s3 = ms.ShiftIII || {};
    const total = ms.total || {};
    setT3EditForm({
      ShiftI: { mixnoStart: s1?.mixno?.start || '', mixnoEnd: s1?.mixno?.end || '', mixnoTotal: s1?.mixno?.total || '', numberOfMixRejected: s1.numberOfMixRejected || '', returnSandHopperLevel: s1.returnSandHopperLevel || '' },
      ShiftII: { mixnoStart: s2?.mixno?.start || '', mixnoEnd: s2?.mixno?.end || '', mixnoTotal: s2?.mixno?.total || '', numberOfMixRejected: s2.numberOfMixRejected || '', returnSandHopperLevel: s2.returnSandHopperLevel || '' },
      ShiftIII: { mixnoStart: s3?.mixno?.start || '', mixnoEnd: s3?.mixno?.end || '', mixnoTotal: s3?.mixno?.total || '', numberOfMixRejected: s3.numberOfMixRejected || '', returnSandHopperLevel: s3.returnSandHopperLevel || '' },
      total: { mixnoStart: total?.mixno?.start || '', mixnoEnd: total?.mixno?.end || '', mixnoTotal: total?.mixno?.total || '' }
    });
    setT3EditMeta({ id: rec?._id || rec?.id || null, date: rec?.date || null });
    setT3EditModalOpen(true);
  };
  const closeT3EditModal = () => setT3EditModalOpen(false);
  const submitT3Edit = async () => {
    try {
      const toNum = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? undefined : Number(v));
      const data = {
        date: t3EditMeta.date,
        ShiftI: {
          mixno: { start: t3EditForm.ShiftI.mixnoStart, end: t3EditForm.ShiftI.mixnoEnd, total: t3EditForm.ShiftI.mixnoTotal },
          numberOfMixRejected: toNum(t3EditForm.ShiftI.numberOfMixRejected),
          returnSandHopperLevel: toNum(t3EditForm.ShiftI.returnSandHopperLevel)
        },
        ShiftII: {
          mixno: { start: t3EditForm.ShiftII.mixnoStart, end: t3EditForm.ShiftII.mixnoEnd, total: t3EditForm.ShiftII.mixnoTotal },
          // schema has string for ShiftII.numberOfMixRejected; keep raw string if provided
          numberOfMixRejected: t3EditForm.ShiftII.numberOfMixRejected ?? '',
          returnSandHopperLevel: toNum(t3EditForm.ShiftII.returnSandHopperLevel)
        },
        ShiftIII: {
          mixno: { start: t3EditForm.ShiftIII.mixnoStart, end: t3EditForm.ShiftIII.mixnoEnd, total: t3EditForm.ShiftIII.mixnoTotal },
          numberOfMixRejected: toNum(t3EditForm.ShiftIII.numberOfMixRejected),
          returnSandHopperLevel: toNum(t3EditForm.ShiftIII.returnSandHopperLevel)
        },
        // We can keep total for UI, backend schema ignores it; safe to send
        total: { mixno: { start: t3EditForm.total.mixnoStart, end: t3EditForm.total.mixnoEnd, total: t3EditForm.total.mixnoTotal } }
      };
      const payload = { tableNum: 3, data };
      const res = await api.post('/v1/sand-testing-records/table3', payload);
      if (res?.success) {
        setT3EditModalOpen(false);
        await refetchByDateOrRange();
        showToast('Table 3 updated', 'success');
      } else {
        alert(res?.message || 'Update failed.');
      }
    } catch (e) {
      console.error('Error updating Table 3:', e);
      alert('Update failed.');
    }
  };

  const openT4EditModal = (rec) => {
    setT4EditForm({
      sandLump: rec?.sandLump || '',
      newSandWt: rec?.newSandWt || '',
      sandFriability: {
        shiftI: rec?.sandFriability?.shiftI || '',
        shiftII: rec?.sandFriability?.shiftII || '',
        shiftIII: rec?.sandFriability?.shiftIII || ''
      }
    });
    setT4EditMeta({ id: rec?._id || rec?.id || null, date: rec?.date || null });
    setT4EditModalOpen(true);
  };
  const closeT4EditModal = () => setT4EditModalOpen(false);
  const submitT4Edit = async () => {
    try {
      const payload = {
        tableNum: 4,
        data: { date: t4EditMeta.date, sandLump: t4EditForm.sandLump, newSandWt: t4EditForm.newSandWt, sandFriability: { ...t4EditForm.sandFriability } }
      };
      const res = await api.post('/v1/sand-testing-records/table4', payload);
      if (res?.success) {
        setT4EditModalOpen(false);
        await refetchByDateOrRange();
        showToast('Table 4 updated', 'success');
      } else {
        alert(res?.message || 'Update failed.');
      }
    } catch (e) {
      console.error('Error updating Table 4:', e);
      alert('Update failed.');
    }
  };
  
  useEffect(() => {
    fetchAllRecords();
  }, []);

  const fetchAllRecords = async () => {
    try {
      const response = await api.get('/v1/sand-testing-records?limit=1000&order=desc');
      if (response.success && Array.isArray(response.data)) {
        setRecords(response.data);
        setDisplayRecords(response.data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setRecords([]);
      setDisplayRecords([]);
    }
  };

  const refetchByDateOrRange = async () => {
    const from = normalizeDateYMD(fromDate);
    const to = normalizeDateYMD(toDate);
    try {
      if (!from && !to) {
        setDisplayRecords(records);
        return;
      }
      // handle single-date filter if only one of from/to is set or both equal
      if ((from && (!to || to === from)) || (!from && to)) {
        const sel = from || to;
        const res = await api.get(`/v1/sand-testing-records/date/${sel}`);
        if (res.success && Array.isArray(res.data)) {
          setRecords(res.data);
          setDisplayRecords(res.data);
        } else {
          setRecords([]);
          setDisplayRecords([]);
        }
        return;
      }
      if (from && to && to !== from) {
        const res = await api.get(`/v1/sand-testing-records?startDate=${from}&endDate=${to}&limit=1000&order=desc`);
        if (res.success && Array.isArray(res.data)) {
          setRecords(res.data);
          setDisplayRecords(res.data);
        } else {
          setRecords([]);
          setDisplayRecords([]);
        }
        return;
      }
    } catch (e) {
      console.error('Error refetching records:', e);
      setRecords([]);
      setDisplayRecords([]);
    }
  };

  const handleFilter = () => {
    refetchByDateOrRange();
  };

  const openEditTpModal = (rec) => {
    const tp = rec?.testParameter || {};
    const form = {
      sno: tp.sno ?? '',
      time: tp.time ? String(tp.time).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2') : '',
      mixNo: tp.mixno ?? '',
      permeability: tp.permeability ?? '',
      gcsCheckpoint: tp.gcsFdyA != null ? 'fdyA' : (tp.gcsFdyB != null ? 'fdyB' : ''),
      gcsValue: tp.gcsFdyA ?? tp.gcsFdyB ?? '',
      wts: tp.wts ?? '',
      moisture: tp.moisture ?? '',
      compactability: tp.compactability ?? '',
      compressability: tp.compressibility ?? '',
      waterLitrePerKgMix: tp.waterLitre ?? '',
      sandTempBC: tp.sandTemp?.BC ?? '',
      sandTempWU: tp.sandTemp?.WU ?? '',
      sandTempSSU: tp.sandTemp?.SSUmax ?? '',
      newSandKgsPerMould: tp.newSandKgs ?? '',
      bentoniteCheckpoint: tp.bentoniteCheckpoint ?? '',
      bentoniteWithPremix: tp.bentoniteWithPremix?.Kgs ?? tp.bentoniteWithPremix?.Percent ?? '',
      bentoniteOnly: tp.bentonite?.Kgs ?? tp.bentonite?.Percent ?? '',
      premixCoalDustCheckpoint: tp.premixCoalDustCheckpoint ?? '',
      premixKgsMix: tp.premix?.Kgs ?? '',
      coalDustKgsMix: tp.coalDust?.Kgs ?? '',
      lcScmCompactabilityCheckpoint: tp.CompactabilitySettings != null ? 'lcScm' : '',
      lcScmCompactabilityValue: tp.lc ?? tp.CompactabilitySettings ?? '',
      mouldStrengthShearCheckpoint: tp.shearStrengthSetting != null ? 'shearStrength' : 'mouldStrength',
      mouldStrengthShearValue: tp.mouldStrength ?? '',
      preparedSandLumpsPerKg: tp.preparedSandlumps ?? '',
      itemName: tp.itemName ?? '',
      remarks: tp.remarks ?? ''
    };
    setEditForm(form);
    setEditMeta({ id: rec?._id || rec?.id || null, date: rec?.date || null });
    setEditTpModalOpen(true);
  };

  const closeEditTpModal = () => setEditTpModalOpen(false);

  const openT1EditModal = (rec) => {
    const ss = rec?.sandShifts || {};
    const s1 = ss.shiftI || {};
    const s2 = ss.shiftII || ss.ShiftII || {};
    const s3 = ss.shiftIII || ss.ShiftIII || {};
    setT1EditForm({
      shiftI: {
        rSand: s1.rSand || '',
        nSand: s1.nSand || '',
        mixingMode: s1.mixingMode || '',
        bentonite: s1.bentonite || '',
        coalDustPremix: s1.coalDustPremix || '',
        batchNoBentonite: s1.batchNo?.bentonite || '',
        batchNoCoalDustPremix: s1.batchNo?.coalDustPremix || ''
      },
      shiftII: {
        rSand: s2.rSand || '',
        nSand: s2.nSand || '',
        mixingMode: s2.mixingMode || '',
        bentonite: s2.bentonite || '',
        coalDustPremix: s2.coalDustPremix || '',
        batchNoBentonite: s2.batchNo?.bentonite || '',
        batchNoCoalDustPremix: s2.batchNo?.coalDustPremix || ''
      },
      shiftIII: {
        rSand: s3.rSand || '',
        nSand: s3.nSand || '',
        mixingMode: s3.mixingMode || '',
        bentonite: s3.bentonite || '',
        coalDustPremix: s3.coalDustPremix || '',
        batchNoBentonite: s3.batchNo?.bentonite || '',
        batchNoCoalDustPremix: s3.batchNo?.coalDustPremix || ''
      }
    });
    setT1EditMeta({ id: rec?._id || rec?.id || null, date: rec?.date || null });
    setT1EditModalOpen(true);
  };
  const closeT1EditModal = () => setT1EditModalOpen(false);
  const submitT1Edit = async () => {
    try {
      const payload = {
        tableNum: 1,
        data: {
          date: t1EditMeta.date,
          shiftI: {
            rSand: t1EditForm.shiftI.rSand,
            nSand: t1EditForm.shiftI.nSand,
            mixingMode: t1EditForm.shiftI.mixingMode,
            bentonite: t1EditForm.shiftI.bentonite,
            coalDustPremix: t1EditForm.shiftI.coalDustPremix,
            batchNo: {
              bentonite: t1EditForm.shiftI.batchNoBentonite,
              coalDustPremix: t1EditForm.shiftI.batchNoCoalDustPremix
            }
          },
          shiftII: {
            rSand: t1EditForm.shiftII.rSand,
            nSand: t1EditForm.shiftII.nSand,
            mixingMode: t1EditForm.shiftII.mixingMode,
            bentonite: t1EditForm.shiftII.bentonite,
            coalDustPremix: t1EditForm.shiftII.coalDustPremix,
            batchNo: {
              bentonite: t1EditForm.shiftII.batchNoBentonite,
              coalDustPremix: t1EditForm.shiftII.batchNoCoalDustPremix
            }
          },
          shiftIII: {
            rSand: t1EditForm.shiftIII.rSand,
            nSand: t1EditForm.shiftIII.nSand,
            mixingMode: t1EditForm.shiftIII.mixingMode,
            bentonite: t1EditForm.shiftIII.bentonite,
            coalDustPremix: t1EditForm.shiftIII.coalDustPremix,
            batchNo: {
              bentonite: t1EditForm.shiftIII.batchNoBentonite,
              coalDustPremix: t1EditForm.shiftIII.batchNoCoalDustPremix
            }
          }
        }
      };
      const res = await api.post('/v1/sand-testing-records/table1', payload);
      if (res?.success) {
        setT1EditModalOpen(false);
        await refetchByDateOrRange();
        showToast('Table 1 updated', 'success');
      } else {
        alert(res?.message || 'Update failed.');
      }
    } catch (e) {
      console.error('Error updating Table 1:', e);
      alert('Update failed.');
    }
  };

  const submitEditTp = async () => {
    try {
      const td = editForm;
      const data = {};
      // numeric helpers
      const num = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? undefined : Number(v));

      data.sno = num(td.sno);
      if (td.time) {
        const tstr = String(td.time).trim();
        const hhmm = tstr.includes(':') ? tstr.replace(':', '') : tstr;
        const tnum = Number(hhmm);
        if (!Number.isNaN(tnum)) data.time = tnum;
      }
      data.mixno = num(td.mixNo);
      data.permeability = num(td.permeability);
      if (td.gcsCheckpoint === 'fdyA' && td.gcsValue !== '' && !Number.isNaN(Number(td.gcsValue))) {
        data.gcsFdyA = Number(td.gcsValue);
      } else if (td.gcsCheckpoint === 'fdyB' && td.gcsValue !== '' && !Number.isNaN(Number(td.gcsValue))) {
        data.gcsFdyB = Number(td.gcsValue);
      }
      data.wts = num(td.wts);
      data.moisture = num(td.moisture);
      data.compactability = num(td.compactability);
      data.compressibility = num(td.compressability);
      data.waterLitre = num(td.waterLitrePerKgMix);
      data.sandTemp = { BC: num(td.sandTempBC), WU: num(td.sandTempWU), SSUmax: num(td.sandTempSSU) };
      data.newSandKgs = num(td.newSandKgsPerMould);
      // keep checkpoint label if backend uses, else omit; backend schema doesn't have bentoniteCheckpoint field
      // data.bentoniteCheckpoint = td.bentoniteCheckpoint;
      data.bentoniteWithPremix = { Kgs: num(td.bentoniteWithPremix) };
      data.bentonite = { Kgs: num(td.bentoniteOnly) };
      data.premixCoalDustCheckpoint = td.premixCoalDustCheckpoint;
      data.premix = { Kgs: num(td.premixKgsMix) };
      data.coalDust = { Kgs: num(td.coalDustKgsMix) };
      // LC/Compactability: backend expects numbers for lc and CompactabilitySettings
      const lcVal = num(td.lcScmCompactabilityValue);
      if (lcVal !== undefined) {
        data.lc = lcVal;
        data.CompactabilitySettings = lcVal;
      }

      // Mould/Shear: backend fields are numeric; set one based on selection
      const msNum = num(td.mouldStrengthShearValue);
      if (msNum !== undefined) {
        if (td.mouldStrengthShearCheckpoint === 'shearStrength') {
          data.shearStrengthSetting = msNum;
          // optionally also mirror to mouldStrength if needed by UI
          data.mouldStrength = msNum;
        } else {
          data.mouldStrength = msNum;
        }
      }
      data.preparedSandlumps = num(td.preparedSandLumpsPerKg);
      data.itemName = td.itemName;
      data.remarks = td.remarks;

      const payload = { tableNum: 5, data: { ...data, date: editMeta.date } };
      const res = await api.post('/v1/sand-testing-records/table5', payload);
      if (res.success) {
        setEditTpModalOpen(false);
        await refetchByDateOrRange();
      } else {
        alert(res.message || 'Failed to update.');
      }
    } catch (e) {
      console.error('Error updating Table 5 fields:', e);
      alert('Update failed. Please try again.');
    }
  };

  const handleDeleteRecord = async (rec, table) => {
    const id = rec?._id || rec?.id || rec?.recordId || rec?.Id || rec?.ID;
    const date = rec?.date;
    if (!id) return alert('Record id missing.');
    if (!window.confirm('Delete only this table\'s data? This cannot be undone.')) return;
    try {
      let res;
      // Prefer scoped clear per-table. If backend only supports updates, send minimal clearing payloads.
      if (table === 'table5') {
        const data = {
          sno: '',
          time: '',
          mixno: '',
          permeability: '',
          gcsFdyA: undefined,
          gcsFdyB: undefined,
          wts: '',
          moisture: '',
          compactability: '',
          compressibility: '',
          waterLitre: '',
          sandTemp: { BC: '', WU: '', SSUmax: '' },
          newSandKgs: '',
          bentoniteCheckpoint: '',
          bentoniteWithPremix: { Kgs: '' },
          bentonite: { Kgs: '' },
          premixCoalDustCheckpoint: '',
          premix: { Kgs: '' },
          coalDust: { Kgs: '' },
          CompactabilitySettings: '',
          lc: '',
          shearStrengthSetting: '',
          mouldStrength: '',
          shearStrength: undefined,
          preparedSandlumps: '',
          itemName: '',
          remarks: ''
        };
        const payload = { tableNum: 5, data: { ...data, date } };
        res = await api.post('/v1/sand-testing-records/table5', payload);
      } else if (table === 'table1') {
        const payload = { tableNum: 1, data: { date, sandShifts: {} } };
        res = await api.post('/v1/sand-testing-records/table1', payload);
      } else if (table === 'table2') {
        const payload = { tableNum: 2, data: { date, clayShifts: {} } };
        res = await api.post('/v1/sand-testing-records/table2', payload);
      } else if (table === 'table3') {
        const payload = { tableNum: 3, data: { date, mixshifts: {} } };
        res = await api.post('/v1/sand-testing-records/table3', payload);
      } else if (table === 'table4') {
        const payload = { tableNum: 4, data: { date, sandLump: '', newSandWt: '', sandFriability: {} } };
        res = await api.post('/v1/sand-testing-records/table4', payload);
      } else {
        // Fallback: do not delete the whole record if table scope missing
        return alert('Unknown table scope for delete.');
      }

      const ok = (res && (res.success === true || res.status === 200 || res.ok === true));
      if (ok) {
        // Optimistic local update: clear only the scoped section for matching record id
        setRecords(prev => prev.map(r => {
          const rid = r?._id || r?.id;
          if (rid !== id) return r;
          const copy = { ...r };
          if (table === 'table5') copy.testParameter = {};
          if (table === 'table1') copy.sandShifts = {};
          if (table === 'table2') copy.clayShifts = {};
          if (table === 'table3') copy.mixshifts = {};
          if (table === 'table4') { copy.sandLump = undefined; copy.newSandWt = undefined; copy.sandFriability = {}; }
          return copy;
        }));
        setDisplayRecords(prev => prev.map(r => {
          const rid = r?._id || r?.id;
          if (rid !== id) return r;
          const copy = { ...r };
          if (table === 'table5') copy.testParameter = {};
          if (table === 'table1') copy.sandShifts = {};
          if (table === 'table2') copy.clayShifts = {};
          if (table === 'table3') copy.mixshifts = {};
          if (table === 'table4') { copy.sandLump = undefined; copy.newSandWt = undefined; copy.sandFriability = {}; }
          return copy;
        }));
        await refetchByDateOrRange();
        showToast('Deleted successfully', 'success');
      } else {
        console.error('Delete response:', res);
        alert(res?.message || 'Delete failed.');
      }
    } catch (e) {
      console.error('Delete error:', e);
      alert('Delete failed.');
    }
  };

  // helper to safely access nested values
  const getAt = (obj, path) => {
    if (!obj || !path) return '';
    const parts = path.split('.');
    let cur = obj;
    for (let p of parts) {
      if (cur == null) return '';
      cur = cur[p];
    }
    return cur == null ? '' : cur;
  };

  // robust getter for Table 1 Batch No across various shapes and casings
  const getBatchNoDisplay = (rec, key) => {
    if (!rec) return '';
    const altKey = key === 'shiftI' ? 'ShiftI' : (key === 'shiftII' ? 'ShiftII' : 'ShiftIII');
    const s = (rec.sandShifts && (rec.sandShifts[key] || rec.sandShifts[altKey])) || {};
    // Allow batch number to be stored at either shift root or under batchNo object
    const bnRootCandidates = [s.batchNoValue, s.batchNo, s.batch, s.bnNo, s.batch_no, s.BatchNo];
    const bnRoot = bnRootCandidates.find(v => typeof v === 'string' && v.trim() !== '');
    if (bnRoot) return bnRoot;
    const bn = s?.batchNo;
    if (!bn) return '';
    if (typeof bn === 'string') return bn;
    try {
      // If a selector exists (type/selectedOption/selected/choice/kind), honor it
      const selector = (bn.type || bn.selectedOption || bn.selected || bn.choice || bn.kind || '').toString().toLowerCase().replace(/\s|_/g, '');
      const mapKey = selector.includes('bentonite') ? 'bentonite'
                   : selector.includes('coaldustpremix') ? 'coalDustPremix'
                   : selector.includes('coaldust') ? 'coalDust'
                   : selector.includes('premix') ? 'premix'
                   : '';
      const bySelector = mapKey ? (bn[mapKey] || bn.value || bn.batchNo || bn.number) : '';

      const direct = [
        bySelector,
        bn.bentonite, bn.coalDustPremix, bn.coalDust, bn.premix,
        bn.bentoniteBatch, bn.coalDustBatch, bn.premixBatch,
        bn.bentonite_no, bn.coal_dust_no, bn.premix_no,
        bn.value, bn.batchNo, bn.number,
      ];
      const nested = [
        bn.bentonite?.batchNo, bn.coalDust?.batchNo, bn.premix?.batchNo,
        bn.bentonite?.no, bn.coalDust?.no, bn.premix?.no,
        bn.bentonite?.value, bn.coalDust?.value, bn.premix?.value,
        bn.bentonite?.BatchNo, bn.coalDust?.BatchNo, bn.premix?.BatchNo,
      ];
      const anyObjVal = Array.isArray(bn) ? bn.find(Boolean) : Object.values(bn).find(v => v != null && v !== '');
      const v = [...direct, ...nested, anyObjVal].find(x => x != null && x !== '');
      return v ?? '';
    } catch (_) {
      return '';
    }
  };

  // helper to normalize date to YYYY-MM-DD (safe for comparing user-picked date vs stored ISO)
  const normalizeDateYMD = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return null;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatDateDMY = (d) => {
    const ymd = normalizeDateYMD(d);
    if (!ymd) return '';
    const [y, m, day] = ymd.split('-');
    return `${day}-${m}-${y}`;
  };

  // records to show in modals: respects fromDate/toDate if provided, otherwise shows all displayRecords
  const getRecordsForModal = () => {
    const from = normalizeDateYMD(fromDate);
    const to = normalizeDateYMD(toDate);
    // if user supplied neither, show current displayRecords (unfiltered)
    if (!from && !to) return displayRecords;

    return records.filter(rec => {
      const r = normalizeDateYMD(rec?.date);
      if (!r) return false;
      if (from && r < from) return false;
      if (to && r > to) return false;
      return true;
    });
  };

  // NEW: Only show entries that exactly match a single chosen date.
  // Uses fromDate if set, otherwise toDate. If neither set returns [].
  const getRecordsForModalBySingleDate = () => {
    const sel = normalizeDateYMD(fromDate || toDate);
    if (!sel) return [];
    return records.filter(rec => normalizeDateYMD(rec?.date) === sel);
  };

  useEffect(() => {
    refetchByDateOrRange();
  }, [fromDate, toDate]);

  // build headers for "All Data" (label + getter) — removed "TableX -" prefixes
  const buildAllHeaders = () => {
    const headers = [{ label: 'Date', get: rec => formatDateDMY(rec.date) || '' }];

    // Table1 fields (no "Table1 -" prefix)
    SHIFTS.forEach(shift => {
      const key = shift.key; // shiftI/shiftII/shiftIII
      const altKey = key === 'shiftI' ? 'ShiftI' : (key === 'shiftII' ? 'ShiftII' : 'ShiftIII');
      headers.push(
        { label: `R. Sand (${shift.label})`, get: rec => getAt(rec, `sandShifts.${key}.rSand`) || getAt(rec, `sandShifts.${altKey}.rSand`) || '' },
        { label: `N. Sand (${shift.label})`, get: rec => getAt(rec, `sandShifts.${key}.nSand`) || getAt(rec, `sandShifts.${altKey}.nSand`) || '' },
        { label: `Mixing Mode (${shift.label})`, get: rec => getAt(rec, `sandShifts.${key}.mixingMode`) || getAt(rec, `sandShifts.${altKey}.mixingMode`) || '' },
        { label: `Bentonite (${shift.label})`, get: rec => getAt(rec, `sandShifts.${key}.bentonite`) || getAt(rec, `sandShifts.${altKey}.bentonite`) || '' },
        { label: `Batch NO (${shift.label})`, get: rec => getBatchNoDisplay(rec, key) }
      );
    });

    // Table2 clay params (no prefix)
    SHIFTS.forEach(shift => {
      const altKey = shift.key === 'shiftI' ? 'shiftI' : (shift.key === 'shiftII' ? 'ShiftII' : 'ShiftIII');
      headers.push(
        { label: `Total Clay (${shift.label})`, get: rec => getAt(rec, `clayShifts.${shift.key}.totalClay`) || getAt(rec, `clayShifts.${altKey}.totalClay`) || '' },
        { label: `Active Clay (${shift.label})`, get: rec => getAt(rec, `clayShifts.${shift.key}.activeClay`) || getAt(rec, `clayShifts.${altKey}.activeClay`) || '' },
        { label: `Dead Clay (${shift.label})`, get: rec => getAt(rec, `clayShifts.${shift.key}.deadClay`) || getAt(rec, `clayShifts.${altKey}.deadClay`) || '' },
        { label: `V.C.M (${shift.label})`, get: rec => getAt(rec, `clayShifts.${shift.key}.vcm`) || getAt(rec, `clayShifts.${altKey}.vcm`) || '' },
        { label: `L.O.I (${shift.label})`, get: rec => getAt(rec, `clayShifts.${shift.key}.loi`) || getAt(rec, `clayShifts.${altKey}.loi`) || '' },
        { label: `AFS No (${shift.label})`, get: rec => getAt(rec, `clayShifts.${shift.key}.afsNo`) || getAt(rec, `clayShifts.${altKey}.afsNo`) || '' },
        { label: `Fines (${shift.label})`, get: rec => getAt(rec, `clayShifts.${shift.key}.fines`) || getAt(rec, `clayShifts.${altKey}.fines`) || '' }
      );
    });

    // Table3 mix data per shift + total (no prefix)
    ['shiftI','shiftII','shiftIII','total'].forEach(shiftKey => {
      const labelShift = shiftKey === 'total' ? 'Total' : (shiftKey === 'shiftI' ? 'Shift I' : shiftKey === 'shiftII' ? 'Shift II' : 'Shift III');
      const bk = shiftKey === 'shiftI' ? 'ShiftI' : (shiftKey === 'shiftII' ? 'ShiftII' : (shiftKey === 'shiftIII' ? 'ShiftIII' : 'total'));
      headers.push(
        { label: `Mix No Start (${labelShift})`, get: rec => getAt(rec, `mixshifts.${bk}.mixno.start`) || '' },
        { label: `Mix No End (${labelShift})`, get: rec => getAt(rec, `mixshifts.${bk}.mixno.end`) || '' },
        { label: `Mix No Total (${labelShift})`, get: rec => getAt(rec, `mixshifts.${bk}.mixno.total`) || '' },
        { label: `No. Of Mix Rejected (${labelShift})`, get: rec => getAt(rec, `mixshifts.${bk}.numberOfMixRejected`) || '' },
        { label: `Return Sand Hopper Level (${labelShift})`, get: rec => getAt(rec, `mixshifts.${bk}.returnSandHopperLevel`) || '' }
      );
    });

    // Table4 sand properties (no prefix)
    headers.push(
      { label: 'Sand Lump', get: rec => getAt(rec, 'sandLump') || '' },
      { label: 'New Sand Wt', get: rec => getAt(rec, 'newSandWt') || '' }
    );
    SHIFTS.forEach(shift => {
      headers.push({ label: `Friability (${shift.label})`, get: rec => getAt(rec, `sandFriability.${shift.key}`) || '' });
    });

    // Table5 test parameters mapped from backend testParameter
    const getTable5Field = (rec, key) => {
      const tp = rec.testParameter || {};
      switch (key) {
        case 'sno': return tp.sno ?? '';
        case 'time': return tp.time ?? '';
        case 'mixNo': return tp.mixno ?? '';
        case 'permeability': return tp.permeability ?? '';
        case 'gcsCheckpoint': return tp.gcsFdyA ?? '';
        case 'gcsValue': return tp.gcsFdyB ?? '';
        case 'wts': return tp.wts ?? '';
        case 'moisture': return tp.moisture ?? '';
        case 'compactability': return tp.compactability ?? '';
        case 'compressability': return tp.compressibility ?? '';
        case 'waterLitrePerKgMix': return tp.waterLitre ?? '';
        case 'sandTempBC': return tp.sandTemp?.BC ?? '';
        case 'sandTempWU': return tp.sandTemp?.WU ?? '';
        case 'sandTempSSU': return tp.sandTemp?.SSUmax ?? '';
        case 'newSandKgsPerMould': return tp.newSandKgs ?? '';
        case 'bentoniteCheckpoint': {
          const kPremix = (tp.bentoniteWithPremix?.Kgs ?? tp.bentoniteWithPremix?.Percent) ?? 0;
          const kOnly = (tp.bentonite?.Kgs ?? tp.bentonite?.Percent) ?? 0;
          if (kPremix && Number(kPremix) > 0) return 'With Premix';
          if (kOnly && Number(kOnly) > 0) return 'Only';
          return '';
        }
        case 'bentoniteWithPremix': return tp.bentoniteWithPremix?.Kgs ?? tp.bentoniteWithPremix?.Percent ?? '';
        case 'bentoniteOnly': return tp.bentonite?.Kgs ?? tp.bentonite?.Percent ?? '';
        case 'premixCoalDustCheckpoint': {
          const kPremix = (tp.premix?.Kgs ?? tp.premix?.Percent) ?? 0;
          const kCoal = (tp.coalDust?.Kgs ?? tp.coalDust?.Percent) ?? 0;
          if (kPremix && Number(kPremix) > 0) return 'Premix';
          if (kCoal && Number(kCoal) > 0) return 'Coal Dust';
          return '';
        }
        case 'premixKgsMix': return tp.premix?.Kgs ?? '';
        case 'coalDustKgsMix': return tp.coalDust?.Kgs ?? '';
        case 'lcScmCompactabilityCheckpoint': return tp.CompactabilitySettings ?? '';
        case 'lcScmCompactabilityValue': return tp.lc ?? '';
        case 'mouldStrengthShearCheckpoint': return tp.shearStrengthSetting ?? '';
        case 'mouldStrengthShearValue': return tp.mouldStrength ?? '';
        case 'preparedSandLumpsPerKg': return tp.preparedSandlumps ?? '';
        case 'itemName': return tp.itemName ?? '';
        case 'remarks': return tp.remarks ?? '';
        default: return '';
      }
    };

    TABLE5_KEYS.forEach((key, idx) => {
      const label = TABLE5_ROWS[idx] || key;
      headers.push({ label: `${label}`, get: rec => getTable5Field(rec, key) });
    });

    return headers;
  };

  const renderAllData = () => {
    const headers = buildAllHeaders();
    const rows = displayRecords.length ? displayRecords : [];
    return (
      <div className="sand-testing-table-wrapper" style={{ overflowX: 'auto', marginTop: 16 }}>
        <table className="sand-testing-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', background: '#f1f5f8', fontSize: '0.75rem' }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows.map((rec, rIdx) => (
              <tr key={rIdx}>
                {headers.map((h, cIdx) => (
                  <td key={cIdx} style={{ padding: '8px 10px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>
                    {h.label === 'Actions' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          title="Edit"
                          onClick={() => openEditTpModal(rec)}
                          style={{ border: '1px solid #3b82f6', color: '#1d4ed8', background: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
                        >
                          <PencilLine size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDeleteRecord(rec)}
                          style={{ border: '1px solid #ef4444', color: '#dc2626', background: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      String(h.get(rec) ?? '')
                    )}

                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={headers.length} style={{ padding: 20, textAlign: 'center' }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };


  const getTable5Data = () => {
    const src = (() => { const s = getRecordsForModalBySingleDate(); return s.length ? s : displayRecords; })();
    const mapRecord = (rec) => {
      const obj = { __rec: rec };
      const tp = rec.testParameter || {};
      obj.sno = tp.sno ?? '';
      obj.time = tp.time ?? '';
      obj.mixNo = tp.mixno ?? '';
      obj.permeability = tp.permeability ?? '';
      if (tp.gcsFdyA != null && tp.gcsFdyA !== '') {
        obj.gcsCheckpoint = 'FDY-A';
        obj.gcsValue = tp.gcsFdyA;
      } else if (tp.gcsFdyB != null && tp.gcsFdyB !== '') {
        obj.gcsCheckpoint = 'FDY-B';
        obj.gcsValue = tp.gcsFdyB;
      } else {
        obj.gcsCheckpoint = '';
        obj.gcsValue = '';
      }
      obj.wts = tp.wts ?? '';
      obj.moisture = tp.moisture ?? '';
      obj.compactability = tp.compactability ?? '';
      obj.compressability = tp.compressibility ?? '';
      obj.waterLitrePerKgMix = tp.waterLitre ?? '';
      obj.sandTempBC = tp.sandTemp?.BC ?? '';
      obj.sandTempWU = tp.sandTemp?.WU ?? '';
      obj.sandTempSSU = tp.sandTemp?.SSUmax ?? '';
      obj.newSandKgsPerMould = tp.newSandKgs ?? '';
      // Derive bentonite checkpoint label from Kgs presence
      {
        const kPremix = tp.bentoniteWithPremix?.Kgs ?? 0;
        const kOnly = tp.bentonite?.Kgs ?? 0;
        if (kPremix && Number(kPremix) > 0) obj.bentoniteCheckpoint = 'With Premix';
        else if (kOnly && Number(kOnly) > 0) obj.bentoniteCheckpoint = 'Only';
        else obj.bentoniteCheckpoint = '';
      }
      // Prefer Kgs for display
      obj.bentoniteWithPremix = tp.bentoniteWithPremix?.Kgs ?? tp.bentoniteWithPremix?.Percent ?? '';
      obj.bentoniteOnly = tp.bentonite?.Kgs ?? tp.bentonite?.Percent ?? '';
      // Derive premix/coal dust checkpoint from Kgs
      {
        const kPremix2 = tp.premix?.Kgs ?? 0;
        const kCoal2 = tp.coalDust?.Kgs ?? 0;
        if (kPremix2 && Number(kPremix2) > 0) obj.premixCoalDustCheckpoint = 'Premix';
        else if (kCoal2 && Number(kCoal2) > 0) obj.premixCoalDustCheckpoint = 'Coal Dust';
        else obj.premixCoalDustCheckpoint = '';
      }
      obj.premixKgsMix = tp.premix?.Kgs ?? '';
      obj.coalDustKgsMix = tp.coalDust?.Kgs ?? '';
      obj.lcScmCompactabilityCheckpoint = tp.CompactabilitySettings ?? '';
      obj.lcScmCompactabilityValue = tp.lc ?? '';
      obj.mouldStrengthShearCheckpoint = tp.shearStrengthSetting ?? '';
      obj.mouldStrengthShearValue = tp.mouldStrength ?? '';
      obj.preparedSandLumpsPerKg = tp.preparedSandlumps ?? '';
      obj.itemName = tp.itemName ?? '';
      obj.remarks = tp.remarks ?? '';
      return obj;
    };
    return src.map(mapRecord);
  };

  

  const renderTable5 = () => {
    const data = getTable5Data();
    return (
      <div className="sand-testing-table-wrapper" style={{ overflowX: 'auto', marginTop: 16 }}>
        <table className="sand-testing-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {TABLE5_ROWS.map(row => (
                <th key={row} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', background: '#f1f5f8' }}>{row}</th>
              ))}
              <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', background: '#f1f5f8' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((row, idx) => (
              <tr key={idx}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.sno || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.time || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.mixNo || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.permeability || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.gcsCheckpoint || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.gcsValue || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.wts || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.moisture || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.compactability || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.compressability || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.waterLitrePerKgMix || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.sandTempBC || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.sandTempWU || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.sandTempSSU || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.newSandKgsPerMould || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.bentoniteCheckpoint || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.bentoniteWithPremix || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.bentoniteOnly || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.premixCoalDustCheckpoint || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.premixKgsMix || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.coalDustKgsMix || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.lcScmCompactabilityCheckpoint || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.lcScmCompactabilityValue || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.mouldStrengthShearCheckpoint || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.mouldStrengthShearValue || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.preparedSandLumpsPerKg || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.itemName || ''}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{row.remarks || ''}</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      title="Edit"
                      onClick={() => openEditTpModal(row.__rec)}
                      style={{ border: '1px solid #3b82f6', color: '#1d4ed8', background: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
                    >
                      <PencilLine size={16} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDeleteRecord(row.__rec, 'table5')}
                      style={{ border: '1px solid #ef4444', color: '#dc2626', background: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={TABLE5_ROWS.length + 1} style={{ padding: 20, textAlign: 'center' }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <div className="page-wrapper">
      {toast.show && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            padding: '10px 14px',
            borderRadius: 8,
            color: '#065f46',
            background: '#d1fae5',
            border: '1px solid #10b981',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            zIndex: 2000,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {toast.message}
        </div>
      )}
      {editTpModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500, padding: 20 }}
          onClick={closeEditTpModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(720px, 94%)', maxHeight: '92vh', overflow: 'hidden', background: '#fff', borderRadius: 14, boxShadow: '0 18px 60px rgba(0,0,0,0.28)', padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 20 }}>Edit Entry</h3>
              <button onClick={closeEditTpModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, maxHeight: '68vh', overflowY: 'auto', paddingRight: 4 }}>
              {[
                { label: 'S.No', key: 'sno' },
                { label: 'Time', key: 'time', type: 'time' },
                { label: 'Mix No', key: 'mixNo' },
                { label: 'Permeability', key: 'permeability', type: 'number' },
                { label: 'WTS', key: 'wts', type: 'number' },
                { label: 'Moisture', key: 'moisture', type: 'number' },
                { label: 'Compactability', key: 'compactability', type: 'number' },
                { label: 'Compressability', key: 'compressability', type: 'number' },
                { label: 'Water Litre/Kg Mix', key: 'waterLitrePerKgMix', type: 'number' },
                { label: 'Sand Temp BC', key: 'sandTempBC', type: 'number' },
                { label: 'Sand Temp WU', key: 'sandTempWU', type: 'number' },
                { label: 'Sand Temp SSU', key: 'sandTempSSU', type: 'number' },
                { label: 'New Sand Kgs/Mould', key: 'newSandKgsPerMould', type: 'number' },
                { label: 'Premix Kgs/Mix', key: 'premixKgsMix', type: 'number' },
                { label: 'Coal Dust Kgs/Mix', key: 'coalDustKgsMix', type: 'number' },
                { label: 'Prepared Sand Lumps/Kg', key: 'preparedSandLumpsPerKg', type: 'number' },
                { label: 'Item Name', key: 'itemName' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>{f.label}</label>
                  <input type={f.type || 'text'} value={editForm[f.key] ?? ''} onChange={(e) => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))} className="sand-table5-input" />
                </div>
              ))}
              <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>GCS Checkpoint</label>
                  <select value={editForm.gcsCheckpoint} onChange={(e) => setEditForm(p => ({ ...p, gcsCheckpoint: e.target.value }))} className="sand-table5-input">
                    <option value="">Select</option>
                    <option value="fdyA">FDY-A</option>
                    <option value="fdyB">FDY-B</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>GCS Value</label>
                  <input type="number" value={editForm.gcsValue} onChange={(e) => setEditForm(p => ({ ...p, gcsValue: e.target.value }))} className="sand-table5-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Bentonite Checkpoint</label>
                  <select value={editForm.bentoniteCheckpoint} onChange={(e) => setEditForm(p => ({ ...p, bentoniteCheckpoint: e.target.value }))} className="sand-table5-input">
                    <option value="">Select</option>
                    <option value="withPremix">With Premix</option>
                    <option value="only">Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Bentonite With Premix (Kgs)</label>
                  <input type="number" value={editForm.bentoniteWithPremix} onChange={(e) => setEditForm(p => ({ ...p, bentoniteWithPremix: e.target.value }))} className="sand-table5-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Bentonite Only (Kgs)</label>
                  <input type="number" value={editForm.bentoniteOnly} onChange={(e) => setEditForm(p => ({ ...p, bentoniteOnly: e.target.value }))} className="sand-table5-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Premix/Coal Dust Checkpoint</label>
                  <select value={editForm.premixCoalDustCheckpoint} onChange={(e) => setEditForm(p => ({ ...p, premixCoalDustCheckpoint: e.target.value }))} className="sand-table5-input">
                    <option value="">Select</option>
                    <option value="premix">Premix</option>
                    <option value="coalDust">Coal Dust</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>LC SCM / Compactability Checkpoint</label>
                  <select value={editForm.lcScmCompactabilityCheckpoint} onChange={(e) => setEditForm(p => ({ ...p, lcScmCompactabilityCheckpoint: e.target.value }))} className="sand-table5-input">
                    <option value="">Select</option>
                    <option value="lcScm">LC SCM</option>
                    <option value="compactabilitySetting">Compactability At1</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>LC SCM / Compactability Value</label>
                  <input type="number" value={editForm.lcScmCompactabilityValue} onChange={(e) => setEditForm(p => ({ ...p, lcScmCompactabilityValue: e.target.value }))} className="sand-table5-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Mould/Shear Checkpoint</label>
                  <select value={editForm.mouldStrengthShearCheckpoint} onChange={(e) => setEditForm(p => ({ ...p, mouldStrengthShearCheckpoint: e.target.value }))} className="sand-table5-input">
                    <option value="mouldStrength">Mould strength</option>
                    <option value="shearStrength">Shear Strength</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Mould/Shear Value</label>
                  <input type="number" value={editForm.mouldStrengthShearValue} onChange={(e) => setEditForm(p => ({ ...p, mouldStrengthShearValue: e.target.value }))} className="sand-table5-input" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Remarks</label>
                  <input value={editForm.remarks} onChange={(e) => setEditForm(f => ({ ...f, remarks: e.target.value }))} className="sand-table5-input" />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button onClick={closeEditTpModal} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
              <button onClick={submitEditTp} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer', fontSize: 14 }}>Update Entry</button>
            </div>
          </div>
        </div>
      )}
      <div className="sand-testing-report-container">
        <div className="sand-testing-report-header">
          <div className="sand-testing-report-header-text">
            <BookOpen size={22} />
            <h2>Sand Testing Record - Report</h2>
          </div>
        </div>
        <div className="sand-testing-filter-container">
          <div className="sand-testing-filter-group">
            <label>Start Date</label>
            <CustomDatePicker
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              name="fromDate"
              placeholder="e.g: DD/MM/YY"
            />
          </div>
          <div className="sand-testing-filter-group">
            <label>End Date</label>
            <CustomDatePicker
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              name="toDate"
              placeholder="e.g: DD/MM/YY"
            />
          </div>
          <div className="sand-testing-filter-group">
            <label style={{ visibility: 'hidden' }}>Filter</label>
            <div className="sand-testing-filter-btn-container">
              <button
                className="sand-testing-filter-btn"
                onClick={handleFilter}
                disabled={!fromDate && !toDate}
              >
                <FilterIcon size={16} />
                Filter
              </button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => {
                // Table1-4 should open card (modal) view only.
                if (tab === 'Table 1') return openTable1Modal();
                if (tab === 'Table 2') return openTable2Modal();
                if (tab === 'Table 3') return openTable3Modal();
                if (tab === 'Table 4') return openTable4Modal();
                // only "All Data" and "Sand Properties & Test Parameters" switch inline view
                setActiveTab(tab);
              }}
               className={`report-tab-btn ${activeTab === tab ? 'active' : ''}`}
               style={{
                 padding: '8px 14px',
                 borderRadius: 6,
                 border: activeTab === tab ? '1px solid #f28a4c' : '1px solid #d0d7dc',
                 background: activeTab === tab ? '#fff7f0' : '#fff',
                 fontSize: '0.85rem'
               }}
             >
               {tab}
             </button>
           ))}
        </div>
        
        {/* Inline views: only All Data and Sand Properties (& Test Parameters) show by tab.
            Table1-4 are opened via card modals above. */}
        {activeTab === 'All Data' && renderAllData()}
        {activeTab === 'Sand Properties & Test Parameters' && renderTable5()}

        {/* Table 1 Edit Modal */}
        {t1EditModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500, padding: 20 }}
            onClick={closeT1EditModal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ width: 'min(900px, 94%)', maxHeight: '92vh', overflow: 'auto', background: '#fff', borderRadius: 14, boxShadow: '0 18px 60px rgba(0,0,0,0.28)', padding: 20 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>Edit Table 1 — Shift Data</h3>
                <button onClick={closeT1EditModal} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 14 }}>Close</button>
              </div>

              {['shiftI','shiftII','shiftIII'].map((sh) => (
                <div key={sh} style={{ border: '1px solid #f3f7fb', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, marginBottom: 10 }}>{sh === 'shiftI' ? 'Shift I' : sh === 'shiftII' ? 'Shift II' : 'Shift III'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>R. Sand (Kgs/Mix)</label>
                      <input value={t1EditForm[sh].rSand} onChange={(e)=>setT1EditForm(p=>({...p,[sh]:{...p[sh], rSand:e.target.value}}))} className="sand-table5-input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>N. Sand (Kgs/Mix)</label>
                      <input value={t1EditForm[sh].nSand} onChange={(e)=>setT1EditForm(p=>({...p,[sh]:{...p[sh], nSand:e.target.value}}))} className="sand-table5-input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Mixing Mode</label>
                      <input value={t1EditForm[sh].mixingMode} onChange={(e)=>setT1EditForm(p=>({...p,[sh]:{...p[sh], mixingMode:e.target.value}}))} className="sand-table5-input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Bentonite (Kgs/Mix)</label>
                      <input value={t1EditForm[sh].bentonite} onChange={(e)=>setT1EditForm(p=>({...p,[sh]:{...p[sh], bentonite:e.target.value}}))} className="sand-table5-input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Coal Dust / Premix (Kgs/Mix)</label>
                      <input value={t1EditForm[sh].coalDustPremix} onChange={(e)=>setT1EditForm(p=>({...p,[sh]:{...p[sh], coalDustPremix:e.target.value}}))} className="sand-table5-input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Batch No (Bentonite)</label>
                      <input value={t1EditForm[sh].batchNoBentonite} onChange={(e)=>setT1EditForm(p=>({...p,[sh]:{...p[sh], batchNoBentonite:e.target.value}}))} className="sand-table5-input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 4 }}>Batch No (Coal Dust/Premix)</label>
                      <input value={t1EditForm[sh].batchNoCoalDustPremix} onChange={(e)=>setT1EditForm(p=>({...p,[sh]:{...p[sh], batchNoCoalDustPremix:e.target.value}}))} className="sand-table5-input" />
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button onClick={closeT1EditModal} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
                <button onClick={submitT1Edit} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer', fontSize: 14 }}>Update Entry</button>
              </div>
            </div>
          </div>
        )}

        {t2EditModalOpen && (
          <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500, padding: 20 }} onClick={closeT2EditModal}>
            <div onClick={(e)=>e.stopPropagation()} style={{ width: 'min(900px, 94%)', maxHeight: '92vh', overflow: 'auto', background: '#fff', borderRadius: 14, boxShadow: '0 18px 60px rgba(0,0,0,0.28)', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>Edit Table 2 — Clay Parameters</h3>
                <button onClick={closeT2EditModal} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 14 }}>Close</button>
              </div>
              {['shiftI','shiftII','shiftIII'].map(sh => (
                <div key={sh} style={{ border: '1px solid #f3f7fb', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, marginBottom: 10 }}>{sh === 'shiftI' ? 'Shift I' : sh === 'shiftII' ? 'Shift II' : 'Shift III'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 12 }}>
                    {[
                      ['Total Clay (11.0 - 14.5%)','totalClay'],
                      ['Active Clay (8.5 - 11.0%)','activeClay'],
                      ['Dead Clay (2.0 - 4.0%)','deadClay'],
                      ['V.C.M (2.0 - 3.2%)','vcm'],
                      ['L.O.I (4.5 - 6.0%)','loi'],
                      ['AFS No. (min 48)','afsNo'],
                      ['Fines (10% Max)','fines']
                    ].map(([label,key]) => (
                      <div key={key}>
                        <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>{label}</label>
                        <input value={t2EditForm[sh][key]} onChange={(e)=>setT2EditForm(p=>({...p,[sh]:{...p[sh],[key]:e.target.value}}))} className="sand-table5-input" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
                <button onClick={closeT2EditModal} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #d1d5db', background:'#fff', cursor:'pointer', fontSize:14 }}>Cancel</button>
                <button onClick={submitT2Edit} style={{ padding:'8px 12px', borderRadius:8, border:'none', background:'#0ea5e9', color:'#fff', cursor:'pointer', fontSize:14 }}>Update Entry</button>
              </div>
            </div>
          </div>
        )}

        {t3EditModalOpen && (
          <div role="dialog" aria-modal="true" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1500, padding:20 }} onClick={closeT3EditModal}>
            <div onClick={(e)=>e.stopPropagation()} style={{ width:'min(900px, 94%)', maxHeight:'92vh', overflow:'auto', background:'#fff', borderRadius:14, boxShadow:'0 18px 60px rgba(0,0,0,0.28)', padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <h3 style={{ margin:0, fontSize:20 }}>Edit Table 3 — Mix Data</h3>
                <button onClick={closeT3EditModal} style={{ padding:'8px 12px', borderRadius:8, border:'none', background:'#ef4444', color:'#fff', cursor:'pointer', fontSize:14 }}>Close</button>
              </div>
              {['ShiftI','ShiftII','ShiftIII','total'].map(sh => (
                <div key={sh} style={{ border:'1px solid #f3f7fb', borderRadius:10, padding:14, marginBottom:12 }}>
                  <div style={{ fontWeight:800, marginBottom:10 }}>{sh === 'total' ? 'Total' : sh.replace('Shift','Shift ')}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:12 }}>
                    {sh !== 'total' ? (
                      <>
                        <div>
                          <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Mix No Start</label>
                          <input value={t3EditForm[sh].mixnoStart} onChange={(e)=>setT3EditForm(p=>({...p,[sh]:{...p[sh], mixnoStart:e.target.value}}))} className="sand-table5-input" />
                        </div>
                        <div>
                          <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Mix No End</label>
                          <input value={t3EditForm[sh].mixnoEnd} onChange={(e)=>setT3EditForm(p=>({...p,[sh]:{...p[sh], mixnoEnd:e.target.value}}))} className="sand-table5-input" />
                        </div>
                        <div>
                          <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Mix No Total</label>
                          <input value={t3EditForm[sh].mixnoTotal} onChange={(e)=>setT3EditForm(p=>({...p,[sh]:{...p[sh], mixnoTotal:e.target.value}}))} className="sand-table5-input" />
                        </div>
                        <div>
                          <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>No. Of Mix Rejected</label>
                          <input value={t3EditForm[sh].numberOfMixRejected} onChange={(e)=>setT3EditForm(p=>({...p,[sh]:{...p[sh], numberOfMixRejected:e.target.value}}))} className="sand-table5-input" />
                        </div>
                        <div>
                          <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Return Sand Hopper Level</label>
                          <input value={t3EditForm[sh].returnSandHopperLevel} onChange={(e)=>setT3EditForm(p=>({...p,[sh]:{...p[sh], returnSandHopperLevel:e.target.value}}))} className="sand-table5-input" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Mix No Start</label>
                          <input value={t3EditForm.total.mixnoStart} onChange={(e)=>setT3EditForm(p=>({...p,total:{...p.total, mixnoStart:e.target.value}}))} className="sand-table5-input" />
                        </div>
                        <div>
                          <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Mix No End</label>
                          <input value={t3EditForm.total.mixnoEnd} onChange={(e)=>setT3EditForm(p=>({...p,total:{...p.total, mixnoEnd:e.target.value}}))} className="sand-table5-input" />
                        </div>
                        <div>
                          <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Mix No Total</label>
                          <input value={t3EditForm.total.mixnoTotal} onChange={(e)=>setT3EditForm(p=>({...p,total:{...p.total, mixnoTotal:e.target.value}}))} className="sand-table5-input" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
                <button onClick={closeT3EditModal} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #d1d5db', background:'#fff', cursor:'pointer', fontSize:14 }}>Cancel</button>
                <button onClick={submitT3Edit} style={{ padding:'8px 12px', borderRadius:8, border:'none', background:'#0ea5e9', color:'#fff', cursor:'pointer', fontSize:14 }}>Update Entry</button>
              </div>
            </div>
          </div>
        )}

        {t4EditModalOpen && (
          <div role="dialog" aria-modal="true" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1500, padding:20 }} onClick={closeT4EditModal}>
            <div onClick={(e)=>e.stopPropagation()} style={{ width:'min(900px, 94%)', maxHeight:'92vh', overflow:'auto', background:'#fff', borderRadius:14, boxShadow:'0 18px 60px rgba(0,0,0,0.28)', padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <h3 style={{ margin:0, fontSize:20 }}>Edit Table 4 — Sand Properties</h3>
                <button onClick={closeT4EditModal} style={{ padding:'8px 12px', borderRadius:8, border:'none', background:'#ef4444', color:'#fff', cursor:'pointer', fontSize:14 }}>Close</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:12 }}>
                <div>
                  <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Sand Lump</label>
                  <input value={t4EditForm.sandLump} onChange={(e)=>setT4EditForm(p=>({...p, sandLump:e.target.value}))} className="sand-table5-input" />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>New Sand Wt</label>
                  <input value={t4EditForm.newSandWt} onChange={(e)=>setT4EditForm(p=>({...p, newSandWt:e.target.value}))} className="sand-table5-input" />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Prepared Sand Friability — Shift I</label>
                  <input value={t4EditForm.sandFriability.shiftI} onChange={(e)=>setT4EditForm(p=>({...p, sandFriability:{...p.sandFriability, shiftI:e.target.value}}))} className="sand-table5-input" />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Prepared Sand Friability — Shift II</label>
                  <input value={t4EditForm.sandFriability.shiftII} onChange={(e)=>setT4EditForm(p=>({...p, sandFriability:{...p.sandFriability, shiftII:e.target.value}}))} className="sand-table5-input" />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, color:'#334155', marginBottom:4 }}>Prepared Sand Friability — Shift III</label>
                  <input value={t4EditForm.sandFriability.shiftIII} onChange={(e)=>setT4EditForm(p=>({...p, sandFriability:{...p.sandFriability, shiftIII:e.target.value}}))} className="sand-table5-input" />
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:12 }}>
                <button onClick={closeT4EditModal} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #d1d5db', background:'#fff', cursor:'pointer', fontSize:14 }}>Cancel</button>
                <button onClick={submitT4Edit} style={{ padding:'8px 12px', borderRadius:8, border:'none', background:'#0ea5e9', color:'#fff', cursor:'pointer', fontSize:14 }}>Update Entry</button>
              </div>
            </div>
          </div>
        )}
        
        {/* Table1 Card-style Modal */}
        {table1ModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1400,
              padding: 20
            }}
            onClick={closeTable1Modal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(1000px, 94%)',
                maxHeight: '92vh',
                overflow: 'hidden',
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 18px 60px rgba(0,0,0,0.28)',
                padding: 20
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>Table 1 — Shift Data (Card view)</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={closeTable1Modal}
                    style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 14 }}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* square cards: use aspect-ratio and a scrollable middle pane */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 440px))', gap: 20, justifyContent: 'center' }}>
                {(() => {
                  const modalRecords = getRecordsForModalBySingleDate();
                  if (!modalRecords.length) {
                    return (
                      <div style={{ gridColumn: '1/-1', padding: 24, textAlign: 'center', color: '#6b7280', fontSize: 16 }}>
                        Select a single date (From Date or End Date) to view entries.
                      </div>
                    );
                  }
                  return modalRecords.map((rec, i) => {
                    const s1 = rec.sandShifts?.shiftI || rec.sandShifts?.ShiftI || {};
                    const s2 = rec.sandShifts?.shiftII || rec.sandShifts?.ShiftII || {};
                    const s3 = rec.sandShifts?.shiftIII || rec.sandShifts?.ShiftIII || {};
                    return (
                      <div
                        key={i}
                        style={{
                          border: '1px solid #e6eef5',
                          borderRadius: 12,
                          background: '#fff',
                          boxShadow: '0 10px 30px rgba(10,20,30,0.08)',
                          width: '100%',
                          maxWidth: 440,
                          aspectRatio: '1 / 1',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ padding: 18, borderBottom: '1px solid #f3f7fb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 800, fontSize: 18 }}>{formatDateDMY(rec.date) || 'No date'}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>Record #{i + 1}</div>
                          </div>
                        </div>

                        <div style={{ padding: '12px 18px', flex: 1, overflowY: 'auto' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                            <div style={{ fontSize: 16, color: '#374151', fontWeight: 700 }}>Parameter</div>
                            <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', minWidth: 260 }}>
                              <div style={{ fontSize: 15, fontWeight: 800, textAlign: 'right', width: 90 }}>Shift I</div>
                              <div style={{ fontSize: 15, fontWeight: 800, textAlign: 'right', width: 90 }}>Shift II</div>
                              <div style={{ fontSize: 15, fontWeight: 800, textAlign: 'right', width: 90 }}>Shift III</div>
                            </div>
                          </div>

                          {[
                            { label: 'R. Sand (Kgs/Mix)', key: 'rSand' },
                            { label: 'N. Sand (Kgs/Mix)', key: 'nSand' },
                            { label: 'Mixing Mode', key: 'mixingMode' },
                            { label: 'Bentonite (Kgs/Mix)', key: 'bentonite' },
                            { label: 'Batch NO', key: 'batchNo' }
                          ].map(p => (
                            <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #f3f7fb' }}>
                              <div style={{ fontSize: 15, color: '#111827', width: '48%' }}>{p.label}</div>
                              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '52%' }}>
                                {p.key !== 'batchNo' ? (
                                  <>
                                    <div style={{ width: 90, textAlign: 'right', color: '#0f172a', fontSize: 16 }}>{s1[p.key] ?? '-'}</div>
                                    <div style={{ width: 90, textAlign: 'right', color: '#0f172a', fontSize: 16 }}>{s2[p.key] ?? '-'}</div>
                                    <div style={{ width: 90, textAlign: 'right', color: '#0f172a', fontSize: 16 }}>{s3[p.key] ?? '-'}</div>
                                  </>
                                ) : (
                                  <>
                                    <div style={{ width: 90, textAlign: 'right', color: '#0f172a', fontSize: 16 }}>{s1?.batchNo?.bentonite || '-'}</div>
                                    <div style={{ width: 90, textAlign: 'right', color: '#0f172a', fontSize: 16 }}>{s2?.batchNo?.coalDustPremix || '-'}</div>
                                    <div style={{ width: 90, textAlign: 'right', color: '#0f172a', fontSize: 16 }}>{s3?.batchNo?.coalDustPremix || '-'}</div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ padding: 14, borderTop: '1px solid #f3f7fb', display: 'flex', justifyContent: 'center', gap: 10 }}>
                          <button
                            onClick={() => openT1EditModal(rec)}
                            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #3b82f6', background: '#fff', color: '#1d4ed8', cursor: 'pointer', fontSize: 14 }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(rec, 'table1')}
                            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ef4444', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 14 }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Table2 Card-style Modal */}
        {table2ModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1400,
              padding: 20
            }}
            onClick={closeTable2Modal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(1000px, 94%)',
                maxHeight: '92vh',
                overflow: 'hidden',
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 18px 60px rgba(0,0,0,0.28)',
                padding: 20
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>Table 2 — Clay Parameters (Card view)</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={closeTable2Modal}
                    style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 14 }}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 440px))', gap: 20, justifyContent: 'center' }}>
                {(() => {
                  const modalRecords = getRecordsForModalBySingleDate();
                  if (!modalRecords.length) {
                    return (
                      <div style={{ gridColumn: '1/-1', padding: 24, textAlign: 'center', color: '#6b7280', fontSize: 16 }}>
                        Select a single date (From Date or End Date) to view entries.
                      </div>
                    );
                  }
                  return modalRecords.map((rec, i) => {
                    const s1 = rec.clayShifts?.shiftI || {};
                    const s2 = rec.clayShifts?.shiftII || rec.clayShifts?.ShiftII || {};
                    const s3 = rec.clayShifts?.shiftIII || rec.clayShifts?.ShiftIII || {};
                    return (
                      <div
                        key={i}
                        style={{
                          border: '1px solid #e6eef5',
                          borderRadius: 12,
                          background: '#fff',
                          boxShadow: '0 10px 30px rgba(10,20,30,0.08)',
                          width: '100%',
                          maxWidth: 440,
                          aspectRatio: '1 / 1',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ padding: 18, borderBottom: '1px solid #f3f7fb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 800, fontSize: 18 }}>{formatDateDMY(rec.date) || 'No date'}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>Record #{i + 1}</div>
                          </div>
                        </div>

                        <div style={{ padding: '12px 18px', flex: 1, overflowY: 'auto' }}>
                          <div style={{ fontSize: 16, color: '#374151', fontWeight: 700, marginBottom: 8 }}>Parameters</div>
                          {[
                            { label: 'Total Clay (11.0 - 14.5%)', key: 'totalClay' },
                            { label: 'Active Clay (8.5 - 11.0%)', key: 'activeClay' },
                            { label: 'Dead Clay (2.0 - 4.0%)', key: 'deadClay' },
                            { label: 'V.C.M (2.0 - 3.2%)', key: 'vcm' },
                            { label: 'L.O.I (4.5 - 6.0%)', key: 'loi' },
                            { label: 'AFS No. (min 48)', key: 'afsNo' },
                            { label: 'Fines (10% Max)', key: 'fines' }
                          ].map(p => (
                            <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #f3f7fb' }}>
                              <div style={{ fontSize: 15, color: '#111827' }}>{p.label}</div>
                              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', minWidth: 120 }}>
                                <div style={{ width: 90, textAlign: 'right', color: '#0f172a', fontSize: 16 }}>{s1[p.key] ?? '-'}</div>
                                <div style={{ width: 90, textAlign: 'right', color: '#0f172a', fontSize: 16 }}>{s2[p.key] ?? '-'}</div>
                                <div style={{ width: 90, textAlign: 'right', color: '#0f172a', fontSize: 16 }}>{s3[p.key] ?? '-'}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ padding: 14, borderTop: '1px solid #f3f7fb', display: 'flex', justifyContent: 'center', gap: 10 }}>
                          <button
                            onClick={() => openT2EditModal(rec)}
                            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #3b82f6', background: '#fff', color: '#1d4ed8', cursor: 'pointer', fontSize: 14 }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(rec, 'table2')}
                            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ef4444', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 14 }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Table3 Card-style Modal */}
        {table3ModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1400,
              padding: 20
            }}
            onClick={closeTable3Modal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(1000px, 94%)',
                maxHeight: '92vh',
                overflow: 'hidden',
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 18px 60px rgba(0,0,0,0.28)',
                padding: 20
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>Table 3 — Mix Data (Card view)</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={closeTable3Modal}
                    style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 14 }}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 440px))', gap: 20, justifyContent: 'center' }}>
                {(() => {
                  const modalRecords = getRecordsForModalBySingleDate();
                  if (!modalRecords.length) {
                    return (
                      <div style={{ gridColumn: '1/-1', padding: 24, textAlign: 'center', color: '#6b7280', fontSize: 16 }}>
                        Select a single date (From Date or To Date) to view entries.
                      </div>
                    );
                  }
                  return modalRecords.map((rec, i) => {
                    const s1 = rec.mixshifts?.ShiftI || {};
                    const s2 = rec.mixshifts?.ShiftII || {};
                    const s3 = rec.mixshifts?.ShiftIII || {};
                    const total = rec.mixshifts?.total || {};
                    return (
                      <div
                        key={i}
                        style={{
                          border: '1px solid #e6eef5',
                          borderRadius: 12,
                          background: '#fff',
                          boxShadow: '0 10px 30px rgba(10,20,30,0.08)',
                          width: '100%',
                          maxWidth: 440,
                          aspectRatio: '1 / 1',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden'
                        }}
                      >
                      <div style={{ padding: 18, borderBottom: '1px solid #f3f7fb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: 800, fontSize: 18 }}>{formatDateDMY(rec.date) || 'No date'}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>Record #{i + 1}</div>
                        </div>
                      </div>

                      <div style={{ padding: '12px 18px', flex: 1, overflowY: 'auto' }}>
                        {(() => {
                          const sum = (vals) => {
                            const n = vals.map(v => Number(v)).filter(v => !Number.isNaN(v));
                            if (!n.length) return undefined;
                            return n.reduce((a,b)=>a+b,0);
                          };
                          const computedTotal = {
                            mixno: { start: undefined, end: undefined, total: sum([s1?.mixno?.total, s2?.mixno?.total, s3?.mixno?.total]) },
                            numberOfMixRejected: sum([s1?.numberOfMixRejected, s2?.numberOfMixRejected, s3?.numberOfMixRejected]),
                            returnSandHopperLevel: sum([s1?.returnSandHopperLevel, s2?.returnSandHopperLevel, s3?.returnSandHopperLevel])
                          };
                          return ['shiftI', 'shiftII', 'shiftIII', 'total'].map(shift => {
                            const shiftData = shift === 'shiftI' ? s1 : shift === 'shiftII' ? s2 : shift === 'shiftIII' ? s3 : computedTotal;
                            const shiftLabel = shift === 'shiftI' ? 'Shift I' : shift === 'shiftII' ? 'Shift II' : shift === 'shiftIII' ? 'Shift III' : 'Total';
                            return (
                              <div key={shift} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f3f7fb' }}>
                                <div style={{ fontSize: 15, color: '#6b7280', fontWeight: 800, marginBottom: 8 }}>{shiftLabel}</div>
                                {(shift === 'total'
                                  ? [
                                      { label: 'Mix No End', get: s => s?.mixno?.end },
                                      { label: 'Mix No Total', get: s => s?.mixno?.total },
                                      { label: 'No. Of Mix Rejected', get: s => s?.numberOfMixRejected },
                                    ]
                                  : [
                                      { label: 'Mix No Start', get: s => s?.mixno?.start },
                                      { label: 'Mix No End', get: s => s?.mixno?.end },
                                      { label: 'Mix No Total', get: s => s?.mixno?.total },
                                      { label: 'No. Of Mix Rejected', get: s => s?.numberOfMixRejected },
                                      { label: 'Return Sand Hopper Level', get: s => s?.returnSandHopperLevel }
                                    ]
                                 ).map(p => (
                                  <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, padding: '6px 0' }}>
                                    <span style={{ color: '#374151' }}>{p.label}:</span>
                                    <span style={{ color: '#0f172a', fontWeight: 800, textAlign: 'right' }}>{p.get(shiftData) ?? '-'}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          });
                        })()}
                      </div>

                      <div style={{ padding: 14, borderTop: '1px solid #f3f7fb', display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <button
                          onClick={() => openT3EditModal(rec)}
                          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #3b82f6', background: '#fff', color: '#1d4ed8', cursor: 'pointer', fontSize: 14 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(rec, 'table3')}
                          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ef4444', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 14 }}
                        >
                          Delete
                        </button>
                      </div>
                     </div>
                   );
                  });
                })()}
               </div>
            </div>
          </div>
        )}

        {/* Table4 Card-style Modal */}
        {table4ModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1400,
              padding: 20
            }}
            onClick={closeTable4Modal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(1000px, 94%)',
                maxHeight: '92vh',
                overflow: 'hidden',
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 18px 60px rgba(0,0,0,0.28)',
                padding: 20
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>Table 4 — Sand Properties (Card view)</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={closeTable4Modal}
                    style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 14 }}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 440px))', gap: 20, justifyContent: 'center' }}>
               {(() => {
  const modalRecords = getRecordsForModalBySingleDate();
  if (!modalRecords.length) {
    return (
      <div style={{ gridColumn: '1/-1', padding: 24, textAlign: 'center', color: '#6b7280', fontSize: 16 }}>
        Select a single date (From Date or End Date) to view entries.
      </div>
    );
  }

  return modalRecords.map((rec, i) => (
    <div
      key={i}
      style={{
        border: '1px solid #e6eef5',
        borderRadius: 12,
        background: '#fff',
        boxShadow: '0 10px 30px rgba(10,20,30,0.08)',
        width: '100%',
        maxWidth: 440,
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 18, borderBottom: '1px solid #f3f7fb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{formatDateDMY(rec.date) || 'No date'}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Record #{i + 1}</div>
        </div>
      </div>

      <div style={{ padding: '12px 18px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ color: '#374151' }}>Sand Lump</div>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.sandLump ?? '-'}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ color: '#374151' }}>New Sand Wt</div>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.newSandWt ?? '-'}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>Prepared Sand Friability — Shift I</div>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.sandFriability?.shiftI ?? '-'}</div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>Prepared Sand Friability — Shift II</div>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.sandFriability?.shiftII ?? '-'}</div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>Prepared Sand Friability — Shift III</div>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.sandFriability?.shiftIII ?? '-'}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 14, borderTop: '1px solid #f3f7fb', display: 'flex', justifyContent: 'center', gap: 10 }}>
        <button
          onClick={() => openT4EditModal(rec)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #3b82f6', background: '#fff', color: '#1d4ed8', cursor: 'pointer', fontSize: 14 }}
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteRecord(rec, 'table4')}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ef4444', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 14 }}
        >
          Delete
        </button>
      </div>
    </div>
  ));
})()}

               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SandTestingRecordReport;