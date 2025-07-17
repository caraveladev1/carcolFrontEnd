import { useAuth } from '../Hooks/useAuth.jsx';
import { ROUTES_CONFIG } from '../config/routes.js';

export const useRouteAccess = () => {
  const { permissions, isAuthenticated } = useAuth();

  /**
   * Verifica si el usuario puede acceder a una ruta específica
   * @param {string} routePath - La ruta a verificar
   * @returns {boolean} - True si puede acceder, false si no
   */
  const canAccessRoute = (routePath) => {
    const route = ROUTES_CONFIG[routePath];
    if (!route) return false;
    
    // Si es una ruta pública, siempre se puede acceder
    if (route.public) return true;
    
    // Si no está autenticado, no puede acceder a rutas protegidas
    if (!isAuthenticated) return false;
    
    // Si no tiene permisos definidos, se considera accesible para usuarios autenticados
    if (!route.permissions || route.permissions.length === 0) return true;
    
    // Verificar si tiene al menos uno de los permisos requeridos
    return route.permissions.some(permission => permissions.includes(permission));
  };

  /**
   * Obtiene todas las rutas accesibles para el usuario actual
   * @returns {Array} - Array de rutas accesibles
   */
  const getAccessibleRoutes = () => {
    return Object.entries(ROUTES_CONFIG)
      .filter(([path]) => canAccessRoute(path))
      .map(([path, config]) => ({
        path,
        ...config
      }));
  };

  /**
   * Obtiene las rutas accesibles para el menú (excluyendo las marcadas como hideFromMenu)
   * @returns {Array} - Array de rutas para mostrar en el menú
   */
  const getMenuRoutes = () => {
    return getAccessibleRoutes()
      .filter(route => !route.hideFromMenu && !route.public)
      .reduce((groups, route) => {
        const category = route.category || 'General';
        if (!groups[category]) {
          groups[category] = [];
        }
        // Usar la ruta base para el menú si está definida
        const menuRoute = {
          ...route,
          path: route.path || route.path
        };
        groups[category].push(menuRoute);
        return groups;
      }, {});
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param {string} permission - El permiso a verificar
   * @returns {boolean} - True si tiene el permiso, false si no
   */
  const hasPermission = (permission) => {
    if (!isAuthenticated) return false;
    return permissions.includes(permission);
  };

  return {
    canAccessRoute,
    getAccessibleRoutes,
    getMenuRoutes,
    hasPermission
  };
};
