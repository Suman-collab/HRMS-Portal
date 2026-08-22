import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Route Wrapper
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';

// Employee Pages
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Profile from './pages/profile/Profile.jsx';
import Attendance from './pages/attendance/Attendance.jsx';
import Leave from './pages/leave/Leave.jsx';
import Payroll from './pages/payroll/Payroll.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminEmployees from './pages/admin/AdminEmployees.jsx';
import AdminLeaveApprovals from './pages/admin/AdminLeaveApprovals.jsx';

// Fallback Page
import NotFound from './pages/NotFound.jsx';

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
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<AdminEmployees />} />
              <Route path="/admin/leave-approvals" element={<AdminLeaveApprovals />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
