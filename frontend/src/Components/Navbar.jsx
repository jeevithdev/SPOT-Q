// src/Components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ComponentStyles/Navbar.css';

const navItems = [
  { name: 'ITEMS', path: '/items' },
  { name: 'SPECTRO ANALYSIS', path: '/spectro-analysis' },
  {
    name: 'PRODUCTION',
    path: '/production',
    dropdown: [
      { name: 'MECHANICAL PROPERTIES', path: '/production/mechanical-properties' },
      { name: 'METALLOGRAPHY PROPERTIES', path: '/production/metallography-properties' },
    ],
  },
  {
    name: 'PROCESS',
    path: '/process',
    dropdown: [
      { name: 'MELTING PROCESS PARAMETERS', path: '/process/melting-parameters' },
      { name: 'MOLDING PROCESS PARAMETERS', path: '/process/molding-parameters' },
    ],
  },
  {
    name: 'REJECTION',
    path: '/rejection',
    dropdown: [
      { name: 'REJECTION REPORT - FOUNDED', path: '/rejection/report-founded' },
      { name: 'REJECTION REPORT - MACHINE', path: '/rejection/report-machine' },
    ],
  },
  {
    name: 'PERFORMANCE',
    path: '/performance',
    dropdown: [
      { name: 'PROCESS CONTROL', path: '/performance/process-control' },
      { name: 'OVERALL REPORT', path: '/performance/overall-report' },
    ],
  },
];

export const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (itemName) => {
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/images/sakthiautologo.png" alt="Sakthi Auto" className="logo-image" />
        </Link>
      </div>
      
      <div className="navbar-links">
        {navItems.map((item) => (
          <div 
            key={item.name} 
            className={`navbar-item ${item.dropdown ? 'has-dropdown' : ''} ${activeDropdown === item.name ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter(item.name)}
            onMouseLeave={handleMouseLeave}
          >
            <Link to={item.path} className={`navbar-link ${item.path === '/process' || item.path === '/production' || item.path === '/rejection' || item.path === '/performance' ? 'highlighted' : ''}`}>
              {item.name} {item.dropdown && <span className="dropdown-arrow"></span>}
            </Link>

            {item.dropdown && activeDropdown === item.name && (
              <div className="dropdown-menu">
                {item.dropdown.map((subItem) => (
                  <Link key={subItem.name} to={subItem.path} className="dropdown-item">
                    {subItem.icon && <span className="dropdown-item-icon">{subItem.icon}</span>}
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};