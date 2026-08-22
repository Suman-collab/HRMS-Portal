import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '0.625rem 1rem',
  borderRadius: '6px',
  color: isActive ? '#2563eb' : '#475569',
  backgroundColor: isActive ? '#eff6ff' : 'transparent',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: isActive ? '600' : '400',
  marginBottom: '0.25rem',
});

const Sidebar = () => {
  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      padding: '1.25rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 57px)',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Employee Portal
        </p>
        <NavLink to="/dashboard" style={navLinkStyle}>Dashboard</NavLink>
        <NavLink to="/profile" style={navLinkStyle}>My Profile</NavLink>
        <NavLink to="/attendance" style={navLinkStyle}>Attendance</NavLink>
        <NavLink to="/leave" style={navLinkStyle}>Leave Requests</NavLink>
        <NavLink to="/payroll" style={navLinkStyle}>Payroll</NavLink>
      </div>

      <div>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Admin Portal
        </p>
        <NavLink to="/admin/dashboard" style={navLinkStyle}>Admin Dashboard</NavLink>
        <NavLink to="/admin/employees" style={navLinkStyle}>Manage Employees</NavLink>
        <NavLink to="/admin/leave-approvals" style={navLinkStyle}>Leave Approvals</NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
