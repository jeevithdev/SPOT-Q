import React from 'react';
import styled from 'styled-components';

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
const handleLogout = () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = '/login';
};

export const LogoutButton = () => (
  <LogoutWrapper>
    <button onClick={handleLogout}>
      LOGOUT
    </button>
  </LogoutWrapper>
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

// Top-right positioning for logout button
const LogoutWrapper = styled(StyledWrapper)`
  position: absolute;
  top: 20px;
  right: 30px;
  z-index: 100;

  button {
    font-size: 16px; /* Smaller logout button */
    padding: 4px 12px;
  }
`;

export default Button;