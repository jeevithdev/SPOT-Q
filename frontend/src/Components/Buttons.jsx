import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Settings, Edit2, Trash2, Filter, X } from 'lucide-react';
import CustomDatePicker from './CustomDatePicker';
import '../styles/ComponentStyles/Buttons.css';

// Base Button Component
const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button',
  ariaLabel,
  ...rest
}) => {
  const base = `btn btn--${variant}`;
  const combined = `${base} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      className={combined}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </button>
  );
};

// Logout function
export const handleLogout = () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = '/login';
};

// Styled Logout Button with background
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
  isVisible = false
}) => (
  <EyeButtonWrapper>
    <button 
      onClick={onClick}
      type="button"
      title={isVisible ? "Hide password" : "Show password"}
    >
      {isVisible ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )}
    </button>
  </EyeButtonWrapper>
);

// Settings Icon Button for password and configuration
export const SettingsButton = ({ onClick }) => (
  <SettingsButtonWrapper>
    <button onClick={onClick} type="button" title="Settings">
      <Settings size={18} />
    </button>
  </SettingsButtonWrapper>
);

// Edit Action Button for table rows
export const EditActionButton = ({ onClick }) => (
  <ActionButtonWrapper>
    <button onClick={onClick} type="button" title="Edit" className="edit-action-btn">
      <Edit2 size={16} />
    </button>
  </ActionButtonWrapper>
);

// Delete Action Button for table rows
export const DeleteActionButton = ({ onClick }) => (
  <ActionButtonWrapper>
    <button onClick={onClick} type="button" title="Delete" className="delete-action-btn">
      <Trash2 size={16} />
    </button>
  </ActionButtonWrapper>
);

// Filter Button for report pages
export const FilterButton = ({ onClick, disabled = false, children }) => (
  <FilterButtonWrapper>
    <button onClick={onClick} type="button" disabled={disabled} title="Filter">
      <Filter size={18} />
      {children || 'Filter'}
    </button>
  </FilterButtonWrapper>
);

export const ClearButton = ({ onClick, disabled = false, children }) => (
  <FilterButtonWrapper>
    <button onClick={onClick} type="button" disabled={disabled} title="Clear Filter" className="clear-btn">
      <X size={18} />
      {children || 'Clear'}
    </button>
  </FilterButtonWrapper>
);

// Unified DatePicker Component - Use this for all date inputs
export const DatePicker = forwardRef(({ value, onChange, name, max, placeholder, style, disabled, onKeyDown }, ref) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <CustomDatePicker
      ref={ref}
      value={value}
      onChange={onChange}
      name={name}
      max={max || today}
      placeholder={placeholder}
      style={style}
      disabled={disabled}
      onKeyDown={onKeyDown}
    />
  );
});
DatePicker.displayName = 'DatePicker';

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

// Action Button Wrapper for Edit and Delete buttons in tables
const ActionButtonWrapper = styled.div`
  display: inline-block;
  margin: 0 4px;

  button {
    width: 32px;
    height: 32px;
    padding: 6px;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
  }

  button.edit-action-btn {
    color: #3b82f6;
    border-color: #3b82f6;
  }

  button.edit-action-btn:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }

  button.delete-action-btn {
    color: #ef4444;
    border-color: #ef4444;
  }

  button.delete-action-btn:hover {
    background: #ef4444;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
  }

  button:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
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
    white-space: nowrap;
    min-height: 42px;
    width: 100%;
  }

  button:hover:not(:disabled) {
    background: linear-gradient(135deg, #FF6A3D 0%, #FF5722 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 127, 80, 0.5);
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }
`;

export { Button };
export default Button;
