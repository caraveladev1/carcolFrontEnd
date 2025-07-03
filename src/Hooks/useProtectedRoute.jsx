import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/index.js';

export const useProtectedRoute = (allowedRoles) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.checkProtectedRoute();
        setAuthorized(true);
        setRole(data.user.role);
      } catch (error) {
        setAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (authorized === false) {
      navigate('/login');
    } else if (authorized && role && !allowedRoles.includes(role)) {
      navigate('/unauthorized');
    }
  }, [authorized, role, allowedRoles, navigate]);

  return {
    authorized,
    role,
  };
};