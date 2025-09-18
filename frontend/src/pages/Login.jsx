import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/PageStyles/Login.css';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../config/firebase';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [usePhone, setUsePhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isRegisterPhoneFlow, setIsRegisterPhoneFlow] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [isForgotPhoneFlow, setIsForgotPhoneFlow] = useState(false);
  const [pendingForgotEmail, setPendingForgotEmail] = useState('');
  const recaptchaRef = useRef(null);

  const { login, register, forgotPassword, verifyOtp } = useContext(AuthContext);

	// Use same API base style as AuthContext for consistency across environments
	const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
	const API_URL = (env.VITE_API_URL ? `${env.VITE_API_URL}/auth` : '/api/auth');

  useEffect(() => {
    if (!recaptchaRef.current) {
      try {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      } catch (_e) {}
    }
  }, []);

  const ensureRecaptcha = () => {
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      }
      return true;
    } catch (_e) {
      // If the widget was removed or not found, try to recreate
      try {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
        return true;
      } catch (_e2) {
        return false;
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        if (usePhone) {
          if (!phoneNumber) throw new Error('Enter phone with country code, e.g., +919123456789');
          if (!ensureRecaptcha()) throw new Error('Failed to initialize reCAPTCHA');
          try {
            const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaRef.current);
            setConfirmationResult(result);
            setShowOtpModal(true);
            setMessage('SMS sent. Enter the code to continue');
          } catch (err) {
            const msg = String(err?.code || err?.message || 'Phone sign-in unavailable');
            if (msg.includes('billing') || msg.includes('operation-not-allowed') || msg.includes('admin-restricted')) {
              setMessage('Phone sign-in is not available in this environment. Please use Email/Password.');
            } else {
              setMessage(err.message || 'Failed to start phone sign-in');
            }
            return;
          }
        } else {
          await login(formData.email, formData.password);
          setMessage('Login successful!');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          setLoading(false);
          return;
        }
        if (!formData.phone) {
          setMessage('Phone number is required for SMS verification');
          setLoading(false);
          return;
        }
        if (!ensureRecaptcha()) {
          setMessage('Failed to initialize reCAPTCHA');
          setLoading(false);
          return;
        }
        try {
          const result = await signInWithPhoneNumber(auth, formData.phone, recaptchaRef.current);
          setConfirmationResult(result);
          setIsRegisterPhoneFlow(true);
          setPendingRegistration({ name: formData.name, email: formData.email, password: formData.password });
          setShowOtpModal(true);
          setMessage('SMS sent. Enter the code to verify your phone');
        } catch (err) {
          setMessage(err?.message || 'Could not start phone verification');
        }
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (confirmationResult) {
        const cred = await confirmationResult.confirm(smsCode);
        const idToken = await cred.user.getIdToken();
        if (isRegisterPhoneFlow && pendingRegistration) {
          // Complete registration with verified phone
					const response = await fetch(`${API_URL}/register-with-phone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...pendingRegistration, idToken })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }
          setShowOtpModal(false);
          setIsRegisterPhoneFlow(false);
          setPendingRegistration(null);
          setIsLogin(true);
          setMessage('Successfully registered. Please log in with Email/Password or SMS OTP.');
				} else if (isForgotPhoneFlow && pendingForgotEmail) {
					const response = await fetch(`${API_URL}/forgot-password-phone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: pendingForgotEmail, idToken })
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Failed to send reset email');
          setShowOtpModal(false);
          setMessage('If an account exists, a reset email was sent.');
        } else {
          // Login with verified phone
					const response = await fetch(`${API_URL}/firebase-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Phone auth failed');
          localStorage.setItem('token', data.token);
          window.location.reload();
        }
      } else {
        const res = await verifyOtp(otpEmail, otpCode);
        if (res?.success) {
          setShowOtpModal(false);
          setIsLogin(true);
          setMessage('Successfully registered. Please log in with Email/Password or SMS OTP.');
        }
      }
    } catch (error) {
      setMessage(error.message || 'OTP verification failed');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!phoneNumber) throw new Error('Enter phone with country code to verify ownership');
      if (!ensureRecaptcha()) throw new Error('Failed to initialize reCAPTCHA');
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaRef.current);
      setConfirmationResult(result);
      setIsForgotPhoneFlow(true);
      setPendingForgotEmail(resetEmail);
      setShowOtpModal(true);
      setMessage('SMS sent. Enter the code to continue');
    } catch (error) {
      setMessage(error.message || 'Failed to start phone verification');
    }
    setLoading(false);
  };

  // Google login removed

  if (showForgotPassword) {
    return (
      <div className="login-container">
        <div className="background-div">
          {/* Background image will be added here later */}
        </div>
        <div className="login-card">
          <h2>Reset Password</h2>
          <form onSubmit={handleForgotPassword}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone e.g. +919123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="primary-btn">
              {loading ? 'Sending...' : 'Verify Phone & Send Reset Email'}
            </button>
          </form>
          <button 
            onClick={() => setShowForgotPassword(false)} 
            className="link-btn"
          >
            Back to Login
          </button>
          {message && <div className="message">{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="background-div">
        {/* Background image will be added here later */}
      </div>
      <div className="login-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isLogin && (
            <div className="input-group" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className={`tab-btn ${!usePhone ? 'active' : ''}`} onClick={() => setUsePhone(false)}>
                  Email/Password
                </button>
                <button type="button" className={`tab-btn ${usePhone ? 'active' : ''}`} onClick={() => setUsePhone(true)}>
                  Phone (SMS OTP)
                </button>
              </div>
            </div>
          )}

          {isLogin && usePhone ? (
            <>
              <div className="input-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +919123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              {!isLogin && (
                <div className="input-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              {!isLogin && (
                <div className="input-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone e.g. +919123456789"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Google login removed */}
              
              {!isLogin && (
                <div className="input-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
            </>
          )}
          
          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? 'Loading...' : (isLogin ? (usePhone ? 'Send SMS Code' : 'Login') : 'Register')}
          </button>
        </form>

        {isLogin && (
          <button 
            onClick={() => setShowForgotPassword(true)} 
            className="link-btn"
          >
            Forgot Password?
          </button>
        )}


        {message && <div className="message">{message}</div>}
      </div>

      {showOtpModal && (
        <div className="login-card" style={{ position: 'fixed', inset: 0, margin: 'auto' }}>
          <h2>{confirmationResult ? 'Enter SMS Code' : 'Verify OTP'}</h2>
          <form onSubmit={handleVerifyOtp}>
            <div className="input-group">
              {confirmationResult ? (
                <input
                  type="text"
                  placeholder="Enter 6-digit SMS code"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  required
                  maxLength={6}
                />
              ) : (
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  maxLength={6}
                />
              )}
            </div>
            <button type="submit" disabled={loading} className="primary-btn">
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
          <button onClick={() => setShowOtpModal(false)} className="link-btn">Cancel</button>
          {message && <div className="message">{message}</div>}
        </div>
      )}
      <div id="recaptcha-container" style={{ display: 'none' }} />
    </div>
  );
};

export default Login; 