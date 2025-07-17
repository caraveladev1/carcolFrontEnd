import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService, userService } from '../services/index.js';
import { DEFAULT_AUTHENTICATED_ROUTE, DEFAULT_UNAUTHENTICATED_ROUTE } from '../config/routes.js';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await authService.checkProtectedRoute();
        setUser(authData.user);
        
        // Obtener permisos del usuario desde el backend
        try {
          const permissionsData = await userService.getUserPermissions();
          setPermissions(permissionsData.permissions || []);
        } catch (permError) {
          console.error('Error fetching permissions:', permError);
          setPermissions([]);
        }
        
        // Solo redirigir si estamos en la página de login
        if (location.pathname === '/') {
          navigate(DEFAULT_AUTHENTICATED_ROUTE, { replace: true });
        }
      } catch (error) {
        // Usuario no autenticado
        setUser(null);
        setPermissions([]);
        
        // Solo redirigir a login si no estamos ya en una ruta pública
        if (location.pathname !== '/' && location.pathname !== '/unauthorized') {
          navigate(DEFAULT_UNAUTHENTICATED_ROUTE, { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

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
      setPermissions([]);
      navigate(DEFAULT_UNAUTHENTICATED_ROUTE);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    permissions,
    isAuthenticated,
    loading,
    login,
    logout,
  };
};