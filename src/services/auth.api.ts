import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  socialLinks?: string[];
  skills?: string[];
  emailVerified: boolean;
  role: 'user' | 'admin';
  likedBlogs?: string[];
  bookmarkedBlogs?: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  socialLinks?: string[];
  skills?: string[];
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  refreshToken: string;
}

class AuthAPI {
  // User Registration
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/user/register', data);
    return response.data;
  }

  // User Login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/api/user/login', data);
    return response.data;
  }

  // Admin Login
  async adminLogin(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/api/admin/login', data);
    return response.data;
  }

  // Get Current User Profile
  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get('/api/user/profile');
    return response.data;
  }

  // Update User Profile
  async updateProfile(data: UpdateProfileData): Promise<{ message: string; user: User }> {
    const response = await api.put('/api/user/profile', data);
    return response.data;
  }

  // Refresh Token
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await api.post('/api/user/refresh-token', { refreshToken });
    return response.data;
  }

  // Forgot Password
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/api/user/forgot-password', { email });
    return response.data;
  }

  // Reset Password
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post('/api/user/reset-password', { token, password });
    return response.data;
  }

  // Verify Email
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.get(`/api/user/verify-email/${token}`);
    return response.data;
  }

  // User Logout
  async logout(): Promise<{ message: string }> {
    const response = await api.post('/api/user/logout');
    return response.data;
  }

  // Admin Forgot Password
  async adminForgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/api/admin/forgot-password', { email });
    return response.data;
  }

  // Admin Reset Password
  async adminResetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post('/api/admin/reset-password', { token, password });
    return response.data;
  }

  // Admin Logout
  async adminLogout(): Promise<{ message: string }> {
    const response = await api.post('/api/admin/logout');
    return response.data;
  }

  // Get User Comments
  async getUserComments(): Promise<{ comments: any[] }> {
    const response = await api.get('/api/user/comments');
    return response.data;
  }

  // Get User Activity
  async getUserActivity(): Promise<{ activity: any[] }> {
    const response = await api.get('/api/user/activity');
    return response.data;
  }
}

export const authAPI = new AuthAPI();