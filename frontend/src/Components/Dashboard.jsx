import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/ComponentStyles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1 className="nav-title">Dashboard</h1>
          <div className="nav-actions">
            <span className="user-greeting">Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">User Profile</h2>
              </div>
              <div className="user-info">
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Provider:</strong> {user?.provider}</p>
                  <p><strong>Verified:</strong> {user?.isVerified ? '✅ Yes' : '❌ No'}</p>
                  {user?.lastLogin && (
                    <p><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Quick Stats</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Active Sessions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{user?.provider === 'local' ? 'Email' : 'Social'}</div>
                  <div className="stat-label">Login Method</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{user?.role || 'User'}</div>
                  <div className="stat-label">Role</div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Activity</h2>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🔑</div>
                  <div className="activity-content">
                    <p><strong>Successful Login</strong></p>
                    <small>{new Date().toLocaleString()}</small>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p><strong>Profile Viewed</strong></p>
                    <small>{new Date().toLocaleString()}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      
    </div>
  );
};

export default Dashboard;