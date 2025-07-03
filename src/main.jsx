import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '../I18n';

import { PendingTask } from './pages/PendingTask';
import { CreateContainer } from './pages/CreateContainer';
import { ViewContainers } from './pages/ViewContainers';
import { EditContainer } from './pages/EditContainer';
import { ExportedContainers } from './pages/ExportedContainers';
import { LoginMS } from './pages/loginMS/LoginMS';
import { ProtectedRouteMS } from './pages/loginMS/ProtectedRouteMS';
import { Unauthorized } from './pages/loginMS/Unauthorized';
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<HashRouter>
			<Routes>
				{/* Ruta pública */}
				<Route path='/login' element={<LoginMS />} />

				{/* Rutas protegidas */}
				{/* Rutas protegidas para Admin y Viewer */}
				<Route element={<ProtectedRouteMS allowedRoles={['Admin', 'Viewer']} />}>
					<Route path='/pending-task' element={<PendingTask />} />
					<Route path='/view-containers' element={<ViewContainers />} />
					<Route path='/exported-containers' element={<ExportedContainers />} />
					<Route path='/unauthorized' element={<Unauthorized />} />
					{/* Ruta comodín */}
					<Route path='*' element={<Navigate to='/login' replace />} />
				</Route>

				{/* Rutas exclusivas de Admin */}
				<Route element={<ProtectedRouteMS allowedRoles={['Admin']} />}>
					<Route path='/create' element={<CreateContainer />} />
					<Route path='/edit-container/:id' element={<EditContainer />} />
				</Route>
			</Routes>
		</HashRouter>
	</StrictMode>,
);
