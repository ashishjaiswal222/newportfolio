import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FaEnvelope,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';

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

interface ContactAnalyticsProps {
  contacts: any[];
}

const ContactAnalytics: React.FC<ContactAnalyticsProps> = ({ contacts }) => {
  const totalContacts = contacts?.length || 0;
  const recentContacts = contacts?.filter(c => {
    const contactDate = new Date(c.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return contactDate > weekAgo;
  }).length || 0;
  
  const monthlyContacts = contacts?.filter(c => {
    const contactDate = new Date(c.createdAt);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return contactDate > monthAgo;
  }).length || 0;

  const responseRate = 98; // Mock data - in real app this would be calculated

  // Contact trends data
  const contactTrendsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Contacts',
      data: [12, 19, 15, 25, 22, 18, recentContacts],
      backgroundColor: 'rgba(0, 245, 255, 0.8)',
      borderColor: 'rgba(0, 245, 255, 1)',
      borderWidth: 2,
    }]
  };

  // Monthly contact trends
  const monthlyTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Contacts',
        data: [45, 52, 48, 67, 73, totalContacts],
        borderColor: '#00f5ff',
        backgroundColor: 'rgba(0, 245, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Response Rate',
        data: [95, 96, 97, 98, 98, responseRate],
        borderColor: '#00ff87',
        backgroundColor: 'rgba(0, 255, 135, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Contact source distribution
  const sourceData = {
    labels: ['Contact Form', 'Email', 'Social Media', 'Referral', 'Other'],
    datasets: [{
      data: [60, 25, 10, 3, 2],
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

  // Contact status distribution
  const statusData = {
    labels: ['Responded', 'Pending', 'Spam'],
    datasets: [{
      data: [
        Math.round((responseRate / 100) * totalContacts),
        Math.round(((100 - responseRate) / 100) * totalContacts),
        Math.round(totalContacts * 0.02) // 2% spam
      ],
      backgroundColor: [
        'rgba(0, 255, 135, 0.8)',
        'rgba(255, 165, 0, 0.8)',
        'rgba(255, 69, 0, 0.8)'
      ],
      borderColor: [
        'rgba(0, 255, 135, 1)',
        'rgba(255, 165, 0, 1)',
        'rgba(255, 69, 0, 1)'
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
      {/* Key Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="cyber-border p-6">
          <h2 className="font-orbitron text-xl font-bold text-primary mb-6 flex items-center">
            <FaEnvelope className="mr-2" />
            Contact Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-neon-cyan bg-opacity-20">
                <FaEnvelope className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">{totalContacts}</h3>
              <p className="text-sm text-foreground/60">Total Contacts</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-green-500 bg-opacity-20">
                <FaCalendarAlt className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-green-500 mb-1">{recentContacts}</h3>
              <p className="text-sm text-foreground/60">This Week</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-blue-500 bg-opacity-20">
                <FaUsers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-blue-500 mb-1">{monthlyContacts}</h3>
              <p className="text-sm text-foreground/60">This Month</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-purple-500 bg-opacity-20">
                <FaCheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-purple-500 mb-1">{responseRate}%</h3>
              <p className="text-sm text-foreground/60">Response Rate</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaChartLine className="mr-2" />
              Weekly Contact Trends
            </h3>
            <div className="h-64">
              <Bar data={contactTrendsData} options={chartOptions} />
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
              <FaCalendarAlt className="mr-2" />
              Monthly Trends
            </h3>
            <div className="h-64">
              <Line data={monthlyTrendsData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaUsers className="mr-2" />
              Contact Sources
            </h3>
            <div className="h-64">
              <Doughnut data={sourceData} options={doughnutOptions} />
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
              <FaCheckCircle className="mr-2" />
              Response Status
            </h3>
            <div className="h-64">
              <Doughnut data={statusData} options={doughnutOptions} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="cyber-border p-4">
          <h3 className="font-orbitron text-lg font-bold text-primary mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <FaArrowUp className="w-6 h-6 text-green-500" />
              <div>
                <div className="text-xl font-bold text-green-500">+15%</div>
                <div className="text-xs text-foreground/60">Growth Rate</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <FaClock className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-xl font-bold text-blue-500">2.3h</div>
                <div className="text-xs text-foreground/60">Avg Response Time</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <FaCheckCircle className="w-6 h-6 text-purple-500" />
              <div>
                <div className="text-xl font-bold text-purple-500">98%</div>
                <div className="text-xs text-foreground/60">Satisfaction Rate</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <FaExclamationTriangle className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-xl font-bold text-orange-500">2%</div>
                <div className="text-xs text-foreground/60">Spam Rate</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Contacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="cyber-border p-4">
          <h3 className="font-orbitron text-lg font-bold text-primary mb-4">Recent Contacts</h3>
          <div className="space-y-3">
            {contacts?.slice(0, 5).map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                <div>
                  <p className="font-semibold text-sm">{contact.name}</p>
                  <p className="text-xs text-foreground/60">{contact.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground/60">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {contact.subject}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContactAnalytics; 