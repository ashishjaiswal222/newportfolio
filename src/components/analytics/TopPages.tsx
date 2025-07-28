import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface TopPage {
  page: string;
  views: number;
  uniqueViews: number;
}

interface TopPagesProps {
  topPages: TopPage[];
}

const TopPages: React.FC<TopPagesProps> = ({ topPages }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.7 }}
  >
    <Card className="cyber-border p-6">
      <h3 className="font-orbitron text-xl font-bold text-primary mb-6">
        Top Pages
      </h3>
      <div className="space-y-4">
        {topPages.map((page, index) => (
          <div key={page.page} className="flex items-center justify-between p-3 rounded border border-foreground/20 hover:border-primary/50 transition-colors duration-300">
            <div>
              <div className="font-medium">{page.page}</div>
              <div className="text-sm text-foreground/60">{page.uniqueViews} unique views</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{page.views.toLocaleString()}</div>
              <div className="text-sm text-foreground/60">total views</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </motion.div>
);

export default TopPages; 