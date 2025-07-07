import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PendingTask } from '../pages/PendingTask';
import { CreateContainer } from '../pages/CreateContainer';
import { ViewContainers } from '../pages/ViewContainers';
import { EditContainer } from '../pages/EditContainer';
import { ExportedContainers } from '../pages/ExportedContainers';
import { LoginMS } from '../pages/loginMS/LoginMS';
import { ProtectedRouteMS } from '../pages/loginMS/ProtectedRouteMS';
import { Unauthorized } from '../pages/loginMS/Unauthorized';
import { authLoader, adminLoader } from './loaders';

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginMS />,
  },
  {
    path: "/",
    element: <ProtectedRouteMS allowedRoles={['Admin', 'Viewer']} />,
    loader: authLoader,
    children: [
      {
        index: true,
        element: <Navigate to="/pending-task" replace />,
      },
      {
        path: "pending-task",
        element: <PendingTask />,
      },
      {
        path: "view-containers",
        element: <ViewContainers />,
      },
      {
        path: "exported-containers",
        element: <ExportedContainers />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRouteMS allowedRoles={['Admin']} />,
    loader: adminLoader,
    children: [
      {
        path: "create",
        element: <CreateContainer />,
      },
      {
        path: "edit-container/:id",
        element: <EditContainer />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
