import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';
import { 
  FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaGithub, FaExternalLinkAlt, 
  FaArrowLeft, FaCode, FaCalendar, FaTags, FaStar, FaEye as FaViews,
  FaCheck, FaTimes, FaSpinner
} from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useProjects';
import { Project, ProjectStatus, ProjectCategory, CreateProjectData } from '@/services/project.api';

const ProjectManagement = () => {
  const { toast } = useToast();
  const { 
    projects, 
    isLoading, 
    error, 
    fetchProjects, 
    createProject, 
    updateProject, 
    deleteProject, 
    toggleFeatured 
  } = useProjects();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    content: '',
    featuredImage: '',
    images: [],
    technologies: [],
    demoUrl: '',
    githubUrl: '',
    category: ProjectCategory.WEB_DEVELOPMENT,
    status: ProjectStatus.ACTIVE,
    featured: false,
    order: 0,
    period: '',
    startDate: '',
    completionDate: '',
    challenges: [],
    learnings: [],
    tags: []
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = () => {
    setIsCreating(true);
    setFormData({
      title: '',
      description: '',
      content: '',
      featuredImage: '',
      images: [],
      technologies: [],
      demoUrl: '',
      githubUrl: '',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.ACTIVE,
      featured: false,
      order: 0,
      period: '',
      startDate: '',
      completionDate: '',
      challenges: [],
      learnings: [],
      tags: []
    });
  };

  const handleSaveProject = async () => {
    try {
      if (isCreating) {
        await createProject(formData);
        setIsCreating(false);
        toast({
          title: "Project Created",
          description: "Project has been created successfully.",
        });
      } else if (selectedProject) {
        await updateProject(selectedProject.id, formData);
        setIsEditing(false);
        toast({
          title: "Project Updated",
          description: "Project has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleToggleFeatured = async (projectId: string) => {
    try {
      await toggleFeatured(projectId);
      toast({
        title: "Project Updated",
        description: "Featured status updated successfully.",
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case ProjectStatus.ACTIVE:
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case ProjectStatus.IN_PROGRESS:
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case ProjectStatus.ARCHIVED:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <Card className="p-8 text-center">
            <FaTimes className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Projects</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchProjects()}>Try Again</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="outline">
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Project Management</h1>
              <p className="text-muted-foreground">
                Manage your portfolio projects
              </p>
            </div>
          </div>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateProject}>
                <FaPlus className="mr-2" />
                Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <ProjectForm 
                data={formData}
                onChange={setFormData}
                onSave={handleSaveProject}
                onCancel={() => setIsCreating(false)}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-1">
            <Card className="cyber-border p-6 h-fit">
              <h3 className="font-orbitron text-xl font-bold text-primary mb-4">
                All Projects ({projects.length})
              </h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded border cursor-pointer transition-all duration-300 ${
                        selectedProject?.id === project.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-foreground/20 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-rajdhani font-bold text-sm truncate">
                          {project.title}
                        </h4>
                        {project.featured && (
                          <Badge className="bg-accent/20 text-accent text-xs">
                            <FaStar className="w-2 h-2 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-xs text-foreground/60">{project.period}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FaViews className="w-3 h-3" />
                          <span>{project.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStar className="w-3 h-3" />
                          <span>{project.stars}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <Card className="cyber-border p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="font-orbitron text-2xl font-bold text-primary mb-2">
                      {selectedProject.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(selectedProject.status)}>
                        {selectedProject.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{selectedProject.category}</Badge>
                      {selectedProject.featured && (
                        <Badge className="bg-accent/20 text-accent">
                          <FaStar className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(selectedProject);
                        setIsEditing(true);
                      }}
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <FaTrash className="mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{selectedProject.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProject(selectedProject.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-foreground/80">{selectedProject.description}</p>
                    </div>

                    {selectedProject.content && (
                      <div>
                        <h3 className="font-semibold mb-2">Content</h3>
                        <div className="prose prose-sm max-w-none">
                          {selectedProject.content}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Links</h3>
                        <div className="space-y-2">
                          {selectedProject.githubUrl && (
                            <a 
                              href={selectedProject.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-primary hover:text-accent transition-colors"
                            >
                              <FaGithub className="mr-2" />
                              GitHub Repository
                            </a>
                          )}
                          {selectedProject.demoUrl && (
                            <a 
                              href={selectedProject.demoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-primary hover:text-accent transition-colors"
                            >
                              <FaExternalLinkAlt className="mr-2" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Quick Actions</h3>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFeatured(selectedProject.id)}
                            className="w-full"
                          >
                            {selectedProject.featured ? 'Unfeature' : 'Feature'} Project
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Project Info</h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>Period:</strong> {selectedProject.period || 'Not specified'}</div>
                          <div><strong>Start Date:</strong> {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : 'Not specified'}</div>
                          <div><strong>Completion Date:</strong> {selectedProject.completionDate ? new Date(selectedProject.completionDate).toLocaleDateString() : 'Not specified'}</div>
                          <div><strong>Order:</strong> {selectedProject.order}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedProject.challenges.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Challenges</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {selectedProject.challenges.map((challenge, index) => (
                            <li key={index}>{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedProject.learnings.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Learnings</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {selectedProject.learnings.map((learning, index) => (
                            <li key={index}>{learning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaViews className="text-blue-500" />
                          <h3 className="font-semibold">Views</h3>
                        </div>
                        <p className="text-2xl font-bold">{selectedProject.views}</p>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaStar className="text-yellow-500" />
                          <h3 className="font-semibold">Stars</h3>
                        </div>
                        <p className="text-2xl font-bold">{selectedProject.stars}</p>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Project Timeline</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Updated:</span>
                          <span>{new Date(selectedProject.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Project Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Featured Status</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant={selectedProject.featured ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleFeatured(selectedProject.id)}
                            >
                              {selectedProject.featured ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                              {selectedProject.featured ? 'Featured' : 'Not Featured'}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label>Project Status</Label>
                          <Select 
                            value={selectedProject.status} 
                            onValueChange={(value) => {
                              updateProject(selectedProject.id, { status: value as ProjectStatus });
                            }}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(ProjectStatus).map(status => (
                                <SelectItem key={status} value={status}>
                                  {status.replace('-', ' ').toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            ) : (
              <Card className="cyber-border p-8 text-center">
                <div className="text-foreground/60">
                  <FaCode className="text-4xl mx-auto mb-4 text-primary" />
                  <h3 className="font-orbitron text-xl font-bold mb-2">Select a Project</h3>
                  <p>Choose a project from the list to view or edit its details</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <ProjectForm 
              data={formData}
              onChange={setFormData}
              onSave={handleSaveProject}
              onCancel={() => setIsEditing(false)}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Project Form Component
interface ProjectFormProps {
  data: CreateProjectData;
  onChange: (data: CreateProjectData) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ data, onChange, onSave, onCancel, isLoading }) => {
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const addTechnology = () => {
    if (techInput.trim() && !data.technologies.includes(techInput.trim())) {
      onChange({ ...data, technologies: [...data.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    onChange({ ...data, technologies: data.technologies.filter(t => t !== tech) });
  };

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      onChange({ ...data, tags: [...data.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    onChange({ ...data, tags: data.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => onChange({...data, title: e.target.value})}
            className="cyber-border"
            placeholder="Enter project title"
          />
        </div>
        <div>
          <Label htmlFor="period">Time Period</Label>
          <Input
            id="period"
            value={data.period}
            onChange={(e) => onChange({...data, period: e.target.value})}
            className="cyber-border"
            placeholder="e.g., Jan 2023 - April 2023"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({...data, description: e.target.value})}
          className="cyber-border h-24"
          placeholder="Enter project description"
        />
      </div>

      <div>
        <Label htmlFor="content">Full Content</Label>
        <Textarea
          id="content"
          value={data.content}
          onChange={(e) => onChange({...data, content: e.target.value})}
          className="cyber-border h-32"
          placeholder="Enter detailed project content"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={data.githubUrl}
            onChange={(e) => onChange({...data, githubUrl: e.target.value})}
            className="cyber-border"
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div>
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input
            id="demoUrl"
            value={data.demoUrl}
            onChange={(e) => onChange({...data, demoUrl: e.target.value})}
            className="cyber-border"
            placeholder="https://demo.example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label>Category</Label>
          <Select 
            value={data.category} 
            onValueChange={(value) => onChange({...data, category: value as ProjectCategory})}
          >
            <SelectTrigger className="cyber-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProjectCategory).map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select 
            value={data.status} 
            onValueChange={(value) => onChange({...data, status: value as ProjectStatus})}
          >
            <SelectTrigger className="cyber-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProjectStatus).map(status => (
                <SelectItem key={status} value={status}>
                  {status.replace('-', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Order</Label>
          <Input
            type="number"
            value={data.order}
            onChange={(e) => onChange({...data, order: parseInt(e.target.value) || 0})}
            className="cyber-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({...data, startDate: e.target.value})}
            className="cyber-border"
          />
        </div>
        <div>
          <Label>Completion Date</Label>
          <Input
            type="date"
            value={data.completionDate}
            onChange={(e) => onChange({...data, completionDate: e.target.value})}
            className="cyber-border"
          />
        </div>
      </div>

      <div>
        <Label>Featured Image URL</Label>
        <Input
          value={data.featuredImage}
          onChange={(e) => onChange({...data, featuredImage: e.target.value})}
          className="cyber-border"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label>Technologies</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            className="cyber-border"
            placeholder="Add technology"
            onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
          />
          <Button type="button" onClick={addTechnology} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTechnology(tech)}>
              {tech} ×
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="cyber-border"
            placeholder="Add tag"
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <Button type="button" onClick={addTag} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
              {tag} ×
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={data.featured}
          onChange={(e) => onChange({...data, featured: e.target.checked})}
          className="cyber-border"
        />
        <Label htmlFor="featured">Featured Project</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={isLoading || !data.title || !data.description}>
          {isLoading ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
          Save Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectManagement;