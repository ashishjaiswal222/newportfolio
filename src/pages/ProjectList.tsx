import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Search, 
  Filter,
  Calendar,
  Tag,
  Star,
  Eye,
  Code2,
  Layers,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCategory, ProjectStatus } from '@/services/project.api';

const ProjectList = () => {
  const navigate = useNavigate();
  const { projects, isLoading, error, pagination, fetchProjects } = useProjects();
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTech, setSelectedTech] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects({
      page: currentPage,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
  }, [fetchProjects, currentPage]);

  // Filter projects based on search and filters
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    // Apply technology filter
    if (selectedTech !== 'all') {
      filtered = filtered.filter(project => 
        project.technologies.some(tech => tech === selectedTech)
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedStatus, selectedTech]);

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

  const getCategoryIcon = (category: ProjectCategory) => {
    switch (category) {
      case ProjectCategory.WEB_DEVELOPMENT:
        return <Code2 className="w-4 h-4" />;
      case ProjectCategory.MOBILE_DEVELOPMENT:
        return <Layers className="w-4 h-4" />;
      case ProjectCategory.IOT:
        return <Tag className="w-4 h-4" />;
      case ProjectCategory.AI_ML:
        return <Star className="w-4 h-4" />;
      case ProjectCategory.BLOCKCHAIN:
        return <Code2 className="w-4 h-4" />;
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  const getUniqueTechnologies = () => {
    const allTechs = projects.flatMap(project => project.technologies);
    return Array.from(new Set(allTechs)).sort();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </div>
          
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
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
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground">
                Explore my latest work and technical achievements
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{pagination.total} projects</span>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.values(ProjectCategory).map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.values(ProjectStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {status.replace('-', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTech} onValueChange={setSelectedTech}>
              <SelectTrigger>
                <SelectValue placeholder="Technology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                {getUniqueTechnologies().map(tech => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSelectedTech('all');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-full">
                <CardHeader>
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-6 w-16 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(project.category)}
                          <Badge variant="outline" className="text-xs">
                            {project.category}
                          </Badge>
                        </div>
                        {project.featured && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {project.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Status and Dates */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {project.startDate && (
                            <span>
                              {new Date(project.startDate).toLocaleDateString()}
                              {project.completionDate && (
                                <> - {new Date(project.completionDate).toLocaleDateString()}</>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{project.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>{project.stars}</span>
                          </div>
                        </div>
                        {project.period && (
                          <span className="text-xs">{project.period}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/projects/${project.id}`);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        {project.demoUrl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.demoUrl, '_blank');
                            }}
                            className="flex-1"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Live Demo
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.githubUrl, '_blank');
                          }}
                          className="flex-1"
                        >
                          <Github className="w-3 h-3 mr-1" />
                          Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectList;