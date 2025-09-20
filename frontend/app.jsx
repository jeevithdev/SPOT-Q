import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './src/context/AuthContext';
import Login from './src/pages/Login';
import Dashboard from './src/Components/Dashboard';
import Loader from './src/Components/Loader';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  // Show loading screen while checking authentication
  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
