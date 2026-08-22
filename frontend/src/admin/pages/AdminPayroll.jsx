import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../shared/api/axios';
import { Landmark, ArrowLeft, Save, ShieldCheck } from 'lucide-react';

export default function AdminPayroll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ basicSalary: 0, allowances: 0, deductions: 0, netSalary: 0 });
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/payroll/${id}`);
        if (res.data.data) {
          setForm(res.data.data);
        }
      } catch (err) {
        // If no payroll exists yet, it might return 404, which is fine, we just use defaults.
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Auto-compute net salary on the frontend for visual feedback (backend should also compute this)
  useEffect(() => {
    const basic = parseFloat(form.basicSalary) || 0;
    const allow = parseFloat(form.allowances) || 0;
    const deduc = parseFloat(form.deductions) || 0;
    setForm(prev => ({ ...prev, netSalary: basic + allow - deduc }));
  }, [form.basicSalary, form.allowances, form.deductions]);


  const handleSave = async () => {
    setMsg('');
    try {
      const res = await api.put(`/api/payroll/${id}`, form);
      setForm(res.data.data);
      setMsg('Payroll package successfully updated.');
      setIsSuccess(true);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating payroll package.');
      setIsSuccess(false);
    }
  };

  const inputClasses = "w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm text-gray-900 bg-white shadow-sm";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium text-sm">Loading payroll configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <header className="mb-8">
        <button
          onClick={() => navigate(`/admin/employees/${id}`)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Employee Profile
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Landmark size={24} className="text-primary" />
              Dedicated Payroll Configuration
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage core salary structure, allowances, and deductions.</p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200">
            <ShieldCheck size={14} /> Admin Access
          </div>
        </div>
      </header>

      {msg && (
        <div className={`p-4 rounded-lg flex items-center gap-3 font-medium text-sm border-l-4 shadow-sm ${isSuccess ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-red-50 text-red-800 border-red-500'
          }`}>
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Compensation Package</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Basic Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  value={form.basicSalary}
                  onChange={e => setForm({ ...form, basicSalary: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Allowances</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  value={form.allowances}
                  onChange={e => setForm({ ...form, allowances: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Deductions</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  value={form.deductions}
                  onChange={e => setForm({ ...form, deductions: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Calculated Net Salary</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-indigo-700 font-bold text-lg">$</span>
              <input
                type="number"
                value={form.netSalary}
                disabled
                className="w-full pl-8 pr-4 py-3 border-2 border-indigo-100 rounded-lg bg-indigo-50/50 text-indigo-900 font-bold text-xl cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">* Net salary is automatically computed as (Basic + Allowances - Deductions).</p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Save size={18} /> Update Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}