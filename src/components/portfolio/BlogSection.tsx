import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaCalendar, FaClock, FaEye, FaArrowRight, FaCode, FaRocket, FaBrain } from 'react-icons/fa';
import { blogAPI } from '@/services/blog.api';

const BlogSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogAPI.getBlogs({ limit: 6 });
        setBlogs(response.blogs || []);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        // Fallback to empty array if API fails
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const featuredBlogs = blogs.filter(blog => blog.isPinned).slice(0, 3);
  const displayedBlogs = showAll ? blogs : featuredBlogs;

  if (loading) {
    return (
      <section id="blog" className="py-20 px-6 relative cyber-grid">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/70">Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

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

  return (
    <section id="blog" className="py-20 px-6 relative cyber-grid">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-gradient-cyber mb-4">
            TECH INSIGHTS & TUTORIALS
          </h2>
          <div className="w-32 h-1 bg-gradient-cyber mx-auto mb-6 animate-neon-pulse"></div>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Sharing knowledge, insights, and cutting-edge developments in software engineering
          </p>
        </motion.div>

        {/* Featured/All Blogs Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showAll ? 'all' : 'featured'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {displayedBlogs.map((blog, index) => {
              const CategoryIcon = getCategoryIcon(blog.categories?.[0] || '');
              return (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="cyber-border h-full bg-background/30 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-300 overflow-hidden">
                    {/* Blog Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CategoryIcon className="text-6xl text-primary/30" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="cyber-button">
                          {blog.categories?.[0] || 'General'}
                        </Badge>
                      </div>
                      {blog.isPinned && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-accent text-accent-foreground">
                            Pinned
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {/* Meta Info */}
                      <div className="flex items-center text-sm text-foreground/60 mb-3 space-x-4">
                        <div className="flex items-center space-x-1">
                          <FaCalendar className="text-xs" />
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock className="text-xs" />
                          <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaEye className="text-xs" />
                          <span>{blog.views || 0}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-orbitron text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-foreground/70 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors duration-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Read More Button */}
                      <Button 
                        variant="ghost" 
                        className="cyber-button w-full group-hover:bg-primary/10 transition-colors duration-300"
                        onClick={() => window.location.href = `/blog/${blog.id}`}
                      >
                        <span>Read More</span>
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Show More/Less Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={() => window.location.href = '/blogs'}
            className="cyber-button bg-gradient-cyber text-primary-foreground hover:shadow-glow-cyan transition-all duration-300"
            size="lg"
          >
            Explore All Blogs
            <FaArrowRight className="ml-2 transition-transform duration-300" />
          </Button>
        </motion.div>

        {/* Blog Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="cyber-border p-8 bg-background/20 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">6+</div>
                <div className="text-foreground/60">Articles Published</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">7.2K+</div>
                <div className="text-foreground/60">Total Reads</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">24+</div>
                <div className="text-foreground/60">Topics Covered</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;