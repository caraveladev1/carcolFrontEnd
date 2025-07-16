import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services';

const PermissionsContext = createContext();

export const usePermissionsContext = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }
  return context;
};

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserPermissions();
        setPermissions(data.permissions || []);
        setRole(data.role);
        setError(null);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions([]);
        setRole(null);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const value = {
    permissions,
    role,
    loading,
    error,
    hasPermission
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  return usePermissionsContext();
};