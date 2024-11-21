import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Home } from './pages/Home';
import '../I18n';
import { HashRouter, Routes, Route } from 'react-router-dom'; // Importa BrowserRouter, Routes y Route
import { CreateContainer } from './pages/CreateContainer';
import { ViewContainers } from './pages/ViewContainers';
import { EditContainer } from './pages/EditContainer';
import { ExportedContainers } from './pages/ExportedContainers';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute'; // Importa el componente ProtectedRoute

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<HashRouter>
			{' '}
			{/* Usamos BrowserRouter aquí */}
			<Routes>
				{' '}
				{/* Usamos Routes en lugar de definir el router directamente */}
				<Route path='/login' element={<Login />} />
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/create'
					element={
						<ProtectedRoute>
							<CreateContainer />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/view-containers'
					element={
						<ProtectedRoute>
							<ViewContainers />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/edit-container/:id'
					element={
						<ProtectedRoute>
							<EditContainer />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/exported-containers'
					element={
						<ProtectedRoute>
							<ExportedContainers />
						</ProtectedRoute>
					}
				/>
				<Route path='/*' element={<Home />} /> {/* Ruta comodín para redirigir */}
			</Routes>
		</HashRouter>
	</React.StrictMode>,
);
