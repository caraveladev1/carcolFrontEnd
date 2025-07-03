import { API_BASE_URL, API_ENDPOINTS } from '../constants';

export const authService = {
  async checkProtectedRoute() {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MS_PROTECTED}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      return response.json();
    }
    throw new Error('Not authenticated');
  },

  login() {
    window.location.href = `${API_BASE_URL}${API_ENDPOINTS.MS_LOGIN}`;
  },

  async logout() {
    return fetch(`${API_BASE_URL}${API_ENDPOINTS.MS_LOGOUT}`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  redirect(code) {
    window.location.href = `${API_BASE_URL}${API_ENDPOINTS.MS_REDIRECT}?code=${code}`;
  }
};