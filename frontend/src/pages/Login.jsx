// frontend/src/pages/Login.jsx
import React from "react";
import "../styles/PageStyles/Login.css"; // correct path based on your structure

const Login = () => {
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
            <button className="active">Login</button>
            <button>Register</button>
          </div>

          <div className="login-methods">
            
            
          </div>

          <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <a href="#" className="forgot">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
