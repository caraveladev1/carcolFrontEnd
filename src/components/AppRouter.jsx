import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth.jsx';
import { useRouteAccess } from '../hooks/useRouteAccess.jsx';
import { ROUTES_CONFIG, DEFAULT_AUTHENTICATED_ROUTE } from '../config/routes.js';
import { Loader } from './Loader.jsx';

// Imports directos de componentes
import { LoginMS } from '../pages/loginMS/LoginMS.jsx';
import { Unauthorized } from '../pages/loginMS/Unauthorized.jsx';
import { ViewContainers } from '../pages/ViewContainers.jsx';
import { PendingTask } from '../pages/PendingTask.jsx';
import { CreateContainer } from '../pages/CreateContainer.jsx';
import { EditContainer } from '../pages/EditContainer.jsx';
import { ExportedContainers } from '../pages/ExportedContainers.jsx';
import { AnnouncementsPage } from '../pages/AnnouncementsPage.jsx';
import { ManageUsers } from '../pages/ManageUsers.jsx';

// Mapa de componentes
const COMPONENT_MAP = {
  'LoginMS': LoginMS,
  'Unauthorized': Unauthorized,
  'ViewContainers': ViewContainers,
  'PendingTask': PendingTask,
  'CreateContainer': CreateContainer,
  'EditContainer': EditContainer,
  'ExportedContainers': ExportedContainers,
  'AnnouncementsPage': AnnouncementsPage,
  'ManageUsers': ManageUsers
};

export const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();
  const { canAccessRoute } = useRouteAccess();

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {Object.entries(ROUTES_CONFIG).map(([path, config]) => {
        // Si no puede acceder a esta ruta, no la renderizamos
        if (!canAccessRoute(path)) {
          return null;
        }

        const Component = COMPONENT_MAP[config.component];
        if (!Component) {
          console.error(`Component ${config.component} not found in COMPONENT_MAP`);
          return null;
        }

        return (
          <Route 
            key={path} 
            path={path} 
            element={<Component />} 
          />
        );
      })}
      
      {/* Ruta por defecto - redirige según el estado de autenticación */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={isAuthenticated ? DEFAULT_AUTHENTICATED_ROUTE : "/"} 
            replace 
          />
        } 
      />
    </Routes>
  );
};
