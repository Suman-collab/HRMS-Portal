import React, { useState, useEffect } from 'react';
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
        const res = await api.get(`/api/payroll/${id}`);
        setPayroll(res.data.data);
      } catch(err) { console.error(err); }
    };
    fetchPayroll();
  }, []);

  const downloadPDF = async () => {
    const id = getProfileId();
    if (!id) return;
    try {
      const res = await api.get(`/api/payroll/${id}/slip`, { responseType: 'blob' });
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
}