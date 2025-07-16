import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '../I18n';

import { PendingTask } from './pages/PendingTask';
import { CreateContainer } from './pages/CreateContainer';
import { ViewContainers } from './pages/ViewContainers';
import { EditContainer } from './pages/EditContainer';
import { ExportedContainers } from './pages/ExportedContainers';
import { ManageUsers } from './pages/ManageUsers';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { LoginMS } from './pages/loginMS/LoginMS';
import { PermissionProtectedRoute } from './components/PermissionProtectedRoute';
import { Unauthorized } from './pages/loginMS/Unauthorized';
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				{/* Ruta pública */}
				<Route path='/' element={<LoginMS />} />

				{/* Rutas protegidas basadas en permisos */}
				{/* Rutas que requieren containers.view */}
				<Route element={<PermissionProtectedRoute requiredPermissions={['containers.view']} />}>
					<Route path='/view-containers' element={<ViewContainers />} />
					<Route path='/exported-containers' element={<ExportedContainers />} />
					<Route path='/announcements/:ico?' element={<AnnouncementsPage />} />
				</Route>

				{/* Rutas que requieren tasks.view */}
				<Route element={<PermissionProtectedRoute requiredPermissions={['tasks.view']} />}>
					<Route path='/pending-task' element={<PendingTask />} />
				</Route>

				{/* Rutas que requieren containers.create/edit */}
				<Route element={<PermissionProtectedRoute requiredPermissions={['containers.create']} />}>
					<Route path='/create' element={<CreateContainer />} />
				</Route>
				<Route element={<PermissionProtectedRoute requiredPermissions={['containers.edit']} />}>
					<Route path='/edit-container/:id' element={<EditContainer />} />
				</Route>

				{/* Rutas que requieren users.view */}
				<Route element={<PermissionProtectedRoute requiredPermissions={['users.view']} />}>
					<Route path='/admin/manage-users' element={<ManageUsers />} />
				</Route>

				<Route path='/unauthorized' element={<Unauthorized />} />
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
