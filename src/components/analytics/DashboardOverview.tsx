import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FaUsers, 
  FaEye, 
  FaStar, 
  FaProjectDiagram,
  FaChartLine,
  FaComments,
  FaEnvelope,
  FaGlobe,
  FaDesktop,
  FaMobile,
  FaTablet,
  FaCheckCircle,
  FaClock,
  FaTrophy
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

interface DashboardOverviewProps {
  projects: any[];
  testimonials: any[];
  contacts: any[];
  realTimeVisitors: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  testimonials,
  contacts,
  realTimeVisitors
}) => {
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
  const totalTestimonials = testimonials?.length || 0;
  const approvedTestimonials = testimonials?.filter(t => t.status === 'approved').length || 0;
  const totalContacts = contacts?.length || 0;
  const recentContacts = contacts?.filter(c => {
    const contactDate = new Date(c.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return contactDate > weekAgo;
  }).length || 0;

  // Key metrics data
  const stats = [
    { 
      title: 'Total Projects', 
      value: totalProjects.toLocaleString(), 
      change: '+2.3%', 
      isPositive: true, 
      icon: FaProjectDiagram, 
      color: 'text-neon-cyan',
      description: 'Portfolio projects'
    },
    { 
      title: 'Total Views', 
      value: totalViews.toLocaleString(), 
      change: '+12.5%', 
      isPositive: true, 
      icon: FaEye, 
      color: 'text-neon-purple',
      description: 'Project page views'
    },
    { 
      title: 'Testimonials', 
      value: totalTestimonials.toLocaleString(), 
      change: '+5.8%', 
      isPositive: true, 
      icon: FaComments, 
      color: 'text-neon-green',
      description: 'Client feedback'
    },
    { 
      title: 'Contacts', 
      value: totalContacts.toLocaleString(), 
      change: '+8.2%', 
      isPositive: true, 
      icon: FaEnvelope, 
      color: 'text-neon-pink',
      description: 'Inquiries received'
    },
  ];

  // Visitor trends data
  const visitorTrendsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Unique Visitors',
        data: [1245, 1567, 1398, 1876, 2134, 1987, 1654],
        borderColor: '#00f5ff',
        backgroundColor: 'rgba(0, 245, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Page Views',
        data: [3456, 4234, 3987, 4567, 5234, 4876, 4123],
        borderColor: '#ff00ff',
        backgroundColor: 'rgba(255, 0, 255, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Device breakdown data
  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [65, 30, 5],
      backgroundColor: [
        'rgba(0, 245, 255, 0.8)',
        'rgba(255, 0, 255, 0.8)',
        'rgba(0, 255, 128, 0.8)'
      ],
      borderColor: [
        'rgba(0, 245, 255, 1)',
        'rgba(255, 0, 255, 1)',
        'rgba(0, 255, 128, 1)'
      ],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      y: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
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
          color: '#ffffff',
          font: {
            size: 11
          },
          padding: 15
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="cyber-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-orbitron text-xl font-bold text-primary flex items-center">
              <FaChartLine className="mr-2" />
              Real-time Metrics
            </h2>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Live
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${stat.color} bg-opacity-20`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-1">{stat.value}</h3>
                <p className="text-sm text-foreground/60 mb-1">{stat.title}</p>
                <p className="text-xs text-foreground/40">{stat.description}</p>
                <div className={`text-xs mt-2 ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change} from last period
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaChartLine className="mr-2" />
              Visitor Trends
            </h3>
            <div className="h-64">
              <Line data={visitorTrendsData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaGlobe className="mr-2" />
              Device Breakdown
            </h3>
            <div className="h-64">
              <Doughnut data={deviceData} options={doughnutOptions} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Project Status & Engagement Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaProjectDiagram className="mr-2" />
              Project Status Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <FaCheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <div className="text-xl font-bold text-green-500">{completedProjects}</div>
                  <div className="text-xs text-foreground/60">Completed</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <FaProjectDiagram className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="text-xl font-bold text-blue-500">{activeProjects}</div>
                  <div className="text-xs text-foreground/60">Active</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <FaClock className="w-6 h-6 text-yellow-500" />
                <div>
                  <div className="text-xl font-bold text-yellow-500">
                    {projects?.filter(p => p.status === 'in-progress').length || 0}
                  </div>
                  <div className="text-xs text-foreground/60">In Progress</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <FaTrophy className="w-6 h-6 text-purple-500" />
                <div>
                  <div className="text-xl font-bold text-purple-500">{featuredProjects}</div>
                  <div className="text-xs text-foreground/60">Featured</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaComments className="mr-2" />
              Engagement Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Testimonials:</span>
                <span className="font-bold text-green-500">{totalTestimonials}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Approved:</span>
                <span className="font-bold text-blue-500">{approvedTestimonials}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Contacts:</span>
                <span className="font-bold text-purple-500">{totalContacts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Recent (7d):</span>
                <span className="font-bold text-orange-500">{recentContacts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Rating:</span>
                <span className="font-bold text-yellow-500">{averageRating.toFixed(1)} ⭐</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Real-time Visitors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="cyber-border p-4">
          <h3 className="font-orbitron text-lg font-bold text-primary mb-4">Real-time Visitors</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{realTimeVisitors}</div>
            <p className="text-foreground/60">Currently browsing</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardOverview; 