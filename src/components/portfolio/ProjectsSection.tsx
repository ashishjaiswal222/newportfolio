import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaGithub, FaExternalLinkAlt, FaEye, FaStar, FaCalendar, FaCode, FaMobile, FaTag, FaBrain, FaLink } from 'react-icons/fa';
import { useProjects } from '@/hooks/useProjects';
import { ProjectStatus, ProjectCategory } from '@/services/project.api';
import { Eye } from 'lucide-react';

const ProjectsSection = () => {
  const navigate = useNavigate();
  const { featuredProjects, isLoading, error, fetchFeaturedProjects } = useProjects();

  useEffect(() => {
    fetchFeaturedProjects();
  }, [fetchFeaturedProjects]);

  const getCategoryIcon = (category: ProjectCategory) => {
    switch (category) {
      case ProjectCategory.WEB_DEVELOPMENT:
        return <FaCode className="w-4 h-4" />;
      case ProjectCategory.MOBILE_DEVELOPMENT:
        return <FaMobile className="w-4 h-4" />;
      case ProjectCategory.IOT:
        return <FaTag className="w-4 h-4" />;
      case ProjectCategory.AI_ML:
        return <FaBrain className="w-4 h-4" />;
      case ProjectCategory.BLOCKCHAIN:
        return <FaLink className="w-4 h-4" />;
      default:
        return <FaCode className="w-4 h-4" />;
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
      <section className="py-20 cyber-grid">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gradient-cyber mb-4">
              PROJECTS
            </h2>
            <div className="w-32 h-1 bg-gradient-cyber mx-auto"></div>
            <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
              Explore my latest work and technical achievements
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <Card className="cyber-border p-6 h-full">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-6 w-16 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 cyber-grid">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gradient-cyber mb-4">
              PROJECTS
            </h2>
            <div className="w-32 h-1 bg-gradient-cyber mx-auto"></div>
          </motion.div>
          
          <Card className="cyber-border p-8 text-center">
            <div className="text-foreground/60">
              <FaCode className="text-4xl mx-auto mb-4 text-primary" />
              <h3 className="font-orbitron text-xl font-bold mb-2">Unable to Load Projects</h3>
              <p className="mb-4">{error}</p>
              <Button onClick={() => fetchFeaturedProjects()}>Try Again</Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (featuredProjects.length === 0) {
    return (
      <section className="py-20 cyber-grid">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gradient-cyber mb-4">
              PROJECTS
            </h2>
            <div className="w-32 h-1 bg-gradient-cyber mx-auto"></div>
            <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
              Explore my latest work and technical achievements
            </p>
          </motion.div>
          
          <Card className="cyber-border p-8 text-center">
            <div className="text-foreground/60">
              <FaCode className="text-4xl mx-auto mb-4 text-primary" />
              <h3 className="font-orbitron text-xl font-bold mb-2">No Featured Projects</h3>
              <p>Check back soon for new projects!</p>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 cyber-grid">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gradient-cyber mb-4">
            FEATURED PROJECTS
          </h2>
          <div className="w-32 h-1 bg-gradient-cyber mx-auto"></div>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
            Explore my latest work and technical achievements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card 
                className="cyber-border p-6 h-full group hover:glow-cyan transition-all duration-300 relative overflow-hidden cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 space-y-4">
                  {/* Header with category and status */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(project.category)}
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Title and period */}
                  <div className="space-y-2">
                    <h3 className="font-orbitron text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    {project.period && (
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <FaCalendar className="w-3 h-3" />
                        <span>{project.period}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-foreground/80 leading-relaxed text-sm">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium border border-primary/30 hover:bg-primary/30 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-3 py-1 bg-primary/10 text-primary/60 rounded-full text-xs font-medium border border-primary/20">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-foreground/60 pt-2 border-t border-foreground/10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FaEye className="w-3 h-3" />
                        <span>{project.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar className="w-3 h-3" />
                        <span>{project.stars}</span>
                      </div>
                    </div>
                    {project.startDate && (
                      <div className="text-xs">
                        {new Date(project.startDate).getFullYear()}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cyber-button flex-1 group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.id}`);
                      }}
                    >
                      <Eye className="mr-2 group-hover/btn:scale-110 transition-transform" />
                      View Details
                    </Button>
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="cyber-button flex-1 group/btn"
                        asChild
                      >
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaGithub className="mr-2 group-hover/btn:scale-110 transition-transform" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button
                        size="sm"
                        className="cyber-button flex-1 bg-accent text-accent-foreground hover:bg-accent/90 group/btn"
                        asChild
                      >
                        <a 
                          href={project.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaExternalLinkAlt className="mr-2 group-hover/btn:scale-110 transition-transform" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-accent/10 text-accent/80 rounded text-xs border border-accent/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-accent/5 text-accent/60 rounded text-xs border border-accent/10">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button 
            size="lg" 
            className="cyber-button bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            asChild
          >
            <a href="/projects">
              View All Projects
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;