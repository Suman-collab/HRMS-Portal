import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../shared/api/axios';
import { Users, Clock, Briefcase, Mail } from 'lucide-react';

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            setError('Failed to fetch the employee directory.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(pagination.page);
        // eslint-disable-next-line
    }, [pagination.page]);

    const handleRowClick = (employeeId) => navigate(`/admin/employees/${employeeId}`);
    const handleNextPage = () => { if (pagination.page < pagination.totalPages) setPagination(prev => ({ ...prev, page: prev.page + 1 })); };
    const handlePrevPage = () => { if (pagination.page > 1) setPagination(prev => ({ ...prev, page: prev.page - 1 })); };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Users size={24} className="text-primary" />
                        Employee Master Directory
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Detailed view of all registered personnel and their roles.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <span className="text-sm font-semibold text-gray-800">{employees.length} Personnel Listed</span>
                </div>
            </header>

            {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200">{error}</div>}

            <div className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">All Employees</h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                        <Clock size={28} className="animate-spin text-primary" />
                        <span className="font-medium">Loading personnel database...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-200">
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Employee Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Role / Dept</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm italic bg-gray-50/30">
                                            No personnel found.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((emp) => (
                                        <tr
                                            key={emp._id}
                                            onClick={() => handleRowClick(emp._id)}
                                            className="hover:bg-gray-50/70 transition-colors cursor-pointer bg-white group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                        {emp.profile?.name || 'Unnamed Employee'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 font-mono mt-0.5">{emp.employeeId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail size={14} className="text-gray-400" />
                                                    {emp.email}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                                                        <Briefcase size={14} className="text-indigo-500" />
                                                        {emp.profile?.designation || 'No Designation'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {emp.profile?.department || 'Unassigned'} • <span className="capitalize">{emp.role}</span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${emp.isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
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

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-600 font-medium">Showing page {pagination.page} of {pagination.totalPages || 1}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={pagination.page <= 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={pagination.page >= pagination.totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}