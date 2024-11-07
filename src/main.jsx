import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Home } from './pages/Home';
import '../I18n';
import { createBrowserRouter, RouterProvider, Route, createHashRouter } from 'react-router-dom';
import { CreateContainer } from './pages/CreateContainer';
import { ViewContainers } from './pages/ViewContainers';
import { EditContainer } from './pages/EditContainer';
import { ExportedContainers } from './pages/ExportedContainers';

// Definir las rutas directamente en createBrowserRouter
const router = createHashRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/create',
		element: <CreateContainer />,
	},
	{
		path: '/view-containers',
		element: <ViewContainers />,
	},
	{
		path: '/edit-container/:id',
		element: <EditContainer />,
	},
	{
		path: '/exported-containers',
		element: <ExportedContainers />,
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
