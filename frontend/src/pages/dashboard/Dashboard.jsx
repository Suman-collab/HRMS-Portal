import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
        Employee Dashboard
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Welcome to Dayflow HRMS. Here is an overview of your activity.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b' }}>Attendance Today</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a', marginTop: '0.25rem' }}>Checked In</p>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b' }}>Leave Balance</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb', marginTop: '0.25rem' }}>14 Days</p>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b' }}>Upcoming Holiday</h3>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginTop: '0.25rem' }}>Labor Day (May 1)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
