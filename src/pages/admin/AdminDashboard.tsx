import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FaChartLine, 
  FaProjectDiagram, 
  FaEdit, 
  FaUsers, 
  FaEye, 
  FaSignOutAlt, 
  FaFileAlt, 
  FaEnvelope, 
  FaStar, 
  FaUser,
  FaTrophy,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useContacts } from '@/hooks/useContacts';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { projects, fetchProjects } = useProjects();
  const { testimonials, refetch: fetchTestimonials } = useTestimonials();
  const { contacts, refetch: fetchContacts } = useContacts();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchProjects(),
          fetchTestimonials(),
          fetchContacts()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Remove dependencies to prevent infinite loop

  // Calculate real statistics
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
  const totalTestimonials = testimonials?.length || 0;
  const approvedTestimonials = testimonials?.filter(t => t.status === 'approved').length || 0;
  const totalContacts = contacts?.length || 0;
  const recentContacts = contacts?.slice(0, 5).length || 0;

  const stats = [
    { 
      label: 'Total Projects', 
      value: totalProjects.toString(), 
      icon: FaProjectDiagram, 
      color: 'text-neon-purple' 
    },
    { 
      label: 'Total Views', 
      value: totalViews.toLocaleString(), 
      icon: FaEye, 
      color: 'text-neon-cyan' 
    },
    { 
      label: 'Total Stars', 
      value: totalStars.toLocaleString(), 
      icon: FaStar, 
      color: 'text-neon-green' 
    },
    { 
      label: 'Avg Rating', 
      value: averageRating.toFixed(1), 
      icon: FaUsers, 
      color: 'text-neon-pink' 
    },
  ];

  const projectStats = [
    { 
      label: 'Completed', 
      value: completedProjects.toString(), 
      icon: FaCheckCircle, 
      color: 'text-neon-green' 
    },
    { 
      label: 'Active', 
      value: activeProjects.toString(), 
      icon: FaProjectDiagram, 
      color: 'text-neon-cyan' 
    },
    { 
      label: 'In Progress', 
      value: inProgressProjects.toString(), 
      icon: FaClock, 
      color: 'text-neon-yellow' 
    },
    { 
      label: 'Featured', 
      value: featuredProjects.toString(), 
      icon: FaTrophy, 
      color: 'text-neon-purple' 
    },
  ];

  const quickActions = [
    { 
      title: 'Project Management', 
      href: '/admin/projects', 
      icon: FaProjectDiagram, 
      color: 'text-neon-cyan',
      bgColor: 'bg-gradient-to-br from-cyan-900/20 to-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      hoverColor: 'hover:border-cyan-400 hover:bg-cyan-900/30',
      description: 'Manage portfolio projects',
      count: totalProjects
    },
    { 
      title: 'Analytics', 
      href: '/admin/analytics', 
      icon: FaChartLine, 
      color: 'text-neon-purple',
      bgColor: 'bg-gradient-to-br from-purple-900/20 to-purple-500/10',
      borderColor: 'border-purple-500/30',
      hoverColor: 'hover:border-purple-400 hover:bg-purple-900/30',
      description: 'View detailed analytics',
      count: totalViews
    },
    { 
      title: 'Testimonials', 
      href: '/admin/testimonials', 
      icon: FaStar, 
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-green-900/20 to-green-500/10',
      borderColor: 'border-green-500/30',
      hoverColor: 'hover:border-green-400 hover:bg-green-900/30',
      description: 'Manage client feedback',
      count: totalTestimonials
    },
    { 
      title: 'Contact Management', 
      href: '/admin/contacts', 
      icon: FaEnvelope, 
      color: 'text-neon-pink',
      bgColor: 'bg-gradient-to-br from-pink-900/20 to-pink-500/10',
      borderColor: 'border-pink-500/30',
      hoverColor: 'hover:border-pink-400 hover:bg-pink-900/30',
      description: 'Handle incoming messages',
      count: totalContacts
    },
    { 
      title: 'Blog Management', 
      href: '/admin/blog', 
      icon: FaFileAlt, 
      color: 'text-neon-yellow',
      bgColor: 'bg-gradient-to-br from-yellow-900/20 to-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      hoverColor: 'hover:border-yellow-400 hover:bg-yellow-900/30',
      description: 'Manage blog content',
      count: 0
    },
    { 
      title: 'Profile', 
      href: '/admin/profile', 
      icon: FaUser, 
      color: 'text-neon-orange',
      bgColor: 'bg-gradient-to-br from-orange-900/20 to-orange-500/10',
      borderColor: 'border-orange-500/30',
      hoverColor: 'hover:border-orange-400 hover:bg-orange-900/30',
      description: 'Update admin profile',
      count: 1
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-foreground/60 font-orbitron">INITIALIZING SYSTEM...</p>
        </div>
      </div>
    );
  }

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
              ADMIN DASHBOARD
            </h1>
            <p className="text-foreground/60">Manage your cyberpunk portfolio</p>
          </div>
          <Button 
            onClick={logout}
            variant="outline"
            className="cyber-button border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <FaSignOutAlt className="mr-2" />
            LOGOUT
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cyber-border p-6 hover:glow-cyan transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold font-orbitron">{stat.value}</p>
                  </div>
                  <stat.icon className={`text-2xl ${stat.color}`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Project Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="font-orbitron text-2xl font-bold mb-6 text-gradient-cyber">PROJECT STATUS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                <Card className="cyber-border p-6 hover:glow-cyan transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold font-orbitron">{stat.value}</p>
                    </div>
                    <stat.icon className={`text-2xl ${stat.color}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="font-orbitron text-2xl font-bold mb-6 text-gradient-cyber">CONTENT OVERVIEW</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cyber-border p-6 hover:glow-cyan transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm">Testimonials</p>
                  <p className="text-2xl font-bold font-orbitron">{totalTestimonials}</p>
                  <p className="text-xs text-foreground/40">{approvedTestimonials} approved</p>
                </div>
                <FaStar className="text-2xl text-neon-green" />
              </div>
            </Card>

            <Card className="cyber-border p-6 hover:glow-cyan transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm">Contacts</p>
                  <p className="text-2xl font-bold font-orbitron">{totalContacts}</p>
                  <p className="text-xs text-foreground/40">{recentContacts} recent</p>
                </div>
                <FaEnvelope className="text-2xl text-neon-pink" />
              </div>
            </Card>

            <Card className="cyber-border p-6 hover:glow-cyan transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm">Total Ratings</p>
                  <p className="text-2xl font-bold font-orbitron">{totalRatings}</p>
                  <p className="text-xs text-foreground/40">Community feedback</p>
                </div>
                <FaUsers className="text-2xl text-neon-cyan" />
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="font-orbitron text-2xl font-bold mb-6 text-gradient-cyber">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
              >
                <Link to={action.href}>
                  <Card className={`
                    relative overflow-hidden p-6 
                    ${action.bgColor} ${action.borderColor} ${action.hoverColor}
                    border-2 transition-all duration-300 group
                    hover:scale-105 hover:shadow-2xl
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] before:group-hover:translate-x-[100%] before:transition-transform before:duration-700
                  `}>
                    {/* Background glow effect */}
                    <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300 ${action.bgColor.replace('bg-gradient-to-br', 'bg-gradient-to-r')}`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${action.bgColor} ${action.borderColor} border`}>
                            <action.icon className={`text-2xl ${action.color} group-hover:scale-110 transition-transform duration-300`} />
                          </div>
                          <div>
                            <h3 className="font-orbitron text-lg font-bold text-foreground group-hover:text-white transition-colors duration-300">
                              {action.title}
                            </h3>
                            <p className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${action.color} bg-black/20 border ${action.borderColor}`}>
                          {action.count}
                        </div>
                      </div>
                      
                      {/* Action indicator */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground/40 group-hover:text-foreground/60 transition-colors duration-300">
                          Click to access
                        </span>
                        <div className={`w-6 h-6 rounded-full ${action.bgColor} ${action.borderColor} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <div className={`w-2 h-2 rounded-full ${action.color.replace('text-', 'bg-')}`}></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;