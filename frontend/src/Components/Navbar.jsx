// src/Components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/ComponentStyles/Navbar.css';
import { LogoutButton } from "./Buttons";

const navItems = [
  { name: 'ITEMS', path: '/items' },
  { name: 'ANALYTICS', path: '/analytics' },
  { name: 'SPECTRO ANALYSIS', path: '/spectro-analysis' },
  {
    name: 'PRODUCTION',
    dropdown: [
      { name: 'MECHANICAL PROPERTIES', path: '/production/mechanical-properties' },
      { name: 'METALLOGRAPHY PROPERTIES', path: '/production/metallography-properties' },
    ],
  },
  {
    name: 'PROCESS',
    dropdown: [
      { name: 'MELTING PROCESS PARAMETERS', path: '/process/melting-parameters' },
      { name: 'MOLDING PROCESS PARAMETERS', path: '/process/molding-parameters' },
      { name: 'SANDPLANT PROCESS PARAMETERS', path: '/process/sandplant-process-parameters' },
    ],
  },
  {
    name: 'REJECTION',
    dropdown: [
      { name: 'REJECTION REPORT - FOUNDED', path: '/rejection/report-founded' },
      { name: 'REJECTION REPORT - MACHINE', path: '/rejection/report-machine' },
    ],
  },
  {
    name: 'PERFORMANCE',
    dropdown: [
      { name: 'PROCESS CONTROL', path: '/process-control' },
      { name: 'OVERALL REPORT', path: '/overall-reports' },
    ],
  },
];

export const Navbar = () => {
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
        {navItems.map((item) => (
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
        ))}
      </div>

      <LogoutButton />
    </nav>
  );
};
