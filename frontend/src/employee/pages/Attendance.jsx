import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';

export default function Attendance() {
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const getProfileId = () => {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try { return JSON.parse(atob(token.split('.')[1])).id || JSON.parse(atob(token.split('.')[1]))._id; } catch (e) { return ''; }
  };

  const fetchHistory = async () => {
    const id = getProfileId();
    if (!id) return;
    try {
      const qs = [];
      if (startDate) qs.push(`startDate=${startDate}`);
      if (endDate) qs.push(`endDate=${endDate}`);
      const q = qs.length ? '?' + qs.join('&') : '';
      const res = await api.get(`/api/attendance/${id}${q}`);
      setHistory(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchHistory(); }, [startDate, endDate]);

  const handleAction = async (type) => {
    setMessage('');
    try {
      await api.post(`/api/attendance/${type}`);
      setMessage(`Successfully ${type === 'checkin' ? 'checked in' : 'checked out'}`);
      fetchHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || `Failed to ${type}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Attendance</h1>
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => handleAction('checkin')} style={{ marginRight: '1rem', padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px' }}>Check In</button>
        <button onClick={() => handleAction('checkout')} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px' }}>Check Out</button>
      </div>
      {message && <p style={{ color: '#0369a1', marginBottom: '1rem' }}>{message}</p>}

      <h2>History</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ marginRight: '1rem' }} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Check In</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Check Out</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map(row => (
            <tr key={row._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
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