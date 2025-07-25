import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaCalendar, FaClock, FaEye, FaArrowRight, FaCode, FaRocket, FaBrain } from 'react-icons/fa';

const BlogSection = () => {
  const [showAll, setShowAll] = useState(false);

  const blogs = [
    {
      id: 1,
      title: "Building Scalable Microservices with Node.js and Docker",
      excerpt: "Learn how to architect and deploy microservices that can handle millions of requests with minimal latency.",
      content: "Coming soon - Deep dive into microservices architecture...",
      author: "Ashish Jaiswal",
      date: "2024-12-15",
      readTime: "8 min read",
      views: 1247,
      tags: ["Node.js", "Docker", "Microservices", "Architecture"],
      featured: true,
      image: "/api/placeholder/400/250",
      category: "Backend Development"
    },
    {
      id: 2,
      title: "AI-Powered Code Generation: The Future of Software Development",
      excerpt: "Exploring how AI tools like GitHub Copilot and ChatGPT are revolutionizing the way we write code.",
      content: "Coming soon - AI in software development...",
      author: "Ashish Jaiswal",
      date: "2024-12-10",
      readTime: "6 min read",
      views: 892,
      tags: ["AI", "Machine Learning", "Development Tools", "Future Tech"],
      featured: true,
      image: "/api/placeholder/400/250",
      category: "Artificial Intelligence"
    },
    {
      id: 3,
      title: "React Performance Optimization: From 0 to Production",
      excerpt: "Best practices and advanced techniques to make your React applications lightning fast.",
      content: "Coming soon - React optimization techniques...",
      author: "Ashish Jaiswal",
      date: "2024-12-05",
      readTime: "10 min read",
      views: 2156,
      tags: ["React", "Performance", "Optimization", "Frontend"],
      featured: true,
      image: "/api/placeholder/400/250",
      category: "Frontend Development"
    },
    {
      id: 4,
      title: "Database Design Patterns for Modern Applications",
      excerpt: "Understanding when to use SQL vs NoSQL and optimizing database performance.",
      content: "Coming soon - Database design patterns...",
      author: "Ashish Jaiswal",
      date: "2024-11-28",
      readTime: "12 min read",
      views: 743,
      tags: ["Database", "PostgreSQL", "MongoDB", "Design Patterns"],
      featured: false,
      image: "/api/placeholder/400/250",
      category: "Database"
    },
    {
      id: 5,
      title: "DevOps Best Practices: CI/CD with GitHub Actions",
      excerpt: "Setting up automated deployments and testing pipelines for maximum efficiency.",
      content: "Coming soon - DevOps and CI/CD...",
      author: "Ashish Jaiswal",
      date: "2024-11-20",
      readTime: "7 min read",
      views: 567,
      tags: ["DevOps", "CI/CD", "GitHub Actions", "Automation"],
      featured: false,
      image: "/api/placeholder/400/250",
      category: "DevOps"
    },
    {
      id: 6,
      title: "The Art of Clean Code: Writing Maintainable Software",
      excerpt: "Principles and practices that every developer should follow for better code quality.",
      content: "Coming soon - Clean code principles...",
      author: "Ashish Jaiswal",
      date: "2024-11-15",
      readTime: "9 min read",
      views: 1089,
      tags: ["Clean Code", "Best Practices", "Software Engineering"],
      featured: false,
      image: "/api/placeholder/400/250",
      category: "Software Engineering"
    }
  ];

  const featuredBlogs = blogs.filter(blog => blog.featured).slice(0, 3);
  const displayedBlogs = showAll ? blogs : featuredBlogs;

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
              const CategoryIcon = getCategoryIcon(blog.category);
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
                          {blog.category}
                        </Badge>
                      </div>
                      {blog.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-accent text-accent-foreground">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {/* Meta Info */}
                      <div className="flex items-center text-sm text-foreground/60 mb-3 space-x-4">
                        <div className="flex items-center space-x-1">
                          <FaCalendar className="text-xs" />
                          <span>{new Date(blog.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock className="text-xs" />
                          <span>{blog.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaEye className="text-xs" />
                          <span>{blog.views}</span>
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