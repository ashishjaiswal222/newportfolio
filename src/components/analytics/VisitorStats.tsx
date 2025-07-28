import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface VisitorStatsProps {
  realTimeVisitors: number;
}

const VisitorStats: React.FC<VisitorStatsProps> = ({ realTimeVisitors }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
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
);

export default VisitorStats; 