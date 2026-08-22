import React from 'react';

const Attendance = () => {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
        Attendance Tracking
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Log your daily clock-in / clock-out and review attendance history.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button style={{ padding: '0.75rem 1.5rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          Clock In
        </button>
        <button style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          Clock Out
        </button>
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recent Attendance Logs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.75rem' }}>Date</th>
              <th style={{ padding: '0.75rem' }}>Check In</th>
              <th style={{ padding: '0.75rem' }}>Check Out</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '0.75rem' }}>Today</td>
              <td style={{ padding: '0.75rem' }}>09:05 AM</td>
              <td style={{ padding: '0.75rem' }}>--</td>
              <td style={{ padding: '0.75rem', color: '#16a34a' }}>Present</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
