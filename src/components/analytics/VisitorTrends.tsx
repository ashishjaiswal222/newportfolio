import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { FaChartLine } from 'react-icons/fa';

interface VisitorTrendsProps {
  visitorChartData: any;
  chartOptions: any;
}

const VisitorTrends: React.FC<VisitorTrendsProps> = ({ visitorChartData, chartOptions }) => (
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
);

export default VisitorTrends; 