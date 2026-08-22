import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../shared/api/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEmp, setNewEmp] = useState({ email: '', password: '', role: 'employee' });
    const [addError, setAddError] = useState('');

    const fetchEmployees = async (page = 1) => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        try {
            const response = await api.get(`/api/admin/employees?page=${page}&limit=${pagination.limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data.data || []);
            if (response.data.pagination) setPagination(response.data.pagination);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Unauthorized access. Please login as an admin.');
            } else {
                setError('Failed to fetch the employee directory.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/api/admin/analytics');
            setAnalytics(res.data.data);
        } catch (err) { console.error('Failed analytics', err); }
    };

    useEffect(() => {
        fetchEmployees(pagination.page);
        fetchAnalytics();
        // eslint-disable-next-line
    }, [pagination.page]);

    const handleRowClick = (employeeId) => navigate(`/admin/employees/${employeeId}`);

    const handleNextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrevPage = () => {
        if (pagination.page > 1) {
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setAddError('');
        try {
            await api.post('/api/auth/register', {
                email: newEmp.email,
                password: newEmp.password,
                role: newEmp.role,
                employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`
            });
            setIsAddModalOpen(false);
            setNewEmp({ email: '', password: '', role: 'employee' });
            fetchEmployees(pagination.page); // Refresh list
        } catch (err) {
            setAddError(err.response?.data?.message || 'Failed to create employee');
        }
    };

    // Prepare data for charts
    const attendanceData = analytics ? Object.entries(analytics.attendanceSummary).map(([name, value]) => ({ name, value })) : [];
    const attendanceColors = { 'Present': '#10b981', 'Absent': '#ef4444', 'Half-day': '#f59e0b' };

    const leaveData = analytics ? Object.entries(analytics.leaveStats).map(([type, stats]) => ({
        name: type,
        Approved: stats.Approved,
        Pending: stats.Pending,
        Rejected: stats.Rejected
    })) : [];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">System overview and employee management.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircle size={20} className="text-primary" />
                        Attendance Summary (30 days)
                    </h3>
                    <div className="h-64 mt-4">
                        {analytics ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {attendanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={attendanceColors[entry.name] || '#8b5cf6'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">Loading Analytics...</div>
                        )}
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                        {attendanceData.map(entry => (
                            <div key={entry.name} className="flex items-center gap-1 text-sm font-medium text-gray-600">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: attendanceColors[entry.name] || '#8b5cf6' }}></span>
                                {entry.name} ({entry.value})
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-primary" />
                        Leave Stats
                    </h3>
                    <div className="h-64 mt-4">
                        {analytics ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leaveData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="Approved" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="Pending" stackId="a" fill="#f59e0b" />
                                    <Bar dataKey="Rejected" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">Loading Analytics...</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Users size={20} className="text-primary" />
                        Employee Directory
                    </h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition"
                    >
                        + Add Employee
                    </button>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-medium">{error}</div>}

                {loading ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                        <Clock size={24} className="animate-spin text-gray-400" />
                        <span>Loading employees...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">Employee ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                                            No employees found.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((emp) => (
                                        <tr
                                            key={emp._id}
                                            onClick={() => handleRowClick(emp._id)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.employeeId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{emp.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{emp.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.isVerified ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                    }`}>
                                                    {emp.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                    <span className="text-sm text-gray-600 font-medium">Page {pagination.page} of {pagination.totalPages || 1}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={pagination.page <= 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={pagination.page >= pagination.totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Employee Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Create New Employee</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
                            {addError && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{addError}</div>}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email" required
                                    value={newEmp.email}
                                    onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="employee@dayflow.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Temporary Password</label>
                                <input
                                    type="password" required minLength="6"
                                    value={newEmp.password}
                                    onChange={e => setNewEmp({ ...newEmp, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Enter secure password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                                <select
                                    value={newEmp.role}
                                    onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="employee">Employee</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 w-1/3">Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded-lg font-medium bg-primary text-white hover:bg-indigo-700 flex-1">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}