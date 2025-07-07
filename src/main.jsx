import { RouterProvider } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '../I18n';
import { router } from './router';
import { RouterLoader } from './components/RouterLoader';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} fallbackElement={<RouterLoader />} />
	</StrictMode>,
);
