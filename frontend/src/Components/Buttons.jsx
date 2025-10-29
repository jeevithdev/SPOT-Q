import React from 'react';
import styled from 'styled-components';
import { Settings, Save, Filter, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import CustomDatePicker from './CustomDatePicker';

const Button = () => {
  return (
    <StyledWrapper>
      <button>
        HOVER ME
      </button>
    </StyledWrapper>
  );
};

// Logout function
export const handleLogout = () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = '/login';
};

// Styled Logout Button with background (for Navbar and Admin)
export const LogoutButton = ({ onClick }) => (
  <LogoutWrapper>
    <button onClick={onClick || handleLogout}>
      LOGOUT
    </button>
  </LogoutWrapper>
);

// Admin Dashboard styled buttons
export const AdminLogoutButton = ({ onClick }) => (
  <AdminButtonWrapper>
    <button onClick={onClick} className="admin-logout">
      LOG OUT
    </button>
  </AdminButtonWrapper>
);

export const AdminChangePasswordButton = ({ onClick }) => (
  <AdminButtonWrapper>
    <button onClick={onClick} className="admin-change-password">
      CHANGE PASSWORD
    </button>
  </AdminButtonWrapper>
);

// Password Button with professional gradient animation
export const PasswordButton = ({ onClick }) => (
  <PasswordButtonWrapper>
    <button onClick={onClick}>
       Change Password
    </button>
  </PasswordButtonWrapper>
);

// Delete Button with professional gradient animation
export const DeleteButton = ({ onClick }) => (
  <DeleteButtonWrapper>
    <button onClick={onClick}>
       Delete User
    </button>
  </DeleteButtonWrapper>
);

// Eye Icon Button for toggling visibility
export const EyeButton = ({ 
  onClick, 
  isVisible = false, 
  onMouseDown, 
  onMouseUp, 
  onMouseLeave,
  onTouchStart,
  onTouchEnd 
}) => (
  <EyeButtonWrapper>
    <button 
      onClick={onClick}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown && onMouseDown(e);
      }}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      type="button"
      title={onClick ? "Toggle password visibility" : "Hold to show password"}
    >
      {isVisible ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      )}
    </button>
  </EyeButtonWrapper>
);

// Complete Password Input with Eye Button
export const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter password",
  name = "password",
  required = false,
  autoComplete = "current-password",
  style = {}
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        style={{
          paddingRight: '50px',
          width: '100%',
          ...style
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
  );
};

// Settings Icon Button for password and configuration
export const SettingsButton = ({ onClick }) => (
  <SettingsButtonWrapper>
    <button onClick={onClick} type="button" title="Settings">
      <Settings size={18} />
    </button>
  </SettingsButtonWrapper>
);

// Unified DatePicker Component - Use this for all date inputs
export const DatePicker = ({ value, onChange, name, max, placeholder, style, disabled }) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <CustomDatePicker
      value={value}
      onChange={onChange}
      name={name}
      max={max || today}
      placeholder={placeholder}
      style={style}
      disabled={disabled}
    />
  );
};

// Submit Button - For form submissions
export const SubmitButton = ({ onClick, disabled, loading, children, icon = true }) => (
  <SubmitButtonWrapper>
    <button onClick={onClick} disabled={disabled || loading}>
      {icon && (loading ? '⏳' : <Save size={20} />)}
      {children || (loading ? 'Saving...' : 'Submit Entry')}
    </button>
  </SubmitButtonWrapper>
);

// Filter Button - For filtering data
export const FilterButton = ({ onClick, disabled, loading, children, icon = true }) => (
  <FilterButtonWrapper>
    <button onClick={onClick} disabled={disabled || loading}>
      {icon && <Filter size={18} />}
      {children || 'Filter'}
    </button>
  </FilterButtonWrapper>
);

// Reset Button - For resetting forms
export const ResetButton = ({ onClick, disabled, children, icon = true }) => (
  <ResetButtonWrapper>
    <button onClick={onClick} disabled={disabled}>
      {icon && <RefreshCw size={18} />}
      {children || 'Reset'}
    </button>
  </ResetButtonWrapper>
);

// Edit Action Button - For table action columns
export const EditActionButton = ({ onClick, disabled }) => (
  <EditActionButtonWrapper>
    <button onClick={onClick} disabled={disabled} title="Edit">
      <Edit2 size={16} />
    </button>
  </EditActionButtonWrapper>
);

// Delete Action Button - For table action columns
export const DeleteActionButton = ({ onClick, disabled }) => (
  <DeleteActionButtonWrapper>
    <button onClick={onClick} disabled={disabled} title="Delete">
      <Trash2 size={16} />
    </button>
  </DeleteActionButtonWrapper>
);

const StyledWrapper = styled.div`
  button {
    color: white;
    text-decoration: none;
    font-size: 20px; /* Reduced size */
    border: none;
    background: none;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    padding: 6px 18px;
    cursor: pointer;
  }

  button:hover {
    color: #ff7f7f; /* Light red text on hover */
  }

  button::before {
    margin-left: auto;
  }

  button::after, button::before {
    content: '';
    width: 0%;
    height: 2px;
    background: #f39c12; /* Hover underline color */
    display: block;
    transition: 0.5s;
  }

  button:hover::after, button:hover::before {
    width: 100%;
    background:  #f39c12; 
  }
`;

// Top-right positioning for logout button with background
const LogoutWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 15px;
  z-index: 100;

  button {
    color: white;
    text-decoration: none;
    font-size: 14px;
    border: none;
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
    white-space: nowrap;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
  }

  button:active {
    transform: translateY(0);
  }

  button::before {
    margin-left: auto;
  }

  button::after, button::before {
    content: '';
    width: 0%;
    height: 2px;
    background: rgba(255, 255, 255, 0.5);
    display: block;
    transition: 0.5s;
  }

  button:hover::after, button:hover::before {
    width: 100%;
    background: rgba(255, 255, 255, 0.8);
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    top: 18px;
    right: 12px;
    
    button {
      font-size: 13px;
      padding: 7px 14px;
    }
  }

  @media (max-width: 900px) {
    top: 16px;
    right: 10px;
    
    button {
      font-size: 12px;
      padding: 6px 12px;
    }
  }

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    
    button {
      font-size: 13px;
      padding: 8px 20px;
    }
  }

  @media (max-width: 480px) {
    button {
      font-size: 12px;
      padding: 7px 18px;
      width: 100%;
      max-width: 200px;
    }
  }
`;

// Admin Dashboard Button Wrapper
const AdminButtonWrapper = styled.div`
  button {
    color: white;
    text-decoration: none;
    font-size: 14px;
    border: none;
    background: none;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
    white-space: nowrap;
  }

  button.admin-logout {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  }

  button.admin-logout:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
  }

  button.admin-logout:active {
    transform: translateY(0);
  }

  button.admin-change-password {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
  }

  button.admin-change-password:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
  }

  button.admin-change-password:active {
    transform: translateY(0);
  }

  button::before {
    margin-left: auto;
  }

  button::after, button::before {
    content: '';
    width: 0%;
    height: 2px;
    background: rgba(255, 255, 255, 0.5);
    display: block;
    transition: 0.5s;
  }

  button:hover::after, button:hover::before {
    width: 100%;
    background: rgba(255, 255, 255, 0.8);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    button {
      font-size: 12px;
      padding: 8px 16px;
    }
  }

  @media (max-width: 480px) {
    button {
      font-size: 11px;
      padding: 7px 14px;
    }
  }
`;

// Password Button Wrapper with professional gradient animation
const PasswordButtonWrapper = styled.div`
  display: inline-block;
  margin: 0 5px;

  button {
    width: auto;
    min-width: 140px;
    height: 38px;
    padding: 0 18px;
    border-radius: 6px;
    font-size: 13px;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    border: none;
    position: relative;
    overflow: hidden;
    z-index: 1;
    color: #2c3e50;
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button::before {
    content: '';
    width: 0;
    height: 100%;
    border-radius: 6px;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    transition: .4s ease;
    display: block;
    z-index: -1;
  }

  button:hover {
    color: #ffffff;
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
    transform: translateY(-1px);
  }

  button:hover::before {
    width: 100%;
  }

  button:active {
    transform: translateY(0);
  }
`;

// Delete Button Wrapper with professional gradient animation (red theme)
const DeleteButtonWrapper = styled.div`
  display: inline-block;
  margin: 0 5px;

  button {
    width: auto;
    min-width: 120px;
    height: 38px;
    padding: 0 18px;
    border-radius: 6px;
    font-size: 13px;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    border: none;
    position: relative;
    overflow: hidden;
    z-index: 1;
    color: #c0392b;
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button::before {
    content: '';
    width: 0;
    height: 100%;
    border-radius: 6px;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    transition: .4s ease;
    display: block;
    z-index: -1;
  }

  button:hover {
    color: #ffffff;
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
    transform: translateY(-1px);
  }

  button:hover::before {
    width: 100%;
  }

  button:active {
    transform: translateY(0);
  }
`;

// Eye Button Wrapper for visibility toggle
const EyeButtonWrapper = styled.div`
  display: inline-block;

  button {
    width: 40px;
    height: 40px;
    padding: 8px;
    border: none;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
  }

  button:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #333;
  }

  button:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.5;
  }
`;

// Settings Button Wrapper
const SettingsButtonWrapper = styled.div`
  display: inline-block;
  margin: 0 5px;

  button {
    width: auto;
    min-width: 38px;
    height: 38px;
    padding: 8px;
    border-radius: 6px;
    border: none;
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 4px rgba(107, 114, 128, 0.3);
  }

  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(107, 114, 128, 0.4);
  }

  button:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }
`;

// Submit Button Wrapper
const SubmitButtonWrapper = styled.div`
  display: inline-block;

  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, #5B9AA9 0%, #4A8494 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 2px 6px rgba(91, 154, 169, 0.3);
    transition: all 0.3s ease;
    transform: scale(1);
    white-space: nowrap;
  }

  button:hover:not(:disabled) {
    background: linear-gradient(135deg, #4A8494 0%, #3A6B7A 100%);
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(91, 154, 169, 0.5);
  }

  button:active:not(:disabled) {
    transform: scale(0.98);
  }

  button:disabled {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    cursor: not-allowed;
    opacity: 0.7;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// Filter Button Wrapper
const FilterButtonWrapper = styled.div`
  display: inline-block;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1.5rem;
    background: linear-gradient(135deg, #FF7F50 0%, #FF6A3D 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 2px 6px rgba(255, 127, 80, 0.3);
    transition: all 0.3s ease;
    width: 100%;
    min-height: 42px;
    white-space: nowrap;
  }

  button:hover:not(:disabled) {
    background: linear-gradient(135deg, #FF6A3D 0%, #FF5722 100%);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 127, 80, 0.5);
  }

  button:active:not(:disabled) {
    transform: scale(0.98);
  }

  button:disabled {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Reset Button Wrapper
const ResetButtonWrapper = styled.div`
  display: inline-block;

  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: linear-gradient(135deg, #163442 0%, #1f4f5d 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 2px 6px rgba(22, 52, 66, 0.3);
    transition: all 0.3s ease;
    transform: scale(1);
    white-space: nowrap;
  }

  button:hover:not(:disabled) {
    background: linear-gradient(135deg, #1f4f5d 0%, #2a5f6f 100%);
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(22, 52, 66, 0.4);
  }

  button:active:not(:disabled) {
    transform: scale(0.98);
  }

  button:disabled {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Edit Action Button Wrapper - For table actions
const EditActionButtonWrapper = styled.div`
  display: inline-block;
  margin: 0 4px;

  button {
    width: 32px;
    height: 32px;
    padding: 6px;
    border-radius: 6px;
    border: none;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
    background: linear-gradient(135deg, #2980b9 0%, #21618c 100%);
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }

  button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }
`;

// Delete Action Button Wrapper - For table actions
const DeleteActionButtonWrapper = styled.div`
  display: inline-block;
  margin: 0 4px;

  button {
    width: 32px;
    height: 32px;
    padding: 6px;
    border-radius: 6px;
    border: none;
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
    background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }

  button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }
`;

export default Button;