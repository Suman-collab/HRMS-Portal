import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';

export default function LeaveApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [comments, setComments] = useState({});
  const [msg, setMsg] = useState('');

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/api/leave?status=Pending');
      setLeaves(res.data.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchLeaves(); }, []);

  const handleUpdate = async (id, status) => {
    try {
      await api.put(`/api/leave/${id}/status`, { status, adminComments: comments[id] || '' });
      setMsg(`Leave ${status}`);
      fetchLeaves();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Pending Leave Approvals</h1>
      {msg && <p style={{ color: '#0369a1' }}>{msg}</p>}
      {leaves.length === 0 && <p>No pending leaves</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {leaves.map(lv => (
          <li key={lv._id} style={{ border: '1px solid #e5e7eb', marginBottom: '1rem', padding: '1rem', borderRadius: '8px', background: '#fff' }}>
            <p><strong>Employee:</strong> {lv.employeeId?.email}</p>
            <p><strong>Type:</strong> {lv.leaveType} | <strong>Dates:</strong> {new Date(lv.startDate).toLocaleDateString()} to {new Date(lv.endDate).toLocaleDateString()}</p>
            <p><strong>Remarks:</strong> {lv.remarks}</p>
            <input 
              type="text" 
              placeholder="Admin Comments..." 
              value={comments[lv._id] || ''} 
              onChange={e => setComments({...comments, [lv._id]: e.target.value})} 
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} 
            />
            <div>
              <button onClick={() => handleUpdate(lv._id, 'Approved')} style={{ marginRight: '1rem', padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none' }}>Approve</button>
              <button onClick={() => handleUpdate(lv._id, 'Rejected')} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none' }}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}