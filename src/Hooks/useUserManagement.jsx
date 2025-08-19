import { useState, useEffect } from 'react';
import { userService } from '../services';

export const useUserManagement = () => {
	const [users, setUsers] = useState([]);
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const [usersData, rolesData] = await Promise.all([userService.getUsers(), userService.getRoles()]);
			setUsers(usersData);
			setRoles(rolesData);
			setError(null);
		} catch (err) {
			setError('Failed to fetch users');
			console.error('Error fetching users:', err);
		} finally {
			setLoading(false);
		}
	};

	const createUser = async (email, roleId) => {
		try {
			const newUser = await userService.createUser(email, roleId);
			setUsers((prev) => [...prev, newUser]);
			return { success: true };
		} catch (err) {
			const errorMsg = err.message || 'Failed to create user';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		}
	};

	const updateUserRole = async (userId, roleId) => {
		try {
			const updatedUser = await userService.updateUserRole(userId, roleId);
			setUsers((prev) => prev.map((user) => (user.id === userId ? updatedUser : user)));
			return { success: true };
		} catch (err) {
			const errorMsg = err.message || 'Failed to update user role';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		}
	};

	const deleteUser = async (userId) => {
		try {
			await userService.deleteUser(userId);
			setUsers((prev) => prev.filter((u) => u.id !== userId));
			return { success: true };
		} catch (err) {
			const errorMsg = err.message || 'Failed to delete user';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return {
		users,
		roles,
		loading,
		error,
		createUser,
		updateUserRole,
		deleteUser,
		refetch: fetchUsers,
	};
};
