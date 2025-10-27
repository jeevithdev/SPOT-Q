import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './src/context/AuthContext';
import { Navbar } from './src/Components/Navbar';
import Guidelines from './src/Components/Guidelines';
import Dashboard from './src/Components/Dashboard';
import Loader from './src/Components/Loader';

// Pages
import MicroTensile from './src/pages/MicroTensile';
import QcProductionDetails from './src/pages/QcProductionDetails';
import Process from './src/pages/Process';
import MeltingProcessParameter from './src/pages/MeltingProcessParameter';
import MoldingProcessParameter from './src/pages/MoldingProcessParameter';
import Login from './src/pages/Login';
import Tensile from './src/pages/Tensile';
import SandTestingRecord from './src/pages/SandTestingRecord';
import FoundarySandTestingNote from './src/pages/FoundarySandTestingNote';
import DisamaticProductReport from './src/pages/DisamaticProductReport';
import MouldHardnessPatternTemperatureRecord from './src/pages/MouldHardnessPatternTemperatureRecord';
import MouldingPage3 from './src/pages/MouldingPage3';
import MicroStructure from './src/pages/MicroStructure';
import Impact from './src/pages/Impact';

const ProtectedLayout = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <Guidelines />
      <Dashboard>
        <Outlet />
      </Dashboard>
    </>
  );
};

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

        {/* Protected */}
        <Route path="/" element={<ProtectedLayout />}>
          {/* Default dashboard page */}
          <Route index element={<MicroTensile />} />

          {/* Top-level pages */}
          <Route path="micro-textile" element={<MicroTensile />} />
          <Route path="qc-production-details" element={<QcProductionDetails />} />
          <Route path="micro-structure" element={<MicroStructure />} />
          <Route path="impact" element={<Impact />} />
          <Route path="process" element={<Process />} />

          {/* Melting */}
          <Route path="process/melting-parameters" element={<MeltingProcessParameter />} />
          <Route path="process/molding-parameters" element={<MoldingProcessParameter />} />

          {/* Textile */}
          <Route path="textile" element={<Tensile />} />

          {/* Sand Lab */}
          <Route path="sand-lab/page-1" element={<SandTestingRecord />} />
          <Route path="sand-lab/page-2" element={<FoundarySandTestingNote />} />

          {/* Moulding */}
          <Route path="moulding/page-1" element={<DisamaticProductReport />} />
          <Route path="moulding/page-2" element={<MouldHardnessPatternTemperatureRecord />} />
          <Route path="moulding/page-3" element={<MouldingPage3 />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;