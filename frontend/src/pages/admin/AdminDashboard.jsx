import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
        Admin Dashboard
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Organization-wide workforce metrics and system health.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Employees</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb', marginTop: '0.25rem' }}>128</p>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b' }}>Present Today</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a', marginTop: '0.25rem' }}>116</p>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b' }}>Pending Leave Approvals</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ea580c', marginTop: '0.25rem' }}>5</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
