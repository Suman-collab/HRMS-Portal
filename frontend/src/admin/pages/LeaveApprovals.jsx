import React, { useState, useEffect } from 'react';
import api from '../../shared/api/axios';
import { Calendar, Check, X, FileText, User as UserIcon, MessageSquare } from 'lucide-react';

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
      setMsg(`Leave request successfully ${status.toLowerCase()}.`);
      fetchLeaves();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating leave request');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileText size={24} className="text-primary" />
            Leave Approvals
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage pending employee leave requests.</p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold border border-amber-200">
          {leaves.length} Pending Requests
        </div>
      </header>

      {msg && (
        <div className={`p-4 rounded-lg flex items-center gap-3 font-medium text-sm border-l-4 shadow-sm ${msg.includes('successfully') ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-red-50 text-red-800 border-red-500'
          }`}>
          <span>{msg}</span>
        </div>
      )}

      {leaves.length === 0 ? (
        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Check className="text-emerald-500" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">All Caught Up!</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">There are currently no pending leave requests requiring your approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leaves.map(lv => (
            <div key={lv._id} className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{lv.employeeId?.email || 'Unknown Employee'}</h4>
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full mt-1">
                      {lv.leaveType} Leave
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</span>
                    <span className="text-sm font-medium text-gray-800 flex items-center gap-1.5 break-words">
                      <Calendar size={14} className="text-gray-400 shrink-0" />
                      {new Date(lv.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</span>
                    <span className="text-sm font-medium text-gray-800 flex items-center gap-1.5 break-words">
                      <Calendar size={14} className="text-gray-400 shrink-0" />
                      {new Date(lv.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Employee Remarks</span>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic min-h-[4rem]">
                    {lv.remarks || 'No remarks provided.'}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Add admin comments..."
                      value={comments[lv._id] || ''}
                      onChange={e => setComments({ ...comments, [lv._id]: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm text-gray-900"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(lv._id, 'Approved')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm"
                    >
                      <Check size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(lv._id, 'Rejected')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors shadow-sm text-sm"
                    >
                      <X size={16} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}