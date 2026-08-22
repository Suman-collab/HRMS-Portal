import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';

export default function Leave() {
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ leaveType: 'Paid', startDate: '', endDate: '', remarks: '' });
  const [message, setMessage] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/leave');
      setHistory(res.data.data);
    } catch(err) { console.error(err); }
  };
  
  useEffect(() => { fetchHistory(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/api/leave/apply', form);
      setMessage('Leave applied successfully');
      setForm({ leaveType: 'Paid', startDate: '', endDate: '', remarks: '' });
      fetchHistory();
    } catch(err) {
      setMessage(err.response?.data?.message || 'Failed to apply log');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Leave Management</h1>
      
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
        <h2>Apply for Leave</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', gap: '1rem' }}>
          <select value={form.leaveType} onChange={e => setForm({...form, leaveType: e.target.value})} style={{ padding: '0.5rem' }}>
            <option>Paid</option>
            <option>Sick</option>
            <option>Unpaid</option>
          </select>
          <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required style={{ padding: '0.5rem' }} />
          <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required style={{ padding: '0.5rem' }} />
          <textarea placeholder="Remarks" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} style={{ padding: '0.5rem' }} />
          <button type="submit" style={{ padding: '0.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>Submit</button>
        </form>
        {message && <p style={{ color: '#0369a1', marginTop: '1rem' }}>{message}</p>}
      </div>

      <h2>Leave History</h2>
      <ul>
        {history.map(row => (
          <li key={row._id} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
            <strong>{row.leaveType}</strong>: {new Date(row.startDate).toLocaleDateString()} to {new Date(row.endDate).toLocaleDateString()} - 
            <span style={{ marginLeft: '0.5rem', color: row.status === 'Approved' ? 'green' : row.status === 'Rejected' ? 'red' : 'orange' }}>{row.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}