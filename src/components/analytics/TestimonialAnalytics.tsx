import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FaComments,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaThumbsUp,
  FaChartLine,
  FaUsers
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

interface TestimonialAnalyticsProps {
  testimonials: any[];
}

const TestimonialAnalytics: React.FC<TestimonialAnalyticsProps> = ({ testimonials }) => {
  const totalTestimonials = testimonials?.length || 0;
  const approvedTestimonials = testimonials?.filter(t => t.status === 'approved').length || 0;
  const pendingTestimonials = totalTestimonials - approvedTestimonials;
  const approvalRate = totalTestimonials > 0 ? Math.round((approvedTestimonials / totalTestimonials) * 100) : 0;

  // Rating distribution data
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = testimonials?.filter(t => t.rating === rating).length || 0;
    const percentage = totalTestimonials > 0 ? (count / totalTestimonials) * 100 : 0;
    return { rating, count, percentage };
  });

  // Monthly testimonial trends
  const monthlyTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Testimonials',
        data: [12, 19, 15, 25, 22, totalTestimonials],
        borderColor: '#00f5ff',
        backgroundColor: 'rgba(0, 245, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Approved',
        data: [10, 16, 12, 20, 18, approvedTestimonials],
        borderColor: '#00ff87',
        backgroundColor: 'rgba(0, 255, 135, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Rating distribution chart
  const ratingChartData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [{
      data: ratingDistribution.map(r => r.count),
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',   // Gold
        'rgba(0, 245, 255, 0.8)',   // Cyan
        'rgba(0, 255, 135, 0.8)',   // Green
        'rgba(255, 165, 0, 0.8)',   // Orange
        'rgba(255, 69, 0, 0.8)'     // Red
      ],
      borderColor: [
        'rgba(255, 215, 0, 1)',
        'rgba(0, 245, 255, 1)',
        'rgba(0, 255, 135, 1)',
        'rgba(255, 165, 0, 1)',
        'rgba(255, 69, 0, 1)'
      ],
      borderWidth: 2,
    }]
  };

  // Status distribution
  const statusData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      data: [
        approvedTestimonials,
        pendingTestimonials,
        testimonials?.filter(t => t.status === 'rejected').length || 0
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
            <FaComments className="mr-2" />
            Testimonial Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-neon-cyan bg-opacity-20">
                <FaComments className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">{totalTestimonials}</h3>
              <p className="text-sm text-foreground/60">Total Testimonials</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-green-500 bg-opacity-20">
                <FaCheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-green-500 mb-1">{approvedTestimonials}</h3>
              <p className="text-sm text-foreground/60">Approved</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-yellow-500 bg-opacity-20">
                <FaClock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-500 mb-1">{pendingTestimonials}</h3>
              <p className="text-sm text-foreground/60">Pending</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-blue-500 bg-opacity-20">
                <FaThumbsUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-blue-500 mb-1">{approvalRate}%</h3>
              <p className="text-sm text-foreground/60">Approval Rate</p>
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
              Monthly Trends
            </h3>
            <div className="h-64">
              <Line data={monthlyTrendsData} options={chartOptions} />
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
              <FaStar className="mr-2" />
              Rating Distribution
            </h3>
            <div className="h-64">
              <Doughnut data={ratingChartData} options={doughnutOptions} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Status Distribution & Rating Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center">
              <FaUsers className="mr-2" />
              Status Distribution
            </h3>
            <div className="h-64">
              <Doughnut data={statusData} options={doughnutOptions} />
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="cyber-border p-4">
            <h3 className="font-orbitron text-lg font-bold text-primary mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <FaStar className="w-3 h-3 text-yellow-500" />
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm w-12 text-right">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="cyber-border p-4">
          <h3 className="font-orbitron text-lg font-bold text-primary mb-4">Recent Testimonials</h3>
          <div className="space-y-3">
            {testimonials?.slice(0, 5).map((testimonial) => (
              <div key={testimonial.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`w-3 h-3 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-500'}`} 
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-foreground/60">{testimonial.company}</p>
                  </div>
                </div>
                <Badge className={testimonial.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                  {testimonial.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TestimonialAnalytics; 