import { useState, useEffect } from 'react';
import { projectAPI, Project } from '@/services/project.api';
import { useToast } from '@/hooks/use-toast';

export type { Project };

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectAPI.getProjects();
      setProjects(response.projects);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch projects');
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (data: any) => {
    try {
      const response = await projectAPI.createProject(data);
      setProjects(prev => [...prev, response.project]);
      toast({
        title: "Project created",
        description: "Project has been successfully created.",
      });
      return response;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create project",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProject = async (id: string, data: any) => {
    try {
      const response = await projectAPI.updateProject(id, data);
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? response.project : project
        )
      );
      toast({
        title: "Project updated",
        description: "Project has been successfully updated.",
      });
      return response;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update project",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectAPI.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      toast({
        title: "Project deleted",
        description: "Project has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};