import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './src/context/AuthContext';
import { Navbar } from './src/Components/Navbar';
import Dashboard from './src/Components/Dashboard';
import Loader from './src/Components/Loader';

// Pages
import Items from './src/pages/Items';
import SpectroAnalysis from './src/pages/SpectroAnalysis';
import ProcessControl from './src/pages/ProcessControl';
import OverallReports from './src/pages/OverallReports';
import MechanicalProperties from './src/pages/MechanicalProperties';
import MetallographyProperties from './src/pages/MetallographyProperties';
import MeltingProcessParameter from './src/pages/MeltingProcessParameter';
import MoldingProcessParameter from './src/pages/MoldingProcessParameter';
import SandplantProcessParameter from './src/pages/SandplantProcessParameter';
import RejectionReportFound from './src/pages/RejectionReportFound';
import RejectionReportMachine from './src/pages/RejectionReportMachine';
import Login from './src/pages/Login';
import AnalyticsPage from './src/pages/AnalyticsPage';

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
          <Route index element={<Items />} />

          {/* Top-level pages */}
          <Route path="items" element={<Items />} />
          <Route path="spectro-analysis" element={<SpectroAnalysis />} />
          <Route path="process-control" element={<ProcessControl />} />
          <Route path="overall-reports" element={<OverallReports />} />

          {/* Production */}
          <Route path="production/mechanical-properties" element={<MechanicalProperties />} />
          <Route path="production/metallography-properties" element={<MetallographyProperties />} />

          {/* Process */}
          <Route path="process/melting-parameters" element={<MeltingProcessParameter />} />
          <Route path="process/molding-parameters" element={<MoldingProcessParameter />} />
          <Route path="process/sandplant-parameters" element={<SandplantProcessParameter />} />

          {/* Rejection */}
          <Route path="rejection/report-founded" element={<RejectionReportFound />} />
          <Route path="rejection/report-machine" element={<RejectionReportMachine />} />

          {/* Analytics */}
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;