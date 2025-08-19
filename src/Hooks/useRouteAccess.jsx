import { useAuth } from '../Hooks/useAuth.jsx';
import { ROUTES_CONFIG } from '../config/routes.js';

export const useRouteAccess = () => {
	const { modules, isAuthenticated } = useAuth();

	/**
	 * Verifica si el usuario puede acceder a una ruta específica
	 * @param {string} routePath - La ruta a verificar
	 * @returns {boolean} - True si puede acceder, false si no
	 */
	const canAccessRoute = (routePath) => {
		const route = ROUTES_CONFIG[routePath];
		if (!route) return false;
		// Si es una ruta pública, siempre se puede acceder
		if (route.isPublic || route.public) return true;

		// Si no está autenticado, no puede acceder a rutas protegidas
		if (!isAuthenticated) return false;
		// Si no tiene módulo definido, se considera accesible para usuarios autenticados
		if (!route.module) return true;
		// Verificar si tiene el módulo requerido
		return modules.includes(route.module);
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
				...config,
			}));
	};

	/**
	 * Obtiene las rutas accesibles para el menú (excluyendo las marcadas como hideFromMenu)
	 * @returns {Array} - Array de rutas para mostrar en el menú
	 */
	const getMenuRoutes = () => {
		return getAccessibleRoutes()
			.filter(
				(route) =>
					// Excluir públicas y ocultas
					!route.hideFromMenu &&
					!(route.isPublic || route.public) &&
					// Requerir label, component y path válido distinto a '/'
					route.label &&
					route.component &&
					typeof route.path === 'string' &&
					route.path !== '/',
			)
			.reduce((groups, route) => {
				const category = route.category || 'General';
				if (!groups[category]) groups[category] = [];
				groups[category].push(route);
				return groups;
			}, {});
	};

	/**
	 * Verifica si el usuario tiene un permiso específico
	 * @param {string} permission - El permiso a verificar
	 * @returns {boolean} - True si tiene el permiso, false si no
	 */
	const hasPermission = (moduleKey) => {
		if (!isAuthenticated) return false;
		return modules.includes(moduleKey);
	};

	return {
		canAccessRoute,
		getAccessibleRoutes,
		getMenuRoutes,
		hasPermission,
	};
};
