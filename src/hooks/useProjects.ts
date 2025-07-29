import { useState, useEffect, useCallback } from 'react';
import { projectAPI, Project, ProjectFilters, ProjectAnalytics, RatingData, CreateProjectData, UpdateProjectData } from '@/services/project.api';
import { useToast } from '@/hooks/use-toast';

interface ApiError {
  message: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const { toast } = useToast();

  // Get all projects with filtering and pagination
  const fetchProjects = useCallback(async (filters?: ProjectFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectAPI.getProjects(filters);
      setProjects(response.projects);
      setPagination(response.pagination);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to fetch projects');
      toast({
        title: "Error",
        description: error.message || 'Failed to fetch projects',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Get featured projects
  const fetchFeaturedProjects = useCallback(async () => {
    try {
      setError(null);
      const response = await projectAPI.getFeaturedProjects();
      setFeaturedProjects(response.projects);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to fetch featured projects');
      toast({
        title: "Error",
        description: error.message || 'Failed to fetch featured projects',
        variant: "destructive"
      });
    }
  }, [toast]);

  // Get single project by ID (increments views automatically)
  const getProject = useCallback(async (id: string): Promise<Project> => {
    try {
      setError(null);
      const response = await projectAPI.getProject(id);
      setCurrentProject(response.project);
      return response.project;
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to fetch project');
      toast({
        title: "Error",
        description: error.message || 'Failed to fetch project',
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Create new project
  const createProject = useCallback(async (data: CreateProjectData) => {
    try {
      setIsLoading(true);
      const response = await projectAPI.createProject(data);
      toast({
        title: "Success",
        description: response.message,
      });
      await fetchProjects(); // Refresh the list
      return response.project;
    } catch (err) {
      const error = err as ApiError;
      toast({
        title: "Error",
        description: error.message || 'Failed to create project',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProjects, toast]);

  // Update project
  const updateProject = useCallback(async (id: string, data: UpdateProjectData) => {
    try {
      setIsLoading(true);
      const response = await projectAPI.updateProject(id, data);
      toast({
        title: "Success",
        description: response.message,
      });
      
      // Update the project in the current list
      setProjects(prev => prev.map(p => p.id === id ? response.project : p));
      setFeaturedProjects(prev => prev.map(p => p.id === id ? response.project : p));
      if (currentProject?.id === id) {
        setCurrentProject(response.project);
      }
      
      return response.project;
    } catch (err) {
      const error = err as ApiError;
      toast({
        title: "Error",
        description: error.message || 'Failed to update project',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject, toast]);

  // Delete project
  const deleteProject = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await projectAPI.deleteProject(id);
      toast({
        title: "Success",
        description: response.message,
      });
      
      // Remove the project from lists
      setProjects(prev => prev.filter(p => p.id !== id));
      setFeaturedProjects(prev => prev.filter(p => p.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
    } catch (err) {
      const error = err as ApiError;
      toast({
        title: "Error",
        description: error.message || 'Failed to delete project',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject, toast]);

  // Toggle featured status
  const toggleFeatured = useCallback(async (id: string) => {
    try {
      const response = await projectAPI.toggleFeatured(id);
      toast({
        title: "Success",
        description: response.message,
      });
      
      // Update the project in lists
      setProjects(prev => prev.map(p => p.id === id ? response.project : p));
      setFeaturedProjects(prev => prev.map(p => p.id === id ? response.project : p));
      if (currentProject?.id === id) {
        setCurrentProject(response.project);
      }
      
      return response.project;
    } catch (err) {
      const error = err as ApiError;
      toast({
        title: "Error",
        description: error.message || 'Failed to toggle featured status',
        variant: "destructive"
      });
      throw error;
    }
  }, [currentProject, toast]);

  // Increment stars (legacy function for compatibility)
  const incrementStars = useCallback(async (id: string) => {
    try {
      const response = await projectAPI.incrementStars(id);
      
      // Update the project in lists
      setProjects(prev => prev.map(p => p.id === id ? response.project : p));
      setFeaturedProjects(prev => prev.map(p => p.id === id ? response.project : p));
      if (currentProject?.id === id) {
        setCurrentProject(response.project);
      }
      
      return response.project;
    } catch (err) {
      const error = err as ApiError;
      toast({
        title: "Error",
        description: error.message || 'Failed to add star',
        variant: "destructive"
      });
      throw error;
    }
  }, [currentProject, toast]);

  // Add user rating
  const addRating = useCallback(async (id: string, ratingData: RatingData) => {
    try {
      const response = await projectAPI.addRating(id, ratingData);
      toast({
        title: "Success",
        description: `Rating of ${ratingData.rating} stars added successfully!`,
      });
      
      // Update the project in lists
      setProjects(prev => prev.map(p => p.id === id ? response.project : p));
      setFeaturedProjects(prev => prev.map(p => p.id === id ? response.project : p));
      if (currentProject?.id === id) {
        setCurrentProject(response.project);
      }
      
      return response.project;
    } catch (err) {
      const error = err as ApiError;
      toast({
        title: "Error",
        description: error.message || 'Failed to add rating',
        variant: "destructive"
      });
      throw error;
    }
  }, [currentProject, toast]);

  // Get project analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null);
      const response = await projectAPI.getProjectAnalytics();
      setAnalytics(response);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to fetch analytics');
      toast({
        title: "Error",
        description: error.message || 'Failed to fetch analytics',
        variant: "destructive"
      });
    }
  }, [toast]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    projects,
    featuredProjects,
    currentProject,
    isLoading,
    error,
    pagination,
    analytics,
    fetchProjects,
    fetchFeaturedProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    incrementStars,
    addRating,
    fetchAnalytics,
    clearError
  };
};

export const useProjectAnalytics = () => {
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await projectAPI.getProjectAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to fetch project analytics');
      toast({
        title: "Error",
        description: "Failed to load project analytics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics
  };
};