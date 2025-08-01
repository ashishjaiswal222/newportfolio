import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FaArrowLeft, FaHeart, FaBookmark, FaShare } from 'react-icons/fa';

interface BlogNavigationProps {
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
}

const BlogNavigation: React.FC<BlogNavigationProps> = ({
  onLike,
  onBookmark,
  onShare,
  isLiked,
  isBookmarked
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
    >
      <div className="container mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="cyber-button"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Link to="/blogs" className="text-foreground/70 hover:text-foreground transition-colors">
              All Blogs
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={onLike}
              className={`cyber-button ${isLiked ? 'text-red-500' : ''}`}
            >
              <FaHeart className={isLiked ? 'fill-current' : ''} />
            </Button>
            <Button
              variant="ghost"
              onClick={onBookmark}
              className={`cyber-button ${isBookmarked ? 'text-yellow-500' : ''}`}
            >
              <FaBookmark className={isBookmarked ? 'fill-current' : ''} />
            </Button>
            <Button
              variant="ghost"
              onClick={onShare}
              className="cyber-button"
            >
              <FaShare />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogNavigation; 