import { useState, useEffect } from 'react';
import { userService } from '../services';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await userService.getUserPermissions();
        setPermissions(data.permissions);
        setRole(data.role);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions([]);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  return {
    permissions,
    role,
    loading,
    hasPermission
  };
};