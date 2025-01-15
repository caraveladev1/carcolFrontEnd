import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/consts';
import { Loader } from './Loader';

export function ProtectedRoute({ children }) {
	const [isValid, setIsValid] = useState(null);
	const token = localStorage.getItem('token');
	const role = localStorage.getItem('role');
	const username = localStorage.getItem('username');

	useEffect(() => {
		if (!token || !role || !username) {
			setIsValid(false);
			return;
		}

		const validateTokenAndRole = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}api/auth/validate-token`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ role, username }),
				});

				if (response.ok) {
					setIsValid(true);
				} else {
					setIsValid(false);
				}
			} catch (error) {
				console.error('Error validating token and role:', error);
				setIsValid(false);
			}
		};

		validateTokenAndRole();
	}, [token, role, username]);

	if (isValid === null) {
		return <Loader />;
	}

	if (!isValid) {
		return <Navigate to='/login' />;
	}

	return children;
}
