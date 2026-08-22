import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';
import { Calendar, Users } from 'lucide-react';

export default function AdminAttendance() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/attendance');
      setHistory(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Calendar size={24} className="text-primary" />
            Company Attendance Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor company-wide employee attendance records in real-time.</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm p-1">
          <div className="px-4 py-1.5 flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-800">{history.length} Logs</span>
          </div>
        </div>
      </header>

      <div className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Daily Attendance Roster
          </h2>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading specific attendance records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Check-In</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Check-Out</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm italic bg-gray-50/30">
                      No attendance records available.
                    </td>
                  </tr>
                ) : (
                  history.map(row => (
                    <tr key={row._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{row.employeeId?.email || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {new Date(row.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
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
        )}
      </div>
    </div>
  );
}