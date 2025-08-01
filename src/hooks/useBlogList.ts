import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBlogs } from './useBlogs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

const POSTS_PER_PAGE = 6;

export const useBlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { blogs, isLoading, likeBlog, bookmarkBlog, featuredBlogs } = useBlogs();
  
  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // State management
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Get unique categories - memoized to prevent re-renders
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(blogs.map(blog => blog.categories).flat()))];
  }, [blogs]);

  // Get blogs to display based on auth status - memoized
  const displayBlogs = useMemo(() => {
    return isAuthenticated ? blogs : featuredBlogs;
  }, [isAuthenticated, blogs, featuredBlogs]);

  // Breadcrumb items - memoized
  const breadcrumbItems = useMemo(() => {
    return [{ label: 'Blogs', current: true }];
  }, []);

  // Filter and sort blogs - optimized memoization
  const filteredAndSortedBlogs = useMemo(() => {
    const filtered = displayBlogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || blog.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory && blog.status === 'published';
    });

    // Sort blogs
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'liked':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, displayBlogs]);

  // Pagination - memoized
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedBlogs.length / POSTS_PER_PAGE);
  }, [filteredAndSortedBlogs.length]);

  const paginatedBlogs = useMemo(() => {
    return filteredAndSortedBlogs.slice(
      (currentPage - 1) * POSTS_PER_PAGE,
      currentPage * POSTS_PER_PAGE
    );
  }, [filteredAndSortedBlogs, currentPage]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, currentPage, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  // Memoized handlers to prevent re-renders
  const requireAuth = useCallback((action: string) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setAuthModalOpen(true);
      toast({
        title: "Authentication required",
        description: `Please login to ${action}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  }, [isAuthenticated, toast]);

  const handleLike = useCallback(async (blogId: string) => {
    if (!requireAuth('like posts')) return;
    try {
      await likeBlog(blogId);
    } catch (error) {
      // Error handled by hook
    }
  }, [requireAuth, likeBlog]);

  const handleBookmark = useCallback(async (blogId: string) => {
    if (!requireAuth('bookmark posts')) return;
    try {
      await bookmarkBlog(blogId);
    } catch (error) {
      // Error handled by hook
    }
  }, [requireAuth, bookmarkBlog]);

  const handleShare = useCallback((blog: { title: string; excerpt: string; id: string }) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: `/blog/${blog.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blog/${blog.id}`);
      toast({
        title: "Link copied!",
        description: "Blog link copied to clipboard",
      });
    }
  }, [toast]);

  const handleReadMore = useCallback((blogId: string) => {
    // Always navigate to blog detail page
    // Authentication will be handled on the blog detail page
    navigate(`/blog/${blogId}`);
  }, [navigate]);

  const handleGetStarted = useCallback(() => {
    setAuthMode('register');
    setAuthModalOpen(true);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
    setCurrentPage(1);
  }, []);

  return {
    // State
    searchTerm,
    selectedCategory,
    sortBy,
    currentPage,
    totalPages,
    paginatedBlogs,
    categories,
    isLoading,
    authModalOpen,
    authMode,
    breadcrumbItems,
    isAuthenticated,

    // Actions
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setCurrentPage,
    setAuthModalOpen,
    handleLike,
    handleBookmark,
    handleShare,
    handleReadMore,
    handleGetStarted,
    handleClearFilters
  };
}; 