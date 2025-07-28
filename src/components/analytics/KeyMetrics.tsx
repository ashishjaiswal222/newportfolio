import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface Stat {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

interface KeyMetricsProps {
  stats: Stat[];
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((stat, index) => (
      <motion.div
        key={stat.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="cyber-border p-6 hover:glow-cyan transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`text-2xl ${stat.color}`} />
            <div className={`flex items-center text-sm ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {stat.isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {stat.change}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-orbitron">{stat.value}</h3>
            <p className="text-foreground/60 text-sm">{stat.title}</p>
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
);

export default KeyMetrics; 