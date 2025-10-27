import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/PageStyles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form state for adding employee
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    password: '',
    department: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  // Change user password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Change admin password state
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordData, setAdminPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [adminPasswordLoading, setAdminPasswordLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      alert('Access denied. Admin privileges required.');
      navigate('/items');
    }
  }, [isAdmin, navigate]);

  // Fetch departments on mount
  useEffect(() => {
    if (isAdmin) {
      fetchDepartments();
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/auth/admin/departments');
      if (response.success) {
        setDepartments(response.data);
        // Set first non-Admin department as default
        const defaultDept = response.data.find(d => d !== 'Admin') || response.data[0];
        setFormData(prev => ({ ...prev, department: defaultDept }));
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/admin/users');
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employeeId' ? value.toUpperCase() : value
    }));
    // Clear errors when user types
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validation
    if (!formData.employeeId || !formData.name || !formData.password || !formData.department) {
      setFormError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      setFormLoading(true);
      const response = await api.post('/auth/admin/users', formData);
      
      if (response.success) {
        setFormSuccess(`✅ Employee ${formData.employeeId} created successfully!`);
        // Reset form
        setFormData({
          employeeId: '',
          name: '',
          password: '',
          department: departments.find(d => d !== 'Admin') || departments[0]
        });
        // Refresh user list
        fetchUsers();
        
        // Clear success message after 5 seconds
        setTimeout(() => setFormSuccess(''), 5000);
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      setFormError(error.message || 'Failed to create employee');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId, employeeId) => {
    if (!confirm(`Are you sure you want to DELETE employee ${employeeId}?`)) {
      return;
    }

    try {
      const response = await api.delete(`/auth/admin/users/${userId}`);
      
      if (response.success) {
        alert('Employee deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete employee: ' + error.message);
    }
  };

  // Open change password modal for user
  const handleOpenPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setPasswordError('');
    setShowPasswordModal(true);
  };

  // Change user password (admin reset)
  const handleChangeUserPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await api.put(`/auth/admin/users/${selectedUser._id}`, {
        password: newPassword
      });
      
      if (response.success) {
        alert(`Password changed successfully for ${selectedUser.employeeId}`);
        setShowPasswordModal(false);
        setNewPassword('');
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Open admin password change modal
  const handleOpenAdminPasswordModal = () => {
    setAdminPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setAdminPasswordError('');
    setShowAdminPasswordModal(true);
  };

  // Change admin's own password
  const handleChangeAdminPassword = async (e) => {
    e.preventDefault();
    setAdminPasswordError('');

    // Validation
    if (!adminPasswordData.currentPassword || !adminPasswordData.newPassword || !adminPasswordData.confirmPassword) {
      setAdminPasswordError('All fields are required');
      return;
    }

    if (adminPasswordData.newPassword.length < 6) {
      setAdminPasswordError('New password must be at least 6 characters');
      return;
    }

    if (adminPasswordData.newPassword !== adminPasswordData.confirmPassword) {
      setAdminPasswordError('New passwords do not match');
      return;
    }

    try {
      setAdminPasswordLoading(true);
      const response = await api.put('/auth/changepassword', {
        currentPassword: adminPasswordData.currentPassword,
        newPassword: adminPasswordData.newPassword
      });
      
      if (response.success) {
        alert('Your password has been changed successfully!');
        setShowAdminPasswordModal(false);
        setAdminPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error changing admin password:', error);
      setAdminPasswordError(error.message || 'Failed to change password');
    } finally {
      setAdminPasswordLoading(false);
    }
  };

  const { logout } = useContext(AuthContext);

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <div className="admin-header-bar">
        <div className="admin-logo">
          <img src="/images/sakthiautologo.png" alt="Sakthi Auto" />
          <span>SPOT-Q Admin</span>
        </div>
        <div className="admin-user-info">
          <span className="admin-welcome">Welcome, {user?.name}</span>
          <button className="admin-change-password-btn" onClick={handleOpenAdminPasswordModal}>
            🔑 Change My Password
          </button>
          <button className="admin-logout-btn" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-dashboard-container">
        <h1 style={{ marginBottom: '30px', fontSize: '28px', color: '#1F2937' }}>
          👤 Admin Dashboard
        </h1>

      {/* Add Employee Form */}
      <div className="add-employee-card">
        <h2>➕ Add New Employee</h2>
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-field">
              <label>Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="e.g., EMP001"
                required
                disabled={formLoading}
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            <div className="form-field">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Employee name"
                required
                disabled={formLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 6 characters"
                required
                minLength="6"
                disabled={formLoading}
              />
            </div>

            <div className="form-field">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                disabled={formLoading}
              >
                {departments.filter(d => d !== 'Admin').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {formError && (
            <div className="alert alert-error">
              ❌ {formError}
            </div>
          )}

          {formSuccess && (
            <div className="alert alert-success">
              {formSuccess}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-submit"
            disabled={formLoading}
          >
            {formLoading ? '⏳ Creating...' : '✅ Create Employee'}
          </button>
        </form>
      </div>

      {/* Employee List */}
      <div className="employee-list-card">
        <h2>📋 Employee List ({users.length})</h2>
        
        {loading ? (
          <div className="loading-state">Loading employees...</div>
        ) : users.length > 0 ? (
          <div className="table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="emp-id">{u.employeeId}</td>
                    <td>{u.name}</td>
                    <td>
                      <span className="badge badge-dept">{u.department}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${u.role}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="actions">
                      {u.role !== 'admin' && (
                        <>
                          <button 
                            className="btn-action btn-password" 
                            onClick={() => handleOpenPasswordModal(u)}
                            title="Change Password"
                          >
                            🔑
                          </button>
                          <button 
                            className="btn-action btn-delete" 
                            onClick={() => handleDelete(u._id, u.employeeId)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            No employees found. Create your first employee above!
          </div>
        )}
      </div>
      </div>

      {/* Change User Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔑 Change Password for {selectedUser.employeeId}</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <form onSubmit={handleChangeUserPassword} className="modal-form">
              <div className="form-group-modal">
                <label>New Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength="6"
                  disabled={passwordLoading}
                  autoFocus
                />
              </div>

              {passwordError && (
                <div className="alert alert-error">
                  {passwordError}
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit-modal"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Admin Password Modal */}
      {showAdminPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowAdminPasswordModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔑 Change My Password</h3>
              <button className="modal-close" onClick={() => setShowAdminPasswordModal(false)}>×</button>
            </div>
            <form onSubmit={handleChangeAdminPassword} className="modal-form">
              <div className="form-group-modal">
                <label>Current Password *</label>
                <input
                  type="password"
                  value={adminPasswordData.currentPassword}
                  onChange={(e) => setAdminPasswordData({...adminPasswordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                  required
                  disabled={adminPasswordLoading}
                  autoFocus
                />
              </div>

              <div className="form-group-modal">
                <label>New Password *</label>
                <input
                  type="password"
                  value={adminPasswordData.newPassword}
                  onChange={(e) => setAdminPasswordData({...adminPasswordData, newPassword: e.target.value})}
                  placeholder="Minimum 6 characters"
                  required
                  minLength="6"
                  disabled={adminPasswordLoading}
                />
              </div>

              <div className="form-group-modal">
                <label>Confirm New Password *</label>
                <input
                  type="password"
                  value={adminPasswordData.confirmPassword}
                  onChange={(e) => setAdminPasswordData({...adminPasswordData, confirmPassword: e.target.value})}
                  placeholder="Re-enter new password"
                  required
                  minLength="6"
                  disabled={adminPasswordLoading}
                />
              </div>

              {adminPasswordError && (
                <div className="alert alert-error">
                  {adminPasswordError}
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setShowAdminPasswordModal(false)}
                  disabled={adminPasswordLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit-modal"
                  disabled={adminPasswordLoading}
                >
                  {adminPasswordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
