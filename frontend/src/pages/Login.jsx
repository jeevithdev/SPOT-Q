import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/PageStyles/Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);

  // Login state
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!employeeId || !password) {
      setError("Please enter both Employee ID and Password");
      return;
    }
    
    setLoading(true);
    try {
      await login(employeeId, password);
      // AuthContext will set user/token; router in app.jsx will redirect
    } catch (err) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
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

      {/* Right side - Login */}
      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p style={{ 
            color: '#666', 
            fontSize: '14px', 
            marginBottom: '24px',
            textAlign: 'center' 
          }}>
            Please login with your Employee ID
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333'
              }}>
                Employee ID
              </label>
              <input 
                type="text" 
                placeholder="e.g., EMP001, ADMIN001" 
                required 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                autoFocus
                style={{ 
                  width: '100%',
                  textTransform: 'uppercase'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    paddingRight: '40px',
                    width: '100%'
                  }}
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
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
            </div>

            {error && (
              <div 
                className="form-error" 
                style={{ 
                  textAlign: 'left',
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  border: '1px solid #FCA5A5'
                }}
              >
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#F3F4F6',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              <strong>Note:</strong> Don't have login credentials? Please contact your administrator.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
