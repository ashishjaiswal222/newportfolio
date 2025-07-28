import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const data = response.data;
    // Store token if provided
    if (data.token) {
      localStorage.setItem('accessToken', data.token);
    }
    return data;
  },
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    // Clear stored tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return response.data;
  },
  refresh: async () => {
    const response = await api.post('/api/auth/refresh');
    const data = response.data;
    // Store new token if provided
    if (data.token) {
      localStorage.setItem('accessToken', data.token);
    }
    return data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  },
  verifyResetToken: async (token: string) => {
    const response = await api.get(`/api/auth/verify-reset-token/${token}`);
    return response.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
  forgotPasswordRequest: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },
  resetPasswordWithToken: async (token: string, newPassword: string) => {
    const response = await api.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  },
};