import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '../Hooks/usePermissions';
import { Loader } from './Loader';

export function PermissionProtectedRoute({ requiredPermissions = [] }) {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return <Loader />;
  }

  // Check if user has at least one of the required permissions
  const hasAccess = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => hasPermission(permission));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}