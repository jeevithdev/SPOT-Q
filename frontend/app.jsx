import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './src/context/AuthContext';
import { Navbar } from './src/Components/Navbar';
import Dashboard from './src/Components/Dashboard';
import Loader from './src/Components/Loader';

// Pages
import MicroTensile from './src/pages/MicroTensile';
import MicroStructure from './src/pages/MicroStructure';
import MicroStructureReport from './src/pages/MicroStructureReport';
import QcProductionDetails from './src/pages/QcProductionDetails';
import QcProductionReport from './src/pages/QcProductionReport';
import Process from './src/pages/Process';
import MeltingLogSheet from './src/pages/Melting/MeltingLogSheet';
import CupolaHolderLogSheet from './src/pages/Melting/CupolaHolderLogSheet';
import Login from './src/pages/Login';
import Tensile from './src/pages/Tensile';
import TensileReport from './src/pages/TensileReport';
import SandTestingRecord from './src/pages/SandLab/SandTestingRecord';
import FoundarySandTestingNote from './src/pages/SandLab/FoundarySandTestingNote';
import DisamaticProductReport from './src/pages/Moulding/DisamaticProductReport';
import MouldHardnessPatternTemperatureRecord from './src/pages/Moulding/MouldHardnessPatternTemperatureRecord';
import MouldingPage3 from './src/pages/MouldingPage3';
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
    return <Loader />;
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
          <Route path="micro-structure" element={<MicroStructure />} />
          <Route path="micro-structure/report" element={<MicroStructureReport />} />
          <Route path="impact" element={<Impact />} />
          <Route path="impact/report" element={<ImpactReport />} />
          <Route path="process" element={<Process />} />

          {/* QC Production Details */}
          <Route path="qc-production-details/data-entry" element={<QcProductionDetails />} />
          <Route path="qc-production-details/report" element={<QcProductionReport />} />

          {/* Melting */}
          <Route path="melting/melting-log-sheet" element={<MeltingLogSheet />} />
          <Route path="melting/cupola-holder-log-sheet" element={<CupolaHolderLogSheet />} />

          {/* Tensile */}
          <Route path="tensile" element={<Tensile />} />
          <Route path="tensile/report" element={<TensileReport />} />

          {/* Sand Lab */}
          <Route path="sand-lab/sand-testing-record" element={<SandTestingRecord />} />
          <Route path="sand-lab/foundry-sand-testing-note" element={<FoundarySandTestingNote />} />

          {/* Moulding */}
          <Route path="moulding/disamatic-product-report" element={<DisamaticProductReport />} />
          <Route path="moulding/mould-hardness-pattern-temperature-record" element={<MouldHardnessPatternTemperatureRecord />} />
          <Route path="moulding/dmm-setting-parameters" element={<MouldingPage3 />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;