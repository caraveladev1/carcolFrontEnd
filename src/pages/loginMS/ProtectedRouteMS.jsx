import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoleContext } from '../../Hooks/RoleContext.js';
import { useProtectedRoute } from '../../hooks';

export function ProtectedRouteMS({ allowedRoles }) {
	const { authorized, role } = useProtectedRoute(allowedRoles);

	if (authorized === null) return null;

	return (
		<RoleContext.Provider value={role}>
			<Outlet />
		</RoleContext.Provider>
	);
}
