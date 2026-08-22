import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute Component Stub
 * Handles route protection based on authentication status and allowed user roles.
 * Replace mock values with actual auth context / state in subsequent phases.
 */
const ProtectedRoute = ({ allowedRoles = [], redirectPath = '/login' }) => {
  const location = useLocation();

  // Stub authentication state (set isAuthenticated to true by default for structure testing)
  const isAuthenticated = true;
  const userRole = 'employee'; // 'employee' | 'admin'

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
