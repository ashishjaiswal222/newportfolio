import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaUsers } from 'react-icons/fa';

interface Source {
  source: string;
  visitors: number;
  percentage: number;
}

interface TrafficSourcesProps {
  sourceData: Source[];
}

const TrafficSources: React.FC<TrafficSourcesProps> = ({ sourceData }) => (
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
);

export default TrafficSources; 