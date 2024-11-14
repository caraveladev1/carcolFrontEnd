import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Home } from './pages/Home';
import '../I18n';
import { createHashRouter, RouterProvider, Route } from 'react-router-dom';
import { CreateContainer } from './pages/CreateContainer';
import { ViewContainers } from './pages/ViewContainers';
import { EditContainer } from './pages/EditContainer';
import { ExportedContainers } from './pages/ExportedContainers';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute'; // Importa el componente ProtectedRoute

// Definir las rutas directamente en createHashRouter
const router = createHashRouter([
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<Home />
			</ProtectedRoute>
		),
	},
	{
		path: '/create',
		element: (
			<ProtectedRoute>
				<CreateContainer />
			</ProtectedRoute>
		),
	},
	{
		path: '/view-containers',
		element: (
			<ProtectedRoute>
				<ViewContainers />
			</ProtectedRoute>
		),
	},
	{
		path: '/edit-container/:id',
		element: (
			<ProtectedRoute>
				<EditContainer />
			</ProtectedRoute>
		),
	},
	{
		path: '/exported-containers',
		element: (
			<ProtectedRoute>
				<ExportedContainers />
			</ProtectedRoute>
		),
	},
	{
		path: '/*',
		element: <Home />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
