import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FaLock } from 'react-icons/fa';

interface BlogListHeroProps {
  isAuthenticated: boolean;
  onGetStarted: () => void;
}

const BlogListHero: React.FC<BlogListHeroProps> = ({ isAuthenticated, onGetStarted }) => {
  return (
    <section className="relative py-20 px-6 cyber-grid mt-20">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-gradient-cyber mb-4">
            TECH BLOG
          </h1>
          <div className="w-32 h-1 bg-gradient-cyber mx-auto mb-6 animate-neon-pulse"></div>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Deep dives into software engineering, cutting-edge technologies, and industry insights
          </p>
          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-foreground/70 mb-2">
                <FaLock className="inline mr-2" />
                Login to access all blog content and features
              </p>
              <Button
                onClick={onGetStarted}
                size="sm"
                className="cyber-button bg-gradient-cyber"
              >
                Get Started
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogListHero; 