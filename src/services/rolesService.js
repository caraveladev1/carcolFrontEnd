import { apiService } from './apiService.js';
import { API_ENDPOINTS } from '../constants/api.js';

export const rolesService = {
	async getRoles() {
		return apiService.request(API_ENDPOINTS.ROLE_ROOT);
	},
	async createRole(name, modules) {
		return apiService.request(API_ENDPOINTS.ROLE_ROOT, {
			method: 'POST',
			body: JSON.stringify({ name, modules }),
		});
	},
	async updateRoleModules(roleId, modules) {
		return apiService.request(`${API_ENDPOINTS.ROLE_ROOT}/${roleId}/modules`, {
			method: 'PUT',
			body: JSON.stringify({ modules }),
		});
	},
	async deleteRole(roleId) {
		return apiService.request(`${API_ENDPOINTS.ROLE_ROOT}/${roleId}`, { method: 'DELETE' });
	},
};
