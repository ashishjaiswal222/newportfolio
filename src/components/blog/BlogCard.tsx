import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FaCalendar, FaClock, FaEye, FaArrowRight, FaCode, FaRocket, FaBrain, 
  FaHeart, FaComment, FaShare, FaBookmark, FaTags, FaLock, FaThumbtack
} from 'react-icons/fa';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    categories: string[];
    tags: string[];
    isPinned?: boolean;
    views?: number;
    likes?: number;
    readTime?: string;
    createdAt: string;
  };
  index: number;
  isAuthenticated: boolean;
  onLike: (blogId: string) => void;
  onBookmark: (blogId: string) => void;
  onShare: (blog: { title: string; excerpt: string; id: string }) => void;
  onReadMore: (blogId: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  index,
  isAuthenticated,
  onLike,
  onBookmark,
  onShare,
  onReadMore
}) => {
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

  const CategoryIcon = getCategoryIcon(blog.categories[0] || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card
        className="cyber-border h-full bg-background/20 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={() => onReadMore(blog.id)}
      >
        {/* Featured Image Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <CategoryIcon className="text-6xl text-primary/30" />
          </div>
          {blog.isPinned && (
            <div className="absolute top-4 right-4">
              <Badge className="cyber-badge bg-gradient-cyber">
                <FaThumbtack className="mr-1 h-3 w-3" />
                Pinned
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6">
          <Badge className="mb-3 cyber-badge">
            <CategoryIcon className="mr-2 h-3 w-3" />
            {blog.categories[0]}
          </Badge>
          
          <h3 className="font-orbitron text-xl font-bold text-foreground mb-3 group-hover:text-gradient-cyber transition-all duration-300">
            {blog.title}
          </h3>
          
          <p className="text-foreground/70 mb-4 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
              <Badge key={tagIndex} variant="outline" className="text-xs cyber-badge-outline">
                <FaTags className="mr-1 h-2 w-2" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Blog Stats */}
          <div className="flex items-center justify-between text-sm text-foreground/60 mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <FaEye className="mr-1 h-3 w-3" />
                {blog.views.toLocaleString()}
              </span>
              <span className="flex items-center">
                <FaHeart className="mr-1 h-3 w-3" />
                {blog.likes}
              </span>
            </div>
            <span className="flex items-center">
              <FaClock className="mr-1 h-3 w-3" />
              {Math.ceil(blog.content.length / 1000)} min read
            </span>
          </div>

          {/* Premium Content Notice */}
          {!isAuthenticated && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
              <div className="flex items-center text-sm">
                <FaLock className="mr-2 text-primary" />
                <span className="text-foreground/80">Login required to read full article</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onLike(blog.id);
                }}
                className="h-8 px-2 text-foreground/60 hover:text-red-500"
              >
                <FaHeart className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBookmark(blog.id);
                }}
                className="h-8 px-2 text-foreground/60 hover:text-yellow-500"
              >
                <FaBookmark className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onShare(blog);
                }}
                className="h-8 px-2 text-foreground/60"
              >
                <FaShare className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 font-medium cyber-button-sm"
            >
              {isAuthenticated ? 'Read More' : 'Preview'}
              <FaArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BlogCard; 