import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/PageStyles/Login.css";

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useContext(AuthContext);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Registration state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      // Append @gmail.com if not already present
      const fullEmail = loginEmail.includes('@') ? loginEmail : `${loginEmail}@gmail.com`;
      await login(fullEmail, loginPassword);
      // AuthContext will set user/token; router in app.jsx will redirect
    } catch (err) {
      setLoginError(err?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }
    try {
      setRegLoading(true);
      // Append @gmail.com if not already present
      const fullEmail = regEmail.includes('@') ? regEmail : `${regEmail}@gmail.com`;
      await register(regName, fullEmail, regPassword, regPhone);
      // Reset form after successful registration
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirm('');
      setActiveTab('login');
      alert('Registration successful! Please log in with your credentials.');
    } catch (err) {
      setRegError(err?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  
  return (
    <div
      className="login-container"
      style={{ backgroundImage: "url('/images/factory-bg.png')" }}
    >
      {/* Left side - Company Logo */}
      <div className="login-left">
        <img
          src="/images/sakthiautologo.png"
          alt="Sakthi Auto Logo"
          className="company-logo"
        />
      </div>

      {/* Right side - Login/Register */}
      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>

          <div className="tabs">
            <button 
              className={activeTab === 'login' ? 'active' : ''}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={activeTab === 'register' ? 'active' : ''}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Email" 
                  required 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ flex: 1 }}
                />
                <div 
                  style={{
                    padding: '12px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f8f9fa',
                    minWidth: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontWeight: '500'
                  }}
                >
                  @gmail.com
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showLoginPassword ? "text" : "password"} 
                  placeholder="Password" 
                  required 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <span 
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    cursor: 'pointer',
                    fontSize: '18px',
                    userSelect: 'none'
                  }}
                  onMouseDown={() => setShowLoginPassword(true)}
                  onMouseUp={() => setShowLoginPassword(false)}
                  onMouseLeave={() => setShowLoginPassword(false)}
                >
                  {showLoginPassword ? '👁️‍🗨️' : '👁️‍🗨️'}
                </span>
              </div>
              {loginError && (
                <div className="form-error" style={{ textAlign: 'left' }}>{loginError}</div>
              )}
              <button type="submit" className="login-btn" disabled={loginLoading}>
                {loginLoading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          )}


          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={regName} 
                onChange={(e) => setRegName(e.target.value)} 
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Email" 
                  required 
                  value={regEmail} 
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ flex: 1 }}
                />
                <div 
                  style={{
                    padding: '12px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f8f9fa',
                    minWidth: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontWeight: '500'
                  }}
                >
                  @gmail.com
                </div>
              </div>
              
              <input 
                type="tel" 
                placeholder="Phone Number (Optional)" 
                value={regPhone} 
                onChange={(e) => setRegPhone(e.target.value)}
              />
              
              <div style={{ position: 'relative' }}>
                <input 
                  type={showRegPassword ? "text" : "password"} 
                  placeholder="Password" 
                  required 
                  value={regPassword} 
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <span 
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    cursor: 'pointer',
                    fontSize: '18px',
                    userSelect: 'none'
                  }}
                  onMouseDown={() => setShowRegPassword(true)}
                  onMouseUp={() => setShowRegPassword(false)}
                  onMouseLeave={() => setShowRegPassword(false)}
                >
                  {showRegPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
              
              <div style={{ position: 'relative' }}>
                <input 
                  type={showRegConfirm ? "text" : "password"} 
                  placeholder="Confirm Password" 
                  required 
                  value={regConfirm} 
                  onChange={(e) => setRegConfirm(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <span 
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    cursor: 'pointer',
                    fontSize: '18px',
                    userSelect: 'none'
                  }}
                  onMouseDown={() => setShowRegConfirm(true)}
                  onMouseUp={() => setShowRegConfirm(false)}
                  onMouseLeave={() => setShowRegConfirm(false)}
                >
                  {showRegConfirm ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
              
              {regError && (
                <div className="form-error" style={{ textAlign: 'left' }}>{regError}</div>
              )}
              <button type="submit" className="login-btn" disabled={regLoading}>
                {regLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;