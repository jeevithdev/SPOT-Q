// frontend/src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/PageStyles/Login.css"; // correct path based on your structure

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showForgot, setShowForgot] = useState(false);
  const { login, sendPhoneOtp, verifyPhoneOtp, registerWithPhone } = useContext(AuthContext);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotStep, setForgotStep] = useState('form'); // form | otp | reset
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  // Register with phone state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regStep, setRegStep] = useState('form'); // form | otp
  const [otp, setOtp] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  
  // Phone number state (country code fixed as +91)
  const [phoneNumber, setPhoneNumber] = useState('');

  const startPhoneRegistration = async (e) => {
    e.preventDefault();
    setRegError("");
    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match');
      return;
    }
    if (!phoneNumber.trim()) {
      setRegError('Phone number is required');
      return;
    }
    try {
      setRegLoading(true);
      const fullPhoneNumber = '+91' + phoneNumber;
      
      // Ensure reCAPTCHA container exists
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.marginTop = '8px';
        container.style.minHeight = '40px';
        // Insert after the form
        const form = e.target;
        form.appendChild(container);
      }
      
      await sendPhoneOtp(fullPhoneNumber, 'recaptcha-container');
      setRegStep('otp');
    } catch (err) {
      setRegError(err?.message || 'Failed to send OTP');
    } finally {
      setRegLoading(false);
    }
  };

  const submitOtpAndRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    try {
      setRegLoading(true);
      const { idToken } = await verifyPhoneOtp(otp);
      const fullPhoneNumber = '+91' + phoneNumber;
      // Append @gmail.com if not already present
      const fullEmail = regEmail.includes('@') ? regEmail : `${regEmail}@gmail.com`;
      await registerWithPhone({ name: regName, email: fullEmail, password: regPassword, phone: fullPhoneNumber, idToken });
      // Reset form and redirect to login
      setRegStep('form');
      setRegName('');
      setRegEmail('');
      setPhoneNumber('');
      setRegPassword('');
      setRegConfirm('');
      setOtp('');
      setActiveTab('login');
      alert('Registration successful! Please login with your credentials.');
    } catch (err) {
      setRegError(err?.message || 'Phone registration failed');
    } finally {
      setRegLoading(false);
    }
  };

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

  // Forgot password functions
  const startForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotEmail.trim() || !forgotPhone.trim()) {
      setForgotError('Both email and phone number are required');
      return;
    }
    try {
      setForgotLoading(true);
      const fullPhoneNumber = '+91' + forgotPhone;
      // Append @gmail.com if not already present
      const fullEmail = forgotEmail.includes('@') ? forgotEmail : `${forgotEmail}@gmail.com`;
      
      // First verify email and phone in database
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/verify-forgot-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({ email: fullEmail, phone: fullPhoneNumber })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or phone number');
      }
      
      // Ensure reCAPTCHA container exists for forgot password
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.marginTop = '8px';
        container.style.minHeight = '40px';
        // Insert after the form
        const form = e.target;
        form.appendChild(container);
      }
      
      // If verification successful, send Firebase OTP
      await sendPhoneOtp(fullPhoneNumber, 'recaptcha-container');
      setForgotStep('otp');
    } catch (err) {
      setForgotError(err?.message || 'Failed to verify credentials');
    } finally {
      setForgotLoading(false);
    }
  };

  const verifyForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError("");
    try {
      setForgotLoading(true);
      const { idToken } = await verifyPhoneOtp(forgotOtp);
      
      // Append @gmail.com if not already present
      const fullEmail = forgotEmail.includes('@') ? forgotEmail : `${forgotEmail}@gmail.com`;
      
      // Verify Firebase token with backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/verify-forgot-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({ email: fullEmail, idToken })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }
      
      setForgotStep('reset');
    } catch (err) {
      setForgotError(err?.message || 'OTP verification failed');
    } finally {
      setForgotLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('Password must be at least 6 characters');
      return;
    }
    try {
      setForgotLoading(true);
      
      // Append @gmail.com if not already present
      const fullEmail = forgotEmail.includes('@') ? forgotEmail : `${forgotEmail}@gmail.com`;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/reset-password-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({ 
          email: fullEmail, 
          newPassword: forgotNewPassword
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }
      
      // Reset form and show success
      setForgotStep('form');
      setForgotEmail('');
      setForgotPhone('');
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setShowForgot(false);
      alert('Password reset successful! Please login with your new password.');
    } catch (err) {
      setForgotError(err?.message || 'Password reset failed');
    } finally {
      setForgotLoading(false);
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

          <div className="login-methods">
            
            
          </div>

          {activeTab === 'login' && !showForgot && (
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

          {activeTab === 'login' && showForgot && forgotStep === 'form' && (
            <form onSubmit={startForgotPassword}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Reset Password</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Email" 
                  required 
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
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
              <div style={{ display: 'flex', gap: '8px' }}>
                <div 
                  style={{
                    padding: '12px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f8f9fa',
                    minWidth: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontWeight: '500'
                  }}
                >
                  🇮🇳 +91
                </div>
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  required 
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              {forgotError && (
                <div className="form-error" style={{ textAlign: 'left' }}>{forgotError}</div>
              )}
              <button type="submit" className="login-btn" disabled={forgotLoading}>
                {forgotLoading ? 'Verifying...' : 'Verify & Send OTP'}
              </button>
              <button 
                type="button" 
                className="login-btn" 
                style={{ marginTop: '10px', background: '#eee', color: '#333' }}
                onClick={() => {
                  setShowForgot(false);
                  setForgotStep('form');
                  setForgotError('');
                }}
              >
                Back to Login
              </button>
              <div id="recaptcha-container" style={{ marginTop: '8px' }}></div>
            </form>
          )}

          {activeTab === 'login' && showForgot && forgotStep === 'otp' && (
            <form onSubmit={verifyForgotOtp}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Verify OTP</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                We've sent an OTP to +91{forgotPhone}
              </p>
              <input 
                type="text" 
                placeholder="Enter OTP" 
                required 
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
              />
              {forgotError && (
                <div className="form-error" style={{ textAlign: 'left' }}>{forgotError}</div>
              )}
              <button type="submit" className="login-btn" disabled={forgotLoading}>
                {forgotLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button 
                type="button" 
                className="login-btn" 
                style={{ marginTop: '10px', background: '#eee', color: '#333' }}
                onClick={() => {
                  setForgotStep('form');
                  setForgotError('');
                }}
              >
                Back
              </button>
            </form>
          )}

          {activeTab === 'login' && showForgot && forgotStep === 'reset' && (
            <form onSubmit={resetPassword}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Set New Password</h3>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  placeholder="New Password" 
                  required 
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  required 
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
              </div>
              {forgotError && (
                <div className="form-error" style={{ textAlign: 'left' }}>{forgotError}</div>
              )}
              <button type="submit" className="login-btn" disabled={forgotLoading}>
                {forgotLoading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button 
                type="button" 
                className="login-btn" 
                style={{ marginTop: '10px', background: '#eee', color: '#333' }}
                onClick={() => {
                  setForgotStep('otp');
                  setForgotError('');
                }}
              >
                Back
              </button>
            </form>
          )}

          {activeTab === 'register' && regStep === 'form' && (
            <form onSubmit={startPhoneRegistration}>
              <input type="text" placeholder="Full Name" required value={regName} onChange={(e)=>setRegName(e.target.value)} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Email" 
                  required 
                  value={regEmail} 
                  onChange={(e)=>setRegEmail(e.target.value)}
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
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <div 
                  style={{
                    padding: '12px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f8f9fa',
                    minWidth: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontWeight: '500'
                  }}
                >
                  🇮🇳 +91
                </div>
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  required 
                  value={phoneNumber} 
                  onChange={(e)=>setPhoneNumber(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              
              <div style={{ position: 'relative' }}>
                <input 
                  type={showRegPassword ? "text" : "password"} 
                  placeholder="Password" 
                  required 
                  value={regPassword} 
                  onChange={(e)=>setRegPassword(e.target.value)}
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
                  onChange={(e)=>setRegConfirm(e.target.value)}
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
              
              {regError && (<div className="form-error" style={{ textAlign:'left' }}>{regError}</div>)}
              <button type="submit" className="login-btn" disabled={regLoading}>
                {regLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
              <div id="recaptcha-container" style={{ marginTop: '8px' }}></div>
            </form>
          )}

          {activeTab === 'register' && regStep === 'otp' && (
            <form onSubmit={submitOtpAndRegister}>
              <input type="text" placeholder="Enter OTP" required value={otp} onChange={(e)=>setOtp(e.target.value)} />
              {regError && (<div className="form-error" style={{ textAlign:'left' }}>{regError}</div>)}
              <button type="submit" className="login-btn" disabled={regLoading}>
                {regLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            </form>
          )}

          {activeTab === 'login' && !showForgot && (
            <a 
              href="#" 
              className="forgot"
              onClick={(e) => { e.preventDefault(); setShowForgot(true); }}
            >
              Forgot Password?
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
