import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';
import { Calendar, Clock, LogIn, LogOut, CheckCircle } from 'lucide-react';

export default function Attendance() {
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(true);

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
      setIsSuccessMessage(true);
      fetchHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || `Failed to ${type}`);
      setIsSuccessMessage(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Calendar size={24} className="text-primary" />
            Attendance
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your daily check-ins and view attendance logs.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleAction('checkin')}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <LogIn size={18} /> Check In
          </button>
          <button
            onClick={() => handleAction('checkout')}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <LogOut size={18} /> Check Out
          </button>
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 font-medium text-sm border-l-4 shadow-sm ${isSuccessMessage ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-red-50 text-red-800 border-red-500'
          }`}>
          {isSuccessMessage ? <CheckCircle size={20} className="text-emerald-500" /> : <Clock size={20} className="text-red-500" />}
          {message}
        </div>
      )}

      <div className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock size={20} className="text-primary" /> Attendance History
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="font-medium text-gray-600">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-primary w-full sm:w-auto"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="font-medium text-gray-600">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-primary w-full sm:w-auto"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">Date</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">Check In</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">Check Out</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm italic">
                    No attendance records found for this period.
                  </td>
                </tr>
              ) : (
                history.map(row => (
                  <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(row.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.checkIn ? new Date(row.checkIn).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : <span className="text-gray-400">--</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.checkOut ? new Date(row.checkOut).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : <span className="text-gray-400">--</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${row.status === 'present' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          row.status === 'absent' ? 'bg-red-100 text-red-800 border-red-200' :
                            row.status === 'half-day' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                        {row.status}
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
  );
}