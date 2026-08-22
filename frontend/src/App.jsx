import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Route Wrapper
import Layout from './shared/components/Layout.jsx';
import ProtectedRoute from './shared/components/ProtectedRoute.jsx';

// Auth Pages
import Login from './auth/pages/Login.jsx';
import Signup from './auth/pages/Signup.jsx';

// Employee Pages
import Dashboard from './employee/pages/Dashboard.jsx';
import Profile from './employee/pages/Profile.jsx';
import Attendance from './employee/pages/Attendance.jsx';
import Leave from './employee/pages/Leave.jsx';
import Payroll from './employee/pages/Payroll.jsx';

// Admin Pages
import AdminDashboard from './admin/pages/AdminDashboard.jsx';
import EmployeeList from './admin/pages/EmployeeList.jsx';
import LeaveApprovals from './admin/pages/LeaveApprovals.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected App Routes wrapped in Layout Shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Default redirect to /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Employee Portal Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/payroll" element={<Payroll />} />

            {/* Admin Portal Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<EmployeeList />} />
            <Route path="/admin/leave-approvals" element={<LeaveApprovals />} />
          </Route>
        </Route>

        {/* 404 Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
