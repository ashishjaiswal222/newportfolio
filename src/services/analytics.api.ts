import api from './api';

export interface AnalyticsOverview {
  totalBlogs: number;
  totalViews: number;
  totalComments: number;
  totalUsers: number;
  recentActivity: {
    type: 'blog' | 'comment' | 'user' | 'contact';
    title: string;
    date: Date;
  }[];
  popularBlogs: {
    id: string;
    title: string;
    views: number;
  }[];
}

export interface BlogAnalytics {
  blogId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  viewsHistory: {
    date: Date;
    views: number;
  }[];
}

export interface UserAnalytics {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
  registrationHistory: {
    date: Date;
    count: number;
  }[];
}

export const analyticsAPI = {
  getOverview: async () => {
    const response = await api.get('/api/analytics/overview');
    return response.data;
  },

  getBlogAnalytics: async () => {
    const response = await api.get('/api/analytics/blogs');
    return response.data;
  },

  getUserAnalytics: async () => {
    const response = await api.get('/api/analytics/users');
    return response.data;
  },

  getPageAnalytics: async () => {
    const response = await api.get('/api/analytics/pages');
    return response.data;
  },

  getTrafficSources: async () => {
    const response = await api.get('/api/analytics/sources');
    return response.data;
  },

  getPerformanceMetrics: async () => {
    const response = await api.get('/api/analytics/performance');
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await api.get('/api/admin/summary');
    return response.data;
  },
};