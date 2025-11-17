import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './src/context/AuthContext';
import Sidebar from './src/Components/sidebar';
import Dashboard from './src/Components/Dashboard';
import DepartmentRouteGuard from './src/Components/DepartmentRouteGuard';

// Pages
import MicroTensile from './src/pages/MicroTensile/MicroTensile';
import MicroTensileReport from './src/pages/MicroTensile/MicroTensileReport';
import MicroStructure from './src/pages/Microstructure/MicroStructure';
import MicroStructureReport from './src/pages/Microstructure/MicroStructureReport';
import QcProductionDetails from './src/pages/QcProduction/QcProductionDetails';
import QcProductionDetailsReport from './src/pages/QcProduction/QcProductionDetailsReport';
import Process from './src/pages/Process/Process';
import ProcessReport from './src/pages/Process/ProcessReport';
import MeltingLogSheet from './src/pages/Melting/MeltingLogSheet';
import MeltingLogSheetReport from './src/pages/Melting/MeltingLogSheetReport';
import CupolaHolderLogSheet from './src/pages/Melting/CupolaHolderLogSheet';
import CupolaHolderLogSheetReport from './src/pages/Melting/CupolaHolderLogSheetReport';
import Login from './src/pages/Login';
import Tensile from './src/pages/Tensile/Tensile';
import TensileReport from './src/pages/Tensile/TensileReport';
import SandTestingRecord from './src/pages/SandLab/SandTestingRecord';
import SandTestingRecordReport from './src/pages/SandLab/SandTestingRecordReport';
import FoundarySandTestingNote from './src/pages/SandLab/FoundarySandTestingNote';
import FoundrySandTestingReport from './src/pages/SandLab/FoundrySandTestingReport';
import DisamaticProduct from './src/pages/Moulding/DisamaticProduct';
import DisamaticProductReport from './src/pages/Moulding/DisamaticProductReport';
import DmmSettingParameters from './src/pages/Moulding/DmmSettingParameters';
import DmmSettingParametersReport from './src/pages/Moulding/DmmSettingParametersReport';
import AdminDashboard from './src/Components/AdminDashboard';
import Impact from './src/pages/Impact/Impact';
import ImpactReport from './src/pages/Impact/ImpactReport';
import UserProfile from './src/Components/UserProfile';

/**
 * Component to redirect users to their department's default page
 */
const DepartmentRedirect = () => {
  const { user, isAdmin } = useContext(AuthContext);

  // If user is admin, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Map department to default route
  const departmentRouteMap = {
    'Tensile': '/tensile',
    'Impact': '/impact',
    'Micro Tensile': '/micro-tensile',
    'Micro Structure': '/micro-structure',
    'QC - production': '/qc-production-details',
    'Process': '/process',
    'Melting': '/melting/melting-log-sheet',
    'Moulding': '/moulding/disamatic-product',
    'Sand Lab': '/sand-lab/sand-testing-record',
    'All': '/micro-tensile' // Default for 'All' department
  };

  const userDepartment = user?.department;
  const defaultRoute = departmentRouteMap[userDepartment] || '/micro-tensile';

  return <Navigate to={defaultRoute} replace />;
};

const ProtectedLayout = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Sidebar />
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
          {/* Default dashboard page - Redirects based on user's department */}
          <Route index element={<DepartmentRedirect />} />

          {/* Top-level pages - Protected by DepartmentRouteGuard */}
          <Route path="micro-tensile" element={<DepartmentRouteGuard><MicroTensile /></DepartmentRouteGuard>} />
          <Route path="micro-tensile/report" element={<DepartmentRouteGuard><MicroTensileReport /></DepartmentRouteGuard>} />
          <Route path="micro-structure" element={<DepartmentRouteGuard><MicroStructure /></DepartmentRouteGuard>} />
          <Route path="micro-structure/report" element={<DepartmentRouteGuard><MicroStructureReport /></DepartmentRouteGuard>} />
          <Route path="impact" element={<DepartmentRouteGuard><Impact /></DepartmentRouteGuard>} />
          <Route path="impact/report" element={<DepartmentRouteGuard><ImpactReport /></DepartmentRouteGuard>} />
          <Route path="process" element={<DepartmentRouteGuard><Process /></DepartmentRouteGuard>} />
          <Route path="process/report" element={<DepartmentRouteGuard><ProcessReport /></DepartmentRouteGuard>} />

          {/* QC Production Details */}
          <Route path="qc-production-details" element={<DepartmentRouteGuard><QcProductionDetails /></DepartmentRouteGuard>} />
          <Route path="qc-production-details/report" element={<DepartmentRouteGuard><QcProductionDetailsReport /></DepartmentRouteGuard>} />

          {/* Melting */}
          <Route path="melting/melting-log-sheet" element={<DepartmentRouteGuard><MeltingLogSheet /></DepartmentRouteGuard>} />
          <Route path="melting/melting-log-sheet/report" element={<DepartmentRouteGuard><MeltingLogSheetReport /></DepartmentRouteGuard>} />
          <Route path="melting/cupola-holder-log-sheet" element={<DepartmentRouteGuard><CupolaHolderLogSheet /></DepartmentRouteGuard>} />
          <Route path="melting/cupola-holder-log-sheet/report" element={<DepartmentRouteGuard><CupolaHolderLogSheetReport /></DepartmentRouteGuard>} />

          {/* Tensile */}
          <Route path="tensile" element={<DepartmentRouteGuard><Tensile /></DepartmentRouteGuard>} />
          <Route path="tensile/report" element={<DepartmentRouteGuard><TensileReport /></DepartmentRouteGuard>} />

          {/* Sand Lab */}
          <Route path="sand-lab/sand-testing-record" element={<DepartmentRouteGuard><SandTestingRecord /></DepartmentRouteGuard>} />
          <Route path="sand-lab/sand-testing-record/report" element={<DepartmentRouteGuard><SandTestingRecordReport /></DepartmentRouteGuard>} />
          <Route path="sand-lab/foundry-sand-testing-note" element={<DepartmentRouteGuard><FoundarySandTestingNote /></DepartmentRouteGuard>} />
          <Route path="sand-lab/foundry-sand-testing-note/report" element={<DepartmentRouteGuard><FoundrySandTestingReport /></DepartmentRouteGuard>} />

          {/* Moulding */}
          <Route path="moulding/disamatic-product" element={<DepartmentRouteGuard><DisamaticProduct /></DepartmentRouteGuard>} />
          <Route path="moulding/disamatic-product/report" element={<DepartmentRouteGuard><DisamaticProductReport /></DepartmentRouteGuard>} />
          <Route path="moulding/dmm-setting-parameters" element={<DepartmentRouteGuard><DmmSettingParameters /></DepartmentRouteGuard>} />
          <Route path="moulding/dmm-setting-parameters/report" element={<DepartmentRouteGuard><DmmSettingParametersReport /></DepartmentRouteGuard>} />

          {/* User Profile */}
          <Route path="user-profile" element={<UserProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;