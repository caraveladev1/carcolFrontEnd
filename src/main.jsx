import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Home } from './pages/Home';
import '../I18n';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import { CreateContainer } from './pages/CreateContainer';

// Definir las rutas directamente en createBrowserRouter
const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/create',
		element: <CreateContainer />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
