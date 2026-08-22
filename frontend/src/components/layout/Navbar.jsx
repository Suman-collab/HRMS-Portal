import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 1.5rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', textDecoration: 'none' }}>
          Dayflow HRMS
        </Link>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/login" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.875rem' }}>Login</Link>
        <Link to="/signup" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.875rem' }}>Signup</Link>
        <div style={{ width: '1px', height: '20px', backgroundColor: '#cbd5e1' }}></div>
        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>User: Employee (Demo)</span>
      </nav>
    </header>
  );
};

export default Navbar;
