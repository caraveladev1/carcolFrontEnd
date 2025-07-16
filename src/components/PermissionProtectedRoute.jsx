import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '../Hooks/usePermissions';
import { Loader } from './Loader';

export function PermissionProtectedRoute({ requiredPermissions = [] }) {
  const { hasPermission, loading, permissions, role } = usePermissions();

  if (loading) {
    return <Loader />;
  }

  // If no permissions and no role, user is likely not authenticated
  if (!permissions.length && !role) {
    return <Navigate to="/" replace />;
  }

  // Check if user has at least one of the required permissions
  const hasAccess = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => hasPermission(permission));

  // If authenticated but no permissions, redirect to home instead of unauthorized
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// PermissionGate component integrated here
export function PermissionGate({ permission, children, fallback = null, showSkeleton = false }) {
  const { hasPermission, loading } = usePermissions();

  if (loading && showSkeleton) {
    // Show skeleton/placeholder while loading
    return (
      <div className="animate-pulse">
        <div className="w-full h-14 bg-beige/20 border-l-4 border-transparent"></div>
      </div>
    );
  }

  if (loading && !showSkeleton) {
    return null;
  }

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
}