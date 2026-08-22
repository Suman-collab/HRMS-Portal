import { Link } from 'react-router-dom';

export default function Sidebar() {
  const role = localStorage.getItem('role');

  return (
    <aside style={{ width: '220px', padding: '1rem', background: '#f8fafc', height: '100vh', borderRight: '1px solid #e2e8f0' }}>
      <h3>Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {role === 'employee' && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/attendance">Attendance</Link></li>
            <li><Link to="/leave">Leave</Link></li>
            <li><Link to="/payroll">Payroll</Link></li>
          </>
        )}
        {role === 'admin' && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/employees">Employees</Link></li>
            <li><Link to="/admin/attendance">Company Attendance</Link></li>
            <li><Link to="/admin/leave-approvals">Leave Approvals</Link></li>
          </>
        )}
      </ul>
    </aside>
  );
}