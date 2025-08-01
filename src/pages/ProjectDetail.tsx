import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  Eye, 
  Star, 
  Code2, 
  Clock,
  Award,
  BookOpen,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';
import { FaGithub, FaExternalLinkAlt, FaCode, FaMobile, FaTag, FaBrain, FaLink } from 'react-icons/fa';
import { useProjects } from '@/hooks/useProjects';
import { ProjectStatus, ProjectCategory, Project } from '@/services/project.api';
import ProjectRating from '@/components/portfolio/ProjectRating';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, incrementStars, addRating } = useProjects();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        console.log('No project ID provided');
        setError('No project ID provided');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching project with ID:', id);
      
      try {
        setIsLoading(true);
        const projectData = await getProject(id);
        console.log('Project data received:', projectData);
        setProject(projectData);
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, getProject]);

  const handleStarProject = async () => {
    if (!project) return;
    
    try {
      await incrementStars(project.id);
      setProject(prev => prev ? { ...prev, stars: prev.stars + 1 } : null);
    } catch (err) {
      console.error('Error incrementing stars:', err);
    }
  };

  const handleRatingAdded = (newRating: number) => {
    if (!project) return;
    
    // Update the project with new rating data
    setProject(prev => {
      if (!prev) return null;
      
      const newRatings = [...(prev.ratings || [])];
      const existingRatingIndex = newRatings.findIndex(r => r.userId === 'current-user'); // This will be updated by the API
      
      if (existingRatingIndex !== -1) {
        newRatings[existingRatingIndex] = {
          ...newRatings[existingRatingIndex],
          rating: newRating,
          ratedAt: new Date().toISOString()
        };
      } else {
        newRatings.push({
          userId: 'current-user',
          userName: 'You',
          rating: newRating,
          ratedAt: new Date().toISOString()
        });
      }
      
      const totalRating = newRatings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / newRatings.length;
      
      return {
        ...prev,
        ratings: newRatings,
        averageRating,
        totalRatings: newRatings.length
      };
    });
  };

  const getCategoryIcon = (category: ProjectCategory) => {
    switch (category) {
      case ProjectCategory.WEB_DEVELOPMENT:
        return <FaCode className="w-5 h-5" />;
      case ProjectCategory.MOBILE_DEVELOPMENT:
        return <FaMobile className="w-5 h-5" />;
      case ProjectCategory.IOT:
        return <FaTag className="w-5 h-5" />;
      case ProjectCategory.AI_ML:
        return <FaBrain className="w-5 h-5" />;
      case ProjectCategory.BLOCKCHAIN:
        return <FaLink className="w-5 h-5" />;
      default:
        return <FaCode className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case ProjectStatus.ACTIVE:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case ProjectStatus.IN_PROGRESS:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case ProjectStatus.ARCHIVED:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <Card className="p-8 text-center">
            <div className="text-foreground/60">
              <Code2 className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
              <p className="text-muted-foreground mb-4">{error || 'The project you are looking for does not exist.'}</p>
              <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="cyber-border p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Project Image */}
              {project.featuredImage && (
                <div className="lg:w-1/3">
                  <img 
                    src={project.featuredImage} 
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-lg cyber-border"
                  />
                </div>
              )}
              
              {/* Project Info */}
              <div className="lg:w-2/3 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {getCategoryIcon(project.category)}
                    <Badge variant="outline">{project.category}</Badge>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    {project.featured && (
                      <Badge className="bg-accent/20 text-accent border-accent/30">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-primary mb-4">
                    {project.title}
                  </h1>
                  
                  <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Real-time Analytics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <Eye className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{project.views}</div>
                      <div className="text-xs text-foreground/60">Real Views</div>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <Star className="w-5 h-5 mx-auto mb-2 text-accent" />
                      <div className="text-2xl font-bold">{project.stars}</div>
                      <div className="text-xs text-foreground/60">Stars</div>
                    </div>
                    {project.averageRating > 0 && (
                      <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <BarChart3 className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold">{project.averageRating.toFixed(1)}</div>
                        <div className="text-xs text-foreground/60">Rating</div>
                      </div>
                    )}
                    {project.totalRatings > 0 && (
                      <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <Users className="w-5 h-5 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold">{project.totalRatings}</div>
                        <div className="text-xs text-foreground/60">Ratings</div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {project.githubUrl && (
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="cyber-button"
                        asChild
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          View Code
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button 
                        size="lg"
                        className="cyber-button bg-accent text-accent-foreground hover:bg-accent/90"
                        asChild
                      >
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleStarProject}
                      className="cyber-button"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Star Project
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="cyber-border">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="technologies">Technologies</TabsTrigger>
                  <TabsTrigger value="challenges">Challenges</TabsTrigger>
                  <TabsTrigger value="learnings">Learnings</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6">
                  <div className="space-y-6">
                    {project.content && (
                      <div>
                        <h3 className="font-orbitron text-xl font-bold text-primary mb-4">Project Overview</h3>
                        <div className="prose prose-invert max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: project.content }} />
                        </div>
                      </div>
                    )}
                    
                    {project.tags && project.tags.length > 0 && (
                      <div>
                        <h3 className="font-orbitron text-xl font-bold text-primary mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="technologies" className="p-6">
                  <div>
                    <h3 className="font-orbitron text-xl font-bold text-primary mb-6">Technologies Used</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {project.technologies.map((tech: string) => (
                        <div key={tech} className="p-4 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors">
                          <Code2 className="w-6 h-6 text-primary mb-2" />
                          <div className="font-semibold">{tech}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="challenges" className="p-6">
                  <div>
                    <h3 className="font-orbitron text-xl font-bold text-primary mb-6">Challenges Faced</h3>
                    {project.challenges && project.challenges.length > 0 ? (
                      <div className="space-y-4">
                        {project.challenges.map((challenge: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <Target className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                            <p className="text-foreground/80">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-foreground/60">
                        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No challenges documented for this project.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="learnings" className="p-6">
                  <div>
                    <h3 className="font-orbitron text-xl font-bold text-primary mb-6">Key Learnings</h3>
                    {project.learnings && project.learnings.length > 0 ? (
                      <div className="space-y-4">
                        {project.learnings.map((learning: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <Lightbulb className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                            <p className="text-foreground/80">{learning}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-foreground/60">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No learnings documented for this project.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="p-6">
                  <div>
                    <h3 className="font-orbitron text-xl font-bold text-primary mb-6">Project Timeline</h3>
                    <div className="space-y-4">
                      {project.startDate && (
                        <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <Calendar className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="font-semibold">Project Started</div>
                            <div className="text-sm text-foreground/60">
                              {new Date(project.startDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {project.completionDate && (
                        <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <Award className="w-5 h-5 text-green-500" />
                          <div>
                            <div className="font-semibold">Project Completed</div>
                            <div className="text-sm text-foreground/60">
                              {new Date(project.completionDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {project.period && (
                        <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <Clock className="w-5 h-5 text-purple-500" />
                          <div>
                            <div className="font-semibold">Duration</div>
                            <div className="text-sm text-foreground/60">{project.period}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="p-6">
                  <div>
                    <h3 className="font-orbitron text-xl font-bold text-primary mb-6">Project Gallery</h3>
                    {project.images && project.images.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.images.map((image: string, index: number) => (
                          <div key={index} className="aspect-video">
                            <img 
                              src={image} 
                              alt={`${project.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg cyber-border"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-foreground/60">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No additional images available for this project.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Rating Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <ProjectRating
              projectId={project.id}
              averageRating={project.averageRating || 0}
              totalRatings={project.totalRatings || 0}
              ratings={project.ratings || []}
              onRatingAdded={handleRatingAdded}
              requireAuth={false} // Set to true if you want to require login for rating
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 