import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  FaUsers, FaEye, FaDownload, FaGithub, FaLinkedin, FaProjectDiagram,
  FaArrowLeft, FaArrowUp, FaArrowDown, FaChartLine, FaCalendar
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
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [realTimeVisitors, setRealTimeVisitors] = useState(24);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeVisitors(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Analytics data
  const stats = [
    { 
      title: 'Total Visitors', 
      value: '12,847', 
      change: '+12.5%', 
      isPositive: true, 
      icon: FaUsers,
      color: 'text-neon-cyan'
    },
    { 
      title: 'Page Views', 
      value: '24,356', 
      change: '+8.2%', 
      isPositive: true, 
      icon: FaEye,
      color: 'text-neon-purple'
    },
    { 
      title: 'CV Downloads', 
      value: '1,267', 
      change: '+15.7%', 
      isPositive: true, 
      icon: FaDownload,
      color: 'text-neon-green'
    },
    { 
      title: 'Project Views', 
      value: '8,943', 
      change: '+5.4%', 
      isPositive: true, 
      icon: FaProjectDiagram,
      color: 'text-neon-pink'
    }
  ];

  const sourceData = [
    { source: 'LinkedIn', visitors: 4532, percentage: 35.2 },
    { source: 'GitHub', visitors: 3241, percentage: 25.2 },
    { source: 'Direct', visitors: 2154, percentage: 16.8 },
    { source: 'Google', visitors: 1876, percentage: 14.6 },
    { source: 'Other', visitors: 1044, percentage: 8.1 }
  ];

  const topPages = [
    { page: 'Home', views: 8943, uniqueViews: 6234 },
    { page: 'Projects', views: 5678, uniqueViews: 4123 },
    { page: 'About', views: 3456, uniqueViews: 2567 },
    { page: 'Contact', views: 2345, uniqueViews: 1876 },
    { page: 'Skills', views: 1234, uniqueViews: 987 }
  ];

  // Chart data
  const visitorChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Visitors',
        data: [1245, 1567, 1398, 1876, 2134, 1789, 1654],
        borderColor: '#00f5ff',
        backgroundColor: 'rgba(0, 245, 255, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00f5ff',
        pointBorderColor: '#00f5ff',
      },
      {
        label: 'Page Views',
        data: [2456, 2987, 2678, 3456, 3987, 3234, 2987],
        borderColor: '#ff00ff',
        backgroundColor: 'rgba(255, 0, 255, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ff00ff',
        pointBorderColor: '#ff00ff',
      }
    ]
  };

  const deviceChartData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [65, 28, 7],
        backgroundColor: [
          '#00f5ff',
          '#ff00ff',
          '#00ff87'
        ],
        borderColor: [
          '#00f5ff',
          '#ff00ff',
          '#00ff87'
        ],
        borderWidth: 2,
      }
    ]
  };

  const projectsChartData = {
    labels: ['IoT Plant Monitor', 'AirVibe', 'Portfolio', 'E-Commerce', 'Other'],
    datasets: [
      {
        label: 'Project Views',
        data: [2456, 1987, 1543, 1234, 876],
        backgroundColor: [
          'rgba(0, 245, 255, 0.8)',
          'rgba(255, 0, 255, 0.8)', 
          'rgba(0, 255, 135, 0.8)',
          'rgba(255, 105, 180, 0.8)',
          'rgba(138, 43, 226, 0.8)'
        ],
        borderColor: [
          '#00f5ff',
          '#ff00ff',
          '#00ff87',
          '#ff69b4',
          '#8a2be2'
        ],
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'hsl(var(--foreground))',
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'hsl(var(--foreground) / 0.7)',
        },
        grid: {
          color: 'hsl(var(--foreground) / 0.1)',
        }
      },
      y: {
        ticks: {
          color: 'hsl(var(--foreground) / 0.7)',
        },
        grid: {
          color: 'hsl(var(--foreground) / 0.1)',
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
          color: 'hsl(var(--foreground))',
          padding: 20,
        }
      }
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
              ANALYTICS DASHBOARD
            </h1>
            <p className="text-foreground/60">Track your portfolio performance and visitor insights</p>
          </div>
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded cyber-border bg-background text-foreground"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <Link to="/admin">
              <Button variant="outline" className="cyber-button">
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Real-time Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="cyber-border p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-orbitron text-lg font-bold text-primary mb-2">Real-time Visitors</h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gradient-cyber">{realTimeVisitors}</span>
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm">Live</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground/60">Average Session: 4m 32s</p>
                <p className="text-sm text-foreground/60">Bounce Rate: 23.4%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cyber-border p-6 hover:glow-cyan transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`text-2xl ${stat.color}`} />
                  <div className={`flex items-center text-sm ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-orbitron">{stat.value}</h3>
                  <p className="text-foreground/60 text-sm">{stat.title}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Visitor Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="cyber-border p-6">
              <h3 className="font-orbitron text-xl font-bold text-primary mb-6 flex items-center">
                <FaChartLine className="mr-2" />
                Visitor Trends
              </h3>
              <div className="h-64">
                <Line data={visitorChartData} options={chartOptions} />
              </div>
            </Card>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="cyber-border p-6">
              <h3 className="font-orbitron text-xl font-bold text-primary mb-6">
                Device Breakdown
              </h3>
              <div className="h-64">
                <Doughnut data={deviceChartData} options={doughnutOptions} />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Project Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="cyber-border p-6">
            <h3 className="font-orbitron text-xl font-bold text-primary mb-6 flex items-center">
              <FaProjectDiagram className="mr-2" />
              Project Performance
            </h3>
            <div className="h-64">
              <Bar data={projectsChartData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>

        {/* Traffic Sources & Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="cyber-border p-6">
              <h3 className="font-orbitron text-xl font-bold text-primary mb-6">
                Traffic Sources
              </h3>
              <div className="space-y-4">
                {sourceData.map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {source.source === 'LinkedIn' && <FaLinkedin className="text-blue-400" />}
                      {source.source === 'GitHub' && <FaGithub className="text-foreground" />}
                      {source.source === 'Direct' && <FaUsers className="text-green-400" />}
                      {source.source === 'Google' && <div className="w-4 h-4 bg-blue-500 rounded-full" />}
                      {source.source === 'Other' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{source.visitors.toLocaleString()}</div>
                      <div className="text-sm text-foreground/60">{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="cyber-border p-6">
              <h3 className="font-orbitron text-xl font-bold text-primary mb-6">
                Top Pages
              </h3>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-3 rounded border border-foreground/20 hover:border-primary/50 transition-colors duration-300">
                    <div>
                      <div className="font-medium">{page.page}</div>
                      <div className="text-sm text-foreground/60">{page.uniqueViews} unique views</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{page.views.toLocaleString()}</div>
                      <div className="text-sm text-foreground/60">total views</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* SEO & Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="cyber-border p-6">
            <h3 className="font-orbitron text-xl font-bold text-primary mb-6">
              SEO & Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">95</div>
                <div className="text-sm text-foreground/60">Performance Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">98</div>
                <div className="text-sm text-foreground/60">SEO Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">2.3s</div>
                <div className="text-sm text-foreground/60">Load Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">94</div>
                <div className="text-sm text-foreground/60">Accessibility</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;