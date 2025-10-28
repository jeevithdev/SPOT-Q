import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { EyeButton } from "../Components/Buttons";
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
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '15px',
                fontWeight: '700',
                color: '#1F2937',
                textAlign: 'left',
                letterSpacing: '0.3px'
              }}>
                Employee ID
              </label>
              <input 
                type="text" 
                placeholder="Employee ID"
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

            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '15px',
                fontWeight: '700',
                color: '#1F2937',
                textAlign: 'left',
                letterSpacing: '0.3px'
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
                    paddingRight: '50px',
                    width: '100%'
                  }}
                />
                <div 
                  style={{ 
                    position: 'absolute', 
                    right: '5px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    zIndex: 10
                  }}
                >
                  <EyeButton 
                    isVisible={showPassword}
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                  />
                </div>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
