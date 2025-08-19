import { apiService } from './apiService.js';
import { API_ENDPOINTS } from '../constants/api.js';

export const userService = {
	async getUsers() {
		return apiService.request(API_ENDPOINTS.USERS);
	},

	async createUser(email, roleId) {
		return apiService.request(API_ENDPOINTS.USERS, {
			method: 'POST',
			body: JSON.stringify({ email, roleId }),
		});
	},

	async updateUserRole(userId, roleId) {
		return apiService.request(`${API_ENDPOINTS.USERS}/${userId}/role`, {
			method: 'PUT',
			body: JSON.stringify({ roleId }),
		});
	},

	async getRoles() {
		return apiService.request(API_ENDPOINTS.USER_ROLES);
	},

	async getUserModules() {
		return apiService.request(API_ENDPOINTS.USER_MODULES);
	},

	async deleteUser(userId) {
		return apiService.request(`${API_ENDPOINTS.USERS}/${userId}`, { method: 'DELETE' });
	},
};
