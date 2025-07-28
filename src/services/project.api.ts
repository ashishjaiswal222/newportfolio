import api from './api';

export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  featuredImage: string;
  images: string[];
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  category: string;
  status: 'active' | 'completed' | 'archived';
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectData {
  title: string;
  description: string;
  content?: string;
  featuredImage: string;
  images: string[];
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  category: string;
  status: 'active' | 'completed';
  featured?: boolean;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  order?: number;
}

export const projectAPI = {
  getProjects: async () => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  getFeaturedProjects: async () => {
    const response = await api.get('/api/projects/featured');
    return response.data;
  },

  getProject: async (id: string) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectData) => {
    const response = await api.post('/api/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: UpdateProjectData) => {
    const response = await api.put(`/api/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },

  toggleFeatured: async (id: string) => {
    const response = await api.patch(`/api/projects/${id}/featured`);
    return response.data;
  },
};