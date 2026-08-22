import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';
import { Calendar, PlusCircle, CheckCircle, Clock, XCircle, FileText, Navigation2 } from 'lucide-react';

export default function Leave() {
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ leaveType: 'Paid', startDate: '', endDate: '', remarks: '' });
  const [message, setMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/leave');
      setHistory(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/api/leave/apply', form);
      setMessage('Leave request submitted successfully.');
      setIsSuccessMessage(true);
      setForm({ leaveType: 'Paid', startDate: '', endDate: '', remarks: '' });
      fetchHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit leave request.');
      setIsSuccessMessage(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'Rejected': return <XCircle size={16} className="text-rose-500" />;
      default: return <Clock size={16} className="text-amber-500" />;
    }
  };

  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm bg-white text-gray-900 shadow-sm";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText size={24} className="text-primary" />
          Leave Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">Submit new leave requests and track your leave history.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <PlusCircle size={20} className="text-primary" />
              Apply for Leave
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Leave Type</label>
                <select
                  value={form.leaveType}
                  onChange={e => setForm({ ...form, leaveType: e.target.value })}
                  className={inputClasses}
                >
                  <option value="Paid">Paid Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks (Optional)</label>
                <textarea
                  placeholder="Reason for leave..."
                  value={form.remarks}
                  onChange={e => setForm({ ...form, remarks: e.target.value })}
                  className={`${inputClasses} resize-none h-24`}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <Navigation2 size={18} className="rotate-90" /> Submit Request
              </button>

              {message && (
                <div className={`p-3 rounded-lg text-sm font-medium flex items-start gap-2 ${isSuccessMessage ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {isSuccessMessage ? <CheckCircle size={18} className="mt-0.5 shrink-0" /> : <XCircle size={18} className="mt-0.5 shrink-0" />}
                  <span>{message}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={20} className="text-primary" /> Leave History
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Remarks</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm italic bg-gray-50/30">
                        No leave history found.
                      </td>
                    </tr>
                  ) : (
                    history.map(row => (
                      <tr key={row._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-800">{row.leaveType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {new Date(row.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            to {new Date(row.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 truncate max-w-xs" title={row.remarks || 'No remarks'}>
                            {row.remarks || <span className="text-gray-400 italic">None</span>}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${row.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                              row.status === 'Rejected' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                                'bg-amber-100 text-amber-800 border-amber-200'
                            }`}>
                            {getStatusIcon(row.status)} {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}