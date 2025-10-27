// src/Components/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/ComponentStyles/Navbar.css';
import { LogoutButton } from "./Buttons";

// Map navigation items to departments
const navItems = [
  { name: 'PROCESS', path: '/process', department: 'Process' },
  { name: 'MICRO TENSILE', path: '/micro-textile', department: 'Micro Tensile' },
  { name: 'TENSILE', path: '/textile', department: 'Tensile' },
  { name: 'QC-PRODUCTION DETAILS', path: '/qc-production-details', department: 'QC - production' },
  { name: 'MICRO STRUCTURE', path: '/micro-structure', department: 'Micro Structure' },
  { name: 'IMPACT', path: '/impact', department: 'Impact' },
  {
    name: 'SAND LAB',
    department: 'Sand Lab',
    dropdown: [
      { name: 'SAND TESTING RECORD', path: '/sand-lab/page-1' },
      { name: 'FOUNDARY SAND TESTING NOTE', path: '/sand-lab/page-2' },
    ],
  },
  {
    name: 'MOULDING',
    department: 'Moulding',
    dropdown: [
      { name: 'DISAMATIC PRODUCT REPORT', path: '/moulding/page-1' },
      { name: 'MOULD HARDNESS AND PATTERN TEMPERATURE RECORD', path: '/moulding/page-2' },
      { name: 'MOULDING PAGE 3', path: '/moulding/page-3' },
    ],
  },
  {
    name: 'MELTING',
    department: 'Melting',
    dropdown: [
      { name: 'MELTING PROCESS PARAMETERS', path: '/process/melting-parameters' },
      { name: 'MOLDING PROCESS PARAMETERS', path: '/process/molding-parameters' },
    ],
  },
];

export const Navbar = () => {
  const { isAdmin, user } = useContext(AuthContext);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleMouseEnter = (itemName) => setActiveDropdown(itemName);
  const handleMouseLeave = () => setActiveDropdown(null);

  const isActiveRoute = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const isDropdownActive = (dropdown) =>
    dropdown?.some((sub) => isActiveRoute(sub.path));

  // Filter navigation items based on user's department
  const filterNavItems = () => {
    // Admin or "All" department users can see everything
    if (isAdmin || user?.department === 'All') {
      return navItems;
    }

    // Filter items based on user's department
    return navItems.filter(item => item.department === user?.department);
  };

  const filteredNavItems = filterNavItems();

  return (
    <nav className={`navbar-container${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-logo">
        <img
          src="/images/sakthiautologo.png"
          alt="Sakthi Auto"
          className="logo-image"
        />
      </div>

      <div className="navbar-links">
        {filteredNavItems.length === 0 ? (
          <div className="navbar-no-access">
            <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
              No accessible pages for your department
            </span>
          </div>
        ) : (
          filteredNavItems.map((item) => (
            <div
              key={item.name}
              className={`navbar-item ${item.dropdown ? 'has-dropdown' : ''} ${
                activeDropdown === item.name ? 'active' : ''
              }`}
              onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
            {/* Parent item */}
            {item.dropdown ? (
              <span
                className={`navbar-link ${
                  isDropdownActive(item.dropdown) ? 'active-route' : ''
                }`}
              >
                <span className="link-text">{item.name}</span>
                <span
                  className={`dropdown-arrow ${
                    activeDropdown === item.name ? 'open' : ''
                  }`}
                >
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            ) : (
              <Link
                to={item.path}
                className={`navbar-link ${
                  isActiveRoute(item.path) ? 'active-route' : ''
                }`}
              >
                <span className="link-text">{item.name}</span>
                <span className="link-underline"></span>
              </Link>
            )}

            {/* Dropdown items */}
            {item.dropdown && (
              <div
                className={`dropdown-menu ${
                  activeDropdown === item.name ? 'show' : ''
                }`}
              >
                <div className="dropdown-content">
                  {item.dropdown.map((subItem, index) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={`dropdown-item ${
                        isActiveRoute(subItem.path) ? 'active' : ''
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="dropdown-item-bullet"></span>
                      <span className="dropdown-item-text">{subItem.name}</span>
                      <span className="dropdown-item-arrow">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          ))
        )}
      </div>

      <LogoutButton />
    </nav>
  );
};
