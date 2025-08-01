import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaCode, FaRocket, FaBrain } from 'react-icons/fa';

interface RelatedBlog {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: number;
}

interface RelatedBlogsProps {
  relatedBlogs: RelatedBlog[];
}

const RelatedBlogs: React.FC<RelatedBlogsProps> = ({ relatedBlogs }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Backend Development':
      case 'Database':
      case 'DevOps':
        return FaCode;
      case 'Artificial Intelligence':
        return FaBrain;
      case 'Frontend Development':
        return FaRocket;
      default:
        return FaCode;
    }
  };

  if (relatedBlogs.length === 0) return null;

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="font-orbitron text-2xl font-bold text-foreground mb-8 text-center">
            Related Posts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((relatedBlog, index) => {
              const CategoryIcon = getCategoryIcon(relatedBlog.category);
              return (
                <motion.div
                  key={relatedBlog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/blog/${relatedBlog.id}`}>
                    <Card className="cyber-border h-full bg-background/30 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-300 overflow-hidden group">
                      <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CategoryIcon className="text-4xl text-primary/30" />
                        </div>
                      </div>
                      <div className="p-4">
                        <Badge variant="secondary" className="mb-2">
                          {relatedBlog.category}
                        </Badge>
                        <h4 className="font-orbitron font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedBlog.title}
                        </h4>
                        <p className="text-foreground/70 text-sm line-clamp-2 mb-3">
                          {relatedBlog.excerpt}
                        </p>
                        <div className="flex items-center text-xs text-foreground/60 space-x-3">
                          <span>{relatedBlog.readTime}</span>
                          <span>{relatedBlog.views} views</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RelatedBlogs; 