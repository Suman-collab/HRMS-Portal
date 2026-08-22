import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../shared/api/axios';
import { UserCircle, CalendarCheck, FileText, LogOut, ArrowRight, Activity } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const employeeId = localStorage.getItem('employeeId') || 'Employee';
    const email = localStorage.getItem('email') || '';
    const role = localStorage.getItem('role') || 'employee';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('employeeId');
        localStorage.removeItem('email');
        delete api.defaults.headers.common['Authorization'];
        navigate('/login', { replace: true });
    };

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome, {employeeId}</h1>
                <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                    {email} <span className="w-1 h-1 rounded-full bg-gray-300"></span> <span className="capitalize">{role}</span>
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link to="/profile" className="bg-surface p-6 rounded-xl border border-gray-200 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                        <UserCircle size={24} />
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">Profile</div>
                    <div className="text-sm text-gray-500 mb-4 h-10">View and update your personal information and details.</div>
                    <div className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Manage Profile <ArrowRight size={16} /></div>
                </Link>

                <Link to="/attendance" className="bg-surface p-6 rounded-xl border border-gray-200 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                        <CalendarCheck size={24} />
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">Attendance</div>
                    <div className="text-sm text-gray-500 mb-4 h-10">Check-in, check-out, and view your daily logs.</div>
                    <div className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">View Logs <ArrowRight size={16} /></div>
                </Link>

                <Link to="/leave" className="bg-surface p-6 rounded-xl border border-gray-200 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                        <FileText size={24} />
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">Leave Requests</div>
                    <div className="text-sm text-gray-500 mb-4 h-10">Apply for leaves and check your request status.</div>
                    <div className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Apply Leave <ArrowRight size={16} /></div>
                </Link>

                <div onClick={handleLogout} className="bg-red-50/50 p-6 rounded-xl border border-red-100 shadow-sm hover:border-red-300 hover:bg-red-50 hover:shadow-md transition-all group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
                        <LogOut size={24} />
                    </div>
                    <div className="text-lg font-semibold text-red-700 mb-2">Logout</div>
                    <div className="text-sm text-red-600/70 mb-4 h-10">Securely sign out of your account right now.</div>
                    <div className="text-red-700 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Sign Out <ArrowRight size={16} /></div>
                </div>
            </div>

            <section className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                    <Activity size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                </div>
                <ul className="divide-y divide-gray-100 p-0 m-0">
                    <li className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                            Checked in successfully
                        </span>
                        <span className="text-xs text-gray-500 font-medium">Today at 9:02 AM</span>
                    </li>
                    <li className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>
                            Leave request approved
                        </span>
                        <span className="text-xs text-gray-500 font-medium">Yesterday</span>
                    </li>
                    <li className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-amber-500 block"></span>
                            Checked out
                        </span>
                        <span className="text-xs text-gray-500 font-medium">Aug 20 at 5:15 PM</span>
                    </li>
                    <li className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-purple-500 block"></span>
                            Profile information updated
                        </span>
                        <span className="text-xs text-gray-500 font-medium">Aug 15</span>
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;