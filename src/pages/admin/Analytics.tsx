import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VisitorStats from '@/components/analytics/VisitorStats';
import TestimonialAnalytics from '@/components/analytics/TestimonialAnalytics';
import KeyMetrics from '@/components/analytics/KeyMetrics';
import VisitorTrends from '@/components/analytics/VisitorTrends';
import DeviceBreakdown from '@/components/analytics/DeviceBreakdown';
import ProjectAnalytics from '@/components/analytics/ProjectAnalytics';
import TrafficSources from '@/components/analytics/TrafficSources';
import TopPages from '@/components/analytics/TopPages';
import SeoPerformance from '@/components/analytics/SeoPerformance';
import { useTestimonials } from '@/hooks/useTestimonials';
import {
  FaUsers, FaEye, FaDownload, FaProjectDiagram
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
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeVisitors(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { testimonials, isLoading: testimonialsLoading } = useTestimonials();

  // Key metrics data
  const stats = [
    { title: 'Total Visitors', value: '12,847', change: '+12.5%', isPositive: true, icon: FaUsers, color: 'text-neon-cyan' },
    { title: 'Page Views', value: '24,356', change: '+8.2%', isPositive: true, icon: FaEye, color: 'text-neon-purple' },
    { title: 'CV Downloads', value: '1,267', change: '+15.7%', isPositive: true, icon: FaDownload, color: 'text-neon-green' },
    { title: 'Project Views', value: '8,943', change: '+5.4%', isPositive: true, icon: FaProjectDiagram, color: 'text-neon-pink' },
  ];

  // Chart and analytics data
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
        position: 'bottom',
        labels: {
          color: 'hsl(var(--foreground))',
          padding: 20,
        }
      }
    }
  };
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
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Modularized Analytics Sections */}
        <VisitorStats realTimeVisitors={realTimeVisitors} />
        <TestimonialAnalytics testimonials={testimonials} isLoading={testimonialsLoading} />
        <KeyMetrics stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <VisitorTrends visitorChartData={visitorChartData} chartOptions={chartOptions} />
          <DeviceBreakdown deviceChartData={deviceChartData} doughnutOptions={doughnutOptions} />
        </div>
        <ProjectAnalytics projectsChartData={projectsChartData} chartOptions={chartOptions} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TrafficSources sourceData={sourceData} />
          <TopPages topPages={topPages} />
        </div>
        <SeoPerformance />
      </div>
    </div>
  );
};

export default Analytics;