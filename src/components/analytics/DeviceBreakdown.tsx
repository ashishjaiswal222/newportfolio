import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';

interface DeviceBreakdownProps {
  deviceChartData: any;
  doughnutOptions: any;
}

const DeviceBreakdown: React.FC<DeviceBreakdownProps> = ({ deviceChartData, doughnutOptions }) => (
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
);

export default DeviceBreakdown; 