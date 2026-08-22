import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Checks for valid auth state and role mapping.
 * Redirects unauthenticated users to /login.
 * Redirects authenticated users without the matching role to their specific dashboard.
 */
export default function ProtectedRoute({ role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // If no auth token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and it doesn't match
  if (role && userRole !== role) {
    // Redirect to the appropriate dashboard based on their actual role
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Authenticated and strictly authorized -> render the children routes
  return <Outlet />;
}