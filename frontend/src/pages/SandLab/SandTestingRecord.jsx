import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, FileText, Plus, Trash2, RefreshCw } from 'lucide-react';
import CustomDatePicker from '../../Components/CustomDatePicker';
import '../../styles/PageStyles/Sandlab/SandTestingRecord.css';

const SandTestingRecord = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    disa: '',
    date: '',
    // Table 1
    rSandShiftI: '',
    rSandShiftII: '',
    rSandShiftIII: '',
    nSandShiftI: '',
    nSandShiftII: '',
    nSandShiftIII: '',
    mixingModeShiftI: '',
    mixingModeShiftII: '',
    mixingModeShiftIII: '',
    bentoniteShiftI: '',
    bentoniteShiftII: '',
    bentoniteShiftIII: '',
    coalDustPremixShiftI: '',
    coalDustPremixShiftII: '',
    coalDustPremixShiftIII: '',
    batchNoShiftI: '',
    batchNoShiftIBentonite: false,
    batchNoShiftII: '',
    batchNoShiftIICoalDust: false,
    batchNoShiftIIPremix: false,
    batchNoShiftIII: '',
    batchNoShiftIIICoalDust: false,
    batchNoShiftIIIPremix: false,
    // Table 2
    totalClayShiftI: '',
    totalClayShiftII: '',
    totalClayShiftIII: '',
    activeClayShiftI: '',
    activeClayShiftII: '',
    activeClayShiftIII: '',
    deadClayShiftI: '',
    deadClayShiftII: '',
    deadClayShiftIII: '',
    vcmShiftI: '',
    vcmShiftII: '',
    vcmShiftIII: '',
    loiShiftI: '',
    loiShiftII: '',
    loiShiftIII: '',
    afsNoShiftI: '',
    afsNoShiftII: '',
    afsNoShiftIII: '',
    finesShiftI: '',
    finesShiftII: '',
    finesShiftIII: '',
    // Table 3 - Form fields (single entry)
    table3Time: '',
    table3MixNo: '',
    table3Permeability: '',
    table3Gcs: '',
    table3Wts: '',
    table3Moisture: '',
    table3Compactability: '',
    table3Compressibility: '',
    table3WaterLitre: '',
    table3SandTempBC: '',
    table3SandTempWU: '',
    table3SandTempSSU: '',
    // G.C.S. Checkpoint selection
    gcsFdyA: false,
    gcsFdyB: false,
    // Table 4
    mixNoStartShiftI: '',
    mixNoEndShiftI: '',
    mixNoTotalShiftI: '',
    mixNoStartShiftII: '',
    mixNoEndShiftII: '',
    mixNoTotalShiftII: '',
    mixNoStartShiftIII: '',
    mixNoEndShiftIII: '',
    mixNoTotalShiftIII: '',
    mixRejectedShiftI: '',
    mixRejectedShiftII: '',
    mixRejectedShiftIII: '',
    hopperLevelShiftI: '',
    hopperLevelShiftII: '',
    hopperLevelShiftIII: '',
    // Table 4 Totals
    mixNoEndTotal: '',
    mixNoTotalSum: '',
    mixRejectedTotal: '',
    // Table 5
    sandLumps: '',
    sandLumpsValue: '',
    newSandWt: '',
    newSandWtValue: '',
    preparedSandFriabilityI: '',
    preparedSandFriabilityII: '',
    preparedSandFriabilityIII: '',
    // Table 6 - Array of rows
    table6Rows: [{
      title1: '',
      title2: '',
      title3: '',
      title4: '',
      title5: '',
      title6: '',
      title7: '',
      title8: '',
      title9: '',
      title10: ''
    }],
    // Table 6 Bentonite checkboxes
    bentonitePremix060120: false,
    bentonitePremix080220: false,
    // Table 6 Checkpoints checkboxes
    checkpointsPremix: false,
    checkpointsCoalDust: false,
    // Table 6 Title 6 checkboxes
    title6LC: false,
    title6SMC42: false,
    title6At140: false,
    // Table 6 Title 7 checkboxes
    title7MouldStrength: false,
    title7ShearStrength: false
  });

  const disaOptions = ['DISA I', 'DISA II', 'DISA III', 'DISA IV'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const table3InputRefs = useRef({});

  const handleTable3Submit = () => {
    // Handle Table 3 form submission
    alert('Table 3 entry submitted successfully!');
    handleTable3Reset();
  };

  const handleTable3Reset = () => {
    setFormData(prev => ({
      ...prev,
      table3Time: '',
      table3MixNo: '',
      table3Permeability: '',
      table3Gcs: '',
      table3Wts: '',
      table3Moisture: '',
      table3Compactability: '',
      table3Compressibility: '',
      table3WaterLitre: '',
      table3SandTempBC: '',
      table3SandTempWU: '',
      table3SandTempSSU: '',
      gcsFdyA: false,
      gcsFdyB: false,
    }));
    table3InputRefs.current.table3Time?.focus();
  };

  const handleTable3KeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const fieldOrder = ['table3Time', 'table3MixNo', 'table3Permeability', 'table3Gcs', 
                          'table3Wts', 'table3Moisture', 'table3Compactability', 'table3Compressibility',
                          'table3WaterLitre', 'table3SandTempBC', 'table3SandTempWU', 'table3SandTempSSU'];
      const idx = fieldOrder.indexOf(field);
      if (idx < fieldOrder.length - 1) {
        table3InputRefs.current[fieldOrder[idx + 1]]?.focus();
      } else {
        handleTable3Submit();
      }
    }
  };

  const handleTable6Change = (index, field, value) => {
    setFormData(prev => {
      const newRows = [...prev.table6Rows];
      newRows[index] = {
        ...newRows[index],
        [field]: value
      };
      return {
        ...prev,
        table6Rows: newRows
      };
    });
  };

  const addTable6Row = () => {
    setFormData(prev => ({
      ...prev,
      table6Rows: [
        ...prev.table6Rows,
        {
          title1: '',
          title2: '',
          title3: '',
          title4: '',
          title5: '',
          title6: '',
          title7: '',
          title8: '',
          title9: '',
          title10: ''
        }
      ]
    }));
  };

  const removeTable6Row = (index) => {
    if (formData.table6Rows.length > 1) {
      setFormData(prev => ({
        ...prev,
        table6Rows: prev.table6Rows.filter((_, i) => i !== index)
      }));
    }
  };

  const handleViewReport = () => {
    navigate('/sand-lab/sand-testing-record/report');
  };

  return (
    <>
      {/* Header */}
      <div className="sand-header">
        <div className="sand-header-text">
          <h2>
            <Save size={28} style={{ color: '#5B9AA9' }} />
            Sand Testing Record - Entry Form
          </h2>
        </div>
        <div className="sand-header-buttons">
          <button className="sand-view-report-btn" onClick={handleViewReport} type="button">
            <div className="sand-view-report-icon">
              <FileText size={16} />
            </div>
            <span className="sand-view-report-text">View Reports</span>
          </button>
        </div>
      </div>

      {/* Form Section */}
      <form className="sand-form-grid">
          <h3 className="sand-section-title">Basic Information</h3>
        
        <div className="sand-form-group">
          <label>Disa</label>
          <select
            name="disa"
            value={formData.disa}
            onChange={handleChange}
          >
            <option value="">Select DISA</option>
            {disaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sand-form-group">
          <label>Date</label>
          <CustomDatePicker
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        {/* Table 1 */}
        <h3 className="sand-section-title">Table 1</h3>
        <div className="sand-table-wrapper" style={{ gridColumn: '1 / -1' }}>
          <table className="sand-table">
            <thead>
              <tr>
                <th>Shift</th>
                <th>I</th>
                <th>II</th>
                <th>III</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>R. Sand (Kgs./Mix)</td>
                <td>
                  <input
                    type="number"
                    name="rSandShiftI"
                    value={formData.rSandShiftI}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="rSandShiftII"
                    value={formData.rSandShiftII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="rSandShiftIII"
                    value={formData.rSandShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
              </tr>
              <tr>
                <td>N. Sand (Kgs./Mould)</td>
                <td>
                  <input
                    type="number"
                    name="nSandShiftI"
                    value={formData.nSandShiftI}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="nSandShiftII"
                    value={formData.nSandShiftII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="nSandShiftIII"
                    value={formData.nSandShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
              </tr>
              <tr>
                <td>Mixing Mode</td>
                <td>
                  <input
                    type="text"
                    name="mixingModeShiftI"
                    value={formData.mixingModeShiftI}
                    onChange={handleChange}
                    placeholder="Enter mode"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="mixingModeShiftII"
                    value={formData.mixingModeShiftII}
                    onChange={handleChange}
                    placeholder="Enter mode"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="mixingModeShiftIII"
                    value={formData.mixingModeShiftIII}
                    onChange={handleChange}
                    placeholder="Enter mode"
                  />
                </td>
              </tr>
              <tr>
                <td>Bentonite (kgs./Mix)</td>
                <td>
                  <input
                    type="number"
                    name="bentoniteShiftI"
                    value={formData.bentoniteShiftI}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="bentoniteShiftII"
                    value={formData.bentoniteShiftII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="bentoniteShiftIII"
                    value={formData.bentoniteShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
              </tr>
              <tr>
                <td>Coal Dust / Premix (Kgs./Mix)</td>
                <td>
                  <input
                    type="number"
                    name="coalDustPremixShiftI"
                    value={formData.coalDustPremixShiftI}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="coalDustPremixShiftII"
                    value={formData.coalDustPremixShiftII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="coalDustPremixShiftIII"
                    value={formData.coalDustPremixShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
              </tr>
              <tr>
                <td>Batch No.</td>
                <td>
                  <div className="batch-no-container">
                    <div className="batch-checkbox-item">
                      <input
                        type="checkbox"
                        name="batchNoShiftIBentonite"
                        checked={formData.batchNoShiftIBentonite}
                        onChange={handleChange}
                        id="batchNoShiftIBentonite"
                      />
                      <label htmlFor="batchNoShiftIBentonite">Bentonite</label>
                    </div>
                    <input
                      type="text"
                      name="batchNoShiftI"
                      value={formData.batchNoShiftI}
                      onChange={handleChange}
                      placeholder="Enter batch no"
                    />
                  </div>
                </td>
                <td>
                  <div className="batch-no-container">
                    <div className="batch-checkboxes">
                      <div className="batch-checkbox-item">
                        <input
                          type="checkbox"
                          name="batchNoShiftIICoalDust"
                          checked={formData.batchNoShiftIICoalDust}
                          onChange={handleChange}
                          id="batchNoShiftIICoalDust"
                        />
                        <label htmlFor="batchNoShiftIICoalDust">Coal Dust</label>
                      </div>
                      <div className="batch-checkbox-item">
                        <input
                          type="checkbox"
                          name="batchNoShiftIIPremix"
                          checked={formData.batchNoShiftIIPremix}
                          onChange={handleChange}
                          id="batchNoShiftIIPremix"
                        />
                        <label htmlFor="batchNoShiftIIPremix">Premix</label>
                      </div>
                    </div>
                    <input
                      type="text"
                      name="batchNoShiftII"
                      value={formData.batchNoShiftII}
                      onChange={handleChange}
                      placeholder="Enter batch no"
                    />
                  </div>
                </td>
                <td>
                  <div className="batch-no-container">
                    <div className="batch-checkboxes">
                      <div className="batch-checkbox-item">
                        <input
                          type="checkbox"
                          name="batchNoShiftIIICoalDust"
                          checked={formData.batchNoShiftIIICoalDust}
                          onChange={handleChange}
                          id="batchNoShiftIIICoalDust"
                        />
                        <label htmlFor="batchNoShiftIIICoalDust">Coal Dust</label>
                      </div>
                      <div className="batch-checkbox-item">
                        <input
                          type="checkbox"
                          name="batchNoShiftIIIPremix"
                          checked={formData.batchNoShiftIIIPremix}
                          onChange={handleChange}
                          id="batchNoShiftIIIPremix"
                        />
                        <label htmlFor="batchNoShiftIIIPremix">Premix</label>
                      </div>
                    </div>
                    <input
                      type="text"
                      name="batchNoShiftIII"
                      value={formData.batchNoShiftIII}
                      onChange={handleChange}
                      placeholder="Enter batch no"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table 2 */}
        <h3 className="sand-section-title">Table 2</h3>
        <div className="sand-table-wrapper" style={{ gridColumn: '1 / -1' }}>
          <table className="sand-table">
            <thead>
              <tr>
                <th>Shift</th>
                <th>I</th>
                <th>II</th>
                <th>III</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Clay (11.0 - 14.5 %)</td>
                <td>
                  <input
                    type="number"
                    name="totalClayShiftI"
                    value={formData.totalClayShiftI}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="totalClayShiftII"
                    value={formData.totalClayShiftII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="totalClayShiftIII"
                    value={formData.totalClayShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
              </tr>
              <tr>
                <td>Active Clay (8.5 - 11.0%)</td>
                <td>
                  <input
                    type="number"
                    name="activeClayShiftI"
                    value={formData.activeClayShiftI}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="activeClayShiftII"
                    value={formData.activeClayShiftII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="activeClayShiftIII"
                    value={formData.activeClayShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
              </tr>
              <tr>
                <td>Dead Clay (2.0 - 4.0 %)</td>
                <td>
                  <input
                    type="number"
                    name="deadClayShiftI"
                    value={formData.deadClayShiftI}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="deadClayShiftII"
                    value={formData.deadClayShiftII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="deadClayShiftIII"
                    value={formData.deadClayShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
              </tr>
              <tr>
                <td>V.C.M (2.0 - 3.2 %)</td>
                <td>
                  <input
                    type="number"
                    name="vcmShiftI"
                    value={formData.vcmShiftI}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="vcmShiftII"
                    value={formData.vcmShiftII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="vcmShiftIII"
                    value={formData.vcmShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
              </tr>
              <tr>
                <td>L.O.I (4.5 - 6.0 %)</td>
                <td>
                  <input
                    type="number"
                    name="loiShiftI"
                    value={formData.loiShiftI}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="loiShiftII"
                    value={formData.loiShiftII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="loiShiftIII"
                    value={formData.loiShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
              </tr>
              <tr>
                <td>AFS No. (Min. 48)</td>
                <td>
                  <input
                    type="number"
                    name="afsNoShiftI"
                    value={formData.afsNoShiftI}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="afsNoShiftII"
                    value={formData.afsNoShiftII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="afsNoShiftIII"
                    value={formData.afsNoShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
              </tr>
              <tr>
                <td>Fines (10% Max)</td>
                <td>
                  <input
                    type="number"
                    name="finesShiftI"
                    value={formData.finesShiftI}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="finesShiftII"
                    value={formData.finesShiftII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="finesShiftIII"
                    value={formData.finesShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.1"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table 3 - Form Layout */}
        <div className="sand-table3-form-wrapper" style={{ gridColumn: '1 / -1', position: 'relative', marginBottom: '2rem' }}>
          <h3 className="sand-section-title">Table 3</h3>
          
          <div className="sand-table3-form-grid">
            {/* G.C.S. Checkpoints */}
            <div className="sand-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>G.C.S. (Gm/cm²) Checkpoints</label>
              <div className="sand-checkbox-group">
                <label className="sand-checkbox-label">
                  <input
                    type="checkbox"
                    name="gcsFdyA"
                    checked={formData.gcsFdyA}
                    onChange={handleChange}
                  />
                  <span>FDY - A (Min 1800)</span>
                </label>
                <label className="sand-checkbox-label">
                  <input
                    type="checkbox"
                    name="gcsFdyB"
                    checked={formData.gcsFdyB}
                    onChange={handleChange}
                  />
                  <span>FDY - B (Min 1900)</span>
                </label>
              </div>
            </div>

            <div className="sand-form-group">
            <label>Time</label>
            <input
              ref={el => table3InputRefs.current.table3Time = el}
              type="text"
              name="table3Time"
              value={formData.table3Time}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3Time')}
              placeholder="Enter time"
            />
          </div>

          <div className="sand-form-group">
            <label>Mix No.</label>
            <input
              ref={el => table3InputRefs.current.table3MixNo = el}
              type="number"
              name="table3MixNo"
              value={formData.table3MixNo}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3MixNo')}
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>Permeability (90 - 160)</label>
            <input
              ref={el => table3InputRefs.current.table3Permeability = el}
              type="number"
              name="table3Permeability"
              value={formData.table3Permeability}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3Permeability')}
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>G.C.S. (Gm/cm²)</label>
            <input
              ref={el => table3InputRefs.current.table3Gcs = el}
              type="number"
              name="table3Gcs"
              value={formData.table3Gcs}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3Gcs')}
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>W.T.S (N/cm²) (Min 0.15)</label>
            <input
              ref={el => table3InputRefs.current.table3Wts = el}
              type="number"
              name="table3Wts"
              value={formData.table3Wts}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3Wts')}
              step="0.01"
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>Moisture % (3.0 - 4.0 %)</label>
            <input
              ref={el => table3InputRefs.current.table3Moisture = el}
              type="number"
              name="table3Moisture"
              value={formData.table3Moisture}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3Moisture')}
              step="0.1"
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>Compactability % At DMM (33-40%)</label>
            <input
              ref={el => table3InputRefs.current.table3Compactability = el}
              type="number"
              name="table3Compactability"
              value={formData.table3Compactability}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3Compactability')}
              step="0.1"
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>Compressibility % At DMM (20-28%)</label>
            <input
              ref={el => table3InputRefs.current.table3Compressibility = el}
              type="number"
              name="table3Compressibility"
              value={formData.table3Compressibility}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3Compressibility')}
              step="0.1"
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>Water Litre /Kg Mix</label>
            <input
              ref={el => table3InputRefs.current.table3WaterLitre = el}
              type="number"
              name="table3WaterLitre"
              value={formData.table3WaterLitre}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3WaterLitre')}
              step="0.01"
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>Sand Temp BC (°C)</label>
            <input
              ref={el => table3InputRefs.current.table3SandTempBC = el}
              type="number"
              name="table3SandTempBC"
              value={formData.table3SandTempBC}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3SandTempBC')}
              step="0.1"
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>Sand Temp WU (°C)</label>
            <input
              ref={el => table3InputRefs.current.table3SandTempWU = el}
              type="number"
              name="table3SandTempWU"
              value={formData.table3SandTempWU}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3SandTempWU')}
              step="0.1"
              placeholder="0"
            />
          </div>

          <div className="sand-form-group">
            <label>Sand Temp SSU (°C) (Max 45°C)</label>
            <input
              ref={el => table3InputRefs.current.table3SandTempSSU = el}
              type="number"
              name="table3SandTempSSU"
              value={formData.table3SandTempSSU}
              onChange={handleChange}
              onKeyDown={(e) => handleTable3KeyDown(e, 'table3SandTempSSU')}
              step="0.1"
              placeholder="0"
            />
          </div>

            <div className="sand-table3-submit-container">
              <button onClick={handleTable3Submit} className="sand-table3-submit-btn" type="button">
                <Save size={18} />
                Submit Entry
              </button>
            </div>

            <div className="sand-table3-reset-container">
              <button onClick={handleTable3Reset} className="sand-table3-reset-btn" type="button">
                <RefreshCw size={18} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table 4 */}
        <h3 className="sand-section-title">Table 4</h3>
        <div className="sand-table-wrapper" style={{ gridColumn: '1 / -1' }}>
          <table className="sand-table">
            <thead>
              <tr>
                <th rowSpan="2">Shift</th>
                <th colSpan="3">Mix No.</th>
                <th rowSpan="2">No. of Mix rejected</th>
                <th rowSpan="2">Return Sand Hopper level</th>
              </tr>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>I</td>
                <td>
                      <input
                        type="number"
                        name="mixNoStartShiftI"
                        value={formData.mixNoStartShiftI}
                        onChange={handleChange}
                        placeholder="0"
                      />
                </td>
                <td>
                      <input
                        type="number"
                        name="mixNoEndShiftI"
                        value={formData.mixNoEndShiftI}
                        onChange={handleChange}
                        placeholder="0"
                      />
                </td>
                <td>
                      <input
                        type="number"
                        name="mixNoTotalShiftI"
                        value={formData.mixNoTotalShiftI}
                        onChange={handleChange}
                        placeholder="0"
                      />
                </td>
                <td>
                  <input
                    type="number"
                    name="mixRejectedShiftI"
                    value={formData.mixRejectedShiftI}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="hopperLevelShiftI"
                    value={formData.hopperLevelShiftI}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
              </tr>
              <tr>
                <td>II</td>
                <td>
                      <input
                        type="number"
                        name="mixNoStartShiftII"
                        value={formData.mixNoStartShiftII}
                        onChange={handleChange}
                        placeholder="0"
                      />
                </td>
                <td>
                      <input
                        type="number"
                        name="mixNoEndShiftII"
                        value={formData.mixNoEndShiftII}
                        onChange={handleChange}
                        placeholder="0"
                      />
                </td>
                <td>
                      <input
                        type="number"
                        name="mixNoTotalShiftII"
                        value={formData.mixNoTotalShiftII}
                        onChange={handleChange}
                        placeholder="0"
                      />
                </td>
                <td>
                      <input
                        type="number"
                    name="mixRejectedShiftII"
                    value={formData.mixRejectedShiftII}
                        onChange={handleChange}
                        placeholder="0"
                      />
                </td>
                <td>
                      <input
                        type="number"
                    name="hopperLevelShiftII"
                    value={formData.hopperLevelShiftII}
                        onChange={handleChange}
                        placeholder="0"
                      />
                </td>
              </tr>
              <tr>
                <td>III</td>
                <td>
                      <input
                        type="number"
                    name="mixNoStartShiftIII"
                    value={formData.mixNoStartShiftIII}
                        onChange={handleChange}
                        placeholder="0"
                      />
                </td>
                <td>
                  <input
                    type="number"
                    name="mixNoEndShiftIII"
                    value={formData.mixNoEndShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="mixNoTotalShiftIII"
                    value={formData.mixNoTotalShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="mixRejectedShiftIII"
                    value={formData.mixRejectedShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="hopperLevelShiftIII"
                    value={formData.hopperLevelShiftIII}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2" style={{ fontWeight: 600, background: '#f8fafc' }}>TOTAL</td>
                <td>
                  <input
                    type="number"
                    name="mixNoEndTotal"
                    value={formData.mixNoEndTotal}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="mixNoTotalSum"
                    value={formData.mixNoTotalSum}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="mixRejectedTotal"
                    value={formData.mixRejectedTotal}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table 5 */}
        <h3 className="sand-section-title">Table 5</h3>
        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* First Table - SAND LUMPS and NEW SAND WT */}
          <div className="sand-table-wrapper">
            <table className="sand-table">
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, background: '#f8fafc' }}>SAND LUMPS</td>
                  <td>
                    <input
                      type="text"
                      name="sandLumpsValue"
                      value={formData.sandLumpsValue}
                      onChange={handleChange}
                      placeholder="Enter value"
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: '#f8fafc' }}>NEW SAND WT</td>
                  <td>
                    <input
                      type="text"
                      name="newSandWtValue"
                      value={formData.newSandWtValue}
                      onChange={handleChange}
                      placeholder="Enter value"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Second Table - Shift and Prepared Sand Friability */}
          <div className="sand-table-wrapper">
            <table className="sand-table">
              <thead>
                <tr>
                  <th>Shift</th>
                  <th>Prepared Sand Friability<br/>(8.0-13.0%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, background: '#f8fafc', textAlign: 'center' }}>I</td>
                  <td>
                    <input
                      type="text"
                      name="preparedSandFriabilityI"
                      value={formData.preparedSandFriabilityI}
                      onChange={handleChange}
                      placeholder="Enter value"
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: '#f8fafc', textAlign: 'center' }}>II</td>
                  <td>
                    <input
                      type="text"
                      name="preparedSandFriabilityII"
                      value={formData.preparedSandFriabilityII}
                      onChange={handleChange}
                      placeholder="Enter value"
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: '#f8fafc', textAlign: 'center' }}>III</td>
                  <td>
                    <input
                      type="text"
                      name="preparedSandFriabilityIII"
                      value={formData.preparedSandFriabilityIII}
                      onChange={handleChange}
                      placeholder="Enter value"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>

        {/* Table 6 */}
        <h3 className="sand-section-title">Table 6</h3>
        <div className="sand-table-wrapper sand-table-6-wrapper" style={{ gridColumn: '1 / -1' }}>
          <table className="sand-table sand-table-6">
            <thead>
              <tr>
                <th rowSpan="2">S.no</th>
                <th rowSpan="2">New Sand Kgs / Mould<br/>(0.0 - 5.0)</th>
                <th colSpan="2">
                  Bentonite Kgs / With premix<br/>
                  <div className="gcs-header-checkboxes">
                    <label className="gcs-header-checkbox">
                      <input
                        type="checkbox"
                        name="bentonitePremix060120"
                        checked={formData.bentonitePremix060120}
                        onChange={handleChange}
                      />
                      0.60 - 1.20 %
                    </label>
                    <label className="gcs-header-checkbox">
                      <input
                        type="checkbox"
                        name="bentonitePremix080220"
                        checked={formData.bentonitePremix080220}
                        onChange={handleChange}
                      />
                      0.80 - 2.20%
                    </label>
                  </div>
                </th>
                <th colSpan="2">
                  <div className="gcs-header-checkboxes">
                    <label className="gcs-header-checkbox">
                      <input
                        type="checkbox"
                        name="checkpointsPremix"
                        checked={formData.checkpointsPremix}
                        onChange={handleChange}
                      />
                      Premix Kgs / mix 0.60 - 1.20 %
                    </label>
                    <label className="gcs-header-checkbox">
                      <input
                        type="checkbox"
                        name="checkpointsCoalDust"
                        checked={formData.checkpointsCoalDust}
                        onChange={handleChange}
                      />
                      Coal dust Kgs / mix 0.20 - 0.70 %
                    </label>
                  </div>
                </th>
                <th rowSpan="2">
                  <div className="gcs-header-checkboxes">
                    <label className="gcs-header-checkbox">
                      <input
                        type="checkbox"
                        name="title6LC"
                        checked={formData.title6LC}
                        onChange={handleChange}
                      />
                      LC
                    </label>
                    <label className="gcs-header-checkbox">
                      <input
                        type="checkbox"
                        name="title6SMC42"
                        checked={formData.title6SMC42}
                        onChange={handleChange}
                      />
                      Compact Ability Setting SMC 42 (±) 3
                    </label>
                    <label className="gcs-header-checkbox">
                      <input
                        type="checkbox"
                        name="title6At140"
                        checked={formData.title6At140}
                        onChange={handleChange}
                      />
                      At1 40 (±) 3
                    </label>
                  </div>
                </th>
                <th rowSpan="2">
                  <div className="gcs-header-checkboxes">
                    <label className="gcs-header-checkbox">
                      <input
                        type="checkbox"
                        name="title7MouldStrength"
                        checked={formData.title7MouldStrength}
                        onChange={handleChange}
                      />
                      Mould strength SMC - 23 ± 3
                    </label>
                    <label className="gcs-header-checkbox">
                      <input
                        type="checkbox"
                        name="title7ShearStrength"
                        checked={formData.title7ShearStrength}
                        onChange={handleChange}
                      />
                      Shear strength setting At1 5.0±1%
                    </label>
                  </div>
                </th>
                <th rowSpan="2">Prepared Sand Lumps / Kg</th>
                <th rowSpan="2">Item name</th>
                <th rowSpan="2">Remarks</th>
                <th rowSpan="2">Action</th>
              </tr>
              <tr>
                <th className="table6-subheader-left">Kgs</th>
                <th className="table6-subheader-middle">%</th>
                <th className="table6-subheader-middle">Kgs</th>
                <th className="table6-subheader-right">%</th>
              </tr>
            </thead>
            <tbody>
              {formData.table6Rows.map((row, index) => (
                <tr key={index}>
                  <td className="sand-sno-cell">{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={row.title1}
                      onChange={(e) => handleTable6Change(index, 'title1', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.title2}
                      onChange={(e) => handleTable6Change(index, 'title2', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.title3}
                      onChange={(e) => handleTable6Change(index, 'title3', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.title4}
                      onChange={(e) => handleTable6Change(index, 'title4', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.title5}
                      onChange={(e) => handleTable6Change(index, 'title5', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.title6}
                      onChange={(e) => handleTable6Change(index, 'title6', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.title7}
                      onChange={(e) => handleTable6Change(index, 'title7', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.title8}
                      onChange={(e) => handleTable6Change(index, 'title8', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.title9}
                      onChange={(e) => handleTable6Change(index, 'title9', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.title10}
                      onChange={(e) => handleTable6Change(index, 'title10', e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>
                  <td className="sand-action-cell">
                    {formData.table6Rows.length > 1 && (
                      <button
                        type="button"
                        className="sand-remove-row-btn"
                        onClick={() => removeTable6Row(index)}
                        title="Remove row"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="sand-table-6-controls">
            <button type="button" className="sand-add-row-btn" onClick={addTable6Row}>
              <Plus size={16} />
              <span>Add Row</span>
            </button>
          </div>
      </div>
      </form>
    </>
  );
};

export default SandTestingRecord;
