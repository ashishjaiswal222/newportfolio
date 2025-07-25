import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaChartLine, FaProjectDiagram, FaEdit, FaUsers, FaEye, FaDownload, FaSignOutAlt, FaFileAlt, FaArrowRight, FaEnvelope, FaStar, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminLogin from '@/components/admin/AdminLogin';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const stats = [
    { label: 'Total Views', value: '12,345', icon: FaEye, color: 'text-neon-cyan' },
    { label: 'Projects', value: '8', icon: FaProjectDiagram, color: 'text-neon-purple' },
    { label: 'Downloads', value: '567', icon: FaDownload, color: 'text-neon-green' },
    { label: 'Visitors', value: '1,234', icon: FaUsers, color: 'text-neon-pink' },
  ];

  const quickActions = [
    { title: 'Project Management', href: '/admin/projects', icon: FaProjectDiagram, color: 'bg-neon-cyan' },
    { title: 'Content Management', href: '/admin/content', icon: FaEdit, color: 'bg-neon-purple' },
    { title: 'Blog Management', href: '/admin/blog', icon: FaFileAlt, color: 'bg-neon-green' },
    { title: 'Contact Management', href: '/admin/contacts', icon: FaEnvelope, color: 'bg-neon-pink' },
    { title: 'Testimonials', href: '/admin/testimonials', icon: FaStar, color: 'bg-yellow-500' },
    { title: 'Profile', href: '/admin/profile', icon: FaUser, color: 'bg-blue-500' },
    { title: 'Analytics', href: '/admin/analytics', icon: FaChartLine, color: 'bg-orange-500' },
  ];

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
            onClick={handleLogout}
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="font-orbitron text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="cyber-border p-6 hover:glow-cyan transition-all duration-300 group">
                  <Link to={action.href} className="block">
                    <div className="flex items-center justify-between mb-4">
                      <action.icon className="text-3xl text-neon-cyan group-hover:text-cyan-300" />
                      <FaArrowRight className="text-neon-cyan group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <h3 className="font-orbitron text-lg font-bold mb-2">{action.title}</h3>
                    <p className="text-foreground/60 text-sm">
                      {action.title === 'Project Management' && 'Manage projects, add new ones, update details'}
                      {action.title === 'Content Management' && 'Update skills, experience, and personal info'}
                      {action.title === 'Blog Management' && 'Create and manage blog posts, SEO optimization'}
                      {action.title === 'Contact Management' && 'Manage client inquiries and communications'}
                      {action.title === 'Testimonials' && 'Approve testimonials, manage reviews and ratings'}
                      {action.title === 'Profile' && 'Update profile information, CV, and media'}
                      {action.title === 'Analytics' && 'Track performance, visitors, and engagement metrics'}
                    </p>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back to Portfolio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link to="/">
            <Button className="cyber-button">
              Back to Portfolio
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;