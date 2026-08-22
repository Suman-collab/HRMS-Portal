import React from 'react';

const AdminEmployees = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.25rem' }}>
            Employee Management
          </h1>
          <p style={{ color: '#64748b' }}>View, add, and manage company employees.</p>
        </div>
        <button style={{ padding: '0.625rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
          + Add New Employee
        </button>
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.75rem' }}>Employee ID</th>
              <th style={{ padding: '0.75rem' }}>Name</th>
              <th style={{ padding: '0.75rem' }}>Department</th>
              <th style={{ padding: '0.75rem' }}>Role</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '0.75rem' }}>EMP1001</td>
              <td style={{ padding: '0.75rem' }}>Jane Smith</td>
              <td style={{ padding: '0.75rem' }}>Engineering</td>
              <td style={{ padding: '0.75rem' }}>Employee</td>
              <td style={{ padding: '0.75rem', color: '#16a34a' }}>Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEmployees;
