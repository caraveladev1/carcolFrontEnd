import { useEffect, useState } from 'react';
import { authValidationService } from '../services';

export const useAuthValidation = () => {
	const [isValid, setIsValid] = useState(null);
	const { token, role, username } = authValidationService.getStoredCredentials();

	useEffect(() => {
		if (!authValidationService.hasRequiredCredentials(token, role, username)) {
			setIsValid(false);
			return;
		}

		const validateAuth = async () => {
			try {
				const isValidAuth = await authValidationService.validateTokenAndRole(token, role, username);
				setIsValid(isValidAuth);
			} catch (error) {
				console.error('Error validating token and role:', error);
				setIsValid(false);
			}
		};

		validateAuth();
	}, [token, role, username]);

	return isValid;
};