import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../shared/api/axios';

export default function AdminPayroll() {
  const { id } = useParams();
  const [form, setForm] = useState({ basicSalary: 0, allowances: 0, deductions: 0, netSalary: 0 });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/payroll/${id}`);
        if (res.data.data) setForm(res.data.data);
      } catch (err) {}
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await api.put(`/api/payroll/${id}`, form);
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
}