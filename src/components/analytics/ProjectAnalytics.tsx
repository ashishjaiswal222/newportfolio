import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FaEye, 
  FaStar, 
  FaUsers, 
  FaChartLine, 
  FaCalendarAlt, 
  FaCode, 
  FaMobile, 
  FaBrain, 
  FaLink, 
  FaTag,
  FaTrophy,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaHeart,
  FaThumbsUp,
  FaArrowUp,
  FaArrowDown,
  FaAward,
  FaRocket
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  RadialLinearScale,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCategory, ProjectStatus } from '@/services/project.api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  RadialLinearScale,
  Filler
);

interface ProjectAnalyticsProps {
  timeRange?: string;
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ timeRange = '7d' }) => {
  const { projects, analytics, fetchProjects, fetchAnalytics } = useProjects();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProjects();
    fetchAnalytics();
  }, [fetchProjects, fetchAnalytics]);

  // Calculate key metrics
  const totalProjects = projects?.length || 0;
  const totalViews = projects?.reduce((sum, p) => sum + p.views, 0) || 0;
  const totalStars = projects?.reduce((sum, p) => sum + p.stars, 0) || 0;
  const totalRatings = projects?.reduce((sum, p) => sum + p.totalRatings, 0) || 0;
  const averageRating = projects && projects.filter(p => p.averageRating > 0).length > 0 
    ? projects.filter(p => p.averageRating > 0).reduce((sum, p) => sum + p.averageRating, 0) / projects.filter(p => p.averageRating > 0).length 
    : 0;
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
  const featuredProjects = projects?.filter(p => p.featured).length || 0;
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
  const inProgressProjects = projects?.filter(p => p.status === 'in-progress').length || 0;

  // Enhanced chart options with better visibility
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#1F2937',
          font: {
            size: 13,
            weight: 'bold' as const,
            family: 'Inter, system-ui, sans-serif'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
            weight: 'normal' as const,
            family: 'Inter, system-ui, sans-serif'
          }
        },
        grid: {
          color: '#E5E7EB',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
            weight: 'normal' as const,
            family: 'Inter, system-ui, sans-serif'
          }
        },
        grid: {
          color: '#E5E7EB',
          drawBorder: false
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#1F2937',
          font: {
            size: 12,
            weight: 'normal' as const,
            family: 'Inter, system-ui, sans-serif'
          },
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#1F2937',
          font: {
            size: 12,
            weight: 'bold' as const,
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      r: {
        ticks: {
          color: '#4B5563',
          font: {
            size: 11,
            weight: 'normal' as const,
            family: 'Inter, system-ui, sans-serif'
          },
          backdropColor: 'transparent'
        },
        grid: {
          color: '#E5E7EB'
        },
        pointLabels: {
          color: '#1F2937',
          font: {
            size: 12,
            weight: 'bold' as const,
            family: 'Inter, system-ui, sans-serif'
          }
        }
      }
    }
  };

  const getTopProjectsData = () => ({
    labels: projects?.slice(0, 5).map(p => p.title.substring(0, 18) + '...') || [],
    datasets: [{
      label: 'Project Views',
      data: projects?.slice(0, 5).map(p => p.views) || [],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }]
  });

  const getCategoryData = () => {
    const categoryCounts = projects?.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return {
      labels: Object.keys(categoryCounts),
      datasets: [{
        data: Object.values(categoryCounts),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Indigo
          'rgba(168, 85, 247, 0.8)',   // Purple
          'rgba(34, 197, 94, 0.8)',    // Green
          'rgba(251, 146, 60, 0.8)',   // Orange
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(6, 182, 212, 0.8)'     // Cyan
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(6, 182, 212, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }]
    };
  };

  const getStatusData = () => {
    const statusCounts = projects?.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green - Completed
          'rgba(99, 102, 241, 0.8)',   // Indigo - Active
          'rgba(251, 146, 60, 0.8)',   // Orange - In Progress
          'rgba(107, 114, 128, 0.8)'   // Gray - Archived
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(107, 114, 128, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }]
    };
  };

  const getRatingTrendData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Average Rating',
      data: [4.2, 4.5, 4.3, 4.7, 4.6, averageRating],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#8B5CF6',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  });

  const getPerformanceRadarData = () => ({
    labels: ['Views', 'Stars', 'Ratings', 'Completion', 'Featured'],
    datasets: [{
      label: 'Performance Metrics',
      data: [
        projects?.reduce((sum, p) => sum + p.views, 0) / (projects?.length || 1),
        projects?.reduce((sum, p) => sum + p.stars, 0) / (projects?.length || 1),
        projects?.reduce((sum, p) => sum + p.totalRatings, 0) / (projects?.length || 1),
        projects?.filter(p => p.status === 'completed').length / (projects?.length || 1) * 100,
        projects?.filter(p => p.featured).length / (projects?.length || 1) * 100
      ],
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      pointBackgroundColor: '#6366F1',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  });

  const getCategoryIcon = (category: ProjectCategory) => {
    switch (category) {
      case ProjectCategory.WEB_DEVELOPMENT:
        return <FaCode className="w-5 h-5 text-indigo-600" />;
      case ProjectCategory.MOBILE_DEVELOPMENT:
        return <FaMobile className="w-5 h-5 text-purple-600" />;
      case ProjectCategory.IOT:
        return <FaTag className="w-5 h-5 text-green-600" />;
      case ProjectCategory.AI_ML:
        return <FaBrain className="w-5 h-5 text-orange-600" />;
      case ProjectCategory.BLOCKCHAIN:
        return <FaLink className="w-5 h-5 text-cyan-600" />;
      default:
        return <FaCode className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <FaProjectDiagram className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Project Data</h3>
          <p className="text-gray-500">Project analytics will appear here once you add projects.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Analytics</h2>
        <p className="text-gray-600 text-lg">Comprehensive insights into your portfolio performance</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-indigo-900 mb-1">{totalProjects}</p>
                <p className="text-xs text-indigo-700">Portfolio projects</p>
              </div>
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                <FaProjectDiagram className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-indigo-600">
              <FaArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+2.3% from last month</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Total Views</p>
                <p className="text-3xl font-bold text-purple-900 mb-1">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-purple-700">Page views</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <FaEye className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-purple-600">
              <FaArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+12.5% from last month</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 mb-1">Total Stars</p>
                <p className="text-3xl font-bold text-yellow-900 mb-1">{totalStars.toLocaleString()}</p>
                <p className="text-xs text-yellow-700">Project stars</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <FaStar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-yellow-600">
              <FaArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+8.7% from last month</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Avg Rating</p>
                <p className="text-3xl font-bold text-green-900 mb-1">{averageRating.toFixed(1)}</p>
                <p className="text-xs text-green-700">Community rating</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-green-600">
              <FaArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+5.2% from last month</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-8 border-0 shadow-lg bg-white">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaAward className="mr-3 text-indigo-600" />
            Project Status Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <FaCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-900 mb-2">{completedProjects}</div>
              <div className="text-sm font-semibold text-green-700">Completed</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200">
              <FaRocket className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-indigo-900 mb-2">{activeProjects}</div>
              <div className="text-sm font-semibold text-indigo-700">Active</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
              <FaClock className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-orange-900 mb-2">{inProgressProjects}</div>
              <div className="text-sm font-semibold text-orange-700">In Progress</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
              <FaTrophy className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-900 mb-2">{featuredProjects}</div>
              <div className="text-sm font-semibold text-purple-700">Featured</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg bg-white">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaChartLine className="mr-3 text-indigo-600" />
              Detailed Analytics
            </h3>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 p-2 bg-gray-50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
                Performance
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
                Categories
              </TabsTrigger>
              <TabsTrigger value="ratings" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
                Ratings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-8">
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaChartLine className="mr-2 text-indigo-600" />
                      Top Projects by Views
                    </h4>
                    <div className="h-80">
                      <Bar data={getTopProjectsData()} options={chartOptions} />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaStar className="mr-2 text-yellow-600" />
                      Rating Trends
                    </h4>
                    <div className="h-80">
                      <Line data={getRatingTrendData()} options={chartOptions} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaTrophy className="mr-2 text-green-600" />
                      Status Distribution
                    </h4>
                    <div className="h-80">
                      <Doughnut data={getStatusData()} options={doughnutOptions} />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaBrain className="mr-2 text-purple-600" />
                      Performance Radar
                    </h4>
                    <div className="h-80">
                      <Radar data={getPerformanceRadarData()} options={radarOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="p-8">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Projects</h4>
                  <div className="space-y-4">
                    {projects
                      ?.sort((a, b) => b.views - a.views)
                      .slice(0, 10)
                      .map((project, index) => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{project.title}</p>
                              <p className="text-sm text-gray-600">{project.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900">{project.views}</p>
                              <p className="text-xs text-gray-600">Views</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900">{project.stars}</p>
                              <p className="text-xs text-gray-600">Stars</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900">
                                {typeof project.averageRating === 'number' 
                                  ? project.averageRating.toFixed(1) 
                                  : '0.0'
                                }
                              </p>
                              <p className="text-xs text-gray-600">Rating</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="p-8">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Category Analysis</h4>
                  <div className="h-96">
                    <Doughnut data={getCategoryData()} options={doughnutOptions} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(projects.reduce((acc, p) => {
                    acc[p.category] = (acc[p.category] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)).map(([category, count]) => (
                    <Card key={category} className="p-6 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getCategoryIcon(category as ProjectCategory)}
                          <div>
                            <h5 className="font-semibold text-gray-900">{category}</h5>
                            <p className="text-sm text-gray-600">{count} projects</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-600">{count}</p>
                          <p className="text-xs text-gray-600">
                            {((count / projects.length) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ratings" className="p-8">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Rating Performance</h4>
                  <div className="h-96">
                    <Line data={getRatingTrendData()} options={chartOptions} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border border-gray-100">
                    <h5 className="font-semibold text-gray-900 mb-4">Rating Statistics</h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Average Rating:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {projects.filter(p => p.averageRating > 0).length > 0 
                            ? (projects.filter(p => p.averageRating > 0).reduce((sum, p) => sum + p.averageRating, 0) / projects.filter(p => p.averageRating > 0).length).toFixed(2)
                            : '0.00'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Total Ratings:</span>
                        <span className="font-bold text-indigo-600 text-lg">{projects.reduce((sum, p) => sum + p.totalRatings, 0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Rated Projects:</span>
                        <span className="font-bold text-purple-600 text-lg">{projects.filter(p => p.averageRating > 0).length}</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6 border border-gray-100">
                    <h5 className="font-semibold text-gray-900 mb-4">Top Rated Projects</h5>
                    <div className="space-y-3">
                      {projects
                        .filter(p => p.averageRating > 0)
                        .sort((a, b) => b.averageRating - a.averageRating)
                        .slice(0, 5)
                        .map((project, index) => (
                          <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-yellow-600">#{index + 1}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 truncate">{project.title}</span>
                            </div>
                            <span className="text-sm font-bold text-yellow-600">
                              {typeof project.averageRating === 'number' 
                                ? project.averageRating.toFixed(1) 
                                : '0.0'
                              } ⭐
                            </span>
                          </div>
                        ))}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProjectAnalytics; 