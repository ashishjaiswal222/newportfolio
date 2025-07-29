import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FaGlobe,
  FaDesktop,
  FaMobile,
  FaTablet,
  FaChartLine,
  FaUsers,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaShare,
  FaLink
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
  ArcElement,
  DoughnutController,
  RadialLinearScale,
  Filler
);

interface TrafficAnalyticsProps {
  realTimeVisitors: number;
}

const TrafficAnalytics: React.FC<TrafficAnalyticsProps> = ({ realTimeVisitors }) => {
  // Traffic sources data
  const trafficData = {
    labels: ['Direct', 'Google', 'Social Media', 'Referral', 'Other'],
    datasets: [{
      label: 'Traffic Sources',
      data: [40, 35, 15, 8, 2],
      backgroundColor: [
        'rgba(0, 245, 255, 0.8)',
        'rgba(255, 0, 255, 0.8)',
        'rgba(0, 255, 135, 0.8)',
        'rgba(255, 165, 0, 0.8)',
        'rgba(128, 128, 128, 0.8)'
      ],
      borderColor: [
        'rgba(0, 245, 255, 1)',
        'rgba(255, 0, 255, 1)',
        'rgba(0, 255, 135, 1)',
        'rgba(255, 165, 0, 1)',
        'rgba(128, 128, 128, 1)'
      ],
      borderWidth: 2,
    }]
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

  // Geographic distribution
  const geoData = {
    labels: ['United States', 'India', 'United Kingdom', 'Canada', 'Germany'],
    datasets: [{
      label: 'Visitors by Country',
      data: [45, 25, 15, 10, 5],
      backgroundColor: [
        'rgba(0, 245, 255, 0.8)',
        'rgba(255, 0, 255, 0.8)',
        'rgba(0, 255, 135, 0.8)',
        'rgba(255, 165, 0, 0.8)',
        'rgba(128, 128, 128, 0.8)'
      ],
      borderColor: [
        'rgba(0, 245, 255, 1)',
        'rgba(255, 0, 255, 1)',
        'rgba(0, 255, 135, 1)',
        'rgba(255, 165, 0, 1)',
        'rgba(128, 128, 128, 1)'
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
      {/* Key Traffic Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="cyber-border p-6">
          <h2 className="font-orbitron text-xl font-bold text-primary mb-6 flex items-center">
            <FaGlobe className="mr-2" />
            Traffic Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-neon-cyan bg-opacity-20">
                <FaUsers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">{realTimeVisitors}</h3>
              <p className="text-sm text-foreground/60">Live Visitors</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-green-500 bg-opacity-20">
                <FaEye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-green-500 mb-1">12,456</h3>
              <p className="text-sm text-foreground/60">Total Views</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-blue-500 bg-opacity-20">
                <FaSearch className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-blue-500 mb-1">35%</h3>
              <p className="text-sm text-foreground/60">Organic Traffic</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-purple-500 bg-opacity-20">
                <FaShare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-purple-500 mb-1">+12%</h3>
              <p className="text-sm text-foreground/60">Growth Rate</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaGlobe className="mr-2" />
              Traffic Sources
            </h3>
            <div className="h-64">
              <Doughnut data={trafficData} options={doughnutOptions} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Device & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaDesktop className="mr-2" />
              Device Analytics
            </h3>
            <div className="h-64">
              <Doughnut data={deviceData} options={doughnutOptions} />
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaGlobe className="mr-2" />
              Geographic Distribution
            </h3>
            <div className="h-64">
              <Bar data={geoData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Device Breakdown Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="cyber-border p-4">
          <h3 className="font-orbitron text-lg font-bold text-primary mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <FaDesktop className="w-5 h-5 text-blue-500" />
                <span>Desktop</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-blue-500">65%</span>
                <p className="text-xs text-foreground/60">8,096 visitors</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3">
                <FaMobile className="w-5 h-5 text-purple-500" />
                <span>Mobile</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-purple-500">30%</span>
                <p className="text-xs text-foreground/60">3,737 visitors</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <FaTablet className="w-5 h-5 text-green-500" />
                <span>Tablet</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-green-500">5%</span>
                <p className="text-xs text-foreground/60">623 visitors</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Traffic Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="cyber-border p-4">
          <h3 className="font-orbitron text-lg font-bold text-primary mb-4">Traffic Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <FaArrowUp className="w-6 h-6 text-green-500" />
              <div>
                <div className="text-xl font-bold text-green-500">+15%</div>
                <div className="text-xs text-foreground/60">Organic Growth</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <FaLink className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-xl font-bold text-blue-500">40%</div>
                <div className="text-xs text-foreground/60">Direct Traffic</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <FaShare className="w-6 h-6 text-purple-500" />
              <div>
                <div className="text-xl font-bold text-purple-500">15%</div>
                <div className="text-xs text-foreground/60">Social Traffic</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <FaArrowDown className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-xl font-bold text-orange-500">-3%</div>
                <div className="text-xs text-foreground/60">Bounce Rate</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TrafficAnalytics; 