import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { handleLogout, AdminLogoutButton, SettingsButton, DeleteButton, EyeButton } from './Buttons';
import { IoMdPersonAdd } from "react-icons/io";
import { HiUsers } from "react-icons/hi";
import { MdRefresh } from "react-icons/md";
import '../styles/PageStyles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // View mode: 'add' or 'view'
  const [currentView, setCurrentView] = useState('add');

  // Department filter state
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  
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
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  // Change user password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Change admin password state
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordData, setAdminPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [adminPasswordLoading, setAdminPasswordLoading] = useState(false);
  const [showAdminCurrentPassword, setShowAdminCurrentPassword] = useState(false);
  const [showAdminNewPassword, setShowAdminNewPassword] = useState(false);
  const [showAdminConfirmPassword, setShowAdminConfirmPassword] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch departments on mount
  useEffect(() => {
    if (isAdmin) {
      fetchDepartments();
    }
  }, [isAdmin]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/auth/admin/departments');
      if (response.success) {
        setDepartments(response.data);
        // Leave department as empty string so user must select
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

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'view' && users.length === 0) {
      fetchUsers();
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
          department: ''
        });
        setShowCreatePassword(false);
        // Refresh user list if we're on the view page
        if (currentView === 'view') {
          fetchUsers();
        }

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
    setShowNewPassword(false);
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
    setShowAdminCurrentPassword(false);
    setShowAdminNewPassword(false);
    setShowAdminConfirmPassword(false);
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

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <div className="admin-header-bar">
        <div className="admin-logo">
          <img src="/images/sakthiautologo.png" alt="Sakthi Auto" />
        </div>
        <div className="admin-user-info">
          <SettingsButton onClick={handleOpenAdminPasswordModal} />
          <AdminLogoutButton onClick={handleLogout} />
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-dashboard-container">
        <h1 className="admin-dashboard-title">👤 Employee Management</h1>

        {/* View Toggle Navigation */}
        <div className="view-toggle-nav">
          <button
            className={`nav-btn ${currentView === 'add' ? 'active' : ''}`}
            onClick={() => handleViewChange('add')}
          >
            <IoMdPersonAdd className="nav-icon" />
            <span className="nav-text">Add Employee</span>
          </button>
          <button
            className={`nav-btn ${currentView === 'view' ? 'active' : ''}`}
            onClick={() => handleViewChange('view')}
          >
            <HiUsers className="nav-icon" />
            <span className="nav-text">View Employees</span>
          </button>
        </div>

        {/* Add Employee View */}
        {currentView === 'add' && (
        <div className="add-employee-card">
        <h2><IoMdPersonAdd style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Add New Employee</h2>
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-field">
              <label>Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="EMP001"
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
              <div style={{ position: 'relative' }}>
                <input
                  type={showCreatePassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 6 characters"
                  required
                  minLength="6"
                  disabled={formLoading}
                  style={{ paddingRight: '50px', width: '100%' }}
                />
                <div 
                  style={{ 
                    position: 'absolute', 
                    right: '5px', 
                    top: '50%', 
                    transform: 'translateY(-50%)'
                  }}
                >
                  <EyeButton 
                    isVisible={showCreatePassword}
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                  />
                </div>
              </div>
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
                <option value="">-- Select Department --</option>
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
            {formLoading ? '⏳ Creating...' : 'Create Employee'}
          </button>
        </form>
      </div>
        )}

      {/* View Employee List */}
      {currentView === 'view' && (
        <div className="employee-list-card">
          <div className="employee-list-header">
            <div className="header-title-section">
              <h2><HiUsers style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Employee List</h2>
              <span className="employee-count">
                ({selectedDepartment === 'All' ? users.length : users.filter(u => u.department === selectedDepartment).length} employees)
              </span>
            </div>

            {/* Department Filter */}
            <div className="department-filter">
              <label htmlFor="dept-filter">Filter by Department:</label>
              <select
                id="dept-filter"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <button
                className="refresh-btn"
                onClick={fetchUsers}
                title="Refresh employee list"
              >
                <MdRefresh />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">Loading employees...</div>
          ) : users.filter(u => selectedDepartment === 'All' || u.department === selectedDepartment).length > 0 ? (
            <div className="table-wrapper">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => selectedDepartment === 'All' || u.department === selectedDepartment).map((u) => (
                    <tr key={u._id}>
                      <td className="emp-id">{u.employeeId}</td>
                      <td>{u.name}</td>
                      <td>
                        <span className="badge badge-dept">
                          {u.department}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${u.role}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="last-login">
                        {u.lastLogin ? (
                          <span className="login-datetime">
                            {new Date(u.lastLogin).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit'
                            })}
                            {' - '}
                            {new Date(u.lastLogin).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            }).toLowerCase()}
                          </span>
                        ) : (
                          <span className="no-login">Never</span>
                        )}
                      </td>
                      <td className="actions">
                        {u.role !== 'admin' && (
                          <>
                            <SettingsButton onClick={() => handleOpenPasswordModal(u)} />
                            <DeleteButton onClick={() => handleDelete(u._id, u.employeeId)} />
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
              {selectedDepartment === 'All'
                ? 'No employees found. Create your first employee above!'
                : `No employees found in ${selectedDepartment} department.`}
            </div>
          )}
        </div>
      )}
      </div>

      {/* Change User Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3> Change Password for {selectedUser.employeeId}</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <form onSubmit={handleChangeUserPassword} className="modal-form">
              <div className="form-group-modal">
                <label>New Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    minLength="6"
                    disabled={passwordLoading}
                    autoFocus
                    style={{ paddingRight: '50px' }}
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      right: '5px', 
                      top: '50%', 
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <EyeButton 
                      isVisible={showNewPassword}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  </div>
                </div>
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
              <h3>Change My Password</h3>
              <button className="modal-close" onClick={() => setShowAdminPasswordModal(false)}>×</button>
            </div>
            <form onSubmit={handleChangeAdminPassword} className="modal-form">
              <div className="form-group-modal">
                <label>Current Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showAdminCurrentPassword ? "text" : "password"}
                    value={adminPasswordData.currentPassword}
                    onChange={(e) => setAdminPasswordData({...adminPasswordData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                    required
                    disabled={adminPasswordLoading}
                    autoFocus
                    style={{ paddingRight: '50px' }}
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      right: '5px', 
                      top: '50%', 
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <EyeButton 
                      isVisible={showAdminCurrentPassword}
                      onClick={() => setShowAdminCurrentPassword(!showAdminCurrentPassword)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group-modal">
                <label>New Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showAdminNewPassword ? "text" : "password"}
                    value={adminPasswordData.newPassword}
                    onChange={(e) => setAdminPasswordData({...adminPasswordData, newPassword: e.target.value})}
                    placeholder="Minimum 6 characters"
                    required
                    minLength="6"
                    disabled={adminPasswordLoading}
                    style={{ paddingRight: '50px' }}
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      right: '5px', 
                      top: '50%', 
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <EyeButton 
                      isVisible={showAdminNewPassword}
                      onClick={() => setShowAdminNewPassword(!showAdminNewPassword)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group-modal">
                <label>Confirm New Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showAdminConfirmPassword ? "text" : "password"}
                    value={adminPasswordData.confirmPassword}
                    onChange={(e) => setAdminPasswordData({...adminPasswordData, confirmPassword: e.target.value})}
                    placeholder="Re-enter new password"
                    required
                    minLength="6"
                    disabled={adminPasswordLoading}
                    style={{ paddingRight: '50px' }}
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      right: '5px', 
                      top: '50%', 
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <EyeButton 
                      isVisible={showAdminConfirmPassword}
                      onClick={() => setShowAdminConfirmPassword(!showAdminConfirmPassword)}
                    />
                  </div>
                </div>
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
