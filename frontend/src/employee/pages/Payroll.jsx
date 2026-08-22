import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';
import { DollarSign, Download, FileText, Pickaxe, Landmark, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function Payroll() {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfileId = () => {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try { return JSON.parse(atob(token.split('.')[1])).id || JSON.parse(atob(token.split('.')[1]))._id; } catch (e) { return ''; }
  };

  useEffect(() => {
    const fetchPayroll = async () => {
      setLoading(true);
      const id = getProfileId();
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/api/payroll/${id}`);
        setPayroll(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
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
    } catch (err) {
      console.error('Failed to download', err);
      alert("Failed to download salary slip. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium text-sm">Loading payroll information...</p>
      </div>
    );
  }

  if (!payroll) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-surface rounded-xl border border-gray-200 stroke-gray-200 shadow-sm p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Pickaxe className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">No Payroll Information</h3>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">Your payroll details have not been assigned yet. Please contact your administrator or HR department.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Landmark size={24} className="text-primary" />
          My Payroll
        </h1>
        <p className="text-sm text-gray-500 mt-1">View your current salary structure and download your slips.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-indigo-700 p-6 text-white text-center">
            <p className="text-indigo-100 text-sm font-medium mb-1 uppercase tracking-wider">Net Salary</p>
            <h2 className="text-4xl font-bold tracking-tight">${payroll.netSalary?.toLocaleString() || '0'}</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <DollarSign size={16} />
                </div>
                <span className="font-semibold text-gray-700">Basic Salary</span>
              </div>
              <span className="font-bold text-gray-900">${payroll.basicSalary?.toLocaleString() || '0'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <ArrowUpCircle size={16} />
                </div>
                <span className="font-semibold text-gray-700">Allowances</span>
              </div>
              <span className="font-bold text-emerald-600">+ ${payroll.allowances?.toLocaleString() || '0'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <ArrowDownCircle size={16} />
                </div>
                <span className="font-semibold text-gray-700">Deductions</span>
              </div>
              <span className="font-bold text-rose-600">- ${payroll.deductions?.toLocaleString() || '0'}</span>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100">
              <button
                onClick={downloadPDF}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <Download size={18} /> Download Salary Slip
              </button>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
            <FileText size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Salary Slips</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Your salary slip contains confidential information regarding your compensation structure, including all taxable and non-taxable components.
            </p>
          </div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide px-3 py-1 bg-indigo-50 rounded-full mt-4">
            Keep Secure & Confidential
          </p>
        </div>
      </div>
    </div>
  );
}