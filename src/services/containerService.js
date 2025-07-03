import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';

export const containerService = {
  async getPendingContainers() {
    return apiService.get(API_ENDPOINTS.PENDING_CONTAINERS);
  },

  async getAllContainers() {
    return apiService.get(API_ENDPOINTS.ALL_CONTAINERS);
  },

  async getExportedContainers() {
    return apiService.get(API_ENDPOINTS.EXPORTED_CONTAINERS);
  },

  async getAllExports() {
    return apiService.get(API_ENDPOINTS.ALL_EXPORTS);
  },

  async createContainer(payload) {
    return apiService.post(API_ENDPOINTS.CREATE_CONTAINER, payload);
  },

  async getEditContainerData(containerId) {
    const encodedId = encodeURIComponent(containerId);
    return apiService.get(`${API_ENDPOINTS.EDIT_CONTAINER_DATA}?containerId=${encodedId}`);
  }
};