import api from './api';

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  IN_PROGRESS = 'in-progress'
}

export enum ProjectCategory {
  WEB_DEVELOPMENT = 'Web Development',
  MOBILE_DEVELOPMENT = 'Mobile Development',
  IOT = 'IoT',
  AI_ML = 'AI/ML',
  BLOCKCHAIN = 'Blockchain',
  GAME_DEVELOPMENT = 'Game Development',
  DATA_SCIENCE = 'Data Science',
  DEVOPS = 'DevOps',
  UI_UX = 'UI/UX',
  OTHER = 'Other'
}

export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  featuredImage?: string;
  images: string[];
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  order: number;
  period?: string;
  startDate?: string;
  completionDate?: string;
  views: number;
  stars: number;
  challenges: string[];
  learnings: string[];
  tags: string[];
  // Rating system fields
  ratings: ProjectRating[];
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRating {
  userId: string;
  userName: string;
  rating: number;
  ratedAt: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  content?: string;
  featuredImage?: string;
  images?: string[];
  technologies?: string[];
  demoUrl?: string;
  githubUrl?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
  featured?: boolean;
  order?: number;
  period?: string;
  startDate?: string;
  completionDate?: string;
  challenges?: string[];
  learnings?: string[];
  tags?: string[];
}

export type UpdateProjectData = Partial<CreateProjectData>;

export interface ProjectFilters {
  status?: ProjectStatus | 'all';
  category?: ProjectCategory | 'all';
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ProjectAnalytics {
  statusStats: Array<{ status: string; count: string }>;
  categoryStats: Array<{ category: string; count: string }>;
  topViewedProjects: Array<{ id: string; title: string; views: number; stars: number }>;
  topRatedProjects: Array<{ id: string; title: string; views: number; averageRating: number; totalRatings: number }>;
  summary: {
    totalProjects: number;
    featuredProjects: number;
    totalViews: number;
    totalStars: number;
    averageRating: number;
  };
}

export interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RatingData {
  rating: number;
  userId: string;
  userName: string;
}

export interface RatingsResponse {
  ratings: ProjectRating[];
  averageRating: number;
  totalRatings: number;
}

export const projectAPI = {
  // Get all projects with filtering and pagination
  getProjects: async (filters?: ProjectFilters): Promise<ProjectsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/api/projects?${params.toString()}`);
    return response.data;
  },

  // Get featured projects
  getFeaturedProjects: async (): Promise<{ projects: Project[] }> => {
    const response = await api.get('/api/projects/featured');
    return response.data;
  },

  // Get single project by ID (increments views automatically)
  getProject: async (id: string): Promise<{ project: Project }> => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (data: CreateProjectData): Promise<{ message: string; project: Project }> => {
    const response = await api.post('/api/projects', data);
    return response.data;
  },

  // Update project
  updateProject: async (id: string, data: UpdateProjectData): Promise<{ message: string; project: Project }> => {
    const response = await api.put(`/api/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },

  // Toggle featured status
  toggleFeatured: async (id: string): Promise<{ message: string; project: Project }> => {
    const response = await api.patch(`/api/projects/${id}/featured`);
    return response.data;
  },

  // Increment stars (legacy function for compatibility)
  incrementStars: async (id: string): Promise<{ message: string; project: Project }> => {
    const response = await api.post(`/api/projects/${id}/stars`);
    return response.data;
  },

  // Add user rating
  addRating: async (id: string, ratingData: RatingData): Promise<{ message: string; project: Project; userRating: number }> => {
    const response = await api.post(`/api/projects/${id}/ratings`, ratingData);
    return response.data;
  },

  // Get project ratings
  getProjectRatings: async (id: string): Promise<RatingsResponse> => {
    const response = await api.get(`/api/projects/${id}/ratings`);
    return response.data;
  },

  // Get project analytics
  getProjectAnalytics: async (): Promise<ProjectAnalytics> => {
    const response = await api.get('/api/projects/analytics/summary');
    return response.data;
  },

  // Get project categories
  getProjectCategories: async (): Promise<{ categories: ProjectCategory[] }> => {
    const response = await api.get('/api/projects/categories');
    return response.data;
  },

  // Get project statuses
  getProjectStatuses: async (): Promise<{ statuses: ProjectStatus[] }> => {
    const response = await api.get('/api/projects/statuses');
    return response.data;
  }
};