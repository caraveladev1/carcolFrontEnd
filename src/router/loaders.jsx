import { authService } from '../services/index.js';
import { redirect } from 'react-router-dom';

// Loader para verificar autenticación
export const authLoader = async () => {
  try {
    const result = await authService.checkProtectedRoute();
    return result;
  } catch (error) {
    // Si no está autenticado, redirigir a login
    throw redirect('/login');
  }
};

// Loader para validar roles específicos
export const roleLoader = (allowedRoles) => async () => {
  try {
    const result = await authService.checkProtectedRoute();
    
    // Aquí puedes agregar lógica adicional para verificar roles específicos
    // Por ejemplo, si el resultado incluye información del rol del usuario
    
    return result;
  } catch (error) {
    throw redirect('/login');
  }
};

// Loader para rutas de admin únicamente
export const adminLoader = async () => {
  try {
    const result = await authService.checkProtectedRoute();
    
    // Aquí puedes agregar verificación específica de rol admin
    // Si no es admin, redirigir a unauthorized
    
    return result;
  } catch (error) {
    throw redirect('/login');
  }
};
