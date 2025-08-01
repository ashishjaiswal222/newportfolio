import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useBlogs } from './useBlogs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { blogAPI } from '@/services/blog.api';

export const useBlogDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { getBlog, likeBlog, addComment } = useBlogs();

  // State management
  const [blog, setBlog] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Blogs', href: '/blogs' },
    { label: blog?.category || 'Blog', href: `/blogs?category=${blog?.category}` },
    { label: blog?.title || 'Post', current: true }
  ];

  const fetchBlog = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const blogData = await getBlog(id);
      setBlog(blogData);
      setLikeCount(blogData.likes || 0);
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [id, getBlog, toast]);

  // Fetch comments from backend
  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const res = await blogAPI.getComments(id);
      setComments(res.comments || []);
    } catch (error) {
      setComments([]);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    }
  }, [id, toast]);

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [fetchBlog, fetchComments]);

  const requireAuth = (action: string) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      toast({
        title: "Authentication required",
        description: `Please login to ${action}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    if (!requireAuth('like posts')) return;
    try {
      await likeBlog(blog.id);
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleBookmark = async () => {
    if (!requireAuth('bookmark posts')) return;
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Post bookmarked!",
      description: isBookmarked ? "Removed from bookmarks" : "Added to your bookmarks",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Blog link copied to clipboard",
      });
    }
  };

  // Add comment or reply
  const handleAddComment = async (content: string, parentId?: string) => {
    if (!requireAuth('comment')) return;
    if (!id) return;
    try {
      await blogAPI.createComment(id, { content, parentId });
      toast({
        title: parentId ? 'Reply posted!' : 'Comment posted!',
        description: parentId ? 'Your reply has been added.' : 'Your comment has been added.',
      });
      fetchComments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to post comment',
        variant: 'destructive',
      });
    }
  };

  return {
    blog,
    comments,
    newComment,
    loading,
    authModalOpen,
    relatedBlogs,
    isLiked,
    isBookmarked,
    likeCount,
    breadcrumbItems,
    setNewComment,
    setAuthModalOpen,
    handleLike,
    handleBookmark,
    handleShare,
    handleAddComment, // renamed for clarity
    requireAuth
  };
}; 