import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const SeoPerformance: React.FC = () => (
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
);

export default SeoPerformance; 