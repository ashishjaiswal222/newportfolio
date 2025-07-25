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
  Layers
} from 'lucide-react';

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTech, setSelectedTech] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Demo projects data
    const demoProjects = [
      {
        id: '1',
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce application with modern design and robust functionality.',
        fullDescription: 'A comprehensive e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and admin dashboard. The application uses Redux for state management and implements responsive design for mobile compatibility.',
        image: '/placeholder.svg',
        category: 'Web Development',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redux'],
        githubUrl: 'https://github.com/johndoe/ecommerce-platform',
        liveUrl: 'https://ecommerce-demo.vercel.app',
        featured: true,
        status: 'Completed',
        startDate: '2024-01-15',
        completionDate: '2024-03-20',
        views: 1250,
        stars: 45,
        challenges: [
          'Implementing real-time inventory management',
          'Optimizing database queries for large product catalogs',
          'Creating a secure payment processing system'
        ],
        learnings: [
          'Advanced React patterns and performance optimization',
          'Database design and normalization',
          'Payment gateway integration and security best practices'
        ]
      },
      {
        id: '2',
        title: 'AI-Powered Task Manager',
        description: 'Intelligent task management application with AI suggestions and automation.',
        fullDescription: 'An innovative task management application that leverages artificial intelligence to provide smart suggestions, automatic categorization, and productivity insights. Built with React, Python FastAPI backend, and integrated with OpenAI GPT for intelligent features.',
        image: '/placeholder.svg',
        category: 'AI/ML',
        technologies: ['React', 'Python', 'FastAPI', 'OpenAI', 'PostgreSQL'],
        githubUrl: 'https://github.com/johndoe/ai-task-manager',
        liveUrl: 'https://ai-tasks.vercel.app',
        featured: true,
        status: 'In Progress',
        startDate: '2024-02-01',
        completionDate: null,
        views: 890,
        stars: 32,
        challenges: [
          'Integrating AI APIs effectively',
          'Creating intuitive user interfaces for AI features',
          'Balancing automation with user control'
        ],
        learnings: [
          'AI/ML integration in web applications',
          'Prompt engineering and API optimization',
          'User experience design for AI-powered features'
        ]
      },
      {
        id: '3',
        title: 'Real-time Collaboration Tool',
        description: 'WebRTC-based collaboration platform for remote teams.',
        fullDescription: 'A real-time collaboration platform enabling remote teams to work together efficiently. Features include video conferencing, shared whiteboards, document collaboration, and project management tools. Built with React, Socket.io, and WebRTC for real-time communication.',
        image: '/placeholder.svg',
        category: 'Web Development',
        technologies: ['React', 'Socket.io', 'WebRTC', 'Node.js', 'MongoDB'],
        githubUrl: 'https://github.com/johndoe/collab-tool',
        liveUrl: 'https://collab-demo.vercel.app',
        featured: false,
        status: 'Completed',
        startDate: '2023-10-15',
        completionDate: '2024-01-10',
        views: 2100,
        stars: 78,
        challenges: [
          'Implementing stable WebRTC connections',
          'Handling real-time data synchronization',
          'Creating responsive multi-user interfaces'
        ],
        learnings: [
          'WebRTC implementation and troubleshooting',
          'Real-time data architecture',
          'Multi-user application design patterns'
        ]
      },
      {
        id: '4',
        title: 'Mobile Finance App',
        description: 'React Native application for personal finance management.',
        fullDescription: 'A comprehensive personal finance management application built with React Native. Features include expense tracking, budget planning, investment portfolio management, and financial goal setting. Integrates with banking APIs for automatic transaction import.',
        image: '/placeholder.svg',
        category: 'Mobile Development',
        technologies: ['React Native', 'Redux', 'Firebase', 'Plaid API'],
        githubUrl: 'https://github.com/johndoe/finance-app',
        liveUrl: null,
        featured: true,
        status: 'Completed',
        startDate: '2023-08-01',
        completionDate: '2023-11-30',
        views: 1680,
        stars: 56,
        challenges: [
          'Integrating with banking APIs securely',
          'Creating intuitive financial data visualizations',
          'Ensuring data privacy and security'
        ],
        learnings: [
          'React Native development and deployment',
          'Financial API integration',
          'Mobile app security best practices'
        ]
      },
      {
        id: '5',
        title: 'Blockchain Voting System',
        description: 'Decentralized voting platform built on Ethereum.',
        fullDescription: 'A secure, transparent voting system built on the Ethereum blockchain. Features include voter registration, ballot creation, secure voting, and real-time result tracking. Uses smart contracts for vote integrity and transparency.',
        image: '/placeholder.svg',
        category: 'Blockchain',
        technologies: ['Solidity', 'React', 'Web3.js', 'IPFS', 'Ethereum'],
        githubUrl: 'https://github.com/johndoe/blockchain-voting',
        liveUrl: 'https://vote-dapp.vercel.app',
        featured: false,
        status: 'Completed',
        startDate: '2023-05-01',
        completionDate: '2023-07-15',
        views: 950,
        stars: 41,
        challenges: [
          'Ensuring vote privacy while maintaining transparency',
          'Optimizing gas costs for transactions',
          'Creating user-friendly Web3 interfaces'
        ],
        learnings: [
          'Smart contract development and testing',
          'Blockchain integration patterns',
          'Decentralized application architecture'
        ]
      },
      {
        id: '6',
        title: 'IoT Dashboard',
        description: 'Real-time monitoring dashboard for IoT devices.',
        fullDescription: 'A comprehensive IoT monitoring dashboard that collects and visualizes data from multiple sensors and devices. Features real-time charts, alerts, device management, and historical data analysis. Built with React, Node.js, and MQTT for device communication.',
        image: '/placeholder.svg',
        category: 'IoT',
        technologies: ['React', 'Node.js', 'MQTT', 'InfluxDB', 'Grafana'],
        githubUrl: 'https://github.com/johndoe/iot-dashboard',
        liveUrl: 'https://iot-demo.vercel.app',
        featured: false,
        status: 'In Progress',
        startDate: '2024-03-01',
        completionDate: null,
        views: 720,
        stars: 28,
        challenges: [
          'Handling high-frequency sensor data',
          'Creating efficient data visualization',
          'Managing device connectivity and reliability'
        ],
        learnings: [
          'IoT protocols and communication patterns',
          'Time-series database optimization',
          'Real-time data processing architectures'
        ]
      }
    ];

    setProjects(demoProjects);
    setFilteredProjects(demoProjects);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((tech: string) => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by technology
    if (selectedTech !== 'all') {
      filtered = filtered.filter(project => 
        project.technologies.includes(selectedTech)
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedCategory, selectedTech, projects]);

  const categories = [...new Set(projects.map(p => p.category))];
  const technologies = [...new Set(projects.flatMap(p => p.technologies))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Planning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web Development':
        return <Code2 className="w-4 h-4" />;
      case 'Mobile Development':
        return <Layers className="w-4 h-4" />;
      case 'AI/ML':
        return <Star className="w-4 h-4" />;
      case 'Blockchain':
        return <Github className="w-4 h-4" />;
      case 'IoT':
        return <Eye className="w-4 h-4" />;
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">All Projects</h1>
                <p className="text-muted-foreground">
                  Explore my complete portfolio of {projects.length} projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Technology Filter */}
              <Select value={selectedTech} onValueChange={setSelectedTech}>
                <SelectTrigger>
                  <SelectValue placeholder="All Technologies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  {technologies.map(tech => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
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
                    {/* Status and Stats */}
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {project.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {project.stars}
                        </span>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Started {new Date(project.startDate).toLocaleDateString()}
                      {project.completionDate && (
                        <>
                          {' • Completed '}
                          {new Date(project.completionDate).toLocaleDateString()}
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {project.liveUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.liveUrl, '_blank');
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
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse all projects
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedTech('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectList;