import React from 'react';
import { usePermissions } from '../Hooks/usePermissions';

export function PermissionGate({ permission, children, fallback = null }) {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return null;
  }

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
}