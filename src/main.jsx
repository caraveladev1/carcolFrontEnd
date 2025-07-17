
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '../I18n';
import { AppRouter } from './components/AppRouter.jsx';
import { AuthProvider } from './Hooks/useAuth.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<BrowserRouter>
	  <AuthProvider>
		<AppRouter />
	  </AuthProvider>
	</BrowserRouter>
  </StrictMode>,
);
