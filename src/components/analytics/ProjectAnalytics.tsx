import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { FaProjectDiagram } from 'react-icons/fa';

interface ProjectAnalyticsProps {
  projectsChartData: any;
  chartOptions: any;
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ projectsChartData, chartOptions }) => (
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
);

export default ProjectAnalytics; 