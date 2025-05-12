import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/consts';

export function ProtectedRouteMS({ allowedRoles }) {
	const navigate = useNavigate();
	const [authorized, setAuthorized] = useState(null);
	const [role, setRole] = useState(null);

	useEffect(() => {
		fetch(`${API_BASE_URL}api/microsoft/protected`, {
			method: 'GET',
			credentials: 'include',
		})
			.then(async (res) => {
				if (res.ok) {
					const data = await res.json();
					setAuthorized(true);
					setRole(data.user.role);
				} else {
					setAuthorized(false);
				}
			})
			.catch(() => setAuthorized(false));
	}, []);

	useEffect(() => {
		if (authorized === false) {
			navigate('/login');
		} else if (authorized && role && !allowedRoles.includes(role)) {
			navigate('/unauthorized');
		}
	}, [authorized, role, allowedRoles, navigate]);

	if (authorized === null) return null;

	return <Outlet />;
}
