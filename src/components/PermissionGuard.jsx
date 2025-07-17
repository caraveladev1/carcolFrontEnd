import React from 'react';
import { useRouteAccess } from '../hooks/useRouteAccess.jsx';

/**
 * Componente para mostrar/ocultar elementos basado en permisos
 * @param {string|string[]} permissions - Permiso(s) requerido(s)
 * @param {React.ReactNode} children - Contenido a mostrar si tiene permisos
 * @param {React.ReactNode} fallback - Contenido alternativo si no tiene permisos
 * @param {boolean} requireAll - Si es true, requiere todos los permisos. Si es false, requiere al menos uno
 */
export const PermissionGuard = ({ 
  permissions, 
  children, 
  fallback = null, 
  requireAll = false 
}) => {
  const { hasPermission } = useRouteAccess();
  
  if (!permissions) {
    return children;
  }
  
  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  
  const hasAccess = requireAll 
    ? permissionArray.every(permission => hasPermission(permission))
    : permissionArray.some(permission => hasPermission(permission));
  
  return hasAccess ? children : fallback;
};

/**
 * Componente para mostrar/ocultar elementos basado en acceso a rutas
 * @param {string} route - Ruta a verificar
 * @param {React.ReactNode} children - Contenido a mostrar si tiene acceso
 * @param {React.ReactNode} fallback - Contenido alternativo si no tiene acceso
 */
export const RouteGuard = ({ route, children, fallback = null }) => {
  const { canAccessRoute } = useRouteAccess();
  
  const hasAccess = canAccessRoute(route);
  
  return hasAccess ? children : fallback;
};
