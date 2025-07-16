import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/index.js';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.checkProtectedRoute();
        // Only redirect to view-containers if we're on the login page
        if (location.pathname === '/') {
          navigate('/view-containers', { replace: true });
        }
      } catch (error) {
        // User is not authenticated, stay on login page
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (!checking) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        window.history.replaceState({}, document.title, window.location.pathname);
        authService.redirect(code);
      }
    }
  }, [checking]);

  const login = () => {
    authService.login();
  };

  const logout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    checking,
    login,
    logout,
  };
};