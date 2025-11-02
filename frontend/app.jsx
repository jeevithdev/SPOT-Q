import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './src/context/AuthContext';
import { Navbar } from './src/Components/Navbar';
import Dashboard from './src/Components/Dashboard';

// Pages
import MicroTensile from './src/pages/MicroTensile';
import MicroTensileReport from './src/pages/MicroTensileReport';
import MicroStructure from './src/pages/MicroStructure';
import MicroStructureReport from './src/pages/MicroStructureReport';
import QcProductionDetails from './src/pages/QcProductionDetails';
import QcProductionDetailsReport from './src/pages/QcProductionDetailsReport';
import Process from './src/pages/Process';
import ProcessReport from './src/pages/ProcessReport';
import MeltingLogSheet from './src/pages/Melting/MeltingLogSheet';
import MeltingLogSheetReport from './src/pages/Melting/MeltingLogSheetReport';
import CupolaHolderLogSheet from './src/pages/Melting/CupolaHolderLogSheet';
import CupolaHolderLogSheetReport from './src/pages/Melting/CupolaHolderLogSheetReport';
import Login from './src/pages/Login';
import Tensile from './src/pages/Tensile';
import TensileReport from './src/pages/TensileReport';
import SandTestingRecord from './src/pages/SandLab/SandTestingRecord';
import SandTestingRecordReport from './src/pages/SandLab/SandTestingRecordReport';
import FoundarySandTestingNote from './src/pages/SandLab/FoundarySandTestingNote';
import FoundrySandTestingReport from './src/pages/SandLab/FoundrySandTestingReport';
import DisamaticProduct from './src/pages/Moulding/DisamaticProduct';
import DisamaticProductReport from './src/pages/Moulding/DisamaticProductReport';
import DmmSettingParameters from './src/pages/Moulding/DmmSettingParameters';
import DmmSettingParametersReport from './src/pages/Moulding/DmmSettingParametersReport';
import AdminDashboard from './src/Components/AdminDashboard';
import Impact from './src/pages/Impact';
import ImpactReport from './src/pages/ImpactReport';

const ProtectedLayout = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <Dashboard>
        <Outlet />
      </Dashboard>
    </>
  );
};

const AdminLayout = () => {
  const { user, isAdmin } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

const App = () => {
  const { user, loading, isAdmin } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

        {/* Admin Routes - Separate Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Protected Employee Routes */}
        <Route path="/" element={<ProtectedLayout />}>
          {/* Default dashboard page - Admin goes to admin dashboard, others to micro-tensile */}
          <Route index element={isAdmin ? <Navigate to="/admin" replace /> : <MicroTensile />} />

          {/* Top-level pages */}
          <Route path="micro-tensile" element={<MicroTensile />} />
          <Route path="micro-tensile/report" element={<MicroTensileReport />} />
          <Route path="micro-structure" element={<MicroStructure />} />
          <Route path="micro-structure/report" element={<MicroStructureReport />} />
          <Route path="impact" element={<Impact />} />
          <Route path="impact/report" element={<ImpactReport />} />
          <Route path="process" element={<Process />} />
          <Route path="process/report" element={<ProcessReport />} />

          {/* QC Production Details */}
          <Route path="qc-production-details" element={<QcProductionDetails />} />
          <Route path="qc-production-details/report" element={<QcProductionDetailsReport />} />

          {/* Melting */}
          <Route path="melting/melting-log-sheet" element={<MeltingLogSheet />} />
          <Route path="melting/melting-log-sheet/report" element={<MeltingLogSheetReport />} />
          <Route path="melting/cupola-holder-log-sheet" element={<CupolaHolderLogSheet />} />
          <Route path="melting/cupola-holder-log-sheet/report" element={<CupolaHolderLogSheetReport />} />

          {/* Tensile */}
          <Route path="tensile" element={<Tensile />} />
          <Route path="tensile/report" element={<TensileReport />} />

          {/* Sand Lab */}
          <Route path="sand-lab/sand-testing-record" element={<SandTestingRecord />} />
          <Route path="sand-lab/sand-testing-record/report" element={<SandTestingRecordReport />} />
          <Route path="sand-lab/foundry-sand-testing-note" element={<FoundarySandTestingNote />} />
          <Route path="sand-lab/foundry-sand-testing-note/report" element={<FoundrySandTestingReport />} />

          {/* Moulding */}
          <Route path="moulding/disamatic-product" element={<DisamaticProduct />} />
          <Route path="moulding/disamatic-product/report" element={<DisamaticProductReport />} />
          <Route path="moulding/dmm-setting-parameters" element={<DmmSettingParameters />} />
          <Route path="moulding/dmm-setting-parameters/report" element={<DmmSettingParametersReport />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;