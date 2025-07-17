// Configuración centralizada de rutas y permisos
export const ROUTES_CONFIG = {
  '/': { 
    public: true, 
    component: 'LoginMS',
    label: 'login'
  },
  '/unauthorized': { 
    public: true, 
    component: 'Unauthorized',
    label: 'unauthorized'
  },
  '/view-containers': { 
    permissions: ['containers.view'], 
    component: 'ViewContainers',
    label: 'viewContainers',
    category: 'Contenedores',
    colorClass: 'text-yellow hover:border-yellow'
  },
  '/pending-task': { 
    permissions: ['tasks.view'], 
    component: 'PendingTask',
    label: 'pendingTasks',
    category: 'Contenedores',
    colorClass: 'text-celeste hover:border-celeste'
  },
  '/create': { 
    permissions: ['containers.create'], 
    component: 'CreateContainer',
    label: 'createContainers',
    category: 'Contenedores',
    colorClass: 'text-pink hover:border-pink'
  },
  '/edit-container/:id': { 
    permissions: ['containers.edit'], 
    component: 'EditContainer',
    label: 'editContainer',
    category: 'Contenedores',
    colorClass: 'text-purple hover:border-purple',
    hideFromMenu: true // No mostrar en el menú principal
  },
  '/exported-containers': { 
    permissions: ['containers.view'], 
    component: 'ExportedContainers',
    label: 'exportedContainers',
    category: 'Contenedores',
    colorClass: 'text-beige hover:border-beige'
  },
  '/announcements/:ico?': { 
    permissions: ['announcements.view'], 
    component: 'AnnouncementsPage',
    label: 'addAnnouncements',
    category: 'Contenedores',
    colorClass: 'text-naranja hover:border-naranja',
    path: '/announcements' // Ruta base para el menú
  },
  '/admin/manage-users': { 
    permissions: ['users.view'], 
    component: 'ManageUsers',
    label: 'manageUsers',
    category: 'Usuarios',
    colorClass: 'text-pink hover:border-pink'
  }
};

// Ruta por defecto cuando el usuario está autenticado
export const DEFAULT_AUTHENTICATED_ROUTE = '/view-containers';

// Ruta por defecto cuando el usuario no está autenticado
export const DEFAULT_UNAUTHENTICATED_ROUTE = '/';
