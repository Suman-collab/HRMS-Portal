import React from 'react';

const AdminLeaveApprovals = () => {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
        Leave Approvals
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Review, approve, or reject employee leave applications.</p>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.75rem' }}>Employee</th>
              <th style={{ padding: '0.75rem' }}>Type</th>
              <th style={{ padding: '0.75rem' }}>Duration</th>
              <th style={{ padding: '0.75rem' }}>Reason</th>
              <th style={{ padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '0.75rem' }}>EMP1001 (Jane Smith)</td>
              <td style={{ padding: '0.75rem' }}>Sick Leave</td>
              <td style={{ padding: '0.75rem' }}>2025-05-10 to 2025-05-12</td>
              <td style={{ padding: '0.75rem' }}>Medical checkup</td>
              <td style={{ padding: '0.75rem' }}>
                <button style={{ padding: '0.25rem 0.5rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', marginRight: '0.5rem', cursor: 'pointer' }}>Approve</button>
                <button style={{ padding: '0.25rem 0.5rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaveApprovals;
