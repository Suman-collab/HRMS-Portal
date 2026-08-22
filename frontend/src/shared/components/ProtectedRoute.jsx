import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Stub: Always authenticate for now
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}