import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';

export default function AdminAttendance() {
  const [history, setHistory] = useState([]);
  
  const fetchAll = async () => {
    try {
      const res = await api.get('/api/attendance');
      setHistory(res.data.data);
    } catch(err) { console.error(err); }
  };
  
  useEffect(() => { fetchAll(); }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Company Attendance</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Employee</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Check-In</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Check-Out</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map(row => (
            <tr key={row._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.5rem' }}>{row.employeeId?.email || 'N/A'}</td>
              <td style={{ padding: '0.5rem' }}>{new Date(row.date).toLocaleDateString()}</td>
              <td style={{ padding: '0.5rem' }}>{row.checkIn ? new Date(row.checkIn).toLocaleTimeString() : '--'}</td>
              <td style={{ padding: '0.5rem' }}>{row.checkOut ? new Date(row.checkOut).toLocaleTimeString() : '--'}</td>
              <td style={{ padding: '0.5rem' }}>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}