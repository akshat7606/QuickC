import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/history', label: 'History', icon: '📋' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <nav className="navigation">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;