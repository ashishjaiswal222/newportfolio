import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaGithub, FaExternalLinkAlt, 
  FaArrowLeft, FaCode, FaCalendar, FaTags 
} from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  period: string;
  github: string;
  demo: string;
  status: 'active' | 'completed' | 'in-progress';
  featured: boolean;
}

const ProjectManagement = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'IoT-Based Smart Plant Monitoring',
      description: 'Created a Smart Plant IoT system utilizing full-stack web development and IoT integration to monitor and manage plant care in real-time via a web application and hardware components.',
      technologies: ['JavaScript', 'Node.js', 'Express.js', 'PostgreSQL', 'D3.js', 'Tailwind CSS', 'WebSocket'],
      period: 'Jan 2023 - April 2023',
      github: 'https://github.com/ashishjaiswal222/smart-plant-monitoring',
      demo: '#',
      status: 'completed',
      featured: true
    },
    {
      id: 2,
      title: 'Real-Time Environmental Monitoring - airVibe',
      description: 'Developed a real-time environmental monitoring system that tracks air quality (CO2, NH3, CO, AQI) and weather data using Arduino sensors and OpenWeatherMap API.',
      technologies: ['Node.js', 'Express.js', 'PostgreSQL', 'Chart.js', 'WebSocket', 'Arduino', 'JWT'],
      period: 'Feb 2024 - April 2024',
      github: 'https://github.com/ashishjaiswal222/airvibe',
      demo: '#',
      status: 'completed',
      featured: true
    },
    {
      id: 3,
      title: 'Cyberpunk Portfolio',
      description: 'A futuristic portfolio website with cyberpunk design, 3D animations, particle effects, and comprehensive admin panel for content management.',
      technologies: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Chart.js'],
      period: '2024',
      github: '#',
      demo: '#',
      status: 'in-progress',
      featured: true
    },
    {
      id: 4,
      title: 'Full Stack E-Commerce Platform',
      description: 'Complete e-commerce solution with user authentication, payment integration, real-time inventory management, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Stripe API', 'JWT'],
      period: '2024',
      github: '#',
      demo: '#',
      status: 'in-progress',
      featured: false
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateProject = () => {
    const newProject: Project = {
      id: projects.length + 1,
      title: 'New Project',
      description: 'Project description...',
      technologies: ['React'],
      period: '2024',
      github: '#',
      demo: '#',
      status: 'in-progress',
      featured: false
    };
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setIsEditing(true);
    toast({
      title: "New Project Created",
      description: "You can now edit the project details.",
    });
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setIsEditing(false);
    toast({
      title: "Project Updated",
      description: "Project has been saved successfully.",
    });
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    toast({
      title: "Project Deleted",
      description: "Project has been removed successfully.",
      variant: "destructive",
    });
  };

  const toggleFeatured = (projectId: number) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, featured: !p.featured } : p
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-gradient-cyber mb-2">
              PROJECT MANAGEMENT
            </h1>
            <p className="text-foreground/60">Manage your portfolio projects and showcase your work</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleCreateProject} className="cyber-button bg-primary">
              <FaPlus className="mr-2" />
              New Project
            </Button>
            <Link to="/admin">
              <Button variant="outline" className="cyber-button">
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-1">
            <Card className="cyber-border p-6 h-fit">
              <h3 className="font-orbitron text-xl font-bold text-primary mb-4">
                All Projects ({projects.length})
              </h3>
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
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                      <span className="text-xs text-foreground/60">{project.period}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <Card className="cyber-border p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-orbitron text-2xl font-bold text-primary mb-2">
                      {selectedProject.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <Badge className={`${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status}
                      </Badge>
                      <span className="text-foreground/60 flex items-center">
                        <FaCalendar className="mr-2" />
                        {selectedProject.period}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="cyber-button-sm"
                    >
                      <FaEdit className="mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProject(selectedProject.id)}
                      className="cyber-button-sm border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {isEditing ? (
                  <ProjectEditor 
                    project={selectedProject}
                    onSave={handleUpdateProject}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <ProjectViewer 
                    project={selectedProject}
                    onToggleFeatured={() => toggleFeatured(selectedProject.id)}
                  />
                )}
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
      </div>
    </div>
  );
};

// Project Editor Component
const ProjectEditor: React.FC<{
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}> = ({ project, onSave, onCancel }) => {
  const [editedProject, setEditedProject] = useState<Project>(project);

  const handleSave = () => {
    onSave(editedProject);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            value={editedProject.title}
            onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
            className="cyber-border"
          />
        </div>
        <div>
          <Label htmlFor="period">Time Period</Label>
          <Input
            id="period"
            value={editedProject.period}
            onChange={(e) => setEditedProject({...editedProject, period: e.target.value})}
            className="cyber-border"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={editedProject.description}
          onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
          className="cyber-border h-32"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            value={editedProject.github}
            onChange={(e) => setEditedProject({...editedProject, github: e.target.value})}
            className="cyber-border"
          />
        </div>
        <div>
          <Label htmlFor="demo">Demo URL</Label>
          <Input
            id="demo"
            value={editedProject.demo}
            onChange={(e) => setEditedProject({...editedProject, demo: e.target.value})}
            className="cyber-border"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="technologies">Technologies (comma separated)</Label>
        <Textarea
          id="technologies"
          value={editedProject.technologies.join(', ')}
          onChange={(e) => setEditedProject({
            ...editedProject, 
            technologies: e.target.value.split(', ').map(t => t.trim())
          })}
          className="cyber-border h-20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={editedProject.status}
            onChange={(e) => setEditedProject({
              ...editedProject, 
              status: e.target.value as 'active' | 'completed' | 'in-progress'
            })}
            className="w-full p-2 rounded cyber-border bg-background text-foreground"
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="featured"
            checked={editedProject.featured}
            onChange={(e) => setEditedProject({...editedProject, featured: e.target.checked})}
            className="rounded"
          />
          <Label htmlFor="featured">Featured Project</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSave} className="cyber-button bg-primary">
          <FaSave className="mr-2" />
          Save Changes
        </Button>
        <Button onClick={onCancel} variant="outline" className="cyber-button">
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Project Viewer Component
const ProjectViewer: React.FC<{
  project: Project;
  onToggleFeatured: () => void;
}> = ({ project, onToggleFeatured }) => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-foreground/80 leading-relaxed">{project.description}</p>
      </div>

      <div>
        <h4 className="font-orbitron text-lg font-bold text-secondary mb-3 flex items-center">
          <FaTags className="mr-2" />
          Technologies
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="border-primary/50 text-primary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-orbitron text-lg font-bold text-secondary mb-3">Links</h4>
          <div className="space-y-2">
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-accent transition-colors duration-300"
            >
              <FaGithub className="mr-2" />
              GitHub Repository
            </a>
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-accent transition-colors duration-300"
            >
              <FaExternalLinkAlt className="mr-2" />
              Live Demo
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-orbitron text-lg font-bold text-secondary mb-3">Settings</h4>
          <div className="space-y-2">
            <button
              onClick={onToggleFeatured}
              className={`flex items-center px-3 py-1 rounded transition-colors duration-300 ${
                project.featured 
                  ? 'bg-accent/20 text-accent border border-accent/30' 
                  : 'bg-foreground/10 text-foreground/60 border border-foreground/20 hover:border-accent/50'
              }`}
            >
              <FaEye className="mr-2" />
              {project.featured ? 'Featured' : 'Not Featured'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;