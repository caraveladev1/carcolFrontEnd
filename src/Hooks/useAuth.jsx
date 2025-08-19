import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService, userService } from '../services/index.js';
import { DEFAULT_AUTHENTICATED_ROUTE, DEFAULT_UNAUTHENTICATED_ROUTE } from '../config/routes.js';

// CONTEXTO GLOBAL DE AUTH
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useState(null);
	const [modules, setModules] = useState([]);
	const [loading, setLoading] = useState(true);

	const isAuthenticated = !!user;

	useEffect(() => {
		let ignore = false;
		const checkAuth = async () => {
			try {
				const authData = await authService.checkProtectedRoute();
				if (!ignore) setUser(authData.user);
				// Obtener módulos del usuario desde el backend
				try {
					const modulesData = await userService.getUserModules();
					if (!ignore) setModules(modulesData.modules || []);
				} catch (modError) {
					console.error('Error fetching modules:', modError);
					if (!ignore) setModules([]);
				}
				// Solo redirigir si estamos en la página de login
				if (location.pathname === '/') {
					navigate(DEFAULT_AUTHENTICATED_ROUTE, { replace: true });
				}
			} catch (error) {
				// Usuario no autenticado
				if (!ignore) {
					setUser(null);
					setModules([]);
				}
				// Solo redirigir a login si no estamos ya en una ruta pública
				if (location.pathname !== '/' && location.pathname !== '/unauthorized') {
					navigate(DEFAULT_UNAUTHENTICATED_ROUTE, { replace: true });
				}
			} finally {
				if (!ignore) setLoading(false);
			}
		};
		checkAuth();
		return () => {
			ignore = true;
		};
		// Solo se ejecuta una vez al montar el provider
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (!loading) {
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');
			if (code) {
				window.history.replaceState({}, document.title, window.location.pathname);
				authService.redirect(code);
			}
		}
	}, [loading]);

	const login = () => {
		authService.login();
	};

	const logout = async () => {
		try {
			await authService.logout();
			setUser(null);
			setModules([]);
			navigate(DEFAULT_UNAUTHENTICATED_ROUTE);
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				modules,
				isAuthenticated,
				loading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// HOOK PARA CONSUMIR EL CONTEXTO
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe usarse dentro de <AuthProvider>');
	}
	return context;
};
