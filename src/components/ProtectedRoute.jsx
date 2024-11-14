import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/consts';

export function ProtectedRoute({ children }) {
	const [isValid, setIsValid] = useState(null);
	const token = localStorage.getItem('token');

	useEffect(() => {
		// Si no hay token, no se intenta validar y se marca como inválido.
		if (!token) {
			setIsValid(false);
			return;
		}

		const validateToken = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}api/auth/validate-token`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});

				if (response.ok) {
					setIsValid(true);
				} else {
					setIsValid(false);
					//localStorage.removeItem('token'); // Elimina el token si es inválido
				}
			} catch (error) {
				console.error('Error validating token:', error);
				setIsValid(false);
			}
		};

		// Valida el token solo si está presente.
		if (token) {
			validateToken();
		}
	}, [token]);

	// Mientras se valida el token, muestra un estado de carga.
	if (isValid === null) {
		return <div>Loading...</div>;
	}

	// Si el token es inválido o no está presente, redirige al login.
	if (!isValid) {
		return <Navigate to='/login' />;
	}

	// Si el token es válido, muestra la ruta protegida.
	return children;
}
