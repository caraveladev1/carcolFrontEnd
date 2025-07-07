import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';

export const authValidationService = {
	async validateTokenAndRole(token, role, username) {
		try {
			await apiService.request(API_ENDPOINTS.VALIDATE_TOKEN, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ role, username }),
			});
			return true;
		} catch {
			return false;
		}
	},

	getStoredCredentials() {
		return {
			token: localStorage.getItem('token'),
			role: localStorage.getItem('role'),
			username: localStorage.getItem('username'),
		};
	},

	hasRequiredCredentials(token, role, username) {
		return !!(token && role && username);
	},
};