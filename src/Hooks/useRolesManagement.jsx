import { useEffect, useState } from 'react';
import { rolesService } from '../services';

export const MODULE_OPTIONS = [
	{ value: 'view_containers', label: 'View Containers' },
	{ value: 'exported_containers', label: 'Exported Containers' },
	{ value: 'create_container', label: 'Create Container' },
	{ value: 'edit_container', label: 'Edit Container' },
	{ value: 'pending_task', label: 'Pending Task' },
	{ value: 'announcements', label: 'Announcements' },
	{ value: 'users', label: 'Users & Roles' },
];

export function useRolesManagement() {
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchRoles = async () => {
		try {
			setLoading(true);
			const data = await rolesService.getRoles();
			setRoles(data);
			setError(null);
		} catch (e) {
			setError(e.message || 'Failed to fetch roles');
		} finally {
			setLoading(false);
		}
	};

	const createRole = async (name, modules) => {
		try {
			const role = await rolesService.createRole(name, modules);
			setRoles((prev) => [...prev, role]);
			return { success: true };
		} catch (e) {
			return { success: false, error: e.message || 'Failed to create role' };
		}
	};

	const updateRoleModules = async (roleId, modules) => {
		try {
			const updated = await rolesService.updateRoleModules(roleId, modules);
			setRoles((prev) => prev.map((r) => (r.id === roleId ? updated : r)));
			return { success: true };
		} catch (e) {
			return { success: false, error: e.message || 'Failed to update role modules' };
		}
	};

	const deleteRole = async (roleId) => {
		try {
			await rolesService.deleteRole(roleId);
			setRoles((prev) => prev.filter((r) => r.id !== roleId));
			return { success: true };
		} catch (e) {
			return { success: false, error: e.message || 'Failed to delete role' };
		}
	};

	useEffect(() => {
		fetchRoles();
	}, []);

	return { roles, loading, error, createRole, updateRoleModules, deleteRole, refetch: fetchRoles };
}
