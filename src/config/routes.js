// Configuración centralizada de rutas y módulos
export const ROUTES_CONFIG = {
	'/': { isPublic: true, component: 'LoginMS', label: 'login' },
	'/unauthorized': { isPublic: true, component: 'Unauthorized', label: 'unauthorized' },

	// Containers
	'/containers/view': {
		module: 'view_containers',
		component: 'ViewContainers',
		label: 'viewContainers',
		category: 'Contenedores',
		colorClass: 'text-yellow hover:border-yellow',
	},
	'/tasks/pending': {
		module: 'pending_task',
		component: 'PendingTask',
		label: 'pendingTasks',
		category: 'Contenedores',
		colorClass: 'text-celeste hover:border-celeste',
	},
	'/containers/create': {
		module: 'create_container',
		component: 'CreateContainer',
		label: 'createContainers',
		category: 'Contenedores',
		colorClass: 'text-pink hover:border-pink',
	},
	'/containers/:id/edit': {
		module: 'edit_container',
		component: 'EditContainer',
		label: 'editContainer',
		category: 'Contenedores',
		colorClass: 'text-purple hover:border-purple',
		hideFromMenu: true,
	},
	'/containers/exported': {
		module: 'exported_containers',
		component: 'ExportedContainers',
		label: 'exportedContainers',
		category: 'Contenedores',
		colorClass: 'text-beige hover:border-beige',
	},

	// Announcements
	'/announcements/:ico?': {
		module: 'announcements',
		component: 'AnnouncementsPage',
		label: 'addAnnouncements',
		category: 'Contenedores',
		colorClass: 'text-naranja hover:border-naranja',
		path: '/announcements',
	},

	// Admin
	'/admin/manage-users': {
		module: 'users',
		component: 'ManageUsers',
		label: 'manageUsers',
		category: 'Usuarios',
		colorClass: 'text-pink hover:border-pink',
	},
	'/admin/manage-roles': {
		module: 'users',
		component: 'ManageRoles',
		label: 'manage Roles',
		category: 'Usuarios',
		colorClass: 'text-pink hover:border-pink',
	},
};

export const DEFAULT_AUTHENTICATED_ROUTE = '/containers/view';
export const DEFAULT_UNAUTHENTICATED_ROUTE = '/';
