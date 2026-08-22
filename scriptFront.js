const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const files = {
    // EMPLOYEE PAGES
    "employee/pages/Attendance.jsx": `import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';
import {jwtDecode} from 'jwt-decode'; // Wait, I'll use standard JSON.parse

export default function Attendance() {
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const getProfileId = () => {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try { return JSON.parse(atob(token.split('.')[1])).id || JSON.parse(atob(token.split('.')[1]))._id; } catch(e) { return ''; }
  };

  const fetchHistory = async () => {
    const id = getProfileId();
    if (!id) return;
    try {
      const qs = [];
      if (startDate) qs.push(\`startDate=\${startDate}\`);
      if (endDate) qs.push(\`endDate=\${endDate}\`);
      const q = qs.length ? '?' + qs.join('&') : '';
      const res = await api.get(\`/api/attendance/\${id}\${q}\`);
      setHistory(res.data.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchHistory(); }, [startDate, endDate]);

  const handleAction = async (type) => {
    setMessage('');
    try {
      await api.post(\`/api/attendance/\${type}\`);
      setMessage(\`Successfully \${type === 'checkin' ? 'checked in' : 'checked out'}\`);
      fetchHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || \`Failed to \${type}\`);
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
}`,

    "employee/pages/Leave.jsx": `import React, { useState, useEffect } from 'react';
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
}`,

    "employee/pages/Payroll.jsx": `import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';

export default function Payroll() {
  const [payroll, setPayroll] = useState(null);
  
  const getProfileId = () => {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try { return JSON.parse(atob(token.split('.')[1])).id || JSON.parse(atob(token.split('.')[1]))._id; } catch(e) { return ''; }
  };

  useEffect(() => {
    const fetchPayroll = async () => {
      const id = getProfileId();
      if (!id) return;
      try {
        const res = await api.get(\`/api/payroll/\${id}\`);
        setPayroll(res.data.data);
      } catch(err) { console.error(err); }
    };
    fetchPayroll();
  }, []);

  const downloadPDF = async () => {
    const id = getProfileId();
    if (!id) return;
    try {
      const res = await api.get(\`/api/payroll/\${id}/slip\`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'salary_slip.pdf');
      document.body.appendChild(link);
      link.click();
    } catch(err) {
      console.error('Failed to download', err);
    }
  };

  if (!payroll) return <div style={{ padding:'2rem' }}>No payroll assigned yet.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Payroll</h1>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '400px', lineHeight: '1.8' }}>
        <div><strong>Basic Salary:</strong> {payroll.basicSalary}</div>
        <div><strong>Allowances:</strong> {payroll.allowances}</div>
        <div><strong>Deductions:</strong> {payroll.deductions}</div>
        <hr />
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Net Salary: {payroll.netSalary}</div>
        <button onClick={downloadPDF} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Download Salary Slip
        </button>
      </div>
    </div>
  );
}`,

    // ADMIN PAGES
    "admin/pages/AdminAttendance.jsx": `import React, { useState, useEffect } from 'react';
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
}`,

    "admin/pages/LeaveApprovals.jsx": `import React, { useState, useEffect } from 'react';
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
      await api.put(\`/api/leave/\${id}/status\`, { status, adminComments: comments[id] || '' });
      setMsg(\`Leave \${status}\`);
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
}`,

    "admin/pages/AdminPayroll.jsx": `import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../shared/api/axios';

export default function AdminPayroll() {
  const { id } = useParams();
  const [form, setForm] = useState({ basicSalary: 0, allowances: 0, deductions: 0, netSalary: 0 });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(\`/api/payroll/\${id}\`);
        if (res.data.data) setForm(res.data.data);
      } catch (err) {}
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await api.put(\`/api/payroll/\${id}\`, form);
      setForm(res.data.data);
      setMsg('Payroll Updated');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Error updating');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Edit Payroll</h1>
      {msg && <p style={{ color: '#0369a1' }}>{msg}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '1rem' }}>
        <label>Basic Salary <input type="number" value={form.basicSalary} onChange={e => setForm({...form, basicSalary: e.target.value})} /></label>
        <label>Allowances <input type="number" value={form.allowances} onChange={e => setForm({...form, allowances: e.target.value})} /></label>
        <label>Deductions <input type="number" value={form.deductions} onChange={e => setForm({...form, deductions: e.target.value})} /></label>
        <label>Net Salary (Computed) <input type="number" value={form.netSalary} disabled style={{ background: '#eee' }} /></label>
        <button onClick={handleSave} style={{ padding: '0.5rem', background: '#2563eb', color: 'white', border: 'none' }}>Save Payroll</button>
      </div>
    </div>
  );
}`
};

// Create frontend files
for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(srcDir, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}
console.log("Frontend files generated successfully.");
