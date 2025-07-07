import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from './Loader';
import { useAuthValidation } from '../Hooks';

export function ProtectedRoute({ children }) {
	const isValid = useAuthValidation();

	if (isValid === null) {
		return <Loader />;
	}

	if (!isValid) {
		return <Navigate to='/login' />;
	}

	return children;
}
