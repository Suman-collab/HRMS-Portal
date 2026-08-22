import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  CreditCard,
  UserCircle
} from 'lucide-react';

export default function Sidebar() {
  const role = localStorage.getItem('role') || 'employee';
  const location = useLocation();

  const employeeLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Profile', path: '/profile', icon: <UserCircle size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <CalendarCheck size={20} /> },
    { name: 'Leave API', path: '/leave', icon: <FileText size={20} /> },
    { name: 'My Payroll', path: '/payroll', icon: <CreditCard size={20} /> },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Employees', path: '/admin/employees', icon: <Users size={20} /> },
    { name: 'Company Log', path: '/admin/attendance', icon: <CalendarCheck size={20} /> },
    { name: 'Leave Queue', path: '/admin/leave-approvals', icon: <FileText size={20} /> },
  ];

  const links = role === 'admin' ? adminLinks : employeeLinks;

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="w-64 bg-surface border-r border-gray-200 h-[calc(100vh-61px)] flex-shrink-0 hidden md:block">
      <div className="h-full overflow-y-auto py-6 px-4">
        <div className="mb-4 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {role === 'admin' ? 'Administration' : 'Employee Tools'}
        </div>
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}