import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '../I18n';

import { LoginMS } from './pages/loginMS/LoginMS';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PermissionProtectedRoute } from './components/PermissionProtectedRoute';
import { Unauthorized } from './pages/loginMS/Unauthorized';
import { routeConfig } from './config/routePermissions';
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<HashRouter>
			<Routes>
				{/* Ruta pública */}
				<Route path='/login' element={<LoginMS />} />

				{/* Rutas protegidas generadas dinámicamente */}
				<Route element={<ProtectedRoute />}>
					{Object.entries(routeConfig).map(([path, config]) => (
						<Route
							key={path}
							element={<PermissionProtectedRoute requiredPermissions={config.permissions} />}
						>
							<Route path={path} element={createElement(config.component)} />
						</Route>
					))}
					<Route path='/unauthorized' element={<Unauthorized />} />
				</Route>
				<Route path='*' element={<Navigate to='/login' replace />} />
			</Routes>
		</HashRouter>
	</StrictMode>,
);
